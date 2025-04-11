/**
 * Analytics Manager for Nosyt Labs
 * Handles Google Analytics and other tracking features
 */

// Google Analytics Configuration
function initGoogleAnalytics() {
  const gaId = import.meta.env.GA_TRACKING_ID;
  if (!gaId) {
    throw new Error('Google Analytics tracking ID not configured');
  }

  const gaScript = document.createElement('script');
  gaScript.async = true;
  gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
  document.head.appendChild(gaScript);

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag('js', new Date());
  gtag('config', gaId);
}

// Instant Page Implementation
function initInstantPage() {
  if (document.querySelector('script[src="https://instant.page/5.2.0"]')) {
    return; // Already loaded
  }

  const instantPageScript = document.createElement('script');
  instantPageScript.src = 'https://instant.page/5.2.0';
  instantPageScript.type = 'module';
  instantPageScript.integrity = 'sha384-jnZyxPjiipYXnSU0ygqeac2q7CVYMbh84q0uHVRRxEtvFPiQYbXWUorga2aqZJ0z';
  document.body.appendChild(instantPageScript);
}

// Event Tracking
function trackEvent(category, action, label = null, value = null) {
  try {
    if (window.gtag) {
      const eventParams = {
        event_category: category,
        event_label: label,
        value: value
      };
      gtag('event', action, eventParams);
    }
  } catch (e) {
    throw e;
  }
}

// Page View Tracking
function trackPageView(pagePath) {
  if (window.gtag) {
    gtag('config', import.meta.env.GA_TRACKING_ID, {
      page_path: pagePath
    });
  }
}

function initAnalytics() {
  initGoogleAnalytics();
  initInstantPage();
  trackPageView(window.location.pathname);

  document.addEventListener('astro:page-load', () => {
    trackPageView(window.location.pathname);
  });
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', initAnalytics);

// Export functions for use in other modules
export {
  trackEvent,
  trackPageView
};
