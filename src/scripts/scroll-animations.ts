console.log('[SCRIPT LOAD] scroll-animations.ts is loading...');
// Enhanced Scroll-Triggered Animation System
// Provides comprehensive scroll-based animations with performance optimization

interface ScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  once?: boolean;
  delay?: number;
  stagger?: boolean;
  staggerDelay?: number;
}

interface AnimationConfig {
  element: HTMLElement;
  animationType: string;
  options: ScrollAnimationOptions;
  observer?: IntersectionObserver;
  hasAnimated?: boolean;
}

class ScrollAnimationController {
  private animations: Map<HTMLElement, AnimationConfig> = new Map();
  private staggerGroups: Map<HTMLElement, HTMLElement[]> = new Map();
  private isReducedMotion: boolean = false;

  constructor() {
    console.log('[SCROLL-ANIMATION] ScrollAnimationController constructor called');
    this.isReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    console.log('[SCROLL-ANIMATION] Reduced motion preference:', this.isReducedMotion);
    this.init();
  }

  private init(): void {
    console.log('[SCROLL-ANIMATION] init() called');
    console.log('[SCROLL-ANIMATION] Document ready state:', document.readyState);
    
    // Respect user's motion preferences
    if (this.isReducedMotion) {
      console.log('[SCROLL-ANIMATION] Reduced motion detected, showing all elements immediately');
      this.showAllElements();
      return;
    }

    // Initialize scroll animations after DOM is ready
    if (document.readyState === 'loading') {
      console.log('[SCROLL-ANIMATION] Document still loading, waiting for DOMContentLoaded');
      document.addEventListener('DOMContentLoaded', () => this.setupAnimations());
    } else {
      console.log('[SCROLL-ANIMATION] Document ready, setting up animations immediately');
      this.setupAnimations();
    }

    // Handle dynamic content
    console.log('[SCROLL-ANIMATION] Setting up mutation observer for dynamic content');
    this.observeForNewContent();
  }

  private showAllElements(): void {
    // For reduced motion, immediately show all elements
    const animatedElements = document.querySelectorAll('[data-scroll-animate], .stagger-item, .scroll-animate');
    animatedElements.forEach((element) => {
      const el = element as HTMLElement;
      el.style.opacity = '1';
      el.style.transform = 'none';
      el.classList.add('animate-in');
    });
  }

  private setupAnimations(): void {
    console.log('[SCROLL-ANIMATION] setupAnimations() called');
    
    // Setup AnimatedSection components
    console.log('[SCROLL-ANIMATION] Setting up animated sections...');
    this.setupAnimatedSections();
    
    // Setup stagger groups
    console.log('[SCROLL-ANIMATION] Setting up stagger groups...');
    this.setupStaggerGroups();
    
    // Setup individual animated elements
    console.log('[SCROLL-ANIMATION] Setting up individual elements...');
    this.setupIndividualElements();
    
    // Setup special animations
    console.log('[SCROLL-ANIMATION] Setting up special animations...');
    this.setupSpecialAnimations();
    
    console.log('[SCROLL-ANIMATION] setupAnimations() completed');
    console.log('[SCROLL-ANIMATION] Total animations tracked:', this.animations.size);
    console.log('[SCROLL-ANIMATION] Total stagger groups:', this.staggerGroups.size);
  }

  private setupAnimatedSections(): void {
    console.log('[SCROLL-ANIMATION] Searching for [data-scroll-animate] elements...');
    const sections = document.querySelectorAll('[data-scroll-animate]');
    console.log('[SCROLL-ANIMATION] Found', sections.length, 'elements with [data-scroll-animate]');
    
    if (sections.length === 0) {
      console.warn('[SCROLL-ANIMATION] No elements with [data-scroll-animate] found!');
      // Also check for common selectors
      const alternatives = {
        'scroll-animate class': document.querySelectorAll('.scroll-animate').length,
        'stagger-item class': document.querySelectorAll('.stagger-item').length,
        'data-stagger attribute': document.querySelectorAll('[data-stagger]').length
      };
      console.log('[SCROLL-ANIMATION] Alternative element counts:', alternatives);
    }
    
    sections.forEach((section, index) => {
      const element = section as HTMLElement;
      console.log(`[SCROLL-ANIMATION] Processing element ${index + 1}:`, {
        tagName: element.tagName,
        classes: element.className,
        id: element.id,
        dataset: element.dataset
      });
      
      const animationType = element.dataset.animationType || 'fade-in-up';
      const threshold = parseFloat(element.dataset.threshold || '0.2');
      const once = element.dataset.once !== 'false';
      const delay = parseInt(element.dataset.delay || '0');
      const stagger = element.dataset.stagger === 'true';
      const staggerDelay = parseInt(element.dataset.staggerDelay || '100');

      const options: ScrollAnimationOptions = {
        threshold,
        rootMargin: '0px 0px -50px 0px',
        once,
        delay,
        stagger,
        staggerDelay
      };

      console.log(`[SCROLL-ANIMATION] Creating animation for element ${index + 1} with type:`, animationType);
      this.createAnimation(element, animationType, options);
    });
  }

