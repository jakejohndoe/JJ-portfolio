import express from "express";
import path from "path";
import fs from "fs";
import { config } from "dotenv";
import { log } from "./vite";
import connectDB from './db/connection';
import contactRoutes from './routes/contactRoutes';
import blogRoutes from './routes/blogRoutes';
import authRoutes from './routes/authRoutes';

// Load environment variables from .env.production if exists
config({ path: path.resolve(process.cwd(), '.env.production') });

// Create Express app
const app = express();
const PORT = process.env.PORT || 4747;

// Connect to MongoDB
connectDB();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/contact', contactRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/auth', authRoutes);

// Serve static files from both Vite build and public folder
const distPath = path.resolve(process.cwd(), "client/dist");
const publicPath = path.resolve(process.cwd(), "public");

if (fs.existsSync(publicPath)) {
  app.use(express.static(publicPath));
}

if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  
  // Handle client-side routing
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }
    
    const indexPath = path.join(distPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      next();
    }
  });
}

// Start server
app.listen(PORT, "0.0.0.0", () => {
  log(`Production server running on port ${PORT}`, "server");
});