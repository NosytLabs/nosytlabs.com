/**
 * @fileoverview NosytOS95 Easter Eggs and Hidden Features
 *
 * This module contains various Easter eggs and hidden features for the NosytOS95 interface.
 * Features include Konami code activation, secret click combinations, keyboard shortcuts,
 * and hidden messages. All Easter eggs are designed to enhance user experience without
 * interfering with normal functionality.
 *
 * Features:
 * - Konami code (↑↑↓↓←→←→BA) for retro game effects
 * - Secret click combinations on UI elements
 * - Keyboard shortcuts (Ctrl+Alt+N, Ctrl+Alt+D)
 * - Hidden console messages on icon hover
 * - Animated visual effects and sound integration
 *
 * @module easter-eggs
 * @version 1.0.0
 * @author NosytLabs Team
 * @since 1.0.0
 */

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Easter eggs
  initEasterEggs();
});

/**
 * Initializes all Easter egg functionality for the NosytOS95 interface
 *
 * Sets up event listeners and handlers for various Easter egg triggers
 * including Konami code, secret clicks, keyboard shortcuts, and hidden messages.
 * This function should be called once when the DOM is ready.
 *
 * @returns {void}
 * @example
 * // Initialize Easter eggs on DOM ready
 * document.addEventListener('DOMContentLoaded', () => {
 *   initEasterEggs();
 * });
 *
 * @since 1.0.0
 */
function initEasterEggs() {
  // Set up Konami code
  setupKonamiCode();
  
  // Set up secret clicks
  setupSecretClicks();
  
  // Set up keyboard shortcuts
  setupKeyboardShortcuts();
  
  // Set up hidden messages
  setupHiddenMessages();
  
  }

/**
 * Set up the Konami code Easter egg
 * Up, Up, Down, Down, Left, Right, Left, Right, B, A
 */
function setupKonamiCode() {
  const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
  let konamiIndex = 0;
  
  document.addEventListener('keydown', (e) => {
    // Check if the key matches the next key in the Konami code
    if (e.key.toLowerCase() === konamiCode[konamiIndex].toLowerCase()) {
      konamiIndex++;
      
      // If the entire code has been entered
      if (konamiIndex === konamiCode.length) {
        activateKonamiCode();
        konamiIndex = 0;
      }
    } else {
      konamiIndex = 0;
    }
  });
}

/**
 * Activate the Konami code Easter egg
 */
function activateKonamiCode() {
  // Create a retro game effect
  const desktop = document.querySelector('.desktop');
  if (!desktop) return;
  
  // Add special class for animation
  desktop.classList.add('konami-active');
  
  // Create floating game characters
  const characters = ['👾', '🎮', '🕹️', '👻', '🍄', '🔫', '🏆'];
  
  for (let i = 0; i < 20; i++) {
    const character = document.createElement('div');
    character.className = 'konami-character';
    character.textContent = characters[Math.floor(Math.random() * characters.length)];
    character.style.left = `${Math.random() * 100}%`;
    character.style.top = `${Math.random() * 100}%`;
    character.style.animationDuration = `${Math.random() * 3 + 2}s`;
    character.style.animationDelay = `${Math.random() * 2}s`;
    desktop.appendChild(character);
  }
  
  // Play special sound
  const konamiSound = new Audio('/sounds/konami.mp3');
  konamiSound.volume = 0.3;
  konamiSound.play().catch(e => console.warn('Could not play Konami sound:', e));
  
  // Show message
  showEasterEggMessage('KONAMI CODE ACTIVATED!', 'Unlimited lives granted!');
  
  // Remove effect after animation
  setTimeout(() => {
    desktop.classList.remove('konami-active');
    document.querySelectorAll('.konami-character').forEach(el => el.remove());
  }, 10000);
}

/**
 * Set up secret clicks Easter eggs
 */
function setupSecretClicks() {
  // Secret click on the clock
  const clock = document.querySelector('.taskbar-clock');
  if (clock) {
    let clickCount = 0;
    
    clock.addEventListener('click', () => {
      clickCount++;
      
      if (clickCount === 5) {
        activateClockEasterEgg();
        clickCount = 0;
      }
      
      // Reset count after 2 seconds of inactivity
      setTimeout(() => {
        clickCount = 0;
      }, 2000);
    });
  }
  
  // Secret click on the NosytOS95 logo
  const logo = document.querySelector('.start-button img');
  if (logo) {
    logo.addEventListener('dblclick', activateLogoEasterEgg);
  }
}

