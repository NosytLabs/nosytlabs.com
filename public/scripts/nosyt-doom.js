// Doom II Game Manager for NosytOS95
class DoomGame {
    constructor() {
        this.canvas = null;
        this.ctx = null;
        this.gameInstance = null;
        this.isFullscreen = false;
        this.isPaused = false;
        this.isLoaded = false;
        this.wasmModule = null;
        
        // Game state
        this.savegames = [];
        this.currentConfig = {
            resolution: { width: 640, height: 400 },
            controls: {
                moveForward: 'KeyW',
                moveBackward: 'KeyS',
                strafeLeft: 'KeyA',
                strafeRight: 'KeyD',
                fire: 'click',
                use: 'KeyE',
                run: 'ShiftLeft'
            },
            video: {
                brightness: 1.0,
                fullscreen: false,
                vsync: true
            },
            audio: {
                musicVolume: 0.7,
                soundVolume: 1.0
            }
        };
    }

    async initialize() {
        try {
            // Get DOM elements
            this.canvas = document.getElementById('doom-canvas');
            this.loadingElement = document.getElementById('doom-loading');
            this.menuElement = document.getElementById('doom-menu');
            this.loadingBarElement = document.getElementById('doom-loading-bar');
            this.statusElement = document.getElementById('doom-status');

            if (!this.canvas) {
                throw new Error('Canvas element not found');
            }

            // Initialize WebGL context
            this.ctx = this.canvas.getContext('webgl2', {
                alpha: false,
                antialias: false,
                depth: true,
                preserveDrawingBuffer: false
            });

            if (!this.ctx) {
                throw new Error('WebGL2 not supported');
            }

            // Update status
            this.updateStatus('Initializing...');
            
            // Load WebAssembly module
            await this.loadWasmModule();

            // Set up event listeners
            this.setupEventListeners();
            
            // Show menu once loaded
            this.showMenu();

        } catch (error) {
            console.error('Doom initialization error:', error);
            this.updateStatus('Error: ' + error.message);
        }
    }

    async loadWasmModule() {
        try {
            this.updateStatus('Loading DOOM II...');
            this.updateLoadingProgress(0);

            // Load WebAssembly module
            const response = await fetch('/doom/doom2.wasm');
            const wasmBuffer = await response.arrayBuffer();
            
            // Compile and instantiate the WebAssembly module
            this.wasmModule = await WebAssembly.instantiate(wasmBuffer, {
                env: this.getWasmEnvironment()
            });

            this.updateLoadingProgress(100);
            this.isLoaded = true;
            this.updateStatus('Ready');

        } catch (error) {
            console.error('WASM loading error:', error);
            this.updateStatus('Failed to load DOOM II');
            throw error;
        }
    }

    getWasmEnvironment() {
        return {
            // Memory management
            memory: new WebAssembly.Memory({ initial: 256, maximum: 512 }),
            
            // Canvas operations
            js_canvas_width: () => this.canvas.width,
            js_canvas_height: () => this.canvas.height,
            
            // Audio context
            js_audio_init: () => {
                // Initialize Web Audio API
                this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
                return this.audioContext ? 1 : 0;
            },
            
            // Input handling
            js_key_down: (keyCode) => this.handleKeyDown(keyCode),
            js_key_up: (keyCode) => this.handleKeyUp(keyCode),
            js_mouse_move: (x, y) => this.handleMouseMove(x, y),
            
            // File system operations for save games
            js_save_game: (ptr, size) => this.handleSaveGame(ptr, size),
            js_load_game: (ptr, size) => this.handleLoadGame(ptr, size)
        };
    }

