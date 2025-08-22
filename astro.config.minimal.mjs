import { defineConfig } from 'astro/config';

// Minimal config for debugging
export default defineConfig({
  site: 'https://nosytlabs.com',
  integrations: [],
  output: 'static',
  server: {
    host: true,
  },
});