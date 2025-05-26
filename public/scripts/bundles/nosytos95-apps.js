/**
 * nosytos95-apps.js - Consolidated Bundle
 * Generated automatically - do not edit directly
 * Generated on: 2025-05-26T03:43:39.980Z
 */


/* ===== notepad.js ===== */
/**
 * NosytOS95 Notepad
 * A simple text editor for the NosytOS95 interface
 */

document.addEventListener('DOMContentLoaded', () => {
  // Notepad variables
  let currentFile = null;
  let unsavedChanges = false;
  
  // Initialize notepad
  function initNotepad() {
    const notepadWindow = document.getElementById('notepad-window');
    if (!notepadWindow) return;
    
    const notepadContent = notepadWindow.querySelector('.notepad-content');
    const menuFile = notepadWindow.querySelector('.menu-file');
    const menuEdit = notepadWindow.querySelector('.menu-edit');
    const menuHelp = notepadWindow.querySelector('.menu-help');
    
    if (!notepadContent) return;
    
    // Set initial content
    notepadContent.value = 'Welcome to NosytOS95 Notepad!\n\n' +
      'This is a simple text editor for the NosytOS95 interface.\n\n' +
      'NosytLabs - Notable Opportunities Shape Your Tomorrow\n\n' +
      'Founded in 2025, NosytLabs is the portfolio site for NOSYT LLC, showcasing our technology projects and services.\n\n' +
      'Our core offerings include:\n' +
      '- Custom web development with React, Astro, and modern frameworks\n' +
      '- Technology content creation on YouTube and Kick.com\n' +
      '- 3D printing services with Creality Ender 3 S1 Pro (FDM) and Elegoo Saturn 2 (resin)\n' +
      '- Educational resources on passive income opportunities\n' +
      '- Open-source GitHub projects and development tools\n\n' +
      '© 2025 NosytLabs. All rights reserved.';
    
    // Track changes
    notepadContent.addEventListener('input', () => {
      unsavedChanges = true;
      updateWindowTitle();
    });
    
    // File menu
    if (menuFile) {
      // Create dropdown
      const fileDropdown = document.createElement('div');
      fileDropdown.className = 'dropdown-menu';
      fileDropdown.innerHTML = `
        <div class="dropdown-item" data-action="new">New</div>
        <div class="dropdown-item" data-action="open">Open...</div>
        <div class="dropdown-item" data-action="save">Save</div>
        <div class="dropdown-item" data-action="save-as">Save As...</div>
        <div class="dropdown-divider"></div>
        <div class="dropdown-item" data-action="print">Print</div>
        <div class="dropdown-divider"></div>
        <div class="dropdown-item" data-action="exit">Exit</div>
      `;
      
      menuFile.appendChild(fileDropdown);
      
      // Toggle dropdown
      menuFile.addEventListener('click', (e) => {
        e.stopPropagation();
        fileDropdown.classList.toggle('show');
        
        // Hide other dropdowns
        document.querySelectorAll('.dropdown-menu').forEach(dropdown => {
          if (dropdown !== fileDropdown) {
            dropdown.classList.remove('show');
          }
        });
      });
      
      // Handle dropdown actions
      fileDropdown.addEventListener('click', (e) => {
        const action = e.target.getAttribute('data-action');
        if (!action) return;
        
        fileDropdown.classList.remove('show');
        
        switch (action) {
          case 'new':
            newFile();
            break;
          case 'open':
            openFile();
            break;
          case 'save':
            saveFile();
            break;
          case 'save-as':
            saveFileAs();
            break;
          case 'print':
            printFile();
            break;
          case 'exit':
            exitNotepad();
            break;
        }
      });
    }
    
    // Edit menu
    if (menuEdit) {
      // Create dropdown
      const editDropdown = document.createElement('div');
      editDropdown.className = 'dropdown-menu';
      editDropdown.innerHTML = `
        <div class="dropdown-item" data-action="undo">Undo</div>
        <div class="dropdown-divider"></div>
        <div class="dropdown-item" data-action="cut">Cut</div>
        <div class="dropdown-item" data-action="copy">Copy</div>
        <div class="dropdown-item" data-action="paste">Paste</div>
        <div class="dropdown-item" data-action="delete">Delete</div>
        <div class="dropdown-divider"></div>
        <div class="dropdown-item" data-action="select-all">Select All</div>
        <div class="dropdown-item" data-action="time-date">Time/Date</div>
      `;
      
      menuEdit.appendChild(editDropdown);
      
      // Toggle dropdown
      menuEdit.addEventListener('click', (e) => {
        e.stopPropagation();
        editDropdown.classList.toggle('show');
        
        // Hide other dropdowns
        document.querySelectorAll('.dropdown-menu').forEach(dropdown => {
          if (dropdown !== editDropdown) {
            dropdown.classList.remove('show');
          }
        });
      });
      
      // Handle dropdown actions
      editDropdown.addEventListener('click', (e) => {
        const action = e.target.getAttribute('data-action');
        if (!action) return;
        
        editDropdown.classList.remove('show');
        
        switch (action) {
          case 'undo':
            notepadContent.focus();
            document.execCommand('undo');
            break;
          case 'cut':
            notepadContent.focus();
            document.execCommand('cut');
            break;
          case 'copy':
            notepadContent.focus();
            document.execCommand('copy');
            break;
          case 'paste':
            notepadContent.focus();
            document.execCommand('paste');
            break;
          case 'delete':
            notepadContent.focus();
            document.execCommand('delete');
            break;
          case 'select-all':
            notepadContent.focus();
            notepadContent.select();
            break;
          case 'time-date':
            insertTimeDate();
            break;
        }
      });
    }
    
    // Help menu
    if (menuHelp) {
      // Create dropdown
      const helpDropdown = document.createElement('div');
      helpDropdown.className = 'dropdown-menu';
      helpDropdown.innerHTML = `
        <div class="dropdown-item" data-action="help-topics">Help Topics</div>
        <div class="dropdown-divider"></div>
        <div class="dropdown-item" data-action="about">About Notepad</div>
      `;
      
      menuHelp.appendChild(helpDropdown);
      
      // Toggle dropdown
      menuHelp.addEventListener('click', (e) => {
        e.stopPropagation();
        helpDropdown.classList.toggle('show');
        
        // Hide other dropdowns
        document.querySelectorAll('.dropdown-menu').forEach(dropdown => {
          if (dropdown !== helpDropdown) {
            dropdown.classList.remove('show');
          }
        });
      });
      
      // Handle dropdown actions
      helpDropdown.addEventListener('click', (e) => {
        const action = e.target.getAttribute('data-action');
        if (!action) return;
        
        helpDropdown.classList.remove('show');
        
        switch (action) {
          case 'help-topics':
            showHelpTopics();
            break;
          case 'about':
            showAbout();
            break;
        }
      });
    }
    
    // Hide dropdowns when clicking elsewhere
    document.addEventListener('click', () => {
      document.querySelectorAll('.dropdown-menu').forEach(dropdown => {
        dropdown.classList.remove('show');
      });
    });
    
    // Set initial window title
    updateWindowTitle();
    
    // Expand notepad window by default
    setTimeout(() => {
      const windowWidth = window.innerWidth * 0.8;
      const windowHeight = window.innerHeight * 0.7;
      
      notepadWindow.style.width = `${windowWidth}px`;
      notepadWindow.style.height = `${windowHeight}px`;
      notepadWindow.style.left = `${(window.innerWidth - windowWidth) / 2}px`;
      notepadWindow.style.top = `${(window.innerHeight - windowHeight) / 2}px`;
    }, 500);
  }
  
  // Update window title
  function updateWindowTitle() {
    const notepadWindow = document.getElementById('notepad-window');
    if (!notepadWindow) return;
    
    const windowTitle = notepadWindow.querySelector('.window-title span');
    if (!windowTitle) return;
    
    const fileName = currentFile || 'Untitled';
    const indicator = unsavedChanges ? '*' : '';
    
    windowTitle.textContent = `${fileName}${indicator} - Notepad`;
  }
  
  // New file
  function newFile() {
    if (unsavedChanges) {
      // In a real app, we would prompt to save changes
      // For this demo, we'll just create a new file
    }
    
    const notepadContent = document.querySelector('#notepad-window .notepad-content');
    if (notepadContent) {
      notepadContent.value = '';
    }
    
    currentFile = 'Untitled';
    unsavedChanges = false;
    updateWindowTitle();
  }
  
  // Open file
  function openFile() {
    // In a real app, we would show a file dialog
    // For this demo, we'll just simulate opening a file
    const notepadContent = document.querySelector('#notepad-window .notepad-content');
    if (!notepadContent) return;
    
    // Simulate opening README.txt
    currentFile = 'README.txt';
    notepadContent.value = `Welcome to NosytOS95!

This is a Windows 95-inspired interface for the NosytLabs website, showcasing our services and projects.

NosytLabs - Notable Opportunities Shape Your Tomorrow

Our Services:
- Web Development (React, Vue, Angular, Astro)
- Mobile Development (React Native, Flutter)
- AI Solutions (Cursor AI, Trae AI, Roo Code, Windsurf)
- 3D Printing Services
- Content Creation

Visit www.nosytlabs.com for more information about our services.

© 2025 NosytLabs. All rights reserved.`;
    
    unsavedChanges = false;
    updateWindowTitle();
  }
  
  // Save file
  function saveFile() {
    // In a real app, we would save the file
    // For this demo, we'll just simulate saving
    if (!currentFile || currentFile === 'Untitled') {
      saveFileAs();
      return;
    }
    
    // Simulate saving
    unsavedChanges = false;
    updateWindowTitle();
  }
  
  // Save file as
  function saveFileAs() {
    // In a real app, we would show a save dialog
    // For this demo, we'll just simulate saving as
    currentFile = 'MyDocument.txt';
    unsavedChanges = false;
    updateWindowTitle();
  }
  
  // Print file
  function printFile() {
    // In a real app, we would show a print dialog
    // For this demo, we'll just show an alert
    alert('Printing is not available in this demo.');
  }
  
  // Exit notepad
  function exitNotepad() {
    if (unsavedChanges) {
      // In a real app, we would prompt to save changes
      // For this demo, we'll just close the window
    }
    
    const notepadWindow = document.getElementById('notepad-window');
    if (notepadWindow) {
      notepadWindow.style.display = 'none';
    }
  }
  
  // Insert time/date
  function insertTimeDate() {
    const notepadContent = document.querySelector('#notepad-window .notepad-content');
    if (!notepadContent) return;
    
    const now = new Date();
    const timeDate = now.toLocaleString();
    
    // Get cursor position
    const start = notepadContent.selectionStart;
    const end = notepadContent.selectionEnd;
    
    // Insert time/date at cursor position
    notepadContent.value = notepadContent.value.substring(0, start) + timeDate + notepadContent.value.substring(end);
    
    // Set cursor position after inserted text
    notepadContent.selectionStart = notepadContent.selectionEnd = start + timeDate.length;
    
    // Focus textarea
    notepadContent.focus();
    
    // Mark as unsaved
    unsavedChanges = true;
    updateWindowTitle();
  }
  
  // Show help topics
  function showHelpTopics() {
    // In a real app, we would show help topics
    // For this demo, we'll just show an alert
    alert('Help topics are not available in this demo.');
  }
  
  // Show about dialog
  function showAbout() {
    // In a real app, we would show an about dialog
    // For this demo, we'll just show an alert
    alert('NosytOS95 Notepad\nVersion 1.0\n\n© 2025 NosytLabs. All rights reserved.');
  }
  
  // Initialize notepad
  initNotepad();
});



