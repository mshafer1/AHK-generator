import time

import pytest
from selenium.webdriver.common.by import By

import test_data


def test__empty_query_string__load_page__assert_has_row_zero(root_page, parser):
    time.sleep(0.25)  # allow a little time for JS to add the shortcut
    parsed = parser(root_page.page_source)

    hotkey_row = parsed.body.find("div", attrs={"id": "shortcut0"})
    assert hotkey_row is not None, (
        "could not find div with id (shortcut0) in:\n" + root_page.page_source
    )


def test__empty_query_string__load_page__has_add_new_row(root_page, parser):
    parsed = parser(root_page.page_source)

    add_new_row_button = parsed.body.find("button", attrs={"id": "btnAdd"})
    assert add_new_row_button is not None, (
        "could not find add new row button in:\n" + root_page.page_source
    )


@pytest.mark.parametrize(
    "query_string,expected_visibility", (("", False), (test_data.basic_url, True))
)
def test__query_string__load_page__assert_skip_to_code_visibility(
    query_string, expected_visibility, base_url, browser
):
    browser.get(base_url + query_string)
    time.sleep(.5)

    skip_to_script_region = browser.find_element_by_xpath(".//div[@id='skipToScript']")
    assert skip_to_script_region.is_displayed() == expected_visibility
