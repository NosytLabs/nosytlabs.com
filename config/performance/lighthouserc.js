const config = {
  ci: {
    collect: {
      // URLs to test (can be overridden by CLI)
      url: [
        'http://localhost:4321',
        'http://localhost:4321/services',
        'http://localhost:4321/contact',
        'http://localhost:4321/booking',
        'http://localhost:4321/gallery',
        'http://localhost:4321/projects',
        'http://localhost:4321/blog',
      ],
      // Number of runs per URL
      numberOfRuns: 3,
      // Lighthouse settings
      settings: {
        // Use desktop preset for consistent results
        preset: 'desktop',
        // Custom Chrome flags
        chromeFlags:
          '--no-sandbox --disable-dev-shm-usage --disable-web-security --disable-features=VizDisplayCompositor',
        // Disable storage reset between runs for more realistic testing
        disableStorageReset: false,
        // Skip audits that are not relevant for performance
        skipAudits: ['canonical', 'robots-txt'],
        // Custom throttling for more realistic conditions
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
          requestLatencyMs: 0,
          downloadThroughputKbps: 0,
          uploadThroughputKbps: 0,
        },
        // Custom screen emulation
        screenEmulation: {
          mobile: false,
          width: 1350,
          height: 940,
          deviceScaleFactor: 1,
          disabled: false,
        },
      },
      // Start a local server if needed
      startServerCommand: 'npm run preview:integrated -- --port 4321',
      startServerReadyPattern: 'Local:',
      startServerReadyTimeout: 30000,
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
        interactive: ['error', { maxNumericValue: 3800 }],
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
        'dom-size': ['warn', { maxNumericValue: 1500 }],

        // SpendThrone-specific custom assertions
        'spendthrone:contact-form-performance': ['error', { maxNumericValue: 1000 }],
        'spendthrone:booking-flow-efficiency': ['error', { maxNumericValue: 2000 }],
        'spendthrone:service-page-load': ['error', { maxNumericValue: 1500 }],
        'spendthrone:gallery-image-loading': ['warn', { maxNumericValue: 2000 }],
        'spendthrone:blog-post-performance': ['warn', { maxNumericValue: 1800 }],
        'spendthrone:project-showcase-speed': ['error', { maxNumericValue: 2200 }],

        // Custom business metrics
        'spendthrone:conversion-critical-path': ['error', { maxNumericValue: 3000 }],
        'spendthrone:user-journey-smoothness': ['warn', { minScore: 0.85 }],
        'spendthrone:mobile-experience-quality': ['error', { minScore: 0.8 }],
        'spendthrone:accessibility-compliance': ['error', { minScore: 0.95 }],

        // Third-party and external resources
        'third-party-summary': ['warn', { maxNumericValue: 500 }],
        'third-party-facades': ['warn', { maxLength: 0 }],
        'efficient-animated-content': ['warn', { maxLength: 0 }],

        // Security and privacy
        'no-vulnerable-libraries': ['error', { maxLength: 0 }],
        'notification-on-start': ['warn', { maxLength: 0 }],
        'geolocation-on-start': ['warn', { maxLength: 0 }],

        // Progressive Web App features
        'installable-manifest': ['warn', { maxLength: 0 }],
        'service-worker': ['warn', { maxLength: 0 }],
        'splash-screen': ['warn', { maxLength: 0 }],
        'themed-omnibox': ['warn', { maxLength: 0 }],

        // Additional performance insights
        'bootup-time': ['warn', { maxNumericValue: 1000 }],
        'mainthread-work-breakdown': ['warn', { maxNumericValue: 2000 }],
        'font-display': ['warn', { maxLength: 0 }],
        'preload-fonts': ['warn', { maxLength: 0 }],
        'csp-xss': ['error', { maxLength: 0 }],
        doctype: ['error', { maxLength: 0 }],
        charset: ['error', { maxLength: 0 }],
      },
      // Preset configurations
      preset: 'lighthouse:recommended',
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
        sqlDatabasePath: './lhci.db',
      },
    },
    wizard: {
      // Disable wizard for CI environments
      enabled: false,
    },
  },
};

// Environment-specific overrides
if (process.env.CI) {
  // CI-specific configuration
  config.ci.collect.settings.chromeFlags += ' --headless';
  config.ci.collect.numberOfRuns = 1; // Faster CI runs

  // Use GitHub Actions artifacts for storage in CI
  if (process.env.GITHUB_ACTIONS) {
    config.ci.upload.target = 'filesystem';
    config.ci.upload.outputDir = './.lighthouseci';
  }
}

// Development environment overrides
if (process.env.NODE_ENV === 'development') {
  config.ci.collect.numberOfRuns = 1;
  config.ci.assert.assertions['categories:performance'][1].minScore = 0.6; // Relaxed for dev
}

// Production environment overrides
if (process.env.NODE_ENV === 'production') {
  config.ci.assert.assertions['categories:performance'][1].minScore = 0.9; // Stricter for prod
}

export default config;
