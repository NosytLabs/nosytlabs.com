// NosytOS95 Core Functionality
document.addEventListener('DOMContentLoaded', function() {
  // Initialize NosytOS95
  initNosytOS95();
});

function initNosytOS95() {
  // Initialize window management
  initWindowManagement();

  // Initialize desktop icons
  initDesktopIcons();

  // Initialize start menu
  initStartMenu();

  // Initialize taskbar
  initTaskbar();

  // Initialize clock
  updateClock();
  setInterval(updateClock, 60000);

  // Initialize Clippy
  initClippy();

  // Initialize applications
  initNotepad();
  initDuckHunt();
  initTerminal();
  initHelp();

  // Initialize Do Not Click folder
  initDoNotClick();

  console.log('NosytOS95 initialized');
}

// Window Management
function initWindowManagement() {
  const windows = document.querySelectorAll('.win95-window');
  let activeWindow = null;
  let zIndex = 100;

  // Initialize each window
  windows.forEach(window => {
    // Set initial z-index
    window.style.zIndex = zIndex++;

    // Window header drag functionality
    const header = window.querySelector('.window-header');
    if (header) {
      header.addEventListener('mousedown', function(e) {
        if (e.target.closest('.window-controls')) return;

        // Bring window to front
        bringToFront(window);

        // Start dragging
        const rect = window.getBoundingClientRect();
        const offsetX = e.clientX - rect.left;
        const offsetY = e.clientY - rect.top;

        function moveWindow(e) {
          window.style.left = (e.clientX - offsetX) + 'px';
          window.style.top = (e.clientY - offsetY) + 'px';
        }

        function stopMoving() {
          document.removeEventListener('mousemove', moveWindow);
          document.removeEventListener('mouseup', stopMoving);
        }

        document.addEventListener('mousemove', moveWindow);
        document.addEventListener('mouseup', stopMoving);
      });
    }

    // Window controls functionality
    const minimizeBtn = window.querySelector('.window-minimize');
    const maximizeBtn = window.querySelector('.window-maximize');
    const closeBtn = window.querySelector('.window-close');

    if (minimizeBtn) {
      minimizeBtn.addEventListener('click', function() {
        window.style.display = 'none';
        updateTaskbar();
      });
    }

    if (maximizeBtn) {
      maximizeBtn.addEventListener('click', function() {
        if (window.classList.contains('maximized')) {
          // Restore window
          window.classList.remove('maximized');
          window.style.width = window.dataset.prevWidth || '400px';
          window.style.height = window.dataset.prevHeight || '300px';
          window.style.left = window.dataset.prevLeft || '50%';
          window.style.top = window.dataset.prevTop || '50%';
          window.style.transform = window.dataset.prevTransform || 'translate(-50%, -50%)';
        } else {
          // Maximize window
          window.classList.add('maximized');
          window.dataset.prevWidth = window.style.width;
          window.dataset.prevHeight = window.style.height;
          window.dataset.prevLeft = window.style.left;
          window.dataset.prevTop = window.style.top;
          window.dataset.prevTransform = window.style.transform;

          window.style.width = '100%';
          window.style.height = 'calc(100% - 28px)';
          window.style.left = '0';
          window.style.top = '0';
          window.style.transform = 'none';
        }
      });
    }

    if (closeBtn) {
      closeBtn.addEventListener('click', function() {
        window.style.display = 'none';
        updateTaskbar();
      });
    }

    // Resize functionality
    const resizeHandles = window.querySelectorAll('.resize-handle');
    resizeHandles.forEach(handle => {
      handle.addEventListener('mousedown', function(e) {
        e.preventDefault();
        e.stopPropagation();

        // Bring window to front
        bringToFront(window);

        const rect = window.getBoundingClientRect();
        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = rect.width;
        const startHeight = rect.height;
        const startLeft = rect.left;
        const startTop = rect.top;

        const direction = handle.className.replace('resize-handle resize-handle-', '');

        function resize(e) {
          let newWidth = startWidth;
          let newHeight = startHeight;
          let newLeft = startLeft;
          let newTop = startTop;

          // Calculate new dimensions based on direction
          if (direction.includes('e')) {
            newWidth = Math.max(200, startWidth + (e.clientX - startX));
          }
          if (direction.includes('s')) {
            newHeight = Math.max(150, startHeight + (e.clientY - startY));
          }
          if (direction.includes('w')) {
            newWidth = Math.max(200, startWidth - (e.clientX - startX));
            newLeft = startLeft + (startWidth - newWidth);
          }
          if (direction.includes('n')) {
            newHeight = Math.max(150, startHeight - (e.clientY - startY));
            newTop = startTop + (startHeight - newHeight);
          }

          // Apply new dimensions
          window.style.width = newWidth + 'px';
          window.style.height = newHeight + 'px';
          window.style.left = newLeft + 'px';
          window.style.top = newTop + 'px';
        }

        function stopResizing() {
          document.removeEventListener('mousemove', resize);
          document.removeEventListener('mouseup', stopResizing);
        }

        document.addEventListener('mousemove', resize);
        document.addEventListener('mouseup', stopResizing);
      });
    });

    // Click to focus
    window.addEventListener('mousedown', function() {
      bringToFront(window);
    });
  });
}

