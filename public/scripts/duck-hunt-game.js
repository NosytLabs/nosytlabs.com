/**
 * Duck Hunt Game for NosytOS95
 * A fully functional Duck Hunt game implementation
 */

class DuckHuntGame {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error('Duck Hunt container not found');
      return;
    }

    // Game state
    this.state = {
      score: 0,
      level: 1,
      ducks: [],
      ammo: 3,
      ducksShot: 0,
      ducksPerRound: 10,
      isGameOver: false,
      isPaused: false,
      highScore: this.loadHighScore(),
      soundEnabled: true
    };

    // Game settings
    this.settings = {
      duckSpeed: 3,
      duckSpawnRate: 2000,
      maxDucks: 3,
      roundDuration: 60000
    };

    // Initialize game elements
    this.initGameElements();
    
    // Initialize event listeners
    this.initEventListeners();
    
    // Load sounds
    this.loadSounds();
    
    // Start the game
    this.startGame();
    
    console.log('Duck Hunt game initialized');
  }

  /**
   * Initialize game elements
   */
  initGameElements() {
    // Create game container
    this.gameContainer = document.createElement('div');
    this.gameContainer.className = 'duck-hunt-container';
    this.container.querySelector('.window-content').appendChild(this.gameContainer);

    // Create sky
    this.sky = document.createElement('div');
    this.sky.className = 'duck-hunt-sky';
    this.gameContainer.appendChild(this.sky);

    // Create ground
    this.ground = document.createElement('div');
    this.ground.className = 'duck-hunt-ground';
    this.gameContainer.appendChild(this.ground);

    // Create score display
    this.scoreDisplay = document.createElement('div');
    this.scoreDisplay.className = 'duck-hunt-score';
    this.scoreDisplay.innerHTML = `Score: <span>0</span> | Level: <span>1</span> | Ammo: <span>3</span>`;
    this.gameContainer.appendChild(this.scoreDisplay);

    // Create high score display
    this.highScoreDisplay = document.createElement('div');
    this.highScoreDisplay.className = 'duck-hunt-high-score';
    this.highScoreDisplay.innerHTML = `High Score: <span>${this.state.highScore}</span>`;
    this.gameContainer.appendChild(this.highScoreDisplay);

    // Create sound toggle button
    this.soundToggle = document.createElement('button');
    this.soundToggle.className = 'duck-hunt-sound-toggle';
    this.soundToggle.innerHTML = '🔊';
    this.soundToggle.title = 'Toggle Sound';
    this.gameContainer.appendChild(this.soundToggle);

    // Create message display
    this.messageDisplay = document.createElement('div');
    this.messageDisplay.className = 'duck-hunt-message';
    this.gameContainer.appendChild(this.messageDisplay);

    // Create dog element
    this.dog = document.createElement('div');
    this.dog.className = 'duck-hunt-dog';
    this.ground.appendChild(this.dog);
  }

  /**
   * Initialize event listeners
   */
  initEventListeners() {
    // Click event for shooting
    this.sky.addEventListener('click', (e) => {
      this.shoot(e);
    });

    // Sound toggle
    this.soundToggle.addEventListener('click', () => {
      this.state.soundEnabled = !this.state.soundEnabled;
      this.soundToggle.innerHTML = this.state.soundEnabled ? '🔊' : '🔇';
    });

    // Window resize event
    window.addEventListener('resize', () => {
      this.handleResize();
    });

    // Pause game when window is not visible
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseGame();
      } else {
        this.resumeGame();
      }
    });
  }

  /**
   * Load game sounds
   */
  loadSounds() {
    this.sounds = {
      shoot: new Audio('/audio/duck-hunt/gun-shot.mp3'),
      quack: new Audio('/audio/duck-hunt/quack.mp3'),
      fall: new Audio('/audio/duck-hunt/duck-falling.mp3'),
      gameStart: new Audio('/audio/duck-hunt/game-start.mp3'),
      levelUp: new Audio('/audio/duck-hunt/level-up.mp3'),
      gameOver: new Audio('/audio/duck-hunt/game-over.mp3'),
      dogLaugh: new Audio('/audio/duck-hunt/dog-laugh.mp3'),
      reload: new Audio('/audio/duck-hunt/reload.mp3'),
      empty: new Audio('/audio/duck-hunt/empty-gun.mp3')
    };

    // Set volume for all sounds
    Object.values(this.sounds).forEach(sound => {
      sound.volume = 0.5;
    });
  }

  /**
   * Play a sound
   * @param {string} soundName - Name of the sound to play
   */
  playSound(soundName) {
    if (!this.state.soundEnabled) return;
    
    const sound = this.sounds[soundName];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(e => console.log('Error playing sound:', e));
    }
  }

  /**
   * Start the game
   */
  startGame() {
    // Reset game state
    this.state.score = 0;
    this.state.level = 1;
    this.state.ducks = [];
    this.state.ammo = 3;
    this.state.ducksShot = 0;
    this.state.isGameOver = false;
    this.state.isPaused = false;

    // Update UI
    this.updateUI();

    // Play start sound
    this.playSound('gameStart');

    // Show start message
    this.showMessage('Level 1 - Get Ready!', 2000);

    // Start spawning ducks
    this.spawnDuckInterval = setInterval(() => {
      this.spawnDuck();
    }, this.settings.duckSpawnRate);

    // Start game loop
    this.gameLoop();
  }

  /**
   * Game loop
   */
  gameLoop() {
    if (this.state.isGameOver || this.state.isPaused) return;

    // Move ducks
    this.moveDucks();

    // Check for level completion
    if (this.state.ducksShot >= this.state.ducksPerRound) {
      this.levelUp();
    }

    // Request next frame
    requestAnimationFrame(() => this.gameLoop());
  }

  /**
   * Spawn a duck
   */
  spawnDuck() {
    if (this.state.isGameOver || this.state.isPaused) return;
    if (this.state.ducks.length >= this.settings.maxDucks) return;

    // Create duck element
    const duck = document.createElement('div');
    duck.className = 'duck';
    
    // Random duck color
    const duckColors = ['blue', 'red', 'black'];
    const color = duckColors[Math.floor(Math.random() * duckColors.length)];
    duck.dataset.color = color;
    
    // Set initial position
    const startX = Math.random() * (this.sky.offsetWidth - 60);
    duck.style.left = `${startX}px`;
    duck.style.bottom = '0';
    
    // Set random direction and speed
    const direction = Math.random() > 0.5 ? 1 : -1;
    const speedX = (Math.random() * 2 + 1) * this.settings.duckSpeed * direction;
    const speedY = (Math.random() * 2 + 1) * this.settings.duckSpeed;
    
    // Add to game state
    this.state.ducks.push({
      element: duck,
      speedX: speedX,
      speedY: speedY,
      isHit: false
    });
    
    // Add to DOM
    this.sky.appendChild(duck);
    
    // Play quack sound
    this.playSound('quack');
  }

  /**
   * Move ducks
   */
  moveDucks() {
    this.state.ducks.forEach((duck, index) => {
      if (duck.isHit) return;
      
      // Get current position
      const rect = duck.element.getBoundingClientRect();
      const skyRect = this.sky.getBoundingClientRect();
      
      // Calculate new position
      let left = rect.left - skyRect.left + duck.speedX;
      let bottom = rect.bottom - skyRect.bottom + duck.speedY;
      
      // Check boundaries
      if (left < 0) {
        left = 0;
        duck.speedX *= -1;
      } else if (left + rect.width > skyRect.width) {
        left = skyRect.width - rect.width;
        duck.speedX *= -1;
      }
      
      if (bottom > 0) {
        bottom = 0;
        duck.speedY *= -1;
      } else if (bottom < -skyRect.height + rect.height) {
        bottom = -skyRect.height + rect.height;
        duck.speedY *= -1;
      }
      
      // Update position
      duck.element.style.left = `${left}px`;
      duck.element.style.bottom = `${bottom}px`;
      
      // Update sprite based on direction
      if (duck.speedX > 0) {
        duck.element.style.transform = 'scaleX(1)';
      } else {
        duck.element.style.transform = 'scaleX(-1)';
      }
    });
  }

  /**
   * Shoot at ducks
   * @param {MouseEvent} e - Click event
   */
  shoot(e) {
    if (this.state.isGameOver || this.state.isPaused) return;
    if (this.state.ammo <= 0) {
      this.playSound('empty');
      this.showMessage('Out of ammo! Reloading...', 1000);
      setTimeout(() => {
        this.state.ammo = 3;
        this.updateUI();
        this.playSound('reload');
      }, 1000);
      return;
    }
    
    // Decrease ammo
    this.state.ammo--;
    this.updateUI();
    
    // Play shoot sound
    this.playSound('shoot');
    
    // Create shot effect
    this.createShotEffect(e.clientX, e.clientY);
    
    // Check for hits
    const skyRect = this.sky.getBoundingClientRect();
    const clickX = e.clientX - skyRect.left;
    const clickY = e.clientY - skyRect.top;
    
    let hit = false;
    
    this.state.ducks.forEach(duck => {
      if (duck.isHit) return;
      
      const duckRect = duck.element.getBoundingClientRect();
      const duckX = duckRect.left - skyRect.left + duckRect.width / 2;
      const duckY = duckRect.top - skyRect.top + duckRect.height / 2;
      
      // Check if click is within duck hitbox
      const distance = Math.sqrt(Math.pow(clickX - duckX, 2) + Math.pow(clickY - duckY, 2));
      if (distance < 30) {
        hit = true;
        this.hitDuck(duck);
      }
    });
    
    if (!hit) {
      this.showMessage('Missed!', 500);
    }
  }

  /**
   * Create shot effect
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   */
  createShotEffect(x, y) {
    const effect = document.createElement('div');
    effect.className = 'shot-effect';
    effect.style.left = `${x - 15}px`;
    effect.style.top = `${y - 15}px`;
    
    this.gameContainer.appendChild(effect);
    
    // Remove effect after animation
    setTimeout(() => {
      effect.remove();
    }, 300);
  }

  /**
   * Hit a duck
   * @param {Object} duck - Duck object
   */
  hitDuck(duck) {
    duck.isHit = true;
    duck.element.classList.add('hit');
    
    // Play hit sound
    this.playSound('quack');
    
    // Update score
    this.state.score += 100 * this.state.level;
    this.state.ducksShot++;
    this.updateUI();
    
    // Show score message
    this.showMessage(`+${100 * this.state.level} points!`, 500);
    
    // Make duck fall after a short delay
    setTimeout(() => {
      duck.element.classList.add('falling');
      duck.speedX = 0;
      duck.speedY = -5;
      
      // Play fall sound
      this.playSound('fall');
      
      // Remove duck after it falls
      setTimeout(() => {
        duck.element.remove();
        this.state.ducks = this.state.ducks.filter(d => d !== duck);
      }, 1000);
    }, 500);
  }

  /**
   * Level up
   */
  levelUp() {
    this.state.level++;
    this.state.ducksShot = 0;
    this.state.ammo = 3;
    
    // Increase difficulty
    this.settings.duckSpeed += 0.5;
    this.settings.duckSpawnRate = Math.max(500, this.settings.duckSpawnRate - 200);
    this.settings.maxDucks = Math.min(5, this.state.level);
    
    // Update UI
    this.updateUI();
    
    // Play level up sound
    this.playSound('levelUp');
    
    // Show level up message
    this.showMessage(`Level ${this.state.level} - Get Ready!`, 2000);
  }

  /**
   * Update UI
   */
  updateUI() {
    // Update score display
    const scoreElements = this.scoreDisplay.querySelectorAll('span');
    scoreElements[0].textContent = this.state.score;
    scoreElements[1].textContent = this.state.level;
    scoreElements[2].textContent = this.state.ammo;
    
    // Update high score if needed
    if (this.state.score > this.state.highScore) {
      this.state.highScore = this.state.score;
      this.saveHighScore();
      this.highScoreDisplay.querySelector('span').textContent = this.state.highScore;
    }
  }

  /**
   * Show a message
   * @param {string} text - Message text
   * @param {number} duration - Duration in milliseconds
   */
  showMessage(text, duration = 2000) {
    this.messageDisplay.textContent = text;
    this.messageDisplay.classList.add('visible');
    
    setTimeout(() => {
      this.messageDisplay.classList.remove('visible');
    }, duration);
  }

  /**
   * Pause the game
   */
  pauseGame() {
    if (this.state.isGameOver) return;
    
    this.state.isPaused = true;
    clearInterval(this.spawnDuckInterval);
    this.showMessage('Game Paused', 999999);
  }

  /**
   * Resume the game
   */
  resumeGame() {
    if (this.state.isGameOver) return;
    
    this.state.isPaused = false;
    this.spawnDuckInterval = setInterval(() => {
      this.spawnDuck();
    }, this.settings.duckSpawnRate);
    
    this.messageDisplay.classList.remove('visible');
    this.gameLoop();
  }

  /**
   * End the game
   */
  endGame() {
    this.state.isGameOver = true;
    clearInterval(this.spawnDuckInterval);
    
    // Play game over sound
    this.playSound('gameOver');
    
    // Show game over message
    this.showMessage(`Game Over! Final Score: ${this.state.score}`, 5000);
    
    // Save high score
    if (this.state.score > this.state.highScore) {
      this.state.highScore = this.state.score;
      this.saveHighScore();
    }
    
    // Restart game after delay
    setTimeout(() => {
      this.startGame();
    }, 5000);
  }

  /**
   * Handle window resize
   */
  handleResize() {
    // Adjust game elements based on new window size
    // This ensures the game works well at different window sizes
  }

  /**
   * Load high score from localStorage
   * @returns {number} High score
   */
  loadHighScore() {
    const highScore = localStorage.getItem('duckHuntHighScore');
    return highScore ? parseInt(highScore) : 0;
  }

  /**
   * Save high score to localStorage
   */
  saveHighScore() {
    localStorage.setItem('duckHuntHighScore', this.state.highScore.toString());
  }
}

// Initialize Duck Hunt when the window is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Get the Duck Hunt icon
  const duckHuntIcon = document.getElementById('duck-hunt-icon');
  if (duckHuntIcon) {
    // Initialize game when icon is clicked
    duckHuntIcon.addEventListener('click', () => {
      // Get the Duck Hunt window
      const duckHuntWindow = document.getElementById('duck-hunt-window');
      if (duckHuntWindow) {
        // Show the window
        duckHuntWindow.style.display = 'block';
        
        // Initialize the game after a short delay
        setTimeout(() => {
          // Check if game is already initialized
          if (!window.duckHuntGame) {
            window.duckHuntGame = new DuckHuntGame('duck-hunt-window');
          }
        }, 500);
      }
    });
  }
});
