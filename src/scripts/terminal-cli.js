// Terminal Command Line Interface
// This component adds a fully functional command line interface with autocomplete

export class TerminalCLI {
  constructor(containerId) {
    this.containerId = containerId;
    this.container = null;
    this.inputElement = null;
    this.outputElement = null;
    this.historyElement = null;
    this.promptElement = null;
    this.commandHistory = [];
    this.historyIndex = -1;
    this.commandRegistry = {};
    this.easterEggs = {};
    this.isInitialized = false;
    this.username = 'visitor';
    this.hostname = 'nosyt-labs';
    this.currentDirectory = '/home/vault-tec';
    this.fileSystem = this.initializeFileSystem();
  }

  /**
   * Initialize the terminal CLI
   */
  initialize() {
    if (typeof document === 'undefined') return;
    
    // Get or create container
    this.container = document.getElementById(this.containerId);
    if (!this.container) {
      this.container = document.createElement('div');
      this.container.id = this.containerId;
      document.body.appendChild(this.container);
    }
    
    // Set up container styles
    this.container.className = 'terminal-cli-container';
    
    // Create terminal elements
    this.createTerminalElements();
    
    // Register default commands
    this.registerDefaultCommands();
    
    // Add event listeners
    this.addEventListeners();
    
    // Set initialized flag
    this.isInitialized = true;
    
    // Show welcome message
    this.showWelcomeMessage();
    
    // Terminal CLI initialized.
  }

  /**
   * Create terminal UI elements
   */
  createTerminalElements() {
    // Create history element
    this.historyElement = document.createElement('div');
    this.historyElement.className = 'terminal-cli-history';
    this.container.appendChild(this.historyElement);
    
    // Create input container
    const inputContainer = document.createElement('div');
    inputContainer.className = 'terminal-cli-input-container';
    this.container.appendChild(inputContainer);
    
    // Create prompt element
    this.promptElement = document.createElement('span');
    this.promptElement.className = 'terminal-cli-prompt';
    this.updatePrompt();
    inputContainer.appendChild(this.promptElement);
    
    // Create input element
    this.inputElement = document.createElement('input');
    this.inputElement.type = 'text';
    this.inputElement.className = 'terminal-cli-input';
    this.inputElement.setAttribute('autocomplete', 'off');
    this.inputElement.setAttribute('autocorrect', 'off');
    this.inputElement.setAttribute('autocapitalize', 'off');
    this.inputElement.setAttribute('spellcheck', 'false');
    inputContainer.appendChild(this.inputElement);
    
    // Create output element
    this.outputElement = document.createElement('div');
    this.outputElement.className = 'terminal-cli-output';
    this.container.appendChild(this.outputElement);
  }

