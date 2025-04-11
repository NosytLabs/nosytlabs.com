/**
 * Terminal Effects for Nosyt Labs
 * Enhanced Fallout-themed terminal effects and animations
 */

// Terminal boot sequence
function initTerminalBoot() {
  const terminal = document.querySelector('.terminal-container');
  if (!terminal) return;
  
  // Add boot sequence overlay
  const bootOverlay = document.createElement('div');
  bootOverlay.className = 'terminal-boot-overlay';
  bootOverlay.innerHTML = `
    <div class="terminal-boot-content">
      <div class="terminal-boot-header">ROBCO INDUSTRIES UNIFIED OPERATING SYSTEM</div>
      <div class="terminal-boot-copyright">COPYRIGHT 2075-2077 ROBCO INDUSTRIES</div>
      <div class="terminal-boot-version">LOADER V1.1</div>
      <div class="terminal-boot-memory">64K RAM SYSTEM</div>
      <div class="terminal-boot-memory">38911 BYTES FREE</div>
      <div class="terminal-boot-holotape">HOLOTAPE LOADED: NOSYT-LABS-OS</div>
      <div class="terminal-boot-initializing">INITIALIZING...</div>
      <div class="terminal-boot-progress">
        <div class="terminal-boot-progress-bar"></div>
      </div>
      <div class="vault-loading"><div class="vault-progress"></div></div>
    </div>
  `;
  
  document.body.appendChild(bootOverlay);
  
  // Simulate boot sequence
  setTimeout(() => {
    const progressBar = document.querySelector('.terminal-boot-progress-bar');
    progressBar.style.width = '100%';
    
    setTimeout(() => {
      bootOverlay.classList.add('terminal-boot-complete');
      setTimeout(() => {
        bootOverlay.remove();
        playTerminalStartupSound();
      }, 500);
    }, 2000);
  }, 500);
}

// Terminal background effects
function initTerminalBackground() {
  // Create scanlines overlay
  const scanlines = document.createElement('div');
  scanlines.className = 'terminal-scanlines';
  document.body.appendChild(scanlines);

  // Create CRT flicker overlay
  const flicker = document.createElement('div');
  flicker.className = 'terminal-flicker';
  document.body.appendChild(flicker);

  // Create glitch overlay
  const glitch = document.createElement('div');
  glitch.className = 'terminal-glitch';
  document.body.appendChild(glitch);

  // Add GPU acceleration hints
  [scanlines, flicker, glitch].forEach(el => {
    el.style.willChange = 'opacity, transform';
    el.style.transform = 'translateZ(0)';
  });

  // Animate smooth CRT flicker using requestAnimationFrame
  let flickerTime = 0;
  function animateFlicker(timestamp) {
    flickerTime += 0.05;
    // Sine wave + noise for subtle flicker
    const sine = Math.sin(flickerTime * 2);
    const noise = (Math.random() - 0.5) * 0.1;
    const opacity = 0.03 + 0.02 * sine + noise;
    flicker.style.opacity = Math.max(0, Math.min(0.08, opacity));
    requestAnimationFrame(animateFlicker);
  }
  requestAnimationFrame(animateFlicker);

  // Random glitch activation
  setInterval(() => {
    if (Math.random() > 0.97) {
      glitch.classList.add('active');
      setTimeout(() => {
        glitch.classList.remove('active');
      }, 150);
    }
  }, 2000);
}

// Terminal text effects
function initTerminalTextEffects() {
  const terminalTexts = document.querySelectorAll('.terminal-text-effect');

  terminalTexts.forEach(text => {
    const originalText = text.textContent;
    const textLength = originalText.length;

    // Clear the text
    text.textContent = '';

    // Create a buffer to build the text content
    let buffer = '';
    let i = 0;
    let lastTime = null;
    let delay = 30 + Math.random() * 40; // initial delay in ms
    let accumulated = 0;

    function typeStep(timestamp) {
      if (!lastTime) lastTime = timestamp;
      const delta = timestamp - lastTime;
      lastTime = timestamp;
      accumulated += delta;

      while (accumulated >= delay && i < textLength) {
        buffer += originalText.charAt(i);
        i++;
        accumulated -= delay;
        delay = 30 + Math.random() * 40; // new randomized delay per char

        // Play typing sound randomly
        if (Math.random() > 0.7) {
          playTerminalTypeSound();
        }
      }

      // Update visible text once per frame
      text.textContent = buffer;

      if (i < textLength) {
        requestAnimationFrame(typeStep);
      } else {
        text.classList.add('terminal-text-complete');
      }
    }

    requestAnimationFrame(typeStep);
  });
}

