# hellojakejohn.com 🌐

My personal website and portfolio. Live at: [https://www.hellojakejohn.com](https://www.hellojakejohn.com)

## 🚀 Features

- **Portfolio Showcase**: Interactive display of skills, projects, and services
- **Blog Platform**: Full-featured blog with admin management
- **Contact Form**: Direct communication channel with form validation
- **Admin Dashboard**: Secure admin area for content management
- **Responsive Design**: Mobile-friendly interface with custom animations
- **Dark Mode**: Elegant dark theme throughout the site

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with custom animations
- **UI Components**: ShadCN UI Component Library
- **State Management**: React Query for server state
- **Form Handling**: React Hook Form with Zod validation
- **Routing**: Wouter for lightweight navigation
- **Animations**: Framer Motion and custom CSS animations

### Backend
- **Server**: Express.js with TypeScript
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT with secure HTTP-only cookies
- **API**: RESTful endpoints with proper error handling
- **Email**: Nodemailer for contact form submissions

### DevOps
- **Build Tool**: Vite for fast development and optimized builds
- **Deployment**: Vercel for frontend and API deployment
- **Version Control**: Git with GitHub
- **Environment Variables**: Dotenv for configuration management

## 📦 Project Structure

The project is set up as a monorepo with separate client and server workspaces:

```bash
/
├── client/           # Frontend React application
├── server/           # Express API backend
├── e2e/              # End-to-end testing documentation
└── shared/           # Shared types and utilities
🔧 Installation (for local development)
bash# Clone the repository
git clone https://github.com/[your-username]/JJ-portfolio.git
cd JJ-portfolio

# Install dependencies
npm install

# Start development servers
npm run dev          # Frontend development server
npm run dev-server   # Backend development server


🧪 Testing Strategy
Overview
This portfolio project includes a comprehensive testing approach across multiple levels:
Unit Tests

Frontend Components: Tested with Jest and React Testing Library to verify correct rendering and user interactions
API Services: Isolated tests for API service functions to ensure they call correct endpoints and handle responses appropriately
Backend Routes: Unit tests for API endpoints using Jest and Supertest to verify CRUD operations work correctly

Integration Tests

Tests that verify frontend components correctly integrate with API services
Validation that form submissions properly update database records
Authentication flow testing between frontend and backend

End-to-End Tests

Complete user flows like admin login, blog management, and public navigation
Implementation approach using Selenium WebDriver to verify full application stack

Testing Implementation
Sample test files demonstrate the testing approach:

Frontend component tests (Navbar, apiService)
Backend route tests (blogRoutes)
E2E testing documentation and examples

📫 Contact

Email: hellojakejohn@gmail.com
Website: https://www.hellojakejohn.com

📝 License
This project is private and not licensed for public use or distribution.