  /**
   * Add event listeners to terminal elements
   */
  addEventListeners() {
    // Focus input when container is clicked
    this.container.addEventListener('click', () => {
      this.inputElement.focus();
    });
    
    // Handle input submission
    this.inputElement.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const command = this.inputElement.value.trim();
        if (command) {
          this.executeCommand(command);
          this.commandHistory.push(command);
          this.historyIndex = this.commandHistory.length;
          this.inputElement.value = '';
        }
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (this.historyIndex > 0) {
          this.historyIndex--;
          this.inputElement.value = this.commandHistory[this.historyIndex];
        }
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (this.historyIndex < this.commandHistory.length - 1) {
          this.historyIndex++;
          this.inputElement.value = this.commandHistory[this.historyIndex];
        } else {
          this.historyIndex = this.commandHistory.length;
          this.inputElement.value = '';
        }
      } else if (e.key === 'Tab') {
        e.preventDefault();
        this.autocompleteCommand();
      }
    });
    
    // Auto-focus input on page load
    window.addEventListener('load', () => {
      this.inputElement.focus();
    });
  }

  /**
   * Update the command prompt
   */
  updatePrompt() {
    this.promptElement.innerHTML = `<span class="terminal-cli-username">${this.username}</span>@<span class="terminal-cli-hostname">${this.hostname}</span>:<span class="terminal-cli-directory">${this.currentDirectory}</span>$ `;
  }

  /**
   * Show welcome message
   */
  showWelcomeMessage() {
    const welcomeMessage = `
      <div class="terminal-cli-welcome">
        <p>ROBCO INDUSTRIES (TM) TERMLINK PROTOCOL</p>
        <p>NOSYT LABS SECURE TERMINAL v1.0.0</p>
        <p>Type 'help' to see available commands.</p>
      </div>
    `;
    this.appendToHistory(welcomeMessage);
  }

  /**
   * Execute a command
   * @param {string} commandString - The command to execute
   */
  executeCommand(commandString) {
    // Add command to history display
    this.appendToHistory(`<div class="terminal-cli-command"><span class="terminal-cli-prompt">${this.promptElement.innerHTML}</span>${commandString}</div>`);
    
    // Parse command and arguments
    const args = commandString.split(' ');
    const command = args.shift().toLowerCase();
    
    // Check if command exists
    if (this.commandRegistry[command]) {
      try {
        const output = this.commandRegistry[command].execute(args);
        if (output) {
          this.appendToHistory(`<div class="terminal-cli-output">${output}</div>`);
        }
      } catch (error) {
        this.appendToHistory(`<div class="terminal-cli-error">Error executing command: ${error.message}</div>`);
      }
    } else if (this.easterEggs[command]) {
      // Execute easter egg
      const output = this.easterEggs[command]();
      if (output) {
        this.appendToHistory(`<div class="terminal-cli-easter-egg">${output}</div>`);
      }
    } else {
      this.appendToHistory(`<div class="terminal-cli-error">Command not found: ${command}</div>`);
    }
    
    // Scroll to bottom
    this.historyElement.scrollTop = this.historyElement.scrollHeight;
  }

  /**
   * Append content to the history element
   * @param {string} content - HTML content to append
   */
  appendToHistory(content) {
    this.historyElement.innerHTML += content;
    this.historyElement.scrollTop = this.historyElement.scrollHeight;
  }

  /**
   * Register a command
   * @param {string} name - Command name
   * @param {Function} execute - Function to execute
   * @param {string} description - Command description
   * @param {string} usage - Command usage
   */
  registerCommand(name, execute, description, usage) {
    this.commandRegistry[name] = {
      execute,
      description,
      usage
    };
  }

  /**
   * Register an easter egg command
   * @param {string} name - Easter egg command name
   * @param {Function} execute - Function to execute
   */
  registerEasterEgg(name, execute) {
    this.easterEggs[name] = execute;
  }

  /**
   * Register default commands
   */
  registerDefaultCommands() {
    // Group command: system
    this.registerCommand('system', (args) => {
      const sub = args[0];
      const subArgs = args.slice(1);
      switch(sub) {
        case 'help':
          return this.commandRegistry['help'].execute(subArgs);
        case 'clear':
          return this.commandRegistry['clear'].execute(subArgs);
        case 'echo':
          return this.commandRegistry['echo'].execute(subArgs);
        case 'date':
          return this.commandRegistry['date'].execute(subArgs);
        case 'whoami':
          return this.commandRegistry['whoami'].execute(subArgs);
        default:
          return 'Unknown system command.';
      }
    }, 'System related commands', 'system [help|clear|echo|date|whoami]');

    // Group command: file
    this.registerCommand('file', (args) => {
      const sub = args[0];
      const subArgs = args.slice(1);
      switch(sub) {
        case 'ls':
          return this.commandRegistry['ls'].execute(subArgs);
        case 'cd':
          return this.commandRegistry['cd'].execute(subArgs);
        case 'cat':
          return this.commandRegistry['cat'].execute(subArgs);
        default:
          return 'Unknown file command.';
      }
    }, 'File system commands', 'file [ls|cd|cat]');

    // Group command: navigate
    this.registerCommand('navigate', (args) => {
      const sub = args[0];
      const subArgs = args.slice(1);
      switch(sub) {
        case 'vault':
          return this.commandRegistry['vault'].execute(subArgs);
        case 'projects':
          return this.commandRegistry['projects'].execute(subArgs);
        case 'about':
          return this.commandRegistry['about'].execute(subArgs);
        case 'contact':
          return this.commandRegistry['contact'].execute(subArgs);
        default:
          return 'Unknown navigation command.';
      }
    }, 'Navigation commands', 'navigate [vault|projects|about|contact]');

    // Register aliases for backward compatibility
    const alias = (name, group, sub) => {
      this.registerCommand(name, (args) => {
        return this.commandRegistry[group].execute([sub, ...args]);
      }, this.commandRegistry[name]?.description || '', `${name} [args]`);
    };

    // Register original commands
    this.registerCommand('help', (args) => {
      if (args.length > 0) {
        const commandName = args[0].toLowerCase();
        if (this.commandRegistry[commandName]) {
          return `
            <div class="terminal-cli-help">
              <h3>${commandName}</h3>
              <p>${this.commandRegistry[commandName].description}</p>
              <p>Usage: ${this.commandRegistry[commandName].usage}</p>
            </div>
          `;
        } else {
          return `Command not found: ${commandName}`;
        }
      }

      let output = '<div class="terminal-cli-help"><h3>Available Commands:</h3>';

      output += '<h4>System</h4><ul>';
      ['help', 'clear', 'echo', 'date', 'whoami'].forEach(cmd => {
        if (this.commandRegistry[cmd]) {
          output += `<li><strong>${cmd}</strong> - ${this.commandRegistry[cmd].description}</li>`;
        }
      });
      output += '</ul>';

      output += '<h4>File</h4><ul>';
      ['ls', 'cd', 'cat'].forEach(cmd => {
        if (this.commandRegistry[cmd]) {
          output += `<li><strong>${cmd}</strong> - ${this.commandRegistry[cmd].description}</li>`;
        }
      });
      output += '</ul>';

      output += '<h4>Navigation</h4><ul>';
      ['vault', 'projects', 'about', 'contact'].forEach(cmd => {
        if (this.commandRegistry[cmd]) {
          output += `<li><strong>${cmd}</strong> - ${this.commandRegistry[cmd].description}</li>`;
        }
      });
      output += '</ul>';

      output += '<p>Type "help [command]" for more information about a specific command.</p>';
      output += '<p class="terminal-hint">Psst... some secrets await the curious explorer.</p>';
      output += '</div>';

      return output;
    }, 'Display help information', 'help [command]');

    this.registerCommand('clear', () => {
      this.historyElement.innerHTML = '';
      return '';
    }, 'Clear the terminal screen', 'clear');

    this.registerCommand('echo', (args) => {
      return args.join(' ');
    }, 'Display a line of text', 'echo [text]');

    this.registerCommand('date', () => {
      return new Date().toString();
    }, 'Display the current date and time', 'date');

    this.registerCommand('whoami', () => {
      return this.username;
    }, 'Display current user', 'whoami');

    this.registerCommand('ls', (args) => {
      const path = args[0] || this.currentDirectory;
      const directory = this.getDirectoryFromPath(path);
      if (!directory) {
        return `ls: cannot access '${path}': No such file or directory`;
      }
      let output = '<div class="terminal-cli-ls">';
      for (const dir in directory.directories) {
        output += `<div class="terminal-cli-directory-item">${dir}/</div>`;
      }
      for (const file in directory.files) {
        output += `<div class="terminal-cli-file-item">${file}</div>`;
      }
      output += '</div>';
      return output;
    }, 'List directory contents', 'ls [directory]');

    this.registerCommand('cd', (args) => {
      const path = args[0] || '/home/vault-tec';
      if (path === '..') {
        const parts = this.currentDirectory.split('/');
        parts.pop();
        this.currentDirectory = parts.join('/') || '/';
        this.updatePrompt();
        return '';
      }
      const directory = this.getDirectoryFromPath(path);
      if (!directory) {
        return `cd: no such directory: ${path}`;
      }
      if (path.startsWith('/')) {
        this.currentDirectory = path;
      } else {
        this.currentDirectory = this.currentDirectory === '/' ? `/${path}` : `${this.currentDirectory}/${path}`;
      }
      this.updatePrompt();
      return '';
    }, 'Change the current directory', 'cd [directory]');

    this.registerCommand('cat', (args) => {
      if (args.length === 0) {
        return 'Usage: cat [file]';
      }
      const path = args[0];
      const file = this.getFileFromPath(path);
      if (!file) {
        return `cat: ${path}: No such file or directory`;
      }
      return file.content;
    }, 'Display file content', 'cat [file]');


    this.registerCommand('projects', () => {
      window.location.href = '/projects';
      return 'Loading Nosyt Labs projects...';
    }, 'View Nosyt Labs projects', 'projects');

    this.registerCommand('about', () => {
      window.location.href = '/about';
      return 'Loading information about Nosyt Labs...';
    }, 'View information about Nosyt Labs', 'about');

    this.registerCommand('contact', () => {
      window.location.href = '/contact';
      return 'Loading contact information...';
    }, 'Contact Nosyt Labs', 'contact');

    // Register aliases
    alias('ls', 'file', 'ls');
    alias('cd', 'file', 'cd');
    alias('cat', 'file', 'cat');

    alias('help', 'system', 'help');
    alias('clear', 'system', 'clear');
    alias('echo', 'system', 'echo');
    alias('date', 'system', 'date');
    alias('whoami', 'system', 'whoami');

    alias('vault', 'navigate', 'vault');
    alias('projects', 'navigate', 'projects');
    alias('about', 'navigate', 'about');
    alias('contact', 'navigate', 'contact');

    // Register easter eggs
    this.registerEasterEgg('nuka-cola', () => {
      return `
        <div class="terminal-cli-easter-egg">
          <pre>
          _____
         |_____|
         |  _  |
         | | | |
         | |_| |
         |_____|
          </pre>
          <p>You found a Nuka-Cola! +15 HP, +5 Rads</p>
        </div>
      `;
    });

    this.registerEasterEgg('war', () => {
      return 'War... War never changes.';
    });
  }

  /**
   * Autocomplete command
   */
  autocompleteCommand() {
    const input = this.inputElement.value;
    const args = input.split(' ');
    
    if (args.length === 1) {
      // Autocomplete command name
      const partialCommand = args[0].toLowerCase();
      const matches = Object.keys(this.commandRegistry).filter(cmd => 
        cmd.startsWith(partialCommand)
      );
      
      if (matches.length === 1) {
        this.inputElement.value = matches[0] + ' ';
      } else if (matches.length > 1) {
        this.appendToHistory(`<div class="terminal-cli-autocomplete">${matches.join('  ')}</div>`);
      }
    }
  }

  /**
   * Initialize virtual file system
   * @returns {Object} Virtual file system
   */
  initializeFileSystem() {
    return {
      directories: {
        'home': {
          directories: {
            'vault-tec': {
              directories: {
                documents: {
                  directories: {},
                  files: {
                    'readme.txt': {
                      content: 'Welcome to the Vault-Tec terminal!'
                    }
                  }
                },
                projects: {
                  directories: {},
                  files: {
                    'project1.txt': {
                      content: 'Project 1: Secure Vault Door'
                    },
                    'project2.txt': {
                      content: 'Project 2: Radiation Monitoring System'
                    }
                  }
                }
              },
              files: {
                'notes.txt': {
                  content: 'Remember to check the reactor core.'
                }
              }
            }
          },
          files: {}
        }
      },
      files: {}
    };
  }

  /**
   * Get directory object from path
   * @param {string} path
   * @returns {Object|null}
   */
  getDirectoryFromPath(path) {
    if (!path || path === '/') {
      return this.fileSystem;
    }
    const parts = path.replace(/^\/+|\/+$/g, '').split('/');
    let current = this.fileSystem;
    for (const part of parts) {
      if (current.directories && current.directories[part]) {
        current = current.directories[part];
      } else {
        return null;
      }
    }
    return current;
  }

  /**
   * Get file object from path
   * @param {string} path
   * @returns {Object|null}
   */
  getFileFromPath(path) {
    if (!path) return null;
    const parts = path.replace(/^\/+|\/+$/g, '').split('/');
    let current = this.fileSystem;
    for (let i = 0; i < parts.length - 1; i++) {
      if (current.directories && current.directories[parts[i]]) {
        current = current.directories[parts[i]];
      } else {
        return null;
      }
    }
    const fileName = parts[parts.length - 1];
    if (current.files && current.files[fileName]) {
      return current.files[fileName];
    }
    return null;
  }
}