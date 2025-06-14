/**
 * Global Type Definitions for NosytLabs - 2025
 * Comprehensive type safety for the entire application
 */

// Window extensions
declare global {
  interface Window {
    CSSBundleLoader?: any;
    OptimizedCSSLoader?: any;
    DynamicImportManager?: any;
    PerformanceMonitor?: any;
    gtag?: (...args: any[]) => void;
    dataLayer?: any[];

    // Cross-Browser Compatibility System
    FeatureDetection?: any;
    AdvancedPolyfills?: any;
    BrowserOptimizations?: any;
    CrossBrowserCompatibility?: any;
    browserCapabilities?: BrowserCapabilities;

    // Accessibility System
    AccessibilityControls?: any;
    KeyboardNavigation?: any;
    ScreenReaderSupport?: any;
    AriaLandmarksEnhancer?: any;
    FocusManagement?: any;

    // Browser-specific APIs
    webkitRequestAnimationFrame?: (callback: FrameRequestCallback) => number;
    mozRequestAnimationFrame?: (callback: FrameRequestCallback) => number;
    msRequestAnimationFrame?: (callback: FrameRequestCallback) => number;
    cssVars?: () => void;
    __v8_optimized?: boolean;
  }

  interface Navigator {
    deviceMemory?: number;
    hardwareConcurrency?: number;
    connection?: NetworkInformation;
    share?: (data: ShareData) => Promise<void>;
    locks?: LockManager;
  }
}

// Component Props Types
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
  id?: string;
  'data-testid'?: string;
}

export interface NavigationItem {
  label: string;
  href: string;
  icon?: string;
  external?: boolean;
  children?: NavigationItem[];
}

export interface ProjectData {
  id: string;
  title: string;
  description: string;
  image?: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured?: boolean;
  category: 'web' | 'mobile' | 'desktop' | 'ai' | 'other';
}

export interface ServiceData {
  id: string;
  title: string;
  description: string;
  icon: string;
  features: string[];
  pricing?: {
    basic?: number;
    premium?: number;
    enterprise?: number;
  };
}

// Performance Types
export interface PerformanceMetrics {
  fcp: number | null;
  lcp: number | null;
  fid: number | null;
  cls: number | null;
  ttfb: number | null;
}

export interface BundleMetrics {
  loadTimes: Map<string, number>;
  compressionRatios: Map<string, number>;
  dependencyGraph: Map<string, string[]>;
}

// API Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ContactFormData {
  name: string;
  email: string;
  subject: string;
  message: string;
  company?: string;
  phone?: string;
}

// Theme Types
export type ThemeMode = 'light' | 'dark' | 'auto';
export type ColorScheme = 'default' | 'win95' | 'nosytlabs' | 'custom';

export interface ThemeConfig {
  mode: ThemeMode;
  colorScheme: ColorScheme;
  customColors?: Record<string, string>;
}

// Error Types
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
  stack?: string;
}

export type ErrorSeverity = 'low' | 'medium' | 'high' | 'critical';

export interface ErrorReport {
  error: AppError;
  severity: ErrorSeverity;
  context?: Record<string, any>;
  userAgent?: string;
  url?: string;
}

// Utility Types
export type DeepPartial<T> = {
  [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type RequiredFields<T, K extends keyof T> = T & Required<Pick<T, K>>;

export type OptionalFields<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;

// Event Types
export interface CustomEvent<T = any> {
  type: string;
  data: T;
  timestamp: Date;
}

export type EventHandler<T = any> = (event: CustomEvent<T>) => void;

// Animation Types
export interface AnimationConfig {
  duration: number;
  easing: string;
  delay?: number;
  iterations?: number;
  direction?: 'normal' | 'reverse' | 'alternate' | 'alternate-reverse';
}

// Cross-Browser Compatibility Types
export interface BrowserCapabilities {
  browser: BrowserInfo;
  features: FeatureSupport;
  polyfillsLoaded: string[];
  timestamp: string;
}

export interface CompatibilityStatus {
  featureDetection: boolean;
  polyfillsLoaded: boolean;
  browserOptimized: boolean;
  accessibilityReady: boolean;
}

// Accessibility Types
export interface AccessibilitySettings {
  highContrast: boolean;
  reducedMotion: boolean;
  screenReader: boolean;
  keyboardNavigation: boolean;
  fontSize: 'small' | 'medium' | 'large' | 'extra-large';
  colorBlindness: 'none' | 'protanopia' | 'deuteranopia' | 'tritanopia';
}

export interface KeyboardNavigationOptions {
  enabled: boolean;
  skipLinks: boolean;
  focusIndicators: boolean;
  tabOrder: 'natural' | 'custom';
  shortcuts: Record<string, string>;
}

export interface ScreenReaderOptions {
  enabled: boolean;
  announcements: boolean;
  landmarks: boolean;
  headings: boolean;
  verbosity: 'minimal' | 'standard' | 'verbose';
}

export interface FocusManagementOptions {
  trapFocus: boolean;
  restoreFocus: boolean;
  skipToContent: boolean;
  focusOutline: boolean;
  customFocusOrder: string[];
}

export interface BrowserInfo {
  isChrome: boolean;
  isFirefox: boolean;
  isSafari: boolean;
  isEdge: boolean;
  isIE: boolean;
  isWebKit: boolean;
  isBlink: boolean;
  isGecko: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export interface FeatureSupport {
  javascript: Record<string, boolean>;
  css: Record<string, boolean>;
  webAPIs: Record<string, boolean>;
  performance: Record<string, boolean>;
  accessibility: Record<string, boolean>;
  media: Record<string, boolean>;
}

// Network Information API
export interface NetworkInformation extends EventTarget {
  readonly effectiveType: 'slow-2g' | '2g' | '3g' | '4g';
  readonly downlink: number;
  readonly rtt: number;
  readonly saveData: boolean;
}

// Web Share API
export interface ShareData {
  title?: string;
  text?: string;
  url?: string;
}

// Web Locks API
export interface LockManager {
  request(name: string, callback: () => Promise<void>): Promise<void>;
  request(name: string, options: LockOptions, callback: () => Promise<void>): Promise<void>;
  query(): Promise<LockManagerSnapshot>;
}

export interface LockOptions {
  mode?: 'exclusive' | 'shared';
  ifAvailable?: boolean;
  steal?: boolean;
  signal?: AbortSignal;
}

export interface LockManagerSnapshot {
  held: Lock[];
  pending: Lock[];
}

export interface Lock {
  name: string;
  mode: 'exclusive' | 'shared';
}

// Export all types
export * from './components';
export * from './api';
export * from './theme';
export * from './performance';