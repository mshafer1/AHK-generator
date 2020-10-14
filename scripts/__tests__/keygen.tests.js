const { printExceptionAndStackTraceToConsole } = require("lzutf8")

const configured_region = require("../../_site/scripts/keygen.js").configured_region
const keygen = require("../../_site/scripts/keygen.js").keygen
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
        "Program": "cmd",
        "Window": "ahk_exe cmd.exe",
        "option": "ActivateOrOpen",
    },
    {
        "option": "Send",
        "input": "b",
    },
    {
        "option": "Replace",
        "input": "b",
    },
    {
        "option": "SendUnicodeChar",
        "input": "0x2192",
    },
    {
        "Program": "http://dictionary.reference.com/",
        "Window": "dictionary.com",
        "option": "ActivateOrOpenChrome",
    },
    {
        "option": "OpenConfig",
    },
    {
        "option": "LockWorkStation",
    },
    {
        "option": "TurnMonitorsOff",
    },
    {
        "option": "Custom",
        "Code": `
            Send, ^c
            Sleep 50
            Run, http://www.google.com/search?q=%clipboard%
            Return`,
    },
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

describe("keygen", () => {
    each([...generate_test_cases()]).it("given %s, then does not have duplicate function declarations", (name, parsed_data) => {
        // structure from https://stackoverflow.com/a/1222072
        var generated_script = keygen(parsed_data, "");
        var func_search = RegExp('\\n\\w+\\(.*\\)\\n\\{', 'g');
        
        while ((found = func_search.exec(generated_script)) !== null) {
            console.log(`Asserting having only one of ${found} in script`)
            expect(occurrences(generated_script, found)).toEqual(1)
        }
    })
})

/** Function that count occurrences of a substring in a string;
 * @param {String} string               The string
 * @param {String} subString            The sub string to search for
 * @param {Boolean} [allowOverlapping]  Optional. (Default:false)
 *
 * @author Vitim.us https://gist.github.com/victornpb/7736865
 * @see Unit Test https://jsfiddle.net/Victornpb/5axuh96u/
 * @see http://stackoverflow.com/questions/4009756/how-to-count-string-occurrence-in-string/7924240#7924240
 */
function occurrences(string, subString, allowOverlapping) {

    string += "";
    subString += "";
    if (subString.length <= 0) return (string.length + 1);

    var n = 0,
        pos = 0,
        step = allowOverlapping ? 1 : subString.length;

    while (true) {
        pos = string.indexOf(subString, pos);
        if (pos >= 0) {
            ++n;
            pos += step;
        } else break;
    }
    return n;
}