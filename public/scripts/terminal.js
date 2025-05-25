/**
 * Terminal script for NosytOS95
 * A simple command-line interface for the Windows 95-style terminal
 */

class Terminal {
  constructor() {
    // Terminal elements
    this.output = document.getElementById('terminal-output');
    this.input = document.getElementById('terminal-input');
    this.history = [];
    this.historyIndex = -1;
    this.currentDirectory = 'C:\\';

    // Available commands
    this.commands = {
      help: {
        description: 'Displays help information for available commands',
        execute: this.showHelp.bind(this)
      },
      cls: {
        description: 'Clears the terminal screen',
        execute: this.clearScreen.bind(this)
      },
      dir: {
        description: 'Displays a list of files and folders',
        execute: this.listDirectory.bind(this)
      },
      cd: {
        description: 'Changes the current directory',
        execute: this.changeDirectory.bind(this)
      },
      echo: {
        description: 'Displays messages or turns command echoing on or off',
        execute: this.echo.bind(this)
      },
      date: {
        description: 'Displays or sets the date',
        execute: this.showDate.bind(this)
      },
      time: {
        description: 'Displays or sets the system time',
        execute: this.showTime.bind(this)
      },
      ver: {
        description: 'Displays the NosytOS version',
        execute: this.showVersion.bind(this)
      },
      nosyt: {
        description: 'Displays information about NosytLabs',
        execute: this.showNosytInfo.bind(this)
      },
      services: {
        description: 'Lists NosytLabs services',
        execute: this.showServices.bind(this)
      },
      projects: {
        description: 'Lists NosytLabs projects',
        execute: this.showProjects.bind(this)
      },
      launch: {
        description: 'Launches an application (launch <app-name>)',
        execute: this.launchApp.bind(this)
      },
      exit: {
        description: 'Closes the terminal window',
        execute: this.exit.bind(this)
      }
    };

    // Easter egg commands (hidden from help)
    this.easterEggs = {
      matrix: this.showMatrix.bind(this),
      hack: this.simulateHacking.bind(this),
      secret: this.showSecret.bind(this),
      rickroll: this.rickRoll.bind(this)
    };

    // Initialize the terminal
    this.init();
  }

  init() {
    if (!this.input || !this.output) return;

    // Set up event listeners
    this.input.addEventListener('keydown', this.handleKeyDown.bind(this));

    // Focus the input when the terminal window is clicked
    document.getElementById('terminal-window').addEventListener('click', () => {
      this.input.focus();
    });

    // Focus input on initialization
    this.input.focus();
  }

  handleKeyDown(e) {
    if (e.key === 'Enter') {
      this.processCommand();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.navigateHistory(-1);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.navigateHistory(1);
    } else if (e.key === 'Tab') {
      e.preventDefault();
      this.autocomplete();
    }
  }

  processCommand() {
    const commandText = this.input.value.trim();

    if (commandText) {
      // Add to history
      this.history.push(commandText);
      this.historyIndex = this.history.length;

      // Display command
      this.appendOutput(`${this.currentDirectory}> ${commandText}`);

      // Process command
      const parts = commandText.split(' ');
      const command = parts[0].toLowerCase();
      const args = parts.slice(1);

      // Execute command
      if (this.commands[command]) {
        this.commands[command].execute(args);
      } else if (this.easterEggs[command]) {
        this.easterEggs[command](args);
      } else {
        this.appendOutput(`'${command}' is not recognized as an internal or external command, operable program or batch file.`);
      }
    } else {
      // Just show a new prompt if empty command
      this.appendOutput(`${this.currentDirectory}>`);
    }

    // Clear input and scroll to bottom
    this.input.value = '';
    this.scrollToBottom();
  }

  appendOutput(text) {
    const line = document.createElement('p');
    line.textContent = text;
    this.output.appendChild(line);
  }

  scrollToBottom() {
    this.output.scrollTop = this.output.scrollHeight;
  }

  navigateHistory(direction) {
    if (this.history.length === 0) return;

    this.historyIndex += direction;

    if (this.historyIndex < 0) {
      this.historyIndex = 0;
    } else if (this.historyIndex > this.history.length) {
      this.historyIndex = this.history.length;
      this.input.value = '';
      return;
    }

    if (this.historyIndex === this.history.length) {
      this.input.value = '';
    } else {
      this.input.value = this.history[this.historyIndex];
    }

    // Move cursor to end
    setTimeout(() => {
      this.input.selectionStart = this.input.selectionEnd = this.input.value.length;
    }, 0);
  }

