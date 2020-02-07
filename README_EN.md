## Thanks
The original author `@erguotou520` deleted and stopped developing this ssr-python-based GUI on May 15, 2019, thanks for his contributions

## Precautions
-Built-in http_proxy, if you need to use other similar proxy at the same time, please configure it as needed <br>
-This application uses `gsetting` to set the system proxy, so some Linux can't use it. Manually set the system proxy <br>
-`Firefox` need to **change the proxy mode** in the browser settings to use the system proxy or set it manually <br>
-`Chrome` uses system proxy by default <br>
-For macOS 10.15.3 (Catalina), ** 19D62e ** and above beta versions, please use the system's proxy
-`Spotlight` (** ⌘-Space **) is not supported in this version
-Windows switching global proxy does not take effect

## What's New
-Add the 0.2.5 installation package released by the original author. If it is not released in the release, please visit the folder [0.2.5App] (https://github.com/CharlotteFallices/electron-ssr-backup/tree/master/releases)

## Download
Please try the `0.2.6 version` first [Github release] (https://github.com/CharlotteFallices/electron-ssr-backup/releases/tag/v0.2.6)

## Issues

-Please search the issue for similar issues before posting them <br>
-Post a bug issue, please describe your environment in detail <br>
-Welcome to write your experience in issues, including how to solve errors, rely on setting proxy, etc. <br>
-Reasonable issues will be collected in the project code

## How To Add

-Add configuration manually
-Server subscription updates
-QR code scanning (make sure there is only one valid QR code on the screen)
-Import from clipboard, profile
-Add configuration from ss / ssr link (Mac and Windows only)

## Features
-Create configuration QR code, ssr license link
-Support PAC, built-in http_proxy can be turned off in options (** ⌘-, **)

## Configuration file location

-Windows`C://Users/{username}/AppData/Roaming/electron-ssr/gui-config.json`
-macOS`~ /Library/Application Support/electron-ssr/gui-config.json`
-Linux`~/.config/gui-config.json`

## Hot-key

The shortcut key was added to solve the problem that some Linux distributions cannot display the icon and cause the function to be unavailable. At the same time, it supports the operation of turning on/off and changing the keys in the settings.
-`⌘/⌃-Shift-W` to open the main window.
-`⌘/⌃-Shift-B` toggles whether to display the operation menu, only available on Linux.

## Pull Reuests
 Please use  `npm run lint` to check your code.
