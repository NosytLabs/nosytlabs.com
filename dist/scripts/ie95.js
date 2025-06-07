class IE95Browser {
    constructor() {
        this.history = [];
        this.currentIndex = -1;
        this.isLoading = false;
        
        // Elements
        this.frame = document.getElementById('browser-frame');
        this.urlInput = document.getElementById('url-input');
        this.statusText = document.querySelector('.status-text');
        this.backBtn = document.querySelector('.toolbar-button.back');
        this.forwardBtn = document.querySelector('.toolbar-button.forward');
        this.stopBtn = document.querySelector('.toolbar-button.stop');
        this.refreshBtn = document.querySelector('.toolbar-button.refresh');
        this.homeBtn = document.querySelector('.toolbar-button.home');
        this.goBtn = document.querySelector('.go-button');
        this.window = document.querySelector('.ie-window');

        this.initializeEventListeners();
        this.setHomePage();
    }

    initializeEventListeners() {
        // Navigation buttons
        this.backBtn.addEventListener('click', () => this.goBack());
        this.forwardBtn.addEventListener('click', () => this.goForward());
        this.stopBtn.addEventListener('click', () => this.stopLoading());
        this.refreshBtn.addEventListener('click', () => this.refresh());
        this.homeBtn.addEventListener('click', () => this.goHome());
        this.goBtn.addEventListener('click', () => this.navigate());

        // URL input
        this.urlInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.navigate();
            }
        });

        // Frame loading events
        this.frame.addEventListener('load', () => this.handleLoadComplete());
        
        // Window controls
        document.querySelector('[aria-label="Minimize"]').addEventListener('click', () => this.minimizeWindow());
        document.querySelector('[aria-label="Maximize"]').addEventListener('click', () => this.maximizeWindow());
        document.querySelector('[aria-label="Close"]').addEventListener('click', () => this.closeWindow());

        // Make window draggable by title bar
        this.initializeDraggable();
    }

    setHomePage() {
        this.homePage = 'ie95-home.html';
        this.navigate(this.homePage);
    }

    sanitizeUrl(url) {
        // List of allowed protocols
        const allowedProtocols = ['http:', 'https:', 'about:', 'file:'];
        
        try {
            const parsedUrl = new URL(url);
            if (!allowedProtocols.includes(parsedUrl.protocol)) {
                throw new Error('Protocol not supported');
            }
            return url;
        } catch (e) {
            if (url.startsWith('about:')) {
                return url;
            }
            if (!url.startsWith('http://') && !url.startsWith('https://')) {
                return 'http://' + url;
            }
            throw e;
        }
    }

    shouldShowSecurityWarning(url) {
        try {
            const parsedUrl = new URL(url);
            return parsedUrl.protocol === 'http:';
        } catch {
            return false;
        }
    }

    navigate(url = this.urlInput.value) {
        try {
            url = this.sanitizeUrl(url);
        } catch {
            this.showError('Invalid or unsupported URL');
            return;
        }

        if (this.shouldShowSecurityWarning(url)) {
            const proceed = window.confirm(
                'Warning: You are about to view an unencrypted page. The information you send to this site could be viewed by others.\n\nDo you want to proceed?'
            );
            if (!proceed) {
                return;
            }
        }

        this.startLoading();
        
        // Clear forward history when navigating to new page
        if (this.currentIndex < this.history.length - 1) {
            this.history = this.history.slice(0, this.currentIndex + 1);
        }
        
        this.history.push(url);
        this.currentIndex++;
        
        this.frame.src = url;
        this.urlInput.value = url;
        this.updateNavigationButtons();
    }

    handleLoadComplete() {
        this.stopLoading();
        this.updateNavigationButtons();
    }

    goBack() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.frame.src = this.history[this.currentIndex];
            this.urlInput.value = this.history[this.currentIndex];
            this.updateNavigationButtons();
        }
    }

    goForward() {
        if (this.currentIndex < this.history.length - 1) {
            this.currentIndex++;
            this.frame.src = this.history[this.currentIndex];
            this.urlInput.value = this.history[this.currentIndex];
            this.updateNavigationButtons();
        }
    }

    goHome() {
        this.navigate(this.homePage);
    }

    refresh() {
        this.frame.src = this.frame.src;
    }

    updateNavigationButtons() {
        this.backBtn.disabled = this.currentIndex <= 0;
        this.forwardBtn.disabled = this.currentIndex >= this.history.length - 1;
    }

    startLoading() {
        this.isLoading = true;
        this.statusText.textContent = 'Loading...';
        document.body.classList.add('loading');
        this.stopBtn.disabled = false;
    }

    stopLoading() {
        this.isLoading = false;
        this.statusText.textContent = 'Done';
        document.body.classList.remove('loading');
        this.stopBtn.disabled = true;
    }

    showError(message) {
        const errorHtml = `
            <html>
                <head>
                    <style>
                        body {
                            font-family: 'MS Sans Serif', Arial, sans-serif;
                            background-color: #c0c0c0;
                            padding: 20px;
                            margin: 0;
                        }
                        .error-container {
                            background: white;
                            border: 2px solid #808080;
                            border-top-color: #dfdfdf;
                            border-left-color: #dfdfdf;
                            padding: 20px;
                            margin: 20px;
                        }
                        h2 {
                            color: #000080;
                            margin-top: 0;
                        }
                        .error-icon {
                            float: left;
                            margin-right: 10px;
                            width: 32px;
                            height: 32px;
                            background: #ff0000;
                        }
                    </style>
                </head>
                <body>
                    <div class="error-container">
                        <div class="error-icon"></div>
                        <h2>Internet Explorer cannot display the webpage</h2>
                        <p>${message}</p>
                        <p>Try the following:</p>
                        <ul>
                            <li>Check the address for typing errors</li>
                            <li>Make sure your Internet connection is working</li>
                            <li>Click the Refresh button to try again</li>
                        </ul>
                    </div>
                </body>
            </html>`;
        this.frame.src = 'data:text/html,' + encodeURIComponent(errorHtml);
        this.stopLoading();
    }

    initializeDraggable() {
        const titleBar = document.querySelector('.title-bar');
        let isDragging = false;
        let currentX;
        let currentY;
        let initialX;
        let initialY;
        let xOffset = 0;
        let yOffset = 0;

        titleBar.addEventListener('mousedown', (e) => {
            initialX = e.clientX - xOffset;
            initialY = e.clientY - yOffset;
            
            if (e.target === titleBar) {
                isDragging = true;
            }
        });

        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                e.preventDefault();
                
                currentX = e.clientX - initialX;
                currentY = e.clientY - initialY;

                xOffset = currentX;
                yOffset = currentY;

                this.window.style.transform = 
                    `translate(${currentX}px, ${currentY}px)`;
            }
        });

        document.addEventListener('mouseup', () => {
            initialX = currentX;
            initialY = currentY;
            isDragging = false;
        });
    }

    minimizeWindow() {
        this.window.style.display = 'none';
    }

    maximizeWindow() {
        this.window.style.width = '100vw';
        this.window.style.height = '100vh';
        this.window.style.transform = 'none';
    }

    closeWindow() {
        this.window.remove();
    }
}

// Initialize the browser when the page loads
window.addEventListener('DOMContentLoaded', () => {
    new IE95Browser();
});