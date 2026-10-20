import Blog from '../models/Blog.js';

// Save or update a draft (used for both new and existing blog drafts)
export const saveDraft = async (req, res) => {
  const { id, title, content, tags, status = 'draft' } = req.body;

  try {
    let blog;
    if (id) {
      // Update existing draft
      blog = await Blog.findByIdAndUpdate(id, {
        title, content, tags, status
      }, { new: true });
    } else {
      // Create new draft
      blog = new Blog({ title,
        content,
        tags,
        status,
        user: req.user._id
       });
      await blog.save();
    }
    res.status(200).json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Publish a new post or update an existing one (always sets status to 'published')
export const publishBlog = async (req, res) => {
  const { id, title, content, tags } = req.body;

  try {
    let blog;
    if (id) {
      // Update and publish existing post
      blog = await Blog.findByIdAndUpdate(id, {
        title, content, tags, status: 'published'
      }, { new: true });
    } else {
      // Create and publish new post
      blog = new Blog({ title, content, tags, status: 'published', user: req.user._id });
      await blog.save();
    }
    res.status(200).json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const getAllBlogs = async (req, res) => {
  try {
    let blogs;
    if (req.user) {
      blogs = await Blog.find({
        $or: [
          { user: req.user._id },           // Show logged-in user's own blogs
          { status: 'published' }           // Or any published blogs from others
        ]
      }).populate('user').sort({ updatedAt: -1 });
    } else {
      // For public/unauthenticated access (if needed)
      blogs = await Blog.find({ status: 'published' }).sort({ updatedAt: -1 });
    }

    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};


// Get blog by ID
export const getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: 'Not found' });
    res.status(200).json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


export const deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }

    if (blog.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this blog' });
    }

    await blog.deleteOne();
    res.status(200).json({ message: 'Blog deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};