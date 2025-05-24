// Terminal
function initTerminal() {
  const terminalWindow = document.getElementById('terminal-window');
  const terminalOutput = document.getElementById('terminal-output');
  const terminalInput = document.getElementById('terminal-input');
  
  if (terminalWindow && terminalOutput && terminalInput) {
    // Focus input when terminal is active
    terminalWindow.addEventListener('click', function() {
      terminalInput.focus();
    });
    
    // Handle input
    terminalInput.addEventListener('keydown', function(e) {
      if (e.key === 'Enter') {
        const command = this.value.trim();
        
        // Add command to output
        terminalOutput.innerHTML += '<div>C:\\> ' + command + '</div>';
        
        // Process command
        processCommand(command);
        
        // Clear input
        this.value = '';
      }
    });
    
    // Process terminal commands
    function processCommand(command) {
      const cmd = command.toLowerCase();
      
      if (cmd === 'help') {
        terminalOutput.innerHTML += '<div>Available commands:</div>';
        terminalOutput.innerHTML += '<div>help - Display this help message</div>';
        terminalOutput.innerHTML += '<div>cls - Clear the screen</div>';
        terminalOutput.innerHTML += '<div>dir - List directory contents</div>';
        terminalOutput.innerHTML += '<div>echo [text] - Display text</div>';
        terminalOutput.innerHTML += '<div>date - Display current date</div>';
        terminalOutput.innerHTML += '<div>time - Display current time</div>';
        terminalOutput.innerHTML += '<div>ver - Display system version</div>';
        terminalOutput.innerHTML += '<div>exit - Close terminal</div>';
        terminalOutput.innerHTML += '<div>rickroll - Easter egg</div>';
        terminalOutput.innerHTML += '<div>nosyt - About NosytLabs</div>';
      } else if (cmd === 'cls') {
        terminalOutput.innerHTML = '';
      } else if (cmd === 'dir') {
        terminalOutput.innerHTML += '<div>Directory of C:\\</div>';
        terminalOutput.innerHTML += '<div>&nbsp;</div>';
        terminalOutput.innerHTML += '<div>WINDOWS    &lt;DIR&gt;        05-16-2025  04:54p</div>';
        terminalOutput.innerHTML += '<div>PROGRAM    &lt;DIR&gt;        05-16-2025  04:54p</div>';
        terminalOutput.innerHTML += '<div>SYSTEM     &lt;DIR&gt;        05-16-2025  04:54p</div>';
        terminalOutput.innerHTML += '<div>AUTOEXEC BAT        512  05-16-2025  04:54p</div>';
        terminalOutput.innerHTML += '<div>CONFIG   SYS        724  05-16-2025  04:54p</div>';
        terminalOutput.innerHTML += '<div>README   TXT       1,024  05-16-2025  04:54p</div>';
        terminalOutput.innerHTML += '<div>SECRET   TXT         42  05-16-2025  04:54p</div>';
        terminalOutput.innerHTML += '<div>&nbsp;</div>';
        terminalOutput.innerHTML += '<div>        7 file(s)     2,302 bytes</div>';
        terminalOutput.innerHTML += '<div>        3 dir(s)  4,294,967,295 bytes free</div>';
      } else if (cmd.startsWith('echo ')) {
        const text = command.substring(5);
        terminalOutput.innerHTML += '<div>' + text + '</div>';
      } else if (cmd === 'date') {
        const date = new Date();
        terminalOutput.innerHTML += '<div>Current date: ' + date.toLocaleDateString() + '</div>';
      } else if (cmd === 'time') {
        const date = new Date();
        terminalOutput.innerHTML += '<div>Current time: ' + date.toLocaleTimeString() + '</div>';
      } else if (cmd === 'ver') {
        terminalOutput.innerHTML += '<div>NosytOS95 [Version 4.00.950]</div>';
      } else if (cmd === 'exit') {
        terminalWindow.style.display = 'none';
        updateTaskbar();
      } else if (cmd === 'rickroll') {
        terminalOutput.innerHTML += '<div>Never gonna give you up</div>';
        terminalOutput.innerHTML += '<div>Never gonna let you down</div>';
        terminalOutput.innerHTML += '<div>Never gonna run around and desert you</div>';
        window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
      } else if (cmd === 'nosyt') {
        terminalOutput.innerHTML += '<div>NosytLabs - Notable Opportunities Shape Your Tomorrow</div>';
        terminalOutput.innerHTML += '<div>Founded in 2025</div>';
        terminalOutput.innerHTML += '<div>Visit https://nosytlabs.com for more information</div>';
      } else if (cmd !== '') {
        terminalOutput.innerHTML += '<div>Bad command or file name</div>';
      }
      
      // Scroll to bottom
      terminalOutput.scrollTop = terminalOutput.scrollHeight;
    }
  }
}

