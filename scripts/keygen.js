function keygen(data) {
    value = '\
#NoEnv  ; Recommended for performance and compatibility with future AutoHotkey releases.    \n\
; #Warn  ; Enable warnings to assist with detecting common errors.                          \n\
SendMode Input  ; Recommended for new scripts due to its superior speed and reliability.    \n\
SetWorkingDir %A_ScriptDir%  ; Ensures a consistent starting directory.                     \n\
setTitleMatchMode, 2 ; set title match mode to "contains"                                   \n'


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

            func = "return";
            if (data[i]['option'] == 'Send' || data[i]['option'] == 'Replace') { // replace doesn't make sense for hotkey, so treat like send
                func = 'send, ' + data[i]["input"];
            } else if (data[i]['option'] == 'ActivateOrOpen') {
                func = 'ActivateOrOpen("' + data[i]["Window"] + '", "' + data[i]["Program"] + '")';
            }

            key += func
        } else {
            // hotstring
            key += ':*:' + data[i]['skeyValue'] + "::"

            func = "return";
            if (data[i]['option'] == 'Send') { // replace doesn't make sense for hotkey, so treat like send
                func = 'send, ' + data[i]["input"];
            } else if (data[i]['option'] == 'ActivateOrOpen') {
                func = 'ActivateOrOpen("' + data[i]["Window"] + '", "' + data[i]["Program"] + '")';
            } else if (data[i]['option'] == 'Replace') {
                func = data[i]["input"];
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
}'

    //return script
    return value
}