// Bring window to front
function bringToFront(window) {
  const windows = document.querySelectorAll('.win95-window');
  let maxZ = 0;

  windows.forEach(w => {
    const z = parseInt(w.style.zIndex || 0);
    maxZ = Math.max(maxZ, z);
    w.classList.remove('active');
  });

  window.style.zIndex = maxZ + 1;
  window.classList.add('active');
  updateTaskbar();
}

// Desktop Icons
function initDesktopIcons() {
  const desktopIcons = document.querySelectorAll('.desktop-icon');

  desktopIcons.forEach(icon => {
    icon.addEventListener('dblclick', function() {
      const app = this.getAttribute('data-app');
      openApp(app);
    });
  });
}

// Open Application
function openApp(app) {
  const appWindow = document.getElementById(app + '-window');

  if (appWindow) {
    appWindow.style.display = 'flex';
    bringToFront(appWindow);

    // Special handling for Notepad to open maximized
    if (app === 'notepad') {
      // Ensure Notepad opens maximized
      const maximizeBtn = appWindow.querySelector('.window-maximize');
      if (maximizeBtn && !appWindow.classList.contains('maximized')) {
        maximizeBtn.click();
      }

      // Focus the textarea
      setTimeout(() => {
        const textarea = appWindow.querySelector('.notepad-content');
        if (textarea) {
          textarea.focus();
        }
      }, 100);
    }

    updateTaskbar();
  } else if (app === 'do-not-click') {
    // Rick Roll Easter Egg
    window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
  }
}

// Start Menu
function initStartMenu() {
  const startButton = document.querySelector('.start-button');
  const startMenu = document.getElementById('start-menu');

  if (startButton && startMenu) {
    // Toggle start menu on click
    startButton.addEventListener('click', function() {
      if (startMenu.style.display === 'block') {
        startMenu.style.display = 'none';
      } else {
        startMenu.style.display = 'block';
      }
    });

    // Close start menu when clicking elsewhere
    document.addEventListener('click', function(e) {
      if (!e.target.closest('.start-menu') && !e.target.closest('.start-button')) {
        startMenu.style.display = 'none';
      }
    });

    // Handle start menu items
    const menuItems = startMenu.querySelectorAll('.submenu-item');
    menuItems.forEach(item => {
      item.addEventListener('click', function() {
        const app = this.getAttribute('data-app');
        if (app) {
          openApp(app);
          startMenu.style.display = 'none';
        }
      });
    });

    // Handle shutdown
    const shutdownItem = document.getElementById('shutdown-item');
    if (shutdownItem) {
      shutdownItem.addEventListener('click', function() {
        if (confirm('Are you sure you want to shut down NosytOS95?')) {
          window.location.href = '/';
        }
      });
    }
  }
}

// Taskbar
function initTaskbar() {
  updateTaskbar();
}

function updateTaskbar() {
  const taskbarItems = document.querySelector('.taskbar-items');
  const windows = document.querySelectorAll('.win95-window');

  // Clear existing taskbar items
  taskbarItems.innerHTML = '';

  // Add taskbar item for each visible window
  windows.forEach(window => {
    if (window.style.display !== 'none') {
      const title = window.querySelector('.window-title span').textContent;
      const icon = window.querySelector('.window-title img').src;
      const id = window.id;

      const taskbarItem = document.createElement('div');
      taskbarItem.className = 'taskbar-item';
      if (window.classList.contains('active')) {
        taskbarItem.classList.add('active');
      }

      const img = document.createElement('img');
      img.src = icon;
      img.alt = title;

      const span = document.createElement('span');
      span.textContent = title;

      taskbarItem.appendChild(img);
      taskbarItem.appendChild(span);

      taskbarItem.addEventListener('click', function() {
        if (window.style.display === 'none') {
          window.style.display = 'flex';
          bringToFront(window);
        } else if (window.classList.contains('active')) {
          window.style.display = 'none';
        } else {
          bringToFront(window);
        }
      });

      taskbarItems.appendChild(taskbarItem);
    }
  });
}

