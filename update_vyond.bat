@echo off
title Vyond Legacy Offline [Updating...]
echo Updating....
:: Save the config in a temp copy during the update.
pushd utilities
if exist config.bat (
ren config.bat tempconfig.bat
)
pushd ..\
git pull
:: Delete any files added when the online lvm feature and debug mode is turned on.
pushd wrapper
if exist config-offline.json (
if exist config-online.json (
del config-online.json
)
)
if exist env-nodebug.json (
if exist env-debug.json (
del env-debug.json
)
)
pushd ..\
if exist 405-error-redirect-fix.js (
del 405-error-redirect-fix.js
)
:: Rename the temp copy of the config.bat file to the main copy of the config.bat file after the update.
pushd utilities
if exist tempconfig.bat (
if exist config.bat (
del config.bat
)
ren tempconfig.bat config.bat
)
pushd ..\
echo Vyond Legacy Offline has been updated!
pause
