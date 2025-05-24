/**
 * NosytOS95 AI Assistant
 * A Clippy-like assistant for the NosytOS95 interface
 */

document.addEventListener('DOMContentLoaded', () => {
  // Assistant variables
  let assistantActive = true;
  let assistantMinimized = false;
  let idleTimer = null;
  let currentAnimation = null;
  
  // Assistant messages
  const greetings = [
    "Hi there! I'm Nosyt, your digital assistant!",
    "Welcome to NosytOS95! Need any help?",
    "Hello! I'm here to assist you with NosytOS95!",
    "Greetings! How can I help you today?",
    "Hi! I'm Nosyt, your friendly AI assistant!"
  ];
  
  const idleTips = [
    "Did you know you can find easter eggs in the Terminal? Try typing 'secret'!",
    "Click on the 'DO NOT CLICK' folder... if you dare!",
    "Try playing Duck Hunt in the Games folder!",
    "You can change the Terminal color by typing 'color nosyt'.",
    "Press the Konami code for a special surprise! (↑↑↓↓←→←→BA)",
    "Check out My Documents for information about NosytLabs services.",
    "Try typing 'matrix' in the Terminal for a cool effect!",
    "You can resize windows by dragging the corners.",
    "Double-click on window headers to maximize them.",
    "Right-click on the desktop for a context menu.",
    "NosytLabs was founded in 2025. The future is now!",
    "The name 'Nosyt' stands for 'Notable Opportunities Shape Your Tomorrow'.",
    "Try typing 'joke' in the Terminal for a laugh!",
    "You can minimize windows to the taskbar.",
    "Check out the Start menu for more applications!"
  ];
  
  const reactions = [
    { trigger: "notepad", response: "I see you're using Notepad! Need help writing something?" },
    { trigger: "terminal", response: "Terminal open! Try typing 'help' for a list of commands." },
    { trigger: "duck hunt", response: "Duck Hunt is a classic! Aim carefully and have fun!" },
    { trigger: "browser", response: "Browsing the web? Let me know if you need help finding something!" },
    { trigger: "file explorer", response: "Looking for files? Check out the NosytLabs folder for interesting content!" },
    { trigger: "do not click", response: "I see you're curious about that folder... I wonder what happens if you click it?" },
    { trigger: "start menu", response: "The Start menu has all the applications you need!" }
  ];
  
  // Initialize assistant
  function initAssistant() {
    const assistantWindow = document.getElementById('nosyt-ai-window');
    if (!assistantWindow) return;
    
    const assistantContent = assistantWindow.querySelector('.assistant-content');
    const assistantCharacter = assistantWindow.querySelector('.assistant-character');
    const assistantMessage = assistantWindow.querySelector('.assistant-message');
    const assistantInput = assistantWindow.querySelector('.assistant-input');
    const assistantForm = assistantWindow.querySelector('.assistant-form');
    const minimizeBtn = assistantWindow.querySelector('.assistant-minimize');
    const closeBtn = assistantWindow.querySelector('.assistant-close');
    
    if (!assistantContent || !assistantCharacter || !assistantMessage || !assistantInput || !assistantForm) return;
    
    // Show random greeting
    const greeting = greetings[Math.floor(Math.random() * greetings.length)];
    showMessage(greeting);
    
    // Start idle timer
    startIdleTimer();
    
    // Handle form submission
    assistantForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const query = assistantInput.value.trim();
      if (!query) return;
      
      // Process query
      processQuery(query);
      
      // Clear input
      assistantInput.value = '';
    });
    
    // Handle minimize button
    if (minimizeBtn) {
      minimizeBtn.addEventListener('click', () => {
        assistantMinimized = !assistantMinimized;
        
        if (assistantMinimized) {
          assistantContent.style.height = '40px';
          assistantCharacter.style.display = 'none';
          assistantMessage.style.display = 'none';
          assistantForm.style.display = 'none';
          minimizeBtn.textContent = '□';
        } else {
          assistantContent.style.height = '300px';
          assistantCharacter.style.display = 'block';
          assistantMessage.style.display = 'block';
          assistantForm.style.display = 'flex';
          minimizeBtn.textContent = '_';
        }
      });
    }
    
    // Handle close button
    if (closeBtn) {
      closeBtn.addEventListener('click', () => {
        assistantWindow.style.display = 'none';
        assistantActive = false;
        
        // Clear idle timer
        if (idleTimer) {
          clearTimeout(idleTimer);
          idleTimer = null;
        }
      });
    }
    
    // Listen for window activations
    document.addEventListener('activateWindow', (e) => {
      if (!assistantActive) return;
      
      const window = e.detail.window;
      if (!window) return;
      
      // React to window activation
      reactToWindow(window);
    });
  }
  
  // Process user query
  function processQuery(query) {
    // Reset idle timer
    startIdleTimer();
    
    // Convert query to lowercase for easier matching
    const lowerQuery = query.toLowerCase();
    
    // Check for specific queries
    if (lowerQuery.includes('help')) {
      showMessage("I can help you navigate NosytOS95! Try asking about specific applications or features.");
    } else if (lowerQuery.includes('hello') || lowerQuery.includes('hi')) {
      showMessage("Hello there! How can I assist you today?");
    } else if (lowerQuery.includes('who are you')) {
      showMessage("I'm Nosyt, your AI assistant for NosytOS95! I'm here to help you navigate and discover features.");
    } else if (lowerQuery.includes('what can you do')) {
      showMessage("I can provide tips, help you navigate NosytOS95, and answer questions about NosytLabs services!");
    } else if (lowerQuery.includes('easter egg') || lowerQuery.includes('secret')) {
      showMessage("I can't directly reveal easter eggs, but try exploring the Terminal and typing 'secret' or 'easteregg'!");
    } else if (lowerQuery.includes('nosytlabs')) {
      showMessage("NosytLabs provides web development, content creation, 3D printing services, and educational resources on passive income opportunities!");
    } else if (lowerQuery.includes('joke')) {
      tellJoke();
    } else if (lowerQuery.includes('thank')) {
      showMessage("You're welcome! I'm happy to help!");
    } else if (lowerQuery.includes('bye') || lowerQuery.includes('goodbye')) {
      showMessage("Goodbye! Feel free to call me if you need assistance!");
    } else {
      // Generic response
      showMessage("I'm not sure how to help with that. Try asking about NosytOS95 features or NosytLabs services!");
    }
  }
  
  // React to window activation
  function reactToWindow(window) {
    if (!window.id) return;
    
    // Find matching reaction
    let reaction = null;
    
    for (const r of reactions) {
      if (window.id.toLowerCase().includes(r.trigger)) {
        reaction = r.response;
        break;
      }
    }
    
    // Show reaction if found
    if (reaction) {
      showMessage(reaction);
    }
  }
  
  // Show message
  function showMessage(message) {
    const assistantMessage = document.querySelector('#nosyt-ai-window .assistant-message');
    if (!assistantMessage) return;
    
    // Set message
    assistantMessage.textContent = message;
    
    // Animate character
    animateCharacter();
  }
  
  // Animate character
  function animateCharacter() {
    const assistantCharacter = document.querySelector('#nosyt-ai-window .assistant-character');
    if (!assistantCharacter) return;
    
    // Clear current animation
    if (currentAnimation) {
      assistantCharacter.classList.remove(currentAnimation);
    }
    
    // Random animation
    const animations = ['bounce', 'wave', 'spin', 'nod'];
    currentAnimation = animations[Math.floor(Math.random() * animations.length)];
    
    // Apply animation
    assistantCharacter.classList.add(currentAnimation);
    
    // Remove animation after it completes
    setTimeout(() => {
      assistantCharacter.classList.remove(currentAnimation);
      currentAnimation = null;
    }, 1000);
  }
  
  // Start idle timer
  function startIdleTimer() {
    // Clear existing timer
    if (idleTimer) {
      clearTimeout(idleTimer);
    }
    
    // Set new timer
    idleTimer = setTimeout(() => {
      if (assistantActive && !assistantMinimized) {
        showIdleTip();
      }
    }, 30000); // 30 seconds
  }
  
  // Show random idle tip
  function showIdleTip() {
    const tip = idleTips[Math.floor(Math.random() * idleTips.length)];
    showMessage(tip);
    
    // Restart timer
    startIdleTimer();
  }
  
  // Tell a joke
  function tellJoke() {
    const jokes = [
      "Why do programmers prefer dark mode? Because light attracts bugs!",
      "Why did the computer go to the doctor? It had a virus!",
      "Why don't scientists trust atoms? Because they make up everything!",
      "What's a computer's favorite snack? Microchips!",
      "Why did the computer keep freezing? It left too many Windows open!",
      "How many programmers does it take to change a light bulb? None, that's a hardware problem!",
      "Why was the computer cold? It left its Windows open!",
      "What do you call a computer that sings? A Dell!",
      "Why did the computer go to art school? It wanted to learn how to draw pixels!",
      "What's a computer's favorite beat? An algorithm!"
    ];
    
    const joke = jokes[Math.floor(Math.random() * jokes.length)];
    showMessage(joke);
  }
  
  // Initialize assistant
  initAssistant();
});