// Clock
function updateClock() {
  const clock = document.getElementById('taskbar-clock');
  if (clock) {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;

    clock.textContent = hours12 + ':' + minutesStr + ' ' + ampm;
  }
}

// Clippy
function initClippy() {
  const clippy = document.getElementById('clippy');
  const clippyImage = document.getElementById('clippy-image');
  const clippyBubble = document.querySelector('.clippy-bubble');
  const clippyClose = document.querySelector('.clippy-close');
  const clippyOptions = document.getElementById('clippy-options');
  const clippyMessage = document.getElementById('clippy-message');

  if (clippy && clippyImage && clippyBubble && clippyClose && clippyOptions && clippyMessage) {
    // Show clippy bubble on click
    clippyImage.addEventListener('click', function() {
      if (clippyBubble.style.display === 'block') {
        clippyBubble.style.display = 'none';
      } else {
        clippyBubble.style.display = 'block';
      }
    });

    // Close clippy bubble
    clippyClose.addEventListener('click', function() {
      clippyBubble.style.display = 'none';
    });

    // Handle clippy options
    const options = clippyOptions.querySelectorAll('.clippy-option');
    options.forEach(option => {
      option.addEventListener('click', function() {
        const action = this.getAttribute('data-action');

        switch (action) {
          case 'help':
            clippyMessage.textContent = "To get started, try clicking on the desktop icons or using the Start menu. Double-click on icons to open applications.";
            break;
          case 'explore':
            clippyMessage.textContent = "Enjoy exploring NosytOS95! I'll be here if you need me.";
            clippyBubble.style.display = 'none';
            break;
        }
      });
    });

    // Show Clippy after a delay
    setTimeout(() => {
      clippyBubble.style.display = 'block';
    }, 3000);
  }
}

// Do Not Click folder
function initDoNotClick() {
  const doNotClickIcon = document.querySelector('.desktop-icon[data-app="do-not-click"]');

  if (doNotClickIcon) {
    doNotClickIcon.addEventListener('dblclick', function() {
      window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
    });
  }
}

// Notepad
function initNotepad() {
  const notepadWindow = document.getElementById('notepad-window');

  if (notepadWindow) {
    const textarea = notepadWindow.querySelector('.notepad-content');
    if (textarea) {
      // Set initial content
      textarea.value = 'Welcome to NosytOS95!\n\n' +
        'This is a simple text editor. You can type anything you want here.\n\n' +
        'Try exploring other applications like Duck Hunt, Terminal, and Help.\n\n' +
        'Created by NosytLabs - Notable Opportunities Shape Your Tomorrow';
    }
  }
}

