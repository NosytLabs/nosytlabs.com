/**
 * Button Animations
 *
 * Provides enhanced button animations including hover effects,
 * click animations, and glow effects.
 *
 * @module animations/buttons
 */

// ========================================
// BUTTON ANIMATOR CLASS
// ========================================

/**
 * Button Animator
 * Handles enhanced button animations and interactions.
 *
 * @example
 * ```typescript
 * ButtonAnimator.enhanceButtons('.btn-primary');
 * ButtonAnimator.enhanceButtons(); // Uses default selector
 * ```
 */
export class ButtonAnimator {
  /**
   * Enhance buttons with animations
   *
   * @param selector - CSS selector for buttons (default: '.btn-enhanced')
   */
  public static enhanceButtons(selector: string = ".button"): void {
    if (typeof document === "undefined") return;

    const buttons = document.querySelectorAll(selector);

    buttons.forEach((button) => {
      const buttonElement = button as HTMLElement;

      // Add consolidated classes from main.css
      buttonElement.classList.add("gpu-accelerated");

      // Enhanced hover effects
      buttonElement.addEventListener("mouseenter", () => {
        buttonElement.classList.add("animate-glow-pulse");
      });

      buttonElement.addEventListener("mouseleave", () => {
        buttonElement.classList.remove("animate-glow-pulse");
      });

      // Click animation
      buttonElement.addEventListener("click", () => {
        buttonElement.classList.add("animate-bounce-in");
        setTimeout(() => {
          buttonElement.classList.remove("animate-bounce-in");
        }, 300);
      });
    });
  }

  /**
   * Add ripple effect to button
   *
   * @param button - Button element
   */
  public static addRippleEffect(button: HTMLElement): void {
    button.addEventListener("click", (event) => {
      const ripple = document.createElement("span");
      ripple.classList.add("ripple");

      const rect = button.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = (event as MouseEvent).clientX - rect.left - size / 2;
      const y = (event as MouseEvent).clientY - rect.top - size / 2;

      ripple.style.width = ripple.style.height = `${size}px`;
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;

      button.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  }

  /**
   * Add loading state to button
   *
   * @param button - Button element
   * @param loading - Loading state
   */
  public static setLoadingState(button: HTMLElement, loading: boolean): void {
    if (loading) {
      button.classList.add("loading");
      button.setAttribute("disabled", "true");
    } else {
      button.classList.remove("loading");
      button.removeAttribute("disabled");
    }
  }

  /**
   * Add success animation to button
   *
   * @param button - Button element
   * @param duration - Animation duration in ms
   */
  public static showSuccess(
    button: HTMLElement,
    duration: number = 2000,
  ): void {
    button.classList.add("success");
    setTimeout(() => {
      button.classList.remove("success");
    }, duration);
  }

  /**
   * Add error animation to button
   *
   * @param button - Button element
   * @param duration - Animation duration in ms
   */
  public static showError(button: HTMLElement, duration: number = 2000): void {
    button.classList.add("error");
    setTimeout(() => {
      button.classList.remove("error");
    }, duration);
  }
}
