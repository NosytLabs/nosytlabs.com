/**
 * NosytOS95 Animations
 * Enhances the Windows 95 interface with smooth animations
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize all NosytOS95 animations
  initNosytOS95Animations();
});

/**
 * Initialize all NosytOS95 animations
 */
function initNosytOS95Animations() {
  // Animate desktop icons
  animateDesktopIcons();

  // Set up window animations
  setupWindowAnimations();

  // Animate Clippy assistant
  animateClippy();

  // Animate Start menu
  setupStartMenuAnimations();

  // Animate taskbar
  animateTaskbar();
}

/**
 * Animate desktop icons with hover and click effects
 */
function animateDesktopIcons() {
  const desktopIcons = document.querySelectorAll('main > button');
  if (!desktopIcons.length) return;

  // Initial animation - stagger the icons appearing
  gsap.from(desktopIcons, {
    opacity: 0,
    y: 20,
    stagger: 0.1,
    duration: 0.5,
    ease: "power2.out",
    delay: 0.5
  });

  // Add hover and click animations to each icon
  desktopIcons.forEach(icon => {
    // Hover animation
    icon.addEventListener('mouseenter', () => {
      gsap.to(icon, {
        scale: 1.1,
        duration: 0.2,
        ease: "power1.out"
      });
    });

    icon.addEventListener('mouseleave', () => {
      gsap.to(icon, {
        scale: 1,
        duration: 0.2,
        ease: "power1.out"
      });
    });

    // Click animation
    icon.addEventListener('mousedown', () => {
      gsap.to(icon, {
        scale: 0.95,
        duration: 0.1
      });
    });

    icon.addEventListener('mouseup', () => {
      gsap.to(icon, {
        scale: 1.1,
        duration: 0.1,
        onComplete: () => {
          gsap.to(icon, {
            scale: 1,
            duration: 0.2,
            delay: 0.1
          });
        }
      });
    });
  });
}

/**
 * Set up animations for window opening, closing, dragging, and resizing
 */
