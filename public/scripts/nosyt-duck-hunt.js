/**
 * NosytLabs Duck Hunt Game
 * A simple implementation of the Duck Hunt game for NosytOS95
 */

// Define global namespace for the game
var NosytDuckHunt = window.NosytDuckHunt || {};

// Game state
const gameState = {
  active: false,
  score: 0,
  highScore: 0,
  level: 1,
  ammo: 3,
  maxAmmo: 3,
  ducks: [],
  ducksShot: 0,
  ducksEscaped: 0,
  maxDucksEscaped: 3,
  combo: 0,
  maxCombo: 0,
  sounds: {},
  elements: {}
};

// Use centralized sound configurations from sound-paths.js
// If the global configuration is not available, use fallback configuration
const SOUNDS = window.DUCK_HUNT_SOUNDS || {
  // Primary paths are in the duck-hunt folder, fallbacks in audio folder
  shot: { src: ['./sounds/duck-hunt/shot.mp3', './audio/gun-shot.mp3'], volume: 0.5, preload: true },
  quack: { src: ['./sounds/duck-hunt/quack.mp3', './audio/quack.mp3'], volume: 0.6, preload: true },
  fall: { src: ['./sounds/duck-hunt/fall.mp3', './audio/duck-falling.mp3'], volume: 0.6, preload: true },
  gameStart: { src: ['./audio/game-start.mp3'], volume: 0.4, preload: true },
  levelUp: { src: ['./sounds/duck-hunt/level-up.mp3', './audio/level-up.mp3'], volume: 0.5, preload: true },
  gameOver: { src: ['./audio/game-over.mp3'], volume: 0.5, preload: true },
  dogLaugh: { src: ['./audio/dog-laugh.mp3'], volume: 0.6, preload: false },
  dogBark: { src: ['./audio/dog-bark.mp3'], volume: 0.6, preload: false },
  duckFlap: { src: ['./audio/duck-flap.mp3'], volume: 0.4, preload: false },
  roundClear: { src: ['./audio/round-clear.mp3'], volume: 0.5, preload: false },
  emptyGun: { src: ['./audio/empty-gun.mp3'], volume: 0.5, preload: false },
  reload: { src: ['./audio/reload.mp3'], volume: 0.5, preload: false },
  menuSelect: { src: ['./audio/menu-select.mp3'], volume: 0.4, preload: false }
};

/**
 * Load sounds with fallback paths and service worker support
 */
function loadSounds() {
  // Track loading progress
  let loadedCount = 0;
  const totalSounds = Object.keys(SOUNDS).filter(name => SOUNDS[name].preload).length;

  // Load all sounds
  for (const [name, config] of Object.entries(SOUNDS)) {
    try {
      // Handle array of fallback paths
      const paths = Array.isArray(config.src) ? config.src : [config.src];

      // Create audio element but don't set src yet
      const sound = new Audio();
      sound.volume = config.volume || 0.5;

      // Set preload attribute
      sound.preload = config.preload ? 'auto' : 'none';

      // Add error handling for sound loading
      sound.addEventListener('error', (e) => {
        console.warn(`Error loading sound ${name} from ${paths[0]}:`, e);

        // Try fallback paths if available
        if (paths.length > 1) {
          console.log(`Trying fallback path for ${name}: ${paths[1]}`);
          sound.src = paths[1];
        }
      });

      // Add load event listener for preloaded sounds
      if (config.preload) {
        sound.addEventListener('canplaythrough', () => {
          console.log(`Sound ${name} loaded successfully`);
          loadedCount++;

          // Log loading progress
          if (totalSounds > 0) {
            console.log(`Sound loading progress: ${loadedCount}/${totalSounds}`);
          }
        }, { once: true }); // Use once to prevent memory leaks
      }

      // Check if service worker is active
      if ('serviceWorker' in navigator && navigator.serviceWorker.controller && config.preload) {
        // Fetch through service worker to ensure caching
        fetch(paths[0])
          .then(response => {
            if (!response.ok) {
              throw new Error(`Failed to load sound: ${paths[0]}`);
            }
            console.log(`Sound ${name} cached by service worker`);
            // Set source after successful fetch
            sound.src = paths[0];
            sound.load();
          })
          .catch(error => {
            console.warn(`Service worker fetch failed for ${name}:`, error);
            // Try fallback path
            if (paths.length > 1) {
              fetch(paths[1])
                .then(response => {
                  if (!response.ok) {
                    throw new Error(`Failed to load fallback sound: ${paths[1]}`);
                  }
                  console.log(`Fallback sound ${name} cached by service worker`);
                  sound.src = paths[1];
                  sound.load();
                })
                .catch(fallbackError => {
                  console.error(`All sound loading attempts failed for ${name}:`, fallbackError);
                  // Set source directly as last resort
                  sound.src = paths[0];
                  sound.load();
                });
            } else {
              // Set source directly as last resort
              sound.src = paths[0];
              sound.load();
            }
          });
      } else {
        // Service worker not available, use traditional loading
        sound.src = paths[0];

        // Force preloading
        if (config.preload) {
          sound.load();
        }
      }

      // Store the sound in game state
      gameState.sounds[name] = sound;
    } catch (error) {
      console.error(`Failed to create sound ${name}:`, error);
    }
  }
}

/**
 * Load high score from local storage
 */
function loadHighScore() {
  try {
    const savedHighScore = localStorage.getItem('duckHuntHighScore');
    if (savedHighScore) {
      gameState.highScore = parseInt(savedHighScore, 10);
    }
  } catch (error) {
    console.warn('Error loading high score:', error);
  }
}

/**
 * Save high score to local storage
 */
function saveHighScore() {
  try {
    localStorage.setItem('duckHuntHighScore', gameState.highScore.toString());
  } catch (error) {
    console.warn('Error saving high score:', error);
  }
}

/**
 * Update UI
 */
function updateUI() {
  const { scoreDisplay, levelDisplay, ammoDisplay, comboDisplay, highScoreDisplay } = gameState.elements;

  if (scoreDisplay) scoreDisplay.textContent = gameState.score;
  if (levelDisplay) levelDisplay.textContent = gameState.level;
  if (ammoDisplay) ammoDisplay.textContent = gameState.ammo;
  if (comboDisplay) comboDisplay.textContent = gameState.combo;
  if (highScoreDisplay) highScoreDisplay.textContent = gameState.highScore;
}

/**
 * Show a message on screen
 */
function showMessage(text, duration = 2000) {
  const { messageDisplay } = gameState.elements;
  if (!messageDisplay) return;

  messageDisplay.textContent = text;
  messageDisplay.style.display = 'block';

  if (duration > 0) {
    setTimeout(() => {
      if (messageDisplay) {
        messageDisplay.style.display = 'none';
      }
    }, duration);
  }
}

/**
 * Play a sound with error handling, fallbacks, and visual feedback
 */
function playSound(soundName) {
  const sound = gameState.sounds[soundName];
  if (sound) {
    try {
      // Reset sound to beginning if possible
      try {
        sound.currentTime = 0;
      } catch (timeError) {
        console.warn(`Could not reset sound time for ${soundName}:`, timeError);
        // Continue anyway - this is not critical
      }

      // Create a clone of the sound to allow overlapping sounds
      let soundClone;
      try {
        soundClone = sound.cloneNode();
        soundClone.volume = sound.volume;
      } catch (cloneError) {
        console.warn(`Could not clone sound ${soundName}, using original:`, cloneError);
        soundClone = sound; // Fallback to original sound
      }

      // Add visual feedback for sound effects
      if (soundName === 'shot') {
        // Flash the screen briefly for gunshot
        const gameBackground = gameState.elements.gameBackground;
        if (gameBackground) {
          const flash = document.createElement('div');
          flash.style.position = 'absolute';
          flash.style.top = '0';
          flash.style.left = '0';
          flash.style.width = '100%';
          flash.style.height = '100%';
          flash.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
          flash.style.zIndex = '1000';
          flash.style.pointerEvents = 'none';
          gameBackground.appendChild(flash);

          // Remove flash after a short time
          setTimeout(() => {
            if (flash.parentNode) {
              flash.parentNode.removeChild(flash);
            }
          }, 100);
        }
      }

      // Play the sound with error handling and fallbacks
      soundClone.play().catch(error => {
        console.warn(`Error playing sound ${soundName}:`, error);

        // Try to reload the sound if it failed to play
        if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
          // Get the sound configuration
          const config = SOUNDS[soundName];
          if (config && config.src) {
            const paths = Array.isArray(config.src) ? config.src : [config.src];

            // Try to fetch the sound through the service worker
            fetch(paths[0])
              .then(response => {
                if (!response.ok) throw new Error(`Failed to fetch sound: ${paths[0]}`);
                return response.blob();
              })
              .then(blob => {
                // Create a new audio element with the fetched blob
                const url = URL.createObjectURL(blob);
                const newSound = new Audio(url);
                newSound.volume = config.volume || 0.5;

                // Replace the sound in the game state
                gameState.sounds[soundName] = newSound;

                // Try to play the new sound
                newSound.play().catch(newError => {
                  console.error(`Still failed to play sound ${soundName} after reload:`, newError);
                });
              })
              .catch(fetchError => {
                console.error(`Failed to reload sound ${soundName}:`, fetchError);
              });
          }
        }
      });
    } catch (error) {
      console.warn(`Error playing sound ${soundName}:`, error);
    }
  } else {
    console.warn(`Sound not found: ${soundName}`);
  }
}

/**
 * Create a duck element
 */
function createDuck() {
  // Create a canvas element for the duck
  const duck = document.createElement('canvas');
  duck.className = 'duck';
  duck.width = 64;
  duck.height = 64;

  // Set up the canvas context
  const ctx = duck.getContext('2d');

  // Set duck styles
  Object.assign(duck.style, {
    position: 'absolute',
    width: '50px',
    height: '50px',
    cursor: 'crosshair',
    zIndex: '10'
  });

  // Determine duck type (color) - blue is most common, then black, then red
  const duckType = Math.random() > 0.7 ? 'red' : (Math.random() > 0.5 ? 'black' : 'blue');

  return duck;
}

/**
 * Start the game
 */
function startGame() {
  // Reset game state
  gameState.active = true;
  gameState.score = 0;
  gameState.level = 1;
  gameState.ammo = 3;
  gameState.maxAmmo = 3;
  gameState.ducksShot = 0;
  gameState.ducksEscaped = 0;
  gameState.combo = 0;
  gameState.maxCombo = 0;
  gameState.ducks = [];

  // Update UI
  updateUI();

  // Hide start button
  if (gameState.elements.startButton) {
    gameState.elements.startButton.style.display = 'none';
  }

  // Show start message
  showMessage(`Level ${gameState.level} - Get Ready!`, 2000);

  // Play start sound
  playSound('gameStart');

  // Create dog if not already created
  if (!gameState.dog) {
    gameState.dog = new DuckHuntDog({
      container: gameState.elements.gameBackground
    });
  }

  // Play dog intro animation
  gameState.dog.playIntro(() => {
    // Spawn ducks after dog animation
    spawnDucks(Math.min(gameState.level, 3));
  });
}

/**
 * Spawn ducks
 */
function spawnDucks(count = 1) {
  if (!gameState.active) return;

  for (let i = 0; i < count; i++) {
    // Create duck element
    const duck = createDuck();

    // Determine duck type (color) - blue is most common, then black, then red
    const duckType = Math.random() > 0.7 ? 'red' : (Math.random() > 0.5 ? 'black' : 'blue');

    // Create sprite animator for the duck
    const spriteAnimator = new SpriteAnimator({
      spriteSheet: `/images/win95/duck/${duckType}-duck-sprite.png`,
      frameWidth: 64,
      frameHeight: 64,
      frameCount: 3,
      frameDuration: 150,
      loop: true,
      autoplay: true
    });

    // Add duck to game state
    const duckData = {
      element: duck,
      hit: false,
      direction: Math.random() > 0.5 ? 'right' : 'left',
      speed: 2 + (gameState.level * 0.5),
      type: duckType,
      animator: spriteAnimator,
      ctx: duck.getContext('2d'),
      lastUpdate: Date.now()
    };

    gameState.ducks.push(duckData);

    // Random starting position
    const { gameBackground } = gameState.elements;
    const bgRect = gameBackground.getBoundingClientRect();
    const startX = Math.random() * (bgRect.width - 50);
    const startY = Math.random() * (bgRect.height - 150) + 50;

    duck.style.left = `${startX}px`;
    duck.style.top = `${startY}px`;

    // Set direction
    if (duckData.direction === 'left') {
      duck.style.transform = 'scaleX(-1)';
    }

    // Add to game background
    gameBackground.appendChild(duck);

    // Start animation
    animateDuck(duckData);
  }
}

/**
 * Animate a duck
 */
function animateDuck(duckData) {
  if (!gameState.active || !duckData.element || !duckData.element.parentNode) return;

  const { element, direction, speed, animator, ctx } = duckData;
  const { gameBackground } = gameState.elements;
  const bgRect = gameBackground.getBoundingClientRect();

  // Current position
  let left = parseFloat(element.style.left);
  let top = parseFloat(element.style.top);

  // Calculate new position
  const dirX = direction === 'right' ? 1 : -1;
  const dirY = Math.random() > 0.5 ? 1 : -1;

  left += dirX * speed;
  top += dirY * speed;

  // Check boundaries
  if (left <= 0) {
    left = 0;
    duckData.direction = 'right';
  } else if (left >= bgRect.width - 50) {
    left = bgRect.width - 50;
    duckData.direction = 'left';
  }

  if (top <= 0) {
    top = 0;
  } else if (top >= bgRect.height - 50) {
    top = bgRect.height - 50;
  }

  // Update position
  element.style.left = `${left}px`;
  element.style.top = `${top}px`;

  // Update sprite animation
  if (animator && ctx) {
    // Calculate delta time
    const now = Date.now();
    const deltaTime = now - duckData.lastUpdate;
    duckData.lastUpdate = now;

    // Update animation
    animator.update(deltaTime);

    // Clear canvas
    ctx.clearRect(0, 0, element.width, element.height);

    // Draw sprite
    animator.draw(ctx, 0, 0, element.width, element.height, direction === 'left');
  }

  // Continue animation
  duckData.animationId = requestAnimationFrame(() => animateDuck(duckData));

  // Duck escapes after a certain time
  if (!duckData.escapeTimer) {
    duckData.escapeTimer = setTimeout(() => {
      if (gameState.active && !duckData.hit && element.parentNode) {
        duckEscaped(duckData);
      }
    }, 5000 - (gameState.level * 500));
  }
}

/**
 * Initialize the Duck Hunt game
 */
