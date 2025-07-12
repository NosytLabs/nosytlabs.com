/**
 * Advanced Accessibility Manager
 * Comprehensive accessibility features and keyboard navigation support
 *
 * @fileoverview Enterprise-level accessibility management system
 * @module scripts/accessibility-manager
 * @version 2.1.0
 * @author NosytLabs Team
 * @since 2025-06-16
 *
 * @description Provides comprehensive accessibility features including
 * keyboard navigation, focus management, ARIA live regions, and motion
 * preference handling. Ensures WCAG AA compliance with enhanced focus traps.
 */

export class AccessibilityManager {
  private liveRegion: HTMLElement | null;
  private assertiveLiveRegion: HTMLElement | null;
  private focusHistory: HTMLElement[] = [];
  private focusableElementsSelector = 'button:not([disabled]), [href], input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"]), details, summary, [contenteditable="true"]';

  constructor() {
    this.liveRegion = null;
    this.assertiveLiveRegion = null;
    this.init();
  }

  init(): void {
    this.setupKeyboardNavigation();
    this.setupFocusManagement();
    this.setupAriaLiveRegions();
    this.setupMotionPreferences();
    this.setupSkipLinks();
    this.observeDynamicContent();
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
    // Focus trap for modals and other dialog elements
    const modals = document.querySelectorAll('[role="dialog"], .modal, .popup');
    modals.forEach(modal => {
      this.createFocusTrap(modal as HTMLElement);
    });

    // Handle focus restoration after dynamic content changes
    this.setupFocusRestoration();
    
    // Enhanced focus indicators
    this.setupFocusIndicators();
  }

  private setupFocusRestoration(): void {
    // Track focus before content changes
    document.addEventListener('focusin', (e) => {
      const target = e.target as HTMLElement;
      if (target && target !== document.body) {
        this.focusHistory.push(target);
        // Keep only last 10 focus elements
        if (this.focusHistory.length > 10) {
          this.focusHistory.shift();
        }
      }
    });
  }

  private setupFocusIndicators(): void {
    // Ensure focus indicators are visible and high contrast
    const style = document.createElement('style');
    style.textContent = `
      .keyboard-navigation *:focus {
        outline: 2px solid #4285f4;
        outline-offset: 2px;
      }
      
      .keyboard-navigation button:focus,
      .keyboard-navigation input:focus,
      .keyboard-navigation textarea:focus,
      .keyboard-navigation select:focus {
        outline: 2px solid #4285f4;
        outline-offset: 2px;
        box-shadow: 0 0 0 4px rgba(66, 133, 244, 0.2);
      }
      
      .keyboard-navigation a:focus {
        outline: 2px solid #4285f4;
        outline-offset: 2px;
        text-decoration: underline;
      }
    `;
    document.head.appendChild(style);
  }

  private setupSkipLinks(): void {
    // Add skip to main content link if not present
    const existingSkipLink = document.querySelector('.skip-link');
    if (!existingSkipLink) {
      const skipLink = document.createElement('a');
      skipLink.href = '#main-content';
      skipLink.className = 'skip-link';
      skipLink.textContent = 'Skip to main content';
      skipLink.style.cssText = `
        position: absolute;
        top: -40px;
        left: 6px;
        background: #000;
        color: #fff;
        padding: 8px;
        z-index: 1000;
        text-decoration: none;
        border-radius: 4px;
        transition: top 0.3s;
      `;
      
      skipLink.addEventListener('focus', () => {
        skipLink.style.top = '6px';
      });
      
      skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
      });
      
