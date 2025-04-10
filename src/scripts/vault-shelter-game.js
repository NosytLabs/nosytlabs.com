/**
 * Vault Shelter Game - Optimized and Modular
 * Handles resource management, game loop, and exposes API for integration
 */
(function(window) {
  const VaultShelterGame = {};

  let lastUpdateTime = 0;
  let gameRunning = false;

  const resources = {
    power: { value: 75, decay: 0.05, meter: null, label: null },
    food: { value: 60, decay: 0.03, meter: null, label: null },
    water: { value: 80, decay: 0.04, meter: null, label: null },
    biofuel: { value: 45, decay: 0.02, meter: null, label: null }
  };

  const dweller = {
    hunger: { value: 100, decay: 0.05, meter: null, label: null },
    happiness: { value: 100, decay: 0.04, meter: null, label: null },
    energy: { value: 100, decay: 0.03, meter: null, label: null },
    level: 1,
    levelLabel: null,
    growthProgress: 0
  };

  function updateNeed(need) {
    need.value = Math.max(0, Math.min(100, need.value));
    if (need.meter) need.meter.style.width = need.value + '%';
    if (need.label) need.label.textContent = Math.round(need.value) + '%';
  }

  function updateResource(res) {
    res.value = Math.max(0, Math.min(100, res.value));
    if (res.meter) res.meter.style.width = res.value + '%';
    if (res.label) res.label.textContent = Math.round(res.value) + '%';
  }

  function updateDwellerLevel() {
    if (dweller.levelLabel) dweller.levelLabel.textContent = dweller.level;
  }

  function gameTick(deltaSeconds) {
    // Decay resources
    for (const key in resources) {
      const res = resources[key];
      res.value -= res.decay * deltaSeconds;
      updateResource(res);
    }

    // Decay dweller needs
    ['hunger', 'happiness', 'energy'].forEach((key) => {
      const need = dweller[key];
      need.value -= need.decay * deltaSeconds;
      updateNeed(need);
    });

    // Progression logic
    const avgNeeds = (dweller.hunger.value + dweller.happiness.value + dweller.energy.value) / 3;
    if (avgNeeds > 70) {
      dweller.growthProgress += 0.5 * deltaSeconds;
      if (dweller.growthProgress >= 100) {
        dweller.level++;
        dweller.growthProgress = 0;
        updateDwellerLevel();
      }
    } else {
      dweller.growthProgress = Math.max(0, dweller.growthProgress - 1 * deltaSeconds);
    }
  }

  function gameLoop(timestamp) {
    if (!gameRunning) return;
    if (!lastUpdateTime) lastUpdateTime = timestamp;
    const delta = (timestamp - lastUpdateTime) / 1000; // seconds
    lastUpdateTime = timestamp;

    gameTick(delta);

    requestAnimationFrame(gameLoop);
  }

  VaultShelterGame.start = function() {
    if (gameRunning) return;
    gameRunning = true;
    lastUpdateTime = 0;
    requestAnimationFrame(gameLoop);
  };

  VaultShelterGame.stop = function() {
    gameRunning = false;
  };

  VaultShelterGame.feed = function() {
    dweller.hunger.value = Math.min(100, dweller.hunger.value + 20);
    updateNeed(dweller.hunger);
  };

  VaultShelterGame.play = function() {
    dweller.happiness.value = Math.min(100, dweller.happiness.value + 20);
    dweller.energy.value = Math.max(0, dweller.energy.value - 10);
    updateNeed(dweller.happiness);
    updateNeed(dweller.energy);
  };

  VaultShelterGame.rest = function() {
    dweller.energy.value = Math.min(100, dweller.energy.value + 25);
    dweller.hunger.value = Math.max(0, dweller.hunger.value - 5);
    updateNeed(dweller.energy);
    updateNeed(dweller.hunger);
  };

  VaultShelterGame.init = function() {
    function setupResponsiveLayout() {
      const container = document.getElementById('game-interface');
      if (!container) return;

      function resize() {
        const aspectRatio = 16 / 9; // Target aspect ratio
        const windowWidth = window.innerWidth;
        const windowHeight = window.innerHeight;
        let width = windowWidth;
        let height = windowWidth / aspectRatio;

        if (height > windowHeight) {
          height = windowHeight;
          width = windowHeight * aspectRatio;
        }

        container.style.width = width + 'px';
        container.style.height = height + 'px';
        container.style.position = 'absolute';
        container.style.left = ((windowWidth - width) / 2) + 'px';
        container.style.top = ((windowHeight - height) / 2) + 'px';
      }

      window.addEventListener('resize', resize);
      resize();
    }
    console.log('Initializing Vault Shelter Game');

    const loadingScreen = document.getElementById('game-loading');
    const gameInterface = document.getElementById('game-interface');

    if (loadingScreen) loadingScreen.style.display = 'none';
    if (gameInterface) gameInterface.classList.remove('hidden');

    // Initialize resource elements
    resources.power.meter = document.querySelector('.power-meter');
    resources.power.label = document.getElementById('power-value');

    resources.food.meter = document.querySelector('.food-meter');
    resources.food.label = document.getElementById('food-value');

    resources.water.meter = document.querySelector('.water-meter');
    resources.water.label = document.getElementById('water-value');

    resources.biofuel.meter = document.querySelector('.biofuel-meter');
    resources.biofuel.label = document.getElementById('biofuel-value');

    // Initialize dweller elements
    dweller.hunger.meter = document.querySelector('.hunger-meter');
    dweller.hunger.label = document.getElementById('hunger-value');

    dweller.happiness.meter = document.querySelector('.happiness-meter');
    dweller.happiness.label = document.getElementById('happiness-value');

    dweller.energy.meter = document.querySelector('.energy-meter');
    dweller.energy.label = document.getElementById('energy-value');

    dweller.levelLabel = document.getElementById('dweller-level');

    updateDwellerLevel();

    // Button interactions
    const feedBtn = document.getElementById('feed-btn');
    feedBtn && feedBtn.addEventListener('click', VaultShelterGame.feed);

    const playBtn = document.getElementById('play-btn');
    playBtn && playBtn.addEventListener('click', VaultShelterGame.play);

    const restBtn = document.getElementById('rest-btn');
    restBtn && restBtn.addEventListener('click', VaultShelterGame.rest);

    setupResponsiveLayout();
    VaultShelterGame.start();
  };

  window.VaultShelterGame = VaultShelterGame;
})(window);

document.addEventListener('DOMContentLoaded', () => {
  if (window.VaultShelterGame) {
    window.VaultShelterGame.init();
  }
});