module.exports = {
  ci: {
    collect: {
      // URLs to test (can be overridden by CLI)
      url: [
        'http://localhost:3000',
        'http://localhost:3000/about',
        'http://localhost:3000/services',
        'http://localhost:3000/contact',
        'http://localhost:3000/booking'
      ],
      // Number of runs per URL
      numberOfRuns: 3,
      // Lighthouse settings
      settings: {
        // Use desktop preset for consistent results
        preset: 'desktop',
        // Custom Chrome flags
        chromeFlags: '--no-sandbox --disable-dev-shm-usage',
        // Disable storage reset between runs for more realistic testing
        disableStorageReset: false,
        // Skip audits that are not relevant for performance
        skipAudits: [
          'canonical',
          'robots-txt',
          'tap-targets',
          'content-width'
        ]
      },
      // Start a local server if needed
      startServerCommand: 'npm run preview',
      startServerReadyPattern: 'Local:',
      startServerReadyTimeout: 30000
    },
    assert: {
      // Performance assertions based on our performance budget
      assertions: {
        // Core Web Vitals thresholds
        'categories:performance': ['error', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        
        // Specific performance metrics
        'first-contentful-paint': ['error', { maxNumericValue: 1800 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2500 }],
        'first-meaningful-paint': ['error', { maxNumericValue: 2000 }],
        'speed-index': ['error', { maxNumericValue: 3000 }],
        'interactive': ['error', { maxNumericValue: 3800 }],
        'max-potential-fid': ['error', { maxNumericValue: 100 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'total-blocking-time': ['error', { maxNumericValue: 200 }],
        
        // Resource optimization
        'unused-css-rules': ['warn', { maxLength: 0 }],
        'unused-javascript': ['warn', { maxLength: 0 }],
        'modern-image-formats': ['warn', { maxLength: 0 }],
        'offscreen-images': ['warn', { maxLength: 0 }],
        'render-blocking-resources': ['warn', { maxLength: 0 }],
        'unminified-css': ['error', { maxLength: 0 }],
        'unminified-javascript': ['error', { maxLength: 0 }],
        
        // Network and caching
        'uses-long-cache-ttl': ['warn', { minScore: 0.75 }],
        'uses-optimized-images': ['warn', { maxLength: 0 }],
        'uses-text-compression': ['error', { maxLength: 0 }],
        'uses-responsive-images': ['warn', { maxLength: 0 }],
        
        // Bundle size (approximate)
        'total-byte-weight': ['warn', { maxNumericValue: 3000000 }], // 3MB
        'dom-size': ['warn', { maxNumericValue: 1500 }]
      },
      // Preset configurations
      preset: 'lighthouse:recommended'
    },
    upload: {
      // Upload results to Lighthouse CI server (if configured)
      target: 'temporary-public-storage',
      // Alternative: use LHCI server
      // target: 'lhci',
      // serverBaseUrl: 'https://your-lhci-server.com',
      // token: 'your-lhci-token'
    },
    server: {
      // Configuration for LHCI server (if self-hosting)
      port: 9001,
      storage: {
        storageMethod: 'sql',
        sqlDialect: 'sqlite',
        sqlDatabasePath: './lhci.db'
      }
    },
    wizard: {
      // Disable wizard for CI environments
      enabled: false
    }
  }
};

// Environment-specific overrides
if (process.env.CI) {
  // CI-specific configuration
  module.exports.ci.collect.settings.chromeFlags += ' --headless';
  module.exports.ci.collect.numberOfRuns = 1; // Faster CI runs
  
  // Use GitHub Actions artifacts for storage in CI
  if (process.env.GITHUB_ACTIONS) {
    module.exports.ci.upload.target = 'filesystem';
    module.exports.ci.upload.outputDir = './.lighthouseci';
  }
}

// Development environment overrides
if (process.env.NODE_ENV === 'development') {
  module.exports.ci.collect.numberOfRuns = 1;
  module.exports.ci.assert.assertions['categories:performance'][1].minScore = 0.6; // Relaxed for dev
}

// Production environment overrides
if (process.env.NODE_ENV === 'production') {
  module.exports.ci.assert.assertions['categories:performance'][1].minScore = 0.9; // Stricter for prod
}