function initDuckHunt() {
  console.log('Initializing Duck Hunt game...');

/**
 * Handle a shot
 */
function handleShot(e) {
  if (!gameState.active) return;

  // Check if we have ammo
  if (gameState.ammo <= 0) {
    // Play empty gun sound
    playSound('emptyGun');
    return;
  }

  // Decrease ammo
  gameState.ammo--;
  updateUI();

  // Play shot sound
  playSound('shot');

  // Create shot effect
  createShotEffect(e);

  // Check if we hit a duck
  const hit = checkHit(e);

  // If no hit, reset combo
  if (!hit) {
    gameState.combo = 0;
    updateUI();
  }

  // Check if we're out of ammo
  if (gameState.ammo <= 0) {
    // Check if there are still ducks
    if (gameState.ducks.some(duck => !duck.hit)) {
      // Wait for ducks to escape
      setTimeout(() => {
        gameState.ducks.forEach(duck => {
          if (!duck.hit) {
            duckEscaped(duck);
          }
        });
      }, 1000);
    } else {
      // Start next level
      levelUp();
    }
  }
}

/**
 * Create a shot effect
 */
function createShotEffect(e) {
  const { clientX, clientY } = e;
  const { gameBackground } = gameState.elements;

  if (!gameBackground) return;

  const rect = gameBackground.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;

  const shotEffect = document.createElement('div');
  shotEffect.className = 'shot-effect';
  Object.assign(shotEffect.style, {
    position: 'absolute',
    left: `${x}px`,
    top: `${y}px`,
    width: '20px',
    height: '20px',
    backgroundColor: 'white',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    opacity: '1',
    zIndex: '50',
    pointerEvents: 'none'
  });

  gameBackground.appendChild(shotEffect);

  // Animate shot effect
  setTimeout(() => {
    shotEffect.style.width = '40px';
    shotEffect.style.height = '40px';
    shotEffect.style.opacity = '0';

    // Remove after animation
    setTimeout(() => {
      if (shotEffect.parentNode) {
        shotEffect.parentNode.removeChild(shotEffect);
      }
    }, 200);
  }, 10);
}

/**
 * Check if a shot hit a duck
 */
function checkHit(e) {
  const { clientX, clientY } = e;
  const { gameBackground } = gameState.elements;

  if (!gameBackground) return false;

  const rect = gameBackground.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;

  // Check each duck
  for (const duckData of gameState.ducks) {
    if (duckData.hit) continue;

    const duckRect = duckData.element.getBoundingClientRect();
    const duckX = duckRect.left - rect.left;
    const duckY = duckRect.top - rect.top;
    const duckWidth = duckRect.width;
    const duckHeight = duckRect.height;

    // Get actual visible area of the duck (accounting for transparent parts)
    // Most duck sprites have ~30% transparent padding around them
    const visibleMargin = 0.15; // 15% margin from each side
    const visibleX = duckX + (duckWidth * visibleMargin);
    const visibleY = duckY + (duckHeight * visibleMargin);
    const visibleWidth = duckWidth * (1 - 2 * visibleMargin);
    const visibleHeight = duckHeight * (1 - 2 * visibleMargin);

    // Calculate distance from shot to center of duck
    const duckCenterX = duckX + (duckWidth / 2);
    const duckCenterY = duckY + (duckHeight / 2);
    const distanceSquared = Math.pow(x - duckCenterX, 2) + Math.pow(y - duckCenterY, 2);

    // Hybrid hit detection - use both rectangle and distance for better accuracy
    const isInRect = (
      x >= visibleX &&
      x <= visibleX + visibleWidth &&
      y >= visibleY &&
      y <= visibleY + visibleHeight
    );

    // Use a circular hit area for more natural feel
    const hitRadius = Math.min(visibleWidth, visibleHeight) / 2;
    const isInRadius = distanceSquared <= Math.pow(hitRadius, 2);

    // Hit if either condition is met (more forgiving)
    if (isInRect || isInRadius) {
      hitDuck(duckData);
      return true;
    }
  }

  return false;
}

  // Find the Duck Hunt window
  const duckHuntWindow = document.getElementById('duck-hunt-window');
  if (!duckHuntWindow) {
    console.error('Duck Hunt window not found');
    return;
  }

/**
 * Hit a duck
 */
function hitDuck(duckData) {
  // Prevent double-counting hits
  if (duckData.hit) return;

  // Mark as hit
  duckData.hit = true;

  // Stop animation
  cancelAnimationFrame(duckData.animationId);
  clearTimeout(duckData.escapeTimer);

  // Update sprite animator for hit animation
  if (duckData.animator && duckData.ctx) {
    // Create hit animator
    const hitAnimator = new SpriteAnimator({
      spriteSheet: `/images/win95/duck/${duckData.type}-duck-hit.png`,
      frameWidth: 64,
      frameHeight: 64,
      frameCount: 1,
      frameDuration: 500,
      loop: false,
      autoplay: true
    });

    // Replace animator
    duckData.animator = hitAnimator;

    // Draw hit frame
    duckData.ctx.clearRect(0, 0, duckData.element.width, duckData.element.height);
    hitAnimator.draw(duckData.ctx, 0, 0, duckData.element.width, duckData.element.height);
  } else {
    // Fallback for non-canvas ducks
    duckData.element.style.backgroundImage = `url("/images/win95/duck/${duckData.type || 'blue'}-hit.png")`;
  }

  // Play hit sound
  playSound('quack');

  // Increment combo
  gameState.combo++;
  if (gameState.combo > gameState.maxCombo) {
    gameState.maxCombo = gameState.combo;
  }

  // Calculate points with combo multiplier and level bonus
  const comboMultiplier = 1 + (gameState.combo - 1) * 0.1;
  const levelBonus = gameState.level * 0.2;
  const points = Math.round(100 * comboMultiplier * (1 + levelBonus));

  // Add points
  gameState.score += points;

  // Increment ducks shot counter
  gameState.ducksShot++;

  // Check for high score
  if (gameState.score > gameState.highScore) {
    gameState.highScore = gameState.score;
    saveHighScore();
  }

  // Update UI
  updateUI();

  // Show points
  showPoints(duckData.element, points);

  // Start falling animation
  setTimeout(() => {
    // Create falling animator
    if (duckData.ctx) {
      const fallingAnimator = new SpriteAnimator({
        spriteSheet: `/images/win95/duck/${duckData.type}-duck-falling.png`,
        frameWidth: 64,
        frameHeight: 64,
        frameCount: 2,
        frameDuration: 200,
        loop: true,
        autoplay: true
      });

      // Replace animator
      duckData.animator = fallingAnimator;

      // Set up falling animation
      const fallAnimation = () => {
        // Calculate delta time
        const now = Date.now();
        const deltaTime = now - duckData.lastUpdate;
        duckData.lastUpdate = now;

        // Update animation
        fallingAnimator.update(deltaTime);

        // Clear canvas
        duckData.ctx.clearRect(0, 0, duckData.element.width, duckData.element.height);

        // Draw sprite
        fallingAnimator.draw(duckData.ctx, 0, 0, duckData.element.width, duckData.element.height);

        // Move down
        const top = parseFloat(duckData.element.style.top);
        duckData.element.style.top = `${top + 5}px`;

        // Get game background rect
        const { gameBackground } = gameState.elements;
        const bgRect = gameBackground.getBoundingClientRect();

        // Continue animation if still on screen
        if (top < bgRect.height) {
          duckData.animationId = requestAnimationFrame(fallAnimation);
        } else {
          // Remove duck when off screen
          if (duckData.element.parentNode) {
            duckData.element.parentNode.removeChild(duckData.element);
          }

          // Remove from ducks array
          const duckIndex = gameState.ducks.indexOf(duckData);
          if (duckIndex !== -1) {
            gameState.ducks.splice(duckIndex, 1);
          }

          // Check if level up
          if (gameState.ducksShot >= 10 * gameState.level) {
            levelUp();
          } else if (gameState.ducks.length === 0 && gameState.ammo > 0) {
            // Spawn more ducks if none left and we have ammo
            setTimeout(() => {
              spawnDucks(1);
            }, 1000);
          }
        }
      };

      // Start falling animation
      duckData.animationId = requestAnimationFrame(fallAnimation);
    } else {
      // Fallback for non-canvas ducks
      duckData.element.style.backgroundImage = `url("/images/win95/duck/${duckData.type || 'blue'}-falling.gif")`;
      duckData.element.style.transition = 'top 1s ease-in';
      duckData.element.style.top = '100%';

      // Remove duck after animation
      setTimeout(() => {
        if (duckData.element.parentNode) {
          duckData.element.parentNode.removeChild(duckData.element);
        }

        // Remove from ducks array
        const duckIndex = gameState.ducks.indexOf(duckData);
        if (duckIndex !== -1) {
          gameState.ducks.splice(duckIndex, 1);
        }

        // Check if level up
        if (gameState.ducksShot >= 10 * gameState.level) {
          levelUp();
        } else if (gameState.ducks.length === 0 && gameState.ammo > 0) {
          // Spawn more ducks if none left and we have ammo
          setTimeout(() => {
            spawnDucks(1);
          }, 1000);
        }
      }, 1000);
    }

    // Play falling sound
    playSound('fall');
  }, 500);
}

/**
 * Duck escaped
 */
function duckEscaped(duckData) {
  // Stop animation
  cancelAnimationFrame(duckData.animationId);
  clearTimeout(duckData.escapeTimer);

  // Animate escape
  duckData.element.style.transition = 'top 1s ease-in, transform 1s ease-in';
  duckData.element.style.top = '-20%';
  duckData.element.style.transform = 'scale(0.5)';

  // Play sound
  playSound('quack');

  // Remove duck after animation
  setTimeout(() => {
    if (duckData.element.parentNode) {
      duckData.element.parentNode.removeChild(duckData.element);
    }

    // Remove from state
    gameState.ducks = gameState.ducks.filter(d => d !== duckData);

    // Increment escaped ducks
    gameState.ducksEscaped++;

    // Show dog laughing if available
    if (gameState.dog) {
      // Play dog laugh sound
      playSound('dogLaugh');

      // Show dog laughing animation
      gameState.dog.playLaugh(() => {
        // Check if game over
        if (gameState.ducksEscaped >= gameState.maxDucksEscaped) {
          gameOver();
        } else if (gameState.ducks.length === 0 && gameState.ammo > 0) {
          // Spawn more ducks if none left and we have ammo
          setTimeout(() => {
            spawnDucks(1);
          }, 1000);
        }
      });
    } else {
      // Check if game over
      if (gameState.ducksEscaped >= gameState.maxDucksEscaped) {
        gameOver();
      } else if (gameState.ducks.length === 0 && gameState.ammo > 0) {
        // Spawn more ducks if none left and we have ammo
        setTimeout(() => {
          spawnDucks(1);
        }, 1000);
      }
    }
  }, 1000);
}

  // Get the window content
  const gameContainer = duckHuntWindow.querySelector('.window-content');
  if (!gameContainer) {
    console.error('Game container not found');
    return;
  }

  // Store elements
  gameState.elements.gameContainer = gameContainer;

  // Create game UI
  createGameUI();

  // Load sounds
  loadSounds();

  // Load high score
  loadHighScore();

/**
 * Level up
 */
function levelUp() {
  // Increment level
  gameState.level++;

  // Reset ammo
  gameState.ammo = 3 + Math.min(gameState.level, 3);
  gameState.maxAmmo = gameState.ammo;

  // Update UI
  updateUI();

  // Play level up sound
  playSound('levelUp');

  // Show level up message
  showMessage(`Level ${gameState.level}!`, 2000);

  // Spawn ducks after a delay
  setTimeout(() => {
    spawnDucks(Math.min(gameState.level, 3));
  }, 2000);
}

/**
 * Game over
 */
function gameOver() {
  // Set game state
  gameState.active = false;

  // Play game over sound
  playSound('gameOver');

  const finalScore = gameState.score;
  const isHighScore = finalScore > gameState.highScore;

  // Show game over message
  showMessage(
    `Game Over!\nFinal Score: ${finalScore}\nMax Combo: ${gameState.maxCombo}x`,
    3000
  );

  // Check if high score
  if (isHighScore) {
    gameState.highScore = finalScore;
    saveHighScore();

    // Show high score message
    setTimeout(() => {
      showMessage('New High Score!', 2000);
    }, 3000);
  }

  // Show start button after delay
  setTimeout(() => {
    if (gameState.elements.startButton) {
      gameState.elements.startButton.style.display = 'block';
    }
  }, 5000);
}

/**
 * Show points
 */
function showPoints(element, points) {
  const pointsElement = document.createElement('div');
  pointsElement.textContent = `+${points}`;

  Object.assign(pointsElement.style, {
    position: 'absolute',
    color: 'yellow',
    fontWeight: 'bold',
    fontSize: '16px',
    textShadow: '1px 1px 2px black',
    zIndex: '100',
    pointerEvents: 'none'
  });

  // Position points
  const rect = element.getBoundingClientRect();
  const { gameBackground } = gameState.elements;
  const bgRect = gameBackground.getBoundingClientRect();

  pointsElement.style.left = `${rect.left - bgRect.left + rect.width / 2}px`;
  pointsElement.style.top = `${rect.top - bgRect.top}px`;

  // Add to game background
  gameBackground.appendChild(pointsElement);

  // Animate points
  pointsElement.style.transition = 'top 0.5s, opacity 0.5s';

  setTimeout(() => {
    pointsElement.style.top = `${parseFloat(pointsElement.style.top) - 50}px`;
    pointsElement.style.opacity = '0';

    // Remove after animation
    setTimeout(() => {
      if (pointsElement.parentNode) {
        pointsElement.parentNode.removeChild(pointsElement);
      }
    }, 500);
  }, 100);
}

  console.log('Duck Hunt game initialized');
}

/**
 * Initialize the Duck Hunt game when the window is loaded
 */
window.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, setting up Duck Hunt initialization');

  // Wait for the Duck Hunt window to be created
  setTimeout(() => {
    // Get the Duck Hunt icon
    const duckHuntIcon = document.querySelector('[data-app="duck-hunt"]');
    if (duckHuntIcon) {
      // Initialize game when icon is clicked
      duckHuntIcon.addEventListener('click', () => {
        console.log('Duck Hunt icon clicked');

        // Get the Duck Hunt window
        const duckHuntWindow = document.getElementById('duck-hunt-window');
        if (duckHuntWindow) {
          // Show the window
          duckHuntWindow.style.display = 'block';

          // Initialize the game after a short delay
          setTimeout(() => {
            initDuckHunt();
          }, 500);
        }
      });
    }
  }, 1000);
});

/**
 * Create the game UI
 */
function createGameUI() {
  const { gameContainer } = gameState.elements;

  // Clear container
  gameContainer.innerHTML = '';

  // Create game background
  const gameBackground = document.createElement('div');
  gameBackground.className = 'duck-hunt-background';
  gameBackground.style.width = '100%';
  gameBackground.style.height = '100%';
  gameBackground.style.position = 'relative';
  gameBackground.style.backgroundImage = 'url("/images/win95/duck-hunt-bg.png")';
  gameBackground.style.backgroundSize = 'cover';
  gameBackground.style.backgroundPosition = 'center bottom';
  gameBackground.style.cursor = 'crosshair';
  gameBackground.style.overflow = 'hidden';

  // Create score panel
  const scorePanel = document.createElement('div');
  scorePanel.className = 'duck-hunt-score';
  scorePanel.innerHTML = `
    <div>Score: <span id="duck-score">0</span></div>
    <div>Level: <span id="duck-level">1</span></div>
    <div>Ammo: <span id="duck-ammo">3</span></div>
    <div>Combo: <span id="duck-combo">0</span></div>
    <div class="high-score">High Score: <span id="duck-high-score">0</span></div>
  `;
  scorePanel.style.position = 'absolute';
  scorePanel.style.top = '10px';
  scorePanel.style.left = '10px';
  scorePanel.style.padding = '10px';
  scorePanel.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  scorePanel.style.color = 'white';
  scorePanel.style.fontFamily = 'MS Sans Serif, sans-serif';
  scorePanel.style.fontSize = '14px';
  scorePanel.style.borderRadius = '5px';
  scorePanel.style.zIndex = '100';

  // Create message display
  const messageDisplay = document.createElement('div');
  messageDisplay.id = 'duck-message';
  messageDisplay.style.position = 'absolute';
  messageDisplay.style.top = '50%';
  messageDisplay.style.left = '50%';
  messageDisplay.style.transform = 'translate(-50%, -50%)';
  messageDisplay.style.padding = '15px';
  messageDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  messageDisplay.style.color = 'white';
  messageDisplay.style.fontFamily = 'MS Sans Serif, sans-serif';
  messageDisplay.style.fontSize = '18px';
  messageDisplay.style.borderRadius = '5px';
  messageDisplay.style.zIndex = '200';
  messageDisplay.style.textAlign = 'center';
  messageDisplay.style.display = 'none';

  // Create start button
  const startButton = document.createElement('button');
  startButton.id = 'duck-hunt-start';
  startButton.textContent = 'Start Game';
  startButton.style.position = 'absolute';
  startButton.style.bottom = '20px';
  startButton.style.left = '50%';
  startButton.style.transform = 'translateX(-50%)';
  startButton.style.padding = '10px 20px';
  startButton.style.backgroundColor = '#4CAF50';
  startButton.style.color = 'white';
  startButton.style.border = 'none';
  startButton.style.borderRadius = '5px';
  startButton.style.fontFamily = 'MS Sans Serif, sans-serif';
  startButton.style.fontSize = '16px';
  startButton.style.cursor = 'pointer';
  startButton.style.zIndex = '100';

  // Add elements to game background
  gameBackground.appendChild(scorePanel);
  gameBackground.appendChild(messageDisplay);
  gameBackground.appendChild(startButton);

  // Add game background to container
  gameContainer.appendChild(gameBackground);

  // Store UI elements
  gameState.elements = {
    gameContainer,
    scoreDisplay: document.getElementById('duck-score'),
    levelDisplay: document.getElementById('duck-level'),
    ammoDisplay: document.getElementById('duck-ammo'),
    comboDisplay: document.getElementById('duck-combo'),
    highScoreDisplay: document.getElementById('duck-high-score'),
    messageDisplay,
    startButton,
    gameBackground
  };

  // Add click handler for shooting
  gameBackground.addEventListener('click', handleShot);

  // Add click handler for start button
  startButton.addEventListener('click', startGame);

  // Update UI
  updateUI();
}
function initDuckHunt() {
  console.log('Initializing Duck Hunt game...');

  // Find the Duck Hunt window
  const duckHuntWindow = document.getElementById('duck-hunt-window');
  if (!duckHuntWindow) {
    console.error('Duck Hunt window not found');
    return;
  }

  // Get the window content
  const gameContainer = duckHuntWindow.querySelector('.window-content');
  if (!gameContainer) {
    console.error('Game container not found');
    return;
  }

  // Store elements
  gameState.elements.gameContainer = gameContainer;

  // Create game UI
  createGameUI();

  // Load sounds
  loadSounds();

  // Load high score
  loadHighScore();

  console.log('Duck Hunt game initialized');
}

