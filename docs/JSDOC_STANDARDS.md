# NosytLabs JSDoc Documentation Standards

This document defines the standardized JSDoc format for all JavaScript, TypeScript, and Astro components in the NosytLabs codebase.

## Overview

Consistent documentation improves code maintainability, developer experience, and helps with IDE intellisense. All functions, classes, components, and modules should follow these JSDoc standards.

## Basic JSDoc Structure

```javascript
/**
 * Brief description of the function/class/component (required)
 * 
 * Longer description with more details about functionality,
 * use cases, and important notes (optional but recommended)
 * 
 * @param {type} paramName - Description of parameter
 * @param {type} [optionalParam] - Description of optional parameter
 * @param {type} [optionalParam=defaultValue] - Optional with default
 * @returns {type} Description of return value
 * @throws {ErrorType} Description of when this error is thrown
 * @example
 * // Usage example
 * const result = functionName(param1, param2);
 * 
 * @since 1.0.0
 * @author NosytLabs Team
 */
```

## Function Documentation

### Standard Functions

```javascript
/**
 * Converts a color string to RGB object for particle configurations
 * 
 * Supports hex (#RRGGBB, #RGB) and rgb(r,g,b) color formats.
 * Returns null if the color format is invalid or conversion fails.
 * 
 * @param {string} color - Color string in hex or rgb format
 * @returns {object|null} RGB object with r, g, b properties or null if conversion fails
 * @throws {TypeError} When color parameter is not a string
 * @example
 * // Convert hex color
 * const rgb = colorToRgb('#4C1D95');
 * // Returns: { r: 76, g: 29, b: 149 }
 * 
 * @example
 * // Convert rgb color
 * const rgb = colorToRgb('rgb(255, 107, 0)');
 * // Returns: { r: 255, g: 107, b: 0 }
 * 
 * @since 1.0.0
 */
function colorToRgb(color) {
  // Implementation...
}
```

### Async Functions

```javascript
/**
 * Optimizes JavaScript files by bundling and minifying them
 * 
 * Creates optimized bundles based on priority and usage patterns.
 * Automatically handles error recovery and fallback strategies.
 * 
 * @async
 * @param {string[]} files - Array of file paths to optimize
 * @param {object} options - Optimization configuration
 * @param {string} options.outputDir - Directory for optimized files
 * @param {boolean} [options.minify=true] - Whether to minify the output
 * @param {string} [options.target='es2020'] - JavaScript target version
 * @returns {Promise<object>} Optimization results with file sizes and paths
 * @throws {Error} When file optimization fails
 * @example
 * const result = await optimizeJSFiles(['main.js', 'utils.js'], {
 *   outputDir: 'dist',
 *   minify: true
 * });
 * 
 * @since 1.2.0
 */
async function optimizeJSFiles(files, options = {}) {
  // Implementation...
}
```

## Class Documentation

```javascript
/**
 * Performance optimization manager for NosytLabs applications
 * 
 * Handles JavaScript bundling, CSS optimization, image compression,
 * and performance monitoring. Provides detailed metrics and reporting.
 * 
 * @class
 * @example
 * const optimizer = new PerformanceOptimizer({
 *   distPath: './dist',
 *   enableMetrics: true
 * });
 * 
 * await optimizer.optimizeAll();
 * console.log(optimizer.getMetrics());
 * 
 * @since 1.0.0
 */
class PerformanceOptimizer {
  /**
   * Creates a new PerformanceOptimizer instance
   * 
   * @param {object} config - Configuration options
   * @param {string} config.distPath - Path to distribution directory
   * @param {boolean} [config.enableMetrics=true] - Enable performance metrics
   * @param {object} [config.bundleOptions] - Custom bundle configuration
   */
  constructor(config) {
    // Implementation...
  }

  /**
   * Analyzes JavaScript files and identifies optimization opportunities
   * 
   * Scans for duplicate functions, unused code, and bundle optimization
   * opportunities. Updates internal metrics with findings.
   * 
   * @returns {object} Analysis results with recommendations
   * @example
   * const analysis = optimizer.analyzeJSFiles();
   * console.log(`Found ${analysis.duplicates} duplicate functions`);
   */
  analyzeJSFiles() {
    // Implementation...
  }
}
```

## Astro Component Documentation

