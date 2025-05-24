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
      cssMinify: false, // Disable CSS minification to avoid empty selector issues
      cssCodeSplit: true,
      assetsInlineLimit: 4096, // 4kb - inline small assets
      sourcemap: false, // Disable sourcemaps in production
      rollupOptions: {
        output: {
          manualChunks: {
            // Framework chunks
            'react-vendor': ['react', 'react-dom'],

            // Feature-based chunks
            'core': [
              './src/layouts/BaseLayout.astro'
            ],
            'ui-components': [
              './src/components/ui/Button.astro',
              './src/components/ui/Card.astro',
              './src/components/ui/Section.astro',
              './src/components/ui/ResponsiveImage.astro'
            ],
            'win95': [
              './src/components/win95/Window.astro',
              './src/components/win95/Desktop.astro',
              './src/components/win95/Taskbar.astro'
            ],
            'animations': [
              './public/scripts/animations.js'
            ],
            'performance': [
              './public/scripts/image-optimization.js',
              './public/scripts/performance/resourceOptimizer.js',
              './public/scripts/performance/lazyLoadingInit.js'
            ]
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
