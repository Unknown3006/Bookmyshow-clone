import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Movie } from '../models/Movie.js';
import { Theater } from '../models/Theater.js';

dotenv.config();

const sampleData = {
  movies: [
    {
      title: "Sample Movie 1",
      description: "Description for movie 1",
      duration: 120,
      releaseDate: new Date(),
      genres: ["Action", "Adventure"]
    }
    // Add more sample movies
  ],
  theaters: [
    {
      name: "Sample Theater 1",
      location: {
        address: "123 Main St",
        city: "Sample City",
        state: "Sample State",
        coordinates: [-73.935242, 40.730610]
      },
      totalScreens: 5,
      amenities: ["Parking", "Food Court"]
    }
    // Add more sample theaters
  ]
};

const initDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Movie.deleteMany({});
    await Theater.deleteMany({});

    // Insert sample data
    await Movie.insertMany(sampleData.movies);
    await Theater.insertMany(sampleData.theaters);

    console.log('Sample data inserted successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error initializing database:', error);
    process.exit(1);
  }
};

initDB();