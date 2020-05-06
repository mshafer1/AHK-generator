const ahk_js = require('../ahk.js');

describe('_load_get', () => {
    var empty = {};
    it('returns empty for empty query', () => {
        expect(ahk_js._load_get('ahkgen.com/'))
            .toEqual(empty);
    });

    it('takes values into object', () => {
        expect(ahk_js._load_get('ahkgen.com/?length=0'))
            .toEqual({ 'length': "0" });
    });

    it('takes array values into array', () => {
        expect(ahk_js._load_get('ahkgen.com/?skey0%5B%5D=CTRL&skey0%5B%5D=ALT'))
            .toEqual({ 'skey0[]': ['CTRL', 'ALT'] })
    });

    it('takes index array and turns into array', () => {
        expect(ahk_js._load_get('ahkgen.com/?indexes%5B%5D=0'))
            .toEqual({ 'indexes[]': ['0'] })
    });

    it('takes duplicate values into array', () => {
        expect(ahk_js._load_get('ahkgen.com/?skey0=CTRL&skey0=ALT'))
            .toEqual({ 'skey0': ['CTRL', 'ALT'] })
    });

    it('takes a basic query and returns expected data', () => {
        const result = ahk_js
            ._load_get('ahkgen.com/?length=1&comment0=&func0=KEY&skeyValue0=a&input0=b&option0=Replace');
        expect(result).toMatchSnapshot();
    })

    it('takes data in regardless of values', () => {
        const result = ahk_js
            ._load_get('ahkgen.com/?length=1&comment5=&func5=KEY&skeyValue5=a&input5=b&option5=Replace');
        expect(result).toMatchSnapshot();
    });

    it('takes no issue with an indexes query', () => {
        const result = ahk_js
        ._load_get(
            'ahkgen.com/?indexes%5B%5D=1&comment0=&func0=KEY&skeyValue0=a&input0=b&option0=Send'
        );
        expect(result).toMatchSnapshot();
    })
})


