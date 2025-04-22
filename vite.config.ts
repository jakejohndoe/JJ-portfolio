import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
    // Add this to ensure module resolution
    preserveSymlinks: true,
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "client/dist"),
    emptyOutDir: true,
    // Add these optimizations
    minify: 'terser',
    sourcemap: true,
    rollupOptions: {
      output: {
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
        // Add manual chunks for better dependency tracking
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@radix-ui')) {
              return 'radix';
            }
            return 'vendor';
          }
        }
      }
    }
  },
  server: {
    port: 3000,
    // Add this for development
    fs: {
      strict: true
    }
  },
  // Add this optimization
  optimizeDeps: {
    include: [
      '@radix-ui/react-slot',
      '@radix-ui/react-dropdown-menu',
      // Add other Radix packages you use
    ],
    exclude: ['js-big-decimal']
  }
});