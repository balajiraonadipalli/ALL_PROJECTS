const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true },
  location: {
    city: { type: String, required: true },
    country: { type: String, required: true },
    coordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true }
    }
  },
  images: [{ type: String }], // Cloudinary URLs
  price: { type: Number, required: true },
  duration: { type: String, required: true }, // e.g., "3 days", "1 week"
  category: { type: String, required: true }, // e.g., "beach", "mountain", "city"
  rating: { type: Number, default: 0, min: 0, max: 5 },
  reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }],
  isActive: { type: Boolean, default: true }
}, { timestamps: true });

module.exports = mongoose.model('Destination', destinationSchema);