describe('_parse_get', () => {
    var empty = {};
    it('returns empty for empty', () => {
        expect(ahk_js._parse_get({})).toEqual(empty)
    });

    describe('takes a basic config and returns expected::', () => {
        it('returns promptly if not enough data is passed', () => {
            expect(ahk_js._parse_get({ 'length': '5' })).toHaveProperty('ERROR');
        });
        it('returns an error if length is not provided', () => {
            expect(ahk_js._parse_get({ FOO: 'bar' })).toHaveProperty('ERROR');
        });
        it('return an error for a missing index', () => {
            const result = ahk_js
                ._parse_get(ahk_js._load_get(
                    'ahkgen.com/?indexes%5B%5D=1&comment0=&func0=KEY&skeyValue0=a&input0=b&option0=Send'
                ))
            expect(result).toHaveProperty('ERROR')
            expect(result).toMatchSnapshot();
        })
        it('packs values down to lowest index', () => {
            const result = ahk_js
                ._parse_get(ahk_js._load_get(
                    'ahkgen.com/?length=1&comment5=&func5=KEY&skeyValue5=a&input5=b&option5=Send'
                ))
            expect(result).toMatchSnapshot();
        });
        it('packs values down to lowest index', () => {
            const result = ahk_js
                ._parse_get(ahk_js._load_get(
                    'ahkgen.com/?indexes%5B%5D=5&comment5=&func5=KEY&skeyValue5=a&input5=b&option5=Send'
                ))
            expect(result).toMatchSnapshot();
        });
        it('parses a basic send value correctly', () => {
            const result = ahk_js
                ._parse_get(ahk_js._load_get(
                    'ahkgen.com/?length=1&comment0=&func0=KEY&skeyValue0=a&input0=b&option0=Send'
                ))
            expect(result).toMatchSnapshot();
        })
        it('parses a basic send value correctly', () => {
            const result = ahk_js
                ._parse_get(ahk_js._load_get(
                    'ahkgen.com/?indexes%5B%5D=0&comment0=&func0=KEY&skeyValue0=a&input0=b&option0=Send'
                ))
            expect(result).toMatchSnapshot();
        })
        it('parses a basic replace correctly', () => {
            const result = ahk_js
                ._parse_get(ahk_js._load_get(
                    'ahkgen.com/?length=1&comment0=&func0=KEY&skeyValue0=a&input0=b&option0=Replace'
                ))
            expect(result).toMatchSnapshot();
        });
        it('parses a basic replace correctly', () => {
            const result = ahk_js
            ._parse_get(ahk_js._load_get(
                'ahkgen.com/?indexes%5B%5D=0&comment0=&func0=KEY&skeyValue0=a&input0=b&option0=Replace'
            ))
            expect(result).toMatchSnapshot();
        });
        it('parses a modifier keys correctly (ctrl)', () => {
            const result = ahk_js
                ._parse_get(ahk_js._load_get(
                    'ahkgen.com/?length=1&comment0=&func0=KEY&skey0%5B%5D=CTRL&skeyValue0=a&input0=b&option0=Send'
                ))
            expect(result).toMatchSnapshot();
        });
        it('parses a modifier keys correctly (ctrl)', () => {
            const result = ahk_js
            ._parse_get(ahk_js._load_get(
                'ahkgen.com/?indexes%5B%5D=0&comment0=&func0=KEY&skey0%5B%5D=CTRL&skeyValue0=a&input0=b&option0=Send'
            ))
            expect(result).toMatchSnapshot();
        });
        it('parses a modifier keys correctly (alt)', () => {
            const result = ahk_js
                ._parse_get(ahk_js._load_get(
                    'ahkgen.com/?length=1&comment0=&func0=KEY&skey0%5B%5D=ALT&skeyValue0=a&input0=b&option0=Send'
                ))
            expect(result).toMatchSnapshot();
        });
        it('parses a modifier keys correctly (alt)', () => {
            const result = ahk_js
            ._parse_get(ahk_js._load_get(
                'ahkgen.com/?indexes%5B%5D=0&comment0=&func0=KEY&skey0%5B%5D=ALT&skeyValue0=a&input0=b&option0=Send'
            ))
            expect(result).toMatchSnapshot();
        });
        it('parses a modifier keys correctly (shift)', () => {
            const result = ahk_js
                ._parse_get(ahk_js._load_get(
                    'ahkgen.com/?length=1&comment0=&func0=KEY&skey0%5B%5D=SHIFT&skeyValue0=a&input0=b&option0=Send'
                ))
            expect(result).toMatchSnapshot();
        });
        it('parses a modifier keys correctly (shift)', () => {
            const result = ahk_js
            ._parse_get(ahk_js._load_get(
                'ahkgen.com/?indexes%5B%5D=0&comment0=&func0=KEY&skey0%5B%5D=SHIFT&skeyValue0=a&input0=b&option0=Send'
            ))
            expect(result).toMatchSnapshot();
        });
        it('parses a modifier keys correctly (win)', () => {
            const result = ahk_js
                ._parse_get(ahk_js._load_get(
                    'ahkgen.com/?length=1&comment0=&func0=KEY&skey0%5B%5D=WIN&skeyValue0=a&input0=b&option0=Send'
                ))
            expect(result).toMatchSnapshot();
        });
        it('parses a modifier keys correctly (win)', () => {
            const result = ahk_js
            ._parse_get(ahk_js._load_get(
                'ahkgen.com/?indexes%5B%5D=0&comment0=&func0=KEY&skey0%5B%5D=WIN&skeyValue0=a&input0=b&option0=Send'
            ))
            expect(result).toMatchSnapshot();
        });
        it('parses a group modifier keys correctly (ctrl, alt)', () => {
            const result = ahk_js
                ._parse_get(ahk_js._load_get(
                    'ahkgen.com/?length=1&comment0=&func0=KEY&skey0%5B%5D=CTRL&skey0%5B%5D=ALT&skeyValue0=a&input0=b&option0=Send'
                ))
            expect(result).toMatchSnapshot();
        });
        it('parses a group modifier keys correctly (ctrl, alt)', () => {
            const result = ahk_js
            ._parse_get(ahk_js._load_get(
                'ahkgen.com/?indexes%5B%5D=0&comment0=&func0=KEY&skey0%5B%5D=CTRL&skey0%5B%5D=ALT&skeyValue0=a&input0=b&option0=Send'
            ))
            expect(result).toMatchSnapshot();
        });
        it('parses a group modifier keys correctly (ctrl, alt, shift, win)', () => {
            const result = ahk_js
                ._parse_get(ahk_js._load_get(
                    'ahkgen.com/?length=1&comment0=&func0=KEY&skey0%5B%5D=CTRL&skey0%5B%5D=SHIFT&skey0%5B%5D=ALT&skey0%5B%5D=WIN&skeyValue0=a&input0=b&option0=Send'
                ))
            expect(result).toMatchSnapshot();
        });
        it('parses a group modifier keys correctly (ctrl, alt, shift, win)', () => {
            const result = ahk_js
            ._parse_get(ahk_js._load_get(
                'ahkgen.com/?indexes%5B%5D=0&comment0=&func0=KEY&skey0%5B%5D=CTRL&skey0%5B%5D=SHIFT&skey0%5B%5D=ALT&skey0%5B%5D=WIN&skeyValue0=a&input0=b&option0=Send'
            ))
            expect(result).toMatchSnapshot();
        });
        it('parses an Activate Or Open correctly', () => {
            const result = ahk_js
                ._parse_get(ahk_js._load_get(
                    'ahkgen.com/?length=1&comment0=&func0=KEY&skeyValue0=a&Window0=ahk_exe+chrome.exe&Program0=chrome.exe&option0=ActivateOrOpen'
                ))
            expect(result).toMatchSnapshot();
        });
        it('parses an Activate Or Open correctly', () => {
            const result = ahk_js
            ._parse_get(ahk_js._load_get(
                'ahkgen.com/?indexes%5B%5D=0&comment0=&func0=KEY&skeyValue0=a&Window0=ahk_exe+chrome.exe&Program0=chrome.exe&option0=ActivateOrOpen'
            ))
            expect(result).toMatchSnapshot();
        });
        it('parses a Send Unicode Char correctly', () => {
            const result = ahk_js
                ._parse_get(ahk_js._load_get(
                    'ahkgen.com/?length=1&comment0=&func0=KEY&skeyValue0=b&input0=0x00A2&option0=SendUnicodeChar'
                ))
            expect(result).toMatchSnapshot();
        });
        it('parses a Send Unicode Char correctly', () => {
            const result = ahk_js
            ._parse_get(ahk_js._load_get(
                'ahkgen.com/?indexes%5B%5D=0&comment0=&func0=KEY&skeyValue0=b&input0=0x00A2&option0=SendUnicodeChar'
            ))
            expect(result).toMatchSnapshot();
        });
        it('parses an ActivateOrOpenChrome correctly', () => {
            const result = ahk_js
                ._parse_get(ahk_js._load_get(
                    'ahkgen.com/?length=1&comment0=&func0=KEY&skeyValue0=b&Window0=pandora&Program0=pandora.com&option0=ActivateOrOpenChrome'
                ))
            expect(result).toMatchSnapshot();
        });
        it('parses an ActivateOrOpenChrome correctly', () => {
            const result = ahk_js
            ._parse_get(ahk_js._load_get(
                'ahkgen.com/?indexes%5B%5D=0&comment0=&func0=KEY&skeyValue0=b&Window0=pandora&Program0=pandora.com&option0=ActivateOrOpenChrome'
            ))
            expect(result).toMatchSnapshot();
        });
        it('parses an OpenConfig correctly', () => {
            const result = ahk_js
                ._parse_get(ahk_js._load_get(
                    'ahkgen.com/?length=1&comment0=&func0=KEY&skeyValue0=b&option0=OpenConfig'
                ))
            expect(result).toMatchSnapshot();
        });
        it('parses an OpenConfig correctly', () => {
            const result = ahk_js
            ._parse_get(ahk_js._load_get(
                'ahkgen.com/?indexes%5B%5D=0&comment0=&func0=KEY&skeyValue0=b&option0=OpenConfig'
            ))
            expect(result).toMatchSnapshot();
        });
        it('parses a Custom correctly', () => {
            const result = ahk_js
                ._parse_get(ahk_js._load_get(
                    'ahkgen.com/?length=1&comment0=&func0=KEY&skeyValue0=b&Code0=send%2C+a&option0=Custom'
                ))
            expect(result).toMatchSnapshot();
        });
        it('parses a Custom correctly', () => {
            const result = ahk_js
            ._parse_get(ahk_js._load_get(
                'ahkgen.com/?indexes%5B%5D=0&comment0=&func0=KEY&skeyValue0=b&Code0=send%2C+a&option0=Custom'
            ))
            expect(result).toMatchSnapshot();
        });
    })
})
