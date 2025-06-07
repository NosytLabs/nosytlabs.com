/**
 * Type declarations for Astro components
 * This file provides TypeScript support for .astro file imports
 */

// Astro component type declaration
declare module '*.astro' {
  const Component: any;
  export default Component;
}

// Additional Astro-specific types
declare module 'astro:content' {
  export * from 'astro/content';
}

declare module 'astro:assets' {
  export * from 'astro/assets';
}

// Global types for the project
declare global {
  // Window extensions for NosytLabs utilities
  interface Window {
    NosytUtils?: any;
    NosytLabs?: any;
  }
  
  // Environment variables
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: 'development' | 'production' | 'test';
      PUBLIC_SITE_URL?: string;
    }
  }
}

// Component prop types that are commonly used
export interface BaseComponentProps {
  class?: string;
  className?: string;
  id?: string;
}

export interface ResponsiveProps {
  sm?: any;
  md?: any;
  lg?: any;
  xl?: any;
}

// Common animation types
export type AnimationType = 'fade' | 'slide' | 'highlight' | 'none';
export type TextAlign = 'left' | 'center' | 'right';
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl';

// Windows 95 specific types
export interface Win95WindowProps extends BaseComponentProps {
  title: string;
  initialWidth?: string;
  initialHeight?: string;
  isMaximized?: boolean;
  isOpen?: boolean;
  centerScreen?: boolean;
}

// Layout component types
export interface GridProps extends BaseComponentProps {
  columns?: ResponsiveProps & { default?: number };
  gap?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
}

export interface SectionProps extends BaseComponentProps {
  size?: Size;
  background?: 'primary' | 'secondary' | 'tertiary' | 'accent' | 'white' | 'gray' | 'none';
  paddingTop?: boolean;
  paddingBottom?: boolean;
  container?: boolean;
  fullWidth?: boolean;
}

// Export empty object to make this a module
export {};