/**
 * Create the game UI
 */
function createGameUI() {
  const { gameContainer } = gameState.elements;

  // Clear container
  gameContainer.innerHTML = '';

  // Create game background
  const gameBackground = document.createElement('div');
  gameBackground.className = 'duck-hunt-background';
  gameBackground.style.width = '100%';
  gameBackground.style.height = '100%';
  gameBackground.style.position = 'relative';
  gameBackground.style.backgroundImage = 'url("/images/win95/duck-hunt-bg.png")';
  gameBackground.style.backgroundSize = 'cover';
  gameBackground.style.backgroundPosition = 'center bottom';
  gameBackground.style.cursor = 'crosshair';
  gameBackground.style.overflow = 'hidden';

  // Create score panel
  const scorePanel = document.createElement('div');
  scorePanel.className = 'duck-hunt-score';
  scorePanel.innerHTML = `
    <div>Score: <span id="duck-score">0</span></div>
    <div>Level: <span id="duck-level">1</span></div>
    <div>Ammo: <span id="duck-ammo">3</span></div>
    <div>Combo: <span id="duck-combo">0</span></div>
    <div class="high-score">High Score: <span id="duck-high-score">0</span></div>
  `;
  scorePanel.style.position = 'absolute';
  scorePanel.style.top = '10px';
  scorePanel.style.left = '10px';
  scorePanel.style.padding = '10px';
  scorePanel.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  scorePanel.style.color = 'white';
  scorePanel.style.fontFamily = 'MS Sans Serif, sans-serif';
  scorePanel.style.fontSize = '14px';
  scorePanel.style.borderRadius = '5px';
  scorePanel.style.zIndex = '100';

  // Create message display
  const messageDisplay = document.createElement('div');
  messageDisplay.id = 'duck-message';
  messageDisplay.style.position = 'absolute';
  messageDisplay.style.top = '50%';
  messageDisplay.style.left = '50%';
  messageDisplay.style.transform = 'translate(-50%, -50%)';
  messageDisplay.style.padding = '15px';
  messageDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  messageDisplay.style.color = 'white';
  messageDisplay.style.fontFamily = 'MS Sans Serif, sans-serif';
  messageDisplay.style.fontSize = '18px';
  messageDisplay.style.borderRadius = '5px';
  messageDisplay.style.zIndex = '200';
  messageDisplay.style.textAlign = 'center';
  messageDisplay.style.display = 'none';

  // Create start button
  const startButton = document.createElement('button');
  startButton.id = 'duck-hunt-start';
  startButton.textContent = 'Start Game';
  startButton.style.position = 'absolute';
  startButton.style.bottom = '20px';
  startButton.style.left = '50%';
  startButton.style.transform = 'translateX(-50%)';
  startButton.style.padding = '10px 20px';
  startButton.style.backgroundColor = '#4CAF50';
  startButton.style.color = 'white';
  startButton.style.border = 'none';
  startButton.style.borderRadius = '5px';
  startButton.style.fontFamily = 'MS Sans Serif, sans-serif';
  startButton.style.fontSize = '16px';
  startButton.style.cursor = 'pointer';
  startButton.style.zIndex = '100';

  // Add elements to game background
  gameBackground.appendChild(scorePanel);
  gameBackground.appendChild(messageDisplay);
  gameBackground.appendChild(startButton);

  // Add game background to container
  gameContainer.appendChild(gameBackground);

  // Store UI elements
  gameState.elements = {
    gameContainer,
    scoreDisplay: document.getElementById('duck-score'),
    levelDisplay: document.getElementById('duck-level'),
    ammoDisplay: document.getElementById('duck-ammo'),
    comboDisplay: document.getElementById('duck-combo'),
    highScoreDisplay: document.getElementById('duck-high-score'),
    messageDisplay,
    startButton,
    gameBackground
  };

  // Add click handler for shooting
  gameBackground.addEventListener('click', handleShot);

  // Add click handler for start button
  startButton.addEventListener('click', () => {
    // Play menu select sound
    playSound('menuSelect');

    // Start the game after a short delay
    setTimeout(() => {
      startGame();
    }, 200);
  });

  // Update UI
  updateUI();
}
/**
 * Load sounds
 */
function loadSounds() {
  // Load all sounds
  for (const [name, config] of Object.entries(SOUNDS)) {
    try {
      const sound = new Audio(config.src);
      sound.volume = config.volume || 0.5;

      // Add error handling for sound loading
      sound.addEventListener('error', (e) => {
        console.warn(`Error loading sound ${name}:`, e);
      });

      // Add load event listener
      sound.addEventListener('canplaythrough', () => {
        console.log(`Sound ${name} loaded successfully`);
      });

      // Preload the sound
      sound.load();

      // Store the sound in game state
      gameState.sounds[name] = sound;
    } catch (error) {
      console.error(`Failed to create sound ${name}:`, error);
    }
  }
}

/**
 * Load high score from local storage
 */
function loadHighScore() {
  try {
    const savedHighScore = localStorage.getItem('duckHuntHighScore');
    if (savedHighScore) {
      gameState.highScore = parseInt(savedHighScore, 10);
    }
  } catch (error) {
    console.warn('Error loading high score:', error);
  }
}

/**
 * Save high score to local storage
 */
function saveHighScore() {
  try {
    localStorage.setItem('duckHuntHighScore', gameState.highScore.toString());
  } catch (error) {
    console.warn('Error saving high score:', error);
  }
}

/**
 * Update UI
 */
function updateUI() {
  const { scoreDisplay, levelDisplay, ammoDisplay, comboDisplay, highScoreDisplay } = gameState.elements;

  if (scoreDisplay) scoreDisplay.textContent = gameState.score;
  if (levelDisplay) levelDisplay.textContent = gameState.level;
  if (ammoDisplay) ammoDisplay.textContent = gameState.ammo;
  if (comboDisplay) comboDisplay.textContent = gameState.combo;
  if (highScoreDisplay) highScoreDisplay.textContent = gameState.highScore;
}

/**
 * Show a message on screen
 */
function showMessage(text, duration = 2000) {
  const { messageDisplay } = gameState.elements;
  if (!messageDisplay) return;

  messageDisplay.textContent = text;
  messageDisplay.style.display = 'block';

  if (duration > 0) {
    setTimeout(() => {
      if (messageDisplay) {
        messageDisplay.style.display = 'none';
      }
    }, duration);
  }
}

/**
 * Play a sound
 */
function playSound(soundName) {
  const sound = gameState.sounds[soundName];
  if (sound) {
    try {
      // Create a clone of the sound to allow overlapping sounds
      const soundClone = sound.cloneNode();
      soundClone.volume = sound.volume;

      // Add visual feedback for sound effects
      if (soundName === 'shot') {
        // Flash the screen briefly for gunshot
        const gameBackground = gameState.elements.gameBackground;
        if (gameBackground) {
          const flash = document.createElement('div');
          flash.style.position = 'absolute';
          flash.style.top = '0';
          flash.style.left = '0';
          flash.style.width = '100%';
          flash.style.height = '100%';
          flash.style.backgroundColor = 'rgba(255, 255, 255, 0.3)';
          flash.style.zIndex = '1000';
          flash.style.pointerEvents = 'none';
          gameBackground.appendChild(flash);

          // Remove flash after a short time
          setTimeout(() => {
            if (flash.parentNode) {
              flash.parentNode.removeChild(flash);
            }
          }, 100);
        }
      }

      // Play the sound with error handling
      soundClone.play().catch(error => {
        console.warn(`Error playing sound ${soundName}:`, error);
      });
    } catch (error) {
      console.warn(`Error playing sound ${soundName}:`, error);
    }
  } else {
    console.warn(`Sound not found: ${soundName}`);
  }
}

/**
 * Create a duck element
 */
function createDuck() {
  const duck = document.createElement('div');
  duck.className = 'duck';

  Object.assign(duck.style, {
    position: 'absolute',
    width: '50px',
    height: '50px',
    backgroundImage: 'url("/images/win95/duck/blue-right.gif")',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    cursor: 'crosshair',
    zIndex: '10'
  });

  return duck;
}

/**
 * Start the game
 */
function startGame() {
  // Reset game state
  gameState.active = true;
  gameState.score = 0;
  gameState.level = 1;
  gameState.ammo = 3;
  gameState.maxAmmo = 3;
  gameState.ducksShot = 0;
  gameState.ducksEscaped = 0;
  gameState.combo = 0;
  gameState.maxCombo = 0;
  gameState.ducks = [];

  // Play reload sound
  playSound('reload');

  // Update UI
  updateUI();

  // Hide start button
  if (gameState.elements.startButton) {
    gameState.elements.startButton.style.display = 'none';
  }

  // Show start message
  showMessage(`Level ${gameState.level} - Get Ready!`, 2000);

  // Play start sound
  playSound('gameStart');

  // Spawn ducks after a delay
  setTimeout(spawnDucks, 2000);
}

/**
 * Spawn ducks
 */
function spawnDucks(count = 1) {
  if (!gameState.active) return;

  for (let i = 0; i < count; i++) {
    // Create duck element
    const duck = createDuck();

    // Add duck to game state
    const duckData = {
      element: duck,
      hit: false,
      direction: Math.random() > 0.5 ? 'right' : 'left',
      speed: 2 + (gameState.level * 0.5)
    };

    gameState.ducks.push(duckData);

    // Random starting position
    const { gameBackground } = gameState.elements;
    const bgRect = gameBackground.getBoundingClientRect();
    const startX = Math.random() * (bgRect.width - 50);
    const startY = Math.random() * (bgRect.height - 150) + 50;

    duck.style.left = `${startX}px`;
    duck.style.top = `${startY}px`;

    // Set direction
    if (duckData.direction === 'left') {
      duck.style.transform = 'scaleX(-1)';
    }

    // Add to game background
    gameBackground.appendChild(duck);

    // Start animation
    animateDuck(duckData);
  }
}

/**
 * Animate a duck
 */
function animateDuck(duckData) {
  if (!gameState.active || !duckData.element || !duckData.element.parentNode) return;

  const { element, direction, speed } = duckData;
  const { gameBackground } = gameState.elements;
  const bgRect = gameBackground.getBoundingClientRect();

  // Current position
  let left = parseFloat(element.style.left);
  let top = parseFloat(element.style.top);

  // Calculate new position
  const dirX = direction === 'right' ? 1 : -1;
  const dirY = Math.random() > 0.5 ? 1 : -1;

  left += dirX * speed;
  top += dirY * speed;

  // Check boundaries
  if (left <= 0) {
    left = 0;
    duckData.direction = 'right';
    element.style.transform = '';
  } else if (left >= bgRect.width - 50) {
    left = bgRect.width - 50;
    duckData.direction = 'left';
    element.style.transform = 'scaleX(-1)';
  }

  if (top <= 0) {
    top = 0;
  } else if (top >= bgRect.height - 50) {
    top = bgRect.height - 50;
  }

  // Update position
  element.style.left = `${left}px`;
  element.style.top = `${top}px`;

  // Continue animation
  duckData.animationId = requestAnimationFrame(() => animateDuck(duckData));

  // Duck escapes after a certain time
  if (!duckData.escapeTimer) {
    duckData.escapeTimer = setTimeout(() => {
      if (gameState.active && !duckData.hit && element.parentNode) {
        duckEscaped(duckData);
      }
    }, 5000 - (gameState.level * 500));
  }
}

/**
 * Handle a shot
 */
function handleShot(e) {
  if (!gameState.active || gameState.ammo <= 0) return;

  // Decrease ammo
  gameState.ammo--;
  updateUI();

  // Play shot sound
  playSound('shot');

  // Create shot effect
  createShotEffect(e);

  // Check if we hit a duck
  const hit = checkHit(e);

  // If no hit, reset combo
  if (!hit) {
    gameState.combo = 0;
    updateUI();
  }

  // Check if we're out of ammo
  if (gameState.ammo <= 0) {
    // Check if there are still ducks
    if (gameState.ducks.some(duck => !duck.hit)) {
      // Wait for ducks to escape
      setTimeout(() => {
        gameState.ducks.forEach(duck => {
          if (!duck.hit) {
            duckEscaped(duck);
          }
        });
      }, 1000);
    } else {
      // Start next level
      levelUp();
    }
  }
}

/**
 * Create a shot effect
 */
function createShotEffect(e) {
  const { clientX, clientY } = e;
  const { gameBackground } = gameState.elements;

  if (!gameBackground) return;

  const rect = gameBackground.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;

  const shotEffect = document.createElement('div');
  shotEffect.className = 'shot-effect';
  Object.assign(shotEffect.style, {
    position: 'absolute',
    left: `${x}px`,
    top: `${y}px`,
    width: '20px',
    height: '20px',
    backgroundColor: 'white',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    opacity: '1',
    zIndex: '50',
    pointerEvents: 'none'
  });

  gameBackground.appendChild(shotEffect);

  // Animate shot effect
  setTimeout(() => {
    shotEffect.style.width = '40px';
    shotEffect.style.height = '40px';
    shotEffect.style.opacity = '0';

    // Remove after animation
    setTimeout(() => {
      if (shotEffect.parentNode) {
        shotEffect.parentNode.removeChild(shotEffect);
      }
    }, 200);
  }, 10);
}

/**
 * Check if a shot hit a duck
 */
function checkHit(e) {
  const { clientX, clientY } = e;
  const { gameBackground } = gameState.elements;

  if (!gameBackground) return false;

  const rect = gameBackground.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;

  // Check each duck
  for (const duckData of gameState.ducks) {
    if (duckData.hit) continue;

    const duckRect = duckData.element.getBoundingClientRect();
    const duckX = duckRect.left - rect.left;
    const duckY = duckRect.top - rect.top;
    const duckWidth = duckRect.width;
    const duckHeight = duckRect.height;

    // Check if shot is within duck bounds
    if (
      x >= duckX &&
      x <= duckX + duckWidth &&
      y >= duckY &&
      y <= duckY + duckHeight
    ) {
      hitDuck(duckData);
      return true;
    }
  }

  return false;
}
/**
 * Handle a duck being hit
 */
