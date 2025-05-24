/**
 * NosytOS95 Duck Hunt
 * An enhanced Duck Hunt game for the NosytOS95 interface
 * Features improved graphics, animations, sound effects, and high score tracking
 */

document.addEventListener('DOMContentLoaded', () => {
  // Game variables
  let gameActive = false;
  let score = 0;
  let highScore = 0;
  let round = 1;
  let ducksShot = 0;
  let ducksRequired = 6;
  let lives = 3;
  let soundEnabled = true;
  let ammo = 3;
  let totalShots = 0;
  let accuracy = 0;
  let dogState = 'hidden'; // hidden, pointing, laughing, jumping
  let dogAnimationFrame = 0;
  let dogX = 200;
  let dogY = 250;
  let showingMessage = false;
  let messageText = '';
  let messageTimer = 0;
  
  // Game elements
  let gameCanvas = null;
  let gameContext = null;
  let ducks = [];
  let highScores = [];
  
  // Images
  const images = {
    background: new Image(),
    duckBlue: new Image(),
    duckRed: new Image(),
    duckBlack: new Image(),
    dog: new Image(),
    crosshair: new Image()
  };
  
  // Load images
  images.background.src = '/images/nosytos95/duck-hunt/background.png';
  images.duckBlue.src = '/images/nosytos95/duck-hunt/duck-blue.png';
  images.duckRed.src = '/images/nosytos95/duck-hunt/duck-red.png';
  images.duckBlack.src = '/images/nosytos95/duck-hunt/duck-black.png';
  images.dog.src = '/images/nosytos95/duck-hunt/dog.png';
  images.crosshair.src = '/images/nosytos95/duck-hunt/crosshair.png';
  
  // Sounds
  const sounds = {
    quack: new Audio('/sounds/nosytos95/duck-hunt/quack.mp3'),
    shot: new Audio('/sounds/nosytos95/duck-hunt/shot.mp3'),
    hit: new Audio('/sounds/nosytos95/duck-hunt/hit.mp3'),
    miss: new Audio('/sounds/nosytos95/duck-hunt/miss.mp3'),
    roundClear: new Audio('/sounds/nosytos95/duck-hunt/round-clear.mp3'),
    gameOver: new Audio('/sounds/nosytos95/duck-hunt/game-over.mp3'),
    dogLaugh: new Audio('/sounds/nosytos95/duck-hunt/dog-laugh.mp3'),
    dogBark: new Audio('/sounds/nosytos95/duck-hunt/dog-bark.mp3'),
    reload: new Audio('/sounds/nosytos95/duck-hunt/reload.mp3'),
    emptyGun: new Audio('/sounds/nosytos95/duck-hunt/empty-gun.mp3'),
    duckFall: new Audio('/sounds/nosytos95/duck-hunt/duck-fall.mp3'),
    duckFlap: new Audio('/sounds/nosytos95/duck-hunt/duck-flap.mp3')
  };

  // Play sound
  function playSound(soundName) {
    if (!soundEnabled) return;

    const sound = sounds[soundName];
    if (sound) {
      sound.currentTime = 0;
      sound.play().catch(e => console.log('Error playing sound:', e));
    }
  }

  // Duck class
  class Duck {
    constructor(round) {
      // Position and size
      this.x = Math.random() * 400;
      this.y = Math.random() * 100 + 50;
      this.width = 60;
      this.height = 60;
      
      // Movement
      const baseSpeed = 1 + (round * 0.2);
      this.speedX = (Math.random() * baseSpeed + 1) * (Math.random() < 0.5 ? 1 : -1);
      this.speedY = (Math.random() * baseSpeed + 0.5) * (Math.random() < 0.5 ? 1 : -1);
      
      // State
      this.alive = true;
      this.falling = false;
      this.escaping = false;
      this.escapeTimer = 0;
      this.fallSpeed = 0;
      
      // Animation
      this.frameCount = 0;
      this.currentFrame = 0;
      this.frameDelay = Math.max(3, 8 - round); // Faster animation in higher rounds
      this.flapSound = false;
      
      // Duck type (blue, red, black) - higher rounds have more difficult ducks
      const duckTypes = ['blue', 'red', 'black'];
      const typeIndex = Math.min(Math.floor(Math.random() * (1 + round / 3)), 2);
      this.type = duckTypes[typeIndex];
      
      // Set image based on type
      switch (this.type) {
        case 'blue':
          this.image = images.duckBlue;
          this.points = 100;
          break;
        case 'red':
          this.image = images.duckRed;
          this.points = 200;
          break;
        case 'black':
          this.image = images.duckBlack;
          this.points = 300;
          break;
        default:
          this.image = images.duckBlue;
          this.points = 100;
      }
    }
    
    update() {
      // Play flap sound occasionally
      if (!this.falling && !this.escaping && Math.random() < 0.01 && !this.flapSound) {
        playSound('duckFlap');
        this.flapSound = true;
        setTimeout(() => { this.flapSound = false; }, 1000);
      }
      
      if (this.falling) {
        // Falling duck
        this.fallSpeed += 0.2;
        this.y += this.fallSpeed;
        
        // Remove duck when it falls off screen
        if (this.y > 300) {
          return false;
        }
      } else if (this.escaping) {
        // Escaping duck
        this.escapeTimer++;
        this.speedY = -3 - (round * 0.2);
        this.y += this.speedY;
        
        // Remove duck when it flies off screen
        if (this.y < -this.height) {
          return false;
        }
      } else {
        // Normal movement
        this.x += this.speedX;
        this.y += this.speedY;
        
        // Bounce off walls
        if (this.x < 0 || this.x > 400 - this.width) {
          this.speedX *= -1;
        }
        
        if (this.y < 50 || this.y > 200) {
          this.speedY *= -1;
        }
        
        // Random direction changes
        if (Math.random() < 0.01) {
          this.speedY *= -1;
        }
        
        // Escape after some time
        if (Math.random() < 0.002 * round) {
          this.escaping = true;
          playSound('quack');
        }
      }
      
      // Animation
      this.frameCount++;
      if (this.frameCount >= this.frameDelay) {
        this.frameCount = 0;
        
        if (this.falling) {
          // No animation when falling
          this.currentFrame = 0;
        } else {
          // Cycle through frames
          this.currentFrame = (this.currentFrame + 1) % 3;
        }
      }
      
      return true; // Keep duck
    }
    
    draw(context) {
      if (!this.alive) return;
      
      // Frame size in sprite sheet
      const frameWidth = 60;
      const frameHeight = 60;
      
      // Source coordinates in sprite sheet
      let frameX = this.currentFrame * frameWidth;
      let frameY = 0;
      
      // Different row for different states
      if (this.falling) {
        frameY = frameHeight * 2; // Third row for falling
      } else if (this.escaping) {
        frameY = frameHeight; // Second row for escaping
      } else {
        // First row for normal flight, flipped based on direction
        frameY = this.speedX > 0 ? 0 : frameHeight * 3; // Fourth row for flying left
      }
      
      // Draw duck
      context.drawImage(
        this.image,
        frameX, frameY, frameWidth, frameHeight,
        this.x, this.y, this.width, this.height
      );
    }
    
    hit(x, y) {
      if (!this.alive || this.falling) return false;
      
      // Check if shot hit duck
      const hitbox = {
        x: this.x + 10,
        y: this.y + 10,
        width: this.width - 20,
        height: this.height - 20
      };
      
      return (
        x >= hitbox.x && x <= hitbox.x + hitbox.width &&
        y >= hitbox.y && y <= hitbox.y + hitbox.height
      );
    }
  }
