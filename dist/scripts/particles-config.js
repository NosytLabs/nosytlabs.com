/**
 * Particles.js Configuration
 * This file contains the configuration for the particles.js library
 * Used for creating interactive particle backgrounds throughout the site
 * Optimized for better performance and visual appeal
 */

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

    // Configure particles with reduced settings for better performance
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
          "speed": 1,
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
            "size": 40,
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
      if (document.getElementById('particle-background')) {
        particlesJS('particle-background', config);
      } else {
        console.log('Particle background element not found, skipping initialization');
      }
    } catch (error) {
      console.error('Failed to initialize particle background:', error);
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

    // Create configuration
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
        particlesJS(id, config);
      } else {
        console.log(`Particle element with ID ${id} not found, skipping initialization`);
      }
    } catch (error) {
      console.error(`Failed to initialize particles for ${id}:`, error);
    }
  });
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
    console.log(`Initializing hero particles for ${heroParticles.id}`);

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // Get configuration from data attributes with fallbacks
    const color = heroParticles.getAttribute('data-color') || 'rgba(255, 255, 255, 0.7)';
    const particleCount = parseInt(heroParticles.getAttribute('data-particle-count') || '40', 10); // Reduced count for better performance
    const particleSize = parseFloat(heroParticles.getAttribute('data-particle-size') || '3');
    const particleSpeed = parseFloat(heroParticles.getAttribute('data-particle-speed') || '0.8'); // Slightly slower for better performance
    const interactive = heroParticles.getAttribute('data-interactive') !== 'false';
    const connectParticles = heroParticles.getAttribute('data-connect-particles') !== 'false';

    // Enhanced configuration for hero section with better performance
    const config = {
      "particles": {
        "number": {
          "value": prefersReducedMotion ? Math.min(15, particleCount) : particleCount,
          "density": {
            "enable": true,
            "value_area": 1200 // Increased for better distribution
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
          "value": 0.6,
          "random": true,
          "anim": {
            "enable": !prefersReducedMotion,
            "speed": 0.5, // Slower animation for better performance
            "opacity_min": 0.1,
            "sync": false
          }
        },
        "size": {
          "value": particleSize,
          "random": true,
          "anim": {
            "enable": !prefersReducedMotion,
            "speed": 1,
            "size_min": 0.5,
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
            "enable": false,
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
            "size": 40,
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

        // Try to initialize again
        particlesJS(heroParticles.id, config);
        console.log(`Hero particles initialized with fallback method for ${heroParticles.id}`);
      } catch (fallbackError) {
        console.error('Fallback initialization also failed:', fallbackError);
      }
    }
  } else {
    console.log('No hero particle container found');
  }
}
