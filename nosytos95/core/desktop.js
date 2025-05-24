// NosytOS95 Desktop Manager
// Handles desktop icons, wallpaper, and desktop interactions

class DesktopManager {
    constructor(windowManager, startMenuManager) {
        this.windowManager = windowManager;
        this.startMenuManager = startMenuManager;
        this.desktopIcons = new Map();
        this.selectedIcons = new Set();
        this.init();
    }

    init() {
        this.initDesktop();
        this.initDesktopIcons();
        this.initContextMenu();
        console.log('Desktop Manager initialized');
    }

    // Initialize desktop functionality
    initDesktop() {
        const desktop = document.querySelector('.win95-desktop');
        if (!desktop) return;

        // Desktop click handler (deselect icons)
        desktop.addEventListener('click', (e) => {
            if (e.target === desktop) {
                this.deselectAllIcons();
            }
        });

        // Desktop right-click context menu
        desktop.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            this.showDesktopContextMenu(e.clientX, e.clientY);
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            this.handleKeyboardShortcuts(e);
        });
    }

    // Initialize desktop icons
    initDesktopIcons() {
        const icons = document.querySelectorAll('.desktop-icon');
        
        icons.forEach(icon => {
            this.setupDesktopIcon(icon);
        });

        // Register default icons
        this.registerDefaultIcons();
    }

    // Setup individual desktop icon
    setupDesktopIcon(icon) {
        const iconId = icon.dataset.app;
        if (!iconId) return;

        // Store icon reference
        this.desktopIcons.set(iconId, icon);

        // Single click to select
        icon.addEventListener('click', (e) => {
            e.stopPropagation();
            this.selectIcon(icon, e.ctrlKey);
        });

        // Double click to open
        icon.addEventListener('dblclick', (e) => {
            e.stopPropagation();
            this.openIcon(icon);
        });

        // Right click context menu
        icon.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.selectIcon(icon, false);
            this.showIconContextMenu(icon, e.clientX, e.clientY);
        });

        // Drag and drop
        this.setupIconDragDrop(icon);
    }

    // Setup icon drag and drop
    setupIconDragDrop(icon) {
        let isDragging = false;
        let dragOffset = { x: 0, y: 0 };

        icon.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return; // Only left mouse button
            
            const rect = icon.getBoundingClientRect();
            dragOffset.x = e.clientX - rect.left;
            dragOffset.y = e.clientY - rect.top;

            const startDrag = (e) => {
                if (!isDragging) {
                    isDragging = true;
                    icon.classList.add('dragging');
                }

                const desktop = document.querySelector('.win95-desktop');
                const desktopRect = desktop.getBoundingClientRect();
                
                let newX = e.clientX - desktopRect.left - dragOffset.x;
                let newY = e.clientY - desktopRect.top - dragOffset.y;

                // Keep icon within desktop bounds
                newX = Math.max(0, Math.min(newX, desktopRect.width - icon.offsetWidth));
                newY = Math.max(0, Math.min(newY, desktopRect.height - icon.offsetHeight));

                icon.style.position = 'absolute';
                icon.style.left = newX + 'px';
                icon.style.top = newY + 'px';
            };

            const stopDrag = () => {
                if (isDragging) {
                    isDragging = false;
                    icon.classList.remove('dragging');
                }
                document.removeEventListener('mousemove', startDrag);
                document.removeEventListener('mouseup', stopDrag);
            };

            document.addEventListener('mousemove', startDrag);
            document.addEventListener('mouseup', stopDrag);
        });
    }

    // Register default desktop icons
    registerDefaultIcons() {
        const defaultIcons = [
            { id: 'my-computer', name: 'My Computer', icon: '/images/win95/computer.png', action: 'explorer' },
            { id: 'recycle-bin', name: 'Recycle Bin', icon: '/images/win95/recycle-bin.png', action: 'recycle-bin' },
            { id: 'network', name: 'Network Neighborhood', icon: '/images/win95/network.png', action: 'network' },
            { id: 'notepad', name: 'Notepad', icon: '/images/win95/notepad.png', action: 'notepad' },
            { id: 'duck-hunt', name: 'Duck Hunt', icon: '/images/win95/duck-hunt.png', action: 'duck-hunt' },
            { id: 'terminal', name: 'Terminal', icon: '/images/win95/utilities-terminal.png', action: 'terminal' },
            { id: 'help', name: 'Help', icon: '/images/win95/help.png', action: 'help' },
            { id: 'do-not-click', name: 'Do Not Click', icon: '/images/win95/folder.png', action: 'do-not-click' },
            { id: 'minesweeper', name: 'Minesweeper', icon: '/images/win95/minesweeper.png', action: 'minesweeper' },
            { id: 'tetris', name: 'Tetris', icon: '/images/win95/tetris.png', action: 'tetris' },
            { id: 'snake', name: 'Snake', icon: '/images/win95/snake.png', action: 'snake' },
            { id: 'calculator', name: 'Calculator', icon: '/images/win95/calculator.png', action: 'calculator' },
            { id: 'solitaire', name: 'Solitaire', icon: '/images/win95/solitaire.png', action: 'solitaire' }
        ];

        // Create missing icons
        defaultIcons.forEach(iconData => {
            if (!this.desktopIcons.has(iconData.id)) {
                this.createDesktopIcon(iconData);
            }
        });
    }

    // Create desktop icon
    createDesktopIcon(iconData) {
        const desktop = document.querySelector('.desktop-icons');
        if (!desktop) return;

        const icon = document.createElement('div');
        icon.className = 'desktop-icon';
        icon.dataset.app = iconData.action;

        const img = document.createElement('img');
        img.src = iconData.icon;
        img.alt = iconData.name;
        img.className = 'icon-img';

        const text = document.createElement('span');
        text.className = 'icon-text';
        text.textContent = iconData.name;

        icon.appendChild(img);
        icon.appendChild(text);
        desktop.appendChild(icon);

        this.setupDesktopIcon(icon);
    }

    // Select icon
    selectIcon(icon, multiSelect = false) {
        if (!multiSelect) {
            this.deselectAllIcons();
        }

        icon.classList.add('selected');
        this.selectedIcons.add(icon);
    }

    // Deselect all icons
    deselectAllIcons() {
        this.selectedIcons.forEach(icon => {
            icon.classList.remove('selected');
        });
        this.selectedIcons.clear();
    }

    // Open icon
    openIcon(icon) {
        const action = icon.dataset.app;
        if (!action) return;

        // Special actions
        if (action === 'do-not-click') {
            // Rick Roll Easter Egg
            window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
            return;
        }

        if (action === 'my-computer' || action === 'explorer') {
            this.startMenuManager.launchApplication('explorer');
            return;
        }

        if (action === 'recycle-bin') {
            this.showRecycleBin();
            return;
        }

        if (action === 'network') {
            this.showNetworkDialog();
            return;
        }

        // Launch application
        this.startMenuManager.launchApplication(action);
    }

    // Show desktop context menu
    showDesktopContextMenu(x, y) {
        this.hideContextMenus();

        const contextMenu = document.createElement('div');
        contextMenu.className = 'context-menu desktop-context-menu';
        contextMenu.innerHTML = `
            <div class="context-menu-item" data-action="refresh">
                <img src="/images/win95/refresh.png" alt="Refresh">
                <span>Refresh</span>
            </div>
            <div class="context-menu-separator"></div>
            <div class="context-menu-item" data-action="paste">
                <img src="/images/win95/paste.png" alt="Paste">
                <span>Paste</span>
            </div>
            <div class="context-menu-separator"></div>
            <div class="context-menu-item" data-action="new">
                <img src="/images/win95/new.png" alt="New">
                <span>New</span>
                <span class="submenu-arrow">▶</span>
            </div>
            <div class="context-menu-separator"></div>
            <div class="context-menu-item" data-action="properties">
                <img src="/images/win95/properties.png" alt="Properties">
                <span>Properties</span>
            </div>
        `;

        // Position menu
        contextMenu.style.left = x + 'px';
        contextMenu.style.top = y + 'px';

        // Add event handlers
        contextMenu.addEventListener('click', (e) => {
            const item = e.target.closest('.context-menu-item');
            if (item) {
                this.handleDesktopContextAction(item.dataset.action);
                this.hideContextMenus();
            }
        });

        document.body.appendChild(contextMenu);

        // Hide menu on outside click
        setTimeout(() => {
            document.addEventListener('click', () => this.hideContextMenus(), { once: true });
        }, 0);
    }

    // Show icon context menu
    showIconContextMenu(icon, x, y) {
        this.hideContextMenus();

        const contextMenu = document.createElement('div');
        contextMenu.className = 'context-menu icon-context-menu';
        contextMenu.innerHTML = `
            <div class="context-menu-item" data-action="open">
                <img src="/images/win95/open.png" alt="Open">
                <span>Open</span>
            </div>
            <div class="context-menu-separator"></div>
            <div class="context-menu-item" data-action="cut">
                <img src="/images/win95/cut.png" alt="Cut">
                <span>Cut</span>
            </div>
            <div class="context-menu-item" data-action="copy">
                <img src="/images/win95/copy.png" alt="Copy">
                <span>Copy</span>
            </div>
            <div class="context-menu-separator"></div>
            <div class="context-menu-item" data-action="delete">
                <img src="/images/win95/delete.png" alt="Delete">
                <span>Delete</span>
            </div>
            <div class="context-menu-item" data-action="rename">
                <img src="/images/win95/rename.png" alt="Rename">
                <span>Rename</span>
            </div>
            <div class="context-menu-separator"></div>
            <div class="context-menu-item" data-action="properties">
                <img src="/images/win95/properties.png" alt="Properties">
                <span>Properties</span>
            </div>
        `;

        // Position menu
        contextMenu.style.left = x + 'px';
        contextMenu.style.top = y + 'px';

        // Add event handlers
        contextMenu.addEventListener('click', (e) => {
            const item = e.target.closest('.context-menu-item');
            if (item) {
                this.handleIconContextAction(icon, item.dataset.action);
                this.hideContextMenus();
            }
        });

        document.body.appendChild(contextMenu);

        // Hide menu on outside click
        setTimeout(() => {
            document.addEventListener('click', () => this.hideContextMenus(), { once: true });
        }, 0);
    }

    // Hide all context menus
    hideContextMenus() {
        const menus = document.querySelectorAll('.context-menu');
        menus.forEach(menu => menu.remove());
    }

    // Handle desktop context menu actions
    handleDesktopContextAction(action) {
        switch (action) {
            case 'refresh':
                location.reload();
                break;
            case 'paste':
                // Implement paste functionality
                break;
            case 'new':
                // Show new submenu
                break;
            case 'properties':
                this.showDesktopProperties();
                break;
        }
    }

    // Handle icon context menu actions
    handleIconContextAction(icon, action) {
        switch (action) {
            case 'open':
                this.openIcon(icon);
                break;
            case 'cut':
            case 'copy':
                // Implement clipboard functionality
                break;
            case 'delete':
                this.deleteIcon(icon);
                break;
            case 'rename':
                this.renameIcon(icon);
                break;
            case 'properties':
                this.showIconProperties(icon);
                break;
        }
    }

    // Handle keyboard shortcuts
    handleKeyboardShortcuts(e) {
        // Delete key - delete selected icons
        if (e.key === 'Delete' && this.selectedIcons.size > 0) {
            this.selectedIcons.forEach(icon => this.deleteIcon(icon));
        }

        // F2 - rename selected icon
        if (e.key === 'F2' && this.selectedIcons.size === 1) {
            const icon = Array.from(this.selectedIcons)[0];
            this.renameIcon(icon);
        }

        // F5 - refresh desktop
        if (e.key === 'F5') {
            location.reload();
        }

        // Ctrl+A - select all icons
        if (e.ctrlKey && e.key === 'a') {
            e.preventDefault();
            this.selectAllIcons();
        }
    }

    // Select all icons
    selectAllIcons() {
        this.deselectAllIcons();
        this.desktopIcons.forEach(icon => {
            this.selectIcon(icon, true);
        });
    }

    // Delete icon
    deleteIcon(icon) {
        const iconName = icon.querySelector('.icon-text').textContent;
        if (confirm(`Are you sure you want to delete "${iconName}"?`)) {
            icon.remove();
            this.desktopIcons.delete(icon.dataset.app);
            this.selectedIcons.delete(icon);
        }
    }

    // Rename icon
    renameIcon(icon) {
        const textElement = icon.querySelector('.icon-text');
        const currentName = textElement.textContent;
        
        const input = document.createElement('input');
        input.type = 'text';
        input.value = currentName;
        input.className = 'icon-rename-input';
        
        textElement.style.display = 'none';
        icon.appendChild(input);
        
        input.focus();
        input.select();

        const finishRename = () => {
            const newName = input.value.trim();
            if (newName && newName !== currentName) {
                textElement.textContent = newName;
            }
            textElement.style.display = '';
            input.remove();
        };

        input.addEventListener('blur', finishRename);
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                finishRename();
            } else if (e.key === 'Escape') {
                textElement.style.display = '';
                input.remove();
            }
        });
    }

    // Show desktop properties
    showDesktopProperties() {
        // Create and show desktop properties dialog
        console.log('Desktop properties dialog would open here');
    }

    // Show icon properties
    showIconProperties(icon) {
        // Create and show icon properties dialog
        console.log('Icon properties dialog would open here');
    }

    // Show recycle bin
    showRecycleBin() {
        // Create and show recycle bin window
        console.log('Recycle bin would open here');
    }

    // Show network dialog
    showNetworkDialog() {
        // Create and show network neighborhood
        console.log('Network neighborhood would open here');
    }

    // Initialize context menu
    initContextMenu() {
        // Context menu styles are handled in CSS
        // This method can be extended for additional context menu functionality
    }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = DesktopManager;
} else {
    window.DesktopManager = DesktopManager;
}
