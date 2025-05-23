/**
 * NosytOS95 File Explorer
 * Handles the UI for the Windows 95 style file system
 */

class NosytFileExplorer {
  constructor() {
    this.currentPath = 'C:\\';
    this.selectedItems = new Set();
    this.draggedItem = null;
    this.clipboard = null;
    this.initialized = false;
  }

  /**
   * Initialize the file explorer
   */
  init() {
    if (this.initialized) return;

    // Listen for file system events
    NosytFS.addEventListener('fileSystemChanged', () => this.refreshView());

    // Initialize context menus
    this.initContextMenus();

    // Initialize drag and drop
    this.initDragAndDrop();

    // Set up keyboard shortcuts
    this.initKeyboardShortcuts();

    // Mark as initialized
    this.initialized = true;

    // Initial view refresh
    this.refreshView();
  }

  /**
   * Initialize context menus
   */
  initContextMenus() {
    // Desktop context menu
    const desktopContextMenu = document.createElement('div');
    desktopContextMenu.className = 'win95-context-menu';
    desktopContextMenu.innerHTML = `
      <div class="menu-item" data-action="new-folder">
        <img src="/images/win95/folder-new.png" alt="New Folder">
        New Folder
      </div>
      <div class="menu-item" data-action="new-file">
        <img src="/images/win95/text-file.png" alt="New File">
        New Text Document
      </div>
      <div class="menu-separator"></div>
      <div class="menu-item" data-action="paste">
        <img src="/images/win95/paste.png" alt="Paste">
        Paste
      </div>
      <div class="menu-separator"></div>
      <div class="menu-item" data-action="refresh">
        <img src="/images/win95/refresh.png" alt="Refresh">
        Refresh
      </div>
    `;

    // File/folder context menu
    const itemContextMenu = document.createElement('div');
    itemContextMenu.className = 'win95-context-menu';
    itemContextMenu.innerHTML = `
      <div class="menu-item" data-action="open">
        <img src="/images/win95/open.png" alt="Open">
        Open
      </div>
      <div class="menu-separator"></div>
      <div class="menu-item" data-action="cut">
        <img src="/images/win95/cut.png" alt="Cut">
        Cut
      </div>
      <div class="menu-item" data-action="copy">
        <img src="/images/win95/copy.png" alt="Copy">
        Copy
      </div>
      <div class="menu-item" data-action="delete">
        <img src="/images/win95/delete.png" alt="Delete">
        Delete
      </div>
      <div class="menu-separator"></div>
      <div class="menu-item" data-action="rename">
        <img src="/images/win95/rename.png" alt="Rename">
        Rename
      </div>
      <div class="menu-separator"></div>
      <div class="menu-item" data-action="properties">
        <img src="/images/win95/properties.png" alt="Properties">
        Properties
      </div>
    `;

    document.body.appendChild(desktopContextMenu);
    document.body.appendChild(itemContextMenu);

    // Handle context menu actions
    this.setupContextMenuHandlers(desktopContextMenu, itemContextMenu);
  }

