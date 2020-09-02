import time

import pytest
from bs4 import BeautifulSoup
from selenium import webdriver
from selenium.webdriver.chrome.options import Options


def pytest_addoption(parser):
    parser.addoption(
        "--driver-path",
        dest="driver_path",
        action="store",
        help="Path to the chrome webdriver to use",
        required=True,
    )
    parser.addoption(
        "--use-headless",
        dest="use_headless",
        action="store_true",
        help="Use browser in headless mode",
        required=False,
        default=False,
    )
    parser.addoption(
        "--site-path",
        dest="site_path",
        help="Base URL to load for tests",
        required=False,
        default="http://localhost:4000",
    )


def pytest_generate_tests(metafunc):
    # This is called for every test. Only get/set command line arguments
    # if the argument is specified in the list of test "fixturenames".
    driver_path = metafunc.config.option.driver_path
    use_headless = metafunc.config.option.use_headless
    site_path = metafunc.config.option.site_path

    if driver_path is None:
        raise Exception("Must provide --driver_path")

    if "driver_path" in metafunc.fixturenames:
        metafunc.parametrize(
            "driver_path", [metafunc.config.getoption("driver_path")], scope="session"
        )

    if "use_headless" in metafunc.fixturenames:
        metafunc.parametrize("use_headless", [use_headless], scope="session")

    if "site_path" in metafunc.fixturenames:
        metafunc.parametrize("site_path", [site_path])


@pytest.fixture(scope="session",)
def browser_backend(driver_path, use_headless):
    if not browser_backend.result:
        opts = Options()

        if use_headless:
            opts.add_argument("--headless")
            opts.add_argument("--disable-gpu")

        browser_backend.result = webdriver.Chrome(driver_path, options=opts)
    browser_backend.result.set_page_load_timeout(10)
    yield browser_backend.result

    try:
        browser_backend.result.close()
    except:
        pass
    browser_backend.result = None


browser_backend.result = None


@pytest.fixture()
def browser(browser_backend, base_url):
    browser_backend.delete_all_cookies()
    browser_backend.set_window_size(*BrowserSizes.MEDIUM)
    time.sleep(1)
    browser_backend.get(base_url)
    yield browser_backend


def browser_set_cookie(browser, name, value):
    browser.add_cookie(
        {
            "name": name,
            "value": value,
            # "domain": "localhost"
        }
    )


@pytest.fixture()
def eager_compile_browser(browser):
    browser_set_cookie(browser, "feature_toggles/EAGER_COMPILE", "true")
    yield browser


class BrowserSizes:
    # width x height
    SMALL = (360, 560)
    MEDIUM = (1034, 708)
    LARGE = (1600, 745)


@pytest.fixture()
def small_browser(browser):
    browser.set_window_size(*BrowserSizes.SMALL)
    yield browser


@pytest.fixture()
def medium_browser(browser):
    browser.set_window_size(*BrowserSizes.MEDIUM)
    yield browser


@pytest.fixture()
def large_browser(browser):
    browser.set_window_size(*BrowserSizes.LARGE)
    yield browser


@pytest.fixture()
def single_source_methods__browser(browser):
    browser_set_cookie(browser, "feature_toggles/SINGLE_SOURCE", "true")
    yield browser

@pytest.fixture()
def compression_enabled__browser(browser):
    browser_set_cookie(browser, "feature_toggles/ENABLE_COMPRESSION", "true")
    yield browser

@pytest.fixture()
def root_page(browser, base_url):
    browser.get(base_url)
    yield browser


@pytest.fixture()
def parser():
    def _get_parser(html):
        return BeautifulSoup(html, "html.parser")

    yield _get_parser


@pytest.fixture()
def base_url(site_path):
    return site_path
