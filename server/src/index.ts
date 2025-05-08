import express, { Request, Response, NextFunction, Router } from "express";
import { config } from 'dotenv';
import path from 'path';
import cors from 'cors';
import connectDB from './db/connection.js';
import contactRoutes from './routes/contactRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import authRoutes from './routes/authRoutes.js';
import portfolioRouter from './routes/portfolioRoutes.js';

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

// Enhanced CORS setup with additional origins
const corsOptions = {
  origin: [
    'https://www.hellojakejohn.com',
    'https://hellojakejohn.com',
    'https://hellojakejohn.vercel.app',
    'https://hellojakejohn-git-main-jakobejohnson9-gmailcom-projects.vercel.app', // Add Vercel preview URL
    'http://localhost:3000',
    'http://localhost:5173'  // Vite default dev port
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200,
  preflightContinue: false,
  maxAge: 86400 // 24 hours in seconds - how long the browser should cache preflight results
};

// Apply CORS middleware FIRST before any other middleware
app.use(cors(corsOptions));

// Log CORS settings for debugging
console.log('\n[CORS] Configured with the following origins:');
corsOptions.origin.forEach((origin: string) => console.log(`- ${origin}`));

// Other Middleware setup
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Debug middleware
app.use((req, res, next) => {
  console.log(`\n[Request] ${req.method} ${req.path} (Origin: ${req.headers.origin || 'Unknown'})`);
  next();
});

// API Test endpoint (always works)
app.get('/api/test', (req, res) => {
  res.json({ 
    message: 'API is working!',
    time: new Date().toISOString(),
    cors: 'enabled', 
    headers: {
      'access-control-allow-origin': res.getHeader('access-control-allow-origin'),
      'content-type': res.getHeader('content-type')
    },
    request: {
      method: req.method,
      path: req.path,
      origin: req.headers.origin || 'Unknown',
      host: req.headers.host
    }
  });
});

// API Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// API Routes
app.use('/api/contact', contactRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/auth', authRoutes);

// Portfolio Routes with debug
console.log('\n[Route Debug] Registering portfolio routes...');

// Ensure all portfolio routes can be accessed directly
app.use('/api/skills', (req, res, next) => {
  req.url = '/skills';
  portfolioRouter(req, res, next);
});

app.use('/api/projects', (req, res, next) => {
  req.url = '/projects';
  portfolioRouter(req, res, next);
});

app.use('/api/stats', (req, res, next) => {
  req.url = '/stats';
  portfolioRouter(req, res, next);
});

app.use('/api/services', (req, res, next) => {
  req.url = '/services';
  portfolioRouter(req, res, next);
});

// Original portfolio routes
app.use('/api/portfolio', portfolioRouter);

// Debug route registration
console.log('\n[Route Debug] Registered Portfolio Paths:');
(portfolioRouter as any).stack.forEach((layer: any) => {
  if (layer.route) {
    const path = layer.route.path;
    const methods = layer.route.methods ? Object.keys(layer.route.methods).map(m => m.toUpperCase()).join(', ') : 'ALL';
    console.log(`- ${methods} ${path}`);
  }
});

// Static files
app.use(express.static(path.join(".", "public")));

// Improved API 404 handler with detailed error
app.use('/api/*', (req: Request, res: Response) => {
  console.error(`[404] No route for ${req.originalUrl}`);
  res.status(404).json({
    error: 'API endpoint not found',
    path: req.originalUrl,
    method: req.method,
    availableRoutes: [
      '/api/test',
      '/api/health',
      '/api/contact',
      '/api/blogs',
      '/api/auth',
      '/api/portfolio/skills',
      '/api/portfolio/projects',
      '/api/portfolio/stats',
      '/api/portfolio/debugtest',
      '/api/skills',
      '/api/projects',
      '/api/stats',
      '/api/services'
    ]
  });
});

// Global error handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(`[Error]`, err.stack);
  res.status(500).json({ 
    error: 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// Database connection and server start
connectDB()
  .then(() => {
    app.listen(PORT, "0.0.0.0", () => {
      console.log(`\n====== Server Started ======`);
      console.log(`Port: ${PORT}`);
      console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
      
      // Route verification
      console.log('\n=== Verified Routes ===');
      console.log('GET /api/test');
      console.log('GET /api/health');
      
      // Log all portfolio routes
      (portfolioRouter as any).stack.forEach((layer: any) => {
        if (layer.route) {
          const methods = layer.route.methods ? Object.keys(layer.route.methods).map(m => m.toUpperCase()).join(', ') : 'ALL';
          console.log(`${methods} /api/portfolio${layer.route.path}`);
          console.log(`${methods} /api${layer.route.path}`); // Direct routes
        }
      });
    });
  })
  .catch((error) => {
    console.error('Database connection failed', error);
    process.exit(1);
  });

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});