/**
 * Activate the clock Easter egg
 */
function activateClockEasterEgg() {
  // Change the clock to show a funny message
  const clock = document.querySelector('.taskbar-clock');
  if (!clock) return;
  
  const originalText = clock.textContent;
  clock.textContent = 'TIME 2 HACK';
  
  // Play special sound
  const clockSound = new Audio('/sounds/time-warp.mp3');
  clockSound.volume = 0.3;
  clockSound.play().catch(e => console.warn('Could not play clock sound:', e));
  
  // Show message
  showEasterEggMessage('TIME MANIPULATION', 'You\'ve discovered the secret of time!');
  
  // Restore original clock after delay
  setTimeout(() => {
    clock.textContent = originalText;
  }, 5000);
}

/**
 * Activate the logo Easter egg
 */
function activateLogoEasterEgg() {
  // Make the logo spin
  const logo = document.querySelector('.start-button img');
  if (!logo) return;
  
  logo.classList.add('logo-spin');
  
  // Play special sound
  const spinSound = new Audio('/sounds/spin.mp3');
  spinSound.volume = 0.3;
  spinSound.play().catch(e => console.warn('Could not play spin sound:', e));
  
  // Show message
  showEasterEggMessage('SPIN TO WIN', 'You\'ve unlocked the spinning logo!');
  
  // Remove spin after animation
  setTimeout(() => {
    logo.classList.remove('logo-spin');
  }, 3000);
}

/**
 * Set up keyboard shortcuts Easter eggs
 */
function setupKeyboardShortcuts() {
  document.addEventListener('keydown', (e) => {
    // Ctrl+Alt+N - Nosyt mode
    if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'n') {
      activateNosytMode();
    }
    
    // Ctrl+Alt+D - Developer mode
    if (e.ctrlKey && e.altKey && e.key.toLowerCase() === 'd') {
      activateDeveloperMode();
    }
  });
}

/**
 * Activate Nosyt mode Easter egg
 */
function activateNosytMode() {
  // Add special class to desktop
  const desktop = document.querySelector('.desktop');
  if (!desktop) return;
  
  desktop.classList.add('nosyt-mode');
  
  // Play special sound
  const nosytSound = new Audio('/sounds/nosyt-mode.mp3');
  nosytSound.volume = 0.3;
  nosytSound.play().catch(e => console.warn('Could not play Nosyt mode sound:', e));
  
  // Show message
  showEasterEggMessage('NOSYT MODE ACTIVATED', 'Everything is better with Nosyt!');
  
  // Remove effect after delay
  setTimeout(() => {
    desktop.classList.remove('nosyt-mode');
  }, 10000);
}

/**
 * Activates developer mode Easter egg with animated code snippets
 *
 * Creates floating code elements across the desktop with random rotation
 * and positioning. Plays a special sound effect and displays a message.
 * The effect automatically removes itself after 8 seconds.
 *
 * @returns {void}
 * @example
 * // Activate developer mode (usually triggered by secret key combination)
 * activateDeveloperMode();
 *
 * @since 1.0.0
 */
function activateDeveloperMode() {
  // Add special class to desktop
  const desktop = document.querySelector('.desktop');
  if (!desktop) return;
  
  desktop.classList.add('developer-mode');
  
  // Show fake code elements
  const codeElements = [];
  for (let i = 0; i < 10; i++) {
    const code = document.createElement('div');
    code.className = 'dev-code';
    code.textContent = getRandomCodeSnippet();
    code.style.left = `${Math.random() * 80 + 10}%`;
    code.style.top = `${Math.random() * 80 + 10}%`;
    code.style.transform = `rotate(${Math.random() * 10 - 5}deg)`;
    desktop.appendChild(code);
    codeElements.push(code);
  }
  
  // Play special sound
  const devSound = new Audio('/sounds/developer-mode.mp3');
  devSound.volume = 0.3;
  devSound.play().catch(e => console.warn('Could not play developer mode sound:', e));
  
  // Show message
  showEasterEggMessage('DEVELOPER MODE', 'You\'ve unlocked the matrix!');
  
  // Remove effect after delay
  setTimeout(() => {
    desktop.classList.remove('developer-mode');
    codeElements.forEach(el => el.remove());
  }, 8000);
}

