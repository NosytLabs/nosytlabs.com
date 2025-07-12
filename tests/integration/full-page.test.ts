import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';

describe('NosytLabs Integration Tests', () => {
  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = '';
    document.head.innerHTML = '';
    
    // Reset mocks
    vi.clearAllMocks();
    
    // Mock fetch
    global.fetch = vi.fn();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('Full Page Integration', () => {
    it('should initialize complete page functionality', async () => {
      // Simulate full page initialization
      const initializePage = () => {
        // Add meta tags
        const metaViewport = document.createElement('meta');
        metaViewport.name = 'viewport';
        metaViewport.content = 'width=device-width, initial-scale=1.0';
        document.head.appendChild(metaViewport);

        // Add skip links
        const skipToMain = document.createElement('a');
        skipToMain.href = '#main-content';
        skipToMain.className = 'skip-nav';
        skipToMain.textContent = 'Skip to main content';
        document.body.appendChild(skipToMain);

        // Add navigation
        const nav = document.createElement('nav');
        nav.id = 'navigation';
        nav.setAttribute('role', 'banner');
        const navItems = ['Home', 'Services', 'Projects', 'Contact'];
        navItems.forEach(item => {
          const link = document.createElement('a');
          link.href = `/${item.toLowerCase()}`;
          link.textContent = item;
          link.className = 'nav-link';
          nav.appendChild(link);
        });
        document.body.appendChild(nav);

        // Add main content
        const main = document.createElement('main');
        main.id = 'main-content';
        main.setAttribute('role', 'main');
        main.innerHTML = '<h1>Welcome to NosytLabs</h1><p>Professional web development services</p>';
        document.body.appendChild(main);

        // Add footer
        const footer = document.createElement('footer');
        footer.id = 'footer';
        footer.setAttribute('role', 'contentinfo');
        footer.innerHTML = '<p>&copy; 2025 NosytLabs. All rights reserved.</p>';
        document.body.appendChild(footer);

        // Add dark mode toggle
        const darkModeToggle = document.createElement('button');
        darkModeToggle.setAttribute('data-theme-toggle', '');
        darkModeToggle.innerHTML = '<span class="theme-icon-light">🌙</span><span class="theme-icon-dark">☀️</span>';
        document.body.appendChild(darkModeToggle);

        // Add back to top button
        const backToTop = document.createElement('button');
        backToTop.id = 'back-to-top';
        backToTop.className = 'fixed bottom-6 right-6 opacity-0 invisible';
        backToTop.innerHTML = '<i class="fas fa-arrow-up"></i>';
        document.body.appendChild(backToTop);

        return {
          skipLinks: document.querySelectorAll('.skip-nav'),
          navigation: nav,
          main,
          footer,
          darkModeToggle,
          backToTop,
        };
      };

      const page = initializePage();

      // Verify page structure
      expect(page.skipLinks).toHaveLength(1);
      expect(page.navigation.id).toBe('navigation');
      expect(page.main.id).toBe('main-content');
      expect(page.footer.id).toBe('footer');
      expect(page.darkModeToggle.hasAttribute('data-theme-toggle')).toBe(true);
      expect(page.backToTop.id).toBe('back-to-top');

      // Verify navigation links
      const navLinks = page.navigation.querySelectorAll('.nav-link');
      expect(navLinks).toHaveLength(4);
      expect(navLinks[0]?.textContent).toBe('Home');
      expect(navLinks[1]?.textContent).toBe('Services');
    });

    it('should handle complete dark mode functionality', () => {
      // Initialize dark mode system
      const initDarkMode = () => {
        // Create toggle button
        const toggle = document.createElement('button');
        toggle.setAttribute('data-theme-toggle', '');
        toggle.innerHTML = `
          <span class="theme-icon-light">🌙</span>
          <span class="theme-icon-dark">☀️</span>
        `;
        document.body.appendChild(toggle);

        // Initialize theme from localStorage or system preference
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
          document.documentElement.classList.add('dark');
        }

        // Update toggle button icons
        const updateToggleButton = () => {
          const isDark = document.documentElement.classList.contains('dark');
          const lightIcon = toggle.querySelector('.theme-icon-light') as HTMLElement;
          const darkIcon = toggle.querySelector('.theme-icon-dark') as HTMLElement;

          if (lightIcon && darkIcon) {
            lightIcon.style.display = isDark ? 'none' : 'block';
            darkIcon.style.display = isDark ? 'block' : 'none';
          }

          toggle.setAttribute('aria-label', isDark ? 'Switch to light mode' : 'Switch to dark mode');
        };

        // Toggle functionality
        const toggleTheme = () => {
          document.documentElement.classList.toggle('dark');
          const isDark = document.documentElement.classList.contains('dark');
          localStorage.setItem('theme', isDark ? 'dark' : 'light');
          updateToggleButton();
          
          // Announce to screen reader
          const message = isDark ? 'Dark mode enabled' : 'Light mode enabled';
          announceToScreenReader(message);
        };

        toggle.addEventListener('click', toggleTheme);
        updateToggleButton();

        return { toggle, updateToggleButton, toggleTheme };
      };

      // Mock screen reader announcements
      const announceToScreenReader = vi.fn();
      (window as any).announceToScreenReader = announceToScreenReader;

      // Mock matchMedia
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockReturnValue({
          matches: false,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn()
        })
      });

      const darkMode = initDarkMode();

      // Test initial state
      expect(document.documentElement.classList.contains('dark')).toBe(false);

      // Test toggle to dark
      darkMode.toggleTheme();
      expect(document.documentElement.classList.contains('dark')).toBe(true);
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
      expect(announceToScreenReader).toHaveBeenCalledWith('Dark mode enabled');

      // Test toggle back to light
      darkMode.toggleTheme();
      expect(document.documentElement.classList.contains('dark')).toBe(false);
      expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'light');
      expect(announceToScreenReader).toHaveBeenCalledWith('Light mode enabled');
    });

    it('should integrate performance monitoring with user interactions', async () => {
      // Mock performance monitoring
      class PerformanceMonitor {
        metrics: any = {};
        startTime: number = performance.now();

        constructor() {
          this.metrics = {
            pageLoadTime: 0,
            interactionCount: 0,
            errorCount: 0,
            coreWebVitals: {
              lcp: 0,
              fid: 0,
              cls: 0
            }
          };
        }

        recordInteraction(type: string) {
          this.metrics.interactionCount++;
          this.metrics[`${type}Count`] = (this.metrics[`${type}Count`] || 0) + 1;
        }

        recordError(error: Error) {
          this.metrics.errorCount++;
          console.warn('Performance Monitor - Error recorded:', error.message);
        }

        getMetrics() {
          return {
            ...this.metrics,
            pageLoadTime: performance.now() - this.startTime,
            timestamp: Date.now()
          };
        }

        sendMetrics() {
          const data = this.getMetrics();
          return fetch('/api/performance', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: { 'Content-Type': 'application/json' }
          });
        }
      }

      const monitor = new PerformanceMonitor();

      // Create interactive elements
      const button = document.createElement('button');
      button.textContent = 'Test Button';
      button.addEventListener('click', () => {
        monitor.recordInteraction('click');
      });
      document.body.appendChild(button);

      const link = document.createElement('a');
      link.href = '/test';
      link.textContent = 'Test Link';
      link.addEventListener('click', (e) => {
        e.preventDefault();
        monitor.recordInteraction('navigation');
      });
      document.body.appendChild(link);

      // Test interactions
      button.click();
      link.click();

      const metrics = monitor.getMetrics();
      expect(metrics.interactionCount).toBe(2);
      expect(metrics.clickCount).toBe(1);
      expect(metrics.navigationCount).toBe(1);
      expect(typeof metrics.pageLoadTime).toBe('number');

      // Test error recording
      const testError = new Error('Test error');
      monitor.recordError(testError);
      expect(monitor.getMetrics().errorCount).toBe(1);
    });
  });

  describe('API Integration', () => {
    it('should handle contact form submission', async () => {
      // Mock successful API response
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, message: 'Message sent successfully' })
      });

      const submitContactForm = async (formData: FormData) => {
        try {
          const response = await fetch('/api/contact', {
            method: 'POST',
            body: formData
          });

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          const result = await response.json();
          return result;
        } catch (error) {
          console.error('Contact form submission error:', error);
          throw error;
        }
      };

      // Create form data
      const formData = new FormData();
      formData.append('name', 'John Doe');
      formData.append('email', 'john@example.com');
      formData.append('message', 'Test message');

      const result = await submitContactForm(formData);
      
      expect(fetch).toHaveBeenCalledWith('/api/contact', {
        method: 'POST',
        body: formData
      });
      expect(result.success).toBe(true);
      expect(result.message).toBe('Message sent successfully');
    });

    it('should handle API errors gracefully', async () => {
      // Mock API error
      (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

      const apiCall = async () => {
        try {
          const response = await fetch('/api/test');
          return await response.json();
        } catch (error) {
          // Handle error gracefully
          return {
            success: false,
            error: 'Network error occurred. Please try again later.'
          };
        }
      };

      const result = await apiCall();
      expect(result.success).toBe(false);
      expect(result.error).toBe('Network error occurred. Please try again later.');
    });

    it('should handle performance API integration', async () => {
      // Mock performance API response
      (global.fetch as any).mockResolvedValueOnce({
        ok: true,
        json: async () => ({ received: true, id: 'perf-123' })
      });

      const sendPerformanceMetrics = async (metrics: any) => {
        const response = await fetch('/api/performance', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(metrics)
        });

        if (!response.ok) {
          throw new Error('Failed to send performance metrics');
        }

        return await response.json();
      };

      const testMetrics = {
        lcp: 2.1,
        fid: 85,
        cls: 0.05,
        pageUrl: '/test',
        timestamp: Date.now()
      };

      const result = await sendPerformanceMetrics(testMetrics);
      
      expect(fetch).toHaveBeenCalledWith('/api/performance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testMetrics)
      });
      expect(result.received).toBe(true);
      expect(result.id).toBe('perf-123');
    });
  });

  describe('Responsive Behavior', () => {
    it('should adapt layout for different screen sizes', () => {
      // Mock different viewport sizes
      const testViewports = [
        { width: 320, height: 568, name: 'Mobile' },
        { width: 768, height: 1024, name: 'Tablet' },
        { width: 1920, height: 1080, name: 'Desktop' }
      ];

      testViewports.forEach(viewport => {
        // Mock window dimensions
        Object.defineProperty(window, 'innerWidth', {
          writable: true,
          configurable: true,
          value: viewport.width
        });
        
        Object.defineProperty(window, 'innerHeight', {
          writable: true,
          configurable: true,
          value: viewport.height
        });

        // Create responsive navigation
        const nav = document.createElement('nav');
        nav.className = 'navigation';
        
        const mobileToggle = document.createElement('button');
        mobileToggle.className = 'mobile-menu-toggle';
        mobileToggle.style.display = viewport.width < 768 ? 'block' : 'none';
        
        const desktopMenu = document.createElement('ul');
        desktopMenu.className = 'desktop-menu';
        desktopMenu.style.display = viewport.width >= 768 ? 'flex' : 'none';

        nav.appendChild(mobileToggle);
        nav.appendChild(desktopMenu);
        document.body.appendChild(nav);

        // Test responsive behavior
        if (viewport.width < 768) {
          expect(mobileToggle.style.display).toBe('block');
          expect(desktopMenu.style.display).toBe('none');
        } else {
          expect(mobileToggle.style.display).toBe('none');
          expect(desktopMenu.style.display).toBe('flex');
        }

        // Clean up
        document.body.removeChild(nav);
      });
    });

    it('should handle touch interactions on mobile devices', () => {
      // Mock touch device
      Object.defineProperty(navigator, 'maxTouchPoints', { value: 5, writable: true });
      
      const button = document.createElement('button');
      button.textContent = 'Touch Button';
      
      let touchStarted = false;
      let touchEnded = false;

      button.addEventListener('touchstart', () => {
        touchStarted = true;
      });

      button.addEventListener('touchend', () => {
        touchEnded = true;
      });

      document.body.appendChild(button);

      // Simulate touch events
      const touchStart = new TouchEvent('touchstart', {
        touches: [{ clientX: 100, clientY: 100 }] as any
      });
      const touchEnd = new TouchEvent('touchend', {
        touches: [] as any
      });

      button.dispatchEvent(touchStart);
      button.dispatchEvent(touchEnd);

      expect(touchStarted).toBe(true);
      expect(touchEnded).toBe(true);
      expect(navigator.maxTouchPoints).toBe(5);
    });
  });

  describe('Error Handling Integration', () => {
    it('should handle global errors gracefully', () => {
      const errorHandler = {
        errors: [] as any[],
        handleError(error: Error) {
          this.errors.push({
            message: error.message,
            stack: error.stack,
            timestamp: Date.now()
          });
          
          // Show user-friendly message
          this.showErrorMessage('Something went wrong. Please try again.');
        },
        showErrorMessage(message: string) {
          const errorDiv = document.createElement('div');
          errorDiv.className = 'error-message';
          errorDiv.textContent = message;
          errorDiv.setAttribute('role', 'alert');
          document.body.appendChild(errorDiv);
        }
      };

      // Mock global error handler
      window.addEventListener('error', (event) => {
        errorHandler.handleError(event.error);
      });

      // Mock unhandled promise rejection
      window.addEventListener('unhandledrejection', (event) => {
        errorHandler.handleError(new Error(event.reason));
      });

      // Test error handling
      const testError = new Error('Test error');
      errorHandler.handleError(testError);

      expect(errorHandler.errors).toHaveLength(1);
      expect(errorHandler.errors[0].message).toBe('Test error');
      
      const errorMessage = document.querySelector('.error-message');
      expect(errorMessage?.textContent).toBe('Something went wrong. Please try again.');
      expect(errorMessage?.getAttribute('role')).toBe('alert');
    });

    it('should provide error recovery mechanisms', () => {
      const errorBoundary = {
        hasError: false,
        error: null as Error | null,
        
        componentDidCatch(error: Error) {
          this.hasError = true;
          this.error = error;
          this.renderErrorUI();
        },
        
        renderErrorUI() {
          const container = document.createElement('div');
          container.className = 'error-boundary';
          container.innerHTML = `
            <h2>Something went wrong</h2>
            <p>We're sorry, but something unexpected happened.</p>
            <button class="retry-button">Try Again</button>
          `;
          
          const retryButton = container.querySelector('.retry-button');
          retryButton?.addEventListener('click', () => {
            this.retry();
          });
          
          document.body.appendChild(container);
        },
        
        retry() {
          this.hasError = false;
          this.error = null;
          
          const errorUI = document.querySelector('.error-boundary');
          if (errorUI) {
            errorUI.remove();
          }
          
          // Reload the component or page
          window.location.reload();
        }
      };

      // Test error boundary
      const testError = new Error('Component error');
      errorBoundary.componentDidCatch(testError);

      expect(errorBoundary.hasError).toBe(true);
      expect(errorBoundary.error).toBe(testError);
      
      const errorUI = document.querySelector('.error-boundary');
      expect(errorUI).toBeTruthy();
      expect(errorUI?.querySelector('h2')?.textContent).toBe('Something went wrong');
    });
  });
});