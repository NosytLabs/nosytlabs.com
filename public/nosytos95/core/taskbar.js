// NosytOS95 Taskbar Manager
// Handles taskbar functionality, task buttons, and system tray

class TaskbarManager {
    constructor(windowManager) {
        this.windowManager = windowManager;
        this.taskbarItems = new Map();
        this.init();
    }

    init() {
        this.initTaskbar();
        this.initClock();
        this.updateClock();
        setInterval(() => this.updateClock(), 60000);
        console.log('Taskbar Manager initialized');
    }

    // Initialize taskbar functionality
    initTaskbar() {
        const taskbarItemsContainer = document.querySelector('.taskbar-items');
        if (!taskbarItemsContainer) return;

        // Clear existing items
        taskbarItemsContainer.innerHTML = '';
        
        // Set up taskbar click handlers
        this.setupTaskbarHandlers();
    }

    // Setup taskbar event handlers
    setupTaskbarHandlers() {
        // Handle taskbar item clicks
        document.addEventListener('click', (e) => {
            if (e.target.closest('.taskbar-item')) {
                const taskbarItem = e.target.closest('.taskbar-item');
                const windowId = taskbarItem.dataset.windowId;
                this.toggleWindow(windowId);
            }
        });
    }

    // Update taskbar with current windows
    updateTaskbar() {
        const taskbarItemsContainer = document.querySelector('.taskbar-items');
        if (!taskbarItemsContainer) return;

        // Clear existing items
        taskbarItemsContainer.innerHTML = '';
        this.taskbarItems.clear();

        // Get all visible windows
        const windows = document.querySelectorAll('.win95-window');
        
        windows.forEach(window => {
            if (this.shouldShowInTaskbar(window)) {
                this.addTaskbarItem(window);
            }
        });
    }

    // Check if window should be shown in taskbar
    shouldShowInTaskbar(window) {
        // Show if window has been opened at least once
        return window.style.display === 'flex' || 
               window.style.display === 'none' && window.dataset.hasBeenOpened === 'true';
    }

    // Add taskbar item for window
    addTaskbarItem(window) {
        const taskbarItemsContainer = document.querySelector('.taskbar-items');
        if (!taskbarItemsContainer) return;

        const windowId = window.id;
        const windowTitle = this.getWindowTitle(window);
        const windowIcon = this.getWindowIcon(window);

        // Create taskbar item
        const taskbarItem = document.createElement('div');
        taskbarItem.className = 'taskbar-item';
        taskbarItem.dataset.windowId = windowId;
        
        // Set active state
        if (window.classList.contains('active') && window.style.display === 'flex') {
            taskbarItem.classList.add('active');
        }

        // Add icon if available
        if (windowIcon) {
            const icon = document.createElement('img');
            icon.src = windowIcon;
            icon.alt = windowTitle;
            taskbarItem.appendChild(icon);
        }

        // Add title
        const title = document.createElement('span');
        title.textContent = windowTitle;
        taskbarItem.appendChild(title);

        // Add to container
        taskbarItemsContainer.appendChild(taskbarItem);
        
        // Store reference
        this.taskbarItems.set(windowId, taskbarItem);
    }

    // Get window title
    getWindowTitle(window) {
        const titleElement = window.querySelector('.window-title span');
        if (titleElement) {
            return titleElement.textContent;
        }
        
        // Fallback to window ID
        return window.id.replace('-window', '').replace('-', ' ').toUpperCase();
    }

    // Get window icon
    getWindowIcon(window) {
        const iconElement = window.querySelector('.window-icon');
        if (iconElement) {
            return iconElement.src;
        }
        
        // Fallback icons based on window type
        const windowType = window.id.replace('-window', '');
        const iconMap = {
            'notepad': '/images/win95/notepad.png',
            'duck-hunt': '/images/win95/duck-hunt.png',
            'terminal': '/images/win95/utilities-terminal.png',
            'help': '/images/win95/help.png',
            'virtual-pc': '/images/win95/computer.png',
            'chat': '/images/win95/chat.png',
            'explorer': '/images/win95/folder.png',
            'soundboard': '/images/win95/sound.png',
            'photo-booth': '/images/win95/camera.png',
            'ipod': '/images/win95/music.png',
            'paint': '/images/win95/paint.png',
            'minesweeper': '/images/win95/minesweeper.png',
            'tetris': '/images/win95/tetris.png',
            'snake': '/images/win95/snake.png',
            'calculator': '/images/win95/calculator.png',
            'solitaire': '/images/win95/solitaire.png'
        };
        
        return iconMap[windowType] || '/images/win95/application.png';
    }

    // Toggle window visibility
    toggleWindow(windowId) {
        const window = document.getElementById(windowId);
        if (!window) return;

        if (window.style.display === 'none') {
            // Show window
            window.style.display = 'flex';
            this.windowManager.bringToFront(window);
        } else if (window.classList.contains('active')) {
            // Minimize if already active
            window.style.display = 'none';
        } else {
            // Bring to front if not active
            this.windowManager.bringToFront(window);
        }

        this.updateTaskbar();
    }

    // Initialize clock
    initClock() {
        const clockElement = document.getElementById('taskbar-clock');
        if (!clockElement) {
            // Create clock element if it doesn't exist
            const trayItem = document.createElement('div');
            trayItem.className = 'tray-item clock';
            
            const clock = document.createElement('span');
            clock.id = 'taskbar-clock';
            clock.textContent = '12:00 PM';
            
            trayItem.appendChild(clock);
            
            const taskbarTray = document.querySelector('.taskbar-tray');
            if (taskbarTray) {
                taskbarTray.appendChild(trayItem);
            }
        }
    }

    // Update clock display
    updateClock() {
        const clockElement = document.getElementById('taskbar-clock');
        if (!clockElement) return;

        const now = new Date();
        const timeString = now.toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
        
        clockElement.textContent = timeString;
    }

    // Add system tray icon
    addTrayIcon(iconSrc, tooltip, clickHandler) {
        const taskbarTray = document.querySelector('.taskbar-tray');
        if (!taskbarTray) return;

        const trayItem = document.createElement('div');
        trayItem.className = 'tray-item';
        trayItem.title = tooltip;

        const icon = document.createElement('img');
        icon.src = iconSrc;
        icon.alt = tooltip;
        
        trayItem.appendChild(icon);
        
        if (clickHandler) {
            trayItem.addEventListener('click', clickHandler);
        }

        // Insert before clock
        const clock = taskbarTray.querySelector('.clock');
        if (clock) {
            taskbarTray.insertBefore(trayItem, clock);
        } else {
            taskbarTray.appendChild(trayItem);
        }
    }

    // Remove system tray icon
    removeTrayIcon(tooltip) {
        const trayItems = document.querySelectorAll('.tray-item');
        trayItems.forEach(item => {
            if (item.title === tooltip) {
                item.remove();
            }
        });
    }

    // Flash taskbar item (for notifications)
    flashTaskbarItem(windowId, duration = 3000) {
        const taskbarItem = this.taskbarItems.get(windowId);
        if (!taskbarItem) return;

        taskbarItem.classList.add('flashing');
        
        setTimeout(() => {
            taskbarItem.classList.remove('flashing');
        }, duration);
    }

    // Get taskbar height
    getTaskbarHeight() {
        const taskbar = document.querySelector('.win95-taskbar');
        return taskbar ? taskbar.offsetHeight : 28;
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = TaskbarManager;
} else {
    window.TaskbarManager = TaskbarManager;
}
