import mongoose from 'mongoose';

const theaterSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  location: {
    address: String,
    city: String,
    state: String,
    coordinates: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: [Number] // [longitude, latitude]
    }
  },
  totalScreens: {
    type: Number,
    required: true
  },
  amenities: [String],
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  }
}, { timestamps: true });

theaterSchema.index({ 'location.coordinates': '2dsphere' });
export const Theater = mongoose.model('Theater', theaterSchema);