// Help
function initHelp() {
  const helpWindow = document.getElementById('help-window');
  
  if (helpWindow) {
    const helpTabs = helpWindow.querySelectorAll('.help-tab');
    const helpTopics = helpWindow.querySelectorAll('.help-topic');
    const helpPages = helpWindow.querySelectorAll('.help-page');
    
    // Create help pages content
    createHelpPages();
    
    // Show welcome page by default
    document.getElementById('help-welcome').style.display = 'block';
    
    // Handle tab clicks
    helpTabs.forEach(tab => {
      tab.addEventListener('click', function() {
        // Remove active class from all tabs
        helpTabs.forEach(t => t.classList.remove('help-tab-active'));
        
        // Add active class to clicked tab
        this.classList.add('help-tab-active');
      });
    });
    
    // Handle topic clicks
    helpTopics.forEach(topic => {
      topic.addEventListener('click', function() {
        const topicId = this.getAttribute('data-topic');
        
        // Hide all pages
        helpPages.forEach(page => {
          page.style.display = 'none';
        });
        
        // Show selected page
        const page = document.getElementById('help-' + topicId);
        if (page) {
          page.style.display = 'block';
        }
      });
    });
    
    // Create help pages content
    function createHelpPages() {
      // Desktop page
      const desktopPage = document.createElement('div');
      desktopPage.className = 'help-page';
      desktopPage.id = 'help-desktop';
      desktopPage.innerHTML = `
        <h2>The Desktop</h2>
        <p>The NosytOS95 desktop is your workspace. It contains icons that represent applications and folders.</p>
        <p>To open an application or folder, double-click on its icon.</p>
        <p>The desktop includes the following icons:</p>
        <ul>
          <li><strong>My Computer</strong> - View system information</li>
          <li><strong>Notepad</strong> - A simple text editor</li>
          <li><strong>Duck Hunt</strong> - A classic shooting game</li>
          <li><strong>Terminal</strong> - Command-line interface</li>
          <li><strong>Help</strong> - This help system</li>
          <li><strong>Do Not Click</strong> - A mysterious folder</li>
        </ul>
      `;
      
      // Start Menu page
      const startMenuPage = document.createElement('div');
      startMenuPage.className = 'help-page';
      startMenuPage.id = 'help-start-menu';
      startMenuPage.innerHTML = `
        <h2>The Start Menu</h2>
        <p>The Start Menu provides access to all applications and system functions.</p>
        <p>To open the Start Menu, click on the Start button in the bottom-left corner of the screen.</p>
        <p>The Start Menu includes the following items:</p>
        <ul>
          <li><strong>Programs</strong> - Access to applications</li>
          <li><strong>Documents</strong> - Recently used documents</li>
          <li><strong>Settings</strong> - System configuration</li>
          <li><strong>Find</strong> - Search for files and folders</li>
          <li><strong>Help</strong> - Access to help system</li>
          <li><strong>Run</strong> - Run a command</li>
          <li><strong>Shut Down</strong> - Exit NosytOS95</li>
        </ul>
      `;
      
      // Windows page
      const windowsPage = document.createElement('div');
      windowsPage.className = 'help-page';
      windowsPage.id = 'help-windows';
      windowsPage.innerHTML = `
        <h2>Working with Windows</h2>
        <p>Windows in NosytOS95 can be moved, resized, minimized, maximized, and closed.</p>
        <p><strong>Moving a window:</strong> Click and drag the title bar.</p>
        <p><strong>Resizing a window:</strong> Click and drag any edge or corner.</p>
        <p><strong>Minimizing a window:</strong> Click the _ button in the top-right corner.</p>
        <p><strong>Maximizing a window:</strong> Click the □ button in the top-right corner.</p>
        <p><strong>Closing a window:</strong> Click the × button in the top-right corner.</p>
        <p>Windows can overlap each other. The active window appears on top.</p>
      `;
      
      // Applications page
      const applicationsPage = document.createElement('div');
      applicationsPage.className = 'help-page';
      applicationsPage.id = 'help-applications';
      applicationsPage.innerHTML = `
        <h2>Applications</h2>
        <p>NosytOS95 includes several applications:</p>
        <h3>Notepad</h3>
        <p>A simple text editor for creating and editing text files.</p>
        <h3>Duck Hunt</h3>
        <p>A classic shooting game. Click on ducks to shoot them and earn points.</p>
        <h3>Terminal</h3>
        <p>A command-line interface for executing commands. Type 'help' to see available commands.</p>
        <h3>Help</h3>
        <p>This help system provides information about NosytOS95.</p>
      `;
      
      // Shortcuts page
      const shortcutsPage = document.createElement('div');
      shortcutsPage.className = 'help-page';
      shortcutsPage.id = 'help-shortcuts';
      shortcutsPage.innerHTML = `
        <h2>Keyboard Shortcuts</h2>
        <p>NosytOS95 supports the following keyboard shortcuts:</p>
        <ul>
          <li><strong>Alt+Tab</strong> - Switch between windows</li>
          <li><strong>Alt+F4</strong> - Close the active window</li>
          <li><strong>Ctrl+C</strong> - Copy selected text</li>
          <li><strong>Ctrl+V</strong> - Paste text</li>
          <li><strong>Ctrl+X</strong> - Cut selected text</li>
          <li><strong>Ctrl+Z</strong> - Undo</li>
          <li><strong>Ctrl+Y</strong> - Redo</li>
          <li><strong>Ctrl+S</strong> - Save</li>
          <li><strong>Ctrl+O</strong> - Open</li>
          <li><strong>Ctrl+P</strong> - Print</li>
          <li><strong>Ctrl+A</strong> - Select all</li>
          <li><strong>Ctrl+F</strong> - Find</li>
        </ul>
      `;
      
      // Easter Eggs page
      const easterEggsPage = document.createElement('div');
      easterEggsPage.className = 'help-page';
      easterEggsPage.id = 'help-easter-eggs';
      easterEggsPage.innerHTML = `
        <h2>Easter Eggs</h2>
        <p>NosytOS95 includes several hidden features and easter eggs:</p>
        <ul>
          <li>Try typing 'rickroll' in the Terminal</li>
          <li>Try typing 'nosyt' in the Terminal</li>
          <li>Double-click on the "Do Not Click" folder</li>
          <li>Check the high scores in Duck Hunt</li>
          <li>Look for hidden messages in the help system</li>
        </ul>
        <p>There may be more easter eggs hidden throughout NosytOS95. Keep exploring!</p>
      `;
      
      // Append all pages to help content area
      const helpContentArea = helpWindow.querySelector('.help-content-area');
      helpContentArea.appendChild(desktopPage);
      helpContentArea.appendChild(startMenuPage);
      helpContentArea.appendChild(windowsPage);
      helpContentArea.appendChild(applicationsPage);
      helpContentArea.appendChild(shortcutsPage);
      helpContentArea.appendChild(easterEggsPage);
    }
  }
}
