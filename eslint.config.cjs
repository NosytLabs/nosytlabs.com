const astroEslintParser = require('astro-eslint-parser').default || require('astro-eslint-parser');
const typescriptEslintParser = require('@typescript-eslint/parser').default || require('@typescript-eslint/parser');
const tsEslintPlugin = require('@typescript-eslint/eslint-plugin');

module.exports = [
  {
    // Global settings for all files
    languageOptions: {
      globals: {
        // Browser globals
        window: 'readonly',
        document: 'readonly',
        navigator: 'readonly',
        console: 'readonly',
        // Node.js globals (for build scripts, API routes, etc.)
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        module: 'readonly',
        require: 'readonly',
        exports: 'readonly',
        global: 'readonly',
      },
      ecmaVersion: 2020, // Allows modern ECMAScript features
      sourceType: 'module', // Use ES modules
      parserOptions: {
        ecmaFeatures: {
          jsx: true, // Enable JSX parsing
        },
      },
    },
    rules: {
      // Core JavaScript rules
      'no-unused-vars': 'off', // Handled by TypeScript's rule below in TS files
      'no-console': 'off', // Allow console statements globally for now
      'prefer-const': 'error', // Enforce const for variables that are not reassigned
      'no-var': 'error', // Disallow var
      'object-shorthand': 'warn', // Prefer object shorthand syntax

      // Naming conventions
      camelcase: [
        'warn',
        {
          properties: 'never', // Do not check object property names
          ignoreDestructuring: true, // Do not check destructured identifiers
          allow: ['^UNSAFE_', '^unstable_'], // Allow specific prefixes
        },
      ],

      // Best practices and potential errors
      'no-await-in-loop': 'warn', // Warn about await inside loops
      'no-promise-executor-return': 'error', // Disallow returning values from Promise executor functions
      'prefer-promise-reject-errors': 'error', // Enforce Error objects as Promise rejection reasons
      'require-atomic-updates': 'error', // Disallow assignments to variables that are not declared in the same scope

      // Error handling
      'no-throw-literal': 'error', // Disallow throwing literals as exceptions
      'no-implicit-coercion': [
        'error',
        {
          // Disallow implicit type coercion
          boolean: false,
          number: true,
          string: true,
        },
      ],

      // Import patterns: Prefer alias usage (e.g., '@/' instead of '../../')
      // Note: Import order rules removed as eslint-plugin-import is not installed
      // Consider adding eslint-plugin-import if import ordering is needed
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
      'no-console': 'off', // Allow console in Astro components for server-side logging
    },
  },
  // Configuration and script files
  {
    files: ['**/*.config.{js,mjs,ts}', '**/scripts/**/*.{js,mjs,ts}'],
    languageOptions: {
      parser: typescriptEslintParser,
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
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // Warn on unused variables
    },
  },
  // TypeScript files configuration (excluding scripts)
  {
    files: ['src/**/*.ts', 'src/**/*.tsx', '__tests__/**/*.ts'],
    languageOptions: {
      parser: typescriptEslintParser,
      parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
      },
    },
    plugins: {
      '@typescript-eslint': tsEslintPlugin,
    },
    rules: {
      // Use TypeScript-aware unused vars rule, ignore args/vars starting with underscore
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_',
        },
      ],
    },
  },
  // Ignore patterns
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '.astro/**',
      'public/**/*.js',
      '**/*.min.js',
      '**/vendor/**'
    ],
  },
];
