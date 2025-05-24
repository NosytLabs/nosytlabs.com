/**
 * Service Worker Registration Script
 * 
 * This script registers the service worker for the NosytLabs website.
 * It provides caching for assets, including sound files, to improve performance
 * and enable offline functionality.
 */

// Register service worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('ServiceWorker registration successful with scope: ', registration.scope);
        
        // Check for updates every hour
        setInterval(() => {
          registration.update()
            .then(() => console.log('Service worker updated'))
            .catch(error => console.error('Service worker update failed:', error));
        }, 3600000); // 1 hour
      })
      .catch(error => {
        console.error('ServiceWorker registration failed: ', error);
      });
  });
  
  // Listen for messages from the service worker
  navigator.serviceWorker.addEventListener('message', event => {
    if (event.data && event.data.type === 'CACHE_UPDATED') {
      console.log('New content is available; please refresh.');
      // You could show a notification to the user here
    }
  });
  
  // Clean up dynamic cache when the page is unloaded
  window.addEventListener('unload', () => {
    if (navigator.serviceWorker.controller) {
      navigator.serviceWorker.controller.postMessage({
        type: 'CLEAN_DYNAMIC_CACHE'
      });
    }
  });
}

// Function to preload sound files
function preloadSounds() {
  if (!navigator.serviceWorker.controller) {
    console.log('Service worker not yet active, skipping sound preloading');
    return;
  }
  
  // List of critical sound files to preload
  const criticalSounds = [
    '/sounds/win95/startup.mp3',
    '/sounds/win95/error.mp3',
    '/sounds/win95/notify.mp3',
    '/sounds/win95/click.mp3',
    '/sounds/duck-hunt/shot.mp3',
    '/sounds/duck-hunt/quack.mp3',
    '/audio/gun-shot.mp3',
    '/audio/quack.mp3'
  ];
  
  // Preload each sound file
  criticalSounds.forEach(soundUrl => {
    fetch(soundUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`Failed to preload sound: ${soundUrl}`);
        }
        console.log(`Preloaded sound: ${soundUrl}`);
      })
      .catch(error => {
        console.warn(`Error preloading sound ${soundUrl}:`, error);
      });
  });
}

// Preload sounds after service worker is active
navigator.serviceWorker.ready.then(preloadSounds);

// Check if the app is installed or in standalone mode
window.addEventListener('DOMContentLoaded', () => {
  if (window.matchMedia('(display-mode: standalone)').matches || 
      window.navigator.standalone === true) {
    console.log('App is running in standalone mode');
    // You could customize the UI for installed app here
  }
});
