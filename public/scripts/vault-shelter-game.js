/**
 * Vault Shelter Game - Resource Management Game
 * Inspired by Fallout Shelter with custom NosytLabs branding
 */

class VaultShelterGame {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.gameState = {
      population: 10,
      power: 100,
      food: 100,
      water: 100,
      caps: 500,
      happiness: 80,
      rooms: [],
      dwellers: [],
      gameSpeed: 1,
      isPaused: false
    };
    
    this.roomTypes = {
      power: { name: 'Power Generator', cost: 100, production: 2, icon: '⚡' },
      food: { name: 'Diner', cost: 150, production: 2, icon: '🍖' },
      water: { name: 'Water Treatment', cost: 120, production: 2, icon: '💧' },
      living: { name: 'Living Quarters', cost: 200, production: 0, icon: '🏠' }
    };
    
    this.dwellerNames = [
      'Alex', 'Blake', 'Casey', 'Drew', 'Ellis', 'Finley', 'Gray', 'Harper',
      'Indigo', 'Jordan', 'Kai', 'Lane', 'Morgan', 'Nova', 'Onyx', 'Parker'
    ];
    
    this.init();
  }
  
  init() {
    this.canvas = document.getElementById('vault-canvas');
    if (!this.canvas) {
      console.error('Vault canvas not found');
      return;
    }
    
    this.ctx = this.canvas.getContext('2d');
    this.setupEventListeners();
    this.initializeVault();
    this.startGameLoop();
    
    console.log('Vault Shelter Game initialized');
  }
  
  setupEventListeners() {
    // Build menu buttons
    document.querySelectorAll('.build-option').forEach(button => {
      button.addEventListener('click', (e) => {
        const roomType = e.currentTarget.dataset.room;
        this.buildRoom(roomType);
      });
    });
    
    // Control buttons
    const pauseBtn = document.getElementById('pause-btn');
    const speedBtn = document.getElementById('speed-btn');
    const saveBtn = document.getElementById('save-btn');
    const recruitBtn = document.getElementById('recruit-btn');
    
    if (pauseBtn) {
      pauseBtn.addEventListener('click', () => this.togglePause());
    }
    
    if (speedBtn) {
      speedBtn.addEventListener('click', () => this.changeSpeed());
    }
    
    if (saveBtn) {
      saveBtn.addEventListener('click', () => this.saveGame());
    }
    
    if (recruitBtn) {
      recruitBtn.addEventListener('click', () => this.recruitDweller());
    }
    
    // Canvas click events for room interaction
    this.canvas.addEventListener('click', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.handleCanvasClick(x, y);
    });
  }
  
  initializeVault() {
    // Create initial rooms
    this.gameState.rooms = [
      { type: 'power', x: 100, y: 200, width: 150, height: 80, level: 1, dwellers: [] },
      { type: 'food', x: 300, y: 200, width: 150, height: 80, level: 1, dwellers: [] },
      { type: 'water', x: 500, y: 200, width: 150, height: 80, level: 1, dwellers: [] },
      { type: 'living', x: 200, y: 300, width: 200, height: 80, level: 1, dwellers: [] }
    ];
    
    // Create initial dwellers
    for (let i = 0; i < this.gameState.population; i++) {
      this.createDweller();
    }
    
    this.updateUI();
  }
  
  createDweller() {
    const dweller = {
      id: Date.now() + Math.random(),
      name: this.dwellerNames[Math.floor(Math.random() * this.dwellerNames.length)],
      level: 1,
      happiness: Math.floor(Math.random() * 20) + 80,
      stats: {
        strength: Math.floor(Math.random() * 5) + 3,
        perception: Math.floor(Math.random() * 5) + 3,
        endurance: Math.floor(Math.random() * 5) + 3,
        charisma: Math.floor(Math.random() * 5) + 3,
        intelligence: Math.floor(Math.random() * 5) + 3,
        agility: Math.floor(Math.random() * 5) + 3,
        luck: Math.floor(Math.random() * 5) + 3
      },
      assignedRoom: null,
      x: Math.random() * 800 + 100,
      y: Math.random() * 400 + 150
    };
    
    this.gameState.dwellers.push(dweller);
    this.updateDwellerList();
  }
  
  buildRoom(roomType) {
    const roomData = this.roomTypes[roomType];
    if (!roomData) return;
    
    if (this.gameState.caps < roomData.cost) {
      this.showNotification('Not enough caps!');
      return;
    }
    
    // Find a suitable position for the new room
    const newRoom = {
      type: roomType,
      x: Math.random() * 600 + 100,
      y: Math.random() * 300 + 150,
      width: 150,
      height: 80,
      level: 1,
      dwellers: []
    };
    
    this.gameState.rooms.push(newRoom);
    this.gameState.caps -= roomData.cost;
    
    this.showNotification(`Built ${roomData.name}!`);
    this.updateUI();
  }
  
  recruitDweller() {
    const cost = 50;
    if (this.gameState.caps < cost) {
      this.showNotification('Not enough caps to recruit!');
      return;
    }
    
    this.gameState.caps -= cost;
    this.gameState.population++;
    this.createDweller();
    
    this.showNotification('New dweller recruited!');
    this.updateUI();
  }
  
  handleCanvasClick(x, y) {
    // Check if clicked on a room
    for (const room of this.gameState.rooms) {
      if (x >= room.x && x <= room.x + room.width &&
          y >= room.y && y <= room.y + room.height) {
        this.selectRoom(room);
        break;
      }
    }
  }
  
  selectRoom(room) {
    const roomData = this.roomTypes[room.type];
    this.showNotification(`${roomData.name} - Level ${room.level} - ${room.dwellers.length} dwellers`);
  }
  
  updateResources() {
    if (this.gameState.isPaused) return;
    
    // Calculate production from rooms
    let powerProduction = 0;
    let foodProduction = 0;
    let waterProduction = 0;
    
    this.gameState.rooms.forEach(room => {
      const roomData = this.roomTypes[room.type];
      const production = roomData.production * room.level * (room.dwellers.length + 1);
      
      switch (room.type) {
        case 'power':
          powerProduction += production;
          break;
        case 'food':
          foodProduction += production;
          break;
        case 'water':
          waterProduction += production;
          break;
      }
    });
    
    // Update resources
    this.gameState.power = Math.min(200, this.gameState.power + powerProduction * 0.1);
    this.gameState.food = Math.min(200, this.gameState.food + foodProduction * 0.1);
    this.gameState.water = Math.min(200, this.gameState.water + waterProduction * 0.1);
    
    // Resource consumption
    const consumption = this.gameState.population * 0.05;
    this.gameState.power = Math.max(0, this.gameState.power - consumption);
    this.gameState.food = Math.max(0, this.gameState.food - consumption);
    this.gameState.water = Math.max(0, this.gameState.water - consumption);
    
    // Generate caps
    this.gameState.caps += Math.floor(this.gameState.population * 0.1);
    
    this.updateUI();
  }
  
  updateUI() {
    // Update resource displays
    document.getElementById('population').textContent = this.gameState.population;
    document.getElementById('power').textContent = Math.floor(this.gameState.power);
    document.getElementById('food').textContent = Math.floor(this.gameState.food);
    document.getElementById('water').textContent = Math.floor(this.gameState.water);
    document.getElementById('caps').textContent = this.gameState.caps;
    
    // Update resource bars
    this.updateResourceBar('power-bar', this.gameState.power / 200);
    this.updateResourceBar('food-bar', this.gameState.food / 200);
    this.updateResourceBar('water-bar', this.gameState.water / 200);
    
    // Update recruit button
    const recruitBtn = document.getElementById('recruit-btn');
    if (recruitBtn) {
      recruitBtn.disabled = this.gameState.caps < 50;
    }
  }
  
  updateResourceBar(barId, percentage) {
    const bar = document.getElementById(barId);
    if (bar) {
      bar.style.width = (percentage * 100) + '%';
    }
  }
  
  updateDwellerList() {
    const dwellerList = document.getElementById('dweller-list');
    if (!dwellerList) return;
    
    dwellerList.innerHTML = '';
    
    this.gameState.dwellers.forEach(dweller => {
      const dwellerElement = document.createElement('div');
      dwellerElement.className = 'dweller-item';
      dwellerElement.innerHTML = `
        <div>
          <strong>${dweller.name}</strong>
          <div style="font-size: 0.8rem; color: #ccc;">Level ${dweller.level}</div>
        </div>
        <div style="font-size: 0.8rem; color: #ffd700;">
          ${dweller.happiness}% Happy
        </div>
      `;
      dwellerList.appendChild(dwellerElement);
    });
  }
  
  render() {
    if (!this.ctx) return;
    
    // Clear canvas
    this.ctx.fillStyle = '#1a1a2e';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw vault background
    this.drawVaultBackground();
    
    // Draw rooms
    this.gameState.rooms.forEach(room => this.drawRoom(room));
    
    // Draw dwellers
    this.gameState.dwellers.forEach(dweller => this.drawDweller(dweller));
  }
  
  drawVaultBackground() {
    // Draw vault structure
    this.ctx.strokeStyle = '#ffd700';
    this.ctx.lineWidth = 2;
    
    // Draw vault levels
    for (let i = 0; i < 5; i++) {
      const y = 100 + i * 120;
      this.ctx.beginPath();
      this.ctx.moveTo(50, y);
      this.ctx.lineTo(this.canvas.width - 50, y);
      this.ctx.stroke();
    }
  }
  
  drawRoom(room) {
    const roomData = this.roomTypes[room.type];
    
    // Room background
    this.ctx.fillStyle = '#2d3748';
    this.ctx.fillRect(room.x, room.y, room.width, room.height);
    
    // Room border
    this.ctx.strokeStyle = '#ffd700';
    this.ctx.lineWidth = 1;
    this.ctx.strokeRect(room.x, room.y, room.width, room.height);
    
    // Room icon and text
    this.ctx.fillStyle = '#ffd700';
    this.ctx.font = '24px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(roomData.icon, room.x + room.width / 2, room.y + 30);
    
    this.ctx.font = '12px Arial';
    this.ctx.fillText(roomData.name, room.x + room.width / 2, room.y + 50);
    this.ctx.fillText(`Level ${room.level}`, room.x + room.width / 2, room.y + 65);
  }
  
  drawDweller(dweller) {
    // Simple dweller representation
    this.ctx.fillStyle = '#ff6b00';
    this.ctx.beginPath();
    this.ctx.arc(dweller.x, dweller.y, 8, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Dweller name
    this.ctx.fillStyle = '#fff';
    this.ctx.font = '10px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(dweller.name, dweller.x, dweller.y - 12);
  }
  
  togglePause() {
    this.gameState.isPaused = !this.gameState.isPaused;
    const pauseBtn = document.getElementById('pause-btn');
    if (pauseBtn) {
      pauseBtn.textContent = this.gameState.isPaused ? '▶️ Resume' : '⏸️ Pause';
    }
  }
  
  changeSpeed() {
    this.gameState.gameSpeed = this.gameState.gameSpeed === 1 ? 2 : this.gameState.gameSpeed === 2 ? 3 : 1;
    const speedBtn = document.getElementById('speed-btn');
    if (speedBtn) {
      speedBtn.textContent = `⏩ Speed x${this.gameState.gameSpeed}`;
    }
  }
  
  saveGame() {
    localStorage.setItem('vaultShelterSave', JSON.stringify(this.gameState));
    this.showNotification('Game saved!');
  }
  
  loadGame() {
    const saveData = localStorage.getItem('vaultShelterSave');
    if (saveData) {
      this.gameState = JSON.parse(saveData);
      this.updateUI();
      this.updateDwellerList();
      this.showNotification('Game loaded!');
    }
  }
  
  showNotification(message) {
    const notifications = document.getElementById('notifications');
    if (!notifications) return;
    
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notifications.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
  
  startGameLoop() {
    const gameLoop = () => {
      this.updateResources();
      this.render();
      setTimeout(() => requestAnimationFrame(gameLoop), 1000 / this.gameState.gameSpeed);
    };
    
    gameLoop();
  }
}

// Initialize game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('vault-canvas')) {
    window.vaultGame = new VaultShelterGame();
  }
});

// Export for module use
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VaultShelterGame;
}
