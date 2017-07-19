function keygen(data) {
    value = '\
; Header - some configuration                                                               \r\n\
#NoEnv  ; Recommended for performance and compatibility with future AutoHotkey releases.    \r\n\
; #Warn  ; Enable warnings to assist with detecting common errors.                          \r\n\
SendMode Input  ; Recommended for new scripts due to its superior speed and reliability.    \r\n\
SetWorkingDir %A_ScriptDir%  ; Ensures a consistent starting directory.                     \r\n\
setTitleMatchMode, 2 ; set title match mode to "contains"                                   \r\n\
\r\n\r\n; Configured region - selected functions\r\n\r\n'

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

            func = "\r\nreturn";
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
            }

            key += func
        } else {
            // hotstring
            key += ':*c:' + data[i]['skeyValue'] + "::"

            func = "\r\nreturn";
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
            }

            key += func
        }



        value += key + "\r\n\r\n"
    }
    // append custom functions
    value += '\r\n\r\n; Provided Functions -\r\n\r\nActivateOrOpen(window, program)     \r\n\
{                                                                                       \r\n\
	; check if window exists                                                            \r\n\
	if WinExist(window)                                                                 \r\n\
	{                                                                                   \r\n\
		WinActivate  ; Uses the last found window.                                      \r\n\
	}                                                                                   \r\n\
	else                                                                                \r\n\
	{   ; else start requested program                                                  \r\n\
		 Run %program%                                                                  \r\n\
		 IfWinNotActive, %window%, , WinActivate, %window%                              \r\n\
		 {                                                                              \r\n\
			  WinActivate  ; Uses the last found window.                                \r\n\
		 }                                                                              \r\n\
	}                                                                                   \r\n\
	return                                                                              \r\n\
}                                                                                       \r\n\
                                                                                        \r\n\
ActivateOrOpenChrome(tab, url)                                                          \r\n\
{                                                                                       \r\n\
    chrome := "- Google Chrome"                                                         \r\n\
    found := "false"                                                                    \r\n\
    tabSearch := tab                                                                    \r\n\
    curWinNum := 0                                                                      \r\n\
                                                                                        \r\n\
    SetTitleMatchMode, 2                                                                \r\n\
    if WinExist(Chrome)                                                                 \r\n\
	{                                                                                   \r\n\
		WinGet, numOfChrome, Count, %chrome% ; Get the number of chrome windows         \r\n\
		WinActivateBottom, %chrome% ; Activate the least recent window                  \r\n\
		WinWaitActive %chrome% ; Wait until the window is active                        \r\n\
                                                                                        \r\n\
		ControlFocus, Chrome_RenderWidgetHostHWND1 ; Set the focus to tab control ???   \r\n\
                                                                                        \r\n\
		; Loop until all windows are tried, or until we find it                         \r\n\
		while (curWinNum < numOfChrome and found = "false") {                           \r\n\
			WinGetTitle, firstTabTitle, A ; The initial tab title                       \r\n\
			title := firstTabTitle                                                      \r\n\
			Loop                                                                        \r\n\
			{                                                                           \r\n\
				if(InStr(title, tabSearch)>0){                                          \r\n\
					found := "true"                                                     \r\n\
					break                                                               \r\n\
				}                                                                       \r\n\
				Send {Ctrl down}{Tab}{Ctrl up}                                          \r\n\
				Sleep, 50                                                               \r\n\
				WinGetTitle, title, A  ;get active window title                         \r\n\
				if(title = firstTabTitle){                                              \r\n\
					break                                                               \r\n\
				}                                                                       \r\n\
			}                                                                           \r\n\
			WinActivateBottom, %chrome%                                                 \r\n\
			curWinNum := curWinNum + 1                                                  \r\n\
		}                                                                               \r\n\
	}                                                                                   \r\n\
                                                                                        \r\n\
    ; If we did not find it, start it                                                   \r\n\
    if(found = "false"){                                                                \r\n\
        Run chrome.exe "%url%"                                                          \r\n\
    }                                                                                   \r\n\
	return                                                                              \r\n\
}                                                                                       \r\n\
                                                                                        \r\n\
SendUnicodeChar(charCode)					                                            \r\n\
{											                                            \r\n\
	VarSetCapacity(ki, 28 * 2, 0)			                                            \r\n\
	EncodeInteger(&ki + 0, 1)				                                            \r\n\
	EncodeInteger(&ki + 6, charCode)		                                            \r\n\
	EncodeInteger(&ki + 8, 4)				                                            \r\n\
	EncodeInteger(&ki +28, 1)				                                            \r\n\
	EncodeInteger(&ki +34, charCode)		                                            \r\n\
	EncodeInteger(&ki +36, 4|2)				                                            \r\n\
											                                            \r\n\
	DllCall("SendInput", "UInt", 2, "UInt", &ki, "Int", 28)	                            \r\n\
}											                                            \r\n\
											                                            \r\n\
EncodeInteger(ref, val)						                                            \r\n\
{											                                            \r\n\
	DllCall("ntdll\\RtlFillMemoryUlong", "Uint", ref, "Uint", 4, "Uint", val)           \r\n\
}                                                                                       \r\n\
'

    //return script
    return value
}