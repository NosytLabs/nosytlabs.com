/**
 * Enhanced Duck Hunt Game Component for NosytOS95
 * A retro-style duck hunting game with sound effects and animations
 */

class DuckHuntGame {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) {
      console.error(`Container with ID "${containerId}" not found.`);
      return;
    }
    
    // Game state
    this.isRunning = false;
    this.score = 0;
    this.level = 1;
    this.ducksShot = 0;
    this.totalDucks = 0;
    this.ammo = 3;
    this.ducks = [];
    this.maxDucks = 3;
    this.duckSpeed = 3;
    this.spawnRate = 2000;
    this.spawnTimer = null;
    
    // Game elements
    this.gameCanvas = null;
    this.ctx = null;
    this.width = 640;
    this.height = 480;
    this.background = new Image();
    this.crosshair = new Image();
    this.duckImage = new Image();
    this.duckHitImage = new Image();
    
    // Audio elements
    this.quackSound = new Audio('/sounds/quack.mp3');
    this.shotSound = new Audio('/sounds/funny-quack.mp3');
    this.reloadSound = new Audio('/sounds/rubber-duck.mp3');
    this.duckFallSound = new Audio('/sounds/duck-scream.mp3');
    
    // Initialize the game
    this.init();
  }

  init() {
    // Create game canvas
    this.createGameCanvas();
    
    // Load game assets
    this.loadAssets();
    
    // Set up event listeners
    this.setupEventListeners();
    
    // Create game UI
    this.createGameUI();
  }

  createGameCanvas() {
    // Create canvas element
    this.gameCanvas = document.createElement('canvas');
    this.gameCanvas.width = this.width;
    this.gameCanvas.height = this.height;
    this.gameCanvas.className = 'duck-hunt-canvas';
    this.container.appendChild(this.gameCanvas);
    
    // Get canvas context
    this.ctx = this.gameCanvas.getContext('2d');
  }

  loadAssets() {
    // Load images
    this.background.src = '/images/win95/duck-hunt-bg.png';
    this.background.onload = () => {
      // Use a default background if the image fails to load
      if (this.background.width === 0) {
        this.ctx.fillStyle = '#87CEEB';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Draw ground
        this.ctx.fillStyle = '#228B22';
        this.ctx.fillRect(0, this.height - 100, this.width, 100);
      } else {
        this.ctx.drawImage(this.background, 0, 0, this.width, this.height);
      }
    };
    
    this.crosshair.src = '/images/win95/crosshair.png';
    this.duckImage.src = '/images/win95/duck.png';
    this.duckHitImage.src = '/images/win95/duck-hit.png';
    
    // Set default images if loading fails
    this.crosshair.onerror = () => {
      this.crosshair = this.createDefaultCrosshair();
    };
    
    this.duckImage.onerror = () => {
      this.duckImage = this.createDefaultDuck();
    };
    
    this.duckHitImage.onerror = () => {
      this.duckHitImage = this.createDefaultDuckHit();
    };
  }

  createDefaultCrosshair() {
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    
    // Draw crosshair
    ctx.strokeStyle = 'red';
    ctx.lineWidth = 2;
    
    // Horizontal line
    ctx.beginPath();
    ctx.moveTo(0, 16);
    ctx.lineTo(32, 16);
    ctx.stroke();
    
    // Vertical line
    ctx.beginPath();
    ctx.moveTo(16, 0);
    ctx.lineTo(16, 32);
    ctx.stroke();
    
    // Circle
    ctx.beginPath();
    ctx.arc(16, 16, 8, 0, Math.PI * 2);
    ctx.stroke();
    
    return canvas;
  }

  createDefaultDuck() {
    const canvas = document.createElement('canvas');
    canvas.width = 40;
    canvas.height = 40;
    const ctx = canvas.getContext('2d');
    
    // Draw duck body
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.ellipse(20, 20, 15, 10, 0, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw duck head
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(30, 15, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw duck eye
    ctx.fillStyle = 'black';
    ctx.beginPath();
    ctx.arc(33, 13, 2, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw duck beak
    ctx.fillStyle = 'orange';
    ctx.beginPath();
    ctx.moveTo(38, 15);
    ctx.lineTo(45, 13);
    ctx.lineTo(38, 18);
    ctx.fill();
    
    // Draw duck wing
    ctx.fillStyle = '#DAA520';
    ctx.beginPath();
    ctx.ellipse(15, 20, 10, 5, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
    
    return canvas;
  }

  createDefaultDuckHit() {
    const canvas = document.createElement('canvas');
    canvas.width = 40;
    canvas.height = 40;
    const ctx = canvas.getContext('2d');
    
    // Draw hit duck (upside down)
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.ellipse(20, 20, 15, 10, Math.PI, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw duck head
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(10, 25, 8, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw duck eye (X shape)
    ctx.strokeStyle = 'black';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(7, 22);
    ctx.lineTo(13, 28);
    ctx.moveTo(13, 22);
    ctx.lineTo(7, 28);
    ctx.stroke();
    
    // Draw duck beak
    ctx.fillStyle = 'orange';
    ctx.beginPath();
    ctx.moveTo(2, 25);
    ctx.lineTo(5, 22);
    ctx.lineTo(5, 28);
    ctx.fill();
    
    return canvas;
  }

  setupEventListeners() {
    // Mouse move event for crosshair
    this.gameCanvas.addEventListener('mousemove', (e) => {
      const rect = this.gameCanvas.getBoundingClientRect();
      this.mouseX = e.clientX - rect.left;
      this.mouseY = e.clientY - rect.top;
    });
    
    // Click event for shooting
    this.gameCanvas.addEventListener('click', (e) => {
      if (!this.isRunning) {
        this.startGame();
        return;
      }
      
      if (this.ammo > 0) {
        this.shoot();
      } else {
        this.reload();
      }
    });
    
    // Key events
    document.addEventListener('keydown', (e) => {
      if (e.code === 'Space' && this.isRunning) {
        if (this.ammo > 0) {
          this.shoot();
        } else {
          this.reload();
        }
      }
      
      if (e.code === 'KeyR' && this.isRunning) {
        this.reload();
      }
      
      if (e.code === 'Escape') {
        this.togglePause();
      }
    });
  }

  createGameUI() {
    // Create UI container
    const uiContainer = document.createElement('div');
    uiContainer.className = 'duck-hunt-ui';
    this.container.appendChild(uiContainer);
    
    // Create score display
    this.scoreDisplay = document.createElement('div');
    this.scoreDisplay.className = 'duck-hunt-score';
    this.scoreDisplay.textContent = `Score: ${this.score}`;
    uiContainer.appendChild(this.scoreDisplay);
    
    // Create ammo display
    this.ammoDisplay = document.createElement('div');
    this.ammoDisplay.className = 'duck-hunt-ammo';
    this.ammoDisplay.textContent = `Ammo: ${this.ammo}`;
    uiContainer.appendChild(this.ammoDisplay);
    
    // Create level display
    this.levelDisplay = document.createElement('div');
    this.levelDisplay.className = 'duck-hunt-level';
    this.levelDisplay.textContent = `Level: ${this.level}`;
    uiContainer.appendChild(this.levelDisplay);
    
    // Create start screen
    this.startScreen = document.createElement('div');
    this.startScreen.className = 'duck-hunt-start-screen';
    this.startScreen.innerHTML = '<h2>Duck Hunt</h2><p>Click to start</p>';
    this.container.appendChild(this.startScreen);
    
    // Create pause screen
    this.pauseScreen = document.createElement('div');
    this.pauseScreen.className = 'duck-hunt-pause-screen';
    this.pauseScreen.innerHTML = '<h2>Paused</h2><p>Press ESC to resume</p>';
    this.pauseScreen.style.display = 'none';
    this.container.appendChild(this.pauseScreen);
  }

  startGame() {
    this.isRunning = true;
    this.score = 0;
    this.level = 1;
    this.ducksShot = 0;
    this.totalDucks = 0;
    this.ammo = 3;
    this.ducks = [];
    
    // Hide start screen
    this.startScreen.style.display = 'none';
    
    // Update UI
    this.updateUI();
    
    // Start game loop
    this.gameLoop();
    
    // Start spawning ducks
    this.startSpawning();
  }

  gameLoop() {
    if (!this.isRunning) return;
    
    // Clear canvas
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    // Draw background
    if (this.background.complete && this.background.width > 0) {
      this.ctx.drawImage(this.background, 0, 0, this.width, this.height);
    } else {
      // Draw default background
      this.ctx.fillStyle = '#87CEEB';
      this.ctx.fillRect(0, 0, this.width, this.height);
      
      // Draw ground
      this.ctx.fillStyle = '#228B22';
      this.ctx.fillRect(0, this.height - 100, this.width, 100);
    }
    
    // Update and draw ducks
    this.updateDucks();
    
    // Draw crosshair
    if (this.crosshair.complete && this.crosshair.width > 0) {
      this.ctx.drawImage(
        this.crosshair,
        this.mouseX - this.crosshair.width / 2,
        this.mouseY - this.crosshair.height / 2
      );
    } else {
      // Draw default crosshair
      this.ctx.strokeStyle = 'red';
      this.ctx.lineWidth = 2;
      
      // Horizontal line
      this.ctx.beginPath();
      this.ctx.moveTo(this.mouseX - 15, this.mouseY);
      this.ctx.lineTo(this.mouseX + 15, this.mouseY);
      this.ctx.stroke();
      
      // Vertical line
      this.ctx.beginPath();
      this.ctx.moveTo(this.mouseX, this.mouseY - 15);
      this.ctx.lineTo(this.mouseX, this.mouseY + 15);
      this.ctx.stroke();
      
      // Circle
      this.ctx.beginPath();
      this.ctx.arc(this.mouseX, this.mouseY, 8, 0, Math.PI * 2);
      this.ctx.stroke();
    }
    
    // Request next frame
    requestAnimationFrame(() => this.gameLoop());
  }

  updateDucks() {
    for (let i = 0; i < this.ducks.length; i++) {
      const duck = this.ducks[i];
      
      // Update duck position
      duck.x += duck.speedX;
      duck.y += duck.speedY;
      
      // Check boundaries
      if (duck.x < 0 || duck.x > this.width) {
        duck.speedX *= -1;
      }
      
      if (duck.y < 0 || duck.y > this.height - 100) {
        duck.speedY *= -1;
      }
      
      // Draw duck
      if (duck.hit) {
        // Draw hit duck
        if (this.duckHitImage.complete && this.duckHitImage.width > 0) {
          this.ctx.drawImage(this.duckHitImage, duck.x - 20, duck.y - 20, 40, 40);
        } else {
          // Draw default hit duck
          this.ctx.fillStyle = '#FFD700';
          this.ctx.beginPath();
          this.ctx.ellipse(duck.x, duck.y, 15, 10, Math.PI, 0, Math.PI * 2);
          this.ctx.fill();
        }
        
        // Update falling duck
        duck.speedY += 0.2;
        duck.speedX *= 0.95;
        
        // Remove duck if it falls off screen
        if (duck.y > this.height) {
          this.ducks.splice(i, 1);
          i--;
        }
      } else {
        // Draw normal duck
        if (this.duckImage.complete && this.duckImage.width > 0) {
          // Flip duck image based on direction
          this.ctx.save();
          this.ctx.translate(duck.x, duck.y);
          if (duck.speedX < 0) {
            this.ctx.scale(-1, 1);
          }
          this.ctx.drawImage(this.duckImage, -20, -20, 40, 40);
          this.ctx.restore();
        } else {
          // Draw default duck
          this.ctx.fillStyle = '#FFD700';
          this.ctx.beginPath();
          this.ctx.ellipse(duck.x, duck.y, 15, 10, 0, 0, Math.PI * 2);
          this.ctx.fill();
        }
      }
    }
  }

  spawnDuck() {
    if (this.ducks.length >= this.maxDucks) return;
    
    // Create new duck
    const duck = {
      x: Math.random() * this.width,
      y: this.height - 50,
      speedX: (Math.random() - 0.5) * this.duckSpeed * 2,
      speedY: -Math.random() * this.duckSpeed - 1,
      hit: false
    };
    
    // Add duck to array
    this.ducks.push(duck);
    this.totalDucks++;
    
    // Play quack sound
    this.quackSound.currentTime = 0;
    this.quackSound.play().catch(e => console.log('Audio play error:', e));
    
    // Check for level up
    if (this.totalDucks % 10 === 0) {
      this.levelUp();
    }
  }

  startSpawning() {
    // Clear existing timer
    if (this.spawnTimer) {
      clearInterval(this.spawnTimer);
    }
    
    // Start new timer
    this.spawnTimer = setInterval(() => {
      if (this.isRunning) {
        this.spawnDuck();
      }
    }, this.spawnRate);
  }

  shoot() {
    if (this.ammo <= 0) return;
    
    // Decrease ammo
    this.ammo--;
    
    // Play shot sound
    this.shotSound.currentTime = 0;
    this.shotSound.play().catch(e => console.log('Audio play error:', e));
    
    // Check for hit
    let hit = false;
    for (const duck of this.ducks) {
      if (!duck.hit && this.isPointInDuck(this.mouseX, this.mouseY, duck)) {
        duck.hit = true;
        duck.speedY = 1;
        duck.speedX /= 2;
        
        // Increase score
        this.score += 100 * this.level;
        this.ducksShot++;
        
        // Play duck fall sound
        this.duckFallSound.currentTime = 0;
        this.duckFallSound.play().catch(e => console.log('Audio play error:', e));
        
        hit = true;
        break;
      }
    }
    
    // Update UI
    this.updateUI();
    
    // Auto reload if out of ammo
    if (this.ammo === 0) {
      setTimeout(() => this.reload(), 1000);
    }
  }

  reload() {
    // Play reload sound
    this.reloadSound.currentTime = 0;
    this.reloadSound.play().catch(e => console.log('Audio play error:', e));
    
    // Reset ammo
    this.ammo = 3;
    
    // Update UI
    this.updateUI();
  }

  isPointInDuck(x, y, duck) {
    // Simple circle collision detection
    const dx = x - duck.x;
    const dy = y - duck.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    return distance < 20;
  }

  levelUp() {
    this.level++;
    this.duckSpeed += 0.5;
    this.spawnRate = Math.max(500, this.spawnRate - 200);
    
    // Update spawn rate
    this.startSpawning();
    
    // Update UI
    this.updateUI();
    
    // Show level up message
    this.showMessage(`Level ${this.level}!`);
  }

  showMessage(text) {
    const message = document.createElement('div');
    message.className = 'duck-hunt-message';
    message.textContent = text;
    this.container.appendChild(message);
    
    // Remove message after animation
    setTimeout(() => {
      message.remove();
    }, 2000);
  }

  updateUI() {
    // Update score display
    this.scoreDisplay.textContent = `Score: ${this.score}`;
    
    // Update ammo display
    this.ammoDisplay.textContent = `Ammo: ${this.ammo}`;
    
    // Update level display
    this.levelDisplay.textContent = `Level: ${this.level}`;
  }

  togglePause() {
    this.isRunning = !this.isRunning;
    
    if (this.isRunning) {
      // Resume game
      this.pauseScreen.style.display = 'none';
      this.gameLoop();
      this.startSpawning();
    } else {
      // Pause game
      this.pauseScreen.style.display = 'flex';
      if (this.spawnTimer) {
        clearInterval(this.spawnTimer);
      }
    }
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = DuckHuntGame;
}
