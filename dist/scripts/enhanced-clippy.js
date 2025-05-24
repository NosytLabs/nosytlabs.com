/**
 * Enhanced Clippy Assistant for NosytOS95
 * A more interactive and animated version of the classic Office Assistant
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const clippy = document.getElementById('clippy');
  const clippyImage = document.getElementById('clippy-image');
  const clippyBubble = document.querySelector('.clippy-bubble');
  const clippyMessage = document.getElementById('clippy-message');
  const clippyOptions = document.getElementById('clippy-options');
  const clippyClose = document.querySelector('.clippy-close');

  // State
  let isVisible = false;
  let currentAnimation = null;
  let idleTimer = null;
  let hasInteracted = false;

  // Enhanced Clippy animations with more variety
  const animations = {
    idle: [
      { transform: 'translateY(0)' },
      { transform: 'translateY(-5px)' },
      { transform: 'translateY(0)' }
    ],
    wave: [
      { transform: 'rotate(0deg)' },
      { transform: 'rotate(-15deg)' },
      { transform: 'rotate(15deg)' },
      { transform: 'rotate(-10deg)' },
      { transform: 'rotate(10deg)' },
      { transform: 'rotate(0deg)' }
    ],
    think: [
      { transform: 'rotate(0deg) translateY(0)' },
      { transform: 'rotate(10deg) translateY(-3px)' },
      { transform: 'rotate(-5deg) translateY(-1px)' },
      { transform: 'rotate(5deg) translateY(-2px)' },
      { transform: 'rotate(0deg) translateY(0)' }
    ],
    excited: [
      { transform: 'scale(1) rotate(0deg)' },
      { transform: 'scale(1.2) rotate(-5deg)' },
      { transform: 'scale(1.1) rotate(5deg)' },
      { transform: 'scale(1.2) rotate(-3deg)' },
      { transform: 'scale(1.1) rotate(3deg)' },
      { transform: 'scale(1) rotate(0deg)' }
    ],
    confused: [
      { transform: 'rotate(0deg) translateX(0)' },
      { transform: 'rotate(-5deg) translateX(-3px)' },
      { transform: 'rotate(5deg) translateX(3px)' },
      { transform: 'rotate(-3deg) translateX(-2px)' },
      { transform: 'rotate(3deg) translateX(2px)' },
      { transform: 'rotate(0deg) translateX(0)' }
    ],
    disappear: [
      { transform: 'scale(1) rotate(0deg)', opacity: 1 },
      { transform: 'scale(1.2) rotate(5deg)', opacity: 0.8 },
      { transform: 'scale(0.8) rotate(-5deg)', opacity: 0.6 },
      { transform: 'scale(0.5) rotate(10deg)', opacity: 0.3 },
      { transform: 'scale(0.2) rotate(-10deg)', opacity: 0 }
    ],
    appear: [
      { transform: 'scale(0.2) rotate(-10deg)', opacity: 0 },
      { transform: 'scale(0.5) rotate(10deg)', opacity: 0.3 },
      { transform: 'scale(0.8) rotate(-5deg)', opacity: 0.6 },
      { transform: 'scale(1.2) rotate(5deg)', opacity: 0.8 },
      { transform: 'scale(1) rotate(0deg)', opacity: 1 }
    ],
    bounce: [
      { transform: 'translateY(0)' },
      { transform: 'translateY(-20px)' },
      { transform: 'translateY(0)' },
      { transform: 'translateY(-10px)' },
      { transform: 'translateY(0)' }
    ],
    // New animations
    entrance: [
      { transform: 'scale(0.2) translateY(30px) rotate(-10deg)', opacity: 0 },
      { transform: 'scale(1.2) translateY(-10px) rotate(5deg)', opacity: 1, offset: 0.6 },
      { transform: 'scale(0.9) translateY(5px) rotate(-2deg)', opacity: 1, offset: 0.8 },
      { transform: 'scale(1) translateY(0) rotate(0deg)', opacity: 1 }
    ],
    spin: [
      { transform: 'rotate(0deg) scale(1)' },
      { transform: 'rotate(180deg) scale(1.1)', offset: 0.5 },
      { transform: 'rotate(360deg) scale(1)' }
    ],
    dance: [
      { transform: 'translateX(0) rotate(0deg) scale(1)' },
      { transform: 'translateX(-5px) rotate(-5deg) scale(1.1)', offset: 0.2 },
      { transform: 'translateX(5px) rotate(5deg) scale(1.1)', offset: 0.4 },
      { transform: 'translateX(-5px) rotate(-5deg) scale(1.1)', offset: 0.6 },
      { transform: 'translateX(5px) rotate(5deg) scale(1.1)', offset: 0.8 },
      { transform: 'translateX(0) rotate(0deg) scale(1)' }
    ],
    surprise: [
      { transform: 'scale(1) translateY(0) rotate(0deg)' },
      { transform: 'scale(1.3) translateY(-10px) rotate(5deg)', offset: 0.4 },
      { transform: 'scale(1) translateY(0) rotate(0deg)' }
    ],
    shake: [
      { transform: 'translateX(0)' },
      { transform: 'translateX(-5px)', offset: 0.2 },
      { transform: 'translateX(5px)', offset: 0.4 },
      { transform: 'translateX(-3px)', offset: 0.6 },
      { transform: 'translateX(3px)', offset: 0.8 },
      { transform: 'translateX(0)' }
    ]
  };

  // Clippy messages
  const messages = [
    "It looks like you're exploring NosytOS95! Need help?",
    "Did you know you can play Duck Hunt and Doom II in NosytOS95?",
    "Try using the Terminal to launch applications with special commands!",
    "You can resize and maximize windows for a better experience.",
    "Check out the Nosyt AI Assistant for helpful information!",
    "Right-click on the desktop for more options.",
    "The Start menu contains shortcuts to all applications.",
    "Try typing 'help' in the Terminal for a list of commands.",
    "You can find information about NosytLabs services in the Notepad.",
    "Looking for Easter eggs? They're hidden throughout NosytOS95!"
  ];

  // Easter eggs
  const easterEggs = [
    "Did you know? The name 'Nosyt' is 'Tyson' spelled backwards!",
    "There's a secret game hidden in the Terminal. Try typing 'snake'!",
    "If you click the Start button 10 times quickly, something special happens!",
    "Type 'matrix' in the Terminal for a cool effect.",
    "Press the Konami code (↑↑↓↓←→←→BA) anywhere in NosytOS95 for a surprise!",
    "There's a hidden message in the Notepad if you select all text and press Ctrl+A.",
    "Try typing 'coffee' in the Terminal for a caffeine boost!",
    "The Clippy image has 7 different animations. Can you trigger them all?",
    "Type 'credits' in the Terminal to see who made NosytOS95.",
    "If you resize a window to exactly 486x386 pixels, something interesting happens!"
  ];

  // Initialize Clippy with authentic Windows 95 behavior
  function initClippy() {
    if (!clippy) return;

    // Set initial state with classic Windows 95 window styling
    clippy.style.display = 'none';
    clippy.style.border = '3px outset #dfdfdf';
    clippy.style.boxShadow = 'inset -1px -1px #0a0a0a, inset 1px 1px #ffffff, inset -2px -2px #808080, inset 2px 2px #dfdfdf';

    // Show Clippy after delay with authentic Windows 95 startup sound
    setTimeout(() => {
      showClippy();
      if (window.soundManager && typeof window.soundManager.playWin95Startup === 'function') {
        window.soundManager.playWin95Startup();
      }
    }, 2000); // Classic Windows 95 timing

    // Set up authentic Windows 95 event listeners
    clippyImage.addEventListener('click', toggleClippyBubble);
    clippyClose.addEventListener('click', hideClippyBubble);

    // Add Windows 95 title bar drag functionality
    const titleBar = document.createElement('div');
    titleBar.className = 'win95-title-bar';
    titleBar.style.height = '18px';
    titleBar.style.backgroundColor = '#000080';
    titleBar.style.color = 'white';
    titleBar.style.padding = '2px 4px';
    titleBar.style.fontFamily = 'MS Sans Serif, sans-serif';
    titleBar.style.fontSize = '11px';
    titleBar.style.cursor = 'move';
    titleBar.textContent = 'Clippy';
    clippy.insertBefore(titleBar, clippy.firstChild);

    // Set up option buttons with authentic Windows 95 styling
    document.querySelectorAll('.clippy-option').forEach(option => {
      option.style.fontFamily = 'MS Sans Serif, sans-serif';
      option.style.fontSize = '11px';
      option.style.padding = '3px 12px';
      option.style.margin = '2px';
      option.addEventListener('click', handleClippyOption);
      option.addEventListener('mousedown', () => {
        option.style.border = '2px inset #0a0a0a';
        option.style.boxShadow = 'none';
      });
      option.addEventListener('mouseup', () => {
        option.style.border = '2px outset #dfdfdf';
        option.style.boxShadow = 'inset -1px -1px #0a0a0a, inset 1px 1px #ffffff';
      });
    });

    // Set up idle animations
    startIdleAnimations();

    // Add Windows 95 style click sound to Clippy image
    clippyImage.addEventListener('mousedown', () => {
      window.soundManager.playClick();
    });
  }

  // Show Clippy with enhanced animation
  function showClippy() {
    if (!clippy) return;

    // First make sure it's displayed but invisible
    clippy.style.display = 'block';
    clippy.style.opacity = '0';
    clippy.style.transform = 'translateY(20px) scale(0.8)';

    // Force a reflow to ensure the display change takes effect
    void clippy.offsetWidth;

    // Then animate it in with a bounce effect
    setTimeout(() => {
      clippy.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
      clippy.style.opacity = '1';
      clippy.style.transform = 'translateY(0) scale(1)';

      // Play animation
      playAnimation('appear', 1000);

      // Play sound if available
      if (window.soundManager && typeof window.soundManager.playClippyAppear === 'function') {
        window.soundManager.playClippyAppear();
      } else if (window.soundManager && typeof window.soundManager.playNotification === 'function') {
        window.soundManager.playNotification();
      }
    }, 10);

    // Show bubble after animation completes
    setTimeout(() => {
      showClippyBubble();
    }, 1200);

    isVisible = true;
  }

  // Hide Clippy with enhanced animation
  function hideClippy() {
    if (!clippy) return;

    // Hide bubble first
    hideClippyBubble();

    // Play animation
    playAnimation('disappear', 1000);

    // Play sound if available
    if (window.soundManager && typeof window.soundManager.playClippyHide === 'function') {
      window.soundManager.playClippyHide();
    } else if (window.soundManager && typeof window.soundManager.playMenuClose === 'function') {
      window.soundManager.playMenuClose();
    }

    // Animate out with a shrink and fade effect
    setTimeout(() => {
      clippy.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
      clippy.style.opacity = '0';
      clippy.style.transform = 'translateY(20px) scale(0.8)';

      // Hide after animation completes
      setTimeout(() => {
        clippy.style.display = 'none';
        isVisible = false;
      }, 500);
    }, 500);
  }

  // Show message bubble with improved display handling
  function showClippyBubble() {
    if (!clippyBubble || !clippyMessage) {
      console.error('Clippy bubble or message element not found');
      return;
    }

    // Make sure the bubble is visible first
    clippyBubble.style.display = 'block';
    clippyBubble.style.opacity = '0';

    // Force a reflow to ensure the display change takes effect
    void clippyBubble.offsetWidth;

    // Set random message if not interacted yet
    if (!hasInteracted) {
      clippyMessage.textContent = messages[Math.floor(Math.random() * messages.length)];
    }

    // Add active class for animation
    if (!clippyBubble.classList.contains('active')) {
      // Fade in with CSS transition
      clippyBubble.style.opacity = '1';
      clippyBubble.classList.add('active');

      // Play animation
      playAnimation('excited', 800);

      // Play sound if available
      if (window.soundManager && typeof window.soundManager.playNotification === 'function') {
        window.soundManager.playNotification();
      }

      console.log('Clippy bubble shown');
    }
  }

  // Hide message bubble with improved animation
  function hideClippyBubble() {
    if (!clippyBubble) {
      console.error('Clippy bubble element not found');
      return;
    }

    // Remove active class
    clippyBubble.classList.remove('active');

    // Fade out with CSS transition
    clippyBubble.style.opacity = '0';

    // Play animation
    playAnimation('wave', 800);

    // Play sound if available
    if (window.soundManager && typeof window.soundManager.playMenuClose === 'function') {
      window.soundManager.playMenuClose();
    }

    // Hide after animation completes
    setTimeout(() => {
      clippyBubble.style.display = 'none';
      console.log('Clippy bubble hidden');
    }, 300);
  }

  // Toggle message bubble
  function toggleClippyBubble() {
    if (clippyBubble.classList.contains('active')) {
      hideClippyBubble();
    } else {
      showClippyBubble();
    }
  }

  // Handle Clippy option clicks
  function handleClippyOption(e) {
    const action = e.target.getAttribute('data-action');
    hasInteracted = true;
    window.soundManager.playClick();

    switch (action) {
      case 'help':
        clippyMessage.textContent = "Opening the NosytOS95 Help system. You'll find everything you need to know there!";
        playAnimation('excited', 800);

        // Open Help window
        setTimeout(() => {
          const helpWindow = document.getElementById('help-window');
          if (helpWindow) {
            // Show Help window
            helpWindow.style.display = 'block';

            // Bring to front
            const zIndex = Array.from(document.querySelectorAll('.win95-window'))
              .map(win => parseInt(win.style.zIndex || 0))
              .reduce((max, z) => Math.max(max, z), 0);

            helpWindow.style.zIndex = zIndex + 1;
          }

          hideClippyBubble();
        }, 1000);
        break;
      case 'explore':
        clippyMessage.textContent = "Enjoy exploring NosytOS95! I'll be here if you need me.";
        hideClippyBubble();
        break;
      case 'ai':
        clippyMessage.textContent = "Opening Nosyt AI Assistant for you...";
        playAnimation('excited', 800);

        // Open AI Assistant window
        setTimeout(() => {
          const aiWindow = document.getElementById('nosyt-ai-window');
          if (aiWindow) {
            // Show AI window
            aiWindow.style.display = 'block';

            // Bring to front
            const zIndex = Array.from(document.querySelectorAll('.win95-window'))
              .map(win => parseInt(win.style.zIndex || 0))
              .reduce((max, z) => Math.max(max, z), 0);

            aiWindow.style.zIndex = zIndex + 1;
          }

          hideClippyBubble();
        }, 1000);
        break;
      case 'doom':
        clippyMessage.textContent = "Doom II is a classic first-person shooter game. Use WASD to move, mouse to aim, and click to shoot. Press E to interact with objects.";
        playAnimation('think', 1000);
        break;
      case 'easter-egg':
        // Show random easter egg
        const easterEgg = easterEggs[Math.floor(Math.random() * easterEggs.length)];
        clippyMessage.textContent = easterEgg;
        playAnimation('excited', 1000);
        break;
    }
  }

  // Play animation
  function playAnimation(animationName, duration = 1000) {
    if (!clippyImage || !animations[animationName]) return null;

    // Stop current animation if any
    if (currentAnimation && typeof currentAnimation.cancel === 'function') {
      try {
        currentAnimation.cancel();
      } catch (e) {
        console.error('Error canceling animation:', e);
      }
    }

    try {
      // Play new animation
      currentAnimation = clippyImage.animate(
        animations[animationName],
        {
          duration: duration,
          easing: 'ease-in-out',
          iterations: 1
        }
      );

      return currentAnimation;
    } catch (e) {
      console.error('Error playing animation:', e);
      return null;
    }
  }

  // Start idle animations with more variety
  function startIdleAnimations() {
    // Clear existing timer
    if (idleTimer) {
      clearInterval(idleTimer);
    }

    // Set up random idle animations with more variety
    idleTimer = setInterval(() => {
      if (isVisible && !clippyBubble.classList.contains('active')) {
        const randomAnim = Math.random();

        // Use a wider variety of animations
        if (randomAnim < 0.2) {
          playAnimation('idle', 1500);
        } else if (randomAnim < 0.4) {
          playAnimation('think', 2000);
        } else if (randomAnim < 0.6) {
          playAnimation('bounce', 1000);
        } else if (randomAnim < 0.7) {
          playAnimation('shake', 1200);
        } else if (randomAnim < 0.8) {
          playAnimation('spin', 1800);
        } else if (randomAnim < 0.9) {
          playAnimation('wave', 1500);
        } else {
          playAnimation('dance', 2000);
        }

        // Play a sound occasionally
        if (randomAnim > 0.9 && window.soundManager && typeof window.soundManager.playNotification === 'function') {
          window.soundManager.playNotification();
        }
      }
    }, 8000); // Every 8 seconds (slightly more frequent)
  }

  // Initialize Clippy
  initClippy();

  // Add Clippy to global scope for external access
  window.clippyAssistant = {
    show: showClippy,
    hide: hideClippy,
    showMessage: (message) => {
      clippyMessage.textContent = message;
      showClippyBubble();
    },
    playAnimation: playAnimation
  };
});
