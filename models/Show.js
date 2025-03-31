const mongoose = require('mongoose');

const ShowSchema = new mongoose.Schema({
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: [true, 'Movie reference is required']
  },
  theaterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theater',
    required: [true, 'Theater reference is required']
  },
  screenNumber: {
    type: Number,
    required: [true, 'Screen number is required']
  },
  date: {
    type: Date,
    required: [true, 'Show date is required']
  },
  startTime: {
    type: String,
    required: [true, 'Start time is required']
  },
  endTime: {
    type: String,
    required: [true, 'End time is required']
  },
  availableSeats: {
    type: Number,
    required: [true, 'Available seats is required'],
    min: [0, 'Available seats cannot be negative']
  },
  price: {
    type: Number,
    required: [true, 'Price is required'],
    min: [0, 'Price cannot be negative']
  }
}, {
  timestamps: true
});

// Create indexes for better performance
ShowSchema.index({ movieId: 1, theaterId: 1, date: 1 });
ShowSchema.index({ date: 1 });

module.exports = mongoose.model('Show', ShowSchema); 