import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

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
    format: 'file'
  },
  server: {
    port: 3000, // Changed to 3000 to match expected configuration
    host: true
  },
  vite: {
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.debug', 'console.info'],
          passes: 2
        },
        mangle: true,
        format: {
          comments: false
        }
      },
      cssMinify: false, // Disable CSS minification to avoid pseudo-element issues
      cssCodeSplit: true,
      assetsInlineLimit: 2048, // Reduced to 2kb for better caching
      sourcemap: false, // Disable sourcemaps in production
      target: 'es2020', // Modern target for better optimization
      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // Vendor chunks
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom')) {
                return 'react-vendor';
              }
              if (id.includes('@vercel')) {
                return 'analytics';
              }
              return 'vendor';
            }

            // Game chunks (lazy loaded)
            if (id.includes('duck-hunt') || id.includes('nosyt-duck-hunt')) {
              return 'games';
            }

            // Windows 95 specific chunks
            if (id.includes('nosytos95') || id.includes('win95')) {
              return 'win95';
            }

            // Animation chunks
            if (id.includes('animation') || id.includes('particles')) {
              return 'animations';
            }

            // Admin chunks
            if (id.includes('admin')) {
              return 'admin';
            }

            // Blog chunks
            if (id.includes('blog')) {
              return 'blog';
            }
          },
          // Use content hashing for better caching
          assetFileNames: 'assets/[name]-[hash][extname]',
          chunkFileNames: 'chunks/[name]-[hash].js',
          entryFileNames: 'entry/[name]-[hash].js',
          // Optimize chunk size
          minifyInternalExports: true,
          compact: true,
          preserveModules: false
        }
      }
    },
    server: {
      hmr: {
        port: 3000,
        host: 'localhost',
        protocol: 'ws'
      }
    },
    ssr: {
      noExternal: ['@fortawesome/*']
    },
    optimizeDeps: {
      exclude: ['@vercel/analytics', '@vercel/speed-insights']
    },
    // Optimize asset handling
    assetsInclude: ['**/*.svg', '**/*.png', '**/*.jpg', '**/*.jpeg', '**/*.gif', '**/*.webp', '**/*.avif'],
    // Improve CSS handling
    css: {
      devSourcemap: true,
      modules: {
        generateScopedName: '[name]__[local]__[hash:base64:5]'
      }
    }
  }
});
