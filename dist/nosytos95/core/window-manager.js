// NosytOS95 Window Manager
// Handles window creation, management, dragging, resizing, and focus

class WindowManager {
    constructor() {
        this.windows = new Map();
        this.activeWindow = null;
        this.zIndex = 100;
        this.init();
    }

    init() {
        this.initWindowManagement();
        console.log('Window Manager initialized');
    }

    // Initialize window management for all windows
    initWindowManagement() {
        const windows = document.querySelectorAll('.win95-window');
        
        windows.forEach(window => {
            this.setupWindow(window);
        });
    }

    // Setup individual window functionality
    setupWindow(window) {
        // Set initial z-index
        window.style.zIndex = this.zIndex++;
        
        // Register window
        const windowId = window.id;
        this.windows.set(windowId, {
            element: window,
            isMaximized: false,
            previousState: null
        });

        // Setup window header drag functionality
        this.setupWindowDrag(window);
        
        // Setup window controls
        this.setupWindowControls(window);
        
        // Setup resize functionality
        this.setupWindowResize(window);
        
        // Setup click to focus
        this.setupWindowFocus(window);
    }

    // Setup window dragging
    setupWindowDrag(window) {
        const header = window.querySelector('.window-header');
        if (!header) return;

        header.addEventListener('mousedown', (e) => {
            if (e.target.closest('.window-controls')) return;

            // Bring window to front
            this.bringToFront(window);

            // Start dragging
            const rect = window.getBoundingClientRect();
            const offsetX = e.clientX - rect.left;
            const offsetY = e.clientY - rect.top;

            const moveWindow = (e) => {
                const newX = e.clientX - offsetX;
                const newY = e.clientY - offsetY;
                
                // Keep window within viewport bounds
                const maxX = window.innerWidth - window.offsetWidth;
                const maxY = window.innerHeight - window.offsetHeight;
                
                window.style.left = Math.max(0, Math.min(newX, maxX)) + 'px';
                window.style.top = Math.max(0, Math.min(newY, maxY)) + 'px';
                window.style.transform = 'none';
            };

            const stopMoving = () => {
                document.removeEventListener('mousemove', moveWindow);
                document.removeEventListener('mouseup', stopMoving);
                header.style.cursor = 'move';
            };

            header.style.cursor = 'grabbing';
            document.addEventListener('mousemove', moveWindow);
            document.addEventListener('mouseup', stopMoving);
        });
    }

