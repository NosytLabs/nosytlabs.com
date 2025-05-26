/**
 * Duck Hunt Sprite Sheet Generator
 * 
 * This script generates sprite sheets for the Duck Hunt game.
 * It creates sprite sheets for blue, red, and black ducks in different states
 * (flying, hit, falling) and for the dog (sniffing, jumping, catching, laughing).
 * 
 * The sprite sheets are saved in the public/images/win95/duck/ directory.
 */

// Configuration
const config = {
  outputDir: './public/images/win95/duck/',
  frameSize: 64,
  duckColors: ['blue', 'red', 'black'],
  duckStates: {
    flying: { frames: 3, frameSize: 64 },
    hit: { frames: 1, frameSize: 64 },
    falling: { frames: 2, frameSize: 64 }
  },
  dogStates: {
    sniff: { frames: 4, frameSize: 128 },
    jump: { frames: 3, frameSize: 128 },
    catch: { frames: 1, frameSize: 128 },
    laugh: { frames: 2, frameSize: 128 }
  }
};

// Canvas setup
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');

/**
 * Generate a duck sprite sheet
 * @param {string} color - Duck color (blue, red, black)
 * @param {string} state - Duck state (flying, hit, falling)
 */
function generateDuckSpriteSheet(color, state) {
  const { frames, frameSize } = config.duckStates[state];
  
  // Set canvas size
  canvas.width = frameSize * frames;
  canvas.height = frameSize;
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw frames
  for (let i = 0; i < frames; i++) {
    // Draw duck body
    ctx.save();
    ctx.translate(frameSize * i + frameSize / 2, frameSize / 2);
    
    // Draw different frames based on state
    if (state === 'flying') {
      drawFlyingDuck(color, i);
    } else if (state === 'hit') {
      drawHitDuck(color);
    } else if (state === 'falling') {
      drawFallingDuck(color, i);
    }
    
    ctx.restore();
  }
  
  // Save sprite sheet
  saveCanvas(`${color}-duck-${state}.png`);
}

/**
 * Generate a dog sprite sheet
 * @param {string} state - Dog state (sniff, jump, catch, laugh)
 */
function generateDogSpriteSheet(state) {
  const { frames, frameSize } = config.dogStates[state];
  
  // Set canvas size
  canvas.width = frameSize * frames;
  canvas.height = frameSize;
  
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // Draw frames
  for (let i = 0; i < frames; i++) {
    // Draw dog
    ctx.save();
    ctx.translate(frameSize * i + frameSize / 2, frameSize / 2);
    
    // Draw different frames based on state
    if (state === 'sniff') {
      drawSniffingDog(i);
    } else if (state === 'jump') {
      drawJumpingDog(i);
    } else if (state === 'catch') {
      drawCatchingDog();
    } else if (state === 'laugh') {
      drawLaughingDog(i);
    }
    
    ctx.restore();
  }
  
  // Save sprite sheet
  saveCanvas(`dog-${state}.png`);
}

/**
 * Draw a flying duck
 * @param {string} color - Duck color
 * @param {number} frame - Frame index
 */
