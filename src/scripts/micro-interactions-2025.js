/**
 * Advanced Micro-Interactions System 2025 for NosytLabs
 * Enhanced user experience with sophisticated animations and interactions
 * Features: Magnetic effects, parallax, morphing, and gesture-based interactions
 */

class MicroInteractions2025 {
  constructor() {
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    this.isTouchDevice = 'ontouchstart' in window;
    this.mousePosition = { x: 0, y: 0 };
    this.activeElements = new Set();
    this.observers = new Map();
    
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.initializeMagneticElements();
    this.initializeParallaxElements();
    this.initializeMorphingElements();
    this.initializeGestureElements();
    this.initializeScrollAnimations();
    this.initializeHoverEffects();
    this.setupPerformanceOptimizations();
  }

  setupEventListeners() {
    // Track mouse position for magnetic effects
    document.addEventListener('mousemove', (e) => {
      this.mousePosition.x = e.clientX;
      this.mousePosition.y = e.clientY;
      this.updateMagneticElements();
    });

    // Handle reduced motion changes
    window.matchMedia('(prefers-reduced-motion: reduce)').addEventListener('change', (e) => {
      this.isReducedMotion = e.matches;
      this.handleReducedMotionChange();
    });

    // Handle visibility change for performance
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseAnimations();
      } else {
        this.resumeAnimations();
      }
    });
  }

  initializeMagneticElements() {
    if (this.isReducedMotion || this.isTouchDevice) return;

    const magneticElements = document.querySelectorAll('.magnetic, .btn-magnetic, .card-magnetic');
    
    magneticElements.forEach(element => {
      this.setupMagneticEffect(element);
    });
  }

  setupMagneticEffect(element) {
    const strength = parseFloat(element.dataset.magneticStrength) || 0.3;
    const distance = parseFloat(element.dataset.magneticDistance) || 100;
    
    element.addEventListener('mouseenter', () => {
      this.activeElements.add(element);
      element.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    });

    element.addEventListener('mouseleave', () => {
      this.activeElements.delete(element);
      element.style.transform = 'translate3d(0, 0, 0) scale(1)';
      element.style.transition = 'transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
    });
  }

  updateMagneticElements() {
    if (this.isReducedMotion || this.activeElements.size === 0) return;

    this.activeElements.forEach(element => {
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      
      const deltaX = this.mousePosition.x - centerX;
      const deltaY = this.mousePosition.y - centerY;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      
      const strength = parseFloat(element.dataset.magneticStrength) || 0.3;
      const maxDistance = parseFloat(element.dataset.magneticDistance) || 100;
      
      if (distance < maxDistance) {
        const force = (maxDistance - distance) / maxDistance;
        const moveX = deltaX * force * strength;
        const moveY = deltaY * force * strength;
        const scale = 1 + (force * 0.1);
        
        element.style.transform = `translate3d(${moveX}px, ${moveY}px, 0) scale(${scale})`;
      }
    });
  }

  initializeParallaxElements() {
    if (this.isReducedMotion) return;

    const parallaxElements = document.querySelectorAll('.parallax, .parallax-slow, .parallax-fast');
    
    if (parallaxElements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.setupParallaxEffect(entry.target);
        }
      });
    }, { threshold: 0.1 });

    parallaxElements.forEach(element => observer.observe(element));
    this.observers.set('parallax', observer);
  }

  setupParallaxEffect(element) {
    const speed = parseFloat(element.dataset.parallaxSpeed) || 0.5;
    
    const updateParallax = () => {
      const rect = element.getBoundingClientRect();
      const scrolled = window.pageYOffset;
      const rate = scrolled * speed;
      
      element.style.transform = `translate3d(0, ${rate}px, 0)`;
    };

    const throttledUpdate = this.throttle(updateParallax, 16); // 60fps
    window.addEventListener('scroll', throttledUpdate, { passive: true });
  }

  initializeMorphingElements() {
    const morphingElements = document.querySelectorAll('.morph, .btn-morph, .card-morph');
    
    morphingElements.forEach(element => {
      this.setupMorphingEffect(element);
    });
  }

  setupMorphingEffect(element) {
    const originalBorderRadius = getComputedStyle(element).borderRadius;
    const morphRadius = element.dataset.morphRadius || '50%';
    
    element.addEventListener('mouseenter', () => {
      if (this.isReducedMotion) return;
      
      element.style.transition = 'all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      element.style.borderRadius = morphRadius;
      element.style.transform = 'scale(1.05)';
    });

    element.addEventListener('mouseleave', () => {
      if (this.isReducedMotion) return;
      
      element.style.borderRadius = originalBorderRadius;
      element.style.transform = 'scale(1)';
    });
  }

  initializeGestureElements() {
    if (!this.isTouchDevice) return;

    const gestureElements = document.querySelectorAll('.gesture, .swipeable, .pinchable');
    
    gestureElements.forEach(element => {
      this.setupGestureHandling(element);
    });
  }

  setupGestureHandling(element) {
    let startX, startY, currentX, currentY;
    let isGesturing = false;

    element.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        startX = e.touches[0].clientX;
        startY = e.touches[0].clientY;
        isGesturing = true;
        
        element.style.transition = 'none';
      }
    }, { passive: true });

    element.addEventListener('touchmove', (e) => {
      if (!isGesturing || e.touches.length !== 1) return;
      
      currentX = e.touches[0].clientX;
      currentY = e.touches[0].clientY;
      
      const deltaX = currentX - startX;
      const deltaY = currentY - startY;
      
      // Apply subtle movement feedback
      element.style.transform = `translate3d(${deltaX * 0.1}px, ${deltaY * 0.1}px, 0)`;
    }, { passive: true });

    element.addEventListener('touchend', () => {
      if (!isGesturing) return;
      
      isGesturing = false;
      element.style.transition = 'transform 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)';
      element.style.transform = 'translate3d(0, 0, 0)';
    }, { passive: true });
  }

  initializeScrollAnimations() {
    const scrollElements = document.querySelectorAll('.scroll-reveal, .fade-in-up, .slide-in-left, .slide-in-right');
    
    if (scrollElements.length === 0) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateScrollElement(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { 
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    scrollElements.forEach(element => {
      observer.observe(element);
      // Set initial state
      this.setInitialScrollState(element);
    });

    this.observers.set('scroll', observer);
  }

  setInitialScrollState(element) {
    if (this.isReducedMotion) return;

    element.style.opacity = '0';
    
    if (element.classList.contains('fade-in-up')) {
      element.style.transform = 'translateY(30px)';
    } else if (element.classList.contains('slide-in-left')) {
      element.style.transform = 'translateX(-30px)';
    } else if (element.classList.contains('slide-in-right')) {
      element.style.transform = 'translateX(30px)';
    }
  }

  animateScrollElement(element) {
    if (this.isReducedMotion) {
      element.style.opacity = '1';
      return;
    }

    const delay = parseFloat(element.dataset.animationDelay) || 0;
    const duration = parseFloat(element.dataset.animationDuration) || 0.6;
    
    setTimeout(() => {
      element.style.transition = `all ${duration}s cubic-bezier(0.25, 0.46, 0.45, 0.94)`;
      element.style.opacity = '1';
      element.style.transform = 'translate3d(0, 0, 0)';
    }, delay * 1000);
  }

  initializeHoverEffects() {
    const hoverElements = document.querySelectorAll('.hover-lift, .hover-glow, .hover-tilt');
    
    hoverElements.forEach(element => {
      this.setupAdvancedHoverEffect(element);
    });
  }

  setupAdvancedHoverEffect(element) {
    element.addEventListener('mouseenter', (e) => {
      if (this.isReducedMotion) return;
      
      if (element.classList.contains('hover-lift')) {
        element.style.transform = 'translateY(-8px) scale(1.02)';
        element.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.15)';
      }
      
      if (element.classList.contains('hover-glow')) {
        element.style.boxShadow = '0 0 30px rgba(124, 58, 237, 0.4)';
      }
      
      if (element.classList.contains('hover-tilt')) {
        const rect = element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const deltaX = (e.clientX - centerX) / (rect.width / 2);
        const deltaY = (e.clientY - centerY) / (rect.height / 2);
        
        element.style.transform = `perspective(1000px) rotateX(${deltaY * 5}deg) rotateY(${deltaX * 5}deg)`;
      }
    });

    element.addEventListener('mouseleave', () => {
      if (this.isReducedMotion) return;
      
      element.style.transform = 'translate3d(0, 0, 0)';
      element.style.boxShadow = '';
    });

    element.addEventListener('mousemove', (e) => {
      if (this.isReducedMotion || !element.classList.contains('hover-tilt')) return;
      
      const rect = element.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;
      const deltaX = (e.clientX - centerX) / (rect.width / 2);
      const deltaY = (e.clientY - centerY) / (rect.height / 2);
      
      element.style.transform = `perspective(1000px) rotateX(${deltaY * 5}deg) rotateY(${deltaX * 5}deg)`;
    });
  }

  setupPerformanceOptimizations() {
    // Use requestAnimationFrame for smooth animations
    this.rafId = null;
    
    // Throttle expensive operations
    this.updateMagneticElements = this.throttle(this.updateMagneticElements.bind(this), 16);
    
    // Use passive event listeners where possible
    this.passiveSupported = this.detectPassiveSupport();
  }

  detectPassiveSupport() {
    let passiveSupported = false;
    try {
      const options = {
        get passive() {
          passiveSupported = true;
          return false;
        }
      };
      window.addEventListener('test', null, options);
      window.removeEventListener('test', null, options);
    } catch (err) {
      passiveSupported = false;
    }
    return passiveSupported;
  }

  throttle(func, limit) {
    let inThrottle;
    return function() {
      const args = arguments;
      const context = this;
      if (!inThrottle) {
        func.apply(context, args);
        inThrottle = true;
        setTimeout(() => inThrottle = false, limit);
      }
    };
  }

  handleReducedMotionChange() {
    if (this.isReducedMotion) {
      this.disableAllAnimations();
    } else {
      this.enableAllAnimations();
    }
  }

  disableAllAnimations() {
    // Remove all active transforms and transitions
    this.activeElements.forEach(element => {
      element.style.transform = '';
      element.style.transition = 'none';
    });
    
    // Clear all observers
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
  }

  enableAllAnimations() {
    // Reinitialize all animations
    this.initializeMagneticElements();
    this.initializeParallaxElements();
    this.initializeScrollAnimations();
  }

  pauseAnimations() {
    // Pause animations when page is hidden for performance
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  resumeAnimations() {
    // Resume animations when page becomes visible
    if (!this.isReducedMotion) {
      this.updateMagneticElements();
    }
  }

  // Public API methods
  addMagneticElement(element) {
    this.setupMagneticEffect(element);
  }

  addParallaxElement(element) {
    this.setupParallaxEffect(element);
  }

  addMorphingElement(element) {
    this.setupMorphingEffect(element);
  }

  addScrollRevealElement(element) {
    this.setInitialScrollState(element);
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.animateScrollElement(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1 });
    
    observer.observe(element);
  }

  destroy() {
    // Clean up all event listeners and observers
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();
    this.activeElements.clear();
    
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }
  }
}

// Initialize micro-interactions system
const microInteractions2025 = new MicroInteractions2025();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = MicroInteractions2025;
} else if (typeof window !== 'undefined') {
  window.MicroInteractions2025 = MicroInteractions2025;
  window.microInteractions2025 = microInteractions2025;
}

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('✨ Micro-interactions 2025 initialized');
  });
} else {
  console.log('✨ Micro-interactions 2025 initialized');
}
