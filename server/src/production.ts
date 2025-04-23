import express from "express";
import { config } from "dotenv";
import path from "path";
import connectDB from './db/connection.js';
import cors from "cors";

// Load env vars FIRST
config({ path: path.resolve(process.cwd(), '.env') });

const app = express();
const PORT = parseInt(process.env.PORT || '4747', 10);

// Connect to DB
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

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'healthy' });
});


app.get('/', (req, res) => {
  res.send('JJ Portfolio API is live!');
});


// Error handling
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Server error' });
});

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Production server running on port ${PORT}`);
});