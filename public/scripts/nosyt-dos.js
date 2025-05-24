/**
 * NosytOS95 MS-DOS Prompt
 * A simple MS-DOS command prompt emulator for NosytOS95
 */

// Create a global namespace for MS-DOS Prompt
window.NosytDOS = window.NosytDOS || {};

// DOS state
const dosState = {
  initialized: false,
  currentDirectory: 'C:\\>',
  commandHistory: [],
  historyIndex: -1,
  fileSystem: {
    'C:\\': {
      type: 'directory',
      contents: {
        'WINDOWS': {
          type: 'directory',
          contents: {
            'SYSTEM': {
              type: 'directory',
              contents: {
                'SYSTEM.INI': { type: 'file', content: '; Windows 95 System Configuration\n[boot]\nshell=explorer.exe\n' },
                'WIN.INI': { type: 'file', content: '; Windows 95 Configuration\n[windows]\nload=\nrun=\n' }
              }
            },
            'COMMAND': {
              type: 'directory',
              contents: {
                'README.TXT': { type: 'file', content: 'MS-DOS Command Prompt\nCopyright (c) Microsoft Corporation 1995\n' }
              }
            }
          }
        },
        'PROGRAM FILES': {
          type: 'directory',
          contents: {
            'NOSYTLABS': {
              type: 'directory',
              contents: {
                'README.TXT': { type: 'file', content: 'NosytLabs - Notable Opportunities Shape Your Tomorrow\nCopyright (c) NosytLabs 2025\n' }
              }
            }
          }
        },
        'AUTOEXEC.BAT': { type: 'file', content: '@ECHO OFF\nPROMPT $P$G\nPATH C:\\WINDOWS;C:\\WINDOWS\\COMMAND\nSET TEMP=C:\\TEMP\n' },
        'CONFIG.SYS': { type: 'file', content: 'DEVICE=C:\\WINDOWS\\HIMEM.SYS\nDEVICE=C:\\WINDOWS\\EMM386.EXE\nFILES=30\nBUFFERS=20\n' },
        'README.TXT': { type: 'file', content: 'Welcome to NosytOS95!\nThis is a simulated MS-DOS environment.\nTry commands like DIR, CD, TYPE, and HELP.\n' }
      }
    }
  },
  elements: {
    outputContainer: null,
    inputField: null
  },
  commands: {
    'DIR': {
      description: 'Displays a list of files and subdirectories in a directory.',
      usage: 'DIR [drive:][path][filename]',
      execute: (args) => {
        return cmdDir(args);
      }
    },
    'CD': {
      description: 'Displays the name of or changes the current directory.',
      usage: 'CD [drive:][path]',
      execute: (args) => {
        return cmdCd(args);
      }
    },
    'CLS': {
      description: 'Clears the screen.',
      usage: 'CLS',
      execute: (args) => {
        return cmdCls(args);
      }
    },
    'TYPE': {
      description: 'Displays the contents of a text file.',
      usage: 'TYPE [drive:][path]filename',
      execute: (args) => {
        return cmdType(args);
      }
    },
    'HELP': {
      description: 'Provides help information for Windows commands.',
      usage: 'HELP [command]',
      execute: (args) => {
        return cmdHelp(args);
      }
    },
    'VER': {
      description: 'Displays the Windows version.',
      usage: 'VER',
      execute: (args) => {
        return cmdVer(args);
      }
    },
    'DATE': {
      description: 'Displays or sets the date.',
      usage: 'DATE [mm-dd-yy]',
      execute: (args) => {
        return cmdDate(args);
      }
    },
    'TIME': {
      description: 'Displays or sets the system time.',
      usage: 'TIME [hh:mm:ss]',
      execute: (args) => {
        return cmdTime(args);
      }
    },
    'ECHO': {
      description: 'Displays messages, or turns command echoing on or off.',
      usage: 'ECHO [message]',
      execute: (args) => {
        return cmdEcho(args);
      }
    },
    'EXIT': {
      description: 'Quits the MS-DOS Prompt.',
      usage: 'EXIT',
      execute: (args) => {
        return cmdExit(args);
      }
    }
  }
};

// Initialize when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('NosytOS95 MS-DOS Prompt loaded');

  // Delay initialization to ensure DOM is fully loaded
  setTimeout(initDOS, 1000);
});

/**
 * Initialize the MS-DOS Prompt
 */
