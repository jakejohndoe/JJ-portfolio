import express, { Request, Response, NextFunction } from "express";
import { config } from 'dotenv';
import path from 'path';
import connectDB from './db/connection.js';
import contactRoutes from './routes/contactRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import authRoutes from './routes/authRoutes.js';

// Load env vars FIRST
config({ path: path.resolve(process.cwd(), '.env') });

// Connect to MongoDB
connectDB();

const app = express();
const PORT = parseInt(process.env.PORT || '4747', 10);

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(".", "public")));

// API Routes
app.use('/api/contact', contactRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/auth', authRoutes);

// Request logging
app.use((req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  const originalJson = res.json;
  let responseBody: any;

  res.json = function(body) {
    responseBody = body;
    return originalJson.call(this, body);
  };

  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.path} ${res.statusCode} - ${duration}ms`);
  });

  next();
});

// Error handling
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server error' });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});