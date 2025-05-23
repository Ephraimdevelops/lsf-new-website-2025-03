
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
    // Disable native module dependency usage
    target: 'esnext',
    rollupOptions: {
      // Avoid platform-specific dependencies
      output: {
        manualChunks: undefined,
      },
      // Disable most optimizations to avoid platform-specific issues
      treeshake: 'recommended',
    },
    sourcemap: false,
    // Ensure compatibility with most environments
    commonjsOptions: {
      transformMixedEsModules: true,
    }
  }
}));
