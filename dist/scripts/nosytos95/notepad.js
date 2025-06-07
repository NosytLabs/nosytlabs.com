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
