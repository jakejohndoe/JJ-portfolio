import express from "express";
import { config } from "dotenv";
import path from "path";
import connectDB from './db/connection.js';
import cors from "cors";
import authRoutes from './routes/authRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import blogRoutes from './routes/blogRoutes.js';
import skillsRoutes from './routes/skillsRoutes.js'; // Add skills routes
import projectsRoutes from './routes/projectsRoutes.js'; // Add projects routes
import servicesRoutes from './routes/servicesRoutes.js'; // Add services routes
import statsRoutes from './routes/statsRoutes.js'; // Add stats routes

// Load env vars FIRST
config({ path: path.resolve(process.cwd(), '.env') });

const app = express();
const PORT = parseInt(process.env.PORT || '4747', 10);

// Connect to DB
connectDB();

// CORS Middleware - Updated with correct origins
app.use(cors({
  origin: [
    'https://www.hellojakejohn.com',
    'https://hellojakejohn.com',
    'https://hellojakejohn.vercel.app',
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Additional headers for CORS issues
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://www.hellojakejohn.com');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  
  next();
});

app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/blogs', blogRoutes);
app.use('/api/portfolio/skills', skillsRoutes); // Add skills routes with the correct path
app.use('/api/portfolio/projects', projectsRoutes); // Add projects routes
app.use('/api/portfolio/services', servicesRoutes); // Add services routes
app.use('/api/portfolio/stats', statsRoutes); // Add stats routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy' });
});

// Base route
app.get('/', (req, res) => {
  res.send('JJ Portfolio API is live!');
});

// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server error' });
});

// Start server
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Production server running on port ${PORT}`);
});