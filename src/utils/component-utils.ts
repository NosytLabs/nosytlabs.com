/**
 * Component Utilities for NosytLabs
 * 
 * @fileoverview Common utility functions and patterns used across components
 * to reduce code duplication and maintain consistency.
 * 
 * @author NosytLabs Development Team
 * @version 1.0.0
 * @since 2024
 */

/**
 * Common CSS class names used across components
 */
export const CSS_CLASSES = {
  // Layout
  container: 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8',
  section: 'py-16 lg:py-24',
  grid: 'grid gap-8',
  
  // Typography
  heading: {
    h1: 'text-4xl lg:text-6xl font-bold',
    h2: 'text-3xl lg:text-5xl font-bold',
    h3: 'text-2xl lg:text-3xl font-bold',
    h4: 'text-xl lg:text-2xl font-semibold',
  },
  
  // Buttons
  button: {
    primary: 'bg-primary-500 hover:bg-primary-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-900 font-semibold py-3 px-6 rounded-lg transition-colors',
    outline: 'border-2 border-primary-500 text-primary-500 hover:bg-primary-500 hover:text-white font-semibold py-3 px-6 rounded-lg transition-all',
  },
  
  // Cards
  card: {
    base: 'bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden',
    hover: 'hover:shadow-xl transition-shadow duration-300',
    padding: 'p-6',
  },
  
  // Win95 Styles
  win95: {
    window: 'bg-gray-300 border-2 border-t-white border-l-white border-r-gray-600 border-b-gray-600',
    button: 'bg-gray-300 border-2 border-t-white border-l-white border-r-gray-600 border-b-gray-600 px-4 py-2',
    input: 'bg-white border-2 border-t-gray-600 border-l-gray-600 border-r-white border-b-white px-2 py-1',
  }
} as const;

/**
 * Theme-related utilities
 */
export const THEME_UTILS = {
  /**
   * Get current theme from localStorage or system preference
   * 
   * @returns {string} 'light' or 'dark'
   * @example
   * const currentTheme = THEME_UTILS.getCurrentTheme();
   * console.log(currentTheme); // 'dark'
   */
  getCurrentTheme(): string {
    if (typeof window === 'undefined') return 'light';
    
    const saved = localStorage.getItem('theme');
    if (saved) return saved;
    
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  },

  /**
   * Set theme and persist to localStorage
   * 
   * @param {string} theme - 'light' or 'dark'
   * @example
   * THEME_UTILS.setTheme('dark');
   */
  setTheme(theme: 'light' | 'dark'): void {
    if (typeof window === 'undefined') return;
    
    document.documentElement.classList.toggle('dark', theme === 'dark');
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  },

  /**
   * Toggle between light and dark themes
   * 
   * @example
   * THEME_UTILS.toggleTheme();
   */
  toggleTheme(): void {
    const current = this.getCurrentTheme();
    this.setTheme(current === 'light' ? 'dark' : 'light');
  }
} as const;

/**
 * Animation utilities for consistent motion design
 */
export const ANIMATION_UTILS = {
  /**
   * Common animation durations in milliseconds
   */
  DURATIONS: {
    fast: 150,
    normal: 300,
    slow: 500,
  },

  /**
   * Common easing functions
   */
  EASINGS: {
    easeOut: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
    easeIn: 'cubic-bezier(0.55, 0.055, 0.675, 0.19)',
    easeInOut: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
  },

  /**
   * Fade in animation
   * 
   * @param {HTMLElement} element - Element to animate
   * @param {number} duration - Animation duration in ms
   * @example
   * ANIMATION_UTILS.fadeIn(document.getElementById('modal'), 300);
   */
  fadeIn(element: HTMLElement, duration: number = 300): void {
    element.style.opacity = '0';
    element.style.transition = `opacity ${duration}ms ease-out`;
    
    requestAnimationFrame(() => {
      element.style.opacity = '1';
    });
  },

  /**
   * Fade out animation
   * 
   * @param {HTMLElement} element - Element to animate
   * @param {number} duration - Animation duration in ms
   * @returns {Promise<void>} Promise that resolves when animation completes
   * @example
   * await ANIMATION_UTILS.fadeOut(document.getElementById('modal'), 300);
   */
  fadeOut(element: HTMLElement, duration: number = 300): Promise<void> {
    return new Promise((resolve) => {
      element.style.transition = `opacity ${duration}ms ease-out`;
      element.style.opacity = '0';
      
      setTimeout(() => {
        resolve();
      }, duration);
    });
  },

  /**
   * Slide in from direction
   * 
   * @param {HTMLElement} element - Element to animate
   * @param {'left' | 'right' | 'top' | 'bottom'} direction - Slide direction
   * @param {number} duration - Animation duration in ms
   * @example
   * ANIMATION_UTILS.slideIn(mobileMenu, 'right', 300);
   */
  slideIn(element: HTMLElement, direction: 'left' | 'right' | 'top' | 'bottom', duration: number = 300): void {
    const transforms = {
      left: 'translateX(-100%)',
      right: 'translateX(100%)',
      top: 'translateY(-100%)',
      bottom: 'translateY(100%)',
    };

    element.style.transform = transforms[direction];
    element.style.transition = `transform ${duration}ms ease-out`;
    
    requestAnimationFrame(() => {
      element.style.transform = 'translate(0, 0)';
    });
  }
} as const;

