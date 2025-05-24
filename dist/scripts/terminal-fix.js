/**
 * Terminal Fix
 * This script enables the Terminal application that was marked as "Coming Soon"
 */

document.addEventListener('DOMContentLoaded', () => {
  // Wait for window system to be ready
  setTimeout(initTerminalFix, 1000);
});

function initTerminalFix() {
  console.log('Initializing Terminal Fix...');

  // Enable the Terminal icon
  const terminalIcon = document.querySelector('button[data-target="terminal-window"]');
  if (terminalIcon) {
    // Remove "Coming Soon" label
    const comingSoonLabel = terminalIcon.querySelector('.coming-soon');
    if (comingSoonLabel) {
      comingSoonLabel.remove();
    }

    // Enable the button
    terminalIcon.disabled = false;
    terminalIcon.style.opacity = '1';
    terminalIcon.style.cursor = 'pointer';

    // Add click handler
    terminalIcon.addEventListener('click', openTerminalWindow);

    console.log('Terminal icon enabled');
  } else {
    console.warn('Terminal icon not found');
  }
}

function openTerminalWindow() {
  console.log('Opening Terminal window...');

  // Check if window already exists
  let terminalWindow = document.getElementById('terminal-window');

  if (!terminalWindow) {
    // Create the window
    terminalWindow = document.createElement('div');
    terminalWindow.id = 'terminal-window';
    terminalWindow.className = 'win95-window';
    terminalWindow.style.width = '600px';
    terminalWindow.style.height = '400px';
    terminalWindow.style.display = 'block';
    terminalWindow.style.position = 'absolute';
    terminalWindow.style.top = '50%';
    terminalWindow.style.left = '50%';
    terminalWindow.style.transform = 'translate(-50%, -50%)';
    terminalWindow.style.zIndex = '1000';

    // Create window content
    terminalWindow.innerHTML = `
      <div class="window-header">
        <div class="window-title">
          <img src="/images/win95/terminal.png" alt="Terminal" class="window-icon">
          <span>Terminal</span>
        </div>
        <div class="window-controls">
          <button class="window-minimize">_</button>
          <button class="window-maximize">□</button>
          <button class="window-close">×</button>
        </div>
      </div>
      <div class="window-menu">
        <div class="menu-item">File</div>
        <div class="menu-item">Edit</div>
        <div class="menu-item">View</div>
        <div class="menu-item">Help</div>
      </div>
      <div class="window-content">
        <div class="terminal-container">
          <div class="terminal-output" id="terminal-output">
            <div class="terminal-line">NosytOS95 Terminal [Version 1.0]</div>
            <div class="terminal-line">(c) 2025 NosytLabs. All rights reserved.</div>
            <div class="terminal-line"></div>
            <div class="terminal-line">C:\\></div>
          </div>
          <div class="terminal-input-container">
            <span class="terminal-prompt">C:\\></span>
            <input type="text" class="terminal-input" id="terminal-input" autofocus>
          </div>
        </div>
      </div>
      <div class="window-status-bar">Ready</div>
    `;

    // Add to desktop
    const desktop = document.querySelector('.desktop');
    if (desktop) {
      desktop.appendChild(terminalWindow);
    } else {
      document.body.appendChild(terminalWindow);
    }

    // Initialize window controls
    initWindowControls(terminalWindow);

    // Initialize terminal
    initTerminal(terminalWindow);
  } else {
    // Show existing window
    terminalWindow.style.display = 'block';

    // Bring to front
    const windows = document.querySelectorAll('.win95-window');
    let highestZIndex = 0;

    windows.forEach(win => {
      const zIndex = parseInt(win.style.zIndex || 0);
      if (zIndex > highestZIndex) {
        highestZIndex = zIndex;
      }
    });

    terminalWindow.style.zIndex = (highestZIndex + 1).toString();

    // Focus input
    const input = terminalWindow.querySelector('.terminal-input');
    if (input) {
      input.focus();
    }
  }

  // Add to taskbar
  addToTaskbar('terminal-window', 'Terminal', '/images/win95/terminal.png');
}

