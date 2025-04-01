import mongoose from 'mongoose';

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  duration: {
    type: Number,
    required: true
  },
  releaseDate: {
    type: Date,
    required: true
  },
  posterUrl: String,
  rating: {
    type: Number,
    min: 0,
    max: 10
  },
  language: String,
  genres: [String],
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, { timestamps: true });

export const Movie = mongoose.model('Movie', movieSchema);