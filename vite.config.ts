
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' && componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  optimizeDeps: {
    exclude: ['@rollup/rollup-linux-x64-gnu'],
    force: true
  },
  build: {
    commonjsOptions: {
      ignoreTryCatch: false
    },
    rollupOptions: {
      external: (id) => {
        return id.includes('@rollup/rollup-linux-x64-gnu');
      },
      output: {
        manualChunks: {
          // React ecosystem
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          // UI libraries
          'ui-vendor': [
            '@radix-ui/react-accordion',
            '@radix-ui/react-alert-dialog',
            '@radix-ui/react-avatar',
            '@radix-ui/react-checkbox',
            '@radix-ui/react-dialog',
            '@radix-ui/react-dropdown-menu',
            '@radix-ui/react-label',
            '@radix-ui/react-popover',
            '@radix-ui/react-select',
            '@radix-ui/react-separator',
            '@radix-ui/react-slot',
            '@radix-ui/react-switch',
            '@radix-ui/react-tabs',
            '@radix-ui/react-toast',
            '@radix-ui/react-tooltip',
          ],
          // Data/Forms
          'data-vendor': [
            '@tanstack/react-query',
            'react-hook-form',
            '@hookform/resolvers',
            'zod',
          ],
          // Animation/Motion
          'animation-vendor': ['framer-motion'],
          // Charts (heavy library)
          'charts-vendor': ['recharts'],
          // Auth
          'auth-vendor': ['@clerk/clerk-react', 'convex'],
          // Icons
          'icons-vendor': ['lucide-react'],
        },
      }
    },
    chunkSizeWarningLimit: 1000,
  },
  define: {
    global: 'globalThis',
  }
}));
