/**
 * Easter Eggs Fix
 * This script enhances the Easter Eggs implementation
 */

document.addEventListener('DOMContentLoaded', () => {
  // Wait for window system to be ready
  setTimeout(initEasterEggsFix, 1000);
});

function initEasterEggsFix() {
  console.log('Initializing Easter Eggs Fix...');
  
  // Add Konami Code
  addKonamiCode();
  
  // Add other Easter eggs
  addEasterEggs();
  
  // Add Easter eggs to Help documentation
  enhanceHelpDocumentation();
  
  console.log('Easter Eggs Fix initialized');
}

function addKonamiCode() {
  // Konami Code: up, up, down, down, left, right, left, right, b, a
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let konamiIndex = 0;
  
  document.addEventListener('keydown', (e) => {
    // Check if the key matches the next key in the Konami Code
    if (e.key === konamiCode[konamiIndex]) {
      konamiIndex++;
      
      // If the entire code has been entered
      if (konamiIndex === konamiCode.length) {
        // Reset index
        konamiIndex = 0;
        
        // Trigger Konami Code effect
        triggerKonamiCode();
      }
    } else {
      // Reset index if wrong key is pressed
      konamiIndex = 0;
    }
  });
}

function triggerKonamiCode() {
  console.log('Konami Code activated!');
  
  // Create a notification
  showNotification('Konami Code activated!', 'You have unlocked all Easter eggs!');
  
  // Add rainbow effect to desktop
  const desktop = document.querySelector('.desktop');
  if (desktop) {
    desktop.classList.add('rainbow-effect');
    
    // Remove effect after 10 seconds
    setTimeout(() => {
      desktop.classList.remove('rainbow-effect');
    }, 10000);
  }
  
  // Unlock all Easter eggs
  window.allEasterEggsUnlocked = true;
  
  // Add flying Clippy
  addFlyingClippy();
}

function addFlyingClippy() {
  // Create flying Clippy
  const clippy = document.createElement('div');
  clippy.className = 'flying-clippy';
  clippy.innerHTML = `<img src="/images/win95/clippy.png" alt="Clippy">`;
  
  // Add to desktop
  const desktop = document.querySelector('.desktop');
  if (desktop) {
    desktop.appendChild(clippy);
    
    // Animate Clippy
    animateClippy(clippy);
    
    // Remove after 20 seconds
    setTimeout(() => {
      clippy.remove();
    }, 20000);
  }
}

function animateClippy(clippy) {
  // Random position
  const x = Math.random() * window.innerWidth;
  const y = Math.random() * window.innerHeight;
  
  // Set position
  clippy.style.left = x + 'px';
  clippy.style.top = y + 'px';
  
  // Animate to new position after delay
  setTimeout(() => {
    // If Clippy still exists
    if (clippy.parentNode) {
      animateClippy(clippy);
    }
  }, 2000);
}

function addEasterEggs() {
  // Add click counter Easter egg
  addClickCounterEasterEgg();
  
  // Add secret key combination Easter eggs
  addSecretKeyCombinations();
  
  // Add hidden desktop areas
  addHiddenDesktopAreas();
}

function addClickCounterEasterEgg() {
  // Track clicks on desktop
  let clickCount = 0;
  const desktop = document.querySelector('.desktop');
  
  if (desktop) {
    desktop.addEventListener('click', (e) => {
      // Only count direct clicks on the desktop
      if (e.target === desktop) {
        clickCount++;
        
        // Check for Easter egg trigger
        if (clickCount === 10) {
          showNotification('Easter Egg Found!', 'You clicked the desktop 10 times!');
        } else if (clickCount === 25) {
          showNotification('Easter Egg Found!', 'You clicked the desktop 25 times! Are you bored?');
        } else if (clickCount === 50) {
          showNotification('Easter Egg Found!', 'You clicked the desktop 50 times! Have a duck!');
          addRandomDuck();
        } else if (clickCount === 100) {
          showNotification('Easter Egg Found!', 'You clicked the desktop 100 times! You win nothing!');
          
          // Reset counter
          clickCount = 0;
        }
      }
    });
  }
}

