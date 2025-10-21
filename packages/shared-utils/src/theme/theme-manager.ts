/**
 * Theme Management Utility
 *
 * Consolidated theme management system to eliminate duplication
 * between MainLayout.astro and AnimatedThemeToggler.astro implementations.
 */

export type Theme = "light" | "dark";

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
      storageKey: "theme",
      defaultTheme: "light",
      enableSystemPreference: true,
      updateMetaThemeColor: true,
      ...config,
    };

    this.mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    this.setupSystemPreferenceListener();
  }

  /**
   * Get the current theme preference
   */
  getPreferredTheme(): Theme {
    const stored = localStorage.getItem(this.config.storageKey);
    if (stored && (stored === "light" || stored === "dark")) {
      return stored as Theme;
    }

    if (this.config.enableSystemPreference) {
      return this.mediaQuery.matches ? "dark" : "light";
    }

    return this.config.defaultTheme;
  }

  /**
   * Get the current active theme
   */
  getCurrentTheme(): Theme {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    return currentTheme === "dark" || currentTheme === "light"
      ? currentTheme
      : this.getPreferredTheme();
  }

  /**
   * Set the theme
   */
  setTheme(theme: Theme): void {
    // Update DOM
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.classList.toggle("dark", theme === "dark");

    // Update localStorage
    localStorage.setItem(this.config.storageKey, theme);

    // Update theme-color meta tag
    if (this.config.updateMetaThemeColor) {
      this.updateThemeColorMeta(theme);
    }

    // Update theme toggle buttons
    this.updateThemeToggles(theme);

    // Notify listeners
    this.notifyListeners(theme);
  }

  /**
   * Toggle between light and dark themes
   */
  toggleTheme(): void {
    const currentTheme = this.getCurrentTheme();
    const newTheme: Theme = currentTheme === "dark" ? "light" : "dark";
    this.setTheme(newTheme);
  }

  /**
   * Initialize theme on page load
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
  setupThemeToggles(
    selector: string = "[data-theme-toggle], #theme-toggle",
  ): void {
    const toggles = document.querySelectorAll(selector);
    toggles.forEach((toggle) => {
      toggle.addEventListener("click", () => this.toggleTheme());
    });
  }

  /**
   * Clean up event listeners
   */
  destroy(): void {
    this.mediaQuery.removeEventListener(
      "change",
      this.handleSystemPreferenceChange,
    );
    this.listeners.clear();
  }

  private setupSystemPreferenceListener(): void {
    if (this.config.enableSystemPreference) {
      this.mediaQuery.addEventListener(
        "change",
        this.handleSystemPreferenceChange,
      );
    }
  }

  private handleSystemPreferenceChange = (e: MediaQueryListEvent): void => {
    // Only update if user hasn't set a preference
    if (!localStorage.getItem(this.config.storageKey)) {
      const newTheme: Theme = e.matches ? "dark" : "light";
      this.setTheme(newTheme);
    }
  };

  private updateThemeColorMeta(theme: Theme): void {
    const themeColorMeta = document.querySelector('meta[name="theme-color"]');
    if (themeColorMeta) {
      // Use CSS custom properties for theme colors
      const bgColor = getComputedStyle(
        document.documentElement,
      ).getPropertyValue("--background");
      const fallbackColor =
        theme === "dark"
          ? "hsl(var(--color-neutral-950))"
          : "hsl(var(--color-neutral-50))";
      themeColorMeta.setAttribute(
        "content",
        bgColor ? `hsl(${bgColor})` : fallbackColor,
      );
    }
  }

  private updateThemeToggles(theme: Theme): void {
    const toggles = document.querySelectorAll(
      "[data-theme-toggle], #theme-toggle",
    );
    toggles.forEach((toggle) => {
      const sunIcon = toggle.querySelector("[data-sun-icon], #sun-icon");
      const moonIcon = toggle.querySelector("[data-moon-icon], #moon-icon");

      if (sunIcon && moonIcon) {
        sunIcon.classList.toggle("hidden", theme === "dark");
        moonIcon.classList.toggle("hidden", theme !== "dark");
      }
    });
  }

  private notifyListeners(theme: Theme): void {
    this.listeners.forEach((callback) => callback(theme));
  }
}

// Global theme manager instance
let globalThemeManager: ThemeManager | null = null;

/**
 * Get or create the global theme manager instance
 */
export function getThemeManager(config?: ThemeConfig): ThemeManager {
  if (!globalThemeManager) {
    globalThemeManager = new ThemeManager(config);
  }
  return globalThemeManager;
}

/**
 * Initialize theme management with default configuration
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
 * Utility functions for direct theme operations
 */
export const themeUtils = {
  getTheme: () => getThemeManager().getCurrentTheme(),
  setTheme: (theme: Theme) => getThemeManager().setTheme(theme),
  toggleTheme: () => getThemeManager().toggleTheme(),
  addListener: (callback: (theme: Theme) => void) =>
    getThemeManager().addListener(callback),
  removeListener: (callback: (theme: Theme) => void) =>
    getThemeManager().removeListener(callback),
};
