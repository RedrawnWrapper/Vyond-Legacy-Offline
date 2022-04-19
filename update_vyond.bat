@echo off
title Vyond Legacy Offline [Updating...]
echo Updating....
git pull
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
