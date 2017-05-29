var GET = {}

function init() {
    load_get()
    if (GET.length > 0) {
        // build form from GET
    }
    // add a new row to end
    console.log("New row")
    newRow()
}

function load_get() { // https:///stackoverflow.com/a/12049737

}

function ready() {
    //newRow();
    $('#hotkeyRegion').submit(function() {
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
}

function handleClick(ev) {
    console.log('clicked on ' + this.tagName);
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

index = 0;
count = 0;

function dropdown(id) {
    console.log('#key' + id);
    if ($('#key' + id).hasClass("w3-show")) {
        console.log("Hide it");
        $(".w3-dropdown-content").removeClass("w3-show");
        $(".w3-dropdown-content").removeClass("ontop");
        $(".fa-caret-right").removeClass("fa-rotate-90");
    } else {
        console.log("show it");
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
					<input type="text" name="Window{0}" id="window{0}" placeholder="Window" style="width:10em" required/>,\
					<input id="program{0}" type="text" name="Program{0}" placeholder="Program" style="width:10em" required/>)\
					<input type="hidden" value="ActivateOrOpen" name="option{0}" id="option{0}"/>'.format(id))

        $("#program" + id).click(function(event) {
            event.stopPropagation();
        });
        $("#window" + id).click(function(event) {
            event.stopPropagation();
        });
    } else if (item == 'Send') {
        $('#function' + id).html('Send(<input name="input{0}"  id="input{0}" type="text" placeholder="input" required/>)\
					<input type="hidden" value="Send" name="option{0}" id="option{0}"/>'.format(id))

        $("#input" + id).click(function(event) {
            event.stopPropagation();
        });
    } else if (item == 'Replace') {
        $('#function' + id).html('Replace(<input type="text" name="input{0}" id="input{0}" placeholder="input" required/>)\
					<input type="hidden" value="Replace" name="option{0}" id="option{0}"/>'.format(id))
        $("#input" + id).click(function(event) {
            event.stopPropagation();
        });
    }
}

function remove(id) {
    $('#shortcut' + id).remove() //delete row from table
    count -= 1;
    $('#inputLength').val(count);
}

function setHotKey(id) {
    $('#optionsShortcut' + id).html('<div class="w3-col s3">												 \
												<label><input type="checkbox" name="skey{0}[]" value="CTRL"/>Control</label>	 \
											</div>																 \
											<div class="w3-col s3">												 \
												<label><input type="checkbox" name="skey{0}[]" value="ALT"/>Alt</label>		 \
											</div>																 \
											<div class="w3-col s3">												 \
												<label><input type="checkbox" name="skey{0}[]" value="SHIFT"/>Shift</label>		 \
											</div>																 \
											<div class="w3-col s3">												 \
												<input type="text" placeholder="key" name="skeyValue{0}" style="width:5em;" maxlength="1" required/> \
											</div>'.format(id))
}

function setHotString(id) {
    $('#optionsShortcut' + id).html('<div class="w3-col s6">										 \
												<input type="text" placeholder="string" name="skeyValue{0}" required/> \
											</div>'.format(id))
}

function newRow() {
    newDiv = '<div class="w3-row" id="shortcut{0}">													 \
						<div class="w3-col m6 s12">																 \
								<div class="w3-row">															 \
									<div class="w3-col m4">														 \
										<label><input type="radio" name="func{0}" value="KEY" onclick="setHotKey({0});" checked/> Hotkey</label>	 \
										<label><input type="radio" name="func{0}" value="STRING" onclick="setHotString({0});"> Hotstring</input></label>	 \
										|																		\
									</div>																		 \
									<div class="w3-col m8 w3-right">											 \
										<div id="optionsShortcut{0}" class="w3-row">					         \
											<div class="w3-col s3">												 \
												<label><input type="checkbox" name="skey{0}[]" value="CTRL"/>Control</label>	 \
											</div>																 \
											<div class="w3-col s3">												 \
												<label><input type="checkbox" name="skey{0}[]" value="ALT"/>Alt</label>		 \
											</div>																 \
											<div class="w3-col s3">												 \
												<label><input type="checkbox" name="skey{0}[]" value="SHIFT"/>Shift</label>		 \
											</div>																 \
											<div class="w3-col s3">												 \
												<input type="text" placeholder="key" name="skeyValue{0}" style="width:5em;" maxlength="1" required/> \
											</div>																 \
										</div>																	 \
									</div>																		 \
								</div>																			 \
							</div>																				 \
						<div class="w3-col m6 s12">																 \
							<div class="w3-row-padding">														 \
								<div style="cursor:default" class="w3-col s10 w3-dropdown-click">				 \
									<div class="w3-btn" onclick="dropdown(\'{0}\')"><span id="function{0}" >(Select a function)</span><i id="arrow{0}" class="fa fa-caret-right" aria-hidden="true"></i></div>						 \
									<div id="key{0}" class="w3-dropdown-content w3-border ontop">				 \
											<button type="button" class="w3-btn w3-margin" onclick="select(\'ActivateOrOpen\', \'{0}\')">ActivateOrOpen("Window","Program")</button>\
											<br/>																 \
											<button type="button" class="w3-btn w3-margin" onclick="select(\'Send\', \'{0}\')">Send("input")</button>\
											<br/>																 \
											<button type="button" class="w3-btn w3-margin" onclick="select(\'Replace\', \'{0}\')">Replace("input")</button>\
										</div>																	 \
								</div>																			 \																			 \
								<div class="w3-col s2">															 \
									<button type="button" onclick="remove(\'{0}\')" class="w3-btn w3-margin" id="dropdown{0}"><i class="fa fa-times-circle-o" title="Delete \hotkey"></i></button>\
								</div>																			 \
							</div>  																			 \
						</div>																					 \
					</div>																						 \
					'.format(index);
    index += 1;
    count += 1;
    $('#inputLength').val(count);
    $('#hotkeyRegion').append(newDiv)
}