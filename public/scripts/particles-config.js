/**
 * Particles Configuration Script
 *
 * This script initializes particle backgrounds throughout the site
 * with optimized settings for better performance and visual appeal.
 *
 * Features:
 * - Robust error handling with CSS fallback
 * - Support for reduced motion preferences
 * - NosytLabs brand colors (purple and orange)
 * - Optimized performance settings
 */

/**
 * Helper function to convert color string to RGB object
 * @param {string} color - Color string in hex or rgb format
 * @returns {object|null} RGB object with r, g, b properties or null if conversion fails
 */
function colorToRgb(color) {
  let rgb = null;

  // Handle different color formats
  if (typeof color === 'string') {
    if (color.startsWith('rgb')) {
      // Extract RGB values from rgb/rgba string
      const match = color.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/i);
      if (match) {
        rgb = {
          r: parseInt(match[1], 10),
          g: parseInt(match[2], 10),
          b: parseInt(match[3], 10)
        };
      }
    } else if (color.startsWith('#')) {
      // Convert hex to RGB
      const hex = color.replace(/^#?([a-f\d])([a-f\d])([a-f\d])$/i, (m, r, g, b) => r + r + g + g + b + b);
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      if (result) {
        rgb = {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16)
        };
      }
    }
  }

  return rgb;
}

// Initialize particles on DOM ready with error handling
document.addEventListener('DOMContentLoaded', function() {
  // Check if particles.js is loaded
  if (typeof particlesJS === 'undefined') {
    console.warn('Particles.js is not loaded. Please check the script inclusion.');
    return;
  }

  try {
    // Initialize all particle backgrounds
    initializeParticles();

    // Initialize hero section particles specifically
    initializeHeroParticles();

    console.log('Particles.js initialized successfully');
  } catch (error) {
    console.error('Error initializing particles:', error);
  }
});

/**
 * Initialize particles on all containers
 */
