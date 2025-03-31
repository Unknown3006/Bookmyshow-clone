const express = require('express');
const {
  getMovies,
  getMovie,
  createMovie,
  updateMovie,
  deleteMovie,
  getNowShowing,
  getComingSoon
} = require('../controllers/movieController');
const { protect, admin } = require('../middleware/auth');
const Movie = require('../models/Movie');

const router = express.Router();

// Special routes
router.get('/now-showing', getNowShowing);
router.get('/coming-soon', getComingSoon);

// Standard routes
router.route('/')
  .get(getMovies)
  .post(protect, admin, createMovie);

router.route('/:id')
  .get(getMovie)
  .put(protect, admin, updateMovie)
  .delete(protect, admin, deleteMovie);

// @route   GET /api/movies
// @desc    Get all movies
// @access  Public
router.get('/', async (req, res) => {
  try {
    const movies = await Movie.find();
    res.status(200).json({
      success: true,
      count: movies.length,
      data: movies
    });
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message
    });
  }
});

// @route   GET /api/movies/now-showing
// @desc    Get now showing movies
// @access  Public
router.get('/now-showing', async (req, res) => {
  try {
    const movies = await Movie.find({ nowShowing: true });
    res.status(200).json({
      success: true,
      count: movies.length,
      data: movies
    });
  } catch (error) {
    console.error('Error fetching now showing movies:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message
    });
  }
});

// @route   GET /api/movies/:id
// @desc    Get single movie
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const movie = await Movie.findById(req.params.id);
    if (!movie) {
      return res.status(404).json({
        success: false,
        error: 'Movie not found'
      });
    }
    res.status(200).json({
      success: true,
      data: movie
    });
  } catch (error) {
    console.error('Error fetching movie:', error);
    res.status(500).json({
      success: false,
      error: 'Server Error',
      message: error.message
    });
  }
});

module.exports = router; 