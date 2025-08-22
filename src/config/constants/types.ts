/**
 * Shared type definitions for constants
 */

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
    readonly 50: string;
    readonly 100: string;
    readonly 200: string;
    readonly 300: string;
    readonly 400: string;
    readonly 500: string;
    readonly 600: string;
    readonly 700: string;
    readonly 800: string;
    readonly 900: string;
    readonly 950: string;
  };
  readonly SECONDARY: {
    readonly 50: string;
    readonly 100: string;
    readonly 200: string;
    readonly 300: string;
    readonly 400: string;
    readonly 500: string;
    readonly 600: string;
    readonly 700: string;
    readonly 800: string;
    readonly 900: string;
    readonly 950: string;
  };
  readonly NEUTRAL: {
    readonly WHITE: string;
    readonly 50: string;
    readonly 100: string;
    readonly 200: string;
    readonly 300: string;
    readonly 400: string;
    readonly 500: string;
    readonly 600: string;
    readonly 700: string;
    readonly 800: string;
    readonly 900: string;
    readonly 950: string;
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

export interface NavItem {
  readonly name: string;
  readonly href: string;
  readonly icon: string;
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