function hitDuck(duckData) {
  // Mark as hit
  duckData.hit = true;

  // Stop animation
  cancelAnimationFrame(duckData.animationId);
  clearTimeout(duckData.escapeTimer);

  // Update sprite
  duckData.element.style.backgroundImage = 'url("/images/win95/duck/blue-hit.png")';

  // Play hit sound with a slight delay between sounds
  playSound('quack');

  // Add visual feedback for hit
  const hitEffect = document.createElement('div');
  hitEffect.className = 'duck-hit-effect';
  Object.assign(hitEffect.style, {
    position: 'absolute',
    width: '60px',
    height: '60px',
    left: duckData.element.style.left,
    top: duckData.element.style.top,
    backgroundImage: 'url("/images/win95/duck/hit-effect.png")',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    zIndex: '20',
    pointerEvents: 'none',
    transform: 'translate(-5px, -5px)'
  });

  // Add hit effect to game background
  const { gameBackground } = gameState.elements;
  if (gameBackground) {
    gameBackground.appendChild(hitEffect);

    // Remove hit effect after animation
    setTimeout(() => {
      if (hitEffect.parentNode) {
        hitEffect.parentNode.removeChild(hitEffect);
      }
    }, 300);
  }

  // Increment combo
  gameState.combo++;
  if (gameState.combo > gameState.maxCombo) {
    gameState.maxCombo = gameState.combo;
  }

  // Calculate points with combo multiplier
  const comboMultiplier = 1 + (gameState.combo - 1) * 0.1;
  const points = Math.round(100 * comboMultiplier);

  // Add points
  gameState.score += points;

  // Update UI
  updateUI();

  // Show points
  showPoints(duckData.element, points);

  // Start falling animation after a short delay
  setTimeout(() => {
    duckData.element.style.backgroundImage = 'url("/images/win95/duck/blue-falling.gif")';
    duckData.element.style.transition = 'top 1s ease-in';
    duckData.element.style.top = '100%';

    // Play falling sound
    playSound('fall');

    // Remove duck after animation
    setTimeout(() => {
      if (duckData.element.parentNode) {
        duckData.element.parentNode.removeChild(duckData.element);
      }

      // Remove from state
      gameState.ducks = gameState.ducks.filter(d => d !== duckData);

      // Increment ducks shot
      gameState.ducksShot++;

      // Check if level up
      if (gameState.ducksShot >= 10 * gameState.level) {
        levelUp();
      } else if (gameState.ducks.length === 0 && gameState.ammo > 0) {
        // Spawn more ducks if none left and we have ammo
        setTimeout(() => {
          spawnDucks(1);
        }, 1000);
      }
    }, 1000);
  }, 500);
}

/**
 * Duck escaped
 */
function duckEscaped(duckData) {
  // Stop animation
  cancelAnimationFrame(duckData.animationId);
  clearTimeout(duckData.escapeTimer);

  // Animate escape
  duckData.element.style.transition = 'top 1s ease-in, transform 1s ease-in';
  duckData.element.style.top = '-20%';
  duckData.element.style.transform = 'scale(0.5)';

  // Play escape sound
  playSound('quack');

  // Add visual feedback for escape
  const escapeEffect = document.createElement('div');
  escapeEffect.className = 'duck-escape-effect';
  Object.assign(escapeEffect.style, {
    position: 'absolute',
    width: '60px',
    height: '60px',
    left: duckData.element.style.left,
    top: duckData.element.style.top,
    backgroundImage: 'url("/images/win95/duck/escape-effect.png")',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    zIndex: '20',
    pointerEvents: 'none',
    transform: 'translate(-5px, -5px)'
  });

  // Add escape effect to game background
  const { gameBackground } = gameState.elements;
  if (gameBackground) {
    gameBackground.appendChild(escapeEffect);

    // Remove escape effect after animation
    setTimeout(() => {
      if (escapeEffect.parentNode) {
        escapeEffect.parentNode.removeChild(escapeEffect);
      }
    }, 300);
  }

  // Remove duck after animation
  setTimeout(() => {
    if (duckData.element.parentNode) {
      duckData.element.parentNode.removeChild(duckData.element);
    }

    // Remove from state
    gameState.ducks = gameState.ducks.filter(d => d !== duckData);

    // Increment escaped ducks
    gameState.ducksEscaped++;

    // Play dog laugh sound if duck escaped
    playSound('dogLaugh');

    // Check if game over
    if (gameState.ducksEscaped >= gameState.maxDucksEscaped) {
      gameOver();
    } else if (gameState.ducks.length === 0 && gameState.ammo > 0) {
      // Spawn more ducks if none left and we have ammo
      setTimeout(() => {
        spawnDucks(1);
      }, 1000);
    }
  }, 1000);
}

/**
 * Level up
 */
function levelUp() {
  // Play round clear sound
  playSound('roundClear');

  // Increment level
  gameState.level++;

  // Reset ammo
  gameState.ammo = 3 + Math.min(gameState.level, 3);
  gameState.maxAmmo = gameState.ammo;

  // Play reload sound
  playSound('reload');

  // Update UI
  updateUI();

  // Show level up message
  showMessage(`Level ${gameState.level}!`, 2000);

  // Play level up sound after a short delay
  setTimeout(() => {
    playSound('levelUp');
  }, 1000);

  // Spawn ducks after a delay
  setTimeout(() => {
    spawnDucks(Math.min(gameState.level, 3));
  }, 2000);
}

/**
 * Game over
 */
function gameOver() {
  // Set game state
  gameState.active = false;

  // Play game over sound
  playSound('gameOver');

  const finalScore = gameState.score;
  const isHighScore = finalScore > gameState.highScore;

  // Show game over message
  showMessage(
    `Game Over!\nFinal Score: ${finalScore}\nMax Combo: ${gameState.maxCombo}x`,
    3000
  );

  // Check if high score
  if (isHighScore) {
    gameState.highScore = finalScore;
    saveHighScore();

    // Show high score message
    setTimeout(() => {
      showMessage('New High Score!', 2000);
    }, 3000);
  }

  // Show start button after delay
  setTimeout(() => {
    if (gameState.elements.startButton) {
      gameState.elements.startButton.style.display = 'block';
    }
  }, 5000);
}

/**
 * Initialize Duck Hunt
 */
function initDuckHunt() {
  console.log('Initializing Duck Hunt game...');

  // Find the Duck Hunt window
  const duckHuntWindow = document.getElementById('duck-hunt-window');
  if (!duckHuntWindow) {
    console.error('Duck Hunt window not found');
    return;
  }

  // Get the window content
  const gameContainer = duckHuntWindow.querySelector('.window-content');
  if (!gameContainer) {
    console.error('Game container not found');
    return;
  }

  // Store elements
  gameState.elements.gameContainer = gameContainer;

  // Create game UI
  createGameUI();

  // Load sounds
  loadSounds();

  // Load high score
  loadHighScore();

  // Add window close event listener for cleanup
  const closeButton = duckHuntWindow.querySelector('.window-close');
  if (closeButton) {
    closeButton.addEventListener('click', cleanupDuckHunt);
  }

  // Store the game instance in the global namespace
  NosytDuckHunt.game = {
    state: gameState,
    cleanup: cleanupDuckHunt
  };

  console.log('Duck Hunt game initialized');
}

/**
 * Clean up Duck Hunt resources to prevent memory leaks
 */
function cleanupDuckHunt() {
  console.log('Cleaning up Duck Hunt resources...');

  // Stop all animations and timers
  if (gameState.animationFrameId) {
    cancelAnimationFrame(gameState.animationFrameId);
    gameState.animationFrameId = null;
  }

  // Clear all timeouts
  if (gameState.timeouts) {
    gameState.timeouts.forEach(timeoutId => clearTimeout(timeoutId));
    gameState.timeouts = [];
  }

  // Clear all intervals
  if (gameState.intervals) {
    gameState.intervals.forEach(intervalId => clearInterval(intervalId));
    gameState.intervals = [];
  }

  // Remove duck escape timers
  if (gameState.ducks) {
    gameState.ducks.forEach(duck => {
      if (duck.escapeTimer) {
        clearTimeout(duck.escapeTimer);
      }
      if (duck.animationId) {
        cancelAnimationFrame(duck.animationId);
      }
    });
  }

  // Remove event listeners
  const { gameBackground, startButton } = gameState.elements;

  if (gameBackground) {
    // Use cloneNode to remove all event listeners
    const newGameBackground = gameBackground.cloneNode(true);
    if (gameBackground.parentNode) {
      gameBackground.parentNode.replaceChild(newGameBackground, gameBackground);
    }
    gameState.elements.gameBackground = newGameBackground;
  }

  if (startButton) {
    const newStartButton = startButton.cloneNode(true);
    if (startButton.parentNode) {
      startButton.parentNode.replaceChild(newStartButton, startButton);
    }
    gameState.elements.startButton = newStartButton;
  }

  // Reset game state
  gameState.active = false;
  gameState.ducks = [];

  console.log('Duck Hunt cleanup complete');
}

/**
 * Create the game UI
 */
function createGameUI() {
  const { gameContainer } = gameState.elements;
  gameContainer.innerHTML = '';

  // Create game background
  const gameBackground = document.createElement('div');
  gameBackground.className = 'duck-hunt-background';
  gameBackground.style.width = '100%';
  gameBackground.style.height = '100%';
  gameBackground.style.position = 'relative';
  gameBackground.style.backgroundImage = 'url("/images/win95/duck-hunt-bg.png")';
  gameBackground.style.backgroundSize = 'cover';
  gameBackground.style.backgroundPosition = 'center bottom';
  gameBackground.style.cursor = 'crosshair';
  gameBackground.style.overflow = 'hidden';

  // Create score panel
  const scorePanel = document.createElement('div');
  scorePanel.className = 'duck-hunt-score';
  scorePanel.innerHTML = `
    <div>Score: <span id="duck-score">0</span></div>
    <div>Level: <span id="duck-level">1</span></div>
    <div>Ammo: <span id="duck-ammo">3</span></div>
    <div>Combo: <span id="duck-combo">0</span></div>
    <div class="high-score">High Score: <span id="duck-high-score">0</span></div>
  `;
  scorePanel.style.position = 'absolute';
  scorePanel.style.top = '10px';
  scorePanel.style.left = '10px';
  scorePanel.style.padding = '10px';
  scorePanel.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
  scorePanel.style.color = 'white';
  scorePanel.style.fontFamily = 'MS Sans Serif, sans-serif';
  scorePanel.style.fontSize = '14px';
  scorePanel.style.borderRadius = '5px';
  scorePanel.style.zIndex = '100';

  // Create message display
  const messageDisplay = document.createElement('div');
  messageDisplay.id = 'duck-message';
  messageDisplay.style.position = 'absolute';
  messageDisplay.style.top = '50%';
  messageDisplay.style.left = '50%';
  messageDisplay.style.transform = 'translate(-50%, -50%)';
  messageDisplay.style.padding = '15px';
  messageDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
  messageDisplay.style.color = 'white';
  messageDisplay.style.fontFamily = 'MS Sans Serif, sans-serif';
  messageDisplay.style.fontSize = '18px';
  messageDisplay.style.borderRadius = '5px';
  messageDisplay.style.zIndex = '200';
  messageDisplay.style.textAlign = 'center';
  messageDisplay.style.display = 'none';

  // Create start button
  const startButton = document.createElement('button');
  startButton.id = 'duck-hunt-start';
  startButton.textContent = 'Start Game';
  startButton.style.position = 'absolute';
  startButton.style.bottom = '20px';
  startButton.style.left = '50%';
  startButton.style.transform = 'translateX(-50%)';
  startButton.style.padding = '10px 20px';
  startButton.style.backgroundColor = '#4CAF50';
  startButton.style.color = 'white';
  startButton.style.border = 'none';
  startButton.style.borderRadius = '5px';
  startButton.style.fontFamily = 'MS Sans Serif, sans-serif';
  startButton.style.fontSize = '16px';
  startButton.style.cursor = 'pointer';
  startButton.style.zIndex = '100';

  // Add elements to game background
  gameBackground.appendChild(scorePanel);
  gameBackground.appendChild(messageDisplay);
  gameBackground.appendChild(startButton);

  // Add game background to container
  gameContainer.appendChild(gameBackground);

  // Store UI elements
  gameState.elements = {
    gameContainer,
    scoreDisplay: document.getElementById('duck-score'),
    levelDisplay: document.getElementById('duck-level'),
    ammoDisplay: document.getElementById('duck-ammo'),
    comboDisplay: document.getElementById('duck-combo'),
    highScoreDisplay: document.getElementById('duck-high-score'),
    messageDisplay,
    startButton,
    gameBackground
  };

  // Add click handler for shooting
  gameBackground.addEventListener('click', handleShot);

  // Add click handler for start button
  startButton.addEventListener('click', startGame);

  // Load high score
  loadHighScore();
  updateUI();
}
/**
 * Load sounds
 */
function loadSounds() {
  // Load all sounds
  for (const [name, config] of Object.entries(SOUNDS)) {
    const sound = new Audio(config.src);
    sound.volume = config.volume || 0.5;
    gameState.sounds[name] = sound;
  }
}

/**
 * Load high score from local storage
 */
function loadHighScore() {
  try {
    const savedHighScore = localStorage.getItem('duckHuntHighScore');
    if (savedHighScore) {
      gameState.highScore = parseInt(savedHighScore, 10);
    }
  } catch (error) {
    console.warn('Error loading high score:', error);
  }
}

/**
 * Save high score to local storage
 */
function saveHighScore() {
  try {
    localStorage.setItem('duckHuntHighScore', gameState.highScore.toString());
  } catch (error) {
    console.warn('Error saving high score:', error);
  }
}

/**
 * Update UI
 */
function updateUI() {
  const { scoreDisplay, levelDisplay, ammoDisplay, comboDisplay, highScoreDisplay } = gameState.elements;

  if (scoreDisplay) scoreDisplay.textContent = gameState.score;
  if (levelDisplay) levelDisplay.textContent = gameState.level;
  if (ammoDisplay) ammoDisplay.textContent = gameState.ammo;
  if (comboDisplay) comboDisplay.textContent = gameState.combo;
  if (highScoreDisplay) highScoreDisplay.textContent = gameState.highScore;
}

/**
 * Show a message on screen
 */
function showMessage(text, duration = 2000) {
  const { messageDisplay } = gameState.elements;
  if (!messageDisplay) return;

  messageDisplay.textContent = text;
  messageDisplay.style.display = 'block';

  if (duration > 0) {
    setTimeout(() => {
      if (messageDisplay) {
        messageDisplay.style.display = 'none';
      }
    }, duration);
  }
}

/**
 * Play a sound
 */
function playSound(soundName) {
  const sound = gameState.sounds[soundName];
  if (sound) {
    try {
      // Reset sound to beginning
      sound.currentTime = 0;

      // Create a clone of the sound to allow overlapping sounds
      const soundClone = sound.cloneNode();
      soundClone.volume = sound.volume;

      // Play the sound with error handling
      soundClone.play().catch(error => {
        console.warn(`Error playing sound ${soundName}:`, error);
      });
    } catch (error) {
      console.warn(`Error playing sound ${soundName}:`, error);
    }
  } else {
    console.warn(`Sound not found: ${soundName}`);
  }
}

/**
 * Create a duck element
 */
function createDuck() {
  const duck = document.createElement('div');
  duck.className = 'duck';

  Object.assign(duck.style, {
    position: 'absolute',
    width: '50px',
    height: '50px',
    backgroundImage: 'url("/images/win95/duck/blue-right.gif")',
    backgroundSize: 'contain',
    backgroundRepeat: 'no-repeat',
    cursor: 'crosshair',
    zIndex: '10'
  });

  return duck;
}

/**
 * Start the game
 */
function startGame() {
  // Reset game state
  gameState.active = true;
  gameState.score = 0;
  gameState.level = 1;
  gameState.ammo = 3;
  gameState.maxAmmo = 3;
  gameState.ducksShot = 0;
  gameState.ducksEscaped = 0;
  gameState.combo = 0;
  gameState.maxCombo = 0;
  gameState.ducks = [];

  // Play reload sound
  playSound('reload');

  // Update UI
  updateUI();

  // Play menu select sound
  playSound('menuSelect');

  // Hide start button
  if (gameState.elements.startButton) {
    gameState.elements.startButton.style.display = 'none';
  }

  // Show start message
  showMessage(`Level ${gameState.level} - Get Ready!`, 2000);

  // Play start sound after a short delay
  setTimeout(() => {
    playSound('gameStart');
  }, 500);

  // Spawn ducks after a delay
  setTimeout(spawnDucks, 2000);
}
/**
 * Spawn ducks
 */
function spawnDucks(count = 1) {
  if (!gameState.active) return;

  for (let i = 0; i < count; i++) {
    // Create duck element
    const duck = createDuck();

    // Add duck to game state
    const duckData = {
      element: duck,
      hit: false,
      direction: Math.random() > 0.5 ? 'right' : 'left',
      speed: 2 + (gameState.level * 0.5)
    };

    gameState.ducks.push(duckData);

    // Random starting position
    const { gameBackground } = gameState.elements;
    const bgRect = gameBackground.getBoundingClientRect();
    const startX = Math.random() * (bgRect.width - 50);
    const startY = Math.random() * (bgRect.height - 150) + 50;

    duck.style.left = `${startX}px`;
    duck.style.top = `${startY}px`;

    // Set direction
    if (duckData.direction === 'left') {
      duck.style.transform = 'scaleX(-1)';
    }

    // Add to game background
    gameBackground.appendChild(duck);

    // Start animation
    animateDuck(duckData);
  }
}