function addRandomDuck() {
  // Create a duck
  const duck = document.createElement('div');
  duck.className = 'random-duck';
  duck.innerHTML = `<img src="/images/win95/duck.png" alt="Duck">`;
  
  // Random position
  const x = Math.random() * window.innerWidth;
  const y = Math.random() * window.innerHeight;
  
  // Set position
  duck.style.left = x + 'px';
  duck.style.top = y + 'px';
  
  // Add to desktop
  const desktop = document.querySelector('.desktop');
  if (desktop) {
    desktop.appendChild(duck);
    
    // Make duck draggable
    makeDuckDraggable(duck);
  }
}

function makeDuckDraggable(duck) {
  let isDragging = false;
  let offsetX, offsetY;
  
  duck.addEventListener('mousedown', (e) => {
    isDragging = true;
    offsetX = e.clientX - duck.getBoundingClientRect().left;
    offsetY = e.clientY - duck.getBoundingClientRect().top;
    
    // Add dragging class
    duck.classList.add('dragging');
    
    // Quack!
    playQuackSound();
  });
  
  document.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    
    // Update position
    duck.style.left = (e.clientX - offsetX) + 'px';
    duck.style.top = (e.clientY - offsetY) + 'px';
  });
  
  document.addEventListener('mouseup', () => {
    if (!isDragging) return;
    
    isDragging = false;
    
    // Remove dragging class
    duck.classList.remove('dragging');
  });
}

function playQuackSound() {
  // Create audio element
  const audio = new Audio('/sounds/quack.mp3');
  
  // Play sound
  audio.volume = 0.3;
  audio.play().catch(e => {
    console.log('Sound play error:', e);
  });
}

function addSecretKeyCombinations() {
  // Track key combinations
  let keysPressed = {};
  
  document.addEventListener('keydown', (e) => {
    // Add key to pressed keys
    keysPressed[e.key] = true;
    
    // Check for combinations
    if (keysPressed['Control'] && keysPressed['Alt'] && keysPressed['d']) {
      // Ctrl+Alt+D: Add random duck
      addRandomDuck();
      showNotification('Easter Egg Found!', 'You found the secret duck key!');
    } else if (keysPressed['Control'] && keysPressed['Alt'] && keysPressed['m']) {
      // Ctrl+Alt+M: Matrix effect
      showMatrixEffect();
      showNotification('Easter Egg Found!', 'Matrix mode activated!');
    } else if (keysPressed['Control'] && keysPressed['Alt'] && keysPressed['c']) {
      // Ctrl+Alt+C: Add flying Clippy
      addFlyingClippy();
      showNotification('Easter Egg Found!', 'Clippy is free!');
    }
  });
  
  document.addEventListener('keyup', (e) => {
    // Remove key from pressed keys
    delete keysPressed[e.key];
  });
}

function showMatrixEffect() {
  // Create matrix container
  const matrix = document.createElement('div');
  matrix.className = 'matrix-effect';
  
  // Add to body
  document.body.appendChild(matrix);
  
  // Create matrix characters
  for (let i = 0; i < 100; i++) {
    const column = document.createElement('div');
    column.className = 'matrix-column';
    column.style.left = (i * 10) + 'px';
    column.style.animationDelay = (Math.random() * 2) + 's';
    
    const chars = Math.floor(Math.random() * 20) + 10;
    for (let j = 0; j < chars; j++) {
      const char = document.createElement('div');
      char.className = 'matrix-char';
      char.textContent = String.fromCharCode(0x30A0 + Math.random() * 96);
      char.style.animationDelay = (j * 0.1) + 's';
      
      column.appendChild(char);
    }
    
    matrix.appendChild(column);
  }
  
  // Add exit message
  const exitMessage = document.createElement('div');
  exitMessage.className = 'matrix-exit';
  exitMessage.textContent = 'Press ESC to exit';
  matrix.appendChild(exitMessage);
  
  // Add exit handler
  const handleExit = (e) => {
    if (e.key === 'Escape') {
      // Remove matrix
      matrix.remove();
      
      // Remove event listener
      document.removeEventListener('keydown', handleExit);
    }
  };
  
  document.addEventListener('keydown', handleExit);
}

