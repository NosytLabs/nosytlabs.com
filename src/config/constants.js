/**
 * NosytLabs Shared Constants
 * Single source of truth for all repeated values, magic numbers, and configuration constants
 * This file consolidates values that appear multiple times across the codebase
 */

// ========== COMPANY & BRANDING ==========
export const COMPANY = {
  NAME: 'NosytLabs',
  FULL_NAME: 'NOSYT LLC',
  TAGLINE: 'Notable Opportunities Shape Your Tomorrow',
  DESCRIPTION: 'Innovative digital solutions that help businesses thrive in the modern landscape.',
  FOUNDED: '2025',
  WEBSITE: 'https://nosytlabs.com',
  CDN_URL: 'https://cdn.nosytlabs.com'
};

// ========== CONTACT INFORMATION ==========
export const CONTACT = {
  EMAIL: {
    MAIN: 'contact@nosytlabs.com',
    BUSINESS: 'tyson@nosytlabs.com',
    SUPPORT: 'support@nosytlabs.com'
  },
  SOCIAL: {
    GITHUB: 'https://github.com/NosytLabs',
    YOUTUBE: 'https://www.youtube.com/@TycenYT',
    KICK: 'https://kick.com/Tycen',
    CREALITY: 'https://crealitycloud.com/user/9519489699'
  }
};

// ========== BRAND COLORS ==========
export const COLORS = {
  PRIMARY: {
    PURPLE_DARKEST: '#2D0A4F',
    PURPLE_DARK: '#3B0764',
    PURPLE_MAIN: '#4C1D95',
    PURPLE_LIGHT: '#7C3AED',
    PURPLE_LIGHTEST: '#A78BFA'
  },
  SECONDARY: {
    ORANGE_DARK: '#E05A00',
    ORANGE_MAIN: '#FF6B00',
    ORANGE_LIGHT: '#FF8C3F',
    ORANGE_LIGHTEST: '#FFB366'
  },
  NEUTRAL: {
    WHITE: '#FFFFFF',
    GRAY_100: '#F3F4F6',
    GRAY_200: '#E5E7EB',
    GRAY_300: '#D1D5DB',
    GRAY_400: '#9CA3AF',
    GRAY_500: '#6B7280',
    GRAY_600: '#4B5563',
    GRAY_700: '#374151',
    GRAY_800: '#1F2937',
    GRAY_900: '#111827',
    BLACK: '#000000'
  }
};

// ========== TIMEOUTS & DURATIONS ==========
export const TIMING = {
  // Animation durations (in milliseconds)
  ANIMATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
    EXTRA_SLOW: 800
  },
  
  // Timeout values (in milliseconds)
  TIMEOUTS: {
    SHORT: 1000,
    MEDIUM: 2000,
    LONG: 5000,
    PAGE_LOAD: 30000,
    SESSION: 60 * 60 * 1000 // 1 hour
  },
  
  // Cache durations (in milliseconds)
  CACHE: {
    API_SHORT: 5 * 60 * 1000,        // 5 minutes
    DAILY: 24 * 60 * 60 * 1000,      // 1 day
    MONTHLY: 30 * 24 * 60 * 60 * 1000, // 30 days
    QUARTERLY: 90 * 24 * 60 * 60 * 1000, // 90 days
    YEARLY: 365 * 24 * 60 * 60 * 1000  // 1 year
  }
};

// ========== DIMENSIONS & BREAKPOINTS ==========
export const DIMENSIONS = {
  // Common dimensions
  FULL_WIDTH: '100%',
  HALF_WIDTH: '50%',
  
  // Breakpoints (matching Tailwind defaults)
  BREAKPOINTS: {
    SM: '640px',
    MD: '768px',
    LG: '1024px',
    XL: '1280px',
    '2XL': '1536px'
  },
  
  // Image sizes for optimization
  IMAGE_SIZES: [320, 640, 960, 1280],
  
  // Cache limits
  CACHE_LIMITS: {
    STATIC: 100,
    DYNAMIC: 50,
    IMAGES: 200,
    API: 50,
    FONTS: 20
  }
};

// ========== DEVELOPMENT CONFIGURATION ==========
export const DEV_CONFIG = {
  // Local development
  LOCAL_URL: 'http://localhost:3000',
  DEV_PORT: 3000,
  
  // Build configuration
  BUILD: {
    MAX_PAGES: 100,
    PAGE_TIMEOUT: 30000,
    CHECK_INTERVAL: 100,
    MAX_WAIT_TIME: 5000
  },
  
  // Performance limits
  PERFORMANCE: {
    MAX_BUNDLE_SIZE: 250000, // 250KB
    MAX_IMAGE_SIZE: 1000000, // 1MB
    LIGHTHOUSE_THRESHOLD: 90
  }
};