/**
 * Animate a duck
 */
function animateDuck(duckData) {
  if (!gameState.active || !duckData.element || !duckData.element.parentNode) return;

  const { element, direction, speed } = duckData;
  const { gameBackground } = gameState.elements;
  const bgRect = gameBackground.getBoundingClientRect();

  // Current position
  let left = parseFloat(element.style.left);
  let top = parseFloat(element.style.top);

  // Calculate new position
  const dirX = direction === 'right' ? 1 : -1;
  const dirY = Math.random() > 0.5 ? 1 : -1;

  left += dirX * speed;
  top += dirY * speed;

  // Check boundaries
  if (left <= 0) {
    left = 0;
    duckData.direction = 'right';
    element.style.transform = '';
  } else if (left >= bgRect.width - 50) {
    left = bgRect.width - 50;
    duckData.direction = 'left';
    element.style.transform = 'scaleX(-1)';
  }

  if (top <= 0) {
    top = 0;
  } else if (top >= bgRect.height - 50) {
    top = bgRect.height - 50;
  }

  // Update position
  element.style.left = `${left}px`;
  element.style.top = `${top}px`;

  // Continue animation
  duckData.animationId = requestAnimationFrame(() => animateDuck(duckData));

  // Duck escapes after a certain time
  if (!duckData.escapeTimer) {
    duckData.escapeTimer = setTimeout(() => {
      if (gameState.active && !duckData.hit && element.parentNode) {
        duckEscaped(duckData);
      }
    }, 5000 - (gameState.level * 500));
  }
}

/**
 * Handle a shot
 */
function handleShot(e) {
  if (!gameState.active) return;

  // Check if we have ammo
  if (gameState.ammo <= 0) {
    // Play empty gun sound
    playSound('emptyGun');
    return;
  }

  // Decrease ammo
  gameState.ammo--;
  updateUI();

  // Play shot sound
  playSound('shot');

  // Create shot effect
  createShotEffect(e);

  // Check if we hit a duck
  const hit = checkHit(e);

  // If no hit, reset combo
  if (!hit) {
    gameState.combo = 0;
    updateUI();
  }

  // Check if we're out of ammo
  if (gameState.ammo <= 0) {
    // Check if there are still ducks
    if (gameState.ducks.some(duck => !duck.hit)) {
      // Wait for ducks to escape
      setTimeout(() => {
        gameState.ducks.forEach(duck => {
          if (!duck.hit) {
            duckEscaped(duck);
          }
        });
      }, 1000);
    } else {
      // Start next level
      levelUp();
    }
  }
}

/**
 * Create a shot effect
 */
function createShotEffect(e) {
  const { clientX, clientY } = e;
  const { gameBackground } = gameState.elements;

  if (!gameBackground) return;

  const rect = gameBackground.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;

  const shotEffect = document.createElement('div');
  shotEffect.className = 'shot-effect';
  Object.assign(shotEffect.style, {
    position: 'absolute',
    left: `${x}px`,
    top: `${y}px`,
    width: '20px',
    height: '20px',
    backgroundColor: 'white',
    borderRadius: '50%',
    transform: 'translate(-50%, -50%)',
    opacity: '1',
    zIndex: '50',
    pointerEvents: 'none'
  });

  gameBackground.appendChild(shotEffect);

  // Animate shot effect
  setTimeout(() => {
    shotEffect.style.width = '40px';
    shotEffect.style.height = '40px';
    shotEffect.style.opacity = '0';

    // Remove after animation
    setTimeout(() => {
      if (shotEffect.parentNode) {
        shotEffect.parentNode.removeChild(shotEffect);
      }
    }, 200);
  }, 10);
}

/**
 * Check if a shot hit a duck
 */
function checkHit(e) {
  const { clientX, clientY } = e;
  const { gameBackground } = gameState.elements;

  if (!gameBackground) return false;

  const rect = gameBackground.getBoundingClientRect();
  const x = clientX - rect.left;
  const y = clientY - rect.top;

  // Check each duck
  for (const duckData of gameState.ducks) {
    if (duckData.hit) continue;

    const duckRect = duckData.element.getBoundingClientRect();
    const duckX = duckRect.left - rect.left;
    const duckY = duckRect.top - rect.top;
    const duckWidth = duckRect.width;
    const duckHeight = duckRect.height;

    // Check if shot is within duck bounds
    if (
      x >= duckX &&
      x <= duckX + duckWidth &&
      y >= duckY &&
      y <= duckY + duckHeight
    ) {
      hitDuck(duckData);
      return true;
    }
  }

  return false;
}

/**
 * Handle a duck being hit
 */
function hitDuck(duckData) {
  // Mark as hit
  duckData.hit = true;

  // Stop animation
  cancelAnimationFrame(duckData.animationId);
  clearTimeout(duckData.escapeTimer);

  // Update sprite
  duckData.element.style.backgroundImage = 'url("/images/win95/duck/blue-hit.png")';

  // Play hit sound
  playSound('quack');

  // Increment combo
  gameState.combo++;

  // Calculate points with combo multiplier
  const comboMultiplier = 1 + (gameState.combo - 1) * 0.1;
  const points = Math.round(100 * comboMultiplier);

  // Add points
  gameState.score += points;

  // Update UI
  updateUI();

  // Show points
  showPoints(duckData.element, points);

  // Start falling animation
  setTimeout(() => {
    duckData.element.style.backgroundImage = 'url("/images/win95/duck/blue-falling.gif")';
    duckData.element.style.transition = 'top 1s ease-in';
    duckData.element.style.top = '100%';

    // Play falling sound
    playSound('fall');

    // Remove duck after animation
    setTimeout(() => {
      if (duckData.element.parentNode) {
        duckData.element.parentNode.removeChild(duckData.element);
      }

      // Remove from state
      gameState.ducks = gameState.ducks.filter(d => d !== duckData);

      // Increment ducks shot
      gameState.ducksShot++;

      // Check if level up
      if (gameState.ducksShot >= 10 * gameState.level) {
        levelUp();
      } else if (gameState.ducks.length === 0 && gameState.ammo > 0) {
        // Spawn more ducks if none left and we have ammo
        setTimeout(() => {
          spawnDucks(1);
        }, 1000);
      }
    }, 1000);
  }, 500);
}
/**
 * Show points
 */
function showPoints(element, points) {
  const pointsElement = document.createElement('div');
  pointsElement.textContent = `+${points}`;

  Object.assign(pointsElement.style, {
    position: 'absolute',
    color: 'yellow',
    fontWeight: 'bold',
    fontSize: '16px',
    textShadow: '1px 1px 2px black',
    zIndex: '100',
    pointerEvents: 'none'
  });

  // Position points
  const rect = element.getBoundingClientRect();
  const { gameBackground } = gameState.elements;
  const bgRect = gameBackground.getBoundingClientRect();

  pointsElement.style.left = `${rect.left - bgRect.left + rect.width / 2}px`;
  pointsElement.style.top = `${rect.top - bgRect.top}px`;

  // Add to game background
  gameBackground.appendChild(pointsElement);

  // Animate points
  pointsElement.style.transition = 'top 0.5s, opacity 0.5s';

  setTimeout(() => {
    pointsElement.style.top = `${parseFloat(pointsElement.style.top) - 50}px`;
    pointsElement.style.opacity = '0';

    // Remove after animation
    setTimeout(() => {
      if (pointsElement.parentNode) {
        pointsElement.parentNode.removeChild(pointsElement);
      }
    }, 500);
  }, 100);
}

/**
 * Initialize the Duck Hunt game when the window is loaded
 */
window.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, setting up Duck Hunt initialization');

  // Wait for the Duck Hunt window to be created
  setTimeout(() => {
    // Get the Duck Hunt icon
    const duckHuntIcon = document.querySelector('[data-app="duck-hunt"]');
    if (duckHuntIcon) {
      // Initialize game when icon is clicked
      duckHuntIcon.addEventListener('click', () => {
        console.log('Duck Hunt icon clicked');

        // Get the Duck Hunt window
        const duckHuntWindow = document.getElementById('duck-hunt-window');
        if (duckHuntWindow) {
          // Show the window
          duckHuntWindow.style.display = 'block';

          // Initialize the game after a short delay
          setTimeout(() => {
            initDuckHunt();
          }, 500);
        }
      });
    }
  }, 1000);
});

/**
 * Duck escaped
 */
function duckEscaped(duckData) {
  // Stop animation
  cancelAnimationFrame(duckData.animationId);
  clearTimeout(duckData.escapeTimer);

  // Animate escape
  duckData.element.style.transition = 'top 1s ease-in, transform 1s ease-in';
  duckData.element.style.top = '-20%';
  duckData.element.style.transform = 'scale(0.5)';

  // Play sound
  playSound('quack');

  // Remove duck after animation
  setTimeout(() => {
    if (duckData.element.parentNode) {
      duckData.element.parentNode.removeChild(duckData.element);
    }

    // Remove from state
    gameState.ducks = gameState.ducks.filter(d => d !== duckData);

    // Increment escaped ducks
    gameState.ducksEscaped++;

    // Check if game over
    if (gameState.ducksEscaped >= gameState.maxDucksEscaped) {
      gameOver();
    } else if (gameState.ducks.length === 0 && gameState.ammo > 0) {
      // Spawn more ducks if none left and we have ammo
      setTimeout(() => {
        spawnDucks(1);
      }, 1000);
    }
  }, 1000);
}

/**
 * Level up
 */
function levelUp() {
  // Increment level
  gameState.level++;

  // Reset ammo
  gameState.ammo = 3 + Math.min(gameState.level, 3);
  gameState.maxAmmo = gameState.ammo;

  // Play reload sound
  playSound('reload');

  // Update UI
  updateUI();

  // Play level up sound
  playSound('levelUp');

  // Show level up message
  showMessage(`Level ${gameState.level}!`, 2000);

  // Spawn ducks after a delay
  setTimeout(() => {
    spawnDucks(Math.min(gameState.level, 3));
  }, 2000);
}

/**
 * Game over
 */
function gameOver() {
  // Set game state
  gameState.active = false;

  // Play game over sound
  playSound('gameOver');

  const finalScore = gameState.score;
  const isHighScore = finalScore > gameState.highScore;

  // Show game over message
  showMessage(
    `Game Over!\nFinal Score: ${finalScore}\nMax Combo: ${gameState.maxCombo}x`,
    3000
  );

  // Check if high score
  if (isHighScore) {
    gameState.highScore = finalScore;
    saveHighScore();

    // Show high score message
    setTimeout(() => {
      showMessage('New High Score!', 2000);
    }, 3000);
  }

  // Show start button after delay
  setTimeout(() => {
    if (gameState.elements.startButton) {
      gameState.elements.startButton.style.display = 'block';
    }
  }, 5000);
}
/**
 * Initialize the Duck Hunt game when the window is loaded
 */
