const ahk_js = require('../../_site/scripts/ahk.js'); // pull in the cod gen'd version

try {
    global.jQuery = require('jquery');
    $ = function () {
        var result = {}
        result.attr = () => {}
        return result
    }
} catch (error) {
    // pass
    console.warn(error)
    console.warn("Failed to import jquery")
}

describe('_get_shortened_url', () => {
    it('takes a string and returns compressed data consistently', () => {
        var input = 'lorem ipsum';
        var result = ahk_js._get_shortened_url(input);
        expect(result).toMatchSnapshot();
    })
})

describe('compression', () => {
    it('output from _get_shortened_url can be turned back via load_get', () => {
        var input = 'data=lorem+ipsum';
        var url = ahk_js._get_shortened_url(input);
        var result = ahk_js._load_get('http://localhost/?' + url)
        expect(result).toEqual({"data": "lorem ipsum"})
    })
})
