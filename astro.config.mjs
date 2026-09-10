import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

// Update this to the live domain before deploying.
export default defineConfig({
  site: 'https://diamondsofasmfg.com',
  integrations: [tailwind(), sitemap()],
});
