// Stream Configuration
const streamConfig = {
    channelName: 'your_channel_name',
    platform: 'kick',
    quality: '1080p60'
};

// Stream Status
let isLive = false;
let viewerCount = 0;

// Initialize Stream
function initializeStream() {
    const streamEmbed = document.getElementById('stream-embed');
    // Kick.com embed implementation
    streamEmbed.innerHTML = `
        <iframe
            src="https://player.kick.com/${streamConfig.channelName}"
            width="100%"
            height="100%"
            frameborder="0"
            allowfullscreen>
        </iframe>
    `;
}

// Update Stream Status
function updateStreamStatus(status) {
    const statusIndicator = document.querySelector('.status-indicator');
    const statusText = document.querySelector('.status-text');
    
    isLive = status === 'live';
    statusIndicator.classList.toggle('live', isLive);
    statusText.textContent = isLive ? 'LIVE' : 'OFFLINE';
}

// Update Viewer Count
function updateViewerCount(count) {
    viewerCount = count;
    document.getElementById('viewer-count').textContent = count;
}

// Quality Selector
document.getElementById('quality-selector').addEventListener('change', (e) => {
    streamConfig.quality = e.target.value;
    // Implement quality change logic here
});

// Chat System
class ChatSystem {
    constructor() {
        this.messages = [];
        this.commands = new Map();
        this.setupEventListeners();
        this.initializeCommands();
    }

    setupEventListeners() {
        const sendButton = document.getElementById('send-message');
        const chatInput = document.getElementById('chat-input');

        sendButton.addEventListener('click', () => this.sendMessage());
        chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    }

    initializeCommands() {
        this.commands.set('!commands', 'Display all available commands');
        this.commands.set('!schedule', 'Show stream schedule');
        this.commands.set('!socials', 'Display social media links');
        this.commands.set('!specs', 'Show streaming setup specs');
        
        this.updateCommandsList();
    }

    sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (!message) return;

        if (message.startsWith('!')) {
            this.handleCommand(message);
        } else {
            this.addMessage({
                user: 'User',
                message: message,
                timestamp: new Date()
            });
        }

        input.value = '';
    }

    handleCommand(command) {
        const commandInfo = this.commands.get(command);
        if (commandInfo) {
            this.addMessage({
                user: 'System',
                message: `${command}: ${commandInfo}`,
                timestamp: new Date(),
                isSystem: true
            });
        }
    }

    addMessage({ user, message, timestamp, isSystem = false }) {
        const chatMessages = document.getElementById('chat-messages');
        const messageElement = document.createElement('div');
        messageElement.classList.add('chat-message');
        if (isSystem) messageElement.classList.add('system-message');
        
        messageElement.innerHTML = `
            <span class="timestamp">${timestamp.toLocaleTimeString()}</span>
            <span class="username">${user}:</span>
            <span class="message">${this.formatMessage(message)}</span>
        `;
        
        chatMessages.appendChild(messageElement);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    formatMessage(message) {
        // Add emote parsing, link detection, etc.
        return message.replace(/</g, '&lt;').replace(/>/g, '&gt;');
    }

    updateCommandsList() {
        const commandsList = document.getElementById('commands-list');
        let html = '<ul>';
        this.commands.forEach((description, command) => {
            html += `<li><strong>${command}</strong>: ${description}</li>`;
        });
        html += '</ul>';
        commandsList.innerHTML = html;
    }
}

// Calendar and Events
class StreamCalendar {
    constructor() {
        this.events = [];
        this.initializeCalendar();
    }

    initializeCalendar() {
        // Sample events
        this.events = [
            { date: '2025-05-17', title: 'Special Stream Event', time: '20:00' },
            { date: '2025-05-19', title: 'Community Game Night', time: '21:00' },
            { date: '2025-05-22', title: 'Tutorial Stream', time: '19:00' }
        ];

        this.updateCalendarUI();
        this.updateEventsList();
    }

    updateCalendarUI() {
        const calendar = document.getElementById('calendar');
        // Implement calendar UI
        calendar.innerHTML = '<div class="calendar-placeholder">Calendar UI Coming Soon</div>';
    }

    updateEventsList() {
        const eventsList = document.getElementById('events-list');
        const upcomingEvents = this.events
            .filter(event => new Date(`${event.date} ${event.time}`) > new Date())
            .sort((a, b) => new Date(a.date) - new Date(b.date));

        let html = '';
        upcomingEvents.forEach(event => {
            html += `
                <li class="event-item">
                    <div class="event-date">${new Date(event.date).toLocaleDateString()}</div>
                    <div class="event-time">${event.time}</div>
                    <div class="event-title">${event.title}</div>
                </li>
            `;
        });

        eventsList.innerHTML = html;
    }
}

// Emote System
class EmoteSystem {
    constructor() {
        this.emotes = new Map();
        this.initializeEmotes();
    }

    initializeEmotes() {
        // Sample emotes
        const sampleEmotes = [
            { name: 'happy', url: 'path/to/happy.png' },
            { name: 'sad', url: 'path/to/sad.png' },
            { name: 'love', url: 'path/to/love.png' }
        ];

        sampleEmotes.forEach(emote => {
            this.emotes.set(emote.name, emote.url);
        });

        this.updateEmotesGrid();
    }

    updateEmotesGrid() {
        const emotesGrid = document.getElementById('emotes-grid');
        let html = '';
        this.emotes.forEach((url, name) => {
            html += `
                <div class="emote-item" title="${name}">
                    <img src="${url}" alt="${name}" class="emote-img">
                </div>
            `;
        });
        emotesGrid.innerHTML = html;
    }
}

// Initialize everything when the page loads
document.addEventListener('DOMContentLoaded', () => {
    initializeStream();
    const chat = new ChatSystem();
    const calendar = new StreamCalendar();
    const emotes = new EmoteSystem();

    // Simulate stream status updates
    setInterval(() => {
        updateStreamStatus(Math.random() > 0.5 ? 'live' : 'offline');
        updateViewerCount(Math.floor(Math.random() * 1000));
    }, 5000);
});