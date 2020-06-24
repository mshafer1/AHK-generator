import pytest
from selenium.webdriver.common.by import By

from enum import Enum

class TriggerTypes(Enum):
    KEY = 'KEY'
    STRING = 'STRING'

class AssertionObject():
    def __init__(self, expected_trigger_types=[], expected_hotkey_ids=[]):
        self._trigger_types = expected_trigger_types
        self._hotkey_ids = expected_hotkey_ids
    
    def check(self, browser, parser, subtests):
        page = browser.page_source

        if self._trigger_types:
            checked_selectors = browser.find_elements(By.CSS_SELECTOR, "input[type='radio']:checked")
            values = [selector.get_attribute('value') for selector in checked_selectors]
            with subtests.test(expected_trigger_types=self._trigger_types, actual_trigger_types=values):
                assert values == [trigger_type.value for trigger_type in self._trigger_types]
    
        if self._hotkey_ids:
            parsed = parser(page)
            row_id_inputs = parsed.find_all("input", {"class": "js-index"})
            values = [id_input["value"] for id_input in row_id_inputs]

            with subtests.test(expected_hotkey_ids=self._hotkey_ids, hotkey_ids=values):
                assert values == self._hotkey_ids
