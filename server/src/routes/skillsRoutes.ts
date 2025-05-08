import express, { Request, Response } from 'express';
import { skills } from '../data/skills.js';

const router = express.Router();

// GET all skills
router.get('/', (req: Request, res: Response) => {
  console.log("Fetching skills data...");
  res.json(skills);
});

export default router;