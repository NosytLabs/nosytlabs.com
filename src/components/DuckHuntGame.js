/**
 * DuckHuntGame.js
 * Enhanced Duck Hunt game for NosytOS95
 */

// Game variables
let duckHuntWindow;
let duckHuntSky;
let duckScore;
let duckMessage;
let score = 0;
let level = 1;
let ducksShot = 0;
let totalDucks = 0;
let duckSpeed = 2000; // Base speed in ms
let duckAnimations = [];
let gameActive = false;
let soundEnabled = true;

// Enhanced sound effects with fallback
const soundEffects = {
  quack: null,
  shot: null,
  levelUp: null,
  gameOver: null,
  miss: null,
  reload: null
};

// Initialize sound effects with fallback
function initializeSounds() {
  try {
    // Using data URIs for basic sound effects (simplified for demo)
    soundEffects.quack = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');
    soundEffects.shot = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT');

    // Set volume for all sound effects
    Object.values(soundEffects).forEach(audio => {
      if (audio) {
        audio.volume = 0.3;
        audio.preload = 'auto';
      }
    });
  } catch (error) {
    console.warn('Sound effects could not be loaded:', error);
    // Create silent audio objects as fallback
    Object.keys(soundEffects).forEach(key => {
      soundEffects[key] = { play: () => {}, pause: () => {}, currentTime: 0 };
    });
  }
}

// Play sound effect with error handling
function playSound(soundName) {
  if (!soundEnabled || !soundEffects[soundName]) return;

  try {
    soundEffects[soundName].currentTime = 0;
    soundEffects[soundName].play().catch(e => {
      console.warn(`Could not play ${soundName} sound:`, e);
    });
  } catch (error) {
    console.warn(`Error playing ${soundName} sound:`, error);
  }
}

// Initialize the game when the DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
  initializeDuckHunt();
});

/**
 * Initialize the Duck Hunt game
 */
function initializeDuckHunt() {
  // Get game elements
  duckHuntWindow = document.getElementById('duck-hunt-window');
  duckHuntSky = document.querySelector('.duck-hunt-sky');
  duckScore = document.getElementById('duck-score');
  duckMessage = document.getElementById('duck-message');

  if (!duckHuntWindow || !duckHuntSky || !duckScore || !duckMessage) {
    console.error('Duck Hunt game elements not found');
    return;
  }

  // Add event listeners for window controls
  const closeBtn = duckHuntWindow.querySelector('.window-close');
  const minimizeBtn = duckHuntWindow.querySelector('.window-minimize');
  const maximizeBtn = duckHuntWindow.querySelector('.window-maximize');

  if (closeBtn) {
    closeBtn.addEventListener('click', stopGame);
  }

  if (minimizeBtn) {
    minimizeBtn.addEventListener('click', pauseGame);
  }

  if (maximizeBtn) {
    maximizeBtn.addEventListener('click', function() {
      // Update game area when maximizing/restoring
      setTimeout(updateDuckHuntGame, 100);
    });
  }

  // Add sound toggle button
  const soundToggleBtn = document.createElement('button');
  soundToggleBtn.className = 'sound-toggle-btn';
  soundToggleBtn.innerHTML = '🔊';
  soundToggleBtn.title = 'Toggle Sound';
  soundToggleBtn.style.position = 'absolute';
  soundToggleBtn.style.top = '5px';
  soundToggleBtn.style.right = '100px';
  soundToggleBtn.style.zIndex = '100';
  soundToggleBtn.style.background = 'var(--win95-button-face)';
  soundToggleBtn.style.border = '2px solid';
  soundToggleBtn.style.borderColor = 'var(--win95-button-highlight) var(--win95-button-shadow) var(--win95-button-shadow) var(--win95-button-highlight)';
  soundToggleBtn.style.padding = '2px 5px';

  soundToggleBtn.addEventListener('click', function() {
    soundEnabled = !soundEnabled;
    this.innerHTML = soundEnabled ? '🔊' : '🔇';
  });

  duckHuntWindow.querySelector('.window-header').appendChild(soundToggleBtn);

  // Add start game button
  const startGameBtn = document.createElement('button');
  startGameBtn.className = 'start-game-btn win95-button';
  startGameBtn.textContent = 'Start Game';
  startGameBtn.style.position = 'absolute';
  startGameBtn.style.top = '50%';
  startGameBtn.style.left = '50%';
  startGameBtn.style.transform = 'translate(-50%, -50%)';
  startGameBtn.style.zIndex = '100';
  startGameBtn.style.padding = '10px 20px';

  startGameBtn.addEventListener('click', startGame);

  duckHuntSky.appendChild(startGameBtn);

  // Set up click handler for shooting ducks
  duckHuntSky.addEventListener('click', function(e) {
    if (!gameActive) return;

    // Play shot sound
    playSound('shot');

    // Create shot effect
    createShotEffect(e.clientX, e.clientY);

    // Check if we hit a duck
    const ducks = document.querySelectorAll('.duck');
    let hit = false;

    ducks.forEach(duck => {
      const duckRect = duck.getBoundingClientRect();

      if (e.clientX >= duckRect.left && e.clientX <= duckRect.right &&
          e.clientY >= duckRect.top && e.clientY <= duckRect.bottom) {
        hit = true;
        shootDuck(duck);
      }
    });

    // Penalty for missing
    if (!hit) {
      score = Math.max(0, score - 2);
      duckScore.textContent = score;
      showMessage('Missed! -2 points', 1000);
    }
  });
}

