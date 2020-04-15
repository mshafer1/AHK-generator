const ahk_js = require('../ahk.js');

describe('_load_get', () => {
    var empty = {};
    it('returns empty for empty query', () => {
        expect(ahk_js._load_get('ahkgen.com/'))
        .toEqual(empty);
    });

    it('takes values into object', () => {
        expect(ahk_js._load_get('ahkgen.com/?length=0'))
        .toEqual({'length': "0"});
    });

    it('takes array values into array', () =>{
        expect(ahk_js._load_get('ahkgen.com/?skey0%5B%5D=CTRL&skey0%5B%5D=ALT'))
        .toEqual({'skey0[]': ['CTRL', 'ALT']})
    });

    it('takes duplicate values into array', () =>{
        expect(ahk_js._load_get('ahkgen.com/?skey0=CTRL&skey0=ALT'))
        .toEqual({'skey0': ['CTRL', 'ALT']})
    })
})


describe('_parse_get', () => {
    var empty = {};
    it('returns empty for empty', () => {
        expect(ahk_js._parse_get(empty))
        .toEqual(empty)
    })
})