import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'url';
import path from 'path';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // Cesium configuration
  define: {
    'process.env.CESIUM_BASE_URL': JSON.stringify('/cesium/')
  },
  build: {
    rollupOptions: {
      external: ['cesium']
    }
  },
  optimizeDeps: {
    include: ['cesium']
  },
  server: {
    fs: {
      allow: ['.']
    }
  }
});
