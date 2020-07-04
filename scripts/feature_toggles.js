---
---

var FEATURE_TOGGLES = {
    {% for toggle in site.data.feature_toggles %}{{toggle.code_key}}: {{toggle.default}}, // {{ toggle.description }}
    {% endfor %}
}

function _get_cookie_path(name) {
    var path = `feature_toggles/${name}`
    return path;
}

function _try_get_toggle(name, _default) {
    try {
        var path = _get_cookie_path(name);
        var value = getCookie(path) || _default;
        console.log("Loaded: ", value, "From path: ", path, " For toggle: ", name);
        result = value == "true" || value == true;
        return result;
    } catch (err) {
        return _default;
    }
}

function load_toggles() {
    for (property in FEATURE_TOGGLES) {
        var _default = FEATURE_TOGGLES[property];
        _debug_log(`Toggle: ${property}\nDefault: ${_default}`);
        var value = _try_get_toggle(property, _default);
        FEATURE_TOGGLES[property] = value;
        console.log("Set: ", property, " To: ", value, " Totals: ", FEATURE_TOGGLES);
    }
    console.log("Value: ", FEATURE_TOGGLES)
}

function set_feature_toggle(feature, value) {
    _debug_log("Setting feature: ", feature, " To: ", value);
    FEATURE_TOGGLES[feature] = value;
    var cpath = _get_cookie_path(feature);
    setCookie(cpath, value, 720);
}

$(window).ready(load_toggles);