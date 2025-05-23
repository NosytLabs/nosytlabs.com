/**
 * Nosyt AI Assistant (Clippy-style) for NosytOS95
 * An interactive AI assistant that provides helpful responses and suggestions
 */

class NosytAIAssistant {
  constructor() {
    // Assistant elements
    this.chatContainer = document.querySelector('.ai-chat-container');
    this.messagesContainer = document.getElementById('ai-chat-messages');
    this.inputField = document.getElementById('ai-input');
    this.sendButton = document.getElementById('ai-send-btn');
    this.suggestionButtons = document.querySelectorAll('.ai-suggestion-btn');

    // Clippy element
    this.clippy = document.getElementById('clippy');
    this.clippyBubble = this.clippy ? this.clippy.querySelector('.clippy-bubble') : null;
    this.clippyMessage = this.clippy ? document.getElementById('clippy-message') : null;

    // Assistant state
    this.isThinking = false;
    this.conversationHistory = [];
    this.userInteracted = false;

    // Predefined responses
    this.responses = {
      greeting: [
        "Hello! I'm Nosyt AI Assistant. How can I help you today?",
        "Welcome to NosytOS95! I'm here to assist you with anything you need.",
        "Hi there! I'm your friendly AI assistant. What would you like to know?"
      ],
      farewell: [
        "Goodbye! Feel free to ask if you need anything else.",
        "See you later! I'll be here if you need assistance.",
        "Until next time! Don't hesitate to reach out if you have questions."
      ],
      thanks: [
        "You're welcome! I'm happy to help.",
        "No problem at all! Let me know if you need anything else.",
        "Glad I could assist! Is there anything else you'd like to know?"
      ],
      unknown: [
        "I'm not sure I understand. Could you rephrase that?",
        "I don't have information about that yet. Is there something else I can help with?",
        "That's beyond my current knowledge. Would you like to know about NosytLabs instead?"
      ],
      nosytlabs: [
        "NosytLabs is a tech company specializing in AI solutions, web development, 3D printing services, and content creation. The name stands for 'Notable Opportunities Shape Your Tomorrow'.",
        "NosytLabs was founded in 2025 as a portfolio company showcasing various tech projects and services, including AI tools, web development, and 3D printing.",
        "NosytLabs offers a range of services including AI development with tools like Cursor AI and Trae AI, web development, 3D printing, and content creation."
      ],
      aiTools: [
        "NosytLabs works with several cutting-edge AI tools including Cursor AI, Trae AI, Roo Code, and Windsurf. Each offers unique capabilities for different development needs.",
        "Cursor AI is an advanced code editor with chat functionality that understands your entire codebase. Trae AI is a lightweight, adaptive AI code editor. Roo Code provides deep code understanding and intelligent suggestions, while Windsurf excels at navigating large codebases.",
        "Our AI tools include Cursor AI for contextual code understanding, Trae AI for adaptive learning, Roo Code for intelligent code generation, and Windsurf for large codebase navigation. Which would you like to know more about?"
      ],
      contact: [
        "You can contact NosytLabs through the contact form on the website, or by email at info@nosytlabs.com.",
        "The best way to reach NosytLabs is through the contact page on the website, where you can submit project inquiries or questions.",
        "NosytLabs can be contacted via email at info@nosytlabs.com or through social media channels linked on the website."
      ],
      services: [
        "NosytLabs offers AI development solutions, web and mobile development, 3D printing services, and content creation.",
        "Services include custom AI tool development, website and app creation, 3D model design and printing, and professional content creation for platforms like Kick.com and YouTube.",
        "NosytLabs provides tech services across four main areas: AI solutions, web/mobile development, 3D printing, and content creation/streaming."
      ],
      joke: [
        "Why don't programmers like nature? It has too many bugs and no debugging tool!",
        "Why was the JavaScript developer sad? Because they didn't know how to 'null' their feelings!",
        "How many programmers does it take to change a light bulb? None, that's a hardware problem!",
        "Why do Java developers wear glasses? Because they don't C#!",
        "What's a computer's favorite snack? Microchips!"
      ],
      help: [
        "I can help you learn about NosytLabs, our services, AI tools, or how to contact us. You can also ask me to tell you a joke!",
        "I'm here to provide information about NosytLabs and our offerings. Try asking about our AI tools, 3D printing services, or how to get in touch.",
        "Need assistance? I can tell you about NosytLabs, explain our services, discuss our AI tools, or even tell you a joke to brighten your day."
      ],
      windows95: [
        "NosytOS95 is a nostalgic Windows 95-inspired interface that showcases NosytLabs' playful approach to web design while providing a functional user experience.",
        "This Windows 95 aesthetic is a creative design choice that combines retro nostalgia with modern web technologies, demonstrating NosytLabs' versatility in web development.",
        "The Windows 95 interface you're using is a fully functional web application built with modern technologies like Astro and React, showcasing NosytLabs' frontend development capabilities."
      ],
      duckHunt: [
        "Duck Hunt is a classic Nintendo game that's been recreated here as a fun interactive element. Try double-clicking the Duck Hunt icon on the desktop to play!",
        "Our Duck Hunt implementation is a nostalgic nod to classic gaming. You can play it by double-clicking its icon on the desktop.",
        "Duck Hunt is one of the interactive applications available in NosytOS95. Double-click its icon to test your aim!"
      ],
      threeDPrinting: [
        "NosytLabs offers comprehensive 3D printing services including model design, scanning, rapid prototyping, and small batch production using Creality Ender and Elegoo Saturn printers.",
        "Our 3D printing capabilities include both FDM printing with the Creality Ender 3 S1 Pro and high-resolution resin printing with the Elegoo Saturn 2 8K.",
        "We provide end-to-end 3D printing services from design to finished product, with expertise in various materials including PLA, PETG, TPU, ABS, and specialized resins."
      ]
    };

    // Initialize the assistant
    this.init();
  }

