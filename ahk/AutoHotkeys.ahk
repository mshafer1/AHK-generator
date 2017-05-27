#NoEnv  ; Recommended for performance and compatibility with future AutoHotkey releases.
; #Warn  ; Enable warnings to assist with detecting common errors.
SendMode Input  ; Recommended for new scripts due to its superior speed and reliability.
SetWorkingDir %A_ScriptDir%  ; Ensures a consistent starting directory.
setTitleMatchMode, 2 ; set title match mode to 'contains'


^!i::ActivateOrOpen(" - Chrome", "chrome.exe")


ActivateOrOpen(window, program)
{
	;MsgBox The value in the variable named Var is %window%.
	if WinExist(window)
	{
		WinActivate  ; Uses the last found window.
	}
	else
	{
		 Run %program%
		 IfWinNotActive, %window%, , WinActivate, %window%
		 {
			  WinActivate
		 }
	}
	return
}