// Terminal interactive elements
function initTerminalInteractive() {
  // Terminal buttons
  const terminalButtons = document.querySelectorAll('.terminal-button');
  
  terminalButtons.forEach(button => {
    button.addEventListener('mouseover', () => {
      playTerminalHoverSound();
    });
    
    button.addEventListener('click', () => {
      playTerminalSelectSound();
      button.classList.add('terminal-button-active');
      setTimeout(() => {
        button.classList.remove('terminal-button-active');
      }, 200);
    });
  });
  
  // Terminal input fields
  const terminalInputs = document.querySelectorAll('.terminal-input');
  
  terminalInputs.forEach(input => {
    input.addEventListener('focus', () => {
      playTerminalSelectSound();
    });
    
    input.addEventListener('keydown', () => {
      if (Math.random() > 0.6) {
        playTerminalTypeSound();
      }
    });
  });
  
  // Terminal command line
  const terminalCommandLine = document.querySelector('.terminal-command-line');
  if (terminalCommandLine) {
    const terminalPrompt = document.querySelector('.terminal-prompt');
    const terminalInput = document.querySelector('.terminal-command-input');
    const terminalOutput = document.querySelector('.terminal-command-output');
    
    terminalInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const command = terminalInput.value.trim();
        processTerminalCommand(command, terminalOutput);
        terminalInput.value = '';
      }
    });
  }
}

// Process terminal commands
function processTerminalCommand(command, outputElement) {
  // Initialize double buffer if not already done
  if (!outputElement._buffer) {
    const buffer = document.createElement('div');
    buffer.style.display = 'none';
    outputElement._buffer = buffer;
    outputElement.parentNode.insertBefore(buffer, outputElement.nextSibling);

    function renderLoop() {
      outputElement.innerHTML = outputElement._buffer.innerHTML;
      outputElement.scrollTop = outputElement.scrollHeight;
      requestAnimationFrame(renderLoop);
    }
    requestAnimationFrame(renderLoop);
  }

  // Add command to buffer
  const commandElement = document.createElement('div');
  commandElement.className = 'terminal-command-history';
  commandElement.innerHTML = `<span class="terminal-prompt">></span> ${command}`;
  outputElement._buffer.appendChild(commandElement);

  // Process command
  let response = '';

  switch(command.toLowerCase()) {
    case 'help':
      response = `
        <div class="terminal-response">
          <div>AVAILABLE COMMANDS:</div>
          <div>- help: Display this help message</div>
          <div>- about: Display information about Nosyt Labs</div>
          <div>- projects: List all projects</div>
          <div>- contact: Display contact information</div>
          <div>- clear: Clear the terminal</div>
          <div>- vault: Access Vault-Tec terminal</div>
        </div>
      `;
      break;

    case 'about':
      response = `
        <div class="terminal-response">
          <div>NOSYT LABS</div>
          <div>Notable Opportunities Shape Your Tomorrow</div>
          <div>-----------------------------------------</div>
          <div>Nosyt Labs is a technology research and development company focused on creating innovative solutions in AI, web development, game design, and blockchain technology.</div>
        </div>
      `;
      break;

    case 'projects':
      response = `
        <div class="terminal-response">
          <div>PROJECT DATABASE ACCESS GRANTED</div>
          <div>-----------------------------------------</div>
          <div>- STREAM COMPANION: AI-powered streaming chat bot</div>
          <div>- WEBSITE EDITOR: Intuitive website creation tool</div>
          <div>- VAULT SHELTER GAME: Fallout-inspired management game</div>
          <div>- BLOCKCHAIN TOOLS: Solana development utilities</div>
          <div>- AI CODE ASSISTANT: Intelligent coding helper</div>
          <div>-----------------------------------------</div>
          <div>Type "project [name]" for more information</div>
        </div>
      `;
      break;

    case 'contact':
      response = `
        <div class="terminal-response">
          <div>CONTACT INFORMATION</div>
          <div>-----------------------------------------</div>
          <div>EMAIL: info@nosytlabs.com</div>
          <div>LOCATION: Vault 42, Sector 7-G</div>
          <div>EMERGENCY FREQUENCY: 140.85 MHz</div>
        </div>
      `;
      break;

    case 'clear':
      outputElement._buffer.innerHTML = '';
      return;


    default:
      if (command.toLowerCase().startsWith('project ')) {
        const projectName = command.substring(8).toLowerCase();
        response = getProjectDetails(projectName);
      } else {
        response = `
          <div class="terminal-response">
            <div>COMMAND NOT RECOGNIZED: "${command}"</div>
            <div>Type "help" for available commands</div>
          </div>
        `;
      }
  }

  // Add response to buffer
  const responseElement = document.createElement('div');
  responseElement.innerHTML = response;
  outputElement._buffer.appendChild(responseElement);
}

