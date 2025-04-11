import { PerformanceMonitor } from './performance-optimizations';

import DOMPurify from 'dompurify';

class VaultUI {
    this.performance = new PerformanceMonitor();
    this.performance.startSession('vault-ui-init');

  constructor() {
    // Set strict Content Security Policy
    const meta = document.createElement('meta');
    meta.httpEquiv = 'Content-Security-Policy';
    meta.content = "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:;";
    document.head.appendChild(meta);

    // Initialize DOMPurify with strict config
    if (typeof this.sanitizer === 'undefined') {
      this.sanitizer = typeof DOMPurify !== 'undefined'
        ? DOMPurify
        : {
            sanitize: (text) => {
              const div = document.createElement('div');
              div.textContent = text;
              return div.innerHTML
                .replace(/&/g, '&amp;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#x27;')
                .replace(/\//g, '&#x2F;');
            }
          };
    }

    // Initialize security tokens and rate limit tracking
    this.security = {
      csrfToken: crypto.randomUUID(),
      lastAssignment: 0,
      assignmentRateLimit: 1000 // 1 second between assignments
    };

    this.resources = {
      food: this.validateResourceValue(100),
      water: this.validateResourceValue(100),
      power: this.validateResourceValue(100)
    };
    this.dwellers = [
      { id: 1, name: 'Dweller 1', assignedTo: null },
      { id: 2, name: 'Dweller 2', assignedTo: null },
      { id: 3, name: 'Dweller 3', assignedTo: null }
    ];
    this.rooms = ['Food Production', 'Water Purification', 'Power Plant'];
    this.expansionCost = 500;
    this.alertQueue = [];
    this.cacheElements();
    this.initUI();
    this.performance.endSession('vault-ui-init');

    this.eventListeners = [];
  }

  // Clean up event listeners when instance is destroyed
  public destroy(): void {
    document.querySelectorAll('.dweller-item').forEach(el => {
      if (el._eventHandlers) {
        Object.entries(el._eventHandlers).forEach(([event, handler]) => {
          el.removeEventListener(event, handler);
        });
      }
    });
    
    this.eventListeners.forEach(({el, event, handler}) => {
      el.removeEventListener(event, handler);
    });
  }

  /**
   * Sanitizes text input with strict XSS protection
   * - Blocks all HTML tags and attributes
   * - Filters dangerous patterns and encodings
   * - Validates final output matches dweller name requirements
   * @param {string} text - Input to sanitize
   * @returns {string} Sanitized text or empty string if invalid
   */
  private sanitizeText(text: string): string {
    if (typeof text !== 'string') return '';
    
    // First pass - basic sanitization with stricter config
    let sanitized = this.sanitizer.sanitize(text, {
      ALLOWED_TAGS: [],
      ALLOWED_ATTR: [],
      FORBID_TAGS: ['*'], // Block all tags
      FORBID_ATTR: ['*'], // Block all attributes
      KEEP_CONTENT: false,
      USE_PROFILES: { html: false }
    });
    
    // Second pass - additional validation with more patterns
    sanitized = sanitized
      .replace(/javascript:/gi, '')
      .replace(/data:/gi, '')
      .replace(/[\u0000-\u001F\u007F-\u009F]/g, '')
      .replace(/\b(?:eval|setTimeout|setInterval|Function)\b/gi, '')
      .replace(/\\x[0-9a-fA-F]{2}/g, '')
      .replace(/\\u[0-9a-fA-F]{4}/g, '');
      
    // Length limit and final validation
    const trimmed = sanitized.slice(0, 200);
    return this.validateDwellerName(trimmed) ? trimmed : '';
  }

  /**
   * Validates dweller name meets requirements
   * @param {string} name - Name to validate
   * @returns {boolean} True if valid
   */
  /**
   * Validates dweller name meets security and content requirements
   * @param {string} name - Name to validate
   * @returns {boolean} True if valid
   */
  /**
   * Validates resource values are within safe bounds
   * @param {number} value - Resource value to validate
   * @returns {number} Validated value (clamped to 0-1000)
   */
  private validateResourceValue(value: number): boolean {
    const num = Number(value);
    if (isNaN(num)) return 0;
    return Math.min(Math.max(0, num), 1000);
  }

  /**
   * Validates dweller name meets security and content requirements
   * @param {string} name - Name to validate
   * @returns {boolean} True if valid
   */
  private validateDwellerName(name: string): boolean {
    if (typeof name !== 'string') return false;
    
    // Block common injection patterns
    const forbiddenPatterns = [
      /[<>"'`]/, // Basic injection chars
      /javascript:/i, /data:/i, // Dangerous protocols
      /[\u0000-\u001F\u007F-\u009F]/, // Control chars
      /%[0-9a-fA-F]{2}/, // URL encoding
      /&[#\w]+;/, // HTML entities
      /\\[xu][0-9a-fA-F]+/ // Unicode escapes
    ];
    
    if (forbiddenPatterns.some(p => p.test(name))) {
      return false;
    }
    
    // Length and character restrictions
    return /^[\p{L}\p{N}\s-]{1,20}$/u.test(name) &&
           name.trim().length >= 1;
  }

  initUI() {
    this.createDashboard();
    this.createDwellerAssignment();
    this.setupAlertSystem();
    this.setupExpansionControls();
    this.updateResourceDisplay();
  }

  createDashboard() {
    const dashboard = document.createElement('div');
    dashboard.id = 'vault-dashboard';
    
    const resourcePanel = document.createElement('div');
    resourcePanel.id = 'resource-panel';
    
    Object.keys(this.resources).forEach(resource => {
      const resourceEl = document.createElement('div');
      resourceEl.className = `resource ${resource}`;
      
      const nameSpan = document.createElement('span');
      nameSpan.textContent = resource.charAt(0).toUpperCase() + resource.slice(1);
      
      const valueSpan = document.createElement('span');
      valueSpan.className = 'resource-value';
      valueSpan.textContent = this.resources[resource];
      
      resourceEl.appendChild(nameSpan);
      resourceEl.appendChild(valueSpan);
      resourcePanel.appendChild(resourceEl);
    });
    
    const statusPanel = document.createElement('div');
    statusPanel.id = 'status-panel';
    
    const statusHeading = document.createElement('h3');
    statusHeading.textContent = 'Vault Status';
    
    const statusText = document.createElement('p');
    statusText.textContent = 'All systems operational';
    
    statusPanel.appendChild(statusHeading);
    statusPanel.appendChild(statusText);
    dashboard.appendChild(resourcePanel);
    dashboard.appendChild(statusPanel);
    document.body.prepend(dashboard);
  }

  /**
   * Cache DOM elements to avoid repeated queries with memoization
   * @returns {Object} Cached UI elements
   */
  private cacheElements(): Record<string, HTMLElement> {
    this.performance.startSession('cache-elements');
    if (this._cachedElements) {
      this.performance.endSession('cache-elements');
      return this._cachedElements;
    }
    
    // Cache all UI elements in one DOM query
    const uiElements = {
      dashboardEl: document.querySelector('#vault-dashboard'),
      resourceEls: {
        food: document.querySelector('.resource.food .resource-value'),
        water: document.querySelector('.resource.water .resource-value'),
        power: document.querySelector('.resource.power .resource-value')
      },
      dwellerList: document.querySelector('#dweller-list'),
      alertPanel: document.querySelector('#alert-panel'),
      assignmentZones: document.querySelectorAll('.assignment-zone'),
      statusPanel: document.querySelector('#status-panel'),
      statusText: document.querySelector('#status-panel p'),
      expansionButton: document.querySelector('.expansion-button')
    };
    
    // Store references to all elements
    Object.assign(this, uiElements);
    this._cachedElements = uiElements;
    
    this.performance.endSession('cache-elements');
    return this._cachedElements;
  }

  /**
   * Creates dweller assignment UI with optimized event handling
   * @returns {HTMLElement} The assignment section element
   */
  createDwellerAssignment() {
    const assignmentSection = document.createElement('div');
    assignmentSection.className = 'assignment-section';
    
    const dwellerList = document.createElement('div');
    dwellerList.id = 'dweller-list';
    
    // Create document fragment for batch DOM insertion
    const dwellerFragment = document.createDocumentFragment();
    
    // Use event delegation for better performance
    // Use passive listeners for better scroll performance
    dwellerList.addEventListener('touchstart', this.handleTouchStart.bind(this), {passive: true});
    dwellerList.addEventListener('touchend', this.handleTouchEnd.bind(this), {passive: true});
    dwellerList.addEventListener('touchmove', this.handleTouchMove.bind(this), {passive: false});
    dwellerList.addEventListener('dragstart', this.handleDragEvent.bind(this));
    
    this.dwellers.forEach(dweller => {
      const dwellerEl = document.createElement('div');
      dwellerEl.className = 'dweller-item';
      dwellerEl.dataset.id = dweller.id;
      dwellerEl.textContent = this.sanitizeText(dweller.name);
      
      if (dweller.assignedTo) {
        const assignedBadge = document.createElement('span');
        assignedBadge.className = 'assigned-to';
        assignedBadge.textContent = `Assigned to: ${this.sanitizeText(dweller.assignedTo)}`;
        dwellerEl.appendChild(assignedBadge);
      }
      
      dwellerEl.draggable = true;
      dwellerFragment.appendChild(dwellerEl);
    });
    
    dwellerList.appendChild(dwellerFragment);
    
    // Create rooms in batch
    const roomsFragment = document.createDocumentFragment();
    this.rooms.forEach(room => {
      const roomEl = document.createElement('div');
      roomEl.className = 'assignment-zone';
      roomEl.dataset.room = room;
      
      const roomHeading = document.createElement('h4');
      roomHeading.textContent = room;
      roomEl.appendChild(roomHeading);
      
      roomEl.addEventListener('dragover', this.handleDragOver);
      roomEl.addEventListener('drop', this.handleDrop);
      roomEl.addEventListener('dragenter', this.handleDragEnter);
      roomEl.addEventListener('dragleave', this.handleDragLeave);
      
      roomsFragment.appendChild(roomEl);
    });
    
    assignmentSection.appendChild(roomsFragment);
    assignmentSection.prepend(dwellerList);
    this.dashboardEl.after(assignmentSection);
  }

  handleDragStart(e) {
    e.dataTransfer.setData('text/plain', e.target.dataset.id);
    e.dataTransfer.setData('application/csrf-token', this.security.csrfToken);
    e.dataTransfer.effectAllowed = 'move';
  }

  handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  }

    this.performance.startSession('handle-drop');

  private handleDrop(e: DragEvent): void {
    e.preventDefault();
    try {
      // Enhanced security checks with additional validation
      if (!e || !e.isTrusted || !e.dataTransfer) {
        throw new Error('Invalid event - operation blocked');
      }
      
      // Validate event timing to prevent timing attacks
      const eventTime = performance.now();
      if (eventTime - this.lastEventTime < 50) { // 50ms minimum between events
        throw new Error('Event timing anomaly detected');
      }
      this.lastEventTime = eventTime;

      // Rate limit with exponential backoff
      const now = Date.now();
      const timeSinceLast = now - this.security.lastAssignment;
      if (timeSinceLast < this.security.assignmentRateLimit) {
        const waitTime = Math.min(
          5000, // Max 5 second wait
          this.security.assignmentRateLimit * Math.pow(2,
            Math.floor(timeSinceLast / this.security.assignmentRateLimit)
          )
        );
        throw new Error(`Assignment too frequent - please wait ${waitTime}ms`);
      }

      // Validate CSRF token with timing-safe comparison
      if (e.dataTransfer?.types.includes('application/csrf-token')) {
        const token = e.dataTransfer.getData('application/csrf-token');
        let mismatch = 0;
        for (let i = 0; i < token.length; i++) {
          mismatch |= token.charCodeAt(i) ^ this.security.csrfToken.charCodeAt(i);
        }
        if (mismatch !== 0) {
          throw new Error('Invalid security token');
        }
      }

      // Validate data transfer
      if (!e.dataTransfer || !e.dataTransfer.types.includes('text/plain')) {
        throw new Error('Invalid data transfer');
      }

      const dwellerId = e.dataTransfer.getData('text/plain');
      const roomEl = e.target.closest('.assignment-zone');
      
      if (!roomEl || !roomEl.dataset.room) {
        throw new Error('Invalid drop target');
      }
      
      // Strict validation with additional checks
      const room = this.sanitizeText(roomEl.dataset.room);
      const dwellerIdNum = parseInt(dwellerId, 10);
      
      if (isNaN(dwellerIdNum) || dwellerIdNum <= 0 || dwellerIdNum > 1000) {
        throw new Error('Invalid dweller ID');
      }
      
      const dweller = this.dwellers.find(d => d.id === dwellerIdNum);
      
      if (!dweller || !this.validateRoomName(room) || !this.validateDwellerName(dweller.name)) {
        throw new Error('Invalid assignment data');
      }
      
      // Immutable update with validation
      const updatedDwellers = this.dwellers.map(d => {
        if (d.id === dwellerIdNum) {
          const updated = {...d, assignedTo: room};
          if (!this.validateDwellerAssignment(updated)) {
            throw new Error('Invalid assignment state');
          }
          return updated;
        }
        return d;
      });
      
      this.dwellers = updatedDwellers;
      this.security.lastAssignment = now;
      
      // Batch UI updates
      requestAnimationFrame(() => {
        this.updateDwellerDisplay();
        this.showAlert(`${this.sanitizeText(dweller.name)} assigned to ${this.sanitizeText(room)}`, 'success');
      });
    } catch (error) {
      console.error('Assignment error:', error);
      this.showAlert(error.message, 'alert');
      
      // Log security events
      if (error.message.includes('Invalid') || error.message.includes('token')) {
        this.logSecurityEvent('invalid_assignment_attempt', {
          dwellerId: e.dataTransfer?.getData('text/plain'),
          room: e.target?.closest('.assignment-zone')?.dataset.room
        });
      }
    }
    this.performance.endSession('handle-drop');

  }

  /**
   * Validates dweller assignment meets game rules
   * @param {object} assignment - Dweller assignment to validate
   * @returns {boolean} True if valid
   */
  validateDwellerAssignment(assignment) {
    return assignment &&
           typeof assignment.id === 'number' &&
           typeof assignment.name === 'string' &&
           (assignment.assignedTo === null || typeof assignment.assignedTo === 'string') &&
           this.validateDwellerName(assignment.name) &&
           (assignment.assignedTo === null || this.validateRoomName(assignment.assignedTo));
  }

  /**
   * Logs security events for monitoring
   * @param {string} eventType - Type of security event
   * @param {object} details - Event details
   */
  logSecurityEvent(eventType, details) {
    if (!this.securityEvents) {
      this.securityEvents = [];
    }
    this.securityEvents.push({
      timestamp: Date.now(),
      type: eventType,
      details: JSON.parse(JSON.stringify(details)) // Deep clone
    });
    
    // Keep only last 100 events
    if (this.securityEvents.length > 100) {
      this.securityEvents.shift();
    }
  }

  /**
   * Validates room name with strict security checks against known rooms
   * @param {string} name - Name to validate
   * @returns {boolean} True if valid
   */
  validateRoomName(name) {
    if (typeof name !== 'string' || name.length > 50 || name.length < 1) {
      return false;
    }
    
    // Prototype pollution and injection protection
    const forbiddenPatterns = [
      '__proto__', 'constructor', 'prototype',
      /<[a-z][\s\S]*>/i, /javascript:/i, /data:/i,
      /[\u0000-\u001F\u007F-\u009F]/, // Control characters
      /%[0-9a-fA-F]{2}/ // URL encoding
    ];
    
    for (const pattern of forbiddenPatterns) {
      if (typeof pattern === 'string' ? name.includes(pattern) : pattern.test(name)) {
        return false;
      }
    }
    
    // Case-sensitive exact match against known rooms with additional validation
    return this.rooms.some(room =>
      room === name &&
      /^[\p{L}\p{N}\s-]+$/u.test(name) // Unicode-aware alphanumeric, spaces and hyphens
    );
  }

  handleDragEnter(e) {
    e.preventDefault();
    e.target.classList.add('highlight');
  }

  handleDragLeave(e) {
    e.preventDefault();
    e.target.classList.remove('highlight');
  }

  // Mobile touch event handlers
  handleTouchStart(e) {
    e.preventDefault();
    if (!e.changedTouches || !Array.isArray(e.changedTouches)) return;
    
    // Validate touch events
    const touches = Array.from(e.changedTouches).slice(0, 2); // Limit to 2 touches
    if (touches.some(t =>
      typeof t.clientX !== 'number' ||
      typeof t.clientY !== 'number' ||
      typeof t.identifier !== 'number'
    )) {
      return;
    }

    // Store touch identifiers for cleanup
    this.activeTouches = this.activeTouches || new Set();
    touches.forEach(t => this.activeTouches.add(t.identifier));
    
    // Track initial touch positions for gesture detection
    if (touches.length === 2) {
      this.touchStartDistance = Math.hypot(
        touches[0].clientX - touches[1].clientX,
        touches[0].clientY - touches[1].clientY
      );
    } else if (touches.length === 1) {
      // Track single touch for swipe detection
      this.touchStartX = touches[0].clientX;
      this.touchStartY = touches[0].clientY;
      this.touchStartTime = Date.now();
    }
    
    for (let i = 0; i < touches.length; i++) {
      const touch = touches[i];
      const dwellerEl = document.elementFromPoint(touch.clientX, touch.clientY);
      
      if (dwellerEl && dwellerEl.classList.contains('dweller-item')) {
        dwellerEl.dataset.touchId = touch.identifier;
        dwellerEl.classList.add('active-touch');
        dwellerEl.style.transform = 'scale(0.95)';
        
        // Add touch ripple effect
        const ripple = document.createElement('div');
        ripple.className = 'touch-ripple';
        ripple.style.left = `${touch.clientX - dwellerEl.getBoundingClientRect().left}px`;
        ripple.style.top = `${touch.clientY - dwellerEl.getBoundingClientRect().top}px`;
        dwellerEl.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
      }
    }
  }

  handleTouchEnd(e) {
    e.preventDefault();
    if (!e.changedTouches) return;
    const touches = e.changedTouches;
    
    // Reset pinch zoom tracking
    this.touchStartDistance = null;
    
    // Handle swipe gestures
    if (touches.length === 1 && this.touchStartX) {
      const touch = touches[0];
      const dx = touch.clientX - this.touchStartX;
      const dy = touch.clientY - this.touchStartY;
      const dt = Date.now() - this.touchStartTime;
      
      // Only detect swipe if movement was quick and primarily horizontal
      if (dt < 300 && Math.abs(dx) > 30 && Math.abs(dx) > Math.abs(dy) * 2) {
        if (dx > 0) {
          this.showAlert('Swiped right - showing next room', 'info');
        } else {
          this.showAlert('Swiped left - showing previous room', 'info');
        }
      }
    }
    
    for (let i = 0; i < touches.length; i++) {
      const touch = touches[i];
      const dwellerEl = document.querySelector(`[data-touch-id="${touch.identifier}"]`);
      if (!dwellerEl) continue;
      
      dwellerEl.classList.remove('active-touch');
      dwellerEl.style.transform = '';
      
      // Add tap animation
      dwellerEl.classList.add('tap-animate');
      setTimeout(() => dwellerEl.classList.remove('tap-animate'), 300);
      
      const roomEl = document.elementFromPoint(touch.clientX, touch.clientY);
      if (roomEl && roomEl.closest('.assignment-zone')) {
        const room = roomEl.closest('.assignment-zone').dataset.room;
        const dweller = this.dwellers.find(d => d.id == dwellerEl.dataset.id);
        dweller.assignedTo = room;
        this.updateDwellerDisplay();
        this.showAlert(`${dweller.name} assigned to ${room}`, 'success');
      }
    }
  }

  // Throttled touch move handler with requestAnimationFrame
  // Debounced touch move handler with requestAnimationFrame
  handleTouchMove(e) {
    e.preventDefault();
    if (!e.changedTouches || this.touchMoveDebounce) return;
    
    this.touchMoveDebounce = true;
    requestAnimationFrame(() => {
      this.touchMoveDebounce = false;
      
      const touches = e.changedTouches;
      
      // Handle pinch zoom gesture
      if (touches.length === 2) {
        const currentDistance = Math.hypot(
          touches[0].clientX - touches[1].clientX,
          touches[0].clientY - touches[1].clientY
        );
        
        if (this.touchStartDistance) {
          const scale = currentDistance / this.touchStartDistance;
          this.dashboardEl.style.transform = `scale(${Math.min(Math.max(0.8, scale), 1.2)})`;
        }
        return;
      }
      
      // Handle single touch drag with cached elements
      for (let i = 0; i < touches.length; i++) {
        const touch = touches[i];
        const dwellerEl = this._cachedElements.dwellerList.querySelector(
          `[data-touch-id="${touch.identifier}"]`
        );
        
        if (dwellerEl) {
          const rect = dwellerEl.getBoundingClientRect();
          dwellerEl.style.transform = `translate(${touch.clientX - rect.left}px, ${touch.clientY - rect.top}px)`;
        }
      }
    });
  }

  // Optimized dweller display updates with batched DOM operations
  updateDwellerDisplay() {
    if (!this._cachedElements?.dwellerList) return;
    
    const fragment = document.createDocumentFragment();
    const dwellerItems = this._cachedElements.dwellerList.querySelectorAll('.dweller-item');
    
    dwellerItems.forEach(el => {
      const dweller = this.dwellers.find(d => d.id == el.dataset.id);
      if (!dweller) return;
      
      const clone = el.cloneNode(true);
      const assignedBadge = clone.querySelector('.assigned-to');
      
      if (dweller.assignedTo) {
        if (!assignedBadge) {
          const badge = document.createElement('span');
          badge.className = 'assigned-to';
          badge.textContent = `Assigned to: ${this.sanitizeText(dweller.assignedTo)}`;
          clone.appendChild(badge);
        } else {
          assignedBadge.textContent = `Assigned to: ${this.sanitizeText(dweller.assignedTo)}`;
        }
      } else if (assignedBadge) {
        assignedBadge.remove();
      }
      
      fragment.appendChild(clone);
    });
    
    // Batch update
    this._cachedElements.dwellerList.innerHTML = '';
    this._cachedElements.dwellerList.appendChild(fragment);
  }

  setupAlertSystem() {
    this.alertPanel = document.createElement('div');
    this.alertPanel.id = 'alert-panel';
    document.body.appendChild(this.alertPanel);
    
    // Simulate random alerts with proper cleanup
    this.alertInterval = setInterval(() => {
      if (Math.random() > 0.7) {
        const alerts = [
          { message: 'Water purification needs maintenance', type: 'warning' },
          { message: 'Power levels critical!', type: 'alert' },
          { message: 'Food production increased', type: 'success' }
        ];
        const alert = alerts[Math.floor(Math.random() * alerts.length)];
        this.showAlert(alert.message, alert.type);
      }
    }, 10000);
  }

  /**
   * Displays an alert message with strict content validation
   * @param {string} message - Message to display (max 200 chars)
   * @param {string} type - Alert type ('alert', 'warning', 'success', 'info')
   * @returns {boolean} True if alert was shown
   */
  /**
   * Displays an alert message with strict validation and rate limiting
   * @param {string} message - Message to display (max 200 chars)
   * @param {string} type - Alert type ('alert', 'warning', 'success', 'info')
   * @returns {boolean} True if alert was shown
   */
  showAlert(message, type = 'alert') {
    try {
      // Initialize rate limiting queue if needed
      this.alertQueue = this.alertQueue || [];
      
      // Validate input
      if (typeof message !== 'string' || message.length > 200) {
        throw new Error('Invalid alert message');
      }
      
      // Sanitize message
      const sanitizedMsg = this.sanitizeText(message);
      
      // Validate and normalize alert type
      const validTypes = ['alert', 'warning', 'success', 'info'];
      if (!validTypes.includes(type)) {
        type = 'alert';
      }

      // Rate limiting - max 3 alerts per second
      const now = Date.now();
      this.alertQueue = this.alertQueue.filter(alert =>
        now - alert.timestamp < 1000
      );
      
      if (this.alertQueue.length >= 3) {
        return false;
      }
      
      // Add to queue
      this.alertQueue.push({ message: sanitizedMsg, type, timestamp: now });
      
      // Create and display alert
      const alertEl = document.createElement('div');
      alertEl.className = `alert ${type}`;
      alertEl.textContent = sanitizedMsg;
      
      this.alertPanel.appendChild(alertEl);
      setTimeout(() => alertEl.remove(), 5000);
      
      return true;
    } catch (error) {
      console.error('Alert error:', error);
      return false;
    }
      
      if (typeof message !== 'string') {
        throw new Error('Alert message must be a string');
      }
      
      // Truncate long messages
      message = message.length > 200 ? message.substring(0, 197) + '...' : message;
      
      // Validate alert type
      const validTypes = ['alert', 'warning', 'success', 'info'];
      if (!validTypes.includes(type)) {
        type = 'alert';
      }
      
      // Create and sanitize alert
      const alertEl = document.createElement('div');
      alertEl.className = `alert ${type}`;
      alertEl.textContent = this.sanitizeText(message);
      
      // Add to alert panel with animation
      this.alertPanel.appendChild(alertEl);
      setTimeout(() => alertEl.classList.add('show'), 10);
      
      // Auto-remove after delay
      setTimeout(() => {
        alertEl.classList.remove('show');
        setTimeout(() => alertEl.remove(), 300);
      }, 5000);
      
      return true;
    } catch (error) {
      console.error('Alert error:', error);
      return false;
    }
  }
    alertEl.className = `alert ${type}`;
    alertEl.textContent = this.sanitizeText(message.substring(0, 200));
    
    // Rate limit alerts to prevent spam
    if (this.alertQueue.length >= 5) {
      this.alertQueue.shift().remove();
    }
    
    this.alertPanel.appendChild(alertEl);
    this.alertQueue.push(alertEl);
    
    // Auto-dismiss after delay
    const dismissTimer = setTimeout(() => {
      alertEl.classList.add('fade-out');
      setTimeout(() => {
        alertEl.remove();
        this.alertQueue = this.alertQueue.filter(a => a !== alertEl);
      }, 500);
    }, 5000);
    
    return true;
  }

