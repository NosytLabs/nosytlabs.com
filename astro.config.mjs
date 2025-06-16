import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
// Temporarily disabled build optimization import due to syntax issues
// import {
//   getProductionViteConfig,
//   getDevelopmentViteConfig,
//   getAstroBuildConfig,
//   getModernBuildConfig
// } from './src/config/build-optimization.js';

// Get environment-specific configurations
const isDev = process.env.NODE_ENV === 'development';
// const viteConfig = isDev ? getDevelopmentViteConfig() : getProductionViteConfig();
// const buildConfig = getAstroBuildConfig();
// const modernConfig = getModernBuildConfig();

// https://astro.build/config
export default defineConfig({
  site: 'https://nosytlabs.com',
  base: '/',
  trailingSlash: 'ignore',

  integrations: [
    react({
      experimentalReactChildren: true
    }),
    tailwind({
      config: {
        applyBaseStyles: false,
        corePlugins: {
          preflight: false
        }
      }
    })
  ],

  output: 'static',

  // Enhanced build configuration
  build: {
    format: 'file',
    inlineStylesheets: 'auto',
    assets: 'assets',
    splitting: true,

    // Modern build features
    ...(!isDev && {
      compressHTML: true
    })
  },

  // Development server configuration
  server: {
    port: 4321,
    host: true,
    open: false,
    ...(isDev && {
      hmr: {
        overlay: true,
        clientPort: 4321
      }
    })
  },

  // Enhanced Vite configuration with environment-specific optimization
  vite: {
    // Merge optimizeDeps configurations
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'framer-motion',
        'lucide-react',
        'react/jsx-runtime',
        'react/jsx-dev-runtime'
      ]
    },

    // Enhanced build configuration for production
    ...(!isDev && {
      build: {
        // Performance optimizations
        chunkSizeWarningLimit: 1000,
        reportCompressedSize: false,
        minify: 'terser'
      }
    }),

    // Development-specific optimizations
    ...(isDev && {
      server: {
        watch: {
          usePolling: false,
          interval: 100
        }
      }
    }),

    // Enhanced CSS processing
    css: {
      devSourcemap: isDev
    },

    // Define global constants
    define: {
      __DEV__: isDev,
      __PROD__: !isDev,
      __VERSION__: JSON.stringify(process.env.npm_package_version || '1.0.0')
    }
  },

  // Experimental features - removed outdated options
  experimental: {
    // Only include valid experimental features for Astro 5.8+
  }
});