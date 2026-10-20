import { Router } from 'express';
import { z } from 'zod';
import mongoose from 'mongoose';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const WishlistSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, maxlength: 50 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    items: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Listing' }],
    isPublic: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Wishlist = mongoose.models.Wishlist || mongoose.model('Wishlist', WishlistSchema);

const createWishlistSchema = z.object({
  name: z.string().min(1).max(50),
  isPublic: z.boolean().optional()
});

const addItemSchema = z.object({
  listingId: z.string().min(1)
});

// Get user's wishlists
router.get('/', requireAuth, async (req, res) => {
  try {
    const wishlists = await Wishlist.find({ user: req.user.id })
      .populate('items', 'title images pricePerNight location')
      .sort({ createdAt: -1 })
      .lean();
    
    res.json({ wishlists });
  } catch (error) {
    console.error('Error fetching wishlists:', error);
    res.status(500).json({ error: 'Failed to fetch wishlists' });
  }
});

// Create new wishlist
router.post('/', requireAuth, async (req, res) => {
  try {
    const parse = createWishlistSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: 'Invalid wishlist data' });
    }

    const wishlist = await Wishlist.create({
      ...parse.data,
      user: req.user.id,
      items: []
    });

    await wishlist.populate('items', 'title images pricePerNight location');
    res.status(201).json(wishlist);
  } catch (error) {
    console.error('Error creating wishlist:', error);
    res.status(500).json({ error: 'Failed to create wishlist' });
  }
});

// Add item to wishlist
router.post('/:id/items', requireAuth, async (req, res) => {
  try {
    const parse = addItemSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: 'Invalid item data' });
    }

    const { listingId } = parse.data;
    const wishlist = await Wishlist.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!wishlist) {
      return res.status(404).json({ error: 'Wishlist not found' });
    }

    // Check if item already exists
    if (wishlist.items.includes(listingId)) {
      return res.status(409).json({ error: 'Item already in wishlist' });
    }

    wishlist.items.push(listingId);
    await wishlist.save();
    await wishlist.populate('items', 'title images pricePerNight location');

    res.json(wishlist);
  } catch (error) {
    console.error('Error adding item to wishlist:', error);
    res.status(500).json({ error: 'Failed to add item to wishlist' });
  }
});

// Remove item from wishlist
router.delete('/:id/items/:listingId', requireAuth, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ _id: req.params.id, user: req.user.id });
    
    if (!wishlist) {
      return res.status(404).json({ error: 'Wishlist not found' });
    }

    wishlist.items = wishlist.items.filter(item => item.toString() !== req.params.listingId);
    await wishlist.save();
    await wishlist.populate('items', 'title images pricePerNight location');

    res.json(wishlist);
  } catch (error) {
    console.error('Error removing item from wishlist:', error);
    res.status(500).json({ error: 'Failed to remove item from wishlist' });
  }
});

// Update wishlist
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const parse = createWishlistSchema.partial().safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: 'Invalid wishlist data' });
    }

    const wishlist = await Wishlist.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      parse.data,
      { new: true, runValidators: true }
    ).populate('items', 'title images pricePerNight location');

    if (!wishlist) {
      return res.status(404).json({ error: 'Wishlist not found' });
    }

    res.json(wishlist);
  } catch (error) {
    console.error('Error updating wishlist:', error);
    res.status(500).json({ error: 'Failed to update wishlist' });
  }
});

// Delete wishlist
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    
    if (!wishlist) {
      return res.status(404).json({ error: 'Wishlist not found' });
    }

    res.json({ message: 'Wishlist deleted successfully' });
  } catch (error) {
    console.error('Error deleting wishlist:', error);
    res.status(500).json({ error: 'Failed to delete wishlist' });
  }
});

// Get all favorited listing IDs for user
router.get('/favorites', requireAuth, async (req, res) => {
  try {
    const wishlists = await Wishlist.find({ user: req.user.id }).select('items').lean();
    const favoriteIds = new Set();
    
    wishlists.forEach(wishlist => {
      wishlist.items.forEach(item => favoriteIds.add(item.toString()));
    });

    res.json({ favorites: Array.from(favoriteIds) });
  } catch (error) {
    console.error('Error fetching favorites:', error);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

export default router;
