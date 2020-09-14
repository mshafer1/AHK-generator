try {
    LZUTF8 = require('lzutf8');
} catch (error) {
    console.debug("Error, could not import lzutf8", error)
    // pass
}

const CURRENT_COMPRESSION_VERSION = "1.0"
const DEFAULT_ENCODING = "Base64"

function zip(string) {
    var result = LZUTF8.compress(string,  {outputEncoding: DEFAULT_ENCODING} )
    return `version=${CURRENT_COMPRESSION_VERSION}&compressed=${result}`;
}

function unzip(compressed, version) {
    var result = ''
    version = (version == undefined)? CURRENT_COMPRESSION_VERSION: version
    if (version == "1.0") {
        result = LZUTF8.decompress(compressed,  {inputEncoding: DEFAULT_ENCODING} );
    }
    else {
        throw 'Could not handle compression version: ' + version
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