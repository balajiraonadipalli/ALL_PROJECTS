const express = require('express');
const { body, validationResult } = require('express-validator');
const Destination = require('../models/Destination');
const { auth, adminAuth } = require('../middleware/auth');

const router = express.Router();

// Get all destinations with pagination and search
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const category = req.query.category || '';
    const skip = (page - 1) * limit;

    let query = { isActive: true };
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } },
        { 'location.country': { $regex: search, $options: 'i' } }
      ];
    }
    
    if (category) {
      query.category = category;
    }

    const destinations = await Destination.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await Destination.countDocuments(query);

    res.json({
      destinations,
      pagination: {
        current: page,
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get single destination
router.get('/:id', async (req, res) => {
  try {
    const destination = await Destination.findById(req.params.id);
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    res.json(destination);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create destination (admin only)
router.post('/', auth, adminAuth, [
  body('name').trim().isLength({ min: 2 }).withMessage('Name is required'),
  body('description').trim().isLength({ min: 10 }).withMessage('Description must be at least 10 characters'),
  body('location.city').trim().notEmpty().withMessage('City is required'),
  body('location.country').trim().notEmpty().withMessage('Country is required'),
  body('price').isNumeric().withMessage('Price must be a number'),
  body('category').trim().notEmpty().withMessage('Category is required')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const destination = new Destination(req.body);
    await destination.save();
    res.status(201).json(destination);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update destination (admin only)
router.put('/:id', auth, adminAuth, async (req, res) => {
  try {
    const destination = await Destination.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    
    res.json(destination);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete destination (admin only)
router.delete('/:id', auth, adminAuth, async (req, res) => {
  try {
    const destination = await Destination.findByIdAndDelete(req.params.id);
    if (!destination) {
      return res.status(404).json({ message: 'Destination not found' });
    }
    res.json({ message: 'Destination deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;

