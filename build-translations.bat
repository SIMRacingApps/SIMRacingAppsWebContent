@echo on
set LANG=de
del %LANG%.zip
..\..\..\..\PortableApps\7-ZipPortable\App\7-Zip64\7z a -tzip -r %LANG% listing.json *-%LANG%.properties *-%LANG%.json
pause