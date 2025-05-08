// src/routes/portfolioRoutes.ts
import { Router } from 'express';
import { Project, Skill } from '../types/portfolioTypes.js';

const router = Router();

// Debug middleware
router.use((req, res, next) => {
  console.log(`[Portfolio] ${req.method} ${req.path}`);
  next();
});

// Mock data
const projects: Project[] = [
  {
    id: 1,
    title: "My Portfolio",
    description: "The website you're seeing right now",
    technologies: ["React", "TypeScript", "Node.js"],
    imageUrl: "/images/portfolio-screenshot.png"
  }
];

const skills: Skill[] = [
  { id: 1, name: "JavaScript", level: 90, category: "Frontend" },
  { id: 2, name: "TypeScript", level: 85, category: "Frontend" }
];

// Routes
router.get('/skills', (req, res) => {
  res.json(skills);
});

router.get('/projects', (req, res) => {
  res.json(projects);
});

router.get('/stats', (req, res) => {
  res.json({
    visitors: 0,
    projectsCompleted: projects.length,
    happyClients: 10
  });
});

router.get('/services', (req, res) => {
  res.json([
    { id: 1, title: "Web Development", description: "Full-stack web applications" }
  ]);
});

router.get('/debugtest', (req, res) => {
  res.json({
    status: 'success',
    message: 'All portfolio routes are working',
    availableRoutes: ['/skills', '/projects', '/stats', '/services', '/debugtest'],
    timestamp: new Date().toISOString()
  });
});

export default router;