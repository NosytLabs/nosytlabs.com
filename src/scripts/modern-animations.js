/**
 * Modern Animations Controller for NosytLabs - 2025 Enhancement
 * Advanced animation system with performance optimization and accessibility
 */

class ModernAnimationController {
  constructor() {
    this.observers = new Map();
    this.animatedElements = new Set();
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.isIntersectionObserverSupported = 'IntersectionObserver' in window;
    
    this.init();
  }

  init() {
    if (!this.isIntersectionObserverSupported) {
      console.warn('IntersectionObserver not supported, falling back to immediate animations');
      this.fallbackAnimations();
      return;
    }

    this.setupScrollAnimations();
    this.setupStaggeredAnimations();
    this.setupMicroInteractions();
    this.setupLoadingAnimations();
    this.setupHoverEffects();
    this.setupButtonAnimations();
    
    // Listen for reduced motion changes
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      this.isReducedMotion = e.matches;
      this.handleReducedMotionChange();
    });
  }

  /**
   * Setup scroll-triggered animations
   */
  setupScrollAnimations() {
    const scrollElements = document.querySelectorAll([
      '.scroll-fade-in',
      '.scroll-slide-left',
      '.scroll-slide-right',
      '.scroll-scale-in',
      '.scroll-rotate-in'
    ].join(','));

    if (scrollElements.length === 0) return;

    const scrollObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.isReducedMotion) {
          this.animateElement(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    scrollElements.forEach(el => {
      scrollObserver.observe(el);
      this.animatedElements.add(el);
    });

    this.observers.set('scroll', scrollObserver);
  }

  /**
   * Setup staggered animations
   */
  setupStaggeredAnimations() {
    const staggerContainers = document.querySelectorAll('.stagger-container');

    if (staggerContainers.length === 0) return;

    const staggerObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.isReducedMotion) {
          this.animateStaggeredContainer(entry.target);
        }
      });
    }, {
      threshold: 0.2
    });

    staggerContainers.forEach(container => {
      staggerObserver.observe(container);
    });

    this.observers.set('stagger', staggerObserver);
  }

  /**
   * Setup micro-interactions
   */
  setupMicroInteractions() {
    const microElements = document.querySelectorAll([
      '.micro-hover',
      '.micro-scale',
      '.micro-lift',
      '.micro-tilt',
      '.micro-glow'
    ].join(','));

    microElements.forEach(el => {
      // Add focus support for keyboard navigation
      el.addEventListener('focus', () => {
        if (!this.isReducedMotion) {
          el.style.transform = el.style.transform || '';
        }
      });

      el.addEventListener('blur', () => {
        if (!this.isReducedMotion) {
          el.style.transform = '';
        }
      });

      // Add touch support for mobile
      el.addEventListener('touchstart', () => {
        if (!this.isReducedMotion) {
          el.classList.add('touch-active');
        }
      });

      el.addEventListener('touchend', () => {
        el.classList.remove('touch-active');
      });
    });
  }

  /**
   * Setup loading animations
   */
  setupLoadingAnimations() {
    const loadingElements = document.querySelectorAll([
      '.loading-spinner',
      '.loading-dots',
      '.loading-skeleton'
    ].join(','));

    loadingElements.forEach(el => {
      if (this.isReducedMotion) {
        el.style.animation = 'none';
      }
    });
  }

  /**
   * Setup enhanced hover effects
   */
  setupHoverEffects() {
    const hoverElements = document.querySelectorAll([
      '.hover-lift-rotate',
      '.hover-scale-rotate',
      '.hover-glow-scale'
    ].join(','));

    hoverElements.forEach(el => {
      // Optimize for performance
      el.style.willChange = 'transform';
      
      el.addEventListener('mouseenter', () => {
        if (!this.isReducedMotion) {
          el.style.willChange = 'transform, box-shadow, filter';
        }
      });

      el.addEventListener('mouseleave', () => {
        el.style.willChange = 'transform';
      });
    });
  }

  /**
   * Setup modern button animations
   */
  setupButtonAnimations() {
    const modernButtons = document.querySelectorAll('.btn-modern');

    modernButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (this.isReducedMotion) return;

        // Create ripple effect
        this.createRippleEffect(btn, e);
      });
    });
  }

  /**
   * Animate individual element
   */
  animateElement(element) {
    if (this.animatedElements.has(element)) {
      element.classList.add('animate');
      
      // Remove from set to prevent re-animation
      this.animatedElements.delete(element);
    }
  }

  /**
   * Animate staggered container
   */
  animateStaggeredContainer(container) {
    if (!this.isReducedMotion) {
      container.classList.add('animate');
      
      // Trigger individual child animations with stagger
      const children = container.children;
      Array.from(children).forEach((child, index) => {
        setTimeout(() => {
          child.style.opacity = '1';
          child.style.transform = 'translateY(0)';
        }, index * 100); // 100ms stagger delay
      });
    }
  }

  /**
   * Create ripple effect for buttons
   */
  createRippleEffect(button, event) {
    const ripple = document.createElement('span');
    const rect = button.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s ease-out;
      pointer-events: none;
      z-index: 1;
    `;

    // Add ripple keyframes if not already present
    if (!document.querySelector('#ripple-styles')) {
      const style = document.createElement('style');
      style.id = 'ripple-styles';
      style.textContent = `
        @keyframes ripple {
          to {
            transform: scale(2);
            opacity: 0;
          }
        }
      `;
      document.head.appendChild(style);
    }

    button.style.position = 'relative';
    button.style.overflow = 'hidden';
    button.appendChild(ripple);

    // Remove ripple after animation
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  /**
   * Handle reduced motion preference changes
   */
  handleReducedMotionChange() {
    if (this.isReducedMotion) {
      // Disable all animations
      this.disableAnimations();
    } else {
      // Re-enable animations
      this.enableAnimations();
    }
  }

  /**
   * Disable all animations for reduced motion
   */
  disableAnimations() {
    const animatedElements = document.querySelectorAll([
      '.scroll-fade-in',
      '.scroll-slide-left',
      '.scroll-slide-right',
      '.scroll-scale-in',
      '.scroll-rotate-in',
      '.stagger-container',
      '.loading-spinner',
      '.loading-dots',
      '.loading-skeleton'
    ].join(','));

    animatedElements.forEach(el => {
      el.style.animation = 'none';
      el.style.transition = 'none';
      
      // Immediately show content
      if (el.classList.contains('scroll-fade-in') || 
          el.classList.contains('scroll-slide-left') || 
          el.classList.contains('scroll-slide-right') || 
          el.classList.contains('scroll-scale-in') || 
          el.classList.contains('scroll-rotate-in')) {
        el.style.opacity = '1';
        el.style.transform = 'none';
      }
    });
  }

  /**
   * Enable animations when reduced motion is disabled
   */
  enableAnimations() {
    // Re-initialize animations
    this.setupScrollAnimations();
    this.setupStaggeredAnimations();
    this.setupLoadingAnimations();
  }

  /**
   * Fallback for browsers without IntersectionObserver
   */
  fallbackAnimations() {
    const allAnimatedElements = document.querySelectorAll([
      '.scroll-fade-in',
      '.scroll-slide-left',
      '.scroll-slide-right',
      '.scroll-scale-in',
      '.scroll-rotate-in',
      '.stagger-container'
    ].join(','));

    // Immediately show all elements
    allAnimatedElements.forEach(el => {
      el.style.opacity = '1';
      el.style.transform = 'none';
      if (el.classList.contains('stagger-container')) {
        el.classList.add('animate');
      }
    });
  }

  /**
   * Cleanup observers
   */
  destroy() {
    this.observers.forEach(observer => {
      observer.disconnect();
    });
    this.observers.clear();
    this.animatedElements.clear();
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.modernAnimationController = new ModernAnimationController();
});

// Cleanup on page unload
window.addEventListener('beforeunload', () => {
  if (window.modernAnimationController) {
    window.modernAnimationController.destroy();
  }
});

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ModernAnimationController;
}
