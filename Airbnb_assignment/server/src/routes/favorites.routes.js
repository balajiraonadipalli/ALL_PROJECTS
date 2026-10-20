import { Router } from 'express';
import mongoose from 'mongoose';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const FavoritesSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    listings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }],
    experiences: [{ type: mongoose.Schema.Types.ObjectId }],
    services: [{ type: mongoose.Schema.Types.ObjectId }]
  },
  { timestamps: true }
);

const Favorites = mongoose.models.Favorites || mongoose.model('Favorites', FavoritesSchema);

// Ensure a favorites doc exists for the user
async function ensureFavorites(userId) {
  let fav = await Favorites.findOne({ user: userId });
  if (!fav) {
    fav = await Favorites.create({ user: userId, listings: [], experiences: [], services: [] });
  }
  return fav;
}

// Get all favorite IDs for current user
router.get('/', requireAuth, async (req, res) => {
  try {
    const fav = await ensureFavorites(req.user.id);
    res.json({
      listings: fav.listings.map(String),
      experiences: fav.experiences.map(String),
      services: fav.services.map(String)
    });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

// Toggle favorite for a type
// body: { type: 'listing' | 'experience' | 'service', id: string }
router.post('/toggle', requireAuth, async (req, res) => {
  try {
    const { type, id } = req.body || {};
    if (!['listing', 'experience', 'service'].includes(type) || !id) {
      return res.status(400).json({ error: 'Invalid payload' });
    }

    const fav = await ensureFavorites(req.user.id);
    const field = type === 'listing' ? 'listings' : type === 'experience' ? 'experiences' : 'services';
    const arr = fav[field].map(String);
    const exists = arr.includes(String(id));
    if (exists) {
      fav[field] = fav[field].filter((x) => String(x) !== String(id));
    } else {
      fav[field].push(id);
    }
    await fav.save();

    res.json({
      toggled: !exists,
      [field]: fav[field].map(String)
    });
  } catch (error) {
    console.error('Error toggling favorite:', error);
    res.status(500).json({ error: 'Failed to toggle favorite' });
  }
});

export default router;

