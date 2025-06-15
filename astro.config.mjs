import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import {
  getProductionViteConfig,
  getDevelopmentViteConfig,
  getAstroBuildConfig,
  getModernBuildConfig
} from './src/config/build-optimization.js';

// Get environment-specific configurations
const isDev = process.env.NODE_ENV === 'development';
const viteConfig = isDev ? getDevelopmentViteConfig() : getProductionViteConfig();
const buildConfig = getAstroBuildConfig();
const modernConfig = getModernBuildConfig();

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
    format: buildConfig.format,
    inlineStylesheets: buildConfig.inlineStylesheets,
    assets: buildConfig.assets,
    splitting: buildConfig.splitting,
    assetsInlineLimit: buildConfig.assetsInlineLimit,

    // Modern build features
    ...(!isDev && {
      compressHTML: true,
      inlineCriticalCss: true
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
    ...viteConfig,

    // Merge optimizeDeps configurations
    optimizeDeps: {
      ...viteConfig.optimizeDeps,
      include: [
        ...(viteConfig.optimizeDeps?.include || []),
        'react/jsx-runtime',
        'react/jsx-dev-runtime'
      ]
    },

    // Enhanced build configuration for production
    ...(!isDev && {
      build: {
        ...viteConfig.build,
        ...modernConfig.build,

        // Performance optimizations
        chunkSizeWarningLimit: 1000,
        reportCompressedSize: false
      }
    }),

    // Development-specific optimizations
    ...(isDev && {
      server: {
        ...viteConfig.server,
        watch: {
          usePolling: false,
          interval: 100
        }
      }
    }),

    // Enhanced CSS processing - temporarily disable lightningcss
    css: {
      ...viteConfig.css,
      devSourcemap: isDev
      // transformer: 'lightningcss' // Disabled due to build issues
    },

    // Plugin configuration
    plugins: [],

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