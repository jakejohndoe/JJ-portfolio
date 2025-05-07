import express, { Request, Response, NextFunction } from "express";
import { config } from 'dotenv';
import path from 'path';
import cors from 'cors';
import connectDB from './db/connection.js';
import contactRoutes from './routes/contactRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import authRoutes from './routes/authRoutes.js';
import { registerRoutes } from './routes.js';

// Load env vars
config({ path: path.resolve(process.cwd(), '.env') });

// Validate essential environment variables
const requiredEnvVars = ['PORT', 'MONGODB_URI'];
for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Missing required environment variable: ${envVar}`);
    process.exit(1);
  }
}

// Initialize Express app
const app = express();
const PORT = parseInt(process.env.PORT || '4747', 10);

// Enhanced CORS setup
const corsOptions = {
  origin: [
    'https://www.hellojakejohn.com',
    'https://hellojakejohn.com',
    'https://hellojakejohn.vercel.app',
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 200
};

// Middleware setup
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Health Check - MUST COME FIRST
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Request logging middleware (skips API routes)
app.use((req: Request, res: Response, next: NextFunction) => {
  if (req.path.startsWith('/api')) return next();
  
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

// API Routes
app.use('/api/contact', contactRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/auth', authRoutes);

// Register portfolio routes
registerRoutes(app);

// Static files - MUST COME AFTER API ROUTES
app.use(express.static(path.join(".", "public")));

// API 404 handler
app.use('/api/*', (req: Request, res: Response) => {
  res.status(404).json({
    error: 'API endpoint not found',
    path: req.originalUrl
  });
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(`[${new Date().toISOString()}] Error:`, err.stack);
  
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Internal Server Error' : err.message;
  
  res.status(statusCode).json({
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Database connection and server start
connectDB()
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`CORS enabled for: ${corsOptions.origin.join(', ')}`);
    });
  })
  .catch((error) => {
    console.error('Database connection failed', error);
    process.exit(1);
  });

// Handle process events
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});