@echo off
title Vyond Legacy Offline [Updating...]
echo Updating....
:: Save the config in a temp copy before the update.
cd %USERPROFILE%\Downloads\Vyond-Legacy-Offline\utilities
if exist config.bat (
ren config.bat tempconfig.bat
)
cd %USERPROFILE%\Downloads\Vyond-Legacy-Offline
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
:: Delete some modded revision stuff cuz thats not needed to run VLO
pushd wrapper
if exist revision (
rd /q /s revision
)
pushd ..\
echo Vyond Legacy Offline has been updated! Starting Vyond...
PING -n 2 127.0.0.1>nul