function setupWindowAnimations() {
  // Get all windows
  const windows = document.querySelectorAll('.win95-window');
  if (!windows.length) return;

  // Get viewport dimensions for better window sizing
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Default window sizes (percentage of viewport)
  const defaultSizes = {
    'notepad-window': { width: 85, height: 85 },
    'duck-hunt-window': { width: 90, height: 90 },
    'doom-window': { width: 90, height: 90 },
    'nosyt-ai-window': { width: 85, height: 85 },
    'browser-window': { width: 90, height: 90 },
    'terminal-window': { width: 80, height: 80 },
    'my-computer-window': { width: 85, height: 85 },
    'about-window': { width: 70, height: 70 }
  };

  // Set initial state for all windows
  gsap.set(windows, {
    scale: 0.9,
    opacity: 0,
    display: 'none'
  });

  // Track window states
  const windowStates = {};
  windows.forEach(window => {
    const id = window.id;
    windowStates[id] = {
      isMaximized: false,
      prevWidth: window.style.width,
      prevHeight: window.style.height,
      prevLeft: window.style.left,
      prevTop: window.style.top
    };
  });

  // Add animation for window opening with improved sizing
  function animateWindowOpen(window) {
    // Make sure window is displayed
    gsap.set(window, { display: 'block' });

    // Set window size based on defaults or previous state
    const id = window.id;
    const defaultSize = defaultSizes[id] || { width: 60, height: 60 };

    // Calculate pixel values from percentages
    const width = Math.min(defaultSize.width * viewportWidth / 100, viewportWidth * 0.95);
    const height = Math.min(defaultSize.height * viewportHeight / 100, viewportHeight * 0.9);

    // Center the window
    const left = (viewportWidth - width) / 2;
    const top = (viewportHeight - height) / 2;

    // Set window dimensions
    window.style.width = `${width}px`;
    window.style.height = `${height}px`;

    // Position window if not already positioned
    if (!window.style.left) {
      window.style.left = `${left}px`;
    }
    if (!window.style.top) {
      window.style.top = `${top}px`;
    }

    // Create animation
    gsap.fromTo(window,
      { scale: 0.9, opacity: 0 },
      {
        scale: 1,
        opacity: 1,
        duration: 0.4,
        ease: "back.out(1.2)"
      }
    );

    // Bring window to front
    bringToFront(window);
  }

  // Add animation for window closing
  function animateWindowClose(window) {
    gsap.to(window, {
      scale: 0.9,
      opacity: 0,
      duration: 0.3,
      ease: "power2.in",
      onComplete: () => {
        gsap.set(window, { display: 'none' });
      }
    });
  }

  // Function to bring window to front
  function bringToFront(window) {
    // Get highest z-index
    const highestZ = Array.from(windows)
      .map(w => parseInt(getComputedStyle(w).zIndex) || 0)
      .reduce((max, z) => Math.max(max, z), 0);

    // Set new z-index
    gsap.set(window, { zIndex: highestZ + 1 });
  }

  // Function to maximize/restore window
  function toggleMaximize(window) {
    const id = window.id;
    const state = windowStates[id];

    if (state.isMaximized) {
      // Restore window
      gsap.to(window, {
        width: state.prevWidth,
        height: state.prevHeight,
        left: state.prevLeft,
        top: state.prevTop,
        duration: 0.3,
        ease: "power2.out"
      });
      state.isMaximized = false;
    } else {
      // Save current state
      state.prevWidth = window.style.width;
      state.prevHeight = window.style.height;
      state.prevLeft = window.style.left;
      state.prevTop = window.style.top;

      // Maximize window
      gsap.to(window, {
        width: `${viewportWidth * 0.95}px`,
        height: `${viewportHeight * 0.9}px`,
        left: `${viewportWidth * 0.025}px`,
        top: `${viewportHeight * 0.05}px`,
        duration: 0.3,
        ease: "power2.out"
      });
      state.isMaximized = true;
    }

    // Bring window to front
    bringToFront(window);
  }

  // Set up event listeners for all desktop icons
  const desktopIcons = document.querySelectorAll('.desktop-icon');
  desktopIcons.forEach(icon => {
    icon.addEventListener('click', () => {
      // Find the corresponding window
      const targetId = icon.id.replace('-icon', '-window');
      const targetWindow = document.getElementById(targetId);

      if (targetWindow) {
        animateWindowOpen(targetWindow);
      }
    });
  });

  // Set up window control buttons for all windows
  windows.forEach(window => {
    // Close button
    const closeButton = window.querySelector('.window-close');
    if (closeButton) {
      closeButton.addEventListener('click', () => {
        animateWindowClose(window);
      });
    }

    // Maximize button
    const maximizeButton = window.querySelector('.window-maximize');
    if (maximizeButton) {
      maximizeButton.addEventListener('click', () => {
        toggleMaximize(window);
      });
    }

    // Minimize button
    const minimizeButton = window.querySelector('.window-minimize');
    if (minimizeButton) {
      minimizeButton.addEventListener('click', () => {
        // Simple minimize animation
        gsap.to(window, {
          y: 20,
          opacity: 0,
          scale: 0.9,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => {
            gsap.set(window, { display: 'none' });
          }
        });
      });
    }

    // Double-click on title bar to maximize
    const titleBar = window.querySelector('.window-header');
    if (titleBar) {
      titleBar.addEventListener('dblclick', (e) => {
        // Don't trigger if clicked on buttons
        if (!e.target.closest('.window-controls')) {
          toggleMaximize(window);
        }
      });
    }
  });

  // Add enhanced dragging animation with full-screen movement
  windows.forEach(window => {
    const titleBar = window.querySelector('.window-header');
    if (!titleBar) return;

    // Make window draggable with improved bounds
    Draggable.create(window, {
      type: "x,y",
      trigger: titleBar,
      bounds: {
        minX: -window.offsetWidth * 0.5,
        maxX: viewportWidth - window.offsetWidth * 0.5,
        minY: 0,
        maxY: viewportHeight - 40 // Leave a bit of space at bottom
      },
      edgeResistance: 0.65,
      onPress: function() {
        // Bring window to front
        bringToFront(window);
      },
      onDragStart: function() {
        // Reset maximized state if dragging a maximized window
        const id = window.id;
        if (windowStates[id].isMaximized) {
          windowStates[id].isMaximized = false;

          // Adjust window size to something more reasonable
          const width = Math.min(800, viewportWidth * 0.7);
          const height = Math.min(600, viewportHeight * 0.7);

          gsap.set(window, {
            width: `${width}px`,
            height: `${height}px`
          });
        }

        // Add shadow effect
        gsap.to(window, {
          boxShadow: "0 12px 24px rgba(0,0,0,0.4)",
          duration: 0.3
        });
      },
      onDrag: function() {
        // Add subtle rotation based on drag speed
        const rotation = this.getDirection() === 'left' ? -0.5 : (this.getDirection() === 'right' ? 0.5 : 0);
        gsap.to(window, {
          rotation: rotation,
          duration: 0.1
        });
      },
      onDragEnd: function() {
        // Reset rotation and shadow
        gsap.to(window, {
          rotation: 0,
          boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
          duration: 0.3
        });
      }
    });

    // Make window resizable
    setupWindowResizing(window);
  });

  // Setup window resizing
  function setupWindowResizing(window) {
    const resizeHandles = window.querySelectorAll('.resize-handle');

    resizeHandles.forEach(handle => {
      const direction = handle.className.replace('resize-handle resize-handle-', '');

      Draggable.create(handle, {
        type: direction.includes('e') || direction.includes('w') ? 'x' :
              direction.includes('n') || direction.includes('s') ? 'y' : 'x,y',
        onPress: function(e) {
          // Prevent event bubbling
          e.stopPropagation();

          // Bring window to front
          bringToFront(window);

          // Store initial dimensions
          this.startWidth = window.offsetWidth;
          this.startHeight = window.offsetHeight;
          this.startLeft = window.offsetLeft;
          this.startTop = window.offsetTop;
        },
        onDrag: function() {
          // Calculate new dimensions
          let newWidth = this.startWidth;
          let newHeight = this.startHeight;
          let newLeft = this.startLeft;
          let newTop = this.startTop;

          // Handle east (right) resize
          if (direction.includes('e')) {
            newWidth = this.startWidth + this.x;
          }

          // Handle west (left) resize
          if (direction.includes('w')) {
            newWidth = this.startWidth - this.x;
            newLeft = this.startLeft + this.x;
          }

          // Handle south (bottom) resize
          if (direction.includes('s')) {
            newHeight = this.startHeight + this.y;
          }

          // Handle north (top) resize
          if (direction.includes('n')) {
            newHeight = this.startHeight - this.y;
            newTop = this.startTop + this.y;
          }

          // Apply minimum dimensions
          newWidth = Math.max(newWidth, 300);
          newHeight = Math.max(newHeight, 200);

          // Update window dimensions
          window.style.width = `${newWidth}px`;
          window.style.height = `${newHeight}px`;
          window.style.left = `${newLeft}px`;
          window.style.top = `${newTop}px`;
        },
        onDragEnd: function() {
          // Reset maximized state
          const id = window.id;
          windowStates[id].isMaximized = false;
        }
      });
    });
  }
}

