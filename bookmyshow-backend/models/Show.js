import mongoose from 'mongoose';

const showSchema = new mongoose.Schema({
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Movie',
    required: true
  },
  theaterId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Theater',
    required: true
  },
  screenNumber: {
    type: Number,
    required: true
  },
  showTime: {
    type: Date,
    required: true
  },
  priceCategories: {
    silver: Number,
    gold: Number,
    platinum: Number
  },
  availableSeats: {
    type: Map,
    of: Boolean
  }
}, { timestamps: true });

showSchema.index({ theaterId: 1, screenNumber: 1, showTime: 1 }, { unique: true });
export const Show = mongoose.model('Show', showSchema);