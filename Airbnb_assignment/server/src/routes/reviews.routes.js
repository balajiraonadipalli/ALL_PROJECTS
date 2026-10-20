import { Router } from 'express';
import { z } from 'zod';
import mongoose from 'mongoose';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const ReviewSchema = new mongoose.Schema(
  {
    listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing' },
    experience: { type: mongoose.Schema.Types.ObjectId, ref: 'Experience' },
    service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
    guest: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking' },
    overallRating: { type: Number, required: true, min: 1, max: 5 },
    subRatings: {
      cleanliness: { type: Number, min: 1, max: 5 },
      accuracy: { type: Number, min: 1, max: 5 },
      checkin: { type: Number, min: 1, max: 5 },
      communication: { type: Number, min: 1, max: 5 },
      location: { type: Number, min: 1, max: 5 },
      value: { type: Number, min: 1, max: 5 }
    },
    comment: { type: String, required: true, maxlength: 1000 },
    isPublic: { type: Boolean, default: true }
  },
  { timestamps: true }
);

// Add validation to ensure exactly one of listing/experience/service is provided
ReviewSchema.pre('save', function(next) {
  const provided = [this.listing, this.experience, this.service].filter(Boolean).length;
  if (provided === 0) return next(new Error('One of listing, experience, or service must be provided'));
  if (provided > 1) return next(new Error('Provide only one of listing, experience, or service'));
  next();
});

const Review = mongoose.models.Review || mongoose.model('Review', ReviewSchema);

const createReviewSchema = z.object({
  listingId: z.string().optional(),
  experienceId: z.string().optional(),
  serviceId: z.string().optional(),
  bookingId: z.string().optional(),
  overallRating: z.number().int().min(1).max(5),
  subRatings: z.object({
    cleanliness: z.number().int().min(1).max(5).optional(),
    accuracy: z.number().int().min(1).max(5).optional(),
    checkin: z.number().int().min(1).max(5).optional(),
    communication: z.number().int().min(1).max(5).optional(),
    location: z.number().int().min(1).max(5).optional(),
    value: z.number().int().min(1).max(5).optional()
  }).optional(),
  comment: z.string().min(10).max(1000)
}).refine((data) => data.listingId || data.experienceId || data.serviceId, {
  message: "One of listingId, experienceId, or serviceId must be provided"
});

