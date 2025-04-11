import { defineConfig } from 'astro/config';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://nosytlabs.com',
  output: 'static',
  // adapter: vercel(),  // Commented out for static build
  build: {
    assets: '_assets',
    format: 'directory',
    inlineStylesheets: 'auto'
  },
  vite: {
    build: {
      cssCodeSplit: true,
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true
        }
      },
      rollupOptions: {
        output: {
          manualChunks: {
            'three': ['three'],
            'gsap': ['gsap']
          }
        }
      }
    }
  }
});
