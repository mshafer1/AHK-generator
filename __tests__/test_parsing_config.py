import pytest

from _utils import AssertionObject
from _utils import TriggerTypes

basic_url = "/?length=1&comment0=test+comment&func0=KEY&skey0%5B%5D=CTRL&skey0%5B%5D=ALT&skeyValue0=i&Window0=ahk_exe+chrome.exe&Program0=chrome.exe&option0=ActivateOrOpen"
basic_hotstring_url = "/?indexes=0&comment0=&func0=STRING&skeyValue0=btw&input0=by+the+way&option0=Replace"


@pytest.mark.parametrize(
    "url,expected_values", (
        (basic_hotstring_url, AssertionObject(expected_trigger_types=[TriggerTypes.STRING], expected_hotkey_ids=["0"]),),
        ("/", AssertionObject(expected_trigger_types=[TriggerTypes.KEY], expected_hotkey_ids=["0"]),),
        (basic_url, AssertionObject(expected_trigger_types=[TriggerTypes.KEY], expected_hotkey_ids=["0"]),),
    )
)
def test__url_and_expected_trigger_types__load_page__assert_has_expected_trigger_types(
    expected_values, url, browser, parser, base_url, subtests
):
    browser.get(base_url + url)

    expected_values.check(browser, parser, subtests)
