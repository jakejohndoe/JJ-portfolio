import type { Express } from "express";
import express from "express";

// Import route handlers not needed here since they're imported in index.ts

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
  visitors?: number;
}

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
  visitors: 1000
};

export function registerRoutes(app: Express): void {
  // REMOVE THE CORS SETUP HERE - It's overriding your main CORS config!
  // app.use(cors({...})); - DELETE THIS LINE

  // Register the Routes
  app.get("/api/skills", (req, res) => {
    console.log("Fetching skills data...");
    res.json(skills);
  });

  app.get("/api/services", (req, res) => {
    console.log("Fetching services data...");
    res.json(services);
  });

  app.get("/api/projects", (req, res) => {
    console.log("Fetching projects data...");
    res.json(projects);
  });

  app.get("/api/stats", (req, res) => {
    console.log("Fetching stats data...");
    const dynamicStats = {
      ...stats,
      visitors: stats.visitors ? stats.visitors + Math.floor(Math.random() * 100) : 1000
    };
    res.json(dynamicStats);
  });

  // Endpoint for sending resume (HTML)
  app.get("/api/resume", (req, res) => {
    console.log("Sending resume...");
    res.sendFile("resume.html", {
      root: "./public",
      headers: {
        "Content-Type": "text/html"
      }
    });
  });

  // Endpoint for handling contact form submission
  app.post("/api/contact", express.json(), (req, res) => {
    const { name, email, subject, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        error: "Missing required fields",
        required: ["name", "email", "message"]
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Invalid email format" });
    }

    console.log("New contact submission:", { name, email, subject, message });
    res.json({
      success: true,
      message: "Thank you for your message! I'll get back to you soon."
    });
  });
  
  // Debugging endpoint
  app.get("/api/debug", (req, res) => {
    console.log("Debug endpoint hit");
    console.log("Request headers:", req.headers);
    console.log("Origin:", req.headers.origin);
    
    res.json({
      success: true,
      message: "API is working",
      environment: process.env.NODE_ENV || 'development',
      timestamp: new Date().toISOString(),
      cors: {
        origin: req.headers.origin || 'unknown'
      }
    });
  });
}