function initWindowControls(window) {
  // Close button
  const closeButton = window.querySelector('.window-close');
  if (closeButton) {
    closeButton.addEventListener('click', () => {
      window.style.display = 'none';

      // Remove from taskbar
      const taskbarButton = document.querySelector('.taskbar-button[data-window="terminal-window"]');
      if (taskbarButton) {
        taskbarButton.remove();
      }
    });
  }

  // Minimize button
  const minimizeButton = window.querySelector('.window-minimize');
  if (minimizeButton) {
    minimizeButton.addEventListener('click', () => {
      window.style.display = 'none';
    });
  }

  // Maximize button
  const maximizeButton = window.querySelector('.window-maximize');
  if (maximizeButton) {
    maximizeButton.addEventListener('click', () => {
      if (window.classList.contains('maximized')) {
        window.classList.remove('maximized');
        window.style.width = '600px';
        window.style.height = '400px';
        window.style.top = '50%';
        window.style.left = '50%';
        window.style.transform = 'translate(-50%, -50%)';
      } else {
        window.classList.add('maximized');
        window.style.width = '100%';
        window.style.height = 'calc(100% - 40px)';
        window.style.top = '0';
        window.style.left = '0';
        window.style.transform = 'none';
      }
    });
  }

  // Make window draggable
  const header = window.querySelector('.window-header');
  if (header) {
    let isDragging = false;
    let offsetX, offsetY;

    header.addEventListener('mousedown', (e) => {
      if (window.classList.contains('maximized')) return;

      isDragging = true;
      offsetX = e.clientX - window.getBoundingClientRect().left;
      offsetY = e.clientY - window.getBoundingClientRect().top;

      // Bring window to front
      const windows = document.querySelectorAll('.win95-window');
      let highestZIndex = 0;

      windows.forEach(win => {
        const zIndex = parseInt(win.style.zIndex || 0);
        if (zIndex > highestZIndex) {
          highestZIndex = zIndex;
        }
      });

      window.style.zIndex = (highestZIndex + 1).toString();
    });

    document.addEventListener('mousemove', (e) => {
      if (isDragging) {
        window.style.left = (e.clientX - offsetX) + 'px';
        window.style.top = (e.clientY - offsetY) + 'px';
      }
    });

    document.addEventListener('mouseup', () => {
      isDragging = false;
    });
  }
}

function addToTaskbar(windowId, title, iconSrc) {
  // Check if taskbar button already exists
  let taskbarButton = document.querySelector(`.taskbar-button[data-window="${windowId}"]`);

  if (!taskbarButton) {
    // Create taskbar button
    const taskbar = document.querySelector('.taskbar');
    if (!taskbar) return;

    taskbarButton = document.createElement('button');
    taskbarButton.className = 'taskbar-button active';
    taskbarButton.setAttribute('data-window', windowId);

    taskbarButton.innerHTML = `
      <img src="${iconSrc}" alt="${title}">
      <span>${title}</span>
    `;

    taskbar.appendChild(taskbarButton);

    // Add click handler
    taskbarButton.addEventListener('click', () => {
      const window = document.getElementById(windowId);
      if (window) {
        if (window.style.display === 'none') {
          window.style.display = 'block';
          taskbarButton.classList.add('active');
        } else {
          window.style.display = 'none';
          taskbarButton.classList.remove('active');
        }
      }
    });
  } else {
    // Update existing button
    taskbarButton.classList.add('active');
  }
}

