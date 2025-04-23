import express from 'express';
import Blog from '../models/Blog.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// @route GET /api/blogs
router.get('/', async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    console.error('Error fetching blogs:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route GET /api/blogs/:id
router.get('/:id', async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    res.json(blog || { message: 'Blog not found' });
  } catch (error) {
    console.error('Error fetching blog:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route POST /api/blogs
router.post('/', protect, admin, async (req, res) => {
  try {
    const { title, excerpt, content, imageUrl } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content required' });
    }
    
    const newBlog = await Blog.create({ title, excerpt, content, imageUrl });
    res.status(201).json(newBlog);
  } catch (error) {
    console.error('Error creating blog:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route PUT /api/blogs/:id
router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { title, excerpt, content, imageUrl } = req.body;
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ message: 'Blog not found' });
    }
    
    blog.title = title || blog.title;
    blog.excerpt = excerpt || blog.excerpt;
    blog.content = content || blog.content;
    blog.imageUrl = imageUrl || blog.imageUrl;
    blog.updatedAt = new Date();
    
    const updatedBlog = await blog.save();
    res.json(updatedBlog);
  } catch (error) {
    console.error('Error updating blog:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route DELETE /api/blogs/:id
router.delete('/:id', protect, admin, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    
    await blog.deleteOne();
    res.json({ message: 'Blog removed' });
  } catch (error) {
    console.error('Error deleting blog:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;