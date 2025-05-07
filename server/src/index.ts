import express, { Request, Response, NextFunction } from "express";
import { config } from 'dotenv';
import path from 'path';
import cors from 'cors';
import connectDB from './db/connection.js';
import contactRoutes from './routes/contactRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { registerRoutes } from './routes.ts'; // 👈 Import your custom portfolio routes

// Load env vars
config({ path: path.resolve(process.cwd(), '.env') });

// Connect to MongoDB
connectDB();

const app = express();
const PORT = parseInt(process.env.PORT || '4747', 10);

// CORS setup
const corsOptions = {
  origin: ['https://www.hellojakejohn.com', 'https://hellojakejohn.com', 'https://hellojakejohn.vercel.app', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};
app.use(cors(corsOptions));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(".", "public")));

// Main API Routes
app.use('/api/contact', contactRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/auth', authRoutes);

// 👇 Add this line to register your custom portfolio routes (skills, services, etc.)
registerRoutes(app);

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

// Error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server error' });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
