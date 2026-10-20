import { Router } from 'express';
import mongoose from 'mongoose';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

function getBucket() {
  const db = mongoose.connection.db;
  if (!db) throw new Error('DB not connected');
  // Use bucket name 'uploads'
  return new mongoose.mongo.GridFSBucket(db, { bucketName: 'uploads' });
}

// Upload base64 image to GridFS
router.post('/base64', requireAuth, async (req, res) => {
  try {
    const { data, filename = `image_${Date.now()}.png`, contentType = 'image/png' } = req.body || {};
    if (!data || typeof data !== 'string') {
      return res.status(400).json({ error: 'data (base64 string) is required' });
    }
    const base64 = data.startsWith('data:') ? data.split(',')[1] : data;
    const buffer = Buffer.from(base64, 'base64');
    const bucket = getBucket();
    const uploadStream = bucket.openUploadStream(filename, { contentType });
    uploadStream.end(buffer, async () => {
      res.json({ success: true, fileId: uploadStream.id.toString() });
    });
  } catch (error) {
    console.error('GridFS upload error:', error);
    res.status(500).json({ error: 'Failed to upload file' });
  }
});

// Serve file by id
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const bucket = getBucket();
    const objectId = new mongoose.Types.ObjectId(id);
    const downloadStream = bucket.openDownloadStream(objectId);
    downloadStream.on('file', (file) => {
      if (file?.contentType) res.set('Content-Type', file.contentType);
    });
    downloadStream.on('error', () => res.status(404).json({ error: 'File not found' }));
    downloadStream.pipe(res);
  } catch (_e) {
    res.status(400).json({ error: 'Invalid file id' });
  }
});

// Delete file by id
router.delete('/:id', requireAuth, async (req, res) => {
  try {
    const bucket = getBucket();
    const objectId = new mongoose.Types.ObjectId(req.params.id);
    await bucket.delete(objectId);
    res.json({ success: true });
  } catch (error) {
    console.error('GridFS delete error:', error);
    res.status(500).json({ error: 'Failed to delete file' });
  }
});

export default router;

