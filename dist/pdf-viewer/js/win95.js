class Win95Window {
    constructor() {
        this.window = document.querySelector('.window');
        this.titleBar = document.querySelector('.title-bar');
        this.controls = document.querySelectorAll('.title-bar-controls button');
        this.menuItems = document.querySelectorAll('.menu-bar-item');
        
        this.isDragging = false;
        this.dragOffset = { x: 0, y: 0 };
        this.isMaximized = false;
        this.previousState = null;

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Window dragging
        this.titleBar.addEventListener('mousedown', this.startDragging.bind(this));
        document.addEventListener('mousemove', this.drag.bind(this));
        document.addEventListener('mouseup', this.stopDragging.bind(this));

        // Window controls
        this.controls.forEach((button, index) => {
            button.addEventListener('click', () => {
                switch(index) {
                    case 0: this.minimize(); break;
                    case 1: this.maximize(); break;
                    case 2: this.close(); break;
                }
            });
        });

        // Menu handling
        this.menuItems.forEach(item => {
            item.addEventListener('click', this.handleMenuClick.bind(this));
            item.addEventListener('mouseover', this.handleMenuHover.bind(this));
        });

        // Close any open menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.menu-bar')) {
                this.closeAllMenus();
            }
        });
    }

    startDragging(e) {
        if (this.isMaximized) return;
        
        this.isDragging = true;
        const rect = this.window.getBoundingClientRect();
        this.dragOffset = {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    drag(e) {
        if (!this.isDragging) return;

        const newX = e.clientX - this.dragOffset.x;
        const newY = e.clientY - this.dragOffset.y;

        this.window.style.left = `${newX}px`;
        this.window.style.top = `${newY}px`;
    }

    stopDragging() {
        this.isDragging = false;
    }

    minimize() {
        // Animation for minimize effect
        this.window.style.transform = 'scale(0.1)';
        this.window.style.opacity = '0';
        setTimeout(() => {
            this.window.style.display = 'none';
            this.window.style.transform = '';
            this.window.style.opacity = '';
        }, 200);
    }

    maximize() {
        if (this.isMaximized) {
            // Restore previous state
            Object.assign(this.window.style, this.previousState);
            this.isMaximized = false;
        } else {
            // Save current state
            this.previousState = {
                width: this.window.style.width,
                height: this.window.style.height,
                left: this.window.style.left,
                top: this.window.style.top
            };

            // Maximize
            this.window.style.width = '100vw';
            this.window.style.height = '100vh';
            this.window.style.left = '0';
            this.window.style.top = '0';
            this.window.style.margin = '0';
            this.isMaximized = true;
        }
    }

    close() {
        // Animation for close effect
        this.window.style.transform = 'scale(0.9)';
        this.window.style.opacity = '0';
        setTimeout(() => {
            this.window.style.display = 'none';
        }, 200);
    }

    handleMenuClick(e) {
        const menuItem = e.target;
        this.toggleMenu(menuItem);
    }

    handleMenuHover(e) {
        const menuItem = e.target;
        if (this.hasOpenMenu()) {
            this.closeAllMenus();
            this.toggleMenu(menuItem);
        }
    }

    toggleMenu(menuItem) {
        // Remove any existing menu
        this.removeExistingMenu();

        // Create menu content based on menu item
        const menuContent = this.createMenuContent(menuItem.textContent);
        if (!menuContent) return;

        // Position and show menu
        const rect = menuItem.getBoundingClientRect();
        const menu = document.createElement('div');
        menu.className = 'menu-content';
        menu.style.cssText = `
            position: absolute;
            left: ${rect.left}px;
            top: ${rect.bottom}px;
            background: var(--win95-gray);
            border: 2px solid;
            border-color: var(--win95-light-gray) var(--win95-darker-gray) var(--win95-darker-gray) var(--win95-light-gray);
            box-shadow: 2px 2px 0 0 var(--win95-black);
            z-index: 1000;
        `;

        menu.innerHTML = menuContent;
        document.body.appendChild(menu);

        // Add event listeners to menu items
        menu.querySelectorAll('.menu-item').forEach(item => {
            item.addEventListener('click', () => {
                this.handleMenuItemClick(item.dataset.action);
                this.removeExistingMenu();
            });
        });
    }

    createMenuContent(menuType) {
        switch(menuType) {
            case 'File':
                return `
                    <div class="menu-item" data-action="open">Open...</div>
                    <div class="menu-separator"></div>
                    <div class="menu-item" data-action="print">Print...</div>
                    <div class="menu-separator"></div>
                    <div class="menu-item" data-action="exit">Exit</div>
                `;
            case 'Edit':
                return `
                    <div class="menu-item" data-action="copy">Copy</div>
                    <div class="menu-item" data-action="selectAll">Select All</div>
                    <div class="menu-separator"></div>
                    <div class="menu-item" data-action="find">Find...</div>
                `;
            case 'View':
                return `
                    <div class="menu-item" data-action="zoomIn">Zoom In</div>
                    <div class="menu-item" data-action="zoomOut">Zoom Out</div>
                    <div class="menu-item" data-action="actualSize">Actual Size</div>
                    <div class="menu-separator"></div>
                    <div class="menu-item" data-action="rotateRight">Rotate Right</div>
                    <div class="menu-item" data-action="rotateLeft">Rotate Left</div>
                `;
            case 'Help':
                return `
                    <div class="menu-item" data-action="about">About PDF Viewer</div>
                `;
            default:
                return null;
        }
    }

    handleMenuItemClick(action) {
        // Dispatch custom event for menu actions
        const event = new CustomEvent('menuAction', {
            detail: { action: action }
        });
        document.dispatchEvent(event);
    }

    removeExistingMenu() {
        const existingMenu = document.querySelector('.menu-content');
        if (existingMenu) {
            existingMenu.remove();
        }
    }

    closeAllMenus() {
        this.removeExistingMenu();
    }

    hasOpenMenu() {
        return document.querySelector('.menu-content') !== null;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const win95Window = new Win95Window();
});