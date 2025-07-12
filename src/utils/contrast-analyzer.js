/**
 * WCAG Contrast Ratio Analyzer
 * Calculates contrast ratios and suggests improvements for accessibility compliance
 */

/**
 * Convert hex color to RGB
 */
function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

/**
 * Calculate relative luminance
 */
function getLuminance(rgb) {
  const { r, g, b } = rgb;
  
  // Convert to sRGB
  const rsRGB = r / 255;
  const gsRGB = g / 255;
  const bsRGB = b / 255;
  
  // Apply gamma correction
  const rLinear = rsRGB <= 0.03928 ? rsRGB / 12.92 : Math.pow((rsRGB + 0.055) / 1.055, 2.4);
  const gLinear = gsRGB <= 0.03928 ? gsRGB / 12.92 : Math.pow((gsRGB + 0.055) / 1.055, 2.4);
  const bLinear = bsRGB <= 0.03928 ? bsRGB / 12.92 : Math.pow((bsRGB + 0.055) / 1.055, 2.4);
  
  // Calculate luminance
  return 0.2126 * rLinear + 0.7152 * gLinear + 0.0722 * bLinear;
}

/**
 * Calculate contrast ratio between two colors
 */
function getContrastRatio(color1, color2) {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return null;
  
  const lum1 = getLuminance(rgb1);
  const lum2 = getLuminance(rgb2);
  
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast ratio meets WCAG standards
 */
function checkWCAGCompliance(ratio) {
  return {
    AA_normal: ratio >= 4.5,    // Normal text
    AA_large: ratio >= 3.0,     // Large text (18pt+ or 14pt+ bold)
    AAA_normal: ratio >= 7.0,   // Enhanced normal text
    AAA_large: ratio >= 4.5,    // Enhanced large text
    level: ratio >= 7.0 ? 'AAA' : ratio >= 4.5 ? 'AA' : ratio >= 3.0 ? 'AA Large' : 'FAIL'
  };
}

/**
 * Generate a darker version of a color for better contrast
 */
function darkenColor(hex, amount = 0.2) {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  const r = Math.max(0, Math.round(rgb.r * (1 - amount)));
  const g = Math.max(0, Math.round(rgb.g * (1 - amount)));
  const b = Math.max(0, Math.round(rgb.b * (1 - amount)));
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Generate a lighter version of a color for better contrast
 */
function lightenColor(hex, amount = 0.2) {
  const rgb = hexToRgb(hex);
  if (!rgb) return hex;
  
  const r = Math.min(255, Math.round(rgb.r + (255 - rgb.r) * amount));
  const g = Math.min(255, Math.round(rgb.g + (255 - rgb.g) * amount));
  const b = Math.min(255, Math.round(rgb.b + (255 - rgb.b) * amount));
  
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
}

/**
 * Find optimal color for contrast ratio
 */
function findOptimalColor(baseColor, targetRatio = 4.5, lighten = false) {
  let step = 0.05;
  let amount = 0;
  let newColor = baseColor;
  let ratio = 1;
  
  while (ratio < targetRatio && amount < 1) {
    amount += step;
    newColor = lighten ? lightenColor(baseColor, amount) : darkenColor(baseColor, amount);
    ratio = getContrastRatio(newColor, lighten ? '#000000' : '#ffffff');
    
    if (ratio === null) break;
  }
  
  return { color: newColor, ratio, amount };
}

/**
 * Analyze current color combinations from design tokens
 */
function analyzeDesignTokens() {
  // Values from design-tokens.js
  const designTokenColors = {
    'neutral-0': '#ffffff',
    'neutral-300': '#d4d4d4',
    'neutral-600': '#525252',
    'neutral-800': '#262626',
    'brand-purple-500': '#a855f7',
    'brand-orange-500': '#f97316'
  };

  // Values from global.css (synchronized with design-tokens.js)
  const globalCssColors = {
    'neutral-0': '#ffffff',
    'neutral-300': '#d4d4d4',
    'neutral-600': '#525252',
    'neutral-800': '#262626',
    'brand-purple-500': '#a855f7',
    'brand-orange-500': '#f97316'
  };

  console.log('📋 COMPARING DESIGN TOKENS vs GLOBAL CSS\n');
  console.log('==================================================\n');

  // Check color discrepancies
  Object.keys(designTokenColors).forEach(key => {
    if (designTokenColors[key] !== globalCssColors[key]) {
      console.log(`❌ DISCREPANCY: ${key}`);
      console.log(`   Design Tokens: ${designTokenColors[key]}`);
      console.log(`   Global CSS:    ${globalCssColors[key]}`);
      console.log('');
    }
  });

  console.log('🔍 WCAG CONTRAST ANALYSIS - DESIGN TOKENS VALUES\n');
  console.log('==================================================\n');

  const designTokenCombinations = [
    {
      name: 'text-neutral-600 on bg-white (design-tokens)',
      text: designTokenColors['neutral-600'],
      background: designTokenColors['neutral-0'],
      usage: 'Secondary text on white background'
    },
    {
      name: 'text-neutral-300 on bg-neutral-800 (design-tokens)',
      text: designTokenColors['neutral-300'],
      background: designTokenColors['neutral-800'],
      usage: 'Light text on dark background'
    }
  ];

  console.log('🔍 WCAG CONTRAST ANALYSIS - GLOBAL CSS VALUES\n');
  console.log('==================================================\n');

  const globalCssCombinations = [
    {
      name: 'text-neutral-600 on bg-white (global.css)',
      text: globalCssColors['neutral-600'],
      background: globalCssColors['neutral-0'],
      usage: 'Secondary text on white background'
    },
    {
      name: 'text-neutral-300 on bg-neutral-800 (global.css)',
      text: globalCssColors['neutral-300'],
      background: globalCssColors['neutral-800'],
      usage: 'Light text on dark background'
    }
  ];

  const allCombinations = [...designTokenCombinations, ...globalCssCombinations];
  
  console.log('🔍 WCAG Contrast Analysis Results\n');
  console.log('=' .repeat(50));
  
  const results = [];
  
  allCombinations.forEach(combo => {
    const ratio = getContrastRatio(combo.text, combo.background);
    const compliance = checkWCAGCompliance(ratio);
    
    console.log(`\n📊 ${combo.name}`);
    console.log(`   Usage: ${combo.usage}`);
    console.log(`   Text: ${combo.text}`);
    console.log(`   Background: ${combo.background}`);
    console.log(`   Contrast Ratio: ${ratio.toFixed(2)}:1`);
    console.log(`   WCAG Level: ${compliance.level}`);
    console.log(`   ✅ AA Normal: ${compliance.AA_normal ? 'PASS' : 'FAIL'}`);
    console.log(`   ✅ AA Large: ${compliance.AA_large ? 'PASS' : 'FAIL'}`);
    
    results.push({
      ...combo,
      ratio: ratio.toFixed(2),
      compliance,
      needsImprovement: !compliance.AA_normal
    });
    
    if (!compliance.AA_normal) {
      console.log(`   ⚠️  NEEDS IMPROVEMENT`);
      
      // Suggest improvements
      const isLightOnDark = getLuminance(hexToRgb(combo.text)) > getLuminance(hexToRgb(combo.background));
      const optimal = findOptimalColor(combo.text, 4.5, !isLightOnDark);
      
      console.log(`   💡 Suggested improvement: ${optimal.color} (${optimal.ratio.toFixed(2)}:1)`);
    }
  });
  
  console.log('\n' + '=' .repeat(50));
  
  return results;
}

// Export functions for use in other modules
export {
  hexToRgb,
  getLuminance,
  getContrastRatio,
  checkWCAGCompliance,
  darkenColor,
  lightenColor,
  findOptimalColor,
  analyzeDesignTokens
};

// If running directly in Node.js
if (typeof window === 'undefined') {
  analyzeDesignTokens();
}