basic_url = "/?length=1&comment0=test+comment&func0=KEY&skey0%5B%5D=CTRL&skey0%5B%5D=ALT&skeyValue0=i&Window0=ahk_exe+chrome.exe&Program0=chrome.exe&option0=ActivateOrOpen"
basic_hotstring_url = (
    "/?indexes=0&comment0=&func0=STRING&skeyValue0=btw&input0=by+the+way&option0=Replace"
)


public_examples = [
    "/?length=2&comment0=CTRL+++ALT+++M+%3D+main.vi+%28if+open%29&func0=KEY&skey0%5B%5D=CTRL&skey0%5B%5D=ALT&skeyValue0=m&Code0=%0D%0A+++if+WinExist%28%22Robot+Main.vi%22%29%0D%0A+++%7B%0D%0A++++++WinActivate%3B+Uses+the+last+found+window.%0D%0A+++%7D%0D%0A+++return&option0=Custom&comment1=CTRL+++ALT+++D+%3D+Driver+Station&func1=KEY&skey1%5B%5D=CTRL&skey1%5B%5D=ALT&skeyValue1=d&Window1=ahk_exe+DriverStation.exe&Program1=C%3A%5CProgram+Files+%28x86%29%5CFRC+Driver+Station%5CDriverstation.exe&option1=ActivateOrOpen",
    "/?length=1&comment0=%3B+CTRL+%2B+Shift+%2B+c+%3D+copy+to+next+window&func0=KEY&skeyValue0=%24%5E%2Bc&Code0=%0D%0A++++Loop%2C+1+%3B+increase+this+to+repeat+multiple+times%0D%0A++++%7B%0D%0A++++++Send%2C+%5Ec%0D%0A++++++Sleep%2C+300+%3B+let+Windows+do+its+thing%0D%0A++++++%3B+Because+Excel+copies+cells+with+an+endline%2C+trim+the+clipboard%0D%0A++++++clipboard+%3A%3D+Trim%28clipboard%2C+OmitChars+%3A%3D+%22+%60n%60r%60t%22%29%0D%0A++++++Send%2C+%21%7BTab%7D%0D%0A++++++Sleep%2C+300+%3B+let+Windows+catch+up%0D%0A++++++Send%2C+%5Ea%0D%0A++++++Send%2C+%5Ev%0D%0A++++++Sleep%2C+300+%3B+let+Windows+do+its+thing%0D%0A++++++Send%2C+%7BReturn%7D%0D%0A++++++Send%2C+%21%7BTab%7D%0D%0A++++++Sleep%2C+30+%3B+let+Windows+do+its+thing%0D%0A++++++Send%2C+%7BReturn%7D+%3B+Excel+wants+to+have+it+clearly+indicated+that+the+copy+command+is+finished%0D%0A++++++Send%2C+%7BDown%7D%0D%0A++++%7D%0D%0A++++return&option0=Custom",
    "/?length=1&comment0=&func0=KEY&skeyValue0=F3&Code0=%0D%0A+next+%3D+GetNextProgram%28%29%0D%0A+get_exe_name+%3D++GetExe%28next%29%3B%0D%0A+MsgBox%2C+Next+Program%3A+%25next%25%60nExe%3A+%25get_exe_name%25%0D%0A+ActivateOrOpen%28next%2C+get_exe_name%29%3B%0D%0A+return%0D%0A%0D%0AGetNextProgram%28%29+%7B%0D%0A+if+WinActive%28%22ahk_class+excel.exe%22%29+%7B+return+%22ahk_exe+outloo.exe%22%7D%0D%0A+if+WinActive%28%22ahk_exe+sage%22%29+%7Breturn+%22ahk_class+MozillaWindowClass%22%7D%0D%0A%7D%0D%0A%0D%0AGetExe%28program%29+%7B%0D%0A+if+%28program+%3D+%22ahk_exe+excel.exe%22%29+%7B+return+%22excel.exe%22%7D%0D%0A+if+%28porgram+%3D+%22ahk_exe+outlook.exe%22%29+%7Breturn+%22outlook.exe%22%7D%0D%0A+if+%28program+%3D+%22ahk_class+MozillaWindowClass%22%29+%7B+return+%22Mozilla.exe%22%7D%3B%0D%0A%7D%0D%0A%0D%0A+%0D%0A+&option0=Custom",
    "/?length=1&comment0=&func0=KEY&skeyValue0=LButton&input0=12345rt&option0=Send",
    "/?length=1&comment0=&func0=KEY&skeyValue0=SC002&Code0=%0D%0A+++++Loop%2C+%3B+loop+forever%0D%0A+++++++++Send%2C+d%0D%0A+++++++++Sleep%2C+7000+%3B+7%2C000+ms+%3D+7+s%0D%0A+++++++++MouseMove%2C+0%2C70%2C%2CR+%3B+move+the+mouse+70+pixels+relative+to+current+position%0D%0A+++++++++Click%0D%0A+++++++++Send%2C+d%0D%0A+++++++++MouseMove%2C+0%2C-70%2C%2CR+%3B+move+the+mouse+70+pixels+relative+to+current+position&option0=Custom",
    "/?length=1&comment0=&func0=KEY&skey0[]=ALT&skeyValue0=F12&input0=%E2%98%BA%E2%99%A5%E2%98%BA&option0=Send",
    "/?length=6&comment0=&func0=KEY&skeyValue0=1&input0=%E2%9A%80&option0=Replace&comment1=&func1=KEY&skeyValue1=2&input1=%E2%9A%81&option1=Replace&comment2=&func2=KEY&skeyValue2=3&input2=%E2%9A%82&option2=Replace&comment3=&func3=KEY&skeyValue3=4&input3=%E2%9A%83&option3=Replace&comment4=&func4=KEY&skeyValue4=5&input4=%E2%9A%84&option4=Replace&comment5=&func5=KEY&skeyValue5=6&input5=%E2%9A%85&option5=Replace",
    "/?length=1&comment0=focus+gimp&func0=KEY&skey0[]=CTRL&skey0[]=ALT&skeyValue0=g&Window0=ahk_exe+gimp.exe&Program0=gimp.exe&option0=ActivateOrOpen",
    "/?length=2&comment0=&func0=KEY&skeyValue0=LButton&input0=k&option0=Send&comment1=&func1=KEY&skeyValue1=RButton&input1=l&option1=Send",
    "/?length=1&comment0=&func0=KEY&skey0[]=ALT&skeyValue0=F12&input0=gds&option0=Send",
    "/?length=1&comment0=&func0=KEY&skey0[]=CTRL&skey0[]=ALT&skeyValue0=t&Window0=Windows+Terminal&Program0=wt&option0=ActivateOrOpen",
    "/?length=1&comment0=&func0=KEY&skey0[]=CTRL&skey0[]=SHIFT&skeyValue0=q&input0=testing!&option0=Send",
    "/?length=1&comment0=&func0=KEY&skeyValue0=MButton&Code0=Send+{PgDn}&option0=Custom",
    "/?length=1&comment0=&func0=STRING&skeyValue0=+fs&input0=^s&option0=Send",
    "/?length=1&comment0=&func0=STRING&skeyValue0=afaik&input0=As+far+as+I+Know&option0=Send",
    "/?length=1&comment0=CTRL+++ALT+++M+=+calendar&func0=KEY&skey0[]=CTRL&skey0[]=ALT&skey0[]=WIN&skeyValue0=q&Window0=Red+Hat+-+Calendar&Program0=https://calendar.google.com/calendar/r/week&option0=ActivateOrOpenChrome",
    "/?length=1&comment0=CTRL+ALT+WIN+W%3DGmail&func0=KEY&skey0%5B%5D=CTRL&skey0%5B%5D=ALT&skey0%5B%5D=WIN&skeyValue0=w&Window0=Inbox&Program0=https%3A%2F%2Fmail.google.com%2Fmail%2Fu%2F0%2F%23inbox&option0=ActivateOrOpenChrome#inbox&option2=ActivateOrOpenChrome",
]