  init() {
    // Set up event listeners
    if (this.sendButton && this.inputField) {
      this.sendButton.addEventListener('click', this.handleSend.bind(this));
      this.inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
          this.handleSend();
        }
      });
    }

    // Set up suggestion buttons
    this.suggestionButtons.forEach(button => {
      button.addEventListener('click', () => {
        const query = button.dataset.query;
        if (query) {
          this.inputField.value = query;
          this.handleSend();
        }
      });
    });

    // Set up Clippy behavior if it exists
    if (this.clippy) {
      // Show random tips occasionally
      this.setupClippyBehavior();
    }

    // Add initial greeting after a short delay
    setTimeout(() => {
      this.addAssistantMessage(this.getRandomResponse('greeting'));
    }, 500);
  }

  handleSend() {
    if (this.isThinking || !this.inputField) return;

    const userInput = this.inputField.value.trim();
    if (!userInput) return;

    // Add user message
    this.addUserMessage(userInput);

    // Clear input field
    this.inputField.value = '';

    // Mark that user has interacted
    this.userInteracted = true;

    // Process the message and respond
    this.processUserInput(userInput);
  }

  processUserInput(input) {
    // Start thinking animation
    this.startThinking();

    // Add to conversation history
    this.conversationHistory.push({ role: 'user', content: input });

    // Determine response based on input
    const response = this.generateResponse(input);

    // Add to conversation history
    this.conversationHistory.push({ role: 'assistant', content: response });

    // Show response after a short delay to simulate thinking
    setTimeout(() => {
      this.stopThinking();
      this.addAssistantMessage(response);

      // Scroll to bottom
      this.scrollToBottom();
    }, 1000 + Math.random() * 1000); // Random delay between 1-2 seconds
  }

  generateResponse(input) {
    // Convert input to lowercase for easier matching
    const lowerInput = input.toLowerCase();

    // Check for greetings
    if (this.containsAny(lowerInput, ['hello', 'hi', 'hey', 'greetings', 'howdy'])) {
      return this.getRandomResponse('greeting');
    }

    // Check for farewells
    if (this.containsAny(lowerInput, ['goodbye', 'bye', 'see you', 'farewell', 'later'])) {
      return this.getRandomResponse('farewell');
    }

    // Check for thanks
    if (this.containsAny(lowerInput, ['thanks', 'thank you', 'appreciate', 'grateful'])) {
      return this.getRandomResponse('thanks');
    }

    // Check for questions about NosytLabs
    if (this.containsAny(lowerInput, ['nosytlabs', 'company', 'about', 'who are you', 'what is nosyt'])) {
      return this.getRandomResponse('nosytlabs');
    }

    // Check for questions about AI tools
    if (this.containsAny(lowerInput, ['ai', 'artificial intelligence', 'cursor', 'trae', 'roo code', 'roo', 'windsurf', 'tools'])) {
      return this.getRandomResponse('aiTools');
    }

    // Check for contact information
    if (this.containsAny(lowerInput, ['contact', 'email', 'reach', 'get in touch', 'phone'])) {
      return this.getRandomResponse('contact');
    }

    // Check for services
    if (this.containsAny(lowerInput, ['services', 'offer', 'provide', 'what do you do', 'help with'])) {
      return this.getRandomResponse('services');
    }

    // Check for joke requests
    if (this.containsAny(lowerInput, ['joke', 'funny', 'humor', 'laugh', 'entertain'])) {
      return this.getRandomResponse('joke');
    }

    // Check for help requests
    if (this.containsAny(lowerInput, ['help', 'assist', 'support', 'guide', 'what can you do'])) {
      return this.getRandomResponse('help');
    }

    // Check for Windows 95 questions
    if (this.containsAny(lowerInput, ['windows', 'windows 95', 'nosytos', 'nosytos95', 'interface', 'design'])) {
      return this.getRandomResponse('windows95');
    }

    // Check for Duck Hunt questions
    if (this.containsAny(lowerInput, ['duck hunt', 'game', 'play', 'gaming', 'shoot'])) {
      return this.getRandomResponse('duckHunt');
    }

    // Check for 3D printing questions
    if (this.containsAny(lowerInput, ['3d', 'printing', 'printer', 'model', 'creality', 'elegoo'])) {
      return this.getRandomResponse('threeDPrinting');
    }

    // Default response for unknown inputs
    return this.getRandomResponse('unknown');
  }

  containsAny(text, keywords) {
    return keywords.some(keyword => text.includes(keyword));
  }

  getRandomResponse(category) {
    const responses = this.responses[category] || this.responses.unknown;
    return responses[Math.floor(Math.random() * responses.length)];
  }

  addUserMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'user-message';
    messageElement.innerHTML = `
      <div class="user-avatar">👤</div>
      <div class="user-message-bubble">
        <p>${this.escapeHTML(message)}</p>
      </div>
    `;

    this.messagesContainer.appendChild(messageElement);
    this.scrollToBottom();
  }

  addAssistantMessage(message) {
    const messageElement = document.createElement('div');
    messageElement.className = 'ai-message';
    messageElement.innerHTML = `
      <img src="/images/win95/clippy.png" alt="Nosyt AI" class="ai-avatar">
      <div class="ai-message-bubble">
        <p>${this.escapeHTML(message)}</p>
      </div>
    `;

    this.messagesContainer.appendChild(messageElement);
    this.scrollToBottom();

    // Also update Clippy bubble if it exists
    if (this.clippyMessage) {
      this.updateClippyMessage(message);
    }
  }

  startThinking() {
    this.isThinking = true;

    const thinkingElement = document.createElement('div');
    thinkingElement.className = 'ai-message thinking';
    thinkingElement.innerHTML = `
      <img src="/images/win95/clippy.png" alt="Nosyt AI" class="ai-avatar">
      <div class="ai-message-bubble">
        <div class="thinking-dots">
          <span>.</span><span>.</span><span>.</span>
        </div>
      </div>
    `;

    this.messagesContainer.appendChild(thinkingElement);
    this.scrollToBottom();
  }

  stopThinking() {
    this.isThinking = false;

    // Remove thinking message
    const thinkingElement = this.messagesContainer.querySelector('.thinking');
    if (thinkingElement) {
      thinkingElement.remove();
    }
  }

  scrollToBottom() {
    if (this.messagesContainer) {
      this.messagesContainer.scrollTop = this.messagesContainer.scrollHeight;
    }
  }

  escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  setupClippyBehavior() {
    // Show Clippy after a short delay
    setTimeout(() => {
      if (this.clippy) {
        this.clippy.style.display = 'block';
        this.clippy.style.opacity = '1';
      }
    }, 3000);

    // Set up random tips if user hasn't interacted
    let tipInterval = setInterval(() => {
      if (!this.userInteracted && this.clippyMessage) {
        this.showRandomClippyTip();
      }
    }, 30000); // Show a tip every 30 seconds

    // Clear interval when user interacts with assistant
    document.getElementById('nosyt-ai-icon').addEventListener('dblclick', () => {
      clearInterval(tipInterval);
    });

    // Add close button to Clippy
    if (this.clippy) {
      const closeButton = document.createElement('button');
      closeButton.className = 'clippy-close';
      closeButton.innerHTML = '×';
      closeButton.title = 'Dismiss';
      closeButton.addEventListener('click', () => {
        this.clippy.style.opacity = '0';
        setTimeout(() => {
          this.clippy.style.display = 'none';
        }, 300);
      });

      this.clippy.appendChild(closeButton);
    }
  }

  showRandomClippyTip() {
    if (!this.clippyMessage) return;

    // Get the current page or application context
    const currentContext = this.getCurrentContext();

    // Define context-specific tips
    const contextualTips = {
      default: [
        "Try double-clicking on the desktop icons to open applications!",
        "You can drag windows around by their title bars.",
        "Check out the Duck Hunt game by double-clicking its icon!",
        "Try the new Doom II game by double-clicking its icon or launching it from the Start menu!",
        "Click the Start button to see more options.",
        "Try resizing windows using the handles on the edges and corners. All 8 resize handles are now available!",
        "Need help? Double-click on the Nosyt AI icon to chat with me!",
        "Explore the 3D printing services by visiting the 3D Printing page.",
        "Check out our blog for articles about AI tools and technologies.",
        "Press Alt+Tab to switch between open windows.",
        "Right-click on the desktop for additional options.",
        "Try the Konami code for a surprise! (↑ ↑ ↓ ↓ ← → ← → B A)",
        "You can maximize windows by clicking the square button in the top-right corner.",
        "The taskbar shows all your open applications for easy access."
      ],
      notepad: [
        "You can save your notes by clicking File > Save in the menu.",
        "Notepad supports basic text editing functions like cut, copy, and paste.",
        "Press Ctrl+F to search for text in your document.",
        "You can change the font by clicking Format > Font in the menu.",
        "Press Ctrl+A to select all text in your document."
      ],
      duckHunt: [
        "Click on the ducks to shoot them before they fly away!",
        "Try to get a high score by shooting multiple ducks in a row.",
        "The game gets progressively harder with faster ducks.",
        "You have a limited number of shots, so aim carefully!",
        "Watch out for the dog - he'll laugh at you if you miss too many ducks!"
      ],
      doom: [
        "Use WASD keys to move and the mouse to aim in Doom II.",
        "Press Space to open doors and activate switches.",
        "Press Shift to run faster in the game.",
        "Press E to use items or interact with objects.",
        "Press 1-7 to switch weapons once you've collected them.",
        "Press Escape to access the game menu."
      ],
      browser: [
        "Enter a URL in the address bar and press Enter to navigate to a website.",
        "Use the back and forward buttons to navigate through your browsing history.",
        "Press Ctrl+D to bookmark your favorite websites.",
        "Right-click on a link to open it in a new window.",
        "Press F5 to refresh the current page."
      ],
      ai: [
        "Ask me about NosytLabs' AI tools like Cursor AI, Trae AI, Roo Code, and Windsurf.",
        "I can help you learn about different services offered by NosytLabs.",
        "Try asking specific questions about AI development or 3D printing.",
        "You can click on the suggestion buttons below for quick queries.",
        "I'm designed to provide information about NosytLabs and its technologies."
      ]
    };

    // Select tips based on context
    const relevantTips = contextualTips[currentContext] || contextualTips.default;

    // Add some default tips to every context for variety
    const allTips = [...relevantTips];
    if (currentContext !== 'default') {
      // Add a few general tips to the mix
      const defaultTips = contextualTips.default;
      const randomDefaultTips = this.getRandomElements(defaultTips, 3);
      allTips.push(...randomDefaultTips);
    }

    const randomTip = allTips[Math.floor(Math.random() * allTips.length)];
    this.updateClippyMessage(randomTip);

    // Show Clippy with animation if hidden
    if (this.clippy && (this.clippy.style.display === 'none' || this.clippy.style.opacity === '0')) {
      // First make sure it's displayed
      this.clippy.style.display = 'block';

      // Add entrance animation
      this.clippy.classList.add('clippy-entrance');

      // Then fade in
      setTimeout(() => {
        this.clippy.style.opacity = '1';

        // Remove animation class after it completes
        setTimeout(() => {
          this.clippy.classList.remove('clippy-entrance');
        }, 500);
      }, 10);
    }

    // Hide Clippy after a delay with animation
    setTimeout(() => {
      if (this.clippy) {
        // Add exit animation
        this.clippy.classList.add('clippy-exit');

        // Fade out
        setTimeout(() => {
          this.clippy.style.opacity = '0';

          // Hide after fade completes
          setTimeout(() => {
            this.clippy.style.display = 'none';
            this.clippy.classList.remove('clippy-exit');
          }, 300);
        }, 200);
      }
    }, 15000); // Hide after 15 seconds (increased from 10)
  }

  // Helper function to get the current context based on open windows
  getCurrentContext() {
    // Check which windows are currently open and visible
    const notepadWindow = document.getElementById('notepad-window');
    const duckHuntWindow = document.getElementById('duck-hunt-window');
    const doomWindow = document.getElementById('doom-window');
    const browserWindow = document.getElementById('browser-window');
    const aiWindow = document.getElementById('nosyt-ai-window');

    if (notepadWindow && notepadWindow.style.display !== 'none') return 'notepad';
    if (duckHuntWindow && duckHuntWindow.style.display !== 'none') return 'duckHunt';
    if (doomWindow && doomWindow.style.display !== 'none') return 'doom';
    if (browserWindow && browserWindow.style.display !== 'none') return 'browser';
    if (aiWindow && aiWindow.style.display !== 'none') return 'ai';

    return 'default';
  }

  // Helper function to get random elements from an array
  getRandomElements(array, count) {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  updateClippyMessage(message) {
    if (this.clippyMessage) {
      // Fade out
      this.clippyBubble.style.opacity = '0';

      // Update text and fade in
      setTimeout(() => {
        this.clippyMessage.textContent = message;
        this.clippyBubble.style.opacity = '1';
      }, 300);
    }
  }
}

// Initialize the assistant when the window is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Only initialize if the Nosyt AI window exists
  const nosytAIWindow = document.getElementById('nosyt-ai-window');
  if (nosytAIWindow) {
    // Initialize when the window is opened
    const nosytAIIcon = document.getElementById('nosyt-ai-icon');
    if (nosytAIIcon) {
      nosytAIIcon.addEventListener('dblclick', () => {
        setTimeout(() => {
          new NosytAIAssistant();
        }, 500); // Short delay to ensure window is fully opened
      });
    }

    // Also initialize if window is already open
    if (nosytAIWindow.style.display !== 'none') {
      new NosytAIAssistant();
    }
  } else {
    // Initialize Clippy even if window isn't open yet
    const clippy = document.getElementById('clippy');
    if (clippy) {
      const assistant = new NosytAIAssistant();
    }
  }
});
