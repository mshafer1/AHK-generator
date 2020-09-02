function displayMessage(header, message, ok_action, closable) {
    $('#modalDialogue_okBTN').off();

    var footer = `<div class="w3-center"><button class="w3-btn w3-black" id="modalDialogue_okBTN">OK</button></div>`
    _setup_modal(header, message, footer, closable)
    $('#modalDialogue_okBTN').click(function (){
        _close_modal();
        ok_action();
    });
    _show_modal();
}

function displayYesNoLinks(header, message, ok_dest, no_dest, closable) {
    if(closable === undefined) closable=true;
    $('#modalDialogue_okBTN').off();
    $('#modalDialogue_noBTN').off();

    var footer = `<div class="w3-row-padding">
    <div class="w3-col s2">&nbsp;</div>
    <div class="w3-col s2"><a href="${ok_dest}" class="w3-btn w3-black" id="modalDialogue_okBTN">Yes</a></div>
    
    <div class="w3-col s4">&nbsp;</div>
    
    <div class="w3-col s2"><a href="${no_dest}" class="w3-btn w3-black" id="modalDialogue_noBTN">No</a></div>
    <div class="w3-col s2">&nbsp;</div>

    </div>`
    _setup_modal(header, message, footer, closable)
    _show_modal();
}

function displayYesNo(header, message, ok_action, no_action, closable) {
    if(closable === undefined) closable=true;
    $('#modalDialogue_okBTN').off();
    $('#modalDialogue_noBTN').off();

    var footer = `<div class="w3-row-padding">
    <div class="w3-col s2">&nbsp;</div>
    <div class="w3-col s2"><button class="w3-btn w3-black" id="modalDialogue_okBTN">Yes</button></div>
    
    <div class="w3-col s4">&nbsp;</div>
    
    <div class="w3-col s2"><button class="w3-btn w3-black" id="modalDialogue_noBTN">No</button></div>
    <div class="w3-col s2">&nbsp;</div>

    </div>`
    _setup_modal(header, message, footer, closable)
    $('#modalDialogue_okBTN').click(function (){
        _close_modal();
        ok_action();
    });
    $('#modalDialogue_noBTN').click(function (){
        _close_modal();
        no_action();
    });
    _show_modal();
}

function _setup_modal(header, message, footer, closable) {
    if(closable === undefined) closable=true;

    $('#modalDialogue_header').html(header)
    $('#modalDialogue_message').html(message)
    $('#modalDialogue_footer').html(footer)
    if(closable) {
        $('#modalDialogue_closeSection').show()
    } else {
        $('#modalDialogue_closeSection').hide()
    }
}

function _show_modal() {
    $('#modalDialogue').addClass("w3-show")
}

function _close_modal() {
    $('#modalDialogue').removeClass("w3-show")
}
