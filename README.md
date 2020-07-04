# AHK-generator

[![Coverage Status](https://coveralls.io/repos/github/mshafer1/AHK-generator/badge.svg?branch=master)](https://coveralls.io/github/mshafer1/AHK-generator?branch=master)

A single page website to provide a UI for the some of the most common uses for [Auto Hotkey](https://autohotkey.com/ "Autohotkey.com") and defining custom hotstrings and hotkeys to trigger them.
Published under MIT License.
Available at <http://ahkgen.com>


# Usage
* Go to <http://ahkgen.com>
* Choose between Hotkey or Hotstring

   * *Hotkey* is used for a key combination pressed at once (i.e. CTRL + SHIFT + I)
   
   * *Hotstring* is used for a series of keys pressed in order (i.e. ;internet)

* Enter trigger value
    * For hotkey, select whether CTRL, SHIFT, Windows, and/or ALT must also be pressed and enter the key to be hit
    * For hotstring, enter the value to be typed

* Select a function

    ActivateOrOpen

        Brings a program whose title matches the Window (defaulting to 'contains' mode) to the front or runs the Program

    Send

        Sends input (types for you)

    Replace

        Removes what was just typed (for hotstring, treated like send for hotkey) and sends the value

    SendUnicodeChar

        Sends the unicode character given the UTF-16 value

    ActivateOrOpenChrome

        Searches through Chrome windows/tabs for tab with provided name - opens chrome.exe "url" if not found

    OpenConfig

        Open this config page in default browser

    Custom

        A sandbox for creating your own usage of the hotkey/hotstring

* Add more keys by pressing the "+" button at the bottom

* Remove rows by clicking the "x" button on the right

* Click submit to reload page and generate code. (download will be available once reloded)

* Share/save configuration by sending URL


# Project dependencies
This project relies on a couple of open source libraries

| Project | License | Version in use | Where used | 
 --- | --- | --- | --- |
 Jquery | [jquery.org/license](https://jquery.org/license "JQuery license page") | v1.12.2 | In page manipulation
 W3 CSS | [No license is necessary.](https://www.w3schools.com/w3css/ "W3 CSS home page") | 2.64 | Styling
 [Font Awesome](http://fontawesome.io/icons) | [MIT License](https://opensource.org/licenses/MIT "OpenSource.org page" ) | 5.13.0 | Icons
[highlight.js](https://highlightjs.org/) | [BSD 3 License](https://github.com/isagalaev/highlight.js/blob/master/LICENSE "Github License page") | 9.12.0 | Syntax highlighting