import { analyticsIntegration } from './analytics-integration';

interface ConsentSettings {
  analytics: boolean;
  performance: boolean;
  functional: boolean;
  marketing: boolean;
  timestamp: string;
  version: string;
}

interface PrivacyConfig {
  anonymizeIp: boolean;
  respectDoNotTrack: boolean;
  cookieExpiry: number; // days
  dataRetention: number; // days
  allowDataExport: boolean;
  allowDataDeletion: boolean;
  consentBannerEnabled: boolean;
  strictMode: boolean; // GDPR strict compliance
}

interface DataSubjectRequest {
  id: string;
  type: 'export' | 'delete' | 'rectify';
  email: string;
  timestamp: string;
  status: 'pending' | 'processing' | 'completed' | 'rejected';
  data?: any;
  reason?: string;
}

class GDPRComplianceService {
  private consentSettings: ConsentSettings | null = null;
  private privacyConfig: PrivacyConfig;
  private dataRequests: Map<string, DataSubjectRequest> = new Map();
  private isInitialized = false;
  private consentBanner: HTMLElement | null = null;

  constructor() {
    this.privacyConfig = {
      anonymizeIp: true,
      respectDoNotTrack: true,
      cookieExpiry: 365,
      dataRetention: 730, // 2 years
      allowDataExport: true,
      allowDataDeletion: true,
      consentBannerEnabled: true,
      strictMode: true
    };
  }

  /**
   * Initialize GDPR compliance service
   */
  async initialize(): Promise<void> {
    if (this.isInitialized) return;

    try {
      // Load existing consent settings
      this.loadConsentSettings();
      
      // Check Do Not Track header
      this.checkDoNotTrack();
      
      // Show consent banner if needed
      if (this.shouldShowConsentBanner()) {
        this.showConsentBanner();
      }
      
      // Set up privacy controls
      this.setupPrivacyControls();
      
      this.isInitialized = true;
      console.log('[GDPR Compliance] Service initialized successfully');
      
    } catch (error) {
      console.error('[GDPR Compliance] Failed to initialize:', error);
      throw error;
    }
  }

  /**
   * Check if user has given consent for specific category
   */
  hasConsent(category: keyof ConsentSettings): boolean {
    if (!this.consentSettings) return false;
    
    // Always allow functional cookies
    if (category === 'functional') return true;
    
    return this.consentSettings[category] === true;
  }

  /**
   * Update consent settings
   */
  updateConsent(settings: Partial<ConsentSettings>): void {
    const currentSettings = this.consentSettings || {
      analytics: false,
      performance: false,
      functional: true,
      marketing: false,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };

    this.consentSettings = {
      ...currentSettings,
      ...settings,
      timestamp: new Date().toISOString(),
      version: '1.0'
    };

    // Save to localStorage
    this.saveConsentSettings();
    
    // Update analytics configuration
    this.updateAnalyticsConsent();
    
    // Hide consent banner
    this.hideConsentBanner();
    
    // Track consent update (only if analytics consent is given)
    if (this.hasConsent('analytics')) {
      analyticsIntegration.trackEvent({
        name: 'consent_updated',
        category: 'Privacy',
        customParameters: {
          analytics: settings.analytics,
          performance: settings.performance,
          marketing: settings.marketing
        }
      });
    }

    console.log('[GDPR Compliance] Consent settings updated:', this.consentSettings);
  }

  /**
   * Withdraw all consent
   */
  withdrawConsent(): void {
    this.updateConsent({
      analytics: false,
      performance: false,
      marketing: false
    });
    
    // Clear all tracking data
    this.clearTrackingData();
    
    console.log('[GDPR Compliance] All consent withdrawn');
  }

  /**
   * Get current consent settings
   */
  getConsentSettings(): ConsentSettings | null {
    return this.consentSettings;
  }

  /**
   * Check if analytics should be enabled based on consent and privacy settings
   */
  shouldEnableAnalytics(): boolean {
    // Check Do Not Track
    if (this.privacyConfig.respectDoNotTrack && navigator.doNotTrack === '1') {
      return false;
    }
    
    // Check consent
    return this.hasConsent('analytics');
  }

  /**
   * Get anonymized user identifier
   */
  getAnonymizedUserId(): string {
    // Generate a hash-based anonymous ID that doesn't contain PII
    const userAgent = navigator.userAgent;
    const screenRes = `${screen.width}x${screen.height}`;
    const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const language = navigator.language;
    
    const fingerprint = `${userAgent}-${screenRes}-${timezone}-${language}`;
    
    // Simple hash function (in production, use a proper crypto hash)
    let hash = 0;
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    return `anon_${Math.abs(hash).toString(36)}`;
  }

