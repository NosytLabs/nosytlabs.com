/**
 * Manual Contrast Audit Script
 * Checks color combinations for WCAG 2.2 compliance
 */

// Color definitions from the site
const colors = {
  // Primary colors
  primary: {
    50: '#faf5ff',
    100: '#f3e8ff',
    200: '#e9d5ff',
    300: '#d8b4fe',
    400: '#c084fc',
    500: '#a855f7',
    600: '#c026d3', // Updated for WCAG AA compliance
    700: '#7e22ce',
    800: '#6b21a8',
    900: '#581c87',
  },
  // Secondary colors
  secondary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#027cbb', // Updated for WCAG AA compliance
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  // Neutral colors
  neutral: {
    50: '#fafafa',
    100: '#f5f5f5',
    200: '#e5e5e5',
    300: '#d4d4d4',
    400: '#a3a3a3',
    500: '#737373',
    600: '#525252',
    700: '#404040',
    800: '#262626',
    900: '#171717',
  },
  // Status colors
  red: {
    500: '#d73d3d', // Updated for WCAG AA compliance
    600: '#dc2626',
    700: '#b91c1c',
  },
  green: {
    500: '#0c855d', // Updated for WCAG AA compliance
    600: '#059669',
    700: '#047857',
  },
  // Special colors
  white: '#ffffff',
  black: '#000000',
};

// Convert hex to RGB
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Calculate relative luminance
function getLuminance(r, g, b) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

// Calculate contrast ratio
function getContrastRatio(color1, color2) {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return 0;
  
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
}

// WCAG compliance levels
function getWCAGLevel(ratio, isLargeText = false) {
  if (isLargeText) {
    if (ratio >= 4.5) return 'AAA';
    if (ratio >= 3) return 'AA';
    return 'FAIL';
  } else {
    if (ratio >= 7) return 'AAA';
    if (ratio >= 4.5) return 'AA';
    return 'FAIL';
  }
}

// Test color combinations
function auditColorCombinations() {
  const results = [];

  // Common text/background combinations used in the site
  const combinations = [
    // Hero section - white text on dark backgrounds
    { fg: colors.white, bg: '#1e1b4b', name: 'Hero white on purple-900' },
    { fg: colors.white, bg: '#1e3a8a', name: 'Hero white on blue-900' },
    { fg: colors.white, bg: '#581c87', name: 'Hero white on purple-800' },
    
    // Body text combinations
    { fg: colors.neutral[900], bg: colors.white, name: 'Body text dark on white' },
    { fg: colors.neutral[100], bg: colors.neutral[800], name: 'Body text light on dark' },
    { fg: colors.neutral[600], bg: colors.white, name: 'Muted text on white' },
    { fg: colors.neutral[400], bg: colors.neutral[800], name: 'Muted text on dark' },
    
    // Button combinations
    { fg: colors.white, bg: colors.primary[600], name: 'Primary button' },
    { fg: colors.white, bg: colors.secondary[600], name: 'Secondary button' },
    { fg: colors.primary[600], bg: colors.white, name: 'Outline button' },
    
    // Status colors
    { fg: colors.white, bg: colors.red[500], name: 'Error button' },
    { fg: colors.white, bg: colors.green[500], name: 'Success button' },
    { fg: colors.red[700], bg: colors.white, name: 'Error text' },
    { fg: colors.green[700], bg: colors.white, name: 'Success text' },
    
    // Input field combinations
    { fg: colors.neutral[900], bg: colors.white, name: 'Input text' },
    { fg: colors.neutral[100], bg: colors.neutral[800], name: 'Input text dark mode' },
    { fg: colors.neutral[500], bg: colors.white, name: 'Placeholder text' },
    
    // Link colors
    { fg: '#1d4ed8', bg: colors.white, name: 'Link on white' }, // Using blue-700 for WCAG AA compliance
    { fg: colors.primary[400], bg: colors.neutral[800], name: 'Link on dark' },
  ];

  combinations.forEach(({ fg, bg, name }) => {
    const ratio = getContrastRatio(fg, bg);
    const normalText = getWCAGLevel(ratio, false);
    const largeText = getWCAGLevel(ratio, true);
    
    const issues = [];
    if (normalText === 'FAIL') {
      issues.push('Fails WCAG AA for normal text (needs 4.5:1)');
    }
    if (largeText === 'FAIL') {
      issues.push('Fails WCAG AA for large text (needs 3:1)');
    }
    if (ratio < 7 && normalText !== 'FAIL') {
      issues.push('Does not meet WCAG AAA for normal text (needs 7:1)');
    }
    
    results.push({
      foreground: fg,
      background: bg,
      ratio: Math.round(ratio * 100) / 100,
      normalText,
      largeText,
      issues
    });
    
    console.log(`\n${name}:`);
    console.log(`  Foreground: ${fg}`);
    console.log(`  Background: ${bg}`);
    console.log(`  Contrast Ratio: ${ratio.toFixed(2)}:1`);
    console.log(`  Normal Text: ${normalText}`);
    console.log(`  Large Text: ${largeText}`);
    if (issues.length > 0) {
      console.log(`  Issues: ${issues.join(', ')}`);
    }
  });

  // Summary
  const failingCombinations = results.filter(r => r.normalText === 'FAIL' || r.largeText === 'FAIL');
  const warningCombinations = results.filter(r => r.issues.length > 0 && r.normalText !== 'FAIL');
  
  console.log('\n=== CONTRAST AUDIT SUMMARY ===');
  console.log(`Total combinations tested: ${results.length}`);
  console.log(`Failing WCAG AA: ${failingCombinations.length}`);
  console.log(`With warnings: ${warningCombinations.length}`);
  
  if (failingCombinations.length > 0) {
    console.log('\n❌ CRITICAL ISSUES (WCAG AA Failures):');
    failingCombinations.forEach(result => {
      console.log(`  - ${result.foreground} on ${result.background}: ${result.ratio}:1`);
    });
  }
  
  if (warningCombinations.length > 0) {
    console.log('\n⚠️  WARNINGS (WCAG AAA Recommendations):');
    warningCombinations.forEach(result => {
      if (result.normalText !== 'FAIL') {
        console.log(`  - ${result.foreground} on ${result.background}: ${result.ratio}:1`);
      }
    });
  }
  
  if (failingCombinations.length === 0) {
    console.log('\n✅ All color combinations meet WCAG AA standards!');
  }
  
  return results;
}

// Run the audit
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { auditColorCombinations, getContrastRatio, getWCAGLevel };
} else {
  auditColorCombinations();
}

// Execute the audit
auditColorCombinations();