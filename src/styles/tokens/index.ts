/**
 * Design Token System - Unified Source of Truth
 * All design tokens are defined here and exported for use in both
 * CSS generation and JavaScript components.
 */

// ============================================================================
// FONT TOKENS
// ============================================================================

export const fonts = {
  sans: "'Inter', -apple-system, blinkmacsystemfont, 'Segoe UI', roboto, helvetica, arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'",
  serif: "'Lora', 'Georgia', cambria, 'Times New Roman', times, serif",
  mono: "'Menlo', 'DejaVu Sans Mono', 'Liberation Mono', 'Consolas', 'Ubuntu Mono', 'Courier New', 'andale mono', 'lucida console', monospace",
};

// ============================================================================
// TYPOGRAPHY TOKENS
// ============================================================================

export const typography = {
  fontSizes: {
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
  },
  fontWeights: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800',
  },
  lineHeights: {
    tight: '1.25',
    normal: '1.5',
    relaxed: '1.625',
    loose: '2',
  },
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },
};

// ============================================================================
// SPACING TOKENS
// ============================================================================

export const spacing = {
  0: '0',
  px: '1px',
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
};

// ============================================================================
// BORDER RADIUS TOKENS
// ============================================================================

export const borderRadius = {
  none: '0',
  sm: '0.125rem',   // 2px
  base: '0.25rem',  // 4px
  md: '0.375rem',   // 6px
  lg: '0.5rem',     // 8px
  xl: '0.75rem',    // 12px
  '2xl': '1rem',    // 16px
  '3xl': '1.5rem',  // 24px
  full: '9999px',
};

// ============================================================================
// SHADOW TOKENS
// ============================================================================

export const shadows = {
  sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  '2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  inner: 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  none: '0 0 #0000',
};

// ============================================================================
// COLOR TOKENS
// ============================================================================

export const colors = {
  primary: {
    50: '#eef2ff',
    100: '#e0e7ff',
    200: '#c7d2fe',
    300: '#a5b4fc',
    400: '#818cf8',
    500: '#6366f1',
    600: '#4f46e5',
    700: '#4338ca',
    800: '#3730a3',
    900: '#312e81',
    950: '#1e1b4b'
  },
  secondary: {
    50: '#f5f3ff',
    100: '#ede9fe',
    200: '#ddd6fe',
    300: '#c4b5fd',
    400: '#a78bfa',
    500: '#8b5cf6',
    600: '#7c3aed',
    700: '#6d28d9',
    800: '#5b21b6',
    900: '#4c1d95',
    950: '#2e1065'
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
    950: '#083344'
  },
  neutral: {
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
    950: '#020617'
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

// Add dark mode semantic colors
export const semanticColors = {
  light: {
    text: { primary: '#0f172a', secondary: '#475569', muted: '#64748b' },
    background: { primary: '#ffffff', secondary: '#f8fafc' },
    headings: 'var(--color-neutral-900)',
    link: 'var(--color-primary-600)',
    linkHover: 'var(--color-primary-700)',
    inverse: 'var(--color-neutral-0)',
    disabled: 'var(--color-neutral-400)',
    surface: {
      primary: 'var(--color-neutral-0)',
      secondary: 'var(--color-neutral-50)',
      tertiary: 'var(--color-neutral-100)',
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
  },
  dark: {
    text: { primary: '#f1f5f9', secondary: '#cbd5e1', muted: '#94a3b8' },
    background: { primary: '#0f172a', secondary: '#1e293b' },
    headings: 'var(--color-neutral-50)',
    link: 'var(--color-primary-400)',
    linkHover: 'var(--color-primary-300)',
    inverse: 'var(--color-neutral-900)',
    disabled: 'var(--color-neutral-500)',
    surface: {
      primary: 'var(--color-neutral-900)',
      secondary: 'var(--color-neutral-800)',
      tertiary: 'var(--color-neutral-700)',
      muted: 'var(--color-neutral-800)',
    },
    border: {
      primary: 'var(--color-neutral-700)',
      strong: 'var(--color-neutral-600)',
      emphasis: 'var(--color-neutral-500)',
      muted: 'var(--color-neutral-800)',
    },
    interactive: {
      focusOutline: 'var(--color-primary-400)',
      onPrimary: 'var(--color-neutral-900)',
      onSuccess: 'var(--color-neutral-900)',
      onWarning: 'var(--color-neutral-50)',
      onError: 'var(--color-neutral-900)',
      onInfo: 'var(--color-neutral-900)',
    },
    shadow: {
      color: 'rgb(255 255 255 / 0.1)',
    },
  },
};

// ============================================================================
// ANIMATION TOKENS
// ============================================================================

export const animations = {
  duration: {
    fast: '150ms',
    normal: '300ms',
    slow: '500ms',
    'extra-slow': '800ms',
  },
  easing: {
    linear: 'linear',
    ease: 'ease',
    'ease-in': 'ease-in',
    'ease-out': 'ease-out',
    'ease-in-out': 'ease-in-out',
    'ease-in-back': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
    'ease-out-back': 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    'ease-in-out-back': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
};

// ============================================================================
// Z-INDEX TOKENS
// ============================================================================

export const zIndex = {
  hide: '-1',
  auto: 'auto',
  base: '0',
  docked: '10',
  dropdown: '1000',
  sticky: '1100',
  banner: '1200',
  overlay: '1300',
  modal: '1400',
  popover: '1500',
  skipLink: '1600',
  toast: '1700',
  tooltip: '1800',
};

// ============================================================================
// BREAKPOINT TOKENS
// ============================================================================

export const breakpoints = {
  xs: '475px',
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
};

// ============================================================================
// CONTAINER TOKENS
// ============================================================================

export const containers = {
  xs: '20rem',     // 320px
  sm: '24rem',     // 384px
  md: '28rem',     // 448px
  lg: '32rem',     // 512px
  xl: '36rem',     // 576px
  '2xl': '42rem',  // 672px
  '3xl': '48rem',  // 768px
  '4xl': '56rem',  // 896px
  '5xl': '64rem',  // 1024px
  '6xl': '72rem',  // 1152px
  '7xl': '80rem',  // 1280px
  full: '100%',
};

// ============================================================================
// COMBINED EXPORT FOR CSS GENERATION
// ============================================================================

export const allTokens = {
  colors,
  fonts,
  typography,
  spacing,
  borderRadius,
  shadows,
  semanticColors,
  animations,
  zIndex,
  breakpoints,
  containers,
};