  /**
   * Submit data subject request (GDPR Article 15, 17, 20)
   */
  async submitDataSubjectRequest(type: 'export' | 'delete' | 'rectify', email: string): Promise<string> {
    const requestId = `dsr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const request: DataSubjectRequest = {
      id: requestId,
      type,
      email,
      timestamp: new Date().toISOString(),
      status: 'pending'
    };
    
    this.dataRequests.set(requestId, request);
    
    // In a real implementation, this would trigger a workflow
    console.log(`[GDPR Compliance] Data subject request submitted: ${type} for ${email}`);
    
    // Mock processing
    setTimeout(() => {
      this.processDataSubjectRequest(requestId);
    }, 2000);
    
    return requestId;
  }

  /**
   * Get data subject request status
   */
  getDataSubjectRequestStatus(requestId: string): DataSubjectRequest | null {
    return this.dataRequests.get(requestId) || null;
  }

  /**
   * Export user data (GDPR Article 20)
   */
  async exportUserData(email: string): Promise<any> {
    // In a real implementation, this would collect all user data from various sources
    const userData = {
      email,
      consentSettings: this.consentSettings,
      analyticsData: {
        sessionCount: Math.floor(Math.random() * 100),
        lastVisit: new Date().toISOString(),
        preferences: {
          language: navigator.language,
          timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
        }
      },
      exportDate: new Date().toISOString(),
      dataRetentionPeriod: `${this.privacyConfig.dataRetention} days`
    };
    
    console.log('[GDPR Compliance] User data exported for:', email);
    return userData;
  }

  /**
   * Delete user data (GDPR Article 17)
   */
  async deleteUserData(email: string): Promise<void> {
    // In a real implementation, this would delete data from all systems
    console.log('[GDPR Compliance] User data deletion initiated for:', email);
    
    // Clear local data
    this.clearTrackingData();
    
    // Mark for deletion in analytics systems
    if (this.hasConsent('analytics')) {
      analyticsIntegration.trackEvent({
        name: 'user_data_deleted',
        category: 'Privacy',
        customParameters: {
          email_hash: this.hashEmail(email)
        }
      });
    }
  }

  /**
   * Show consent banner
   */
  private showConsentBanner(): void {
    if (!this.privacyConfig.consentBannerEnabled) return;
    
    // Remove existing banner
    this.hideConsentBanner();
    
    // Create consent banner
    this.consentBanner = document.createElement('div');
    this.consentBanner.id = 'gdpr-consent-banner';
    this.consentBanner.innerHTML = `
      <div style="
        position: fixed;
        bottom: 0;
        left: 0;
        right: 0;
        background: #2d3748;
        color: white;
        padding: 20px;
        box-shadow: 0 -2px 10px rgba(0,0,0,0.1);
        z-index: 10000;
        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        font-size: 14px;
        line-height: 1.5;
      ">
        <div style="max-width: 1200px; margin: 0 auto; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 20px;">
          <div style="flex: 1; min-width: 300px;">
            <h3 style="margin: 0 0 10px 0; font-size: 16px; font-weight: 600;">Cookie Consent</h3>
            <p style="margin: 0; opacity: 0.9;">
              We use cookies to enhance your experience, analyze site usage, and improve our services. 
              You can customize your preferences or accept all cookies.
            </p>
          </div>
          <div style="display: flex; gap: 10px; flex-wrap: wrap;">
            <button id="gdpr-customize" style="
              background: transparent;
              border: 1px solid #4a5568;
              color: white;
              padding: 8px 16px;
              border-radius: 4px;
              cursor: pointer;
              font-size: 14px;
            ">Customize</button>
            <button id="gdpr-accept-necessary" style="
              background: #4a5568;
              border: 1px solid #4a5568;
              color: white;
              padding: 8px 16px;
              border-radius: 4px;
              cursor: pointer;
              font-size: 14px;
            ">Necessary Only</button>
            <button id="gdpr-accept-all" style="
              background: #3182ce;
              border: 1px solid #3182ce;
              color: white;
              padding: 8px 16px;
              border-radius: 4px;
              cursor: pointer;
              font-size: 14px;
            ">Accept All</button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(this.consentBanner);
    
    // Add event listeners
    document.getElementById('gdpr-accept-all')?.addEventListener('click', () => {
      this.updateConsent({
        analytics: true,
        performance: true,
        marketing: true
      });
    });
    
    document.getElementById('gdpr-accept-necessary')?.addEventListener('click', () => {
      this.updateConsent({
        analytics: false,
        performance: false,
        marketing: false
      });
    });
    
    document.getElementById('gdpr-customize')?.addEventListener('click', () => {
      this.showConsentModal();
    });
  }

  /**
   * Hide consent banner
   */
  private hideConsentBanner(): void {
    if (this.consentBanner) {
      this.consentBanner.remove();
      this.consentBanner = null;
    }
  }

