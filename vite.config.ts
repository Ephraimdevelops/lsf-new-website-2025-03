
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
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      external: [],
      output: {
        manualChunks: undefined,
      },
    },
    sourcemap: false,
    commonjsOptions: {
      transformMixedEsModules: true,
    }
  },
  optimizeDeps: {
    include: ['react', 'react-dom', '@tanstack/react-query', '@radix-ui/react-tooltip']
  },
  define: {
    global: 'globalThis',
  }
}));
