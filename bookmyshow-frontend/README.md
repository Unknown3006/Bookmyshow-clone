# BookMyShow Clone Frontend

This is the React-based frontend for the BookMyShow clone application. It connects to the Express/MongoDB backend API.

## Features

- Browse movies (Now Showing and Coming Soon)
- View movie details
- Browse theaters
- View showtimes
- Interactive UI similar to BookMyShow

## Requirements

- Node.js (v14 or higher)
- npm or yarn
- Backend API running (on port 8000)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd bookmyshow-frontend
```

2. Install dependencies:
```bash
npm install
```

## Running the Frontend

1. Make sure the backend API is running on port 8000
2. Start the frontend development server:
```bash
npm start
```
3. Open your browser and navigate to `http://localhost:3000`

## Running the Full Stack Application

For convenience, you can use the `run-app.bat` script in the parent directory, which will start both the frontend and backend together:

```bash
cd ..
run-app.bat
```

## Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App

## Technologies Used

- React.js
- CSS3
- Font Awesome (for icons)
- REST API interaction with the backend

## Project Structure

```
src/
├── components/       # Reusable UI components
├── App.js            # Main application component
├── App.css           # Main application styles
├── index.js          # Application entry point
└── index.css         # Global styles
```

## License

This project is licensed under the MIT License. 