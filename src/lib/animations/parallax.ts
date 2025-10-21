/**
 * Parallax Animation Module
 *
 * Provides parallax scrolling effects for elements.
 *
 * @module animations/parallax
 */

/**
 * Parallax options configuration
 */
export interface ParallaxOptions {
  speed?: number;
  direction?: "up" | "down" | "left" | "right";
  offset?: number;
  threshold?: number;
}

/**
 * Parallax Animator
 * Handles parallax scrolling effects for elements.
 */
export class ParallaxAnimator {
  private elements: Map<Element, ParallaxOptions> = new Map();
  private isActive = false;
  private rafId?: number;

  constructor() {
    this.handleScroll = this.handleScroll.bind(this);
  }

  /**
   * Add element for parallax animation
   */
  public addElement(element: Element, options: ParallaxOptions = {}): void {
    const config: ParallaxOptions = {
      speed: 0.5,
      direction: "up",
      offset: 0,
      threshold: 0.1,
      ...options,
    };

    this.elements.set(element, config);

    if (!this.isActive) {
      this.start();
    }
  }

  /**
   * Remove element from parallax animation
   */
  public removeElement(element: Element): void {
    this.elements.delete(element);

    if (this.elements.size === 0) {
      this.stop();
    }
  }

  /**
   * Start parallax animations
   */
  public start(): void {
    if (this.isActive) return;

    this.isActive = true;
    this.handleScroll();
  }

  /**
   * Stop parallax animations
   */
  public stop(): void {
    this.isActive = false;

    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = undefined;
    }
  }

  /**
   * Handle scroll event
   */
  private handleScroll(): void {
    if (!this.isActive) return;

    const scrollY = window.scrollY;
    const windowHeight = window.innerHeight;

    this.elements.forEach((options, element) => {
      const rect = element.getBoundingClientRect();
      const elementTop = rect.top + scrollY;
      const elementHeight = rect.height;

      // Check if element is in viewport
      if (rect.bottom >= 0 && rect.top <= windowHeight) {
        const progress =
          (scrollY - elementTop + windowHeight) /
          (windowHeight + elementHeight);
        const clampedProgress = Math.max(0, Math.min(1, progress));

        let transform = "";
        const movement = (clampedProgress - 0.5) * options.speed! * 100;

        switch (options.direction) {
          case "up":
            transform = `translateY(${-movement}px)`;
            break;
          case "down":
            transform = `translateY(${movement}px)`;
            break;
          case "left":
            transform = `translateX(${-movement}px)`;
            break;
          case "right":
            transform = `translateX(${movement}px)`;
            break;
        }

        (element as HTMLElement).style.transform = transform;
      }
    });

    this.rafId = requestAnimationFrame(() => this.handleScroll());
  }

  /**
   * Destroy the parallax animator
   */
  public destroy(): void {
    this.stop();
    this.elements.clear();
  }
}