// Get reviews for a listing
router.get('/listing/:listingId', async (req, res) => {
  try {
    const { listingId } = req.params;
    const { page = '1', limit = '10' } = req.query;

    const pageNum = Math.max(1, Number(page));
    const limitNum = Math.min(50, Math.max(1, Number(limit)));
    const skip = (pageNum - 1) * limitNum;

    const reviews = await Review.find({ 
      listing: listingId, 
      isPublic: true 
    })
      .populate('guest', 'name email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limitNum)
      .lean();

    const total = await Review.countDocuments({ 
      listing: listingId, 
      isPublic: true 
    });

    res.json({
      reviews,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum)
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Get review statistics for a listing
router.get('/listing/:listingId/stats', async (req, res) => {
  try {
    const { listingId } = req.params;

    const stats = await Review.aggregate([
      { $match: { listing: new mongoose.Types.ObjectId(listingId), isPublic: true } },
      {
        $group: {
          _id: null,
          totalReviews: { $sum: 1 },
          averageOverall: { $avg: '$overallRating' },
          averageCleanliness: { $avg: '$subRatings.cleanliness' },
          averageAccuracy: { $avg: '$subRatings.accuracy' },
          averageCheckin: { $avg: '$subRatings.checkin' },
          averageCommunication: { $avg: '$subRatings.communication' },
          averageLocation: { $avg: '$subRatings.location' },
          averageValue: { $avg: '$subRatings.value' },
          ratingDistribution: {
            $push: {
              overall: '$overallRating',
              cleanliness: '$subRatings.cleanliness',
              accuracy: '$subRatings.accuracy',
              checkin: '$subRatings.checkin',
              communication: '$subRatings.communication',
              location: '$subRatings.location',
              value: '$subRatings.value'
            }
          }
        }
      }
    ]);

    if (stats.length === 0) {
      return res.json({
        totalReviews: 0,
        averageOverall: 0,
        averageCleanliness: 0,
        averageAccuracy: 0,
        averageCheckin: 0,
        averageCommunication: 0,
        averageLocation: 0,
        averageValue: 0,
        ratingDistribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
      });
    }

    const result = stats[0];
    
    // Calculate rating distribution
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    result.ratingDistribution.forEach(rating => {
      distribution[rating.overall] = (distribution[rating.overall] || 0) + 1;
    });

    res.json({
      totalReviews: result.totalReviews,
      averageOverall: Math.round(result.averageOverall * 10) / 10,
      averageCleanliness: Math.round(result.averageCleanliness * 10) / 10,
      averageAccuracy: Math.round(result.averageAccuracy * 10) / 10,
      averageCheckin: Math.round(result.averageCheckin * 10) / 10,
      averageCommunication: Math.round(result.averageCommunication * 10) / 10,
      averageLocation: Math.round(result.averageLocation * 10) / 10,
      averageValue: Math.round(result.averageValue * 10) / 10,
      ratingDistribution: distribution
    });
  } catch (error) {
    console.error('Error fetching review stats:', error);
    res.status(500).json({ error: 'Failed to fetch review statistics' });
  }
});

// Create a review
router.post('/', requireAuth, async (req, res) => {
  try {
    const parse = createReviewSchema.safeParse(req.body);
    if (!parse.success) {
      return res.status(400).json({ error: 'Invalid input data' });
    }

    const { listingId, experienceId, serviceId, bookingId, overallRating, subRatings, comment } = parse.data;

    // For experiences, we don't require a booking (simplified for demo)
    if (listingId && bookingId) {
      // Check if user has a completed booking for this listing
      const Booking = mongoose.models.Booking;
      const booking = await Booking.findOne({
        _id: bookingId,
        guest: req.user.id,
        listing: listingId,
        status: 'confirmed',
        paid: true
      });

      if (!booking) {
        return res.status(400).json({ error: 'No valid booking found for this listing' });
      }
    }

    // Check if user has already reviewed this item
    const existingReview = await Review.findOne({
      $or: [
        { listing: listingId, guest: req.user.id },
        { experience: experienceId, guest: req.user.id },
        { service: serviceId, guest: req.user.id }
      ]
    });

    if (existingReview) {
      const itemType = listingId ? 'listing' : 'experience';
      return res.status(400).json({ error: `You have already reviewed this ${itemType}` });
    }

    // Create the review
    const reviewData = {
      guest: req.user.id,
      overallRating,
      subRatings,
      comment
    };

    if (listingId) {
      reviewData.listing = listingId;
      if (bookingId) reviewData.booking = bookingId;
    }
    if (experienceId) {
      reviewData.experience = experienceId;
    }
    if (serviceId) {
      reviewData.service = serviceId;
    }

    const review = await Review.create(reviewData);

    // Populate the guest info for response
    await review.populate('guest', 'name email avatar');

    res.status(201).json(review);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Failed to create review' });
  }
});

// Get reviews for an experience
router.get('/experience/:experienceId', async (req, res) => {
  try {
    const { experienceId } = req.params;
    const { page = '1', limit = '10' } = req.query;

    const reviews = await Review.find({ experience: experienceId, isPublic: true })
      .populate('guest', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Review.countDocuments({ experience: experienceId, isPublic: true });

    res.json({
      reviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching experience reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Get review stats for an experience
router.get('/experience/:experienceId/stats', async (req, res) => {
  try {
    const { experienceId } = req.params;

    const stats = await Review.aggregate([
      { $match: { experience: new mongoose.Types.ObjectId(experienceId), isPublic: true } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$overallRating' },
          totalReviews: { $sum: 1 },
          ratingDistribution: {
            $push: '$overallRating'
          }
        }
      }
    ]);

    if (stats.length === 0) {
      return res.json({
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      });
    }

    const result = stats[0];
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    
    result.ratingDistribution.forEach(rating => {
      distribution[rating] = (distribution[rating] || 0) + 1;
    });

    res.json({
      averageRating: result.averageRating,
      totalReviews: result.totalReviews,
      ratingDistribution: distribution
    });
  } catch (error) {
    console.error('Error fetching experience review stats:', error);
    res.status(500).json({ error: 'Failed to fetch review stats' });
  }
});

// Get reviews with query parameters (supports both listing and experience)
router.get('/', async (req, res) => {
  try {
    const { listingId, experienceId, serviceId, page = '1', limit = '10' } = req.query;
    
    if (!listingId && !experienceId && !serviceId) {
      return res.status(400).json({ error: 'listingId, experienceId, or serviceId is required' });
    }

    const filter = { isPublic: true };
    if (listingId) filter.listing = listingId;
    if (experienceId) filter.experience = experienceId;
    if (serviceId) filter.service = serviceId;

    const reviews = await Review.find(filter)
      .populate('guest', 'name avatar')
      .populate('listing', 'title images location')
      .populate('experience', 'title images location')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Review.countDocuments(filter);

    res.json({
      reviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Get review stats with query parameters
router.get('/stats', async (req, res) => {
  try {
    const { listingId, experienceId, serviceId } = req.query;
    
    if (!listingId && !experienceId && !serviceId) {
      return res.status(400).json({ error: 'listingId, experienceId, or serviceId is required' });
    }

    const filter = { isPublic: true };
    if (listingId) filter.listing = listingId;
    if (experienceId) filter.experience = experienceId;
    if (serviceId) filter.service = serviceId;

    const stats = await Review.aggregate([
      { $match: filter },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$overallRating' },
          totalReviews: { $sum: 1 },
          ratingDistribution: {
            $push: '$overallRating'
          }
        }
      }
    ]);

    if (stats.length === 0) {
      return res.json({
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      });
    }

    const result = stats[0];
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    
    result.ratingDistribution.forEach(rating => {
      distribution[rating] = (distribution[rating] || 0) + 1;
    });

    res.json({
      averageRating: result.averageRating,
      totalReviews: result.totalReviews,
      ratingDistribution: distribution
    });
  } catch (error) {
    console.error('Error fetching review stats:', error);
    res.status(500).json({ error: 'Failed to fetch review stats' });
  }
});

// Get reviews for a service
router.get('/service/:serviceId', async (req, res) => {
  try {
    const { serviceId } = req.params;
    const { page = '1', limit = '10' } = req.query;

    const reviews = await Review.find({ service: serviceId, isPublic: true })
      .populate('guest', 'name avatar')
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .lean();

    const total = await Review.countDocuments({ service: serviceId, isPublic: true });

    res.json({
      reviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching service reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Get review stats for a service
router.get('/service/:serviceId/stats', async (req, res) => {
  try {
    const { serviceId } = req.params;

    const stats = await Review.aggregate([
      { $match: { service: new mongoose.Types.ObjectId(serviceId), isPublic: true } },
      {
        $group: {
          _id: null,
          averageRating: { $avg: '$overallRating' },
          totalReviews: { $sum: 1 },
          ratingDistribution: { $push: '$overallRating' }
        }
      }
    ]);

    if (stats.length === 0) {
      return res.json({
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      });
    }

    const result = stats[0];
    const distribution = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    result.ratingDistribution.forEach(r => { distribution[r] = (distribution[r] || 0) + 1; });

    res.json({ averageRating: result.averageRating, totalReviews: result.totalReviews, ratingDistribution: distribution });
  } catch (error) {
    console.error('Error fetching service review stats:', error);
    res.status(500).json({ error: 'Failed to fetch review stats' });
  }
});

// Get user's reviews
router.get('/my-reviews', requireAuth, async (req, res) => {
  try {
    const reviews = await Review.find({ guest: req.user.id })
      .populate('listing', 'title images location')
      .populate('experience', 'title images location')
      .sort({ createdAt: -1 })
      .lean();

    res.json({ reviews });
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

export default router;
