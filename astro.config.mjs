import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import react from '@astrojs/react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind({
      applyBaseStyles: true,
    }),
    react(),
  ],
  server: {
    port: 4321,
    host: '127.0.0.1',
    open: false
  },
  vite: {
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      hmr: {
        overlay: true,
        clientPort: 4321
      },
      watch: {
        usePolling: false,
        ignored: ['**/node_modules/**', '**/dist/**']
      },
      cors: true
    },
    build: {
      // Enable minification and compression
      minify: 'terser',
      cssCodeSplit: true,
      chunkSizeWarningLimit: 1000,
      sourcemap: false,
      rollupOptions: {
        output: {
          manualChunks: {
            'vendor-react': ['react', 'react-dom'],
            'vendor-ui': ['@astrojs/react', 'lucide-react'],
            'vendor-utils': ['clsx', 'tailwind-merge']
          },
          chunkFileNames: 'assets/[name]-[hash].js',
          entryFileNames: 'assets/[name]-[hash].js',
          assetFileNames: 'assets/[name]-[hash].[ext]'
        }
      }
    },
    optimizeDeps: {
      exclude: ['astro:content'],
      include: ['react', 'react-dom', 'lucide-react']
    },
    ssr: {
      noExternal: ['@astrojs/react']
    }
  },
  // Enable compression at the Astro level
  compressHTML: true,
  // Add prefetch configuration
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'viewport'
  }
});