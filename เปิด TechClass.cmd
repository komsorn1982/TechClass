@echo off
setlocal
cd /d "%~dp0"

title TechClass Server - keep this window open
echo Starting TechClass...
echo Keep this window open while using the website.
start "" wscript.exe "%~dp0เปิด TechClass.vbs"
call npm.cmd run dev
echo.
echo TechClass has stopped. Press any key to close this window.
pause >nul
endlocal
