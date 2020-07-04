from selenium.webdriver.common.by import By


def test__empty_query_string__load_page__assert_has_row_zero(root_page, parser):
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


def test__empty_query_string__load_page__assert_skip_to_code_not_visible(root_page, parser):
    skip_to_script_region = root_page.find_element_by_xpath(".//div[@id='skipToScript']")

    assert (
        not skip_to_script_region.is_displayed()
    ), "Skip to script buttons should not be visible on root page"