/**
 * Accessibility utilities
 */
export const A11Y_UTILS = {
  /**
   * Set focus trap for modal dialogs
   * 
   * @param {HTMLElement} container - Container element to trap focus within
   * @returns {Function} Function to remove focus trap
   * @example
   * const removeTrap = A11Y_UTILS.trapFocus(modalElement);
   * // Later: removeTrap();
   */
  trapFocus(container: HTMLElement): () => void {
    const focusableElements = container.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;
    
    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    const handleTabKey = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;

      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement?.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement?.focus();
          e.preventDefault();
        }
      }
    };

    container.addEventListener('keydown', handleTabKey);
    firstElement?.focus();

    return () => {
      container.removeEventListener('keydown', handleTabKey);
    };
  },

  /**
   * Announce message to screen readers
   * 
   * @param {string} message - Message to announce
   * @param {'polite' | 'assertive'} priority - Announcement priority
   * @example
   * A11Y_UTILS.announce('Form submitted successfully', 'polite');
   */
  announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
    const announcer = document.createElement('div');
    announcer.setAttribute('aria-live', priority);
    announcer.setAttribute('aria-atomic', 'true');
    announcer.className = 'sr-only';
    announcer.textContent = message;
    
    document.body.appendChild(announcer);
    
    setTimeout(() => {
      document.body.removeChild(announcer);
    }, 1000);
  }
} as const;

/**
 * Performance utilities
 */
export const PERF_UTILS = {
  /**
   * Debounce function calls
   * 
   * @param {Function} func - Function to debounce
   * @param {number} wait - Wait time in milliseconds
   * @returns {Function} Debounced function
   * @example
   * const debouncedSearch = PERF_UTILS.debounce(searchFunction, 300);
   */
  debounce<T extends (...args: any[]) => any>(func: T, wait: number): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout;
    return function(this: any, ...args: Parameters<T>) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  },

  /**
   * Throttle function calls
   * 
   * @param {Function} func - Function to throttle
   * @param {number} limit - Time limit in milliseconds
   * @returns {Function} Throttled function
   * @example
   * const throttledScroll = PERF_UTILS.throttle(scrollHandler, 100);
   */
  throttle<T extends (...args: any[]) => any>(func: T, limit: number): (...args: Parameters<T>) => void {
    let inThrottle: boolean;
    return function(this: any, ...args: Parameters<T>) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  },

  /**
   * Lazy load images with intersection observer
   * 
   * @param {string} selector - CSS selector for images to lazy load
   * @example
   * PERF_UTILS.lazyLoadImages('img[data-src]');
   */
  lazyLoadImages(selector: string): void {
    if ('IntersectionObserver' in window) {
      const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const img = entry.target as HTMLImageElement;
            const src = img.dataset.src;
            if (src) {
              img.src = src;
              img.classList.remove('lazy');
              imageObserver.unobserve(img);
            }
          }
        });
      });

      document.querySelectorAll(selector).forEach((img) => {
        imageObserver.observe(img);
      });
    }
  }
} as const;

/**
 * Validation utilities
 */
export const VALIDATION_UTILS = {
  /**
   * Validate email address
   * 
   * @param {string} email - Email to validate
   * @returns {boolean} True if valid email
   * @example
   * const isValid = VALIDATION_UTILS.isValidEmail('user@example.com');
   */
  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  /**
   * Validate URL
   * 
   * @param {string} url - URL to validate
   * @returns {boolean} True if valid URL
   * @example
   * const isValid = VALIDATION_UTILS.isValidUrl('https://example.com');
   */
  isValidUrl(url: string): boolean {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Sanitize HTML string
   * 
   * @param {string} html - HTML string to sanitize
   * @returns {string} Sanitized HTML
   * @example
   * const safe = VALIDATION_UTILS.sanitizeHtml('<script>alert("xss")</script>Hello');
   */
  sanitizeHtml(html: string): string {
    const div = document.createElement('div');
    div.textContent = html;
    return div.innerHTML;
  }
} as const;
