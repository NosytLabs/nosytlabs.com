/**
 * Development Configuration
 * Optimizes the development experience with better hot reloading,
 * error handling, and debugging tools
 */

export const developmentConfig = {
  // Hot Module Replacement settings
  hmr: {
    enabled: true,
    port: 3001,
    host: 'localhost',
    protocol: 'ws',
    overlay: true, // Show error overlay
    timeout: 60000, // 60 seconds timeout
    clientLogLevel: 'info'
  },

  // File watching configuration
  watch: {
    usePolling: false, // Use native file watching (faster)
    interval: 100, // Polling interval if usePolling is true
    ignored: [
      '**/node_modules/**',
      '**/dist/**',
      '**/.astro/**',
      '**/coverage/**',
      '**/test-results/**',
      '**/*.log'
    ],
    followSymlinks: false
  },

  // Development server settings
  server: {
    strictPort: false, // Allow port fallback
    cors: true, // Enable CORS for development
    open: false, // Don't auto-open browser
    clearScreen: false, // Keep terminal history
    logLevel: 'info'
  },

  // Build optimizations for development
  build: {
    sourcemap: true, // Enable source maps
    minify: false, // Disable minification for faster builds
    cssCodeSplit: false, // Bundle CSS for faster HMR
    rollupOptions: {
      output: {
        // Simpler naming for development
        assetFileNames: 'assets/[name].[ext]',
        chunkFileNames: 'chunks/[name].js',
        entryFileNames: 'entries/[name].js'
      }
    }
  },

  // CSS development settings
  css: {
    devSourcemap: true, // Enable CSS source maps
    preprocessorOptions: {
      scss: {
        additionalData: `@import "src/styles/variables.scss";`
      }
    }
  },

  // Error handling
  errorHandling: {
    showErrorOverlay: true,
    logErrors: true,
    clearConsoleOnReload: false
  },

  // Performance monitoring
  performance: {
    measureHMR: true,
    logSlowComponents: true,
    threshold: 1000 // Log components that take > 1s to render
  }
};

/**
 * Get development-specific Vite configuration
 */
export function getDevViteConfig() {
  return {
    server: {
      ...developmentConfig.server,
      hmr: developmentConfig.hmr,
      watch: developmentConfig.watch,
      fs: {
        strict: false,
        allow: ['..'] // Allow access to parent directories
      }
    },
    build: developmentConfig.build,
    css: developmentConfig.css,
    esbuild: {
      target: 'es2020',
      keepNames: true, // Keep function names for debugging
      minifyIdentifiers: false,
      minifySyntax: false,
      minifyWhitespace: false
    },
    optimizeDeps: {
      include: [
        'react',
        'react-dom',
        'react/jsx-runtime'
      ],
      exclude: [
        '@vercel/analytics',
        '@vercel/speed-insights'
      ]
    },
    define: {
      __DEV__: true,
      __PROD__: false,
      'process.env.NODE_ENV': '"development"'
    }
  };
}

/**
 * Development utilities
 */
export const devUtils = {
  /**
   * Log development information
   */
  log: (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    const prefix = type === 'error' ? '❌' : type === 'warn' ? '⚠️' : 'ℹ️';
    console.log(`${prefix} [${timestamp}] ${message}`);
  },

  /**
   * Measure performance of operations
   */
  measure: (name, fn) => {
    if (!developmentConfig.performance.measureHMR) return fn();
    
    const start = performance.now();
    const result = fn();
    const end = performance.now();
    const duration = end - start;
    
    if (duration > developmentConfig.performance.threshold) {
      devUtils.log(`Slow operation: ${name} took ${duration.toFixed(2)}ms`, 'warn');
    }
    
    return result;
  },

  /**
   * Check if we're in development mode
   */
  isDev: () => process.env.NODE_ENV === 'development',

  /**
   * Get development server URL
   */
  getServerUrl: (port = 3000) => `http://localhost:${port}`,

  /**
   * Clear console (if enabled)
   */
  clearConsole: () => {
    if (!developmentConfig.errorHandling.clearConsoleOnReload) return;
    console.clear();
  }
};

/**
 * Development middleware for error handling
 */
export function createErrorHandler() {
  return (error, req, res, next) => {
    if (developmentConfig.errorHandling.logErrors) {
      devUtils.log(`Error: ${error.message}`, 'error');
      console.error(error.stack);
    }
    
    if (developmentConfig.errorHandling.showErrorOverlay) {
      // Send error to client for overlay display
      res.status(500).json({
        error: {
          message: error.message,
          stack: error.stack,
          timestamp: new Date().toISOString()
        }
      });
    } else {
      next(error);
    }
  };
}

export default developmentConfig;
