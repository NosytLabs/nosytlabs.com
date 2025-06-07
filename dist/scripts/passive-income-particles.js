/**
 * Passive Income Particles Configuration
 * Custom particles effect for passive income pages
 * Simplified implementation to avoid conflicts with main particles.js
 */

document.addEventListener('DOMContentLoaded', function() {
  // Check if particles container exists
  const particlesContainer = document.getElementById('particles-enhanced');

  if (!particlesContainer) return;

  // Create canvas element if it doesn't exist
  let canvas = particlesContainer.querySelector('canvas');
  if (!canvas) {
    canvas = document.createElement('canvas');
    canvas.className = 'particles-js-canvas-el';
    particlesContainer.appendChild(canvas);
  }

  // Simple particles implementation that doesn't rely on particlesJS
  const ctx = canvas.getContext('2d');
  const particles = [];
  const particleCount = 50;
  const particleColor = '#ff6b00';
  const lineColor = 'rgba(255, 107, 0, 0.2)';
  const maxDistance = 150;

  // Resize canvas to match container
  function resizeCanvas() {
    canvas.width = particlesContainer.offsetWidth;
    canvas.height = particlesContainer.offsetHeight;
  }

  // Create particles
  function createParticles() {
    particles.length = 0;
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 3 + 1,
        vx: Math.random() * 1 - 0.5,
        vy: Math.random() * 1 - 0.5
      });
    }
  }

  // Draw particles and connections
  function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw particles
    particles.forEach(particle => {
      ctx.beginPath();
      ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      ctx.fillStyle = particleColor;
      ctx.fill();

      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Bounce off edges
      if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
    });

    // Draw connections
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < maxDistance) {
          ctx.beginPath();
          ctx.strokeStyle = lineColor;
          ctx.lineWidth = 1 - distance / maxDistance;
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(drawParticles);
  }

  // Initialize
  try {
    // Set up event listeners
    window.addEventListener('resize', function() {
      resizeCanvas();
      createParticles();
    });

    // Add mouse interaction
    let mouseX = null;
    let mouseY = null;

    particlesContainer.addEventListener('mousemove', function(e) {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
      mouseY = e.clientY - rect.top;
    });

    particlesContainer.addEventListener('mouseleave', function() {
      mouseX = null;
      mouseY = null;
    });

    // Initialize and start animation
    resizeCanvas();
    createParticles();
    drawParticles();

    console.log('Custom particles effect initialized for passive income pages');
  } catch (error) {
    console.error('Error initializing passive income particles:', error);
  }
});
