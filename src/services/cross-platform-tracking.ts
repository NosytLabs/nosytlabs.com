import { analyticsIntegration } from './analytics-integration';
import { gdprCompliance } from './gdpr-compliance';

interface UserSession {
  id: string;
  userId?: string;
  deviceId: string;
  platform: 'web' | 'mobile' | 'desktop' | 'tablet';
  browser?: string;
  os: string;
  startTime: string;
  lastActivity: string;
  pageViews: number;
  events: UserEvent[];
  referrer?: string;
  utmSource?: string;
  utmMedium?: string;
  utmCampaign?: string;
  location?: {
    country?: string;
    region?: string;
    city?: string;
  };
}

interface UserEvent {
  id: string;
  type: 'page_view' | 'click' | 'form_submit' | 'purchase' | 'custom';
  timestamp: string;
  page: string;
  element?: string;
  value?: number;
  properties?: Record<string, any>;
}

interface UserJourney {
  userId: string;
  sessions: UserSession[];
  totalSessions: number;
  totalPageViews: number;
  totalEvents: number;
  firstVisit: string;
  lastVisit: string;
  devices: string[];
  platforms: string[];
  acquisitionChannel: {
    source: string;
    medium: string;
    campaign?: string;
  };
  conversionEvents: UserEvent[];
  lifetimeValue: number;
}

interface CrossPlatformConfig {
  enableUserIdTracking: boolean;
  enableDeviceFingerprinting: boolean;
  enableCrossDomainTracking: boolean;
  sessionTimeout: number; // minutes
  enableOfflineTracking: boolean;
  enableRealTimeSync: boolean;
  domains: string[];
  customDimensions: Record<string, string>;
}

class CrossPlatformTrackingService {
  private currentSession: UserSession | null = null;
  private userJourney: UserJourney | null = null;
  private config: CrossPlatformConfig;
  private isInitialized = false;
  private offlineQueue: UserEvent[] = [];
  private syncInterval: number | null = null;

  constructor() {
    this.config = {
      enableUserIdTracking: true,
      enableDeviceFingerprinting: true,
      enableCrossDomainTracking: true,
      sessionTimeout: 30,
      enableOfflineTracking: true,
      enableRealTimeSync: true,
      domains: [],
      customDimensions: {}
    };
  }

  /**
   * Initialize cross-platform tracking
   */
  async initialize(config?: Partial<CrossPlatformConfig>): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Update configuration
      if (config) {
        this.config = { ...this.config, ...config };
      }

      // Check GDPR consent
      if (!gdprCompliance.hasConsent('analytics')) {
        console.log('[Cross-Platform Tracking] Analytics consent not granted, skipping initialization');
        return;
      }

      // Initialize device fingerprinting
      if (this.config.enableDeviceFingerprinting) {
        await this.initializeDeviceFingerprinting();
      }

      // Load existing session or create new one
      await this.initializeSession();

      // Load user journey
      await this.loadUserJourney();

      // Set up cross-domain tracking
      if (this.config.enableCrossDomainTracking) {
        this.setupCrossDomainTracking();
      }

      // Set up offline tracking
      if (this.config.enableOfflineTracking) {
        this.setupOfflineTracking();
      }

      // Set up real-time sync
      if (this.config.enableRealTimeSync) {
        this.setupRealTimeSync();
      }

      // Set up session management
      this.setupSessionManagement();

      // Track initialization
      this.trackEvent({
        id: this.generateEventId(),
        type: 'custom',
        timestamp: new Date().toISOString(),
        page: window.location.pathname,
        properties: {
          event_name: 'cross_platform_tracking_initialized',
          platform: this.detectPlatform(),
          device_id: this.getDeviceId()
        }
      });

