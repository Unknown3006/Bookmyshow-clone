@echo off
echo Starting BookMyShow Clone Application (Frontend + Backend)...

REM Set environment variables for backend
set PORT=8080
set NODE_ENV=development
set MONGO_URI=mongodb://localhost:27017/bookmyshow
set JWT_SECRET=your_custom_secret_key_here
set JWT_EXPIRE=30d

REM Start MongoDB (if installed)
echo Checking if MongoDB is running...
tasklist /FI "IMAGENAME eq mongod.exe" 2>NUL | find /I /N "mongod.exe">NUL
if "%ERRORLEVEL%"=="0" (
    echo MongoDB is already running
) else (
    echo Starting MongoDB...
    start /B mongod
    timeout /t 5 /nobreak
)

REM Start Backend (in a new window)
echo Starting Backend on port 8080...
start cmd /k "cd /d %~dp0 && node server.js"

REM Start Frontend (in a new window)
echo Starting Frontend on port 3000...
start cmd /k "cd /d %~dp0\bookmyshow-frontend && npm start"

echo BookMyShow Clone Application is starting...
echo Frontend: http://localhost:3000
echo Backend API: http://localhost:8080/api
echo.
echo Press any key to stop all servers
pause

REM Kill processes when the user presses a key
taskkill /F /IM node.exe
taskkill /F /IM mongod.exe
echo All servers stopped 