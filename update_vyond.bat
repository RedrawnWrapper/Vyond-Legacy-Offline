@echo off
title Vyond Legacy Offline [Updating...]
echo Updating....
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
echo Vyond Legacy Offline has been updated!
pause
