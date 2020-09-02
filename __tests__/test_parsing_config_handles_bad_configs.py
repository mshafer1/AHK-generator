import time

import pytest

import test_data

def isAlertPresent(driver):
    try:
        driver.switch_to.alert.dismiss()
        return True
    except Exception:
        return False

@pytest.mark.parametrize(
    "url", test_data.bad_urls, ids=test_data.bad_urls
)
@pytest.mark.parametrize(
    "browser_fixture", ("browser", "eager_compile_browser", "single_source_methods__browser",)
)
def test__url_with_missing_required_values__load_page__shows_error_message(
    base_url, url, browser_fixture, request, browser
):
    request.getfixturevalue(browser_fixture)
    browser.get(base_url.rstrip("/") + "/" + url.lstrip("/"))
    time.sleep(0.5)

    assert isAlertPresent(browser)
