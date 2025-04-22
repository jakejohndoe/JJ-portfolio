import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

// Mock data for demo purposes
const skills = [
  { name: "HTML5", icon: "fab fa-html5" },
  { name: "CSS", icon: "fab fa-css3-alt" },
  { name: "JavaScript", icon: "fab fa-js" },
  { name: "Node.js", icon: "fab fa-node-js" },
  { name: "React", icon: "fab fa-react" },
  { name: "Git", icon: "fab fa-git-alt" },
  { name: "GitHub", icon: "fab fa-github" }
];

const services = [
  {
    title: "React/Next.js Development",
    description: "High-performance React applications with SSR and optimized rendering.",
    icon: "fab fa-react"
  },
  {
    title: "Node.js Backends",
    description: "Scalable server-side applications with Express or NestJS.",
    icon: "fab fa-node-js"
  },
  {
    title: "TypeScript Expertise",
    description: "Type-safe JavaScript development for more robust applications.",
    icon: "fas fa-shield-alt"
  },
  {
    title: "Database Solutions",
    description: "PostgreSQL, MongoDB, and ORMs like Prisma/Drizzle.",
    icon: "fas fa-database"
  },
  {
    title: "Cloud Architecture",
    description: "AWS/Vercel deployments with Terraform and Docker.",
    icon: "fas fa-cloud"
  }
];

const projects = [
  {
    title: "Promptly",
    description: "Promptly makes talking to any AI smarter, faster, and way easier.",
    image: "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?auto=format&fit=crop&w=1170&q=80",
    technologies: [
      { name: "React" },
      { name: "Tailwind CSS" },
      { name: "Node.js" },
      { name: "MongoDB" },
      { name: "Express" }
    ]
  },
  {
    title: "Rework",
    description: "Rework instantly refines your resume to match any job—optimized, personalized, and ready to send.",
    image: "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?auto=format&fit=crop&w=1170&q=80",
    technologies: [
      { name: "React" },
      { name: "Tailwind CSS" },
      { name: "Node.js" },
      { name: "Express" },
      { name: "MongoDB" }
    ]
  },
  {
    title: "Moodo",
    description: "A Mood-Based To-Do List App that helps you manage tasks based on your mood.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fGRhc2hib2FyZHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
    technologies: [
      { name: "Vue.js" },
      { name: "D3.js" },
      { name: "Express" }
    ]
  }
];

const stats = {
  completedProjects: 3,
  satisfaction: 95,
  experience: 2
};

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoints
  app.get("/api/skills", (req, res) => {
    res.json(skills);
  });

  app.get("/api/services", (req, res) => {
    res.json(services);
  });

  app.get("/api/projects", (req, res) => {
    res.json(projects);
  });

  app.get("/api/stats", (req, res) => {
    res.json(stats);
  });
  
  // Serve resume
  app.get("/api/resume", (req, res) => {
    res.sendFile("resume.html", { root: "./public" });
  });

  app.post("/api/contact", (req, res) => {
    const { name, email, subject, message } = req.body;
    
    // Validate inputs
    if (!name || !email || !message) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    
    // Here we would typically save the message or send an email
    // For now, just return success response
    res.status(200).json({ 
      success: true, 
      message: "Message received successfully" 
    });
  });

  const httpServer = createServer(app);

  return httpServer;
}
