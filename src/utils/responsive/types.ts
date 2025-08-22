/**
 * Responsive Utilities Types
 * Shared type definitions for responsive design utilities
 */

export interface BreakpointConfig {
  name: string;
  minWidth: number;
  maxWidth?: number;
  touchTarget: number; // Minimum touch target size in pixels
  fontSize: {
    base: number;
    scale: number;
  };
}

export interface ResponsiveState {
  breakpoint: string;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  touchDevice: boolean;
  screenReader: boolean;
  reducedMotion: boolean;
  highContrast: boolean;
}

export interface NavigationItem {
  href: string;
  text: string;
  icon?: string;
}

export interface ResponsiveImageConfig {
  src: string;
  alt: string;
  sizes?: string;
  srcset?: string;
  loading?: 'lazy' | 'eager';
  aspectRatio?: string;
}

export type ResponsiveStateListener = (_state: ResponsiveState) => void;