  autocomplete() {
    const text = this.input.value.trim();

    if (!text) return;

    const parts = text.split(' ');

    if (parts.length === 1) {
      // Command autocomplete
      const command = parts[0].toLowerCase();
      const matches = Object.keys(this.commands).filter(cmd => cmd.startsWith(command));

      if (matches.length === 1) {
        this.input.value = matches[0];
      } else if (matches.length > 1) {
        this.appendOutput(`${this.currentDirectory}> ${text}`);
        this.appendOutput(matches.join('  '));
      }
    }
  }

  // Command implementations
  showHelp() {
    this.appendOutput('Available commands:');
    this.appendOutput('');

    Object.keys(this.commands).sort().forEach(cmd => {
      this.appendOutput(`  ${cmd.padEnd(10)} - ${this.commands[cmd].description}`);
    });

    this.appendOutput('');
    this.appendOutput('For more information on a specific command, type: HELP command-name');
  }

  clearScreen() {
    while (this.output.firstChild) {
      this.output.removeChild(this.output.firstChild);
    }
  }

  listDirectory() {
    this.appendOutput(' Directory of ' + this.currentDirectory);
    this.appendOutput('');

    // Simulate directory listing based on current directory
    if (this.currentDirectory === 'C:\\') {
      this.appendOutput(' <DIR>    Programs');
      this.appendOutput(' <DIR>    Projects');
      this.appendOutput(' <DIR>    Documents');
      this.appendOutput(' <DIR>    AI Tools');
      this.appendOutput('          README.txt');
      this.appendOutput('          SERVICES.txt');
    } else if (this.currentDirectory === 'C:\\Programs') {
      this.appendOutput(' <DIR>    NosytAI');
      this.appendOutput(' <DIR>    DuckHunt');
      this.appendOutput(' <DIR>    Notepad');
      this.appendOutput(' <DIR>    Browser');
    } else if (this.currentDirectory === 'C:\\Projects') {
      this.appendOutput(' <DIR>    WebDev');
      this.appendOutput(' <DIR>    AISolutions');
      this.appendOutput(' <DIR>    3DPrinting');
      this.appendOutput(' <DIR>    ContentCreation');
    } else if (this.currentDirectory === 'C:\\AI Tools') {
      this.appendOutput('          CursorAI.exe');
      this.appendOutput('          TraeAI.exe');
      this.appendOutput('          RooCodeWindsurf.exe');
      this.appendOutput('          README.md');
    } else {
      this.appendOutput(' <DIR>    .');
      this.appendOutput(' <DIR>    ..');
      this.appendOutput('          (Empty directory)');
    }

    this.appendOutput('');
  }

