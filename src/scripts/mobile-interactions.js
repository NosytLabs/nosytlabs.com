/**
 * Mobile Interactions Controller for NosytLabs - 2025
 * Enhanced touch interactions, gestures, and mobile-specific optimizations
 */

class MobileInteractionsController {
  constructor() {
    this.isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    this.isMobile = window.innerWidth <= 768;
    this.swipeThreshold = 50;
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchEndX = 0;
    this.touchEndY = 0;
    this.activeRipples = new Set();
    
    this.init();
  }

  init() {
    if (!this.isTouch) return;
    
    this.setupTouchFeedback();
    this.setupSwipeGestures();
    this.setupMobileNavigation();
    this.setupFormEnhancements();
    this.setupCardInteractions();
    this.setupScrollOptimizations();
    this.setupOrientationHandling();
    this.setupViewportOptimizations();
    
    // Listen for resize events
    window.addEventListener('resize', this.handleResize.bind(this));
    window.addEventListener('orientationchange', this.handleOrientationChange.bind(this));
  }

  /**
   * Setup enhanced touch feedback
   */
  setupTouchFeedback() {
    const touchElements = document.querySelectorAll('.touch-feedback, .touch-target');
    
    touchElements.forEach(element => {
      element.addEventListener('touchstart', this.handleTouchStart.bind(this));
      element.addEventListener('touchend', this.handleTouchEnd.bind(this));
      element.addEventListener('touchcancel', this.handleTouchEnd.bind(this));
    });
  }

  handleTouchStart(event) {
    const element = event.currentTarget;
    
    // Add active state
    element.classList.add('touch-active');
    
    // Create ripple effect
    if (element.classList.contains('touch-feedback')) {
      this.createRippleEffect(element, event);
    }
    
    // Haptic feedback if available
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  }

  handleTouchEnd(event) {
    const element = event.currentTarget;
    
    // Remove active state with delay for visual feedback
    setTimeout(() => {
      element.classList.remove('touch-active');
    }, 150);
  }

