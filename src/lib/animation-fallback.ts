/**
 * Animation Fallback System
 * Ensures content is always visible even if animations fail
 */

export class AnimationFallback {
  private static instance: AnimationFallback;
  private checkInterval: number | null = null;
  private initialized = false;

  static getInstance(): AnimationFallback {
    if (!AnimationFallback.instance) {
      AnimationFallback.instance = new AnimationFallback();
    }
    return AnimationFallback.instance;
  }

  init(): void {
    if (this.initialized) return;

    this.initialized = true;

    // Check immediately after DOM is loaded
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () =>
        this.checkAnimations(),
      );
    } else {
      this.checkAnimations();
    }

    // Set up periodic checks for dynamically added content
    this.startPeriodicChecks();
  }

  private checkAnimations(): void {
    const animatedElements = document.querySelectorAll(
      ".animate-fade-in-up, .animate-fade-in, .animate-slide-up, .animate-scale-in",
    );

    animatedElements.forEach((element) => {
      this.ensureElementVisible(element as HTMLElement);
    });
  }

  private ensureElementVisible(element: HTMLElement): void {
    try {
      const computedStyle = window.getComputedStyle(element);
      const opacity = parseFloat(computedStyle.opacity);

      // If element is invisible and should be visible by now
      if (opacity < 0.1) {
        const animationDelay = this.getAnimationDelay(element);
        const animationDuration = this.getAnimationDuration(element);
        const totalTime = animationDelay + animationDuration;

        // Check if enough time has passed for animation to complete
        setTimeout(
          () => {
            try {
              const currentOpacity = parseFloat(
                window.getComputedStyle(element).opacity,
              );
              if (currentOpacity < 0.1) {
                // Silently make element visible without console warning
                this.makeElementVisible(element);
              }
            } catch (_error) {
              // Fallback: make element visible immediately
              this.makeElementVisible(element);
            }
          },
          Math.max(totalTime + 500, 2000),
        ); // Wait at least 2 seconds
      }
    } catch (_error) {
      // If any error occurs, make element visible immediately
      this.makeElementVisible(element);
    }
  }

  private getAnimationDelay(element: HTMLElement): number {
    const style = element.style.animationDelay || "0s";
    return parseFloat(style) * 1000; // Convert to milliseconds
  }

  private getAnimationDuration(element: HTMLElement): number {
    const computedStyle = window.getComputedStyle(element);
    const duration = computedStyle.animationDuration || "0.6s";
    return parseFloat(duration) * 1000; // Convert to milliseconds
  }

  private makeElementVisible(element: HTMLElement): void {
    element.style.opacity = "1";
    element.style.transform = "translateY(0) scale(1)";
    element.style.transition = "opacity 0.3s ease, transform 0.3s ease";
    element.classList.add("animation-fallback-applied");
  }

  private startPeriodicChecks(): void {
    // Check every 5 seconds for new content
    this.checkInterval = window.setInterval(() => {
      this.checkAnimations();
    }, 5000);
  }

  destroy(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
    this.initialized = false;
  }
}

// Auto-initialize when module is loaded
if (typeof window !== "undefined") {
  AnimationFallback.getInstance().init();
}

export default AnimationFallback;
