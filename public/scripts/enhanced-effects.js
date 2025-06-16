/**
 * Enhanced Interactive Effects for NosytLabs
 * Modern animations and micro-interactions
 */

class EnhancedEffects {
  constructor() {
    this.isInitialized = false;
    this.observers = new Map();
    this.rafId = null;
    this.mousePosition = { x: 0, y: 0 };
    
    this.init();
  }

  init() {
    if (this.isInitialized) return;
    
    document.addEventListener('DOMContentLoaded', () => {
      this.initScrollReveal();
      this.initMagneticElements();
      this.initParallaxElements();
      this.initEnhancedButtons();
      this.initTextEffects();
      this.initCardEffects();
      this.initLiquidMorphing();
      this.initQuantumParticles();
      this.initNeuralNetwork();
      this.trackMousePosition();

      this.isInitialized = true;
      console.log('✨ Enhanced effects initialized');
    });
  }

  // Track mouse position for magnetic effects
  trackMousePosition() {
    document.addEventListener('mousemove', (e) => {
      this.mousePosition.x = e.clientX;
      this.mousePosition.y = e.clientY;
    });
  }

  // Enhanced scroll reveal with intersection observer
  initScrollReveal() {
    const revealElements = document.querySelectorAll('.text-reveal, .stagger-reveal');
    
    if (revealElements.length === 0) return;

    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          
          // Add stagger delay for grouped elements
          if (entry.target.classList.contains('stagger-reveal')) {
            const siblings = Array.from(entry.target.parentElement.children);
            const index = siblings.indexOf(entry.target);
            entry.target.style.animationDelay = `${index * 0.1}s`;
          }
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));
    this.observers.set('reveal', revealObserver);
  }

  // Magnetic hover effects
  initMagneticElements() {
    const magneticElements = document.querySelectorAll('.magnetic-hover');
    
    magneticElements.forEach(element => {
      element.addEventListener('mouseenter', (e) => {
        this.startMagneticEffect(element);
      });
      
      element.addEventListener('mouseleave', (e) => {
        this.stopMagneticEffect(element);
      });
    });
  }

  startMagneticEffect(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const updateMagnetic = () => {
      const deltaX = (this.mousePosition.x - centerX) * 0.1;
      const deltaY = (this.mousePosition.y - centerY) * 0.1;
      
      element.style.setProperty('--mouse-x', `${deltaX}px`);
      element.style.setProperty('--mouse-y', `${deltaY}px`);
      
      if (element.dataset.magnetic === 'active') {
        this.rafId = requestAnimationFrame(updateMagnetic);
      }
    };
    
    element.dataset.magnetic = 'active';
    updateMagnetic();
  }

  stopMagneticEffect(element) {
    element.dataset.magnetic = 'inactive';
    element.style.setProperty('--mouse-x', '0px');
    element.style.setProperty('--mouse-y', '0px');
    
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  // Parallax scroll effects
  initParallaxElements() {
    const parallaxElements = document.querySelectorAll('.parallax-element');
    
    if (parallaxElements.length === 0) return;

    const parallaxObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          this.startParallax(entry.target);
        } else {
          this.stopParallax(entry.target);
        }
      });
    });

    parallaxElements.forEach(el => parallaxObserver.observe(el));
    this.observers.set('parallax', parallaxObserver);
  }

  startParallax(element) {
    const speed = parseFloat(element.dataset.speed || '0.5');

    const updateParallax = () => {
      const scrolled = window.pageYOffset;
      const rate = scrolled * speed;

      element.style.transform = `translateY(${rate}px)`;

      if (element.dataset.parallax === 'active') {
        requestAnimationFrame(updateParallax);
      }
    };

    element.dataset.parallax = 'active';
    updateParallax();
  }

  stopParallax(element) {
    element.dataset.parallax = 'inactive';
  }

  // Enhanced button interactions
  initEnhancedButtons() {
    const enhancedButtons = document.querySelectorAll('.btn-enhanced, .liquid-button');
    
    enhancedButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        this.createRippleEffect(button, e);
      });
    });
  }

  createRippleEffect(element, event) {
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;
    
    const ripple = document.createElement('div');
    ripple.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      left: ${x}px;
      top: ${y}px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      transform: scale(0);
      animation: ripple 0.6s ease-out;
      pointer-events: none;
    `;
    
    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);
    
    setTimeout(() => {
      ripple.remove();
    }, 600);
  }

  // Text effects initialization
  initTextEffects() {
    // Initialize glitch text
    const glitchTexts = document.querySelectorAll('.glitch-text');
    glitchTexts.forEach(text => {
      text.dataset.text = text.textContent;
    });

    // Initialize neon text with random delays
    const neonTexts = document.querySelectorAll('.neon-text');
    neonTexts.forEach((text, index) => {
      text.style.animationDelay = `${index * 0.2}s`;
    });
  }

  // Enhanced card effects
  initCardEffects() {
    const enhancedCards = document.querySelectorAll('.card-enhanced');
    
    enhancedCards.forEach(card => {
      card.addEventListener('mouseenter', (e) => {
        this.startCardTilt(card, e);
      });
      
      card.addEventListener('mousemove', (e) => {
        this.updateCardTilt(card, e);
      });
      
      card.addEventListener('mouseleave', (e) => {
        this.stopCardTilt(card);
      });
    });
  }

  startCardTilt(card, event) {
    card.dataset.tilt = 'active';
  }

  updateCardTilt(card, event) {
    if (card.dataset.tilt !== 'active') return;
    
    const rect = card.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const deltaX = (event.clientX - centerX) / (rect.width / 2);
    const deltaY = (event.clientY - centerY) / (rect.height / 2);
    
    const rotateX = deltaY * -10; // Max 10 degrees
    const rotateY = deltaX * 10;
    
    card.style.transform = `
      perspective(1000px) 
      rotateX(${rotateX}deg) 
      rotateY(${rotateY}deg) 
      translateY(-10px)
    `;
  }

  stopCardTilt(card) {
    card.dataset.tilt = 'inactive';
    card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0px)';
  }

  // Liquid morphing effects for buttons
  initLiquidMorphing() {
    const liquidButtons = document.querySelectorAll('.btn-liquid');

    liquidButtons.forEach(button => {
      // Create liquid blob
      const blob = document.createElement('div');
      blob.className = 'liquid-blob';
      blob.style.cssText = `
        position: absolute;
        width: 100px;
        height: 100px;
        background: radial-gradient(circle, rgba(124,58,237,0.3) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        transform: translate(-50px, -50px) scale(0);
        transition: all 0.3s cubic-bezier(0.23, 1, 0.32, 1);
        z-index: -1;
      `;

      button.style.position = 'relative';
      button.appendChild(blob);

      button.addEventListener('mousemove', (e) => {
        const rect = button.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        blob.style.transform = `translate(${x - 50}px, ${y - 50}px) scale(1.2)`;
      });

      button.addEventListener('mouseleave', () => {
        blob.style.transform = 'translate(-50px, -50px) scale(0)';
      });
    });
  }

  // Quantum particle effects
  initQuantumParticles() {
    const quantumContainers = document.querySelectorAll('.quantum-particles');

    quantumContainers.forEach(container => {
      this.createQuantumField(container);
    });
  }

  createQuantumField(container) {
    const particleCount = 50;

    for (let i = 0; i < particleCount; i++) {
      const particle = document.createElement('div');
      particle.className = 'quantum-particle';
      particle.style.cssText = `
        position: absolute;
        width: 2px;
        height: 2px;
        background: #7c3aed;
        border-radius: 50%;
        opacity: 0;
        animation: quantumFloat ${3 + Math.random() * 4}s infinite ease-in-out;
        animation-delay: ${Math.random() * 2}s;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
      `;

      container.appendChild(particle);
    }
  }

  // Neural network visualization
  initNeuralNetwork() {
    const networkContainers = document.querySelectorAll('.neural-network');

    networkContainers.forEach(container => {
      this.createNeuralConnections(container);
    });
  }

  createNeuralConnections(container) {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 1;
    `;

    // Create animated neural pathways
    for (let i = 0; i < 10; i++) {
      const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      const startX = Math.random() * 100;
      const startY = Math.random() * 100;
      const endX = Math.random() * 100;
      const endY = Math.random() * 100;

      path.setAttribute('d', `M${startX},${startY} Q${(startX + endX) / 2},${Math.random() * 100} ${endX},${endY}`);
      path.setAttribute('stroke', '#7c3aed');
      path.setAttribute('stroke-width', '1');
      path.setAttribute('fill', 'none');
      path.setAttribute('opacity', '0.3');
      path.style.animation = `neuralPulse ${2 + Math.random() * 3}s infinite ease-in-out`;
      path.style.animationDelay = `${Math.random() * 2}s`;

      svg.appendChild(path);
    }

    container.appendChild(svg);
  }

  // Cleanup method
  destroy() {
    this.observers.forEach(observer => observer.disconnect());
    this.observers.clear();

    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
    }

    this.isInitialized = false;
  }
}

// Add enhanced animation keyframes
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple {
    to {
      transform: scale(2);
      opacity: 0;
    }
  }

  @keyframes quantumFloat {
    0%, 100% {
      opacity: 0;
      transform: translateY(0px) scale(0.5);
    }
    50% {
      opacity: 1;
      transform: translateY(-20px) scale(1);
    }
  }

  @keyframes neuralPulse {
    0%, 100% {
      opacity: 0.1;
      stroke-width: 1;
    }
    50% {
      opacity: 0.8;
      stroke-width: 2;
    }
  }

  @keyframes liquidMorph {
    0%, 100% {
      border-radius: 50% 50% 50% 50%;
    }
    25% {
      border-radius: 60% 40% 60% 40%;
    }
    50% {
      border-radius: 40% 60% 40% 60%;
    }
    75% {
      border-radius: 50% 50% 40% 60%;
    }
  }

  .liquid-blob {
    animation: liquidMorph 4s ease-in-out infinite;
  }

  .quantum-particles {
    position: relative;
    overflow: hidden;
  }

  .neural-network {
    position: relative;
    overflow: hidden;
  }
`;
document.head.appendChild(style);

// Initialize enhanced effects
window.enhancedEffects = new EnhancedEffects();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = EnhancedEffects;
}
