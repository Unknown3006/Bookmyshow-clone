# BookMyShow Clone

A full-stack movie ticket booking application built with React.js and Node.js.

## Features

- Browse movies currently showing in theaters
- View movie details including cast, ratings, and showtimes
- Book movie tickets
- View popular theaters
- User authentication
- Responsive design

## Tech Stack

### Frontend
- React.js
- React Router for navigation
- CSS3 for styling
- Font Awesome for icons

### Backend
- Node.js
- Express.js
- MongoDB for database
- Mongoose ODM
- JWT for authentication

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/bookmyshow-clone.git
cd bookmyshow-clone
```

2. Install backend dependencies
```bash
npm install
```

3. Install frontend dependencies
```bash
cd bookmyshow-frontend
npm install
```

4. Create a .env file in the root directory and add:
```
PORT=8000
NODE_ENV=development
MONGO_URI=mongodb://localhost:27017/bookmyshow
JWT_SECRET=your_jwt_secret
JWT_EXPIRE=30d
```

5. Start MongoDB service

6. Run the application
```bash
# Start backend server (from root directory)
npm start

# Start frontend server (from bookmyshow-frontend directory)
cd bookmyshow-frontend
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:8000

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