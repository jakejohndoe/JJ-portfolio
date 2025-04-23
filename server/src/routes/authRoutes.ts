import express from 'express';
import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import User, { IUserDocument } from '../models/User.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

interface JwtPayload {
  id: string;
}

const generateToken = (id: string) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is not defined');
  }
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// @route POST /api/auth/register
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
      return res.status(400).json({ message: 'All fields required' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User exists' });
    }
    
    const user = await User.create({
      username,
      email,
      password,
      isAdmin: (await User.countDocuments({})) === 0,
    });

    // Use mongoose.Types.ObjectId explicitly
    const userId = user._id as mongoose.Types.ObjectId;
    const token = generateToken(userId.toString());
    
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 30 * 24 * 60 * 60 * 1000
    }).status(201).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      isAdmin: user.isAdmin
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password required' });
    }

    const user = await User.findOne({ email }).select('+password');
    
    if (user && (await user.matchPassword(password))) {
      // Use mongoose.Types.ObjectId explicitly
      const userId = user._id as mongoose.Types.ObjectId;
      const token = generateToken(userId.toString());
      
      res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 30 * 24 * 60 * 60 * 1000
      }).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        isAdmin: user.isAdmin
      });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// @route POST /api/auth/logout
router.post('/logout', (req, res) => {
  res.clearCookie('token').json({ message: 'Logged out' });
});

// @route GET /api/auth/profile
router.get('/profile', protect, async (req: express.Request, res) => {
  try {
    const user = (await User.findById((req as any).user._id)) as IUserDocument | null;
    res.json(user || { message: 'User not found' });
  } catch (error) {
    console.error('Profile error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;