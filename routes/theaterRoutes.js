const express = require('express');
const {
  getTheaters,
  getTheater,
  createTheater,
  updateTheater,
  getTheatersByCity
} = require('../controllers/theaterController');
const { protect, admin } = require('../middleware/auth');

const router = express.Router();

// Special routes
router.get('/city/:city', getTheatersByCity);

// Standard routes
router.route('/')
  .get(getTheaters)
  .post(protect, admin, createTheater);

router.route('/:id')
  .get(getTheater)
  .put(protect, admin, updateTheater);

module.exports = router; 