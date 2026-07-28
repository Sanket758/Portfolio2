import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    server: {
      port: 3000,
      host: '0.0.0.0',
      watch: {
        ignored: ['**/open-design/**', '**/.open-design-cache/**'],
      },
    },
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },
    build: {
      outDir: 'dist',
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            'pdf-vendor': ['jspdf'],
          },
        },
      },
      chunkSizeWarningLimit: 800,
    }
});
