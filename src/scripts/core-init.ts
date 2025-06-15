/**
 * NosytLabs Core Initialization Module
 * Consolidated core functionality for better performance and maintainability
 */

interface NosytLabsConfig {
  features: {
    darkMode: boolean;
    animations: boolean;
    lazyLoading: boolean;
    serviceWorker: boolean;
  };
}

interface NosytLabsCore {
  config: NosytLabsConfig;
  init(): void;
  initCore(): void;
  initTheme(): void;
}

class NosytLabsManager implements NosytLabsCore {
  config: NosytLabsConfig = {
    features: {
      darkMode: true,
      animations: true,
      lazyLoading: true,
      serviceWorker: false
    }
  };

  init(): void {
    try {
      this.initTheme();
      this.initCore();
    } catch (error) {
      console.warn('NosytLabs init error:', error);
    }
  }

  initCore(): void {
    // Enhanced error handling with better reporting
    window.addEventListener('error', (event) => {
      console.warn('Global error:', event.error);
      
      // Report to analytics if available
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'exception', {
          description: event.error?.message || 'Unknown error',
          fatal: false
        });
      }
    });

    window.addEventListener('unhandledrejection', (event) => {
      console.warn('Unhandled promise rejection:', event.reason);
      
      // Report to analytics if available
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'exception', {
          description: event.reason?.message || 'Unhandled promise rejection',
          fatal: false
        });
      }
    });

    // Initialize performance monitoring
    this.initPerformanceMonitoring();
  }

  initTheme(): void {
    try {
      const savedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      // Apply theme
      if (savedTheme) {
        document.documentElement.classList.toggle('dark', savedTheme === 'dark');
      } else {
        document.documentElement.classList.toggle('dark', prefersDark);
      }

      // Setup theme toggles
      this.setupThemeToggles();
      
      // Listen for system theme changes
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('theme')) {
          document.documentElement.classList.toggle('dark', e.matches);
        }
      });
    } catch (error) {
      console.warn('Theme init error:', error);
    }
  }

  private setupThemeToggles(): void {
    const themeToggles = document.querySelectorAll('[data-theme-toggle], [data-toggle="dark-mode"]');
    
    themeToggles.forEach(toggle => {
      toggle.addEventListener('click', () => {
        document.documentElement.classList.toggle('dark');
        const isDark = document.documentElement.classList.contains('dark');
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
        
        // Update toggle button appearance
        this.updateToggleButtons();
        
        // Announce theme change to screen readers
        if ((window as any).announceToScreenReader) {
          (window as any).announceToScreenReader(
            `Switched to ${isDark ? 'dark' : 'light'} mode`
          );
        }
      });
    });

    // Initial update of toggle buttons
    this.updateToggleButtons();
  }

  private updateToggleButtons(): void {
    const darkModeToggles = document.querySelectorAll('[data-theme-toggle], [data-toggle="dark-mode"]');
    const isDark = document.documentElement.classList.contains('dark');

    darkModeToggles.forEach(toggle => {
      // Update icon spans
      const lightIcon = toggle.querySelector('.theme-icon-light') as HTMLElement;
      const darkIcon = toggle.querySelector('.theme-icon-dark') as HTMLElement;

      if (lightIcon && darkIcon) {
        lightIcon.style.display = isDark ? 'none' : 'block';
        darkIcon.style.display = isDark ? 'block' : 'none';
      }

      // Update single span icons
      const icon = toggle.querySelector('span');
      if (icon && !lightIcon && !darkIcon) {
        icon.textContent = isDark ? '☀️' : '🌙';
      }

      // Update aria-label
      toggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
    });
  }

  private initPerformanceMonitoring(): void {
    // Monitor Core Web Vitals
    if ('web-vital' in window) {
      // This would integrate with web-vitals library if available
      console.log('Performance monitoring initialized');
    }

    // Monitor page load performance
    window.addEventListener('load', () => {
      const perfData = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming;
      if (perfData) {
        const loadTime = perfData.loadEventEnd - perfData.loadEventStart;
        console.log(`Page load time: ${loadTime}ms`);
      }
    });
  }
}

// Initialize and export to global scope
const nosytLabs = new NosytLabsManager();

// Initialize when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => nosytLabs.init());
} else {
  nosytLabs.init();
}

// Export to global scope for backward compatibility
(window as any).NosytLabs = nosytLabs;

export default nosytLabs;
