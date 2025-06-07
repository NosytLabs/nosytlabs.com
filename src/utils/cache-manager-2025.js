/**
 * Cache Manager 2025 for NosytLabs
 * Comprehensive cache management for browsers, service workers, and application caches
 * Features: Browser cache clearing, service worker updates, localStorage cleanup, and performance optimization
 */

class CacheManager2025 {
  constructor() {
    this.cacheNames = [
      'nosytlabs-static-v1',
      'nosytlabs-dynamic-v1',
      'nosytlabs-images-v1',
      'nosytlabs-api-v1'
    ];
    
    this.storageKeys = [
      'nosytlabs-preferences',
      'nosytlabs-theme',
      'nosytlabs-user-data',
      'nosytlabs-form-data'
    ];
    
    this.results = {
      cachesCleared: [],
      storageCleared: [],
      serviceWorkerUpdated: false,
      errors: [],
      totalSizeCleared: 0
    };
  }

  /**
   * Clear all caches and storage
   */
  async clearAll() {
    console.log('🧹 Starting comprehensive cache clearing...');
    
    try {
      await this.clearServiceWorkerCaches();
      await this.clearBrowserCaches();
      await this.clearLocalStorage();
      await this.clearSessionStorage();
      await this.clearIndexedDB();
      await this.updateServiceWorker();
      await this.clearCookies();
      
      this.generateReport();
      return this.results;
    } catch (error) {
      console.error('❌ Cache clearing failed:', error);
      this.results.errors.push(error.message);
      return this.results;
    }
  }

  /**
   * Clear service worker caches
   */
  async clearServiceWorkerCaches() {
    if ('caches' in window) {
      try {
        const cacheNames = await caches.keys();
        console.log(`📦 Found ${cacheNames.length} cache(s) to clear`);
        
        for (const cacheName of cacheNames) {
          const deleted = await caches.delete(cacheName);
          if (deleted) {
            console.log(`   ✅ Cleared cache: ${cacheName}`);
            this.results.cachesCleared.push(cacheName);
          }
        }
        
        // Clear specific NosytLabs caches
        for (const cacheName of this.cacheNames) {
          const deleted = await caches.delete(cacheName);
          if (deleted) {
            console.log(`   ✅ Cleared NosytLabs cache: ${cacheName}`);
            this.results.cachesCleared.push(cacheName);
          }
        }
      } catch (error) {
        console.error('❌ Service worker cache clearing failed:', error);
        this.results.errors.push(`Service worker cache error: ${error.message}`);
      }
    } else {
      console.log('   ⚠️  Service worker caches not supported');
    }
  }

  /**
   * Clear browser caches using available APIs
   */
  async clearBrowserCaches() {
    console.log('🌐 Clearing browser caches...');
    
    // Clear HTTP cache (if supported)
    if ('serviceWorker' in navigator && navigator.serviceWorker.controller) {
      try {
        navigator.serviceWorker.controller.postMessage({
          type: 'CLEAR_CACHE',
          timestamp: Date.now()
        });
        console.log('   ✅ Sent cache clear message to service worker');
      } catch (error) {
        this.results.errors.push(`Service worker message error: ${error.message}`);
      }
    }

    // Force reload to clear memory cache
    if (window.location.reload) {
      console.log('   ✅ Prepared for hard reload to clear memory cache');
    }
  }

  /**
   * Clear localStorage
   */
  async clearLocalStorage() {
    console.log('💾 Clearing localStorage...');
    
    try {
      const itemsCleared = [];
      
      // Clear specific NosytLabs items
      for (const key of this.storageKeys) {
        if (localStorage.getItem(key)) {
          localStorage.removeItem(key);
          itemsCleared.push(key);
          console.log(`   ✅ Cleared localStorage: ${key}`);
        }
      }
      
      // Clear all items starting with 'nosytlabs-'
      const allKeys = Object.keys(localStorage);
      for (const key of allKeys) {
        if (key.startsWith('nosytlabs-') || key.startsWith('nl-')) {
          localStorage.removeItem(key);
          itemsCleared.push(key);
          console.log(`   ✅ Cleared localStorage: ${key}`);
        }
      }
      
      this.results.storageCleared.push(...itemsCleared);
      
      if (itemsCleared.length === 0) {
        console.log('   ℹ️  No localStorage items to clear');
      }
    } catch (error) {
      console.error('❌ localStorage clearing failed:', error);
      this.results.errors.push(`localStorage error: ${error.message}`);
    }
  }

  /**
   * Clear sessionStorage
   */
  async clearSessionStorage() {
    console.log('🔄 Clearing sessionStorage...');
    
    try {
      const itemsCleared = [];
      const allKeys = Object.keys(sessionStorage);
      
      for (const key of allKeys) {
        if (key.startsWith('nosytlabs-') || key.startsWith('nl-')) {
          sessionStorage.removeItem(key);
          itemsCleared.push(key);
          console.log(`   ✅ Cleared sessionStorage: ${key}`);
        }
      }
      
      this.results.storageCleared.push(...itemsCleared);
      
      if (itemsCleared.length === 0) {
        console.log('   ℹ️  No sessionStorage items to clear');
      }
    } catch (error) {
      console.error('❌ sessionStorage clearing failed:', error);
      this.results.errors.push(`sessionStorage error: ${error.message}`);
    }
  }