  private setupStaggerGroups(): void {
    const staggerContainers = document.querySelectorAll('[data-stagger]');
    
    staggerContainers.forEach((container) => {
      const containerEl = container as HTMLElement;
      const staggerItems = containerEl.querySelectorAll('.stagger-item');
      const staggerDelay = parseInt(containerEl.dataset.staggerDelay || '100');
      
      if (staggerItems.length > 0) {
        const itemsArray = Array.from(staggerItems) as HTMLElement[];
        this.staggerGroups.set(containerEl, itemsArray);
        
        // Create observer for the container
        const observer = new IntersectionObserver(
          (entries) => this.handleStaggerIntersection(entries, itemsArray, staggerDelay),
          {
            threshold: 0.2,
            rootMargin: '0px 0px -50px 0px'
          }
        );
        
        observer.observe(containerEl);
      }
    });
  }

  private setupIndividualElements(): void {
    const scrollElements = document.querySelectorAll('.scroll-animate:not([data-scroll-animate])');
    
    scrollElements.forEach((element) => {
      const el = element as HTMLElement;
      this.createAnimation(el, 'fade-in-up', {
        threshold: 0.2,
        once: true
      });
    });
  }

  private setupSpecialAnimations(): void {
    // Setup counter animations
    this.setupCounterAnimations();
    
    // Setup progress bar animations
    this.setupProgressAnimations();
    
    // Setup typewriter animations
    this.setupTypewriterAnimations();
    
    // Setup color reveal animations
    this.setupColorRevealAnimations();
  }

  private createAnimation(element: HTMLElement, animationType: string, options: ScrollAnimationOptions): void {
    if (this.animations.has(element)) {
      console.log('[SCROLL-ANIMATION] Element already has animation, skipping:', element);
      return;
    }

    console.log('[SCROLL-ANIMATION] Creating animation for element:', {
      element: element,
      tagName: element.tagName,
      className: element.className,
      animationType: animationType,
      options: options
    });

    const config: AnimationConfig = {
      element,
      animationType,
      options,
      hasAnimated: false
    };

    // Create intersection observer
    const observerOptions = {
      threshold: options.threshold || 0.2,
      rootMargin: options.rootMargin || '0px 0px -50px 0px'
    };
    
    console.log('[SCROLL-ANIMATION] Creating IntersectionObserver with options:', observerOptions);
    
    const observer = new IntersectionObserver(
      (entries) => this.handleIntersection(entries, config),
      observerOptions
    );

    config.observer = observer;
    this.animations.set(element, config);
    
    console.log('[SCROLL-ANIMATION] Starting observation of element');
    observer.observe(element);
    
    console.log('[SCROLL-ANIMATION] Animation setup complete for element');
  }

  private handleIntersection(entries: IntersectionObserverEntry[], config: AnimationConfig): void {
    console.log('[SCROLL-ANIMATION] IntersectionObserver callback triggered with', entries.length, 'entries');
    
    entries.forEach((entry, index) => {
      console.log(`[SCROLL-ANIMATION] Entry ${index + 1}:`, {
        target: entry.target,
        isIntersecting: entry.isIntersecting,
        intersectionRatio: entry.intersectionRatio,
        boundingClientRect: entry.boundingClientRect,
        rootBounds: entry.rootBounds,
        hasAnimated: config.hasAnimated,
        animationType: config.animationType
      });
      
      if (entry.isIntersecting && !config.hasAnimated) {
        console.log('[SCROLL-ANIMATION] Element is intersecting and not yet animated, triggering animation');
        this.triggerAnimation(config);
        
        if (config.options.once) {
          console.log('[SCROLL-ANIMATION] Animation set to run once, marking as animated and unobserving');
          config.hasAnimated = true;
          config.observer?.unobserve(entry.target);
        }
      } else {
        console.log('[SCROLL-ANIMATION] No action taken for this intersection event');
      }
    });
  }

