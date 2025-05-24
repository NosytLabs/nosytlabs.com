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
