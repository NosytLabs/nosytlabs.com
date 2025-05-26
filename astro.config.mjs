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
    format: 'file',
    // Enhanced build optimizations
    inlineStylesheets: 'auto', // Inline small CSS files
    assets: 'assets', // Organize assets in dedicated folder
    assetsPrefix: process.env.NODE_ENV === 'production' ? 'https://cdn.nosytlabs.com' : undefined
  },
  server: {
    port: 3000,
    host: true
  },
  vite: {
    build: {
      minify: 'terser',
      terserOptions: {
        compress: {
          drop_console: process.env.NODE_ENV === 'production',
          drop_debugger: true,
          pure_funcs: ['console.log', 'console.debug', 'console.info'],
          passes: 3, // Increased passes for better compression
          unsafe: true,
          unsafe_comps: true,
          unsafe_math: true,
          unsafe_proto: true
        },
        mangle: {
          toplevel: true,
          safari10: true
        },
        format: {
          comments: false,
          ecma: 2020
        }
      },
      cssMinify: 'lightningcss', // Use Lightning CSS for better performance
      cssCodeSplit: true,
      assetsInlineLimit: 2048, // Reduced to 2KB for better caching
      sourcemap: false,
      target: ['es2020', 'chrome80', 'firefox78', 'safari14'], // Modern browser targets
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

            // Feature-based chunks
            if (id.includes('nosytos95') || id.includes('win95')) {
              return 'nosytos95';
            }
            if (id.includes('performance') || id.includes('lazy')) {
              return 'performance';
            }
            if (id.includes('animation') || id.includes('ui')) {
              return 'ui';
            }
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
          experimentalMinChunkSize: 1000 // Minimum chunk size
        },
        // Tree shaking optimizations
        treeshake: {
          moduleSideEffects: false,
          propertyReadSideEffects: false,
          unknownGlobalSideEffects: false
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
      devSourcemap: false, // Disable in production
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