function initTerminal(terminalWindow) {
  console.log('Initializing Terminal...');

  const outputElement = terminalWindow.querySelector('#terminal-output');
  const inputElement = terminalWindow.querySelector('#terminal-input');

  if (!outputElement || !inputElement) {
    console.error('Terminal elements not found');
    return;
  }

  // Set focus to input
  inputElement.focus();

  // Current directory
  window.terminalCurrentDir = 'C:\\';

  // Command history
  window.terminalHistory = [];
  window.terminalHistoryIndex = -1;

  // File system simulation
  window.terminalFileSystem = {
    'C:\\': {
      type: 'directory',
      contents: {
        'Windows': { type: 'directory', contents: {} },
        'Program Files': { type: 'directory', contents: {} },
        'NosytOS': { type: 'directory', contents: {} },
        'Users': { type: 'directory', contents: {
          'User': { type: 'directory', contents: {
            'Documents': { type: 'directory', contents: {
              'readme.txt': { type: 'file', content: 'Welcome to NosytOS95!\nThis is a simulated file system.' }
            }},
            'Desktop': { type: 'directory', contents: {} }
          }}
        }},
        'autoexec.bat': { type: 'file', content: '@echo off\necho Starting NosytOS95...' },
        'config.sys': { type: 'file', content: 'device=himem.sys\ndevice=emm386.exe' },
        'readme.txt': { type: 'file', content: 'NosytOS95 Terminal\nVersion 1.0\n\nType "help" for a list of commands.' }
      }
    }
  };

  // Add event listener for input
  inputElement.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();

      const command = inputElement.value.trim();

      // Add command to output
      const commandLine = document.createElement('div');
      commandLine.className = 'terminal-line';
      commandLine.textContent = window.terminalCurrentDir + '>' + command;
      outputElement.appendChild(commandLine);

      // Add to history
      if (command) {
        window.terminalHistory.push(command);
        window.terminalHistoryIndex = window.terminalHistory.length;
      }

      // Process command
      processCommand(command, outputElement);

      // Clear input
      inputElement.value = '';

      // Scroll to bottom
      outputElement.scrollTop = outputElement.scrollHeight;
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();

      if (window.terminalHistory.length > 0) {
        if (window.terminalHistoryIndex > 0) {
          window.terminalHistoryIndex--;
        }

        inputElement.value = window.terminalHistory[window.terminalHistoryIndex];
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();

      if (window.terminalHistory.length > 0) {
        if (window.terminalHistoryIndex < window.terminalHistory.length - 1) {
          window.terminalHistoryIndex++;
          inputElement.value = window.terminalHistory[window.terminalHistoryIndex];
        } else {
          window.terminalHistoryIndex = window.terminalHistory.length;
          inputElement.value = '';
        }
      }
    } else if (e.key === 'Tab') {
      e.preventDefault();

      // Auto-complete
      const input = inputElement.value.trim();
      const parts = input.split(' ');

      if (parts.length > 0) {
        const lastPart = parts[parts.length - 1];

        if (lastPart) {
          const completions = getCompletions(lastPart);

          if (completions.length === 1) {
            // Single completion
            parts[parts.length - 1] = completions[0];
            inputElement.value = parts.join(' ');
          } else if (completions.length > 1) {
            // Multiple completions
            const completionLine = document.createElement('div');
            completionLine.className = 'terminal-line';
            completionLine.textContent = completions.join('  ');
            outputElement.appendChild(completionLine);

            // Add prompt
            const promptLine = document.createElement('div');
            promptLine.className = 'terminal-line';
            promptLine.textContent = window.terminalCurrentDir + '>' + input;
            outputElement.appendChild(promptLine);

            // Scroll to bottom
            outputElement.scrollTop = outputElement.scrollHeight;
          }
        }
      }
    }
  });

  // Click on output focuses input
  outputElement.addEventListener('click', () => {
    inputElement.focus();
  });

  console.log('Terminal initialized');
}

function processCommand(command, outputElement) {
  if (!command) {
    // Empty command, just add a new prompt
    addPrompt(outputElement);
    return;
  }

  // Split command and arguments
  const parts = command.split(' ');
  const cmd = parts[0].toLowerCase();
  const args = parts.slice(1);

  // Process command
  switch (cmd) {
    case 'help':
      showHelp(outputElement, args);
      break;
    case 'dir':
    case 'ls':
      listDirectory(outputElement, args);
      break;
    case 'cd':
      changeDirectory(outputElement, args);
      break;
    case 'type':
    case 'cat':
      showFileContents(outputElement, args);
      break;
    case 'echo':
      echo(outputElement, args);
      break;
    case 'cls':
    case 'clear':
      clearScreen(outputElement);
      break;
    case 'date':
      showDate(outputElement);
      break;
    case 'time':
      showTime(outputElement);
      break;
    case 'ver':
    case 'version':
      showVersion(outputElement);
      break;
    case 'whoami':
      showUser(outputElement);
      break;
    case 'exit':
      exitTerminal();
      return; // Don't add prompt
    case 'nosyt':
      showEasterEgg(outputElement);
      break;
    case 'matrix':
      runMatrix(outputElement);
      break;
    case 'tree':
      showDirectoryTree(outputElement, args);
      break;
    default:
      // Unknown command
      const errorLine = document.createElement('div');
      errorLine.className = 'terminal-line error';
      errorLine.textContent = `'${cmd}' is not recognized as an internal or external command, operable program or batch file.`;
      outputElement.appendChild(errorLine);
      break;
  }

  // Add new prompt
  addPrompt(outputElement);
}

