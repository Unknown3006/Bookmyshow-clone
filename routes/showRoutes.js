const express = require('express');
const {
  getShows,
  getShow,
  createShow,
  updateShow,
  getShowsByMovieAndTheater
} = require('../controllers/showController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// Special routes
router.get('/movie/:movieId/theater/:theaterId', getShowsByMovieAndTheater);

// Standard routes
router.route('/')
  .get(getShows)
  .post(protect, admin, createShow);

router.route('/:id')
  .get(getShow)
  .put(protect, admin, updateShow);

module.exports = router; 