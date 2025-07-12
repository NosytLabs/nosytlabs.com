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

export interface BrandMessaging {
  readonly SLOGAN: string;
  readonly HERO_HEADLINE: string;
  readonly VALUE_PROPOSITION: string;
  readonly CTA_PRIMARY: string;
  readonly CTA_SECONDARY: string;
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

// Brand Messaging Constants
export const BRAND_MESSAGING = {
  SLOGAN: 'Code Beyond Limits',
  HERO_HEADLINE: 'Transform Your Vision Into Digital Reality',
  VALUE_PROPOSITION: 'Professional web development and AI solutions that drive real business growth. From concept to deployment, we build scalable, modern applications that exceed expectations.',
  CTA_PRIMARY: 'Start Your Project',
  CTA_SECONDARY: 'Explore Solutions'
} as const;

export const SITE = {
  title: 'NosytLabs',
  description: 'Notable Opportunities Shape Your Tomorrow',
  defaultLang: 'en',
  siteUrl: 'https://nosytlabs.com'
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
    PURPLE_DARKEST: '#001529',
    PURPLE_DARK: '#004085',
    PURPLE_MAIN: '#007bff',
    PURPLE_LIGHT: '#339fff',
    PURPLE_LIGHTEST: '#66b7ff'
  },
  SECONDARY: {
    ORANGE_DARK: '#e8670e',
    ORANGE_MAIN: '#fd7e14',
    ORANGE_LIGHT: '#fbc687',
    ORANGE_LIGHTEST: '#fde4c3'
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
  LOGO: '/images/logo.svg',
  FAVICON: '/images/favicon.svg',
  APPLE_TOUCH_ICON: '/images/apple-touch-icon.png',
  OG_IMAGE: '/images/nosytlabs-og.jpg',
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
  BRAND_MESSAGING,
  CONTACT,
  SITE,
  COLORS,
  TIMING,
  DIMENSIONS,
  PATHS,
  ANIMATIONS,
  CACHE_CONFIG,
  FEATURES,
  ENV
} as const;
