# AHK-generator
A single page website to provide a UI for the 3 most common uses for AHK and defining custom hotstrings and hotkeys to trigger them.
Published under MIT License.
Available at <http://ahkgen.com>


# Project dependencies
This project relies on a couple of open source libraries
 
### JQuery
#### License:
[jquery.org/license](https://jquery.org/license "JQuery license page")
#### Using:
Version - v1.12.2
#### Use:
In page manipulation

### W3 CSS
#### License:
[No license is necessary.](https://www.w3schools.com/w3css/ "W3 CSS home page")
#### Using:
Version - 2.64
#### Use:
Styling

### [Font Awesome](http://fontawesome.io/icons)
#### License:
[MIT License](https://opensource.org/licenses/MIT "OpenSource.org page" )
#### Using:
Version - 4.6.3
#### Use:
Icons

# Usage
* Go to <http://ahkgen.com>
* Choose between Hotkey or Hotstring

   *Hotkey* is used for a key combination pressed at once (i.e. CTRL + SHIFT + I)
   *Hotstring* is used for a series of keys pressed in order (i.e. ;internet)

* Enter trigger value
    For hotkey, select whether CTRL, SHIFT, and/or ALT must also be pressed and enter the key to be hit
    For hotstring, enter the value to be typed

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
    Custom
        A sandbox for creating your own usage of the hotkey/hotstring