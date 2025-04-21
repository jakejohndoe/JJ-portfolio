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
    title: "Website Development",
    description: "Creating responsive, modern websites with the latest technologies.",
    icon: "fas fa-laptop-code"
  },
  {
    title: "App Development",
    description: "Building cross-platform mobile applications with React Native.",
    icon: "fas fa-mobile-alt"
  },
  {
    title: "Website Hosting",
    description: "Secure and reliable hosting solutions for your web projects.",
    icon: "fas fa-server"
  }
];

const projects = [
  {
    title: "E-commerce Platform",
    description: "A full-featured online store with payment integration.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fHdlYnNpdGV8ZW58MHx8MHx8&auto=format&fit=crop&w=500&q=60",
    technologies: [
      { name: "React" },
      { name: "Node.js" },
      { name: "MongoDB" }
    ]
  },
  {
    title: "Health Tracker App",
    description: "Mobile application for tracking fitness and nutrition goals.",
    image: "https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8Nnx8bW9iaWxlJTIwYXBwfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60",
    technologies: [
      { name: "React Native" },
      { name: "Firebase" },
      { name: "Redux" }
    ]
  },
  {
    title: "Analytics Dashboard",
    description: "Interactive business analytics platform with real-time data.",
    image: "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MTR8fGRhc2hib2FyZHxlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60",
    technologies: [
      { name: "Vue.js" },
      { name: "D3.js" },
      { name: "Express" }
    ]
  }
];

const stats = {
  completedProjects: 120,
  satisfaction: 95,
  experience: 10
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
