/**
 * Windows 95 Taskbar Manager
 * Handles taskbar functionality including:
 * - Window management
 * - Quick launch
 * - System tray
 * - Clock
 * - Volume control
 */

const TaskbarManager = {
    taskbarButtons: new Map(),
    quickLaunchItems: [],
    trayItems: [],
    clockInterval: null,
    windowGroups: new Map(),

    init() {
        this.createTaskbar();
        this.initClock();
        this.initQuickLaunch();
        this.initSystemTray();
        this.initVolumeControl();
        this.setupEventListeners();
    },

    createTaskbar() {
        const taskbar = document.createElement('div');
        taskbar.className = 'taskbar';
        taskbar.innerHTML = `
            <div class="start-button">
                <img src="/images/win95/start.png" alt="Start">
                <span>Start</span>
            </div>
            <div class="quick-launch"></div>
            <div class="taskbar-buttons"></div>
            <div class="system-tray">
                <div class="volume-control">
                    <img src="/images/win95/volume.png" alt="Volume">
                    <div class="volume-slider">
                        <input type="range" min="0" max="100" value="50" orient="vertical">
                    </div>
                </div>
                <div class="system-clock"></div>
            </div>
        `;
        document.body.appendChild(taskbar);
    },

    initClock() {
        const updateClock = () => {
            const clock = document.querySelector('.system-clock');
            if (clock) {
                const now = new Date();
                const hours = now.getHours().toString().padStart(2, '0');
                const minutes = now.getMinutes().toString().padStart(2, '0');
                clock.textContent = `${hours}:${minutes}`;
            }
        };

        updateClock();
        this.clockInterval = setInterval(updateClock, 1000);
    },

    initQuickLaunch() {
        const quickLaunch = document.querySelector('.quick-launch');
        const defaultItems = [
            { icon: 'ie.png', title: 'Internet Explorer', action: 'launch-ie' },
            { icon: 'notepad.png', title: 'Notepad', action: 'launch-notepad' },
            { icon: 'explorer.png', title: 'Explorer', action: 'launch-explorer' }
        ];

        defaultItems.forEach(item => {
            const button = document.createElement('div');
            button.className = 'quick-launch-item';
            button.innerHTML = `<img src="/images/win95/${item.icon}" alt="${item.title}" title="${item.title}">`;
            button.addEventListener('click', () => this.handleQuickLaunch(item.action));
            quickLaunch.appendChild(button);
            this.quickLaunchItems.push(button);
        });
    },

    initSystemTray() {
        const tray = document.querySelector('.system-tray');
        const defaultItems = [
            { icon: 'network.png', title: 'Network' },
            { icon: 'power.png', title: 'Power Management' }
        ];

        defaultItems.forEach(item => {
            const trayIcon = document.createElement('div');
            trayIcon.className = 'system-tray-item';
            trayIcon.innerHTML = `<img src="/images/win95/${item.icon}" alt="${item.title}" title="${item.title}">`;
            tray.insertBefore(trayIcon, tray.firstChild);
            this.trayItems.push(trayIcon);
        });
    },

    initVolumeControl() {
        const volumeControl = document.querySelector('.volume-control');
        const volumeSlider = volumeControl.querySelector('input[type="range"]');

        volumeSlider.addEventListener('input', (e) => {
            const volume = e.target.value;
            this.setSystemVolume(volume);
        });

        // Prevent slider from closing when interacting
        volumeSlider.addEventListener('click', (e) => e.stopPropagation());
    },

    setSystemVolume(volume) {
        // Update system volume (placeholder for actual implementation)
        console.log('Setting system volume to:', volume);
    },

    addTaskbarButton(windowId, title, icon) {
        const buttonsContainer = document.querySelector('.taskbar-buttons');
        const button = document.createElement('div');
        button.className = 'taskbar-button';
        button.innerHTML = `
            <img src="/images/win95/${icon}" alt="${title}">
            <span>${title}</span>
        `;

        button.addEventListener('click', () => this.handleTaskbarButtonClick(windowId));
        buttonsContainer.appendChild(button);
        this.taskbarButtons.set(windowId, button);

        // Check if this window should be part of a group
        this.updateWindowGroups(windowId, title);
    },

    removeTaskbarButton(windowId) {
        const button = this.taskbarButtons.get(windowId);
        if (button) {
            button.remove();
            this.taskbarButtons.delete(windowId);
            this.updateWindowGroups(windowId, null, true);
        }
    },

    updateWindowGroups(windowId, title, removing = false) {
        if (removing) {
            // Remove window from its group
            for (const [groupTitle, group] of this.windowGroups) {
                if (group.has(windowId)) {
                    group.delete(windowId);
                    if (group.size <= 1) {
                        this.windowGroups.delete(groupTitle);
                    }
                    this.updateGroupVisuals(groupTitle);
                }
            }
            return;
        }

        // Group windows with similar titles
        const baseTitle = title.replace(/\s+\(\d+\)$/, '');
        let group = this.windowGroups.get(baseTitle);

        if (!group) {
            group = new Set();
            this.windowGroups.set(baseTitle, group);
        }

        group.add(windowId);
        this.updateGroupVisuals(baseTitle);
    },

    updateGroupVisuals(groupTitle) {
        const group = this.windowGroups.get(groupTitle);
        if (!group || group.size <= 1) {
            // Remove group styling if exists
            for (const windowId of group || []) {
                const button = this.taskbarButtons.get(windowId);
                if (button) {
                    button.classList.remove('grouped');
                    const indicator = button.querySelector('.group-indicator');
                    if (indicator) indicator.remove();
                }
            }
            return;
        }

        // Add group styling
        for (const windowId of group) {
            const button = this.taskbarButtons.get(windowId);
            if (button) {
                button.classList.add('grouped');
                if (!button.querySelector('.group-indicator')) {
                    const indicator = document.createElement('div');
                    indicator.className = 'group-indicator';
                    button.appendChild(indicator);
                }
            }
        }
    },

    handleTaskbarButtonClick(windowId) {
        // Implement window activation/minimization logic
        const button = this.taskbarButtons.get(windowId);
        if (button) {
            const isActive = button.classList.contains('active');
            this.setActiveWindow(windowId, !isActive);
        }
    },

    handleQuickLaunch(action) {
        // Implement quick launch actions
        console.log('Quick launch action:', action);
        // Dispatch event for window manager to handle
        const event = new CustomEvent('quickLaunch', { detail: { action } });
        window.dispatchEvent(event);
    },

    setActiveWindow(windowId, active) {
        this.taskbarButtons.forEach((button, id) => {
            button.classList.toggle('active', id === windowId && active);
        });

        // Dispatch event for window manager to handle
        const event = new CustomEvent('windowActivate', {
            detail: { windowId, active }
        });
        window.dispatchEvent(event);
    },

    setupEventListeners() {
        // Listen for window events
        window.addEventListener('windowCreated', (e) => {
            const { windowId, title, icon } = e.detail;
            this.addTaskbarButton(windowId, title, icon);
        });

        window.addEventListener('windowClosed', (e) => {
            this.removeTaskbarButton(e.detail.windowId);
        });

        window.addEventListener('windowActivated', (e) => {
            this.setActiveWindow(e.detail.windowId, true);
        });

        // Clean up on page unload
        window.addEventListener('unload', () => {
            if (this.clockInterval) {
                clearInterval(this.clockInterval);
            }
        });
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    TaskbarManager.init();
});

// Export for use in other modules
export default TaskbarManager;