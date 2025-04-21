# VS Code Setup Guide for Portfolio Website

This guide will help you set up the portfolio website project in Visual Studio Code.

## Step 1: Set Up Local Folder Structure

1. Create a new folder on your computer named `portfolio-website`
2. Open VS Code and select **File > Open Folder...** to open this new folder
3. In VS Code, create the following folder structure:

```
portfolio-website/
├── client/
│   ├── src/
│   │   ├── components/
│   │   │   └── ui/
│   │   ├── hooks/
│   │   ├── lib/
│   │   └── pages/
├── public/
├── server/
└── shared/
```

## Step 2: Copy Essential Files

Copy each file from Replit to your local VS Code project, maintaining the same folder structure.

The most important files are:

1. **Root Configuration Files**
   - package.json
   - tsconfig.json
   - vite.config.ts
   - postcss.config.js
   - tailwind.config.ts
   - components.json
   - drizzle.config.ts

2. **Server Files**
   - server/index.ts
   - server/routes.ts
   - server/storage.ts
   - server/vite.ts
   - shared/schema.ts

3. **Client Files**
   - client/index.html
   - client/src/App.tsx
   - client/src/main.tsx
   - client/src/index.css
   - client/src/pages/Home.tsx
   - client/src/pages/not-found.tsx
   - All component files in client/src/components/
   - All UI component files in client/src/components/ui/
   - All hook files in client/src/hooks/
   - All utility files in client/src/lib/

4. **Public Assets**
   - public/resume.html

## Step 3: Install Dependencies and Run

1. Open a terminal in VS Code (**Terminal > New Terminal**)
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser to http://localhost:5000

## Step 4: Optional Git Setup

1. Initialize a Git repository:
   ```bash
   git init
   ```
2. Add all files:
   ```bash
   git add .
   ```
3. Make your first commit:
   ```bash
   git commit -m "Initial commit of portfolio website"
   ```
4. Create a GitHub repository at github.com
5. Connect your local repository to GitHub:
   ```bash
   git remote add origin https://github.com/yourusername/portfolio-website.git
   git push -u origin main
   ```

## Troubleshooting

- If you get dependency errors, check that you're using Node.js 20
- Make sure all files have been copied with the correct paths
- Verify that your package.json has all required dependencies
- If you encounter "module not found" errors, double-check import paths