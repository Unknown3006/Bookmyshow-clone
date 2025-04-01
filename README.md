# BookMyShow Clone

A full-stack movie ticket booking application with React frontend and Node.js backend.

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (running on localhost:27017)
- Web browser (Chrome/Firefox/Edge recommended)

### Installation

1. Clone the repository
2. Make sure MongoDB is running on your system

### Running the Application

#### Method 1: Using the start script (Windows)

1. Simply double-click the `start.bat` file in the root directory
2. This will:
   - Set up environment variables
   - Start the backend server on port 8000

3. In a separate terminal, start the frontend:
   ```
   cd bookmyshow-frontend
   npm start
   ```

#### Method 2: Manual startup

1. Start the backend server:
   ```
   node server.js
   ```

2. In a separate terminal, start the frontend:
   ```
   cd bookmyshow-frontend
   npm start
   ```

### Accessing the Application

- Frontend: http://localhost:3000
- Backend API: http://localhost:8000/api

## Features

- Browse now showing and upcoming movies
- View movie details and showtimes
- Select seats and book tickets
- User authentication (login/register)
- View booking history

## Technologies Used

- Frontend: React.js, React Router, CSS Modules
- Backend: Node.js, Express.js
- Database: MongoDB

## Troubleshooting

If you encounter any issues:

1. Make sure MongoDB is running
2. Ensure ports 8000 and 3000 are not being used by other applications
3. Check console logs for specific error messages

## API Endpoints

- `GET /api/movies` - Get all movies
- `GET /api/movies/now-showing` - Get now showing movies
- `GET /api/movies/:id` - Get single movie
- `GET /api/theaters` - Get all theaters
- `GET /api/shows` - Get all shows
- `POST /api/bookings` - Create a booking

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details 
This project is licensed under the MIT License. 