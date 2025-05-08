import { Router } from 'express';
import { Project, Skill, Stats, Service } from '../types/portfolioTypes.js';

const router = Router();

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
  { id: 1, name: "JavaScript", level: 90, category: "Frontend" }
];

// NOTE: Routes are relative to '/api' (from app.use('/api', portfolioRoutes))
router.get('/projects', (req, res) => {
  res.json(projects);
});

router.get('/skills', (req, res) => {
  res.json(skills);
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

export default router;