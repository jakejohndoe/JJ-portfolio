import express from "express";
import path from "path";
import fs from "fs";
import { config } from "dotenv";
import { log } from "./vite";

// Load environment variables
config();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for parsing JSON and urlencoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// API routes (replace with your actual API routes)
app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

// Import and use your API routes here
// import { userRouter } from "./routes/user";
// app.use("/api/users", userRouter);

// Serve static files if available
const distPath = path.resolve(process.cwd(), "dist");
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));
  
  // Handle client-side routing
  app.get("*", (req, res, next) => {
    if (req.path.startsWith("/api")) {
      return next();
    }
    
    const indexPath = path.join(distPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      next();
    }
  });
}

// Start server
app.listen(PORT, () => {
  log(`Production server running on port ${PORT}`, "server");
});