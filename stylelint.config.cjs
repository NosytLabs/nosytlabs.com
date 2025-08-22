module.exports = {
  extends: ['stylelint-config-standard'],
  plugins: [],
  rules: {
    // Modern CSS features
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'tailwind',
          'apply',
          'variants',
          'responsive',
          'screen',
          'container',
          'layer',
        ],
      },
    ],
    'function-no-unknown': [
      true,
      {
        ignoreFunctions: ['theme', 'screen'],
      },
    ],
    // Custom properties
    'custom-property-empty-line-before': 'never',
    'declaration-empty-line-before': 'never',
    // Logical properties
    'property-no-unknown': [
      true,
      {
        ignoreProperties: [
          'margin-block',
          'margin-inline',
          'padding-block',
          'padding-inline',
          'border-block',
          'border-inline',
          'inset-block',
          'inset-inline',
        ],
      },
    ],
    // Tailwind theme() values in declarations are valid in our setup
    'declaration-property-value-no-unknown': null,
    // Allow Tailwind-style escaped class names like .focus-visible\:ring-2
    'selector-class-pattern': null,
    // Container queries
    'media-feature-name-no-unknown': [
      true,
      {
        ignoreMediaFeatureNames: ['container'],
      },
    ],
    'media-feature-name-value-no-unknown': [
      true,
      {
        ignoreMediaFeatureNameValuePairs: {
          'prefers-contrast': ['high', 'more', 'less'],
        },
      },
    ],
    // Color function support
    'color-function-notation': 'modern',
    'alpha-value-notation': 'percentage',
    'number-max-precision': 4,
  },
  ignoreFiles: [
    'dist/**/*',
    'node_modules/**/*',
    '**/*.js',
    '**/*.jsx',
    '**/*.ts',
    '**/*.tsx',
  ],
};