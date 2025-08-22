#!/usr/bin/env node
/**
 * CSS Token Generator
 * Automatically generates design-tokens.css from the TypeScript token definitions
 * This ensures consistency and eliminates duplication between JS and CSS tokens
 */

const fs = require('fs');
const path = require('path');

// Import the tokens from the TypeScript file
// Note: We need to compile the TS file or use a different approach

// For now, we'll define the tokens directly here
// TODO: Set up proper TS compilation for build scripts

// Typography tokens
const typography = {
  fontSizes: {
    xs: '0.75rem',
    sm: '0.875rem',
    base: '1rem',
    lg: '1.125rem',
    xl: '1.25rem',
    '2xl': '1.5rem',
    '3xl': '1.875rem',
    '4xl': '2.25rem',
    '5xl': '3rem',
    '6xl': '3.75rem',
  },
  fontWeights: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
};

// Spacing tokens
const spacing = {
  0: '0',
  px: '1px',
  0.5: '0.125rem',
  1: '0.25rem',
  1.5: '0.375rem',
  2: '0.5rem',
  2.5: '0.625rem',
  3: '0.75rem',
  3.5: '0.875rem',
  4: '1rem',
  5: '1.25rem',
  6: '1.5rem',
  7: '1.75rem',
  8: '2rem',
  9: '2.25rem',
  10: '2.5rem',
  11: '2.75rem',
  12: '3rem',
  14: '3.5rem',
  16: '4rem',
  20: '5rem',
  24: '6rem',
  28: '7rem',
  32: '8rem',
  36: '9rem',
  40: '10rem',
  44: '11rem',
  48: '12rem',
  52: '13rem',
  56: '14rem',
  60: '15rem',
  64: '16rem',
  72: '18rem',
  80: '20rem',
  96: '24rem',
};

// Border radius tokens
const borderRadius = {
  none: '0',
  sm: '0.125rem',
  base: '0.25rem',
  md: '0.375rem',
  lg: '0.5rem',
  xl: '0.75rem',
  '2xl': '1rem',
  '3xl': '1.5rem',
  full: '9999px',
};

// Shadow tokens
const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  none: '0 0 #0000',
};

// Semantic color tokens
const semanticColors = {
  text: {
    primary: 'var(--color-neutral-900)',
    secondary: 'var(--color-neutral-700)',
    muted: 'var(--color-neutral-500)',
    headings: 'var(--color-neutral-900)',
    link: 'var(--color-primary-600)',
    linkHover: 'var(--color-primary-700)',
    inverse: 'var(--color-neutral-0)',
    disabled: 'var(--color-neutral-400)',
  },
  surface: {
    primary: 'var(--color-neutral-0)',
    secondary: 'var(--color-neutral-50)',
    tertiary: 'var(--color-neutral-100)',
    muted: 'var(--color-neutral-100)',
  },
  background: {
    primary: 'var(--color-neutral-0)',
    secondary: 'var(--color-neutral-50)',
    muted: 'var(--color-neutral-100)',
  },
  border: {
    primary: 'var(--color-neutral-200)',
    strong: 'var(--color-neutral-300)',
    emphasis: 'var(--color-neutral-400)',
    muted: 'var(--color-neutral-100)',
  },
  interactive: {
    focusOutline: 'var(--color-primary-500)',
    onPrimary: 'var(--color-neutral-0)',
    onSuccess: 'var(--color-neutral-0)',
    onWarning: 'var(--color-neutral-900)',
    onError: 'var(--color-neutral-0)',
    onInfo: 'var(--color-neutral-0)',
  },
  shadow: {
    color: 'rgb(0 0 0 / 0.1)',
  },
};

