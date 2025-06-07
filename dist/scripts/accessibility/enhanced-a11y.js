/**
 * Enhanced Accessibility Features for NosytLabs
 * Provides comprehensive accessibility improvements and WCAG compliance
 */

class AccessibilityEnhancer {
  constructor() {
    this.focusableElements = [
      'a[href]',
      'button:not([disabled])',
      'input:not([disabled])',
      'select:not([disabled])',
      'textarea:not([disabled])',
      '[tabindex]:not([tabindex="-1"])',
      '[contenteditable="true"]'
    ].join(', ');

    this.init();
  }

  /**
   * Initialize accessibility enhancements
   */
  init() {
    this.enhanceKeyboardNavigation();
    this.improveScreenReaderSupport();
    this.addFocusManagement();
    this.enhanceColorContrast();
    this.addMotionPreferences();
    this.setupAccessibilityShortcuts();
    this.monitorAccessibility();

    console.log('♿ Enhanced accessibility features initialized');
  }

  /**
   * Enhance keyboard navigation
   */
  enhanceKeyboardNavigation() {
    // Add visible focus indicators
    const style = document.createElement('style');
    style.textContent = `
      /* Enhanced focus indicators */
      *:focus {
        outline: 2px solid #FF6B00 !important;
        outline-offset: 2px !important;
        box-shadow: 0 0 0 4px rgba(255, 107, 0, 0.2) !important;
      }

      /* Skip link styling */
      .skip-link {
        position: absolute;
        top: -40px;
        left: 6px;
        background: #FF6B00;
        color: white;
        padding: 8px 16px;
        text-decoration: none;
        border-radius: 4px;
        z-index: 9999;
        transition: top 0.3s ease;
      }

      .skip-link:focus {
        top: 6px;
      }

      /* High contrast mode support */
      @media (prefers-contrast: high) {
        * {
          border-color: currentColor !important;
        }
        
        .btn {
          border: 2px solid currentColor !important;
        }
      }

      /* Reduced motion support */
      @media (prefers-reduced-motion: reduce) {
        *,
        *::before,
        *::after {
          animation-duration: 0.01ms !important;
          animation-iteration-count: 1 !important;
          transition-duration: 0.01ms !important;
          scroll-behavior: auto !important;
        }
      }
    `;
    document.head.appendChild(style);

    // Handle escape key for modals and overlays
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        this.handleEscapeKey();
      }
    });

    // Trap focus in modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Tab') {
        this.handleTabKey(e);
      }
    });
  }

  /**
   * Improve screen reader support
   */
  improveScreenReaderSupport() {
    // Add live regions for dynamic content
    this.createLiveRegions();

    // Enhance form labels
    this.enhanceFormLabels();

    // Add descriptive text for complex elements
    this.addDescriptiveText();

    // Announce page changes
    this.announcePageChanges();
  }

  /**
   * Create ARIA live regions
   */
  createLiveRegions() {
    // Status messages
    if (!document.getElementById('status-live-region')) {
      const statusRegion = document.createElement('div');
      statusRegion.id = 'status-live-region';
      statusRegion.setAttribute('aria-live', 'polite');
      statusRegion.setAttribute('aria-atomic', 'true');
      statusRegion.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
      document.body.appendChild(statusRegion);
    }

    // Alert messages
    if (!document.getElementById('alert-live-region')) {
      const alertRegion = document.createElement('div');
      alertRegion.id = 'alert-live-region';
      alertRegion.setAttribute('aria-live', 'assertive');
      alertRegion.setAttribute('aria-atomic', 'true');
      alertRegion.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
      document.body.appendChild(alertRegion);
    }
  }

  /**
   * Enhance form labels and descriptions
   */
  enhanceFormLabels() {
    // Ensure all form inputs have labels
    document.querySelectorAll('input, select, textarea').forEach(input => {
      if (!input.getAttribute('aria-label') && !input.getAttribute('aria-labelledby')) {
        const label = document.querySelector(`label[for="${input.id}"]`);
        if (!label && input.placeholder) {
          input.setAttribute('aria-label', input.placeholder);
        }
      }

      // Add required field indicators
      if (input.required && !input.getAttribute('aria-required')) {
        input.setAttribute('aria-required', 'true');
      }

      // Add invalid state for form validation
      if (input.validity && !input.validity.valid) {
        input.setAttribute('aria-invalid', 'true');
      }
    });
  }

  /**
   * Add descriptive text for complex elements
   */
  addDescriptiveText() {
    // Add descriptions for buttons without text
    document.querySelectorAll('button').forEach(button => {
      if (!button.textContent.trim() && !button.getAttribute('aria-label')) {
        const icon = button.querySelector('i, svg');
        if (icon) {
          const className = icon.className || '';
          if (className.includes('menu')) {
            button.setAttribute('aria-label', 'Toggle menu');
          } else if (className.includes('close')) {
            button.setAttribute('aria-label', 'Close');
          } else if (className.includes('search')) {
            button.setAttribute('aria-label', 'Search');
          } else {
            button.setAttribute('aria-label', 'Button');
          }
        }
      }
    });

    // Add alt text for decorative images
    document.querySelectorAll('img').forEach(img => {
      if (!img.alt && img.src.includes('decoration')) {
        img.alt = '';
        img.setAttribute('role', 'presentation');
      }
    });
  }

  /**
   * Announce page changes to screen readers
   */
  announcePageChanges() {
    // Announce route changes in SPAs
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
          const newContent = Array.from(mutation.addedNodes).find(node => 
            node.nodeType === Node.ELEMENT_NODE && 
            (node.tagName === 'MAIN' || node.querySelector('main'))
          );
          
          if (newContent) {
            this.announceToScreenReader('Page content updated', 'status');
          }
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  /**
   * Add focus management for dynamic content
   */
  addFocusManagement() {
    // Focus management for modals
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-modal-trigger]');
      if (trigger) {
        const modalId = trigger.getAttribute('data-modal-trigger');
        const modal = document.getElementById(modalId);
        if (modal) {
          setTimeout(() => {
            const firstFocusable = modal.querySelector(this.focusableElements);
            if (firstFocusable) {
              firstFocusable.focus();
            }
          }, 100);
        }
      }
    });

    // Return focus when modals close
    document.addEventListener('click', (e) => {
      if (e.target.closest('[data-modal-close]')) {
        const lastFocusedElement = document.querySelector('[data-last-focused]');
        if (lastFocusedElement) {
          lastFocusedElement.focus();
          lastFocusedElement.removeAttribute('data-last-focused');
        }
      }
    });
  }

  /**
   * Enhance color contrast for better visibility
   */
  enhanceColorContrast() {
    // Check if user prefers high contrast
    if (window.matchMedia('(prefers-contrast: high)').matches) {
      document.body.classList.add('high-contrast');
    }

    // Add contrast enhancement toggle
    this.addContrastToggle();
  }

  /**
   * Add contrast enhancement toggle
   */
  addContrastToggle() {
    const contrastToggle = document.createElement('button');
    contrastToggle.textContent = 'Toggle High Contrast';
    contrastToggle.className = 'contrast-toggle';
    contrastToggle.setAttribute('aria-label', 'Toggle high contrast mode');
    contrastToggle.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      z-index: 9999;
      padding: 8px 12px;
      background: #000;
      color: #fff;
      border: 2px solid #fff;
      border-radius: 4px;
      font-size: 12px;
      cursor: pointer;
    `;

    contrastToggle.addEventListener('click', () => {
      document.body.classList.toggle('high-contrast');
      const isHighContrast = document.body.classList.contains('high-contrast');
      this.announceToScreenReader(
        `High contrast mode ${isHighContrast ? 'enabled' : 'disabled'}`,
        'status'
      );
    });

    // Only show if user hasn't dismissed it
    if (!localStorage.getItem('contrast-toggle-dismissed')) {
      document.body.appendChild(contrastToggle);
    }
  }

  /**
   * Handle motion preferences
   */
  addMotionPreferences() {
    // Respect reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      document.body.classList.add('reduced-motion');
    }

    // Add motion toggle
    const motionToggle = document.createElement('button');
    motionToggle.textContent = 'Reduce Motion';
    motionToggle.className = 'motion-toggle';
    motionToggle.setAttribute('aria-label', 'Toggle reduced motion');
    motionToggle.style.cssText = `
      position: fixed;
      top: 50px;
      right: 10px;
      z-index: 9999;
      padding: 8px 12px;
      background: #4C1D95;
      color: #fff;
      border: 2px solid #fff;
      border-radius: 4px;
      font-size: 12px;
      cursor: pointer;
    `;

    motionToggle.addEventListener('click', () => {
      document.body.classList.toggle('reduced-motion');
      const isReduced = document.body.classList.contains('reduced-motion');
      this.announceToScreenReader(
        `Motion ${isReduced ? 'reduced' : 'restored'}`,
        'status'
      );
    });

    // Only show if user hasn't dismissed it
    if (!localStorage.getItem('motion-toggle-dismissed')) {
      document.body.appendChild(motionToggle);
    }
  }

  /**
   * Setup accessibility keyboard shortcuts
   */
  setupAccessibilityShortcuts() {
    document.addEventListener('keydown', (e) => {
      // Alt + 1: Skip to main content
      if (e.altKey && e.key === '1') {
        e.preventDefault();
        const main = document.querySelector('main, #main-content');
        if (main) {
          main.focus();
          main.scrollIntoView();
        }
      }

      // Alt + 2: Skip to navigation
      if (e.altKey && e.key === '2') {
        e.preventDefault();
        const nav = document.querySelector('nav, [role="navigation"]');
        if (nav) {
          const firstLink = nav.querySelector('a, button');
          if (firstLink) {
            firstLink.focus();
          }
        }
      }

      // Alt + 3: Skip to search
      if (e.altKey && e.key === '3') {
        e.preventDefault();
        const search = document.querySelector('input[type="search"], [role="search"] input');
        if (search) {
          search.focus();
        }
      }
    });
  }

  /**
   * Monitor accessibility issues
   */
  monitorAccessibility() {
    // Check for missing alt text
    const imagesWithoutAlt = document.querySelectorAll('img:not([alt])');
    if (imagesWithoutAlt.length > 0) {
      console.warn(`♿ Accessibility: ${imagesWithoutAlt.length} images missing alt text`);
    }

    // Check for missing form labels
    const inputsWithoutLabels = document.querySelectorAll('input:not([aria-label]):not([aria-labelledby])');
    if (inputsWithoutLabels.length > 0) {
      console.warn(`♿ Accessibility: ${inputsWithoutLabels.length} inputs missing labels`);
    }

    // Check for low contrast
    this.checkColorContrast();
  }

  /**
   * Check color contrast (simplified)
   */
  checkColorContrast() {
    // This is a simplified check - in production, you'd use a proper contrast checking library
    const elements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, a, button');
    let lowContrastCount = 0;

    elements.forEach(element => {
      const styles = window.getComputedStyle(element);
      const color = styles.color;
      const backgroundColor = styles.backgroundColor;
      
      // Simple heuristic - if both are very light or very dark, flag it
      if ((color.includes('rgb(255') && backgroundColor.includes('rgb(255')) ||
          (color.includes('rgb(0') && backgroundColor.includes('rgb(0'))) {
        lowContrastCount++;
      }
    });

    if (lowContrastCount > 0) {
      console.warn(`♿ Accessibility: ${lowContrastCount} elements may have low contrast`);
    }
  }

  /**
   * Handle escape key for closing modals/overlays
   */
  handleEscapeKey() {
    const modal = document.querySelector('.modal.active, [role="dialog"][aria-hidden="false"]');
    if (modal) {
      const closeButton = modal.querySelector('[data-modal-close], .modal-close');
      if (closeButton) {
        closeButton.click();
      }
    }

    const dropdown = document.querySelector('.dropdown.open, [aria-expanded="true"]');
    if (dropdown) {
      dropdown.setAttribute('aria-expanded', 'false');
      dropdown.classList.remove('open');
    }
  }

  /**
   * Handle tab key for focus trapping
   */
  handleTabKey(e) {
    const modal = document.querySelector('.modal.active, [role="dialog"][aria-hidden="false"]');
    if (modal) {
      const focusableElements = modal.querySelectorAll(this.focusableElements);
      const firstElement = focusableElements[0];
      const lastElement = focusableElements[focusableElements.length - 1];

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
  }

  /**
   * Announce message to screen readers
   */
  announceToScreenReader(message, type = 'status') {
    const regionId = type === 'alert' ? 'alert-live-region' : 'status-live-region';
    const region = document.getElementById(regionId);
    
    if (region) {
      region.textContent = message;
      
      // Clear after announcement
      setTimeout(() => {
        region.textContent = '';
      }, 1000);
    }
  }

  /**
   * Get accessibility statistics
   */
  getAccessibilityStats() {
    return {
      imagesWithAlt: document.querySelectorAll('img[alt]').length,
      imagesWithoutAlt: document.querySelectorAll('img:not([alt])').length,
      focusableElements: document.querySelectorAll(this.focusableElements).length,
      headingStructure: {
        h1: document.querySelectorAll('h1').length,
        h2: document.querySelectorAll('h2').length,
        h3: document.querySelectorAll('h3').length,
        h4: document.querySelectorAll('h4').length,
        h5: document.querySelectorAll('h5').length,
        h6: document.querySelectorAll('h6').length
      },
      ariaLabels: document.querySelectorAll('[aria-label]').length,
      landmarks: document.querySelectorAll('main, nav, aside, section, article, header, footer').length
    };
  }
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.accessibilityEnhancer = new AccessibilityEnhancer();
  });
} else {
  window.accessibilityEnhancer = new AccessibilityEnhancer();
}

// Export for module usage
export default AccessibilityEnhancer;