    setupEventListeners() {
        // Window focus handling
        window.addEventListener('focus', () => this.handleFocus());
        window.addEventListener('blur', () => this.handleBlur());

        // Input handling
        document.addEventListener('keydown', (e) => this.handleKeyDown(e));
        document.addEventListener('keyup', (e) => this.handleKeyUp(e));
        this.canvas.addEventListener('mousemove', (e) => this.handleMouseMove(e));
        this.canvas.addEventListener('click', (e) => this.handleClick(e));

        // Menu buttons
        document.getElementById('doom-start-game').addEventListener('click', () => this.startNewGame());
        document.getElementById('doom-load-game').addEventListener('click', () => this.showLoadGameMenu());
        document.getElementById('doom-options').addEventListener('click', () => this.showOptionsMenu());

        // Fullscreen handling
        document.addEventListener('fullscreenchange', () => this.handleFullscreenChange());
    }

    startNewGame() {
        this.hideMenu();
        this.canvas.style.display = 'block';
        this.isPaused = false;
        this.updateStatus('Starting new game...');
        
        // Initialize game state through WebAssembly
        this.wasmModule.instance.exports.start_new_game();
    }

    showLoadGameMenu() {
        // Implement save game loading UI
    }

    showOptionsMenu() {
        // Implement options menu UI
    }

    handleKeyDown(event) {
        if (!this.isLoaded || this.isPaused) return;
        
        const key = event.code || event.key;
        if (key === 'Escape') {
            this.togglePause();
            return;
        }

        // Forward key event to WebAssembly
        if (this.wasmModule) {
            this.wasmModule.instance.exports.handle_key_down(key);
        }
    }

    handleKeyUp(event) {
        if (!this.isLoaded || this.isPaused) return;
        
        const key = event.code || event.key;
        
        // Forward key event to WebAssembly
        if (this.wasmModule) {
            this.wasmModule.instance.exports.handle_key_up(key);
        }
    }

    handleMouseMove(event) {
        if (!this.isLoaded || this.isPaused) return;

        const rect = this.canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        // Forward mouse movement to WebAssembly
        if (this.wasmModule) {
            this.wasmModule.instance.exports.handle_mouse_move(x, y);
        }
    }

    handleClick(event) {
        if (!this.isLoaded || this.isPaused) return;

        // Forward mouse click to WebAssembly
        if (this.wasmModule) {
            this.wasmModule.instance.exports.handle_mouse_click();
        }
    }

    togglePause() {
        this.isPaused = !this.isPaused;
        if (this.isPaused) {
            this.showMenu();
            this.updateStatus('Paused');
        } else {
            this.hideMenu();
            this.updateStatus('Running');
        }
    }

    showMenu() {
        if (this.menuElement) {
            this.menuElement.style.display = 'block';
        }
    }

    hideMenu() {
        if (this.menuElement) {
            this.menuElement.style.display = 'none';
        }
    }

    updateStatus(message) {
        if (this.statusElement) {
            this.statusElement.textContent = message;
        }
    }

    updateLoadingProgress(percent) {
        if (this.loadingBarElement) {
            this.loadingBarElement.style.width = `${percent}%`;
        }
    }

    handleFocus() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    handleBlur() {
        if (!this.isPaused) {
            this.togglePause();
        }
    }

    handleFullscreenChange() {
        this.isFullscreen = document.fullscreenElement !== null;
        if (this.isFullscreen) {
            this.canvas.style.width = '100vw';
            this.canvas.style.height = '100vh';
        } else {
            this.canvas.style.width = '100%';
            this.canvas.style.height = '100%';
        }
    }

    // Save/Load game handling
    async handleSaveGame(ptr, size) {
        // Implementation for saving game state
    }

    async handleLoadGame(ptr, size) {
        // Implementation for loading game state
    }
}

// Initialize Doom when the window loads
window.addEventListener('DOMContentLoaded', () => {
    // Initialize game when the doom window is opened
    const doomIcon = document.getElementById('doom-icon');
    const doomWindow = document.getElementById('doom-window');

    if (doomIcon && doomWindow) {
        doomIcon.addEventListener('click', () => {
            if (doomWindow.style.display === 'none') {
                doomWindow.style.display = 'block';
                if (!window.doomGame) {
                    window.doomGame = new DoomGame();
                    window.doomGame.initialize();
                }
            }
        });
    }
});
