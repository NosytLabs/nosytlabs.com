const baseConfig = require('./lighthouserc.js');

const mobileConfig = {
  ci: {
    collect: {
      ...baseConfig.ci.collect,
      settings: {
        ...baseConfig.ci.collect.settings,
        preset: 'mobile',
        formFactor: 'mobile',
        screenEmulation: {
          mobile: true,
          width: 375,
          height: 667,
          deviceScaleFactor: 2,
          disabled: false,
        },
        throttling: {
          rttMs: 150,
          throughputKbps: 1638.4,
          cpuSlowdownMultiplier: 4,
          requestLatencyMs: 0,
          downloadThroughputKbps: 0,
          uploadThroughputKbps: 0,
        },
      },
    },
    assert: {
      ...baseConfig.ci.assert,
      assertions: {
        ...baseConfig.ci.assert.assertions,
        // Mobile-specific performance thresholds (more lenient due to mobile constraints)
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2800 }],
        'first-meaningful-paint': ['error', { maxNumericValue: 2200 }],
        'speed-index': ['error', { maxNumericValue: 3500 }],
        interactive: ['error', { maxNumericValue: 4300 }],
        'max-potential-fid': ['error', { maxNumericValue: 120 }],
        'total-blocking-time': ['error', { maxNumericValue: 250 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.12 }],

        // Mobile-specific resource optimizations (smaller budgets)
        'unused-css-rules': ['warn', { maxLength: 0 }],
        'unused-javascript': ['warn', { maxLength: 0 }],
        'modern-image-formats': ['warn', { maxLength: 0 }],
        'offscreen-images': ['warn', { maxLength: 0 }],
        'render-blocking-resources': ['warn', { maxLength: 0 }],
        'unminified-css': ['error', { maxLength: 0 }],
        'unminified-javascript': ['error', { maxLength: 0 }],
        'total-byte-weight': ['warn', { maxNumericValue: 1800000 }], // 1.8MB for mobile
        'dom-size': ['warn', { maxNumericValue: 1000 }],

        // Mobile-specific accessibility and best practices
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.9 }],
        'categories:seo': ['error', { minScore: 0.9 }],
        'categories:performance': ['error', { minScore: 0.75 }],

        // Mobile-specific audits
        viewport: ['error', { maxLength: 0 }],
        'font-size': ['error', { maxLength: 0 }],
        'tap-targets': ['error', { maxLength: 0 }],
        'content-width': ['error', { maxLength: 0 }],
      },
    },
  },
};

// Environment-specific overrides
if (process.env.CI) {
  mobileConfig.ci.collect.settings.chromeFlags += ' --headless=new';
  mobileConfig.ci.collect.numberOfRuns = process.env.LIGHTHOUSE_RUNS || 5;
}

module.exports = mobileConfig;
