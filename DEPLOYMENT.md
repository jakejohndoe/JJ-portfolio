# Deployment Documentation

This document outlines the deployment architecture and processes for the Jake Johnson Portfolio website.

## Current Deployment Architecture

### Overview

The application uses a modern cloud-based deployment architecture:

```ascii
                                 ┌─────────────────┐
                                 │                 │
                                 │  hellojakejohn  │
                                 │     .com        │
                                 │                 │
                                 └────────┬────────┘
                                          │
                                          ▼
┌─────────────────┐              ┌─────────────────┐              ┌─────────────────┐
│                 │              │                 │              │                 │
│   Vercel CDN    │◄─────────────│  Vercel Edge    │◄─────────────│  Vercel Build   │
│   (Static       │              │  Network        │              │  Pipeline       │
│    Assets)      │              │  (API Routes)   │              │                 │
│                 │              │                 │              │                 │
└─────────────────┘              └────────┬────────┘              └────────┬────────┘
                                          │                                │
                                          │                                │
                                          ▼                                │
                                 ┌─────────────────┐                       │
                                 │                 │                       │
                                 │  MongoDB Atlas  │◄──────────────────────┘
                                 │  (Database)     │
                                 │                 │
                                 └─────────────────┘
Frontend Deployment (Vercel)

Platform: Vercel (PaaS)
Repository Connection: Direct integration with GitHub repository
Build Command: npm run build (defined in package.json)
Output Directory: client/dist
Framework Preset: Vite
Node.js Version: 18.x

Backend Deployment (Vercel)

API Routes: Deployed as serverless functions
Runtime: Node.js 18.x
Region: Auto (closest to user)
Scaling: Automatic based on demand

Database (MongoDB Atlas)

Service: MongoDB Atlas (DBaaS)
Tier: Shared Cluster (M0 Sandbox)
Region: AWS / US East
Connection: Secured via connection string in environment variables
IP Whitelist: Configured to allow Vercel IP ranges

Domain & DNS

Domain Provider: Namecheap
DNS Configuration: Vercel nameservers
SSL Certificate: Automatically provisioned by Vercel
HTTPS: Enforced for all traffic

Environment Configuration
Environment Variables
Production environment variables are configured in the Vercel dashboard:
MONGODB_URI=mongodb+srv://...
JWT_SECRET=...
EMAIL_USER=hellojakejohn@gmail.com
EMAIL_PASS=...
Local development uses .env files that are not committed to the repository:
.env              # Development variables
.env.production   # Production variables (used for testing production builds locally)
Security Considerations

Sensitive credentials are never committed to the repository
JWT tokens for authentication with secure HTTP-only cookies
Environment variables for all secrets and configuration
Database connection secured with username/password and network restrictions

Deployment Process
Continuous Deployment

Code is pushed to the main branch on GitHub
Vercel automatically detects changes and initiates a new build
Build process runs npm run build to compile frontend assets
Backend code is packaged into serverless functions
Once build completes, Vercel automatically deploys to production
Preview deployments are generated for pull requests

Rollback Procedure
If issues are detected in production:

Access the Vercel dashboard
Navigate to the Deployments tab
Select a previous working deployment
Click "Promote to Production"

Monitoring and Logging

Application Errors: Tracked in Vercel logs
Performance Monitoring: Vercel Analytics
Uptime Monitoring: Implemented through Vercel status checks

Potential Future Enhancements
Containerization with Docker
Implementing Docker would provide these benefits:

Consistent development environment
Easier local testing
Potential for alternative deployment options

Example Dockerfile for the application:
dockerfileFROM node:18-alpine as builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/server ./server
COPY --from=builder /app/client/dist ./client/dist
COPY package*.json ./
RUN npm install --production
EXPOSE 3000
CMD ["npm", "start"]
Additional Deployment Environments
Implementing a proper staging environment would allow for:

Testing in a production-like environment before release
QA processes without affecting production users
A/B testing new features

CI/CD Pipeline Enhancement
Adding GitHub Actions workflow for automated testing and deployment:
yamlname: CI/CD Pipeline

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Use Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm install
      - run: npm test

  deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: echo "Deployment would happen here"
Resources

Vercel Documentation
MongoDB Atlas Documentation
Node.js Best Practices