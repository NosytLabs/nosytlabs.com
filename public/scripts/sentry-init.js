// Manual Sentry Initialization for NosytLabs
// This ensures Sentry loads even if the Astro integration has issues

(function() {
  // Sentry configuration
  const SENTRY_DSN = "https://c132847d853499737873e2baeb344f66@o4509057271988224.ingest.us.sentry.io/4509483976753152";
  
  // Only initialize in production
  if (window.location.hostname === 'nosytlabs.com' || window.location.hostname === 'www.nosytlabs.com') {
    
    // Load Sentry SDK dynamically
    const script = document.createElement('script');
    script.src = 'https://browser.sentry-cdn.com/8.46.0/bundle.tracing.replay.min.js';
    script.crossOrigin = 'anonymous';
    script.onload = function() {
      // Initialize Sentry once loaded
      if (window.Sentry) {
        window.Sentry.init({
          dsn: SENTRY_DSN,
          environment: 'production',
          
          // Performance Monitoring
          tracesSampleRate: 0.1, // 10% of transactions
          
          // Session Replay
          replaysSessionSampleRate: 0.1, // 10% of sessions
          replaysOnErrorSampleRate: 1.0, // 100% of sessions with errors
          
          // Error Filtering
          beforeSend(event) {
            // Filter out common non-critical errors
            if (event.exception) {
              const error = event.exception.values[0];
              if (error && error.value) {
                // Skip CSS loading errors (we have fallbacks)
                if (error.value.includes('Loading CSS chunk') || 
                    error.value.includes('Loading chunk')) {
                  return null;
                }
                
                // Skip network errors for non-critical resources
                if (error.value.includes('Failed to fetch') && 
                    (error.value.includes('.css') || error.value.includes('.svg'))) {
                  return null;
                }
              }
            }
            return event;
          },
          
          // User Context
          initialScope: {
            tags: {
              component: 'nosytlabs-website',
              version: '1.0.0'
            },
            user: {
              id: 'anonymous',
              segment: 'website-visitor'
            }
          },
          
          // Additional Configuration
          autoSessionTracking: true,
          sendDefaultPii: false, // Don't send PII for privacy
          
          // Integration Configuration
          integrations: [
            new window.Sentry.BrowserTracing({
              // Performance monitoring for page loads and navigation
              routingInstrumentation: window.Sentry.routingInstrumentation,
            }),
            new window.Sentry.Replay({
              // Session replay for debugging
              maskAllText: true,
              blockAllMedia: true,
            }),
          ],
        });
        
        // Set user context
        window.Sentry.setUser({
          id: 'website-visitor',
          segment: 'public'
        });
        
        // Set additional context
        window.Sentry.setContext('website', {
          name: 'NosytLabs',
          version: '1.0.0',
          environment: 'production',
          url: window.location.href
        });
        
        console.log('✅ Sentry initialized successfully');
        
        // Global error handler for unhandled errors
        window.addEventListener('error', function(event) {
          window.Sentry.captureException(event.error);
        });
        
        // Global promise rejection handler
        window.addEventListener('unhandledrejection', function(event) {
          window.Sentry.captureException(event.reason);
        });
        
      } else {
        console.warn('⚠️ Sentry SDK failed to load');
      }
    };
    
    script.onerror = function() {
      console.warn('⚠️ Failed to load Sentry SDK');
    };
    
    // Add script to head
    document.head.appendChild(script);
    
  } else {
    console.log('🔧 Sentry not initialized (development environment)');
  }
})();

// Test function for development
window.testSentryError = function() {
  if (window.Sentry) {
    window.Sentry.captureException(new Error('Manual Sentry Test Error - Triggered via console'));
    console.log('🧪 Test error sent to Sentry');
  } else {
    console.warn('⚠️ Sentry not available for testing');
  }
};
