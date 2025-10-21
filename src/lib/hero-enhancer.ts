// Hero Enhancement Module - Optimized with consolidated CSS
export class HeroEnhancer {
  private observer: IntersectionObserver | null = null;
  private cursorTrail: HTMLElement[] = [];
  private isInitialized = false;
  private animationFrameId: number | null = null;
  private lastMouseX = 0;
  private lastMouseY = 0;

  constructor() {
    this.init();
  }

  init() {
    if (this.isInitialized) return;

    this.setupIntersectionObserver();
    this.setupCursorEffects();
    this.isInitialized = true;
  }

  setupIntersectionObserver() {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.enhanceHeroSection(entry.target as HTMLElement);
          }
        });
      },
      { threshold: 0.1 },
    );

    // Observe hero sections
    document.querySelectorAll("[data-hero]").forEach((hero) => {
      this.observer?.observe(hero);
    });
  }

  enhanceHeroSection(hero: HTMLElement) {
    // Add consolidated animation classes from main.css
    hero.classList.add("animate-fade-in", "gpu-accelerated");

    // Enhanced text animations using consolidated system
    const headings = hero.querySelectorAll("h1, h2");
    headings.forEach((heading, index) => {
      heading.classList.add("animate-slide-in-left");
      (heading as HTMLElement).style.animationDelay = `${index * 0.2}s`;
    });

    // Enhanced button animations
    const buttons = hero.querySelectorAll("button, .button");
    buttons.forEach((button, index) => {
      button.classList.add("animate-bounce-in");
      (button as HTMLElement).style.animationDelay = `${0.5 + index * 0.1}s`;
    });

    // Add magnetic hover effects
    this.addMagneticHover(hero);
  }

  addMagneticHover(container: HTMLElement) {
    const magneticElements = container.querySelectorAll(
      ".button, [data-magnetic]",
    );

    magneticElements.forEach((element) => {
      element.addEventListener("mouseenter", () => {
        element.classList.add("animate-glow-pulse");
      });

      element.addEventListener("mouseleave", () => {
        element.classList.remove("animate-glow-pulse");
      });
    });
  }

  setupCursorEffects() {
    let isTrailActive = false;

    document.addEventListener("mousemove", (e) => {
      this.lastMouseX = e.clientX;
      this.lastMouseY = e.clientY;

      if (
        !isTrailActive &&
        this.shouldShowCursorTrail(e.target as HTMLElement)
      ) {
        isTrailActive = true;
        this.createCursorTrail();
        this.startTrailAnimation();
      } else if (
        isTrailActive &&
        !this.shouldShowCursorTrail(e.target as HTMLElement)
      ) {
        isTrailActive = false;
        this.stopTrailAnimation();
      }
    });
  }

  shouldShowCursorTrail(target: HTMLElement): boolean {
    return (
      target.closest("[data-hero]") !== null ||
      target.closest(".button") !== null ||
      target.closest("[data-magnetic]") !== null
    );
  }

  createCursorTrail() {
    // Clear existing trail
    this.cursorTrail.forEach((trail) => trail.remove());
    this.cursorTrail = [];

    // Create new trail elements
    for (let i = 0; i < 5; i++) {
      const trail = document.createElement("div");
      trail.className = "cursor-trail";
      trail.style.cssText = `
        position: fixed;
        width: 8px;
        height: 8px;
        background: radial-gradient(circle, hsl(var(--primary)) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: var(--z-tooltip);
        opacity: 0;
        transition: opacity 0.3s ease;
        will-change: transform, opacity;
      `;
      document.body.appendChild(trail);
      this.cursorTrail.push(trail);
    }
  }

  startTrailAnimation() {
    const animate = () => {
      this.updateCursorTrail(this.lastMouseX, this.lastMouseY);
      this.animationFrameId = requestAnimationFrame(animate);
    };
    animate();
  }

  stopTrailAnimation() {
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    // Fade out trail
    this.cursorTrail.forEach((trail, index) => {
      setTimeout(() => {
        trail.style.opacity = "0";
        setTimeout(() => trail.remove(), 300);
      }, index * 50);
    });
    this.cursorTrail = [];
  }

  updateCursorTrail(mouseX: number, mouseY: number) {
    this.cursorTrail.forEach((trail, index) => {
      setTimeout(() => {
        trail.style.left = mouseX + "px";
        trail.style.top = mouseY + "px";
        trail.style.opacity = (1 - index * 0.2).toString();
        trail.style.transform = `scale(${1 - index * 0.15})`;
      }, index * 20);
    });
  }

  // Enhanced typewriter effect using consolidated animations
  createTypewriterEffect(element: HTMLElement, text: string, speed = 100) {
    element.innerHTML = "";
    element.classList.add("animate-typewriter");

    let i = 0;
    const typeInterval = setInterval(() => {
      element.innerHTML =
        text.slice(0, i + 1) +
        '<span class="animate-typewriter-blink">|</span>';
      i++;

      if (i >= text.length) {
        clearInterval(typeInterval);
        setTimeout(() => {
          element.innerHTML = text;
        }, 1000);
      }
    }, speed);
  }

  // Cleanup method
  destroy() {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    this.cursorTrail.forEach((trail) => trail.remove());
    this.cursorTrail = [];
    this.isInitialized = false;
  }
}

// Auto-initialize when DOM is ready
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => new HeroEnhancer());
  } else {
    new HeroEnhancer();
  }
}
