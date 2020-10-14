import json
import os
import time
from pathlib import Path

import pytest

from _utils import loaded_data
import test_data

ROOT_TEST_PATH = Path(os.path.realpath(__file__)).parent

def __get_script_region(browser, parser):
    page = browser.page_source
    parsed = parser(page)

    script_region = parsed.find("div", {"id": "scriptZone"})
    return str(script_region)

@pytest.mark.parametrize(
    "test_name,url",
    (
        # *[(key, value) for key, value in test_data.basic_test_cases.items()],
        *[(f"example_{i:03}", page) for i, page in enumerate(test_data.public_examples)],
    ),
)
@pytest.mark.parametrize("test_case_dir", [ROOT_TEST_PATH / "eager_gen_delete_snapshots"])
def test__url__deleting_last__yields_expected_data(
    test_name,
    url,
    base_url,
    parser,
    # request,
    test_case_dir,
    browser,
    eager_generation_browser,
    snapshot,
):
    browser.get(base_url.rstrip("/") + "/" + url.lstrip("/"))
    time.sleep(0.5)

    browser.execute_script("$('button i.fa-times-circle:last').click()")
    time.sleep(0.5)

    data = loaded_data(browser, parser)
    test_dir = test_case_dir / test_name
    test_dir.mkdir(parents=True, exist_ok=True)
    snapshot.snapshot_dir = test_dir
    snapshot.assert_match(json.dumps(data, indent=4), "expected_test_data.json")


@pytest.mark.parametrize(
    "test_name,url", (*[(key, value) for key, value in test_data.basic_test_cases.items()],),
)
def test__single_row_url__select_method__yields_desired_data_and_updates_script(
    test_name, url, base_url, parser, browser, eager_generation_browser
):
    browser.get(base_url.rstrip("/") + "/" + url.lstrip("/"))
    time.sleep(0.5)
    old_script = __get_script_region(browser, parser)

    browser.execute_script("select('OpenConfig', 0);")
    time.sleep(0.5)

    data = loaded_data(browser, parser)
    new_script = __get_script_region(browser, parser)
    assert data["0"]["action"] == {"function": 'OpenConfig()', "args": {}}
    assert old_script != new_script


# triggers sort handler: 

@pytest.mark.parametrize(
    "test_name,url", (*[(key, value) for key, value in test_data.basic_test_cases.items() if value is not '/'],),
)
def test__single_row_url_marked_dirty__sort_update__marks_clean(
    test_name, url, base_url, parser, browser, eager_generation_browser
):
    browser.get(base_url.rstrip("/") + "/" + url.lstrip("/"))
    time.sleep(0.5)
    browser.execute_script("markDirty()")
    assert 'grayout' in browser.find_elements_by_id('scriptZone')[0].get_attribute('class').split()

    browser.execute_script("$('#hotkeyRegion').sortable('option', 'update')();")
    time.sleep(0.5)

    assert 'grayout' not in browser.find_elements_by_id('scriptZone')[0].get_attribute('class').split()