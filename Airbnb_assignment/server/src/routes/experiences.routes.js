import { Router } from 'express';
import { z } from 'zod';
import mongoose from 'mongoose';
import { requireAuth, optionalAuth } from '../middleware/auth.js';

const router = Router();

const ExperienceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String }],
    pricePerGuest: { type: Number, required: true, min: 0 },
    location: {
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      address: { type: String, required: true },
      coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true }
      }
    },
    host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    category: { 
      type: String, 
      enum: ['food', 'sports', 'wellness', 'arts', 'culture', 'nature', 'adventure', 'other'],
      required: true 
    },
    duration: { type: Number, required: true }, // in hours
    maxGuests: { type: Number, required: true, min: 1 },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    totalReviews: { type: Number, default: 0 },
    label: { 
      type: String, 
      enum: ['original', 'popular', 'new', null], 
      default: null 
    },
    isActive: { type: Boolean, default: true },
    highlights: [{ type: String }],
    whatToExpect: { type: String },
    includes: [{ type: String }],
    meetingPoint: { type: String }
  },
  { timestamps: true }
);

const Experience = mongoose.models.Experience || mongoose.model('Experience', ExperienceSchema);

const createExperienceSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(10),
  images: z.array(z.string()).optional(),
  pricePerGuest: z.number().positive(),
  location: z.object({
    city: z.string().min(1),
    state: z.string().min(1),
    country: z.string().min(1),
    address: z.string().min(1),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number()
    })
  }),
  category: z.enum(['food', 'sports', 'wellness', 'arts', 'culture', 'nature', 'adventure', 'other']),
  duration: z.number().positive(),
  maxGuests: z.number().int().positive(),
  label: z.enum(['original', 'popular', 'new']).optional(),
  highlights: z.array(z.string()).optional(),
  whatToExpect: z.string().optional(),
  includes: z.array(z.string()).optional(),
  meetingPoint: z.string().optional()
});

const searchSchema = z.object({
  location: z.string().optional(),
  category: z.string().optional(),
  minPrice: z.string().optional(),
  maxPrice: z.string().optional(),
  label: z.string().optional(),
  page: z.string().optional(),
  limit: z.string().optional()
});

// Get all experiences with search and filters
router.get('/', async (req, res) => {
  try {
    const parse = searchSchema.safeParse(req.query);
    if (!parse.success) {
      return res.status(400).json({ error: 'Invalid search parameters' });
    }

    const {
      location,
      category,
      minPrice,
      maxPrice,
      label,
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

    if (category) {
      query.category = category;
    }

    if (minPrice || maxPrice) {
      query.pricePerGuest = {};
      if (minPrice) query.pricePerGuest.$gte = Number(minPrice);
      if (maxPrice) query.pricePerGuest.$lte = Number(maxPrice);
    }

    if (label) {
      query.label = label;
    }

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const experiences = await Experience.find(query)
      .populate('host', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await Experience.countDocuments(query);

    res.json({
      experiences,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Error fetching experiences:', error);
    res.status(500).json({ error: 'Failed to fetch experiences' });
  }
});

// Get original experiences
router.get('/originals', async (req, res) => {
  try {
    const experiences = await Experience.find({ 
      isActive: true, 
      label: 'original' 
    })
      .populate('host', 'name email')
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    res.json({ experiences });
  } catch (error) {
    console.error('Error fetching original experiences:', error);
    res.status(500).json({ error: 'Failed to fetch original experiences' });
  }
});

// Get popular experiences
router.get('/popular', async (req, res) => {
  try {
    const experiences = await Experience.find({ 
      isActive: true, 
      label: 'popular' 
    })
      .populate('host', 'name email')
      .sort({ rating: -1, totalReviews: -1 })
      .limit(20)
      .lean();

    res.json({ experiences });
  } catch (error) {
    console.error('Error fetching popular experiences:', error);
    res.status(500).json({ error: 'Failed to fetch popular experiences' });
  }
});

// Get experience by ID
router.get('/:id', async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id)
      .populate('host', 'name email')
      .lean();

    if (!experience) {
      return res.status(404).json({ error: 'Experience not found' });
    }

    res.json(experience);
  } catch (error) {
    console.error('Error fetching experience:', error);
    res.status(500).json({ error: 'Failed to fetch experience' });
  }
});

// Create experience (host only)
router.post('/', requireAuth, async (req, res) => {
  try {
    const parse = createExperienceSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: 'Invalid input data' });
    }

    const experience = await Experience.create({
      ...parse.data,
      host: req.user.id
    });

    await experience.populate('host', 'name email');

    res.status(201).json(experience);
  } catch (error) {
    console.error('Error creating experience:', error);
    res.status(500).json({ error: 'Failed to create experience' });
  }
});

// Get my experiences (host)
router.get('/mine', requireAuth, async (req, res) => {
  try {
    const experiences = await Experience.find({ host: req.user.id })
      .sort({ createdAt: -1 })
      .lean();

    res.json({ experiences });
  } catch (error) {
    console.error('Error fetching user experiences:', error);
    res.status(500).json({ error: 'Failed to fetch experiences' });
  }
});

// Delete experience (host only, soft delete)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const exp = await Experience.findById(req.params.id);
    if (!exp) return res.status(404).json({ error: 'Experience not found' });
    if (exp.host.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this experience' });
    }
    exp.isActive = false;
    await exp.save();
    res.json({ message: 'Experience deleted successfully' });
  } catch (error) {
    console.error('Error deleting experience:', error);
    res.status(500).json({ error: 'Failed to delete experience' });
  }
});

export default router;
