/**
 * Vitest Configuration for NosytLabs
 * 
 * @fileoverview Comprehensive unit testing configuration using Vitest
 * for testing utilities, components, and performance regression testing.
 * 
 * @author NosytLabs Development Team
 * @version 1.0.0
 * @since 2024
 */

import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
  test: {
    // Test environment
    environment: 'jsdom',
    
    // Global test setup
    globals: true,
    
    // Setup files
    setupFiles: ['./tests/setup.ts'],
    
    // Test file patterns
    include: [
      'tests/unit/**/*.{test,spec}.{js,ts,jsx,tsx}',
      'src/**/*.{test,spec}.{js,ts,jsx,tsx}'
    ],
    
    // Exclude patterns
    exclude: [
      'node_modules',
      'dist',
      '.astro',
      'tests/e2e/**',
      'tests/*.spec.js' // Playwright tests
    ],
    
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      reportsDirectory: './test-results/coverage',
      exclude: [
        'node_modules/',
        'dist/',
        '.astro/',
        'tests/',
        '**/*.d.ts',
        '**/*.config.{js,ts}',
        '**/coverage/**',
        '**/test-results/**'
      ],
      thresholds: {
        global: {
          branches: 70,
          functions: 70,
          lines: 70,
          statements: 70
        }
      }
    },
    
    // Test timeout
    testTimeout: 10000,
    hookTimeout: 10000,
    
    // Reporters
    reporter: [
      'default',
      'json',
      'html'
    ],
    
    // Output directory
    outputFile: {
      json: './test-results/unit-test-results.json',
      html: './test-results/unit-test-report.html'
    },
    
    // Watch mode
    watch: false,
    
    // Performance testing
    benchmark: {
      include: ['tests/performance/**/*.bench.{js,ts}'],
      exclude: ['node_modules', 'dist'],
      reporter: ['default', 'json'],
      outputFile: './test-results/benchmark-results.json'
    },
    
    // Retry configuration
    retry: 2,
    
    // Parallel execution
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
        maxThreads: 4,
        minThreads: 1
      }
    },
    
    // Mock configuration
    clearMocks: true,
    restoreMocks: true,
    
    // Test isolation
    isolate: true,
    
    // Snapshot configuration
    resolveSnapshotPath: (testPath, snapExtension) => {
      return testPath.replace(/\.test\.([tj]sx?)/, `.test.${snapExtension}`);
    }
  },
  
  // Resolve configuration
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
      '@components': resolve(__dirname, './src/components'),
      '@utils': resolve(__dirname, './src/utils'),
      '@layouts': resolve(__dirname, './src/layouts'),
      '@pages': resolve(__dirname, './src/pages'),
      '@styles': resolve(__dirname, './src/styles'),
      '@scripts': resolve(__dirname, './src/scripts'),
      '@public': resolve(__dirname, './public'),
      '@tests': resolve(__dirname, './tests')
    }
  },
  
  // Define configuration for different environments
  define: {
    __TEST__: true,
    __DEV__: false,
    __PROD__: false
  },
  
  // Esbuild configuration for TypeScript
  esbuild: {
    target: 'node14'
  }
});
