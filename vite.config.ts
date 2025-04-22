import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [
    react(),
    ...(process.env.NODE_ENV !== 'production' 
      ? [
          // Only load these in development
          (await import("@replit/vite-plugin-runtime-error-modal")).default(),
          process.env.REPL_ID && 
            (await import("@replit/vite-plugin-cartographer")).then(m => m.cartographer())
        ].filter(Boolean)
      : [])
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "client/dist"),
    emptyOutDir: true,
    rollupOptions: {
      external: [
        /^@radix-ui\/react-.*/  // Externalize all Radix components
      ],
    }
  }
});