```astro
---
/**
 * CodeDisplay Component
 * 
 * A professional code display component for showcasing code snippets
 * with syntax highlighting, copy functionality, and multiple themes.
 * 
 * Features:
 * - Syntax highlighting for multiple languages
 * - Copy to clipboard functionality
 * - Optional line numbers
 * - Expandable view
 * - Multiple themes (default, professional, tech, minimal)
 * - Terminal mode option
 * 
 * @component
 * @example
 * <CodeDisplay
 *   title="example.js"
 *   language="javascript"
 *   code="console.log('Hello World');"
 *   dark={true}
 *   showLineNumbers={true}
 *   theme="professional"
 * />
 * 
 * @since 1.0.0
 */

/**
 * Props interface for CodeDisplay component
 * 
 * @typedef {object} Props
 * @property {string} [title="main.js"] - Title displayed in the code header
 * @property {string} [language="javascript"] - Programming language for syntax highlighting
 * @property {string} [code=""] - Code content to display
 * @property {boolean} [dark=true] - Whether to use dark theme
 * @property {boolean} [showLineNumbers=true] - Whether to show line numbers
 * @property {boolean} [terminalMode=false] - Whether to display as terminal
 * @property {boolean} [expandable=false] - Whether code can be expanded
 * @property {'default'|'professional'|'tech'|'minimal'} [theme="default"] - Visual theme
 */
export interface Props {
  title?: string;
  language?: string;
  code?: string;
  dark?: boolean;
  showLineNumbers?: boolean;
  terminalMode?: boolean;
  expandable?: boolean;
  theme?: 'default' | 'professional' | 'tech' | 'minimal';
}

const {
  title = "main.js",
  language = "javascript",
  code = "",
  dark = true,
  showLineNumbers = true,
  terminalMode = false,
  expandable = false,
  theme = "default"
} = Astro.props;
---
```

## TypeScript-Specific Documentation

```typescript
/**
 * Type-safe configuration for NosytLabs brand colors
 * 
 * Provides readonly access to the official brand color palette
 * with proper TypeScript type definitions for IDE support.
 * 
 * @interface
 * @readonly
 * @example
 * const colors: ColorPalette = {
 *   PRIMARY: {
 *     PURPLE_MAIN: '#4C1D95',
 *     // ...
 *   }
 * };
 * 
 * @since 1.0.0
 */
export interface ColorPalette {
  readonly PRIMARY: {
    readonly PURPLE_DARKEST: string;
    readonly PURPLE_DARK: string;
    readonly PURPLE_MAIN: string;
    readonly PURPLE_LIGHT: string;
    readonly PURPLE_LIGHTEST: string;
  };
  // ...
}

/**
 * Animation type union for component animations
 * 
 * Defines all supported animation types for consistent usage
 * across components and utilities.
 * 
 * @typedef {'fade-in'|'slide-up'|'slide-down'|'slide-left'|'slide-right'|'zoom-in'|'zoom-out'|'flip'|'rotate'|'bounce'} AnimationType
 * @example
 * const animation: AnimationType = 'fade-in';
 * 
 * @since 1.0.0
 */
export type AnimationType = 
  | 'fade-in'
  | 'slide-up'
  | 'slide-down'
  | 'slide-left'
  | 'slide-right'
  | 'zoom-in'
  | 'zoom-out'
  | 'flip'
  | 'rotate'
  | 'bounce';
```

## Module Documentation

```javascript
/**
 * @fileoverview NosytLabs Shared Constants
 * 
 * Single source of truth for all repeated values, magic numbers,
 * and configuration constants used throughout the application.
 * 
 * This module consolidates company information, brand colors,
 * timing values, paths, and other constants to ensure consistency
 * and maintainability across the codebase.
 * 
 * @module constants
 * @version 1.0.0
 * @author NosytLabs Team
 * @since 1.0.0
 */

/**
 * Company information and branding constants
 * 
 * @namespace
 * @readonly
 */
export const COMPANY = {
  /** @type {string} Company name */
  NAME: 'NosytLabs',
  /** @type {string} Full legal company name */
  FULL_NAME: 'NOSYT LLC',
  /** @type {string} Company tagline */
  TAGLINE: 'Notable Opportunities Shape Your Tomorrow'
};
```

## Required JSDoc Tags

### For All Functions/Methods
- `@param` - For each parameter
- `@returns` - For return value (unless void)
- `@example` - At least one usage example

### For Classes
- `@class` - Class declaration
- `@example` - Usage example

### For Components (Astro)
- `@component` - Component declaration
- `@example` - Usage example with props

### For Modules
- `@fileoverview` - Module description
- `@module` - Module name
- `@version` - Current version
- `@since` - Version when added

### Optional but Recommended
- `@throws` - For functions that can throw errors
- `@async` - For async functions
- `@since` - Version when added
- `@author` - Author information
- `@deprecated` - For deprecated code

## Best Practices

1. **Be Descriptive**: Write clear, concise descriptions
2. **Include Examples**: Always provide usage examples
3. **Document Edge Cases**: Mention important limitations or edge cases
4. **Use Proper Types**: Specify accurate parameter and return types
5. **Keep Updated**: Update documentation when code changes
6. **Link Related**: Reference related functions/components when relevant

## Validation

JSDoc comments will be validated by:
- ESLint rules for JSDoc formatting
- TypeScript compiler for type accuracy
- Documentation generation tools
- Code review process

Run validation with:
```bash
npm run lint
npm run type-check
```