// ========== FILE PATHS ==========
export const PATHS = {
  // Asset paths
  SCRIPTS: '/scripts',
  IMAGES: '/images',
  STYLES: '/styles',
  FONTS: '/fonts',
  
  // Build paths
  DIST: 'dist',
  PUBLIC: 'public',
  SRC: 'src',
  
  // Specific files
  LOGO: '/images/nosytlabs-logo-2025.svg',
  FAVICON: '/images/favicon.svg',
  APPLE_TOUCH_ICON: '/images/apple-touch-icon.png',
  OG_IMAGE: '/images/nosytlabs-og.jpg',
  
  // Critical assets
  CRITICAL_CSS: '/assets/optimized/critical.css',
  MAIN_CSS: '/assets/optimized/main.css',
  CORE_JS: '/assets/js/core.min.js'
};

// ========== CACHE CONFIGURATION ==========
export const CACHE_CONFIG = {
  VERSION: '4.0',
  
  // Cache names
  NAMES: {
    STATIC: 'static-cache-v4.0',
    DYNAMIC: 'dynamic-cache-v4.0',
    IMAGE: 'image-cache-v4.0',
    API: 'api-cache-v4.0',
    FONT: 'font-cache-v4.0',
    SOUND: 'sound-cache-v4.0'
  },
  
  // Cache strategies
  STRATEGIES: {
    CACHE_FIRST: 'cache-first',
    NETWORK_FIRST: 'network-first',
    STALE_WHILE_REVALIDATE: 'stale-while-revalidate'
  }
};

// ========== FEATURE FLAGS ==========
export const FEATURES = {
  DARK_MODE: true,
  ANIMATIONS: true,
  LAZY_LOADING: true,
  SERVICE_WORKER: true,
  SOUND_EFFECTS: true,
  EASTER_EGGS: true,
  PERFORMANCE_MONITORING: true
};

// ========== GAME CONFIGURATION ==========
export const GAMES = {
  DUCK_HUNT: {
    SCORE_PENALTY: 5,
    DEFAULT_SPEED: 1500,
    CLICK_RESET_TIME: 2000,
    SECRET_CLICKS: 5
  },
  
  MINESWEEPER: {
    BEGINNER: { rows: 9, cols: 9, mines: 10 },
    INTERMEDIATE: { rows: 16, cols: 16, mines: 40 },
    EXPERT: { rows: 16, cols: 30, mines: 99 }
  }
};

// ========== ANIMATION DEFAULTS ==========
export const ANIMATIONS = {
  DEFAULT_DURATION: 0.8,
  DEFAULT_DELAY: 0,
  DEFAULT_THRESHOLD: 0.1,
  STAGGER_DELAY: 0.1,
  
  TYPES: [
    'fade-in',
    'slide-up',
    'slide-down', 
    'slide-left',
    'slide-right',
    'zoom-in',
    'zoom-out',
    'flip',
    'rotate',
    'bounce'
  ]
};

// ========== REGEX PATTERNS ==========
export const PATTERNS = {
  // File extensions to exclude from link checking
  EXCLUDE_EXTENSIONS: /\.(jpg|jpeg|png|gif|svg|webp|ico|pdf|zip|rar|exe|dmg|apk)$/i,
  
  // URL patterns
  MAILTO: /^mailto:/,
  TEL: /^tel:/,
  JAVASCRIPT: /^javascript:/,
  HASH: /^#/,
  API: /\/api\//,
  
  // Code patterns for duplicate detection
  FUNCTION: /function\s+(\w+)/g,
  CONST: /const\s+(\w+)\s*=/g,
  CLASS: /class\s+(\w+)/g
};

// ========== ERROR MESSAGES ==========
export const MESSAGES = {
  ERRORS: {
    SESSION_EXPIRED: 'Session expired',
    OPTIMIZATION_FAILED: 'Optimization failed',
    FILE_NOT_FOUND: 'File not found',
    NETWORK_ERROR: 'Network error occurred'
  },
  
  SUCCESS: {
    OPTIMIZATION_COMPLETE: 'Optimization completed successfully',
    FILE_SAVED: 'File saved successfully',
    CACHE_CLEARED: 'Cache cleared successfully'
  },
  
  GAME: {
    DUCK_ESCAPED: 'Duck escaped! -5 points',
    GAME_OVER: 'Game Over!',
    HIGH_SCORE: 'New High Score!'
  }
};

// ========== ENVIRONMENT DETECTION ==========
export const ENV = {
  isDevelopment: () => process.env.NODE_ENV === 'development',
  isProduction: () => process.env.NODE_ENV === 'production',
  isTest: () => process.env.NODE_ENV === 'test'
};

export default {
  COMPANY,
  CONTACT,
  COLORS,
  TIMING,
  DIMENSIONS,
  DEV_CONFIG,
  PATHS,
  CACHE_CONFIG,
  FEATURES,
  GAMES,
  ANIMATIONS,
  PATTERNS,
  MESSAGES,
  ENV
};