/**
 * Animate the Clippy assistant
 */
function animateClippy() {
  const clippy = document.querySelector('img[alt="Clippy"]');
  const clippyContainer = clippy?.parentElement;
  const clippyText = document.querySelector('p:has(+ img[alt="Clippy"])');
  const clippyButtons = document.querySelectorAll('button:has(+ img[alt="Clippy"])');

  if (!clippy || !clippyContainer || !clippyText) return;

  // Set initial state
  gsap.set(clippyContainer, { opacity: 0, scale: 0.8, transformOrigin: 'bottom right' });

  // Animate Clippy entrance
  gsap.to(clippyContainer, {
    opacity: 1,
    scale: 1,
    duration: 0.5,
    delay: 2,
    ease: "back.out(1.7)"
  });

  // Animate Clippy idle movement
  gsap.to(clippy, {
    rotation: 5,
    duration: 2,
    repeat: -1,
    yoyo: true,
    ease: "sine.inOut"
  });

  // Animate text typing
  if (clippyText) {
    const text = clippyText.textContent;
    clippyText.textContent = '';

    // Type text character by character
    let i = 0;
    const typeInterval = setInterval(() => {
      if (i < text.length) {
        clippyText.textContent += text.charAt(i);
        i++;
      } else {
        clearInterval(typeInterval);

        // Show buttons after text is typed
        if (clippyButtons.length) {
          gsap.fromTo(clippyButtons,
            { opacity: 0, y: 10 },
            {
              opacity: 1,
              y: 0,
              stagger: 0.1,
              duration: 0.3,
              ease: "power2.out"
            }
          );
        }
      }
    }, 30);
  }

  // Close button animation
  const closeButton = document.querySelector('button[ref="s1e98"]');
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      gsap.to(clippyContainer, {
        opacity: 0,
        scale: 0.8,
        duration: 0.3,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(clippyContainer, { display: 'none' });
        }
      });
    });
  }
}

