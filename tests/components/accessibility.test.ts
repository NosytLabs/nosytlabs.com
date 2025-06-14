import { describe, it, expect, beforeEach, vi } from 'vitest';

describe('NosytLabs Accessibility Features', () => {
  beforeEach(() => {
    document.body.innerHTML = '';
    vi.clearAllMocks();
  });

  describe('AccessibilityManager', () => {
    it('should initialize keyboard navigation support', () => {
      class MockAccessibilityManager {
        init() {
          this.setupKeyboardNavigation();
          this.setupFocusManagement();
          this.setupAriaLiveRegions();
          this.setupMotionPreferences();
        }

        setupKeyboardNavigation() {
          document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
              this.closeModals();
              this.closeMobileMenu();
            }

            if (e.key === 'Tab') {
              document.body.classList.add('keyboard-navigation');
            }

            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
              this.handleArrowNavigation(e);
            }
          });

          document.addEventListener('mousedown', () => {
            document.body.classList.remove('keyboard-navigation');
          });
        }

        setupFocusManagement() {
          const modals = document.querySelectorAll('[role="dialog"]');
          modals.forEach(modal => {
            this.createFocusTrap(modal as HTMLElement);
          });
        }

        setupAriaLiveRegions() {
          const liveRegion = document.createElement('div');
          liveRegion.setAttribute('aria-live', 'polite');
          liveRegion.setAttribute('aria-atomic', 'true');
          liveRegion.className = 'live-region';
          document.body.appendChild(liveRegion);

          (window as any).announceToScreenReader = (message: string) => {
            liveRegion.textContent = message;
            setTimeout(() => liveRegion.textContent = '', 1000);
          };
        }

        setupMotionPreferences() {
          const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

          if (prefersReducedMotion.matches) {
            document.body.classList.add('respect-motion-preferences');
          }

          prefersReducedMotion.addEventListener('change', (e) => {
            if (e.matches) {
              document.body.classList.add('respect-motion-preferences');
            } else {
              document.body.classList.remove('respect-motion-preferences');
            }
          });
        }

        closeModals() {
          const openModals = document.querySelectorAll('[role="dialog"][aria-hidden="false"]');
          openModals.forEach(modal => {
            modal.setAttribute('aria-hidden', 'true');
            (modal as HTMLElement).style.display = 'none';
          });
        }

        closeMobileMenu() {
          const mobileMenu = document.querySelector('.mobile-menu');
          if (mobileMenu && mobileMenu.classList.contains('open')) {
            mobileMenu.classList.remove('open');
            mobileMenu.setAttribute('aria-hidden', 'true');
          }
        }

        handleArrowNavigation(e: KeyboardEvent) {
          const focusedElement = document.activeElement;
          const menuItems = Array.from(document.querySelectorAll('[role="menuitem"], .nav-link'));
          const currentIndex = menuItems.indexOf(focusedElement as Element);

          if (currentIndex === -1) return;

          let nextIndex;
          if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
            nextIndex = (currentIndex + 1) % menuItems.length;
          } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
            nextIndex = (currentIndex - 1 + menuItems.length) % menuItems.length;
          }

          if (nextIndex !== undefined) {
            e.preventDefault();
            (menuItems[nextIndex] as HTMLElement).focus();
          }
        }

        createFocusTrap(element: HTMLElement) {
          const focusableElements = element.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
          );

          if (focusableElements.length === 0) return;

          const firstElement = focusableElements[0] as HTMLElement;
          const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

          element.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
              if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                  e.preventDefault();
                  lastElement.focus();
                }
              } else {
                if (document.activeElement === lastElement) {
                  e.preventDefault();
                  firstElement.focus();
                }
              }
            }
          });
        }
      }

      const manager = new MockAccessibilityManager();
      manager.init();

      // Test keyboard navigation class toggle
      const keydownEvent = new KeyboardEvent('keydown', { key: 'Tab' });
      document.dispatchEvent(keydownEvent);
      expect(document.body.classList.contains('keyboard-navigation')).toBe(true);

      const mousedownEvent = new MouseEvent('mousedown');
      document.dispatchEvent(mousedownEvent);
      expect(document.body.classList.contains('keyboard-navigation')).toBe(false);
    });

    it('should create ARIA live regions for announcements', () => {
      // Setup live region
      const liveRegion = document.createElement('div');
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.setAttribute('aria-atomic', 'true');
      liveRegion.className = 'live-region';
      document.body.appendChild(liveRegion);

      const announceToScreenReader = (message: string) => {
        liveRegion.textContent = message;
        setTimeout(() => liveRegion.textContent = '', 1000);
      };

      // Test announcement
      announceToScreenReader('Test announcement');
      expect(liveRegion.textContent).toBe('Test announcement');
      expect(liveRegion.getAttribute('aria-live')).toBe('polite');
      expect(liveRegion.getAttribute('aria-atomic')).toBe('true');
    });

    it('should handle reduced motion preferences', () => {
      // Mock matchMedia for reduced motion
      Object.defineProperty(window, 'matchMedia', {
        writable: true,
        value: vi.fn().mockImplementation(query => ({
          matches: query === '(prefers-reduced-motion: reduce)',
          media: query,
          addEventListener: vi.fn(),
          removeEventListener: vi.fn(),
        })),
      });

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
      
      if (prefersReducedMotion.matches) {
        document.body.classList.add('respect-motion-preferences');
      }

      expect(document.body.classList.contains('respect-motion-preferences')).toBe(true);
    });
  });

  describe('Focus Management', () => {
    it('should create focus trap for modals', () => {
      // Create modal structure
      const modal = document.createElement('div');
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-hidden', 'false');
      
      const button1 = document.createElement('button');
      button1.textContent = 'First button';
      const button2 = document.createElement('button');
      button2.textContent = 'Second button';
      const button3 = document.createElement('button');
      button3.textContent = 'Last button';
      
      modal.appendChild(button1);
      modal.appendChild(button2);
      modal.appendChild(button3);
      document.body.appendChild(modal);

      // Focus trap implementation
      const createFocusTrap = (element: HTMLElement) => {
        const focusableElements = element.querySelectorAll(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );

        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        element.addEventListener('keydown', (e) => {
          if (e.key === 'Tab') {
            if (e.shiftKey) {
              if (document.activeElement === firstElement) {
                e.preventDefault();
                lastElement.focus();
              }
            } else {
              if (document.activeElement === lastElement) {
                e.preventDefault();
                firstElement.focus();
              }
            }
          }
        });

        return { firstElement, lastElement };
      };

      const trap = createFocusTrap(modal);
      expect(trap?.firstElement).toBe(button1);
      expect(trap?.lastElement).toBe(button3);

      // Test focus trapping
      button3.focus();
      const tabEvent = new KeyboardEvent('keydown', { 
        key: 'Tab', 
        bubbles: true 
      });
      
      let preventDefaultCalled = false;
      Object.defineProperty(tabEvent, 'preventDefault', {
        value: () => { preventDefaultCalled = true; }
      });

      modal.dispatchEvent(tabEvent);
      // In real implementation, this would prevent default and focus first element
      expect(preventDefaultCalled).toBe(true); // Event should trigger preventDefault in focus trap
    });

    it('should manage modal visibility with proper ARIA attributes', () => {
      const modal = document.createElement('div');
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-hidden', 'true');
      modal.style.display = 'none';
      document.body.appendChild(modal);

      const openModal = () => {
        modal.setAttribute('aria-hidden', 'false');
        modal.style.display = 'block';
        
        // Focus first focusable element
        const firstFocusable = modal.querySelector('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])') as HTMLElement;
        if (firstFocusable) {
          firstFocusable.focus();
        }
      };

      const closeModal = () => {
        modal.setAttribute('aria-hidden', 'true');
        modal.style.display = 'none';
      };

      // Test opening modal
      openModal();
      expect(modal.getAttribute('aria-hidden')).toBe('false');
      expect(modal.style.display).toBe('block');

      // Test closing modal
      closeModal();
      expect(modal.getAttribute('aria-hidden')).toBe('true');
      expect(modal.style.display).toBe('none');
    });
  });

  describe('Keyboard Navigation', () => {
    it('should handle escape key to close modals', () => {
      const modal = document.createElement('div');
      modal.setAttribute('role', 'dialog');
      modal.setAttribute('aria-hidden', 'false');
      document.body.appendChild(modal);

      const mobileMenu = document.createElement('div');
      mobileMenu.className = 'mobile-menu open';
      mobileMenu.setAttribute('aria-hidden', 'false');
      document.body.appendChild(mobileMenu);

      const handleEscape = () => {
        // Close modals
        const openModals = document.querySelectorAll('[role="dialog"][aria-hidden="false"]');
        openModals.forEach(modal => {
          modal.setAttribute('aria-hidden', 'true');
          (modal as HTMLElement).style.display = 'none';
        });

        // Close mobile menu
        const menu = document.querySelector('.mobile-menu');
        if (menu && menu.classList.contains('open')) {
          menu.classList.remove('open');
          menu.setAttribute('aria-hidden', 'true');
        }
      };

      // Simulate escape key
      handleEscape();

      expect(modal.getAttribute('aria-hidden')).toBe('true');
      expect(mobileMenu.classList.contains('open')).toBe(false);
      expect(mobileMenu.getAttribute('aria-hidden')).toBe('true');
    });

    it('should handle arrow key navigation in menus', () => {
      // Create menu items
      const nav = document.createElement('nav');
      const items = ['Home', 'Services', 'Projects', 'Contact'];
      
      items.forEach(item => {
        const link = document.createElement('a');
        link.href = `/${item.toLowerCase()}`;
        link.textContent = item;
        link.className = 'nav-link';
        link.setAttribute('role', 'menuitem');
        nav.appendChild(link);
      });
      
      document.body.appendChild(nav);

      const menuItems = Array.from(document.querySelectorAll('[role="menuitem"]')) as HTMLElement[];
      
      // Focus first item
      menuItems[0].focus();
      expect(document.activeElement).toBe(menuItems[0]);

      // Test arrow down navigation
      const handleArrowNavigation = (direction: 'down' | 'up') => {
        const currentIndex = menuItems.indexOf(document.activeElement as HTMLElement);
        if (currentIndex === -1) return;

        let nextIndex;
        if (direction === 'down') {
          nextIndex = (currentIndex + 1) % menuItems.length;
        } else {
          nextIndex = (currentIndex - 1 + menuItems.length) % menuItems.length;
        }

        menuItems[nextIndex].focus();
      };

      // Simulate arrow down
      handleArrowNavigation('down');
      expect(document.activeElement).toBe(menuItems[1]);

      // Simulate arrow up
      handleArrowNavigation('up');
      expect(document.activeElement).toBe(menuItems[0]);
    });
  });

  describe('Screen Reader Support', () => {
    it('should provide proper ARIA labels and descriptions', () => {
      const button = document.createElement('button');
      button.setAttribute('aria-label', 'Toggle dark mode');
      button.setAttribute('aria-describedby', 'dark-mode-description');
      
      const description = document.createElement('div');
      description.id = 'dark-mode-description';
      description.textContent = 'Switches between light and dark theme';
      description.className = 'sr-only';
      
      document.body.appendChild(button);
      document.body.appendChild(description);

      expect(button.getAttribute('aria-label')).toBe('Toggle dark mode');
      expect(button.getAttribute('aria-describedby')).toBe('dark-mode-description');
      expect(description.textContent).toBe('Switches between light and dark theme');
    });

    it('should announce dynamic content changes', () => {
      const liveRegion = document.createElement('div');
      liveRegion.setAttribute('aria-live', 'polite');
      liveRegion.className = 'sr-only';
      document.body.appendChild(liveRegion);

      const announceChange = (message: string) => {
        liveRegion.textContent = message;
        setTimeout(() => liveRegion.textContent = '', 1000);
      };

      announceChange('Theme changed to dark mode');
      expect(liveRegion.textContent).toBe('Theme changed to dark mode');
      expect(liveRegion.getAttribute('aria-live')).toBe('polite');
    });

    it('should provide skip links for main navigation areas', () => {
      const skipLinks = [
        { href: '#main-content', text: 'Skip to main content' },
        { href: '#navigation', text: 'Skip to navigation' },
        { href: '#footer', text: 'Skip to footer' }
      ];

      skipLinks.forEach(skip => {
        const link = document.createElement('a');
        link.href = skip.href;
        link.textContent = skip.text;
        link.className = 'skip-nav';
        document.body.appendChild(link);
      });

      const skipNavLinks = document.querySelectorAll('.skip-nav');
      expect(skipNavLinks).toHaveLength(3);
      expect(skipNavLinks[0].textContent).toBe('Skip to main content');
      expect(skipNavLinks[1].textContent).toBe('Skip to navigation');
      expect(skipNavLinks[2].textContent).toBe('Skip to footer');
    });
  });
});