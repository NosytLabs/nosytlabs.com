// NosytOS95 Start Menu Manager
// Handles start menu functionality, program launching, and menu navigation

class StartMenuManager {
    constructor(windowManager) {
        this.windowManager = windowManager;
        this.isOpen = false;
        this.applications = new Map();
        this.init();
    }

    init() {
        this.initStartMenu();
        this.registerApplications();
        console.log('Start Menu Manager initialized');
    }

    // Initialize start menu functionality
    initStartMenu() {
        const startButton = document.querySelector('.start-button');
        const startMenu = document.getElementById('start-menu');
        
        if (!startButton || !startMenu) return;

        // Start button click handler
        startButton.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggleStartMenu();
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.start-menu') && !e.target.closest('.start-button')) {
                this.closeStartMenu();
            }
        });

        // Setup menu item handlers
        this.setupMenuHandlers();
    }

    // Setup menu item event handlers
    setupMenuHandlers() {
        // Handle submenu item clicks
        document.addEventListener('click', (e) => {
            const submenuItem = e.target.closest('.submenu-item');
            if (submenuItem) {
                const appName = submenuItem.dataset.app;
                if (appName) {
                    this.launchApplication(appName);
                    this.closeStartMenu();
                }
            }
        });

        // Handle main menu item clicks
        document.addEventListener('click', (e) => {
            const menuItem = e.target.closest('.menu-item');
            if (menuItem && menuItem.id === 'shutdown-item') {
                this.showShutdownDialog();
            }
        });

        // Handle submenu hover
        const menuItems = document.querySelectorAll('.menu-item');
        menuItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                // Hide other submenus
                const submenus = document.querySelectorAll('.submenu');
                submenus.forEach(submenu => {
                    if (!item.contains(submenu)) {
                        submenu.style.display = 'none';
                    }
                });

                // Show this submenu if it exists
                const submenu = item.querySelector('.submenu');
                if (submenu) {
                    submenu.style.display = 'block';
                }
            });
        });
    }

    // Register available applications
    registerApplications() {
        const apps = [
            { id: 'notepad', name: 'Notepad', icon: '/images/win95/notepad.png', category: 'Accessories' },
            { id: 'calculator', name: 'Calculator', icon: '/images/win95/calculator.png', category: 'Accessories' },
            { id: 'paint', name: 'Paint', icon: '/images/win95/paint.png', category: 'Accessories' },
            { id: 'terminal', name: 'Terminal', icon: '/images/win95/utilities-terminal.png', category: 'System Tools' },
            { id: 'explorer', name: 'File Explorer', icon: '/images/win95/folder.png', category: 'System Tools' },
            { id: 'minesweeper', name: 'Minesweeper', icon: '/images/win95/minesweeper.png', category: 'Games' },
            { id: 'tetris', name: 'Tetris', icon: '/images/win95/tetris.png', category: 'Games' },
            { id: 'snake', name: 'Snake', icon: '/images/win95/snake.png', category: 'Games' },
            { id: 'solitaire', name: 'Solitaire', icon: '/images/win95/solitaire.png', category: 'Games' },
            { id: 'duck-hunt', name: 'Duck Hunt', icon: '/images/win95/duck-hunt.png', category: 'Games' },
            { id: 'virtual-pc', name: 'Virtual PC', icon: '/images/win95/computer.png', category: 'Entertainment' },
            { id: 'chat', name: 'Chat', icon: '/images/win95/chat.png', category: 'Internet' },
            { id: 'soundboard', name: 'Soundboard', icon: '/images/win95/sound.png', category: 'Multimedia' },
            { id: 'photo-booth', name: 'Photo Booth', icon: '/images/win95/camera.png', category: 'Multimedia' },
            { id: 'ipod', name: 'iPod', icon: '/images/win95/music.png', category: 'Multimedia' }
        ];

        apps.forEach(app => {
            this.applications.set(app.id, app);
        });

        this.updateProgramsMenu();
    }

    // Update programs submenu
    updateProgramsMenu() {
        const programsMenu = document.querySelector('.programs-menu');
        if (!programsMenu) return;

        // Clear existing items
        programsMenu.innerHTML = '';

        // Group applications by category
        const categories = new Map();
        this.applications.forEach(app => {
            if (!categories.has(app.category)) {
                categories.set(app.category, []);
            }
            categories.get(app.category).push(app);
        });

        // Add categories and applications
        categories.forEach((apps, categoryName) => {
            // Add category header
            const categoryHeader = document.createElement('div');
            categoryHeader.className = 'submenu-category';
            categoryHeader.textContent = categoryName;
            programsMenu.appendChild(categoryHeader);

            // Add applications in category
            apps.forEach(app => {
                const submenuItem = document.createElement('div');
                submenuItem.className = 'submenu-item';
                submenuItem.dataset.app = app.id;

                const icon = document.createElement('img');
                icon.src = app.icon;
                icon.alt = app.name;
                submenuItem.appendChild(icon);

                const name = document.createElement('span');
                name.textContent = app.name;
                submenuItem.appendChild(name);

                programsMenu.appendChild(submenuItem);
            });

            // Add separator if not last category
            if (Array.from(categories.keys()).indexOf(categoryName) < categories.size - 1) {
                const separator = document.createElement('div');
                separator.className = 'submenu-separator';
                programsMenu.appendChild(separator);
            }
        });
    }

    // Toggle start menu visibility
    toggleStartMenu() {
        if (this.isOpen) {
            this.closeStartMenu();
        } else {
            this.openStartMenu();
        }
    }

    // Open start menu
    openStartMenu() {
        const startMenu = document.getElementById('start-menu');
        const startButton = document.querySelector('.start-button');
        
        if (!startMenu || !startButton) return;

        startMenu.style.display = 'block';
        startButton.classList.add('active');
        this.isOpen = true;

        // Position menu above taskbar
        const taskbarHeight = 28;
        startMenu.style.bottom = taskbarHeight + 'px';
        startMenu.style.left = '0px';
    }

    // Close start menu
    closeStartMenu() {
        const startMenu = document.getElementById('start-menu');
        const startButton = document.querySelector('.start-button');
        
        if (!startMenu || !startButton) return;

        startMenu.style.display = 'none';
        startButton.classList.remove('active');
        this.isOpen = false;

        // Hide all submenus
        const submenus = document.querySelectorAll('.submenu');
        submenus.forEach(submenu => {
            submenu.style.display = 'none';
        });
    }

    // Launch application
    launchApplication(appId) {
        const app = this.applications.get(appId);
        if (!app) {
            console.warn(`Application ${appId} not found`);
            return false;
        }

        // Try to open the window
        const windowId = appId + '-window';
        const success = this.windowManager.openWindow(windowId);
        
        if (success) {
            // Mark window as opened
            const window = document.getElementById(windowId);
            if (window) {
                window.dataset.hasBeenOpened = 'true';
                
                // Special handling for specific applications
                this.handleSpecialApplications(appId, window);
            }
        }

        return success;
    }

    // Handle special application initialization
    handleSpecialApplications(appId, window) {
        switch (appId) {
            case 'notepad':
                // Open Notepad maximized and focus textarea
                setTimeout(() => {
                    const maximizeBtn = window.querySelector('.window-maximize');
                    if (maximizeBtn && !window.classList.contains('maximized')) {
                        maximizeBtn.click();
                    }
                    
                    const textarea = window.querySelector('.notepad-content');
                    if (textarea) {
                        textarea.focus();
                    }
                }, 100);
                break;
                
            case 'calculator':
                // Initialize calculator if needed
                if (window.calculatorApp && window.calculatorApp.init) {
                    window.calculatorApp.init();
                }
                break;
                
            case 'minesweeper':
                // Initialize minesweeper game
                if (window.minesweeperGame && window.minesweeperGame.init) {
                    window.minesweeperGame.init();
                }
                break;
        }
    }

    // Show shutdown dialog
    showShutdownDialog() {
        const dialog = this.createShutdownDialog();
        document.body.appendChild(dialog);
        this.closeStartMenu();
    }

    // Create shutdown dialog
    createShutdownDialog() {
        const dialog = document.createElement('div');
        dialog.className = 'shutdown-dialog';
        dialog.innerHTML = `
            <div class="dialog-content">
                <div class="dialog-header">
                    <span>Shut Down NosytOS95</span>
                    <button class="dialog-close">×</button>
                </div>
                <div class="dialog-body">
                    <img src="/images/win95/shutdown-icon.png" alt="Shutdown">
                    <div class="dialog-text">
                        <p>What do you want the computer to do?</p>
                        <div class="shutdown-options">
                            <label><input type="radio" name="shutdown" value="restart" checked> Restart the computer</label>
                            <label><input type="radio" name="shutdown" value="shutdown"> Shut down the computer</label>
                            <label><input type="radio" name="shutdown" value="logout"> Close all programs and log on as a different user</label>
                        </div>
                    </div>
                </div>
                <div class="dialog-buttons">
                    <button class="dialog-button dialog-ok">OK</button>
                    <button class="dialog-button dialog-cancel">Cancel</button>
                </div>
            </div>
        `;

        // Add event handlers
        const closeBtn = dialog.querySelector('.dialog-close');
        const cancelBtn = dialog.querySelector('.dialog-cancel');
        const okBtn = dialog.querySelector('.dialog-ok');

        const closeDialog = () => dialog.remove();

        closeBtn.addEventListener('click', closeDialog);
        cancelBtn.addEventListener('click', closeDialog);
        okBtn.addEventListener('click', () => {
            const selectedOption = dialog.querySelector('input[name="shutdown"]:checked').value;
            this.handleShutdownAction(selectedOption);
            closeDialog();
        });

        return dialog;
    }

    // Handle shutdown actions
    handleShutdownAction(action) {
        switch (action) {
            case 'restart':
                this.showRestartAnimation();
                break;
            case 'shutdown':
                this.showShutdownAnimation();
                break;
            case 'logout':
                this.showLogoutScreen();
                break;
        }
    }

    // Show restart animation
    showRestartAnimation() {
        const overlay = document.createElement('div');
        overlay.className = 'shutdown-overlay';
        overlay.innerHTML = '<div class="shutdown-message">Restarting NosytOS95...</div>';
        document.body.appendChild(overlay);

        setTimeout(() => {
            location.reload();
        }, 3000);
    }

    // Show shutdown animation
    showShutdownAnimation() {
        const overlay = document.createElement('div');
        overlay.className = 'shutdown-overlay';
        overlay.innerHTML = '<div class="shutdown-message">It is now safe to turn off your computer.</div>';
        document.body.appendChild(overlay);

        setTimeout(() => {
            document.body.style.display = 'none';
        }, 3000);
    }

    // Show logout screen
    showLogoutScreen() {
        const overlay = document.createElement('div');
        overlay.className = 'shutdown-overlay';
        overlay.innerHTML = `
            <div class="login-screen">
                <h2>Welcome to NosytOS95</h2>
                <p>Click your user name to begin.</p>
                <div class="user-list">
                    <div class="user-item" onclick="location.reload()">
                        <img src="/images/win95/user.png" alt="User">
                        <span>NosytLabs User</span>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(overlay);
    }

    // Add application to start menu
    addApplication(app) {
        this.applications.set(app.id, app);
        this.updateProgramsMenu();
    }

    // Remove application from start menu
    removeApplication(appId) {
        this.applications.delete(appId);
        this.updateProgramsMenu();
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = StartMenuManager;
} else {
    window.StartMenuManager = StartMenuManager;
}
