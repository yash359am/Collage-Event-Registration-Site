import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    target: 'esnext', // Use latest JS features for performance
    minify: 'esbuild', // Strict esbuild minification
    cssMinify: true, // Minify CSS aggressively
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      input: {
        main: './index.html',
        events: './events.html'
      },
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor'; // Split heavy libraries into a vendor chunk
          }
        }
      }
    }
  },
  esbuild: {
    drop: ['console', 'debugger'], // Remove console.logs automatically per requirements
  },
  server: {
    host: true,
  }
});
