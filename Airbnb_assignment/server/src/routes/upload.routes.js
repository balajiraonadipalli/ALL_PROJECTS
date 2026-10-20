import { Router } from 'express';
import { upload, uploadImage, deleteImage } from '../config/cloudinary.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Test Cloudinary connection
router.get('/test', async (req, res) => {
  try {
    const { cloudinary } = await import('../config/cloudinary.js');
    cloudinary.api.ping((result) => {
      if (result.status === 'ok') {
        res.json({ 
          success: true, 
          message: 'Cloudinary connection successful',
          cloudName: result.cloud_name 
        });
      } else {
        res.status(500).json({ 
          success: false, 
          error: 'Cloudinary connection failed',
          details: result 
        });
      }
    });
  } catch (error) {
    console.error('Cloudinary test error:', error);
    res.status(500).json({ success: false, error: 'Failed to test Cloudinary connection' });
  }
});

// Test upload without authentication (for debugging)
router.post('/test-upload', upload.single('image'), async (req, res) => {
  try {
    console.log('Test upload request received:', {
      hasFile: !!req.file,
      fileField: req.file?.fieldname,
      fileSize: req.file?.size,
      fileType: req.file?.mimetype,
      filePath: req.file?.path,
      filePublicId: req.file?.filename
    });

    if (!req.file) {
      console.log('No file received in test upload request');
      return res.status(400).json({ error: 'No image file provided' });
    }

    console.log('Test file uploaded successfully to Cloudinary:', req.file.path);
    res.json({
      success: true,
      imageUrl: req.file.path,
      publicId: req.file.filename
    });
  } catch (error) {
    console.error('Error in test upload:', error);
    res.status(500).json({ error: 'Failed to upload image', details: error.message });
  }
});

// Upload single image
router.post('/image', requireAuth, (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    console.log('Upload request received:', {
      hasFile: !!req.file,
      fileField: req.file?.fieldname,
      fileSize: req.file?.size,
      fileType: req.file?.mimetype,
      filePath: req.file?.path,
      filePublicId: req.file?.filename
    });

    if (!req.file) {
      console.log('No file received in request');
      return res.status(400).json({ error: 'No image file provided' });
    }

    console.log('File uploaded successfully to Cloudinary:', req.file.path);
    res.json({
      success: true,
      imageUrl: req.file.path,
      publicId: req.file.filename
    });
  } catch (error) {
    console.error('Error uploading image:', error);
    res.status(500).json({ error: 'Failed to upload image', details: error.message });
  }
});

// Upload multiple images
router.post('/images', requireAuth, (req, res, next) => {
  upload.array('images', 10)(req, res, (err) => {
    if (err) {
      console.error('Multer error:', err);
      return res.status(400).json({ error: err.message });
    }
    next();
  });
}, async (req, res) => {
  try {
    console.log('Multiple upload request received:', {
      filesCount: req.files?.length || 0,
      files: req.files?.map(f => ({ 
        fieldname: f.fieldname, 
        size: f.size, 
        mimetype: f.mimetype,
        path: f.path,
        filename: f.filename
      }))
    });

    if (!req.files || req.files.length === 0) {
      console.log('No files received in multiple upload request');
      return res.status(400).json({ error: 'No image files provided' });
    }

    const imageUrls = req.files.map(file => {
      console.log('File uploaded successfully:', file.path);
      return {
        url: file.path,
        publicId: file.filename
      };
    });

    res.json({
      success: true,
      images: imageUrls
    });
  } catch (error) {
    console.error('Error uploading images:', error);
    res.status(500).json({ error: 'Failed to upload images', details: error.message });
  }
});

// Upload image from URL or base64
router.post('/image-url', requireAuth, async (req, res) => {
  try {
    const { imageData, options = {} } = req.body;
    
    if (!imageData) {
      return res.status(400).json({ error: 'No image data provided' });
    }

    const imageUrl = await uploadImage(imageData, options);
    
    res.json({
      success: true,
      imageUrl
    });
  } catch (error) {
    console.error('Error uploading image from URL:', error);
    res.status(500).json({ error: 'Failed to upload image' });
  }
});

// Delete image
router.delete('/image/:publicId', requireAuth, async (req, res) => {
  try {
    const { publicId } = req.params;
    
    const result = await deleteImage(publicId);
    
    res.json({
      success: true,
      result
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
});

export default router;
