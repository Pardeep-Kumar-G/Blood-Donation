@echo off
echo ========================================
echo     LifeFlow - Blood Donation Platform
echo ========================================
echo.

echo Starting Backend Server...
cd Backend
start "LifeFlow Backend" cmd /k "npm start"
timeout /t 3 /nobreak > nul

echo.
echo Backend started at http://localhost:5000
echo.
echo Opening Frontend...
cd ..\Frontend

REM Try to find and use Chrome
set CHROME="C:\Program Files\Google\Chrome\Application\chrome.exe"
if exist %CHROME% (
    start "" %CHROME% "Project_C.html"
) else (
    REM Fall back to default browser
    start "" "Project_C.html"
)

echo.
echo ========================================
echo LifeFlow is now running!
echo Backend API: http://localhost:5000/api
echo.
echo Press any key to stop all servers...
pause > nul

echo.
echo Stopping servers...
taskkill /FI "WINDOWTITLE eq LifeFlow Backend*" /T /F > nul 2>&1

echo Servers stopped. Goodbye!
timeout /t 2 /nobreak > nul
