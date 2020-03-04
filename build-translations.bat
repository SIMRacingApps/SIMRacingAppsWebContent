@echo on
set LANG=%1
del %TMP%\%LANG%.zip
7z a -bb1 -tzip -r %TMP%\%LANG% listing.json *-%LANG%*.properties *-%LANG%*.json
dir %TMP%\%LANG%.zip
pause