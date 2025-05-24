/**
 * animations.js
 * UI animations for the NosytLabs website
 * 
 * This module handles animations and transitions throughout the website.
 * It uses Intersection Observer for scroll-based animations and provides
 * utility functions for creating smooth transitions.
 */

import NosytUtils from '../core/utils.js';

/**
 * Animations module
 */
const Animations = {
  /**
   * Configuration
   */
  config: {
    // Default root margin for intersection observer
    rootMargin: '0px 0px -100px 0px',
    
    // Default threshold for intersection observer
    threshold: 0.1,
    
    // Animation classes
    classes: {
      fadeIn: 'animate-fade-in',
      fadeInUp: 'animate-fade-in-up',
      fadeInDown: 'animate-fade-in-down',
      fadeInLeft: 'animate-fade-in-left',
      fadeInRight: 'animate-fade-in-right',
      slideUp: 'animate-slide-up',
      slideDown: 'animate-slide-down',
      slideLeft: 'animate-slide-left',
      slideRight: 'animate-slide-right',
      zoomIn: 'animate-zoom-in',
      zoomOut: 'animate-zoom-out',
      bounce: 'animate-bounce',
      pulse: 'animate-pulse',
      spin: 'animate-spin'
    },
    
    // Selectors for animated elements
    selectors: {
      animated: '[data-animate]',
      staggered: '[data-stagger]',
      parallax: '[data-parallax]',
      typewriter: '[data-typewriter]',
      counter: '[data-counter]'
    },
    
    // Animation durations
    durations: {
      fast: 300,
      normal: 500,
      slow: 800
    },
    
    // Animation easings
    easings: {
      linear: 'linear',
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out'
    }
  },
  
  /**
   * State
   */
  state: {
    observer: null,
    animatedElements: new Set(),
    typewriterInstances: new Map(),
    counterInstances: new Map()
  },
  
  /**
   * Initialize animations
   * @param {Object} options - Configuration options
   */
  init: function(options = {}) {
    console.log('Initializing animations...');
    
    try {
      // Check if reduced motion is preferred
      if (NosytUtils.browser.prefersReducedMotion()) {
        console.log('Reduced motion preferred, disabling animations');
        this.disableAnimations();
        return;
      }
      
      // Merge options with default config
      this.config = { ...this.config, ...options };
      
      // Set up intersection observer
      this.setupIntersectionObserver();
      
      // Set up scroll-based animations
      this.setupScrollAnimations();
      
      // Set up typewriter animations
      this.setupTypewriterAnimations();
      
      // Set up counter animations
      this.setupCounterAnimations();
      
      // Set up parallax effects
      this.setupParallaxEffects();
      
      // Set up mutation observer
      this.setupMutationObserver();
      
      console.log('Animations initialized successfully');
    } catch (error) {
      NosytUtils.error.handle(error, 'Animations initialization');
    }
  },
  
  /**
   * Disable all animations
   */
  disableAnimations: function() {
    try {
      // Add a class to the document to disable animations
      document.documentElement.classList.add('no-animations');
      
      // Remove animation classes from elements
      Object.values(this.config.selectors).forEach(selector => {
        const elements = document.querySelectorAll(selector);
        elements.forEach(element => {
          // Remove animation classes
          Object.values(this.config.classes).forEach(className => {
            element.classList.remove(className);
          });
          
          // Remove animation styles
          element.style.transition = 'none';
          element.style.animation = 'none';
          
          // Show element immediately
          element.style.opacity = '1';
          element.style.transform = 'none';
        });
      });
    } catch (error) {
      NosytUtils.error.handle(error, 'Animation disabling');
    }
  },
  
  /**
   * Set up intersection observer
   */
  setupIntersectionObserver: function() {
    try {
      // Create intersection observer
      this.state.observer = new IntersectionObserver(
        this.handleIntersection.bind(this),
        {
          rootMargin: this.config.rootMargin,
          threshold: this.config.threshold
        }
      );
      
      // Observe animated elements
      this.observeElements();
      
      console.log('Animation Intersection Observer set up successfully');
    } catch (error) {
      NosytUtils.error.handle(error, 'Animation Intersection Observer setup');
    }
  },
  
  /**
   * Observe animated elements
   */
  observeElements: function() {
    try {
      // Get all animated elements
      const elements = document.querySelectorAll(this.config.selectors.animated);
      
      // Observe each element
      elements.forEach(element => {
        if (!this.state.animatedElements.has(element)) {
          this.state.observer.observe(element);
          this.state.animatedElements.add(element);
          
          // Hide element initially
          element.style.opacity = '0';
        }
      });
      
      // Get all staggered elements
      const staggeredGroups = document.querySelectorAll('[data-stagger-group]');
      
      // Process each staggered group
      staggeredGroups.forEach(group => {
        const staggeredElements = group.querySelectorAll(this.config.selectors.staggered);
        
        // Observe the group
        if (!this.state.animatedElements.has(group)) {
          this.state.observer.observe(group);
          this.state.animatedElements.add(group);
        }
        
        // Hide staggered elements initially
        staggeredElements.forEach(element => {
          element.style.opacity = '0';
        });
      });
      
      console.log(`Observing ${elements.length} animated elements and ${staggeredGroups.length} staggered groups`);
    } catch (error) {
      NosytUtils.error.handle(error, 'Element observation');
    }
  },
  
  /**
   * Handle intersection of observed elements
   * @param {IntersectionObserverEntry[]} entries - Intersection observer entries
   */
  handleIntersection: function(entries) {
    try {
      entries.forEach(entry => {
        // Animate element if it's intersecting
        if (entry.isIntersecting) {
          const element = entry.target;
          
          // Check if it's a staggered group
          if (element.hasAttribute('data-stagger-group')) {
            this.animateStaggeredGroup(element);
          } else {
            // Animate individual element
            this.animateElement(element);
          }
          
          // Stop observing the element
          this.state.observer.unobserve(element);
        }
      });
    } catch (error) {
      NosytUtils.error.handle(error, 'Intersection handling');
    }
  },
  
  /**
   * Animate an element
   * @param {HTMLElement} element - The element to animate
   */
  animateElement: function(element) {
    try {
      // Get animation type
      const animationType = element.getAttribute('data-animate');
      
      // Get animation delay
      const delay = element.getAttribute('data-delay') || 0;
      
      // Get animation duration
      const duration = element.getAttribute('data-duration') || this.config.durations.normal;
      
      // Get animation easing
      const easing = element.getAttribute('data-easing') || this.config.easings.easeOut;
      
      // Set transition
      element.style.transition = `opacity ${duration}ms ${easing}, transform ${duration}ms ${easing}`;
      
      // Set delay
      if (delay > 0) {
        element.style.transitionDelay = `${delay}ms`;
      }
      
      // Apply animation class
      setTimeout(() => {
        // Show element
        element.style.opacity = '1';
        
        // Apply animation class if specified
        if (animationType && this.config.classes[animationType]) {
          element.classList.add(this.config.classes[animationType]);
        } else {
          // Default animation
          element.classList.add(this.config.classes.fadeIn);
        }
      }, 10);
    } catch (error) {
      NosytUtils.error.handle(error, 'Element animation');
    }
  },
  
  /**
   * Animate a staggered group
   * @param {HTMLElement} group - The staggered group element
   */
  animateStaggeredGroup: function(group) {
    try {
      // Get staggered elements
      const elements = group.querySelectorAll(this.config.selectors.staggered);
      
      // Get stagger delay
      const staggerDelay = parseInt(group.getAttribute('data-stagger-delay') || 100);
      
      // Get animation type
      const animationType = group.getAttribute('data-stagger-animate') || 'fadeIn';
      
      // Get base delay
      const baseDelay = parseInt(group.getAttribute('data-stagger-base-delay') || 0);
      
      // Animate each element with staggered delay
      elements.forEach((element, index) => {
        // Calculate delay
        const delay = baseDelay + (index * staggerDelay);
        
        // Set delay attribute
        element.setAttribute('data-delay', delay);
        
        // Set animation type
        element.setAttribute('data-animate', animationType);
        
        // Animate element
        this.animateElement(element);
      });
    } catch (error) {
      NosytUtils.error.handle(error, 'Staggered group animation');
    }
  },
  
  /**
   * Set up scroll-based animations
   */
  setupScrollAnimations: function() {
    try {
      // Get all parallax elements
      const parallaxElements = document.querySelectorAll(this.config.selectors.parallax);
      
      // Set up scroll event listener
      if (parallaxElements.length > 0) {
        // Use throttled scroll handler
        const handleScroll = NosytUtils.performance.throttle(() => {
          this.updateParallaxElements();
        }, 16); // ~60fps
        
        // Add scroll event listener
        window.addEventListener('scroll', handleScroll);
      }
    } catch (error) {
      NosytUtils.error.handle(error, 'Scroll animations setup');
    }
  },
  
  /**
   * Update parallax elements on scroll
   */
  updateParallaxElements: function() {
    try {
      // Get all parallax elements
      const parallaxElements = document.querySelectorAll(this.config.selectors.parallax);
      
      // Get scroll position
      const scrollY = window.scrollY || window.pageYOffset;
      
      // Update each element
      parallaxElements.forEach(element => {
        // Get parallax speed
        const speed = parseFloat(element.getAttribute('data-parallax') || 0.2);
        
        // Get element position
        const rect = element.getBoundingClientRect();
        const offsetTop = rect.top + scrollY;
        
        // Calculate parallax offset
        const offset = (scrollY - offsetTop) * speed;
        
        // Apply transform
        element.style.transform = `translateY(${offset}px)`;
      });
    } catch (error) {
      NosytUtils.error.handle(error, 'Parallax update');
    }
  },
  
  /**
   * Set up typewriter animations
   */
  setupTypewriterAnimations: function() {
    try {
      // Get all typewriter elements
      const typewriterElements = document.querySelectorAll(this.config.selectors.typewriter);
      
      // Set up each typewriter
      typewriterElements.forEach(element => {
        // Get text
        const text = element.getAttribute('data-typewriter');
        
        if (text) {
          // Get speed
          const speed = parseInt(element.getAttribute('data-typewriter-speed') || 50);
          
          // Get delay
          const delay = parseInt(element.getAttribute('data-typewriter-delay') || 0);
          
          // Create typewriter instance
          const instance = {
            element,
            text,
            speed,
            delay,
            index: 0,
            timeout: null
          };
          
          // Store instance
          this.state.typewriterInstances.set(element, instance);
          
          // Start typewriter after delay
          setTimeout(() => {
            this.typewriterTick(instance);
          }, delay);
        }
      });
    } catch (error) {
      NosytUtils.error.handle(error, 'Typewriter setup');
    }
  },
  
  /**
   * Typewriter animation tick
   * @param {Object} instance - The typewriter instance
   */
  typewriterTick: function(instance) {
    try {
      // Get current text
      const currentText = instance.text.substring(0, instance.index + 1);
      
      // Update element text
      instance.element.textContent = currentText;
      
      // Increment index
      instance.index++;
      
      // Continue if not finished
      if (instance.index < instance.text.length) {
        // Schedule next tick
        instance.timeout = setTimeout(() => {
          this.typewriterTick(instance);
        }, instance.speed);
      }
    } catch (error) {
      NosytUtils.error.handle(error, 'Typewriter tick');
    }
  },
  
  /**
   * Set up counter animations
   */
  setupCounterAnimations: function() {
    try {
      // Get all counter elements
      const counterElements = document.querySelectorAll(this.config.selectors.counter);
      
      // Set up each counter
      counterElements.forEach(element => {
        // Get target value
        const target = parseInt(element.getAttribute('data-counter') || 0);
        
        if (target > 0) {
          // Get duration
          const duration = parseInt(element.getAttribute('data-counter-duration') || 2000);
          
          // Get delay
          const delay = parseInt(element.getAttribute('data-counter-delay') || 0);
          
          // Get prefix and suffix
          const prefix = element.getAttribute('data-counter-prefix') || '';
          const suffix = element.getAttribute('data-counter-suffix') || '';
          
          // Create counter instance
          const instance = {
            element,
            target,
            duration,
            delay,
            prefix,
            suffix,
            startTime: null,
            rafId: null
          };
          
          // Store instance
          this.state.counterInstances.set(element, instance);
          
          // Observe element
          if (!this.state.animatedElements.has(element)) {
            this.state.observer.observe(element);
            this.state.animatedElements.add(element);
          }
          
          // Set initial value
          element.textContent = `${prefix}0${suffix}`;
        }
      });
    } catch (error) {
      NosytUtils.error.handle(error, 'Counter setup');
    }
  },
  
  /**
   * Start counter animation
   * @param {HTMLElement} element - The counter element
   */
  startCounter: function(element) {
    try {
      // Get counter instance
      const instance = this.state.counterInstances.get(element);
      
      if (instance) {
        // Start counter after delay
        setTimeout(() => {
          // Set start time
          instance.startTime = performance.now();
          
          // Start animation
          instance.rafId = requestAnimationFrame(time => {
            this.updateCounter(instance, time);
          });
        }, instance.delay);
      }
    } catch (error) {
      NosytUtils.error.handle(error, 'Counter start');
    }
  },
  
  /**
   * Update counter animation
   * @param {Object} instance - The counter instance
   * @param {number} currentTime - The current time
   */
  updateCounter: function(instance, currentTime) {
    try {
      // Calculate elapsed time
      const elapsed = currentTime - instance.startTime;
      
      // Calculate progress
      const progress = Math.min(elapsed / instance.duration, 1);
      
      // Calculate current value
      const value = Math.floor(progress * instance.target);
      
      // Update element text
      instance.element.textContent = `${instance.prefix}${value}${instance.suffix}`;
      
      // Continue if not finished
      if (progress < 1) {
        // Schedule next update
        instance.rafId = requestAnimationFrame(time => {
          this.updateCounter(instance, time);
        });
      }
    } catch (error) {
      NosytUtils.error.handle(error, 'Counter update');
    }
  },
  
  /**
   * Set up parallax effects
   */
  setupParallaxEffects: function() {
    try {
      // Already set up in setupScrollAnimations
    } catch (error) {
      NosytUtils.error.handle(error, 'Parallax setup');
    }
  },
  
  /**
   * Set up mutation observer
   */
  setupMutationObserver: function() {
    try {
      // Create mutation observer
      const observer = new MutationObserver(mutations => {
        let needsUpdate = false;
        
        // Check for added nodes
        mutations.forEach(mutation => {
          if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            needsUpdate = true;
          }
        });
        
        // Update observed elements if needed
        if (needsUpdate) {
          this.observeElements();
          this.setupTypewriterAnimations();
          this.setupCounterAnimations();
        }
      });
      
      // Start observing
      observer.observe(document.body, {
        childList: true,
        subtree: true
      });
      
      console.log('Animation Mutation Observer set up successfully');
    } catch (error) {
      NosytUtils.error.handle(error, 'Animation Mutation Observer setup');
    }
  }
};

// Export Animations module
export default Animations;