  /**
   * Clear IndexedDB
   */
  async clearIndexedDB() {
    console.log('🗄️  Clearing IndexedDB...');
    
    if ('indexedDB' in window) {
      try {
        // Get all databases (if supported)
        if (indexedDB.databases) {
          const databases = await indexedDB.databases();
          
          for (const db of databases) {
            if (db.name && (db.name.includes('nosytlabs') || db.name.includes('nl-'))) {
              const deleteRequest = indexedDB.deleteDatabase(db.name);
              
              await new Promise((resolve, reject) => {
                deleteRequest.onsuccess = () => {
                  console.log(`   ✅ Cleared IndexedDB: ${db.name}`);
                  this.results.storageCleared.push(`IndexedDB: ${db.name}`);
                  resolve();
                };
                deleteRequest.onerror = () => reject(deleteRequest.error);
              });
            }
          }
        } else {
          console.log('   ⚠️  IndexedDB.databases() not supported');
        }
      } catch (error) {
        console.error('❌ IndexedDB clearing failed:', error);
        this.results.errors.push(`IndexedDB error: ${error.message}`);
      }
    } else {
      console.log('   ⚠️  IndexedDB not supported');
    }
  }

  /**
   * Update service worker
   */
  async updateServiceWorker() {
    console.log('🔧 Updating service worker...');
    
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        
        if (registration) {
          // Force update
          await registration.update();
          console.log('   ✅ Service worker update initiated');
          
          // Unregister and re-register for complete refresh
          await registration.unregister();
          console.log('   ✅ Service worker unregistered');
          
          // Re-register
          const newRegistration = await navigator.serviceWorker.register('/sw.js');
          console.log('   ✅ Service worker re-registered');
          
          this.results.serviceWorkerUpdated = true;
        } else {
          console.log('   ℹ️  No service worker registration found');
        }
      } catch (error) {
        console.error('❌ Service worker update failed:', error);
        this.results.errors.push(`Service worker error: ${error.message}`);
      }
    } else {
      console.log('   ⚠️  Service workers not supported');
    }
  }

  /**
   * Clear cookies (limited by same-origin policy)
   */
  async clearCookies() {
    console.log('🍪 Clearing cookies...');
    
    try {
      const cookies = document.cookie.split(';');
      let clearedCount = 0;
      
      for (const cookie of cookies) {
        const eqPos = cookie.indexOf('=');
        const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
        
        if (name.startsWith('nosytlabs-') || name.startsWith('nl-')) {
          // Clear cookie by setting expiration to past date
          document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
          console.log(`   ✅ Cleared cookie: ${name}`);
          clearedCount++;
        }
      }
      
      if (clearedCount === 0) {
        console.log('   ℹ️  No NosytLabs cookies to clear');
      }
      
      this.results.storageCleared.push(`${clearedCount} cookies`);
    } catch (error) {
      console.error('❌ Cookie clearing failed:', error);
      this.results.errors.push(`Cookie error: ${error.message}`);
    }
  }

  /**
   * Generate and display report
   */
  generateReport() {
    console.log('\n📊 Cache Clearing Report');
    console.log('========================');
    
    console.log(`\n✅ Caches Cleared: ${this.results.cachesCleared.length}`);
    this.results.cachesCleared.forEach(cache => console.log(`   - ${cache}`));
    
    console.log(`\n✅ Storage Items Cleared: ${this.results.storageCleared.length}`);
    this.results.storageCleared.forEach(item => console.log(`   - ${item}`));
    
    console.log(`\n✅ Service Worker Updated: ${this.results.serviceWorkerUpdated ? 'Yes' : 'No'}`);
    
    if (this.results.errors.length > 0) {
      console.log(`\n⚠️  Errors: ${this.results.errors.length}`);
      this.results.errors.forEach(error => console.log(`   - ${error}`));
    }
    
    console.log('\n🎉 Cache clearing completed!');
    console.log('💡 Tip: Perform a hard refresh (Ctrl+F5 or Cmd+Shift+R) to ensure all caches are cleared.');
  }

  /**
   * Quick clear for development
   */
  async quickClear() {
    console.log('⚡ Quick cache clear...');
    
    try {
      // Clear only essential caches
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        for (const cacheName of cacheNames) {
          if (cacheName.includes('nosytlabs')) {
            await caches.delete(cacheName);
            console.log(`   ✅ Cleared: ${cacheName}`);
          }
        }
      }
      
      // Clear localStorage
      const keys = Object.keys(localStorage);
      for (const key of keys) {
        if (key.startsWith('nosytlabs-')) {
          localStorage.removeItem(key);
        }
      }
      
      console.log('   ✅ Quick clear completed');
      return true;
    } catch (error) {
      console.error('❌ Quick clear failed:', error);
      return false;
    }
  }
}

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CacheManager2025;
}

// Global instance for browser use
if (typeof window !== 'undefined') {
  window.CacheManager2025 = CacheManager2025;
  
  // Add global functions for easy access
  window.clearAllCaches = async () => {
    const manager = new CacheManager2025();
    return await manager.clearAll();
  };
  
  window.quickClearCaches = async () => {
    const manager = new CacheManager2025();
    return await manager.quickClear();
  };
  
  // Add keyboard shortcut for development
  document.addEventListener('keydown', (event) => {
    // Ctrl+Shift+Alt+C to clear caches
    if (event.ctrlKey && event.shiftKey && event.altKey && event.code === 'KeyC') {
      event.preventDefault();
      console.log('🔥 Keyboard shortcut triggered: Clearing caches...');
      window.quickClearCaches();
    }
  });
}
