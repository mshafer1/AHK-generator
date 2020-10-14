import time

import pytest
from selenium.webdriver.common.by import By

import test_data


@pytest.mark.parametrize(
    "url_to_load",
    (
        *[value for key, value in test_data.basic_test_cases.items()],
        *[page for i, page in enumerate(test_data.public_examples)],
    ),
)
@pytest.mark.parametrize(
    "browser_feature_toggles",
    (
        # "browser",
        # "eager_generation_browser",
        "single_source_methods__browser",
    ),
)
@pytest.mark.parametrize(
    "browser_size", ("small_browser", "medium_browser", "large_browser",),
)
def test__url_to_load__page_loaded__no_function_div_is_cut_off(
    browser_feature_toggles,
    browser_size,
    url_to_load,
    parser,
    base_url,
    snapshot,
    request,
    browser,
    subtests,
):
    request.getfixturevalue(browser_feature_toggles)
    request.getfixturevalue(browser_size)
    time.sleep(0.25)

    browser.get(base_url.rstrip("/") + "/" + url_to_load.lstrip("/"))

    elem = browser.find_element(By.CSS_SELECTOR, "div.w3-col.l11.w3-dropdown-click")
    parent = elem
    while parent and not "l6" in parent.get_attribute("class"):
        parent = parent.find_element(By.XPATH, "..")
    parent_width = parent.size["width"]
    function_spans = [
        span
        for span in browser.find_elements(By.CSS_SELECTOR, "span")
        if span.get_attribute("id").startswith("function")
    ]
    for span in function_spans:
        with subtests.test(element=span.get_attribute("id")):
            width = span.size["width"]
            assert width <= parent_width
