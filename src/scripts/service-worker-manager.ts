/**
 * Service Worker Manager
 * Handles service worker registration and updates with proper error handling
 */

export class ServiceWorkerManager {
  private registration: ServiceWorkerRegistration | null;

  constructor() {
    this.registration = null;
    this.init();
  }

  private async init(): Promise<void> {
    if (!('serviceWorker' in navigator)) {
      console.log('Service Worker not supported');
      return;
    }

    // Wait for page load to avoid interfering with initial page performance
    if (document.readyState === 'loading') {
      window.addEventListener('load', () => this.register());
    } else {
      this.register();
    }
  }

  private async register(): Promise<void> {
    try {
      this.registration = await navigator.serviceWorker.register('/sw.js', {
        scope: '/'
      });

      console.log('SW registered:', this.registration);

      // Set up update handling
      this.setupUpdateHandling();

      // Check for updates immediately
      this.checkForUpdates();

      // Check for updates periodically (every 30 minutes)
      setInterval(() => this.checkForUpdates(), 30 * 60 * 1000);

    } catch (error) {
      console.error('SW registration failed:', error);
      
      // Report to analytics if available
      if (typeof window !== 'undefined' && (window as any).gtag) {
        (window as any).gtag('event', 'exception', {
          description: 'Service Worker registration failed',
          fatal: false
        });
      }
    }
  }

  private setupUpdateHandling(): void {
    if (!this.registration) return;

    this.registration.addEventListener('updatefound', () => {
      const newWorker = this.registration!.installing;
      
      if (newWorker) {
        newWorker.addEventListener('statechange', () => {
          if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
            // New content available
            this.handleUpdate();
          }
        });
      }
    });

    // Listen for messages from the service worker
    navigator.serviceWorker.addEventListener('message', (event) => {
      if (event.data && event.data.type === 'SKIP_WAITING') {
        this.handleSkipWaiting();
      }
    });
  }

  private handleUpdate(): void {
    // Announce to screen readers
    if ((window as any).announceToScreenReader) {
      (window as any).announceToScreenReader('New content available. Refresh to update.');
    }

    // Show update notification (could be enhanced with a toast notification)
    console.log('New content available. Please refresh the page.');

    // Optionally show a user-friendly update prompt
    this.showUpdatePrompt();
  }

  private showUpdatePrompt(): void {
    // Create a simple update notification
    const notification = document.createElement('div');
    notification.className = 'update-notification';
    notification.innerHTML = `
      <div class="update-content">
        <p>New content is available!</p>
        <button id="update-btn" class="update-button">Update Now</button>
        <button id="dismiss-btn" class="dismiss-button">Later</button>
      </div>
    `;

    // Style the notification
    notification.style.cssText = `
      position: fixed;
      top: 20px;
      right: 20px;
      background: #7c3aed;
      color: white;
      padding: 16px;
      border-radius: 8px;
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
      z-index: 10000;
      max-width: 300px;
      font-family: inherit;
    `;

    document.body.appendChild(notification);

    // Handle update button click
    const updateBtn = notification.querySelector('#update-btn');
    const dismissBtn = notification.querySelector('#dismiss-btn');

    updateBtn?.addEventListener('click', () => {
      this.applyUpdate();
      notification.remove();
    });

    dismissBtn?.addEventListener('click', () => {
      notification.remove();
    });

    // Auto-dismiss after 10 seconds
    setTimeout(() => {
      if (notification.parentNode) {
        notification.remove();
      }
    }, 10000);
  }

  private handleSkipWaiting(): void {
    // Reload the page to activate the new service worker
    window.location.reload();
  }

  private async checkForUpdates(): Promise<void> {
    if (this.registration) {
      try {
        await this.registration.update();
      } catch (error) {
        console.warn('Failed to check for SW updates:', error);
      }
    }
  }

  private async applyUpdate(): Promise<void> {
    if (this.registration && this.registration.waiting) {
      // Tell the waiting service worker to skip waiting
      this.registration.waiting.postMessage({ type: 'SKIP_WAITING' });
    }
  }

  // Public methods for external use
  public async unregister(): Promise<boolean> {
    if (this.registration) {
      return await this.registration.unregister();
    }
    return false;
  }

  public getRegistration(): ServiceWorkerRegistration | null {
    return this.registration;
  }

  public async getActiveWorker(): Promise<ServiceWorker | null> {
    if (this.registration) {
      return this.registration.active;
    }
    return null;
  }
}

// Initialize service worker manager
let serviceWorkerManager: ServiceWorkerManager;

// Only initialize if service workers are supported and enabled
const shouldEnableServiceWorker = true; // Could be controlled by config

if (shouldEnableServiceWorker) {
  serviceWorkerManager = new ServiceWorkerManager();
}

export { serviceWorkerManager };
