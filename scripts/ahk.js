$(window).load(init);

var GET = {}
var LOADED = false;

// from https://stackoverflow.com/a/31221374/8100990
if (!String.prototype.includes) {
    String.prototype.includes = function() {
        'use strict';
        return String.prototype.indexOf.apply(this, arguments) !== -1;
    };
}

// Create Element.remove() function if not exist
if (!('remove' in Element.prototype)) {
    Element.prototype.remove = function() {
        if (this.parentNode) {
            this.parentNode.removeChild(this);
        }
    };
}

function init() {
    ready()
    load_get()

    if (GET.length > 0) {
        ga('send', 'event', { eventCategory: 'AHK', eventAction: 'Post', eventLabel: 'Post', eventValue: 1 });
        parse_get();

        //disable submit
        $('#btnSubmit').disable(true);

        $.getScript("scripts/keygen.js", loaded)
            // build form from GET
            //console.log(GET)
            //console.log(CONFIG)
        num_keys = GET['length'];
        //console.log(num_keys)
        for (i = 0; i < num_keys; i++) {
            newRow();
            $('#func' + i + CONFIG[i]['func']).prop("checked", true)
                //console.log(CONFIG[i]['func'])

            if ('comment' in CONFIG[i]) {
                $('#comment' + i).val(CONFIG[i]['comment'])
            }

            if (CONFIG[i]['func'] == 'KEY') {
                setHotKey(i);

                //console.log(CONFIG[i]['skeyValue'])
                $('#skey' + i + 'key').val(CONFIG[i]['skeyValue'])
                modifiers = CONFIG[i]['modifiers[]']
                    //console.log(modifiers)
                modifiers.forEach(function(entry) {
                    //console.log('#skey' + i + entry)
                    $('#skey' + i + entry).prop("checked", true)
                })
            } else {
                setHotString(i);
                $('#skey' + i + 'string').val(CONFIG[i]['skeyValue'])
            }

            option = CONFIG[i]['option'];
            //console.log(option)
            select(option, i) // select drop down option

            //console.log(CONFIG[i]['option'], i)
            if (option == 'Send' || option == 'Replace' || option == 'SendUnicodeChar') {
                $('#input' + i).val(CONFIG[i]['input'])
            } else if (option == 'ActivateOrOpen' || option == 'ActivateOrOpenChrome') {
                //console.log('activate mode')
                //console.log(CONFIG[i]['Program'])
                //console.log(CONFIG[i]['Window'])

                $('#window' + i).val(CONFIG[i]['Window'])
                $('#program' + i).val(CONFIG[i]['Program'])
            } else if (option == 'Custom') {
                $('#code' + i).val(CONFIG[i]['Code'])
            }
        }
    } else {
        //console.log("New row")
        newRow()
    }
}

function escapeRegExp(str) { // from https://stackoverflow.com/a/1144788/8100990
    return str.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}

function replaceAll(str, find, replace) { // from https://stackoverflow.com/a/1144788/8100990
    return str.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}

