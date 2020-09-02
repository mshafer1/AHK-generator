---
---


GET_KEYS = {
    enable_debug_logging: 'DEBUG_LOG',
    enable_eager_compile: 'EAGER_COMPILE',
}

try {
    const zipper = require('../../_site/scripts/zip.js'); // pull in the cod gen'd version
    unzip = zipper.unzip;
    zip = zipper.zip;
} catch (error) {
    // pass
}

try {
    $(window).load(init);

    // Create Element.remove() function if not exist
    if (!('remove' in Element.prototype)) {
        Element.prototype.remove = function () {
            if (this.parentNode) {
                this.parentNode.removeChild(this);
            }
        };
    }

    //Disable function - from https://stackoverflow.com/a/16788240
    jQuery.fn.extend({
        disable: function (state) {
            _debug_log("disable " + state)
            return this.each(function () {
                var $this = $(this);
                if ($this.is('input, button, textarea, select'))
                    this.disabled = state;
                else
                    $this.toggleClass('disabled', state);
            });
        }
    });

    // from https://stackoverflow.com/a/14042239/8100990
    //
    // $('#element').donetyping(callback[, timeout=1000])
    // Fires callback when a user has finished typing. This is determined by the time elapsed
    // since the last keystroke and timeout parameter or the blur event--whichever comes first.
    //   @callback: function to be called when even triggers
    //   @timeout:  (default=1000) timeout, in ms, to to wait before triggering event if not
    //              caused by blur.
    // Requires jQuery 1.7+ 
    ; (function ($) {
        $.fn.extend({
            donetyping: function (callback, timeout) {
                timeout = timeout || 5e2; // default to 1/2 s
                var timeoutReference,
                    doneTyping = function (el) {
                        if (!timeoutReference) return;
                        timeoutReference = null;
                        // _debug_log($(el));
                        callback.call($(el));
                    };
                return this.each(function (i, el) {
                    var $el = $(el);
                    // Chrome Fix (Use keyup over keypress to detect backspace)
                    // thank you @palerdot
                    $el.is(':input') && $el.on('keyup keypress paste change', function (e) {
                        // This catches the backspace button in chrome, but also prevents
                        // the event from triggering too preemptively. Without this line,
                        // using tab/shift+tab will make the focused element fire the callback.
                        if (e.type == 'keyup' && e.keyCode != 8) return;

                        // Check if timeout has been set. If it has, "reset" the clock and
                        // start over again.
                        if (timeoutReference) clearTimeout(timeoutReference);
                        timeoutReference = setTimeout(function () {
                            // if we made it here, our timeout has elapsed. Fire the
                            // callback
                            doneTyping(el);
                        }, timeout);
                    }).on('blur', function () {
                        // If we can, fire the event since we're leaving the field
                        doneTyping(el);
                    });
                });
            }
        });
        _debug_log("donetyping loaded");
    })(jQuery);
} catch (error) {
    // pass
}

var GET = {}
var LOADED = false;
var DEBUG_LOGGING_ENABLED = false;
var EAGER_COMPILE_ENABLED = false;
var DOWNLOAD_FILE_HEADER = 'data:text/plain;charset=utf-8,';

// from https://stackoverflow.com/a/31221374/8100990
if (!String.prototype.includes) {
    String.prototype.includes = function () {
        'use strict';
        return String.prototype.indexOf.apply(this, arguments) !== -1;
    };
}

function _debug_log() {
    if (!DEBUG_LOGGING_ENABLED) {
        return; // NO-OP
    }

    console.info(...arguments);
}