  /**
   * Show detailed consent modal
   */
  private showConsentModal(): void {
    const modal = document.createElement('div');
    modal.id = 'gdpr-consent-modal';
    modal.innerHTML = `
      <div style="
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: rgba(0,0,0,0.5);
        z-index: 10001;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
      ">
        <div style="
          background: white;
          border-radius: 8px;
          max-width: 600px;
          width: 100%;
          max-height: 80vh;
          overflow-y: auto;
          padding: 30px;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        ">
          <h2 style="margin: 0 0 20px 0; font-size: 24px; color: #2d3748;">Privacy Preferences</h2>
          
          <div style="margin-bottom: 20px;">
            <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #2d3748;">🍪 Necessary Cookies</h3>
            <p style="margin: 0 0 10px 0; color: #4a5568; font-size: 14px;">
              These cookies are essential for the website to function properly. They cannot be disabled.
            </p>
            <label style="display: flex; align-items: center; gap: 10px;">
              <input type="checkbox" checked disabled style="margin: 0;">
              <span style="color: #4a5568;">Always Active</span>
            </label>
          </div>
          
          <div style="margin-bottom: 20px;">
            <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #2d3748;">📊 Analytics Cookies</h3>
            <p style="margin: 0 0 10px 0; color: #4a5568; font-size: 14px;">
              Help us understand how visitors interact with our website by collecting anonymous information.
            </p>
            <label style="display: flex; align-items: center; gap: 10px;">
              <input type="checkbox" id="consent-analytics" style="margin: 0;">
              <span style="color: #4a5568;">Allow Analytics</span>
            </label>
          </div>
          
          <div style="margin-bottom: 20px;">
            <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #2d3748;">⚡ Performance Cookies</h3>
            <p style="margin: 0 0 10px 0; color: #4a5568; font-size: 14px;">
              Monitor website performance and help us improve loading times and user experience.
            </p>
            <label style="display: flex; align-items: center; gap: 10px;">
              <input type="checkbox" id="consent-performance" style="margin: 0;">
              <span style="color: #4a5568;">Allow Performance</span>
            </label>
          </div>
          
          <div style="margin-bottom: 30px;">
            <h3 style="margin: 0 0 10px 0; font-size: 16px; color: #2d3748;">🎯 Marketing Cookies</h3>
            <p style="margin: 0 0 10px 0; color: #4a5568; font-size: 14px;">
              Used to deliver personalized advertisements and measure the effectiveness of campaigns.
            </p>
            <label style="display: flex; align-items: center; gap: 10px;">
              <input type="checkbox" id="consent-marketing" style="margin: 0;">
              <span style="color: #4a5568;">Allow Marketing</span>
            </label>
          </div>
          
          <div style="display: flex; gap: 10px; justify-content: flex-end;">
            <button id="modal-cancel" style="
              background: transparent;
              border: 1px solid #cbd5e0;
              color: #4a5568;
              padding: 10px 20px;
              border-radius: 4px;
              cursor: pointer;
              font-size: 14px;
            ">Cancel</button>
            <button id="modal-save" style="
              background: #3182ce;
              border: 1px solid #3182ce;
              color: white;
              padding: 10px 20px;
              border-radius: 4px;
              cursor: pointer;
              font-size: 14px;
            ">Save Preferences</button>
          </div>
        </div>
      </div>
    `;
    
    document.body.appendChild(modal);
    
    // Set current values
    const current = this.consentSettings;
    if (current) {
      (document.getElementById('consent-analytics') as HTMLInputElement).checked = current.analytics;
      (document.getElementById('consent-performance') as HTMLInputElement).checked = current.performance;
      (document.getElementById('consent-marketing') as HTMLInputElement).checked = current.marketing;
    }
    
    // Add event listeners
    document.getElementById('modal-cancel')?.addEventListener('click', () => {
      modal.remove();
    });
    
    document.getElementById('modal-save')?.addEventListener('click', () => {
      const analytics = (document.getElementById('consent-analytics') as HTMLInputElement).checked;
      const performance = (document.getElementById('consent-performance') as HTMLInputElement).checked;
      const marketing = (document.getElementById('consent-marketing') as HTMLInputElement).checked;
      
      this.updateConsent({ analytics, performance, marketing });
      modal.remove();
    });
    
    // Close on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.remove();
      }
    });
  }

  /**
   * Check if consent banner should be shown
   */
  private shouldShowConsentBanner(): boolean {
    return this.consentSettings === null && this.privacyConfig.consentBannerEnabled;
  }

  /**
   * Check Do Not Track header
   */
  private checkDoNotTrack(): void {
    if (navigator.doNotTrack === '1' && this.privacyConfig.respectDoNotTrack) {
      console.log('[GDPR Compliance] Do Not Track detected, disabling tracking');
      this.updateConsent({
        analytics: false,
        performance: false,
        marketing: false
      });
    }
  }

  /**
   * Update analytics consent
   */
  private updateAnalyticsConsent(): void {
    if (typeof window !== 'undefined' && window.gtag) {
      // Update Google Analytics consent
      window.gtag('consent', 'update', {
        analytics_storage: this.hasConsent('analytics') ? 'granted' : 'denied',
        ad_storage: this.hasConsent('marketing') ? 'granted' : 'denied',
        functionality_storage: 'granted',
        personalization_storage: this.hasConsent('marketing') ? 'granted' : 'denied',
        security_storage: 'granted'
      });
    }
  }

  /**
   * Clear all tracking data
   */
  private clearTrackingData(): void {
    // Clear localStorage
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && (key.startsWith('_ga') || key.startsWith('analytics') || key.startsWith('tracking'))) {
        keysToRemove.push(key);
      }
    }
    keysToRemove.forEach(key => localStorage.removeItem(key));
    
    // Clear sessionStorage
    const sessionKeysToRemove = [];
    for (let i = 0; i < sessionStorage.length; i++) {
      const key = sessionStorage.key(i);
      if (key && (key.startsWith('_ga') || key.startsWith('analytics') || key.startsWith('tracking'))) {
        sessionKeysToRemove.push(key);
      }
    }
    sessionKeysToRemove.forEach(key => sessionStorage.removeItem(key));
    
    // Clear cookies
    document.cookie.split(';').forEach(cookie => {
      const eqPos = cookie.indexOf('=');
      const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
      if (name.startsWith('_ga') || name.startsWith('_gid') || name.includes('analytics')) {
        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
      }
    });
    
    console.log('[GDPR Compliance] Tracking data cleared');
  }

  /**
   * Setup privacy controls
   */
  private setupPrivacyControls(): void {
    // Add privacy controls to page if needed
    if (typeof window !== 'undefined') {
      // Expose privacy controls globally
      (window as any).gdprCompliance = {
        updateConsent: this.updateConsent.bind(this),
        withdrawConsent: this.withdrawConsent.bind(this),
        getConsentSettings: this.getConsentSettings.bind(this),
        submitDataSubjectRequest: this.submitDataSubjectRequest.bind(this),
        exportUserData: this.exportUserData.bind(this)
      };
    }
  }

  /**
   * Process data subject request
   */
  private async processDataSubjectRequest(requestId: string): Promise<void> {
    const request = this.dataRequests.get(requestId);
    if (!request) return;
    
    request.status = 'processing';
    
    try {
      switch (request.type) {
        case 'export':
          request.data = await this.exportUserData(request.email);
          break;
        case 'delete':
          await this.deleteUserData(request.email);
          break;
        case 'rectify':
          // In a real implementation, this would update user data
          console.log('[GDPR Compliance] Data rectification requested for:', request.email);
          break;
      }
      
      request.status = 'completed';
      console.log(`[GDPR Compliance] Data subject request ${requestId} completed`);
      
    } catch (error) {
      request.status = 'rejected';
      request.reason = error instanceof Error ? error.message : 'Unknown error';
      console.error(`[GDPR Compliance] Data subject request ${requestId} failed:`, error);
    }
  }

  /**
   * Hash email for privacy
   */
  private hashEmail(email: string): string {
    // Simple hash function (in production, use a proper crypto hash)
    let hash = 0;
    for (let i = 0; i < email.length; i++) {
      const char = email.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Load consent settings from storage
   */
  private loadConsentSettings(): void {
    try {
      const stored = localStorage.getItem('gdpr-consent-settings');
      if (stored) {
        this.consentSettings = JSON.parse(stored);
        
        // Check if consent is expired (older than cookie expiry)
        if (this.consentSettings) {
          const consentDate = new Date(this.consentSettings.timestamp);
          const expiryDate = new Date(consentDate.getTime() + this.privacyConfig.cookieExpiry * 24 * 60 * 60 * 1000);
          
          if (new Date() > expiryDate) {
            console.log('[GDPR Compliance] Consent expired, clearing settings');
            this.consentSettings = null;
            localStorage.removeItem('gdpr-consent-settings');
          }
        }
      }
    } catch (error) {
      console.warn('[GDPR Compliance] Failed to load consent settings:', error);
      this.consentSettings = null;
    }
  }

  /**
   * Save consent settings to storage
   */
  private saveConsentSettings(): void {
    try {
      if (this.consentSettings) {
        localStorage.setItem('gdpr-consent-settings', JSON.stringify(this.consentSettings));
      }
    } catch (error) {
      console.warn('[GDPR Compliance] Failed to save consent settings:', error);
    }
  }
}

// Export singleton instance
export const gdprCompliance = new GDPRComplianceService();
export { GDPRComplianceService, type ConsentSettings, type PrivacyConfig, type DataSubjectRequest };