import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// base './' — Electron file:// протоколоор dist/index.html-ийг шууд ачаална
export default defineConfig({
  base: './',
  plugins: [react()],
  build: {
    outDir: 'dist',
    target: 'chrome120',
    assetsInlineLimit: 0
  },
  server: { port: 5183 }
});