    // Setup window controls (minimize, maximize, close)
    setupWindowControls(window) {
        const minimizeBtn = window.querySelector('.window-minimize');
        const maximizeBtn = window.querySelector('.window-maximize');
        const closeBtn = window.querySelector('.window-close');

        if (minimizeBtn) {
            minimizeBtn.addEventListener('click', () => this.minimizeWindow(window));
        }

        if (maximizeBtn) {
            maximizeBtn.addEventListener('click', () => this.toggleMaximize(window));
        }

        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.closeWindow(window));
        }
    }

    // Setup window resizing
    setupWindowResize(window) {
        const resizeHandles = window.querySelectorAll('.resize-handle');
        
        resizeHandles.forEach(handle => {
            handle.addEventListener('mousedown', (e) => {
                e.preventDefault();
                e.stopPropagation();

                // Bring window to front
                this.bringToFront(window);

                const rect = window.getBoundingClientRect();
                const startX = e.clientX;
                const startY = e.clientY;
                const startWidth = rect.width;
                const startHeight = rect.height;
                const startLeft = rect.left;
                const startTop = rect.top;

                const direction = handle.className.replace('resize-handle resize-handle-', '');

                const resize = (e) => {
                    let newWidth = startWidth;
                    let newHeight = startHeight;
                    let newLeft = startLeft;
                    let newTop = startTop;

                    // Calculate new dimensions based on direction
                    if (direction.includes('e')) {
                        newWidth = Math.max(200, startWidth + (e.clientX - startX));
                    }
                    if (direction.includes('s')) {
                        newHeight = Math.max(150, startHeight + (e.clientY - startY));
                    }
                    if (direction.includes('w')) {
                        newWidth = Math.max(200, startWidth - (e.clientX - startX));
                        newLeft = startLeft + (startWidth - newWidth);
                    }
                    if (direction.includes('n')) {
                        newHeight = Math.max(150, startHeight - (e.clientY - startY));
                        newTop = startTop + (startHeight - newHeight);
                    }

                    // Apply new dimensions
                    window.style.width = newWidth + 'px';
                    window.style.height = newHeight + 'px';
                    window.style.left = newLeft + 'px';
                    window.style.top = newTop + 'px';
                };

                const stopResizing = () => {
                    document.removeEventListener('mousemove', resize);
                    document.removeEventListener('mouseup', stopResizing);
                };

                document.addEventListener('mousemove', resize);
                document.addEventListener('mouseup', stopResizing);
            });
        });
    }

    // Setup window focus
    setupWindowFocus(window) {
        window.addEventListener('mousedown', () => {
            this.bringToFront(window);
        });
    }

    // Bring window to front
    bringToFront(window) {
        const windows = document.querySelectorAll('.win95-window');
        let maxZ = 0;

        windows.forEach(w => {
            const z = parseInt(w.style.zIndex || 0);
            maxZ = Math.max(maxZ, z);
            w.classList.remove('active');
        });

        window.style.zIndex = maxZ + 1;
        window.classList.add('active');
        this.activeWindow = window;
        
        // Update taskbar
        if (window.taskbarManager) {
            window.taskbarManager.updateTaskbar();
        }
    }

    // Minimize window
    minimizeWindow(window) {
        window.style.display = 'none';
        if (window.taskbarManager) {
            window.taskbarManager.updateTaskbar();
        }
    }

    // Toggle maximize/restore window
    toggleMaximize(window) {
        const windowData = this.windows.get(window.id);
        
        if (windowData.isMaximized) {
            // Restore window
            this.restoreWindow(window);
        } else {
            // Maximize window
            this.maximizeWindow(window);
        }
    }

    // Maximize window
    maximizeWindow(window) {
        const windowData = this.windows.get(window.id);
        
        // Save current state
        windowData.previousState = {
            width: window.style.width,
            height: window.style.height,
            left: window.style.left,
            top: window.style.top,
            transform: window.style.transform
        };

        // Maximize
        window.style.width = '100%';
        window.style.height = 'calc(100% - 28px)';
        window.style.left = '0';
        window.style.top = '0';
        window.style.transform = 'none';
        
        windowData.isMaximized = true;
        window.classList.add('maximized');
    }

    // Restore window
    restoreWindow(window) {
        const windowData = this.windows.get(window.id);
        
        if (windowData.previousState) {
            window.style.width = windowData.previousState.width || '400px';
            window.style.height = windowData.previousState.height || '300px';
            window.style.left = windowData.previousState.left || '50%';
            window.style.top = windowData.previousState.top || '50%';
            window.style.transform = windowData.previousState.transform || 'translate(-50%, -50%)';
        }
        
        windowData.isMaximized = false;
        window.classList.remove('maximized');
    }

    // Close window
    closeWindow(window) {
        window.style.display = 'none';
        if (window.taskbarManager) {
            window.taskbarManager.updateTaskbar();
        }
    }

    // Open application window
    openWindow(windowId) {
        const window = document.getElementById(windowId);
        if (!window) return false;

        window.style.display = 'flex';
        this.bringToFront(window);
        
        return true;
    }

    // Get active window
    getActiveWindow() {
        return this.activeWindow;
    }

    // Get all windows
    getAllWindows() {
        return Array.from(this.windows.values()).map(w => w.element);
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = WindowManager;
} else {
    window.WindowManager = WindowManager;
}