function addPrompt(outputElement) {
  const promptLine = document.createElement('div');
  promptLine.className = 'terminal-line';
  promptLine.textContent = window.terminalCurrentDir + '>';
  outputElement.appendChild(promptLine);
}

function showHelp(outputElement, args) {
  if (args.length > 0) {
    // Help for specific command
    const cmd = args[0].toLowerCase();

    const helpText = {
      'help': 'Provides help information for commands.',
      'dir': 'Displays a list of files and subdirectories in a directory.',
      'ls': 'Alias for DIR command.',
      'cd': 'Changes the current directory.',
      'type': 'Displays the contents of a text file.',
      'cat': 'Alias for TYPE command.',
      'echo': 'Displays messages or turns command echoing on or off.',
      'cls': 'Clears the screen.',
      'clear': 'Alias for CLS command.',
      'date': 'Displays the current date.',
      'time': 'Displays the current time.',
      'ver': 'Displays the NosytOS version.',
      'version': 'Alias for VER command.',
      'whoami': 'Displays the current user.',
      'exit': 'Exits the terminal.',
      'tree': 'Displays the directory structure graphically.',
      'matrix': 'Displays a Matrix-like animation.',
      'nosyt': 'Displays information about NosytLabs.'
    };

    if (helpText[cmd]) {
      const helpLine = document.createElement('div');
      helpLine.className = 'terminal-line';
      helpLine.textContent = cmd.toUpperCase() + ' - ' + helpText[cmd];
      outputElement.appendChild(helpLine);
    } else {
      const errorLine = document.createElement('div');
      errorLine.className = 'terminal-line error';
      errorLine.textContent = `Help for '${cmd}' is not available.`;
      outputElement.appendChild(errorLine);
    }
  } else {
    // General help
    const helpLines = [
      'NosytOS95 Terminal Help',
      '----------------------',
      'Available commands:',
      '',
      'HELP     - Provides help information for commands.',
      'DIR/LS   - Displays a list of files and subdirectories.',
      'CD       - Changes the current directory.',
      'TYPE/CAT - Displays the contents of a text file.',
      'ECHO     - Displays messages.',
      'CLS      - Clears the screen.',
      'DATE     - Displays the current date.',
      'TIME     - Displays the current time.',
      'VER      - Displays the NosytOS version.',
      'WHOAMI   - Displays the current user.',
      'EXIT     - Exits the terminal.',
      'TREE     - Displays the directory structure graphically.',
      '',
      'For help on a specific command, type: HELP command'
    ];

    helpLines.forEach(line => {
      const helpLine = document.createElement('div');
      helpLine.className = 'terminal-line';
      helpLine.textContent = line;
      outputElement.appendChild(helpLine);
    });
  }
}

