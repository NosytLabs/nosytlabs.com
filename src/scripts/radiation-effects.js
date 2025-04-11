// Radiation Effects System

// Configurable parameters
const MAX_RADIATION = 100;
const CLICK_MIN_INTERVAL = 1000; // ms (low radiation)
const CLICK_MAX_INTERVAL = 50;   // ms (high radiation)
const DISTORTION_THRESHOLD = 30; // radiation level to start distortion

let radiationLevel = 0; // current radiation level (0-100)
let accumulatedDose = 0; // total accumulated dose
let geigerAudio = new Audio('/sounds/geiger-click.mp3'); // Placeholder, replace with actual Geiger click sound file
let geigerIntervalId = null;

// Initialize UI elements
const statusPanel = document.createElement('div');
statusPanel.id = 'radiation-status';
statusPanel.style.position = 'fixed';
statusPanel.style.bottom = '10px';
statusPanel.style.right = '10px';
statusPanel.style.background = 'rgba(0,0,0,0.7)';
statusPanel.style.color = '#0f0';
statusPanel.style.padding = '8px';
statusPanel.style.fontFamily = 'monospace';
statusPanel.style.zIndex = '9999';
statusPanel.innerHTML = `
  <div>Radiation: <span id="rad-level">0</span></div>
  <div>Dose: <span id="dose-total">0</span></div>
`;
document.body.appendChild(statusPanel);

// Update UI panel
function updateStatusPanel() {
  document.getElementById('rad-level').innerText = radiationLevel.toFixed(1);
  document.getElementById('dose-total').innerText = accumulatedDose.toFixed(1);
}

// Play Geiger click sound
function playGeigerClick() {
  try {
    geigerAudio.currentTime = 0;
    geigerAudio.play();
  } catch (e) {
    // Ignore playback errors
  }
}

// Schedule Geiger clicks based on radiation level
function scheduleGeigerClicks() {
  if (geigerIntervalId) clearTimeout(geigerIntervalId);

  if (radiationLevel <= 0) return;

  const interval = CLICK_MIN_INTERVAL - ((CLICK_MIN_INTERVAL - CLICK_MAX_INTERVAL) * (radiationLevel / MAX_RADIATION));
  geigerIntervalId = setTimeout(() => {
    playGeigerClick();
    scheduleGeigerClicks();
  }, interval);
}

// Apply or remove screen distortion
function updateScreenDistortion() {
  if (radiationLevel >= DISTORTION_THRESHOLD) {
    document.body.style.filter = `blur(${(radiationLevel - DISTORTION_THRESHOLD) / 20}px) contrast(1.2) saturate(1.5)`;
  } else {
    document.body.style.filter = '';
  }
}

// Main update loop
function updateRadiationEffects() {
  accumulatedDose += radiationLevel * 0.01; // accumulate dose over time
  updateStatusPanel();
  updateScreenDistortion();
  requestAnimationFrame(updateRadiationEffects);
}

// Set radiation level externally
window.setRadiationLevel = function(level) {
  radiationLevel = Math.max(0, Math.min(MAX_RADIATION, level));
  scheduleGeigerClicks();
};

// Start loop
updateRadiationEffects();

// Calculate radiation based on zones and player position
function updateRadiationFromZones() {
  if (typeof window.getRadiationZones !== 'function') return;
  const zones = window.getRadiationZones();
  // Example player position (center of canvas)
  const playerX = 400;
  const playerY = 300;
  let totalRadiation = 0;
  zones.forEach(zone => {
    if (!zone.active) return;
    let inside = false;
    let dist = 0;
    if (zone.shape === 'circle') {
      dist = Math.hypot(playerX - zone.position.x, playerY - zone.position.y);
      inside = dist <= zone.radius;
    } else if (zone.shape === 'rectangle') {
      inside = playerX >= zone.position.x && playerX <= zone.position.x + zone.width &&
               playerY >= zone.position.y && playerY <= zone.position.y + zone.height;
      dist = inside ? 0 : Infinity; // no falloff outside rect for now
    } else if (zone.shape === 'polygon' && zone.points.length > 2) {
      // Point-in-polygon test (ray casting)
      let insidePoly = false;
      for (let i = 0, j = zone.points.length -1; i < zone.points.length; j = i++) {
        const xi = zone.points[i].x, yi = zone.points[i].y;
        const xj = zone.points[j].x, yj = zone.points[j].y;
        const intersect = ((yi > playerY) !== (yj > playerY)) &&
          (playerX < (xj - xi) * (playerY - yi) / (yj - yi + 0.00001) + xi);
        if (intersect) insidePoly = !insidePoly;
      }
      inside = insidePoly;
      dist = inside ? 0 : Infinity;
    }
    if (inside) {
      const falloffFactor = zone.falloff > 0 && dist > 0 ? Math.max(0, 1 - dist / (zone.radius || 100) * zone.falloff) : 1;
      totalRadiation += zone.intensity * falloffFactor * MAX_RADIATION;
    }
  });
  totalRadiation = Math.min(MAX_RADIATION, totalRadiation);
  window.setRadiationLevel(totalRadiation);
}

// Call zone-based update inside main loop
const originalUpdate = updateRadiationEffects;
updateRadiationEffects = function() {
  updateRadiationFromZones();
  originalUpdate();
};

// Replace requestAnimationFrame loop with wrapped function
function loop() {
  updateRadiationEffects();
  requestAnimationFrame(loop);
}
loop();