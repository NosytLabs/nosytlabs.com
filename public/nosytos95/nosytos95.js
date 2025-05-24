// NosytOS95 Main System File
// Initializes and coordinates all OS components

class NosytOS95 {
    constructor() {
        this.windowManager = null;
        this.taskbarManager = null;
        this.startMenuManager = null;
        this.desktopManager = null;
        this.applications = new Map();
        this.isInitialized = false;
    }

    // Initialize the entire OS
    async init() {
        if (this.isInitialized) return;

        try {
            console.log('Initializing NosytOS95...');
            
            // Initialize core managers
            await this.initializeCore();
            
            // Initialize applications
            await this.initializeApplications();
            
            // Setup global event handlers
            this.setupGlobalHandlers();
            
            // Mark as initialized
            this.isInitialized = true;
            
            console.log('NosytOS95 initialized successfully');
            
            // Show welcome message
            this.showWelcomeMessage();
            
        } catch (error) {
            console.error('Failed to initialize NosytOS95:', error);
            this.showErrorMessage('Failed to initialize NosytOS95. Please refresh the page.');
        }
    }

    // Initialize core system managers
    async initializeCore() {
        // Initialize Window Manager
        this.windowManager = new WindowManager();
        
        // Initialize Taskbar Manager
        this.taskbarManager = new TaskbarManager(this.windowManager);
        
        // Initialize Start Menu Manager
        this.startMenuManager = new StartMenuManager(this.windowManager);
        
        // Initialize Desktop Manager
        this.desktopManager = new DesktopManager(this.windowManager, this.startMenuManager);
        
        // Cross-reference managers
        this.windowManager.taskbarManager = this.taskbarManager;
        
        console.log('Core managers initialized');
    }

    // Initialize all applications
    async initializeApplications() {
        const applications = [
            { id: 'minesweeper', name: 'Minesweeper', class: 'MinesweeperGame' },
            { id: 'tetris', name: 'Tetris', class: 'TetrisGame' },
            { id: 'snake', name: 'Snake', class: 'SnakeGame' },
            { id: 'calculator', name: 'Calculator', class: 'CalculatorApp' },
            { id: 'solitaire', name: 'Solitaire', class: 'SolitaireGame' },
            { id: 'notepad', name: 'Notepad', class: 'NotepadApp' },
            { id: 'paint', name: 'Paint', class: 'PaintApp' },
            { id: 'terminal', name: 'Terminal', class: 'TerminalApp' },
            { id: 'duck-hunt', name: 'Duck Hunt', class: 'DuckHuntGame' },
            { id: 'file-explorer', name: 'File Explorer', class: 'FileExplorerApp' },
            { id: 'chat', name: 'Chat', class: 'ChatApp' },
            { id: 'virtual-pc', name: 'Virtual PC', class: 'VirtualPCApp' },
            { id: 'soundboard', name: 'Soundboard', class: 'SoundboardApp' },
            { id: 'photo-booth', name: 'Photo Booth', class: 'PhotoBoothApp' },
            { id: 'ipod', name: 'iPod', class: 'IPodApp' }
        ];

        for (const app of applications) {
            try {
                await this.initializeApplication(app);
            } catch (error) {
                console.warn(`Failed to initialize ${app.name}:`, error);
            }
        }
        
        console.log('Applications initialized');
    }

    // Initialize individual application
    async initializeApplication(appConfig) {
        const windowElement = document.getElementById(`${appConfig.id}-window`);
        if (!windowElement) {
            console.warn(`Window element not found for ${appConfig.name}`);
            return;
        }

        const contentElement = windowElement.querySelector('.window-content');
        if (!contentElement) {
            console.warn(`Content element not found for ${appConfig.name}`);
            return;
        }

        // Check if application class exists
        if (typeof window[appConfig.class] === 'function') {
            try {
                const appInstance = new window[appConfig.class](contentElement);
                this.applications.set(appConfig.id, appInstance);
                
                // Store reference on window element
                windowElement.appInstance = appInstance;
                
                console.log(`${appConfig.name} initialized`);
            } catch (error) {
                console.warn(`Failed to create instance of ${appConfig.name}:`, error);
            }
        } else {
            console.warn(`Application class ${appConfig.class} not found for ${appConfig.name}`);
        }
    }