  /**
   * Set up context menu event handlers
   */
  setupContextMenuHandlers(desktopMenu, itemMenu) {
    // Desktop context menu handler
    document.addEventListener('contextmenu', (e) => {
      const target = e.target.closest('.folder-grid');
      if (target) {
        e.preventDefault();
        this.showContextMenu(desktopMenu, e.clientX, e.clientY);
      }
    });

    // File/folder context menu handler
    document.addEventListener('contextmenu', (e) => {
      const target = e.target.closest('.folder-item');
      if (target) {
        e.preventDefault();
        this.selectedItems.clear();
        this.selectedItems.add(target.dataset.path);
        this.showContextMenu(itemMenu, e.clientX, e.clientY);
      }
    });

    // Handle menu item clicks
    document.addEventListener('click', (e) => {
      const menuItem = e.target.closest('.menu-item');
      if (menuItem) {
        const action = menuItem.dataset.action;
        this.handleContextMenuAction(action);
        this.hideContextMenus();
      }
    });

    // Hide menus when clicking outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.win95-context-menu')) {
        this.hideContextMenus();
      }
    });
  }

  /**
   * Handle context menu actions
   */
  handleContextMenuAction(action) {
    switch (action) {
      case 'new-folder':
        this.createNewFolder();
        break;
      case 'new-file':
        this.createNewFile();
        break;
      case 'cut':
        this.cutSelection();
        break;
      case 'copy':
        this.copySelection();
        break;
      case 'paste':
        this.pasteFromClipboard();
        break;
      case 'delete':
        this.deleteSelection();
        break;
      case 'rename':
        this.renameSelection();
        break;
      case 'properties':
        this.showProperties();
        break;
      case 'refresh':
        this.refreshView();
        break;
    }
  }

  /**
   * Initialize drag and drop functionality
   */
  initDragAndDrop() {
    document.addEventListener('dragstart', (e) => {
      const item = e.target.closest('.folder-item');
      if (item) {
        this.draggedItem = item.dataset.path;
        e.dataTransfer.setData('text/plain', item.dataset.path);
        e.dataTransfer.effectAllowed = 'move';
      }
    });

    document.addEventListener('dragover', (e) => {
      const target = e.target.closest('.folder-item');
      if (target && target.dataset.type === 'directory') {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
      }
    });

    document.addEventListener('drop', (e) => {
      const target = e.target.closest('.folder-item');
      if (target && target.dataset.type === 'directory') {
        e.preventDefault();
        const sourcePath = this.draggedItem;
        const targetPath = target.dataset.path;
        if (sourcePath && targetPath) {
          try {
            NosytFS.move(sourcePath, targetPath + '\\' + sourcePath.split('\\').pop());
          } catch (error) {
            this.showError(error.message);
          }
        }
      }
      this.draggedItem = null;
    });
  }

  /**
   * Initialize keyboard shortcuts
   */
  initKeyboardShortcuts() {
    document.addEventListener('keydown', (e) => {
      if (!e.target.closest('.folder-grid')) return;

      // Delete
      if (e.key === 'Delete' && this.selectedItems.size > 0) {
        this.deleteSelection();
      }

      // Ctrl + X (Cut)
      if (e.ctrlKey && e.key === 'x' && this.selectedItems.size > 0) {
        this.cutSelection();
      }

      // Ctrl + C (Copy)
      if (e.ctrlKey && e.key === 'c' && this.selectedItems.size > 0) {
        this.copySelection();
      }

      // Ctrl + V (Paste)
      if (e.ctrlKey && e.key === 'v' && this.clipboard) {
        this.pasteFromClipboard();
      }

      // F2 (Rename)
      if (e.key === 'F2' && this.selectedItems.size === 1) {
        this.renameSelection();
      }
    });
  }

  /**
   * Refresh the current view
   */
  refreshView() {
    const container = document.querySelector('.folder-grid');
    if (!container) return;

    try {
      const contents = NosytFS.getDirectoryContents(this.currentPath);
      container.innerHTML = '';

      for (const [name, item] of Object.entries(contents)) {
        const itemElement = document.createElement('div');
        itemElement.className = 'folder-item';
        itemElement.dataset.path = this.currentPath + '\\' + name;
        itemElement.dataset.type = item.type;

        const icon = item.type === 'directory' ? 
          NosytFS.iconMapping.directory : 
          NosytFS.getFileIcon(name);

        itemElement.innerHTML = `
          <img src="${icon}" alt="${item.type}">
          <span class="item-name">${name}</span>
        `;

        container.appendChild(itemElement);
      }
    } catch (error) {
      this.showError(error.message);
    }
  }

  /**
   * Show an error message
   */
  showError(message) {
    const error = document.createElement('div');
    error.className = 'win95-error';
    error.innerHTML = `
      <div class="error-header">
        <img src="/images/win95/error.png" alt="Error">
        <span>Error</span>
      </div>
      <div class="error-content">
        ${message}
      </div>
      <div class="error-buttons">
        <button class="win95-button">OK</button>
      </div>
    `;

    document.body.appendChild(error);

    error.querySelector('button').addEventListener('click', () => {
      error.remove();
    });
  }
}

// Create global instance
window.NosytExplorer = new NosytFileExplorer();

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  setTimeout(() => window.NosytExplorer.init(), 1000);
});