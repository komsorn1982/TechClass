@echo off
cd /d D:\techclass
title TechClass Server
echo Starting TechClass. Keep this window open while using the website.
start "TechClass Browser Waiter" /min "D:\techclass\wait-open-techclass.cmd"
call "C:\Program Files\nodejs\npm.cmd" run dev > "D:\techclass\techclass-server.log" 2>&1
echo.
echo TechClass has stopped. Press any key to close.
pause >nul
