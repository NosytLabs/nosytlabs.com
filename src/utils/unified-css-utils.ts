/**
 * NosytLabs Unified CSS Utilities
 * Consolidated from component-utils.ts and layout-utils.ts
 * 
 * @fileoverview Centralized CSS utility classes and helper functions
 * for consistent styling across the entire application.
 * 
 * @author NosytLabs Development Team
 * @version 2.0.0
 * @since 2025-06-13
 */

/**
 * Standard CSS class collections for consistent styling
 */
export const CSS_CLASSES = {
  // Layout & Container System
  container: {
    sm: 'max-w-2xl mx-auto px-4',
    md: 'max-w-4xl mx-auto px-4 sm:px-6',
    lg: 'max-w-6xl mx-auto px-4 sm:px-6 lg:px-8',
    xl: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
    full: 'w-full px-4 sm:px-6 lg:px-8',
    default: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'
  },

  // Section Spacing
  section: {
    sm: 'py-8 lg:py-12',
    md: 'py-12 lg:py-16',
    lg: 'py-16 lg:py-24',
    xl: 'py-20 lg:py-32',
    default: 'py-16 lg:py-24'
  },

  // Grid Systems
  grid: {
    auto: 'grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3',
    responsive: 'grid gap-8',
    cards: 'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3',
    features: 'grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3',
    testimonials: 'grid grid-cols-1 gap-8 lg:grid-cols-2',
    projects: 'grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-3'
  },

  // Typography System  
  heading: {
    h1: 'text-4xl lg:text-6xl font-bold text-gray-900 dark:text-white',
    h2: 'text-3xl lg:text-5xl font-bold text-gray-900 dark:text-white',
    h3: 'text-2xl lg:text-3xl font-bold text-gray-900 dark:text-white',
    h4: 'text-xl lg:text-2xl font-semibold text-gray-900 dark:text-white',
    h5: 'text-lg lg:text-xl font-semibold text-gray-900 dark:text-white',
    h6: 'text-base lg:text-lg font-semibold text-gray-900 dark:text-white'
  },

  // Text Utilities
  text: {
    body: 'text-base text-gray-600 dark:text-gray-300 leading-relaxed',
    lead: 'text-lg text-gray-600 dark:text-gray-300 leading-relaxed',
    muted: 'text-sm text-gray-500 dark:text-gray-400',
    small: 'text-xs text-gray-500 dark:text-gray-400',
    center: 'text-center',
    left: 'text-left',
    right: 'text-right'
  },

  // Button Base Classes (work with unified-buttons.css)
  button: {
    base: 'btn',
    primary: 'btn btn-primary',
    secondary: 'btn btn-secondary',
    outline: 'btn btn-outline',
    ghost: 'btn btn-ghost',
    modern: 'btn btn-modern',
    payment: 'btn-payment',
    sizes: {
      sm: 'btn-sm',
      md: '', // default
      lg: 'btn-lg',
      xl: 'btn-xl'
    }
  },

  // Card Components
  card: {
    base: 'bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700',
    hover: 'transition-all duration-300 hover:shadow-xl hover:-translate-y-1',
    padding: 'p-6',
    header: 'p-6 pb-0',
    content: 'p-6',
    footer: 'p-6 pt-0'
  },

  // Form Elements
  form: {
    group: 'space-y-2',
    label: 'block text-sm font-medium text-gray-700 dark:text-gray-300',
    input: 'block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-nosyt-purple focus:border-nosyt-purple dark:bg-gray-700 dark:text-white',
    textarea: 'block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-nosyt-purple focus:border-nosyt-purple dark:bg-gray-700 dark:text-white resize-vertical',
    select: 'block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-nosyt-purple focus:border-nosyt-purple dark:bg-gray-700 dark:text-white',
    error: 'text-red-600 dark:text-red-400 text-sm',
    help: 'text-gray-500 dark:text-gray-400 text-sm'
  },

  // Flexbox Utilities
  flex: {
    center: 'flex items-center justify-center',
    between: 'flex items-center justify-between',
    start: 'flex items-center justify-start',
    end: 'flex items-center justify-end',
    col: 'flex flex-col',
    colCenter: 'flex flex-col items-center justify-center',
    wrap: 'flex flex-wrap',
    nowrap: 'flex flex-nowrap'
  },

  // Spacing Utilities
  spacing: {
    section: 'space-y-16 lg:space-y-24',
    content: 'space-y-8',
    items: 'space-y-6',
    tight: 'space-y-4',
    loose: 'space-y-12'
  },

  // Animation Classes
  animation: {
    fadeIn: 'animate-fade-in',
    slideUp: 'animate-slide-up',
    scale: 'animate-scale-in',
    float: 'animate-float',
    pulse: 'animate-pulse'
  },

  // State Classes
  state: {
    loading: 'opacity-50 pointer-events-none',
    disabled: 'opacity-60 cursor-not-allowed',
    hidden: 'hidden',
    invisible: 'invisible',
    visible: 'visible'
  }
};