function initializeParticles() {
  // Check if particles.js is loaded
  if (typeof particlesJS === 'undefined') {
    console.warn('Particles.js is not loaded. Please check the script inclusion.');
    return;
  }

  // Check if user prefers reduced motion
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Initialize main background particles
  const particleContainer = document.querySelector('.particles-container, .particle-container');
  if (particleContainer) {
    // Get custom attributes if available
    const particleColor = particleContainer.getAttribute('data-particle-color') || 'rgba(255, 107, 0, 0.3)';
    const connectionColor = particleContainer.getAttribute('data-connection-color') || 'rgba(255, 107, 0, 0.1)';
    const isInteractive = particleContainer.getAttribute('data-interactive') !== 'false';

    // Ensure container has an ID
    if (!particleContainer.id) {
      particleContainer.id = 'particles-container';
    }

    // Skip if already initialized
    if (particleContainer.classList.contains('particles-initialized')) {
      return;
    }

    // Mark as initialized
    particleContainer.classList.add('particles-initialized');

    // Configure particles
    const config = {
      "particles": {
        "number": {
          "value": prefersReducedMotion ? 30 : 80,
          "density": {
            "enable": true,
            "value_area": 800
          }
        },
        "color": {
          "value": particleColor
        },
        "shape": {
          "type": "circle",
          "stroke": {
            "width": 0,
            "color": "#000000"
          }
        },
        "opacity": {
          "value": 0.5,
          "random": true,
          "anim": {
            "enable": !prefersReducedMotion,
            "speed": 1,
            "opacity_min": 0.1,
            "sync": false
          }
        },
        "size": {
          "value": 3,
          "random": true,
          "anim": {
            "enable": !prefersReducedMotion,
            "speed": 2,
            "size_min": 0.1,
            "sync": false
          }
        },
        "line_linked": {
          "enable": true,
          "distance": 150,
          "color": connectionColor,
          "opacity": 0.4,
          "width": 1
        },
        "move": {
          "enable": !prefersReducedMotion,
          "speed": 2,
          "direction": "none",
          "random": true,
          "straight": false,
          "out_mode": "out",
          "bounce": false,
          "attract": {
            "enable": true,
            "rotateX": 600,
            "rotateY": 1200
          }
        }
      },
      "interactivity": {
        "detect_on": "canvas",
        "events": {
          "onhover": {
            "enable": isInteractive && !prefersReducedMotion,
            "mode": "grab"
          },
          "onclick": {
            "enable": isInteractive && !prefersReducedMotion,
            "mode": "push"
          },
          "resize": true
        },
        "modes": {
          "grab": {
            "distance": 140,
            "line_linked": {
              "opacity": 1
            }
          },
          "bubble": {
            "distance": 400,
            "size": 4.5,
            "duration": 2,
            "opacity": 8,
            "speed": 3
          },
          "repulse": {
            "distance": 200,
            "duration": 0.4
          },
          "push": {
            "particles_nb": 4
          },
          "remove": {
            "particles_nb": 2
          }
        }
      },
      "retina_detect": true
    };

    // Initialize particles with error handling
    try {
      // Check if element exists first
      if (document.getElementById(particleContainer.id)) {
        // Add color_rgb_line property to prevent "Cannot read properties of null (reading 'r')" error
        if (config.particles.line_linked && config.particles.line_linked.enable) {
          // Convert color to RGB format using helper function
          const color = config.particles.line_linked.color;
          const rgb = colorToRgb(color);

          // Set color_rgb_line property to prevent error
          if (rgb) {
            config.particles.line_linked.color_rgb_line = rgb;
          } else {
            // Default fallback color
            config.particles.line_linked.color_rgb_line = { r: 124, g: 58, b: 237 }; // Purple
          }
        }

        particlesJS(particleContainer.id, config);
        console.log(`Particles initialized for ${particleContainer.id}`);
      } else {
        console.log('Particle container element not found, skipping initialization');
      }
    } catch (error) {
      console.error('Failed to initialize particle container:', error);

      // Create CSS fallback animation
      createCSSFallback(particleContainer, particleContainer.id);
    }
  }

  // Initialize all particle backgrounds with class 'particle-background'
  const particleBackgrounds = document.querySelectorAll('.particle-background');
  particleBackgrounds.forEach((background, index) => {
    // Skip if already initialized
    if (background.classList.contains('particles-initialized')) {
      return;
    }

    // Mark as initialized
    background.classList.add('particles-initialized');

    // Get ID or create one
    const id = background.id || `particle-background-${index}`;
    background.id = id;

    // Get custom attributes
    const color = background.getAttribute('data-color') || '#ffffff';
    const particleCount = parseInt(background.getAttribute('data-particle-count') || '80');
    const particleSize = parseInt(background.getAttribute('data-particle-size') || '3');
    const particleSpeed = parseFloat(background.getAttribute('data-particle-speed') || '1');
    const interactive = background.getAttribute('data-interactive') !== 'false';
    const connectParticles = background.getAttribute('data-connect-particles') !== 'false';

    // Configure particles
    const config = {
      "particles": {
        "number": {
          "value": prefersReducedMotion ? Math.min(30, particleCount) : particleCount,
          "density": {
            "enable": true,
            "value_area": 800
          }
        },
        "color": {
          "value": color
        },
        "shape": {
          "type": "circle",
          "stroke": {
            "width": 0,
            "color": "#000000"
          }
        },
        "opacity": {
          "value": 0.5,
          "random": true,
          "anim": {
            "enable": !prefersReducedMotion,
            "speed": 1,
            "opacity_min": 0.1,
            "sync": false
          }
        },
        "size": {
          "value": particleSize,
          "random": true,
          "anim": {
            "enable": !prefersReducedMotion,
            "speed": 2,
            "size_min": 0.1,
            "sync": false
          }
        },
        "line_linked": {
          "enable": connectParticles,
          "distance": 150,
          "color": color,
          "opacity": 0.4,
          "width": 1
        },
        "move": {
          "enable": !prefersReducedMotion,
          "speed": particleSpeed,
          "direction": "none",
          "random": true,
          "straight": false,
          "out_mode": "out",
          "bounce": false,
          "attract": {
            "enable": true,
            "rotateX": 600,
            "rotateY": 1200
          }
        }
      },
      "interactivity": {
        "detect_on": "canvas",
        "events": {
          "onhover": {
            "enable": interactive && !prefersReducedMotion,
            "mode": "grab"
          },
          "onclick": {
            "enable": interactive && !prefersReducedMotion,
            "mode": "push"
          },
          "resize": true
        },
        "modes": {
          "grab": {
            "distance": 140,
            "line_linked": {
              "opacity": 1
            }
          },
          "bubble": {
            "distance": 400,
            "size": particleSize * 1.5,
            "duration": 2,
            "opacity": 8,
            "speed": 3
          },
          "repulse": {
            "distance": 200,
            "duration": 0.4
          },
          "push": {
            "particles_nb": 4
          },
          "remove": {
            "particles_nb": 2
          }
        }
      },
      "retina_detect": true
    };

    // Initialize particles with error handling
    try {
      // Check if element exists first
      if (document.getElementById(id)) {
        // Add color_rgb_line property to prevent "Cannot read properties of null (reading 'r')" error
        if (config.particles.line_linked && config.particles.line_linked.enable) {
          // Convert color to RGB format using helper function
          const color = config.particles.line_linked.color;
          const rgb = colorToRgb(color);

          // Set color_rgb_line property to prevent error
          if (rgb) {
            config.particles.line_linked.color_rgb_line = rgb;
          } else {
            // Default fallback color
            config.particles.line_linked.color_rgb_line = { r: 124, g: 58, b: 237 }; // Purple
          }
        }

        particlesJS(id, config);
        console.log(`Particles initialized for ${id}`);
      } else {
        console.log(`Particle element with ID ${id} not found, skipping initialization`);
      }
    } catch (error) {
      console.error(`Failed to initialize particles for ${id}:`, error);

      // Create CSS fallback animation
      createCSSFallback(background, id);
    }
  });
}

