@echo off
echo Stopping BookMyShow Clone Application...

REM Kill Node.js process
taskkill /F /IM node.exe 2>NUL
if "%ERRORLEVEL%"=="0" (
    echo Node.js server stopped
) else (
    echo Node.js server was not running
)

REM Kill MongoDB process
taskkill /F /IM mongod.exe 2>NUL
if "%ERRORLEVEL%"=="0" (
    echo MongoDB server stopped
) else (
    echo MongoDB server was not running
)

echo All services stopped successfully
pause 