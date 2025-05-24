/**
 * NosytOS95 File Explorer
 * Handles file explorer functionality for the NosytOS95 interface
 */

document.addEventListener('DOMContentLoaded', () => {
  // File explorer variables
  let currentPath = ['C:'];
  let clipboardItems = [];
  let clipboardOperation = ''; // 'cut' or 'copy'
  let viewMode = 'icons'; // 'icons', 'list', 'details'
  let sortBy = 'name'; // 'name', 'type', 'size', 'date'
  let sortDirection = 'asc'; // 'asc' or 'desc'

  // Initialize file explorer
  function initFileExplorer() {
    // Get file explorer elements
    const fileExplorerWindow = document.getElementById('file-explorer-window');
    if (!fileExplorerWindow) return;

    const folderGrid = fileExplorerWindow.querySelector('.folder-grid');
    const addressInput = fileExplorerWindow.querySelector('.address-input');
    const backButton = fileExplorerWindow.querySelector('.toolbar-button:nth-child(1)');
    const forwardButton = fileExplorerWindow.querySelector('.toolbar-button:nth-child(2)');
    const upButton = fileExplorerWindow.querySelector('.toolbar-button:nth-child(3)');
    const cutButton = fileExplorerWindow.querySelector('.toolbar-button:nth-child(5)');
    const copyButton = fileExplorerWindow.querySelector('.toolbar-button:nth-child(6)');
    const pasteButton = fileExplorerWindow.querySelector('.toolbar-button:nth-child(7)');
    const deleteButton = fileExplorerWindow.querySelector('.toolbar-button:nth-child(9)');
    const propertiesButton = fileExplorerWindow.querySelector('.toolbar-button:nth-child(10)');

    // Initialize navigation history
    const navigationHistory = {
      history: [['C:']],
      currentIndex: 0,
      
      // Add path to history
      add(path) {
        // Remove forward history if navigating from middle
        if (this.currentIndex < this.history.length - 1) {
          this.history = this.history.slice(0, this.currentIndex + 1);
        }
        
        // Add new path
        this.history.push([...path]);
        this.currentIndex = this.history.length - 1;
        
        // Update navigation buttons
        updateNavigationButtons();
      },
      
      // Go back in history
      back() {
        if (this.currentIndex > 0) {
          this.currentIndex--;
          return [...this.history[this.currentIndex]];
        }
        return null;
      },
      
      // Go forward in history
      forward() {
        if (this.currentIndex < this.history.length - 1) {
          this.currentIndex++;
          return [...this.history[this.currentIndex]];
        }
        return null;
      },
      
      // Check if can go back
      canGoBack() {
        return this.currentIndex > 0;
      },
      
      // Check if can go forward
      canGoForward() {
        return this.currentIndex < this.history.length - 1;
      }
    };

    // Update navigation buttons
    function updateNavigationButtons() {
      if (backButton) {
        backButton.classList.toggle('disabled', !navigationHistory.canGoBack());
      }
      
      if (forwardButton) {
        forwardButton.classList.toggle('disabled', !navigationHistory.canGoForward());
      }
      
      if (upButton) {
        upButton.classList.toggle('disabled', currentPath.length <= 1);
      }
    }

    // Navigate to folder
    function navigateToFolder(path, addToHistory = true) {
      // Update current path
      currentPath = [...path];
      
      // Add to history if needed
      if (addToHistory) {
        navigationHistory.add(currentPath);
      }
      
      // Update file explorer
      updateFileExplorer();
      
      // Update navigation buttons
      updateNavigationButtons();
    }

    // Update file explorer with current folder contents
    function updateFileExplorer() {
      if (!folderGrid) return;
      
      // Clear current contents
      folderGrid.innerHTML = '';
      
      // Get folder contents from file system
      const folderContents = window.NosytFileSystem.getContentsAtPath(currentPath);
      
      // Add parent folder if not at root
      if (currentPath.length > 1) {
        const parentItem = document.createElement('div');
        parentItem.className = 'folder-item';
        parentItem.setAttribute('data-path', '..');
        parentItem.setAttribute('data-type', 'parent');
        parentItem.innerHTML = `
          <img src="/images/win95/folder-parent.png" alt="Parent Folder">
          <span>Parent Folder</span>
        `;
        folderGrid.appendChild(parentItem);
      }
      
      // Sort folder contents
      const sortedContents = sortFolderContents(folderContents);
      
      // Add folder contents
      sortedContents.forEach(item => {
        const folderItem = document.createElement('div');
        folderItem.className = 'folder-item';
        folderItem.setAttribute('data-path', item.name);
        folderItem.setAttribute('data-type', item.type);
        folderItem.innerHTML = `
          <img src="${item.icon}" alt="${item.name}">
          <span>${item.name}</span>
        `;
        folderGrid.appendChild(folderItem);
      });
      
      // Update window title
      const windowTitle = fileExplorerWindow.querySelector('.window-title span');
      if (windowTitle) {
        windowTitle.textContent = currentPath.join('\\');
      }
      
      // Update address bar
      if (addressInput) {
        addressInput.value = currentPath.join('\\');
      }
      
      // Update status bar
      const statusBar = fileExplorerWindow.querySelector('.window-statusbar span');
      if (statusBar) {
        statusBar.textContent = `${sortedContents.length} object(s)`;
      }
    }

    // Sort folder contents
    function sortFolderContents(contents) {
      // Convert object to array
      const contentsArray = Object.keys(contents).map(key => ({
        name: key,
        ...contents[key]
      }));
      
      // Sort by type first (folders before files)
      contentsArray.sort((a, b) => {
        // Folders first
        if (a.type === 'folder' && b.type !== 'folder') return -1;
        if (a.type !== 'folder' && b.type === 'folder') return 1;
        
        // Then sort by selected criteria
        switch (sortBy) {
          case 'name':
            return sortDirection === 'asc' 
              ? a.name.localeCompare(b.name) 
              : b.name.localeCompare(a.name);
          case 'type':
            return sortDirection === 'asc' 
              ? a.type.localeCompare(b.type) 
              : b.type.localeCompare(a.type);
          case 'size':
            const aSize = a.size ? parseInt(a.size) : 0;
            const bSize = b.size ? parseInt(b.size) : 0;
            return sortDirection === 'asc' ? aSize - bSize : bSize - aSize;
          case 'date':
            const aDate = a.created ? new Date(a.created) : new Date(0);
            const bDate = b.created ? new Date(b.created) : new Date(0);
            return sortDirection === 'asc' ? aDate - bDate : bDate - aDate;
          default:
            return 0;
        }
      });
      
      return contentsArray;
    }

    // Handle folder item click
    function handleFolderItemClick(e) {
      const folderItem = e.target.closest('.folder-item');
      if (!folderItem) return;
      
      const path = folderItem.getAttribute('data-path');
      const type = folderItem.getAttribute('data-type');
      
      // Handle parent folder
      if (path === '..') {
        if (currentPath.length > 1) {
          const newPath = [...currentPath];
          newPath.pop();
          navigateToFolder(newPath);
        }
        return;
      }
      
      // Handle folder
      if (type === 'folder' || type === 'drive') {
        const newPath = [...currentPath, path];
        navigateToFolder(newPath);
        return;
      }
      
      // Handle file
      if (type === 'file' || type === 'text') {
        openFile(path);
        return;
      }
      
      // Handle application
      if (type === 'application') {
        runApplication(path);
        return;
      }
    }

    // Open file
    function openFile(fileName) {
      const file = window.NosytFileSystem.getItemAtPath([...currentPath, fileName]);
      if (!file) return;
      
      // Handle text file
      if (file.type === 'text') {
        const notepadWindow = document.getElementById('notepad-window');
        if (notepadWindow) {
          const notepadContent = notepadWindow.querySelector('.notepad-content');
          if (notepadContent) {
            notepadContent.value = file.content;
          }
          
          const windowTitle = notepadWindow.querySelector('.window-title span');
          if (windowTitle) {
            windowTitle.textContent = `${file.name} - Notepad`;
          }
          
          // Show notepad window
          notepadWindow.style.display = 'block';
          
          // Activate window
          const event = new CustomEvent('activateWindow', { detail: notepadWindow });
          document.dispatchEvent(event);
        }
      }
    }

    // Run application
    function runApplication(appName) {
      const app = window.NosytFileSystem.getItemAtPath([...currentPath, appName]);
      if (!app || app.type !== 'application') return;
      
      // Execute application action
      if (app.action && typeof window[app.action] === 'function') {
        window[app.action]();
      }
    }

    // Handle navigation buttons
    if (backButton) {
      backButton.addEventListener('click', () => {
        const previousPath = navigationHistory.back();
        if (previousPath) {
          navigateToFolder(previousPath, false);
        }
      });
    }
    
    if (forwardButton) {
      forwardButton.addEventListener('click', () => {
        const nextPath = navigationHistory.forward();
        if (nextPath) {
          navigateToFolder(nextPath, false);
        }
      });
    }
    
    if (upButton) {
      upButton.addEventListener('click', () => {
        if (currentPath.length > 1) {
          const newPath = [...currentPath];
          newPath.pop();
          navigateToFolder(newPath);
        }
      });
    }

    // Handle clipboard operations
    if (cutButton) {
      cutButton.addEventListener('click', () => {
        const selectedItems = Array.from(folderGrid.querySelectorAll('.folder-item.selected'));
        if (selectedItems.length === 0) return;
        
        clipboardItems = selectedItems.map(item => item.getAttribute('data-path'));
        clipboardOperation = 'cut';
      });
    }
    
    if (copyButton) {
      copyButton.addEventListener('click', () => {
        const selectedItems = Array.from(folderGrid.querySelectorAll('.folder-item.selected'));
        if (selectedItems.length === 0) return;
        
        clipboardItems = selectedItems.map(item => item.getAttribute('data-path'));
        clipboardOperation = 'copy';
      });
    }
    
    if (pasteButton) {
      pasteButton.addEventListener('click', () => {
        if (clipboardItems.length === 0) return;
        
        // Implement paste functionality
        // This would involve copying or moving files in the file system
      });
    }

    // Handle delete button
    if (deleteButton) {
      deleteButton.addEventListener('click', () => {
        const selectedItems = Array.from(folderGrid.querySelectorAll('.folder-item.selected'));
        if (selectedItems.length === 0) return;
        
        // Implement delete functionality
        // This would involve removing files from the file system
      });
    }

    // Handle properties button
    if (propertiesButton) {
      propertiesButton.addEventListener('click', () => {
        const selectedItems = Array.from(folderGrid.querySelectorAll('.folder-item.selected'));
        if (selectedItems.length !== 1) return;
        
        const itemPath = selectedItems[0].getAttribute('data-path');
        showProperties(itemPath);
      });
    }

    // Show properties dialog
    function showProperties(itemPath) {
      const item = window.NosytFileSystem.getItemAtPath([...currentPath, itemPath]);
      if (!item) return;
      
      const propertiesWindow = document.getElementById('properties-window');
      if (!propertiesWindow) return;
      
      // Update properties window
      const itemIcon = propertiesWindow.querySelector('.properties-icon img');
      if (itemIcon) {
        itemIcon.src = item.icon;
        itemIcon.alt = item.name;
      }
      
      const itemType = propertiesWindow.querySelector('.item-type');
      if (itemType) {
        itemType.textContent = item.type === 'folder' ? 'File Folder' : 
                              item.type === 'drive' ? 'Local Disk' :
                              item.type === 'text' ? 'Text Document' :
                              item.type === 'application' ? 'Application' : 'File';
      }
      
      const itemLocation = propertiesWindow.querySelector('.item-location');
      if (itemLocation) {
        itemLocation.textContent = currentPath.join('\\');
      }
      
      const itemSize = propertiesWindow.querySelector('.item-size');
      if (itemSize) {
        itemSize.textContent = item.size || '0 bytes';
      }
      
      const itemCreated = propertiesWindow.querySelector('.item-created');
      if (itemCreated) {
        itemCreated.textContent = item.created || '5/16/2025 4:54 PM';
      }
      
      // Show properties window
      propertiesWindow.style.display = 'block';
      
      // Activate window
      const event = new CustomEvent('activateWindow', { detail: propertiesWindow });
      document.dispatchEvent(event);
    }

    // Add event listeners
    if (folderGrid) {
      folderGrid.addEventListener('click', handleFolderItemClick);
      
      // Add double-click handler
      folderGrid.addEventListener('dblclick', (e) => {
        const folderItem = e.target.closest('.folder-item');
        if (!folderItem) return;
        
        const path = folderItem.getAttribute('data-path');
        const type = folderItem.getAttribute('data-type');
        
        // Handle parent folder
        if (path === '..') {
          if (currentPath.length > 1) {
            const newPath = [...currentPath];
            newPath.pop();
            navigateToFolder(newPath);
          }
          return;
        }
        
        // Handle folder
        if (type === 'folder' || type === 'drive') {
          const newPath = [...currentPath, path];
          navigateToFolder(newPath);
          return;
        }
        
        // Handle file
        if (type === 'file' || type === 'text') {
          openFile(path);
          return;
        }
        
        // Handle application
        if (type === 'application') {
          runApplication(path);
          return;
        }
      });
      
      // Add selection handling
      folderGrid.addEventListener('mousedown', (e) => {
        const folderItem = e.target.closest('.folder-item');
        if (!folderItem) {
          // Clear selection if clicking on empty space
          folderGrid.querySelectorAll('.folder-item.selected').forEach(item => {
            item.classList.remove('selected');
          });
          return;
        }
        
        // Handle selection with Ctrl key
        if (e.ctrlKey) {
          folderItem.classList.toggle('selected');
        } else {
          // Clear previous selection
          folderGrid.querySelectorAll('.folder-item.selected').forEach(item => {
            item.classList.remove('selected');
          });
          
          // Select current item
          folderItem.classList.add('selected');
        }
      });
    }

    // Initialize file explorer
    updateFileExplorer();
    updateNavigationButtons();
  }

  // Initialize file explorer when window is loaded
  window.addEventListener('load', initFileExplorer);
});