/**
 * Set up animations for the Start menu
 */
function setupStartMenuAnimations() {
  const startButton = document.querySelector('button[ref="s1e101"]');
  const startMenu = document.querySelector('.start-menu');

  if (!startButton || !startMenu) return;

  // Set initial state
  gsap.set(startMenu, {
    opacity: 0,
    y: 20,
    display: 'none',
    transformOrigin: 'bottom left'
  });

  // Toggle start menu on click
  let startMenuOpen = false;

  startButton.addEventListener('click', () => {
    if (startMenuOpen) {
      // Close menu
      gsap.to(startMenu, {
        opacity: 0,
        y: 20,
        duration: 0.2,
        ease: "power2.in",
        onComplete: () => {
          gsap.set(startMenu, { display: 'none' });
        }
      });
    } else {
      // Open menu
      gsap.set(startMenu, { display: 'block' });
      gsap.fromTo(startMenu,
        { opacity: 0, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.3,
          ease: "back.out(1.2)"
        }
      );
    }

    startMenuOpen = !startMenuOpen;
  });

  // Add hover effect to start button
  startButton.addEventListener('mouseenter', () => {
    gsap.to(startButton, {
      scale: 1.05,
      duration: 0.2
    });
  });

  startButton.addEventListener('mouseleave', () => {
    gsap.to(startButton, {
      scale: 1,
      duration: 0.2
    });
  });
}

/**
 * Animate the taskbar
 */
function animateTaskbar() {
  const taskbar = document.querySelector('.taskbar');
  const clock = document.querySelector('.taskbar-clock');

  if (!taskbar) return;

  // Animate taskbar entrance
  gsap.from(taskbar, {
    y: 40,
    opacity: 0,
    duration: 0.5,
    ease: "power2.out",
    delay: 0.2
  });

  // Animate clock
  if (clock) {
    // Update clock every second
    setInterval(() => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const formattedHours = hours % 12 || 12;
      const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;

      // Update clock text
      clock.textContent = `${formattedHours}:${formattedMinutes} ${ampm}`;

      // Add a subtle pulse animation
      gsap.fromTo(clock,
        { scale: 1 },
        {
          scale: 1.05,
          duration: 0.1,
          yoyo: true,
          repeat: 1,
          ease: "sine.inOut"
        }
      );
    }, 60000); // Update every minute
  }
}
