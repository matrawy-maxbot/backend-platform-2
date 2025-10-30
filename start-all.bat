@echo off
echo Starting Discord Dashboard and Bot...
echo.

echo Starting Next.js Development Server...
start "Next.js Dev" cmd /k "npm run dev"

echo Waiting 5 seconds before starting bot...
timeout /t 5 /nobreak > nul

echo Starting Discord Bot...
start "Discord Bot" cmd /k "npm run bot"

echo.
echo Both services are starting...
echo - Next.js Dashboard: http://localhost:3002
echo - Discord Bot: Running in background
echo.
echo Press any key to exit...
pause > nul