import json
import os.path
import time
from pathlib import Path

import pytest

from _utils import AssertionObject
from _utils import TriggerTypes
from _utils import loaded_data
import test_data

ROOT_TEST_PATH = Path(os.path.realpath(__file__)).parent
TEST_CASE_DIR = ROOT_TEST_PATH / "loaded_pages_snapshots"


@pytest.mark.parametrize(
    "url,expected_values",
    (
        (
            test_data.basic_hotstring_url,
            AssertionObject(
                expected_trigger_types=[TriggerTypes.STRING], expected_hotkey_ids=["0"]
            ),
        ),
        (
            "/",
            AssertionObject(expected_trigger_types=[TriggerTypes.KEY], expected_hotkey_ids=["0"]),
        ),
        (
            test_data.basic_url,
            AssertionObject(expected_trigger_types=[TriggerTypes.KEY], expected_hotkey_ids=["0"]),
        ),
    ),
)
def test__url_and_expected_trigger_types__load_page__assert_has_expected_trigger_types(
    expected_values, url, browser, parser, base_url, subtests
):
    browser.get(base_url + url)

    expected_values.check(browser, parser, subtests)


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
def test__url__load_page__loaded_data_matches_expected(
    test_name, browser_fixture, url, parser, base_url, snapshot, request, browser
):
    request.getfixturevalue(browser_fixture)
    browser.get(base_url.rstrip("/") + "/" + url.lstrip("/"))
    time.sleep(0.5)

    data = loaded_data(browser, parser)

    snapshot.snapshot_dir = TEST_CASE_DIR / test_name
    snapshot.assert_match(json.dumps(data, indent=4), "expected_test_data.json")
