@echo off
echo Starting Dashboard and Bot...
echo.

REM Start Next.js development server in background
echo [1/2] Starting Next.js Dashboard...
start "Dashboard" cmd /k "npm run dev"

REM Wait a moment for the first process to initialize
timeout /t 3 /nobreak >nul

REM Start Discord Bot in background
echo [2/2] Starting Discord Bot...
start "Discord Bot" cmd /k "cd bot && node bot.js"

echo.
echo ✅ Both services are starting...
echo 🌐 Dashboard will be available at: http://localhost:3002
echo 🤖 Bot logs will appear in the Bot window
echo.
echo Press any key to exit this launcher...
pause >nul