/**
 * Start the Duck Hunt game
 */
function startGame() {
  // Reset game state
  score = 0;
  level = 1;
  ducksShot = 0;
  totalDucks = 0;
  duckSpeed = 2000;

  // Update UI
  duckScore.textContent = score;
  duckMessage.textContent = 'Level 1 - Shoot the ducks!';

  // Remove start button
  const startBtn = document.querySelector('.start-game-btn');
  if (startBtn) {
    startBtn.remove();
  }

  // Clear any existing ducks
  const existingDucks = document.querySelectorAll('.duck');
  existingDucks.forEach(duck => duck.remove());

  // Clear existing animations
  duckAnimations.forEach(animation => clearInterval(animation));
  duckAnimations = [];

  // Set game as active
  gameActive = true;

  // Create initial ducks
  createDucks(2);
}

/**
 * Stop the Duck Hunt game
 */
function stopGame() {
  gameActive = false;

  // Clear animations
  duckAnimations.forEach(animation => clearInterval(animation));
  duckAnimations = [];
}

/**
 * Pause the Duck Hunt game
 */
function pauseGame() {
  if (!gameActive) return;

  // Just stop animations, but keep game state
  duckAnimations.forEach(animation => clearInterval(animation));
  duckAnimations = [];
}

/**
 * Create a specified number of ducks
 */
function createDucks(count) {
  for (let i = 0; i < count; i++) {
    const duck = document.createElement('div');
    duck.className = 'duck';
    duck.style.backgroundImage = 'url(/images/win95/duck.gif)';
    duck.style.backgroundSize = 'contain';
    duck.style.backgroundRepeat = 'no-repeat';
    duck.style.position = 'absolute';
    duck.style.width = '40px';
    duck.style.height = '40px';
    duck.style.transition = 'transform 0.2s';

    duckHuntSky.appendChild(duck);
    animateDuck(duck);
    totalDucks++;
  }
}

/**
 * Animate a duck's movement
 */
function animateDuck(duck) {
  // Set initial position
  const randomTop = Math.floor(Math.random() * 70) + 5;
  const randomLeft = Math.floor(Math.random() * 80) + 5;
  duck.style.top = `${randomTop}%`;
  duck.style.left = `${randomLeft}%`;

  // Random direction
  let directionX = Math.random() > 0.5 ? 1 : -1;
  let directionY = Math.random() > 0.5 ? 1 : -1;

  // Speed based on level
  const speed = Math.max(50, 100 - (level * 5));

  // Animation interval
  const animation = setInterval(() => {
    if (!gameActive || duckHuntWindow.style.display === 'none') {
      clearInterval(animation);
      return;
    }

    // Get current position
    let top = parseFloat(duck.style.top);
    let left = parseFloat(duck.style.left);

    // Update position
    top += directionY * (Math.random() * 1 + 0.5) * (level * 0.2 + 1);
    left += directionX * (Math.random() * 1 + 0.5) * (level * 0.2 + 1);

    // Bounce off edges
    if (top <= 5 || top >= 85) {
      directionY *= -1;
      top = Math.max(5, Math.min(85, top));
      playSound('quack');
    }

    if (left <= 5 || left >= 85) {
      directionX *= -1;
      left = Math.max(5, Math.min(85, left));

      // Flip duck image based on direction
      duck.style.transform = directionX > 0 ? 'scaleX(1)' : 'scaleX(-1)';
      playSound('quack');
    }

    // Apply new position
    duck.style.top = `${top}%`;
    duck.style.left = `${left}%`;
  }, speed);

  duckAnimations.push(animation);

  // Duck escape timeout
  setTimeout(() => {
    if (gameActive && duck.parentNode) {
      // Duck escaped
      duck.remove();

      // Penalty for escaped duck
      score = Math.max(0, score - 5);
      duckScore.textContent = score;
      showMessage('Duck escaped! -5 points', 1500);

      // Create a new duck
      createDucks(1);
    }
  }, duckSpeed * (1 / (level * 0.2 + 1)));
}

