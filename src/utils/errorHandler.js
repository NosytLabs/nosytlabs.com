/**
 * Centralized Error Handling Utility
 * Provides consistent error handling and reporting across the application
 */

class ErrorHandler {
  constructor(options = {}) {
    this.options = {
      reportToServer: true,
      showUserMessages: true,
      logToConsole: process.env.NODE_ENV !== 'production',
      ...options
    };
    
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    
    // Global error handlers
    window.addEventListener('error', this.handleGlobalError.bind(this));
    window.addEventListener('unhandledrejection', this.handlePromiseRejection.bind(this));
    
    this.initialized = true;
  }

  handleGlobalError(event) {
    const error = event.error || event;
    this.processError(error, 'global');
    return false; // Prevent default browser error handling
  }

  handlePromiseRejection(event) {
    const error = event.reason || event;
    this.processError(error, 'promise');
  }

  processError(error, source) {
    const errorData = this.normalizeError(error);
    
    if (this.options.logToConsole) {
      console.error(`[${source}]`, errorData);
    }

    if (this.options.reportToServer) {
      this.reportToServer(errorData);
    }

    if (this.options.showUserMessages) {
      this.showUserMessage(errorData);
    }
  }

  normalizeError(error) {
    return {
      name: error.name || 'Error',
      message: error.message || String(error),
      stack: error.stack,
      timestamp: new Date().toISOString(),
      context: {
        url: window.location.href,
        userAgent: navigator.userAgent
      }
    };
  }

  reportToServer(errorData) {
    if (!navigator.onLine) return;
    
    fetch('/api/error-log', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(errorData)
    }).catch(() => {
      // Silently fail if error reporting fails
    });
  }

  showUserMessage(errorData) {
    const errorMessage = document.getElementById('error-message') || 
                         document.createElement('div');
    
    errorMessage.id = 'error-message';
    errorMessage.className = 'error-message';
    errorMessage.textContent = 'An unexpected error occurred. Please try again.';
    
    if (!document.getElementById('error-message')) {
      document.body.appendChild(errorMessage);
      setTimeout(() => {
        errorMessage.remove();
      }, 5000);
    }
  }

  // API for manual error handling
  captureError(error, context = {}) {
    const errorData = this.normalizeError(error);
    errorData.context = { ...errorData.context, ...context };
    this.processError(errorData, 'manual');
  }

  captureMessage(message, level = 'info', context = {}) {
    this.processError({
      name: 'UserMessage',
      message,
      stack: new Error().stack,
      level,
      context
    }, 'message');
  }
}

// Singleton instance
const errorHandler = new ErrorHandler();
errorHandler.init();

export default errorHandler;