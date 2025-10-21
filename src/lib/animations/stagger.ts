/**
 * Staggered Animations
 *
 * Provides staggered animation utilities for animating multiple
 * elements with sequential delays.
 *
 * @module animations/stagger
 */

// ========================================
// STAGGERED ANIMATOR CLASS
// ========================================

/**
 * Staggered Animator
 * Handles staggered animations for multiple elements.
 *
 * @example
 * ```typescript
 * StaggeredAnimator.animateElements('.card', 'animate-fade-in', 0.1);
 * StaggeredAnimator.animateServiceCards();
 * ```
 */
export class StaggeredAnimator {
  /**
   * Animate elements with staggered delay
   *
   * @param selector - CSS selector for elements
   * @param animationClass - Animation class to add
   * @param staggerDelay - Delay between each element (in seconds)
   */
  public static animateElements(
    selector: string,
    animationClass: string = "animate-fade-in",
    staggerDelay: number = 0.1,
  ): void {
    if (typeof document === "undefined") return;

    const elements = document.querySelectorAll(selector);

    elements.forEach((element, index) => {
      const htmlElement = element as HTMLElement;
      htmlElement.style.animationDelay = `${index * staggerDelay}s`;
      htmlElement.classList.add(animationClass, "gpu-accelerated");
    });
  }

  /**
   * Animate service cards
   */
  public static animateServiceCards(): void {
    this.animateElements(".service-card", "animate-slide-in-left", 0.2);
  }

  /**
   * Animate testimonials
   */
  public static animateTestimonials(): void {
    this.animateElements(".testimonial-card", "animate-fade-in", 0.15);
  }

  /**
   * Animate FAQ items
   */
  public static animateFAQItems(): void {
    this.animateElements(".faq-item", "animate-bounce-in", 0.1);
  }

  /**
   * Animate process steps
   */
  public static animateProcessSteps(): void {
    this.animateElements(".process-step", "animate-slide-in-left", 0.3);
  }

  /**
   * Animate list items
   *
   * @param selector - CSS selector for list items
   * @param animationClass - Animation class to add
   * @param staggerDelay - Delay between each item
   */
  public static animateList(
    selector: string,
    animationClass: string = "animate-fade-in",
    staggerDelay: number = 0.05,
  ): void {
    this.animateElements(selector, animationClass, staggerDelay);
  }

  /**
   * Animate grid items
   *
   * @param selector - CSS selector for grid items
   * @param animationClass - Animation class to add
   * @param staggerDelay - Delay between each item
   */
  public static animateGrid(
    selector: string,
    animationClass: string = "animate-scale-in",
    staggerDelay: number = 0.08,
  ): void {
    this.animateElements(selector, animationClass, staggerDelay);
  }
}
