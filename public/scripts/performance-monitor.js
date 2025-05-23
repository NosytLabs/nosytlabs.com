// Performance Monitoring Module
class PerformanceMonitor {
    constructor() {
        this.metrics = {
            navigation: {},
            resources: [],
            errors: [],
            fpMetrics: {},
            cacheStatus: {
                hits: 0,
                misses: 0
            }
        };
        
        this.init();
    }

    init() {
        // Initialize all monitoring systems
        this.observeNavigationTiming();
        this.observeResourceTiming();
        this.observeErrors();
        this.observePaintTiming();
        this.setupNetworkObserver();
        this.observeCacheStatus();
    }

    // Monitor navigation timing
    observeNavigationTiming() {
        window.addEventListener('load', () => {
            const navigation = performance.getEntriesByType('navigation')[0];
            this.metrics.navigation = {
                dnsLookup: navigation.domainLookupEnd - navigation.domainLookupStart,
                tcpConnection: navigation.connectEnd - navigation.connectStart,
                serverResponse: navigation.responseEnd - navigation.requestStart,
                domLoad: navigation.domContentLoadedEventEnd - navigation.domContentLoadedEventStart,
                windowLoad: navigation.loadEventEnd - navigation.loadEventStart,
                totalTime: navigation.loadEventEnd - navigation.startTime
            };
            
            this.reportMetrics('navigation', this.metrics.navigation);
        });
    }

    // Monitor resource timing
    observeResourceTiming() {
        const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach(entry => {
                const resourceMetric = {
                    name: entry.name,
                    type: entry.initiatorType,
                    size: entry.transferSize,
                    duration: entry.duration,
                    timestamp: Date.now()
                };
                
                this.metrics.resources.push(resourceMetric);
                this.reportMetrics('resource', resourceMetric);
            });
        });
        
        observer.observe({ entryTypes: ['resource'] });
    }

    // Monitor errors
    observeErrors() {
        window.addEventListener('error', (event) => {
            const errorMetric = {
                message: event.message,
                source: event.filename,
                line: event.lineno,
                column: event.colno,
                timestamp: Date.now()
            };
            
            this.metrics.errors.push(errorMetric);
            this.reportMetrics('error', errorMetric);
        });

        window.addEventListener('unhandledrejection', (event) => {
            const errorMetric = {
                message: event.reason,
                type: 'Promise',
                timestamp: Date.now()
            };
            
            this.metrics.errors.push(errorMetric);
            this.reportMetrics('error', errorMetric);
        });
    }

    // Monitor paint timing
    observePaintTiming() {
        const observer = new PerformanceObserver((list) => {
            list.getEntries().forEach(entry => {
                this.metrics.fpMetrics[entry.name] = entry.startTime;
                this.reportMetrics('paint', {
                    name: entry.name,
                    time: entry.startTime
                });
            });
        });
        
        observer.observe({ entryTypes: ['paint'] });
    }

    // Monitor network status
    setupNetworkObserver() {
        window.addEventListener('online', () => {
            this.reportMetrics('network', { status: 'online', timestamp: Date.now() });
        });

        window.addEventListener('offline', () => {
            this.reportMetrics('network', { status: 'offline', timestamp: Date.now() });
        });
    }

    // Monitor cache performance
    observeCacheStatus() {
        if ('caches' in window) {
            // Intercept cache access through service worker
            navigator.serviceWorker.addEventListener('message', (event) => {
                if (event.data.type === 'CACHE_HIT') {
                    this.metrics.cacheStatus.hits++;
                } else if (event.data.type === 'CACHE_MISS') {
                    this.metrics.cacheStatus.misses++;
                }
                
                this.reportMetrics('cache', this.metrics.cacheStatus);
            });
        }
    }

    // Report metrics to analytics
    reportMetrics(type, data) {
        // Add Windows 95 theme info
        data.theme = 'windows95';
        
        // Add to debug console if enabled
        if (localStorage.getItem('debugMode') === 'true') {
            console.debug(`[Performance ${type}]`, data);
        }

        // Send to analytics endpoint
        fetch('/api/analytics/performance', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                type,
                data,
                timestamp: Date.now(),
                page: window.location.pathname
            }),
            // Use keepalive to ensure data is sent even if page is unloading
            keepalive: true
        }).catch(error => {
            console.warn('Failed to report metrics:', error);
            // Store failed reports for retry
            this.storeFailedReport(type, data);
        });
    }

    // Store failed reports for retry
    storeFailedReport(type, data) {
        const failedReports = JSON.parse(localStorage.getItem('failedReports') || '[]');
        failedReports.push({
            type,
            data,
            timestamp: Date.now()
        });
        localStorage.setItem('failedReports', JSON.stringify(failedReports));
    }

    // Retry failed reports
    retryFailedReports() {
        const failedReports = JSON.parse(localStorage.getItem('failedReports') || '[]');
        if (failedReports.length === 0) return;

        failedReports.forEach(report => {
            this.reportMetrics(report.type, report.data);
        });

        localStorage.removeItem('failedReports');
    }

    // Get current performance summary
    getPerformanceSummary() {
        return {
            navigation: this.metrics.navigation,
            resourceCount: this.metrics.resources.length,
            errorCount: this.metrics.errors.length,
            cacheEfficiency: this.calculateCacheEfficiency(),
            paintTiming: this.metrics.fpMetrics,
            lastUpdate: Date.now()
        };
    }

    // Calculate cache efficiency
    calculateCacheEfficiency() {
        const total = this.metrics.cacheStatus.hits + this.metrics.cacheStatus.misses;
        if (total === 0) return 0;
        return (this.metrics.cacheStatus.hits / total) * 100;
    }

    // Clear metrics history
    clearMetrics() {
        this.metrics = {
            navigation: {},
            resources: [],
            errors: [],
            fpMetrics: {},
            cacheStatus: {
                hits: 0,
                misses: 0
            }
        };
    }
}

// Initialize and export instance
const performanceMonitor = new PerformanceMonitor();
export default performanceMonitor;

// Retry failed reports when coming online
window.addEventListener('online', () => {
    performanceMonitor.retryFailedReports();
});