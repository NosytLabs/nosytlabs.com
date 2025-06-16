/**
 * Deferred CSS Loader - Loads non-critical CSS after page load
 */
function loadDeferredCSS() {
  const deferredStyles = [
    '/styles/deferred.css',
    '/styles/features.css',
    '/styles/animations.css'
  ];
  
  deferredStyles.forEach(href => {
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.media = 'print';
    link.onload = function() { this.media = 'all'; };
    document.head.appendChild(link);
  });
}

// Load deferred CSS after critical rendering
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', loadDeferredCSS);
} else {
  loadDeferredCSS();
}