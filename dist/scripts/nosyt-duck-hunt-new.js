/**
 * NosytOS95 Duck Hunt Game
 * A classic Duck Hunt game implementation for NosytOS95
 */

// Create a namespace for the game
const NosytDuckHunt = window.NosytDuckHunt || {};

// Game state
NosytDuckHunt.gameState = {
  active: false,
  paused: false,
  score: 0,
  highScore: 0,
  level: 1,
  ammo: 3,
  maxAmmo: 3,
  ducksShot: 0,
  ducksEscaped: 0,
  maxDucksEscaped: 5,
  combo: 0,
  maxCombo: 0,
  ducks: [],
  sounds: {},
  difficulty: 'normal',
  elements: {}
};

// Difficulty settings
NosytDuckHunt.DIFFICULTY = {
  easy: {
    duckSpeed: 2,
    duckSpawnRate: 3000,
    ammoPerWave: 5,
    escapeTime: 8000,
    pointsPerDuck: 100
  },
  normal: {
    duckSpeed: 3,
    duckSpawnRate: 2500,
    ammoPerWave: 3,
    escapeTime: 6000,
    pointsPerDuck: 200
  },
  hard: {
    duckSpeed: 4,
    duckSpawnRate: 2000,
    ammoPerWave: 2,
    escapeTime: 4000,
    pointsPerDuck: 300
  }
};

// Duck sprites
NosytDuckHunt.SPRITES = {
  duck: {
    flyLeft: '/images/duck-hunt/duck-left.png',
    flyRight: '/images/duck-hunt/duck-right.png',
    flyUp: '/images/duck-hunt/duck-left.png', // Fallback to left sprite
    hit: '/images/duck-hunt/duck-left.png', // Fallback to left sprite
    falling: '/images/duck-hunt/duck-left.png' // Fallback to left sprite
  },
  dog: {
    walking: '/images/duck-hunt/dog.png', // Fallback to normal dog
    jumping: '/images/duck-hunt/dog.png', // Fallback to normal dog
    laughing: '/images/duck-hunt/dog-laughing.png',
    pointing: '/images/duck-hunt/dog.png' // Fallback to normal dog
  }
};

// Sound configurations with fallback paths
NosytDuckHunt.SOUNDS = {
  shot: { src: ['/sounds/duck-hunt/shot.mp3', '/audio/gun-shot.mp3'], volume: 0.5 },
  quack: { src: ['/sounds/duck-hunt/quack.mp3', '/audio/quack.mp3'], volume: 0.6 },
  fall: { src: ['/sounds/duck-hunt/fall.mp3', '/audio/duck-falling.mp3'], volume: 0.6 },
  gameStart: { src: ['/audio/game-start.mp3'], volume: 0.4 },
  levelUp: { src: ['/sounds/duck-hunt/level-up.mp3', '/audio/level-up.mp3'], volume: 0.5 },
  gameOver: { src: ['/audio/game-over.mp3'], volume: 0.5 },
  dogLaugh: { src: ['/audio/dog-laugh.mp3'], volume: 0.6 },
  dogBark: { src: ['/audio/dog-bark.mp3'], volume: 0.6 },
  duckFlap: { src: ['/audio/duck-flap.mp3'], volume: 0.4 },
  roundClear: { src: ['/audio/round-clear.mp3'], volume: 0.5 },
  emptyGun: { src: ['/audio/empty-gun.mp3'], volume: 0.5 },
  reload: { src: ['/audio/reload.mp3'], volume: 0.5 },
  menuSelect: { src: ['/audio/menu-select.mp3'], volume: 0.4 }
};

/**
 * Duck Hunt Game Class
 */