/**
 * Handle shooting a duck
 */
function shootDuck(duck) {
  // Play sound
  playSound('quack');

  // Remove duck
  duck.remove();

  // Increment score with level bonus
  const pointBonus = 10 + (level * 2);
  score += pointBonus;
  ducksShot++;

  // Update score display
  duckScore.textContent = score;

  // Show message
  showMessage(`+${pointBonus} points!`, 1000);

  // Check for level up
  if (ducksShot >= 5 * level) {
    levelUp();
  } else {
    // Create a new duck
    setTimeout(() => {
      if (gameActive) {
        createDucks(1);
      }
    }, 1000);
  }
}

/**
 * Level up the game
 */
function levelUp() {
  level++;
  ducksShot = 0;

  // Play level up sound
  playSound('levelUp');

  // Show level up message
  showMessage(`Level ${level}! Speed increased!`, 2000);

  // Increase duck speed
  duckSpeed = Math.max(500, duckSpeed - 300);

  // Clear existing ducks
  const existingDucks = document.querySelectorAll('.duck');
  existingDucks.forEach(duck => duck.remove());

  // Clear existing animations
  duckAnimations.forEach(animation => clearInterval(animation));
  duckAnimations = [];

  // Create new ducks for this level
  setTimeout(() => {
    if (gameActive) {
      // Number of ducks increases with level (max 5)
      const duckCount = Math.min(5, 2 + Math.floor(level / 2));
      createDucks(duckCount);
    }
  }, 2000);
}

/**
 * Create a shot effect at the specified coordinates
 */
function createShotEffect(x, y) {
  const shotEffect = document.createElement('div');
  shotEffect.className = 'shot-effect';
  shotEffect.style.position = 'absolute';
  shotEffect.style.width = '20px';
  shotEffect.style.height = '20px';
  shotEffect.style.backgroundColor = 'yellow';
  shotEffect.style.borderRadius = '50%';
  shotEffect.style.boxShadow = '0 0 10px 5px rgba(255, 255, 0, 0.7)';
  shotEffect.style.zIndex = '50';

  // Position relative to duck hunt sky
  const skyRect = duckHuntSky.getBoundingClientRect();
  shotEffect.style.left = (x - skyRect.left - 10) + 'px';
  shotEffect.style.top = (y - skyRect.top - 10) + 'px';

  duckHuntSky.appendChild(shotEffect);

  // Animate and remove
  setTimeout(() => {
    shotEffect.style.transform = 'scale(0.2)';
    shotEffect.style.opacity = '0';

    setTimeout(() => {
      if (shotEffect.parentNode) {
        shotEffect.remove();
      }
    }, 200);
  }, 50);
}

/**
 * Show a message for a specified duration
 */
function showMessage(text, duration) {
  duckMessage.textContent = text;

  setTimeout(() => {
    if (gameActive) {
      duckMessage.textContent = `Level ${level} - Score: ${score}`;
    }
  }, duration);
}

/**
 * Play a sound effect if sound is enabled
 */
function playSound(soundName) {
  if (!soundEnabled) return;

  try {
    const sound = soundEffects[soundName];
    if (sound) {
      // Clone the audio to allow overlapping sounds
      const audioClone = sound.cloneNode();
      audioClone.volume = 0.5;

      audioClone.play().catch(err => {
        console.log('Audio play failed:', err);
      });
    }
  } catch (e) {
    console.log('Error playing sound:', e);
  }
}

/**
 * Update the Duck Hunt game when the window is resized
 */
function updateDuckHuntGame() {
  if (!duckHuntWindow || duckHuntWindow.style.display === 'none') return;

  // Adjust duck size based on window size
  const isMaximized = duckHuntWindow.classList.contains('maximized');
  const duckSize = isMaximized ? '60px' : '40px';

  const ducks = document.querySelectorAll('.duck');
  ducks.forEach(duck => {
    duck.style.width = duckSize;
    duck.style.height = duckSize;
  });

  // If game is active, restart duck animations
  if (gameActive) {
    // Clear existing animations
    duckAnimations.forEach(animation => clearInterval(animation));
    duckAnimations = [];

    // Restart animations for existing ducks
    ducks.forEach(duck => {
      animateDuck(duck);
    });
  }
}

// Export functions for use in other scripts
window.updateDuckHuntGame = updateDuckHuntGame;
window.startDuckHuntGame = startGame;
window.stopDuckHuntGame = stopGame;
