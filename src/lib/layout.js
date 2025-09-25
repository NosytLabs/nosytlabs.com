// Import animation system
import { initAnimations } from './animations.js';

// Page loading animation
document.addEventListener('DOMContentLoaded', () => {
    const loadingScreen = document.getElementById('loading-screen');
    const mainContent = document.getElementById('main-content');

    // Hide loading screen and show content after a short delay
    setTimeout(() => {
        if (loadingScreen && mainContent) {
            loadingScreen.style.opacity = '0';
            mainContent.style.opacity = '1';

            setTimeout(() => {
                loadingScreen.style.display = 'none';
                // Initialize all animations after content is visible
                initAnimations();
            }, 500);
        }
    }, 800);
});

// Smooth page transitions for navigation
function initPageTransitions() {
    const links = document.querySelectorAll('a[href^="/"]');
    const pageTransition = document.getElementById('page-transition');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');

            // Skip if it's the current page or external link
            if (href === window.location.pathname || !href.startsWith('/')) {
                return;
            }

            e.preventDefault();

            if (pageTransition) {
                pageTransition.style.pointerEvents = 'auto';
                pageTransition.style.opacity = '1';

                setTimeout(() => {
                    window.location.href = href;
                }, 300);
            }
        });
    });
}

// Initialize transitions when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPageTransitions);
} else {
  initPageTransitions();
}