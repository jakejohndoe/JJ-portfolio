import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage.js";
import cors from "cors"; // Add this import

// Enhanced mock data with proper typing
interface Skill {
  id: number;
  name: string;
  icon: string;
  category?: string;
  level?: number;
}

interface Service {
  id: number;
  title: string;
  description: string;
  icon: string;
}

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  technologies: { name: string }[];
}

interface Stats {
  completedProjects: number;
  satisfaction: number;
  experience: number;
  visitors?: number; // Added to match frontend expectations
}

// Enhanced mock data with IDs and additional fields
const skills: Skill[] = [
  { id: 1, name: "HTML5", icon: "fab fa-html5", category: "Frontend", level: 90 },
  { id: 2, name: "CSS", icon: "fab fa-css3-alt", category: "Frontend", level: 85 },
  { id: 3, name: "JavaScript", icon: "fab fa-js", category: "Fullstack", level: 88 },
  { id: 4, name: "Node.js", icon: "fab fa-node-js", category: "Backend", level: 85 },
  { id: 5, name: "React", icon: "fab fa-react", category: "Frontend", level: 90 },
  { id: 6, name: "Git", icon: "fab fa-git-alt", category: "Tools", level: 80 },
  { id: 7, name: "GitHub", icon: "fab fa-github", category: "Tools", level: 85 }
];

const services: Service[] = [
  {
    id: 1,
    title: "React/Next.js Development",
    description: "High-performance React applications with SSR and optimized rendering.",
    icon: "fab fa-react"
  },
  {
    id: 2,
    title: "Node.js Backends",
    description: "Scalable server-side applications with Express or NestJS.",
    icon: "fab fa-node-js"
  },
  {
    id: 3,
    title: "TypeScript Expertise",
    description: "Type-safe JavaScript development for more robust applications.",
    icon: "fas fa-shield-alt"
  }
];

const projects: Project[] = [
  {
    id: 1,
    title: "Promptly",
    description: "Promptly makes talking to any AI smarter, faster, and way easier.",
    image: "https://images.unsplash.com/photo-1603791440384-56cd371ee9a7?auto=format&fit=crop&w=1170&q=80",
    technologies: [
      { name: "React" },
      { name: "Tailwind CSS" },
      { name: "Node.js" }
    ]
  }
];

const stats: Stats = {
  completedProjects: 3,
  satisfaction: 95,
  experience: 2,
  visitors: 1000 // Added to match frontend Stats interface
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Enable CORS for your Vercel frontend
  app.use(cors({
    origin: [
      'https://hellojakejohn.vercel.app',
      'http://localhost:3000'
    ],
    credentials: true
  }));

  // API endpoints with error handling
  app.get("/api/skills", (req, res) => {
    try {
      res.json(skills);
    } catch (error) {
      console.error("Skills endpoint error:", error);
      res.status(500).json({ error: "Failed to fetch skills" });
    }
  });

  app.get("/api/services", (req, res) => {
    try {
      res.json(services);
    } catch (error) {
      console.error("Services endpoint error:", error);
      res.status(500).json({ error: "Failed to fetch services" });
    }
  });

  app.get("/api/projects", (req, res) => {
    try {
      res.json(projects);
    } catch (error) {
      console.error("Projects endpoint error:", error);
      res.status(500).json({ error: "Failed to fetch projects" });
    }
  });

  app.get("/api/stats", (req, res) => {
    try {
      // Simulate some dynamic data
      const dynamicStats = {
        ...stats,
        visitors: stats.visitors ? stats.visitors + Math.floor(Math.random() * 100) : 1000
      };
      res.json(dynamicStats);
    } catch (error) {
      console.error("Stats endpoint error:", error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });
  
  // Serve resume with proper headers
  app.get("/api/resume", (req, res) => {
    try {
      res.sendFile("resume.html", { 
        root: "./public",
        headers: {
          'Content-Type': 'text/html'
        }
      });
    } catch (error) {
      console.error("Resume endpoint error:", error);
      res.status(500).json({ error: "Failed to load resume" });
    }
  });

  // Enhanced contact form with validation
  app.post("/api/contact", express.json(), (req, res) => {
    try {
      const { name, email, subject, message } = req.body;
      
      if (!name || !email || !message) {
        return res.status(400).json({ 
          error: "Missing required fields",
          required: ["name", "email", "message"]
        });
      }

      // Validate email format
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: "Invalid email format" });
      }

      // Here you would typically:
      // 1. Save to database
      // 2. Send email notification
      console.log("New contact submission:", { name, email, subject, message });

      res.json({ 
        success: true, 
        message: "Thank you for your message! I'll get back to you soon."
      });
    } catch (error) {
      console.error("Contact endpoint error:", error);
      res.status(500).json({ error: "Failed to process contact form" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}