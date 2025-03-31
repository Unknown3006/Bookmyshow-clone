const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    required: [true, 'Please add a description']
  },
  duration: {
    type: Number,
    required: [true, 'Please add duration in minutes']
  },
  genre: {
    type: [String],
    required: [true, 'Please add at least one genre']
  },
  language: {
    type: String,
    required: [true, 'Please add language']
  },
  releaseDate: {
    type: Date,
    required: [true, 'Please add release date']
  },
  cast: {
    type: [String],
    required: [true, 'Please add cast members']
  },
  director: {
    type: String,
    required: [true, 'Please add director name']
  },
  rating: {
    type: Number,
    min: [0, 'Rating must be at least 0'],
    max: [10, 'Rating cannot be more than 10']
  },
  posterUrl: {
    type: String,
    required: [true, 'Please add a poster URL']
  },
  trailerUrl: {
    type: String,
    trim: true
  },
  nowShowing: {
    type: Boolean,
    default: true
  },
  comingSoon: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Create indexes for better performance
movieSchema.index({ title: 1 });
movieSchema.index({ nowShowing: 1 });
movieSchema.index({ comingSoon: 1 });

module.exports = mongoose.model('Movie', movieSchema); 