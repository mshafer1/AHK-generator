const { printExceptionAndStackTraceToConsole } = require("lzutf8")

const configured_region = require("../keygen").configured_region
const each = require("jest-each").default

const triggers = [
    {
        "func": "KEY",
        "skeyValue": "a",
        "modifiers[]": [
            "CTRL",
            "ALT"],
    },
    {
        "func": "STRING",
        "skeyValue": ";implies",
    }
]

const actions = [
    {
        "option": "Send",
        "input": "b",
    },
    {
        "option": "SendUnicodeChar",
        "input": "0x2192",
    },
    {
        "Program": "cmd",
        "Window": "ahk_exe cmd.exe",
        "option": "ActivateOrOpen",
    },
    {
        "option": "LockWorkStation",
    },
    {
        "option": "TurnMonitorsOff",
    },
    {
        "option": "OpenConfig",
    },
    {
        "option": "Custom",
        "Code": `
            Send, ^c
            Sleep 50
            Run, http://www.google.com/search?q=%clipboard%
            Return`,
    },
    {
        "Program": "http://dictionary.reference.com/",
        "Window": "dictionary.com",
        "option": "ActivateOrOpenChrome",
    }
]


function* generate_test_cases() {
    var i = 0;
    for (const trigger of triggers) {
        for (const action of actions) {
            var test_case = { 0: { ...trigger, ...action } }
            yield [JSON.stringify(test_case), test_case]
        }
    }
}


describe("when keygen", () => {
    each([...generate_test_cases()]).it("given %s, then matches snapshot", (name, parsed_data) => {
        expect(configured_region(parsed_data)).toMatchSnapshot();
    })
})
