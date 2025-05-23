
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
    // Disable native module dependency usage to avoid platform-specific issues
    target: 'esnext',
    rollupOptions: {
      // Explicitly disable native addons
      context: 'globalThis',
      output: {
        // Avoid generating platform-specific code
        manualChunks: undefined,
      },
      // Use safe treeshaking settings
      treeshake: 'recommended',
    },
    // Disable sourcemaps to reduce build complexity
    sourcemap: false,
    // Additional compatibility settings
    commonjsOptions: {
      transformMixedEsModules: true,
    }
  }
}));
