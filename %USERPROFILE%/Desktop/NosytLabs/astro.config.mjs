import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  site: 'https://nosytlabs.com',
  base: '/',
  output: 'static',
  build: {
    assets: '_assets',
  },
  server: {
    port: 3000,
  },
});
