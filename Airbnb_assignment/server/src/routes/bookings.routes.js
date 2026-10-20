import { Router } from 'express';
import mongoose from 'mongoose';
import { z } from 'zod';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

const BookingSchema = new mongoose.Schema(
  {
    listing: { type: mongoose.Schema.Types.ObjectId, ref: 'Listing', required: true },
    guest: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    guests: { type: Number, required: true, min: 1 },
    totalPrice: { type: Number, required: true, min: 0 },
    status: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' },
    paid: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const Booking = mongoose.models.Booking || mongoose.model('Booking', BookingSchema);

const availabilitySchema = z.object({
  listingId: z.string(),
  checkIn: z.string(),
  checkOut: z.string()
});

const createBookingSchema = z.object({
  listingId: z.string(),
  checkIn: z.string(),
  checkOut: z.string(),
  guests: z.number().int().positive()
});

function nightsBetween(a, b) {
  const MS_PER_NIGHT = 1000 * 60 * 60 * 24;
  const start = new Date(a);
  const end = new Date(b);
  return Math.max(0, Math.round((end - start) / MS_PER_NIGHT));
}

// Check availability for a date range
router.get('/availability', async (req, res) => {
  const parse = availabilitySchema.safeParse(req.query);
  if (!parse.success) return res.status(400).json({ error: 'Invalid parameters' });
  const { listingId, checkIn, checkOut } = parse.data;

  const start = new Date(checkIn);
  const end = new Date(checkOut);
  if (!(start < end)) return res.status(400).json({ error: 'Invalid date range' });

  const overlap = await Booking.exists({
    listing: listingId,
    status: 'confirmed',
    $or: [
      { checkIn: { $lt: end }, checkOut: { $gt: start } },
    ],
  });

  res.json({ available: !overlap });
});

// Create booking
router.post('/', requireAuth, async (req, res) => {
  const parse = createBookingSchema.safeParse(req.body);
  if (!parse.success) return res.status(400).json({ error: 'Invalid input' });
  const { listingId, checkIn, checkOut, guests } = parse.data;

  const Listing = mongoose.models.Listing;
  const listing = await Listing.findById(listingId).lean();
  if (!listing) return res.status(404).json({ error: 'Listing not found' });
  if (guests > listing.maxGuests) return res.status(400).json({ error: 'Too many guests' });

  const start = new Date(checkIn);
  const end = new Date(checkOut);
  if (!(start < end)) return res.status(400).json({ error: 'Invalid date range' });

  const overlap = await Booking.exists({
    listing: listingId,
    status: 'confirmed',
    $or: [
      { checkIn: { $lt: end }, checkOut: { $gt: start } },
    ],
  });
  if (overlap) return res.status(409).json({ error: 'Dates not available' });

  const nights = nightsBetween(start, end);
  if (nights <= 0) return res.status(400).json({ error: 'Stay must be at least 1 night' });
  const totalPrice = nights * Number(listing.pricePerNight);

  const booking = await Booking.create({
    listing: listingId,
    guest: req.user.id,
    checkIn: start,
    checkOut: end,
    guests,
    totalPrice,
  });

  res.status(201).json({ id: booking._id, totalPrice, nights, status: booking.status, paid: booking.paid });
});

export default router;
// Get my bookings (guest)
router.get('/mine', requireAuth, async (req, res) => {
  try {
    const bookings = await Booking.find({ guest: req.user.id })
      .populate('listing', 'title location pricePerNight images')
      .sort({ createdAt: -1 })
      .lean();
    res.json({ bookings });
  } catch (error) {
    console.error('Error fetching my bookings:', error);
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// MOCK payment confirmation: marks a booking as paid
router.post('/mock-pay', requireAuth, async (req, res) => {
  const { bookingId } = req.body || {};
  if (!bookingId) return res.status(400).json({ error: 'bookingId required' });
  const booking = await Booking.findOne({ _id: bookingId, guest: req.user.id });
  if (!booking) return res.status(404).json({ error: 'Booking not found' });
  if (booking.paid) return res.json({ ok: true, paid: true });
  booking.paid = true;
  await booking.save();
  res.json({ ok: true, paid: true });
});


