/**
 * Windows 95 Dialog Manager
 * Handles system dialogs including:
 * - Find Files/Folders
 * - Run Program
 * - Shutdown Options
 * - Properties
 */

const DialogManager = {
    activeDialogs: new Map(),
    zIndexBase: 1000,
    templates: {
        find: `
            <div class="dialog-content">
                <div class="dialog-row">
                    <label for="find-name">Search for:</label>
                    <input type="text" id="find-name" class="win95-input">
                </div>
                <div class="dialog-row">
                    <label for="find-location">Look in:</label>
                    <select id="find-location" class="win95-select">
                        <option value="c">Local Disk (C:)</option>
                        <option value="desktop">Desktop</option>
                        <option value="documents">My Documents</option>
                    </select>
                </div>
                <div class="dialog-options">
                    <label><input type="checkbox" checked> Include subfolders</label>
                    <label><input type="checkbox"> Case sensitive</label>
                </div>
                <div class="dialog-buttons">
                    <button class="win95-button" data-action="find">Find Now</button>
                    <button class="win95-button" data-action="close">Cancel</button>
                </div>
            </div>
        `,
        run: `
            <div class="dialog-content">
                <div class="dialog-row">
                    <label for="run-command">Open:</label>
                    <input type="text" id="run-command" class="win95-input" style="width: 250px">
                </div>
                <div class="dialog-buttons">
                    <button class="win95-button" data-action="run">OK</button>
                    <button class="win95-button" data-action="close">Cancel</button>
                    <button class="win95-button" data-action="browse">Browse...</button>
                </div>
            </div>
        `,
        shutdown: `
            <div class="dialog-content">
                <div class="dialog-message">
                    <p>What do you want the computer to do?</p>
                </div>
                <div class="dialog-options shutdown-options">
                    <label><input type="radio" name="shutdown-option" value="shutdown" checked> Shut down</label>
                    <label><input type="radio" name="shutdown-option" value="restart"> Restart</label>
                    <label><input type="radio" name="shutdown-option" value="dos"> Restart in MS-DOS mode</label>
                </div>
                <div class="dialog-buttons">
                    <button class="win95-button" data-action="confirm">OK</button>
                    <button class="win95-button" data-action="close">Cancel</button>
                </div>
            </div>
        `
    },

    init() {
        // Listen for dialog open requests
        window.addEventListener('openDialog', (e) => this.openDialog(e.detail));
        
        // Handle global click events for dialog focus
        document.addEventListener('mousedown', (e) => this.handleGlobalClick(e));
    },

    openDialog({ type, title, icon, options = {} }) {
        const dialogId = `${type}-dialog-${Date.now()}`;
        const dialog = document.createElement('div');
        dialog.id = dialogId;
        dialog.className = 'win95-dialog';
        dialog.style.zIndex = this.getNextZIndex();

        dialog.innerHTML = `
            <div class="dialog-title-bar">
                <img src="/images/win95/${icon}" alt="${title}" class="dialog-icon">
                <span class="dialog-title">${title}</span>
                <button class="dialog-close" data-action="close">×</button>
            </div>
            ${this.templates[type]}
        `;

        // Add to document
        document.body.appendChild(dialog);
        this.activeDialogs.set(dialogId, { type, options });

        // Center dialog
        this.centerDialog(dialog);

        // Setup event handlers
        this.setupDialogEvents(dialog);

        // Make draggable
        this.makeDraggable(dialog);

        // Focus first input if exists
        const firstInput = dialog.querySelector('input, select');
        if (firstInput) {
            firstInput.focus();
        }

        return dialogId;
    },

    centerDialog(dialog) {
        const rect = dialog.getBoundingClientRect();
        dialog.style.left = `${(window.innerWidth - rect.width) / 2}px`;
        dialog.style.top = `${(window.innerHeight - rect.height) / 3}px`;
    },

    setupDialogEvents(dialog) {
        dialog.addEventListener('click', (e) => {
            const action = e.target.getAttribute('data-action');
            if (action) {
                this.handleDialogAction(action, dialog);
            }
        });

        // Prevent clicks inside dialog from bubbling
        dialog.addEventListener('mousedown', (e) => {
            e.stopPropagation();
            this.bringToFront(dialog);
        });
    },

    handleDialogAction(action, dialog) {
        const dialogInfo = this.activeDialogs.get(dialog.id);
        if (!dialogInfo) return;

        switch (action) {
            case 'close':
                this.closeDialog(dialog.id);
                break;

            case 'find':
                const searchTerm = dialog.querySelector('#find-name').value;
                const location = dialog.querySelector('#find-location').value;
                this.handleFind(searchTerm, location);
                break;

            case 'run':
                const command = dialog.querySelector('#run-command').value;
                this.handleRun(command);
                break;

            case 'confirm':
                if (dialogInfo.type === 'shutdown') {
                    const option = dialog.querySelector('input[name="shutdown-option"]:checked').value;
                    this.handleShutdown(option);
                }
                break;

            case 'browse':
                this.handleBrowse(dialog);
                break;
        }
    },

    handleFind(searchTerm, location) {
        // Dispatch search event
        const event = new CustomEvent('startSearch', {
            detail: { searchTerm, location }
        });
        window.dispatchEvent(event);
    },

    handleRun(command) {
        // Dispatch run command event
        const event = new CustomEvent('runCommand', {
            detail: { command }
        });
        window.dispatchEvent(event);
    },

    handleShutdown(option) {
        // Dispatch shutdown event
        const event = new CustomEvent('systemShutdown', {
            detail: { option }
        });
        window.dispatchEvent(event);
    },

    handleBrowse(dialog) {
        // Open file browser dialog
        const event = new CustomEvent('openFileBrowser', {
            detail: {
                callback: (path) => {
                    const input = dialog.querySelector('#run-command');
                    if (input) {
                        input.value = path;
                    }
                }
            }
        });
        window.dispatchEvent(event);
    },

    closeDialog(dialogId) {
        const dialog = document.getElementById(dialogId);
        if (dialog) {
            dialog.remove();
            this.activeDialogs.delete(dialogId);
        }
    },

    makeDraggable(dialog) {
        const titleBar = dialog.querySelector('.dialog-title-bar');
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        titleBar.addEventListener('mousedown', (e) => {
            if (e.target !== titleBar) return;
            
            isDragging = true;
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
            
            dialog.style.cursor = 'move';
        });

        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;

            e.preventDefault();
            
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            xOffset = currentX;
            yOffset = currentY;

            dialog.style.transform = `translate(${currentX}px, ${currentY}px)`;
        });

        document.addEventListener('mouseup', () => {
            if (!isDragging) return;
            
            isDragging = false;
            dialog.style.cursor = 'default';
        });
    },

    bringToFront(dialog) {
        dialog.style.zIndex = this.getNextZIndex();
    },

    getNextZIndex() {
        return this.zIndexBase++;
    },

    handleGlobalClick(e) {
        // Check if click was outside all dialogs
        let clickedDialog = false;
        this.activeDialogs.forEach((info, dialogId) => {
            const dialog = document.getElementById(dialogId);
            if (dialog && dialog.contains(e.target)) {
                clickedDialog = true;
            }
        });

        if (!clickedDialog) {
            // Click was outside, bring last active dialog to front
            const dialogs = Array.from(this.activeDialogs.keys());
            if (dialogs.length > 0) {
                const lastDialog = document.getElementById(dialogs[dialogs.length - 1]);
                if (lastDialog) {
                    this.bringToFront(lastDialog);
                }
            }
        }
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    DialogManager.init();
});

// Export for use in other modules
export default DialogManager;