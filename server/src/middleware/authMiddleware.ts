import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import User, { IUserDocument } from '../models/User.js'; // Updated import

declare global {
  namespace Express {
    interface Request {
      user?: IUserDocument; // Use the imported type
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  let token;
  
  if (req.headers.authorization?.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
      req.user = await User.findById(decoded.id).select('-password');
      next();
    } catch (error) {
      console.error('Auth error:', error);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

export const admin = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.isAdmin) {
    next();
  } else {
    res.status(401).json({ message: 'Not authorized as admin' });
  }
};