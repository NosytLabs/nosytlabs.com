/**
 * Build Optimization Configuration for NosytLabs - 2025
 * Centralized build optimization settings and utilities
 */

export const buildConfig = {
  // Performance thresholds
  thresholds: {
    bundleSize: 250 * 1024,      // 250KB max per bundle
    totalSize: 2 * 1024 * 1024,  // 2MB max total
    imageSize: 500 * 1024,       // 500KB max per image
    cssSize: 100 * 1024,         // 100KB max per CSS file
    jsSize: 200 * 1024,          // 200KB max per JS file
    coreWebVitals: {
      LCP: 2500,  // Largest Contentful Paint (ms)
      FID: 100,   // First Input Delay (ms)
      CLS: 0.1    // Cumulative Layout Shift
    }
  },

  // Bundle configuration
  bundles: {
    css: {
      critical: {
        files: ['src/styles/css-variables.css', 'src/styles/critical.css'],
        output: 'public/styles/optimized/critical-optimized.css',
        inline: true
      },      main: {
        files: [
          'src/styles/optimized/unified-styles.css',
          'src/styles/nosytlabs-brand.css',
          'src/styles/optimized/unified-buttons.css'
        ],
        output: 'public/styles/optimized/main-optimized.css'
      },
      responsive: {
        files: ['src/styles/responsive-enhancements-2025.css'],
        output: 'public/styles/optimized/responsive-optimized.css'
      },
      specialized: {
        files: ['src/styles/enhanced-calculator.css', 'public/styles/duck-hunt.css'],
        output: 'public/styles/optimized/specialized-optimized.css'
      },
      win95: {
        files: ['public/styles/win95-authentic.css', 'public/styles/ms-sans-serif.css'],
        output: 'public/styles/optimized/win95-optimized.css'
      }
    },
    
    js: {
      vendor: {
        chunks: ['react', 'react-dom'],
        name: 'react-vendor'
      },
      analytics: {
        chunks: ['@vercel/analytics', '@vercel/speed-insights'],
        name: 'analytics'
      },
      features: {
        nosytos95: [
          './src/components/Windows95Window.astro',
          './src/components/EnhancedWindows95Window.astro'
        ],
        games: ['./src/components/DuckHuntGame.js'],
        forms: [
          './src/components/ContactForm.astro',
          './src/components/ProjectSubmissionForm.astro'
        ],
        animations: [
          './src/components/animations/AnimatedSection.astro',
          './src/components/animations/AnimatedText.astro'
        ],
        unified: [
          './src/components/unified/Navigation.astro',
          './src/components/unified/HeroSection.astro',
          './src/components/unified/Card.astro'
        ]
      }
    }
  },

  // Optimization settings
  optimization: {
    css: {
      minify: true,
      removeComments: true,
      removeEmptyRules: true,
      optimizeCustomProperties: true,
      modernFeatures: true
    },
    
    js: {
      minify: 'terser',
      dropConsole: true,
      dropDebugger: true,
      mangle: true,
      compress: {
        passes: 3,
        unsafe: true,
        unsafe_comps: true,
        unsafe_math: true,
        unsafe_proto: true
      }
    },
    
    assets: {
      inlineLimit: 2048,
      formats: ['webp', 'avif'],
      quality: 85,
      progressive: true
    },
    
    fonts: {
      display: 'swap',
      preload: ['Inter', 'JetBrains Mono'],
      subset: true
    }
  },

  // Enhanced Build targets for 2025
  targets: {
    browsers: ['es2022', 'chrome91', 'firefox90', 'safari15'],
    node: '18.0.0',
    modern: ['es2022', 'chrome100', 'firefox100', 'safari16'],
    legacy: ['es2020', 'chrome80', 'firefox78', 'safari14']
  },

  // Advanced Cache configuration
  cache: {
    strategy: 'stale-while-revalidate',
    maxAge: 31536000, // 1 year
    staleWhileRevalidate: 86400, // 1 day
    networkFirst: ['api/**', 'auth/**'],
    cacheFirst: ['images/**', 'fonts/**', 'static/**'],
    staleWhileRevalidatePatterns: ['*.js', '*.css', '*.html']
  },

  // Performance budgets
  budgets: {
    maximumWarning: 500 * 1024, // 500KB warning threshold
    maximumError: 1024 * 1024,  // 1MB error threshold
    minimumWarning: 10 * 1024,  // 10KB minimum warning
    baseline: {
      firstContentfulPaint: 1800,
      largestContentfulPaint: 2500,
      firstInputDelay: 100,
      cumulativeLayoutShift: 0.1
    }
  }
};

