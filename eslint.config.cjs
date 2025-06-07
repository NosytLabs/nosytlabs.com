module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true,
  },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:astro/recommended',
    'prettier', // Disable ESLint rules that conflict with Prettier
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: [
    '@typescript-eslint',
    'react',
    'react-hooks',
    'jsx-a11y',
    'prettier',
    'jsdoc',
    'import',
  ],
  settings: {
    react: {
      version: '18.2.0',
    },
  },
  rules: {
    // Core JavaScript rules matching existing patterns
    'no-unused-vars': 'off', // Handled by TypeScript
    '@typescript-eslint/no-unused-vars': ['warn', {
      argsIgnorePattern: '^_',
      varsIgnorePattern: '^_',
    }],
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
    'func-style': ['warn', 'declaration', { allowArrowFunctions: true }],

    // React rules (for React components)
    'react/react-in-jsx-scope': 'off', // Not needed in modern React
    'react/prop-types': 'off', // Using TypeScript for prop validation
    'react/jsx-uses-react': 'off',
    'react/jsx-uses-vars': 'error',
    'react/jsx-key': 'error',
    'react/no-unescaped-entities': 'warn',

    // React Hooks rules
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',

    // Accessibility rules (matching existing focus on accessibility)
    'jsx-a11y/alt-text': 'error',
    'jsx-a11y/anchor-has-content': 'error',
    'jsx-a11y/anchor-is-valid': 'error',
    'jsx-a11y/aria-props': 'error',
    'jsx-a11y/aria-proptypes': 'error',
    'jsx-a11y/aria-unsupported-elements': 'error',
    'jsx-a11y/heading-has-content': 'error',
    'jsx-a11y/img-redundant-alt': 'error',
    'jsx-a11y/no-access-key': 'error',

    // TypeScript specific rules
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
    '@typescript-eslint/no-inferrable-types': 'warn',
    '@typescript-eslint/consistent-type-definitions': ['warn', 'interface'],

    // Performance and best practices (matching existing focus)
    'no-await-in-loop': 'warn',
    'no-promise-executor-return': 'error',
    'prefer-promise-reject-errors': 'error',
    'require-atomic-updates': 'error',

    // Prettier integration
    'prettier/prettier': 'warn', // Show Prettier issues as warnings

    // JSDoc rules for documentation standards
    'jsdoc/check-alignment': 'warn',
    'jsdoc/check-indentation': 'warn',
    'jsdoc/check-param-names': 'error',
    'jsdoc/check-syntax': 'error',
    'jsdoc/check-tag-names': 'error',
    'jsdoc/check-types': 'warn',
    'jsdoc/newline-after-description': 'warn',
    'jsdoc/no-undefined-types': 'warn',
    'jsdoc/require-description': 'warn',
    'jsdoc/require-example': 'off', // Too strict for gradual adoption
    'jsdoc/require-param': 'warn',
    'jsdoc/require-param-description': 'warn',
    'jsdoc/require-param-name': 'error',
    'jsdoc/require-param-type': 'warn',
    'jsdoc/require-returns': 'warn',
    'jsdoc/require-returns-description': 'warn',
    'jsdoc/require-returns-type': 'warn',
    'jsdoc/valid-types': 'warn',

    // Import/Export organization rules
    'import/order': ['warn', {
      'groups': [
        'builtin',
        'external',
        'internal',
        'parent',
        'sibling',
        'index'
      ],
      'pathGroups': [
        {
          'pattern': '@/**',
          'group': 'internal',
          'position': 'before'
        }
      ],
      'pathGroupsExcludedImportTypes': ['builtin'],
      'newlines-between': 'always',
      'alphabetize': {
        'order': 'asc',
        'caseInsensitive': true
      }
    }],
    'import/no-relative-parent-imports': 'warn',
    'import/no-cycle': 'error',
    'import/no-self-import': 'error',
    'import/prefer-default-export': 'off',
    'import/no-default-export': 'off',

    // Error handling standardization rules
    'no-console': ['warn', {
      allow: ['info', 'debug'] // Allow info and debug, discourage error/warn
    }],
    'prefer-promise-reject-errors': 'error',
    'no-throw-literal': 'error',
    'no-implicit-coercion': ['error', {
      boolean: false,
      number: true,
      string: true
    }],
  },
  overrides: [
    // Astro files
    {
      files: ['**/*.astro'],
      parser: 'astro-eslint-parser',
      parserOptions: {
        parser: '@typescript-eslint/parser',
        extraFileExtensions: ['.astro'],
      },
      rules: {
        // Allow console in Astro components for server-side logging
        'no-console': 'off',
      },
    },
    // Configuration and script files
    {
      files: ['**/*.config.{js,mjs,ts}', '**/scripts/**/*.{js,mjs,ts}'],
      env: {
        node: true,
      },
      rules: {
        'no-console': 'off', // Allow console in build scripts
        '@typescript-eslint/no-var-requires': 'off', // Allow require in config files
      },
    },
  ],
  ignorePatterns: [
    'dist/**',
    'node_modules/**',
    '.astro/**',
    'public/**/*.js', // Ignore public scripts (they have different patterns)
    '**/*.min.js',
    '**/vendor/**',
    '**/doom/**', // Ignore Doom-related files (performance-critical)
  ],
};
