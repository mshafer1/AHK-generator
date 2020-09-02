try {
    LZUTF8 = require('lzutf8');
} catch (error) {
    console.debug("Error, could not import lzutf8", error)
    // pass
}

function zip(string) {
    var result = LZUTF8.compress(string,  {outputEncoding: 'Base64'} )
    return result;
}

function unzip(compressed, version) {
    var result = ''
    version = (version == undefined)? "1.0": version
    if (version == "1.0") {
        result = LZUTF8.decompress(compressed,  {inputEncoding: 'Base64'} );
    }
    return result
}

try {
    var exports = module.exports = {};
    exports.zip = zip;
    exports.unzip = unzip;
} catch (error) {
    // pass
    console.debug(error);
}