window.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, setting up Duck Hunt initialization');

  // Wait for the Duck Hunt window to be created
  setTimeout(() => {
    // Get the Duck Hunt icon
    const duckHuntIcon = document.querySelector('[data-app="duck-hunt"]');
    if (duckHuntIcon) {
      // Initialize game when icon is clicked
      duckHuntIcon.addEventListener('click', () => {
        console.log('Duck Hunt icon clicked');

        // Get the Duck Hunt window
        const duckHuntWindow = document.getElementById('duck-hunt-window');
        if (duckHuntWindow) {
          // Show the window
          duckHuntWindow.style.display = 'block';

          // Initialize the game after a short delay
          setTimeout(() => {
            initDuckHunt();
          }, 500);
        }
      });
    }
  }, 1000);
});

    // DOM elements
    this.elements = {
      gameContainer: null,
      sky: null,
      ground: null,
      scoreDisplay: null,
      levelDisplay: null,
      ammoDisplay: null,
      comboDisplay: null,
      highScoreDisplay: null,
      messageDisplay: null,
      startButton: null
    };

    // Initialize the game
    this.init();
  }

  /**
   * Initialize the game
   */
  init() {
    console.log('Initializing Duck Hunt game...');

    // Create game UI
    this.createGameUI();

    // Load sounds
    this.loadSounds();

    // Set up event listeners
    this.setupEventListeners();

    // Load high score
    this.updateHighScoreDisplay();

    console.log('Duck Hunt game initialized');
  }

  /**
   * Create the game UI
   */
  createGameUI() {
    // Clear container
    this.container.querySelector('.window-content').innerHTML = '';

    // Create game container
    const gameContainer = document.createElement('div');
    gameContainer.className = 'duck-hunt-container';
    this.container.querySelector('.window-content').appendChild(gameContainer);
    this.elements.gameContainer = gameContainer;

    // Create sky
    const sky = document.createElement('div');
    sky.className = 'duck-hunt-sky';
    gameContainer.appendChild(sky);
    this.elements.sky = sky;

    // Create ground
    const ground = document.createElement('div');
    ground.className = 'duck-hunt-ground';
    gameContainer.appendChild(ground);
    this.elements.ground = ground;

    // Create score display
    const scoreContainer = document.createElement('div');
    scoreContainer.className = 'duck-hunt-score-container';
    gameContainer.appendChild(scoreContainer);

    const scoreDisplay = document.createElement('div');
    scoreDisplay.innerHTML = `<span class="duck-hunt-score-label">Score:</span> <span class="duck-hunt-score">0</span>`;
    scoreContainer.appendChild(scoreDisplay);
    this.elements.scoreDisplay = scoreDisplay.querySelector('.duck-hunt-score');

    // Create level display
    const levelDisplay = document.createElement('div');
    levelDisplay.innerHTML = `<span class="duck-hunt-level-label">Level:</span> <span class="duck-hunt-level">1</span>`;
    scoreContainer.appendChild(levelDisplay);
    this.elements.levelDisplay = levelDisplay.querySelector('.duck-hunt-level');

    // Create ammo display
    const ammoDisplay = document.createElement('div');
    ammoDisplay.innerHTML = `<span class="duck-hunt-ammo-label">Ammo:</span> <span class="duck-hunt-ammo">3</span>`;
    scoreContainer.appendChild(ammoDisplay);
    this.elements.ammoDisplay = ammoDisplay.querySelector('.duck-hunt-ammo');

    // Create combo display
    const comboDisplay = document.createElement('div');
    comboDisplay.innerHTML = `<span class="duck-hunt-combo-label">Combo:</span> <span class="duck-hunt-combo">0</span>`;
    scoreContainer.appendChild(comboDisplay);
    this.elements.comboDisplay = comboDisplay.querySelector('.duck-hunt-combo');

    // Create high score display
    const highScoreDisplay = document.createElement('div');
    highScoreDisplay.innerHTML = `<span class="duck-hunt-high-score-label">High Score:</span> <span class="duck-hunt-high-score">0</span>`;
    scoreContainer.appendChild(highScoreDisplay);
    this.elements.highScoreDisplay = highScoreDisplay.querySelector('.duck-hunt-high-score');

    // Create message display
    const messageDisplay = document.createElement('div');
    messageDisplay.className = 'duck-hunt-message';
    gameContainer.appendChild(messageDisplay);
    this.elements.messageDisplay = messageDisplay;

    // Create start button
    const startButton = document.createElement('button');
    startButton.className = 'duck-hunt-start-button';
    startButton.textContent = 'Start Game';
    gameContainer.appendChild(startButton);
    this.elements.startButton = startButton;

    // Create escaped ducks display
    const escapedDisplay = document.createElement('div');
    escapedDisplay.className = 'duck-hunt-escaped';
    escapedDisplay.innerHTML = `
      <span class="duck-hunt-escaped-label">Escaped:</span>
      <div class="duck-hunt-escaped-ducks">
        <span class="duck-icon">𓅭</span>
        <span class="duck-icon">𓅭</span>
        <span class="duck-icon">𓅭</span>
      </div>
    `;
    gameContainer.appendChild(escapedDisplay);
    this.elements.escapedDisplay = escapedDisplay;
    this.elements.escapedDucks = escapedDisplay.querySelectorAll('.duck-icon');

    // Create difficulty selector
    const difficultySelector = document.createElement('div');
    difficultySelector.className = 'duck-hunt-difficulty';
    difficultySelector.innerHTML = `
      <span class="duck-hunt-difficulty-label">Difficulty:</span>
      <div class="duck-hunt-difficulty-options">
        <button class="duck-hunt-difficulty-option" data-difficulty="easy">Easy</button>
        <button class="duck-hunt-difficulty-option active" data-difficulty="normal">Normal</button>
        <button class="duck-hunt-difficulty-option" data-difficulty="hard">Hard</button>
      </div>
    `;
    gameContainer.appendChild(difficultySelector);
    this.elements.difficultySelector = difficultySelector;
    this.elements.difficultyOptions = difficultySelector.querySelectorAll('.duck-hunt-difficulty-option');
  }

  /**
   * Load sound effects
   */
  loadSounds() {
    // Load all sounds
    for (const [name, config] of Object.entries(SOUNDS)) {
      const sound = new Audio(config.src);
      sound.volume = config.volume || 0.5;
      this.sounds[name] = sound;
    }
  }

  /**
   * Set up event listeners
   */
  setupEventListeners() {
    // Start button click
    this.elements.startButton.addEventListener('click', () => {
      this.startGame();
    });

    // Sky click (shooting)
    this.elements.sky.addEventListener('click', (e) => {
      this.handleShot(e);
    });

    // Difficulty selector
    this.elements.difficultyOptions.forEach(option => {
      option.addEventListener('click', () => {
        const difficulty = option.dataset.difficulty;
        this.setDifficulty(difficulty);
      });
    });

    // Window resize
    window.addEventListener('resize', () => {
      this.handleResize();
    });

    // Window controls
    const windowControls = this.container.querySelectorAll('.window-controls button');
    windowControls.forEach(button => {
      button.addEventListener('click', () => {
        if (this.state.active) {
          this.pauseGame();
        }
      });
    });
  }

  /**
   * Start the game
   */
  startGame() {
    // Reset game state
    this.state.active = true;
    this.state.paused = false;
    this.state.level = 1;
    this.state.score = 0;
    this.state.ammo = DIFFICULTY[this.state.difficulty].ammoPerWave;
    this.state.maxAmmo = DIFFICULTY[this.state.difficulty].ammoPerWave;
    this.state.ducksShot = 0;
    this.state.ducksEscaped = 0;
    this.state.combo = 0;
    this.state.maxCombo = 0;
    this.state.ducks = [];

    // Update UI
    this.updateUI();

    // Hide start button
    this.elements.startButton.style.display = 'none';

    // Reset escaped ducks display
    this.elements.escapedDucks.forEach(duck => {
      duck.style.color = 'white';
    });

    // Play start sound
    this.playSound('gameStart');

    // Show intro animation
    this.showIntroAnimation().then(() => {
      // Start spawning ducks
      this.startWave();
    });
  }

  /**
   * Show intro animation
   */
  showIntroAnimation() {
    return new Promise(resolve => {
      // Create dog animation
      const dog = document.createElement('div');
      dog.className = 'duck-hunt-dog';
      dog.style.backgroundImage = `url(${SPRITES.dog.walking})`;
      this.elements.ground.appendChild(dog);

      // Animate dog walking
      setTimeout(() => {
        dog.style.backgroundImage = `url(${SPRITES.dog.jumping})`;
        dog.style.bottom = '100px';

        // Animate dog jumping
        setTimeout(() => {
          dog.style.bottom = '20px';
          dog.style.backgroundImage = `url(${SPRITES.dog.walking})`;

          // Remove dog
          setTimeout(() => {
            dog.remove();
            resolve();
          }, 1000);
        }, 1000);
      }, 2000);
    });
  }

  /**
   * Start a new wave of ducks
   */
  startWave() {
    // Reset ammo
    this.state.ammo = DIFFICULTY[this.state.difficulty].ammoPerWave;
    this.updateAmmoDisplay();

    // Spawn ducks
    this.spawnDuck();
  }

  /**
   * Spawn a duck
   */
  spawnDuck() {
    if (!this.state.active) return;

    // Get difficulty settings
    const diffSettings = DIFFICULTY[this.state.difficulty];

    // Create duck element
    const duck = document.createElement('div');
    duck.className = 'duck-hunt-duck';

    // Determine duck type (blue, red, black)
    const duckTypes = ['blue', 'red', 'black'];
    const duckTypeIndex = Math.min(
      Math.floor(Math.random() * (this.state.level * 0.5)),
      duckTypes.length - 1
    );
    const duckType = duckTypes[duckTypeIndex];

    // Set duck properties
    const duckData = {
      element: duck,
      type: duckType,
      points: SPRITES.duck[duckType].points,
      direction: Math.random() > 0.5 ? 'right' : 'left',
      verticalDirection: 'up',
      speed: diffSettings.duckSpeed,
      hit: false,
      escapeTimer: null
    };

    // Add duck to state
    this.state.ducks.push(duckData);

    // Set initial position
    const skyRect = this.elements.sky.getBoundingClientRect();
    duck.style.left = `${Math.random() * (skyRect.width - 60)}px`;
    duck.style.bottom = '0px';

    // Set initial sprite
    this.updateDuckSprite(duckData);

    // Add to sky
    this.elements.sky.appendChild(duck);

    // Start duck movement
    this.moveDuck(duckData);

    // Set escape timer
    duckData.escapeTimer = setTimeout(() => {
      if (!duckData.hit && this.state.active) {
        this.duckEscaped(duckData);
      }
    }, diffSettings.duckEscapeTime);
  }

  /**
   * Update duck sprite based on direction
   */
  updateDuckSprite(duckData) {
    const { type, direction, verticalDirection } = duckData;
    let spriteKey = `fly${direction.charAt(0).toUpperCase() + direction.slice(1)}`;

    if (verticalDirection !== 'straight') {
      spriteKey += verticalDirection.charAt(0).toUpperCase() + verticalDirection.slice(1);
    }

    duckData.element.style.backgroundImage = `url(${SPRITES.duck[type][spriteKey]})`;
  }

  /**
   * Move a duck
   */
  moveDuck(duckData) {
    if (!this.state.active || duckData.hit) return;

    const { element, direction, verticalDirection, speed } = duckData;
    const skyRect = this.elements.sky.getBoundingClientRect();
    const duckRect = element.getBoundingClientRect();

    // Current position
    let left = parseFloat(element.style.left);
    let bottom = parseFloat(element.style.bottom);

    // Calculate new position
    const horizontalMove = direction === 'right' ? 2 : -2;
    let verticalMove = 0;

    if (verticalDirection === 'up') {
      verticalMove = 1;
    } else if (verticalDirection === 'down') {
      verticalMove = -1;
    }

    // Apply movement
    left += horizontalMove * speed;
    bottom += verticalMove * speed;

    // Check boundaries
    if (left < 0) {
      left = 0;
      duckData.direction = 'right';
      this.updateDuckSprite(duckData);
    } else if (left > skyRect.width - duckRect.width) {
      left = skyRect.width - duckRect.width;
      duckData.direction = 'left';
      this.updateDuckSprite(duckData);
    }

    if (bottom < 0) {
      bottom = 0;
      duckData.verticalDirection = 'up';
      this.updateDuckSprite(duckData);
    } else if (bottom > skyRect.height - duckRect.height) {
      bottom = skyRect.height - duckRect.height;
      duckData.verticalDirection = 'down';
      this.updateDuckSprite(duckData);
    }

    // Randomly change direction
    if (Math.random() < 0.01) {
      duckData.verticalDirection = ['up', 'straight', 'down'][Math.floor(Math.random() * 3)];
      this.updateDuckSprite(duckData);
    }

    // Update position
    element.style.left = `${left}px`;
    element.style.bottom = `${bottom}px`;

    // Continue movement
    requestAnimationFrame(() => this.moveDuck(duckData));
  }

  /**
   * Handle a shot
   */
  handleShot(event) {
    if (!this.state.active || this.state.paused) return;

    // Check if we have ammo
    if (this.state.ammo <= 0) {
      this.playSound('empty');
      return;
    }

    // Decrease ammo
    this.state.ammo--;
    this.updateAmmoDisplay();

    // Play shot sound
    this.playSound('shot');

    // Create shot effect
    this.createShotEffect(event.clientX, event.clientY);

    // Check if we hit a duck
    const hit = this.checkDuckHit(event.clientX, event.clientY);

    // If no hit, reset combo
    if (!hit) {
      this.state.combo = 0;
      this.updateComboDisplay();
    }

    // Check if we're out of ammo
    if (this.state.ammo <= 0) {
      // Check if there are still ducks
      if (this.state.ducks.some(duck => !duck.hit)) {
        // Wait for ducks to escape
        setTimeout(() => {
          this.state.ducks.forEach(duck => {
            if (!duck.hit) {
              this.duckEscaped(duck);
            }
          });
        }, 1000);
      } else {
        // Start next wave
        this.startWave();
      }
    }
  }

  /**
   * Create a shot effect
   */
  createShotEffect(x, y) {
    const shotEffect = document.createElement('div');
    shotEffect.className = 'duck-hunt-shot-effect';

    // Position the shot effect
    const skyRect = this.elements.sky.getBoundingClientRect();
    shotEffect.style.left = `${x - skyRect.left}px`;
    shotEffect.style.top = `${y - skyRect.top}px`;

    // Add to sky
    this.elements.sky.appendChild(shotEffect);

    // Remove after animation
    setTimeout(() => {
      shotEffect.remove();
    }, 200);
  }

  /**
   * Check if a shot hit a duck
   */
  checkDuckHit(x, y) {
    // Get sky position
    const skyRect = this.elements.sky.getBoundingClientRect();
    const relativeX = x - skyRect.left;
    const relativeY = y - skyRect.top;

    // Check each duck
    for (const duck of this.state.ducks) {
      if (duck.hit) continue;

      const duckRect = duck.element.getBoundingClientRect();
      const duckX = duckRect.left - skyRect.left;
      const duckY = duckRect.top - skyRect.top;

      // Check if shot is within duck bounds
      if (
        relativeX >= duckX &&
        relativeX <= duckX + duckRect.width &&
        relativeY >= duckY &&
        relativeY <= duckY + duckRect.height
      ) {
        this.hitDuck(duck);
        return true;
      }
    }

    return false;
  }

  /**
   * Handle a duck being hit
   */
  hitDuck(duckData) {
    // Mark duck as hit
    duckData.hit = true;

    // Clear escape timer
    clearTimeout(duckData.escapeTimer);

    // Update sprite
    duckData.element.style.backgroundImage = `url(${SPRITES.duck[duckData.type].hit})`;

    // Play hit sound
    this.playSound('quack');

    // Increment combo
    this.state.combo++;
    this.state.maxCombo = Math.max(this.state.maxCombo, this.state.combo);
    this.updateComboDisplay();

    // Calculate points with combo multiplier
    const comboMultiplier = 1 + (this.state.combo - 1) * 0.1;
    const points = Math.round(duckData.points * comboMultiplier);

    // Add points
    this.state.score += points;
    this.updateScoreDisplay();

    // Show points
    this.showPoints(duckData.element, points);

    // Start falling animation
    setTimeout(() => {
      duckData.element.style.backgroundImage = `url(${SPRITES.duck[duckData.type].falling})`;

      // Play falling sound
      this.playSound('fall');

      // Animate falling
      const fallInterval = setInterval(() => {
        const bottom = parseFloat(duckData.element.style.bottom);
        if (bottom <= 0) {
          clearInterval(fallInterval);

          // Remove duck
          duckData.element.remove();

          // Remove from state
          this.state.ducks = this.state.ducks.filter(d => d !== duckData);

          // Increment ducks shot
          this.state.ducksShot++;

          // Check if level up
          if (this.state.ducksShot >= 10 * this.state.level) {
            this.levelUp();
          } else if (this.state.ducks.length === 0) {
            // Spawn more ducks if none left
            setTimeout(() => {
              this.spawnDuck();
            }, 1000);
          }
        } else {
          duckData.element.style.bottom = `${bottom - 5}px`;
        }
      }, 50);
    }, 500);
  }

  /**
   * Handle a duck escaping
   */
  duckEscaped(duckData) {
    // Clear escape timer
    clearTimeout(duckData.escapeTimer);

    // Play dog laugh sound
    this.playSound('dogLaugh');

    // Show dog laughing
    const dog = document.createElement('div');
    dog.className = 'duck-hunt-dog laughing';
    dog.style.backgroundImage = `url(${SPRITES.dog.laughing})`;
    this.elements.ground.appendChild(dog);

    // Remove duck
    duckData.element.remove();

    // Remove from state
    this.state.ducks = this.state.ducks.filter(d => d !== duckData);

    // Increment escaped ducks
    this.state.ducksEscaped++;

    // Update escaped ducks display
    if (this.state.ducksEscaped <= this.state.maxDucksEscaped) {
      this.elements.escapedDucks[this.state.ducksEscaped - 1].style.color = 'red';
    }

    // Check if game over
    if (this.state.ducksEscaped >= this.state.maxDucksEscaped) {
      this.gameOver();
    } else {
      // Remove dog after animation
      setTimeout(() => {
        dog.remove();

        // Spawn more ducks if none left
        if (this.state.ducks.length === 0) {
          setTimeout(() => {
            this.spawnDuck();
          }, 1000);
        }
      }, 2000);
    }
  }

  /**
   * Level up
   */
  levelUp() {
    // Increment level
    this.state.level++;
    this.updateLevelDisplay();

    // Play level up sound
    this.playSound('levelUp');

    // Show level up message
    this.showMessage(`Level ${this.state.level}!`);

    // Start next wave
    setTimeout(() => {
      this.startWave();
    }, 2000);
  }

  /**
   * Game over
   */
  gameOver() {
    // Set game state
    this.state.active = false;

    // Play game over sound
    this.playSound('gameOver');

    // Show game over message
    this.showMessage('Game Over!');

    // Check if high score
    if (this.state.score > this.state.highScore) {
      this.state.highScore = this.state.score;
      this.saveHighScore();
      this.updateHighScoreDisplay();

      // Show high score message
      setTimeout(() => {
        this.showMessage('New High Score!');
      }, 2000);
    }

    // Show start button
    setTimeout(() => {
      this.elements.startButton.style.display = 'block';
    }, 3000);
  }

  /**
   * Show points
   */
  showPoints(element, points) {
    const pointsElement = document.createElement('div');
    pointsElement.className = 'duck-hunt-points';
    pointsElement.textContent = `+${points}`;

    // Position points
    const rect = element.getBoundingClientRect();
    const skyRect = this.elements.sky.getBoundingClientRect();
    pointsElement.style.left = `${rect.left - skyRect.left + rect.width / 2}px`;
    pointsElement.style.top = `${rect.top - skyRect.top}px`;

    // Add to sky
    this.elements.sky.appendChild(pointsElement);

    // Animate points
    setTimeout(() => {
      pointsElement.style.top = `${parseFloat(pointsElement.style.top) - 50}px`;
      pointsElement.style.opacity = '0';

      // Remove after animation
      setTimeout(() => {
        pointsElement.remove();
      }, 500);
    }, 100);
  }

  /**
   * Show message
   */
  showMessage(message) {
    // Set message text
    this.elements.messageDisplay.textContent = message;

    // Show message
    this.elements.messageDisplay.style.display = 'block';
    this.elements.messageDisplay.style.opacity = '1';

    // Hide message after delay
    setTimeout(() => {
      this.elements.messageDisplay.style.opacity = '0';

      // Hide message after fade out
      setTimeout(() => {
        this.elements.messageDisplay.style.display = 'none';
      }, 500);
    }, 2000);
  }

  /**
   * Set difficulty
   */
  setDifficulty(difficulty) {
    // Set difficulty
    this.state.difficulty = difficulty;

    // Update difficulty selector
    this.elements.difficultyOptions.forEach(option => {
      if (option.dataset.difficulty === difficulty) {
        option.classList.add('active');
      } else {
        option.classList.remove('active');
      }
    });

    // Play menu select sound
    this.playSound('menuSelect');
  }

  /**
   * Handle window resize
   */
  handleResize() {
    // Update duck positions
    this.state.ducks.forEach(duckData => {
      const skyRect = this.elements.sky.getBoundingClientRect();
      const duckRect = duckData.element.getBoundingClientRect();

      // Check if duck is outside bounds
      if (parseFloat(duckData.element.style.left) > skyRect.width - duckRect.width) {
        duckData.element.style.left = `${skyRect.width - duckRect.width}px`;
      }

      if (parseFloat(duckData.element.style.bottom) > skyRect.height - duckRect.height) {
        duckData.element.style.bottom = `${skyRect.height - duckRect.height}px`;
      }
    });
  }

  /**
   * Pause game
   */
  pauseGame() {
    if (!this.state.active) return;

    // Toggle pause state
    this.state.paused = !this.state.paused;

    // Show pause message
    if (this.state.paused) {
      this.showMessage('Paused');
    }
  }

  /**
   * Play sound
   */
  playSound(name) {
    if (!this.sounds[name]) return;

    // Clone sound to allow overlapping
    const sound = this.sounds[name].cloneNode();
    sound.volume = this.sounds[name].volume;
    sound.play().catch(error => {
      console.warn(`Error playing sound ${name}:`, error);
    });
  }

  /**
   * Update score display
   */
  updateScoreDisplay() {
    this.elements.scoreDisplay.textContent = this.state.score;
  }

  /**
   * Update level display
   */
  updateLevelDisplay() {
    this.elements.levelDisplay.textContent = this.state.level;
  }

  /**
   * Update ammo display
   */
  updateAmmoDisplay() {
    this.elements.ammoDisplay.textContent = this.state.ammo;
  }

  /**
   * Update combo display
   */
  updateComboDisplay() {
    this.elements.comboDisplay.textContent = this.state.combo;
  }

  /**
   * Update high score display
   */
  updateHighScoreDisplay() {
    this.elements.highScoreDisplay.textContent = this.state.highScore;
  }

  /**
   * Update all UI elements
   */
  updateUI() {
    this.updateScoreDisplay();
    this.updateLevelDisplay();
    this.updateAmmoDisplay();
    this.updateComboDisplay();
    this.updateHighScoreDisplay();
  }

  /**
   * Load high score from local storage
   */
  loadHighScore() {
    const highScore = localStorage.getItem('duckHuntHighScore');
    return highScore ? parseInt(highScore, 10) : 0;
  }

  /**
   * Save high score to local storage
   */
  saveHighScore() {
    localStorage.setItem('duckHuntHighScore', this.state.highScore.toString());
  }
}