basic_test_cases = {
    "base": "/",
    "btw__by_the_way": "/?length=1&comment0=&func0=STRING&skeyValue0=btw&input0=by+the+way&option0=Replace",
    "btw__by_the_way_commented": "/?length=1&comment0=btw+%3D+by+the+way&func0=STRING&skeyValue0=btw&input0=by+the+way&option0=Replace",
    "ctrl_alt_i__chrome": "/?length=1&comment0=&func0=KEY&skey0%5B%5D=CTRL&skey0%5B%5D=ALT&skeyValue0=i&Window0=ahk_exe+chrome.exe&Program0=chrome.exe&option0=ActivateOrOpen",
    "implies__send_unicode_char": "/?length=1&comment1=%22%3Bimplies%22+is+replaced+with+an+arrow&func1=STRING&skeyValue1=%3Bimplies&input1=0x2192&option1=SendUnicodeChar",
    "config__open_config": "/?length=1&comment0=%3Bconfig+%3D+open+this+page&func0=STRING&skeyValue0=%60%3Bconfig&option0=OpenConfig",
    "LButton__send_input": "/?length=1&comment0=&func0=KEY&skeyValue0=LButton&input0=b&option0=Send",
    "pandora__activate_or_open_chrome__pandora_com": "/?length=1&comment0=&func0=STRING&skeyValue0=%60%3Bpandora&Window0=pandora&Program0=http%3A%2F%2Fwww.pandora.com&option0=ActivateOrOpenChrome",
    "ctrl_shift_g__custom_code__google_selected_text": "/?length=1&comment17=CTRL+%2B+Shift+%2B+g+%3D+search+Google+for+the+highlighted+text&func17=KEY&skey17%5B%5D=CTRL&skey17%5B%5D=SHIFT&skeyValue17=g&Code17=%0D%0ASend%2C+%5Ec%0D%0ASleep+50%0D%0ARun%2C+http%3A%2F%2Fwww.google.com%2Fsearch%3Fq%3D%25clipboard%25%0D%0AReturn&option17=Custom",
}
