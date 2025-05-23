/**
 * Enhanced Popup and Z-Index Fix for NosytLabs Website
 * This script fixes issues with popups, context menus, and z-index stacking
 * to prevent elements from covering text or other important content
 */

(function() {
  'use strict';

  // Initialize when DOM is loaded
  document.addEventListener('DOMContentLoaded', initPopupFix);

  // Global popup manager
  const popupManager = {
    baseZIndex: 9000,
    activePopups: [],

    // Register a popup
    registerPopup: function(popupElement) {
      this.activePopups.push(popupElement);
      this.updateZIndices();
    },

    // Close a popup
    closePopup: function(popupElement) {
      const index = this.activePopups.indexOf(popupElement);
      if (index !== -1) {
        this.activePopups.splice(index, 1);

        // Hide the popup
        popupElement.style.display = 'none';

        // If it has a modal overlay, hide that too
        const overlayId = popupElement.getAttribute('data-overlay');
        if (overlayId) {
          const overlay = document.getElementById(overlayId);
          if (overlay) {
            overlay.style.display = 'none';
          }
        }

        this.updateZIndices();
      }
    },

    // Update z-indices for all active popups
    updateZIndices: function() {
      this.activePopups.forEach((popup, index) => {
        popup.style.zIndex = this.baseZIndex + 300 + index;

        // Update associated overlay if any
        const overlayId = popup.getAttribute('data-overlay');
        if (overlayId) {
          const overlay = document.getElementById(overlayId);
          if (overlay) {
            overlay.style.zIndex = this.baseZIndex + 250 + index;
          }
        }
      });
    }
  };

  function initPopupFix() {
    console.log('Initializing enhanced popup and z-index fixes');

    // Fix Windows 95 windows z-index
    fixWin95Windows();

    // Fix context menus z-index
    fixContextMenus();

    // Fix hero section particles and elements
    fixHeroElements();

    // Fix any popup elements that might be covering text
    fixPopupElements();

    // Fix mobile menu
    fixMobileMenu();

    // Add global event listener for escape key to close popups
    addEscapeKeyHandler();

    // Make popup manager globally accessible
    window.popupManager = popupManager;

    console.log('Enhanced popup and z-index fixes initialized');
  }

  /**
   * Fix Windows 95 windows z-index issues
   */
  function fixWin95Windows() {
    const win95Windows = document.querySelectorAll('.win95-window');
    if (win95Windows.length === 0) return;

    win95Windows.forEach((window, index) => {
      // Set base z-index for windows with increasing values for proper stacking
      const baseZIndex = 1000;
      window.style.zIndex = baseZIndex + index;

      // Add click handler to bring window to front
      window.addEventListener('mousedown', function() {
        bringToFront(this);
      });

      // Add touch handler for mobile
      window.addEventListener('touchstart', function() {
        bringToFront(this);
      });
    });

    console.log('Fixed z-index for', win95Windows.length, 'Windows 95 windows');
  }

  /**
   * Bring a window to the front of the stack
   * @param {HTMLElement} window - The window element to bring to front
   */
  function bringToFront(window) {
    const win95Windows = document.querySelectorAll('.win95-window');
    const maxZIndex = Array.from(win95Windows).reduce((max, win) => {
      const zIndex = parseInt(win.style.zIndex || 1000);
      return Math.max(max, zIndex);
    }, 1000);

    // Set the clicked window's z-index higher than all others
    window.style.zIndex = maxZIndex + 10;

    // Add active class for styling
    win95Windows.forEach(win => {
      win.classList.remove('active');
      win.classList.remove('active-window');
    });
    window.classList.add('active');
    window.classList.add('active-window');
  }

  /**
   * Fix context menus z-index issues
   */
  function fixContextMenus() {
    const contextMenus = document.querySelectorAll('.context-menu');
    if (contextMenus.length === 0) {
      // Create a style element for context menus if they're added dynamically
      const style = document.createElement('style');
      style.textContent = `
        .context-menu {
          position: absolute;
          background-color: var(--win95-window-bg, #c0c0c0);
          border: 2px solid;
          border-color: var(--win95-button-highlight, #ffffff) var(--win95-button-shadow, #808080) var(--win95-button-shadow, #808080) var(--win95-button-highlight, #ffffff);
          padding: 2px;
          z-index: 2000 !important;
          box-shadow: 3px 3px 10px rgba(0, 0, 0, 0.3);
        }
      `;
      document.head.appendChild(style);
      console.log('Added context menu style fix');
    } else {
      contextMenus.forEach(menu => {
        menu.style.zIndex = '2000';
        menu.style.boxShadow = '3px 3px 10px rgba(0, 0, 0, 0.3)';
      });
      console.log('Fixed z-index for', contextMenus.length, 'context menus');
    }
  }

  /**
   * Fix hero section elements
   */
  function fixHeroElements() {
    // Fix particles
    const heroParticles = document.getElementById('particles-js') ||
                          document.getElementById('hero-particles') ||
                          document.querySelector('.particles-container');

    if (heroParticles) {
      // Ensure particles are behind content
      heroParticles.style.zIndex = '1';

      // Reduce particle count for better performance
      if (heroParticles.hasAttribute('data-particle-count')) {
        const currentCount = parseInt(heroParticles.getAttribute('data-particle-count'));
        if (currentCount > 30) {
          heroParticles.setAttribute('data-particle-count', '30');
        }
      }

      console.log('Fixed hero particles z-index and optimized count');
    }

    // Fix hero text container
    const heroTextContainer = document.querySelector('.hero-text-container');
    if (heroTextContainer) {
      heroTextContainer.style.zIndex = '30';

      // Add text shadow for better readability
      const heroTitle = heroTextContainer.querySelector('.hero-title');
      if (heroTitle) {
        heroTitle.style.textShadow = '0 2px 10px rgba(0,0,0,0.9), 0 0 30px rgba(0,0,0,0.5)';
      }

      const heroSubtitle = heroTextContainer.querySelector('.hero-subtitle');
      if (heroSubtitle) {
        heroSubtitle.style.textShadow = '0 2px 8px rgba(0,0,0,0.9), 0 0 20px rgba(0,0,0,0.7)';
      }

      console.log('Fixed hero text container z-index and improved readability');
    }

    // Fix hero CTA buttons
    const heroCta = document.querySelector('.hero-cta');
    if (heroCta) {
      heroCta.style.zIndex = '25';
      console.log('Fixed hero CTA buttons z-index');
    }

    // Fix scroll indicator
    const scrollIndicator = document.querySelector('.scroll-button');
    if (scrollIndicator) {
      const scrollIndicatorParent = scrollIndicator.parentElement;
      if (scrollIndicatorParent) {
        scrollIndicatorParent.style.zIndex = '50';
        console.log('Fixed scroll indicator z-index');
      }
    }
  }

  /**
   * Fix mobile menu
   */
  function fixMobileMenu() {
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenu) {
      mobileMenu.style.zIndex = '9500';

      const mobileMenuButton = document.querySelector('.mobile-menu-button');
      if (mobileMenuButton) {
        mobileMenuButton.style.zIndex = '9501';
      }

      console.log('Fixed mobile menu z-index');
    }
  }

  /**
   * Fix any popup elements that might be covering text
   */
  function fixPopupElements() {
    // Fix tooltips
    const tooltips = document.querySelectorAll('.tooltip, [data-tooltip], [title]');
    tooltips.forEach(tooltip => {
      tooltip.style.zIndex = '9200';
    });

    // Fix modals
    const modals = document.querySelectorAll('.modal, .dialog, .popup');
    modals.forEach(modal => {
      modal.style.zIndex = '9300';
    });

    // Fix notifications
    const notifications = document.querySelectorAll('.notification, .toast, .alert');
    notifications.forEach(notification => {
      notification.style.zIndex = '9400';
    });

    console.log('Fixed z-index for various popup elements');
  }

  /**
   * Add global event listener for escape key to close popups
   */
  function addEscapeKeyHandler() {
    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape') {
        // Close any open context menus
        const contextMenus = document.querySelectorAll('.context-menu');
        contextMenus.forEach(menu => {
          menu.style.display = 'none';
        });

        // Close any open modals that aren't Windows 95 windows
        const modals = document.querySelectorAll('.modal:not(.win95-window), .dialog:not(.win95-window), .popup:not(.win95-window)');
        modals.forEach(modal => {
          if (modal.style.display !== 'none') {
            modal.style.display = 'none';
          }
        });

        // Close mobile menu if open
        const mobileMenu = document.querySelector('.mobile-menu.open');
        if (mobileMenu) {
          mobileMenu.classList.remove('open');
        }
      }
    });

    console.log('Added enhanced escape key handler for popups');
  }
})();
