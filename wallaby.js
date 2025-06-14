module.exports = function (wallaby) {
  return {
    autoDetect: true,
    
    // Test files
    tests: [
      'tests/**/*.test.{js,ts,jsx,tsx}',
      'src/**/*.test.{js,ts,jsx,tsx}'
    ],

    // Files to be instrumented
    files: [
      'src/**/*.{js,ts,jsx,tsx,astro}',
      '!src/**/*.test.{js,ts,jsx,tsx}',
      '!src/**/*.spec.{js,ts,jsx,tsx}',
      'vitest.config.ts',
      'tests/setup.ts'
    ],

    // Environment setup
    env: {
      type: 'node',
      runner: 'node'
    },

    // Test framework
    testFramework: 'vitest',

    // Setup files
    setup: function (wallaby) {
      const path = require('path');
      
      // Set environment variables
      process.env.NODE_ENV = 'test';
      process.env.VITEST = 'true';
      
      // Configure module resolution
      wallaby.testFramework.configure({
        configFile: path.join(wallaby.projectCacheDir, 'vitest.config.ts')
      });
    },

    // Preprocessing
    preprocessors: {
      '**/*.{js,jsx,ts,tsx}': wallaby.preprocessors.babel({
        babel: {
          presets: [
            ['@babel/preset-env', { targets: { node: 'current' } }],
            ['@babel/preset-react', { runtime: 'automatic' }],
            '@babel/preset-typescript'
          ],
          plugins: [
            '@babel/plugin-proposal-class-properties',
            '@babel/plugin-proposal-object-rest-spread'
          ]
        }
      })
    },

    // Hints for better performance
    hints: {
      ignoreCoverage: /ignore coverage/
    },

    // Debug settings
    debug: false,
    
    // Workers configuration
    workers: {
      initial: 1,
      regular: 1
    },

    // Reporting
    reportConsoleErrorAsError: true,
    
    // File system watching
    filesWithNoCoverageCalculated: [
      'tests/**/*',
      '**/*.config.{js,ts}',
      '**/*.d.ts'
    ],

    // Custom configuration for Astro support
    compilers: {
      '**/*.astro': wallaby.compilers.babel({
        babel: {
          presets: [
            ['@babel/preset-env', { targets: { node: 'current' } }],
            '@babel/preset-typescript'
          ]
        }
      })
    },

    // Delays for better performance
    delays: {
      run: 300
    }
  };
};