// Get project details
function getProjectDetails(projectName) {
  const projects = {
    'stream companion': `
      <div class="terminal-response">
        <div>PROJECT: STREAM COMPANION</div>
        <div>-----------------------------------------</div>
        <div>STATUS: IN DEVELOPMENT</div>
        <div>DESCRIPTION: An AI-powered streaming chat bot that doesn't require users to keep the app open. The application functions as a server that continuously monitors streaming chats, providing intelligent responses and moderation.</div>
        <div>TECHNOLOGIES: Python, JavaScript, Machine Learning</div>
      </div>
    `,
    'website editor': `
      <div class="terminal-response">
        <div>PROJECT: WEBSITE EDITOR</div>
        <div>-----------------------------------------</div>
        <div>STATUS: ACTIVE</div>
        <div>DESCRIPTION: A powerful website editor that allows users to create and edit websites with a simple, intuitive interface. Features include drag-and-drop components, responsive design tools, and template libraries.</div>
        <div>TECHNOLOGIES: TypeScript, React, Node.js</div>
      </div>
    `,
    'blockchain tools': `
      <div class="terminal-response">
        <div>PROJECT: BLOCKCHAIN TOOLS</div>
        <div>-----------------------------------------</div>
        <div>STATUS: ACTIVE</div>
        <div>DESCRIPTION: A collection of tools for blockchain development, focusing on Solana integration. Includes smart contract templates, wallet connectors, and transaction utilities for developers.</div>
        <div>TECHNOLOGIES: Rust, TypeScript, Solana</div>
      </div>
    `,
    'ai code assistant': `
      <div class="terminal-response">
        <div>PROJECT: AI CODE ASSISTANT</div>
        <div>-----------------------------------------</div>
      </div>
    `
  };
  
  return projects[projectName] || `
    <div class="terminal-response">
      <div>PROJECT NOT FOUND: "${projectName}"</div>
      <div>Type "projects" for a list of available projects</div>
    </div>
  `;
}

// Terminal sound effects
function playTerminalStartupSound() {
  playSound('terminal-startup');
}

function playTerminalTypeSound() {
  playSound('terminal-type');
}

function playTerminalHoverSound() {
  playSound('terminal-hover');
}

function playTerminalSelectSound() {
  playSound('terminal-select');
}

function playTerminalErrorSound() {
  playSound('terminal-error');
}

function playSound(soundId) {
  const audio = document.getElementById(soundId);
  if (audio) {
    audio.currentTime = 0;
    audio.volume = 0.3;
    audio.play().catch(e => {
      // Ignore autoplay restrictions
    });
  }
}

// Initialize all terminal effects
function initTerminal() {
  // Add sound elements
  addTerminalSounds();
  
  document.addEventListener('DOMContentLoaded', () => {
    initTerminalBoot();
    initTerminalBackground();
    setTimeout(() => {
      initTerminalTextEffects();
      initTerminalInteractive();
    }, 5000);
  });
}

// Add terminal sound elements
function addTerminalSounds() {
  const soundsContainer = document.createElement('div');
  soundsContainer.className = 'terminal-sounds';
  soundsContainer.style.display = 'none';
  
  soundsContainer.innerHTML = `
    <audio id="terminal-startup" preload="auto">
      <source src="/sounds/terminal-startup.mp3" type="audio/mpeg">
    </audio>
    <audio id="terminal-type" preload="auto">
      <source src="/sounds/terminal-type.mp3" type="audio/mpeg">
    </audio>
    <audio id="terminal-hover" preload="auto">
      <source src="/sounds/terminal-hover.mp3" type="audio/mpeg">
    </audio>
    <audio id="terminal-select" preload="auto">
      <source src="/sounds/terminal-select.mp3" type="audio/mpeg">
    </audio>
    <audio id="terminal-error" preload="auto">
      <source src="/sounds/terminal-error.mp3" type="audio/mpeg">
    </audio>
  `;
  
  document.body.appendChild(soundsContainer);
}

// Initialize terminal effects
initTerminal();


// Export functions for use in other modules
export {
  initTerminal,
  initTerminalBoot,
  initTerminalBackground,
  initTerminalTextEffects,
  initTerminalInteractive,
  processTerminalCommand
};
