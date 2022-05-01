@echo off
title Vyond Legacy Offline [Installing The Portable Installer Of Wrapper: Offline...]
echo Installing The Wrapper: Offline Portable Installer. This Should Take A Few Minutes...
cd %USERPROFILE%\Downloads
call Vyond-Legacy-Offline\utilities\PortableGit\bin\git.exe clone https://github.com/josephanimate2021/Wrapper-Offline-Portable-Installer.git
cd Wrapper-Offline-Portable-Installer
echo echo Updating The Porable Installer Of Wrapper: Offline...>> update.bat
echo git pull>> update.bat
echo echo The Porable Installer Of Wrapper: Offline Has Been Updated>> update.bat
echo pause>> update.bat
echo The Portable Installer Of Wrapper: Offline Has Been Installed.
pause