function listDirectory(outputElement, args) {
  let path = window.terminalCurrentDir;

  if (args.length > 0) {
    path = resolvePath(args[0]);
  }

  const directory = getDirectoryFromPath(path);

  if (!directory || directory.type !== 'directory') {
    const errorLine = document.createElement('div');
    errorLine.className = 'terminal-line error';
    errorLine.textContent = `The system cannot find the path specified: ${path}`;
    outputElement.appendChild(errorLine);
    return;
  }

  // Directory header
  const headerLine = document.createElement('div');
  headerLine.className = 'terminal-line';
  headerLine.textContent = ` Directory of ${path}`;
  outputElement.appendChild(headerLine);

  const emptyLine = document.createElement('div');
  emptyLine.className = 'terminal-line';
  emptyLine.textContent = '';
  outputElement.appendChild(emptyLine);

  // List contents
  const contents = directory.contents;
  const entries = Object.keys(contents);

  if (entries.length === 0) {
    const emptyLine = document.createElement('div');
    emptyLine.className = 'terminal-line';
    emptyLine.textContent = 'File Not Found';
    outputElement.appendChild(emptyLine);
    return;
  }

  // Sort entries (directories first, then files)
  entries.sort((a, b) => {
    if (contents[a].type === 'directory' && contents[b].type !== 'directory') {
      return -1;
    } else if (contents[a].type !== 'directory' && contents[b].type === 'directory') {
      return 1;
    } else {
      return a.localeCompare(b);
    }
  });

  // Display entries
  entries.forEach(entry => {
    const item = contents[entry];
    const itemLine = document.createElement('div');
    itemLine.className = 'terminal-line';

    if (item.type === 'directory') {
      itemLine.textContent = `<DIR>          ${entry}`;
    } else {
      // Simulate file size (random between 1KB and 100KB)
      const size = Math.floor(Math.random() * 100000) + 1000;
      itemLine.textContent = `      ${size.toString().padStart(10)} ${entry}`;
    }

    outputElement.appendChild(itemLine);
  });

  // Summary
  const fileCount = entries.filter(entry => contents[entry].type === 'file').length;
  const dirCount = entries.filter(entry => contents[entry].type === 'directory').length;

  const summaryLine = document.createElement('div');
  summaryLine.className = 'terminal-line';
  summaryLine.textContent = `      ${fileCount} File(s)    ${dirCount} Dir(s)`;
  outputElement.appendChild(summaryLine);
}

function changeDirectory(outputElement, args) {
  if (args.length === 0) {
    // Just show current directory
    const currentLine = document.createElement('div');
    currentLine.className = 'terminal-line';
    currentLine.textContent = window.terminalCurrentDir;
    outputElement.appendChild(currentLine);
    return;
  }

  const newPath = resolvePath(args[0]);
  const directory = getDirectoryFromPath(newPath);

  if (!directory || directory.type !== 'directory') {
    const errorLine = document.createElement('div');
    errorLine.className = 'terminal-line';
    errorLine.textContent = `The system cannot find the path specified: ${newPath}`;
    outputElement.appendChild(errorLine);
    return;
  }

  // Update current directory
  window.terminalCurrentDir = newPath;

  // Update prompt
  const promptElement = document.querySelector('.terminal-prompt');
  if (promptElement) {
    promptElement.textContent = window.terminalCurrentDir + '>';
  }
}

function showFileContents(outputElement, args) {
  if (args.length === 0) {
    const errorLine = document.createElement('div');
    errorLine.className = 'terminal-line error';
    errorLine.textContent = 'The syntax of the command is incorrect.';
    outputElement.appendChild(errorLine);
    return;
  }

  const path = resolvePath(args[0]);
  const file = getFileFromPath(path);

  if (!file || file.type !== 'file') {
    const errorLine = document.createElement('div');
    errorLine.className = 'terminal-line error';
    errorLine.textContent = `The system cannot find the file specified: ${path}`;
    outputElement.appendChild(errorLine);
    return;
  }

  // Display file contents
  const content = file.content;
  const lines = content.split('\n');

  lines.forEach(line => {
    const contentLine = document.createElement('div');
    contentLine.className = 'terminal-line';
    contentLine.textContent = line;
    outputElement.appendChild(contentLine);
  });
}

function echo(outputElement, args) {
  const message = args.join(' ');

  const messageLine = document.createElement('div');
  messageLine.className = 'terminal-line';
  messageLine.textContent = message;
  outputElement.appendChild(messageLine);
}

function clearScreen(outputElement) {
  // Clear output
  outputElement.innerHTML = '';
}

function showDate(outputElement) {
  const date = new Date();
  const dateString = date.toLocaleDateString();

  const dateLine = document.createElement('div');
  dateLine.className = 'terminal-line';
  dateLine.textContent = `Current date: ${dateString}`;
  outputElement.appendChild(dateLine);
}