    // Setup global event handlers
    setupGlobalHandlers() {
        // Prevent context menu on desktop (except for development)
        document.addEventListener('contextmenu', (e) => {
            if (e.target.closest('.win95-desktop') && !e.target.closest('.desktop-icon')) {
                // Allow context menu in development mode
                if (!window.location.hostname.includes('localhost') && 
                    !window.location.hostname.includes('127.0.0.1')) {
                    e.preventDefault();
                }
            }
        });

        // Handle keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleGlobalKeyboard(e);
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            this.handleWindowResize();
        });

        // Handle page visibility change
        document.addEventListener('visibilitychange', () => {
            this.handleVisibilityChange();
        });

        // Handle beforeunload
        window.addEventListener('beforeunload', (e) => {
            this.handleBeforeUnload(e);
        });
    }

    // Handle global keyboard shortcuts
    handleGlobalKeyboard(e) {
        // Alt + Tab - Window switching
        if (e.altKey && e.key === 'Tab') {
            e.preventDefault();
            this.showTaskSwitcher();
        }

        // Windows key - Open start menu
        if (e.key === 'Meta' || e.key === 'OS') {
            e.preventDefault();
            this.startMenuManager.toggleStartMenu();
        }

        // Ctrl + Alt + Del - Show task manager
        if (e.ctrlKey && e.altKey && e.key === 'Delete') {
            e.preventDefault();
            this.showTaskManager();
        }

        // F11 - Toggle fullscreen
        if (e.key === 'F11') {
            e.preventDefault();
            this.toggleFullscreen();
        }

        // Escape - Close active dialogs/menus
        if (e.key === 'Escape') {
            this.closeActiveDialogs();
        }
    }

    // Handle window resize
    handleWindowResize() {
        // Adjust maximized windows
        const maximizedWindows = document.querySelectorAll('.win95-window.maximized');
        maximizedWindows.forEach(window => {
            window.style.width = '100%';
            window.style.height = 'calc(100% - 28px)';
        });

        // Update taskbar
        this.taskbarManager.updateTaskbar();
    }

    // Handle visibility change
    handleVisibilityChange() {
        if (document.hidden) {
            // Pause timers and animations when tab is hidden
            this.pauseApplications();
        } else {
            // Resume when tab becomes visible
            this.resumeApplications();
        }
    }

    // Handle before unload
    handleBeforeUnload(e) {
        // Check if there are unsaved changes
        const hasUnsavedChanges = this.checkUnsavedChanges();
        
        if (hasUnsavedChanges) {
            e.preventDefault();
            e.returnValue = 'You have unsaved changes. Are you sure you want to leave?';
            return e.returnValue;
        }
    }

    // Show task switcher (Alt+Tab)
    showTaskSwitcher() {
        const openWindows = this.windowManager.getAllWindows()
            .filter(w => w.style.display === 'flex');
        
        if (openWindows.length <= 1) return;

        // Create task switcher UI
        const switcher = document.createElement('div');
        switcher.className = 'task-switcher';
        switcher.innerHTML = `
            <div class="task-switcher-content">
                ${openWindows.map((window, index) => `
                    <div class="task-switcher-item ${index === 0 ? 'active' : ''}" data-window-id="${window.id}">
                        <img src="${this.getWindowIcon(window)}" alt="Icon">
                        <span>${this.getWindowTitle(window)}</span>
                    </div>
                `).join('')}
            </div>
        `;

        document.body.appendChild(switcher);

        // Handle task switching
        let currentIndex = 0;
        const handleKeyDown = (e) => {
            if (e.key === 'Tab' && e.altKey) {
                e.preventDefault();
                currentIndex = (currentIndex + 1) % openWindows.length;
                this.updateTaskSwitcherSelection(switcher, currentIndex);
            }
        };

        const handleKeyUp = (e) => {
            if (!e.altKey) {
                // Switch to selected window
                this.windowManager.bringToFront(openWindows[currentIndex]);
                switcher.remove();
                document.removeEventListener('keydown', handleKeyDown);
                document.removeEventListener('keyup', handleKeyUp);
            }
        };

        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);
    }

    // Update task switcher selection
    updateTaskSwitcherSelection(switcher, index) {
        const items = switcher.querySelectorAll('.task-switcher-item');
        items.forEach((item, i) => {
            item.classList.toggle('active', i === index);
        });
    }

    // Show task manager
    showTaskManager() {
        // Create task manager dialog
        console.log('Task Manager would open here');
    }

    // Toggle fullscreen
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            document.exitFullscreen();
        }
    }

    // Close active dialogs and menus
    closeActiveDialogs() {
        // Close start menu
        this.startMenuManager.closeStartMenu();
        
        // Close context menus
        this.desktopManager.hideContextMenus();
        
        // Close any modal dialogs
        const dialogs = document.querySelectorAll('.modal-dialog, .context-menu');
        dialogs.forEach(dialog => dialog.remove());
    }

    // Pause applications
    pauseApplications() {
        this.applications.forEach(app => {
            if (app.pause && typeof app.pause === 'function') {
                app.pause();
            }
        });
    }

    // Resume applications
    resumeApplications() {
        this.applications.forEach(app => {
            if (app.resume && typeof app.resume === 'function') {
                app.resume();
            }
        });
    }

    // Check for unsaved changes
    checkUnsavedChanges() {
        let hasChanges = false;
        
        this.applications.forEach(app => {
            if (app.hasUnsavedChanges && typeof app.hasUnsavedChanges === 'function') {
                if (app.hasUnsavedChanges()) {
                    hasChanges = true;
                }
            }
        });
        
        return hasChanges;
    }

    // Get window icon
    getWindowIcon(window) {
        const icon = window.querySelector('.window-icon');
        return icon ? icon.src : '/images/win95/application.png';
    }

    // Get window title
    getWindowTitle(window) {
        const title = window.querySelector('.window-title span');
        return title ? title.textContent : 'Unknown';
    }

    // Show welcome message
    showWelcomeMessage() {
        setTimeout(() => {
            const clippy = document.getElementById('clippy');
            if (clippy) {
                const bubble = clippy.querySelector('.clippy-bubble');
                const message = clippy.querySelector('#clippy-message');
                
                if (bubble && message) {
                    message.textContent = 'Welcome to NosytOS95! Click on desktop icons or use the Start menu to launch applications.';
                    bubble.style.display = 'block';
                    
                    // Auto-hide after 5 seconds
                    setTimeout(() => {
                        bubble.style.display = 'none';
                    }, 5000);
                }
            }
        }, 1000);
    }

    // Show error message
    showErrorMessage(message) {
        const errorDialog = document.createElement('div');
        errorDialog.className = 'error-dialog';
        errorDialog.innerHTML = `
            <div class="dialog-content">
                <div class="dialog-header">
                    <span>NosytOS95 Error</span>
                    <button class="dialog-close">×</button>
                </div>
                <div class="dialog-body">
                    <img src="/images/win95/error.png" alt="Error">
                    <p>${message}</p>
                </div>
                <div class="dialog-buttons">
                    <button class="dialog-button">OK</button>
                </div>
            </div>
        `;

        document.body.appendChild(errorDialog);

        // Handle close
        const closeBtn = errorDialog.querySelector('.dialog-close');
        const okBtn = errorDialog.querySelector('.dialog-button');
        
        const closeDialog = () => errorDialog.remove();
        
        closeBtn.addEventListener('click', closeDialog);
        okBtn.addEventListener('click', closeDialog);
    }

    // Get application instance
    getApplication(appId) {
        return this.applications.get(appId);
    }

    // Launch application
    launchApplication(appId) {
        return this.startMenuManager.launchApplication(appId);
    }
}

// Global initialization
let nosytOS95Instance = null;

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    nosytOS95Instance = new NosytOS95();
    nosytOS95Instance.init();
});

// Export for global access
if (typeof window !== 'undefined') {
    window.NosytOS95 = NosytOS95;
    window.getNosytOS95 = () => nosytOS95Instance;
}

// Export for module systems
if (typeof module !== 'undefined' && module.exports) {
    module.exports = NosytOS95;
}
