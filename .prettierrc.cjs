module.exports = {
  // Basic formatting options matching existing code style
  semi: true,                    // Use semicolons (matching existing pattern)
  singleQuote: true,            // Use single quotes for JS/TS (matching existing pattern)
  quoteProps: 'as-needed',      // Only quote object properties when needed
  trailingComma: 'es5',         // Trailing commas where valid in ES5 (objects, arrays)
  
  // Indentation and spacing (matching existing 2-space pattern)
  tabWidth: 2,                  // 2 spaces for indentation (matching existing code)
  useTabs: false,               // Use spaces, not tabs
  
  // Line length and wrapping (matching existing patterns)
  printWidth: 100,              // Line length limit (slightly longer for readability)
  proseWrap: 'preserve',        // Don't wrap prose (markdown, comments)
  
  // Bracket and parentheses formatting
  bracketSpacing: true,         // Spaces inside object brackets: { foo: bar }
  bracketSameLine: false,       // Put closing bracket on new line
  arrowParens: 'avoid',         // Avoid parentheses around single arrow function parameters
  
  // HTML/JSX specific settings (for Astro components)
  htmlWhitespaceSensitivity: 'css',  // Respect CSS display property for whitespace
  
  // File-specific overrides to match existing patterns
  overrides: [
    // JSON files - use double quotes (standard JSON format)
    {
      files: ['*.json', '*.jsonc'],
      options: {
        singleQuote: false,
        trailingComma: 'none',
      },
    },
    
    // Markdown files - preserve formatting
    {
      files: ['*.md', '*.mdx'],
      options: {
        proseWrap: 'preserve',
        printWidth: 80,
        tabWidth: 2,
      },
    },
    
    // Astro files - special handling for component structure
    {
      files: ['*.astro'],
      options: {
        parser: 'astro',
        printWidth: 100,
        semi: true,
        singleQuote: true,
        tabWidth: 2,
        trailingComma: 'es5',
        bracketSameLine: false,
        htmlWhitespaceSensitivity: 'css',
      },
    },
    
    // CSS/SCSS files - different formatting preferences
    {
      files: ['*.css', '*.scss', '*.sass'],
      options: {
        singleQuote: false,  // Use double quotes in CSS
        printWidth: 120,     // Longer lines for CSS
      },
    },
    
    // Configuration files - preserve existing style
    {
      files: [
        '*.config.js',
        '*.config.mjs',
        '*.config.ts',
        'astro.config.*',
        'tailwind.config.*',
        'eslint.config.*',
      ],
      options: {
        printWidth: 120,     // Allow longer lines for config
        singleQuote: true,
        semi: true,
        trailingComma: 'es5',
      },
    },
    
    // Package.json - standard formatting
    {
      files: ['package.json', 'package-lock.json'],
      options: {
        singleQuote: false,
        trailingComma: 'none',
        printWidth: 120,
      },
    },
  ],
  
  // Plugin configurations
  plugins: [
    // Astro plugin for .astro file support
    'prettier-plugin-astro',
    // Tailwind plugin for class sorting (if desired)
    // 'prettier-plugin-tailwindcss', // Uncomment if you want automatic Tailwind class sorting
  ],
  
  // Astro-specific settings
  astroAllowShorthand: true,    // Allow shorthand syntax in Astro components
};
