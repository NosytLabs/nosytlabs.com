/**
 * Design system constants - colors, timing, dimensions
 */

import type { TimingConfig } from './types';

// Import colors from the unified design token system
import { colors } from '../../styles/tokens';

// Re-export colors from the unified token system for backward compatibility
export const COLORS = colors;

export const TIMING: TimingConfig = {
  ANIMATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
    EXTRA_SLOW: 800,
  },
  TIMEOUTS: {
    SHORT: 1000,
    MEDIUM: 2000,
    LONG: 5000,
    PAGE_LOAD: 30000,
    SESSION: 60 * 60 * 1000,
  },
  CACHE: {
    API_SHORT: 5 * 60 * 1000,
    DAILY: 24 * 60 * 60 * 1000,
    MONTHLY: 30 * 24 * 60 * 60 * 1000,
    QUARTERLY: 90 * 24 * 60 * 60 * 1000,
    YEARLY: 365 * 24 * 60 * 60 * 1000,
  },
} as const;

export const DIMENSIONS = {
  FULL_WIDTH: '100%',
  HALF_WIDTH: '50%',
  BREAKPOINTS: {
    SM: '640px',
    MD: '768px',
    LG: '1024px',
    XL: '1280px',
    '2XL': '1536px',
  },
  IMAGE_SIZES: [320, 640, 960, 1280] as const,
  CACHE_LIMITS: {
    STATIC: 100,
    DYNAMIC: 50,
    IMAGES: 200,
    API: 50,
    FONTS: 20,
  },
} as const;

export const PATHS = {
  SCRIPTS: '/scripts',
  IMAGES: '/images',
  STYLES: '/styles',
  FONTS: '/fonts',
  DIST: 'dist',
  PUBLIC: 'public',
  SRC: 'src',
  LOGO: '/images/logo.svg',
  FAVICON: '/images/favicon.svg',
  APPLE_TOUCH_ICON: '/images/apple-touch-icon.png',
  OG_IMAGE: '/images/nosytlabs-og.jpg',
  CORE_JS: '/assets/js/core.min.js',
} as const;