/**
 * Initialize Duck Hunt
 */
  /**
   * Load sound effects
   */
  loadSounds() {
    // Load all sounds
    for (const [name, config] of Object.entries(SOUNDS)) {
      const sound = new Audio(config.src);
      sound.volume = config.volume || 0.5;
      this.sounds[name] = sound;
    }
  }

  /**
   * Set up event listeners
   */
  setupEventListeners() {
    // Start button click
    this.elements.startButton.addEventListener('click', () => {
      this.startGame();
    });

    // Sky click (shooting)
    this.elements.sky.addEventListener('click', (e) => {
      this.handleShot(e);
    });

    // Difficulty selector
    this.elements.difficultyOptions.forEach(option => {
      option.addEventListener('click', () => {
        const difficulty = option.dataset.difficulty;
        this.setDifficulty(difficulty);
      });
    });

    // Window resize
    window.addEventListener('resize', () => {
      this.handleResize();
    });

    // Window controls
    const windowControls = this.container.querySelectorAll('.window-controls button');
    windowControls.forEach(button => {
      button.addEventListener('click', () => {
        if (this.state.active) {
          this.pauseGame();
        }
      });
    });
  }

  /**
   * Start the game
   */
  startGame() {
    // Reset game state
    this.state.active = true;
    this.state.paused = false;
    this.state.level = 1;
    this.state.score = 0;
    this.state.ammo = DIFFICULTY[this.state.difficulty].ammoPerWave;
    this.state.maxAmmo = DIFFICULTY[this.state.difficulty].ammoPerWave;
    this.state.ducksShot = 0;
    this.state.ducksEscaped = 0;
    this.state.combo = 0;
    this.state.maxCombo = 0;
    this.state.ducks = [];

    // Update UI
    this.updateUI();

    // Hide start button
    this.elements.startButton.style.display = 'none';

    // Reset escaped ducks display
    this.elements.escapedDucks.forEach(duck => {
      duck.style.color = 'white';
    });

    // Play start sound
    this.playSound('gameStart');

    // Show intro animation
    this.showIntroAnimation().then(() => {
      // Start spawning ducks
      this.startWave();
    });
  }

  /**
   * Show intro animation
   */
  showIntroAnimation() {
    return new Promise(resolve => {
      // Create dog animation
      const dog = document.createElement('div');
      dog.className = 'duck-hunt-dog';
      dog.style.backgroundImage = `url(${SPRITES.dog.walking})`;
      this.elements.ground.appendChild(dog);

      // Animate dog walking
      setTimeout(() => {
        dog.style.backgroundImage = `url(${SPRITES.dog.jumping})`;
        dog.style.bottom = '100px';

        // Animate dog jumping
        setTimeout(() => {
          dog.style.bottom = '20px';
          dog.style.backgroundImage = `url(${SPRITES.dog.walking})`;

          // Remove dog
          setTimeout(() => {
            dog.remove();
            resolve();
          }, 1000);
        }, 1000);
      }, 2000);
    });
  }

  /**
   * Start a new wave of ducks
   */
  startWave() {
    // Reset ammo
    this.state.ammo = DIFFICULTY[this.state.difficulty].ammoPerWave;
    this.updateAmmoDisplay();

    // Spawn ducks
    this.spawnDuck();
  }

  /**
   * Spawn a duck
   */
  spawnDuck() {
    if (!this.state.active) return;

    // Get difficulty settings
    const diffSettings = DIFFICULTY[this.state.difficulty];

    // Create duck element
    const duck = document.createElement('div');
    duck.className = 'duck-hunt-duck';

    // Determine duck type (blue, red, black)
    const duckTypes = ['blue', 'red', 'black'];
    const duckTypeIndex = Math.min(
      Math.floor(Math.random() * (this.state.level * 0.5)),
      duckTypes.length - 1
    );
    const duckType = duckTypes[duckTypeIndex];

    // Set duck properties
    const duckData = {
      element: duck,
      type: duckType,
      points: SPRITES.duck[duckType].points,
      direction: Math.random() > 0.5 ? 'right' : 'left',
      verticalDirection: 'up',
      speed: diffSettings.duckSpeed,
      hit: false,
      escapeTimer: null
    };

    // Add duck to state
    this.state.ducks.push(duckData);

    // Set initial position
    const skyRect = this.elements.sky.getBoundingClientRect();
    duck.style.left = `${Math.random() * (skyRect.width - 60)}px`;
    duck.style.bottom = '0px';

    // Set initial sprite
    this.updateDuckSprite(duckData);

    // Add to sky
    this.elements.sky.appendChild(duck);

    // Start duck movement
    this.moveDuck(duckData);

    // Set escape timer
    duckData.escapeTimer = setTimeout(() => {
      if (!duckData.hit && this.state.active) {
        this.duckEscaped(duckData);
      }
    }, diffSettings.duckEscapeTime);
  }

  /**
   * Update duck sprite based on direction
   */
  updateDuckSprite(duckData) {
    const { type, direction, verticalDirection } = duckData;
    let spriteKey = `fly${direction.charAt(0).toUpperCase() + direction.slice(1)}`;

    if (verticalDirection !== 'straight') {
      spriteKey += verticalDirection.charAt(0).toUpperCase() + verticalDirection.slice(1);
    }

    duckData.element.style.backgroundImage = `url(${SPRITES.duck[type][spriteKey]})`;
  }

  /**
   * Move a duck
   */
  moveDuck(duckData) {
    if (!this.state.active || duckData.hit) return;

    const { element, direction, verticalDirection, speed } = duckData;
    const skyRect = this.elements.sky.getBoundingClientRect();
    const duckRect = element.getBoundingClientRect();

    // Current position
    let left = parseFloat(element.style.left);
    let bottom = parseFloat(element.style.bottom);

    // Calculate new position
    const horizontalMove = direction === 'right' ? 2 : -2;
    let verticalMove = 0;

    if (verticalDirection === 'up') {
      verticalMove = 1;
    } else if (verticalDirection === 'down') {
      verticalMove = -1;
    }

    // Apply movement
    left += horizontalMove * speed;
    bottom += verticalMove * speed;

    // Check boundaries
    if (left < 0) {
      left = 0;
      duckData.direction = 'right';
      this.updateDuckSprite(duckData);
    } else if (left > skyRect.width - duckRect.width) {
      left = skyRect.width - duckRect.width;
      duckData.direction = 'left';
      this.updateDuckSprite(duckData);
    }

    if (bottom < 0) {
      bottom = 0;
      duckData.verticalDirection = 'up';
      this.updateDuckSprite(duckData);
    } else if (bottom > skyRect.height - duckRect.height) {
      bottom = skyRect.height - duckRect.height;
      duckData.verticalDirection = 'down';
      this.updateDuckSprite(duckData);
    }

    // Randomly change direction
    if (Math.random() < 0.01) {
      duckData.verticalDirection = ['up', 'straight', 'down'][Math.floor(Math.random() * 3)];
      this.updateDuckSprite(duckData);
    }

    // Update position
    element.style.left = `${left}px`;
    element.style.bottom = `${bottom}px`;

    // Continue movement
    requestAnimationFrame(() => this.moveDuck(duckData));
  }

  /**
   * Handle a shot
   */
  handleShot(event) {
    if (!this.state.active || this.state.paused) return;

    // Check if we have ammo
    if (this.state.ammo <= 0) {
      this.playSound('empty');
      return;
    }

    // Decrease ammo
    this.state.ammo--;
    this.updateAmmoDisplay();

    // Play shot sound
    this.playSound('shot');

    // Create shot effect
    this.createShotEffect(event.clientX, event.clientY);

    // Check if we hit a duck
    const hit = this.checkDuckHit(event.clientX, event.clientY);

    // If no hit, reset combo
    if (!hit) {
      this.state.combo = 0;
      this.updateComboDisplay();
    }

    // Check if we're out of ammo
    if (this.state.ammo <= 0) {
      // Check if there are still ducks
      if (this.state.ducks.some(duck => !duck.hit)) {
        // Wait for ducks to escape
        setTimeout(() => {
          this.state.ducks.forEach(duck => {
            if (!duck.hit) {
              this.duckEscaped(duck);
            }
          });
        }, 1000);
      } else {
        // Start next wave
        this.startWave();
      }
    }
  }

  /**
   * Create a shot effect
   */
  createShotEffect(x, y) {
    const shotEffect = document.createElement('div');
    shotEffect.className = 'duck-hunt-shot-effect';

    // Position the shot effect
    const skyRect = this.elements.sky.getBoundingClientRect();
    shotEffect.style.left = `${x - skyRect.left}px`;
    shotEffect.style.top = `${y - skyRect.top}px`;

    // Add to sky
    this.elements.sky.appendChild(shotEffect);

    // Remove after animation
    setTimeout(() => {
      shotEffect.remove();
    }, 200);
  }

  /**
   * Check if a shot hit a duck
   */
  checkDuckHit(x, y) {
    // Get sky position
    const skyRect = this.elements.sky.getBoundingClientRect();
    const relativeX = x - skyRect.left;
    const relativeY = y - skyRect.top;

    // Check each duck
    for (const duck of this.state.ducks) {
      if (duck.hit) continue;

      const duckRect = duck.element.getBoundingClientRect();
      const duckX = duckRect.left - skyRect.left;
      const duckY = duckRect.top - skyRect.top;

      // Check if shot is within duck bounds
      if (
        relativeX >= duckX &&
        relativeX <= duckX + duckRect.width &&
        relativeY >= duckY &&
        relativeY <= duckY + duckRect.height
      ) {
        this.hitDuck(duck);
        return true;
      }
    }

    return false;
  }

  /**
   * Handle a duck being hit
   */
  hitDuck(duckData) {
    // Mark duck as hit
    duckData.hit = true;

    // Clear escape timer
    clearTimeout(duckData.escapeTimer);

    // Update sprite
    duckData.element.style.backgroundImage = `url(${SPRITES.duck[duckData.type].hit})`;

    // Play hit sound
    this.playSound('quack');

    // Increment combo
    this.state.combo++;
    this.state.maxCombo = Math.max(this.state.maxCombo, this.state.combo);
    this.updateComboDisplay();

    // Calculate points with combo multiplier
    const comboMultiplier = 1 + (this.state.combo - 1) * 0.1;
    const points = Math.round(duckData.points * comboMultiplier);

    // Add points
    this.state.score += points;
    this.updateScoreDisplay();

    // Show points
    this.showPoints(duckData.element, points);

    // Start falling animation
    setTimeout(() => {
      duckData.element.style.backgroundImage = `url(${SPRITES.duck[duckData.type].falling})`;

      // Play falling sound
      this.playSound('fall');

      // Animate falling
      const fallInterval = setInterval(() => {
        const bottom = parseFloat(duckData.element.style.bottom);
        if (bottom <= 0) {
          clearInterval(fallInterval);

          // Remove duck
          duckData.element.remove();

          // Remove from state
          this.state.ducks = this.state.ducks.filter(d => d !== duckData);

          // Increment ducks shot
          this.state.ducksShot++;

          // Check if level up
          if (this.state.ducksShot >= 10 * this.state.level) {
            this.levelUp();
          } else if (this.state.ducks.length === 0) {
            // Spawn more ducks if none left
            setTimeout(() => {
              this.spawnDuck();
            }, 1000);
          }
        } else {
          duckData.element.style.bottom = `${bottom - 5}px`;
        }
      }, 50);
    }, 500);
  }

  /**
   * Handle a duck escaping
   */
  duckEscaped(duckData) {
    // Clear escape timer
    clearTimeout(duckData.escapeTimer);

    // Play dog laugh sound
    this.playSound('dogLaugh');

    // Show dog laughing
    const dog = document.createElement('div');
    dog.className = 'duck-hunt-dog laughing';
    dog.style.backgroundImage = `url(${SPRITES.dog.laughing})`;
    this.elements.ground.appendChild(dog);

    // Remove duck
    duckData.element.remove();

    // Remove from state
    this.state.ducks = this.state.ducks.filter(d => d !== duckData);

    // Increment escaped ducks
    this.state.ducksEscaped++;

    // Update escaped ducks display
    if (this.state.ducksEscaped <= this.state.maxDucksEscaped) {
      this.elements.escapedDucks[this.state.ducksEscaped - 1].style.color = 'red';
    }

    // Check if game over
    if (this.state.ducksEscaped >= this.state.maxDucksEscaped) {
      this.gameOver();
    } else {
      // Remove dog after animation
      setTimeout(() => {
        dog.remove();

        // Spawn more ducks if none left
        if (this.state.ducks.length === 0) {
          setTimeout(() => {
            this.spawnDuck();
          }, 1000);
        }
      }, 2000);
    }
  }

  /**
   * Level up
   */
  levelUp() {
    // Increment level
    this.state.level++;
    this.updateLevelDisplay();

    // Play level up sound
    this.playSound('levelUp');

    // Show level up message
    this.showMessage(`Level ${this.state.level}!`);

    // Start next wave
    setTimeout(() => {
      this.startWave();
    }, 2000);
  }

  /**
   * Game over
   */
  gameOver() {
    // Set game state
    this.state.active = false;

    // Play game over sound
    this.playSound('gameOver');

    // Show game over message
    this.showMessage('Game Over!');

    // Check if high score
    if (this.state.score > this.state.highScore) {
      this.state.highScore = this.state.score;
      this.saveHighScore();
      this.updateHighScoreDisplay();

      // Show high score message
      setTimeout(() => {
        this.showMessage('New High Score!');
      }, 2000);
    }

    // Show start button
    setTimeout(() => {
      this.elements.startButton.style.display = 'block';
    }, 3000);
  }

  /**
   * Show points
   */
  showPoints(element, points) {
    const pointsElement = document.createElement('div');
    pointsElement.className = 'duck-hunt-points';
    pointsElement.textContent = `+${points}`;

    // Position points
    const rect = element.getBoundingClientRect();
    const skyRect = this.elements.sky.getBoundingClientRect();
    pointsElement.style.left = `${rect.left - skyRect.left + rect.width / 2}px`;
    pointsElement.style.top = `${rect.top - skyRect.top}px`;

    // Add to sky
    this.elements.sky.appendChild(pointsElement);

    // Animate points
    setTimeout(() => {
      pointsElement.style.top = `${parseFloat(pointsElement.style.top) - 50}px`;
      pointsElement.style.opacity = '0';

      // Remove after animation
      setTimeout(() => {
        pointsElement.remove();
      }, 500);
    }, 100);
  }

  /**
   * Show message
   */
  showMessage(message) {
    // Set message text
    this.elements.messageDisplay.textContent = message;

    // Show message
    this.elements.messageDisplay.style.display = 'block';
    this.elements.messageDisplay.style.opacity = '1';

    // Hide message after delay
    setTimeout(() => {
      this.elements.messageDisplay.style.opacity = '0';

      // Hide message after fade out
      setTimeout(() => {
        this.elements.messageDisplay.style.display = 'none';
      }, 500);
    }, 2000);
  }

  /**
   * Set difficulty
   */
  setDifficulty(difficulty) {
    // Set difficulty
    this.state.difficulty = difficulty;

    // Update difficulty selector
    this.elements.difficultyOptions.forEach(option => {
      if (option.dataset.difficulty === difficulty) {
        option.classList.add('active');
      } else {
        option.classList.remove('active');
      }
    });

    // Play menu select sound
    this.playSound('menuSelect');
  }

  /**
   * Handle window resize
   */
  handleResize() {
    // Update duck positions
    this.state.ducks.forEach(duckData => {
      const skyRect = this.elements.sky.getBoundingClientRect();
      const duckRect = duckData.element.getBoundingClientRect();

      // Check if duck is outside bounds
      if (parseFloat(duckData.element.style.left) > skyRect.width - duckRect.width) {
        duckData.element.style.left = `${skyRect.width - duckRect.width}px`;
      }

      if (parseFloat(duckData.element.style.bottom) > skyRect.height - duckRect.height) {
        duckData.element.style.bottom = `${skyRect.height - duckRect.height}px`;
      }
    });
  }

  /**
   * Pause game
   */
  pauseGame() {
    if (!this.state.active) return;

    // Toggle pause state
    this.state.paused = !this.state.paused;

    // Show pause message
    if (this.state.paused) {
      this.showMessage('Paused');
    }
  }

  /**
   * Play sound
   */
  playSound(name) {
    if (!this.sounds[name]) return;

    // Clone sound to allow overlapping
    const sound = this.sounds[name].cloneNode();
    sound.volume = this.sounds[name].volume;
    sound.play().catch(error => {
      console.warn(`Error playing sound ${name}:`, error);
    });
  }

  /**
   * Update score display
   */
  updateScoreDisplay() {
    this.elements.scoreDisplay.textContent = this.state.score;
  }

  /**
   * Update level display
   */
  updateLevelDisplay() {
    this.elements.levelDisplay.textContent = this.state.level;
  }

  /**
   * Update ammo display
   */
  updateAmmoDisplay() {
    this.elements.ammoDisplay.textContent = this.state.ammo;
  }

  /**
   * Update combo display
   */
  updateComboDisplay() {
    this.elements.comboDisplay.textContent = this.state.combo;
  }

  /**
   * Update high score display
   */
  updateHighScoreDisplay() {
    this.elements.highScoreDisplay.textContent = this.state.highScore;
  }

  /**
   * Update all UI elements
   */
  updateUI() {
    this.updateScoreDisplay();
    this.updateLevelDisplay();
    this.updateAmmoDisplay();
    this.updateComboDisplay();
    this.updateHighScoreDisplay();
  }

  /**
   * Load high score from local storage
   */
  loadHighScore() {
    const highScore = localStorage.getItem('duckHuntHighScore');
    return highScore ? parseInt(highScore, 10) : 0;
  }

  /**
   * Save high score to local storage
   */
  saveHighScore() {
    localStorage.setItem('duckHuntHighScore', this.state.highScore.toString());
  }
}

