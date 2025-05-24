// Chat Application
function initChat() {
  const chatWindow = document.getElementById('chat-window');
  
  if (chatWindow) {
    // Create chat interface
    createChatInterface();
    
    // Initialize chat functionality
    initChatFunctionality();
    
    // Create chat interface
    function createChatInterface() {
      const chatContent = chatWindow.querySelector('.window-content');
      if (!chatContent) return;
      
      // Clear existing content
      chatContent.innerHTML = '';
      
      // Create chat layout
      chatContent.innerHTML = `
        <div class="chat-container">
          <div class="chat-sidebar">
            <h2 class="chat-header">Chats</h2>
            <div class="chat-channels">
              <div class="chat-user">@nosyt</div>
              <div class="chat-channels-list">
                <div class="chat-channel active" data-channel="general">
                  <div class="channel-name">#general</div>
                  <div class="channel-users">5 online</div>
                </div>
                <div class="chat-channel" data-channel="help">
                  <div class="channel-name">#help</div>
                  <div class="channel-users">3 online</div>
                </div>
                <div class="chat-channel" data-channel="nosytos95">
                  <div class="channel-name">#nosytos95</div>
                  <div class="channel-users">7 online</div>
                </div>
                <div class="chat-channel" data-channel="games">
                  <div class="channel-name">#games</div>
                  <div class="channel-users">4 online</div>
                </div>
                <div class="chat-channel" data-channel="random">
                  <div class="channel-name">#random</div>
                  <div class="channel-users">6 online</div>
                </div>
              </div>
            </div>
          </div>
          <div class="chat-main">
            <div class="chat-header">
              <button class="chat-channel-button">#general</button>
              <div class="chat-users-count">5 online</div>
            </div>
            <div class="chat-messages">
              <!-- Messages will be added here -->
            </div>
            <div class="chat-input-container">
              <input type="text" class="chat-input" placeholder="Type a message...">
              <button class="chat-send-button">Send</button>
            </div>
          </div>
        </div>
      `;
      
      // Add some initial messages
      const messagesContainer = chatContent.querySelector('.chat-messages');
      if (messagesContainer) {
        const initialMessages = [
          { user: 'System', message: 'Welcome to the #general channel!', time: '12:00 PM' },
          { user: 'NosytBot', message: 'This is a chat application for NosytOS95.', time: '12:01 PM' },
          { user: 'User123', message: 'Hello everyone!', time: '12:05 PM' },
          { user: 'TechGuru', message: 'How is everyone doing today?', time: '12:10 PM' },
          { user: 'CodeMaster', message: 'I love the new NosytOS95 interface!', time: '12:15 PM' },
          { user: 'GameFan', message: 'Has anyone tried the Duck Hunt game yet?', time: '12:20 PM' },
          { user: 'RetroLover', message: 'The Windows 95 aesthetic is so nostalgic!', time: '12:25 PM' },
          { user: 'NosytFan', message: 'I can\'t wait to see what other features will be added!', time: '12:30 PM' }
        ];
        
        initialMessages.forEach(msg => {
          addMessage(msg.user, msg.message, msg.time);
        });
      }
    }
    
    // Initialize chat functionality
    function initChatFunctionality() {
      // Channel switching
      const channels = chatWindow.querySelectorAll('.chat-channel');
      const channelButton = chatWindow.querySelector('.chat-channel-button');
      const usersCount = chatWindow.querySelector('.chat-users-count');
      
      channels.forEach(channel => {
        channel.addEventListener('click', function() {
          // Update active channel
          channels.forEach(ch => ch.classList.remove('active'));
          this.classList.add('active');
          
          // Update header
          const channelName = this.querySelector('.channel-name').textContent;
          const channelUsers = this.querySelector('.channel-users').textContent;
          
          if (channelButton) channelButton.textContent = channelName;
          if (usersCount) usersCount.textContent = channelUsers;
          
          // Clear messages
          const messagesContainer = chatWindow.querySelector('.chat-messages');
          if (messagesContainer) {
            messagesContainer.innerHTML = '';
            
            // Add channel-specific welcome message
            const channelId = this.getAttribute('data-channel');
            addMessage('System', `Welcome to the ${channelName} channel!`, getCurrentTime());
            
            // Add some channel-specific messages
            if (channelId === 'general') {
              addMessage('NosytBot', 'This is the general discussion channel.', getCurrentTime());
              addMessage('User123', 'Hello everyone!', getCurrentTime());
            } else if (channelId === 'help') {
              addMessage('NosytBot', 'Need help with NosytOS95? Ask here!', getCurrentTime());
              addMessage('TechSupport', 'I\'m here to help with any technical issues.', getCurrentTime());
            } else if (channelId === 'nosytos95') {
              addMessage('NosytBot', 'Discuss NosytOS95 features and updates here.', getCurrentTime());
              addMessage('Developer', 'We\'re working on adding more applications soon!', getCurrentTime());
            } else if (channelId === 'games') {
              addMessage('NosytBot', 'Talk about your favorite games here!', getCurrentTime());
              addMessage('GameFan', 'Duck Hunt is my favorite so far!', getCurrentTime());
            } else if (channelId === 'random') {
              addMessage('NosytBot', 'Random discussions welcome here!', getCurrentTime());
              addMessage('RandomUser', 'Did you know that the first version of Windows was released in 1985?', getCurrentTime());
            }
          }
        });
      });
      
      // Message sending
      const inputField = chatWindow.querySelector('.chat-input');
      const sendButton = chatWindow.querySelector('.chat-send-button');
      
      function sendMessage() {
        if (inputField && inputField.value.trim() !== '') {
          addMessage('You', inputField.value, getCurrentTime());
          inputField.value = '';
          
          // Simulate response after a short delay
          setTimeout(() => {
            const responses = [
              'That\'s interesting!',
              'I agree with you.',
              'Thanks for sharing!',
              'Good point!',
              'I hadn\'t thought of that.',
              'That\'s a great idea!',
              'I\'ll have to try that.',
              'Tell me more about that.',
              'I\'m not sure I understand.',
              'Could you explain that further?'
            ];
            
            const randomResponse = responses[Math.floor(Math.random() * responses.length)];
            const users = ['User123', 'TechGuru', 'CodeMaster', 'GameFan', 'RetroLover', 'NosytFan'];
            const randomUser = users[Math.floor(Math.random() * users.length)];
            
            addMessage(randomUser, randomResponse, getCurrentTime());
          }, 1500);
        }
      }
      
      if (sendButton) {
        sendButton.addEventListener('click', sendMessage);
      }
      
      if (inputField) {
        inputField.addEventListener('keydown', function(e) {
          if (e.key === 'Enter') {
            sendMessage();
          }
        });
      }
    }
    
    // Add message to chat
    function addMessage(user, message, time) {
      const messagesContainer = chatWindow.querySelector('.chat-messages');
      if (!messagesContainer) return;
      
      const messageElement = document.createElement('div');
      messageElement.className = 'chat-message';
      
      messageElement.innerHTML = `
        <div class="message-header">
          <span class="message-user">${user}</span>
          <span class="message-time">${time}</span>
        </div>
        <div class="message-content">${message}</div>
      `;
      
      messagesContainer.appendChild(messageElement);
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
    
    // Get current time
    function getCurrentTime() {
      const now = new Date();
      const hours = now.getHours() % 12 || 12;
      const minutes = now.getMinutes().toString().padStart(2, '0');
      const ampm = now.getHours() >= 12 ? 'PM' : 'AM';
      
      return `${hours}:${minutes} ${ampm}`;
    }
  }
}
