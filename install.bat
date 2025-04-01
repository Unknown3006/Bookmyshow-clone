@echo off
echo BookMyShow Clone - Installation
echo ------------------------------
echo.

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
  echo ERROR: Node.js is not installed or not in PATH!
  echo Please install Node.js from https://nodejs.org/
  echo.
  pause
  exit /b 1
)

REM Check Node.js version
for /f "tokens=*" %%i in ('node -v') do set NODE_VERSION=%%i
echo Node.js version: %NODE_VERSION% detected

REM Install backend dependencies
echo.
echo Installing backend dependencies...
call npm install
if %ERRORLEVEL% NEQ 0 (
  echo ERROR: Failed to install backend dependencies!
  pause
  exit /b 1
)

REM Install frontend dependencies
echo.
echo Installing frontend dependencies...
cd bookmyshow-frontend
call npm install
if %ERRORLEVEL% NEQ 0 (
  echo ERROR: Failed to install frontend dependencies!
  cd ..
  pause
  exit /b 1
)
cd ..

REM Provide MongoDB setup information
echo.
echo IMPORTANT: Make sure MongoDB is installed and running
echo If MongoDB is not installed, download it from https://www.mongodb.com/try/download/community
echo.
echo MongoDB should be running on localhost:27017
echo.

echo Installation completed successfully!
echo.
echo To start the application:
echo 1. Run 'start-bookmyshow.bat' to launch both backend and frontend
echo.
echo Thank you for installing BookMyShow Clone!

pause 