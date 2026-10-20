import express from 'express';
import { protect } from '../middleware/authMiddleware.js';

import {
  saveDraft,
  publishBlog,
  getAllBlogs,
  getBlogById,
  deleteBlog
} from '../controllers/blogController.js';

const router = express.Router();


router.post('/save-draft', protect, saveDraft);
router.post('/publish', protect, publishBlog);
router.get('/', protect, getAllBlogs);
router.get('/:id', protect, getBlogById);
router.delete('/:id', protect, deleteBlog);

export default router;