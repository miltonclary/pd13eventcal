@echo off
echo ========================================
echo PD13 Event Calendar Server Restart
echo ========================================
echo.

echo Stopping any existing Node.js processes...
taskkill /f /im node.exe 2>nul
timeout /t 2 /nobreak >nul

echo.
echo Starting PD13 Event Calendar Server...
echo Server will be available at: http://10.172.1.63:3000
echo.

node server.js

pause