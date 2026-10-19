
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const previewHosts = (process.env.PREVIEW_ALLOWED_HOSTS || '')
  .split(',')
  .map((h) => h.trim())
  .filter(Boolean);

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    allowedHosts: ['localhost', ...previewHosts],
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
});
