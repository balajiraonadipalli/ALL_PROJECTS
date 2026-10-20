import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  tags: [String],
  status: {
    type: String,
    enum: ['draft', 'published'],
    default: 'draft',
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  }
}, { timestamps: true });

export default mongoose.model('Blog', blogSchema);