/**
 * Generates a random code snippet for developer mode display
 *
 * Returns a random JavaScript code snippet from a predefined array
 * of NosytOS-related code examples for visual effect.
 *
 * @returns {string} Random code snippet string
 * @example
 * const snippet = getRandomCodeSnippet();
 * // "function initNosytOS() { /* ... */ }"
 *
 * @since 1.0.0
 */
function getRandomCodeSnippet() {
  const snippets = [
    'function initNosytOS() { /* ... */ }',
    'const desktop = document.querySelector(".desktop");',
    'window.addEventListener("load", startNosytOS);',
    'if (isNosytOS) { runEnhancedMode(); }',
    'class NosytWindow extends Window { /* ... */ }',
    'return new Promise(resolve => setTimeout(resolve, 1000));',
    'const apps = ["notepad", "duckHunt", "doom", "terminal"];',
    'NosytUtils.dom.getById("start-menu").classList.toggle("active");',
    'localStorage.setItem("nosytSettings", JSON.stringify(settings));',
    ''
  ];
  
  return snippets[Math.floor(Math.random() * snippets.length)];
}

/**
 * Set up hidden messages Easter eggs
 */
function setupHiddenMessages() {
  // Add hidden messages to various elements
  document.querySelectorAll('.desktop-icon').forEach(icon => {
    // Add data attribute with hidden message
    const iconName = icon.querySelector('.icon-label')?.textContent || 'Icon';
    icon.setAttribute('data-secret', getSecretMessageForIcon(iconName));
    
    // Add hover event to show message in console
    icon.addEventListener('mouseenter', () => {
      if (Math.random() < 0.1) { // 10% chance
        }`, 'color: #00a; background: #eef; padding: 2px 5px;');
      }
    });
  });
}

/**
 * Retrieves a secret message for a specific desktop icon
 *
 * Returns a predefined humorous or cryptic message associated with
 * the given icon name. Used for hidden console messages when hovering
 * over desktop icons.
 *
 * @param {string} iconName - The name/label of the desktop icon
 * @returns {string} Secret message string for the icon
 * @example
 * const message = getSecretMessageForIcon('Notepad');
 * // "All work and no play makes Nosyt a dull boy."
 *
 * @example
 * const message = getSecretMessageForIcon('Unknown Icon');
 * // "Nosyt was here."
 *
 * @since 1.0.0
 */
function getSecretMessageForIcon(iconName) {
  const messages = {
    'My Computer': 'There are no files. There is only Nosyt.',
    'Notepad': 'All work and no play makes Nosyt a dull boy.',
    'Duck Hunt': 'The ducks are not what they seem.',
    'Doom II': 'Rip and tear, until it is done.',
    'Terminal': 'sudo apt-get install nosyt',
    'Clippy': 'I know all your secrets.',
    'Help': 'No one can help you now.',
    'Internet Explorer': '404: Internet not found.'
  };
  
  return messages[iconName] || 'Nosyt was here.';
}

/**
 * Displays an Easter egg message overlay on the desktop
 *
 * Creates a styled message element with title and content that appears
 * on the desktop and automatically removes itself after 4 seconds with
 * a fade-out animation.
 *
 * @param {string} title - The title text for the message
 * @param {string} message - The main message content
 * @returns {void}
 * @example
 * showEasterEggMessage('DEVELOPER MODE', 'You\'ve unlocked the matrix!');
 *
 * @example
 * showEasterEggMessage('Secret Found', 'You discovered a hidden feature!');
 *
 * @since 1.0.0
 */
function showEasterEggMessage(title, message) {
  // Create message element
  const messageEl = document.createElement('div');
  messageEl.className = 'easter-egg-message';
  messageEl.innerHTML = `
    <div class="easter-egg-title">${title}</div>
    <div class="easter-egg-content">${message}</div>
  `;
  
  // Add to desktop
  const desktop = document.querySelector('.desktop');
  if (!desktop) return;
  
  desktop.appendChild(messageEl);
  
  // Remove after delay
  setTimeout(() => {
    messageEl.classList.add('easter-egg-message-hide');
    setTimeout(() => {
      messageEl.remove();
    }, 500);
  }, 4000);
}
