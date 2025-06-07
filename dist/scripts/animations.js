/**
 * Enhanced animations for NosytLabs website
 * Handles scroll-triggered animations and parallax effects
 */

(function() {
  'use strict';

  // Initialize scroll-triggered animations
  function initScrollAnimations() {
    // Check if IntersectionObserver is supported
    if (!('IntersectionObserver' in window)) {
      // If not supported, show all elements
      NosytUtils.dom.queryAll('.reveal-on-scroll').forEach(el => {
        el.classList.add('revealed');
      });
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          // Once revealed, no need to observe anymore
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15, // Trigger when at least 15% of the element is visible
      rootMargin: '0px 0px -50px 0px' // Trigger slightly before the element is fully in view
    });

    // Observe all elements with reveal-on-scroll class
    NosytUtils.dom.queryAll('.reveal-on-scroll').forEach(el => {
      observer.observe(el);
    });
  }

  // Initialize modern background effects
  function initModernBackgrounds() {
    const modernBgElements = NosytUtils.dom.queryAll('.bg-grid-pattern');

    if (modernBgElements.length === 0) return;

    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Add subtle animation to grid patterns
    modernBgElements.forEach(element => {
      element.style.animation = 'pulse 10s ease-in-out infinite';
    });
  }

  // Initialize staggered animations
  function initStaggeredAnimations() {
    // Add animation delay to elements based on their position
    NosytUtils.dom.queryAll('.text-reveal, .fade-in-scale, .slide-up-fade').forEach((el, index) => {
      const container = el.closest('.staggered-container');
      if (container) {
        const delay = 0.1 * (index % 5); // Reset after 5 elements
        el.style.setProperty('--animation-delay', `${delay}s`);
      }
    });
  }

  // Initialize subtle hover effects instead of cursor tracking
  function initHoverEffects() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    // Enhance interactive elements with subtle hover effects
    const interactiveElements = NosytUtils.dom.queryAll('a, button, input, textarea, select, .card, .interactive');

    interactiveElements.forEach(el => {
      // Skip elements that already have hover effects
      if (el.classList.contains('hover-effect-applied')) return;

      el.classList.add('hover-effect-applied');

      // Add hover effect based on element type
      if (el.tagName === 'A' || el.tagName === 'BUTTON') {
        el.addEventListener('mouseenter', () => {
          el.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
          el.style.transform = 'translateY(-2px)';
          el.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.1)';
        });

        el.addEventListener('mouseleave', () => {
          el.style.transform = 'translateY(0)';
          el.style.boxShadow = '';
        });
      } else if (el.classList.contains('card')) {
        el.addEventListener('mouseenter', () => {
          el.style.transition = 'transform 0.3s ease, box-shadow 0.3s ease';
          el.style.transform = 'translateY(-5px)';
          el.style.boxShadow = '0 8px 16px rgba(0, 0, 0, 0.1)';
        });

        el.addEventListener('mouseleave', () => {
          el.style.transform = 'translateY(0)';
          el.style.boxShadow = '';
        });
      }
    });

    // Add focus effects for accessibility
    interactiveElements.forEach(el => {
      el.addEventListener('focus', () => {
        el.classList.add('focus-visible');
      });

      el.addEventListener('blur', () => {
        el.classList.remove('focus-visible');
      });
    });
  }

  // Initialize magnetic button effects
  function initMagneticButtons() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const magneticButtons = NosytUtils.dom.queryAll('.magnetic-button');

    magneticButtons.forEach(button => {
      button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        // Apply magnetic effect with subtle movement
        button.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
      });

      button.addEventListener('mouseleave', () => {
        // Reset position when mouse leaves
        button.style.transform = 'translate(0, 0)';
      });
    });
  }

  // Initialize Windows 95 animations
  function initWin95Animations() {
    // Windows 95 window controls
    const minimizeButtons = NosytUtils.dom.queryAll('.win95-minimize-button');
    const maximizeButtons = NosytUtils.dom.queryAll('.win95-maximize-button');
    const closeButtons = NosytUtils.dom.queryAll('.win95-close-button');

    minimizeButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const window = button.closest('.win95-window');
        if (window) {
          window.classList.add('win95-minimize');
          // Remove animation class after animation completes
          setTimeout(() => {
            window.style.display = 'none';
            window.classList.remove('win95-minimize');
          }, 300);
        }
      });
    });

    maximizeButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const window = button.closest('.win95-window');
        if (window) {
          window.classList.toggle('win95-maximized');
          if (window.classList.contains('win95-maximized')) {
            window.classList.add('win95-maximize');
            setTimeout(() => {
              window.classList.remove('win95-maximize');
            }, 300);
          }
        }
      });
    });

    closeButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        const window = button.closest('.win95-window');
        if (window) {
          window.classList.add('win95-minimize');
          setTimeout(() => {
            window.style.display = 'none';
            window.classList.remove('win95-minimize');
          }, 300);
        }
      });
    });
  }

  // Initialize particle background effects
  function initParticleEffects() {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;

    const particleContainers = NosytUtils.dom.queryAll('.particle-container');

    particleContainers.forEach(container => {
      const containerRect = container.getBoundingClientRect();
      const particleCount = Math.floor(containerRect.width * containerRect.height / 10000); // Adjust density

      // Create particles
      for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';

        // Random size between 2px and 6px
        const size = Math.random() * 4 + 2;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;

        // Random position within container
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;

        // Random opacity
        particle.style.opacity = Math.random() * 0.5 + 0.1;

        // Random animation duration between 10s and 30s
        const duration = Math.random() * 20 + 10;
        particle.style.animation = `float ${duration}s ease-in-out infinite`;

        // Random animation delay
        particle.style.animationDelay = `${Math.random() * 10}s`;

        container.appendChild(particle);
      }
    });
  }

  // Initialize page transitions
  function initPageTransitions() {
    // Check if the browser supports View Transitions API
    if (!document.startViewTransition) return;

    // Add transition classes to links
    NosytUtils.dom.queryAll('a[href^="/"]:not([target])').forEach(link => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');

        // Skip if modifier keys are pressed
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;

        e.preventDefault();

        // Apply exit animation to current page
        document.body.classList.add('page-transition-out');

        // Navigate after animation completes
        setTimeout(() => {
          window.location.href = href;
        }, 500);
      });
    });

    // Apply entrance animation on page load
    window.addEventListener('pageshow', () => {
      document.body.classList.add('page-transition-in');

      // Remove animation class after animation completes
      setTimeout(() => {
        document.body.classList.remove('page-transition-in');
      }, 500);
    });
  }

  // Initialize touch interactions for mobile users
  function initTouchInteractions() {
    // Add touch interactions for cards
    const cards = NosytUtils.dom.queryAll('.expandable-card, .flippable');

    cards.forEach(card => {
      let touchStartX = 0;
      let touchEndX = 0;
      let touchStartY = 0;
      let touchEndY = 0;

      card.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
        touchStartY = e.changedTouches[0].screenY;
      });

      card.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        touchEndY = e.changedTouches[0].screenY;

        // Calculate horizontal and vertical distance
        const horizontalDistance = Math.abs(touchEndX - touchStartX);
        const verticalDistance = Math.abs(touchEndY - touchStartY);

        // Only handle horizontal swipes (to avoid conflicts with scrolling)
        if (horizontalDistance > verticalDistance && horizontalDistance > 50) {
          if (touchEndX < touchStartX && card.classList.contains('flippable')) {
            // Swipe left - flip card
            card.classList.add('flipped');
          } else if (touchEndX > touchStartX && card.classList.contains('flipped')) {
            // Swipe right - reset card
            card.classList.remove('flipped');
          }
        }
      });
    });

    // Add double tap for expanding cards
    cards.forEach(card => {
      let lastTap = 0;

      card.addEventListener('touchend', (e) => {
        const currentTime = new Date().getTime();
        const tapLength = currentTime - lastTap;

        if (tapLength < 500 && tapLength > 0) {
          // Double tap detected
          if (card.classList.contains('expandable')) {
            // Don't expand if tapping on a link or button
            if (e.target.tagName === 'A' || e.target.tagName === 'BUTTON' ||
                e.target.closest('a') || e.target.closest('button')) {
              return;
            }

            // Toggle expanded state
            card.classList.toggle('expanded');

            // Handle overlay
            const overlay = document.querySelector('.card-overlay');
            if (overlay) {
              overlay.classList.toggle('active');
            }

            // Prevent body scrolling when card is expanded
            if (card.classList.contains('expanded')) {
              document.body.style.overflow = 'hidden';
            } else {
              document.body.style.overflow = '';
            }
          }
        }

        lastTap = currentTime;
      });
    });
  }

  // Initialize on DOM ready
  document.addEventListener('DOMContentLoaded', function() {
    // Initialize scroll animations
    initScrollAnimations();

    // Initialize modern backgrounds
    initModernBackgrounds();

    // Initialize staggered animations
    initStaggeredAnimations();

    // Initialize hover effects (replacing cursor effects)
    initHoverEffects();

    // Initialize magnetic buttons
    initMagneticButtons();

    // Initialize Windows 95 animations
    initWin95Animations();

    // Initialize particle effects
    initParticleEffects();

    // Initialize page transitions
    initPageTransitions();

    // Initialize touch interactions for mobile
    initTouchInteractions();

    // Add accessibility enhancements
    enhanceAccessibility();

    // Add nav-link class to navigation links
    NosytUtils.dom.queryAll('nav a').forEach(link => {
      link.classList.add('nav-link');

      // Mark active link
      if (link.getAttribute('href') === window.location.pathname) {
        link.classList.add('active');
        link.setAttribute('aria-current', 'page');
      }
    });

    // Add magnetic-button class to primary buttons
    NosytUtils.dom.queryAll('.btn-primary, .cta-button').forEach(button => {
      button.classList.add('magnetic-button');
    });

    });

  // Enhance accessibility
  function enhanceAccessibility() {
    // Add skip link if it doesn't exist
    if (!document.querySelector('.skip-link')) {
      const skipLink = document.createElement('a');
      skipLink.href = '#main-content';
      skipLink.className = 'skip-link';
      skipLink.textContent = 'Skip to main content';
      document.body.insertBefore(skipLink, document.body.firstChild);

      // Style the skip link
      skipLink.style.position = 'absolute';
      skipLink.style.top = '-40px';
      skipLink.style.left = '0';
      skipLink.style.padding = '8px 16px';
      skipLink.style.background = 'var(--nosyt-orange-main, #ff6b00)';
      skipLink.style.color = 'white';
      skipLink.style.zIndex = '9999';
      skipLink.style.transition = 'top 0.3s ease';

      // Show skip link on focus
      skipLink.addEventListener('focus', () => {
        skipLink.style.top = '0';
      });

      // Hide skip link when focus is lost
      skipLink.addEventListener('blur', () => {
        skipLink.style.top = '-40px';
      });
    }

    // Add main-content id to main element if it doesn't exist
    const mainElement = document.querySelector('main');
    if (mainElement && !document.getElementById('main-content')) {
      mainElement.id = 'main-content';
      mainElement.setAttribute('tabindex', '-1');
    }

    // Add aria-labels to navigation
    const navElement = document.querySelector('nav');
    if (navElement && !navElement.hasAttribute('aria-label')) {
      navElement.setAttribute('aria-label', 'Main navigation');
    }

    // Add aria-labels to footer navigation
    const footerNavs = NosytUtils.dom.queryAll('footer nav, footer div[role="navigation"]');
    footerNavs.forEach((nav, index) => {
      if (!nav.hasAttribute('aria-label')) {
        nav.setAttribute('aria-label', `Footer navigation ${index + 1}`);
      }
    });

    // Add focus styles to interactive elements
    document.head.insertAdjacentHTML('beforeend', `
      <style>
        .focus-visible {
          outline: 2px solid var(--nosyt-orange-main, #ff6b00) !important;
          outline-offset: 2px !important;
        }

        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.001s !important;
            transition-duration: 0.001s !important;
          }
        }
      </style>
    `);
  }

  // Update on window resize
  window.addEventListener('resize', function() {
    // Reinitialize modern backgrounds on resize
    initModernBackgrounds();

    // Reinitialize particle effects on resize
    initParticleEffects();
  });
})();
