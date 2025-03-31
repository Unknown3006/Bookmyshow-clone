@echo off
echo Starting BookMyShow Clone Application...

REM Set environment variables
set PORT=8000
set NODE_ENV=development
set MONGO_URI=mongodb://localhost:27017/bookmyshow
set JWT_SECRET=your_custom_secret_key_here
set JWT_EXPIRE=30d

echo Environment variables set successfully
echo Starting Node.js server...

REM Start the server
node server.js

pause 