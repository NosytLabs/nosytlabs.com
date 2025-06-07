/**
 * Bundle Index
 * Auto-generated bundle loader
 */

const BUNDLES = {
  core: '/scripts/bundles/core-bundle.js',
  nosytos95Core: '/scripts/bundles/nosytos95-core.js',
  nosytos95Apps: '/scripts/bundles/nosytos95-apps.js',
  games: '/scripts/bundles/games-bundle.js',
  utils: '/scripts/bundles/utils-bundle.js'
};

class BundleLoader {
  static async loadBundle(bundleName) {
    if (!BUNDLES[bundleName]) {
      throw new Error(`Bundle '${bundleName}' not found`);
    }
    
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = BUNDLES[bundleName];
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
  }
  
  static async loadBundles(bundleNames) {
    return Promise.all(bundleNames.map(name => this.loadBundle(name)));
  }
}

// Export for use
window.BundleLoader = BundleLoader;
export { BundleLoader, BUNDLES };
