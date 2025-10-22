// Enhanced blog card interactions - Optimized with consolidated CSS
interface BlogCardEnhancer {
  cards: NodeListOf<Element> | null;
  observer: IntersectionObserver | null;
  init(): void;
  setup(): void;
  bindEvents(): void;
  addParallaxEffect(): void;
  addMouseTracker(): void;
  destroy(): void;
}

export class BlogCardEnhancerImpl implements BlogCardEnhancer {
  cards: NodeListOf<Element> | null = null;
  observer: IntersectionObserver | null = null;
  private animationFrameId: number | null = null;
  private isInitialized = false;

  constructor() {
    this.init();
  }

  init(): void {
    if (this.isInitialized) return;

    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", () => this.setup());
    } else {
      this.setup();
    }
  }

  setup(): void {
    this.cards = document.querySelectorAll("[data-blog-card]");
    if (!this.cards || this.cards.length === 0) return;

    this.bindEvents();
    this.addParallaxEffect();
    this.addMouseTracker();
    this.isInitialized = true;
  }

  bindEvents(): void {
    if (!this.cards) return;

    this.cards.forEach((card, index) => {
      const cardElement = card as HTMLElement;

      // Add smooth animations
      cardElement.style.animationDelay = `${index * 150}ms`;
      cardElement.classList.add("animate-fade-in", "transition-smooth");

      // Enhanced keyboard navigation
      cardElement.setAttribute("tabindex", "0");

      cardElement.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          const link = cardElement.querySelector("a");
          if (link) link.click();
        }
      });

      // Enhanced hover effects using consolidated classes
      cardElement.addEventListener("mouseenter", () => {
        cardElement.classList.add("animate-glow-pulse");
      });

      cardElement.addEventListener("mouseleave", () => {
        cardElement.classList.remove("animate-glow-pulse");
      });

      // Focus management
      cardElement.addEventListener("focus", () => {
        cardElement.classList.add("focus-visible");
      });

      cardElement.addEventListener("blur", () => {
        cardElement.classList.remove("focus-visible");
      });
    });
  }

  addParallaxEffect(): void {
    if (!this.cards) return;

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const card = entry.target as HTMLElement;

          if (entry.isIntersecting) {
            card.classList.add("animate-slide-in-left");

            // Add staggered animation for child elements
            const childElements = card.querySelectorAll("img, h3, p, .button");
            childElements.forEach((child, index) => {
              (child as HTMLElement).style.animationDelay = `${index * 0.1}s`;
              child.classList.add("animate-fade-in");
            });
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "50px 0px",
      },
    );

    this.cards.forEach((card) => {
      this.observer?.observe(card);
    });
  }

  addMouseTracker(): void {
    if (!this.cards) return;

    this.cards.forEach((card) => {
      const cardElement = card as HTMLElement;

      cardElement.addEventListener("mousemove", () => {
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches)
          return;

        // Simple scale effect instead of 3D rotation
        cardElement.style.transform = "scale(1.02)";
      });

      cardElement.addEventListener("mouseleave", () => {
        cardElement.style.transform = "scale(1)";
      });
    });
  }

  // Enhanced image loading with progressive enhancement
  enhanceImages(): void {
    if (!this.cards) return;

    this.cards.forEach((card) => {
      const images = card.querySelectorAll("img[data-src]");

      images.forEach((img) => {
        const imageElement = img as HTMLImageElement;

        // Lazy loading with intersection observer
        const imageObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const image = entry.target as HTMLImageElement;
                const src = image.getAttribute("data-src");

                if (src) {
                  image.src = src;
                  image.classList.add("animate-fade-in");
                  image.removeAttribute("data-src");
                  imageObserver.unobserve(image);
                }
              }
            });
          },
          { threshold: 0.1 },
        );

        imageObserver.observe(imageElement);
      });
    });
  }

  // Performance optimization
  optimizePerformance(): void {
    // Use requestAnimationFrame for smooth animations
    const optimizeAnimation = () => {
      if (!this.cards) return;

      this.cards.forEach((card) => {
        const cardElement = card as HTMLElement;

        // Add will-change for better performance
        cardElement.classList.add("will-change-transform");

        // Remove will-change after animation completes
        cardElement.addEventListener(
          "animationend",
          () => {
            cardElement.classList.remove("will-change-transform");
          },
          { once: true },
        );
      });
    };

    this.animationFrameId = requestAnimationFrame(optimizeAnimation);
  }

  destroy(): void {
    if (this.observer) {
      this.observer.disconnect();
      this.observer = null;
    }

    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }

    // Clean up event listeners
    if (this.cards) {
      this.cards.forEach((card) => {
        const cardElement = card as HTMLElement;
        cardElement.style.transform = "";
        cardElement.classList.remove(
          "animate-fade-in",
          "animate-slide-in-left",
          "animate-glow-pulse",
          "card-hover",
          "gpu-accelerated",
          "will-change-transform",
        );
      });
    }

    this.cards = null;
    this.isInitialized = false;
  }
}

// Auto-initialize when DOM is ready
if (typeof document !== "undefined") {
  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      () => new BlogCardEnhancerImpl(),
    );
  } else {
    new BlogCardEnhancerImpl();
  }
}

// Blog card enhancer with simplified hover effects
export function enhanceBlogCards() {
  const blogCards = document.querySelectorAll(".blog-card");

  blogCards.forEach((card) => {
    const cardElement = card as HTMLElement;

    // Simple hover effects without 3D transforms
    cardElement.addEventListener("mouseenter", () => {
      cardElement.style.transition = "all 0.3s ease";
      cardElement.style.borderColor = "var(--primary-color, #3b82f6)";
      cardElement.style.backgroundColor =
        "var(--card-hover-bg, rgba(255, 255, 255, 0.1))";
    });

    cardElement.addEventListener("mouseleave", () => {
      cardElement.style.transition = "all 0.3s ease";
      cardElement.style.borderColor = "";
      cardElement.style.backgroundColor = "";
    });
  });
}

// Initialize on DOM load
document.addEventListener("DOMContentLoaded", enhanceBlogCards);

// Re-initialize on page navigation
document.addEventListener("astro:page-load", enhanceBlogCards);
