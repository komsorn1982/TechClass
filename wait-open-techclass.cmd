@echo off
setlocal
set /a attempts=0
:wait_for_server
curl.exe --silent --fail --max-time 2 http://localhost:3000/ >nul 2>&1
if not errorlevel 1 goto open_site
set /a attempts+=1
if %attempts% geq 120 goto failed
timeout.exe /t 1 /nobreak >nul
goto wait_for_server
:open_site
start "" "http://localhost:3000/"
exit /b 0
:failed
msg.exe * "TechClass ใช้เวลาเริ่มนานเกินไป กรุณาตรวจสอบหน้าต่าง TechClass Server"
exit /b 1