/**
 * Initialize Duck Hunt
 */
function initDuckHunt() {
  console.log('Initializing Duck Hunt game...');

  // Find the Duck Hunt window
  const duckHuntWindow = document.getElementById('duck-hunt-window');
  if (!duckHuntWindow) {
    console.error('Duck Hunt window not found');
    return;
  }

  // Create a new Duck Hunt game
  const game = new DuckHuntGame('duck-hunt-window');

  // Create NosytDuckHunt namespace if it doesn't exist
  if (!window.NosytDuckHunt) {
    window.NosytDuckHunt = {};
  }

  // Store the game instance in the window
  window.NosytDuckHunt.game = game;

  console.log('Duck Hunt game initialized');
}

// Add CSS for Duck Hunt
const duckHuntStyles = document.createElement('style');
duckHuntStyles.textContent = `
  .duck-hunt-container {
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    background-color: #87CEEB;
    font-family: 'MS Sans Serif', sans-serif;
  }

  .duck-hunt-sky {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 70%;
    background-color: #87CEEB;
    cursor: crosshair;
  }

  .duck-hunt-ground {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 30%;
    background-color: #8B4513;
    background-image: url('/images/win95/duck/ground.png');
    background-repeat: repeat-x;
    background-position: bottom;
  }

  .duck-hunt-score-container {
    position: absolute;
    top: 10px;
    left: 10px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    color: white;
    text-shadow: 1px 1px 2px black;
    font-size: 14px;
    z-index: 10;
  }

  .duck-hunt-score-label,
  .duck-hunt-level-label,
  .duck-hunt-ammo-label,
  .duck-hunt-combo-label,
  .duck-hunt-high-score-label {
    font-weight: bold;
    margin-right: 5px;
  }

  .duck-hunt-message {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    font-size: 24px;
    font-weight: bold;
    text-align: center;
    z-index: 100;
    display: none;
    opacity: 0;
    transition: opacity 0.5s;
  }

  .duck-hunt-start-button {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #008080;
    color: white;
    border: 2px solid white;
    border-radius: 5px;
    padding: 10px 20px;
    font-size: 18px;
    font-weight: bold;
    cursor: pointer;
    z-index: 50;
  }

  .duck-hunt-start-button:hover {
    background-color: #006666;
  }

  .duck-hunt-duck {
    position: absolute;
    width: 60px;
    height: 50px;
    background-size: contain;
    background-repeat: no-repeat;
    z-index: 20;
  }

  .duck-hunt-dog {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 80px;
    height: 80px;
    background-size: contain;
    background-repeat: no-repeat;
    z-index: 30;
    transition: bottom 0.5s;
  }

  .duck-hunt-dog.laughing {
    width: 100px;
    height: 100px;
  }

  .duck-hunt-shot-effect {
    position: absolute;
    width: 20px;
    height: 20px;
    background-color: white;
    border-radius: 50%;
    transform: translate(-50%, -50%);
    animation: shot-effect 0.2s forwards;
    z-index: 40;
  }

  @keyframes shot-effect {
    0% {
      opacity: 1;
      width: 20px;
      height: 20px;
    }
    100% {
      opacity: 0;
      width: 40px;
      height: 40px;
    }
  }

  .duck-hunt-points {
    position: absolute;
    color: yellow;
    font-size: 16px;
    font-weight: bold;
    text-shadow: 1px 1px 2px black;
    z-index: 30;
    transition: top 0.5s, opacity 0.5s;
  }

  .duck-hunt-escaped {
    position: absolute;
    bottom: 10px;
    right: 10px;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    color: white;
    text-shadow: 1px 1px 2px black;
    font-size: 14px;
    z-index: 10;
  }

  .duck-hunt-escaped-ducks {
    display: flex;
    gap: 5px;
  }

  .duck-icon {
    font-size: 20px;
  }

  .duck-hunt-difficulty {
    position: absolute;
    bottom: 10px;
    left: 10px;
    display: flex;
    flex-direction: column;
    gap: 5px;
    color: white;
    text-shadow: 1px 1px 2px black;
    font-size: 14px;
    z-index: 10;
  }

  .duck-hunt-difficulty-options {
    display: flex;
    gap: 5px;
  }

  .duck-hunt-difficulty-option {
    background-color: #008080;
    color: white;
    border: 1px solid white;
    border-radius: 3px;
    padding: 2px 5px;
    font-size: 12px;
    cursor: pointer;
  }

  .duck-hunt-difficulty-option.active {
    background-color: #006666;
    font-weight: bold;
  }
`;

document.head.appendChild(duckHuntStyles);

/**
 * Handle a shot
 */
function handleShot(e) {
  if (!gameState.gameActive || gameState.ammo <= 0) return;

  gameState.ammo--;
  updateUI();

  playSound('shot');
  createShotEffect(e);

  let hit = false;
  const ducksToRemove = [];

  gameState.ducks.forEach((duckObj, index) => {
    const duck = duckObj.element;
    if (!duck || !duck.parentNode) return;

    const duckRect = duck.getBoundingClientRect();
    const gameRect = gameState.elements.gameBackground.getBoundingClientRect();

    const clickX = e.clientX - gameRect.left;
    const clickY = e.clientY - gameRect.top;

    if (
      clickX >= duckRect.left - gameRect.left &&
      clickX <= duckRect.right - gameRect.left &&
      clickY >= duckRect.top - gameRect.top &&
      clickY <= duckRect.bottom - gameRect.top
    ) {
      hit = true;
      ducksToRemove.push({ index, duckObj });
    }
  });

  // Handle hits after the loop to avoid array modification issues
  ducksToRemove.forEach(({ index, duckObj }) => {
    shootDuck(duckObj);
    gameState.ducks.splice(index, 1);
  });

  if (!hit) {
    gameState.combo = 0;
    updateUI();
    showMessage('Missed!', 500);
    playSound('miss');
  }

  if (gameState.ammo <= 0) {
    setTimeout(() => {
      if (gameState.gameActive) {
        reload();
      }
    }, 1000);
  }
}

/**
 * Create a shot effect
 */
function createShotEffect(e) {
  if (!gameState.elements.gameBackground) return;

  const shotEffect = document.createElement('div');
  Object.assign(shotEffect.style, {
    position: 'absolute',
    width: '20px',
    height: '20px',
    borderRadius: '50%',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    boxShadow: '0 0 10px 5px rgba(255, 200, 0, 0.5)',
    zIndex: '20',
    transition: 'all 0.2s ease-out'
  });

  const gameRect = gameState.elements.gameBackground.getBoundingClientRect();
  const left = e.clientX - gameRect.left - 10;
  const top = e.clientY - gameRect.top - 10;
  shotEffect.style.left = `${left}px`;
  shotEffect.style.top = `${top}px`;

  gameState.elements.gameBackground.appendChild(shotEffect);

  requestAnimationFrame(() => {
    shotEffect.style.transform = 'scale(0.2)';
    shotEffect.style.opacity = '0';
  });

  setTimeout(() => {
    if (shotEffect.parentNode) {
      shotEffect.parentNode.removeChild(shotEffect);
    }
  }, 200);
}

/**
 * Shoot a duck
 */
function shootDuck(duckObj) {
  const { element: duck, sprite } = duckObj;
  if (!duck || !duck.parentNode) return;

  // Stop flying animation
  sprite.stop();

  // Play hit animation
  const hitSprite = createSpriteAnimation(SPRITES.duck.hit);
  duck.style.backgroundImage = `url(${SPRITES.duck.hit.spriteSheet})`;
  hitSprite.start();

  playSound('hit');
  setTimeout(() => playSound('quack'), 200);

  // Calculate score
  const diffSettings = DIFFICULTY[gameState.difficulty];
  const basePoints = 10;
  const levelBonus = gameState.level * 5;
  const comboBonus = gameState.combo * 2;
  const difficultyBonus = Math.round(basePoints * (diffSettings.scoreMultiplier - 1));
  const points = (basePoints + levelBonus + comboBonus + difficultyBonus);

  gameState.score += points;
  gameState.ducksShot++;
  gameState.combo++;

  if (gameState.combo > gameState.maxCombo) {
    gameState.maxCombo = gameState.combo;
  }

  updateUI();
  showMessage(`+${points} points! Combo: ${gameState.combo}x`, 1000);

  // Animate duck falling
  duck.style.transition = 'transform 0.5s ease-in, top 1s ease-in';
  duck.style.transform = 'rotate(180deg)';
  duck.style.top = '100%';

  setTimeout(() => {
    if (duck.parentNode) {
      duck.parentNode.removeChild(duck);
    }

    setTimeout(() => {
      if (gameState.gameActive) {
        const diffSettings = DIFFICULTY[gameState.difficulty];
        spawnDucks(1);

        if (gameState.ducksShot >= 10 * gameState.level) {
          levelUp();
        }
      }
    }, 500);
  }, 1000);
}

/**
 * Initialize Duck Hunt
 */
function initDuckHunt() {
  console.log('Initializing Duck Hunt game...');

  // Find the Duck Hunt window
  const duckHuntWindow = document.getElementById('duck-hunt-window');
  if (!duckHuntWindow) {
    console.error('Duck Hunt window not found');
    return;
  }

  // Create a new Duck Hunt game
  const game = new DuckHuntGame('duck-hunt-window');

  // Store the game instance in the global namespace
  NosytDuckHunt.game = game;

  console.log('Duck Hunt game initialized');
}

// Initialize Duck Hunt when the window is loaded
window.addEventListener('DOMContentLoaded', () => {
  console.log('DOM loaded, setting up Duck Hunt initialization');

  // Get the Duck Hunt icon
  const duckHuntIcon = document.getElementById('duck-hunt-icon');
  if (duckHuntIcon) {
    // Initialize game when icon is clicked
    duckHuntIcon.addEventListener('click', () => {
      console.log('Duck Hunt icon clicked');

      // Get the Duck Hunt window
      const duckHuntWindow = document.getElementById('duck-hunt-window');
      if (duckHuntWindow) {
        // Show the window
        duckHuntWindow.style.display = 'block';

        // Initialize the game after a short delay
        setTimeout(() => {
          // Check if game is already initialized
          if (!NosytDuckHunt.game) {
            initDuckHunt();
          }
        }, 500);
      }
    });
  }
});

/**
 * Level up
 */
function levelUp() {
  if (!gameState.gameActive) return;

  gameState.level++;
  playSound('levelUp');
  updateUI();

  const diffSettings = DIFFICULTY[gameState.difficulty];
  const levelBonus = gameState.level * 20;

  showMessage(`Level ${gameState.level}! +${levelBonus} bonus points!`, 2000);
  gameState.score += levelBonus;
  updateUI();

  // Increase max ammo every 3 levels
  if (gameState.level % 3 === 0) {
    gameState.maxAmmo++;
    gameState.ammo = gameState.maxAmmo;
    playSound('reload');
    showMessage(`Ammo capacity increased to ${gameState.maxAmmo}!`, 2000);
  }

  gameState.ducksShot = 0;

  // Clear existing ducks
  gameState.ducks.forEach(({ element: duck, sprite }) => {
    sprite.stop();
    if (duck && duck.parentNode) {
      duck.parentNode.removeChild(duck);
    }
  });

  gameState.ducks = [];

  // Spawn ducks for new level
  setTimeout(() => {
    if (gameState.gameActive) {
      const duckCount = Math.min(
        diffSettings.maxDucks,
        2 + Math.floor(gameState.level / 2)
      );
      spawnDucks(duckCount);
    }
  }, 2000);
}

/**
 * Game over
 */
function gameOver() {
  if (!gameState.gameActive) return;

  gameState.gameActive = false;
  playSound('gameOver');

  const finalScore = gameState.score;
  const isHighScore = finalScore > gameState.highScore;

  showMessage(
    `Game Over!\nFinal Score: ${finalScore}\nMax Combo: ${gameState.maxCombo}x`,
    3000
  );

  if (isHighScore) {
    setTimeout(() => {
      showMessage('New High Score!', 2000);
      playSound('levelUp');
      saveHighScore(finalScore);
    }, 3000);
  }

  setTimeout(() => {
    if (gameState.elements.startButton) {
      gameState.elements.startButton.style.display = 'block';
      gameState.elements.startButton.textContent = 'Play Again';
    }
  }, 5000);
}

// Initialize Duck Hunt when the window is loaded
window.addEventListener('load', () => {
  console.log('Window loaded, initializing Duck Hunt');
  setTimeout(initDuckHunt, 1000);
});