/**
 * Get enhanced Vite configuration for production builds
 */
export function getProductionViteConfig() {
  return {
    build: {
      minify: buildConfig.optimization.js.minify,
      cssMinify: 'lightningcss', // Upgraded to Lightning CSS for better performance
      cssCodeSplit: true,
      assetsInlineLimit: buildConfig.optimization.assets.inlineLimit,
      sourcemap: process.env.NODE_ENV === 'development' ? 'inline' : false,
      target: buildConfig.targets.modern,
      reportCompressedSize: false, // Disable for faster builds

      terserOptions: {
        compress: {
          drop_console: buildConfig.optimization.js.dropConsole,
          drop_debugger: buildConfig.optimization.js.dropDebugger,
          pure_funcs: ['console.log', 'console.debug', 'console.info', 'console.warn'],
          passes: 3,
          unsafe_arrows: true,
          unsafe_methods: true,
          ...buildConfig.optimization.js.compress
        },
        mangle: {
          toplevel: buildConfig.optimization.js.mangle,
          safari10: true,
          properties: {
            regex: /^_/
          }
        },
        format: {
          comments: false,
          ecma: 2022
        }
      },

      rollupOptions: {
        output: {
          manualChunks: (id) => {
            // Advanced chunking strategy
            if (id.includes('node_modules')) {
              if (id.includes('react') || id.includes('react-dom')) {
                return 'react-vendor';
              }
              if (id.includes('@vercel/analytics') || id.includes('@vercel/speed-insights')) {
                return 'analytics';
              }
              if (id.includes('framer-motion')) {
                return 'animations';
              }
              if (id.includes('lucide-react')) {
                return 'icons';
              }
              return 'vendor';
            }

            // Feature-based chunking
            if (id.includes('/components/Windows95') || id.includes('nosytos')) {
              return 'nosytos95';
            }
            if (id.includes('/components/animations/')) {
              return 'animations';
            }
            if (id.includes('/components/unified/')) {
              return 'unified';
            }
          },
          assetFileNames: (assetInfo) => {
            const info = assetInfo.name.split('.');
            const ext = info[info.length - 1];
            if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
              return `images/[name]-[hash][extname]`;
            }
            if (/woff2?|eot|ttf|otf/i.test(ext)) {
              return `fonts/[name]-[hash][extname]`;
            }
            return `assets/[name]-[hash][extname]`;
          },
          chunkFileNames: 'js/[name]-[hash].js',
          entryFileNames: 'js/[name]-[hash].js'
        },

        // Enhanced external dependencies
        external: (id) => {
          // Don't bundle large libraries in SSR
          return process.env.BUILD_SSR && (
            id.includes('framer-motion') ||
            id.includes('three') ||
            id.includes('canvas')
          );
        }
      }
    },

    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'framer-motion',
        'lucide-react',
        'clsx',
        'tailwind-merge'
      ],
      exclude: [
        '@vercel/analytics',
        '@vercel/speed-insights'
      ],
      esbuildOptions: {
        target: 'es2022',
        supported: {
          'top-level-await': true
        }
      }
    },

    // Enhanced CSS configuration - temporarily disabled lightningcss
    css: {
      // lightningcss: {
      //   targets: buildConfig.targets.modern,
      //   drafts: {
      //     customMedia: true
      //   }
      // }
    }
  };
}

/**
 * Get enhanced Astro build configuration
 */
