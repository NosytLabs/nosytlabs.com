/**
 * Sprite Animator
 * 
 * A utility class for handling sprite sheet animations.
 * This class manages the animation of sprite sheets, including
 * frame timing, looping, and direction.
 */

class SpriteAnimator {
  /**
   * Create a new sprite animator
   * @param {Object} options - Configuration options
   * @param {string} options.spriteSheet - Path to the sprite sheet image
   * @param {number} options.frameWidth - Width of each frame in pixels
   * @param {number} options.frameHeight - Height of each frame in pixels
   * @param {number} options.frameCount - Total number of frames in the animation
   * @param {number} options.frameDuration - Duration of each frame in milliseconds
   * @param {boolean} options.loop - Whether the animation should loop
   * @param {number} options.startFrame - Frame to start the animation from
   * @param {number} options.endFrame - Frame to end the animation at
   * @param {boolean} options.autoplay - Whether to start playing immediately
   */
  constructor(options) {
    this.spriteSheet = options.spriteSheet;
    this.frameWidth = options.frameWidth || 64;
    this.frameHeight = options.frameHeight || 64;
    this.frameCount = options.frameCount || 1;
    this.frameDuration = options.frameDuration || 100;
    this.loop = options.loop !== undefined ? options.loop : true;
    this.startFrame = options.startFrame || 0;
    this.endFrame = options.endFrame || this.frameCount - 1;
    this.autoplay = options.autoplay !== undefined ? options.autoplay : true;
    
    // Internal state
    this.currentFrame = this.startFrame;
    this.lastFrameTime = 0;
    this.isPlaying = this.autoplay;
    this.isReversed = false;
    this.onComplete = null;
    this.onLoop = null;
    
    // Load sprite sheet
    this.image = new Image();
    this.image.src = this.spriteSheet;
    this.image.onload = () => {
      this.framesPerRow = Math.floor(this.image.width / this.frameWidth);
      this.loaded = true;
    };
    this.image.onerror = (error) => {
      console.error('Error loading sprite sheet:', error);
      this.loaded = false;
    };
  }
  
  /**
   * Update the animation
   * @param {number} deltaTime - Time since last update in milliseconds
   */
  update(deltaTime) {
    if (!this.loaded || !this.isPlaying) return;
    
    this.lastFrameTime += deltaTime;
    
    if (this.lastFrameTime >= this.frameDuration) {
      this.lastFrameTime = 0;
      
      // Update frame
      if (!this.isReversed) {
        this.currentFrame++;
        if (this.currentFrame > this.endFrame) {
          if (this.loop) {
            this.currentFrame = this.startFrame;
            if (this.onLoop) this.onLoop();
          } else {
            this.currentFrame = this.endFrame;
            this.isPlaying = false;
            if (this.onComplete) this.onComplete();
          }
        }
      } else {
        this.currentFrame--;
        if (this.currentFrame < this.startFrame) {
          if (this.loop) {
            this.currentFrame = this.endFrame;
            if (this.onLoop) this.onLoop();
          } else {
            this.currentFrame = this.startFrame;
            this.isPlaying = false;
            if (this.onComplete) this.onComplete();
          }
        }
      }
    }
  }
  
  /**
   * Draw the current frame
   * @param {CanvasRenderingContext2D} ctx - Canvas context to draw on
   * @param {number} x - X position to draw at
   * @param {number} y - Y position to draw at
   * @param {number} width - Width to draw the frame
   * @param {number} height - Height to draw the frame
   * @param {boolean} flipX - Whether to flip the frame horizontally
   * @param {boolean} flipY - Whether to flip the frame vertically
   */
  draw(ctx, x, y, width, height, flipX = false, flipY = false) {
    if (!this.loaded) return;
    
    const frameX = (this.currentFrame % this.framesPerRow) * this.frameWidth;
    const frameY = Math.floor(this.currentFrame / this.framesPerRow) * this.frameHeight;
    
    // Save context state
    ctx.save();
    
    // Set up transformation for flipping
    if (flipX || flipY) {
      ctx.translate(
        x + (flipX ? width : 0),
        y + (flipY ? height : 0)
      );
      ctx.scale(
        flipX ? -1 : 1,
        flipY ? -1 : 1
      );
      x = 0;
      y = 0;
    }
    
    // Draw the frame
    ctx.drawImage(
      this.image,
      frameX, frameY,
      this.frameWidth, this.frameHeight,
      x, y,
      width || this.frameWidth,
      height || this.frameHeight
    );
    
    // Restore context state
    ctx.restore();
  }
  
  /**
   * Play the animation
   * @param {boolean} reset - Whether to reset to the start frame
   */
  play(reset = false) {
    if (reset) this.currentFrame = this.startFrame;
    this.isPlaying = true;
  }
  
  /**
   * Pause the animation
   */
  pause() {
    this.isPlaying = false;
  }
  
  /**
   * Stop the animation and reset to the start frame
   */
  stop() {
    this.isPlaying = false;
    this.currentFrame = this.startFrame;
  }
  
  /**
   * Reverse the animation direction
   */
  reverse() {
    this.isReversed = !this.isReversed;
  }
  
  /**
   * Set the animation to a specific frame
   * @param {number} frame - Frame to set to
   */
  setFrame(frame) {
    this.currentFrame = Math.max(this.startFrame, Math.min(this.endFrame, frame));
  }
  
  /**
   * Set a callback to be called when the animation completes
   * @param {Function} callback - Function to call
   */
  setOnComplete(callback) {
    this.onComplete = callback;
  }
  
  /**
   * Set a callback to be called when the animation loops
   * @param {Function} callback - Function to call
   */
  setOnLoop(callback) {
    this.onLoop = callback;
  }
}

// Export for ES modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SpriteAnimator;
} else if (typeof window !== 'undefined') {
  window.SpriteAnimator = SpriteAnimator;
}
