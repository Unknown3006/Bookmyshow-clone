const Show = require('../models/Show');

// @desc    Get all shows
// @route   GET /api/shows
// @access  Public
exports.getShows = async (req, res, next) => {
  try {
    let query = {};

    // Filter by movie, theater, or date if provided
    if (req.query.movieId) {
      query.movieId = req.query.movieId;
    }

    if (req.query.theaterId) {
      query.theaterId = req.query.theaterId;
    }

    if (req.query.date) {
      // Match shows on specific date
      const startDate = new Date(req.query.date);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(req.query.date);
      endDate.setHours(23, 59, 59, 999);

      query.date = {
        $gte: startDate,
        $lte: endDate
      };
    }

    const shows = await Show.find(query)
      .populate('movieId', 'title posterUrl duration')
      .populate('theaterId', 'name location');

    res.status(200).json({
      success: true,
      count: shows.length,
      data: shows
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single show
// @route   GET /api/shows/:id
// @access  Public
exports.getShow = async (req, res, next) => {
  try {
    const show = await Show.findById(req.params.id)
      .populate('movieId')
      .populate('theaterId');

    if (!show) {
      return res.status(404).json({
        success: false,
        error: 'Show not found'
      });
    }

    res.status(200).json({
      success: true,
      data: show
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new show
// @route   POST /api/shows
// @access  Private/Admin
exports.createShow = async (req, res, next) => {
  try {
    const show = await Show.create(req.body);

    res.status(201).json({
      success: true,
      data: show
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update show
// @route   PUT /api/shows/:id
// @access  Private/Admin
exports.updateShow = async (req, res, next) => {
  try {
    let show = await Show.findById(req.params.id);

    if (!show) {
      return res.status(404).json({
        success: false,
        error: 'Show not found'
      });
    }

    show = await Show.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: show
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get shows by movie and theater
// @route   GET /api/shows/movie/:movieId/theater/:theaterId
// @access  Public
exports.getShowsByMovieAndTheater = async (req, res, next) => {
  try {
    let query = {
      movieId: req.params.movieId,
      theaterId: req.params.theaterId
    };

    // Filter by date if provided
    if (req.query.date) {
      const startDate = new Date(req.query.date);
      startDate.setHours(0, 0, 0, 0);

      const endDate = new Date(req.query.date);
      endDate.setHours(23, 59, 59, 999);

      query.date = {
        $gte: startDate,
        $lte: endDate
      };
    }

    const shows = await Show.find(query).sort('date startTime');

    res.status(200).json({
      success: true,
      count: shows.length,
      data: shows
    });
  } catch (error) {
    next(error);
  }
}; 