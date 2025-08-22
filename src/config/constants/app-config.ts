/**
 * Application configuration constants
 */

import type { NavItem, CacheStrategy } from './types';

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
    'bounce',
  ] as const,
} as const;

export const CACHE_CONFIG = {
  VERSION: '4.0',
  NAMES: {
    STATIC: 'static-cache-v4.0',
    DYNAMIC: 'dynamic-cache-v4.0',
    IMAGE: 'image-cache-v4.0',
    API: 'api-cache-v4.0',
    FONT: 'font-cache-v4.0',
    SOUND: 'sound-cache-v4.0',
  },
  STRATEGIES: {
    CACHE_FIRST: 'cache-first' as CacheStrategy,
    NETWORK_FIRST: 'network-first' as CacheStrategy,
    STALE_WHILE_REVALIDATE: 'stale-while-revalidate' as CacheStrategy,
  },
} as const;

export const FEATURES = {
  DARK_MODE: true,
  ANIMATIONS: true,
  LAZY_LOADING: true,
  SERVICE_WORKER: true,
  SOUND_EFFECTS: true,
  EASTER_EGGS: true,
  PERFORMANCE_MONITORING: true,
} as const;

export const NAVIGATION: readonly NavItem[] = [
  { name: 'Home', href: '/', icon: 'home' },
  { name: 'AI Solutions', href: '/services', icon: 'bot' },
  { name: 'Projects', href: '/projects', icon: 'folder' },
  { name: 'Contact', href: '/contact', icon: 'mail' },
] as const;

// ========== UTILITY FUNCTIONS ==========
export const ENV = {
  isDevelopment: (): boolean => process.env.NODE_ENV === 'development',
  isProduction: (): boolean => process.env.NODE_ENV === 'production',
  isTest: (): boolean => process.env.NODE_ENV === 'test',
} as const;