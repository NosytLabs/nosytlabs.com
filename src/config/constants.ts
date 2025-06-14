/**
 * NosytLabs Shared Constants (TypeScript)
 * Type-safe version of shared constants with proper TypeScript definitions
 */

// ========== TYPE DEFINITIONS ==========
export interface CompanyInfo {
  readonly NAME: string;
  readonly FULL_NAME: string;
  readonly TAGLINE: string;
  readonly DESCRIPTION: string;
  readonly FOUNDED: string;
  readonly WEBSITE: string;
  readonly CDN_URL: string;
}

export interface ContactInfo {
  readonly EMAIL: {
    readonly MAIN: string;
    readonly BUSINESS: string;
    readonly SUPPORT: string;
  };
  readonly SOCIAL: {
    readonly GITHUB: string;
    readonly YOUTUBE: string;
    readonly KICK: string;
    readonly CREALITY: string;
  };
}

export interface ColorPalette {
  readonly PRIMARY: {
    readonly PURPLE_DARKEST: string;
    readonly PURPLE_DARK: string;
    readonly PURPLE_MAIN: string;
    readonly PURPLE_LIGHT: string;
    readonly PURPLE_LIGHTEST: string;
  };
  readonly SECONDARY: {
    readonly ORANGE_DARK: string;
    readonly ORANGE_MAIN: string;
    readonly ORANGE_LIGHT: string;
    readonly ORANGE_LIGHTEST: string;
  };
  readonly NEUTRAL: {
    readonly WHITE: string;
    readonly GRAY_100: string;
    readonly GRAY_200: string;
    readonly GRAY_300: string;
    readonly GRAY_400: string;
    readonly GRAY_500: string;
    readonly GRAY_600: string;
    readonly GRAY_700: string;
    readonly GRAY_800: string;
    readonly GRAY_900: string;
    readonly BLACK: string;
  };
}

export interface TimingConfig {
  readonly ANIMATION: {
    readonly FAST: number;
    readonly NORMAL: number;
    readonly SLOW: number;
    readonly EXTRA_SLOW: number;
  };
  readonly TIMEOUTS: {
    readonly SHORT: number;
    readonly MEDIUM: number;
    readonly LONG: number;
    readonly PAGE_LOAD: number;
    readonly SESSION: number;
  };
  readonly CACHE: {
    readonly API_SHORT: number;
    readonly DAILY: number;
    readonly MONTHLY: number;
    readonly QUARTERLY: number;
    readonly YEARLY: number;
  };
}

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

export type CacheStrategy = 'cache-first' | 'network-first' | 'stale-while-revalidate';

// ========== CONSTANTS ==========
export const COMPANY: CompanyInfo = {
  NAME: 'NosytLabs',
  FULL_NAME: 'NOSYT LLC',
  TAGLINE: 'Notable Opportunities Shape Your Tomorrow',
  DESCRIPTION: 'Innovative digital solutions that help businesses thrive in the modern landscape.',
  FOUNDED: '2025',
  WEBSITE: 'https://nosytlabs.com',
  CDN_URL: 'https://cdn.nosytlabs.com'
} as const;

export const CONTACT: ContactInfo = {
  EMAIL: {
    MAIN: 'hi@nosytlabs.com',
    BUSINESS: 'tyson@nosytlabs.com',
    SUPPORT: 'support@nosytlabs.com'
  },
  SOCIAL: {
    GITHUB: 'https://github.com/NosytLabs',
    YOUTUBE: 'https://www.youtube.com/@TycenYT',
    KICK: 'https://kick.com/Tycen',
    CREALITY: 'https://crealitycloud.com/user/9519489699'
  }
} as const;

export const COLORS: ColorPalette = {
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
} as const;

export const TIMING: TimingConfig = {
  ANIMATION: {
    FAST: 150,
    NORMAL: 300,
    SLOW: 500,
    EXTRA_SLOW: 800
  },
  TIMEOUTS: {
    SHORT: 1000,
    MEDIUM: 2000,
    LONG: 5000,
    PAGE_LOAD: 30000,
    SESSION: 60 * 60 * 1000
  },
  CACHE: {
    API_SHORT: 5 * 60 * 1000,
    DAILY: 24 * 60 * 60 * 1000,
    MONTHLY: 30 * 24 * 60 * 60 * 1000,
    QUARTERLY: 90 * 24 * 60 * 60 * 1000,
    YEARLY: 365 * 24 * 60 * 60 * 1000
  }
} as const;

export const DIMENSIONS = {
  FULL_WIDTH: '100%',
  HALF_WIDTH: '50%',
  BREAKPOINTS: {
    SM: '640px',
    MD: '768px',
    LG: '1024px',
    XL: '1280px',
    '2XL': '1536px'
  },
  IMAGE_SIZES: [320, 640, 960, 1280] as const,
  CACHE_LIMITS: {
    STATIC: 100,
    DYNAMIC: 50,
    IMAGES: 200,
    API: 50,
    FONTS: 20
  }
} as const;

export const PATHS = {
  SCRIPTS: '/scripts',
  IMAGES: '/images',
  STYLES: '/styles',
  FONTS: '/fonts',
  DIST: 'dist',
  PUBLIC: 'public',
  SRC: 'src',
  LOGO: '/images/NosytLabs.svg',
  FAVICON: '/images/NosytLabs.svg',
  APPLE_TOUCH_ICON: '/images/apple-touch-icon.png',
  OG_IMAGE: '/images/nosytlabs-og.jpg',
  CRITICAL_CSS: '/assets/optimized/critical.css',
  MAIN_CSS: '/assets/optimized/main.css',
  CORE_JS: '/assets/js/core.min.js'
} as const;

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
  ] as const
} as const;

export const CACHE_CONFIG = {
  VERSION: '4.0',
  NAMES: {
    STATIC: 'static-cache-v4.0',
    DYNAMIC: 'dynamic-cache-v4.0',
    IMAGE: 'image-cache-v4.0',
    API: 'api-cache-v4.0',
    FONT: 'font-cache-v4.0',
    SOUND: 'sound-cache-v4.0'
  },
  STRATEGIES: {
    CACHE_FIRST: 'cache-first' as CacheStrategy,
    NETWORK_FIRST: 'network-first' as CacheStrategy,
    STALE_WHILE_REVALIDATE: 'stale-while-revalidate' as CacheStrategy
  }
} as const;

export const FEATURES = {
  DARK_MODE: true,
  ANIMATIONS: true,
  LAZY_LOADING: true,
  SERVICE_WORKER: true,
  SOUND_EFFECTS: true,
  EASTER_EGGS: true,
  PERFORMANCE_MONITORING: true
} as const;

// ========== UTILITY FUNCTIONS ==========
export const ENV = {
  isDevelopment: (): boolean => process.env.NODE_ENV === 'development',
  isProduction: (): boolean => process.env.NODE_ENV === 'production',
  isTest: (): boolean => process.env.NODE_ENV === 'test'
} as const;

// ========== DEFAULT EXPORT ==========
export default {
  COMPANY,
  CONTACT,
  COLORS,
  TIMING,
  DIMENSIONS,
  PATHS,
  ANIMATIONS,
  CACHE_CONFIG,
  FEATURES,
  ENV
} as const;