  changeDirectory(args) {
    if (!args || args.length === 0) {
      this.appendOutput(this.currentDirectory);
      return;
    }

    const dir = args[0];

    if (dir === '..') {
      if (this.currentDirectory !== 'C:\\') {
        this.currentDirectory = this.currentDirectory.split('\\').slice(0, -1).join('\\');
        if (this.currentDirectory.endsWith(':')) {
          this.currentDirectory += '\\';
        }
      }
    } else if (dir === '.') {
      // Stay in current directory
    } else {
      // Simulate directory navigation
      const normalizedDir = dir.replace(/\//g, '\\');
      const fullPath = normalizedDir.startsWith('C:')
        ? normalizedDir
        : `${this.currentDirectory}${this.currentDirectory.endsWith('\\') ? '' : '\\'}${normalizedDir}`;

      // Check if directory exists (simplified simulation)
      const validDirs = [
        'C:\\', 'C:\\Programs', 'C:\\Projects', 'C:\\Documents', 'C:\\AI Tools',
        'C:\\Programs\\NosytAI', 'C:\\Programs\\DuckHunt', 'C:\\Programs\\Notepad', 'C:\\Programs\\Browser',
        'C:\\Projects\\WebDev', 'C:\\Projects\\AISolutions', 'C:\\Projects\\3DPrinting', 'C:\\Projects\\ContentCreation'
      ];

      if (validDirs.includes(fullPath)) {
        this.currentDirectory = fullPath;
      } else {
        this.appendOutput(`The system cannot find the path specified: ${dir}`);
      }
    }
  }

  echo(args) {
    if (!args || args.length === 0) {
      this.appendOutput('ECHO is on.');
    } else {
      this.appendOutput(args.join(' '));
    }
  }

  showDate() {
    const date = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    this.appendOutput(`The current date is: ${date.toLocaleDateString('en-US', options)}`);
  }

  showTime() {
    const date = new Date();
    this.appendOutput(`The current time is: ${date.toLocaleTimeString()}`);
  }

  showVersion() {
    this.appendOutput('NosytOS [Version 1.0.0]');
    this.appendOutput('Copyright (c) 2025 NosytLabs. All rights reserved.');
  }

  showNosytInfo() {
    this.appendOutput('');
    this.appendOutput('  ███╗   ██╗ ██████╗ ███████╗██╗   ██╗████████╗');
    this.appendOutput('  ████╗  ██║██╔═══██╗██╔════╝╚██╗ ██╔╝╚══██╔══╝');
    this.appendOutput('  ██╔██╗ ██║██║   ██║███████╗ ╚████╔╝    ██║   ');
    this.appendOutput('  ██║╚██╗██║██║   ██║╚════██║  ╚██╔╝     ██║   ');
    this.appendOutput('  ██║ ╚████║╚██████╔╝███████║   ██║      ██║   ');
    this.appendOutput('  ╚═╝  ╚═══╝ ╚═════╝ ╚══════╝   ╚═╝      ╚═╝   ');
    this.appendOutput('');
    this.appendOutput('  Notable Opportunities Shape Your Tomorrow');
    this.appendOutput('');
    this.appendOutput('  NosytLabs is a technology company specializing in:');
    this.appendOutput('  - AI Solutions');
    this.appendOutput('  - Web & Mobile Development');
    this.appendOutput('  - 3D Printing Services');
    this.appendOutput('  - Content Creation & Streaming');
    this.appendOutput('');
    this.appendOutput('  Founded in 2025, NosytLabs is committed to delivering');
    this.appendOutput('  innovative solutions that help businesses thrive in');
    this.appendOutput('  the modern digital landscape.');
    this.appendOutput('');
    this.appendOutput('  Visit www.nosytlabs.com for more information.');
  }

  showServices() {
    this.appendOutput('NosytLabs Services:');
    this.appendOutput('');
    this.appendOutput('1. AI Development Solutions');
    this.appendOutput('   - Custom AI Tool Development');
    this.appendOutput('   - AI Implementation Consulting');
    this.appendOutput('   - AI-Powered Automation');
    this.appendOutput('');
    this.appendOutput('2. Web & Mobile Development');
    this.appendOutput('   - Website Development');
    this.appendOutput('   - Mobile App Development');
    this.appendOutput('   - E-commerce Solutions');
    this.appendOutput('');
    this.appendOutput('3. 3D Printing Services');
    this.appendOutput('   - Rapid Prototyping');
    this.appendOutput('   - Custom Model Creation');
    this.appendOutput('   - Small Batch Production');
    this.appendOutput('');
    this.appendOutput('4. Content Creation & Streaming');
    this.appendOutput('   - Video Production');
    this.appendOutput('   - Live Streaming Setup');
    this.appendOutput('   - Content Strategy');
    this.appendOutput('');
    this.appendOutput('For more information, visit www.nosytlabs.com/services');
  }

  showProjects() {
    this.appendOutput('NosytLabs Featured Projects:');
    this.appendOutput('');
    this.appendOutput('1. AI Tools Integration');
    this.appendOutput('   - Cursor AI Implementation');
    this.appendOutput('   - Trae AI Workflow Optimization');
    this.appendOutput('   - Roo Code Windsurf Codebase Navigation');
    this.appendOutput('');
    this.appendOutput('2. Web Development');
    this.appendOutput('   - E-commerce Platform Development');
    this.appendOutput('   - SaaS Application Architecture');
    this.appendOutput('   - Progressive Web Apps');
    this.appendOutput('');
    this.appendOutput('3. 3D Printing');
    this.appendOutput('   - Custom Product Prototypes');
    this.appendOutput('   - Articulated Models');
    this.appendOutput('   - Functional Parts Production');
    this.appendOutput('');
    this.appendOutput('For more information, visit www.nosytlabs.com/projects');
  }

  launchApp(args) {
    if (!args || args.length === 0) {
      this.appendOutput('Please specify an application to launch.');
      this.appendOutput('Usage: launch <app-name>');
      this.appendOutput('Available apps: notepad, duckhunt, doom, nosytai, browser, about, help');
      return;
    }

    const app = args[0].toLowerCase();

    // Map app names to window IDs
    const appMap = {
      notepad: 'notepad-window',
      duckhunt: 'duck-hunt-window',
      doom: 'doom-window',
      nosytai: 'nosyt-ai-window',
      browser: 'browser-window',
      about: 'about-window',
      mycomputer: 'my-computer-window',
      computer: 'my-computer-window',
      explorer: 'my-computer-window'
    };

    // Special commands
    if (app === 'help') {
      this.appendOutput('NosytOS95 Application Launcher Help:');
      this.appendOutput('');
      this.appendOutput('Available applications:');
      this.appendOutput('  notepad    - Text editor for taking notes');
      this.appendOutput('  duckhunt   - Classic Duck Hunt game');
      this.appendOutput('  doom       - DOOM II first-person shooter');
      this.appendOutput('  nosytai    - AI assistant for NosytOS95');
      this.appendOutput('  browser    - Internet Explorer browser');
      this.appendOutput('  about      - About NosytLabs information');
      this.appendOutput('  mycomputer - File explorer (aliases: computer, explorer)');
      this.appendOutput('');
      this.appendOutput('Usage:');
      this.appendOutput('  launch <app-name>       - Launch an application');
      this.appendOutput('  launch <app-name> /max  - Launch maximized');
      this.appendOutput('  launch <app-name> /help - Show app-specific help');
      this.appendOutput('');
      this.appendOutput('Examples:');
      this.appendOutput('  launch doom');
      this.appendOutput('  launch notepad /max');
      this.appendOutput('  launch duckhunt /help');
      return;
    }

    // App-specific help
    if (args.length > 1 && args[1].toLowerCase() === '/help') {
      switch (app) {
        case 'notepad':
          this.appendOutput('Notepad Help:');
          this.appendOutput('A simple text editor for taking notes.');
          this.appendOutput('Features:');
          this.appendOutput('- Create and edit text documents');
          this.appendOutput('- Auto-saves content');
          this.appendOutput('- Supports basic text formatting');
          break;
        case 'duckhunt':
          this.appendOutput('Duck Hunt Help:');
          this.appendOutput('Classic shooting game where you hunt ducks.');
          this.appendOutput('How to play:');
          this.appendOutput('- Click on ducks to shoot them');
          this.appendOutput('- Build combos for bonus points');
          this.appendOutput('- Progress through levels of increasing difficulty');
          this.appendOutput('- Toggle sound with the sound button');
          break;
        case 'doom':
          this.appendOutput('DOOM II Help:');
          this.appendOutput('First-person shooter game.');
          this.appendOutput('Controls:');
          this.appendOutput('- WASD or Arrow keys to move');
          this.appendOutput('- Mouse to aim');
          this.appendOutput('- Click to shoot');
          this.appendOutput('- E key to interact with objects');
          this.appendOutput('- Space bar to shoot (alternative)');
          break;
        case 'nosytai':
          this.appendOutput('Nosyt AI Assistant Help:');
          this.appendOutput('An AI assistant to help with your questions.');
          this.appendOutput('Features:');
          this.appendOutput('- Ask questions about NosytLabs');
          this.appendOutput('- Get information about services and projects');
          this.appendOutput('- Request jokes and fun facts');
          this.appendOutput('- Click suggestion buttons for quick queries');
          break;
        case 'browser':
          this.appendOutput('Internet Explorer Help:');
          this.appendOutput('Web browser for accessing the internet.');
          this.appendOutput('Features:');
          this.appendOutput('- Browse the NosytLabs website');
          this.appendOutput('- Navigation buttons for back, forward, refresh');
          this.appendOutput('- Address bar for viewing current URL');
          break;
        default:
          this.appendOutput(`No specific help available for ${app}.`);
          this.appendOutput('Try "launch help" for general application help.');
      }
      return;
    }

    // Check if app exists
    if (appMap[app]) {
      // Check for maximize flag
      const maximize = args.length > 1 && args[1].toLowerCase() === '/max';

      this.appendOutput(`Launching ${app}${maximize ? ' (maximized)' : ''}...`);

      // Use the window manager to open the window
      setTimeout(() => {
        const windowElement = document.getElementById(appMap[app]);
        if (windowElement) {
          // Hide all windows first
          document.querySelectorAll('.win95-window').forEach(win => {
            win.style.display = 'none';
          });

          // Show the requested window
          windowElement.style.display = 'block';

          // Bring to front
          const zIndex = Array.from(document.querySelectorAll('.win95-window'))
            .map(win => parseInt(getComputedStyle(win).zIndex || 0))
            .reduce((max, z) => Math.max(max, z), 0);

          windowElement.style.zIndex = zIndex + 1;

          // Maximize if requested
          if (maximize) {
            // Find and click the maximize button
            const maximizeButton = windowElement.querySelector('.window-maximize');
            if (maximizeButton) {
              setTimeout(() => {
                maximizeButton.click();
              }, 100);
            }
          }

          // Add a fun message based on the app
          switch (app) {
            case 'doom':
              this.appendOutput('Rip and tear, until it is done!');
              break;
            case 'duckhunt':
              this.appendOutput('Ready, aim, fire!');
              break;
            case 'notepad':
              this.appendOutput('Your digital notepad is ready.');
              break;
            case 'nosytai':
              this.appendOutput('AI assistant at your service!');
              break;
            case 'browser':
              this.appendOutput('Connecting to the information superhighway...');
              break;
          }
        } else {
          this.appendOutput(`Error: Could not find ${app} application.`);
        }
      }, 500);
    } else {
      this.appendOutput(`Unknown application: ${app}`);
      this.appendOutput('Available apps: notepad, duckhunt, doom, nosytai, browser, about, mycomputer');
      this.appendOutput('Type "launch help" for more information.');
    }
  }

  exit() {
    this.appendOutput('Closing terminal...');

    setTimeout(() => {
      const terminalWindow = document.getElementById('terminal-window');
      if (terminalWindow) {
        terminalWindow.style.display = 'none';
      }
    }, 500);
  }

  // Easter egg commands
  showMatrix() {
    this.clearScreen();
    this.appendOutput('Entering the Matrix...');

    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()';
    const lines = 20;

    let i = 0;
    const interval = setInterval(() => {
      let line = '';
      for (let j = 0; j < 40; j++) {
        line += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      this.appendOutput(line);
      this.scrollToBottom();

      i++;
      if (i >= lines) {
        clearInterval(interval);
        setTimeout(() => {
          this.appendOutput('');
          this.appendOutput('Wake up, Neo...');
          this.appendOutput('The Matrix has you...');
          this.appendOutput('Follow the white rabbit.');
          this.appendOutput('');
          this.appendOutput('Knock, knock, Neo.');
        }, 500);
      }
    }, 100);
  }

  simulateHacking() {
    this.clearScreen();
    this.appendOutput('INITIATING HACK SEQUENCE...');

    const steps = [
      'Bypassing firewall...',
      'Accessing mainframe...',
      'Decrypting security protocols...',
      'Downloading sensitive data...',
      'Covering tracks...',
      'Exiting system...'
    ];

    let i = 0;
    const interval = setInterval(() => {
      this.appendOutput(`[${Math.floor(i/steps.length * 100)}%] ${steps[i]}`);
      this.scrollToBottom();

      i++;
      if (i >= steps.length) {
        clearInterval(interval);
        setTimeout(() => {
          this.appendOutput('');
          this.appendOutput('HACK COMPLETE!');
          this.appendOutput('');
          this.appendOutput('Just kidding! This is just a harmless easter egg.');
          this.appendOutput('No actual hacking occurred.');
        }, 500);
      }
    }, 800);
  }

  showSecret() {
    this.appendOutput('');
    this.appendOutput('Congratulations! You found a secret command!');
    this.appendOutput('');
    this.appendOutput('Here are some other hidden commands to try:');
    this.appendOutput('- matrix');
    this.appendOutput('- hack');
    this.appendOutput('- rickroll');
    this.appendOutput('');
    this.appendOutput('There might be more secrets to discover...');
  }

  rickRoll() {
    this.appendOutput('');
    this.appendOutput('Never gonna give you up');
    this.appendOutput('Never gonna let you down');
    this.appendOutput('Never gonna run around and desert you');
    this.appendOutput('Never gonna make you cry');
    this.appendOutput('Never gonna say goodbye');
    this.appendOutput('Never gonna tell a lie and hurt you');
    this.appendOutput('');
  }
}

// Initialize the terminal when the window is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize if the terminal window exists
  const terminalWindow = document.getElementById('terminal-window');
  if (terminalWindow) {
    // Initialize when the window is opened
    const terminalIcon = document.getElementById('terminal-icon');
    if (terminalIcon) {
      terminalIcon.addEventListener('dblclick', () => {
        setTimeout(() => {
          new Terminal();
        }, 500); // Short delay to ensure window is fully opened
      });
    }

    // Also initialize if window is already open
    if (terminalWindow.style.display !== 'none') {
      new Terminal();
    }
  }
});
