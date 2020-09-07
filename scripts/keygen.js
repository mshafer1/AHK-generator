// from https://stackoverflow.com/a/31221374/8100990
if (!String.prototype.includes) {
    String.prototype.includes = function() {
        'use strict';
        return String.prototype.indexOf.apply(this, arguments) !== -1;
    };
}

// from https://stackoverflow.com/a/39744409/8100990
if (!Array.prototype.includes) {
    Object.defineProperty(Array.prototype, "includes", {
        enumerable: false,
        value: function(obj) {
            var newArr = this.filter(function(el) {
                return el == obj;
            });
            return newArr.length > 0;
        }
    });
}

function keygen(data) {
    console.log("Keygen: ")
    console.log(data)
    value = `
; *********************** Header - some configuration  ***********************
#NoEnv  ; Recommended for performance and compatibility with future AutoHotkey releases.
; #Warn  ; Enable warnings to assist with detecting common errors. (disabled by default)
SendMode Input  ; Recommended for new scripts due to its superior speed and reliability.
SetWorkingDir %A_ScriptDir%  ; Ensures a consistent starting directory.
setTitleMatchMode, 2 ; set title match mode to "contains"

; this code was auto generated at:
; ${document.location.toString()}

; *********************** Configured region - selected functions ************

`

    // load in data
    //console.log(data)
    for (i in data) {
        //console.log("Key " + i)
        key = ''

        //console.log(data[i])

        if (data[i]['func'] == 'KEY') {
            // hotkey
            if (data[i]['modifiers[]'].includes('CTRL')) {
                key += '^'
            }
            if (data[i]['modifiers[]'].includes('SHIFT')) {
                key += '+'
            }
            if (data[i]['modifiers[]'].includes('ALT')) {
                key += '!'
            }
            if (data[i]['modifiers[]'].includes('WIN')) {
                key += '#'
            }

            key += data[i]['skeyValue']
            key += '::'

            func = "\r\n    return";
            option = data[i]['option'];
            if (option == 'Send' || option == 'Replace') { // replace doesn't make sense for hotkey, so treat like send
                func = 'send, ' + data[i]["input"];
            } else if (option == 'ActivateOrOpen') {
                func = 'ActivateOrOpen("' + data[i]["Window"] + '", "' + data[i]["Program"] + '")';
            } else if (option == 'ActivateOrOpenChrome') {
                func = 'ActivateOrOpenChrome("' + data[i]["Window"] + '", "' + data[i]["Program"] + '")';
            } else if (option == 'Custom') {
                func = data[i]['Code']
            } else if (option == 'SendUnicodeChar') {
                func = 'SendUnicodeChar(' + data[i]['input'] + ')';
            } else if (option == 'LockWorkStation') {
                func = `LockWorkStation()`;
            } else if (option == 'TurnMonitorsOff') {
                func = `TurnMonitorsOff()`;
            } else if(option == 'OpenConfig') {
                func = '\r\nOpenConfig()\r\nreturn';
            }

            key += func
        } else {
            // hotstring
            key += ':*c:' + data[i]['skeyValue'] + "::"
            option = data[i]['option'];
            func = "\r\n    return";
            if (option == 'Send') { // replace doesn't make sense for hotkey, so treat like send
                func = '\r\nsend, ' + data[i]["input"] + '\r\nreturn';
            } else if (option == 'ActivateOrOpen') {
                func = '\r\nActivateOrOpen("' + data[i]["Window"] + '", "' + data[i]["Program"] + '")\r\nreturn';
            } else if (option == 'Replace') {
                func = data[i]["input"];
            } else if (option == 'ActivateOrOpenChrome') {
                func = '\r\nActivateOrOpenChrome("' + data[i]["Window"] + '", "' + data[i]["Program"] + '")\r\nreturn';
            } else if (option == 'Custom') {
                func = data[i]['Code']
            } else if (option == 'SendUnicodeChar') {
                func = '\r\nSendUnicodeChar(' + data[i]['input'] + ')\r\nreturn';
            } else if(option == 'OpenConfig') {
                func = '\r\nOpenConfig()\r\nreturn';
            }

            key += func
        }

        if ('comment' in data[i]) {
            key = ';' + data[i]['comment'] + '\r\n' + key;
        }

        value += key + "\r\n\r\n"
    }
    // append custom functions
    value += `
; *********************** Provided Functions ********************************
OpenConfig()
{
    Run, "${document.location.toString().replace(/\%/g, '`%')}"
}

LockWorkStation()
{
    DllCall("LockWorkStation")
}

TurnMonitorsOff()
{
    ; from http://autohotkey.com/board/topic/105261-turn-monitor-off-even-when-using-the-computer/?p=642266
    SendMessage,0x112,0xF170,2,,Program Manager
}

ActivateOrOpen(window, program)
{
	; check if window exists
	if WinExist(window)
	{
		WinActivate  ; Uses the last found window.
	}
	else
	{   ; else start requested program
		 Run cmd /c "start ^"^" ^"%program%^""
		 WinWait, %window%,,5		; wait up to 5 seconds for window to exist
		 IfWinNotActive, %window%, , WinActivate, %window%
		 {
			  WinActivate  ; Uses the last found window.
		 }
	}
	return
}

ActivateOrOpenChrome(tab, url)
{
    Transform, url, Deref, "%url%" ;expand variables inside url
    Transform, tab, Deref, "%tab%" ;expand variables inside tab
    chrome := "- Google Chrome"
    found := "false"
    tabSearch := tab
    curWinNum := 0

    SetTitleMatchMode, 2
    if WinExist(Chrome)
	{
		WinGet, numOfChrome, Count, %chrome% ; Get the number of chrome windows
		WinActivateBottom, %chrome% ; Activate the least recent window
		WinWaitActive %chrome% ; Wait until the window is active

		ControlFocus, Chrome_RenderWidgetHostHWND1 ; Set the focus to tab control ???

		; Loop until all windows are tried, or until we find it
		while (curWinNum < numOfChrome and found = "false") {
			WinGetTitle, firstTabTitle, A ; The initial tab title
			title := firstTabTitle
			Loop
			{
				if(InStr(title, tabSearch)>0){
					found := "true"
					break
				}
				Send {Ctrl down}{Tab}{Ctrl up}
				Sleep, 50
				WinGetTitle, title, A  ;get active window title
				if(title = firstTabTitle){
					break
				}
			}
			WinActivateBottom, %chrome%
			curWinNum := curWinNum + 1
		}
	}

    ; If we did not find it, start it
    if(found = "false"){
        Run chrome.exe "%url%"
    }
	return
}

; from https://stackoverflow.com/a/28448693
SendUnicodeChar(charCode)
{
    ; if in unicode mode, use Send, {u+####}, else, use the encode method.
    if A_IsUnicode = 1
    {
        Send, {u+%charCode%}
    }
    else
    {
        VarSetCapacity(ki, 28 * 2, 0)
        EncodeInteger(&ki + 0, 1)
        EncodeInteger(&ki + 6, charCode)
        EncodeInteger(&ki + 8, 4)
        EncodeInteger(&ki +28, 1)
        EncodeInteger(&ki +34, charCode)
        EncodeInteger(&ki +36, 4|2)

        DllCall("SendInput", "UInt", 2, "UInt", &ki, "Int", 28)
    }
}

EncodeInteger(ref, val)
{
	DllCall("ntdll\\RtlFillMemoryUlong", "Uint", ref, "Uint", 4, "Uint", val)
}
`

    //return script
    return value
}
