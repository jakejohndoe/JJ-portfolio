import express from "express";
import path from "path";
import { config } from "dotenv";
import connectDB from './db/connection';
import contactRoutes from './routes/contactRoutes';
import blogRoutes from './routes/blogRoutes';
import authRoutes from './routes/authRoutes';
import cors from "cors";

// Load environment variables
config({ path: path.resolve(process.cwd(), '.env.production') });

// Create Express app
const app = express();
const PORT = process.env.PORT || 4747;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: [
    'https://hellojakejohn.vercel.app',
    'http://localhost:3000'
  ],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/contact', contactRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/auth', authRoutes);

// Simple health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Production server running on port ${PORT}`);
});