      this.isInitialized = true;
      console.log('[Cross-Platform Tracking] Service initialized successfully');

    } catch (error) {
      console.error('[Cross-Platform Tracking] Failed to initialize:', error);
      analyticsIntegration.trackError(error as Error, {
        level: 'error',
        tags: { source: 'cross-platform-tracking', action: 'initialize' }
      });
      throw error;
    }
  }

  /**
   * Set user ID for cross-platform tracking
   */
  setUserId(userId: string): void {
    if (!this.config.enableUserIdTracking) return;
    if (!gdprCompliance.hasConsent('analytics')) return;

    // Update current session
    if (this.currentSession) {
      this.currentSession.userId = userId;
      this.saveSession();
    }

    // Update user journey
    if (this.userJourney) {
      this.userJourney.userId = userId;
    } else {
      this.initializeUserJourney(userId);
    }

    // Track user identification
    this.trackEvent({
      id: this.generateEventId(),
      type: 'custom',
      timestamp: new Date().toISOString(),
      page: window.location.pathname,
      properties: {
        event_name: 'user_identified',
        user_id: userId
      }
    });

    console.log('[Cross-Platform Tracking] User ID set:', userId);
  }

  /**
   * Track page view
   */
  trackPageView(page?: string, title?: string): void {
    if (!this.isInitialized || !gdprCompliance.hasConsent('analytics')) return;

    const currentPage = page || window.location.pathname;
    const pageTitle = title || document.title;

    const event: UserEvent = {
      id: this.generateEventId(),
      type: 'page_view',
      timestamp: new Date().toISOString(),
      page: currentPage,
      properties: {
        title: pageTitle,
        url: window.location.href,
        referrer: document.referrer
      }
    };

    this.trackEvent(event);

    // Update session
    if (this.currentSession) {
      this.currentSession.pageViews++;
      this.currentSession.lastActivity = new Date().toISOString();
      this.saveSession();
    }

    // Send to analytics
    analyticsIntegration.trackEvent({
      name: 'page_view',
      category: 'Navigation',
      label: currentPage,
      customParameters: {
        page_title: pageTitle,
        session_id: this.currentSession?.id,
        device_id: this.getDeviceId()
      }
    });
  }

  /**
   * Track custom event
   */
  trackEvent(event: UserEvent): void {
    if (!this.isInitialized || !gdprCompliance.hasConsent('analytics')) return;

    // Add to current session
    if (this.currentSession) {
      this.currentSession.events.push(event);
      this.currentSession.lastActivity = new Date().toISOString();
      this.saveSession();
    }

    // Add to user journey
    if (this.userJourney) {
      this.userJourney.totalEvents++;
      this.userJourney.lastVisit = new Date().toISOString();
      
      // Check if it's a conversion event
      if (this.isConversionEvent(event)) {
        this.userJourney.conversionEvents.push(event);
        if (event.value) {
          this.userJourney.lifetimeValue += event.value;
        }
      }
      
      this.saveUserJourney();
    }

    // Handle offline tracking
    if (!navigator.onLine && this.config.enableOfflineTracking) {
      this.offlineQueue.push(event);
      return;
    }

    // Send to analytics integration
    if (event.type === 'custom' && event.properties?.event_name) {
      analyticsIntegration.trackEvent({
        name: event.properties.event_name,
        category: event.properties.category || 'Custom',
        label: event.properties.label,
        value: event.value,
        customParameters: {
          ...event.properties,
          session_id: this.currentSession?.id,
          device_id: this.getDeviceId(),
          platform: this.detectPlatform()
        }
      });
    }
  }

  /**
   * Track conversion event
   */
  trackConversion(eventName: string, value?: number, properties?: Record<string, any>): void {
    const event: UserEvent = {
      id: this.generateEventId(),
      type: 'custom',
      timestamp: new Date().toISOString(),
      page: window.location.pathname,
      value,
      properties: {
        event_name: eventName,
        is_conversion: true,
        ...properties
      }
    };

    this.trackEvent(event);
  }

  /**
   * Get current session
   */
  getCurrentSession(): UserSession | null {
    return this.currentSession;
  }

  /**
   * Get user journey
   */
  getUserJourney(): UserJourney | null {
    return this.userJourney;
  }

  /**
   * Get device ID
   */
  getDeviceId(): string {
    let deviceId = localStorage.getItem('cross_platform_device_id');
    
    if (!deviceId) {
      deviceId = this.generateDeviceId();
      localStorage.setItem('cross_platform_device_id', deviceId);
    }
    
    return deviceId;
  }

  /**
   * Sync data across platforms
   */
  async syncData(): Promise<void> {
    if (!gdprCompliance.hasConsent('analytics')) return;

    try {
      // In a real implementation, this would sync with a backend service
      console.log('[Cross-Platform Tracking] Syncing data across platforms');
      
      // Process offline queue
      if (this.offlineQueue.length > 0) {
        console.log(`[Cross-Platform Tracking] Processing ${this.offlineQueue.length} offline events`);
        
        for (const event of this.offlineQueue) {
          // Re-track offline events
          this.trackEvent(event);
        }
        
        this.offlineQueue = [];
      }
      
      // Update user journey with latest session data
      if (this.userJourney && this.currentSession) {
        const existingSessionIndex = this.userJourney.sessions.findIndex(
          s => s.id === this.currentSession!.id
        );
        
        if (existingSessionIndex >= 0) {
          this.userJourney.sessions[existingSessionIndex] = this.currentSession;
        } else {
          this.userJourney.sessions.push(this.currentSession);
        }
        
        this.saveUserJourney();
      }
      
    } catch (error) {
      console.error('[Cross-Platform Tracking] Failed to sync data:', error);
      analyticsIntegration.trackError(error as Error, {
        level: 'error',
        tags: { source: 'cross-platform-tracking', action: 'sync-data' }
      });
    }
  }

  /**
   * Initialize session
   */
  private async initializeSession(): Promise<void> {
    // Try to load existing session
    const existingSession = this.loadSession();
    
    if (existingSession && this.isSessionValid(existingSession)) {
      this.currentSession = existingSession;
      console.log('[Cross-Platform Tracking] Resumed existing session:', existingSession.id);
    } else {
      // Create new session
      this.currentSession = await this.createNewSession();
      console.log('[Cross-Platform Tracking] Created new session:', this.currentSession.id);
    }
    
    this.saveSession();
  }

  /**
   * Create new session
   */
  private async createNewSession(): Promise<UserSession> {
    const deviceId = this.getDeviceId();
    const platform = this.detectPlatform();
    const os = this.detectOS();
    const browser = this.detectBrowser();
    const utmParams = this.extractUTMParameters();
    
    return {
      id: this.generateSessionId(),
      deviceId,
      platform,
      browser,
      os,
      startTime: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      pageViews: 0,
      events: [],
      referrer: document.referrer,
      ...utmParams
    };
  }

  /**
   * Initialize user journey
   */
  private initializeUserJourney(userId: string): void {
    this.userJourney = {
      userId,
      sessions: this.currentSession ? [this.currentSession] : [],
      totalSessions: 1,
      totalPageViews: 0,
      totalEvents: 0,
      firstVisit: new Date().toISOString(),
      lastVisit: new Date().toISOString(),
      devices: [this.getDeviceId()],
      platforms: [this.detectPlatform()],
      acquisitionChannel: {
        source: this.extractUTMParameters().utmSource || 'direct',
        medium: this.extractUTMParameters().utmMedium || 'none',
        campaign: this.extractUTMParameters().utmCampaign
      },
      conversionEvents: [],
      lifetimeValue: 0
    };
    
    this.saveUserJourney();
  }

  /**
   * Load user journey
   */
  private async loadUserJourney(): Promise<void> {
    try {
      const stored = localStorage.getItem('cross_platform_user_journey');
      if (stored) {
        this.userJourney = JSON.parse(stored);
        
        // Update with current session if not already included
        if (this.currentSession && this.userJourney) {
          const sessionExists = this.userJourney.sessions.some(s => s.id === this.currentSession!.id);
          if (!sessionExists) {
            this.userJourney.sessions.push(this.currentSession);
            this.userJourney.totalSessions++;
          }
          
          // Update device and platform lists
          const deviceId = this.getDeviceId();
          const platform = this.detectPlatform();
          
          if (!this.userJourney.devices.includes(deviceId)) {
            this.userJourney.devices.push(deviceId);
          }
          
          if (!this.userJourney.platforms.includes(platform)) {
            this.userJourney.platforms.push(platform);
          }
          
          this.saveUserJourney();
        }
      }
    } catch (error) {
      console.warn('[Cross-Platform Tracking] Failed to load user journey:', error);
    }
  }

  /**
   * Initialize device fingerprinting
   */
  private async initializeDeviceFingerprinting(): Promise<void> {
    // Basic device fingerprinting (in production, use a more sophisticated approach)
    const fingerprint = {
      userAgent: navigator.userAgent,
      language: navigator.language,
      platform: navigator.platform,
      screenResolution: `${screen.width}x${screen.height}`,
      colorDepth: screen.colorDepth,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      cookieEnabled: navigator.cookieEnabled,
      doNotTrack: navigator.doNotTrack
    };
    
    const fingerprintHash = this.hashObject(fingerprint);
    localStorage.setItem('device_fingerprint', fingerprintHash);
    
    console.log('[Cross-Platform Tracking] Device fingerprint generated');
  }

  /**
   * Setup cross-domain tracking
   */
  private setupCrossDomainTracking(): void {
    // Listen for cross-domain messages
    window.addEventListener('message', (event) => {
      if (this.config.domains.includes(event.origin)) {
        this.handleCrossDomainMessage(event.data);
      }
    });
    
    // Set up link decoration for cross-domain tracking
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      const link = target.closest('a') as HTMLAnchorElement;
      
      if (link && this.shouldDecorateLink(link.href)) {
        this.decorateLink(link);
      }
    });
  }

  /**
   * Setup offline tracking
   */
  private setupOfflineTracking(): void {
    window.addEventListener('online', () => {
      console.log('[Cross-Platform Tracking] Back online, syncing data');
      this.syncData();
    });
    
    window.addEventListener('offline', () => {
      console.log('[Cross-Platform Tracking] Gone offline, queuing events');
    });
  }

  /**
   * Setup real-time sync
   */
  private setupRealTimeSync(): void {
    // Sync data every 30 seconds
    this.syncInterval = window.setInterval(() => {
      this.syncData();
    }, 30000);
    
    // Sync on page visibility change
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        this.syncData();
      }
    });
    
    // Sync before page unload
    window.addEventListener('beforeunload', () => {
      this.syncData();
    });
  }

  /**
   * Setup session management
   */
  private setupSessionManagement(): void {
    // Update session activity on user interaction
    const updateActivity = () => {
      if (this.currentSession) {
        this.currentSession.lastActivity = new Date().toISOString();
        this.saveSession();
      }
    };
    
    ['click', 'scroll', 'keypress', 'mousemove'].forEach(event => {
      document.addEventListener(event, updateActivity, { passive: true });
    });
    
    // Check for session timeout every minute
    setInterval(() => {
      this.checkSessionTimeout();
    }, 60000);
  }

  /**
   * Check session timeout
   */
  private checkSessionTimeout(): void {
    if (!this.currentSession) return;
    
    const lastActivity = new Date(this.currentSession.lastActivity);
    const now = new Date();
    const minutesSinceActivity = (now.getTime() - lastActivity.getTime()) / (1000 * 60);
    
    if (minutesSinceActivity > this.config.sessionTimeout) {
      console.log('[Cross-Platform Tracking] Session timed out, creating new session');
      this.initializeSession();
    }
  }

  /**
   * Detect platform
   */
  private detectPlatform(): 'web' | 'mobile' | 'desktop' | 'tablet' {
    const userAgent = navigator.userAgent.toLowerCase();
    
    if (/mobile|android|iphone|ipod|blackberry|iemobile|opera mini/i.test(userAgent)) {
      return 'mobile';
    } else if (/ipad|tablet/i.test(userAgent)) {
      return 'tablet';
    } else if (/electron/i.test(userAgent)) {
      return 'desktop';
    } else {
      return 'web';
    }
  }

  /**
   * Detect operating system
   */
  private detectOS(): string {
    const userAgent = navigator.userAgent;
    
    if (userAgent.includes('Windows')) return 'Windows';
    if (userAgent.includes('Mac OS')) return 'macOS';
    if (userAgent.includes('Linux')) return 'Linux';
    if (userAgent.includes('Android')) return 'Android';
    if (userAgent.includes('iOS')) return 'iOS';
    
    return 'Unknown';
  }

  /**
   * Detect browser
   */
  private detectBrowser(): string {
    const userAgent = navigator.userAgent;
    
    if (userAgent.includes('Chrome')) return 'Chrome';
    if (userAgent.includes('Firefox')) return 'Firefox';
    if (userAgent.includes('Safari')) return 'Safari';
    if (userAgent.includes('Edge')) return 'Edge';
    if (userAgent.includes('Opera')) return 'Opera';
    
    return 'Unknown';
  }

  /**
   * Extract UTM parameters
   */
  private extractUTMParameters(): Partial<UserSession> {
    const urlParams = new URLSearchParams(window.location.search);
    
    return {
      utmSource: urlParams.get('utm_source') || undefined,
      utmMedium: urlParams.get('utm_medium') || undefined,
      utmCampaign: urlParams.get('utm_campaign') || undefined
    };
  }

  /**
   * Generate unique IDs
   */
  private generateSessionId(): string {
    return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateEventId(): string {
    return `event_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  private generateDeviceId(): string {
    return `device_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Check if session is valid
   */
  private isSessionValid(session: UserSession): boolean {
    const lastActivity = new Date(session.lastActivity);
    const now = new Date();
    const minutesSinceActivity = (now.getTime() - lastActivity.getTime()) / (1000 * 60);
    
    return minutesSinceActivity <= this.config.sessionTimeout;
  }

  /**
   * Check if event is a conversion
   */
  private isConversionEvent(event: UserEvent): boolean {
    return event.type === 'purchase' || 
           (event.type === 'custom' && event.properties?.is_conversion === true);
  }

  /**
   * Handle cross-domain messages
   */
  private handleCrossDomainMessage(data: any): void {
    if (data.type === 'cross_platform_sync') {
      // Sync session data from other domain
      console.log('[Cross-Platform Tracking] Received cross-domain sync data');
    }
  }

  /**
   * Check if link should be decorated
   */
  private shouldDecorateLink(href: string): boolean {
    try {
      const url = new URL(href);
      return this.config.domains.includes(url.origin);
    } catch {
      return false;
    }
  }

  /**
   * Decorate link with tracking parameters
   */
  private decorateLink(link: HTMLAnchorElement): void {
    const url = new URL(link.href);
    url.searchParams.set('_cpt_session', this.currentSession?.id || '');
    url.searchParams.set('_cpt_device', this.getDeviceId());
    link.href = url.toString();
  }

  /**
   * Hash object for fingerprinting
   */
  private hashObject(obj: any): string {
    const str = JSON.stringify(obj);
    let hash = 0;
    
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    
    return Math.abs(hash).toString(36);
  }

  /**
   * Storage methods
   */
  private loadSession(): UserSession | null {
    try {
      const stored = sessionStorage.getItem('cross_platform_session');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  }

  private saveSession(): void {
    if (this.currentSession) {
      sessionStorage.setItem('cross_platform_session', JSON.stringify(this.currentSession));
    }
  }

  private saveUserJourney(): void {
    if (this.userJourney) {
      localStorage.setItem('cross_platform_user_journey', JSON.stringify(this.userJourney));
    }
  }

  /**
   * Cleanup
   */
  destroy(): void {
    if (this.syncInterval) {
      clearInterval(this.syncInterval);
    }
    
    // Remove event listeners
    if (this.currentSession) {
      window.removeEventListener('beforeunload', this.handleBeforeUnload);
      window.removeEventListener('pagehide', this.handlePageHide);
    }
  }
}
