import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { visualizer } from 'rollup-plugin-visualizer';

// Performance optimization plugin for Core Web Vitals
const performanceOptimizationPlugin = () => {
  return {
    name: 'performance-optimization',
    generateBundle(options: any, bundle: any) {
      // Add resource hints for critical assets
      Object.keys(bundle).forEach(fileName => {
        const chunk = bundle[fileName];
        if (chunk.type === 'chunk' && chunk.isEntry) {
          // Mark critical chunks for preloading
          chunk.code = `/* Critical chunk: ${fileName} */\n${chunk.code}`;
        }
      });
    },
    transformIndexHtml(html: string) {
      // Add resource preloading hints
      const preloadLinks = [
        '<link rel="preload" href="/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>',
        '<link rel="preload" href="/assets/css/critical.css" as="style">',
        '<link rel="dns-prefetch" href="//fonts.googleapis.com">',
        '<link rel="dns-prefetch" href="//api.nosytlabs.com">',
      ].join('\n');
      
      return html.replace('<head>', `<head>\n${preloadLinks}`);
    }
  };
};

export default defineConfig({
  plugins: [
    react({
      // Enable React optimizations
      babel: {
        plugins: [
          // Remove prop-types in production
          process.env.NODE_ENV === 'production' && 'babel-plugin-transform-remove-prop-types',
        ].filter(Boolean),
      },
    }),
    performanceOptimizationPlugin(),
    // Bundle analyzer for performance monitoring
    process.env.ANALYZE && visualizer({
      filename: 'dist/stats.html',
      open: true,
      gzipSize: true,
      brotliSize: true,
    }),
  ],
  
  build: {
    // Target modern browsers for better performance
    target: 'esnext',
    
    // Enable CSS code splitting for better caching
    cssCodeSplit: true,
    
    // Optimize chunk size
    chunkSizeWarningLimit: 1000,
    
    rollupOptions: {
      output: {
        // Optimize manual chunks for better caching
        manualChunks: {
          // Core React chunks
          'react-vendor': ['react', 'react-dom'],
          
          // UI library chunks
          'ui-primitives': [
            '@radix-ui/react-slot',
            '@radix-ui/react-label',
            '@radix-ui/react-dialog',
            '@radix-ui/react-icons'
          ],
          
          // Form handling
          'forms': ['react-hook-form', '@hookform/resolvers', 'zod'],
          
          // Animation libraries (lazy loaded)
          'animations': ['framer-motion', 'gsap'],
          
          // Utility libraries
          'utils': [
            'class-variance-authority',
            'clsx',
            'tailwind-merge',
            'lucide-react'
          ],
          
          // Performance utilities
          'performance': [
            '@vercel/analytics',
            '@vercel/speed-insights'
          ],
        },
        
        // Optimize file naming for better caching
        chunkFileNames: (chunkInfo) => {
          // Use content hash for long-term caching
          return 'assets/js/[name]-[hash].js';
        },
        
        assetFileNames: (assetInfo) => {
          const info = assetInfo.name?.split('.') || [];
          const ext = info[info.length - 1];
          
          // Organize assets by type for better caching strategies
          if (/\.(css)$/.test(assetInfo.name || '')) {
            return 'assets/css/[name]-[hash].[ext]';
          }
          if (/\.(png|jpe?g|svg|gif|webp|avif)$/i.test(assetInfo.name || '')) {
            return 'assets/images/[name]-[hash].[ext]';
          }
          if (/\.(woff2?|eot|ttf|otf)$/i.test(assetInfo.name || '')) {
            return 'assets/fonts/[name]-[hash].[ext]';
          }
          return 'assets/[name]-[hash].[ext]';
        },
      },
    },
    
    // Minification options for better compression
    minify: 'terser',
    terserOptions: {
      compress: {
        // Remove console logs in production
        drop_console: true,
        drop_debugger: true,
        // Remove unused code
        pure_funcs: ['console.log', 'console.info', 'console.debug'],
        // Optimize for size
        passes: 2,
      },
      mangle: {
        // Preserve class names for better debugging
        keep_classnames: false,
        keep_fnames: false,
      },
    },
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-hook-form',
      'class-variance-authority',
      'clsx',
      'tailwind-merge',
      'lucide-react',
      'sonner',
    ],
    // Exclude heavy dependencies from pre-bundling
    exclude: [
      'framer-motion',
      'gsap',
    ],
  },
  
  // Path resolution
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@/components': resolve(__dirname, './src/components'),
      '@/utils': resolve(__dirname, './src/utils'),
      '@/hooks': resolve(__dirname, './src/hooks'),
      '@/config': resolve(__dirname, './src/config'),
      '@/types': resolve(__dirname, './src/types'),
    },
  },
  
  // Development server optimizations
  server: {
    // Enable HTTP/2 for better performance
    https: false,
    // Optimize HMR
    hmr: {
      overlay: false,
    },
    // Preload critical modules
    warmup: {
      clientFiles: [
        './src/components/optimization/UnifiedImageComponent.tsx',
        './src/utils/performance/index.ts',
        './src/hooks/usePerformanceOptimization.ts',
      ],
    },
    // Proxy API requests to Express dev server
    proxy: {
      '/api': {
        target: process.env.EXPRESS_API_URL || 'http://localhost:3001',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  
  // CSS optimization
  css: {
    // Enable CSS modules for better performance
    modules: {
      localsConvention: 'camelCase',
    },
    // PostCSS optimizations
    postcss: {
      plugins: [
        // Add autoprefixer and other optimizations
      ],
    },
  },
  
  // Enable experimental features for better performance
  experimental: {
    // Enable render built-ins optimization
    renderBuiltUrl(filename: string) {
      // Optimize asset URLs for CDN
      if (process.env.NODE_ENV === 'production') {
        return `https://cdn.nosytlabs.com/assets/${filename}`;
      }
      return filename;
    },
  },
});