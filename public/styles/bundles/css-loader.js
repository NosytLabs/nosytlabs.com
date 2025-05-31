/**
 * CSS Bundle Loader
 * Auto-generated CSS bundle management
 */

const CSS_BUNDLES = {
  main: '/styles/bundles/main-styles.css',
  win95: '/styles/bundles/win95-styles.css',
  components: '/styles/bundles/component-styles.css',
  games: '/styles/bundles/game-styles.css',
  pages: '/styles/bundles/page-styles.css'
};

class CSSBundleLoader {
  static loadedBundles = new Set();
  
  static loadBundle(bundleName) {
    if (this.loadedBundles.has(bundleName)) {
      return Promise.resolve();
    }
    
    if (!CSS_BUNDLES[bundleName]) {
      return Promise.reject(new Error(`CSS bundle '${bundleName}' not found`));
    }
    
    return new Promise((resolve, reject) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = CSS_BUNDLES[bundleName];
      link.onload = () => {
        this.loadedBundles.add(bundleName);
        resolve();
      };
      link.onerror = reject;
      document.head.appendChild(link);
    });
  }
  
  static async loadBundles(bundleNames) {
    return Promise.all(bundleNames.map(name => this.loadBundle(name)));
  }
  
  static preloadBundle(bundleName) {
    if (!CSS_BUNDLES[bundleName]) return;
    
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'style';
    link.href = CSS_BUNDLES[bundleName];
    document.head.appendChild(link);
  }
}

// Export for use
window.CSSBundleLoader = CSSBundleLoader;
export { CSSBundleLoader, CSS_BUNDLES };
