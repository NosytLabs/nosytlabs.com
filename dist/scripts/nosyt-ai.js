/**
 * NosytOS95 AI Assistant
 * A simple AI assistant for the NosytOS95 interface
 */

// Create a global namespace for Nosyt AI
window.NosytAI = window.NosytAI || {};

// AI state
const aiState = {
  initialized: false,
  conversationHistory: [],
  isThinking: false,
  currentResponse: '',
  responseIndex: 0,
  responseInterval: null,
  elements: {
    chatContainer: null,
    inputField: null,
    sendButton: null,
    clearButton: null,
    thinkingIndicator: null
  },
  responses: {
    greeting: [
      "Hello! I'm Nosyt AI, your virtual assistant. How can I help you today?",
      "Welcome to NosytOS95! I'm Nosyt AI, ready to assist you.",
      "Greetings! Nosyt AI at your service. What can I do for you?"
    ],
    farewell: [
      "Goodbye! Feel free to chat again if you need assistance.",
      "See you later! Come back if you have more questions.",
      "Farewell! I'll be here if you need help in the future."
    ],
    notUnderstand: [
      "I'm sorry, I didn't understand that. Could you rephrase?",
      "I'm not sure what you mean. Can you explain differently?",
      "I didn't quite catch that. Could you try asking in another way?"
    ],
    about: [
      "I'm Nosyt AI, a virtual assistant for NosytOS95. I can help you navigate the system, provide information, and assist with various tasks.",
      "I'm your AI assistant in NosytOS95. I'm designed to make your experience more enjoyable and productive.",
      "I'm a simple AI assistant created for NosytOS95. I'm here to help you with whatever you need."
    ],
    help: [
      "I can help you with: navigating NosytOS95, opening applications, providing information about NosytLabs, and answering general questions. Just ask!",
      "Need help? I can assist with system navigation, application usage, and information about NosytLabs. What would you like to know?",
      "I'm here to help! I can guide you through NosytOS95, explain features, and provide information. What do you need assistance with?"
    ],
    apps: [
      "NosytOS95 includes several applications: Notepad for text editing, Duck Hunt and Doom II for gaming, and more coming soon!",
      "You can use applications like Notepad, Duck Hunt, and Doom II in NosytOS95. What would you like to open?",
      "NosytOS95 features applications such as Notepad, Duck Hunt, and Doom II. Would you like to know more about any of these?"
    ],
    games: [
      "NosytOS95 includes games like Duck Hunt and Doom II. Duck Hunt is a shooting game where you click on ducks, and Doom II is a first-person shooter.",
      "You can play Duck Hunt and Doom II in NosytOS95. Duck Hunt tests your aim, while Doom II lets you battle demons from hell.",
      "For gaming, try Duck Hunt or Doom II. Both are classic games reimagined for NosytOS95."
    ],
    nosytlabs: [
      "NosytLabs is a portfolio site for NOSYT LLC showcasing GitHub projects, content creation, and 3D printing services. The tagline is 'Notable Opportunities Shape Your Tomorrow'.",
      "NosytLabs is a startup with offerings including a YouTube channel (@TycenYT), Kick.com stream (Kick.com/Tycen), and plans for an Etsy store for 3D printing services.",
      "NosytLabs provides tech SaaS development with a focus on aesthetics and user experience. They also offer content creation and 3D printing services."
    ],
    joke: [
      "Why don't scientists trust atoms? Because they make up everything!",
      "Why did the computer go to the doctor? It had a virus!",
      "What's a computer's favorite snack? Microchips!",
      "Why did the computer keep freezing? It left its Windows open!",
      "How many programmers does it take to change a light bulb? None, that's a hardware problem!"
    ],
    time: () => `The current time is ${new Date().toLocaleTimeString()}.`,
    date: () => `Today's date is ${new Date().toLocaleDateString()}.`,
    weather: [
      "I'm sorry, I don't have access to real-time weather data. You might want to check a weather website or app for that information.",
      "I can't provide current weather information as I don't have internet access. Try checking a weather service.",
      "Unfortunately, I don't have the capability to check the weather. You'll need to use a weather app or website for that."
    ],
    custom: {}
  }
};

// Initialize when the document is loaded
document.addEventListener('DOMContentLoaded', () => {
  console.log('NosytOS95 AI Assistant loaded');

  // Delay initialization to ensure DOM is fully loaded
  setTimeout(initAI, 1000);
});

