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
        expect(ahk_js._load_get('ahkgen.com/?indexes=0'))
            .toEqual({ 'indexes': '0' })
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
            'ahkgen.com/?indexes=1&comment0=&func0=KEY&skeyValue0=a&input0=b&option0=Send'
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
                    'ahkgen.com/?indexes=1&comment0=&func0=KEY&skeyValue0=a&input0=b&option0=Send'
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
                    'ahkgen.com/?indexes=5&comment5=&func5=KEY&skeyValue5=a&input5=b&option5=Send'
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
                    'ahkgen.com/?indexes=0&comment0=&func0=KEY&skeyValue0=a&input0=b&option0=Send'
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
                'ahkgen.com/?indexes=0&comment0=&func0=KEY&skeyValue0=a&input0=b&option0=Replace'
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
                'ahkgen.com/?indexes=0&comment0=&func0=KEY&skey0%5B%5D=CTRL&skeyValue0=a&input0=b&option0=Send'
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
                'ahkgen.com/?indexes=0&comment0=&func0=KEY&skey0%5B%5D=ALT&skeyValue0=a&input0=b&option0=Send'
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
                'ahkgen.com/?indexes=0&comment0=&func0=KEY&skey0%5B%5D=SHIFT&skeyValue0=a&input0=b&option0=Send'
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
                'ahkgen.com/?indexes=0&comment0=&func0=KEY&skey0%5B%5D=WIN&skeyValue0=a&input0=b&option0=Send'
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
                'ahkgen.com/?indexes=0&comment0=&func0=KEY&skey0%5B%5D=CTRL&skey0%5B%5D=ALT&skeyValue0=a&input0=b&option0=Send'
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
                'ahkgen.com/?indexes=0&comment0=&func0=KEY&skey0%5B%5D=CTRL&skey0%5B%5D=SHIFT&skey0%5B%5D=ALT&skey0%5B%5D=WIN&skeyValue0=a&input0=b&option0=Send'
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
                'ahkgen.com/?indexes=0&comment0=&func0=KEY&skeyValue0=a&Window0=ahk_exe+chrome.exe&Program0=chrome.exe&option0=ActivateOrOpen'
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
                'ahkgen.com/?indexes=0&comment0=&func0=KEY&skeyValue0=b&input0=0x00A2&option0=SendUnicodeChar'
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
                'ahkgen.com/?indexes=0&comment0=&func0=KEY&skeyValue0=b&Window0=pandora&Program0=pandora.com&option0=ActivateOrOpenChrome'
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
                'ahkgen.com/?indexes=0&comment0=&func0=KEY&skeyValue0=b&option0=OpenConfig'
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
                'ahkgen.com/?indexes=0&comment0=&func0=KEY&skeyValue0=b&Code0=send%2C+a&option0=Custom'
            ))
            expect(result).toMatchSnapshot();
        });
    })

    describe('Handles indexes correctly', () => {
        it('get desired indexes in order', () => {
            const result = ahk_js
            ._parse_get(ahk_js._load_get(
                'ahkgen.com/?indexes=3%2C10&comment3=&func3=KEY&skey3%5B%5D=CTRL&skey3%5B%5D=ALT&skeyValue3=b&input3=a&option3=Send&comment10=&func10=STRING&skeyValue10=%60%3Btest&input10=this+is+a+test&option10=Replace'
            ));

            expect(result).toMatchSnapshot();
        })
    });

    describe('Allowes missing params when optional', () => {
        it('allows for comment to not be provided', () => {
            const result = ahk_js
            ._parse_get(ahk_js._load_get(
                'ahkgen.com/?indexes=0&func0=KEY&skey0%5B%5D=CTRL&skey0%5B%5D=ALT&skeyValue0=b&input0=a&option0=Send'
            ));

            expect(result).toMatchSnapshot();
        })
    });

    describe("Handles old query urls as well", () => {
        // data pulled from site tracking and scrubbed
        it('parses example URL correctly', () => {
            const result = ahk_js
            ._parse_get(ahk_js._load_get(
                'ahkgen.com/?length=16&comment0=&func0=STRING&skeyValue0=%3Bimplies&input0=0x2192&option0=SendUnicodeChar&comment1=&func1=STRING&skeyValue1=%3Bdegree&input1=0x00b0&option1=SendUnicodeChar&comment2=&func2=STRING&skeyValue2=%3Bcheck&input2=0x2713&option2=SendUnicodeChar&comment3=&func3=STRING&skeyValue3=%3Bfrown&input3=0x2639&option3=SendUnicodeChar&comment4=&func4=STRING&skeyValue4=%3Bsmile&input4=0x263A&option4=SendUnicodeChar&comment5=&func5=STRING&skeyValue5=%3Btheta&input5=0x03B8&option5=SendUnicodeChar&comment6=&func6=STRING&skeyValue6=%3Bpi&input6=0x03C0&option6=SendUnicodeChar&comment7=&func7=STRING&skeyValue7=%3Bcents&input7=0x00A2&option7=SendUnicodeChar&comment8=&func8=STRING&skeyValue8=%3Bdict&Window8=dictionary.com&Program8=http%3A%2F%2Fdictionary.reference.com%2F&option8=ActivateOrOpenChrome&comment9=&func9=KEY&skey9%5B%5D=CTRL&skey9%5B%5D=ALT&skeyValue9=p&Window9=ahk_exe+putty.exe&Program9=C%3A%5CProgram+Files+%28x86%29%5CPuTTY%5Cputty.exe&option9=ActivateOrOpen&comment10=&func10=KEY&skey10%5B%5D=CTRL&skey10%5B%5D=ALT&skeyValue10=c&Window10=ahk_exe+cmd.exe&Program10=cmd&option10=ActivateOrOpen&comment11=&func11=KEY&skey11%5B%5D=CTRL&skey11%5B%5D=ALT&skeyValue11=n&Window11=-+Notepad++&Program11=notepad++.exe&option11=ActivateOrOpen&comment12=&func12=KEY&skey12%5B%5D=CTRL&skey12%5B%5D=ALT&skeyValue12=i&Window12=-+Google+Chrome&Program12=chrome.exe&option12=ActivateOrOpen&comment13=&func13=KEY&skey13%5B%5D=CTRL&skey13%5B%5D=ALT&skeyValue13=g&Code13=%0D%0A%09Send%2C+%5Ec%0D%0A%09Sleep+50%0D%0A%09Run%2C+http%3A%2F%2Fwww.google.com%2Fsearch%3Fq%3D%25clipboard%25%0D%0A%09Return&option13=Custom&comment14=&func14=KEY&skey14%5B%5D=CTRL&skey14%5B%5D=ALT&skeyValue14=l&Window14=ahk_exe+LabVIEW+NXG.exe&Program14=%25temp%25%5CLabVIEW%5CLabVIEW.exe&option14=ActivateOrOpen&comment15=&func15=KEY&skey15%5B%5D=WIN&skeyValue15=m&Code15=%0D%0A++++Send+%21%7BSpace%7D%0D%0A++++Send+n%0D%0A++++return%0D%0A&option15=Custom'
            ));

            expect(result).toMatchSnapshot();
        });
        it('parses example URL correctly', () => {
            const result = ahk_js
            ._parse_get(ahk_js._load_get(
                'ahkgen.com/?indexes=1%2C2%2C3%2C4%2C5%2C6%2C7%2C8%2C9%2C10%2C11%2C12%2C13&comment0=&func0=STRING&skeyValue0=%3Bimplies&input0=0x2192&option0=SendUnicodeChar&comment1=&func1=STRING&skeyValue1=%3Bdegree&input1=0x00b0&option1=SendUnicodeChar&comment2=&func2=STRING&skeyValue2=%3Bcheck&input2=0x2713&option2=SendUnicodeChar&comment3=&func3=STRING&skeyValue3=%3Bfrown&input3=0x2639&option3=SendUnicodeChar&comment4=&func4=STRING&skeyValue4=%3Bsmile&input4=0x263A&option4=SendUnicodeChar&comment5=&func5=STRING&skeyValue5=%3Btheta&input5=0x03B8&option5=SendUnicodeChar&comment6=&func6=STRING&skeyValue6=%3Bpi&input6=0x03C0&option6=SendUnicodeChar&comment7=&func7=STRING&skeyValue7=%3Bcents&input7=0x00A2&option7=SendUnicodeChar&comment8=&func8=STRING&skeyValue8=%3Bdict&Window8=dictionary.com&Program8=http%3A%2F%2Fdictionary.reference.com%2F&option8=ActivateOrOpenChrome&comment9=&func9=KEY&skey9%5B%5D=CTRL&skey9%5B%5D=ALT&skeyValue9=p&Window9=ahk_exe+putty.exe&Program9=C%3A%5CProgram+Files+%28x86%29%5CPuTTY%5Cputty.exe&option9=ActivateOrOpen&comment10=&func10=KEY&skey10%5B%5D=CTRL&skey10%5B%5D=ALT&skeyValue10=c&Window10=ahk_exe+cmd.exe&Program10=cmd&option10=ActivateOrOpen&comment11=&func11=KEY&skey11%5B%5D=CTRL&skey11%5B%5D=ALT&skeyValue11=n&Window11=-+Notepad++&Program11=notepad++.exe&option11=ActivateOrOpen&comment12=&func12=KEY&skey12%5B%5D=CTRL&skey12%5B%5D=ALT&skeyValue12=i&Window12=-+Google+Chrome&Program12=chrome.exe&option12=ActivateOrOpen&comment13=&func13=KEY&skey13%5B%5D=CTRL&skey13%5B%5D=ALT&skeyValue13=g&Code13=%0D%0A%09Send%2C+%5Ec%0D%0A%09Sleep+50%0D%0A%09Run%2C+http%3A%2F%2Fwww.google.com%2Fsearch%3Fq%3D%25clipboard%25%0D%0A%09Return&option13=Custom&comment14=&func14=KEY&skey14%5B%5D=CTRL&skey14%5B%5D=ALT&skeyValue14=l&Window14=ahk_exe+LabVIEW+NXG.exe&Program14=%25temp%25%5CLabVIEW%5CLabVIEW.exe&option14=ActivateOrOpen&comment15=&func15=KEY&skey15%5B%5D=WIN&skeyValue15=m&Code15=%0D%0A++++Send+%21%7BSpace%7D%0D%0A++++Send+n%0D%0A++++return%0D%0A&option15=Custom'
            ));

            expect(result).toMatchSnapshot();
        });
        // it('parses example URL correctly', () => {
        //     const result = ahk_js
        //     ._parse_get(ahk_js._load_get(
        //         ''
        //     ));

        //     expect(result).toMatchSnapshot();
        // });
    })
})
