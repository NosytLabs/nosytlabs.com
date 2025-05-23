/**
 * NosytLabs Main JavaScript
 * Handles common functionality across the website
 */

document.addEventListener('DOMContentLoaded', function() {
  // Initialize all components
  initParticles();
  initScrollToTop();
  initAnimations();
  initAccessibility();
  initMobileMenu();
  
  console.log('NosytLabs main script initialized');
});

/**
 * Initialize particles background
 */
function initParticles() {
  const particlesContainer = document.getElementById('hero-particles');
  
  if (particlesContainer && typeof particlesJS !== 'undefined') {
    particlesJS('hero-particles', {
      "particles": {
        "number": {
          "value": 30,
          "density": {
            "enable": true,
            "value_area": 800
          }
        },
        "color": {
          "value": "#ffffff"
        },
        "shape": {
          "type": "circle",
          "stroke": {
            "width": 0,
            "color": "#000000"
          },
          "polygon": {
            "nb_sides": 5
          }
        },
        "opacity": {
          "value": 0.5,
          "random": false,
          "anim": {
            "enable": false,
            "speed": 1,
            "opacity_min": 0.1,
            "sync": false
          }
        },
        "size": {
          "value": 3,
          "random": true,
          "anim": {
            "enable": false,
            "speed": 40,
            "size_min": 0.1,
            "sync": false
          }
        },
        "line_linked": {
          "enable": true,
          "distance": 150,
          "color": "#ffffff",
          "opacity": 0.4,
          "width": 1
        },
        "move": {
          "enable": true,
          "speed": 2,
          "direction": "none",
          "random": false,
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
            "enable": true,
            "mode": "grab"
          },
          "onclick": {
            "enable": true,
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
    });
    
    console.log('Particles initialized');
  }
}

/**
 * Initialize scroll to top button
 */
function initScrollToTop() {
  // Create scroll to top button if it doesn't exist
  if (!document.getElementById('scroll-to-top')) {
    const scrollToTopBtn = document.createElement('button');
    scrollToTopBtn.id = 'scroll-to-top';
    scrollToTopBtn.className = 'scroll-to-top';
    scrollToTopBtn.setAttribute('aria-label', 'Scroll to top');
    scrollToTopBtn.innerHTML = `
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="19" x2="12" y2="5"></line>
        <polyline points="5 12 12 5 19 12"></polyline>
      </svg>
    `;
    
    document.body.appendChild(scrollToTopBtn);
    
    // Add styles
    const style = document.createElement('style');
    style.textContent = `
      .scroll-to-top {
        position: fixed;
        bottom: 20px;
        right: 20px;
        background-color: var(--primary);
        color: white;
        border: none;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.3s ease;
        z-index: 100;
        box-shadow: 0 4px 10px rgba(0, 0, 0, 0.3);
      }
      
      .scroll-to-top.visible {
        opacity: 1;
        visibility: visible;
      }
      
      .scroll-to-top:hover {
        background-color: var(--primary-light);
        transform: translateY(-3px);
      }
      
      .dark .scroll-to-top {
        background-color: var(--primary-light);
      }
      
      .dark .scroll-to-top:hover {
        background-color: var(--accent);
      }
      
      @media (prefers-reduced-motion: reduce) {
        .scroll-to-top {
          transition: opacity 0.1s;
        }
        
        .scroll-to-top:hover {
          transform: none;
        }
      }
    `;
    
    document.head.appendChild(style);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
      if (window.pageYOffset > 300) {
        scrollToTopBtn.classList.add('visible');
      } else {
        scrollToTopBtn.classList.remove('visible');
      }
    });
    
    // Scroll to top when button is clicked
    scrollToTopBtn.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
    
    console.log('Scroll to top button initialized');
  }
}

/**
 * Initialize animations
 */
function initAnimations() {
  // Add fade-in animation to elements with data-animate attribute
  const animatedElements = document.querySelectorAll('[data-animate]');
  
  if (animatedElements.length > 0) {
    // Create IntersectionObserver
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const element = entry.target;
          const delay = element.dataset.delay || 0;
          
          setTimeout(() => {
            element.classList.add('animated');
          }, delay);
          
          // Unobserve after animation
          observer.unobserve(element);
        }
      });
    }, {
      threshold: 0.1
    });
    
    // Observe each element
    animatedElements.forEach(element => {
      observer.observe(element);
    });
    
    console.log('Animations initialized');
  }
}

/**
 * Initialize accessibility features
 */
function initAccessibility() {
  // Add focus styles to interactive elements
  const interactiveElements = document.querySelectorAll('a, button, input, select, textarea, [tabindex]:not([tabindex="-1"])');
  
  interactiveElements.forEach(element => {
    element.addEventListener('focus', () => {
      element.classList.add('focus-visible');
    });
    
    element.addEventListener('blur', () => {
      element.classList.remove('focus-visible');
    });
  });
  
  // Add aria-current to active navigation links
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('nav a');
  
  navLinks.forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      link.setAttribute('aria-current', 'page');
    }
  });
  
  console.log('Accessibility features initialized');
}

/**
 * Initialize mobile menu
 */
function initMobileMenu() {
  const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  
  if (mobileMenuToggle && mobileMenu) {
    // Toggle menu when clicking the hamburger icon
    mobileMenuToggle.addEventListener('click', (e) => {
      e.stopPropagation(); // Prevent document click from immediately closing it
      mobileMenu.classList.toggle('active');
      mobileMenuToggle.classList.toggle('active');
      document.body.classList.toggle('menu-open');
      
      // Set accessibility attributes
      const isExpanded = mobileMenu.classList.contains('active');
      mobileMenuToggle.setAttribute('aria-expanded', isExpanded.toString());
      mobileMenu.setAttribute('aria-hidden', (!isExpanded).toString());
    });
    
    // Close menu when clicking links inside the menu
    const mobileNavLinks = mobileMenu.querySelectorAll('a');
    mobileNavLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        document.body.classList.remove('menu-open');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
      });
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', (e) => {
      if (mobileMenu.classList.contains('active') &&
          !mobileMenu.contains(e.target) &&
          !mobileMenuToggle.contains(e.target)) {
        mobileMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        document.body.classList.remove('menu-open');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
      }
    });
    
    // Close menu with Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
        mobileMenuToggle.classList.remove('active');
        document.body.classList.remove('menu-open');
        mobileMenuToggle.setAttribute('aria-expanded', 'false');
        mobileMenu.setAttribute('aria-hidden', 'true');
      }
    });
    
    console.log('Mobile menu initialized');
  }
}
