import { Router } from 'express';
import mongoose from 'mongoose';
import { z } from 'zod';
import { requireAuth, optionalAuth } from '../middleware/auth.js';

const router = Router();

const ServiceSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String }],
    pricePerGuest: { type: Number, required: true, min: 0 },
    minimumBooking: { type: Number, min: 0 }, // minimum total booking amount
    location: {
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      address: { type: String },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number }
      }
    },
    category: {
      type: String,
      enum: ['chefs', 'training', 'photography', 'massage', 'makeup', 'hair', 'spa', 'catering', 'nails', 'prepared-meals'],
      required: true
    },
    subcategory: { type: String }, // e.g., 'personal-training', 'yoga', 'italian-cuisine'
    duration: { type: Number, min: 0.5 }, // in hours
    maxGuests: { type: Number, min: 1 },
    rating: { type: Number, min: 0, max: 5, default: 0 },
    totalReviews: { type: Number, min: 0, default: 0 },
    label: { type: String, enum: ['popular', 'new', 'coming-soon'], default: 'new' },
    highlights: [{ type: String }],
    provider: { 
      name: { type: String, required: true },
      bio: { type: String },
      avatar: { type: String },
      verified: { type: Boolean, default: false }
    },
    host: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    isActive: { type: Boolean, default: true },
    availability: { type: String, enum: ['available', 'coming-soon', 'unavailable'], default: 'available' }
  },
  { timestamps: true }
);

const Service = mongoose.models.Service || mongoose.model('Service', ServiceSchema);

// Zod schemas for validation
const createServiceSchema = z.object({
  title: z.string().min(1).max(100),
  description: z.string().min(10).max(1000),
  images: z.array(z.string()).min(1).max(10),
  pricePerGuest: z.number().min(0),
  minimumBooking: z.number().min(0).optional(),
  location: z.object({
    city: z.string().min(1),
    state: z.string().min(1),
    country: z.string().min(1),
    address: z.string().optional(),
    coordinates: z.object({
      lat: z.number(),
      lng: z.number()
    }).optional()
  }),
  category: z.enum(['chefs', 'training', 'photography', 'massage', 'makeup', 'hair', 'spa', 'catering', 'nails', 'prepared-meals']),
  subcategory: z.string().optional(),
  duration: z.number().min(0.5).optional(),
  maxGuests: z.number().min(1).optional(),
  highlights: z.array(z.string()).optional(),
  provider: z.object({
    name: z.string().min(1),
    bio: z.string().optional(),
    avatar: z.string().url().optional(),
    verified: z.boolean().optional()
  })
});

const searchServiceSchema = z.object({
  category: z.string().optional(),
  location: z.string().optional(),
  minPrice: z.number().optional(),
  maxPrice: z.number().optional(),
  rating: z.number().min(1).max(5).optional(),
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(50).default(20)
});

// API Endpoints

// GET /api/services - Get all services with filtering
router.get('/', async (req, res) => {
  try {
    const { category, location, minPrice, maxPrice, rating, page = 1, limit = 20 } = req.query;
    
    const filter = { isActive: true };
    
    if (category) filter.category = category;
    if (location) {
      filter.$or = [
        { 'location.city': new RegExp(location, 'i') },
        { 'location.state': new RegExp(location, 'i') },
        { 'location.country': new RegExp(location, 'i') }
      ];
    }
    if (minPrice) filter.pricePerGuest = { ...filter.pricePerGuest, $gte: Number(minPrice) };
    if (maxPrice) filter.pricePerGuest = { ...filter.pricePerGuest, $lte: Number(maxPrice) };
    if (rating) filter.rating = { $gte: Number(rating) };

    const skip = (Number(page) - 1) * Number(limit);
    
    const services = await Service.find(filter)
      .populate('host', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Service.countDocuments(filter);

    res.json({
      services,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get services error:', error);
    res.status(500).json({ error: 'Failed to fetch services' });
  }
});

// GET /api/services/categories - Get services grouped by category
router.get('/categories', async (req, res) => {
  try {
    const categories = await Service.aggregate([
      { $match: { isActive: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          services: {
            $push: {
              id: '$_id',
              title: '$title',
              images: '$images',
              pricePerGuest: '$pricePerGuest',
              minimumBooking: '$minimumBooking',
              rating: '$rating',
              totalReviews: '$totalReviews',
              label: '$label',
              provider: '$provider',
              availability: '$availability',
              location: '$location'
            }
          }
        }
      },
      { $sort: { count: -1 } }
    ]);

    res.json({ categories });
  } catch (error) {
    console.error('Get service categories error:', error);
    res.status(500).json({ error: 'Failed to fetch service categories' });
  }
});

// GET /api/services/popular - Get popular services
router.get('/popular', async (req, res) => {
  try {
    const services = await Service.find({ 
      isActive: true, 
      label: 'popular' 
    })
      .populate('host', 'name email')
      .sort({ rating: -1, totalReviews: -1 })
      .limit(10);

    res.json({ services });
  } catch (error) {
    console.error('Get popular services error:', error);
    res.status(500).json({ error: 'Failed to fetch popular services' });
  }
});

// GET /api/services/:id - Get single service
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id)
      .populate('host', 'name email avatar');

    if (!service) {
      return res.status(404).json({ error: 'Service not found' });
    }

    res.json({ service });
  } catch (error) {
    console.error('Get service error:', error);
    res.status(500).json({ error: 'Failed to fetch service' });
  }
});

// POST /api/services - Create new service (requires auth)
router.post('/', requireAuth, async (req, res) => {
  try {
    const validatedData = createServiceSchema.parse(req.body);
    
    const service = new Service({
      ...validatedData,
      host: req.user.id
    });

    await service.save();
    await service.populate('host', 'name email');

    res.status(201).json({ service });
  } catch (error) {
    if (error.name === 'ZodError') {
      return res.status(400).json({ error: 'Validation error', details: error.errors });
    }
    console.error('Create service error:', error);
    res.status(500).json({ error: 'Failed to create service' });
  }
});

// GET /api/services/my - Get my services (requires auth)
router.get('/my', requireAuth, async (req, res) => {
  try {
    const services = await Service.find({ host: req.user.id })
      .sort({ createdAt: -1 });

    res.json({ services });
  } catch (error) {
    console.error('Get my services error:', error);
    res.status(500).json({ error: 'Failed to fetch your services' });
  }
});

// DELETE /api/services/:id - Delete service (host only, soft delete)
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) return res.status(404).json({ error: 'Service not found' });
    if (service.host.toString() !== req.user.id) {
      return res.status(403).json({ error: 'Not authorized to delete this service' });
    }
    service.isActive = false;
    await service.save();
    res.json({ message: 'Service deleted successfully' });
  } catch (error) {
    console.error('Delete service error:', error);
    res.status(500).json({ error: 'Failed to delete service' });
  }
});

export default router;
