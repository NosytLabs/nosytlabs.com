/**
 * Enhanced Terminal for NosytOS95
 * Provides a comprehensive command system with detailed help documentation and Easter eggs
 */

document.addEventListener('DOMContentLoaded', () => {
  const terminalInput = document.getElementById('terminal-input');
  const terminalOutput = document.getElementById('terminal-output');
  const terminalWindow = document.getElementById('terminal-window');

  if (!terminalInput || !terminalOutput || !terminalWindow) return;

  // Command history
  let commandHistory = [];
  let historyIndex = -1;

  // Current directory
  let currentDirectory = 'C:\\';

  // Helper function to get directory from path
  function getDirectoryFromPath(path) {
    // Handle root directory
    if (path === 'C:\\' || path === 'C:' || path === '\\') {
      return fileSystem['C:\\'];
    }

    // Normalize path
    let normalizedPath = path;
    if (!normalizedPath.startsWith('C:\\')) {
      // Relative path
      normalizedPath = currentDirectory + normalizedPath;
    }

    // Ensure path ends with backslash for directories
    if (!normalizedPath.endsWith('\\')) {
      normalizedPath += '\\';
    }

    // Split path into components
    const parts = normalizedPath.split('\\').filter(p => p !== '');

    // Start from root
    let current = fileSystem['C:\\'];

    // Traverse path
    for (let i = 1; i < parts.length; i++) {
      const part = parts[i];
      if (current.type === 'directory' && current.contents[part] && current.contents[part].type === 'directory') {
        current = current.contents[part];
      } else {
        return null; // Directory not found
      }
    }

    return current;
  }

  // Helper function to get file from path
  function getFileFromPath(path) {
    // Split path into directory and filename
    const parts = path.split('\\');
    const filename = parts.pop();
    const dirPath = parts.join('\\') + '\\';

    // Get directory
    const directory = getDirectoryFromPath(dirPath);
    if (!directory) {
      return null; // Directory not found
    }

    // Get file
    if (directory.contents[filename] && directory.contents[filename].type === 'file') {
      return directory.contents[filename];
    }

    return null; // File not found
  }

  // Helper function to format file size
  function formatFileSize(size) {
    if (size < 1024) {
      return size + ' bytes';
    } else if (size < 1024 * 1024) {
      return (size / 1024).toFixed(2) + ' KB';
    } else {
      return (size / (1024 * 1024)).toFixed(2) + ' MB';
    }
  }

  // Helper function to get directory from path
  function getDirectoryFromPath(path) {
    // Handle root directory
    if (path === 'C:\\' || path === 'C:' || path === '\\') {
      return fileSystem['C:\\'];
    }

    // Normalize path
    let normalizedPath = path;
    if (!normalizedPath.startsWith('C:\\')) {
      // Relative path
      normalizedPath = currentDirectory + normalizedPath;
    }

    // Ensure path ends with backslash for directories
    if (!normalizedPath.endsWith('\\')) {
      normalizedPath += '\\';
    }

    // Split path into components
    const parts = normalizedPath.split('\\').filter(p => p !== '');

    // Start from root
    let current = fileSystem['C:\\'];

    // Traverse path
    for (let i = 1; i < parts.length; i++) {
      const part = parts[i];
      if (current.type === 'directory' && current.contents[part] && current.contents[part].type === 'directory') {
        current = current.contents[part];
      } else {
        return null; // Directory not found
      }
    }

    return current;
  }

  // Helper function to get file from path
  function getFileFromPath(path) {
    // Split path into directory and filename
    const parts = path.split('\\');
    const filename = parts.pop();
    const dirPath = parts.join('\\') + '\\';

    // Get directory
    const directory = getDirectoryFromPath(dirPath);
    if (!directory) {
      return null; // Directory not found
    }

    // Get file
    if (directory.contents[filename] && directory.contents[filename].type === 'file') {
      return directory.contents[filename];
    }

    return null; // File not found
  }

  // Helper function to format file size
  function formatFileSize(size) {
    if (size < 1024) {
      return size + ' bytes';
    } else if (size < 1024 * 1024) {
      return (size / 1024).toFixed(2) + ' KB';
    } else {
      return (size / (1024 * 1024)).toFixed(2) + ' MB';
    }
  }

  // Simulated file system
  const fileSystem = {
    'C:\\': {
      type: 'directory',
      contents: {
        'Program Files': {
          type: 'directory',
          contents: {
            'NosytOS': {
              type: 'directory',
              contents: {
                'README.txt': {
                  type: 'file',
                  content: 'Welcome to NosytOS95!\nThis operating system is designed to showcase NosytLabs services and projects.\nType "help" for a list of available commands.'
                },
                'SERVICES.txt': {
                  type: 'file',
                  content: 'NosytLabs Services:\n- AI Solutions\n- Web Development\n- Mobile Development\n- 3D Printing Services\n\nContact us at info@nosytlabs.com for more information.'
                },
                'EASTEREGGS.txt': {
                  type: 'file',
                  content: 'Nice try! Easter eggs are meant to be discovered, not listed in a file. Keep exploring!'
                }
              }
            }
          }
        },
        'Documents': {
          type: 'directory',
          contents: {
            'Projects.txt': {
              type: 'file',
              content: 'Current Projects:\n1. AI-powered code editor\n2. 3D printing automation system\n3. Web development framework\n4. Mobile app for IoT devices'
            },
            'Notes.txt': {
              type: 'file',
              content: 'Remember to check out the hidden commands in the terminal!\nTry: matrix, coffee, snake, credits, konami, and more...'
            }
          }
        },
        'Games': {
          type: 'directory',
          contents: {
            'Snake.exe': { type: 'executable', launches: 'snake' },
            'Doom.exe': { type: 'executable', launches: 'doom' },
            'DuckHunt.exe': { type: 'executable', launches: 'duck-hunt' }
          }
        },
        'Secret': {
          type: 'directory',
          hidden: true,
          contents: {
            'EasterEgg.txt': {
              type: 'file',
              content: 'Congratulations! You found a secret file!\nHere\'s a hint: Try typing "konami" in the terminal.'
            }
          }
        }
      }
    }
  };

  // Available commands
  const commands = {
    help: {
      description: 'Displays a list of available commands',
      usage: 'help [command]',
      execute: (args) => {
        if (args.length > 0) {
          const commandName = args[0].toLowerCase();
          if (commands[commandName]) {
            const cmd = commands[commandName];
            return [
              `Help for command: ${commandName}`,
              `Description: ${cmd.description}`,
              `Usage: ${cmd.usage || commandName}`,
              cmd.longDescription ? `\n${cmd.longDescription}` : ''
            ].join('\n');
          } else {
            return `Command not found: ${commandName}. Type 'help' for a list of available commands.`;
          }
        }

        let output = 'Available commands:\n\n';
        Object.keys(commands).sort().forEach(cmd => {
          if (!commands[cmd].hidden) {
            output += `${cmd.padEnd(15)} - ${commands[cmd].description}\n`;
          }
        });
        output += '\nType "help [command]" for more information on a specific command.';
        return output;
      }
    },

    dir: {
      description: 'Lists files and directories in the current directory',
      usage: 'dir [path]',
      longDescription: 'The dir command displays a list of files, directories, and other objects in the current directory or specified path. It shows the name, size, type, and last modified date of each item.',
      execute: (args) => {
        const path = args.length > 0 ? args[0] : currentDirectory;
        const dirObj = getDirectoryFromPath(path);

        if (!dirObj || dirObj.type !== 'directory') {
          return `The system cannot find the path specified: ${path}`;
        }

        let output = `Directory of ${path}\n\n`;
        output += 'Name'.padEnd(20) + 'Type'.padEnd(15) + 'Size\n';
        output += '-'.repeat(40) + '\n';

        Object.keys(dirObj.contents).forEach(item => {
          const itemObj = dirObj.contents[item];
          if (!itemObj.hidden) {
            const type = itemObj.type === 'directory' ? '<DIR>' : itemObj.type === 'executable' ? '<EXE>' : '<FILE>';
            const size = itemObj.type === 'file' ? `${itemObj.content.length} bytes` : '';
            output += `${item.padEnd(20)}${type.padEnd(15)}${size}\n`;
          }
        });

        return output;
      }
    },

    cd: {
      description: 'Changes the current directory',
      usage: 'cd [path]',
      longDescription: 'The cd command changes the current working directory to the specified path. If no path is provided, it displays the current directory. Use "cd .." to move up one level.',
      execute: (args) => {
        if (args.length === 0) {
          return currentDirectory;
        }

        const path = args[0];

        if (path === '..') {
          // Move up one directory
          const parts = currentDirectory.split('\\');
          if (parts.length > 2) {
            parts.pop();
            currentDirectory = parts.join('\\') + '\\';
            return `Changed directory to ${currentDirectory}`;
          } else {
            return `Already at root directory: ${currentDirectory}`;
          }
        }

        // Handle absolute paths
        let targetPath = path;
        if (!path.includes(':\\')) {
          // Relative path
          targetPath = currentDirectory + path;
          if (!targetPath.endsWith('\\')) {
            targetPath += '\\';
          }
        }

        const dirObj = getDirectoryFromPath(targetPath);

        if (!dirObj || dirObj.type !== 'directory') {
          return `The system cannot find the path specified: ${path}`;
        }

        currentDirectory = targetPath;
        return `Changed directory to ${currentDirectory}`;
      }
    },

    type: {
      description: 'Displays the contents of a text file',
      usage: 'type [filename]',
      longDescription: 'The type command displays the contents of a text file. It reads the file and outputs its content to the terminal.',
      execute: (args) => {
        if (args.length === 0) {
          return 'Error: No filename specified. Usage: type [filename]';
        }

        const filename = args[0];
        const file = getFileFromPath(currentDirectory + filename);

        if (!file || file.type !== 'file') {
          return `The system cannot find the file specified: ${filename}`;
        }

        return file.content;
      }
    },

    cls: {
      description: 'Clears the terminal screen',
      usage: 'cls',
      execute: () => {
        terminalOutput.innerHTML = '';
        return '';
      }
    },

    echo: {
      description: 'Displays messages or turns command echoing on or off',
      usage: 'echo [message]',
      execute: (args) => {
        if (args.length === 0) {
          return 'ECHO is on.';
        }

        return args.join(' ');
      }
    },

    date: {
      description: 'Displays the current date',
      usage: 'date',
      execute: () => {
        const now = new Date();
        return `Current date: ${now.toLocaleDateString()}`;
      }
    },

    time: {
      description: 'Displays the current time',
      usage: 'time',
      execute: () => {
        const now = new Date();
        return `Current time: ${now.toLocaleTimeString()}`;
      }
    },

    ver: {
      description: 'Displays the NosytOS version',
      usage: 'ver',
      execute: () => {
        return 'NosytOS [Version 1.0.2025]\n(c) 2025 NosytLabs. All rights reserved.';
      }
    },

    launch: {
      description: 'Launches a NosytOS application',
      usage: 'launch [app] [/max]',
      longDescription: 'The launch command starts a NosytOS application. Available applications include:\n- notepad: Text editor\n- browser: Internet Explorer\n- doom: Doom II game\n- duck-hunt: Duck Hunt game\n- ai: Nosyt AI Assistant\n- my-computer: File explorer\n\nAdd the /max flag to open the application maximized.',
      execute: (args) => {
        if (args.length === 0) {
          return 'Error: No application specified. Usage: launch [app] [/max]';
        }

        const app = args[0].toLowerCase();
        const maximized = args.includes('/max');

        // Map of app names to window IDs
        const appWindows = {
          'notepad': 'notepad-window',
          'browser': 'browser-window',
          'doom': 'doom-window',
          'duck-hunt': 'duck-hunt-window',
          'ai': 'nosyt-ai-window',
          'my-computer': 'my-computer-window',
          'help': 'help-window'
        };

        if (app === 'help') {
          return `Available applications:\n${Object.keys(appWindows).filter(a => a !== 'help').join('\n')}\n\nUsage: launch [app] [/max]`;
        }

        if (!appWindows[app]) {
          return `Error: Application "${app}" not found. Type "launch help" for a list of available applications.`;
        }

        const windowId = appWindows[app];
        const appWindow = document.getElementById(windowId);

        if (!appWindow) {
          return `Error: Could not launch ${app}. Window element not found.`;
        }

        // Hide all windows first
        document.querySelectorAll('.win95-window').forEach(win => {
          win.style.display = 'none';
        });

        // Show the selected window
        appWindow.style.display = 'block';

        // Maximize if requested
        if (maximized) {
          const maxButton = appWindow.querySelector('.window-maximize');
          if (maxButton) {
            // Trigger a click on the maximize button
            maxButton.click();
          }
        }

        // Bring to front
        const zIndex = Array.from(document.querySelectorAll('.win95-window'))
          .map(win => parseInt(win.style.zIndex || 0))
          .reduce((max, z) => Math.max(max, z), 0);

        appWindow.style.zIndex = zIndex + 1;

        return `Launched ${app}${maximized ? ' (maximized)' : ''}.`;
      }
    },

    // Easter egg commands
    matrix: {
      description: 'Displays a Matrix-like animation',
      hidden: true,
      execute: () => {
        let output = '';
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%^&*()';

        for (let i = 0; i < 15; i++) {
          let line = '';
          for (let j = 0; j < 50; j++) {
            line += chars.charAt(Math.floor(Math.random() * chars.length));
          }
          output += `<span style="color: #00FF00;">${line}</span>\n`;
        }

        output += '\nFollow the white rabbit...';
        return output;
      }
    },

    coffee: {
      description: 'Brews a virtual cup of coffee',
      hidden: true,
      execute: () => {
        return `
        <pre style="color: #8B4513;">
                       (
                        )     (
                 ___...(-------)-....___
             .-""       )    (          ""-.
       .-'``'|-._             )         _.-|
      /  .--.|   \`""---...........---""\`   |
     /  /    |                             |
     |  |    |                             |
      \\  \\   |                             |
       \`\\ \`\\ |                             |
         \`\\ \`|                             |
         _/ /\\                             /
        (__/  \\                           /
     _..---""` + '`' + `\\                         /` + '`' + `""---.._
  .-'           \\                       /          \`-.
 :               \`-.__             __.-'              :
 :                  ) ""---...---"" (                 :
  '._               \`"--...___...--"\`              _.'
    \\""--..__                              __..--""/
     '._     """----.....______.....----"""     _.'
        \`""--..,,_____            _____,,..--""\`
                      \`"""----"""\`
</pre>
        <p>Your coffee is ready! ☕ Enjoy the caffeine boost!</p>
        `;
      }
    },

    snake: {
      description: 'Launches a simple Snake game',
      hidden: true,
      execute: () => {
        return `
        <p>Snake game is loading...</p>
        <p>Use arrow keys to control the snake. Collect food to grow longer.</p>
        <p>Press any key to start the game.</p>
        <div id="snake-game" style="width: 300px; height: 300px; border: 1px solid #ccc; position: relative; background-color: #000;"></div>
        <script>
          // Simple Snake game implementation would go here
          // This is a placeholder message
          document.getElementById('snake-game').innerHTML = '<div style="color: white; padding: 20px;">Snake game is not implemented in this demo. But imagine a fun game here!</div>';
        </script>
        `;
      }
    },

    credits: {
      description: 'Displays the credits for NosytOS95',
      hidden: true,
      execute: () => {
        return `
        <div style="text-align: center; font-family: monospace;">
          <p style="font-size: 16px; font-weight: bold;">NosytOS95</p>
          <p>Version 1.0.2025</p>
          <p>&nbsp;</p>
          <p>Created by NosytLabs</p>
          <p>&nbsp;</p>
          <p>DEVELOPMENT TEAM</p>
          <p>--------------</p>
          <p>Lead Developer: Tycen</p>
          <p>UI/UX Design: NosytLabs Design Team</p>
          <p>Testing: Quality Assurance Team</p>
          <p>&nbsp;</p>
          <p>SPECIAL THANKS</p>
          <p>-------------</p>
          <p>All our users and supporters</p>
          <p>&nbsp;</p>
          <p>© 2025 NosytLabs</p>
          <p>Notable Opportunities Shape Your Tomorrow</p>
        </div>
        `;
      }
    },

    konami: {
      description: 'Activates the Konami code Easter egg',
      hidden: true,
      execute: () => {
        return `
        <p style="text-align: center; font-size: 16px;">🎮 KONAMI CODE ACTIVATED! 🎮</p>
        <p style="text-align: center;">↑↑↓↓←→←→BA</p>
        <p style="text-align: center;">You've unlocked unlimited lives! (Not really, but imagine if you did!)</p>
        <p style="text-align: center;">Try clicking on the desktop background 10 times quickly for another surprise!</p>
        `;
      }
    }
  };

  // Process a command
  function processCommand(commandStr) {
    if (!commandStr.trim()) {
      return '';
    }

    // Add to history
    commandHistory.push(commandStr);
    historyIndex = commandHistory.length;

    // Parse command and arguments
    const parts = commandStr.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    // Execute command if it exists
    if (commands[cmd]) {
      return commands[cmd].execute(args);
    } else {
      return `'${cmd}' is not recognized as an internal or external command, operable program or batch file.`;
    }
  }



  // Add output to the terminal
  function addOutput(text) {
    if (!text) return;

    // Check if the text contains HTML
    if (text.includes('<')) {
      // It's HTML content
      const div = document.createElement('div');
      div.innerHTML = text;
      terminalOutput.appendChild(div);
    } else {
      // Plain text, preserve line breaks
      text.split('\n').forEach(line => {
        const p = document.createElement('p');
        p.textContent = line;
        terminalOutput.appendChild(p);
      });
    }

    // Scroll to bottom
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  // Handle input submission
  function handleInput(e) {
    if (e.key === 'Enter') {
      e.preventDefault();

      const command = terminalInput.value;

      // Add command to output
      const prompt = document.createElement('p');
      prompt.innerHTML = `<span class="terminal-prompt">C:\\&gt;</span> ${command}`;
      terminalOutput.appendChild(prompt);

      // Process command
      const output = processCommand(command);
      addOutput(output);

      // Clear input
      terminalInput.value = '';

      // Add new prompt
      const inputLine = document.querySelector('.terminal-input-line');
      if (inputLine) {
        const promptSpan = inputLine.querySelector('.terminal-prompt');
        if (promptSpan) {
          promptSpan.textContent = `${currentDirectory}>`;
        }
      }

      // Scroll to bottom
      terminalOutput.scrollTop = terminalOutput.scrollHeight;
    } else if (e.key === 'ArrowUp') {
      // Navigate history up
      if (historyIndex > 0) {
        historyIndex--;
        terminalInput.value = commandHistory[historyIndex];
      }
      e.preventDefault();
    } else if (e.key === 'ArrowDown') {
      // Navigate history down
      if (historyIndex < commandHistory.length - 1) {
        historyIndex++;
        terminalInput.value = commandHistory[historyIndex];
      } else {
        historyIndex = commandHistory.length;
        terminalInput.value = '';
      }
      e.preventDefault();
    } else if (e.key === 'Tab') {
      // Command completion (simple version)
      e.preventDefault();

      const partial = terminalInput.value.toLowerCase();
      if (partial) {
        const matches = Object.keys(commands).filter(cmd => cmd.startsWith(partial));
        if (matches.length === 1) {
          terminalInput.value = matches[0];
        } else if (matches.length > 1) {
          // Show possible completions
          const prompt = document.createElement('p');
          prompt.innerHTML = `<span class="terminal-prompt">C:\\&gt;</span> ${partial}`;
          terminalOutput.appendChild(prompt);

          const completions = document.createElement('p');
          completions.textContent = matches.join('  ');
          terminalOutput.appendChild(completions);

          // Scroll to bottom
          terminalOutput.scrollTop = terminalOutput.scrollHeight;
        }
      }
    }
  }

  // Set up event listeners
  terminalInput.addEventListener('keydown', handleInput);

  // Focus input when terminal window is clicked
  terminalWindow.addEventListener('click', () => {
    terminalInput.focus();
  });

  // Initial welcome message
  addOutput('NosytOS Terminal [Version 1.0.2025]');
  addOutput('(c) 2025 NosytLabs. All rights reserved.');
  addOutput('');
  addOutput('Type "help" for a list of available commands.');
  addOutput('');
});
