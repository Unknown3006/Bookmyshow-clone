@echo off
echo Starting BookMyShow Clone Application...

REM Set environment variables for the backend
SET PORT=8080
SET NODE_ENV=development
SET MONGO_URI=mongodb://localhost:27017/bookmyshow
SET JWT_SECRET=your_jwt_secret_key_here
SET JWT_EXPIRE=30d

REM Start the backend server in a new window
echo Starting Backend Server on port 8080...
start cmd /k "cd C:\Users\panda\OneDrive\Documents\Desktop\FW && node server.js"

REM Start the frontend server in a new window
echo Starting Frontend Server on port 3000...
start cmd /k "cd C:\Users\panda\OneDrive\Documents\Desktop\FW\bookmyshow-frontend && npm start"

echo Both servers are starting. The frontend will be available at http://localhost:3000 and the backend API at http://localhost:8080/api
echo Press any key to close this window.
pause