/**
 * Analytics Manager for Nosyt Labs
 * Handles Google Analytics and other tracking features
 */

// Google Analytics Configuration
function initGoogleAnalytics() {
  // Google Analytics 4 implementation
  const gaScript = document.createElement('script');
  gaScript.async = true;
  gaScript.src = 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX'; // Replace with your actual GA4 ID
  document.head.appendChild(gaScript);

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX'); // Replace with your actual GA4 ID
}

// Instant Page Implementation
function initInstantPage() {
  const instantPageScript = document.createElement('script');
  instantPageScript.src = 'https://instant.page/5.2.0';
  instantPageScript.type = 'module';
  instantPageScript.integrity = 'sha384-jnZyxPjiipYXnSU0ygqeac2q7CVYMbh84q0uHVRRxEtvFPiQYbXWUorga2aqZJ0z';
  document.body.appendChild(instantPageScript);
}

// Event Tracking
function trackEvent(category, action, label = null, value = null) {
  if (window.gtag) {
    const eventParams = {
      event_category: category,
      event_label: label,
      value: value
    };
    gtag('event', action, eventParams);
  }
}

// Page View Tracking
function trackPageView(pagePath) {
  if (window.gtag) {
    gtag('config', 'G-XXXXXXXXXX', {
      page_path: pagePath
    });
  }
}

// User Engagement Tracking
function trackEngagement() {
  // Track scroll depth
  let scrollDepthTriggered = {
    25: false,
    50: false,
    75: false,
    100: false
  };

  window.addEventListener('scroll', () => {
    const scrollPosition = window.scrollY;
    const totalHeight = document.body.scrollHeight - window.innerHeight;
    const scrollPercentage = (scrollPosition / totalHeight) * 100;

    Object.keys(scrollDepthTriggered).forEach(depth => {
      if (scrollPercentage >= parseInt(depth) && !scrollDepthTriggered[depth]) {
        scrollDepthTriggered[depth] = true;
        trackEvent('Scroll Depth', 'Scroll', `${depth}%`);
      }
    });
  });

  // Track time on page
  const startTime = new Date();
  window.addEventListener('beforeunload', () => {
    const endTime = new Date();
    const timeSpent = Math.round((endTime - startTime) / 1000);
    trackEvent('Engagement', 'Time on Page', 'Seconds', timeSpent);
  });
}

// Initialize all tracking features
function monitorPerformance() {
  window.addEventListener('load', () => {
    setTimeout(() => {
      const perf = window.performance;
      if (!perf || !perf.timing) return;

      const timing = perf.timing;
      const loadTime = timing.loadEventEnd - timing.navigationStart;
      const threshold = 3000; // 3 seconds threshold

      if (loadTime > threshold) {
        console.warn(`[PerfAlert] Slow load time detected: ${loadTime}ms`);
        trackEvent('Performance', 'SlowLoad', null, loadTime);
      }
    }, 0);
  });

  // Detect UI freezes using requestAnimationFrame
  let lastTime = performance.now();
  function checkJank(now) {
    const delta = now - lastTime;
    if (delta > 200) { // 200ms frame delay threshold
      console.warn(`[PerfAlert] UI jank detected: ${delta}ms`);
      trackEvent('Performance', 'UIJank', null, delta);
    }
    lastTime = now;
    requestAnimationFrame(checkJank);
  }
  requestAnimationFrame(checkJank);
  monitorPerformance();
}

function initAnalytics() {
  initGoogleAnalytics();
  initInstantPage();
  trackEngagement();

  // Track initial page view
  trackPageView(window.location.pathname);

  // Track navigation between pages for SPA
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
