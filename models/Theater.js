const mongoose = require('mongoose');

const ScreenSchema = new mongoose.Schema({
  screenNumber: {
    type: Number,
    required: [true, 'Screen number is required']
  },
  seatingCapacity: {
    type: Number,
    required: [true, 'Seating capacity is required'],
    min: [1, 'Seating capacity must be at least 1']
  },
  screenType: {
    type: String,
    required: [true, 'Screen type is required'],
    enum: ['IMAX', '3D', '4DX', 'Standard']
  }
});

const TheaterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Theater name is required'],
    trim: true
  },
  location: {
    type: String,
    required: [true, 'Location is required'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Address is required'],
    trim: true
  },
  screens: [ScreenSchema]
}, {
  timestamps: true
});

// Create indexes for better performance
TheaterSchema.index({ location: 1 });
TheaterSchema.index({ name: 1 });

module.exports = mongoose.model('Theater', TheaterSchema); 