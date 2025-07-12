const astroEslintParser = require('astro-eslint-parser').default || require('astro-eslint-parser');
const typescriptEslintParser = require('@typescript-eslint/parser').default || require('@typescript-eslint/parser');

module.exports = [
  {
    languageOptions: {
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
        // Node.js globals
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        global: 'readonly',
      },
      ecmaVersion: 2020,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      // Core JavaScript rules matching existing patterns
      'no-unused-vars': 'off', // Handled by TypeScript
      'no-console': 'off', // Allow console for debugging (existing pattern)
      'prefer-const': 'error',
      'no-var': 'error',
      'object-shorthand': 'warn',

      // Function and naming patterns (matching existing code)
      'camelcase': ['warn', {
        properties: 'never',
        ignoreDestructuring: true,
        allow: ['^UNSAFE_', '^unstable_']
      }],

      // Performance and best practices (matching existing focus)
      'no-await-in-loop': 'warn',
      'no-promise-executor-return': 'error',
      'prefer-promise-reject-errors': 'error',
      'require-atomic-updates': 'error',

      // Error handling standardization rules
      'no-throw-literal': 'error',
      'no-implicit-coercion': ['error', {
        boolean: false,
        number: true,
        string: true
      }],
    },
  },
  // Astro files configuration
  {
    files: ['**/*.astro'],
    languageOptions: {
      parser: astroEslintParser,
      parserOptions: {
        parser: typescriptEslintParser,
        extraFileExtensions: ['.astro'],
      },
    },
    rules: {
      // Allow console in Astro components for server-side logging
      'no-console': 'off',
    },
  },
  // Configuration and script files
  {
    files: ['**/*.config.{js,mjs,ts}', '**/scripts/**/*.{js,mjs,ts}'],
    languageOptions: {
      globals: {
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        global: 'readonly',
      },
    },
    rules: {
      'no-console': 'off', // Allow console in build scripts
    },
  },
  // TypeScript files configuration
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptEslintParser,
      parserOptions: {
        project: './tsconfig.json',
      },
    },
    rules: {
      // Add TypeScript specific rules here if needed
    },
  },
  // Ignore patterns
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '.astro/**',
      'public/**/*.js',
      'src/scripts/optimized/**', // Exclude optimized JavaScript files
      '**/*.min.js',
      '**/vendor/**',
      '**/doom/**',
      'dist/',
    ],
  },
];
