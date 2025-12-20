@echo off
echo ========================================
echo   SmartQ Allotment Management System
echo ========================================
echo.
echo Starting Backend Server...
start "Backend Server" cmd /k "cd /d %~dp0backend && npm run dev"

timeout /t 3 /nobreak > nul

echo Starting Frontend Server...
start "Frontend Server" cmd /k "cd /d %~dp0frontend && npm run dev"

echo.
echo ========================================
echo   Servers are starting...
echo   Backend: http://localhost:5000
echo   Frontend: http://localhost:5173
echo ========================================
echo.
echo Opening browser in 5 seconds...
timeout /t 5 /nobreak > nul
start http://localhost:5173

echo.
echo Servers are running! You can close this window.
pause