NosytDuckHunt.Game = class {
  constructor(containerId) {
    this.containerId = containerId;
    this.container = document.getElementById(containerId);
    this.state = {
      active: false,
      paused: false,
      score: 0,
      highScore: 0,
      level: 1,
      ammo: 3,
      maxAmmo: 3,
      ducksShot: 0,
      ducksEscaped: 0,
      maxDucksEscaped: 5,
      combo: 0,
      maxCombo: 0,
      ducks: [],
      difficulty: 'normal'
    };
    this.sounds = {};
    this.elements = {};

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

    // Load high score
    this.state.highScore = this.loadHighScore();

    // Update UI
    this.updateUI();

    // Set up event listeners
    this.setupEventListeners();

    console.log('Duck Hunt game initialized');
  }

  /**
   * Create the game UI
   */
  createGameUI() {
    // Clear container
    if (this.container) {
      const content = this.container.querySelector('.window-content');
      if (content) {
        content.innerHTML = '';

        // Create game background
        const gameBackground = document.createElement('div');
        gameBackground.className = 'duck-hunt-background';
        gameBackground.style.width = '100%';
        gameBackground.style.height = '100%';
        gameBackground.style.position = 'relative';
        gameBackground.style.backgroundColor = '#87CEEB'; // Sky blue background as fallback
        gameBackground.style.backgroundImage = 'url("/images/duck-hunt/background.png")';
        gameBackground.style.backgroundSize = 'cover';
        gameBackground.style.backgroundPosition = 'center bottom';
        gameBackground.style.cursor = 'crosshair';
        gameBackground.style.overflow = 'hidden';

        // Create sky area (for ducks)
        const sky = document.createElement('div');
        sky.className = 'duck-hunt-sky';
        sky.style.width = '100%';
        sky.style.height = '70%';
        sky.style.position = 'absolute';
        sky.style.top = '0';
        sky.style.left = '0';

        // Create ground area (for dog)
        const ground = document.createElement('div');
        ground.className = 'duck-hunt-ground';
        ground.style.width = '100%';
        ground.style.height = '30%';
        ground.style.position = 'absolute';
        ground.style.bottom = '0';
        ground.style.left = '0';
        ground.style.backgroundColor = '#8B4513'; // Brown ground color

        // Create score panel
        const scorePanel = document.createElement('div');
        scorePanel.className = 'duck-hunt-score-panel';
        scorePanel.innerHTML = `
          <div class="duck-hunt-score">Score: <span class="duck-hunt-score-value">0</span></div>
          <div class="duck-hunt-level">Level: <span class="duck-hunt-level-value">1</span></div>
          <div class="duck-hunt-ammo">Ammo: <span class="duck-hunt-ammo-value">3</span></div>
          <div class="duck-hunt-combo">Combo: <span class="duck-hunt-combo-value">0</span></div>
          <div class="duck-hunt-high-score">High Score: <span class="duck-hunt-high-score-value">0</span></div>
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

        // Create escaped ducks display
        const escapedDisplay = document.createElement('div');
        escapedDisplay.className = 'duck-hunt-escaped';
        escapedDisplay.innerHTML = `
          <span class="duck-hunt-escaped-label">Escaped:</span>
          <div class="duck-hunt-escaped-ducks">
            <span class="duck-icon">🦆</span>
            <span class="duck-icon">🦆</span>
            <span class="duck-icon">🦆</span>
            <span class="duck-icon">🦆</span>
            <span class="duck-icon">🦆</span>
          </div>
        `;
        escapedDisplay.style.position = 'absolute';
        escapedDisplay.style.top = '10px';
        escapedDisplay.style.right = '10px';
        escapedDisplay.style.padding = '10px';
        escapedDisplay.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        escapedDisplay.style.color = 'white';
        escapedDisplay.style.fontFamily = 'MS Sans Serif, sans-serif';
        escapedDisplay.style.fontSize = '14px';
        escapedDisplay.style.borderRadius = '5px';
        escapedDisplay.style.zIndex = '100';

        // Create difficulty selector
        const difficultySelector = document.createElement('div');
        difficultySelector.className = 'duck-hunt-difficulty';
        difficultySelector.innerHTML = `
          <span class="duck-hunt-difficulty-label">Difficulty:</span>
          <div class="duck-hunt-difficulty-options">
            <span class="duck-hunt-difficulty-option" data-difficulty="easy">Easy</span>
            <span class="duck-hunt-difficulty-option active" data-difficulty="normal">Normal</span>
            <span class="duck-hunt-difficulty-option" data-difficulty="hard">Hard</span>
          </div>
        `;
        difficultySelector.style.position = 'absolute';
        difficultySelector.style.bottom = '50px';
        difficultySelector.style.left = '10px';
        difficultySelector.style.padding = '10px';
        difficultySelector.style.backgroundColor = 'rgba(0, 0, 0, 0.7)';
        difficultySelector.style.color = 'white';
        difficultySelector.style.fontFamily = 'MS Sans Serif, sans-serif';
        difficultySelector.style.fontSize = '14px';
        difficultySelector.style.borderRadius = '5px';
        difficultySelector.style.zIndex = '100';

        // Create message display
        const messageDisplay = document.createElement('div');
        messageDisplay.className = 'duck-hunt-message';
        messageDisplay.style.position = 'absolute';
        messageDisplay.style.top = '50%';
        messageDisplay.style.left = '50%';
        messageDisplay.style.transform = 'translate(-50%, -50%)';
        messageDisplay.style.padding = '20px';
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
        startButton.className = 'duck-hunt-start-button';
        startButton.textContent = 'Start Game';
        startButton.style.position = 'absolute';
        startButton.style.bottom = '10px';
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
        gameBackground.appendChild(sky);
        gameBackground.appendChild(ground);
        gameBackground.appendChild(scorePanel);
        gameBackground.appendChild(escapedDisplay);
        gameBackground.appendChild(difficultySelector);
        gameBackground.appendChild(messageDisplay);
        gameBackground.appendChild(startButton);

        // Add game background to container
        content.appendChild(gameBackground);

        // Store elements
        this.elements = {
          gameContainer: content,
          gameBackground,
          sky,
          ground,
          scoreDisplay: scorePanel.querySelector('.duck-hunt-score-value'),
          levelDisplay: scorePanel.querySelector('.duck-hunt-level-value'),
          ammoDisplay: scorePanel.querySelector('.duck-hunt-ammo-value'),
          comboDisplay: scorePanel.querySelector('.duck-hunt-combo-value'),
          highScoreDisplay: scorePanel.querySelector('.duck-hunt-high-score-value'),
          escapedDisplay,
          escapedIcons: escapedDisplay.querySelectorAll('.duck-icon'),
          difficultySelector,
          difficultyOptions: difficultySelector.querySelectorAll('.duck-hunt-difficulty-option'),
          messageDisplay,
          startButton
        };
      }
    }
  }

  /**
   * Load sounds
   */
  loadSounds() {
    // Load all sounds
    for (const [name, config] of Object.entries(NosytDuckHunt.SOUNDS)) {
      try {
        // Handle array of fallback paths
        const paths = Array.isArray(config.src) ? config.src : [config.src];

        // Try to load the first path
        const sound = new Audio(paths[0]);
        sound.volume = config.volume || 0.5;

        // Add error handling for sound loading
        sound.addEventListener('error', (e) => {
          console.warn(`Error loading sound ${name} from ${paths[0]}:`, e);

          // Try fallback paths if available
          if (paths.length > 1) {
            console.log(`Trying fallback path for ${name}: ${paths[1]}`);
            sound.src = paths[1];
          }
        });

        // Add load event listener
        sound.addEventListener('canplaythrough', () => {
          console.log(`Sound ${name} loaded successfully`);
        });

        // Preload the sound
        sound.load();

        // Store the sound in game state
        this.sounds[name] = sound;
      } catch (error) {
        console.error(`Failed to create sound ${name}:`, error);
      }
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
        this.setDifficulty(option.dataset.difficulty);
      });
    });

    // Window resize
    window.addEventListener('resize', () => {
      this.handleResize();
    });

    // Keyboard controls
    window.addEventListener('keydown', (e) => {
      // Pause on 'p' or 'P'
      if (e.key === 'p' || e.key === 'P') {
        this.pauseGame();
      }
    });
  }

  /**
   * Start the game
   */
  startGame() {
    // Reset game state
    this.state.active = true;
    this.state.paused = false;
    this.state.score = 0;
    this.state.level = 1;
    this.state.ammo = NosytDuckHunt.DIFFICULTY[this.state.difficulty].ammoPerWave;
    this.state.maxAmmo = NosytDuckHunt.DIFFICULTY[this.state.difficulty].ammoPerWave;
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
    this.elements.escapedIcons.forEach(icon => {
      icon.style.opacity = '0.3';
    });

    // Show start message
    this.showMessage('Get Ready!');

    // Play start sound
    this.playSound('gameStart');

    // Start game after intro animation
    this.showIntroAnimation().then(() => {
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
      dog.style.backgroundImage = `url(${NosytDuckHunt.SPRITES.dog.walking})`;
      dog.style.position = 'absolute';
      dog.style.width = '100px';
      dog.style.height = '100px';
      dog.style.backgroundSize = 'contain';
      dog.style.backgroundRepeat = 'no-repeat';
      dog.style.backgroundPosition = 'center bottom';
      dog.style.left = '-100px';
      dog.style.bottom = '20px';
      dog.style.zIndex = '50';
      dog.style.transition = 'left 2s, bottom 0.5s';

      // Fallback if image doesn't load
      dog.style.backgroundColor = 'transparent';

      this.elements.ground.appendChild(dog);

      // Animate dog walking in
      setTimeout(() => {
        dog.style.left = '50%';

        // Animate dog jumping
        setTimeout(() => {
          dog.style.bottom = '100px';

          // Animate dog jumping
          setTimeout(() => {
            dog.style.bottom = '20px';
            dog.style.backgroundImage = `url(${NosytDuckHunt.SPRITES.dog.walking})`;

            // Remove dog after animation
            setTimeout(() => {
              dog.style.left = '120%';

              // Remove dog after walking out
              setTimeout(() => {
                if (dog.parentNode) {
                  dog.parentNode.removeChild(dog);
                }
                resolve();
              }, 2000);
            }, 1000);
          }, 500);
        }, 1000);
      }, 100);
    });
  }

  /**
   * Start a new wave of ducks
   */
  startWave() {
    // Reset ammo
    this.state.ammo = NosytDuckHunt.DIFFICULTY[this.state.difficulty].ammoPerWave;
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
    const diffSettings = NosytDuckHunt.DIFFICULTY[this.state.difficulty];

    // Create duck element
    const duck = document.createElement('div');
    duck.className = 'duck-hunt-duck';
    duck.style.position = 'absolute';
    duck.style.width = '50px';
    duck.style.height = '50px';
    duck.style.backgroundSize = 'contain';
    duck.style.backgroundRepeat = 'no-repeat';
    duck.style.backgroundPosition = 'center';
    duck.style.zIndex = '20';
    duck.style.cursor = 'crosshair';

    // Set initial position
    const skyRect = this.elements.sky.getBoundingClientRect();
    const startX = Math.random() * (skyRect.width - 50);
    duck.style.left = `${startX}px`;
    duck.style.bottom = '0px';

    // Create duck data
    const duckData = {
      element: duck,
      direction: Math.random() > 0.5 ? 'left' : 'right',
      verticalDirection: 'up',
      speed: diffSettings.duckSpeed * (0.8 + Math.random() * 0.4),
      type: 'normal',
      hit: false,
      escapeTimer: null
    };

    // Add duck to state
    this.state.ducks.push(duckData);

    // Update sprite
    this.updateDuckSprite(duckData);

    // Add to sky
    this.elements.sky.appendChild(duck);

    // Start duck movement
    this.moveDuck(duckData);

    // Set escape timer
    duckData.escapeTimer = setTimeout(() => {
      if (!duckData.hit) {
        this.duckEscaped(duckData);
      }
    }, diffSettings.escapeTime);

    // Play sound
    this.playSound('quack');
  }

  /**
   * Update duck sprite based on direction
   */
  updateDuckSprite(duckData) {
    const { direction, verticalDirection } = duckData;
    let spriteKey = `fly${direction.charAt(0).toUpperCase() + direction.slice(1)}`;

    if (verticalDirection === 'up') {
      spriteKey = 'flyUp';
    }

    if (duckData.hit) {
      spriteKey = 'hit';
    }

    duckData.element.style.backgroundImage = `url(${NosytDuckHunt.SPRITES.duck[spriteKey]})`;
  }

  /**
   * Move a duck
   */
  moveDuck(duckData) {
    if (!this.state.active || duckData.hit) return;

    const { element, direction, verticalDirection, speed } = duckData;

    // Get current position
    let left = parseFloat(element.style.left) || 0;
    let bottom = parseFloat(element.style.bottom) || 0;

    // Calculate new position
    if (direction === 'left') {
      left -= speed;
    } else {
      left += speed;
    }

    if (verticalDirection === 'up') {
      bottom += speed;
    } else {
      bottom -= speed;
    }

    // Get boundaries
    const skyRect = this.elements.sky.getBoundingClientRect();
    const duckRect = element.getBoundingClientRect();

    // Check boundaries and change direction if needed
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

    // Update position
    element.style.left = `${left}px`;
    element.style.bottom = `${bottom}px`;

    // Continue movement
    if (this.state.active && !duckData.hit && !this.state.paused) {
      requestAnimationFrame(() => this.moveDuck(duckData));
    }
  }

  /**
   * Handle a shot
   */
  handleShot(event) {
    if (!this.state.active || this.state.paused) return;

    // Check if we have ammo
    if (this.state.ammo <= 0) {
      // Play empty gun sound
      this.playSound('emptyGun');
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
    shotEffect.style.position = 'absolute';
    shotEffect.style.width = '20px';
    shotEffect.style.height = '20px';
    shotEffect.style.backgroundColor = 'white';
    shotEffect.style.borderRadius = '50%';
    shotEffect.style.transform = 'translate(-50%, -50%)';
    shotEffect.style.zIndex = '30';
    shotEffect.style.pointerEvents = 'none';

    // Position shot effect
    const skyRect = this.elements.sky.getBoundingClientRect();
    const relativeX = x - skyRect.left;
    const relativeY = y - skyRect.top;
    shotEffect.style.left = `${relativeX}px`;
    shotEffect.style.top = `${relativeY}px`;

    // Add to sky
    this.elements.sky.appendChild(shotEffect);

    // Animate shot effect
    setTimeout(() => {
      shotEffect.style.transition = 'width 0.2s, height 0.2s, opacity 0.2s';
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
  checkDuckHit(x, y) {
    // Get sky position
    const skyRect = this.elements.sky.getBoundingClientRect();
    const relativeX = x - skyRect.left;
    const relativeY = y - skyRect.top;

    // Check each duck
    for (const duckData of this.state.ducks) {
      if (duckData.hit) continue;

      const duckRect = duckData.element.getBoundingClientRect();
      const duckX = duckRect.left - skyRect.left;
      const duckY = duckRect.top - skyRect.top;
      const duckWidth = duckRect.width;
      const duckHeight = duckRect.height;

      // Check if shot is within duck bounds
      if (
        relativeX >= duckX &&
        relativeX <= duckX + duckWidth &&
        relativeY >= duckY &&
        relativeY <= duckY + duckHeight
      ) {
        this.hitDuck(duckData);
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
    this.updateDuckSprite(duckData);

    // Play hit sound
    this.playSound('quack');

    // Increment combo
    this.state.combo++;
    if (this.state.combo > this.state.maxCombo) {
      this.state.maxCombo = this.state.combo;
    }

    // Calculate points with combo multiplier
    const diffSettings = NosytDuckHunt.DIFFICULTY[this.state.difficulty];
    const comboMultiplier = 1 + (this.state.combo - 1) * 0.1;
    const points = Math.round(diffSettings.pointsPerDuck * comboMultiplier);

    // Add points
    this.state.score += points;

    // Update UI
    this.updateScoreDisplay();
    this.updateComboDisplay();

    // Show points
    this.showPoints(duckData.element, points);

    // Start falling animation
    setTimeout(() => {
      duckData.element.style.backgroundImage = `url(${NosytDuckHunt.SPRITES.duck.falling})`;
      duckData.element.style.transition = 'bottom 1s ease-in';
      duckData.element.style.bottom = '0';

      // Play falling sound
      this.playSound('fall');

      // Remove duck after falling
      let fallInterval = setInterval(() => {
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
          } else if (this.state.ducks.length === 0 && this.state.ammo > 0) {
            // Spawn more ducks if none left and we have ammo
            setTimeout(() => {
              this.spawnDuck();
            }, 1000);
          }
        }
      }, 100);
    }, 500);
  }

  /**
   * Handle a duck escaping
   */
  duckEscaped(duckData) {
    // Clear escape timer
    clearTimeout(duckData.escapeTimer);

    // Animate escape
    duckData.element.style.transition = 'bottom 1s ease-out, transform 1s ease-out';
    duckData.element.style.bottom = `${this.elements.sky.getBoundingClientRect().height}px`;
    duckData.element.style.transform = 'scale(0.5)';

    // Play sound
    this.playSound('quack');

    // Remove duck after animation
    setTimeout(() => {
      // Remove duck
      if (duckData.element.parentNode) {
        duckData.element.parentNode.removeChild(duckData.element);
      }

      // Remove from state
      this.state.ducks = this.state.ducks.filter(d => d !== duckData);

      // Increment escaped ducks
      this.state.ducksEscaped++;

      // Update escaped ducks display
      this.updateEscapedDisplay();

      // Check if game over
      if (this.state.ducksEscaped >= this.state.maxDucksEscaped) {
        this.gameOver();
      } else {
        // Show dog laughing
        this.showDogLaughing();

        // Spawn more ducks if none left and we have ammo
        if (this.state.ducks.length === 0 && this.state.ammo > 0) {
          setTimeout(() => {
            this.spawnDuck();
          }, 1000);
        }
      }
    }, 1000);
  }

  /**
   * Show dog laughing animation
   */
  showDogLaughing() {
    // Create dog animation
    const dog = document.createElement('div');
    dog.className = 'duck-hunt-dog';
    dog.style.backgroundImage = `url(${NosytDuckHunt.SPRITES.dog.laughing})`;
    dog.style.position = 'absolute';
    dog.style.width = '100px';
    dog.style.height = '100px';
    dog.style.backgroundSize = 'contain';
    dog.style.backgroundRepeat = 'no-repeat';
    dog.style.backgroundPosition = 'center bottom';
    dog.style.left = '50%';
    dog.style.bottom = '20px';
    dog.style.transform = 'translateX(-50%)';
    dog.style.zIndex = '50';

    this.elements.ground.appendChild(dog);

    // Play dog laugh sound
    this.playSound('dogLaugh');

    // Remove dog after animation
    setTimeout(() => {
      if (dog.parentNode) {
        dog.parentNode.removeChild(dog);
      }
    }, 2000);
  }

  /**
   * Level up
   */
  levelUp() {
    // Increment level
    this.state.level++;
    this.updateLevelDisplay();

    // Reset ammo
    this.state.ammo = NosytDuckHunt.DIFFICULTY[this.state.difficulty].ammoPerWave;
    this.updateAmmoDisplay();

    // Play level up sound
    this.playSound('levelUp');

    // Show level up message
    this.showMessage(`Level ${this.state.level}!`);

    // Spawn ducks after a delay
    setTimeout(() => {
      this.spawnDuck();
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

    // Check if high score
    if (this.state.score > this.state.highScore) {
      this.state.highScore = this.state.score;
      this.saveHighScore();
      this.updateHighScoreDisplay();

      // Show high score message
      this.showMessage(`Game Over!\nNew High Score: ${this.state.score}!`);
    } else {
      // Show game over message
      this.showMessage(`Game Over!\nScore: ${this.state.score}`);
    }

    // Show start button after delay
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
    pointsElement.style.position = 'absolute';
    pointsElement.style.color = 'yellow';
    pointsElement.style.fontWeight = 'bold';
    pointsElement.style.fontSize = '16px';
    pointsElement.style.textShadow = '1px 1px 2px black';
    pointsElement.style.zIndex = '100';
    pointsElement.style.pointerEvents = 'none';

    // Position points
    const rect = element.getBoundingClientRect();
    const skyRect = this.elements.sky.getBoundingClientRect();

    pointsElement.style.left = `${rect.left - skyRect.left + rect.width / 2}px`;
    pointsElement.style.top = `${rect.top - skyRect.top}px`;

    // Add to sky
    this.elements.sky.appendChild(pointsElement);

    // Animate points
    setTimeout(() => {
      pointsElement.style.transition = 'top 0.5s, opacity 0.5s';
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

    // Update difficulty options
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
   * Update escaped ducks display
   */
  updateEscapedDisplay() {
    // Update escaped ducks icons
    this.elements.escapedIcons.forEach((icon, index) => {
      if (index < this.state.ducksEscaped) {
        icon.style.opacity = '1';
      } else {
        icon.style.opacity = '0.3';
      }
    });
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
    this.updateEscapedDisplay();
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
NosytDuckHunt.init = function(windowId) {
  console.log('Initializing Duck Hunt game...');

  // Create new game instance
  const game = new NosytDuckHunt.Game(windowId);

  // Store game instance
  NosytDuckHunt.currentGame = game;

  return game;
};

// Initialize when window is loaded
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
            NosytDuckHunt.init('duck-hunt-window');
          }, 500);
        }
      });
    }
  }, 1000);
});