function load_get() { //originally from https:///stackoverflow.com/a/12049737
    if (document.location.toString().indexOf('?') !== -1) {
        var query = document.location
            .toString()
            // get the query string
            .replace(/^.*?\?/, '')
            // and remove any existing hash string (thanks, @vrijdenker)
            .replace(/#.*$/, '')
            .replace(new RegExp(escapeRegExp('+'), 'g'), ' ')
            .split('&');

        for (var i = 0, l = query.length; i < l; i++) {
            aux = decodeURIComponent(query[i])
                //console.log(aux)
            key = aux.match(/([\d\D]+?\=)/)[0].replace('=', '');
            //console.log(key)
            value = aux.replace(key + "=", "")
                //console.log(value)
            if (key in GET) {
                if (GET[key].constructor === Array) {
                    GET[key].push(value)
                } else {
                    GET[key] = [GET[key], value]
                }
            } else {
                if (key.includes('[]')) {
                    //console.log("Array detected")
                    GET[key] = [];
                    GET[key].push(value)
                } else {
                    GET[key] = value;
                }
                //console.log(key + ":" + GET[key])
                //console.log();

            }
        }
    }
}

var CONFIG = {};

function parse_get() {
    //CONFIG['length'] = GET['length']
    for (i = 0, k = 0; i < GET['length']; k++) {
        if ('func' + k in GET) {
            CONFIG[i] = {
                'func': GET['func' + k],
                'option': GET['option' + k],
                'skeyValue': GET['skeyValue' + k]
            }

            if (CONFIG[i]['func'] == 'KEY') {
                // hotkey
                if ('skey' + k + '[]' in GET) {
                    CONFIG[i]['modifiers[]'] = GET['skey' + k + '[]']
                } else {
                    CONFIG[i]['modifiers[]'] = []
                        //console.log("empty list")
                }

            } else {
                // hotstring - nothing more in this case
            }

            option = GET['option' + k]

            if (option == 'Send' || option == 'SendUnicodeChar') {
                CONFIG[i]['input'] = GET['input' + k]

            } else if (option == "ActivateOrOpen" || option == 'ActivateOrOpenChrome') {
                CONFIG[i]['Program'] = GET['Program' + k]
                CONFIG[i]['Window'] = GET['Window' + k]

            } else if (option == "Replace") {
                CONFIG[i]['input'] = GET['input' + k]

            } else if (option == 'Custom') {
                CONFIG[i]['Code'] = GET['Code' + k]

            }

            if ('comment' + k in GET && GET['comment' + k].length > 0) {
                console.log("Comment in " + i)
                CONFIG[i]['comment'] = GET['comment' + k]
                console.log(CONFIG)
            }

            i++
        }
    }
}

function ready() {
    //newRow();
    // console.log("Registering for check")
    $('#hotkeyForm').submit(function() {
        // console.log("Checking for submit")
        result = true;
        for (var i = 0; i < count; i++) {
            if ($('#option' + i).length == 0 && $('#function' + i).length > 0) {
                //it doesn't exist
                result = false;
                alert("Must select a function for all rows");
                break;
            }
        }
        return result; // return false to cancel form action
    });

    //if clicking anywhere but on dropdown, close it.
    $(document).bind('click', function(e) { //from http://stackoverflow.com/a/15098861
        if ($(e.target).closest('.w3-dropdown-click').length === 0) {
            $(".w3-dropdown-content").removeClass("w3-show").removeClass("on-top"); //hide all - make sure none of the others are open
            $(".fa-caret-right").removeClass("fa-rotate-90");
        }
    });
}

function handleClick(ev) {
    //console.log('clicked on ' + this.tagName);
    ev.stopPropagation();
}

//from http://stackoverflow/a/20729945
String.prototype.format = function() {
    var str = this;
    for (var i = 0; i < arguments.length; i++) {
        var reg = new RegExp("\\{" + i + "\\}", "gm");
        str = str.replace(reg, arguments[i]);
        return str;
    }
}

//Disable function - from https://stackoverflow.com/a/16788240
jQuery.fn.extend({
    disable: function(state) {
        console.log("disble " + state)
        return this.each(function() {
            var $this = $(this);
            if ($this.is('input, button, textarea, select'))
                this.disabled = state;
            else
                $this.toggleClass('disabled', state);
        });
    }
});

index = 0;
count = 0;

function dropdown(id) {
    //console.log('#key' + id);
    if ($('#key' + id).hasClass("w3-show")) {
        //console.log("Hide it");
        $(".w3-dropdown-content").removeClass("w3-show");
        $(".w3-dropdown-content").removeClass("ontop");
        $(".fa-caret-right").removeClass("fa-rotate-90");
    } else {
        //console.log("show it");
        $(".w3-dropdown-content").removeClass("w3-show"); //hide all - make sure none of the others are open
        $(".fa-caret-right").removeClass("fa-rotate-90");
        $('#arrow' + id).addClass('fa-rotate-90');
        $('#key' + id).addClass('w3-show').addClass('ontop');
    }
}

function select(item, id) {
    $('.w3-dropdown-content').removeClass('w3-show');
    $(".fa-caret-right").removeClass("fa-rotate-90");

    if (item == 'ActivateOrOpen') {
        $('#function' + id).html('ActivateOrOpen(\
					"<input type="text" name="Window{0}" id="window{0}" placeholder="Window" style="width:10em" required/>", \
					"<input id="program{0}" type="text" name="Program{0}" placeholder="Program" style="width:10em" required/>")\
					<input type="hidden" value="ActivateOrOpen" name="option{0}" id="option{0}"/>'.format(id))

        $("#program" + id).click(function(event) {
            event.stopPropagation();
        });
        $("#window" + id).click(function(event) {
            event.stopPropagation();
        });
    } else if (item == 'Send') {
        $('#function' + id).html('Send( "<input name="input{0}"  id="input{0}" type="text" placeholder="input" required/>")\
					<input type="hidden" value="Send" name="option{0}" id="option{0}"/>'.format(id))

        $("#input" + id).click(function(event) {
            event.stopPropagation();
        });
    } else if (item == 'Replace') {
        $('#function' + id).html('Replace( "<input type="text" name="input{0}" id="input{0}" placeholder="input" required/>")\
					<input type="hidden" value="Replace" name="option{0}" id="option{0}"/>'.format(id))
        $("#input" + id).click(function(event) {
            event.stopPropagation();
        });
    } else if (item == 'ActivateOrOpenChrome') {
        $('#function' + id).html('ActivateOrOpenChrome(\
					"<input type="text" name="Window{0}" id="window{0}" placeholder="tab name" style="width:10em" required/>", \
					"<input id="program{0}" type="text" name="Program{0}" placeholder="URL" style="width:10em" required/>")\
					<input type="hidden" value="ActivateOrOpenChrome" name="option{0}" id="option{0}"/>'.format(id))

        $("#program" + id).click(function(event) {
            event.stopPropagation();
        });
        $("#window" + id).click(function(event) {
            event.stopPropagation();
        });
    } else if (item == 'Custom') {
        $('#function' + id).html('Custom: <textarea name="Code{0}"  id="code{0}" placeholder="code" required/>)\
					<input type="hidden" value="Custom" name="option{0}" id="option{0}"/>'.format(id))

        $("#code" + id).click(function(event) {
            event.stopPropagation();
        });
    } else if (item == 'SendUnicodeChar') {
        $('#function' + id).html('SendUnicodeChar(<input name="input{0}"  id="input{0}" type="text" placeholder="0x000" required/>)\
					<input type="hidden" value="SendUnicodeChar" name="option{0}" id="option{0}"/>'.format(id))

        $("#input" + id).click(function(event) {
            event.stopPropagation();
        });
    }
}

function markDirty() {
    //disable download link
    $('#btnDownload').disable(true);
    $('#btnDownload').prop('title', "Script out of date, submit to update to configuration changes");

    //indicate script is out of date as well
    $('#scriptZone').addClass('grayout');
    $('#scriptZone').prop('title', "Script out of date, submit to update to configuration changes");

    //enable Submit
    $('#btnSubmit').disable(false);
    $('#btnSubmit').prop('title', "Select to generate new script");
}

function destroy(id) {
    $('#shortcut' + id).remove() //destroy row from table
    count -= 1;
    $('#inputLength').val(count);

    markDirty();
}

function setHotKey(id) {
    $('#optionsShortcut' + id).html('<div class="w3-col s2">												 \
												<label><input type="checkbox" id="skey{0}CTRL" name="skey{0}[]" value="CTRL" onclick="markDirty()"/>Control</label>	 \
											</div>																 \
											<div class="w3-col s2">												 \
												<label><input type="checkbox" id="skey{0}SHIFT" name="skey{0}[]" value="SHIFT" onclick="markDirty()"/>Shift</label> 	 \
											</div>																 \
											<div class="w3-col s2">												 \
												<label><input type="checkbox" id="skey{0}ALT" name="skey{0}[]" value="ALT" onclick="markDirty()"/>Alt</label>		    \
											</div>																 \
											<div class="w3-col s3">												 \
												<label><input type="checkbox" id="skey{0}WIN" name="skey{0}[]" value="WIN" onclick="markDirty()"/>Windows</label>		 \
											</div>																 \
											<div class="w3-col s3">												 \
												<input type="text" placeholder="key" id="skey{0}key"  name="skeyValue{0}" style="width:5em;"  onchange="markDirty()" required/> <!-- maxlength="1" removed to allow for keys like LButton --> \
											</div>																 \
										</div>'.format(id))
}

function setHotString(id) {
    $('#optionsShortcut' + id).html('<div class="w3-col s6">										 \
												<input type="text" id="skey{0}string" placeholder="string" name="skeyValue{0}" onchange="markDirty()" required/> \
											</div>'.format(id))
}

function newRow() {
    newDiv = '<div class="w3-row-padding w3-padding-16" id="shortcut{0}">													 \
						<div class="w3-col m6 s12">																 \
								<div class="w3-row">															 \
									<div class="w3-col m4">														 \
										<label><input type="radio" id="func{0}KEY" name="func{0}" value="KEY" onclick="setHotKey({0}); markDirty();" checked/> Hotkey</label>	 \
                                        <span class="w3-hide-large"><br/></span>                 \
										<label><input type="radio" id="func{0}STRING" name="func{0}" value="STRING" onclick="setHotString({0}); markDirty();"> Hotstring</input></label>	 \
                                    </div>                                                                       \
                                    <div class="w3-col m1">                                                      \
                                         <span class="w3-hide-small w3-hide-medium" style="text-align:center">|</span>                                \
                                    </div>                                                                       \
									<div class="w3-col m7 w3-right">											 \
										<div id="optionsShortcut{0}" class="w3-row">					         \
                                            <div class="w3-col s2">												 \
												<label><input type="checkbox" id="skey{0}CTRL" name="skey{0}[]" value="CTRL" onclick="markDirty()"/>Control</label>	 \
											</div>																 \
											<div class="w3-col s2">												 \
												<label><input type="checkbox" id="skey{0}SHIFT" name="skey{0}[]" value="SHIFT" onclick="markDirty()"/>Shift</label> 	 \
											</div>																 \
											<div class="w3-col s2">												 \
												<label><input type="checkbox" id="skey{0}ALT" name="skey{0}[]" value="ALT" onclick="markDirty()"/>Alt</label>		    \
											</div>																 \
											<div class="w3-col s3">												 \
												<label><input type="checkbox" id="skey{0}WIN" name="skey{0}[]" value="WIN" onclick="markDirty()"/>Windows</label>		 \
											</div>																 \
											<div class="w3-col s3">												 \
												<input type="text" placeholder="key" id="skey{0}key"  name="skeyValue{0}" style="width:5em;" onchange="markDirty()" required/> <!-- maxlength="1" removed to allow for keys like LButton --> \
											</div>																 \
										</div>																	 \
									</div>																		 \
								</div>																			 \
							</div>		                                                                         \
						<div class="w3-col m6 s12">																 \
							<div class="w3-row-padding">														 \
								<div style="cursor:default" class="w3-col s10 w3-dropdown-click">				 \
									<div class="w3-btn w3-centered" onclick="dropdown(\'{0}\')"><span id="function{0}" >(Select a function)</span><i id="arrow{0}" class="fa fa-caret-right" aria-hidden="true"></i></div>						 \
									<div id="key{0}" class="w3-dropdown-content w3-border ontop">				\
											<button type="button" class="w3-btn w3-margin" onclick="select(\'ActivateOrOpen\', \'{0}\'); markDirty();" title="Brings a program whose title matches the Window (defaulting to \'contains\' mode) to the front or runs the Program\ni.e. ActivateOrOpen(&quot;- Chrome&quot;, &quot;Chrome.exe&quot;) will bring Chrome to the front or open it">ActivateOrOpen("Window", "Program")</button>\
											<br/>																\
											<button type="button" class="w3-btn w3-margin" onclick="select(\'Send\', \'{0}\'); markDirty();" title="Sends input (types for you)">Send("input")</button>\
											<br/>																\
											<button type="button" class="w3-btn w3-margin" onclick="select(\'Replace\', \'{0}\'); markDirty();" title="Removes what was just typed (for hotstring, but treated as Send for hotkey) and sends the value\ni.e. Replace(&quot;by the way&quot;) can be used with a hotstring of btw to cause it to be expanded when typed">Replace("input")</button>\
                                            <br/>																\
											<button type="button" class="w3-btn w3-margin" onclick="select(\'SendUnicodeChar\', \'{0}\'); markDirty();" title="Sends the unicode character given the UTF-16 value\ni.e. SendUnicodeChar(&quot;0x263A&quot;) will insert a smiley face">SendUnicodeChar("charCode")</button>\
                                            <br/>																\
											<button type="button" class="w3-btn w3-margin" onclick="select(\'ActivateOrOpenChrome\', \'{0}\'); markDirty();" title="Searches through Chrome windows/tabs for tab with provided name - opens chrome.exe &quot;url&quot; if not found\ni.e. ActivateOrOpenChrome(&quot;Pandora&quot;, &quot;www.pandora.com&quot;) will search through chrome tabs for Pandora and open pandora.com if not found">ActivateOrOpenChrome("tab name", "url")</button>\
                                            <br/>																\
											<button type="button" class="w3-btn w3-margin" onclick="select(\'Custom\', \'{0}\'); markDirty();" title="A sandbox for creating your own usage of the hotkey/hotstring">Custom("code")</button>\
										</div>																	\
								</div>																			\																			 \
								<div class="w3-col s2">															\
                                <button type="button" onclick="destroy(\'{0}\')" class="w3-btn w3-margin" id="dropdown{0}" title="Delete hotkey"><i class="fa fa-times-circle-o"></i></button>\
								</div>																			\
							</div>  																			\
						</div>																					\
					</div>																						\
					'.format(index);
    index += 1;
    count += 1;
    $('#inputLength').val(count);

    $('#hotkeyRegion').append(newDiv)
}

function loaded() {
    //console.log("seeting url")
    script = keygen(CONFIG)
    $('#downloadLink').attr('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(script))
        //setTimeout(download, 500)
    $('#scriptZone').html('<p><pre>' + script + '</pre></p>')
    $('#scriptZone').removeClass("w3-hide")
    $('#btnDownload').removeClass("w3-hide")
}

function download() {
    console.log("downloading")
    document.getElementById('downloadLink').click()
}