function keygen(data) {
    value = '\
#NoEnv  ; Recommended for performance and compatibility with future AutoHotkey releases.    \n\
; #Warn  ; Enable warnings to assist with detecting common errors.                          \n\
SendMode Input  ; Recommended for new scripts due to its superior speed and reliability.    \n\
SetWorkingDir %A_ScriptDir%  ; Ensures a consistent starting directory.                     \n\
setTitleMatchMode, 2 ; set title match mode to "contains"                                   \n\
\n\n'


    //value = 'test\ncheck'
    // load in data
    console.log(data)
    for (i in data) {
        console.log("Key " + i)
        key = ''

        console.log(data[i])

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

            key += data[i]['skeyValue']
            key += '::'

            func = "\nreturn";
            option = data[i]['option'];
            if (option == 'Send' || option == 'Replace') { // replace doesn't make sense for hotkey, so treat like send
                func = 'send, ' + data[i]["input"];
            } else if (option == 'ActivateOrOpen') {
                func = 'ActivateOrOpen("' + data[i]["Window"] + '", "' + data[i]["Program"] + '")';
            } else if (option == 'ActivateOrOpenChrome') {
                func = 'ActivateOrOpenChrome("' + data[i]["Window"] + '", "' + data[i]["Program"] + '")';
            } else if (option == 'Custom') {
                func = data[i]['Code']
            }

            key += func
        } else {
            // hotstring
            key += ':*:' + data[i]['skeyValue'] + "::"

            func = "\nreturn";
            if (option == 'Send') { // replace doesn't make sense for hotkey, so treat like send
                func = 'send, ' + data[i]["input"];
            } else if (option == 'ActivateOrOpen') {
                func = 'ActivateOrOpen("' + data[i]["Window"] + '", "' + data[i]["Program"] + '")';
            } else if (option == 'Replace') {
                func = data[i]["input"];
            } else if (option == 'ActivateOrOpenChrome') {
                func = 'ActivateOrOpenChrome("' + data[i]["Window"] + '", "' + data[i]["Program"] + '")';
            } else if (option == 'Custom') {
                func = data[i]['Code']
            }

            key += func
        }



        value += key + "\n\n"
    }
    // append custom functions
    value += 'ActivateOrOpen(window, program)                   \n\
{                                                               \n\
	; check if window exists                                    \n\
	if WinExist(window)                                         \n\
	{                                                           \n\
		WinActivate  ; Uses the last found window.              \n\
	}                                                           \n\
	else                                                        \n\
	{   ; else start requested program                          \n\
		 Run %program%                                          \n\
		 IfWinNotActive, %window%, , WinActivate, %window%      \n\
		 {                                                      \n\
			  WinActivate  ; Uses the last found window.        \n\
		 }                                                      \n\
	}                                                           \n\
	return                                                      \n\
}                                                               \n\
                                                                \n\
ActivateOrOpenChrome(tab, url)                                  \n\
{                                                               \n\
    chrome := "- Google Chrome"                                 \n\
    found := "false"                                            \n\
    tabSearch := tab                                            \n\
    curWinNum := 0                                              \n\
                                                                \n\
    SetTitleMatchMode, 2                                        \n\
    if WinExist(Chrome)                                         \n\
	{                                                           \n\
		WinGet, numOfChrome, Count, %chrome% ; Get the number of chrome windows         \n\
		WinActivateBottom, %chrome% ; Activate the least recent window                  \n\
		WinWaitActive %chrome% ; Wait until the window is active                        \n\
                                                                                        \n\
		ControlFocus, Chrome_RenderWidgetHostHWND1 ; Set the focus to tab control ???   \n\
                                                                                        \n\
		; Loop until all windows are tried, or until we find it                         \n\
		while (curWinNum < numOfChrome and found = "false") {                           \n\
			WinGetTitle, firstTabTitle, A ; The initial tab title                       \n\
			title := firstTabTitle                                                      \n\
			Loop                                                                        \n\
			{                                                                           \n\
				if(InStr(title, tabSearch)>0){                                          \n\
					found := "true"                                                     \n\
					break                                                               \n\
				}                                                                       \n\
				Send {Ctrl down}{Tab}{Ctrl up}                                          \n\
				Sleep, 50                                                               \n\
				WinGetTitle, title, A  ;get active window title                         \n\
				if(title = firstTabTitle){                                              \n\
					break                                                               \n\
				}                                                                       \n\
			}                                                                           \n\
			WinActivateBottom, %chrome%                                                 \n\
			curWinNum := curWinNum + 1                                                  \n\
		}                                                                               \n\
	}                                                                                   \n\
                                                                                        \n\
    ; If we did not find it, start it                                                   \n\
    if(found = "false"){                                                                \n\
        Run chrome.exe %url%                                                            \n\
    }                                                                                   \n\
	return                                                                              \n\
}                                                                                       \n\
                                                                                        \n\
SendUnicodeChar(charCode)					                                            \n\
{											                                            \n\
	VarSetCapacity(ki, 28 * 2, 0)			                                            \n\
	EncodeInteger(&ki + 0, 1)				                                            \n\
	EncodeInteger(&ki + 6, charCode)		                                            \n\
	EncodeInteger(&ki + 8, 4)				                                            \n\
	EncodeInteger(&ki +28, 1)				                                            \n\
	EncodeInteger(&ki +34, charCode)		                                            \n\
	EncodeInteger(&ki +36, 4|2)				                                            \n\
											                                            \n\
	DllCall("SendInput", "UInt", 2, "UInt", &ki, "Int", 28)	                            \n\
}											                                            \n\
											                                            \n\
EncodeInteger(ref, val)						                                            \n\
{											                                            \n\
	DllCall("ntdll\RtlFillMemoryUlong", "Uint", ref, "Uint", 4, "Uint", val)            \n\
}                                                                                       \n\
'

    //return script
    return value
}