# BookMyShow Clone - Setup Guide

## System Requirements

- **Operating System**: Windows 10 or higher
- **Node.js**: Version 14.x or higher
- **MongoDB**: Version 4.4 or higher
- **Browser**: Chrome, Firefox, or Edge (latest versions)
- **RAM**: Minimum 4GB (8GB recommended)
- **Disk Space**: At least 500MB of free space

## Installation Guide

### Step 1: Install Prerequisites

1. **Install Node.js**
   - Download from [https://nodejs.org/](https://nodejs.org/)
   - Choose the LTS (Long Term Support) version
   - Run the installer and follow the installation wizard
   - After installation, verify by opening Command Prompt and typing:
     ```
     node -v
     npm -v
     ```

2. **Install MongoDB**
   - Download from [https://www.mongodb.com/try/download/community](https://www.mongodb.com/try/download/community)
   - Choose the Community Server edition
   - Run the installer and follow the installation wizard
   - Choose "Complete" installation type
   - Install MongoDB Compass (the GUI tool) when prompted
   - After installation, MongoDB should run as a Windows service

### Step 2: Set Up the Application

1. **First-time Setup**
   - Double-click the `install.bat` file in the project folder
   - This will install all necessary dependencies
   - Wait for the installation to complete (may take several minutes)

2. **Configure Database (Optional)**
   - The default configuration will work for most users
   - MongoDB should be running on localhost:27017
   - The database will be created automatically when you first run the application

### Step 3: Running the Application

1. **Start the Application**
   - Double-click the `start-bookmyshow.bat` file
   - This will:
     - Start the backend server
     - Start the frontend development server
     - Open two command prompt windows (one for backend, one for frontend)

2. **Access the Application**
   - The frontend will be available at: [http://localhost:3000](http://localhost:3000)
   - The backend API will be at: [http://localhost:8000/api](http://localhost:8000/api)
   - The application should automatically open in your default browser

### Step 4: Using the Application

1. **Register/Login**
   - Create a new account using the Register page
   - Or use the default test account:
     - Email: test@example.com
     - Password: password123

2. **Booking a Movie**
   - Browse movies on the home page
   - Click on a movie to view details
   - Select a showtime
   - Choose seats
   - Complete the booking process

3. **Viewing Bookings**
   - Go to the Profile page
   - Click on "My Bookings" to view your booking history

## Troubleshooting

### Common Issues

1. **"Port already in use" error**
   - Close any other applications that might be using ports 3000 or 8000
   - Or modify the port in start-bookmyshow.bat file

2. **"Cannot connect to MongoDB" error**
   - Ensure MongoDB service is running
   - Open Services (Win+R, type "services.msc")
   - Find "MongoDB Server" and make sure it's running

3. **White screen or UI not loading**
   - Check browser console for errors (F12 key)
   - Make sure both backend and frontend servers are running
   - Try clearing browser cache and reloading

4. **"Failed to fetch" errors**
   - Check if the backend server is running
   - Ensure there are no firewall restrictions

### Getting Help

If you encounter issues not covered in this guide, please:

1. Check the console output in both command windows for error messages
2. Try restarting the application (close both command windows and run start-bookmyshow.bat again)
3. Make sure your system meets the minimum requirements

## Shutting Down

To stop the application:
1. Close both command prompt windows
2. The application will immediately stop running

---

Thank you for using BookMyShow Clone! Enjoy the application! 