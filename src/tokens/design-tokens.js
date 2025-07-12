/**
 * Centralized Design Token System for NosytLabs
 * 
 * This file serves as the single source of truth for all design tokens,
 * consumed by both Tailwind CSS configuration and CSS custom properties.
 */

export const tokens = {
  // Brand Colors - NosytLabs Identity (Enhanced Vibrant Palette)
  brand: {
    // Electric Blue - Primary Accent
    blue: {
      50: '#e6f3ff',
      100: '#cce7ff',
      200: '#99cfff',
      300: '#66b7ff',
      400: '#339fff',
      500: '#007bff', // Electric Blue - Primary
      600: '#0056b3',
      700: '#004085',
      800: '#002b57',
      900: '#001529',
    },
    
    // Fiery Red - Secondary Accent
    red: {
      50: '#fff5f5',
      100: '#fed7d7',
      200: '#feb2b2',
      300: '#fc8181',
      400: '#f56565',
      500: '#dc3545', // Fiery Red - Secondary
      600: '#c53030',
      700: '#9b2c2c',
      800: '#742a2a',
      900: '#4a1818',
    },
    
    // Vivid Orange - Tertiary Accent
    orange: {
      50: '#fff9f0',
      100: '#fef2e1',
      200: '#fde4c3',
      300: '#fcd5a5',
      400: '#fbc687',
      500: '#fd7e14', // Vivid Orange - Tertiary
      600: '#e8670e',
      700: '#c7550c',
      800: '#a6440a',
      900: '#853308',
    },
    
    // Brat Green - Quaternary Accent
    green: {
      50: '#f7f8f3',
      100: '#eef1e7',
      200: '#dde3cf',
      300: '#ccd5b7',
      400: '#bbc79f',
      500: '#6B8E23', // Brat Green - Quaternary
      600: '#5a7a1e',
      700: '#496619',
      800: '#385214',
      900: '#273e0f',
    },
    
    // Ethereal Blues - Complementary
    ethereal: {
      light: '#ADD8E6', // Light Blue
      sky: '#87CEEB',   // Sky Blue
      50: '#f0f8ff',
      100: '#e1f1ff',
      200: '#c3e3ff',
      300: '#a5d5ff',
      400: '#87ceeb', // Sky Blue
      500: '#add8e6', // Light Blue
      600: '#8cc9dd',
      700: '#6bbad4',
      800: '#4aabcb',
      900: '#299cc2',
    },
    
    // Legacy colors maintained for compatibility
    purple: {
      50: '#faf5ff',
      100: '#f3e8ff',
      200: '#e9d5ff',
      300: '#d8b4fe',
      400: '#c084fc',
      500: '#a855f7', // Primary purple
      600: '#9333ea',
      700: '#7c3aed',
      800: '#6d28d9',
      900: '#581c87',
    }
  },

  // Semantic Colors - UI States (Updated to use vibrant palette)
  semantic: {
    // Primary uses Electric Blue for modern, tech-forward feel
    primary: {
      50: '#e6f3ff',
      100: '#cce7ff',
      200: '#99cfff',
      300: '#66b7ff',
      400: '#339fff',
      500: '#007bff', // Electric Blue - Primary
      600: '#0056b3',
      700: '#004085',
      800: '#002b57',
      900: '#001529',
    },
    
    // Secondary uses Vivid Orange for warmth and energy
    secondary: {
      50: '#fff9f0',
      100: '#fef2e1',
      200: '#fde4c3',
      300: '#fcd5a5',
      400: '#fbc687',
      500: '#fd7e14', // Vivid Orange - Secondary
      600: '#e8670e',
      700: '#c7550c',
      800: '#a6440a',
      900: '#853308',
    },
    
    // Accent uses Ethereal Blues for complementary highlights
    accent: {
      50: '#f0f8ff',
      100: '#e1f1ff',
      200: '#c3e3ff',
      300: '#a5d5ff',
      400: '#87ceeb', // Sky Blue
      500: '#add8e6', // Light Blue - Accent
      600: '#8cc9dd',
      700: '#6bbad4',
      800: '#4aabcb',
      900: '#299cc2',
    },
    
    // Success uses Brat Green for nature-inspired positive feedback
    success: {
      50: '#f7f8f3',
      100: '#eef1e7',
      200: '#dde3cf',
      300: '#ccd5b7',
      400: '#bbc79f',
      500: '#6B8E23', // Brat Green - Success
      600: '#5a7a1e',
      700: '#496619',
      800: '#385214',
      900: '#273e0f',
    },
    
    // Warning uses enhanced orange for better visibility
    warning: {
      50: '#fff9f0',
      100: '#fef2e1',
      200: '#fde4c3',
      300: '#fcd5a5',
      400: '#fbc687',
      500: '#fd7e14', // Vivid Orange for warnings
      600: '#e8670e',
      700: '#c7550c',
      800: '#a6440a',
      900: '#853308',
    },
    
    // Danger uses Fiery Red for critical alerts
    danger: {
      50: '#fff5f5',
      100: '#fed7d7',
      200: '#feb2b2',
      300: '#fc8181',
      400: '#f56565',
      500: '#dc3545', // Fiery Red - Danger
      600: '#c53030',
      700: '#9b2c2c',
      800: '#742a2a',
      900: '#4a1818',
    },
    
    // Info uses Electric Blue for informational content
    info: {
      50: '#e6f3ff',
      100: '#cce7ff',
      200: '#99cfff',
      300: '#66b7ff',
      400: '#339fff',
      500: '#007bff', // Electric Blue - Info
      600: '#0056b3',
      700: '#004085',
      800: '#002b57',
      900: '#001529',
    }
  },

  // Neutral Colors - Grayscale system
  neutral: {
    0: '#ffffff',
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
    950: '#0a0a0a',
    1000: '#000000',
  },

  // Typography Scale
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'Menlo', 'Monaco', 'monospace'],
      display: ['Inter', 'system-ui', 'sans-serif'],
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px  
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem', // 36px
      '5xl': '3rem',    // 48px
      '6xl': '3.75rem', // 60px
      '7xl': '4.5rem',  // 72px
      '8xl': '6rem',    // 96px
      '9xl': '8rem',    // 128px
    },
    fontWeight: {
      thin: '100',
      extralight: '200',
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
      black: '900',
    },
    lineHeight: {
      none: '1',
      tight: '1.25',
      snug: '1.375',
      normal: '1.5',
      relaxed: '1.625',
      loose: '2',
    }
  },

  // Spacing Scale
  spacing: {
    px: '1px',
    0: '0',
    0.5: '0.125rem',  // 2px
    1: '0.25rem',     // 4px
    1.5: '0.375rem',  // 6px
    2: '0.5rem',      // 8px
    2.5: '0.625rem',  // 10px
    3: '0.75rem',     // 12px
    3.5: '0.875rem',  // 14px
    4: '1rem',        // 16px
    5: '1.25rem',     // 20px
    6: '1.5rem',      // 24px
    7: '1.75rem',     // 28px
    8: '2rem',        // 32px
    9: '2.25rem',     // 36px
    10: '2.5rem',     // 40px
    11: '2.75rem',    // 44px
    12: '3rem',       // 48px
    14: '3.5rem',     // 56px
    16: '4rem',       // 64px
    20: '5rem',       // 80px
    24: '6rem',       // 96px
    28: '7rem',       // 112px
    32: '8rem',       // 128px
    36: '9rem',       // 144px
    40: '10rem',      // 160px
    44: '11rem',      // 176px
    48: '12rem',      // 192px
    52: '13rem',      // 208px
    56: '14rem',      // 224px
    60: '15rem',      // 240px
    64: '16rem',      // 256px
    72: '18rem',      // 288px
    80: '20rem',      // 320px
    96: '24rem',      // 384px
  },

  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    DEFAULT: '0.25rem', // 4px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    '3xl': '1.5rem',  // 24px
    full: '9999px',
  },

  // Shadow System
  boxShadow: {
    sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    DEFAULT: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
    lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
    xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
    '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
    inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
    none: 'none',
  },

  // Animation & Transitions
  animation: {
    duration: {
      DEFAULT: '150ms',
      75: '75ms',
      100: '100ms',
      150: '150ms',
      200: '200ms',
      300: '300ms',
      500: '500ms',
      700: '700ms',
      1000: '1000ms',
    },
    timingFunction: {
      DEFAULT: 'cubic-bezier(0.4, 0, 0.2, 1)',
      linear: 'linear',
      in: 'cubic-bezier(0.4, 0, 1, 1)',
      out: 'cubic-bezier(0, 0, 0.2, 1)',
      'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
    }
  },

  // Special Win95 theme colors (preserved for compatibility)
  win95: {
    gray: '#c0c0c0',
    darkGray: '#808080',
    lightGray: '#e0e0e0',
    blue: '#0000ff',
    white: '#ffffff',
    black: '#000000',
  }
};

/**
 * Helper function to generate CSS custom properties from tokens
 */
export function generateCSSProperties(tokenObj, prefix = '') {
  const properties = {};
  
  function traverse(obj, currentPrefix) {
    Object.entries(obj).forEach(([key, value]) => {
      const newPrefix = currentPrefix ? `${currentPrefix}-${key}` : key;
      
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        traverse(value, newPrefix);
      } else {
        properties[`--${newPrefix}`] = Array.isArray(value) ? value.join(', ') : value;
      }
    });
  }
  
  traverse(tokenObj, prefix);
  return properties;
}

/**
 * Helper function to convert token paths to Tailwind config format
 */
export function convertToTailwindConfig(tokenObj) {
  const config = {};
  
  function traverse(obj, target) {
    Object.entries(obj).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
        target[key] = {};
        traverse(value, target[key]);
      } else {
        target[key] = value;
      }
    });
  }
  
  traverse(tokenObj, config);
  return config;
}