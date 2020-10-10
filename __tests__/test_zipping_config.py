import json
import os.path
import time
from pathlib import Path

import pytest
import selenium.webdriver

from _utils import AssertionObject
from _utils import TriggerTypes
from _utils import loaded_data
import test_data

ROOT_TEST_PATH = Path(os.path.realpath(__file__)).parent
TEST_CASE_DIR = ROOT_TEST_PATH / "loaded_pages_snapshots"


@pytest.mark.parametrize(
    "test_name,url",
    (
        *[(key, value) for key, value in test_data.basic_test_cases.items()],
        *[(f"example_{i:03}", page) for i, page in enumerate(test_data.public_examples)],
    ),
)
@pytest.mark.parametrize(
    "browser_fixture", ("browser", "eager_generation_browser", "single_source_methods__browser",)
)
def test__url__load_compressed_page__loaded_data_matches_uncrompressed_page(
    test_name,
    browser_fixture,
    base_url,
    url,
    parser,
    snapshot,
    request,
    browser,
    compression_enabled__browser,
):
    request.getfixturevalue(browser_fixture)
    browser.get(base_url.rstrip("/") + "/" + url.lstrip("/"))
    time.sleep(0.5)
    raw_data = loaded_data(browser, parser)
    browser.execute_script("markDirty();")
    chbox = browser.find_element_by_id("chkBox_CompressData")
    if not chbox.is_selected():
        try:
            chbox.click()
        except:
            browser.execute_script("$('#chkBox_CompressData').click()")
    
    if browser_fixture not in ["eager_generation_browser"]:
        # eager gen does not need to submit
        submit_btn = browser.find_element_by_id("btnSubmit")
        try:
            submit_btn.click()
        except:
            browser.execute_script("$('#hotkeyForm').submit()")
    time.sleep(2)
    
    url = browser.current_url
    compressed_data = loaded_data(browser, parser)
    
    assert compressed_data == raw_data
    assert all([
        'compressed=' in url,
        'version=' in url,
    ]) or url.endswith('/')