  createRippleEffect(element, event) {
    const rect = element.getBoundingClientRect();
    const touch = event.touches[0] || event.changedTouches[0];
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    const ripple = document.createElement('div');
    ripple.className = 'touch-ripple';
    ripple.style.cssText = `
      position: absolute;
      left: ${x}px;
      top: ${y}px;
      width: 0;
      height: 0;
      border-radius: 50%;
      background: rgba(255, 255, 255, 0.3);
      transform: translate(-50%, -50%);
      animation: ripple-expand 0.6s ease-out;
      pointer-events: none;
      z-index: 1000;
    `;
    
    // Ensure element has relative positioning
    if (getComputedStyle(element).position === 'static') {
      element.style.position = 'relative';
    }
    
    element.appendChild(ripple);
    this.activeRipples.add(ripple);
    
    // Remove ripple after animation
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
      this.activeRipples.delete(ripple);
    }, 600);
    
    // Add ripple animation if not already present
    this.ensureRippleStyles();
  }

  ensureRippleStyles() {
    if (!document.querySelector('#mobile-ripple-styles')) {
      const style = document.createElement('style');
      style.id = 'mobile-ripple-styles';
      style.textContent = `
        @keyframes ripple-expand {
          to {
            width: 200px;
            height: 200px;
            opacity: 0;
          }
        }
        
        .touch-active {
          transform: scale(0.98);
        }
      `;
      document.head.appendChild(style);
    }
  }

  /**
   * Setup swipe gesture recognition
   */
  setupSwipeGestures() {
    const swipeableElements = document.querySelectorAll('.swipeable');
    
    swipeableElements.forEach(element => {
      element.addEventListener('touchstart', this.handleSwipeStart.bind(this));
      element.addEventListener('touchmove', this.handleSwipeMove.bind(this));
      element.addEventListener('touchend', this.handleSwipeEnd.bind(this));
    });
  }

  handleSwipeStart(event) {
    const touch = event.touches[0];
    this.touchStartX = touch.clientX;
    this.touchStartY = touch.clientY;
    
    const element = event.currentTarget;
    element.classList.add('swiping');
  }

  handleSwipeMove(event) {
    if (!this.touchStartX || !this.touchStartY) return;
    
    const touch = event.touches[0];
    const deltaX = touch.clientX - this.touchStartX;
    const deltaY = touch.clientY - this.touchStartY;
    
    // Prevent default if horizontal swipe is detected
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      event.preventDefault();
    }
  }

  handleSwipeEnd(event) {
    const element = event.currentTarget;
    element.classList.remove('swiping');
    
    const touch = event.changedTouches[0];
    this.touchEndX = touch.clientX;
    this.touchEndY = touch.clientY;
    
    this.detectSwipeDirection(element);
    
    // Reset touch coordinates
    this.touchStartX = 0;
    this.touchStartY = 0;
    this.touchEndX = 0;
    this.touchEndY = 0;
  }

  detectSwipeDirection(element) {
    const deltaX = this.touchEndX - this.touchStartX;
    const deltaY = this.touchEndY - this.touchStartY;
    
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > this.swipeThreshold) {
      if (deltaX > 0) {
        this.handleSwipeRight(element);
      } else {
        this.handleSwipeLeft(element);
      }
    } else if (Math.abs(deltaY) > this.swipeThreshold) {
      if (deltaY > 0) {
        this.handleSwipeDown(element);
      } else {
        this.handleSwipeUp(element);
      }
    }
  }

  handleSwipeLeft(element) {
    element.dispatchEvent(new CustomEvent('swipeleft', { bubbles: true }));
  }

  handleSwipeRight(element) {
    element.dispatchEvent(new CustomEvent('swiperight', { bubbles: true }));
  }

  handleSwipeUp(element) {
    element.dispatchEvent(new CustomEvent('swipeup', { bubbles: true }));
  }

  handleSwipeDown(element) {
    element.dispatchEvent(new CustomEvent('swipedown', { bubbles: true }));
  }

  /**
   * Setup enhanced mobile navigation
   */
  setupMobileNavigation() {
    const mobileNavToggle = document.querySelector('[data-mobile-toggle]');
    const mobileNavOverlay = document.querySelector('.mobile-nav-enhanced');
    const mobileNavClose = document.querySelector('.mobile-nav-close');
    
    if (mobileNavToggle) {
      mobileNavToggle.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.toggleMobileNav();
      });
    }
    
    if (mobileNavClose) {
      mobileNavClose.addEventListener('touchstart', (e) => {
        e.preventDefault();
        this.closeMobileNav();
      });
    }
    
    if (mobileNavOverlay) {
      mobileNavOverlay.addEventListener('touchstart', (e) => {
        if (e.target === mobileNavOverlay) {
          this.closeMobileNav();
        }
      });
    }
  }

  toggleMobileNav() {
    const overlay = document.querySelector('.mobile-nav-enhanced');
    if (overlay) {
      overlay.classList.toggle('active');
      document.body.style.overflow = overlay.classList.contains('active') ? 'hidden' : '';
    }
  }

  closeMobileNav() {
    const overlay = document.querySelector('.mobile-nav-enhanced');
    if (overlay) {
      overlay.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  /**
   * Setup form enhancements for mobile
   */
  setupFormEnhancements() {
    const mobileInputs = document.querySelectorAll('.mobile-form-input');
    
    mobileInputs.forEach(input => {
      // Auto-zoom prevention
      if (input.type === 'text' || input.type === 'email' || input.type === 'password') {
        input.addEventListener('focus', () => {
          if (this.isMobile) {
            input.style.fontSize = '16px'; // Prevent zoom on iOS
          }
        });
      }
      
      // Enhanced focus states
      input.addEventListener('focus', () => {
        input.parentElement?.classList.add('focused');
      });
      
      input.addEventListener('blur', () => {
        input.parentElement?.classList.remove('focused');
      });
    });
  }

  /**
   * Setup card interactions
   */
  setupCardInteractions() {
    const mobileCards = document.querySelectorAll('.mobile-card');
    
    mobileCards.forEach(card => {
      card.addEventListener('touchstart', () => {
        card.classList.add('pressed');
      });
      
      card.addEventListener('touchend', () => {
        setTimeout(() => {
          card.classList.remove('pressed');
        }, 150);
      });
    });
  }

  /**
   * Setup scroll optimizations
   */
  setupScrollOptimizations() {
    // Smooth scrolling for mobile
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Optimize scroll containers
    const scrollContainers = document.querySelectorAll('.mobile-scroll-container');
    scrollContainers.forEach(container => {
      container.style.webkitOverflowScrolling = 'touch';
    });
    
    // Intersection observer for performance
    if ('IntersectionObserver' in window) {
      this.setupLazyLoading();
    }
  }

  setupLazyLoading() {
    const lazyElements = document.querySelectorAll('[data-lazy]');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          element.classList.add('loaded');
          observer.unobserve(element);
        }
      });
    }, {
      rootMargin: '50px'
    });
    
    lazyElements.forEach(element => observer.observe(element));
  }

  /**
   * Handle orientation changes
   */
  setupOrientationHandling() {
    window.addEventListener('orientationchange', () => {
      // Close mobile nav on orientation change
      this.closeMobileNav();
      
      // Recalculate viewport height
      setTimeout(() => {
        this.updateViewportHeight();
      }, 100);
    });
  }

  handleOrientationChange() {
    // Update mobile state
    this.isMobile = window.innerWidth <= 768;
    
    // Recalculate layouts
    this.updateViewportHeight();
  }

  /**
   * Setup viewport optimizations
   */
  setupViewportOptimizations() {
    this.updateViewportHeight();
    
    // Handle iOS Safari viewport issues
    if (this.isIOS()) {
      this.handleIOSViewport();
    }
  }

  updateViewportHeight() {
    const vh = window.innerHeight * 0.01;
    document.documentElement.style.setProperty('--vh', `${vh}px`);
  }

  handleIOSViewport() {
    // Fix iOS Safari bottom bar issues
    const metaViewport = document.querySelector('meta[name="viewport"]');
    if (metaViewport) {
      metaViewport.setAttribute('content', 
        'width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no'
      );
    }
  }

  handleResize() {
    this.isMobile = window.innerWidth <= 768;
    this.updateViewportHeight();
    
    // Close mobile nav on desktop resize
    if (!this.isMobile) {
      this.closeMobileNav();
    }
  }

  /**
   * Utility methods
   */
  isIOS() {
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  }

  isAndroid() {
    return /Android/.test(navigator.userAgent);
  }

  /**
   * Cleanup
   */
  destroy() {
    // Remove event listeners
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('orientationchange', this.handleOrientationChange);
    
    // Clear active ripples
    this.activeRipples.forEach(ripple => {
      if (ripple.parentNode) {
        ripple.parentNode.removeChild(ripple);
      }
    });
    this.activeRipples.clear();
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.mobileInteractionsController = new MobileInteractionsController();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (window.mobileInteractionsController) {
    window.mobileInteractionsController.destroy();
  }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MobileInteractionsController;
}