function addHiddenDesktopAreas() {
  // Add hidden areas to desktop corners
  const desktop = document.querySelector('.desktop');
  
  if (desktop) {
    // Top-left corner
    const topLeft = document.createElement('div');
    topLeft.className = 'hidden-area top-left';
    desktop.appendChild(topLeft);
    
    // Top-right corner
    const topRight = document.createElement('div');
    topRight.className = 'hidden-area top-right';
    desktop.appendChild(topRight);
    
    // Bottom-left corner
    const bottomLeft = document.createElement('div');
    bottomLeft.className = 'hidden-area bottom-left';
    desktop.appendChild(bottomLeft);
    
    // Bottom-right corner
    const bottomRight = document.createElement('div');
    bottomRight.className = 'hidden-area bottom-right';
    desktop.appendChild(bottomRight);
    
    // Add event listeners
    topLeft.addEventListener('click', () => {
      showNotification('Easter Egg Found!', 'You found the top-left corner!');
      addRandomDuck();
    });
    
    topRight.addEventListener('click', () => {
      showNotification('Easter Egg Found!', 'You found the top-right corner!');
      addFlyingClippy();
    });
    
    bottomLeft.addEventListener('click', () => {
      showNotification('Easter Egg Found!', 'You found the bottom-left corner!');
      showMatrixEffect();
    });
    
    bottomRight.addEventListener('click', () => {
      showNotification('Easter Egg Found!', 'You found the bottom-right corner!');
      triggerKonamiCode();
    });
  }
}

function enhanceHelpDocumentation() {
  // Wait for Help window to be created
  document.addEventListener('click', (e) => {
    // Check if Help button was clicked
    if (e.target.closest('.start-menu-item[data-submenu="help"]')) {
      // Wait for Help window to be created
      setTimeout(addEasterEggsToHelp, 500);
    }
  });
}

function addEasterEggsToHelp() {
  // Find Help window
  const helpWindow = document.getElementById('help-window');
  
  if (!helpWindow) return;
  
  // Find Easter Eggs section
  const easterEggsSection = helpWindow.querySelector('#easter-eggs-section');
  
  if (easterEggsSection) {
    // Replace content with enhanced version
    easterEggsSection.innerHTML = `
      <h2>Easter Eggs</h2>
      <p>NosytOS95 contains several hidden Easter eggs for you to discover!</p>
      
      <h3>Known Easter Eggs:</h3>
      <ul>
        <li>Konami Code: Enter the famous Konami Code sequence to unlock special effects.</li>
        <li>Desktop Clicks: Click the desktop multiple times to discover surprises.</li>
        <li>Hidden Corners: Each corner of the desktop hides a secret.</li>
        <li>Secret Key Combinations: Try pressing various key combinations like Ctrl+Alt+D.</li>
      </ul>
      
      <h3>Hints:</h3>
      <ul>
        <li>The Konami Code is a famous cheat code from video games.</li>
        <li>Try clicking the desktop 10, 25, 50, or 100 times.</li>
        <li>Each corner of the desktop has a different surprise.</li>
        <li>Experiment with Ctrl+Alt combinations.</li>
      </ul>
      
      <p class="secret-text">There are more Easter eggs waiting to be discovered...</p>
    `;
    
    // Add secret click handler
    const secretText = easterEggsSection.querySelector('.secret-text');
    if (secretText) {
      secretText.addEventListener('click', () => {
        showNotification('Easter Egg Found!', 'You found the secret text in the Help documentation!');
        
        // Reveal all Easter eggs
        secretText.textContent = 'All Easter eggs: Konami Code (↑↑↓↓←→←→BA), Ctrl+Alt+D (Duck), Ctrl+Alt+M (Matrix), Ctrl+Alt+C (Clippy), Desktop corners, Click desktop multiple times.';
      });
    }
  }
}

function showNotification(title, message) {
  // Create notification
  const notification = document.createElement('div');
  notification.className = 'win95-notification';
  
  notification.innerHTML = `
    <div class="notification-header">
      <div class="notification-title">
        <span>${title}</span>
      </div>
      <div class="notification-close">×</div>
    </div>
    <div class="notification-content">
      <div class="notification-icon">
        <img src="/images/win95/info.png" alt="Info">
      </div>
      <div class="notification-message">
        <p>${message}</p>
      </div>
    </div>
  `;
  
  // Add to desktop
  const desktop = document.querySelector('.desktop');
  if (desktop) {
    desktop.appendChild(notification);
  } else {
    document.body.appendChild(notification);
  }
  
  // Position notification
  notification.style.position = 'absolute';
  notification.style.bottom = '50px';
  notification.style.right = '10px';
  notification.style.zIndex = '10000';
  
  // Add close handler
  const closeButton = notification.querySelector('.notification-close');
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      notification.remove();
    });
  }
  
  // Auto-remove after 5 seconds
  setTimeout(() => {
    if (notification.parentNode) {
      notification.remove();
    }
  }, 5000);
}