const colors = {
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
    950: '#172554',
  },
  secondary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#9333ea',
    700: '#7c3aed',
    800: '#6b21a8',
    900: '#581c87',
    950: '#3b0764',
  },
  accent: {
    50: '#ecfeff',
    100: '#cffafe',
    200: '#a5f3fc',
    300: '#67e8f9',
    400: '#22d3ee',
    500: '#06b6d4',
    600: '#0891b2',
    700: '#0e7490',
    800: '#155e75',
    900: '#164e63',
    950: '#083344',
  },
  neutral: {
    0: '#ffffff',
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#94a3b8',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    200: '#bbf7d0',
    300: '#86efac',
    400: '#4ade80',
    500: '#22c55e',
    600: '#16a34a',
    700: '#15803d',
    800: '#166534',
    900: '#14532d',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    200: '#fde68a',
    300: '#fcd34d',
    400: '#fbbf24',
    500: '#f59e0b',
    600: '#d97706',
    700: '#b45309',
    800: '#92400e',
    900: '#78350f',
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
  },
  info: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
};

const fonts = {
  sans: "'Inter', -apple-system, blinkmacsystemfont, 'Segoe UI', roboto, helvetica, arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
  serif: "'Lora', 'Georgia', cambria, 'Times New Roman', times, serif",
  mono: "'Menlo', 'DejaVu Sans Mono', 'Liberation Mono', 'Consolas', 'Ubuntu Mono', 'Courier New', 'andale mono', 'lucida console', monospace",
};

/**
 * Convert camelCase to kebab-case
 */