function init() {
    try {
    $('#hotkeyRegion').sortable({
        placeholder: 'placeholder',
        handle: '.draggabble_handle',
        update: function (event, ui) { markDirty() },
    });
    } catch (_) {
        // pass - just means that jquery-ui did not load, so won't be able to drag-drop
    }
    window.onpopstate = _handle_pop_state; // lazy do this so that jest doesn't encounter it
    DEBUG_LOGGING_ENABLED = FEATURE_TOGGLES.DEBUG_LOGGING
    EAGER_COMPILE_ENABLED = FEATURE_TOGGLES.EAGER_COMPILE
    _debug_log("Debug logging enabled");
    if(FEATURE_TOGGLES.ENABLE_COMPRESSION) {
        $('#CompressData').show()
    }
    ready()
    load_get()
    parse_get();
    _debug_log("GET: ", GET)
    _debug_log("CONFIG: ", CONFIG)

    if('ERROR' in CONFIG) {
        alert(CONFIG['ERROR'])
    }

    num_keys = Object.keys(CONFIG).length;
    if (num_keys == 0 || 'ERROR' in CONFIG) {
        _debug_log("New row")
        newRow()
        return;
    }
    try {
        ga('send', 'event', { eventCategory: 'AHK', eventAction: 'Post', eventLabel: 'Post', eventValue: 1 });
    }
    catch (_) {
        // pass - user must have blocked ga from loading
    }


    //disable submit
    $('#btnSubmit').disable(true);
    $('.js_download_btn').disable(false);

    $.getScript("scripts/keygen.js", loaded)
    // build form from GET
    _debug_log("GET: ", GET)
    _debug_log("CONFIG: ", CONFIG)

    _debug_log("Num Keys: ", num_keys)
    for (i = 0; i < num_keys; i++) {
        newRow();
        setup_row(i, CONFIG);
    }
}

function setup_row(i, config) {
    $('#func' + i + config[i]['func']).attr("checked", true);
    _debug_log(config[i]['func']);
    if ('comment' in config[i]) {
        $('#comment' + i).val(config[i]['comment']);
    }
    if (config[i]['func'] == 'KEY') {
        setHotKey(i, true);
        _debug_log(config[i]['skeyValue']);
        $('#skey' + i + 'key').val(config[i]['skeyValue']);
        modifiers = config[i]['modifiers[]'];
        _debug_log(modifiers);
        modifiers.forEach(function (entry) {
            _debug_log('#skey' + i + entry);
            $('#skey' + i + entry).prop("checked", true);
        });
    }
    else {
        setHotString(i, true);
        $('#skey' + i + 'string').val(config[i]['skeyValue']);
    }
    option = config[i]['option'];
    _debug_log(option);
    select(option, i, true); // select drop down option
    _debug_log(config[i]['option'], i);
    if (option == 'Send' || option == 'Replace' || option == 'SendUnicodeChar') {
        $('#input' + i).val(config[i]['input']);
    }
    else if (option == 'ActivateOrOpen' || option == 'ActivateOrOpenChrome') {
        _debug_log('activate mode');
        _debug_log(config[i]['Program']);
        _debug_log(config[i]['Window']);
        $('#window' + i).val(config[i]['Window']);
        $('#program' + i).val(config[i]['Program']);
    }
    else if (option == 'Custom') {
        $('#code' + i).val(config[i]['Code']);
    }
}

