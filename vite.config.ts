import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      // Use explicit paths (critical for Vercel)
      "@": path.resolve(__dirname, "client/src"),
      "@shared": path.resolve(__dirname, "shared"),
      "@assets": path.resolve(__dirname, "attached_assets"),
      // Force Radix to resolve from node_modules
      "@radix-ui/react-slot": path.resolve(__dirname, "node_modules/@radix-ui/react-slot/dist/index.mjs"),
      "@radix-ui/react-dropdown-menu": path.resolve(__dirname, "node_modules/@radix-ui/react-dropdown-menu/dist/index.mjs"),
    },
  },
  root: path.resolve(__dirname, "client"),
  build: {
    outDir: path.resolve(__dirname, "client/dist"),
    emptyOutDir: true,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes("@radix-ui")) return "radix";
          if (id.includes("node_modules")) return "vendor";
        },
      },
    },
  },
});