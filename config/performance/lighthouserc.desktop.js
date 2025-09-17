const baseConfig = require('./lighthouserc.js');

const desktopConfig = {
  ci: {
    collect: {
      ...baseConfig.ci.collect,
      settings: {
        ...baseConfig.ci.collect.settings,
        preset: 'desktop',
        formFactor: 'desktop',
        screenEmulation: {
          mobile: false,
          width: 1350,
          height: 940,
          deviceScaleFactor: 1,
          disabled: false,
        },
        throttling: {
          rttMs: 40,
          throughputKbps: 10240,
          cpuSlowdownMultiplier: 1,
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
        // Desktop-specific performance thresholds
        'first-contentful-paint': ['error', { maxNumericValue: 1500 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'first-meaningful-paint': ['error', { maxNumericValue: 1800 }],
        'speed-index': ['error', { maxNumericValue: 2500 }],
        interactive: ['error', { maxNumericValue: 3000 }],
        'max-potential-fid': ['error', { maxNumericValue: 80 }],
        'total-blocking-time': ['error', { maxNumericValue: 150 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.08 }],

        // Desktop-specific resource optimizations
        'unused-css-rules': ['warn', { maxLength: 0 }],
        'unused-javascript': ['warn', { maxLength: 0 }],
        'modern-image-formats': ['warn', { maxLength: 0 }],
        'offscreen-images': ['warn', { maxLength: 0 }],
        'render-blocking-resources': ['warn', { maxLength: 0 }],
        'unminified-css': ['error', { maxLength: 0 }],
        'unminified-javascript': ['error', { maxLength: 0 }],
        'total-byte-weight': ['warn', { maxNumericValue: 2500000 }], // 2.5MB for desktop
        'dom-size': ['warn', { maxNumericValue: 1200 }],

        // Desktop-specific accessibility and best practices
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices': ['error', { minScore: 0.95 }],
        'categories:seo': ['error', { minScore: 0.95 }],
        'categories:performance': ['error', { minScore: 0.85 }],
      },
    },
  },
};

// Environment-specific overrides
if (process.env.CI) {
  desktopConfig.ci.collect.settings.chromeFlags += ' --headless=new';
  desktopConfig.ci.collect.numberOfRuns = process.env.LIGHTHOUSE_RUNS || 5;
}

module.exports = desktopConfig;
