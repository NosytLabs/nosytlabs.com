// Animation System - Scroll Triggers and Interactive Effects

/**
 * Initialize scroll-triggered animations
 */
export function initScrollAnimations() {
  // Check if Intersection Observer is supported
  if (!('IntersectionObserver' in window)) {
    // Fallback: show all elements immediately
    const animatedElements = document.querySelectorAll('[class*="scroll-"]');
    animatedElements.forEach(el => el.classList.add('visible'));
    return;
  }

  // Create intersection observer
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          // Optionally unobserve after animation triggers
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    }
  );

  // Observe all elements with scroll animation classes
  const animatedElements = document.querySelectorAll(
    '.scroll-fade-in, .scroll-slide-left, .scroll-slide-right, .scroll-scale-up'
  );
  
  animatedElements.forEach((el) => {
    observer.observe(el);
  });
}

/**
 * Initialize hover effects for interactive elements
 */
export function initHoverEffects() {
  // Add hover classes to buttons
  const buttons = document.querySelectorAll('button, .btn, [role="button"]');
  buttons.forEach(btn => {
    if (!btn.classList.contains('no-hover')) {
      btn.classList.add('hover-lift', 'btn-hover-slide');
    }
  });

  // Add hover classes to cards
  const cards = document.querySelectorAll('.card, [class*="card-"], .bg-white, .bg-gray');
  cards.forEach(card => {
    if (!card.classList.contains('no-hover')) {
      card.classList.add('card-hover');
    }
  });

  // Add hover effects to links
  const links = document.querySelectorAll('a');
  links.forEach(link => {
    if (!link.classList.contains('no-hover')) {
      link.classList.add('text-hover-glow');
    }
  });
}

/**
 * Initialize loading animations
 */
export function initLoadingAnimations() {
  // Add loading pulse to images while they load
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    if (!img.complete) {
      img.classList.add('loading-pulse');
      img.addEventListener('load', () => {
        img.classList.remove('loading-pulse');
      });
    }
  });
}

/**
 * Smooth scroll to element
 */
export function smoothScrollTo(elementId, offset = 0) {
  const element = document.getElementById(elementId);
  if (element) {
    const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
    const offsetPosition = elementPosition - offset;

    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    });
  }
}

/**
 * Add staggered animation delays to child elements
 */
export function addStaggeredAnimations(parentSelector, childSelector = '*', baseDelay = 100) {
  const parent = document.querySelector(parentSelector);
  if (parent) {
    const children = parent.querySelectorAll(childSelector);
    children.forEach((child, index) => {
      child.style.transitionDelay = `${index * baseDelay}ms`;
    });
  }
}

/**
 * Performance-optimized animation frame handler
 */
class AnimationManager {
  constructor() {
    this.animations = new Set();
    this.isRunning = false;
  }

  add(callback) {
    this.animations.add(callback);
    if (!this.isRunning) {
      this.start();
    }
  }

  remove(callback) {
    this.animations.delete(callback);
    if (this.animations.size === 0) {
      this.stop();
    }
  }

  start() {
    this.isRunning = true;
    this.tick();
  }

  stop() {
    this.isRunning = false;
  }

  tick() {
    if (this.isRunning) {
      this.animations.forEach(callback => callback());
      if (typeof requestAnimationFrame !== 'undefined') {
        requestAnimationFrame(() => this.tick());
      } else {
        // Fallback for test environments
        setTimeout(() => this.tick(), 16);
      }
    }
  }
}

export const animationManager = new AnimationManager();

/**
 * Initialize all animation systems
 */
export function initAnimations() {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      initScrollAnimations();
      initHoverEffects();
      initLoadingAnimations();
    });
  } else {
    initScrollAnimations();
    initHoverEffects();
    initLoadingAnimations();
  }

  // Re-initialize on page navigation (for SPAs)
  window.addEventListener('popstate', () => {
    setTimeout(() => {
      initScrollAnimations();
      initHoverEffects();
      initLoadingAnimations();
    }, 100);
  });
}

// Auto-initialize when module is imported
if (typeof window !== 'undefined') {
  initAnimations();
}

// Export for testing
export { AnimationManager };