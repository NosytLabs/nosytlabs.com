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

  // Build targets
  targets: {
    browsers: ['es2020', 'chrome80', 'firefox78', 'safari14'],
    node: '18.0.0'
  },

  // Cache configuration
  cache: {
    strategy: 'stale-while-revalidate',
    maxAge: 31536000, // 1 year
    staleWhileRevalidate: 86400 // 1 day
  }
};

/**
 * Get Vite configuration for production builds
 */
export function getProductionViteConfig() {
  return {
    build: {
      minify: buildConfig.optimization.js.minify,
      cssMinify: 'esbuild',  // Changed from lightningcss to esbuild
      cssCodeSplit: true,
      assetsInlineLimit: buildConfig.optimization.assets.inlineLimit,
      sourcemap: false,
      target: buildConfig.targets.browsers,
      
      terserOptions: {
        compress: {
          drop_console: buildConfig.optimization.js.dropConsole,
          drop_debugger: buildConfig.optimization.js.dropDebugger,
          pure_funcs: ['console.log', 'console.debug', 'console.info'],
          ...buildConfig.optimization.js.compress
        },
        mangle: {
          toplevel: buildConfig.optimization.js.mangle,
          safari10: true
        },
        format: {
          comments: false,
          ecma: 2020
        }
      },
      
      rollupOptions: {
        output: {
          manualChunks: {
            // Vendor chunks
            [buildConfig.bundles.js.vendor.name]: buildConfig.bundles.js.vendor.chunks,
            [buildConfig.bundles.js.analytics.name]: buildConfig.bundles.js.analytics.chunks,
            
            // Feature chunks
            ...Object.fromEntries(
              Object.entries(buildConfig.bundles.js.features).map(([key, value]) => [key, value])
            )
          },
          assetFileNames: 'assets/[name]-[hash][extname]',
          chunkFileNames: 'chunks/[name]-[hash].js',
          entryFileNames: 'entries/[name]-[hash].js'
        }
      }
    },
    
    optimizeDeps: {
      include: buildConfig.bundles.js.vendor.chunks,
      exclude: buildConfig.bundles.js.analytics.chunks
    }
  };
}

/**
 * Get Astro build configuration
 */
export function getAstroBuildConfig() {
  return {
    format: 'file',
    inlineStylesheets: 'auto',
    assets: 'assets',
    splitting: true,
    inlineCriticalCss: true,
    assetsInlineLimit: buildConfig.optimization.assets.inlineLimit
  };
}

/**
 * Performance monitoring configuration
 */
export const performanceConfig = {
  metrics: ['LCP', 'FID', 'CLS', 'FCP', 'TTFB'],
  thresholds: buildConfig.thresholds.coreWebVitals,
  reporting: {
    endpoint: '/api/performance',
    sampleRate: 0.1
  }
};

/**
 * Service Worker configuration
 */
export const serviceWorkerConfig = {
  cacheStrategy: buildConfig.cache.strategy,
  staticAssets: [
    '/',
    '/styles/optimized/critical-optimized.css',
    '/styles/optimized/main-optimized.css',
    '/js/core.min.js'
  ],
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/fonts\.googleapis\.com/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'google-fonts-stylesheets'
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
        }
      }
    }
  ]
};

export default buildConfig;
