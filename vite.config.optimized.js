// Optimized Vite Configuration for Code Splitting
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Vendor chunks
          'react-vendor': ['react', 'react-dom'],
          'analytics': ['@vercel/analytics', '@vercel/speed-insights'],

          // Feature-based chunks
          'nosytos95': [
            './src/components/Windows95Window.astro',
            './src/components/EnhancedWindows95Window.astro'
          ],
          'games': [
            './src/components/DuckHuntGame.js'
          ],
          'forms': [
            './src/components/ContactForm.astro',
            './src/components/ProjectSubmissionForm.astro'
          ],
          'animations': [
            './src/components/animations/AnimatedSection.astro',
            './src/components/animations/AnimatedText.astro'
          ]
        },

        // Optimize chunk file names
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId
            ? chunkInfo.facadeModuleId.split('/').pop().replace(/\.[^.]+$/, '')
            : 'chunk';
          return `chunks/${facadeModuleId}-[hash].js`;
        },

        // Optimize asset file names
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];

          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash].${ext}`;
          }

          if (/css/i.test(ext)) {
            return `assets/styles/[name]-[hash].${ext}`;
          }

          return `assets/[name]-[hash].${ext}`;
        }
      }
    },

    // Optimize chunk size warnings
    chunkSizeWarningLimit: 500,

    // Enable source maps for debugging
    sourcemap: process.env.NODE_ENV === 'development',

    // Optimize minification
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: process.env.NODE_ENV === 'production',
        drop_debugger: true,
        pure_funcs: ['console.log', 'console.info'],
        passes: 2
      },
      mangle: {
        safari10: true
      },
      format: {
        comments: false
      }
    }
  },

  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom'
    ],
    exclude: [
      '@vercel/analytics',
      '@vercel/speed-insights'
    ]
  }
});