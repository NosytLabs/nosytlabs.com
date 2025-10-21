// Complex Animations Module
// Handles advanced and complex animations

export function initComplexAnimations() {
  // Check for reduced motion preference
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;

  if (prefersReducedMotion) {
    return;
  }

  // Setup complex scroll animations
  setupComplexScrollEffects();

  // Setup morphing animations
  setupMorphingEffects();

  // Setup particle effects
  setupParticleEffects();
}

function setupComplexScrollEffects() {
  // Advanced parallax with multiple layers
  const parallaxElements = document.querySelectorAll("[data-parallax]");

  function updateParallax() {
    const scrollY = window.scrollY;

    parallaxElements.forEach((element) => {
      const speed = parseFloat(element.dataset.parallax) || 0.5;
      const yPos = -(scrollY * speed);
      element.style.transform = `translate3d(0, ${yPos}px, 0)`;
    });
  }

  let ticking = false;
  function requestParallaxUpdate() {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }

  window.addEventListener("scroll", requestParallaxUpdate, { passive: true });
}

function setupMorphingEffects() {
  // SVG morphing animations
  const morphElements = document.querySelectorAll("[data-morph]");

  morphElements.forEach((element) => {
    element.addEventListener("mouseenter", () => {
      element.style.transition =
        "all 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)";
      element.style.transform = "scale(1.1) rotate(5deg)";
    });

    element.addEventListener("mouseleave", () => {
      element.style.transform = "scale(1) rotate(0deg)";
    });
  });
}

function setupParticleEffects() {
  // Simple particle system for backgrounds
  const particleContainers = document.querySelectorAll("[data-particles]");

  particleContainers.forEach((container) => {
    createParticleSystem(container);
  });
}

function createParticleSystem(container) {
  const particleCount = 20;
  const particles = [];

  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement("div");
    particle.className = "particle";
    particle.style.cssText = `
      position: absolute;
      width: 4px;
      height: 4px;
      background: rgba(99, 102, 241, 0.3);
      border-radius: 50%;
      pointer-events: none;
    `;

    // Random initial position
    particle.style.left = Math.random() * 100 + "%";
    particle.style.top = Math.random() * 100 + "%";

    container.appendChild(particle);
    particles.push({
      element: particle,
      x: Math.random() * container.offsetWidth,
      y: Math.random() * container.offsetHeight,
      vx: (Math.random() - 0.5) * 2,
      vy: (Math.random() - 0.5) * 2,
    });
  }

  function animateParticles() {
    particles.forEach((particle) => {
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Bounce off edges
      if (particle.x <= 0 || particle.x >= container.offsetWidth) {
        particle.vx *= -1;
      }
      if (particle.y <= 0 || particle.y >= container.offsetHeight) {
        particle.vy *= -1;
      }

      particle.element.style.transform = `translate(${particle.x}px, ${particle.y}px)`;
    });

    requestAnimationFrame(animateParticles);
  }

  animateParticles();
}
