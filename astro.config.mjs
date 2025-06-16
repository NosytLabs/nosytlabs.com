import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import sentry from '@sentry/astro';
// Temporarily disabled build optimization import due to syntax issues
// import {
//   getProductionViteConfig,
//   getDevelopmentViteConfig,
//   getAstroBuildConfig,
//   getModernBuildConfig
// } from './src/config/build-optimization.js';

// Get environment-specific configurations
const isDev = process.env.NODE_ENV === 'development';

// https://astro.build/config
export default defineConfig({
  site: 'https://nosytlabs.com',
  base: '/',
  trailingSlash: 'ignore',

  integrations: [react({
    experimentalReactChildren: true
  }), tailwind({
    config: {
      applyBaseStyles: false,
      corePlugins: {
        preflight: false
      }
    }
  }), sentry({
    dsn: "https://c132847d853499737873e2baeb344f66@o4509057271988224.ingest.us.sentry.io/4509483976753152",
    // Setting this option to true will send default PII data to Sentry.
    // For example, automatic IP address collection on events
    sendDefaultPii: true,
    sourceMapsUploadOptions: {
      project: "nosytlabscom",
      authToken: process.env.SENTRY_AUTH_TOKEN,
    },
  })],

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
    // Path aliases for better imports
    resolve: {
      alias: {
        '@': new URL('./src', import.meta.url).pathname,
        '@/components': new URL('./src/components', import.meta.url).pathname,
        '@/layouts': new URL('./src/layouts', import.meta.url).pathname,
        '@/pages': new URL('./src/pages', import.meta.url).pathname,
        '@/styles': new URL('./src/styles', import.meta.url).pathname,
        '@/utils': new URL('./src/utils', import.meta.url).pathname,
        '@/types': new URL('./src/types', import.meta.url).pathname,
        '@/config': new URL('./src/config', import.meta.url).pathname,
        '@/lib': new URL('./src/lib', import.meta.url).pathname
      }
    },

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