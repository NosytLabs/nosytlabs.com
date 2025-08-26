import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import vercel from '@astrojs/vercel';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    react(),
    sitemap(),
  ],
  vite: {
    build: {
      cssCodeSplit: true,
      rollupOptions: {
        output: {
          manualChunks: {
            // Core framework chunks
            'react-core': ['react', 'react-dom'],
            'react-router': ['react-router-dom'],
            
            // UI library chunks
            'ui-primitives': ['@radix-ui/react-slot', '@radix-ui/react-label'],
            'ui-components': ['class-variance-authority', 'clsx', 'tailwind-merge'],
            
            // Form handling
            'forms': ['react-hook-form', '@hookform/resolvers'],
            
            // Performance utilities
            'performance': ['intersection-observer'],
            
            // Animation libraries
            'animations': ['framer-motion'],
            
            // Utility libraries
            'utils': ['date-fns', 'lodash-es'],
            
            // Icons
            'icons': ['lucide-react'],
          },
          // Optimize chunk naming for better caching
          chunkFileNames: (chunkInfo) => {
            const facadeModuleId = chunkInfo.facadeModuleId
              ? chunkInfo.facadeModuleId.split('/').pop().replace(/\.[^.]*$/, '')
              : 'chunk';
            return `assets/js/[name]-[hash].js`;
          },
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split('.');
            const ext = info[info.length - 1];
            if (/\.(css)$/.test(assetInfo.name)) {
              return `assets/css/[name]-[hash].${ext}`;
            }
            if (/\.(png|jpe?g|svg|gif|tiff|bmp|ico)$/i.test(assetInfo.name)) {
              return `assets/images/[name]-[hash].${ext}`;
            }
            if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name)) {
              return `assets/fonts/[name]-[hash].${ext}`;
            }
            return `assets/[name]-[hash].${ext}`;
          },
        },
      },
      // Optimize build performance
      target: 'esnext',
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: true,
          drop_debugger: true,
        },
      },
    },
    // Enable performance optimizations
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'class-variance-authority',
        'clsx',
        'tailwind-merge',
        'lucide-react',
      ],
    },
    resolve: {
      alias: {
        '@': path.resolve('./src'),
        '@/lib': path.resolve('./src/lib'),
        '@components': path.resolve('./src/components'),
        '@layouts': path.resolve('./src/layouts'),
        '@utils': path.resolve('./src/utils'),
        '@hooks': path.resolve('./src/hooks'),
        '@config': path.resolve('./src/config'),
      },
    },
  },

  // Optimize output
  output: 'server',
  adapter: vercel(),
  // Enable compression
  compressHTML: true,
});