/**
 * Create a CSS fallback animation when particles.js fails to initialize
 * @param {Element} element - The element to add the fallback animation to
 * @param {string} id - The ID of the element
 */
function createCSSFallback(element, id) {
  if (!element) return;

  // Add a class to indicate fallback is active
  element.classList.add('particles-fallback');

  // Get colors from data attributes or use defaults
  const primaryColor = element.getAttribute('data-color') || 'rgba(124, 58, 237, 0.5)'; // Purple
  const secondaryColor = element.getAttribute('data-secondary-color') || 'rgba(255, 107, 0, 0.5)'; // Orange

  // Create fallback particles
  const particleCount = Math.min(parseInt(element.getAttribute('data-particle-count') || '20'), 20);

  // Clear any existing fallback particles
  const existingParticles = element.querySelectorAll('.fallback-particle');
  existingParticles.forEach(p => p.remove());

  // Create new fallback particles
  for (let i = 0; i < particleCount; i++) {
    const particle = document.createElement('div');
    particle.className = 'fallback-particle';

    // Randomize particle properties
    const size = Math.floor(Math.random() * 5) + 2; // 2-6px
    const posX = Math.random() * 100; // 0-100%
    const posY = Math.random() * 100; // 0-100%
    const opacity = Math.random() * 0.5 + 0.1; // 0.1-0.6
    const color = Math.random() > 0.5 ? primaryColor : secondaryColor;
    const delay = Math.random() * 5; // 0-5s delay
    const duration = Math.random() * 20 + 10; // 10-30s duration

    // Apply styles
    particle.style.position = 'absolute';
    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.borderRadius = '50%';
    particle.style.backgroundColor = color;
    particle.style.opacity = opacity;
    particle.style.left = `${posX}%`;
    particle.style.top = `${posY}%`;
    particle.style.animation = `particle-float ${duration}s ease-in-out ${delay}s infinite`;

    // Add to container
    element.appendChild(particle);
  }

  // Add animation keyframes if they don't exist
  if (!document.getElementById('particle-fallback-keyframes')) {
    const style = document.createElement('style');
    style.id = 'particle-fallback-keyframes';
    style.textContent = `
      @keyframes particle-float {
        0%, 100% { transform: translate(0, 0); }
        25% { transform: translate(10px, -10px); }
        50% { transform: translate(20px, 10px); }
        75% { transform: translate(-10px, 15px); }
      }
      .particles-fallback {
        position: relative;
        overflow: hidden;
      }
      .fallback-particle {
        position: absolute;
        border-radius: 50%;
        pointer-events: none;
      }
    `;
    document.head.appendChild(style);
  }

  console.log(`Created CSS fallback animation for ${id}`);
}

/**
 * Initialize hero section particles with enhanced configuration
 * Specifically optimized for the hero section with better performance
 */