function toKebabCase(str) {
  return str.replace(/([a-z0-9]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
}

/**
 * Generate CSS custom properties from color tokens with RGB variants
 */
function generateColorTokens(colorObj, prefix = 'color') {
  let css = '';
  
  for (const [colorName, colorValues] of Object.entries(colorObj)) {
    if (typeof colorValues === 'object') {
      for (const [shade, value] of Object.entries(colorValues)) {
        css += `    --${prefix}-${toKebabCase(colorName)}-${shade}: ${value};\n`;
        // Generate RGB variants for rgba() usage
        if (value.startsWith('#')) {
          const rgbValue = hexToRgb(value);
          if (rgbValue) {
            css += `    --${prefix}-${toKebabCase(colorName)}-${shade}-rgb: ${rgbValue};\n`;
          }
        }
      }
    } else {
      css += `    --${prefix}-${toKebabCase(colorName)}: ${colorValues};\n`;
      // Generate RGB variant for rgba() usage
      if (colorValues.startsWith('#')) {
        const rgbValue = hexToRgb(colorValues);
        if (rgbValue) {
          css += `    --${prefix}-${toKebabCase(colorName)}-rgb: ${rgbValue};\n`;
        }
      }
    }
  }
  
  return css;
}

/**
 * Convert hex color to RGB values
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}` : null;
}

/**
 * Generate CSS custom properties from font tokens
 */
function generateFontTokens(fontObj) {
  let css = '';
  
  for (const [fontName, fontValue] of Object.entries(fontObj)) {
    css += `    --font-family-${toKebabCase(fontName)}: ${fontValue};\n`;
  }
  
  return css;
}

/**
 * Generate CSS custom properties from typography tokens
 */
function generateTypographyTokens(typographyObj) {
  let css = '';
  
  // Font sizes
  for (const [sizeName, sizeValue] of Object.entries(typographyObj.fontSizes)) {
    css += `    --font-size-${sizeName}: ${sizeValue};\n`;
  }
  
  // Font weights
  for (const [weightName, weightValue] of Object.entries(typographyObj.fontWeights)) {
    css += `    --font-${weightName}: ${weightValue};\n`;
  }
  
  return css;
}

/**
 * Generate CSS custom properties from spacing tokens
 */
function generateSpacingTokens(spacingObj) {
  let css = '';
  
  for (const [spaceName, spaceValue] of Object.entries(spacingObj)) {
    css += `    --spacing-${spaceName}: ${spaceValue};\n`;
  }
  
  return css;
}

/**
 * Generate CSS custom properties from border radius tokens
 */
function generateBorderRadiusTokens(radiusObj) {
  let css = '';
  
  for (const [radiusName, radiusValue] of Object.entries(radiusObj)) {
    css += `    --radius-${radiusName}: ${radiusValue};\n`;
  }
  
  return css;
}

/**
 * Generate CSS custom properties from shadow tokens
 */
function generateShadowTokens(shadowObj) {
  let css = '';
  
  for (const [shadowName, shadowValue] of Object.entries(shadowObj)) {
    css += `    --shadow-${shadowName}: ${shadowValue};\n`;
  }
  
  return css;
}

/**
 * Generate CSS custom properties from semantic color tokens
 */
function generateSemanticColorTokens(semanticObj) {
  let css = '';
  
  for (const [categoryName, categoryValues] of Object.entries(semanticObj)) {
    if (typeof categoryValues === 'object') {
      for (const [tokenName, tokenValue] of Object.entries(categoryValues)) {
        css += `    --color-${toKebabCase(categoryName)}-${toKebabCase(tokenName)}: ${tokenValue};\n`;
      }
    } else {
      css += `    --color-${toKebabCase(categoryName)}: ${categoryValues};\n`;
    }
  }
  
  return css;
}

/**
 * Generate the complete CSS file content
 */
function generateCSSTokens() {
  const header = `/**
 * Design Token System - CSS Variables
 * This file is auto-generated from the design tokens defined in index.ts
 * Do not edit this file directly - run 'npm run generate:tokens' instead
 */\n\n@layer tokens {\n  :root {\n`;
  
  const fontSection = `    /* Font Families */\n${generateFontTokens(fonts)}\n`;
  
  const typographySection = `    /* Typography Tokens */\n${generateTypographyTokens(typography)}\n`;
  
  const spacingSection = `    /* Spacing Tokens */\n${generateSpacingTokens(spacing)}\n`;
  
  const borderRadiusSection = `    /* Border Radius Tokens */\n${generateBorderRadiusTokens(borderRadius)}\n`;
  
  const shadowSection = `    /* Shadow Tokens */\n${generateShadowTokens(shadows)}\n`;
  
  const colorSection = `    /* Colors */\n${generateColorTokens(colors)}\n`;

  const colorAliasSection = `    /* Color Aliases */
    --color-primary: var(--color-primary-500);
    --color-secondary: var(--color-secondary-500);
    --color-accent: var(--color-accent-500);

    /* Background RGB aliases for rgba() usage */
    --background-rgb: var(--color-neutral-0-rgb);
    --background-dark-rgb: var(--color-neutral-800-rgb);
    --border-rgb: var(--color-neutral-200-rgb);
    --border-dark-rgb: var(--color-neutral-600-rgb);
    
    /* Shadow aliases */
    --shadow-color: var(--color-shadow-color);
    --shadow-color-dark: var(--color-neutral-800-rgb);

`;
  
  const semanticColorSection = `    /* Semantic Color Tokens */\n${generateSemanticColorTokens(semanticColors)}`;
  
  const footer = `  }\n}\n`;
  
  return header + fontSection + typographySection + spacingSection + borderRadiusSection + shadowSection + colorSection + colorAliasSection + semanticColorSection + footer;
}

/**
 * Write the generated CSS to the design-tokens.css file
 */
function writeTokensFile() {
  const cssContent = generateCSSTokens();
  const outputPath = path.join(__dirname, '../src/styles/tokens/design-tokens.css');
  
  try {
    fs.writeFileSync(outputPath, cssContent, 'utf8');
    console.log('✅ Successfully generated design-tokens.css');
    console.log(`📁 Output: ${outputPath}`);
  } catch (error) {
    console.error('❌ Error writing design-tokens.css:', error.message);
    process.exit(1);
  }
}

// Run the generator
if (require.main === module) {
  writeTokensFile();
}

module.exports = {
  generateCSSTokens,
  writeTokensFile,
  generateColorTokens,
  generateFontTokens
};