function showTime(outputElement) {
  const date = new Date();
  const timeString = date.toLocaleTimeString();

  const timeLine = document.createElement('div');
  timeLine.className = 'terminal-line';
  timeLine.textContent = `Current time: ${timeString}`;
  outputElement.appendChild(timeLine);
}

function showVersion(outputElement) {
  const versionLine = document.createElement('div');
  versionLine.className = 'terminal-line';
  versionLine.textContent = 'NosytOS95 Terminal [Version 1.0]';
  outputElement.appendChild(versionLine);

  const copyrightLine = document.createElement('div');
  copyrightLine.className = 'terminal-line';
  copyrightLine.textContent = '(c) 2025 NosytLabs. All rights reserved.';
  outputElement.appendChild(copyrightLine);
}

function showUser(outputElement) {
  const userLine = document.createElement('div');
  userLine.className = 'terminal-line';
  userLine.textContent = 'NosytOS95\\User';
  outputElement.appendChild(userLine);
}

function exitTerminal() {
  const terminalWindow = document.getElementById('terminal-window');
  if (terminalWindow) {
    terminalWindow.style.display = 'none';

    // Update taskbar
    const taskbarButton = document.querySelector('.taskbar-button[data-window="terminal-window"]');
    if (taskbarButton) {
      taskbarButton.classList.remove('active');
    }
  }
}

function showEasterEgg(outputElement) {
  const easterEggLines = [
    '  _   _                 _   _          _          ',
    ' | \\ | | ___  ___ _   _| |_| |    __ _| |__  ___ ',
    ' |  \\| |/ _ \\/ __| | | | __| |   / _` | \'_ \\/ __|',
    ' | |\\  | (_) \\__ \\ |_| | |_| |__| (_| | |_) \\__ \\',
    ' |_| \\_|\\___/|___/\\__, |\\__|_____\\__,_|_.__/|___/',
    '                  |___/                          ',
    '',
    'Notable Opportunities Shape Your Tomorrow',
    '',
    'NosytLabs - Founded 2025'
  ];

  easterEggLines.forEach(line => {
    const easterEggLine = document.createElement('div');
    easterEggLine.className = 'terminal-line easter-egg';
    easterEggLine.textContent = line;
    outputElement.appendChild(easterEggLine);
  });
}

function runMatrix(outputElement) {
  // Clear output
  outputElement.innerHTML = '';

  // Create matrix container
  const matrixContainer = document.createElement('div');
  matrixContainer.className = 'matrix-container';
  outputElement.appendChild(matrixContainer);

  // Matrix characters
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789$%&@#*+=-_';

  // Create columns
  const columns = Math.floor(outputElement.clientWidth / 20);

  for (let i = 0; i < columns; i++) {
    const column = document.createElement('div');
    column.className = 'matrix-column';
    column.style.left = (i * 20) + 'px';
    column.style.animationDelay = (Math.random() * 2) + 's';

    // Random number of characters
    const charCount = 5 + Math.floor(Math.random() * 15);

    for (let j = 0; j < charCount; j++) {
      const char = document.createElement('div');
      char.className = 'matrix-char';
      char.textContent = chars[Math.floor(Math.random() * chars.length)];
      char.style.animationDelay = (j * 0.1) + 's';

      column.appendChild(char);
    }

    matrixContainer.appendChild(column);
  }

  // Add exit message
  const exitMessage = document.createElement('div');
  exitMessage.className = 'matrix-exit';
  exitMessage.textContent = 'Press any key to exit';
  matrixContainer.appendChild(exitMessage);

  // Add event listener to exit
  const handleExit = (e) => {
    // Remove matrix
    matrixContainer.remove();

    // Remove event listener
    document.removeEventListener('keydown', handleExit);

    // Add prompt
    addPrompt(outputElement);

    // Focus input
    const inputElement = document.querySelector('#terminal-input');
    if (inputElement) {
      inputElement.focus();
    }
  };

  document.addEventListener('keydown', handleExit);
}