function initializeHeroParticles() {
  // Check for all possible hero particle container IDs
  const heroParticlesIds = ['particles-js', 'hero-particles', 'particle-background'];
  let heroParticles = null;

  // Find the first available particle container
  for (const id of heroParticlesIds) {
    const element = document.getElementById(id);
    if (element) {
      heroParticles = element;
      break;
    }
  }

  // If no container found, try to find by class
  if (!heroParticles) {
    const heroParticlesByClass = document.querySelector('.particles-js, .hero-particles, .particle-container');
    if (heroParticlesByClass) {
      heroParticles = heroParticlesByClass;
      // Ensure it has an ID
      if (!heroParticles.id) {
        heroParticles.id = 'particles-js';
      }
    }
  }

  if (heroParticles) {
    // Check if already initialized
    if (heroParticles.classList.contains('particles-initialized')) {
      console.log(`Hero particles already initialized for ${heroParticles.id}`);
      return;
    }

    // Mark as initialized
    heroParticles.classList.add('particles-initialized');

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Get custom attributes if available
    const color = heroParticles.getAttribute('data-color') || 'rgba(124, 58, 237, 0.5)'; // Purple
    const secondaryColor = heroParticles.getAttribute('data-secondary-color') || 'rgba(255, 107, 0, 0.5)'; // Orange
    const particleCount = parseInt(heroParticles.getAttribute('data-particle-count') || '100');
    const particleSize = parseInt(heroParticles.getAttribute('data-particle-size') || '3');
    const particleSpeed = parseFloat(heroParticles.getAttribute('data-particle-speed') || '1');
    const interactive = heroParticles.getAttribute('data-interactive') !== 'false';
    const connectParticles = heroParticles.getAttribute('data-connect-particles') !== 'false';
    const useGradient = heroParticles.getAttribute('data-gradient') === 'true';

    // Configure particles with brand colors
    const config = {
      "particles": {
        "number": {
          "value": prefersReducedMotion ? Math.min(30, particleCount) : particleCount,
          "density": {
            "enable": true,
            "value_area": 800
          }
        },
        "color": {
          "value": useGradient ? [color, secondaryColor] : color
        },
        "shape": {
          "type": "circle",
          "stroke": {
            "width": 0,
            "color": "#000000"
          }
        },
        "opacity": {
          "value": 0.5,
          "random": true,
          "anim": {
            "enable": !prefersReducedMotion,
            "speed": 1,
            "opacity_min": 0.1,
            "sync": false
          }
        },
        "size": {
          "value": particleSize,
          "random": true,
          "anim": {
            "enable": !prefersReducedMotion,
            "speed": 2,
            "size_min": 0.1,
            "sync": false
          }
        },
        "line_linked": {
          "enable": connectParticles,
          "distance": 150,
          "color": useGradient ? secondaryColor : color,
          "opacity": 0.4,
          "width": 1
        },
        "move": {
          "enable": !prefersReducedMotion,
          "speed": particleSpeed,
          "direction": "none",
          "random": true,
          "straight": false,
          "out_mode": "out",
          "bounce": false,
          "attract": {
            "enable": true,
            "rotateX": 600,
            "rotateY": 1200
          }
        }
      },
      "interactivity": {
        "detect_on": "canvas",
        "events": {
          "onhover": {
            "enable": interactive && !prefersReducedMotion,
            "mode": "grab"
          },
          "onclick": {
            "enable": interactive && !prefersReducedMotion,
            "mode": "push"
          },
          "resize": true
        },
        "modes": {
          "grab": {
            "distance": 140,
            "line_linked": {
              "opacity": 1
            }
          },
          "bubble": {
            "distance": 400,
            "size": particleSize * 1.5,
            "duration": 2,
            "opacity": 8,
            "speed": 3
          },
          "repulse": {
            "distance": 200,
            "duration": 0.4
          },
          "push": {
            "particles_nb": 4
          },
          "remove": {
            "particles_nb": 2
          }
        }
      },
      "retina_detect": true
    };

    // Initialize particles.js for hero section
    try {
      // Add color_rgb_line property to prevent "Cannot read properties of null (reading 'r')" error
      if (config.particles.line_linked && config.particles.line_linked.enable) {
        // Convert color to RGB format using helper function
        const color = config.particles.line_linked.color;
        const rgb = colorToRgb(color);

        // Set color_rgb_line property to prevent error
        if (rgb) {
          config.particles.line_linked.color_rgb_line = rgb;
        } else {
          // Default fallback color
          config.particles.line_linked.color_rgb_line = { r: 124, g: 58, b: 237 }; // Purple
        }
      }

      particlesJS(heroParticles.id, config);
      console.log(`Hero particles initialized with optimized settings for ${heroParticles.id}`);
    } catch (error) {
      console.error(`Failed to initialize hero particles for ${heroParticles.id}:`, error);

      // Fallback: try to create a new canvas if initialization failed
      try {
        // Remove any existing canvas
        const existingCanvas = heroParticles.querySelector('canvas');
        if (existingCanvas) {
          existingCanvas.remove();
        }

        // Create a new canvas element
        const canvas = document.createElement('canvas');
        canvas.className = 'particles-js-canvas-el';
        heroParticles.appendChild(canvas);

        // Try to initialize again with color_rgb_line explicitly set
        if (config.particles.line_linked && config.particles.line_linked.enable) {
          config.particles.line_linked.color_rgb_line = { r: 124, g: 58, b: 237 }; // Purple
        }

        particlesJS(heroParticles.id, config);
        console.log(`Hero particles initialized with fallback method for ${heroParticles.id}`);
      } catch (fallbackError) {
        console.error('Fallback initialization also failed:', fallbackError);

        // Create CSS fallback animation as last resort
        createCSSFallback(heroParticles, heroParticles.id);
      }
    }
  } else {
    console.log('No hero particle container found');
  }
}