/**
 * Container configuration options
 */
export interface ContainerOptions {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  center?: boolean;
  relative?: boolean;
  className?: string;
}

/**
 * Get standardized container classes based on options
 */
export function getContainerClasses(options: ContainerOptions = {}): string {
  const {
    size = 'xl',
    relative = false,
    className = ''
  } = options;

  let classes = CSS_CLASSES.container[size] || CSS_CLASSES.container.default;
  
  // Add relative positioning if needed
  if (relative) {
    classes += ' relative';
  }
  
  // Add custom className
  if (className) {
    classes += ` ${className}`;
  }
  
  return classes;
}

/**
 * Get button classes with size and variant
 */
export function getButtonClasses(variant: string = 'primary', size: string = 'md'): string {
  const baseClass = CSS_CLASSES.button[variant as keyof typeof CSS_CLASSES.button] || CSS_CLASSES.button.primary;
  const sizeClass = CSS_CLASSES.button.sizes[size as keyof typeof CSS_CLASSES.button.sizes] || '';
  
  return `${baseClass} ${sizeClass}`.trim();
}

/**
 * Get heading classes with responsive sizing
 */
export function getHeadingClasses(level: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' = 'h2'): string {
  return CSS_CLASSES.heading[level];
}

/**
 * Get card classes with optional hover and padding
 */
export function getCardClasses(options: { hover?: boolean; padding?: boolean } = {}): string {
  const { hover = true, padding = true } = options;
  
  let classes = CSS_CLASSES.card.base;
  
  if (hover) {
    classes += ` ${CSS_CLASSES.card.hover}`;
  }
  
  if (padding) {
    classes += ` ${CSS_CLASSES.card.padding}`;
  }
  
  return classes;
}

/**
 * Theme management utilities
 */
export function getCurrentTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';
  
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

/**
 * Toggle theme between light and dark
 */
export function toggleTheme(): void {
  if (typeof window === 'undefined') return;
  
  const html = document.documentElement;
  const isDark = html.classList.contains('dark');
  
  if (isDark) {
    html.classList.remove('dark');
    localStorage.setItem('theme', 'light');
  } else {
    html.classList.add('dark');
    localStorage.setItem('theme', 'dark');
  }
}

/**
 * Get responsive grid classes for different content types
 */
export function getGridClasses(type: 'auto' | 'cards' | 'features' | 'testimonials' | 'projects' = 'auto'): string {
  return CSS_CLASSES.grid[type] || CSS_CLASSES.grid.auto;
}

/**
 * Generate responsive text size classes
 */
export function getResponsiveText(baseSize: string): string {
  const sizes = {
    'xs': 'text-xs sm:text-sm',
    'sm': 'text-sm sm:text-base',
    'base': 'text-base sm:text-lg',
    'lg': 'text-lg sm:text-xl',
    'xl': 'text-xl sm:text-2xl',
    '2xl': 'text-2xl sm:text-3xl',
    '3xl': 'text-3xl sm:text-4xl',
    '4xl': 'text-4xl sm:text-5xl'
  };
  
  return sizes[baseSize as keyof typeof sizes] || baseSize;
}

/**
 * Utility to combine classes with proper spacing and deduplication
 */
export function combineClasses(...classes: (string | undefined | null)[]): string {
  return classes
    .filter(Boolean)
    .join(' ')
    .split(' ')
    .filter((cls, index, arr) => cls && arr.indexOf(cls) === index)
    .join(' ');
}

// Re-export the existing cn function for backward compatibility
export { cn } from '../lib/utils';