function showDirectoryTree(outputElement, args) {
  let path = window.terminalCurrentDir;

  if (args.length > 0) {
    path = resolvePath(args[0]);
  }

  const directory = getDirectoryFromPath(path);

  if (!directory || directory.type !== 'directory') {
    const errorLine = document.createElement('div');
    errorLine.className = 'terminal-line error';
    errorLine.textContent = `The system cannot find the path specified: ${path}`;
    outputElement.appendChild(errorLine);
    return;
  }

  // Directory header
  const headerLine = document.createElement('div');
  headerLine.className = 'terminal-line';
  headerLine.textContent = `Folder PATH listing for volume ${path.split('\\')[0]}`;
  outputElement.appendChild(headerLine);

  const subheaderLine = document.createElement('div');
  subheaderLine.className = 'terminal-line';
  subheaderLine.textContent = `Volume serial number is 1234-5678`;
  outputElement.appendChild(subheaderLine);

  const rootLine = document.createElement('div');
  rootLine.className = 'terminal-line';
  rootLine.textContent = path;
  outputElement.appendChild(rootLine);

  // Recursively display tree
  displayTree(outputElement, directory.contents, '', true);
}

function displayTree(outputElement, contents, prefix, isLast) {
  const entries = Object.keys(contents);

  // Sort entries (directories first, then files)
  entries.sort((a, b) => {
    if (contents[a].type === 'directory' && contents[b].type !== 'directory') {
      return -1;
    } else if (contents[a].type !== 'directory' && contents[b].type === 'directory') {
      return 1;
    } else {
      return a.localeCompare(b);
    }
  });

  entries.forEach((entry, index) => {
    const item = contents[entry];
    const isLastItem = index === entries.length - 1;

    const treeLine = document.createElement('div');
    treeLine.className = 'terminal-line';

    if (isLastItem) {
      treeLine.textContent = `${prefix}└───${entry}`;
    } else {
      treeLine.textContent = `${prefix}├───${entry}`;
    }

    outputElement.appendChild(treeLine);

    if (item.type === 'directory') {
      const newPrefix = isLastItem ? `${prefix}    ` : `${prefix}│   `;
      displayTree(outputElement, item.contents, newPrefix, isLastItem);
    }
  });
}

function resolvePath(path) {
  // Handle absolute paths
  if (path.match(/^[A-Za-z]:\\/)) {
    return path;
  }

  // Handle parent directory
  if (path === '..') {
    const parts = window.terminalCurrentDir.split('\\');
    if (parts.length > 1) {
      parts.pop();
      return parts.join('\\');
    }
    return window.terminalCurrentDir;
  }

  // Handle current directory
  if (path === '.') {
    return window.terminalCurrentDir;
  }

  // Handle root directory
  if (path === '\\') {
    return 'C:\\';
  }

  // Handle relative paths
  if (!path.includes('\\')) {
    return window.terminalCurrentDir + (window.terminalCurrentDir.endsWith('\\') ? '' : '\\') + path;
  }

  // Handle mixed paths
  return path;
}

function getDirectoryFromPath(path) {
  const parts = path.split('\\').filter(part => part);
  const drive = parts.shift() + '\\';

  if (!window.terminalFileSystem[drive]) {
    return null;
  }

  let current = window.terminalFileSystem[drive];

  for (const part of parts) {
    if (!current.contents[part] || current.contents[part].type !== 'directory') {
      return null;
    }

    current = current.contents[part];
  }

  return current;
}

function getFileFromPath(path) {
  const parts = path.split('\\').filter(part => part);
  const filename = parts.pop();
  const drive = parts.shift() + '\\';

  if (!window.terminalFileSystem[drive]) {
    return null;
  }

  let current = window.terminalFileSystem[drive];

  for (const part of parts) {
    if (!current.contents[part] || current.contents[part].type !== 'directory') {
      return null;
    }

    current = current.contents[part];
  }

  if (!current.contents[filename]) {
    return null;
  }

  return current.contents[filename];
}

function getCompletions(partial) {
  const directory = getDirectoryFromPath(window.terminalCurrentDir);

  if (!directory) {
    return [];
  }

  const entries = Object.keys(directory.contents);

  return entries.filter(entry => entry.toLowerCase().startsWith(partial.toLowerCase()));
}
