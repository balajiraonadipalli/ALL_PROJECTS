const express = require('express');
const User = require('../models/User');
const Destination = require('../models/Destination');
const Booking = require('../models/Booking');
const { auth } = require('../middleware/auth');

const router = express.Router();

// Save/unsave destination
router.post('/:userId/save/:destId', auth, async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findById(req.params.userId);
    const destination = await Destination.findById(req.params.destId);

    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }

    const isSaved = user.savedDestinations.includes(req.params.destId);
    
    if (isSaved) {
      user.savedDestinations.pull(req.params.destId);
      await user.save();
      res.json({ message: 'Destination removed from saved', saved: false });
    } else {
      user.savedDestinations.push(req.params.destId);
      await user.save();
      res.json({ message: 'Destination saved', saved: true });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get saved destinations
router.get('/:userId/saved', auth, async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const user = await User.findById(req.params.userId)
      .populate('savedDestinations');
    
    res.json(user.savedDestinations);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create booking
router.post('/booking', auth, async (req, res) => {
  try {
    const { destinationId, startDate, endDate, numberOfPeople } = req.body;
    
    const destination = await Destination.findById(destinationId);
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }

    const totalPrice = destination.price * numberOfPeople;
    
    const booking = new Booking({
      user: req.user._id,
      destination: destinationId,
      startDate,
      endDate,
      numberOfPeople,
      totalPrice
    });

    await booking.save();
    await booking.populate('destination');
    
    res.status(201).json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get user bookings
router.get('/:userId/bookings', auth, async (req, res) => {
  try {
    if (req.user._id.toString() !== req.params.userId) {
      return res.status(403).json({ message: 'Access denied' });
    }

    const bookings = await Booking.find({ user: req.params.userId })
      .populate('destination')
      .sort({ createdAt: -1 });
    
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