  private handleStaggerIntersection(entries: IntersectionObserverEntry[], items: HTMLElement[], staggerDelay: number): void {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        this.triggerStaggerAnimation(items, staggerDelay);
      }
    });
  }

  private triggerAnimation(config: AnimationConfig): void {
    const { element, animationType, options } = config;
    
    const delay = options.delay || 0;
    
    setTimeout(() => {
      // Apply animation class
      element.classList.add(`animate-${animationType}`);
      element.classList.add('animate-in');
      
      // Remove initial hidden state
      element.style.opacity = '';
      element.style.transform = '';
    }, delay);
  }

  private triggerStaggerAnimation(items: HTMLElement[], staggerDelay: number): void {
    items.forEach((item, index) => {
      setTimeout(() => {
        item.classList.add('animate-in');
      }, index * staggerDelay);
    });
  }

  private resetAnimation(config: AnimationConfig): void {
    const { element, animationType } = config;
    element.classList.remove(`animate-${animationType}`, 'animate-in');
    config.hasAnimated = false;
  }

  private setupCounterAnimations(): void {
    const counters = document.querySelectorAll('[data-count-target]');
    
    counters.forEach((counter) => {
      const element = counter as HTMLElement;
      const target = parseInt(element.dataset.countTarget || '0');
      const duration = parseInt(element.dataset.countDuration || '2000');
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.animateCounter(element, target, duration);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2 }
      );
      
      observer.observe(element);
    });
  }

  private animateCounter(element: HTMLElement, target: number, duration: number): void {
    let start = 0;
    const increment = target / (duration / 16); // 60fps
    
    const updateCounter = () => {
      start += increment;
      if (start < target) {
        element.textContent = Math.floor(start).toString();
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target.toString();
        element.classList.add('animate-count-up');
      }
    };
    
    updateCounter();
  }

  private setupProgressAnimations(): void {
    const progressBars = document.querySelectorAll('[data-progress-width]');
    
    progressBars.forEach((bar) => {
      const element = bar as HTMLElement;
      const width = element.dataset.progressWidth || '100%';
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              element.style.setProperty('--progress-width', width);
              element.classList.add('animate-progress');
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2 }
      );
      
      observer.observe(element);
    });
  }

  private setupTypewriterAnimations(): void {
    const typewriters = document.querySelectorAll('[data-typewriter-speed]');
    
    typewriters.forEach((typewriter) => {
      const element = typewriter as HTMLElement;
      const speed = parseInt(element.dataset.typewriterSpeed || '50');
      const text = element.textContent || '';
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.animateTypewriter(element, text, speed);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2 }
      );
      
      observer.observe(element);
    });
  }

  private animateTypewriter(element: HTMLElement, text: string, speed: number): void {
    element.textContent = '';
    element.classList.add('animate-typewriter');
    element.style.setProperty('--typewriter-steps', text.length.toString());
    
    let index = 0;
    const typeChar = () => {
      if (index < text.length) {
        element.textContent += text.charAt(index);
        index++;
        setTimeout(typeChar, speed);
      }
    };
    
    typeChar();
  }

  private setupColorRevealAnimations(): void {
    const colorReveals = document.querySelectorAll('[data-reveal-color]');
    
    colorReveals.forEach((reveal) => {
      const element = reveal as HTMLElement;
      const color = element.dataset.revealColor || 'blue';
      
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              element.classList.add(`animate-color-reveal-${color}`);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.2 }
      );
      
      observer.observe(element);
    });
  }

  private observeForNewContent(): void {
    // Observe for dynamically added content
    const bodyObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => {
          if (node.nodeType === Node.ELEMENT_NODE) {
            const element = node as HTMLElement;
            
            // Check if the added element or its children need animation
            const animatedElements = element.querySelectorAll('[data-scroll-animate], .scroll-animate, .stagger-item');
            if (animatedElements.length > 0 || element.hasAttribute('data-scroll-animate')) {
              // Re-run setup for new elements
              setTimeout(() => this.setupAnimations(), 100);
            }
          }
        });
      });
    });
    
    bodyObserver.observe(document.body, {
      childList: true,
      subtree: true
    });
  }

  // Public methods for manual control
  public addAnimation(element: HTMLElement, animationType: string, options: ScrollAnimationOptions = {}): void {
    this.createAnimation(element, animationType, options);
  }

  public removeAnimation(element: HTMLElement): void {
    const config = this.animations.get(element);
    if (config) {
      config.observer?.disconnect();
      this.animations.delete(element);
    }
  }

  public triggerElementAnimation(element: HTMLElement): void {
    const config = this.animations.get(element);
    if (config) {
      this.triggerAnimation(config);
    }
  }

  public resetElementAnimation(element: HTMLElement): void {
    const config = this.animations.get(element);
    if (config) {
      this.resetAnimation(config);
    }
  }

  // Cleanup method
  public destroy(): void {
    this.animations.forEach((config) => {
      config.observer?.disconnect();
    });
    this.animations.clear();
    this.staggerGroups.clear();
  }
}

// Auto-initialize when script loads
let scrollAnimationController: ScrollAnimationController;

console.log('[SCROLL-ANIMATION] Script loaded, checking environment...');
console.log('[SCROLL-ANIMATION] typeof window:', typeof window);
console.log('[SCROLL-ANIMATION] window exists:', typeof window !== 'undefined');

if (typeof window !== 'undefined') {
  console.log('[SCROLL-ANIMATION] Window available, creating ScrollAnimationController...');
  scrollAnimationController = new ScrollAnimationController();
  console.log('[SCROLL-ANIMATION] ScrollAnimationController created:', scrollAnimationController);
  
  // Make controller available globally for debugging/manual control
  (window as any).scrollAnimationController = scrollAnimationController;
  console.log('[SCROLL-ANIMATION] Controller attached to window.scrollAnimationController');
  
  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    console.log('[SCROLL-ANIMATION] Page unloading, destroying controller');
    scrollAnimationController?.destroy();
  });
  
  console.log('[SCROLL-ANIMATION] Auto-initialization complete');
} else {
  console.warn('[SCROLL-ANIMATION] Window not available, skipping initialization');
}

export default ScrollAnimationController;
export { ScrollAnimationController };