
def test_travis_runs_tests(browser, parser, base_url):
    browser.get(base_url)
    page = browser.page_source

    parsed = parser(page)

    hotkey_row = parsed.body.find('div', attrs={'id': 'shortcut0'})
    assert hotkey_row is not None, "could not find div with id (shortcut0) in:\n"+page
