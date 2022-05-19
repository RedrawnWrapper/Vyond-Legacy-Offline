@echo off
title Vyond Legacy Offline [Installing The Portable Installer Of Wrapper: Offline...]
cd %USERPROFILE%\Downloads
if not exist Vyond-Legacy-Offline ( echo You have not downloaded Vyond Legacy Offline using the installer. Please try again later. & pause & exit )
echo Installing The Wrapper: Offline Portable Installer. This Should Take A Few Minutes...
call Vyond-Legacy-Offline\utilities\PortableGit\bin\git.exe clone https://github.com/josephanimate2021/Wrapper-Offline-Portable-Installer.git
cd Wrapper-Offline-Portable-Installer
echo @echo off>> update.bat
echo echo Updating The Porable Installer Of Wrapper: Offline...>> update.bat
echo git pull || git stash & git pull || echo Reseting The Repo And Updating Has Failled. please use the commands listed below. & call cmd.exe>> update.bat
echo echo The Porable Installer Of Wrapper: Offline Has Been Updated>> update.bat
echo pause>> update.bat
echo The Portable Installer Of Wrapper: Offline Has Been Installed.
pause
