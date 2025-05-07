import express, { Request, Response, NextFunction } from 'express';
import { config } from 'dotenv';
import path from 'path';
import cors from 'cors';
import connectDB from './db/connection.js';

import contactRoutes from './routes/contactRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import authRoutes from './routes/authRoutes.js';
import projectRoutes from './routes/projectsRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import skillsRoutes from './routes/skillsRoutes.js';
import servicesRoutes from './routes/servicesRoutes.js';

config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 3000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.resolve('dist')));

// API Routes
app.use('/api/contact', contactRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/stats', statsRoutes);
app.use('/api/skills', skillsRoutes);
app.use('/api/services', servicesRoutes);

// Fallback to index.html for React Router
app.get('*', (req: Request, res: Response) => {
  res.sendFile(path.resolve('dist', 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
