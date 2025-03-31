const mongoose = require('mongoose');
const Movie = require('./models/Movie');

const movies = [
  {
    title: "Avengers: Endgame",
    description: "After Thanos wiped out half of all life in the universe, the Avengers must reunite to undo his actions and restore balance.",
    duration: 181,
    genre: ["Action", "Adventure", "Sci-Fi"],
    language: "English",
    releaseDate: "2019-04-26",
    cast: ["Robert Downey Jr.", "Chris Evans", "Mark Ruffalo"],
    director: "Anthony & Joe Russo",
    rating: 8.4,
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMTc5MDE2ODcwNV5BMl5BanBnXkFtZTgwMzI2NzQ2NzM@._V1_.jpg",
    nowShowing: true
  },
  {
    title: "The Dark Knight",
    description: "When the menace known as the Joker wreaks havoc and chaos on the people of Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice.",
    duration: 152,
    genre: ["Action", "Crime", "Drama"],
    language: "English",
    releaseDate: "2008-07-18",
    cast: ["Christian Bale", "Heath Ledger", "Aaron Eckhart"],
    director: "Christopher Nolan",
    rating: 9.0,
    posterUrl: "https://m.media-amazon.com/images/M/MV5BMTMxNTMwODM0NF5BMl5BanBnXkFtZTcwODAyMTk2Mw@@._V1_.jpg",
    nowShowing: true
  }
];

const addSampleMovies = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/bookmyshow', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('Connected to MongoDB');

    // Clear existing movies
    await Movie.deleteMany({});
    console.log('Cleared existing movies');

    // Add new movies
    const result = await Movie.insertMany(movies);
    console.log('Added sample movies:', result);

    await mongoose.connection.close();
    console.log('Database connection closed');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
};

addSampleMovies(); 