/**
 * Initialize the AI Assistant
 */
function initAI() {
  // Get AI elements
  const aiWindow = document.getElementById('nosyt-ai-window');
  if (!aiWindow) {
    console.error('AI window not found');
    return;
  }
  
  // Get chat container
  const chatContainer = aiWindow.querySelector('.ai-chat-container');
  if (!chatContainer) {
    console.error('Chat container not found');
    return;
  }
  
  // Get input field
  const inputField = aiWindow.querySelector('.ai-input-field');
  if (!inputField) {
    console.error('Input field not found');
    return;
  }
  
  // Get send button
  const sendButton = aiWindow.querySelector('.ai-send-button');
  if (!sendButton) {
    console.error('Send button not found');
    return;
  }
  
  // Get clear button
  const clearButton = aiWindow.querySelector('.ai-clear-button');
  if (!clearButton) {
    console.error('Clear button not found');
    return;
  }
  
  // Store elements in AI state
  aiState.elements.chatContainer = chatContainer;
  aiState.elements.inputField = inputField;
  aiState.elements.sendButton = sendButton;
  aiState.elements.clearButton = clearButton;
  
  // Create thinking indicator
  const thinkingIndicator = document.createElement('div');
  thinkingIndicator.className = 'ai-thinking-indicator';
  thinkingIndicator.textContent = 'Thinking...';
  thinkingIndicator.style.display = 'none';
  chatContainer.appendChild(thinkingIndicator);
  aiState.elements.thinkingIndicator = thinkingIndicator;
  
  // Add event listeners
  sendButton.addEventListener('click', handleSendMessage);
  inputField.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      handleSendMessage();
    }
  });
  clearButton.addEventListener('click', clearChat);
  
  // Add initial greeting
  addAIMessage(getRandomResponse('greeting'));
  
  // Mark as initialized
  aiState.initialized = true;
  
  console.log('AI Assistant initialized');
}

/**
 * Handle sending a message
 */
function handleSendMessage() {
  if (!aiState.initialized) return;
  
  const inputField = aiState.elements.inputField;
  const message = inputField.value.trim();
  
  if (message === '') return;
  
  // Add user message to chat
  addUserMessage(message);
  
  // Clear input field
  inputField.value = '';
  
  // Process message and get response
  processMessage(message);
}

/**
 * Add a user message to the chat
 */
function addUserMessage(message) {
  if (!aiState.elements.chatContainer) return;
  
  // Create message element
  const messageElement = document.createElement('div');
  messageElement.className = 'ai-message user-message';
  
  // Create message content
  const contentElement = document.createElement('div');
  contentElement.className = 'ai-message-content';
  contentElement.textContent = message;
  
  // Add timestamp
  const timestampElement = document.createElement('div');
  timestampElement.className = 'ai-message-timestamp';
  timestampElement.textContent = new Date().toLocaleTimeString();
  
  // Add to message element
  messageElement.appendChild(contentElement);
  messageElement.appendChild(timestampElement);
  
  // Add to chat container
  aiState.elements.chatContainer.appendChild(messageElement);
  
  // Scroll to bottom
  aiState.elements.chatContainer.scrollTop = aiState.elements.chatContainer.scrollHeight;
  
  // Add to conversation history
  aiState.conversationHistory.push({ role: 'user', content: message });
}

/**
 * Add an AI message to the chat
 */
function addAIMessage(message) {
  if (!aiState.elements.chatContainer) return;
  
  // Create message element
  const messageElement = document.createElement('div');
  messageElement.className = 'ai-message ai-response';
  
  // Create avatar
  const avatarElement = document.createElement('div');
  avatarElement.className = 'ai-avatar';
  const avatarImg = document.createElement('img');
  avatarImg.src = '/images/win95/clippy.png';
  avatarImg.alt = 'Nosyt AI';
  avatarElement.appendChild(avatarImg);
  
  // Create message content
  const contentElement = document.createElement('div');
  contentElement.className = 'ai-message-content';
  contentElement.textContent = message;
  
  // Add timestamp
  const timestampElement = document.createElement('div');
  timestampElement.className = 'ai-message-timestamp';
  timestampElement.textContent = new Date().toLocaleTimeString();
  
  // Add to message element
  messageElement.appendChild(avatarElement);
  messageElement.appendChild(contentElement);
  messageElement.appendChild(timestampElement);
  
  // Add to chat container
  aiState.elements.chatContainer.appendChild(messageElement);
  
  // Scroll to bottom
  aiState.elements.chatContainer.scrollTop = aiState.elements.chatContainer.scrollHeight;
  
  // Add to conversation history
  aiState.conversationHistory.push({ role: 'assistant', content: message });
}