function drawFlyingDuck(color, frame) {
  // Set color
  const bodyColor = getDuckColor(color);
  const wingColor = getDuckWingColor(color);
  
  // Draw body
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.ellipse(0, 0, 20, 15, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw head
  ctx.beginPath();
  ctx.ellipse(15, -5, 10, 8, 0.5, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw beak
  ctx.fillStyle = '#FF9900';
  ctx.beginPath();
  ctx.moveTo(25, -5);
  ctx.lineTo(32, -3);
  ctx.lineTo(25, 0);
  ctx.closePath();
  ctx.fill();
  
  // Draw eye
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(22, -7, 2, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw wings based on frame
  ctx.fillStyle = wingColor;
  if (frame === 0) {
    // Wings down
    ctx.beginPath();
    ctx.moveTo(-5, 0);
    ctx.lineTo(-15, 15);
    ctx.lineTo(5, 15);
    ctx.closePath();
    ctx.fill();
  } else if (frame === 1) {
    // Wings middle
    ctx.beginPath();
    ctx.moveTo(-5, 0);
    ctx.lineTo(-15, 5);
    ctx.lineTo(5, 5);
    ctx.closePath();
    ctx.fill();
  } else {
    // Wings up
    ctx.beginPath();
    ctx.moveTo(-5, 0);
    ctx.lineTo(-15, -10);
    ctx.lineTo(5, -10);
    ctx.closePath();
    ctx.fill();
  }
}

/**
 * Draw a hit duck
 * @param {string} color - Duck color
 */
function drawHitDuck(color) {
  // Set color
  const bodyColor = getDuckColor(color);
  
  // Draw body (upside down)
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.ellipse(0, 0, 20, 15, Math.PI, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw head
  ctx.beginPath();
  ctx.ellipse(-15, 5, 10, 8, -0.5, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw beak
  ctx.fillStyle = '#FF9900';
  ctx.beginPath();
  ctx.moveTo(-25, 5);
  ctx.lineTo(-32, 3);
  ctx.lineTo(-25, 0);
  ctx.closePath();
  ctx.fill();
  
  // Draw X eyes
  ctx.strokeStyle = '#FF0000';
  ctx.lineWidth = 2;
  
  // Left X
  ctx.beginPath();
  ctx.moveTo(-20, 2);
  ctx.lineTo(-24, 6);
  ctx.moveTo(-20, 6);
  ctx.lineTo(-24, 2);
  ctx.stroke();
}

/**
 * Draw a falling duck
 * @param {string} color - Duck color
 * @param {number} frame - Frame index
 */
function drawFallingDuck(color, frame) {
  // Set color
  const bodyColor = getDuckColor(color);
  
  // Draw body (upside down)
  ctx.fillStyle = bodyColor;
  ctx.beginPath();
  ctx.ellipse(0, 0, 20, 15, Math.PI, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw head
  ctx.beginPath();
  ctx.ellipse(-15, 5, 10, 8, -0.5, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw beak
  ctx.fillStyle = '#FF9900';
  ctx.beginPath();
  ctx.moveTo(-25, 5);
  ctx.lineTo(-32, 3);
  ctx.lineTo(-25, 0);
  ctx.closePath();
  ctx.fill();
  
  // Draw X eyes
  ctx.strokeStyle = '#FF0000';
  ctx.lineWidth = 2;
  
  // Left X
  ctx.beginPath();
  ctx.moveTo(-20, 2);
  ctx.lineTo(-24, 6);
  ctx.moveTo(-20, 6);
  ctx.lineTo(-24, 2);
  ctx.stroke();
  
  // Draw wings based on frame (flapping while falling)
  ctx.fillStyle = getDuckWingColor(color);
  if (frame === 0) {
    // Wings out
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(15, -10);
    ctx.lineTo(15, 10);
    ctx.closePath();
    ctx.fill();
  } else {
    // Wings in
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(10, -5);
    ctx.lineTo(10, 5);
    ctx.closePath();
    ctx.fill();
  }
}

/**
 * Draw a sniffing dog
 * @param {number} frame - Frame index
 */
function drawSniffingDog(frame) {
  // Draw body
  ctx.fillStyle = '#8B4513';
  ctx.beginPath();
  ctx.ellipse(0, 20, 30, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw head
  ctx.beginPath();
  ctx.ellipse(30, 0, 20, 15, 0.3, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw ears
  ctx.beginPath();
  ctx.ellipse(20, -15, 10, 5, 0.3, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw nose
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.ellipse(50, 0, 5, 3, 0.3, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw eye
  ctx.beginPath();
  ctx.arc(35, -5, 3, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw legs
  ctx.fillStyle = '#8B4513';
  
  // Front legs
  ctx.beginPath();
  ctx.rect(15, 35, 8, 15);
  ctx.fill();
  
  ctx.beginPath();
  ctx.rect(-15, 35, 8, 15);
  ctx.fill();
  
  // Back legs
  ctx.beginPath();
  ctx.rect(-25, 35, 8, 15);
  ctx.fill();
  
  // Draw tail
  ctx.beginPath();
  ctx.moveTo(-30, 20);
  ctx.lineTo(-40, 10);
  ctx.lineTo(-35, 5);
  ctx.closePath();
  ctx.fill();
  
  // Draw sniffing animation based on frame
  if (frame % 2 === 0) {
    // Head down
    ctx.fillStyle = '#8B4513';
    ctx.beginPath();
    ctx.ellipse(50, 10, 5, 3, 0.3, 0, Math.PI * 2);
    ctx.fill();
  }
}

/**
 * Draw a jumping dog
 * @param {number} frame - Frame index
 */
function drawJumpingDog(frame) {
  // Draw based on frame
  if (frame === 0) {
    // Crouching
    drawCrouchingDog();
  } else if (frame === 1) {
    // Mid-jump
    drawMidJumpDog();
  } else {
    // Full jump
    drawFullJumpDog();
  }
}

/**
 * Draw a crouching dog
 */
function drawCrouchingDog() {
  // Draw body (crouched)
  ctx.fillStyle = '#8B4513';
  ctx.beginPath();
  ctx.ellipse(0, 30, 30, 15, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw head (looking up)
  ctx.beginPath();
  ctx.ellipse(20, 10, 20, 15, 0.5, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw ears
  ctx.beginPath();
  ctx.ellipse(10, -5, 10, 5, 0.5, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw nose
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.ellipse(35, 15, 5, 3, 0.5, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw eye
  ctx.beginPath();
  ctx.arc(25, 5, 3, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw legs (bent)
  ctx.fillStyle = '#8B4513';
  
  // Front legs
  ctx.beginPath();
  ctx.rect(15, 40, 8, 10);
  ctx.fill();
  
  ctx.beginPath();
  ctx.rect(-15, 40, 8, 10);
  ctx.fill();
  
  // Back legs
  ctx.beginPath();
  ctx.rect(-25, 40, 8, 10);
  ctx.fill();
}

/**
 * Draw a mid-jump dog
 */
function drawMidJumpDog() {
  // Draw body (mid-jump)
  ctx.fillStyle = '#8B4513';
  ctx.beginPath();
  ctx.ellipse(0, 10, 30, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw head (looking up)
  ctx.beginPath();
  ctx.ellipse(30, -10, 20, 15, 0.3, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw ears
  ctx.beginPath();
  ctx.ellipse(20, -25, 10, 5, 0.3, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw nose
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.ellipse(50, -10, 5, 3, 0.3, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw eye
  ctx.beginPath();
  ctx.arc(35, -15, 3, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw legs (extended)
  ctx.fillStyle = '#8B4513';
  
  // Front legs
  ctx.beginPath();
  ctx.rect(15, 25, 8, 15);
  ctx.fill();
  
  ctx.beginPath();
  ctx.rect(-15, 25, 8, 15);
  ctx.fill();
  
  // Back legs
  ctx.beginPath();
  ctx.rect(-25, 25, 8, 15);
  ctx.fill();
}

/**
 * Draw a full jump dog
 */
function drawFullJumpDog() {
  // Draw body (full jump)
  ctx.fillStyle = '#8B4513';
  ctx.beginPath();
  ctx.ellipse(0, -10, 30, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw head (looking up)
  ctx.beginPath();
  ctx.ellipse(30, -30, 20, 15, 0.3, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw ears
  ctx.beginPath();
  ctx.ellipse(20, -45, 10, 5, 0.3, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw nose
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.ellipse(50, -30, 5, 3, 0.3, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw eye
  ctx.beginPath();
  ctx.arc(35, -35, 3, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw legs (tucked)
  ctx.fillStyle = '#8B4513';
  
  // Front legs
  ctx.beginPath();
  ctx.rect(15, 5, 8, 10);
  ctx.fill();
  
  ctx.beginPath();
  ctx.rect(-15, 5, 8, 10);
  ctx.fill();
  
  // Back legs
  ctx.beginPath();
  ctx.rect(-25, 5, 8, 10);
  ctx.fill();
}

/**
 * Draw a catching dog
 */
function drawCatchingDog() {
  // Draw body
  ctx.fillStyle = '#8B4513';
  ctx.beginPath();
  ctx.ellipse(0, 0, 30, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw head (looking up with open mouth)
  ctx.beginPath();
  ctx.ellipse(30, -20, 20, 15, 0.3, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw ears
  ctx.beginPath();
  ctx.ellipse(20, -35, 10, 5, 0.3, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw open mouth
  ctx.fillStyle = '#FF9999';
  ctx.beginPath();
  ctx.ellipse(45, -15, 10, 8, 0.3, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw nose
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.ellipse(50, -25, 5, 3, 0.3, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw eye
  ctx.beginPath();
  ctx.arc(35, -25, 3, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw legs (standing)
  ctx.fillStyle = '#8B4513';
  
  // Front legs
  ctx.beginPath();
  ctx.rect(15, 15, 8, 15);
  ctx.fill();
  
  ctx.beginPath();
  ctx.rect(-15, 15, 8, 15);
  ctx.fill();
  
  // Back legs
  ctx.beginPath();
  ctx.rect(-25, 15, 8, 15);
  ctx.fill();
}

/**
 * Draw a laughing dog
 * @param {number} frame - Frame index
 */
function drawLaughingDog(frame) {
  // Draw body
  ctx.fillStyle = '#8B4513';
  ctx.beginPath();
  ctx.ellipse(0, 20, 30, 20, 0, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw head
  ctx.beginPath();
  ctx.ellipse(30, 0, 20, 15, 0.3, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw ears
  ctx.beginPath();
  ctx.ellipse(20, -15, 10, 5, 0.3, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw laughing mouth based on frame
  if (frame === 0) {
    // Mouth closed
    ctx.fillStyle = '#FF9999';
    ctx.beginPath();
    ctx.ellipse(45, 5, 10, 5, 0.3, 0, Math.PI);
    ctx.fill();
  } else {
    // Mouth open
    ctx.fillStyle = '#FF9999';
    ctx.beginPath();
    ctx.ellipse(45, 5, 10, 8, 0.3, 0, Math.PI);
    ctx.fill();
    
    // Tongue
    ctx.fillStyle = '#FF0000';
    ctx.beginPath();
    ctx.ellipse(45, 10, 5, 3, 0.3, 0, Math.PI);
    ctx.fill();
  }
  
  // Draw nose
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.ellipse(50, 0, 5, 3, 0.3, 0, Math.PI * 2);
  ctx.fill();
  
  // Draw eyes (laughing)
  ctx.beginPath();
  ctx.moveTo(30, -5);
  ctx.lineTo(40, -10);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.moveTo(30, -10);
  ctx.lineTo(40, -5);
  ctx.stroke();
  
  // Draw legs
  ctx.fillStyle = '#8B4513';
  
  // Front legs
  ctx.beginPath();
  ctx.rect(15, 35, 8, 15);
  ctx.fill();
  
  ctx.beginPath();
  ctx.rect(-15, 35, 8, 15);
  ctx.fill();
  
  // Back legs
  ctx.beginPath();
  ctx.rect(-25, 35, 8, 15);
  ctx.fill();
  
  // Draw tail (wagging)
  ctx.beginPath();
  if (frame === 0) {
    ctx.moveTo(-30, 20);
    ctx.lineTo(-40, 10);
    ctx.lineTo(-35, 5);
  } else {
    ctx.moveTo(-30, 20);
    ctx.lineTo(-40, 30);
    ctx.lineTo(-35, 35);
  }
  ctx.closePath();
  ctx.fill();
}

/**
 * Get duck color based on color name
 * @param {string} color - Duck color name
 * @returns {string} - CSS color
 */
function getDuckColor(color) {
  switch (color) {
    case 'blue':
      return '#3366CC';
    case 'red':
      return '#CC3333';
    case 'black':
      return '#333333';
    default:
      return '#3366CC';
  }
}

/**
 * Get duck wing color based on color name
 * @param {string} color - Duck color name
 * @returns {string} - CSS color
 */
function getDuckWingColor(color) {
  switch (color) {
    case 'blue':
      return '#6699FF';
    case 'red':
      return '#FF6666';
    case 'black':
      return '#666666';
    default:
      return '#6699FF';
  }
}

/**
 * Save canvas as PNG
 * @param {string} filename - Output filename
 */
function saveCanvas(filename) {
  // In a browser environment, this would save the canvas as a PNG
  // For Node.js, we would use the fs module to save the file
  
  // For demonstration purposes, we'll log the output path
  console.log(`Saving sprite sheet: ${config.outputDir}${filename}`);
  
  // In a real implementation, we would save the canvas data to a file
  // For example, using the canvas.toDataURL() method in a browser
  // or the canvas.createPNGStream() method in Node.js
}

/**
 * Generate all sprite sheets
 */
function generateAllSpriteSheets() {
  // Generate duck sprite sheets
  for (const color of config.duckColors) {
    for (const state in config.duckStates) {
      generateDuckSpriteSheet(color, state);
    }
  }
  
  // Generate dog sprite sheets
  for (const state in config.dogStates) {
    generateDogSpriteSheet(state);
  }
  
  console.log('All sprite sheets generated successfully!');
}

// Run the generator
generateAllSpriteSheets();
