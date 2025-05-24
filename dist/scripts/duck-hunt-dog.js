/**
 * Duck Hunt Dog
 * 
 * This file contains the code for the Duck Hunt dog character.
 * The dog appears at the start of the game, when a duck is shot,
 * and when a duck escapes.
 */

class DuckHuntDog {
  /**
   * Create a new Duck Hunt dog
   * @param {Object} options - Configuration options
   * @param {HTMLElement} options.container - Container element for the dog
   * @param {Function} options.onComplete - Callback when animation completes
   */
  constructor(options) {
    this.container = options.container;
    this.onComplete = options.onComplete || (() => {});
    
    // Create dog element
    this.element = document.createElement('canvas');
    this.element.className = 'duck-hunt-dog';
    this.element.width = 128;
    this.element.height = 128;
    
    // Set up canvas context
    this.ctx = this.element.getContext('2d');
    
    // Set up styles
    Object.assign(this.element.style, {
      position: 'absolute',
      bottom: '0',
      left: '50%',
      transform: 'translateX(-50%)',
      width: '128px',
      height: '128px',
      zIndex: '20',
      pointerEvents: 'none'
    });
    
    // Create animators
    this.animators = {
      sniff: new SpriteAnimator({
        spriteSheet: '/images/win95/dog/sniff.png',
        frameWidth: 128,
        frameHeight: 128,
        frameCount: 4,
        frameDuration: 200,
        loop: true,
        autoplay: false
      }),
      jump: new SpriteAnimator({
        spriteSheet: '/images/win95/dog/jump.png',
        frameWidth: 128,
        frameHeight: 128,
        frameCount: 3,
        frameDuration: 150,
        loop: false,
        autoplay: false
      }),
      catch: new SpriteAnimator({
        spriteSheet: '/images/win95/dog/catch.png',
        frameWidth: 128,
        frameHeight: 128,
        frameCount: 1,
        frameDuration: 500,
        loop: false,
        autoplay: false
      }),
      laugh: new SpriteAnimator({
        spriteSheet: '/images/win95/dog/laugh.png',
        frameWidth: 128,
        frameHeight: 128,
        frameCount: 2,
        frameDuration: 200,
        loop: true,
        autoplay: false
      })
    };
    
    // Set up state
    this.currentAnimation = null;
    this.animationId = null;
    this.lastUpdate = Date.now();
    this.isVisible = false;
  }
  
  /**
   * Show the dog with a specific animation
   * @param {string} animation - Animation name (sniff, jump, catch, laugh)
   * @param {Object} options - Animation options
   * @param {number} options.duration - Duration in milliseconds
   * @param {boolean} options.loop - Whether to loop the animation
   * @param {Function} options.onComplete - Callback when animation completes
   */
  show(animation = 'sniff', options = {}) {
    // Default options
    const defaultOptions = {
      duration: 2000,
      loop: false,
      onComplete: this.onComplete
    };
    
    // Merge options
    const animOptions = { ...defaultOptions, ...options };
    
    // Stop any current animation
    this.stop();
    
    // Get animator
    const animator = this.animators[animation];
    if (!animator) {
      console.error(`Animation not found: ${animation}`);
      return;
    }
    
    // Set current animation
    this.currentAnimation = animation;
    
    // Reset animator
    animator.stop();
    animator.play(true);
    
    // Add to container if not already
    if (!this.element.parentNode) {
      this.container.appendChild(this.element);
    }
    
    // Show element
    this.element.style.display = 'block';
    this.isVisible = true;
    
    // Start animation loop
    this.lastUpdate = Date.now();
    this.animate();
    
    // Set up auto-hide
    if (!animOptions.loop) {
      setTimeout(() => {
        this.hide();
        animOptions.onComplete();
      }, animOptions.duration);
    }
    
    // Return this for chaining
    return this;
  }
  
  /**
   * Hide the dog
   */
  hide() {
    // Stop animation
    this.stop();
    
    // Hide element
    this.element.style.display = 'none';
    this.isVisible = false;
    
    // Return this for chaining
    return this;
  }
  
  /**
   * Stop the current animation
   */
  stop() {
    // Cancel animation frame
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    
    // Return this for chaining
    return this;
  }
  
  /**
   * Animation loop
   */
  animate() {
    // Skip if not visible
    if (!this.isVisible) return;
    
    // Get current animator
    const animator = this.animators[this.currentAnimation];
    if (!animator) return;
    
    // Calculate delta time
    const now = Date.now();
    const deltaTime = now - this.lastUpdate;
    this.lastUpdate = now;
    
    // Update animation
    animator.update(deltaTime);
    
    // Clear canvas
    this.ctx.clearRect(0, 0, this.element.width, this.element.height);
    
    // Draw sprite
    animator.draw(this.ctx, 0, 0, this.element.width, this.element.height);
    
    // Continue animation
    this.animationId = requestAnimationFrame(() => this.animate());
  }
  
  /**
   * Play the intro sequence
   * @param {Function} onComplete - Callback when sequence completes
   */
  playIntro(onComplete = () => {}) {
    // Show sniffing animation
    this.show('sniff', {
      duration: 1500,
      onComplete: () => {
        // Jump animation
        this.show('jump', {
          duration: 1000,
          onComplete
        });
      }
    });
    
    // Return this for chaining
    return this;
  }
  
  /**
   * Play the catch sequence
   * @param {Function} onComplete - Callback when sequence completes
   */
  playCatch(onComplete = () => {}) {
    // Show catch animation
    this.show('catch', {
      duration: 1000,
      onComplete
    });
    
    // Return this for chaining
    return this;
  }
  
  /**
   * Play the laugh sequence
   * @param {Function} onComplete - Callback when sequence completes
   */
  playLaugh(onComplete = () => {}) {
    // Show laugh animation
    this.show('laugh', {
      duration: 1500,
      loop: true,
      onComplete
    });
    
    // Return this for chaining
    return this;
  }
}

// Export for ES modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DuckHuntDog;
} else if (typeof window !== 'undefined') {
  window.DuckHuntDog = DuckHuntDog;
}
