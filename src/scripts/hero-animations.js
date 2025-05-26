/**
 * Hero Section Animations
 * Handles rotating text and counter animations
 */

class HeroAnimations {
  constructor() {
    this.rotatingTexts = [
      'Web Development',
      'Content Creation',
      '3D Printing',
      'Digital Solutions',
      'Custom Software',
      'UI/UX Design'
    ];
    this.currentTextIndex = 0;
    this.isTyping = false;
    
    this.init();
  }

  init() {
    // Initialize rotating text
    this.initRotatingText();
    
    // Initialize counter animations
    this.initCounterAnimations();
    
    // Initialize intersection observer for animations
    this.initIntersectionObserver();
  }

  /**
   * Initialize rotating text animation
   */
  initRotatingText() {
    const rotatingElement = document.getElementById('rotatingText');
    if (!rotatingElement) return;

    // Start the rotation cycle
    this.startTextRotation(rotatingElement);
  }

  /**
   * Start text rotation cycle
   */
  async startTextRotation(element) {
    while (true) {
      await this.typeText(element, this.rotatingTexts[this.currentTextIndex]);
      await this.wait(2000); // Wait 2 seconds
      await this.deleteText(element);
      await this.wait(500); // Wait 0.5 seconds
      
      this.currentTextIndex = (this.currentTextIndex + 1) % this.rotatingTexts.length;
    }
  }

  /**
   * Type text animation
   */
  async typeText(element, text) {
    this.isTyping = true;
    element.textContent = '';
    
    for (let i = 0; i < text.length; i++) {
      element.textContent += text[i];
      await this.wait(100); // Typing speed
    }
    
    this.isTyping = false;
  }

  /**
   * Delete text animation
   */
  async deleteText(element) {
    const text = element.textContent;
    
    for (let i = text.length; i > 0; i--) {
      element.textContent = text.substring(0, i - 1);
      await this.wait(50); // Deletion speed
    }
  }

  /**
   * Initialize counter animations
   */
  initCounterAnimations() {
    const counters = document.querySelectorAll('.stat-number[data-count]');
    
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-count'));
      const suffix = counter.textContent.replace(/\d+/g, '');
      
      this.animateCounter(counter, target, suffix);
    });
  }

  /**
   * Animate counter to target value
   */
  animateCounter(element, target, suffix = '') {
    let current = 0;
    const increment = target / 50; // 50 steps
    const duration = 2000; // 2 seconds
    const stepTime = duration / 50;

    const timer = setInterval(() => {
      current += increment;
      
      if (current >= target) {
        current = target;
        clearInterval(timer);
      }
      
      element.textContent = Math.floor(current) + suffix;
    }, stepTime);
  }

  /**
   * Initialize intersection observer for scroll-triggered animations
   */
  initIntersectionObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-in');
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    // Observe elements that should animate on scroll
    const animateElements = document.querySelectorAll('.hero-stats, .hero-section__buttons');
    animateElements.forEach(el => observer.observe(el));
  }

  /**
   * Utility function to wait
   */
  wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Add ripple effect to buttons
   */
  static addRippleEffect() {
    const buttons = document.querySelectorAll('.hero-section__button--primary');
    
    buttons.forEach(button => {
      button.addEventListener('click', function(e) {
        const ripple = this.querySelector('.button-ripple');
        if (ripple) {
          ripple.style.opacity = '1';
          ripple.style.transform = 'scale(1)';
          
          setTimeout(() => {
            ripple.style.opacity = '0';
            ripple.style.transform = 'scale(0)';
          }, 300);
        }
      });
    });
  }

  /**
   * Initialize particle interactions
   */
  static initParticleInteractions() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;

    heroSection.addEventListener('mousemove', (e) => {
      const { clientX, clientY } = e;
      const { left, top, width, height } = heroSection.getBoundingClientRect();
      
      const x = (clientX - left) / width;
      const y = (clientY - top) / height;
      
      // Update CSS custom properties for particle interactions
      heroSection.style.setProperty('--mouse-x', x);
      heroSection.style.setProperty('--mouse-y', y);
    });
  }

  /**
   * Add smooth scroll behavior
   */
  static initSmoothScroll() {
    const scrollIndicator = document.querySelector('.hero-section__scroll-indicator');
    if (!scrollIndicator) return;

    scrollIndicator.addEventListener('click', () => {
      const nextSection = document.querySelector('.hero-section').nextElementSibling;
      if (nextSection) {
        nextSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  }

  /**
   * Initialize all static methods
   */
  static init() {
    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        HeroAnimations.addRippleEffect();
        HeroAnimations.initParticleInteractions();
        HeroAnimations.initSmoothScroll();
      });
    } else {
      HeroAnimations.addRippleEffect();
      HeroAnimations.initParticleInteractions();
      HeroAnimations.initSmoothScroll();
    }
  }
}

// Initialize hero animations
document.addEventListener('DOMContentLoaded', () => {
  new HeroAnimations();
});

// Initialize static methods
HeroAnimations.init();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = HeroAnimations;
}

// Global access
window.HeroAnimations = HeroAnimations;
