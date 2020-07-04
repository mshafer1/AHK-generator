import re
from collections import defaultdict
from enum import Enum

import pytest
from selenium.webdriver.common.by import By


class TriggerTypes(Enum):
    KEY = "KEY"
    STRING = "STRING"


class AssertionObject:
    def __init__(self, expected_trigger_types=[], expected_hotkey_ids=[]):
        self._trigger_types = expected_trigger_types
        self._hotkey_ids = expected_hotkey_ids

    def check(self, browser, parser, subtests):
        page = browser.page_source

        if self._trigger_types:
            checked_selectors = browser.find_elements(
                By.CSS_SELECTOR, "input[type='radio']:checked"
            )
            values = [selector.get_attribute("value") for selector in checked_selectors]
            with subtests.test(
                expected_trigger_types=self._trigger_types, actual_trigger_types=values
            ):
                assert values == [
                    trigger_type.value for trigger_type in self._trigger_types
                ]

        if self._hotkey_ids:
            parsed = parser(page)
            row_id_inputs = parsed.find_all("input", {"class": "js-index"})
            values = [id_input["value"] for id_input in row_id_inputs]

            with subtests.test(expected_hotkey_ids=self._hotkey_ids, hotkey_ids=values):
                assert values == self._hotkey_ids


def _get_elements_through_browser(
    path_type, path, filter, filter_attr, browser,
):
    elements = browser.find_elements(path_type, path)
    desired_elements = [i for i in elements if filter(i.get_attribute(filter_attr))]
    return desired_elements


def _get_elements_and_desired_value_through_browser(
    path_type, path, filter, filter_attr, desired_attr, browser, sort_attribute="name"
):
    desired_elements = _get_elements_through_browser(
        path_type, path, filter, filter_attr, browser
    )
    result = {}
    for element in desired_elements:
        sort_key = element.get_attribute(sort_attribute)
        if sort_key in result:
            if not isinstance(result[sort_key], list):
                result[sort_key] = [result[sort_key]]

            result[sort_key].append(element.get_attribute(desired_attr))
        else:
            result[sort_key] = element.get_attribute(desired_attr)

    return result


def __sanitize_html_inputs(function_signature):
    r"""
    >>> __sanitize_html_inputs('ActivateOrOpen(					"<input type="text" name="Window0" id="window0" placeholder="Window" class="keyWidth" oninput="markDirty()" required="">", <span class="w3-hide-large"><br></span>					"<input id="program0" type="text" name="Program0" placeholder="Program" class="keyWidth" oninput="markDirty()" required="">")					<input type="hidden" value="ActivateOrOpen" name="option0" id="option0">')
    'ActivateOrOpen("\\{Window0\\}", "\\{Program0\\}")'
    >>> __sanitize_html_inputs('Send( "<input name="input0" id="input0" type="text" placeholder="input" oninput="markDirty()" required="">")					<input type="hidden" value="Send" name="option0" id="option0">')
    'Send("\\{input0\\}")'
    >>> __sanitize_html_inputs('Replace( "<input type="text" name="input0" id="input0" placeholder="input" oninput="markDirty()" required="">")					<input type="hidden" value="Replace" name="option0" id="option0">')
    'Replace("\\{input0\\}")'
    >>> __sanitize_html_inputs('SendUnicodeChar(<input name="input0" id="input0" type="text" placeholder="0x000" class="keyWidth" oninput="markDirty()" required="">)')
    'SendUnicodeChar(\\{input0\\})'
    >>> __sanitize_html_inputs('Custom: <textarea name=\"Code0\" id=\"code0\" placeholder=\"code\" class=\"codeArea\" oninput=\"markDirty()\" required=\"\"></textarea>)')
    'Custom: \\{Code0\\})'
    """
    _arg_regex = r"(\"?)\<(input|textarea) .*?name=\"(.+?)\".+?\>(?:\<\/\2\>)?\1"

    function_signature = re.sub(
        r"\<input type=\"hidden\".+?\/?\>", "", function_signature
    ).strip()
    function_signature = re.sub(_arg_regex, r"\1\{\3\}\1", function_signature).replace(
        "\t", ""
    )
    function_signature = re.sub(r"\s+\"", '"', function_signature)
    function_signature = re.sub(
        r"\<span .+?\<br\/?\>\<\/span\>", "", function_signature
    )  # remove page break insertions

    return function_signature


def _get_input(
    selector, matcher, desired_value, id_filter, browser, parser, dest_name, data_store
):
    trigger_type_inputs = _get_elements_and_desired_value_through_browser(
        By.CSS_SELECTOR, selector, matcher, "name", desired_value, browser,
    )

    for name, trigger_type in trigger_type_inputs.items():
        id_value = id_filter(name)
        data_store[id_value][dest_name] = trigger_type


def loaded_data(browser, parser):
    data = defaultdict(dict)

    page = browser.page_source
    parsed = parser(page)

    uses_ids = True

    row_id_inputs = parsed.find_all("input", {"class": "js-index"})
    hotkey_ids = [id_input["value"] for id_input in row_id_inputs]
    if not hotkey_ids:
        uses_ids = False
    # else:
    #     data["hotkey_ids"] = hotkey_ids

    _get_input(
        selector="input[type='radio']:checked",
        matcher=lambda v: v.startswith("func") and v[-1].isnumeric(),
        desired_value="value",
        id_filter=lambda name: name[len("func") :],
        dest_name="trigger_type",
        browser=browser,
        parser=parser,
        data_store=data,
    )

    _get_input(
        selector="input[type='text']",
        matcher=lambda v: v.startswith("comment"),
        desired_value="value",
        id_filter=lambda name: name[len("comment") :],
        dest_name="comment",
        browser=browser,
        parser=parser,
        data_store=data,
    )

    _get_input(
        selector="input[type='text']",
        matcher=lambda v: v.startswith("skeyValue"),
        desired_value="value",
        id_filter=lambda name: name[len("skeyValue") :],
        dest_name="trigger_keys",
        browser=browser,
        parser=parser,
        data_store=data,
    )

    _get_input(
        selector="input[type='checkbox']:checked",
        matcher=lambda name: name.startswith("skey") and name.endswith("[]"),
        desired_value="value",
        id_filter=lambda name: name[len("skey") : -2],
        dest_name="modifier_keys",
        browser=browser,
        parser=parser,
        data_store=data,
    )

    selected_functions = _get_elements_through_browser(
        By.CSS_SELECTOR,
        path="span",
        filter=lambda id: id.startswith("function"),
        filter_attr="id",
        browser=browser,
    )

    for function in selected_functions:
        html_id = function.get_attribute("id")
        id_value = html_id[len("function") :]

        function_signature = function.get_attribute("innerHTML")
        function_signature = __sanitize_html_inputs(function_signature)

        args = _get_elements_and_desired_value_through_browser(
            By.CSS_SELECTOR,
            r'input[type="text"], textarea',
            filter=lambda _: True,
            filter_attr="name",
            desired_attr="value",
            browser=function,
        )

        data[id_value]["action"] = {"function": function_signature, "args": args}

    return dict(data)
