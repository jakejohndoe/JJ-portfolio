# Jensen Omega Portfolio Website

A responsive portfolio website built with React, TypeScript, and Tailwind CSS.

## Features

- 🌙 Modern dark-themed design with orange accent colors
- 🏆 Interactive sections with animated counters
- 📱 Fully responsive for all device sizes
- 📝 Contact form with validation
- 📄 Downloadable resume
- 🔄 API integration for dynamic content

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS
- **UI Components**: ShadCN UI Component Library 
- **State Management**: React Query
- **Form Handling**: React Hook Form with Zod validation
- **Backend**: Express.js
- **Routing**: Wouter
- **Build Tool**: Vite

## Project Structure

```
portfolio-website/
├── client/               # Frontend React application
│   ├── src/
│   │   ├── components/   # UI components
│   │   ├── hooks/        # Custom React hooks
│   │   ├── lib/          # Utility functions
│   │   ├── pages/        # Page components
│   │   └── App.tsx       # Main application component
├── server/               # Express.js backend
├── shared/               # Shared types and schemas
└── public/               # Public assets
```

## Getting Started

### Prerequisites

- Node.js 20 or later
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/portfolio-website.git
cd portfolio-website
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5000`

## API Endpoints

- `/api/skills` - Get user skills
- `/api/services` - Get services offered
- `/api/projects` - Get portfolio projects
- `/api/stats` - Get statistics (completed projects, satisfaction rate, etc.)
- `/api/resume` - Serve resume HTML
- `/api/contact` - Submit contact form

## Customization

- Edit theme colors in `client/src/index.css`
- Update content in `server/routes.ts`
- Modify resume in `public/resume.html`

## License

This project is open source and available under the [MIT License](LICENSE).