function initDOS() {
  // Get DOS elements
  const dosWindow = document.getElementById('dos-window');
  if (!dosWindow) {
    console.error('DOS window not found');
    return;
  }
  
  // Get output container
  const outputContainer = dosWindow.querySelector('.dos-output');
  if (!outputContainer) {
    console.error('DOS output container not found');
    return;
  }
  
  // Get input field
  const inputField = dosWindow.querySelector('.dos-input');
  if (!inputField) {
    console.error('DOS input field not found');
    return;
  }
  
  // Store elements in DOS state
  dosState.elements.outputContainer = outputContainer;
  dosState.elements.inputField = inputField;
  
  // Add event listeners
  inputField.addEventListener('keydown', handleKeyDown);
  
  // Add initial output
  addOutput([
    'Microsoft(R) Windows 95',
    'Copyright (C) Microsoft Corp 1981-1995.',
    '',
    'C:\\>'
  ]);
  
  // Focus input field
  inputField.focus();
  
  // Mark as initialized
  dosState.initialized = true;
  
  console.log('MS-DOS Prompt initialized');
}

/**
 * Handle key down events
 */
function handleKeyDown(e) {
  if (!dosState.initialized) return;
  
  const inputField = dosState.elements.inputField;
  
  // Handle Enter key
  if (e.key === 'Enter') {
    e.preventDefault();
    
    const command = inputField.value.trim();
    
    // Add command to output
    addOutput([dosState.currentDirectory + ' ' + command]);
    
    // Add command to history
    if (command !== '') {
      dosState.commandHistory.push(command);
      dosState.historyIndex = dosState.commandHistory.length;
    }
    
    // Process command
    processCommand(command);
    
    // Clear input field
    inputField.value = '';
  }
  
  // Handle Up arrow key (command history)
  else if (e.key === 'ArrowUp') {
    e.preventDefault();
    
    if (dosState.commandHistory.length > 0) {
      dosState.historyIndex = Math.max(0, dosState.historyIndex - 1);
      inputField.value = dosState.commandHistory[dosState.historyIndex];
    }
  }
  
  // Handle Down arrow key (command history)
  else if (e.key === 'ArrowDown') {
    e.preventDefault();
    
    if (dosState.commandHistory.length > 0) {
      dosState.historyIndex = Math.min(dosState.commandHistory.length, dosState.historyIndex + 1);
      
      if (dosState.historyIndex === dosState.commandHistory.length) {
        inputField.value = '';
      } else {
        inputField.value = dosState.commandHistory[dosState.historyIndex];
      }
    }
  }
  
  // Handle Tab key (command completion)
  else if (e.key === 'Tab') {
    e.preventDefault();
    
    // TODO: Implement command completion
  }
}

/**
 * Process a command
 */
function processCommand(command) {
  if (command === '') {
    addOutput([dosState.currentDirectory]);
    return;
  }
  
  // Parse command and arguments
  const parts = command.split(' ');
  const cmd = parts[0].toUpperCase();
  const args = parts.slice(1).join(' ');
  
  // Check if command exists
  if (dosState.commands[cmd]) {
    // Execute command
    const output = dosState.commands[cmd].execute(args);
    
    // Add output
    if (output && output.length > 0) {
      addOutput(output);
    }
  } else {
    // Command not found
    addOutput([`Bad command or file name: ${cmd}`]);
  }
  
  // Add prompt
  addOutput([dosState.currentDirectory]);
}

/**
 * Add output to the console
 */
function addOutput(lines) {
  if (!dosState.elements.outputContainer) return;
  
  // Add each line
  lines.forEach(line => {
    const lineElement = document.createElement('div');
    lineElement.className = 'dos-output-line';
    lineElement.textContent = line;
    dosState.elements.outputContainer.appendChild(lineElement);
  });
  
  // Scroll to bottom
  dosState.elements.outputContainer.scrollTop = dosState.elements.outputContainer.scrollHeight;
}

/**
 * DIR command
 */
function cmdDir(args) {
  // Parse path
  const path = args.trim() || dosState.currentDirectory.slice(0, -1);
  
  // Get directory
  const directory = getPathObject(path);
  
  if (!directory || directory.type !== 'directory') {
    return [`File not found: ${path}`];
  }
  
  // Format output
  const output = [
    ` Volume in drive C is NOSYTOS95`,
    ` Volume Serial Number is 1234-5678`,
    '',
    ` Directory of ${path}`,
    ''
  ];
  
  // Add directories
  let fileCount = 0;
  let dirCount = 0;
  let totalSize = 0;
  
  for (const name in directory.contents) {
    const item = directory.contents[name];
    
    if (item.type === 'directory') {
      output.push(`${formatDate(new Date())}    <DIR>          ${name}`);
      dirCount++;
    } else {
      const size = item.content.length;
      output.push(`${formatDate(new Date())}         ${size.toString().padStart(8)} ${name}`);
      fileCount++;
      totalSize += size;
    }
  }
  
  // Add summary
  output.push(`        ${fileCount} file(s)         ${totalSize} bytes`);
  output.push(`        ${dirCount} dir(s)   ${Math.floor(Math.random() * 100000000)} bytes free`);
  
  return output;
}