  /**
   * Cleans up all active alerts and intervals
   * Should be called when game is paused or destroyed
   */
  cleanupAlerts() {
    // Clear the random alert interval
    if (this.alertInterval) {
      clearInterval(this.alertInterval);
      this.alertInterval = null;
    }
    
    // Clear all pending alerts
    this.alertQueue.forEach(alert => {
      alert.remove();
    });
    this.alertQueue = [];
    
  }
    // Store timer for possible early dismissal
    alertEl.dataset.dismissTimer = dismissTimer;
    
    return true;
  }

  setupExpansionControls() {
    const controls = document.createElement('div');
    controls.className = 'expansion-controls';
    
    const expandBtn = document.createElement('button');
    expandBtn.id = 'expand-vault';
    expandBtn.textContent = 'Expand Vault (Cost: 500)';
    expandBtn.addEventListener('click', () => this.expandVault());
    
    controls.appendChild(expandBtn);
    document.querySelector('.assignment-section').after(controls);
    this.updateExpandButton();
  }

  expandVault() {
    if (this.resources.power >= this.expansionCost) {
      this.resources.power -= this.expansionCost;
      this.expansionCost = Math.floor(this.expansionCost * 1.5);
      this.rooms.push(`New Room ${this.rooms.length + 1}`);
      this.updateResourceDisplay();
      this.updateExpandButton();
      this.createDwellerAssignment();
      this.showAlert('Vault expanded successfully!', 'success');
    } else {
      this.showAlert('Not enough resources to expand', 'warning');
    }
  }

  updateExpandButton() {
    const btn = document.getElementById('expand-vault');
    btn.textContent = `Expand Vault (Cost: ${this.expansionCost})`;
    btn.disabled = this.resources.power < this.expansionCost;
  }

  updateResourceDisplay() {
    Object.keys(this.resources).forEach(resource => {
      const el = document.querySelector(`.resource.${resource} .resource-value`);
      if (el) {
        el.textContent = this.resources[resource];
      }
    });
  }
  
  // Save game state to localStorage with compression
  saveGame() {
    try {
      // Create deep copies of data to prevent reference issues
      const state = {
        version: 1,
        timestamp: Date.now(),
        resources: {...this.resources},
        dwellers: this.dwellers.map(d => ({...d})),
        rooms: [...this.rooms],
        expansionCost: this.expansionCost
      };
      
      // Compress data to save space
      const compressedState = LZString.compressToUTF16(JSON.stringify(state));
      
      // Rotate backups (keep 5 most recent)
      const backups = JSON.parse(localStorage.getItem('vaultBackups') || '[]');
      backups.unshift({
        compressed: true,
        data: compressedState,
        timestamp: Date.now()
      });
      if (backups.length > 5) backups.pop();
      localStorage.setItem('vaultBackups', JSON.stringify(backups));
      
      // Set current save
      localStorage.setItem('vaultState', compressedState);
      localStorage.setItem('vaultStateCompressed', 'true');
      
      this.showAlert('Game saved', 'success');
      this.logSaveOperation(true);
      return true;
    } catch (e) {
      console.error('Save failed:', e);
      this.showAlert('Save failed', 'alert');
      this.logSaveOperation(false);
      return false;
    }
  }
  
  // Load game state from localStorage with decompression
  loadGame() {
    try {
      let state;
      const isCompressed = localStorage.getItem('vaultStateCompressed') === 'true';
      
      if (isCompressed) {
        const compressed = localStorage.getItem('vaultState');
        state = JSON.parse(LZString.decompressFromUTF16(compressed));
      } else {
        // Fallback for old uncompressed saves
        state = JSON.parse(localStorage.getItem('vaultState'));
      }
      
      if (!state || !this.validateState(state)) {
        throw new Error('Invalid save data');
      }
      
      this.resources = state.resources;
      this.dwellers = state.dwellers;
      this.rooms = state.rooms;
      this.expansionCost = state.expansionCost;
      
      this.updateResourceDisplay();
      this.updateExpandButton();
      this.createDwellerAssignment();
      this.showAlert('Game loaded', 'success');
      this.logLoadOperation(true);
      return true;
    } catch (e) {
      console.error('Load failed:', e);
      this.showAlert('Failed to load game', 'alert');
      this.logLoadOperation(false);
      return false;
    }
  }
  
  // Try to recover from backup if main save is corrupted
  recoverFromBackup() {
    const backups = JSON.parse(localStorage.getItem('vaultBackups') || '[]');
    for (const backup of backups) {
      try {
        let state;
        if (backup.compressed) {
          state = JSON.parse(LZString.decompressFromUTF16(backup.data));
        } else {
          state = backup; // Old uncompressed format
        }
        
        if (this.validateState(state)) {
          if (backup.compressed) {
            localStorage.setItem('vaultState', backup.data);
            localStorage.setItem('vaultStateCompressed', 'true');
          } else {
            localStorage.setItem('vaultState', JSON.stringify(state));
            localStorage.removeItem('vaultStateCompressed');
          }
          this.loadGame();
          this.showAlert('Recovered from backup', 'warning');
          this.logRecoveryOperation(true);
          return true;
        }
      } catch (e) {
        console.warn('Backup recovery attempt failed:', e);
      }
    }
    this.showAlert('No valid backups found', 'alert');
    this.logRecoveryOperation(false);
    return false;
  }
  
  // Enhanced state validation with schema checking
  // Remove deprecated sanitizeMessage in favor of sanitizeText
  
  validateState(state) {
    // Basic structure validation
    if (!state.version || state.version !== 1) return false;
    if (!state.resources || typeof state.resources !== 'object') return false;
    if (!state.dwellers || !Array.isArray(state.dwellers)) return false;
    if (!state.rooms || !Array.isArray(state.rooms)) return false;
    if (typeof state.expansionCost !== 'number') return false;
    
    // Resource validation
    const requiredResources = ['food', 'water', 'power'];
    for (const res of requiredResources) {
      if (typeof state.resources[res] !== 'number' ||
          state.resources[res] < 0 ||
          state.resources[res] > 10000) {
        return false;
      }
    }
    
    // Dweller schema validation
    const dwellerSchema = {
      id: 'number',
      name: 'string',
      assignedTo: ['string', 'null']
    };
    
    for (const dweller of state.dwellers) {
      for (const [key, types] of Object.entries(dwellerSchema)) {
        const validTypes = Array.isArray(types) ? types : [types];
        const valueType = dweller[key] === null ? 'null' : typeof dweller[key];
        
        if (!validTypes.includes(valueType)) {
          return false;
        }
      }
    }
    
    return true;
  }
  
  // Log save/load operations for analytics
  logSaveOperation(success) {
    const stats = JSON.parse(localStorage.getItem('vaultStats') || '{}');
    stats.saveOperations = stats.saveOperations || [];
    stats.saveOperations.push({
      timestamp: Date.now(),
      success,
      dwellerCount: this.dwellers.length,
      roomCount: this.rooms.length
    });
    localStorage.setItem('vaultStats', JSON.stringify(stats));
  }
  
  logLoadOperation(success) {
    const stats = JSON.parse(localStorage.getItem('vaultStats') || '{}');
    stats.loadOperations = stats.loadOperations || [];
    stats.loadOperations.push({
      timestamp: Date.now(),
      success
    });
    localStorage.setItem('vaultStats', JSON.stringify(stats));
  }
  
  logRecoveryOperation(success) {
    const stats = JSON.parse(localStorage.getItem('vaultStats') || '{}');
    stats.recoveryOperations = stats.recoveryOperations || [];
    stats.recoveryOperations.push({
      timestamp: Date.now(),
      success
    });
    localStorage.setItem('vaultStats', JSON.stringify(stats));
  }
  
  // Enhanced save/load UI controls with stats
  setupSaveControls() {
    const controls = document.createElement('div');
    controls.className = 'save-controls';
    
    const saveBtn = document.createElement('button');
    saveBtn.id = 'save-game';
    saveBtn.textContent = 'Save Game';
    saveBtn.addEventListener('click', () => this.saveGame());
    
    const loadBtn = document.createElement('button');
    loadBtn.id = 'load-game';
    loadBtn.textContent = 'Load Game';
    loadBtn.addEventListener('click', () => this.loadGame());
    
    const recoverBtn = document.createElement('button');
    recoverBtn.id = 'recover-game';
    recoverBtn.textContent = 'Recover Backup';
    recoverBtn.addEventListener('click', () => this.recoverFromBackup());
    
    const backupNowBtn = document.createElement('button');
    backupNowBtn.id = 'backup-now';
    backupNowBtn.textContent = 'Create Backup';
    backupNowBtn.addEventListener('click', () => {
      this.saveGame();
      this.showAlert('Manual backup created', 'success');
    });
    
    controls.appendChild(saveBtn);
    controls.appendChild(loadBtn);
    controls.appendChild(recoverBtn);
    controls.appendChild(backupNowBtn);
    
    // Add stats display
    const statsBtn = document.createElement('button');
    statsBtn.id = 'show-stats';
    statsBtn.textContent = 'Show Stats';
    statsBtn.addEventListener('click', () => this.showSaveStats());
    controls.appendChild(statsBtn);
    
    document.querySelector('.expansion-controls').after(controls);
  }
  
  // Display save/load statistics
  showSaveStats() {
    const stats = JSON.parse(localStorage.getItem('vaultStats') || '{}');
    let message = 'Save System Statistics:\n';
    
    if (stats.saveOperations) {
      const successCount = stats.saveOperations.filter(op => op.success).length;
      message += `\nSaves: ${successCount}/${stats.saveOperations.length} successful`;
    }
    
    if (stats.loadOperations) {
      const successCount = stats.loadOperations.filter(op => op.success).length;
      message += `\nLoads: ${successCount}/${stats.loadOperations.length} successful`;
    }
    
    if (stats.recoveryOperations) {
      const successCount = stats.recoveryOperations.filter(op => op.success).length;
      message += `\nRecoveries: ${successCount}/${stats.recoveryOperations.length} successful`;
    }
    
    this.showAlert(message, 'info');
  }
}

// Initialize the UI when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  // Load LZString compression library
  const script = document.createElement('script');
  script.src = 'https://cdn.jsdelivr.net/npm/lz-string@1.4.4/libs/lz-string.min.js';
  script.onload = () => {
    const vaultUI = new VaultUI();
    
    // Initialize save system
    vaultUI.setupSaveControls();
    
    // Setup autosave every 5 minutes with success check
    setInterval(() => {
      const success = vaultUI.saveGame();
      if (!success) {
        console.warn('Autosave failed, attempting recovery...');
        vaultUI.recoverFromBackup();
      }
    }, 300000);
  };
  
  
  // Simulate resource changes for demo
  setInterval(() => {
    vaultUI.resources.food = Math.max(0, vaultUI.resources.food - 1);
    vaultUI.resources.water = Math.max(0, vaultUI.resources.water - 1);
    vaultUI.resources.power = Math.max(0, vaultUI.resources.power - 1);
    
    // Random resource boosts
    if (Math.random() > 0.8) {
      const randomResource = ['food', 'water', 'power'][Math.floor(Math.random() * 3)];
      vaultUI.resources[randomResource] += 10;
    }
    
    vaultUI.updateResourceDisplay();
    vaultUI.updateExpandButton();
  }, 2000);
});