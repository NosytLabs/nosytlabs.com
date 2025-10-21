// Complex animations module
// Provides advanced animation utilities for interactive elements

export function initParallaxEffects() {
  if (typeof window === 'undefined') return;
  
  const parallaxElements = document.querySelectorAll('[data-parallax]');
  
  if (parallaxElements.length === 0) return;
  
  const handleScroll = () => {
    const scrollY = window.scrollY;
    
    parallaxElements.forEach((element) => {
      const speed = parseFloat(element.dataset.parallax) || 0.5;
      const yPos = -(scrollY * speed);
      element.style.transform = `translateY(${yPos}px)`;
    });
  };
  
  window.addEventListener('scroll', handleScroll, { passive: true });
  
  return () => {
    window.removeEventListener('scroll', handleScroll);
  };
}

export function initScrollAnimations() {
  if (typeof window === 'undefined') return;
  
  const animatedElements = document.querySelectorAll('[data-animate]');
  
  if (animatedElements.length === 0) return;
  
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px',
    }
  );
  
  animatedElements.forEach((element) => {
    observer.observe(element);
  });
  
  return () => {
    observer.disconnect();
  };
}

export function initHoverEffects() {
  if (typeof window === 'undefined') return;
  
  const hoverElements = document.querySelectorAll('[data-hover-effect]');
  
  hoverElements.forEach((element) => {
    element.addEventListener('mouseenter', () => {
      element.classList.add('hover-active');
    });
    
    element.addEventListener('mouseleave', () => {
      element.classList.remove('hover-active');
    });
  });
}

export function initSmoothScroll() {
  if (typeof window === 'undefined') return;
  
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      
      e.preventDefault();
      const target = document.querySelector(href);
      
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  });
}

// Initialize all animations
export function initAllAnimations() {
  initParallaxEffects();
  initScrollAnimations();
  initHoverEffects();
  initSmoothScroll();
}
