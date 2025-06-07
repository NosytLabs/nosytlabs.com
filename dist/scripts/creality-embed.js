/**
 * Creality Embed Handler
 * Improves the functionality of Creality Cloud embeds with better error handling
 * and refresh capabilities.
 */

document.addEventListener('DOMContentLoaded', () => {
  // Find all Creality embed containers
  const embedContainers = document.querySelectorAll('.creality-embed-container');
  
  embedContainers.forEach(container => {
    const iframe = container.querySelector('iframe.creality-embed');
    const fallback = container.querySelector('.creality-fallback');
    const refreshButton = container.querySelector('.creality-refresh-button');
    
    if (!iframe || !fallback || !refreshButton) return;
    
    // Function to show fallback content
    function showFallback() {
      iframe.style.display = 'none';
      fallback.style.display = 'flex';
      refreshButton.style.display = 'flex';
    }
    
    // Function to attempt loading the iframe
    function attemptLoadIframe() {
      iframe.style.display = 'block';
      fallback.style.display = 'none';
      
      // Force reload the iframe
      const currentSrc = iframe.src;
      iframe.src = '';
      setTimeout(() => {
        iframe.src = currentSrc;
      }, 50);
    }
    
    // Add error handling for iframe
    iframe.addEventListener('error', showFallback);
    
    // Check if iframe is blocked by browser
    setTimeout(() => {
      try {
        // If we can't access the iframe content, it's likely blocked
        if (iframe.contentWindow === null || iframe.contentDocument === null) {
          showFallback();
        }
      } catch (e) {
        // Security error means iframe is blocked
        showFallback();
        console.error('Creality embed access error:', e);
      }
    }, 1000);
    
    // Add refresh button functionality
    refreshButton.addEventListener('click', attemptLoadIframe);
  });
});
