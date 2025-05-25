/**
 * Particles Initialization Script
 * 
 * This script initializes particle backgrounds throughout the site
 * with optimized settings for better performance and visual appeal.
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
    const color = background.getAttribute('data-color') || 'rgba(76, 29, 149, 0.3)';
    const secondaryColor = background.getAttribute('data-secondary-color') || 'rgba(255, 107, 0, 0.3)';
    const particleCount = parseInt(background.getAttribute('data-particle-count') || '80');
    const particleSize = parseInt(background.getAttribute('data-particle-size') || '3');
    const particleSpeed = parseFloat(background.getAttribute('data-particle-speed') || '1');
    const interactive = background.getAttribute('data-interactive') !== 'false';
    const connectParticles = background.getAttribute('data-connect-particles') !== 'false';
    const useGradient = background.getAttribute('data-gradient') === 'true';

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
          "color": secondaryColor,
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
        console.log(`Particles initialized for ${id}`);
      } else {
        console.log(`Particle element with ID ${id} not found, skipping initialization`);
      }
    } catch (error) {
      console.error(`Failed to initialize particles for ${id}:`, error);
      
      // Fallback: try to create a new canvas if initialization failed
      try {
        // Remove any existing canvas
        const existingCanvas = background.querySelector('canvas');
        if (existingCanvas) {
          existingCanvas.remove();
        }
        
        // Create a new canvas element
        const canvas = document.createElement('canvas');
        canvas.className = 'particles-js-canvas-el';
        background.appendChild(canvas);
        
        // Try to initialize again
        particlesJS(id, config);
        console.log(`Particles initialized with fallback method for ${id}`);
      } catch (fallbackError) {
        console.error('Fallback initialization also failed:', fallbackError);
      }
    }
  });
}
