import { Router } from 'express';
import { z } from 'zod';
import mongoose from 'mongoose';
import { requireAuth, optionalAuth } from '../middleware/auth.js';

const router = Router();

const ListingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String }],
    pricePerNight: { type: Number, required: true, min: 0 },
    location: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
      }
    },
    amenities: [{ type: String }],
    propertyType: { 
      type: String, 
      enum: ['apartment', 'house', 'condo', 'villa', 'studio', 'loft', 'other'],
      required: true 
    },
    roomType: { 
      type: String, 
      enum: ['entire', 'private', 'shared'],
      required: true 
    },
    maxGuests: { type: Number, required: true, min: 1 },
    bedrooms: { type: Number, required: true, min: 0 },
    bathrooms: { type: Number, required: true, min: 0 },
    host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isActive: { type: Boolean, default: true }
  },
  { timestamps: true }
);

const Listing = mongoose.models.Listing || mongoose.model('Listing', ListingSchema);

const createListingSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(10),
  images: z.array(z.string()).optional(),
  pricePerNight: z.number().positive(),
  location: z.object({
    address: z.string().min(1),
    city: z.string().min(1),
    state: z.string().min(1),
    country: z.string().min(1),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number()
    })
  }),
  amenities: z.array(z.string()).optional(),
  propertyType: z.enum(['apartment', 'house', 'condo', 'villa', 'studio', 'loft', 'other']),
  roomType: z.enum(['entire', 'private', 'shared']),
  maxGuests: z.number().int().positive(),
  bedrooms: z.number().int().min(0),
  bathrooms: z.number().int().min(0)
});

const searchSchema = z.object({
  location: z.string().optional(),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
  guests: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  propertyType: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional()
});

// Get all listings with search and filters
router.get('/', optionalAuth, async (req, res) => {
  try {
    const parse = searchSchema.safeParse(req.query);
    if (!parse.success) {
      return res.status(400).json({ error: 'Invalid search parameters' });
    }

    const {
      location,
      checkIn,
      checkOut,
      guests,
      minPrice,
      maxPrice,
      propertyType,
      page = '1',
      limit = '20'
    } = parse.data;

    const query = { isActive: true };
    
    if (location) {
      query.$or = [
        { 'location.city': { $regex: location, $options: 'i' } },
        { 'location.state': { $regex: location, $options: 'i' } },
        { 'location.country': { $regex: location, $options: 'i' } }
      ];
    }

    if (minPrice || maxPrice) {
      query.pricePerNight = {};
      if (minPrice) query.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) query.pricePerNight.$lte = Number(maxPrice);
    }

    if (propertyType) {
      query.propertyType = propertyType;
    }

    if (guests) {
      query.maxGuests = { $gte: Number(guests) };
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const listings = await Listing.find(query)
      .populate('host', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await Listing.countDocuments(query);

    res.json({
      listings,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Error fetching listings:', error);
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

// Get my listings (host)
router.get('/mine', requireAuth, async (req, res) => {
  try {
    const listings = await Listing.find({ host: req.user.id, isActive: true })
      .sort({ createdAt: -1 })
      .lean();
    res.json({ listings });
  } catch (error) {
    console.error('Error fetching my listings:', error);
    res.status(500).json({ error: 'Failed to fetch listings' });
  }
});

// Get single listing
router.get('/:id', optionalAuth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate('host', 'name email')
      .lean();

    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    res.json(listing);
  } catch (error) {
    console.error('Error fetching listing:', error);
    res.status(500).json({ error: 'Failed to fetch listing' });
  }
});

// Create listing (requires auth)
router.post('/', requireAuth, async (req, res) => {
  try {
    const parse = createListingSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: 'Invalid listing data' });
    }

    const listingData = {
      ...parse.data,
      host: req.user.id
    };

    const listing = await Listing.create(listingData);
    await listing.populate('host', 'name email');

    res.status(201).json(listing);
  } catch (error) {
    console.error('Error creating listing:', error);
    res.status(500).json({ error: 'Failed to create listing' });
  }
});

// Update listing (requires auth)
router.put('/:id', requireAuth, async (req, res) => {
  try {
    const parse = createListingSchema.partial().safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: 'Invalid listing data' });
    }

    // First check if listing exists and user owns it
    const existingListing = await Listing.findById(req.params.id);
    if (!existingListing) {
      return res.status(404).json({ error: 'Listing not found' });
    }

    if (existingListing.host.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to edit this listing' });
    }

    const listing = await Listing.findByIdAndUpdate(
      req.params.id,
      parse.data,
      { new: true, runValidators: true }
    ).populate('host', 'name email');

    res.json(listing);
  } catch (error) {
    console.error('Error updating listing:', error);
    res.status(500).json({ error: 'Failed to update listing' });
  }
});

// Delete listing (requires auth)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ error: 'Listing not found' });
    }
    if (listing.host.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this listing' });
    }
    listing.isActive = false;
    await listing.save();
    res.json({ message: 'Listing deleted successfully' });
  } catch (error) {
    console.error('Error deleting listing:', error);
    res.status(500).json({ error: 'Failed to delete listing' });
  }
});

export default router;
