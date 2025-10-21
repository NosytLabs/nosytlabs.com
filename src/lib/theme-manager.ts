/**
 * Theme Manager
 * 
 * Self-contained theme management utilities to avoid import issues.
 * This provides a consistent import path for theme functionality.
 * 
 * @module theme-manager
 */

export type Theme = 'light' | 'dark';

export interface ThemeConfig {
  storageKey?: string;
  defaultTheme?: Theme;
  enableSystemPreference?: boolean;
  updateMetaThemeColor?: boolean;
}

export class ThemeManager {
  private config: Required<ThemeConfig>;
  private mediaQuery: MediaQueryList;
  private listeners: Set<(theme: Theme) => void> = new Set();

  constructor(config: ThemeConfig = {}) {
    this.config = {
      storageKey: 'theme',
      defaultTheme: 'light',
      enableSystemPreference: true,
      updateMetaThemeColor: true,
      ...config
    };

    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.setupSystemPreferenceListener();
  }

  /**
   * Get the current theme preference
   */
  getPreferredTheme(): Theme {
    const stored = localStorage.getItem(this.config.storageKey);
    if (stored && (stored === 'light' || stored === 'dark')) {
      return stored as Theme;
    }

    if (this.config.enableSystemPreference) {
      return this.mediaQuery.matches ? 'dark' : 'light';
    }

    return this.config.defaultTheme;
  }

  /**
   * Get the current active theme
   */
  getCurrentTheme(): Theme {
    const htmlTheme = document.documentElement.getAttribute('data-theme');
    return (htmlTheme === 'dark' || htmlTheme === 'light') ? htmlTheme : this.getPreferredTheme();
  }

  /**
   * Set theme
   */
  setTheme(theme: Theme): void {
    // Update DOM
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.classList.toggle('dark', theme === 'dark');

    // Update localStorage
    localStorage.setItem(this.config.storageKey, theme);

    // Update meta theme color if enabled
    if (this.config.updateMetaThemeColor) {
      this.updateThemeColorMeta(theme);
    }

    // Update theme toggles
    this.updateThemeToggles(theme);

    // Notify listeners
    this.notifyListeners(theme);
  }

  /**
   * Toggle theme
   */
  toggleTheme(): void {
    const currentTheme = this.getCurrentTheme();
    const newTheme: Theme = currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  }

  /**
   * Initialize theme
   */
  initTheme(): void {
    const preferredTheme = this.getPreferredTheme();
    this.setTheme(preferredTheme);
  }

  /**
   * Add theme change listener
   */
  addListener(callback: (theme: Theme) => void): void {
    this.listeners.add(callback);
  }

  /**
   * Remove theme change listener
   */
  removeListener(callback: (theme: Theme) => void): void {
    this.listeners.delete(callback);
  }

  /**
   * Setup theme toggle buttons
   */
  setupThemeToggles(selector: string = '[data-theme-toggle], #theme-toggle'): void {
    const toggles = document.querySelectorAll(selector);
    toggles.forEach((toggle) => {
      toggle.addEventListener('click', () => this.toggleTheme());
    });
  }

  /**
   * Cleanup
   */
  destroy(): void {
    this.mediaQuery.removeEventListener('change', this.handleSystemPreferenceChange);
    this.listeners.clear();
  }

  private setupSystemPreferenceListener(): void {
    if (this.config.enableSystemPreference) {
      this.mediaQuery.addEventListener('change', this.handleSystemPreferenceChange);
    }
  }

  private handleSystemPreferenceChange = (e: MediaQueryListEvent): void => {
    // Only update if no explicit theme is stored
    if (!localStorage.getItem(this.config.storageKey)) {
      const newTheme: Theme = e.matches ? 'dark' : 'light';
      this.setTheme(newTheme);
    }
  };

  private updateThemeColorMeta(theme: Theme): void {
    const metaThemeColor = document.querySelector('meta[name="theme-color"]');
    if (metaThemeColor) {
      // Get computed color from CSS custom properties
      const color = getComputedStyle(document.documentElement).getPropertyValue('--background').trim();
      const fallbackColor = theme === 'dark' ? '#0f172a' : '#ffffff';
      metaThemeColor.setAttribute('content', color || fallbackColor);
    }
  }

  private updateThemeToggles(theme: Theme): void {
    const toggles = document.querySelectorAll('[data-theme-toggle], #theme-toggle');
    toggles.forEach((toggle) => {
      const sunIcon = toggle.querySelector('[data-theme-toggle-light-icon]');
      const moonIcon = toggle.querySelector('[data-theme-toggle-dark-icon]');

      if (sunIcon && moonIcon) {
        sunIcon.classList.toggle('hidden', theme === 'dark');
        moonIcon.classList.toggle('hidden', theme === 'light');
      }
    });
  }

  private notifyListeners(theme: Theme): void {
    this.listeners.forEach(callback => callback(theme));
  }
}

// Global instance management
let globalThemeManager: ThemeManager | null = null;

/**
 * Get or create theme manager instance
 */
export function getThemeManager(config?: ThemeConfig): ThemeManager {
  if (!globalThemeManager) {
    globalThemeManager = new ThemeManager(config);
  }
  return globalThemeManager;
}

/**
 * Initialize theme management
 */
export function initThemeManagement(config?: ThemeConfig): ThemeManager {
  const themeManager = getThemeManager(config);
  
  // Initialize theme
  themeManager.initTheme();
  
  // Setup theme toggles
  themeManager.setupThemeToggles();
  
  return themeManager;
}

/**
 * Theme utilities
 */
export const themeUtils = {
  getTheme: () => getThemeManager().getCurrentTheme(),
  setTheme: (theme: Theme) => getThemeManager().setTheme(theme),
  toggleTheme: () => getThemeManager().toggleTheme(),
  addListener: (callback: (theme: Theme) => void) => getThemeManager().addListener(callback),
  removeListener: (callback: (theme: Theme) => void) => getThemeManager().removeListener(callback)
};

export const toggleTheme = themeUtils.toggleTheme;