/**
 * Process a message and generate a response
 */
function processMessage(message) {
  // Show thinking indicator
  showThinking(true);
  
  // Simulate thinking time
  setTimeout(() => {
    // Hide thinking indicator
    showThinking(false);
    
    // Generate response
    const response = generateResponse(message);
    
    // Add AI response to chat
    addAIMessage(response);
  }, 1000);
}

/**
 * Generate a response based on the message
 */
function generateResponse(message) {
  const lowerMessage = message.toLowerCase();
  
  // Check for greetings
  if (containsAny(lowerMessage, ['hello', 'hi', 'hey', 'greetings', 'howdy'])) {
    return getRandomResponse('greeting');
  }
  
  // Check for farewells
  if (containsAny(lowerMessage, ['goodbye', 'bye', 'see you', 'farewell', 'exit', 'quit', 'close'])) {
    return getRandomResponse('farewell');
  }
  
  // Check for help requests
  if (containsAny(lowerMessage, ['help', 'assist', 'support', 'guide', 'how to'])) {
    return getRandomResponse('help');
  }
  
  // Check for questions about the AI
  if (containsAny(lowerMessage, ['who are you', 'what are you', 'about you', 'your name', 'yourself'])) {
    return getRandomResponse('about');
  }
  
  // Check for app-related questions
  if (containsAny(lowerMessage, ['app', 'application', 'program', 'software'])) {
    return getRandomResponse('apps');
  }
  
  // Check for game-related questions
  if (containsAny(lowerMessage, ['game', 'play', 'duck hunt', 'doom', 'gaming'])) {
    return getRandomResponse('games');
  }
  
  // Check for NosytLabs questions
  if (containsAny(lowerMessage, ['nosytlabs', 'nosyt', 'company', 'business', 'startup'])) {
    return getRandomResponse('nosytlabs');
  }
  
  // Check for joke requests
  if (containsAny(lowerMessage, ['joke', 'funny', 'humor', 'laugh'])) {
    return getRandomResponse('joke');
  }
  
  // Check for time requests
  if (containsAny(lowerMessage, ['time', 'clock', 'hour'])) {
    return aiState.responses.time();
  }
  
  // Check for date requests
  if (containsAny(lowerMessage, ['date', 'day', 'today', 'month', 'year'])) {
    return aiState.responses.date();
  }
  
  // Check for weather requests
  if (containsAny(lowerMessage, ['weather', 'temperature', 'forecast', 'rain', 'snow', 'sunny'])) {
    return getRandomResponse('weather');
  }
  
  // Default response if no match
  return getRandomResponse('notUnderstand');
}

/**
 * Get a random response from a category
 */
function getRandomResponse(category) {
  const responses = aiState.responses[category];
  
  if (typeof responses === 'function') {
    return responses();
  }
  
  if (Array.isArray(responses) && responses.length > 0) {
    const randomIndex = Math.floor(Math.random() * responses.length);
    return responses[randomIndex];
  }
  
  return "I'm not sure how to respond to that.";
}

/**
 * Check if a string contains any of the given keywords
 */
function containsAny(str, keywords) {
  return keywords.some(keyword => str.includes(keyword));
}

/**
 * Show or hide the thinking indicator
 */
function showThinking(show) {
  if (!aiState.elements.thinkingIndicator) return;
  
  aiState.elements.thinkingIndicator.style.display = show ? 'block' : 'none';
  aiState.isThinking = show;
}

/**
 * Clear the chat
 */
function clearChat() {
  if (!aiState.elements.chatContainer) return;
  
  // Remove all messages except the thinking indicator
  const messages = aiState.elements.chatContainer.querySelectorAll('.ai-message');
  messages.forEach(message => {
    aiState.elements.chatContainer.removeChild(message);
  });
  
  // Clear conversation history
  aiState.conversationHistory = [];
  
  // Add initial greeting
  addAIMessage(getRandomResponse('greeting'));
}

// Initialize AI when the window is loaded
window.addEventListener('load', () => {
  console.log('Window loaded, initializing AI Assistant');
  setTimeout(initAI, 1000);
});
