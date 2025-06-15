/**
 * Advanced Accessibility Manager
 * Comprehensive accessibility features and keyboard navigation support
 */

export class AccessibilityManager {
  private liveRegion: HTMLElement | null = null;

  constructor() {
    this.init();
  }

  init(): void {
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
    this.setupAriaLiveRegions();
    this.setupMotionPreferences();
    this.setupBackToTop();
  }

  private setupKeyboardNavigation(): void {
    document.addEventListener('keydown', (e) => {
      // Escape key handling
      if (e.key === 'Escape') {
        this.closeModals();
        this.closeMobileMenu();
      }

      // Tab navigation enhancement
      if (e.key === 'Tab') {
        document.body.classList.add('keyboard-navigation');
      }

      // Arrow key navigation for menus
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        this.handleArrowNavigation(e);
      }
    });

    // Remove keyboard navigation class on mouse use
    document.addEventListener('mousedown', () => {
      document.body.classList.remove('keyboard-navigation');
    });
  }

  private setupFocusManagement(): void {
    // Focus trap for modals
    const modals = document.querySelectorAll('[role="dialog"]');
    modals.forEach(modal => {
      this.createFocusTrap(modal as HTMLElement);
    });
  }

  private setupAriaLiveRegions(): void {
    // Create live region for announcements
    this.liveRegion = document.createElement('div');
    this.liveRegion.setAttribute('aria-live', 'polite');
    this.liveRegion.setAttribute('aria-atomic', 'true');
    this.liveRegion.className = 'live-region sr-only';
    this.liveRegion.style.cssText = `
      position: absolute;
      left: -10000px;
      width: 1px;
      height: 1px;
      overflow: hidden;
    `;
    document.body.appendChild(this.liveRegion);

    // Global function for screen reader announcements
    (window as any).announceToScreenReader = (message: string) => {
      if (this.liveRegion) {
        this.liveRegion.textContent = message;
        setTimeout(() => {
          if (this.liveRegion) {
            this.liveRegion.textContent = '';
          }
        }, 1000);
      }
    };
  }

  private setupMotionPreferences(): void {
    // Respect user's motion preferences
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    const updateMotionPreferences = (matches: boolean) => {
      if (matches) {
        document.body.classList.add('respect-motion-preferences');
        document.documentElement.style.setProperty('--animation-duration', '0.01ms');
        document.documentElement.style.setProperty('--transition-duration', '0.01ms');
      } else {
        document.body.classList.remove('respect-motion-preferences');
        document.documentElement.style.removeProperty('--animation-duration');
        document.documentElement.style.removeProperty('--transition-duration');
      }
    };

    updateMotionPreferences(prefersReducedMotion.matches);
    prefersReducedMotion.addEventListener('change', (e) => {
      updateMotionPreferences(e.matches);
    });
  }

  private setupBackToTop(): void {
    const backToTopButton = document.getElementById('back-to-top');

    if (backToTopButton) {
      // Show/hide button based on scroll position
      const handleScroll = () => {
        if (window.scrollY > 300) {
          backToTopButton.classList.remove('opacity-0', 'invisible');
          backToTopButton.classList.add('opacity-100', 'visible');
        } else {
          backToTopButton.classList.remove('opacity-100', 'visible');
          backToTopButton.classList.add('opacity-0', 'invisible');
        }
      };

      // Throttle scroll events for better performance
      let ticking = false;
      window.addEventListener('scroll', () => {
        if (!ticking) {
          requestAnimationFrame(() => {
            handleScroll();
            ticking = false;
          });
          ticking = true;
        }
      });

      // Scroll to top when clicked
      backToTopButton.addEventListener('click', () => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth'
        });

        // Announce to screen readers
        if ((window as any).announceToScreenReader) {
          (window as any).announceToScreenReader('Scrolled to top of page');
        }
      });
    }
  }

  private closeModals(): void {
    const openModals = document.querySelectorAll('[role="dialog"][aria-hidden="false"]');
    openModals.forEach(modal => {
      modal.setAttribute('aria-hidden', 'true');
      (modal as HTMLElement).style.display = 'none';
    });
  }

  private closeMobileMenu(): void {
    const mobileMenu = document.querySelector('.mobile-menu') as HTMLElement;
    if (mobileMenu && mobileMenu.classList.contains('open')) {
      mobileMenu.classList.remove('open');
      mobileMenu.setAttribute('aria-hidden', 'true');
    }
  }

  private handleArrowNavigation(e: KeyboardEvent): void {
    const focusedElement = document.activeElement;
    const menuItems = Array.from(document.querySelectorAll('[role="menuitem"], .nav-link')) as HTMLElement[];
    const currentIndex = menuItems.indexOf(focusedElement as HTMLElement);

    if (currentIndex === -1) return;

    let nextIndex: number | undefined;
    if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % menuItems.length;
    } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + menuItems.length) % menuItems.length;
    }

    if (nextIndex !== undefined) {
      e.preventDefault();
      menuItems[nextIndex].focus();
    }
  }

  private createFocusTrap(element: HTMLElement): void {
    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    ) as NodeListOf<HTMLElement>;

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

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

  // Public method to announce messages
  public announce(message: string): void {
    if ((window as any).announceToScreenReader) {
      (window as any).announceToScreenReader(message);
    }
  }

  // Public method to add focus trap to new elements
  public addFocusTrap(element: HTMLElement): void {
    this.createFocusTrap(element);
  }
}

// Initialize accessibility manager when DOM is ready
let accessibilityManager: AccessibilityManager;

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    accessibilityManager = new AccessibilityManager();
  });
} else {
  accessibilityManager = new AccessibilityManager();
}

// Export for use in other modules
export default accessibilityManager;