function escapeRegExp(str) { // from https://stackoverflow.com/a/1144788/8100990
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function replaceAll(str, find, replace) { // from https://stackoverflow.com/a/1144788/8100990
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function _load_get(location) {
    var result = {}

    if (location.indexOf('compressed=') != -1) {
        _debug_log("Original query string: ", location)
        var values = location.split('?')[1].split('&')

        var version = 0
        var compressed_data = ''

        for(i = 0; i < values.length; i++) {
            parts = values[i].split('=')
            key = parts[0]
            value = parts[1]
            if (key == 'version') {
                version = unescape(value)
            }
            if (key == 'compressed') {
                compressed_data = unescape(value)
            }
        }

        // if loading compressed page, default to maintaining compression
        $('#chkBox_CompressData').attr('checked', true)

        _debug_log("version:", version, "data:", compressed_data)
        var location = location.split('?')[0] + '?' + unzip(compressed_data, version)
        _debug_log("Uncompressed query string:", location)
    }

    if (location.indexOf('?') == -1) {
        _debug_log("No query string");
        _debug_log(location);
        return result;
    }
    var query = location
        // get the query string
        .replace(/^.*?\?/, '')
        // and remove any existing hash string (thanks, @vrijdenker)
        .replace(/#.*$/, '')
        .replace(new RegExp(escapeRegExp('+'), 'g'), ' ')
        .split('&');

    for (var i = 0, l = query.length; i < l; i++) {
        aux = decodeURIComponent(query[i])
        _debug_log(aux)
        key = aux.match(/([\d\D]+?\=)/)[0].replace('=', '');
        _debug_log(key)
        value = aux.replace(key + "=", "")
        _debug_log(value)
        if (key in result) {
            if (result[key].constructor === Array) {
                result[key].push(value)
            } else {
                result[key] = [result[key], value]
            }
        } else {
            if (key.includes('[]')) {
                _debug_log("Array detected")
                result[key] = [];
                result[key].push(value)
            } else {
                result[key] = value;
            }
            _debug_log(key + ":" + result[key])
            _debug_log();
        }
    }

    return result;
}

function load_get() { //originally from https:///stackoverflow.com/a/12049737
    GET = _load_get(document.location.toString());
}

var CONFIG = {};

function _handle_segment(get_arr, k) {
    var expected_keys = [
        `func${k}`,
        `option${k}`,
        `skeyValue${k}`,
    ]
    const has_key = (key) => key in get_arr;
    const not_has_key = (key) => (!(key in get_arr));
    // if any missing, report error
    if (expected_keys.some(not_has_key)) {
        return [false, `Missing crucial values. Must have each of ${expected_keys}` ];
    }

    var result = {
        'func': get_arr['func' + k],
        'option': get_arr['option' + k],
        'skeyValue': get_arr['skeyValue' + k]
    }

    if (result['func'] == 'KEY') {
        // hotkey
        if ('skey' + k + '[]' in get_arr) {
            result['modifiers[]'] = get_arr['skey' + k + '[]']
        } else {
            result['modifiers[]'] = []
            _debug_log("empty list")
        }

    } else {
        // hotstring - nothing more in this case
    }

    var option = get_arr['option' + k]

    if (option == 'Send' || option == 'SendUnicodeChar') {
        result['input'] = get_arr['input' + k]

    } else if (option == "ActivateOrOpen" || option == 'ActivateOrOpenChrome') {
        result['Program'] = get_arr['Program' + k]
        result['Window'] = get_arr['Window' + k]

    } else if (option == "Replace") {
        result['input'] = get_arr['input' + k]

    } else if (option == 'Custom') {
        result['Code'] = get_arr['Code' + k]
    } else if (option == 'OpenConfig') {
        // NOOP
    }

    if ('comment' + k in get_arr && get_arr['comment' + k].length > 0) {
        _debug_log("Comment in " + k)
        result['comment'] = get_arr['comment' + k]
        _debug_log(result)
    }

    return [true, result];
}

function _get_index_from_name(name) {
    var matches = name.match(/\d+$/);
    var index = -1;
    if(matches) {
        index = matches[0];
    }
    return index;
}

function _handle_length(get_arr) {
    var result = {}
    var num_keys = get_arr['length'];
    if (num_keys * 4 > Object.keys(get_arr).length) {
        _debug_log("Num Keys: " + num_keys + "\n  Get.Length: " + get_arr.Length)
        _debug_log(get_arr)
        // error, display warning and leave
        result['ERROR'] = `Insufficient data, expecting at least ${num_keys * 4} values. Got (${Object.keys(get_arr).length})`
        return result;
    }

    var keys = Object.keys(get_arr);

    var inverted_config = {}
    var length = keys.length;
    for(var i = 0; i < length; i++) {
        var key = keys[i];
        var index = _get_index_from_name(key)
        if (index == -1) {
            continue;
        }

        if (!(index in inverted_config)) {
            inverted_config[index] = {}
        }
        inverted_config[index][key] = get_arr[key];
    }
    _debug_log("Inverted Config: ", inverted_config)

    _debug_log("Number of keys: ", num_keys)
    var inverted_keys = Object.keys(inverted_config)
    for (var i = 0; i < inverted_keys.length; i++) {
        var index = inverted_keys[i]
        _part = _handle_segment(get_arr, index);
        _debug_log(_part)
        if (!_part[0]) {
            result['ERROR'] = _part[1];
            break;
        }

        result[i] = _part[1];
    }

    // TODO: if i < get_arr['length'], warning??

    return result;
}

function _handle_indexes(get_arr) {
    var result = {}
    var indexes = get_arr['indexes'].split(',');
    _debug_log("Indexes: ", indexes)
    _debug_log("Indexes: ", indexes);
    for (var i = 0; i < indexes.length; i++) {
        var index = indexes[i];
        var _parts = _handle_segment(get_arr, index);
        _debug_log("try_handle: ", _parts)
        if (!(_parts[0])) {
            result['ERROR'] = _parts[1];
            break;
        }

        result[i] = _parts[1];
    }
    // result['length'] = Object.keys(result).length;
    return result;
}

function _parse_get(get_arr) {
    var result = {};
    if (Object.keys(get_arr).length == 0) {
        return result;
    }

    if (GET_KEYS.enable_debug_logging in get_arr) {
        DEBUG_LOGGING_ENABLED = true;
    }
    if (GET_KEYS.enable_eager_compile in get_arr) {
        EAGER_COMPILE_ENABLED = true;
        _debug_log("Enabling Eager Compile.")
    }
    _debug_log("Debug Logging enabled");
    if (!('length' in get_arr) && !('indexes' in get_arr)) {
        result['ERROR'] = `Missing 'indexes' parameter in url`
        return result;
    }

    if ('indexes' in get_arr) {
        return _handle_indexes(get_arr);
    }
    else if ('length' in get_arr) {
        return _handle_length(get_arr);
    }
    else {
        result['ERROR'] = `Do not know how to handle ${get_arr}`
    }
}

function parse_get() {
    CONFIG = _parse_get(GET);
}

function _check_form(show_error = true, check_required_fields = false) {
    _debug_log("Checking for submit")
    result = true;

    // compile list of IDs into hidden input then submit.
    var ids = [];
    $(".js-index").each(function () {
        ids.push($(this).val());
    });

    $("#indexes").val(ids)

    result = ids.every(function (index) {
        if ($('#option' + index).length == 0 && $('#function' + index).length > 0) {
            //it doesn't exist
            result = false;
            if (show_error) {
                alert("Must select an action for each trigger");
            }
            return result;
        }
        return true;
    })


    if (check_required_fields) {
        var required = $('input,textarea,select').filter('[required]:visible');
        var allRequired_have_values = true;
        required.each(function () {
            if ($(this).val() == '') {
                allRequired_have_values = false;
                return;
            }
        });

        if (!allRequired_have_values) {
            result = false;
            // TODO: show error??
        }
    }

    if (!result) {
        return result;
    }

    // Shorten URL
    if(FEATURE_TOGGLES.ENABLE_COMPRESSION) {
        // https://stackoverflow.com/a/317000??

        var user_requested_shortened = $('#chkBox_CompressData').is(':checked')
        _debug_log("User requested shorten:", user_requested_shortened);
        var formData = new FormData($('#hotkeyForm')[0]);
        searchParams = new URLSearchParams(formData);
        _debug_log("params: ", searchParams);
        queryString = searchParams.toString();
        _debug_log("QueryString:", queryString);

        var should_shorten = user_requested_shortened;
        var limit = 8.2e3
        if(location.host.startsWith('localhost')) {
            limit = 2e3
        }
        _debug_log(limit)
        _debug_log("length:", (location.href + queryString).length)
        if (!user_requested_shortened && (location.href + queryString).length > limit) {
            _debug_log("warning that should shorten")
            displayYesNoLinks(
                "Shorten URL?",
                `<p>The new configuration URL may be too long (${location.href.length + queryString.length} is 
                greater than ${limit}).</p><p>Shorten the URL?<br/>("YES"
                 to shorten and proceed, "NO" to proceed as is, or close this dialogue to cancel)</p>`, 
                `/?${_get_shortened_url(queryString)}`, `/?${queryString}`, 
                true
            )
            return false;
        }

        if (should_shorten) {
            window.location.href='/?' + _get_shortened_url(queryString)
            return false
        }
    }

    return result; // return false to cancel form action
}

function _get_shortened_url(queryString) {
    var zipped = zip(queryString);
    _debug_log("Zipped:", zipped);
    return `version=1.0&compressed=${zipped}`;
}

function ready() {
    //newRow();
    _debug_log("Registering for check")
    $('#hotkeyForm').submit(_check_form);

    //if clicking anywhere but on dropdown, close it.
    $(document).bind('click', function (e) { //from http://stackoverflow.com/a/15098861
        if ($(e.target).closest('.w3-dropdown-click').length === 0) {
            $(".w3-dropdown-content").removeClass("w3-show").removeClass("on-top"); //hide all - make sure none of the others are open
            $(".fa-caret-right").removeClass("fa-rotate-90");
        }
    });
}

function handleClick(ev) {
    _debug_log('clicked on ' + this.tagName);
    ev.stopPropagation();
}

//from http://stackoverflow/a/20729945
String.prototype.format = function () {
    var str = this;
    for (var i = 0; i < arguments.length; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        str = str.replace(reg, arguments[i]);
        return str;
    }
}

index = 0;
count = 0;

function dropdown(id) {
    var event = window.event;

    _debug_log('#key' + id);
    if (event.defaultPrevented || $('#key' + id).hasClass("w3-show")) {
        _debug_log("Hide it");
        $(".w3-dropdown-content").removeClass("w3-show");
        $(".w3-dropdown-content").removeClass("onTop");
        $(".fa-caret-right").removeClass("fa-rotate-90");
    } else {
        _debug_log("show it");
        $(".w3-dropdown-content").removeClass("w3-show"); //hide all - make sure none of the others are open
        $(".fa-caret-right").removeClass("fa-rotate-90");
        $('#arrow' + id).addClass('fa-rotate-90');
        $('#key' + id).addClass('w3-show').addClass('onTop');
    }
}

function select(item, id, backend) {
    $('.w3-dropdown-content').removeClass('w3-show');
    $(".fa-caret-right").removeClass("fa-rotate-90");

    result = '';

    if (FEATURE_TOGGLES.SINGLE_SOURCE) {
        {% for method in site.data.methods %}
        {% unless forloop.first %}else {% endunless %} if (item == '{{ method.code_key }}') {
            result = `{% include _method_signatures/_generic.html method=method %}`
        } {% endfor %}
    
        $('#function' + id).html(result);
    }
    else {
        if (item == 'ActivateOrOpen') {
            $('#function' + id).html('ActivateOrOpen(\
                        "<input type="text" name="Window{0}" id="window{0}" placeholder="Window" class="keyWidth"  oninput="markDirty()" required/>", <span class="w3-hide-large"><br/></span>\
                        "<input id="program{0}" type="text" name="Program{0}" placeholder="Program"  class="keyWidth"  oninput="markDirty()" required/>")\
                        <input type="hidden" value="ActivateOrOpen" name="option{0}" id="option{0}"/>'.format(id))

            $("#program" + id).click(function (event) {
                event.stopPropagation();
            });
            $("#window" + id).click(function (event) {
                event.stopPropagation();
            });
        } else if (item == 'Send') {
            $('#function' + id).html('Send( "<input name="input{0}"  id="input{0}" type="text" placeholder="input"  oninput="markDirty()" required/>")\
                        <input type="hidden" value="Send" name="option{0}" id="option{0}"/>'.format(id))

            $("#input" + id).click(function (event) {
                event.stopPropagation();
            });
        } else if (item == 'Replace') {
            $('#function' + id).html('Replace( "<input type="text" name="input{0}" id="input{0}" placeholder="input"  oninput="markDirty()" required/>")\
                        <input type="hidden" value="Replace" name="option{0}" id="option{0}"/>'.format(id))
            $("#input" + id).click(function (event) {
                event.stopPropagation();
            });
        } else if (item == 'ActivateOrOpenChrome') {
            $('#function' + id).html('ActivateOrOpenChrome(<span class="w3-hide-large w3-hide-medium"><br/></span>\
                        "<input type="text" name="Window{0}" id="window{0}" placeholder="tab name"  class="keyWidth"  oninput="markDirty()" required/>", <span class="w3-hide-large"><br/></span>\
                        "<input id="program{0}" type="text" name="Program{0}" placeholder="URL"  class="keyWidth"  oninput="markDirty()" required/>")\
                        <input type="hidden" value="ActivateOrOpenChrome" name="option{0}" id="option{0}"/>'.format(id))

            $("#program" + id).click(function (event) {
                event.stopPropagation();
            });
            $("#window" + id).click(function (event) {
                event.stopPropagation();
            });
        } else if (item == 'Custom') {
            $('#function' + id).html('Custom: <textarea name="Code{0}"  id="code{0}" placeholder="code" class="codeArea"  oninput="markDirty()" required/>\
                        <input type="hidden" value="Custom" name="option{0}" id="option{0}"/>'.format(id))

            $("#code" + id).click(function (event) {
                event.stopPropagation();
            });
        } else if (item == 'SendUnicodeChar') {
            $('#function' + id).html('SendUnicodeChar(<input name="input{0}"  id="input{0}" type="text" placeholder="0x000" class="keyWidth"  oninput="markDirty()" required/>)\
                        <input type="hidden" value="SendUnicodeChar" name="option{0}" id="option{0}"/>'.format(id))

            $("#input" + id).click(function (event) {
                event.stopPropagation();
            });
        } else if (item == 'OpenConfig') {
            _debug_log("open config");
            $('#function' + id).html('OpenConfig() <input type="hidden" value="OpenConfig" name="option{0}" id="option{0}"/>'.format(id))
        }

        _register_done_typing(`#function${id}`, id)
    }

    if (!backend) {
        markDirty()
    }
}

function _mark_helper(dirty = true) {
    //disable download link
    $('.js_download_btn').disable(dirty);
    _out_of_date = (dirty) ? "Script out of date, submit to update to configuration changes" : "";
    _generate = (dirty) ? "" : "Select to generate new script";
    $('.js_download_btn').prop('title', _out_of_date);

    //indicate script is out of date as well
    if (dirty) {
        $('#scriptZone').addClass('grayout');
    } else {
        $('#scriptZone').removeClass('grayout');
    }
    $('#scriptZone').prop('title', _out_of_date);

    //enable Submit
    $('#btnSubmit').disable(!dirty);
    $('#btnSubmit').prop('title', _generate);
}

function markDirty() {
    _mark_helper(true);
}

function markClean() {
    _mark_helper(false);
}

function eager_compile(changed_id, changed_index, changed_key) {
    markDirty();
    if (!EAGER_COMPILE_ENABLED) {
        return;
    }

    var check = _check_form(false, true);
    _debug_log("Ready for 'compile':", check);
    if (!check) {
        return;
    }

    var form = $(`#hotkeyForm`)[0];
    var data = new FormData(form);
    var querystring = new URLSearchParams(data).toString();
    _debug_log("New URL: ", querystring);
    window.history.pushState({ "updatedfield": changed_id, "index": String(changed_index), "changed_key": String(changed_key) }, "AHK Generator", "/?" + querystring);
    _debug_log(`/?${querystring}`);
    var get_arry = _load_get(`/?${querystring}`);
    _debug_log('get_array', get_arry);

    if ('error' in get_arry) {
        _debug_log('ERRORS: ', get_arry['error'])
        return;
    }

    var config = _parse_get(get_arry);
    _setup_download(config);
    _update_fields(null, config);
    markClean();
}

function _handle_pop_state(event) {
    if (!FEATURE_TOGGLES.EDITOR_MODE) {
        window.location.href = document.location;
        return;
    }
    _debug_log("location: ", document.location, "\nstate: ", event.state);
    var get_arry = _load_get(window.location.search);
    var config = _parse_get(get_arry);
    _setup_download(config);
    _update_fields(event.state, config);
}

function _update_fields(state, config) {
    _debug_log("State: ", state);
    if (state == null) {
        num_keys = Object.keys(config).length;
        if (num_keys == 0) {
            // this means that the last row was deleted
            $('#hotkeyRegion').empty();
            // newRow();
            markDirty();
            index = 0; // reset index count
            return;
        }
        for (var i = 0; i < num_keys; i++) {
            var row_n = Object.keys(config)[i];
            setup_row(row_n, config);
        }
        return
    }

    // TODO: handle row deletion and creation
    _debug_log("Setup Row from Config: ", config);
    setup_row(state.index, config);
    // var new_value = config[state.index][state.changed_key];
    // if('[]' in state.changed_key) {
    //     // handle check boxes   
        
    // } else {
    //     // handle text
    //     $(`#${state.updatedfield}`).val(new_value);
    // }
    

}

function destroy(id) {
    $('#shortcut' + id).remove() //destroy row from table

    markDirty();
}

function setHotKey(id, backend) {
    $('#optionsShortcut' + id).html(genHotkeyRegion(id))
    _register_done_typing('#optionsShortcut' + id, id);
    if (!backend) {
        markDirty()
    }
}

function _register_done_typing(parent_identifier, id) {
    if (!EAGER_COMPILE_ENABLED) {
        return
    }
    _debug_log("Registering donetyping");
    var inputs = $(`${parent_identifier} .js_donetyping`);
    _debug_log('Inputs: ', inputs);
    inputs.donetyping(function () { eager_compile($(this).attr('id'), id, $(this).attr('name').replace(/\d*$/g, '')); });
}

function genHotkeyRegion(id) {
    var _handle_change = (EAGER_COMPILE_ENABLED) ? '' : 'oninput="markDirty()"';
    var _register_change = (EAGER_COMPILE_ENABLED) ? 'js_donetyping' : '';
    return `{% include _trigger_hotkey.html %}`.format(id);
}

function setHotString(id, backend) {
    var _handle_change = (EAGER_COMPILE_ENABLED) ? '' : 'onchange="markDirty()"';
    var _register_change = (EAGER_COMPILE_ENABLED) ? 'js_donetyping' : '';

    _debug_log("configuring #optionsShortcut" + id)
    $('#optionsShortcut' + id).html(`<div class="w3-col s6">
												<input type="text" id="skey${id}string" placeholder="string" name="skeyValue${id}" class="${_register_change}" ${_handle_change} required/>
                                            </div>`)
    _register_done_typing("#optionsShortcut" + id, id);
    if (!backend) {
        markDirty()
    }
}

function newRow() {
    newDiv = `{% include newRow.html %}`;
    index += 1;

    $('#hotkeyRegion').append(newDiv)
    _register_done_typing('#optionsShortcut' + (index - 1), (index - 1));
}

function loaded() {
    _debug_log("seeting url")
    script = keygen(CONFIG)
    _setup_download(CONFIG);
}

function _setup_download(configuration) {
    _debug_log("seeting url");
    script = keygen(configuration);
    $('#downloadLink').attr('href', DOWNLOAD_FILE_HEADER + encodeURIComponent(script));

    $('#scriptZone').html('<p><pre><code class="autohotkey">' + script + '</code></pre></p>');
    $('#skipToScript').removeClass("w3-hide");
    $('#scriptZone').removeClass("w3-hide");
    $('.js_download_btn').removeClass("w3-hide");
    hljs.highlightBlock($('#scriptZone')[0]);
}

function scrollToCode() {
    $('html, body').animate({
        scrollTop: $("#scriptZone").offset().top
    }, 0);
}

function scrollToTop() {
    $('html, body').animate({
        scrollTop: $("body").offset().top
    }, 500);
}

function download() {
    _cancel_id = setTimeout(function () { alert("Uh, oh. It seems we can't download the file right now - you can still copy and paste it"); }, 800)
    _debug_log("downloading")
    _download_link = document.getElementById('downloadLink');
    if ('msSaveBlob' in window.navigator) {
        var _header_len = DOWNLOAD_FILE_HEADER.length;
        var _raw_file = decodeURI(_download_link.href.substring(_header_len));
        var textFileAsBlob = new Blob([_raw_file], {
            type: 'text/plain'
        });

        window.navigator.msSaveBlob(textFileAsBlob, "hotkey.ahk");
    } else {
        _download_link.click()
    }

    try {
        ga('send', 'event', { eventCategory: 'AHK', eventAction: 'Download', eventLabel: 'Download', eventValue: 1 });
    } catch (error) {
        // pass
    }

    clearTimeout(_cancel_id);
}

function _prevent_default() {
    var event = window.event;
    event.preventDefault();
}

try {
    // from https://stackoverflow.com/a/11279639
    // if module is availble, we must be getting included via a 'require', export methods
    var exports = module.exports = {};

    exports._load_get = _load_get;
    exports._parse_get = _parse_get;
    exports._get_shortened_url = _get_shortened_url;
} catch (error) {
    // pass
}