      document.body.insertBefore(skipLink, document.body.firstChild);
    }
  }

  private observeDynamicContent(): void {
    // Watch for dynamic content changes and manage focus accordingly
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          mutation.addedNodes.forEach((node) => {
            if (node.nodeType === Node.ELEMENT_NODE) {
              const element = node as HTMLElement;
              
              // If new content contains focusable elements, announce it
              const focusableElements = element.querySelectorAll(this.focusableElementsSelector);
              if (focusableElements.length > 0) {
                this.announce(`New content added with ${focusableElements.length} interactive elements`);
              }
              
              // Set up focus traps for new modal elements
              if (element.matches('[role="dialog"], .modal, .popup')) {
                this.createFocusTrap(element);
              }
            }
          });
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  private setupAriaLiveRegions(): void {
    // Create polite live region for general announcements
    this.liveRegion = document.createElement('div');
    this.liveRegion.setAttribute('aria-live', 'polite');
    this.liveRegion.setAttribute('aria-atomic', 'true');
    this.liveRegion.className = 'live-region sr-only';
    this.liveRegion.id = 'polite-live-region';
    this.liveRegion.style.cssText = `
      position: absolute;
      left: -10000px;
      width: 1px;
      height: 1px;
      overflow: hidden;
    `;
    document.body.appendChild(this.liveRegion);

    // Create assertive live region for urgent announcements
    this.assertiveLiveRegion = document.createElement('div');
    this.assertiveLiveRegion.setAttribute('aria-live', 'assertive');
    this.assertiveLiveRegion.setAttribute('aria-atomic', 'true');
    this.assertiveLiveRegion.className = 'live-region sr-only';
    this.assertiveLiveRegion.id = 'assertive-live-region';
    this.assertiveLiveRegion.style.cssText = `
      position: absolute;
      left: -10000px;
      width: 1px;
      height: 1px;
      overflow: hidden;
    `;
    document.body.appendChild(this.assertiveLiveRegion);

    // Enhanced global function for screen reader announcements
    (window as any).announceToScreenReader = (message: string, priority: 'polite' | 'assertive' = 'polite') => {
      const targetRegion = priority === 'assertive' ? this.assertiveLiveRegion : this.liveRegion;
      
      if (targetRegion && message.trim()) {
        // Clear any existing content first
        targetRegion.textContent = '';
        
        // Use a small delay to ensure the clear is processed
        setTimeout(() => {
          if (targetRegion) {
            targetRegion.textContent = message;
            
            // Clear after announcement to prevent repetition
            setTimeout(() => {
              if (targetRegion) {
                targetRegion.textContent = '';
              }
            }, priority === 'assertive' ? 2000 : 1000);
          }
        }, 100);
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

  // Back to top functionality removed per user request

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
      menuItems[nextIndex]?.focus();
    }
  }

  private createFocusTrap(element: HTMLElement): void {
    const focusableElements = element.querySelectorAll(
      this.focusableElementsSelector
    ) as NodeListOf<HTMLElement>;

    // Filter out hidden or disabled elements
    const visibleFocusableElements = Array.from(focusableElements).filter(el =>
      el.offsetWidth > 0 && el.offsetHeight > 0 &&
      !el.hidden &&
      !el.hasAttribute('disabled') &&
      window.getComputedStyle(el).visibility !== 'hidden'
    );

    if (visibleFocusableElements.length === 0) return;

    const firstElement = visibleFocusableElements[0];

    // Store the element that had focus before the trap was activated
    const previouslyFocusedElement = document.activeElement as HTMLElement;

    // Focus the first element when trap is activated
    if (firstElement) {
      firstElement.focus();
    }

    const trapListener = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        // Get current focusable elements (they might have changed)
        const currentFocusable = Array.from(element.querySelectorAll(this.focusableElementsSelector))
          .filter(el => {
            const htmlEl = el as HTMLElement;
            return htmlEl.offsetWidth > 0 && htmlEl.offsetHeight > 0 &&
              !htmlEl.hidden &&
              !htmlEl.hasAttribute('disabled') &&
              window.getComputedStyle(htmlEl).visibility !== 'hidden';
          }) as HTMLElement[];

        if (currentFocusable.length === 0) return;

        const currentFirst = currentFocusable[0];
        const currentLast = currentFocusable[currentFocusable.length - 1];

        if (e.shiftKey) {
          // Shift + Tab (backward)
          if (document.activeElement === currentFirst) {
            e.preventDefault();
            if (currentLast) {
              currentLast.focus();
            }
          }
        } else {
          // Tab (forward)
          if (document.activeElement === currentLast) {
            e.preventDefault();
            if (currentFirst) {
              currentFirst.focus();
            }
          }
        }
      }
    };

    element.addEventListener('keydown', trapListener);

    // Store cleanup function
    (element as any)._focusTrapCleanup = () => {
      element.removeEventListener('keydown', trapListener);
      if (previouslyFocusedElement && document.body.contains(previouslyFocusedElement)) {
        previouslyFocusedElement.focus();
      }
    };

    // Focus trap is now active for this element
    // (currentFocusTrap property was removed - cleanup handled by element._focusTrapCleanup)
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
export { accessibilityManager };
