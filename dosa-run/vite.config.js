import { defineConfig } from 'vite';

export default defineConfig({
  base: './',
  // This project lives inside a repo that also holds a Next.js app. Pinning
  // the PostCSS config to an inline (empty) one stops Vite from walking up
  // and loading that app's Tailwind pipeline.
  css: {
    postcss: { plugins: [] },
  },
  server: {
    host: true,
    port: 5173,
    open: false,
  },
  build: {
    outDir: 'dist',
    assetsInlineLimit: 0,
  },
});
