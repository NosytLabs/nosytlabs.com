import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import { getProductionViteConfig, getAstroBuildConfig } from './src/config/build-optimization.js';

// Get optimized configurations
const viteConfig = getProductionViteConfig();
const buildConfig = getAstroBuildConfig();

// https://astro.build/config
export default defineConfig({
  site: 'https://nosytlabs.com',
  base: '/',
  trailingSlash: 'ignore',
  integrations: [
    react(),
    tailwind({
      config: { applyBaseStyles: false }
    })
  ],
  output: 'static',

  // Optimized build configuration
  build: {
    format: buildConfig.format,
    inlineStylesheets: buildConfig.inlineStylesheets,
    assets: buildConfig.assets,
    splitting: buildConfig.splitting,
    assetsInlineLimit: buildConfig.assetsInlineLimit
  },

  server: {
    port: 4321,
    host: true
  },

  // Enhanced Vite configuration with optimization
  vite: {
    ...viteConfig,
    optimizeDeps: {
      ...viteConfig.optimizeDeps,
      include: ['react', 'react-dom', 'framer-motion', 'lucide-react']
    },

    // Development-specific optimizations
    ...(process.env.NODE_ENV === 'development' && {
      server: {
        fs: {
          strict: false
        }
      }
    })
  }
});