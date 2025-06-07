/**
 * NosytOS95 File System
 * Simulates a file system for the NosytOS95 interface
 */

document.addEventListener('DOMContentLoaded', () => {
  // File system structure
  const fileSystem = {
    'C:': {
      type: 'drive',
      name: 'Drive C:',
      icon: '/images/win95/drive-c.png',
      children: {
        'Program Files': {
          type: 'folder',
          name: 'Program Files',
          icon: '/images/win95/folder.png',
          children: {
            'Internet Explorer': {
              type: 'folder',
              name: 'Internet Explorer',
              icon: '/images/win95/folder.png',
              children: {
                'iexplore.exe': {
                  type: 'application',
                  name: 'iexplore.exe',
                  icon: '/images/win95/browser.png',
                  size: '2.4 MB',
                  created: '5/16/2025 4:54 PM',
                  action: 'openBrowser'
                }
              }
            },
            'NosytOS': {
              type: 'folder',
              name: 'NosytOS',
              icon: '/images/win95/folder.png',
              children: {
                'notepad.exe': {
                  type: 'application',
                  name: 'notepad.exe',
                  icon: '/images/win95/notepad.png',
                  size: '1.2 MB',
                  created: '5/16/2025 4:54 PM',
                  action: 'openNotepad'
                },
                'terminal.exe': {
                  type: 'application',
                  name: 'terminal.exe',
                  icon: '/images/win95/terminal.png',
                  size: '1.8 MB',
                  created: '5/16/2025 4:54 PM',
                  action: 'openTerminal'
                },
                'nosyt-ai.exe': {
                  type: 'application',
                  name: 'nosyt-ai.exe',
                  icon: '/images/win95/clippy.png',
                  size: '3.2 MB',
                  created: '5/16/2025 4:54 PM',
                  action: 'openNosytAI'
                }
              }
            },
            'Games': {
              type: 'folder',
              name: 'Games',
              icon: '/images/win95/folder.png',
              children: {
                'duck-hunt.exe': {
                  type: 'application',
                  name: 'duck-hunt.exe',
                  icon: '/images/win95/icons/duck-hunt.png',
                  size: '4.7 MB',
                  created: '5/16/2025 4:54 PM',
                  action: 'openDuckHunt'
                },
                'minesweeper.exe': {
                  type: 'application',
                  name: 'minesweeper.exe',
                  icon: '/images/win95/minesweeper.png',
                  size: '1.5 MB',
                  created: '5/16/2025 4:54 PM',
                  action: 'openMinesweeper'
                }
              }
            }
          }
        },
        'My Documents': {
          type: 'folder',
          name: 'My Documents',
          icon: '/images/win95/folder.png',
          children: {
            'README.txt': {
              type: 'text',
              name: 'README.txt',
              icon: '/images/win95/text-file.png',
              size: '1.2 KB',
              created: '5/16/2025 4:54 PM',
              content: `Welcome to NosytOS95!

This is a Windows 95-inspired interface for the NosytLabs website, showcasing our services and projects.

NosytLabs - Notable Opportunities Shape Your Tomorrow

Our Services:
- Web Development (React, Vue, Angular, Astro)
- Mobile Development (React Native, Flutter)
- AI Solutions (Cursor AI, Trae AI, Roo Code, Windsurf)
- 3D Printing Services
- Content Creation

Visit www.nosytlabs.com for more information about our services.

© 2025 NosytLabs. All rights reserved.`
            },
            'SERVICES.txt': {
              type: 'text',
              name: 'SERVICES.txt',
              icon: '/images/win95/text-file.png',
              size: '2.4 KB',
              created: '5/16/2025 4:54 PM',
              content: `NosytLabs Services

Web Development:
- Custom websites and web applications
- Frontend development with React, Vue, Angular, Astro
- Backend development with Node.js, Python, PHP
- E-commerce solutions
- Progressive Web Apps (PWAs)

Mobile Development:
- Cross-platform mobile apps with React Native and Flutter
- Native iOS and Android development
- App store submission and optimization
- Mobile app maintenance and updates

AI Solutions:
- AI integration for web and mobile applications
- Custom AI models and solutions
- AI-powered chatbots and virtual assistants
- Data analysis and visualization

3D Printing Services:
- Custom 3D models and prototypes
- 3D printing with various materials
- 3D model optimization and repair
- 3D scanning and modeling

Content Creation:
- YouTube videos and tutorials
- Live streaming on Kick.com
- Technical documentation and guides
- Social media content and management

For more information, contact us at contact@nosytlabs.com

© 2025 NosytLabs. All rights reserved.`
            },
            'PROJECTS.txt': {
              type: 'text',
              name: 'PROJECTS.txt',
              icon: '/images/win95/text-file.png',
              size: '1.8 KB',
              created: '5/16/2025 4:54 PM',
              content: `NosytLabs Projects

1. Dev Toolkit
   A comprehensive toolkit for web developers, featuring code snippets, utilities, and resources.
   Technologies: JavaScript, React, Node.js

2. Custom GPU Bracket
   A 3D-printed bracket for supporting heavy GPUs in desktop computers.
   Technologies: 3D Printing, CAD Design

3. Streaming Setup Guide
   A comprehensive guide for setting up a professional streaming environment.
   Technologies: OBS, Streaming Hardware, Audio/Video Equipment

4. AI Code Assistant Comparison
   A detailed comparison of various AI code assistants, including Cursor AI, GitHub Copilot, and more.
   Technologies: AI, Code Analysis

5. Passive Income Dashboard
   A dashboard for tracking and managing various passive income streams.
   Technologies: React, Node.js, MongoDB

Visit our GitHub repository at github.com/NosytLabs for more projects.

© 2025 NosytLabs. All rights reserved.`
            }
          }
        },
        'NosytLabs': {
          type: 'folder',
          name: 'NosytLabs',
          icon: '/images/win95/folder.png',
          children: {
            'Projects': {
              type: 'folder',
              name: 'Projects',
              icon: '/images/win95/folder.png',
              children: {}
            },
            'Services': {
              type: 'folder',
              name: 'Services',
              icon: '/images/win95/folder.png',
              children: {}
            },
            'DO NOT CLICK': {
              type: 'special',
              name: 'DO NOT CLICK',
              icon: '/images/win95/folder-important.png',
              size: '???',
              created: '5/16/2025 4:54 PM',
              action: 'rickRoll'
            },
            'About': {
              type: 'folder',
              name: 'About',
              icon: '/images/win95/folder.png',
              children: {
                'about.txt': {
                  type: 'text',
                  name: 'about.txt',
                  icon: '/images/win95/text-file.png',
                  size: '1.5 KB',
                  created: '5/16/2025 4:54 PM',
                  content: `About NosytLabs

NosytLabs was founded in 2025 as a portfolio site for NOSYT LLC, showcasing our technology projects and services. Our name represents our mission: Notable Opportunities Shape Your Tomorrow.

We develop web applications, create technology content on YouTube (@TycenYT) and Kick.com/Tycen, provide educational resources on passive income opportunities, and offer 3D printing services using our Creality and Elegoo printers.

Our core offerings include:
- Custom web development with React, Astro, and modern frameworks
- Technology content creation on YouTube and Kick.com
- 3D printing services with Creality Ender 3 S1 Pro (FDM) and Elegoo Saturn 2 (resin)
- Educational resources on passive income opportunities
- Open-source GitHub projects and development tools

© 2025 NosytLabs. All rights reserved.`
                }
              }
            }
          }
        }
      }
    }
  };

  // Current path in the file system
  let currentPath = ['C:'];
  let currentFolder = fileSystem['C:'];

  // Initialize file system
  function initFileSystem() {
    // Initialize file explorer
    const fileExplorerWindow = document.getElementById('file-explorer-window');
    if (fileExplorerWindow) {
      updateFileExplorer();
    }

    // Initialize My Computer
    const myComputerWindow = document.getElementById('my-computer-window');
    if (myComputerWindow) {
      updateMyComputer();
    }

    // Initialize file interactions
    initFileInteractions();
  }

  // Update file explorer with current folder contents
  function updateFileExplorer() {
    const folderGrid = document.querySelector('#file-explorer-window .folder-grid');
    if (!folderGrid) return;

    // Clear current contents
    folderGrid.innerHTML = '';

    // Add parent folder if not at root
    if (currentPath.length > 1) {
      const parentItem = document.createElement('div');
      parentItem.className = 'folder-item';
      parentItem.setAttribute('data-path', '..', 'data-type', 'parent');
      parentItem.innerHTML = `
        <img src="/images/win95/folder-parent.png" alt="Parent Folder">
        <span>Parent Folder</span>
      `;
      folderGrid.appendChild(parentItem);
    }

    // Add folder contents
    const children = getChildrenAtPath(currentPath);
    if (!children) return;

    // Update window title
    const windowTitle = document.querySelector('#file-explorer-window .window-title span');
    if (windowTitle) {
      windowTitle.textContent = currentPath.join('\\');
    }

    // Update address bar
    const addressInput = document.querySelector('#file-explorer-window .address-input');
    if (addressInput) {
      addressInput.value = currentPath.join('\\');
    }

    // Add items to folder grid
    Object.keys(children).forEach(key => {
      const item = children[key];
      const folderItem = document.createElement('div');
      folderItem.className = 'folder-item';
      folderItem.setAttribute('data-path', key);
      folderItem.setAttribute('data-type', item.type);
      folderItem.innerHTML = `
        <img src="${item.icon}" alt="${item.name}">
        <span>${item.name}</span>
      `;
      folderGrid.appendChild(folderItem);
    });

    // Update status bar
    const statusBar = document.querySelector('#file-explorer-window .window-statusbar span');
    if (statusBar) {
      const itemCount = Object.keys(children).length;
      statusBar.textContent = `${itemCount} object(s)`;
    }
  }

  // Update My Computer window
  function updateMyComputer() {
    // Implementation for My Computer window
  }

  // Initialize file interactions
  function initFileInteractions() {
    // Delegate click events for folder items
    document.addEventListener('click', (e) => {
      const folderItem = e.target.closest('.folder-item');
      if (!folderItem) return;

      const path = folderItem.getAttribute('data-path');
      const type = folderItem.getAttribute('data-type');

      if (path === '..') {
        // Navigate to parent folder
        navigateToParent();
      } else if (type === 'folder' || type === 'drive') {
        // Navigate to folder
        navigateToFolder(path);
      } else if (type === 'text') {
        // Open text file
        openTextFile(path);
      } else if (type === 'application') {
        // Run application
        runApplication(path);
      }
    });
  }

  // Navigate to parent folder
  function navigateToParent() {
    if (currentPath.length > 1) {
      currentPath.pop();
      updateFileExplorer();
    }
  }

  // Navigate to folder
  function navigateToFolder(folderName) {
    const newPath = [...currentPath, folderName];
    const folder = getItemAtPath(newPath);

    if (folder && (folder.type === 'folder' || folder.type === 'drive')) {
      currentPath = newPath;
      updateFileExplorer();
    }
  }

  // Open text file
  function openTextFile(fileName) {
    const file = getChildrenAtPath(currentPath)[fileName];
    if (!file || file.type !== 'text') return;

    // Open in Notepad
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

      // Show Notepad window
      notepadWindow.style.display = 'block';

      // Bring to front
      const event = new CustomEvent('activateWindow', { detail: { window: notepadWindow } });
      document.dispatchEvent(event);
    }
  }

  // Run application or special action
  function runApplication(appName) {
    const app = getChildrenAtPath(currentPath)[appName];
    if (!app) return;

    // Handle special items
    if (app.type === 'special') {
      if (app.action === 'rickRoll') {
        // Rick Roll the user
        window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
        return;
      }
    }

    // Handle applications
    if (app.type !== 'application') return;

    // Execute application action
    if (app.action === 'openNotepad') {
      const notepadWindow = document.getElementById('notepad-window');
      if (notepadWindow) {
        notepadWindow.style.display = 'block';
        const event = new CustomEvent('activateWindow', { detail: { window: notepadWindow } });
        document.dispatchEvent(event);
      }
    } else if (app.action === 'openTerminal') {
      const terminalWindow = document.getElementById('terminal-window');
      if (terminalWindow) {
        terminalWindow.style.display = 'block';
        const event = new CustomEvent('activateWindow', { detail: { window: terminalWindow } });
        document.dispatchEvent(event);
      }
    } else if (app.action === 'openBrowser') {
      const browserWindow = document.getElementById('browser-window');
      if (browserWindow) {
        browserWindow.style.display = 'block';
        const event = new CustomEvent('activateWindow', { detail: { window: browserWindow } });
        document.dispatchEvent(event);
      }
    } else if (app.action === 'openDuckHunt') {
      const duckHuntWindow = document.getElementById('duck-hunt-window');
      if (duckHuntWindow) {
        duckHuntWindow.style.display = 'block';
        const event = new CustomEvent('activateWindow', { detail: { window: duckHuntWindow } });
        document.dispatchEvent(event);
      }
    } else if (app.action === 'openNosytAI') {
      const nosytAIWindow = document.getElementById('nosyt-ai-window');
      if (nosytAIWindow) {
        nosytAIWindow.style.display = 'block';
        const event = new CustomEvent('activateWindow', { detail: { window: nosytAIWindow } });
        document.dispatchEvent(event);
      }
    }
  }

  // Get item at path
  function getItemAtPath(path) {
    let current = fileSystem;
    for (const segment of path) {
      if (!current[segment]) return null;
      current = current[segment];
    }
    return current;
  }

  // Get children at path
  function getChildrenAtPath(path) {
    const item = getItemAtPath(path);
    return item ? item.children : null;
  }

  // Initialize file system
  initFileSystem();
});
