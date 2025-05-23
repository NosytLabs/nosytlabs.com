// File Explorer Application
function initFileExplorer() {
  const explorerWindow = document.getElementById('explorer-window');
  
  if (explorerWindow) {
    // Create file system structure
    const fileSystem = {
      'C:': {
        type: 'drive',
        children: {
          'Program Files': {
            type: 'folder',
            children: {
              'NosytOS95': {
                type: 'folder',
                children: {
                  'System': { type: 'folder', children: {} },
                  'Applications': { type: 'folder', children: {} },
                  'Games': { type: 'folder', children: {} },
                  'README.txt': { type: 'file', size: '2 KB', modified: '05/16/2025 04:54 PM' }
                }
              },
              'Internet Explorer': {
                type: 'folder',
                children: {
                  'iexplore.exe': { type: 'file', size: '1.2 MB', modified: '05/16/2025 04:54 PM' }
                }
              }
            }
          },
          'Windows': {
            type: 'folder',
            children: {
              'System': { type: 'folder', children: {} },
              'System32': { type: 'folder', children: {} },
              'Fonts': { type: 'folder', children: {} },
              'Desktop': { type: 'folder', children: {} }
            }
          },
          'Users': {
            type: 'folder',
            children: {
              'Nosyt': {
                type: 'folder',
                children: {
                  'Documents': {
                    type: 'folder',
                    children: {
                      'My Projects': { type: 'folder', children: {} },
                      'Resume.docx': { type: 'file', size: '24 KB', modified: '05/16/2025 04:54 PM' },
                      'Notes.txt': { type: 'file', size: '4 KB', modified: '05/16/2025 04:54 PM' }
                    }
                  },
                  'Pictures': {
                    type: 'folder',
                    children: {
                      'Vacation': { type: 'folder', children: {} },
                      'Screenshot.png': { type: 'file', size: '256 KB', modified: '05/16/2025 04:54 PM' }
                    }
                  },
                  'Music': { type: 'folder', children: {} },
                  'Videos': { type: 'folder', children: {} },
                  'Downloads': { type: 'folder', children: {} }
                }
              },
              'Public': { type: 'folder', children: {} }
            }
          },
          'autoexec.bat': { type: 'file', size: '512 bytes', modified: '05/16/2025 04:54 PM' },
          'config.sys': { type: 'file', size: '724 bytes', modified: '05/16/2025 04:54 PM' },
          'io.sys': { type: 'file', size: '8 KB', modified: '05/16/2025 04:54 PM' },
          'msdos.sys': { type: 'file', size: '1 KB', modified: '05/16/2025 04:54 PM' }
        }
      },
      'A:': { type: 'drive', children: {} },
      'D:': { type: 'drive', children: {} }
    };
    
    // Current path
    let currentPath = 'C:';
    let currentFolder = fileSystem['C:'];
    
    // Create explorer interface
    createExplorerInterface();
    
    // Initialize explorer functionality
    initExplorerFunctionality();
    
    // Create explorer interface
    function createExplorerInterface() {
      const explorerContent = explorerWindow.querySelector('.window-content');
      if (!explorerContent) return;
      
      // Clear existing content
      explorerContent.innerHTML = '';
      
      // Create explorer layout
      explorerContent.innerHTML = `
        <div class="explorer-container">
          <div class="explorer-toolbar">
            <div class="toolbar-buttons">
              <button class="toolbar-button back-button" title="Back">
                <img src="/images/win95/back.png" alt="Back">
              </button>
              <button class="toolbar-button forward-button" title="Forward" disabled>
                <img src="/images/win95/forward.png" alt="Forward">
              </button>
              <button class="toolbar-button up-button" title="Up One Level">
                <img src="/images/win95/up.png" alt="Up">
              </button>
            </div>
            <div class="address-bar">
              <label for="address">Address:</label>
              <input type="text" id="address" class="address-input" value="C:">
            </div>
          </div>
          <div class="explorer-main">
            <div class="explorer-sidebar">
              <div class="sidebar-item" data-path="C:">
                <img src="/images/win95/drive.png" alt="Drive">
                <span>Local Disk (C:)</span>
              </div>
              <div class="sidebar-item" data-path="A:">
                <img src="/images/win95/floppy.png" alt="Floppy">
                <span>Floppy Disk (A:)</span>
              </div>
              <div class="sidebar-item" data-path="D:">
                <img src="/images/win95/cd.png" alt="CD-ROM">
                <span>CD-ROM (D:)</span>
              </div>
              <div class="sidebar-item" data-path="C:/Users/Nosyt/Documents">
                <img src="/images/win95/folder.png" alt="Folder">
                <span>My Documents</span>
              </div>
              <div class="sidebar-item" data-path="C:/Users/Nosyt/Pictures">
                <img src="/images/win95/folder.png" alt="Folder">
                <span>My Pictures</span>
              </div>
              <div class="sidebar-item" data-path="C:/Users/Nosyt/Music">
                <img src="/images/win95/folder.png" alt="Folder">
                <span>My Music</span>
              </div>
              <div class="sidebar-item" data-path="C:/Program Files">
                <img src="/images/win95/folder.png" alt="Folder">
                <span>Program Files</span>
              </div>
            </div>
            <div class="explorer-content">
              <table class="file-list">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Type</th>
                    <th>Size</th>
                    <th>Modified</th>
                  </tr>
                </thead>
                <tbody>
                  <!-- Files and folders will be added here -->
                </tbody>
              </table>
            </div>
          </div>
          <div class="explorer-statusbar">
            <span class="status-items">0 items</span>
            <span class="status-space">1.44 MB free</span>
          </div>
        </div>
      `;
      
      // Update file list
      updateFileList();
    }
    
    // Initialize explorer functionality
    function initExplorerFunctionality() {
      // Address bar
      const addressInput = explorerWindow.querySelector('.address-input');
      if (addressInput) {
        addressInput.addEventListener('keydown', function(e) {
          if (e.key === 'Enter') {
            navigateTo(this.value);
          }
        });
      }
      
      // Back button
      const backButton = explorerWindow.querySelector('.back-button');
      if (backButton) {
        backButton.addEventListener('click', function() {
          // Not implemented in this version
          alert('Back navigation not implemented in this version.');
        });
      }
      
      // Up button
      const upButton = explorerWindow.querySelector('.up-button');
      if (upButton) {
        upButton.addEventListener('click', function() {
          navigateUp();
        });
      }
      
      // Sidebar items
      const sidebarItems = explorerWindow.querySelectorAll('.sidebar-item');
      sidebarItems.forEach(item => {
        item.addEventListener('click', function() {
          const path = this.getAttribute('data-path');
          navigateTo(path);
        });
      });
    }
    
    // Update file list
    function updateFileList() {
      const fileListBody = explorerWindow.querySelector('.file-list tbody');
      const addressInput = explorerWindow.querySelector('.address-input');
      const statusItems = explorerWindow.querySelector('.status-items');
      
      if (!fileListBody || !addressInput) return;
      
      // Update address bar
      addressInput.value = currentPath;
      
      // Clear existing items
      fileListBody.innerHTML = '';
      
      // Get current folder
      const pathParts = currentPath.split('/');
      let folder = fileSystem;
      
      for (const part of pathParts) {
        if (part && folder[part]) {
          folder = folder[part].children;
        } else if (part) {
          folder = {};
          break;
        }
      }
      
      // Add parent folder if not at root
      if (pathParts.length > 1) {
        const row = document.createElement('tr');
        row.className = 'file-item parent-folder';
        row.innerHTML = `
          <td><img src="/images/win95/folder-up.png" alt="Parent Folder"> ..</td>
          <td>File Folder</td>
          <td></td>
          <td></td>
        `;
        
        row.addEventListener('dblclick', function() {
          navigateUp();
        });
        
        fileListBody.appendChild(row);
      }
      
      // Add folders first
      for (const name in folder) {
        if (folder[name].type === 'folder') {
          addFileItem(name, folder[name], fileListBody);
        }
      }
      
      // Then add files
      for (const name in folder) {
        if (folder[name].type === 'file') {
          addFileItem(name, folder[name], fileListBody);
        }
      }
      
      // Update status bar
      const itemCount = Object.keys(folder).length;
      if (statusItems) {
        statusItems.textContent = `${itemCount} item${itemCount !== 1 ? 's' : ''}`;
      }
    }
    
    // Add file item to list
    function addFileItem(name, item, container) {
      const row = document.createElement('tr');
      row.className = 'file-item';
      
      const icon = item.type === 'folder' ? '/images/win95/folder.png' : 
                  item.type === 'drive' ? '/images/win95/drive.png' : 
                  '/images/win95/file.png';
      
      const type = item.type === 'folder' ? 'File Folder' : 
                  item.type === 'drive' ? 'Disk Drive' : 
                  getFileType(name);
      
      row.innerHTML = `
        <td><img src="${icon}" alt="${type}"> ${name}</td>
        <td>${type}</td>
        <td>${item.size || ''}</td>
        <td>${item.modified || ''}</td>
      `;
      
      if (item.type === 'folder' || item.type === 'drive') {
        row.addEventListener('dblclick', function() {
          navigateTo(currentPath + '/' + name);
        });
      }
      
      container.appendChild(row);
    }
    
    // Navigate to path
    function navigateTo(path) {
      // Normalize path
      path = path.replace(/\\/g, '/');
      
      // Check if path exists
      const pathParts = path.split('/');
      let folder = fileSystem;
      let validPath = '';
      
      for (const part of pathParts) {
        if (part && folder[part]) {
          folder = folder[part].children;
          validPath += (validPath ? '/' : '') + part;
        } else if (part) {
          alert(`The path "${path}" does not exist.`);
          return;
        }
      }
      
      // Update current path and folder
      currentPath = validPath;
      currentFolder = folder;
      
      // Update file list
      updateFileList();
    }
    
    // Navigate up one level
    function navigateUp() {
      const pathParts = currentPath.split('/');
      
      if (pathParts.length > 1) {
        pathParts.pop();
        navigateTo(pathParts.join('/'));
      }
    }
    
    // Get file type based on extension
    function getFileType(filename) {
      const extension = filename.split('.').pop().toLowerCase();
      
      const fileTypes = {
        'txt': 'Text Document',
        'doc': 'Word Document',
        'docx': 'Word Document',
        'xls': 'Excel Spreadsheet',
        'xlsx': 'Excel Spreadsheet',
        'ppt': 'PowerPoint Presentation',
        'pptx': 'PowerPoint Presentation',
        'pdf': 'PDF Document',
        'jpg': 'JPEG Image',
        'jpeg': 'JPEG Image',
        'png': 'PNG Image',
        'gif': 'GIF Image',
        'bmp': 'Bitmap Image',
        'mp3': 'MP3 Audio',
        'wav': 'WAV Audio',
        'mp4': 'MP4 Video',
        'avi': 'AVI Video',
        'exe': 'Application',
        'bat': 'Batch File',
        'sys': 'System File',
        'dll': 'Application Extension',
        'ini': 'Configuration Settings'
      };
      
      return fileTypes[extension] || 'File';
    }
  }
}