// Duck Hunt
function initDuckHunt() {
  const duckHuntWindow = document.getElementById('duck-hunt-window');

  if (duckHuntWindow) {
    const canvas = duckHuntWindow.querySelector('.game-canvas');
    const startButton = duckHuntWindow.querySelector('.start-button');
    const soundToggle = duckHuntWindow.querySelector('.sound-toggle');
    const highScoreButton = duckHuntWindow.querySelector('.high-score-button');

    if (canvas && startButton) {
      const ctx = canvas.getContext('2d');
      let gameRunning = false;
      let score = 0;
      let ducks = [];
      let soundEnabled = true;
      let highScore = localStorage.getItem('duckHuntHighScore') || 0;

      // Sound effects
      const shootSound = new Audio('/sounds/duck-hunt-shoot.mp3');
      const quackSound = new Audio('/sounds/duck-hunt-quack.mp3');
      const fallSound = new Audio('/sounds/duck-hunt-fall.mp3');

      // Toggle sound
      if (soundToggle) {
        soundToggle.addEventListener('click', function() {
          soundEnabled = !soundEnabled;
          this.textContent = soundEnabled ? '🔊' : '🔇';
        });
      }

      // Show high score
      if (highScoreButton) {
        highScoreButton.addEventListener('click', function() {
          alert('High Score: ' + highScore);
        });
      }

      // Draw sky background
      function drawBackground() {
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw ground
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(0, canvas.height - 50, canvas.width, 50);

        // Draw grass
        ctx.fillStyle = '#228B22';
        ctx.fillRect(0, canvas.height - 50, canvas.width, 10);
      }

      // Draw score
      function drawScore() {
        ctx.fillStyle = '#000';
        ctx.font = '16px "MS Sans Serif"';
        ctx.fillText('Score: ' + score, 10, 20);
        ctx.fillText('High Score: ' + highScore, 10, 40);
      }

      // Create a duck
      function createDuck() {
        return {
          x: Math.random() * (canvas.width - 30),
          y: canvas.height - 80,
          width: 30,
          height: 30,
          speedX: (Math.random() * 2) + 1,
          speedY: -((Math.random() * 2) + 1),
          color: '#8B4513',
          hit: false
        };
      }

      // Draw ducks
      function drawDucks() {
        ducks.forEach(duck => {
          if (!duck.hit) {
            // Draw duck body
            ctx.fillStyle = duck.color;
            ctx.fillRect(duck.x, duck.y, duck.width, duck.height);

            // Draw wings
            ctx.fillStyle = '#000';
            const wingOffset = Math.sin(Date.now() / 100) * 5;
            ctx.fillRect(duck.x - 10, duck.y + 10 + wingOffset, 10, 5);
            ctx.fillRect(duck.x + duck.width, duck.y + 10 - wingOffset, 10, 5);

            // Draw head
            ctx.fillStyle = '#000';
            ctx.fillRect(duck.x + duck.width - 5, duck.y - 10, 10, 10);

            // Draw beak
            ctx.fillStyle = '#FFA500';
            ctx.fillRect(duck.x + duck.width + 5, duck.y - 5, 5, 5);
          } else {
            // Draw falling duck
            ctx.fillStyle = '#FF0000';
            ctx.fillRect(duck.x, duck.y, duck.width, duck.height);
          }
        });
      }

      // Update duck positions
      function updateDucks() {
        ducks.forEach(duck => {
          if (!duck.hit) {
            duck.x += duck.speedX;
            duck.y += duck.speedY;

            // Bounce off walls
            if (duck.x <= 0 || duck.x + duck.width >= canvas.width) {
              duck.speedX *= -1;
            }

            // Bounce off ceiling
            if (duck.y <= 0) {
              duck.speedY *= -1;
            }

            // Bounce off ground
            if (duck.y + duck.height >= canvas.height - 50) {
              duck.speedY *= -1;
            }
          } else {
            // Hit duck falls
            duck.speedY = 2;
            duck.y += duck.speedY;
          }
        });

        // Remove ducks that have fallen off screen
        ducks = ducks.filter(duck => !(duck.hit && duck.y > canvas.height));

        // Add new ducks if needed
        if (ducks.length < 3 && gameRunning) {
          ducks.push(createDuck());
          if (soundEnabled) {
            quackSound.currentTime = 0;
            quackSound.play().catch(e => console.log('Error playing sound:', e));
          }
        }

      // Game loop
      function gameLoop() {
        if (!gameRunning) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw background
        drawBackground();

        // Update and draw ducks
        updateDucks();
        drawDucks();

        // Draw score
        drawScore();

        // Continue loop
        requestAnimationFrame(gameLoop);
      }

      // Start game
      startButton.addEventListener('click', function() {
        gameRunning = true;
        score = 0;
        ducks = [createDuck(), createDuck(), createDuck()];
        gameLoop();
      });

      // Shoot on canvas click
      canvas.addEventListener('click', function(e) {
        if (!gameRunning) return;

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Play shoot sound
        if (soundEnabled) {
          shootSound.currentTime = 0;
          shootSound.play().catch(e => console.log('Error playing sound:', e));
        }

        // Check for hits
        let hit = false;
        ducks.forEach(duck => {
          if (!duck.hit &&
              x >= duck.x && x <= duck.x + duck.width &&
              y >= duck.y && y <= duck.y + duck.height) {
            duck.hit = true;
            score += 10;
            hit = true;

            // Update high score
            if (score > highScore) {
              highScore = score;
              localStorage.setItem('duckHuntHighScore', highScore);
            }

            // Play fall sound
            if (soundEnabled) {
              fallSound.currentTime = 0;
              fallSound.play().catch(e => console.log('Error playing sound:', e));
            }
          }
        });
      });

      // Initial draw
      drawBackground();
      ctx.fillStyle = '#000';
      ctx.font = '20px "MS Sans Serif"';
      ctx.fillText('Click Start to begin', canvas.width / 2 - 80, canvas.height / 2);
    }
  }
}

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

// Clock
function updateClock() {
  const clock = document.getElementById('taskbar-clock');
  if (clock) {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const hours12 = hours % 12 || 12;
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;

    clock.textContent = hours12 + ':' + minutesStr + ' ' + ampm;
  }
}

// Clippy
function initClippy() {
  const clippy = document.getElementById('clippy');
  const clippyImage = document.getElementById('clippy-image');
  const clippyBubble = document.querySelector('.clippy-bubble');
  const clippyClose = document.querySelector('.clippy-close');
  const clippyOptions = document.getElementById('clippy-options');
  const clippyMessage = document.getElementById('clippy-message');

  if (clippy && clippyImage && clippyBubble && clippyClose && clippyOptions && clippyMessage) {
    // Show clippy bubble on click
    clippyImage.addEventListener('click', function() {
      if (clippyBubble.style.display === 'block') {
        clippyBubble.style.display = 'none';
      } else {
        clippyBubble.style.display = 'block';
      }
    });

    // Close clippy bubble
    clippyClose.addEventListener('click', function() {
      clippyBubble.style.display = 'none';
    });

    // Handle clippy options
    const options = clippyOptions.querySelectorAll('.clippy-option');
    options.forEach(option => {
      option.addEventListener('click', function() {
        const action = this.getAttribute('data-action');

        switch (action) {
          case 'help':
            clippyMessage.textContent = "To get started, try clicking on the desktop icons or using the Start menu. Double-click on icons to open applications.";
            break;
          case 'explore':
            clippyMessage.textContent = "Enjoy exploring NosytOS95! I'll be here if you need me.";
            clippyBubble.style.display = 'none';
            break;
        }
      });
    });

    // Show Clippy after a delay
    setTimeout(() => {
      clippyBubble.style.display = 'block';
    }, 3000);
  }
}

// Do Not Click folder
function initDoNotClick() {
  const doNotClickIcon = document.querySelector('.desktop-icon[data-app="do-not-click"]');

  if (doNotClickIcon) {
    doNotClickIcon.addEventListener('dblclick', function() {
      window.open('https://www.youtube.com/watch?v=dQw4w9WgXcQ', '_blank');
    });
  }
}

// Notepad
function initNotepad() {
  const notepadWindow = document.getElementById('notepad-window');

  if (notepadWindow) {
    const textarea = notepadWindow.querySelector('.notepad-content');
    if (textarea) {
      // Set default content
      textarea.value = 'Welcome to NosytOS95!\n\n' +
        'This is a Windows 95-style interface for NosytLabs.\n\n' +
        'Features:\n' +
        '- Draggable and resizable windows\n' +
        '- Start menu with cascading submenus\n' +
        '- Taskbar with running applications\n' +
        '- Clippy assistant\n' +
        '- Working applications (Notepad, Duck Hunt, Terminal)\n\n' +
        'Created by NosytLabs - Notable Opportunities Shape Your Tomorrow';
    }
  }
}

// Duck Hunt
function initDuckHunt() {
  const duckHuntWindow = document.getElementById('duck-hunt-window');

  if (duckHuntWindow) {
    const canvas = duckHuntWindow.querySelector('.game-canvas');
    const startButton = duckHuntWindow.querySelector('.start-button');
    const soundToggle = duckHuntWindow.querySelector('.sound-toggle');
    const highScoreButton = duckHuntWindow.querySelector('.high-score-button');

    if (canvas && startButton) {
      const ctx = canvas.getContext('2d');
      let gameRunning = false;
      let score = 0;
      let ducks = [];
      let soundEnabled = true;
      let highScore = localStorage.getItem('duckHuntHighScore') || 0;

      // Sound effects
      const sounds = {
        shoot: new Audio('/sounds/duck-hunt/shot.mp3'),
        quack: new Audio('/sounds/duck-hunt/quack.mp3'),
        fall: new Audio('/sounds/duck-hunt/fall.mp3')
      };

      // Preload images
      const duckImage = new Image();
      duckImage.src = '/images/win95/duck.png';

      const duckHitImage = new Image();
      duckHitImage.src = '/images/win95/duck-hit.png';

      // Draw sky background
      function drawBackground() {
        ctx.fillStyle = '#87CEEB';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Draw ground
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(0, canvas.height - 50, canvas.width, 50);

        // Draw grass
        ctx.fillStyle = '#228B22';
        ctx.fillRect(0, canvas.height - 50, canvas.width, 10);
      }

      // Draw score
      function drawScore() {
        ctx.fillStyle = '#000';
        ctx.font = '16px "MS Sans Serif"';
        ctx.fillText('Score: ' + score, 10, 20);
        ctx.fillText('High Score: ' + highScore, 10, 40);
      }

      // Create a duck
      function createDuck() {
        return {
          x: Math.random() * (canvas.width - 30),
          y: canvas.height - 80,
          width: 30,
          height: 30,
          speedX: (Math.random() * 2) + 1,
          speedY: -((Math.random() * 2) + 1),
          hit: false,
          direction: Math.random() > 0.5 ? 'right' : 'left'
        };
      }

      // Draw ducks
      function drawDucks() {
        ducks.forEach(duck => {
          if (duck.hit) {
            ctx.drawImage(duckHitImage, duck.x, duck.y, duck.width, duck.height);
          } else {
            // Flip image based on direction
            ctx.save();
            if (duck.direction === 'left') {
              ctx.translate(duck.x + duck.width, duck.y);
              ctx.scale(-1, 1);
              ctx.drawImage(duckImage, 0, 0, duck.width, duck.height);
            } else {
              ctx.drawImage(duckImage, duck.x, duck.y, duck.width, duck.height);
            }
            ctx.restore();
          }
        });
      }

      // Update duck positions
      function updateDucks() {
        ducks.forEach(duck => {
          if (!duck.hit) {
            duck.x += duck.speedX * (duck.direction === 'right' ? 1 : -1);
            duck.y += duck.speedY;

            // Bounce off walls
            if (duck.x <= 0) {
              duck.x = 0;
              duck.direction = 'right';
            } else if (duck.x + duck.width >= canvas.width) {
              duck.x = canvas.width - duck.width;
              duck.direction = 'left';
            }

            // Bounce off ceiling
            if (duck.y <= 0) {
              duck.y = 0;
              duck.speedY *= -1;
            }

            // Bounce off ground
            if (duck.y + duck.height >= canvas.height - 50) {
              duck.y = canvas.height - 50 - duck.height;
              duck.speedY *= -1;
            }
          } else {
            // Hit duck falls
            duck.speedY = 2;
            duck.y += duck.speedY;
          }
        });

        // Remove ducks that have fallen off screen
        ducks = ducks.filter(duck => !(duck.hit && duck.y > canvas.height));

        // Add new ducks if needed
        if (ducks.length < 3 && gameRunning) {
          ducks.push(createDuck());
        }
      }

      // Game loop
      function gameLoop() {
        if (!gameRunning) return;

        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Draw background
        drawBackground();

        // Update and draw ducks
        updateDucks();
        drawDucks();

        // Draw score
        drawScore();

        // Continue loop
        requestAnimationFrame(gameLoop);
      }

      // Start game
      startButton.addEventListener('click', function() {
        gameRunning = true;
        score = 0;
        ducks = [createDuck(), createDuck(), createDuck()];
        gameLoop();
      });

      // Toggle sound
      if (soundToggle) {
        soundToggle.addEventListener('click', function() {
          soundEnabled = !soundEnabled;
          this.textContent = soundEnabled ? '🔊' : '🔇';
        });
      }

      // Show high scores
      if (highScoreButton) {
        highScoreButton.addEventListener('click', function() {
          alert('High Score: ' + highScore);
        });
      }

      // Shoot on canvas click
      canvas.addEventListener('click', function(e) {
        if (!gameRunning) return;

        // Play shoot sound
        if (soundEnabled) {
          sounds.shoot.currentTime = 0;
          sounds.shoot.play();
        }

        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        // Check for hits
        ducks.forEach(duck => {
          if (!duck.hit &&
              x >= duck.x && x <= duck.x + duck.width &&
              y >= duck.y && y <= duck.y + duck.height) {
            duck.hit = true;
            score += 10;

            // Update high score
            if (score > highScore) {
              highScore = score;
              localStorage.setItem('duckHuntHighScore', highScore);
            }

            // Play quack sound
            if (soundEnabled) {
              sounds.quack.currentTime = 0;
              sounds.quack.play();

              // Play fall sound after a delay
              setTimeout(() => {
                sounds.fall.currentTime = 0;
                sounds.fall.play();
              }, 500);
            }
          }
        });
      });

      // Set cursor to crosshair
      canvas.style.cursor = 'crosshair';

      // Initial draw
      drawBackground();
      ctx.fillStyle = '#000';
      ctx.font = '20px "MS Sans Serif"';
      ctx.textAlign = 'center';
      ctx.fillText('Click Start to begin', canvas.width / 2, canvas.height / 2);
    }
  }
}