/* ===== file-explorer.js ===== */
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



/* ===== terminal.js ===== */
/**
 * NosytOS95 Terminal
 * A command-line interface with easter eggs for the NosytOS95 interface
 */

document.addEventListener('DOMContentLoaded', () => {
  // Terminal variables
  let commandHistory = [];
  let historyIndex = -1;
  let currentDirectory = 'C:\\';
  
  // Easter egg flags
  let konami = [];
  let konamiActivated = false;
  let asciiArtShown = false;
  let matrixMode = false;
  let matrixInterval = null;
  
  // Initialize terminal
  function initTerminal() {
    const terminalWindow = document.getElementById('terminal-window');
    if (!terminalWindow) return;
    
    const terminalOutput = terminalWindow.querySelector('.terminal-output');
    const terminalInput = terminalWindow.querySelector('.terminal-input');
    const inputForm = terminalWindow.querySelector('.terminal-form');
    
    if (!terminalOutput || !terminalInput || !inputForm) return;
    
    // Show welcome message
    appendOutput('Microsoft(R) Windows 95(TM)');
    appendOutput('(C)Copyright Microsoft Corp 1981-1995.');
    appendOutput('');
    appendOutput('NosytOS95 Terminal [Version 1.0]');
    appendOutput('(C) 2025 NosytLabs. All rights reserved.');
    appendOutput('');
    appendOutput('Type "help" for a list of available commands.');
    appendOutput('');
    appendOutput(currentDirectory + '>');
    
    // Focus input when terminal window is activated
    terminalWindow.addEventListener('click', () => {
      terminalInput.focus();
    });
    
    // Handle form submission
    inputForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const command = terminalInput.value.trim();
      
      // Add command to output
      appendOutput(currentDirectory + '>' + command);
      
      // Add to history
      if (command) {
        commandHistory.push(command);
        historyIndex = commandHistory.length;
      }
      
      // Process command
      processCommand(command);
      
      // Clear input
      terminalInput.value = '';
    });
    
    // Handle keyboard navigation
    terminalInput.addEventListener('keydown', (e) => {
      // Up arrow - previous command
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIndex > 0) {
          historyIndex--;
          terminalInput.value = commandHistory[historyIndex];
        }
      }
      
      // Down arrow - next command
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
          historyIndex++;
          terminalInput.value = commandHistory[historyIndex];
        } else {
          historyIndex = commandHistory.length;
          terminalInput.value = '';
        }
      }
      
      // Check for Konami code
      checkKonamiCode(e.key);
    });
  }
  
  // Process command
  function processCommand(command) {
    if (!command) {
      appendOutput(currentDirectory + '>');
      return;
    }
    
    // Split command and arguments
    const parts = command.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);
    
    // Process command
    switch (cmd) {
      case 'help':
        showHelp();
        break;
      case 'dir':
      case 'ls':
        listDirectory();
        break;
      case 'cd':
        changeDirectory(args[0]);
        break;
      case 'cls':
      case 'clear':
        clearTerminal();
        break;
      case 'echo':
        echo(args.join(' '));
        break;
      case 'date':
        showDate();
        break;
      case 'time':
        showTime();
        break;
      case 'ver':
      case 'version':
        showVersion();
        break;
      case 'exit':
        closeTerminal();
        break;
      case 'nosyt':
        showNosytLogo();
        break;
      case 'matrix':
        toggleMatrixMode();
        break;
      case 'rickroll':
        rickRoll();
        break;
      case 'secret':
        revealSecret();
        break;
      case 'easteregg':
        listEasterEggs();
        break;
      case 'color':
        changeColor(args[0]);
        break;
      case 'joke':
        tellJoke();
        break;
      case 'fortune':
        showFortune();
        break;
      case 'whoami':
        showWhoAmI();
        break;
      case 'hack':
        fakeHack();
        break;
      case 'cowsay':
        cowsay(args.join(' '));
        break;
      default:
        appendOutput(`'${cmd}' is not recognized as an internal or external command, operable program or batch file.`);
        break;
    }
    
    // Add prompt for next command (unless in matrix mode)
    if (!matrixMode) {
      appendOutput(currentDirectory + '>');
    }
  }
  
  // Show help
  function showHelp() {
    appendOutput('Available commands:');
    appendOutput('  help      - Show this help message');
    appendOutput('  dir, ls   - List directory contents');
    appendOutput('  cd        - Change directory');
    appendOutput('  cls, clear - Clear the terminal');
    appendOutput('  echo      - Display a message');
    appendOutput('  date      - Show current date');
    appendOutput('  time      - Show current time');
    appendOutput('  ver       - Show version information');
    appendOutput('  exit      - Close the terminal');
    appendOutput('');
    appendOutput('Try to discover hidden easter egg commands!');
  }
  
  // List directory
  function listDirectory() {
    appendOutput(' Volume in drive C is NosytOS95');
    appendOutput(' Directory of ' + currentDirectory);
    appendOutput('');
    appendOutput('05/16/2025  04:54 PM    <DIR>          Program Files');
    appendOutput('05/16/2025  04:54 PM    <DIR>          My Documents');
    appendOutput('05/16/2025  04:54 PM    <DIR>          NosytLabs');
    appendOutput('05/16/2025  04:54 PM           1,024   README.TXT');
    appendOutput('05/16/2025  04:54 PM           2,048   AUTOEXEC.BAT');
    appendOutput('05/16/2025  04:54 PM           1,536   CONFIG.SYS');
    appendOutput('');
    appendOutput('        3 File(s)         4,608 bytes');
    appendOutput('        3 Dir(s)   2,147,483,648 bytes free');
  }
  
  // Change directory
  function changeDirectory(dir) {
    if (!dir) {
      appendOutput(currentDirectory);
      return;
    }
    
    if (dir === '..') {
      const parts = currentDirectory.split('\\');
      if (parts.length > 1) {
        parts.pop();
        currentDirectory = parts.join('\\');
        if (currentDirectory === 'C:') {
          currentDirectory = 'C:\\';
        }
      }
    } else {
      // Simulate directory change
      if (dir.startsWith('C:')) {
        currentDirectory = dir;
        if (!currentDirectory.endsWith('\\')) {
          currentDirectory += '\\';
        }
      } else {
        if (dir.startsWith('\\')) {
          currentDirectory = 'C:' + dir;
        } else {
          currentDirectory = currentDirectory + dir + '\\';
        }
      }
    }
  }
  
  // Clear terminal
  function clearTerminal() {
    const terminalOutput = document.querySelector('#terminal-window .terminal-output');
    if (terminalOutput) {
      terminalOutput.innerHTML = '';
    }
  }
  
  // Echo message
  function echo(message) {
    if (message) {
      appendOutput(message);
    } else {
      appendOutput('ECHO is on.');
    }
  }
  
  // Show date
  function showDate() {
    const date = new Date();
    appendOutput('Current date: ' + date.toLocaleDateString());
  }
  
  // Show time
  function showTime() {
    const date = new Date();
    appendOutput('Current time: ' + date.toLocaleTimeString());
  }
  
  // Show version
  function showVersion() {
    appendOutput('NosytOS95 Terminal [Version 1.0]');
    appendOutput('(C) 2025 NosytLabs. All rights reserved.');
  }
  
  // Close terminal
  function closeTerminal() {
    const terminalWindow = document.getElementById('terminal-window');
    if (terminalWindow) {
      terminalWindow.style.display = 'none';
    }
  }
  
  // Show NosytLabs ASCII logo (Easter Egg)
  function showNosytLogo() {
    appendOutput('');
    appendOutput('  _   _                 _   _          _          ');
    appendOutput(' | \\ | | ___  ___ _   _| |_| |    __ _| |__  ___ ');
    appendOutput(' |  \\| |/ _ \\/ __| | | | __| |   / _` | \'_ \\/ __|');
    appendOutput(' | |\\  | (_) \\__ \\ |_| | |_| |__| (_| | |_) \\__ \\');
    appendOutput(' |_| \\_|\\___/|___/\\__, |\\__|_____\\__,_|_.__/|___/');
    appendOutput('                  |___/                           ');
    appendOutput('');
    appendOutput('Notable Opportunities Shape Your Tomorrow');
    appendOutput('');
    asciiArtShown = true;
  }
  
  // Toggle Matrix mode (Easter Egg)
  function toggleMatrixMode() {
    matrixMode = !matrixMode;
    
    if (matrixMode) {
      appendOutput('Entering the Matrix...');
      
      // Clear terminal after a delay
      setTimeout(() => {
        clearTerminal();
        
        // Start Matrix animation
        matrixInterval = setInterval(() => {
          const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()_+-=[]{}|;:,.<>?/';
          let line = '';
          
          for (let i = 0; i < 70; i++) {
            line += chars.charAt(Math.floor(Math.random() * chars.length));
          }
          
          appendOutput(line);
          
          // Keep only the last 20 lines
          const terminalOutput = document.querySelector('#terminal-window .terminal-output');
          if (terminalOutput && terminalOutput.childNodes.length > 20) {
            terminalOutput.removeChild(terminalOutput.firstChild);
          }
        }, 100);
      }, 1000);
    } else {
      // Stop Matrix animation
      if (matrixInterval) {
        clearInterval(matrixInterval);
        matrixInterval = null;
      }
      
      clearTerminal();
      appendOutput('Exiting the Matrix...');
    }
  }
  
  // Rick Roll (Easter Egg)
  function rickRoll() {
    appendOutput('Never gonna give you up');
    appendOutput('Never gonna let you down');
    appendOutput('Never gonna run around and desert you');
    appendOutput('Never gonna make you cry');
    appendOutput('Never gonna say goodbye');
    appendOutput('Never gonna tell a lie and hurt you');
    
    // Open Rick Roll video after a delay
    setTimeout(() => {
      window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
    }, 2000);
  }
  
  // Reveal secret (Easter Egg)
  function revealSecret() {
    appendOutput('Congratulations! You found a secret!');
    appendOutput('');
    appendOutput('The cake is a lie, but the easter eggs are real.');
    appendOutput('Try these commands: matrix, nosyt, rickroll, hack, cowsay, joke, fortune');
    appendOutput('');
    appendOutput('Also, try pressing the Konami code: ↑ ↑ ↓ ↓ ← → ← → B A');
  }
  
  // List Easter Eggs (Meta Easter Egg)
  function listEasterEggs() {
    appendOutput('Nice try! Finding easter eggs is part of the fun.');
    appendOutput('Here\'s a hint: try the "secret" command.');
  }
  
  // Change terminal color (Easter Egg)
  function changeColor(color) {
    const terminalWindow = document.getElementById('terminal-window');
    if (!terminalWindow) return;
    
    const terminalContent = terminalWindow.querySelector('.terminal-content');
    if (!terminalContent) return;
    
    // Reset to default
    if (!color || color === 'reset') {
      terminalContent.style.backgroundColor = '#000';
      terminalContent.style.color = '#0f0';
      appendOutput('Terminal colors reset to default.');
      return;
    }
    
    // Handle color presets
    switch (color.toLowerCase()) {
      case 'green':
        terminalContent.style.backgroundColor = '#000';
        terminalContent.style.color = '#0f0';
        break;
      case 'blue':
        terminalContent.style.backgroundColor = '#000';
        terminalContent.style.color = '#0af';
        break;
      case 'amber':
        terminalContent.style.backgroundColor = '#000';
        terminalContent.style.color = '#fc0';
        break;
      case 'red':
        terminalContent.style.backgroundColor = '#000';
        terminalContent.style.color = '#f00';
        break;
      case 'white':
        terminalContent.style.backgroundColor = '#000';
        terminalContent.style.color = '#fff';
        break;
      case 'hacker':
        terminalContent.style.backgroundColor = '#000';
        terminalContent.style.color = '#0f0';
        break;
      case 'nosyt':
        terminalContent.style.backgroundColor = '#2d0a4f'; // NosytLabs purple
        terminalContent.style.color = '#ff9900'; // NosytLabs orange
        break;
      default:
        appendOutput(`Unknown color: ${color}`);
        return;
    }
    
    appendOutput(`Terminal color changed to ${color}.`);
  }
  
  // Tell a joke (Easter Egg)
  function tellJoke() {
    const jokes = [
      'Why do programmers prefer dark mode? Because light attracts bugs!',
      'Why did the programmer quit his job? Because he didn\'t get arrays!',
      'How many programmers does it take to change a light bulb? None, that\'s a hardware problem!',
      'Why do Java developers wear glasses? Because they don\'t C#!',
      'There are 10 types of people in the world: those who understand binary and those who don\'t.',
      'Why was the JavaScript developer sad? Because he didn\'t know how to null his void!',
      'What\'s a programmer\'s favorite hangout spot? The Foo Bar!',
      'Why did the developer go broke? Because he used up all his cache!',
      'Why do programmers always mix up Halloween and Christmas? Because Oct 31 = Dec 25!',
      'Why was the computer cold? It left its Windows open!'
    ];
    
    const randomJoke = jokes[Math.floor(Math.random() * jokes.length)];
    appendOutput(randomJoke);
  }
  
  // Show fortune (Easter Egg)
  function showFortune() {
    const fortunes = [
      'You will soon embark on a new coding project.',
      'A mysterious bug in your code will soon reveal itself.',
      'Your next pull request will be accepted without changes.',
      'You will find the solution to that problem that\'s been bothering you.',
      'A new technology you learn will greatly benefit your career.',
      'Your commit history reveals your true character.',
      'The code you write today will be maintained by someone else tomorrow. Be kind.',
      'Your next deployment will go smoothly.',
      'You will receive recognition for your hard work.',
      'A cup of coffee will improve your debugging skills today.'
    ];
    
    const randomFortune = fortunes[Math.floor(Math.random() * fortunes.length)];
    appendOutput('Your fortune: ' + randomFortune);
  }
  
  // Show whoami (Easter Egg)
  function showWhoAmI() {
    appendOutput('You are a visitor to NosytLabs, exploring the NosytOS95 interface.');
    appendOutput('In the digital realm, you are whoever you choose to be.');
    appendOutput('But in this terminal, you are simply "USER".');
  }
  
  // Fake hacking animation (Easter Egg)
  function fakeHack() {
    appendOutput('INITIATING HACK SEQUENCE...');
    
    const hackingMessages = [
      'Bypassing firewall...',
      'Accessing mainframe...',
      'Decrypting security protocols...',
      'Injecting SQL...',
      'Bypassing encryption...',
      'Accessing classified files...',
      'Downloading sensitive data...',
      'Covering tracks...',
      'Planting backdoor...',
      'Erasing logs...'
    ];
    
    let i = 0;
    const hackInterval = setInterval(() => {
      if (i < hackingMessages.length) {
        appendOutput(hackingMessages[i]);
        i++;
      } else {
        clearInterval(hackInterval);
        appendOutput('');
        appendOutput('HACK COMPLETE!');
        appendOutput('');
        appendOutput('Just kidding! This is just a harmless easter egg. No actual hacking occurred.');
      }
    }, 500);
  }
  
  // Cowsay (Easter Egg)
  function cowsay(message) {
    if (!message) {
      message = 'Moo!';
    }
    
    const topLine = ' ' + '_'.repeat(message.length + 2);
    const bottomLine = ' ' + '-'.repeat(message.length + 2);
    
    appendOutput(topLine);
    appendOutput('< ' + message + ' >');
    appendOutput(bottomLine);
    appendOutput('        \\   ^__^');
    appendOutput('         \\  (oo)\\_______');
    appendOutput('            (__)\\       )\\/\\');
    appendOutput('                ||----w |');
    appendOutput('                ||     ||');
  }
  
  // Check for Konami code
  function checkKonamiCode(key) {
    const konamiSequence = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    
    // Map key to expected format
    let mappedKey = key;
    if (key === 'b' || key === 'a') {
      mappedKey = key.toLowerCase();
    }
    
    // Reset if wrong key
    if (mappedKey !== konamiSequence[konami.length]) {
      konami = [];
      return;
    }
    
    // Add key to sequence
    konami.push(mappedKey);
    
    // Check if complete
    if (konami.length === konamiSequence.length && !konamiActivated) {
      konamiActivated = true;
      activateKonamiCode();
    }
  }
  
  // Activate Konami code easter egg
  function activateKonamiCode() {
    clearTerminal();
    appendOutput('KONAMI CODE ACTIVATED!');
    appendOutput('');
    appendOutput('Unlimited power! You now have access to all easter eggs.');
    appendOutput('');
    showNosytLogo();
    appendOutput('');
    appendOutput('Try these commands: matrix, nosyt, rickroll, hack, cowsay, joke, fortune');
    appendOutput('');
    appendOutput(currentDirectory + '>');
  }
  
  // Append output to terminal
  function appendOutput(text) {
    const terminalOutput = document.querySelector('#terminal-window .terminal-output');
    if (!terminalOutput) return;
    
    const line = document.createElement('div');
    line.textContent = text;
    terminalOutput.appendChild(line);
    
    // Scroll to bottom
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }
  
  // Initialize terminal
  initTerminal();
});



