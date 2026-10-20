const express = require('express');
const multer = require('multer');
const { ImageAnnotatorClient } = require('@google-cloud/vision');

const router = express.Router();

// Configure multer for memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
});

// OCR endpoint
router.post('/', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image file provided' });
    }

    // Initialize Google Cloud Vision client
    const client = new ImageAnnotatorClient();
    
    // Perform text detection
    const [result] = await client.textDetection({
      image: { content: req.file.buffer }
    });

    const detections = result.textAnnotations;
    const extractedText = detections.length > 0 ? detections[0].description : '';

    res.json({
      success: true,
      text: extractedText,
      confidence: detections.length > 0 ? 'high' : 'low'
    });

  } catch (error) {
    console.error('OCR Error:', error);
    
    // Fallback response if Google Cloud Vision fails
    res.json({
      success: false,
      text: 'OCR service temporarily unavailable. Please try again later.',
      error: 'OCR service error'
    });
  }
});

module.exports = router;

