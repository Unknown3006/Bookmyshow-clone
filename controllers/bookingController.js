const Booking = require('../models/Booking');
const Show = require('../models/Show');
const User = require('../models/User');

// @desc    Get user bookings
// @route   GET /api/bookings
// @access  Private
exports.getBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ userId: req.user.id })
      .populate({
        path: 'showId',
        populate: [
          { path: 'movieId', select: 'title posterUrl' },
          { path: 'theaterId', select: 'name location' }
        ]
      })
      .sort('-bookingDate');

    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate({
        path: 'showId',
        populate: [
          { path: 'movieId' },
          { path: 'theaterId' }
        ]
      });

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Check if the booking belongs to the logged in user
    if (booking.userId.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'User not authorized to access this booking'
      });
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new booking
// @route   POST /api/bookings
// @access  Private
exports.createBooking = async (req, res, next) => {
  try {
    const { showId, seats, totalAmount } = req.body;

    // Add userId to the request body
    req.body.userId = req.user.id;

    // Check if show exists and has available seats
    const show = await Show.findById(showId);
    if (!show) {
      return res.status(404).json({
        success: false,
        error: 'Show not found'
      });
    }

    // Check if selected seats are less than or equal to available seats
    if (seats.length > show.availableSeats) {
      return res.status(400).json({
        success: false,
        error: 'Not enough seats available'
      });
    }

    // Create booking
    const booking = await Booking.create(req.body);

    // Update show's available seats
    show.availableSeats -= seats.length;
    await show.save();

    // Add booking to user's bookings
    await User.findByIdAndUpdate(req.user.id, {
      $push: { bookings: booking._id }
    });

    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel booking
// @route   PUT /api/bookings/:id/cancel
// @access  Private
exports.cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        error: 'Booking not found'
      });
    }

    // Check if the booking belongs to the logged in user
    if (booking.userId.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({
        success: false,
        error: 'User not authorized to cancel this booking'
      });
    }

    // Check if booking is already cancelled
    if (booking.status === 'cancelled') {
      return res.status(400).json({
        success: false,
        error: 'Booking is already cancelled'
      });
    }

    // Update booking status to cancelled
    booking.status = 'cancelled';
    await booking.save();

    // Increase show's available seats
    const show = await Show.findById(booking.showId);
    if (show) {
      show.availableSeats += booking.seats.length;
      await show.save();
    }

    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    next(error);
  }
}; 