export function getAstroBuildConfig() {
  return {
    format: 'file',
    inlineStylesheets: 'auto',
    assets: 'assets',
    splitting: true,
    assetsInlineLimit: buildConfig.optimization.assets.inlineLimit,

    // Enhanced build options
    experimentalCSSInlineThreshold: 4096,
    compressHTML: true,

    // Advanced asset handling
    assetFileNames: {
      css: 'styles/[name]-[hash].css',
      js: 'scripts/[name]-[hash].js',
      assets: 'assets/[name]-[hash][ext]'
    }
  };
}



/**
 * Enhanced Service Worker configuration
 */
export const serviceWorkerConfig = {
  cacheStrategy: buildConfig.cache.strategy,
  staticAssets: [
    '/',
    '/styles/optimized/critical-optimized.css',
    '/styles/optimized/main-optimized.css',
    '/js/core.min.js',
    '/manifest.json',
    '/favicon.ico'
  ],
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'google-fonts-stylesheets',
        cacheKeyWillBeUsed: async ({ request }) => {
          return `${request.url}?version=1`;
        }
      }
    },
    {
      urlPattern: /^https:\/\/fonts\.gstatic\.com/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'google-fonts-webfonts',
        expiration: {
          maxEntries: 30,
          maxAgeSeconds: buildConfig.cache.maxAge
        },
        cacheableResponse: {
          statuses: [0, 200]
        }
      }
    },
    {
      urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp|avif)$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'images',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 30 * 24 * 60 * 60 // 30 days
        }
      }
    },
    {
      urlPattern: /\.(?:js|css)$/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'static-resources'
      }
    }
  ],

  // Advanced SW features
  skipWaiting: true,
  clientsClaim: true,
  cleanupOutdatedCaches: true,

  // Workbox configuration
  workbox: {
    globDirectory: 'dist/',
    globPatterns: [
      '**/*.{html,js,css,png,jpg,jpeg,svg,gif,webp,avif,woff,woff2}'
    ],
    swDest: 'dist/sw.js',
    maximumFileSizeToCacheInBytes: 5 * 1024 * 1024, // 5MB
    mode: 'production'
  }
};

/**
 * Get development-optimized Vite configuration
 */
export function getDevelopmentViteConfig() {
  return {
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'framer-motion',
        'lucide-react'
      ],
      force: false,
      holdUntilCrawlEnd: false // Improve cold start times
    },

    build: {
      sourcemap: true,
      minify: false,
      target: 'esnext'
    },

    server: {
      fs: {
        strict: false
      },
      hmr: {
        overlay: true
      }
    }
  };
}

/**
 * Get performance monitoring configuration
 */
export function getPerformanceConfig() {
  return {
    budgets: buildConfig.budgets,

    // Core Web Vitals thresholds
    vitals: {
      lcp: { good: 2500, poor: 4000 },
      fid: { good: 100, poor: 300 },
      cls: { good: 0.1, poor: 0.25 },
      fcp: { good: 1800, poor: 3000 },
      ttfb: { good: 800, poor: 1800 }
    },

    // Bundle analysis
    analysis: {
      enabled: true,
      outputPath: 'dist/analysis',
      formats: ['json', 'html'],
      gzipSize: true,
      brotliSize: true
    },

    // Performance hints
    hints: {
      maxAssetSize: 250000,
      maxEntrypointSize: 250000,
      assetFilter: (assetFilename) => {
        return !/\.map$/.test(assetFilename);
      }
    }
  };
}

/**
 * Get modern build configuration with experimental features
 */
export function getModernBuildConfig() {
  return {
    target: buildConfig.targets.modern,

    // Removed experimental features that are no longer valid in Astro 5.8+

    build: {
      modulePreload: {
        polyfill: true,
        resolveDependencies: (filename, deps, { hostId, hostType }) => {
          // Only preload critical dependencies
          return deps.filter(dep =>
            dep.includes('react') ||
            dep.includes('core') ||
            dep.includes('critical')
          );
        }
      },

      cssCodeSplit: true,
      cssMinify: true, // Changed from 'lightningcss' to default

      rollupOptions: {
        output: {
          experimentalMinChunkSize: 20000,
          generatedCode: {
            arrowFunctions: true,
            constBindings: true,
            objectShorthand: true
          }
        }
      }
    }
  };
}

export default buildConfig;
