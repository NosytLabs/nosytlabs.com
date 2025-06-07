import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import { securityHeaders } from './src/config/security.js';
import { getDevViteConfig } from './src/config/development.js';
import { getProductionViteConfig, getAstroBuildConfig } from './src/config/build-optimization.js';

// Get development configuration
const isDev = process.env.NODE_ENV !== 'production';
const devConfig = isDev ? getDevViteConfig() : {};

// https://astro.build/config
export default defineConfig({
  site: process.env.NODE_ENV === 'production' ? 'https://nosytlabs.com' : undefined,
  integrations: [
    react(),
    tailwind({
      config: { applyBaseStyles: false }
    })
  ],
  output: 'static',
  build: {
    ...getAstroBuildConfig(),
    assetsPrefix: process.env.NODE_ENV === 'production' ? 'https://cdn.nosytlabs.com' : undefined,
  },
  server: {
    port: 3000,
    host: true,
    headers: securityHeaders,
    hmr: {
      port: 3001,
      host: 'localhost',
      protocol: 'ws'
    }
  },
  vite: isDev ? {
    // Development configuration
    ...devConfig
  } : {
    // Production configuration using centralized build optimization
    ...getProductionViteConfig(),
      cssMinify: 'lightningcss', // Use Lightning CSS for better performance
      cssCodeSplit: true,
      assetsInlineLimit: 2048, // Reduced to 2KB for better caching
      sourcemap: false,
      target: ['es2020', 'chrome80', 'firefox78', 'safari14'], // Modern browser targets
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // Only create chunks for modules that actually exist and are imported
            if (id.includes('node_modules')) {
              // React vendor chunk - only if React is actually used
              if (id.includes('react') || id.includes('react-dom')) {
                return 'react-vendor';
              }
              // General vendor chunk for other node_modules
              return 'vendor';
            }

            // No feature-based chunking to avoid empty chunks
            return undefined;
          },
          // Optimized file naming with shorter hashes
          assetFileNames: (assetInfo) => {
            const extType = assetInfo.name.split('.').at(1);
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(extType)) {
              return `img/[name]-[hash:8][extname]`;
            }
            if (/css/i.test(extType)) {
              return `css/[name]-[hash:8][extname]`;
            }
            return `assets/[name]-[hash:8][extname]`;
          },
          chunkFileNames: 'js/[name]-[hash:8].js',
          entryFileNames: 'js/[name]-[hash:8].js',
          // Advanced optimizations
          minifyInternalExports: true,
          compact: true,
          preserveModules: false,
          experimentalMinChunkSize: 1000, // Minimum chunk size
          // Prevent empty hoisted chunks
          hoistTransitiveImports: false
        },
        // Tree shaking optimizations
        treeshake: {
          moduleSideEffects: false,
          propertyReadSideEffects: false,
          unknownGlobalSideEffects: false
        }
      }
    },
    ssr: {
      noExternal: ['@fortawesome/*']
    },
    optimizeDeps: {
      exclude: ['@vercel/analytics', '@vercel/speed-insights'],
      include: ['react', 'react-dom'], // Pre-bundle common dependencies
      esbuildOptions: {
        target: 'es2020'
      }
    },
    // Enhanced asset handling
    assetsInclude: ['**/*.svg', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.webp', '**/*.avif', '**/*.woff2'],
    // Improved CSS handling
    css: {
      devSourcemap: process.env.NODE_ENV !== 'production', // Enable in development
      lightningcss: {
        targets: {
          chrome: 80,
          firefox: 78,
          safari: 14
        },
        drafts: {
          customMedia: true
        }
      },
      modules: {
        generateScopedName: process.env.NODE_ENV === 'production'
          ? '[hash:base64:5]'
          : '[name]__[local]__[hash:base64:5]'
      }
    },
    // Development server optimizations
    server: {
      fs: {
        strict: false,
        allow: ['..']
      },
      watch: {
        usePolling: false,
        interval: 100
      }
    },
    // Performance optimizations
    esbuild: {
      target: 'es2020',
      legalComments: 'none',
      minifyIdentifiers: true,
      minifySyntax: true,
      minifyWhitespace: true
    }
  }
});