/**
 * CD command
 */
function cmdCd(args) {
  if (!args.trim()) {
    return [dosState.currentDirectory.slice(0, -1)];
  }
  
  // Handle special cases
  if (args === '..') {
    // Go up one directory
    const parts = dosState.currentDirectory.slice(0, -1).split('\\');
    
    if (parts.length > 1) {
      parts.pop();
      dosState.currentDirectory = parts.join('\\') + '\\>';
    }
    
    return [];
  }
  
  // Parse path
  let path = args.trim();
  
  // Add drive if not specified
  if (!path.includes(':')) {
    path = dosState.currentDirectory.slice(0, 2) + path;
  }
  
  // Add trailing backslash if not present
  if (!path.endsWith('\\')) {
    path += '\\';
  }
  
  // Get directory
  const directory = getPathObject(path);
  
  if (!directory || directory.type !== 'directory') {
    return [`Invalid directory: ${args}`];
  }
  
  // Update current directory
  dosState.currentDirectory = path + '>';
  
  return [];
}

/**
 * CLS command
 */
function cmdCls(args) {
  if (!dosState.elements.outputContainer) return [];
  
  // Clear output container
  dosState.elements.outputContainer.innerHTML = '';
  
  return [];
}

/**
 * TYPE command
 */
function cmdType(args) {
  if (!args.trim()) {
    return ['Required parameter missing'];
  }
  
  // Parse path
  let path = args.trim();
  
  // Add drive if not specified
  if (!path.includes(':')) {
    path = dosState.currentDirectory.slice(0, -1) + path;
  }
  
  // Get file
  const file = getPathObject(path);
  
  if (!file) {
    return [`File not found: ${args}`];
  }
  
  if (file.type !== 'file') {
    return [`Access denied: ${args}`];
  }
  
  // Return file content
  return file.content.split('\n');
}

/**
 * HELP command
 */
function cmdHelp(args) {
  if (!args.trim()) {
    // List all commands
    const output = [
      'For more information on a specific command, type HELP command-name',
      ''
    ];
    
    // Add each command
    for (const cmd in dosState.commands) {
      output.push(`${cmd.padEnd(10)} ${dosState.commands[cmd].description}`);
    }
    
    return output;
  }
  
  // Show help for specific command
  const cmd = args.trim().toUpperCase();
  
  if (dosState.commands[cmd]) {
    return [
      `Help for ${cmd}:`,
      '',
      `${dosState.commands[cmd].description}`,
      '',
      `Usage: ${dosState.commands[cmd].usage}`
    ];
  }
  
  return [`Command not found: ${args}`];
}

/**
 * VER command
 */
function cmdVer(args) {
  return [
    '',
    'NosytOS95 [Version 4.00.950]',
    ''
  ];
}

/**
 * DATE command
 */
function cmdDate(args) {
  const date = new Date();
  return [
    `Current date is ${date.toLocaleDateString()}`
  ];
}

/**
 * TIME command
 */
function cmdTime(args) {
  const date = new Date();
  return [
    `Current time is ${date.toLocaleTimeString()}`
  ];
}

/**
 * ECHO command
 */
function cmdEcho(args) {
  if (!args.trim()) {
    return ['ECHO is on'];
  }
  
  return [args];
}

/**
 * EXIT command
 */
function cmdExit(args) {
  // Close the DOS window
  const dosWindow = document.getElementById('dos-window');
  if (dosWindow) {
    dosWindow.style.display = 'none';
    
    // Update taskbar
    if (window.updateTaskbar) {
      window.updateTaskbar();
    }
  }
  
  return [];
}

/**
 * Get an object from the file system by path
 */
function getPathObject(path) {
  // Normalize path
  path = path.replace(/\//g, '\\');
  
  // Remove trailing backslash
  if (path.endsWith('\\') && path !== 'C:\\') {
    path = path.slice(0, -1);
  }
  
  // Split path
  const parts = path.split('\\');
  
  // Start at root
  let current = dosState.fileSystem['C:\\'];
  
  // Navigate to path
  for (let i = 1; i < parts.length; i++) {
    if (!parts[i]) continue;
    
    if (!current.contents[parts[i]]) {
      return null;
    }
    
    current = current.contents[parts[i]];
  }
  
  return current;
}

/**
 * Format date for DIR command
 */
function formatDate(date) {
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const year = date.getFullYear();
  const hours = date.getHours();
  const minutes = date.getMinutes();
  
  return `${month.toString().padStart(2, '0')}/${day.toString().padStart(2, '0')}/${year}  ${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
}

// Initialize DOS when the window is loaded
window.addEventListener('load', () => {
  console.log('Window loaded, initializing MS-DOS Prompt');
  setTimeout(initDOS, 1000);
});