/* ===== nosyt-ai.js ===== */
/**
 * NosytOS95 AI Assistant
 * A Clippy-like assistant for the NosytOS95 interface
 */

document.addEventListener('DOMContentLoaded', () => {
  // Assistant variables
  let assistantActive = true;
  let assistantMinimized = false;
  let idleTimer = null;
  let currentAnimation = null;
  
  // Assistant messages
  const greetings = [
    "Hi there! I'm Nosyt, your digital assistant!",
    "Welcome to NosytOS95! Need any help?",
    "Hello! I'm here to assist you with NosytOS95!",
    "Greetings! How can I help you today?",
    "Hi! I'm Nosyt, your friendly AI assistant!"
  ];
  
  const idleTips = [
    "Did you know you can find easter eggs in the Terminal? Try typing 'secret'!",
    "Click on the 'DO NOT CLICK' folder... if you dare!",
    "Try playing Duck Hunt in the Games folder!",
    "You can change the Terminal color by typing 'color nosyt'.",
    "Press the Konami code for a special surprise! (↑↑↓↓←→←→BA)",
    "Check out My Documents for information about NosytLabs services.",
    "Try typing 'matrix' in the Terminal for a cool effect!",
    "You can resize windows by dragging the corners.",
    "Double-click on window headers to maximize them.",
    "Right-click on the desktop for a context menu.",
    "NosytLabs was founded in 2025. The future is now!",
    "The name 'Nosyt' stands for 'Notable Opportunities Shape Your Tomorrow'.",
    "Try typing 'joke' in the Terminal for a laugh!",
    "You can minimize windows to the taskbar.",
    "Check out the Start menu for more applications!"
  ];
  
  const reactions = [
    { trigger: "notepad", response: "I see you're using Notepad! Need help writing something?" },
    { trigger: "terminal", response: "Terminal open! Try typing 'help' for a list of commands." },
    { trigger: "duck hunt", response: "Duck Hunt is a classic! Aim carefully and have fun!" },
    { trigger: "browser", response: "Browsing the web? Let me know if you need help finding something!" },
    { trigger: "file explorer", response: "Looking for files? Check out the NosytLabs folder for interesting content!" },
    { trigger: "do not click", response: "I see you're curious about that folder... I wonder what happens if you click it?" },
    { trigger: "start menu", response: "The Start menu has all the applications you need!" }
  ];
  
  // Initialize assistant
  function initAssistant() {
    const assistantWindow = document.getElementById('nosyt-ai-window');
    if (!assistantWindow) return;
    
    const assistantContent = assistantWindow.querySelector('.assistant-content');
    const assistantCharacter = assistantWindow.querySelector('.assistant-character');
    const assistantMessage = assistantWindow.querySelector('.assistant-message');
    const assistantInput = assistantWindow.querySelector('.assistant-input');
    const assistantForm = assistantWindow.querySelector('.assistant-form');
    const minimizeBtn = assistantWindow.querySelector('.assistant-minimize');
    const closeBtn = assistantWindow.querySelector('.assistant-close');
    
    if (!assistantContent || !assistantCharacter || !assistantMessage || !assistantInput || !assistantForm) return;
    
    // Show random greeting
    const greeting = greetings[Math.floor(Math.random() * greetings.length)];
    showMessage(greeting);
    
    // Start idle timer
    startIdleTimer();
    
    // Handle form submission
    assistantForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const query = assistantInput.value.trim();
      if (!query) return;
      
      // Process query
      processQuery(query);
      
      // Clear input
      assistantInput.value = '';
    });
    
    // Handle minimize button
    if (minimizeBtn) {
      minimizeBtn.addEventListener('click', () => {
        assistantMinimized = !assistantMinimized;
        
        if (assistantMinimized) {
          assistantContent.style.height = '40px';
          assistantCharacter.style.display = 'none';
          assistantMessage.style.display = 'none';
          assistantForm.style.display = 'none';
          minimizeBtn.textContent = '□';
        } else {
          assistantContent.style.height = '300px';
          assistantCharacter.style.display = 'block';
          assistantMessage.style.display = 'block';
          assistantForm.style.display = 'flex';
          minimizeBtn.textContent = '_';
        }
      });
    }
    
    // Handle close button
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        assistantWindow.style.display = 'none';
        assistantActive = false;
        
        // Clear idle timer
        if (idleTimer) {
          clearTimeout(idleTimer);
          idleTimer = null;
        }
      });
    }
    
    // Listen for window activations
    document.addEventListener('activateWindow', (e) => {
      if (!assistantActive) return;
      
      const window = e.detail.window;
      if (!window) return;
      
      // React to window activation
      reactToWindow(window);
    });
  }
  
  // Process user query
  function processQuery(query) {
    // Reset idle timer
    startIdleTimer();
    
    // Convert query to lowercase for easier matching
    const lowerQuery = query.toLowerCase();
    
    // Check for specific queries
    if (lowerQuery.includes('help')) {
      showMessage("I can help you navigate NosytOS95! Try asking about specific applications or features.");
    } else if (lowerQuery.includes('hello') || lowerQuery.includes('hi')) {
      showMessage("Hello there! How can I assist you today?");
    } else if (lowerQuery.includes('who are you')) {
      showMessage("I'm Nosyt, your AI assistant for NosytOS95! I'm here to help you navigate and discover features.");
    } else if (lowerQuery.includes('what can you do')) {
      showMessage("I can provide tips, help you navigate NosytOS95, and answer questions about NosytLabs services!");
    } else if (lowerQuery.includes('easter egg') || lowerQuery.includes('secret')) {
      showMessage("I can't directly reveal easter eggs, but try exploring the Terminal and typing 'secret' or 'easteregg'!");
    } else if (lowerQuery.includes('nosytlabs')) {
      showMessage("NosytLabs provides web development, content creation, 3D printing services, and educational resources on passive income opportunities!");
    } else if (lowerQuery.includes('joke')) {
      tellJoke();
    } else if (lowerQuery.includes('thank')) {
      showMessage("You're welcome! I'm happy to help!");
    } else if (lowerQuery.includes('bye') || lowerQuery.includes('goodbye')) {
      showMessage("Goodbye! Feel free to call me if you need assistance!");
    } else {
      // Generic response
      showMessage("I'm not sure how to help with that. Try asking about NosytOS95 features or NosytLabs services!");
    }
  }
  
  // React to window activation
  function reactToWindow(window) {
    if (!window.id) return;
    
    // Find matching reaction
    let reaction = null;
    
    for (const r of reactions) {
      if (window.id.toLowerCase().includes(r.trigger)) {
        reaction = r.response;
        break;
      }
    }
    
    // Show reaction if found
    if (reaction) {
      showMessage(reaction);
    }
  }
  
  // Show message
  function showMessage(message) {
    const assistantMessage = document.querySelector('#nosyt-ai-window .assistant-message');
    if (!assistantMessage) return;
    
    // Set message
    assistantMessage.textContent = message;
    
    // Animate character
    animateCharacter();
  }
  
  // Animate character
  function animateCharacter() {
    const assistantCharacter = document.querySelector('#nosyt-ai-window .assistant-character');
    if (!assistantCharacter) return;
    
    // Clear current animation
    if (currentAnimation) {
      assistantCharacter.classList.remove(currentAnimation);
    }
    
    // Random animation
    const animations = ['bounce', 'wave', 'spin', 'nod'];
    currentAnimation = animations[Math.floor(Math.random() * animations.length)];
    
    // Apply animation
    assistantCharacter.classList.add(currentAnimation);
    
    // Remove animation after it completes
    setTimeout(() => {
      assistantCharacter.classList.remove(currentAnimation);
      currentAnimation = null;
    }, 1000);
  }
  
  // Start idle timer
  function startIdleTimer() {
    // Clear existing timer
    if (idleTimer) {
      clearTimeout(idleTimer);
    }
    
    // Set new timer
    idleTimer = setTimeout(() => {
      if (assistantActive && !assistantMinimized) {
        showIdleTip();
      }
    }, 30000); // 30 seconds
  }
  
  // Show random idle tip
  function showIdleTip() {
    const tip = idleTips[Math.floor(Math.random() * idleTips.length)];
    showMessage(tip);
    
    // Restart timer
    startIdleTimer();
  }
  
  // Tell a joke
  function tellJoke() {
    const jokes = [
      "Why do programmers prefer dark mode? Because light attracts bugs!",
      "Why did the computer go to the doctor? It had a virus!",
      "Why don't scientists trust atoms? Because they make up everything!",
      "What's a computer's favorite snack? Microchips!",
      "Why did the computer keep freezing? It left too many Windows open!",
      "How many programmers does it take to change a light bulb? None, that's a hardware problem!",
      "Why was the computer cold? It left its Windows open!",
      "What do you call a computer that sings? A Dell!",
      "Why did the computer go to art school? It wanted to learn how to draw pixels!",
      "What's a computer's favorite beat? An algorithm!"
    ];
    
    const joke = jokes[Math.floor(Math.random() * jokes.length)];
    showMessage(joke);
  }
  
  // Initialize assistant
  initAssistant();
});


