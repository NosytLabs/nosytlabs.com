/**
 * Vault Shelter Game Core Module
 * Implements security fixes, architectural improvements and optimizations
 * from vault-shelter-game-context.md audit report
 */

// Helper: Rate limiting decorator
const rateLimit = (fn, delay, methodName = 'method') => {
    let lastCall = 0;
    return (...args) => {
        const now = Date.now();
        if (now - lastCall < delay) {
            // Throwing an error might be too disruptive, consider logging or returning null/false
            console.warn(`Rate limit exceeded for ${methodName}. Wait ${delay - (now - lastCall)}ms`);
            // throw new RateLimitError(`API call rate limited. Wait ${delay - (now - lastCall)}ms`, { method: methodName, delay });
            return; // Or return a specific value indicating rate limit
        }
        lastCall = now;
        return fn(...args);
    };
};

// Helper: Debounce function
function debounce(fn, delay) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
    };
}

// Custom error hierarchy
class VaultError extends Error {
    constructor(message, details = {}) {
        super(message);
        this.name = this.constructor.name;
        this.details = details;
        this.timestamp = Date.now();
        Error.captureStackTrace?.(this, this.constructor); // Capture stack trace if available
    }

    toJSON() {
        return {
            name: this.name,
            message: this.message,
            details: this.details,
            timestamp: this.timestamp
        };
    }
}

class ValidationError extends VaultError {
    constructor(message, field, value) {
        super(message, { field, value });
    }
}

class RateLimitError extends VaultError {
    constructor(message, { method, delay, nextAllowed }) {
        super(message, { method, delay, nextAllowed });
    }
}

class StateError extends VaultError {
    constructor(message, state) {
        super(message, { state });
    }
}

class ResourceError extends VaultError {
    constructor(message, resource) {
        super(message, { resource });
    }
}

class CollisionError extends VaultError {
     constructor(message, dwellerId1, dwellerId2) {
         super(message, { dwellerId1, dwellerId2 });
     }
}

class NetworkError extends VaultError {
    constructor(message, url) {
        super(message, { url });
    }
}


// Game Core Module
const VaultShelterGame = (() => {
    // Object pool (defined early for use in monitor cleanup)
    const objectPool = {
        dwellers: [],
        rooms: [],
        getDweller: () => objectPool.dwellers.pop() || {},
        getRoom: () => objectPool.rooms.pop() || {},
        recycle: (obj) => {
            if (!obj) return;
            // Reset common properties before pooling
            obj.position = { x: 0, y: 0 };
            obj._lastMoveTime = 0;
            // Add other resets as needed

            if (obj.type === 'dweller') objectPool.dwellers.push(obj);
            else if (obj.type === 'room') objectPool.rooms.push(obj);
        },
        clear: () => {
            objectPool.dwellers.length = 0;
            objectPool.rooms.length = 0;
            console.log('Object pools cleared.');
        }
    };

    // Private state with monitoring
    const state = {
        dwellers: new Map(),
        rooms: new Map(),
        resources: {
            power: 100,
            food: 100,
            water: 100
        },
        events: new Set(),
        _monitor: {
            // --- Existing Properties ---
            lastUpdate: Date.now(),
            memoryUsage: 0,
            fps: 0,
            frameBudget: 16.67, // Target 60fps = ~16.67ms/frame
            frameTime: 0,
            collisionChecks: 0,
            skippedFrames: 0, // Needs logic to increment this
            _lastFpsUpdate: Date.now(),
            _frameCount: 0,
            _frameTimes: new Array(60).fill(0), // Rolling window of last 60 frame times
            _frameTimeIndex: 0,
            _lastCollisionChecks: 0,

            // --- Enhanced Properties ---
            longFrames: 0, // Count frames exceeding budget in the last second
            layoutShiftScore: 0, // Cumulative Layout Shift score
            longTasksCount: 0, // Count tasks > 50ms
            _leakThresholdBytesPerSec: 1024 * 1024 * 1, // 1MB/sec growth threshold
            _lastMemoryValues: [], // Stores { timestamp, usage } for leak detection
            _perfObserver: null, // PerformanceObserver instance

            // --- Enhanced Methods ---
            updateMemoryUsage() {
                // Use optional chaining for performance.memory
                const currentUsage = performance.memory?.usedJSHeapSize || 0;
                const now = Date.now();

                // Track memory readings with timestamps (approx last 2 seconds)
                this._lastMemoryValues.push({ timestamp: now, usage: currentUsage });
                while (this._lastMemoryValues.length > 120) { // Keep ~2 seconds of data
                    this._lastMemoryValues.shift();
                }

                // Check for memory growth trend using slope over the last second
                if (this._lastMemoryValues.length >= 60) {
                    const firstRelevantIndex = Math.max(0, this._lastMemoryValues.length - 60);
                    const first = this._lastMemoryValues[firstRelevantIndex];
                    const last = this._lastMemoryValues[this._lastMemoryValues.length - 1];
                    const durationSeconds = (last.timestamp - first.timestamp) / 1000;

                    if (durationSeconds >= 0.9) { // Ensure at least ~1 second duration
                        const growthRateBytesPerSec = (last.usage - first.usage) / durationSeconds;

                        if (growthRateBytesPerSec > this._leakThresholdBytesPerSec) {
                            console.warn(`Potential memory leak: ${(growthRateBytesPerSec / (1024 * 1024)).toFixed(2)} MB/sec growth over ${durationSeconds.toFixed(1)}s`);
                            if (growthRateBytesPerSec > this._leakThresholdBytesPerSec * 5) {
                                console.error('Critical memory leak detected - triggering cleanup');
                                this.triggerCleanup();
                            }
                        }
                    }
                }
                this.memoryUsage = currentUsage;
                this.lastUpdate = now;
            },

            // Accepts delta (time since last frame in ms) from the game loop
            updateFrameTime(delta) {
                // Ensure delta is a valid number
                const validDelta = typeof delta === 'number' && isFinite(delta) ? Math.max(0, delta) : this.frameBudget; // Use budget as fallback

                this._frameTimes[this._frameTimeIndex] = validDelta;
                this._frameTimeIndex = (this._frameTimeIndex + 1) % 60;
                this.frameTime = validDelta; // Store the latest frame delta

                // Check if this frame exceeded the budget
                if (validDelta > this.frameBudget * 1.1) { // Allow 10% buffer
                    this.longFrames++;
                     // console.warn(`Long frame detected: ${validDelta.toFixed(2)}ms`);
                }
            },

            triggerCleanup() {
                console.warn('Attempting GC and clearing object pools due to potential leak...');
                if (typeof gc === 'function') {
                    try { gc(); } catch (e) { console.error('Error during explicit GC:', e); }
                }
                // Use the objectPool defined in the outer scope
                objectPool.clear();
            },

            // Accepts the current timestamp from the game loop
            updateFps(timestamp) {
                 if (!timestamp || typeof timestamp !== 'number') {
                     timestamp = Date.now(); // Fallback if timestamp is invalid
                 }
                this._frameCount++;
                const elapsed = timestamp - this._lastFpsUpdate;

                if (elapsed >= 1000) {
                    this.fps = Math.round((this._frameCount * 1000) / elapsed);
                    this._frameCount = 0;
                    this._lastFpsUpdate = timestamp;

                    if (this.fps < 50 && this.fps > 0) { // Avoid warning on initial 0 fps
                         const avgFrameTime = this._frameTimes.reduce((sum, t) => sum + t, 0) / this._frameTimes.length;
                        console.warn(`Low FPS: ${this.fps}. Avg Frame Time: ${avgFrameTime.toFixed(2)}ms`);
                    }
                     // Reset per-second counters here
                     this.longFrames = 0;
                     this.longTasksCount = 0;
                }
            },

            logPerformance() {
                const avgFrameTime = this._frameTimes.reduce((sum, t) => sum + t, 0) / this._frameTimes.length;
                console.table({
                    'FPS': this.fps,
                    'Frame Time Avg (ms)': avgFrameTime.toFixed(2),
                    'Frame Time Max (ms)': Math.max(...this._frameTimes).toFixed(2),
                    'Long Frames (/sec)': this.longFrames, // Shows count since last log/reset
                    'Memory (MB)': (this.memoryUsage / (1024 * 1024)).toFixed(2),
                    'Layout Shift Score': this.layoutShiftScore.toFixed(4),
                    'Long Tasks (>50ms)': this.longTasksCount, // Shows count since last log/reset
                    'Collision Checks': this.collisionChecks, // Assuming this is updated elsewhere
                    'Skipped Frames': this.skippedFrames // Assuming this is updated elsewhere
                });
                 // Reset counters after logging for per-second view (moved from updateFps)
                 // this.longFrames = 0; // Resetting here means table shows cumulative since last reset
                 // this.longTasksCount = 0;
                 // CLS is cumulative, usually not reset this way
            },

            initPerformanceObserver() {
                if (!window.PerformanceObserver) {
                    console.warn('PerformanceObserver API not supported.'); return;
                }
                try {
                    // Disconnect existing observer if any
                    this.disconnectObserver();

                    this._perfObserver = new PerformanceObserver((entryList) => {
                        for (const entry of entryList.getEntries()) {
                            if (entry.entryType === 'layout-shift' && !entry.hadRecentInput) {
                                this.layoutShiftScore += entry.value;
                            } else if (entry.entryType === 'longtask') {
                                this.longTasksCount++;
                                console.warn(`Long Task detected: ${entry.duration.toFixed(1)}ms`, entry);
                            }
                        }
                    });
                    // Use buffered: true to get entries that occurred before observe() was called
                    this._perfObserver.observe({ entryTypes: ['layout-shift', 'longtask'], buffered: true });
                    console.log('PerformanceObserver initialized.');
                } catch (e) {
                    console.error('Failed to initialize PerformanceObserver:', e);
                }
            },

            disconnectObserver() {
                if (this._perfObserver) {
                    this._perfObserver.disconnect();
                    this._perfObserver = null;
                    console.log('PerformanceObserver disconnected.');
                }
            }
        },
        // --- Spatial Grid Properties (moved inside state) ---
        _spatialGrid: new Map(),
        _gridSize: 50, // Cell size in pixels/game units - adjust based on typical entity size/movement
    };

    // Initialize the performance observer immediately after state definition
    if (state._monitor && typeof state._monitor.initPerformanceObserver === 'function') {
        state._monitor.initPerformanceObserver();
    }

    // HTML sanitization utility
    const sanitize = (str) => {
        if (typeof str !== 'string') return '';
        // Prefer DOMPurify if available
        if (window.DOMPurify && typeof window.DOMPurify.sanitize === 'function') {
            return window.DOMPurify.sanitize(str);
        }
        // Basic fallback
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    };

    // Input validation
    const validate = {
        dwellerName: (name) => {
            if (typeof name !== 'string' || name.trim().length === 0 || name.length > 50 || !/^[\p{L}\p{N}\s-]+$/u.test(name)) {
                 return 'Invalid dweller name (must be 1-50 chars, letters/numbers/spaces/hyphens)';
            }
            return true;
        },
        roomName: (name) => {
             if (typeof name !== 'string' || name.trim().length === 0 || name.length > 30 || !/^[\p{L}\p{N}\s-]+$/u.test(name)) {
                 return 'Invalid room name (must be 1-30 chars, letters/numbers/spaces/hyphens)';
             }
            return true;
        },
        resourceValue: (value) => {
            if (!Number.isInteger(value) || value < 0 || value > 10000) { // Increased max resource limit
                return 'Invalid resource value (must be integer 0-10000)';
            }
            return true;
        },
        dwellerSkill: (skill) => {
            const allowedSkills = new Set(['medical', 'engineering', 'science', 'maintenance', 'farming', 'security']);
            if (typeof skill !== 'string' || !allowedSkills.has(skill.toLowerCase())) {
                return `Invalid skill. Allowed: ${[...allowedSkills].join(', ')}`;
            }
            return true;
        },
        position: (pos) => {
            if (typeof pos !== 'object' || pos === null || typeof pos.x !== 'number' || typeof pos.y !== 'number' || !isFinite(pos.x) || !isFinite(pos.y)) {
                return 'Invalid position (must have finite numeric x, y)';
            }
            // Add boundary checks if applicable
            // if (pos.x < 0 || pos.x > MAX_X || pos.y < 0 || pos.y > MAX_Y) return 'Position out of bounds';
            return true;
        }
    };

    // --- Spatial Grid Functions (defined within the IIFE scope) ---
    function _getGridKey(position) {
        if (!position || typeof position.x !== 'number' || typeof position.y !== 'number') return 'invalid';
        return `${Math.floor(position.x / state._gridSize)},${Math.floor(position.y / state._gridSize)}`;
    }

    function _updateSpatialGrid(entity, oldPosition) {
        const oldKey = oldPosition ? _getGridKey(oldPosition) : null; // Handle initial add
        const newKey = _getGridKey(entity.position);

        // Remove from old cell if key changed and oldKey is valid
        if (oldKey && oldKey !== 'invalid' && oldKey !== newKey) {
            const oldCell = state._spatialGrid.get(oldKey);
            if (oldCell) {
                const index = oldCell.indexOf(entity.id);
                if (index > -1) {
                    oldCell.splice(index, 1);
                }
                if (oldCell.length === 0) {
                    state._spatialGrid.delete(oldKey);
                }
            }
        }

        // Add to new cell if newKey is valid
        if (newKey !== 'invalid') {
            if (!state._spatialGrid.has(newKey)) {
                state._spatialGrid.set(newKey, []);
            }
            const newCell = state._spatialGrid.get(newKey);
            // Avoid duplicates
            if (!newCell.includes(entity.id)) {
                 newCell.push(entity.id);
            }
        }
    }

     function _getNearbyEntityIds(position) {
        const key = _getGridKey(position);
        if (key === 'invalid') return new Set(); // Return empty set for invalid positions

        const [x, y] = key.split(',').map(Number);
        const nearbyIds = new Set(); // Use Set to avoid duplicates

        // Check current and 8 adjacent cells
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                const cellKey = `${x + dx},${y + dy}`;
                const entitiesInCell = state._spatialGrid.get(cellKey) || [];
                entitiesInCell.forEach(id => nearbyIds.add(id));
            }
        }
        return nearbyIds;
    }

    // --- Public API ---
    // Define the API object first
    const api = {
        // Expose state for debugging or specific UI needs (use carefully)
        // Consider providing specific getters instead of exposing raw state
        get state() { return state; },

        // --- Core Methods ---
        addDweller(name, skills) {
            const nameValidation = validate.dwellerName(name);
            if (nameValidation !== true) throw new ValidationError(nameValidation, 'name', name);
            if (!Array.isArray(skills)) throw new ValidationError('Skills must be an array', 'skills', skills);

            const skillValidations = skills.map(validate.dwellerSkill);
            const invalidSkills = skillValidations.filter(res => res !== true);
            if (invalidSkills.length > 0) {
                throw new ValidationError(`Invalid skills: ${invalidSkills.join('; ')}`, 'skills', skills);
            }

            const dweller = objectPool.getDweller();
            const id = crypto.randomUUID();
            Object.assign(dweller, {
                id: id,
                name: sanitize(name),
                skills: skills.map(skill => sanitize(skill.toLowerCase())),
                type: 'dweller',
                position: { x: Math.random() * 100, y: Math.random() * 100 }, // Random initial position
                radius: 10, // Example radius
                _lastMoveTime: 0,
                _version: 1 // For component caching
            });
            state.dwellers.set(id, dweller);
            _updateSpatialGrid(dweller, null); // Add to grid
            return id;
        },

        addRoom(name, type) {
            const nameValidation = validate.roomName(name);
            if (nameValidation !== true) throw new ValidationError(nameValidation, 'name', name);
            // Add validation for room type if needed

            const room = objectPool.getRoom();
             const id = crypto.randomUUID();
            Object.assign(room, {
                id: id,
                name: sanitize(name),
                roomType: sanitize(type), // Sanitize type as well
                type: 'room',
                 _version: 1
            });
            state.rooms.set(id, room);
            return id;
        },

        updateResource(resource, value) {
            const valueValidation = validate.resourceValue(value);
            if (valueValidation !== true) throw new ValidationError(valueValidation, resource, value);
            if (!state.resources.hasOwnProperty(resource)) {
                throw new ResourceError('Invalid resource type', resource);
            }

            // Optional: Add logic for resource caps or dependencies
            state.resources[resource] = value;
            return state.resources[resource];
        },

        // --- Movement & Collision ---
        moveDweller(dwellerId, newPosition) {
            if (typeof dwellerId !== 'string' || !dwellerId) {
                throw new ValidationError('Invalid dweller ID', 'dwellerId', dwellerId);
            }
            const dweller = state.dwellers.get(dwellerId);
            if (!dweller) throw new StateError('Dweller not found', { dwellerId });

            const posValidation = validate.position(newPosition);
            if (posValidation !== true) {
                throw new ValidationError(posValidation, 'position', newPosition);
            }

            // Collision check using spatial grid
            state._monitor.collisionChecks = 0; // Reset counter for this move
            const nearbyIds = _getNearbyEntityIds(newPosition);
            for (const otherId of nearbyIds) {
                if (otherId === dwellerId) continue; // Don't check against self

                const otherDweller = state.dwellers.get(otherId);
                if (!otherDweller) continue; // Skip if other entity not found (shouldn't happen ideally)

                state._monitor.collisionChecks++;
                // Use 'this.checkCollision' since it's part of the API object now
                if (this.checkCollision({ ...dweller, position: newPosition }, otherDweller)) {
                    throw new CollisionError('Cannot move - collision detected', dwellerId, otherId);
                }
            }

            const oldPosition = { ...dweller.position }; // Copy old position
            dweller.position = newPosition;
            dweller._lastMoveTime = Date.now();
            dweller._version = (dweller._version || 0) + 1; // Increment version for UI update
            _updateSpatialGrid(dweller, oldPosition); // Update grid position

            return dweller.position;
        },

        // Collision check logic (can be optimized further)
        checkCollision(dweller1, dweller2) {
            if (!dweller1?.position || !dweller2?.position) return false;

            const radius1 = dweller1.radius || 10;
            const radius2 = dweller2.radius || 10;
            const minDist = radius1 + radius2;

            // Simple AABB check (Axis-Aligned Bounding Box) for quick rejection
            if (Math.abs(dweller1.position.x - dweller2.position.x) > minDist ||
                Math.abs(dweller1.position.y - dweller2.position.y) > minDist) {
                return false;
            }

            // Precise circular collision check
            const dx = dweller1.position.x - dweller2.position.x;
            const dy = dweller1.position.y - dweller2.position.y;
            const distanceSquared = dx * dx + dy * dy;

            return distanceSquared < minDist * minDist;
        },

        // --- Event System ---
        addEvent(type, data, ttl = 60000) {
            if (typeof type !== 'string' || !type) {
                throw new ValidationError('Event type must be a non-empty string', 'type', type);
            }

            const event = {
                id: crypto.randomUUID(),
                type: sanitize(type), // Sanitize event type
                data, // Data might need sanitization depending on usage
                timestamp: Date.now(),
                ttl
            };

            // Cleanup expired events first (can be optimized to run less frequently)
            const now = Date.now();
            state.events.forEach(ev => {
                if (now - ev.timestamp > ev.ttl) {
                    state.events.delete(ev);
                }
            });

            state.events.add(event);

            // Schedule cleanup for this specific event
            setTimeout(() => {
                state.events.delete(event);
            }, ttl);

            return event;
        },

        // --- State Management ---
        getState() {
            // Return a deep copy or structured clone for safety if state is complex
            try {
                 // Use structuredClone for a more robust deep copy if available
                 if (typeof structuredClone === 'function') {
                     return structuredClone({
                         version: 1,
                         timestamp: Date.now(),
                         dwellers: Array.from(state.dwellers.values()),
                         rooms: Array.from(state.rooms.values()),
                         resources: state.resources,
                         events: Array.from(state.events)
                         // Note: _monitor and _spatialGrid are internal, not usually part of saved state
                     });
                 } else {
                     // Fallback to JSON stringify/parse (less performant, potential data type issues)
                     return JSON.parse(JSON.stringify({
                         version: 1,
                         timestamp: Date.now(),
                         dwellers: Array.from(state.dwellers.values()),
                         rooms: Array.from(state.rooms.values()),
                         resources: state.resources,
                         events: Array.from(state.events)
                     }));
                 }
            } catch (e) {
                 console.error("Error cloning game state:", e);
                 // Return a basic structure on error
                 return { version: 1, timestamp: Date.now(), dwellers: [], rooms: [], resources: {}, events: [] };
            }
        },

        loadState(savedState) {
            if (!savedState || typeof savedState !== 'object') {
                 throw new StateError('Invalid saved state data: not an object');
            }
            if (!savedState.version || savedState.version !== 1) {
                throw new StateError(`Invalid state version: ${savedState.version}. Expected: 1`);
            }

            // Basic validation and sanitization before loading
            try {
                const dwellers = new Map();
                (savedState.dwellers || []).forEach(d => {
                    if (d && d.id && validate.dwellerName(d.name) === true) {
                        // Ensure position exists and is valid
                        const posValidation = validate.position(d.position);
                        dwellers.set(d.id, {
                             ...d,
                             name: sanitize(d.name),
                             skills: (d.skills || []).map(s => sanitize(s)),
                             position: posValidation === true ? d.position : { x: 0, y: 0 } // Default position if invalid
                         });
                    } else {
                         console.warn("Skipping invalid dweller data during load:", d);
                    }
                });

                const rooms = new Map();
                 (savedState.rooms || []).forEach(r => {
                     if (r && r.id && validate.roomName(r.name) === true) {
                         rooms.set(r.id, { ...r, name: sanitize(r.name), roomType: sanitize(r.roomType) });
                     } else {
                          console.warn("Skipping invalid room data during load:", r);
                     }
                 });

                 const resources = { power: 100, food: 100, water: 100 };
                 if (savedState.resources) {
                     Object.keys(resources).forEach(key => {
                         if (savedState.resources.hasOwnProperty(key) && validate.resourceValue(savedState.resources[key]) === true) {
                             resources[key] = savedState.resources[key];
                         }
                     });
                 }

                 const events = new Set();
                  (savedState.events || []).forEach(e => {
                      if (e && e.id && typeof e.type === 'string' && e.timestamp && e.ttl) {
                           const loadedEvent = { ...e, type: sanitize(e.type) };
                          events.add(loadedEvent);
                          // Re-schedule cleanup timers for loaded events
                          const remainingTtl = loadedEvent.ttl - (Date.now() - loadedEvent.timestamp);
                          if (remainingTtl > 0) {
                               setTimeout(() => state.events.delete(loadedEvent), remainingTtl);
                          } else {
                               // Event already expired, remove immediately (or don't add)
                               events.delete(loadedEvent);
                          }
                      } else {
                           console.warn("Skipping invalid event data during load:", e);
                      }
                  });

                // Atomically update state
                state.dwellers = dwellers;
                state.rooms = rooms;
                state.resources = resources;
                state.events = events;
                state._spatialGrid.clear(); // Rebuild spatial grid
                state.dwellers.forEach(dweller => _updateSpatialGrid(dweller, null));

                console.log("Game state loaded successfully.");

            } catch (error) {
                 console.error("Error loading state:", error);
                 throw new StateError('Failed to load state due to error', error);
            }
        },

        // --- Update Cycle Hook ---
        // This is the function expected to be called by the gameLoop
        update(timestamp, delta) {
            // 1. Update Performance Monitor
            state._monitor.updateFrameTime(delta);
            state._monitor.updateFps(timestamp);
            state._monitor.updateMemoryUsage(); // Can be called less frequently if needed

            // 2. Process Game Logic (example: move dwellers)
            // Convert delta from ms to seconds for physics/movement calculations
            const deltaSeconds = delta / 1000;
            state.dwellers.forEach(dweller => {
                // Example movement logic - replace with actual game logic
                // This should ideally be more sophisticated (e.g., pathfinding, AI)
                const moveSpeed = 20; // units per second
                const moveAmount = moveSpeed * deltaSeconds;
                const angle = (dweller._moveAngle || Math.random() * 2 * Math.PI); // Maintain angle or randomize
                dweller._moveAngle = angle; // Store angle for next frame

                const newX = dweller.position.x + Math.cos(angle) * moveAmount;
                const newY = dweller.position.y + Math.sin(angle) * moveAmount;

                // Basic boundary check & bounce
                let boundedX = newX;
                let boundedY = newY;
                let bounced = false;
                if (newX < 0 || newX > 500) { // Assuming 0-500 bounds
                     boundedX = Math.max(0, Math.min(500, newX));
                     dweller._moveAngle = Math.PI - angle; // Reflect angle horizontally
                     bounced = true;
                }
                 if (newY < 0 || newY > 300) { // Assuming 0-300 bounds
                     boundedY = Math.max(0, Math.min(300, newY));
                     dweller._moveAngle = -angle; // Reflect angle vertically
                     bounced = true;
                 }
                 if (bounced) dweller._moveAngle += (Math.random() - 0.5) * 0.1; // Add slight randomness on bounce


                try {
                    // Use the moveDweller method for collision checks and grid updates
                    this.moveDweller(dweller.id, { x: boundedX, y: boundedY });
                } catch (error) {
                    if (error instanceof CollisionError) {
                         // Handle collision: Simple bounce off
                         dweller._moveAngle = (dweller._moveAngle + Math.PI + (Math.random() - 0.5) * 0.5) % (2 * Math.PI);
                    } else {
                         console.warn(`Error moving dweller ${dweller.id}:`, error.message);
                    }
                }
            });

            // 3. Process Events (example)
            // state.events.forEach(event => { /* handle events */ });

            // 4. Update Resources (example: decay over time)
            // state.resources.food = Math.max(0, state.resources.food - 0.01 * deltaSeconds);
            // state.resources.water = Math.max(0, state.resources.water - 0.015 * deltaSeconds);

            // 5. Trigger UI Render (assuming a separate UI update mechanism)
            // This might involve calling methods on VaultShelterUI or dispatching an event
            if (typeof VaultShelterUI !== 'undefined' && typeof VaultShelterUI.requestRender === 'function') {
                 VaultShelterUI.requestRender(); // Example: Tell UI to re-render
            }
        },

         // --- Cleanup ---
         destroy() {
             console.log("Destroying VaultShelterGame instance...");
             state._monitor.disconnectObserver(); // Disconnect performance observer
             // Add other cleanup logic: clear intervals/timeouts, remove listeners
             state.dwellers.clear();
             state.rooms.clear();
             state.events.clear();
             state._spatialGrid.clear();
             objectPool.clear();
         }
    };

    // Apply rate limiting to selected public methods
    const methodsToRateLimit = ['addDweller', 'addRoom', 'updateResource', 'addEvent'];
    methodsToRateLimit.forEach(methodName => {
        if (typeof api[methodName] === 'function') {
            api[methodName] = rateLimit(api[methodName], 100, methodName); // 100ms delay
        }
    });

    // Return the public API
    return api;
})();


// UI Module
const VaultShelterUI = (() => {
    // Component cache
    const componentCache = new Map();

    // VDOM render function
    const render = (vnode, container, oldVNode = null) => {
         // Handle text nodes
        if (typeof vnode === 'string' || typeof vnode === 'number') {
            const textContent = String(vnode);
            // If container is a text node and content differs, update it
            if (container?.nodeType === Node.TEXT_NODE) {
                if (container.textContent !== textContent) {
                    container.textContent = textContent;
                }
                return container;
            }
            // If oldVNode was different type or container is wrong, create/replace with text node
            if (oldVNode === null || typeof oldVNode !== 'string' && typeof oldVNode !== 'number') {
                 const textNode = document.createTextNode(textContent);
                 if (container && container.parentNode) {
                     container.parentNode.replaceChild(textNode, container);
                 }
                 return textNode;
            }
             // If container exists but isn't text, set textContent (less ideal)
             if (container) {
                 container.textContent = textContent;
                 return container;
             }
             // Should not happen if called correctly, but create text node as fallback
             return document.createTextNode(textContent);
        }

        // Handle null/undefined vnodes (representing removal)
        if (vnode === null || vnode === undefined) {
            if (oldVNode?.domNode && oldVNode.domNode.parentNode) {
                oldVNode.domNode.parentNode.removeChild(oldVNode.domNode);
            }
            return null; // Indicate node removal
        }

        // --- Element Nodes ---
        let element = oldVNode?.domNode;
        const isNewElement = !element || element.nodeName.toLowerCase() !== vnode.tag.toLowerCase();

        // Create new DOM element if needed
        if (isNewElement) {
            element = document.createElement(vnode.tag);
            vnode.domNode = element; // Assign early for children reconciliation
             if (oldVNode?.domNode && oldVNode.domNode.parentNode) {
                 // Replace the old node in the parent if it exists
                 oldVNode.domNode.parentNode.replaceChild(element, oldVNode.domNode);
             } else if (container && container !== oldVNode?.domNode) {
                  // Append to container if it's the initial render or replacing a text node
                  // This assumes `container` is the parent where `element` should live
                  container.appendChild(element);
             }
        } else {
             vnode.domNode = element; // Reuse existing DOM node
        }


        // Update attributes/props
        const oldProps = oldVNode?.props || {};
        const newProps = vnode.props || {};

        // Remove old props/listeners that are not in new props
        for (const key in oldProps) {
            if (!(key in newProps) && key !== 'children' && key !== 'key') {
                if (key.startsWith('on') && typeof oldProps[key] === 'function') {
                    element.removeEventListener(key.substring(2).toLowerCase(), oldProps[key]);
                } else {
                    element.removeAttribute(key === 'className' ? 'class' : key);
                }
            }
        }

        // Add/update new props/listeners
        for (const key in newProps) {
            const oldValue = oldProps[key];
            const newValue = newProps[key];

            if (oldValue !== newValue && key !== 'children' && key !== 'key') {
                if (key.startsWith('on') && typeof newValue === 'function') {
                    const eventName = key.substring(2).toLowerCase();
                    if (typeof oldValue === 'function') {
                        element.removeEventListener(eventName, oldValue); // Remove old listener first
                    }
                    element.addEventListener(eventName, newValue);
                } else if (key === 'style' && typeof newValue === 'object') {
                     Object.assign(element.style, newValue); // Simpler style update
                     // Consider removing styles present in oldValue but not newValue if necessary
                } else if (key === 'className') {
                     element.setAttribute('class', newValue);
                } else if (key === 'value' || key === 'checked' || key === 'selected') {
                     // Handle properties directly for form elements
                     element[key] = newValue;
                } else {
                    element.setAttribute(key, newValue);
                }
            }
        }

        // Reconcile children
        const oldChildren = oldVNode?.children || [];
        const newChildren = vnode.children || [];
        const commonLength = Math.min(oldChildren.length, newChildren.length);

        // Update existing children
        for (let i = 0; i < commonLength; i++) {
            render(newChildren[i], element.childNodes[i], oldChildren[i]);
        }

        // Add new children
        if (newChildren.length > oldChildren.length) {
            for (let i = commonLength; i < newChildren.length; i++) {
                 const newNode = render(newChildren[i], document.createElement(newChildren[i].tag || 'div')); // Create with temp parent
                 if (newNode) element.appendChild(newNode); // Append the actual node
            }
        }
        // Remove surplus old children
        else if (oldChildren.length > newChildren.length) {
            for (let i = oldChildren.length - 1; i >= commonLength; i--) {
                 if (element.childNodes[i]) { // Check if node exists before removing
                     element.removeChild(element.childNodes[i]);
                 }
            }
        }

        return element; // Return the reconciled/created element
    };

    // --- VDOM Helper ---
    const createElement = (tag, props, ...children) => {
        return {
            tag,
            props: props || {},
            children: children.flat().filter(c => c !== null && c !== undefined), // Flatten and filter null/undefined children
            key: props?.key // Extract key for reconciliation
        };
    };


    // --- Components (Example DwellerComponent) ---
    const DwellerComponent = (dweller) => {
        if (!dweller || !dweller.id) return null;

        const cacheKey = `dweller-${dweller.id}`;
        const cached = componentCache.get(cacheKey);

        if (cached && cached.dwellerVersion === dweller._version) {
            return cached.vnode;
        }

        const vnode = createElement(
            'div',
            {
                class: 'dweller-card',
                'data-id': dweller.id,
                key: dweller.id,
                style: {
                     position: 'absolute',
                     left: `${dweller.position?.x || 0}px`,
                     top: `${dweller.position?.y || 0}px`,
                     border: '1px solid #555', // Darker border
                     padding: '4px 8px',
                     background: 'rgba(40, 40, 40, 0.8)', // Darker background
                     borderRadius: '4px',
                     color: '#eee', // Lighter text
                     fontSize: '12px',
                     transition: 'left 0.1s linear, top 0.1s linear' // Smooth movement
                }
            },
            createElement('h4', { style: { margin: '0 0 4px 0', fontSize: '13px' } }, dweller.name),
            createElement(
                'ul',
                { class: 'skills-list', style: { listStyle: 'none', padding: 0, margin: 0, display: 'flex', gap: '4px' } },
                ...(dweller.skills || []).map(skill =>
                    createElement('li', { key: skill, style: { background: '#333', padding: '1px 3px', borderRadius: '2px' } }, skill)
                )
            )
        );

        componentCache.set(cacheKey, {
            vnode,
            dwellerVersion: dweller._version
        });
        return vnode;
    };

     const RoomComponent = (room) => {
         if (!room || !room.id) return null;
         // Add caching if room state changes frequently
         return createElement(
             'div',
             { class: `room-card room-${room.roomType}`, key: room.id, style: { border: '1px dashed #666', padding: '10px', margin: '5px' } },
             `${room.name} (${room.roomType})`
         );
     };

     const ResourceComponent = ({ name, value }) => {
          if (!name) return null;
          // Add caching if needed
         return createElement(
             'div',
             { class: 'resource-display', key: name, style: { marginRight: '15px', color: '#9f9' } }, // Greenish text
             `${name.charAt(0).toUpperCase() + name.slice(1)}: ${value}` // Capitalize name
         );
     };


    // --- Public UI API ---
    const uiApi = {
         _rootContainer: null,
         _currentVNode: null,
         _renderRequested: false,

         init(containerSelector) {
             this._rootContainer = document.querySelector(containerSelector);
             if (!this._rootContainer) {
                 console.error(`UI container "${containerSelector}" not found.`);
                 return;
             }
             // Initial empty structure
             this._currentVNode = createElement('div', { id: 'game-root', style: { position: 'relative', width: '500px', height: '300px', border: '1px solid white', overflow: 'hidden', background: '#222' } }); // Basic container style
             render(this._currentVNode, this._rootContainer);
             console.log("VaultShelterUI initialized.");
         },

         renderUI(gameState) {
             if (!this._rootContainer || !gameState) return;

             const newVNode = createElement(
                 'div',
                 { id: 'game-root', style: { position: 'relative', width: '500px', height: '300px', border: '1px solid white', overflow: 'hidden', background: '#222' } }, // Ensure root style persists
                 createElement('div', { class: 'resources', style: { position: 'absolute', top: '5px', left: '5px', display: 'flex', background: 'rgba(0,0,0,0.5)', padding: '3px 5px', borderRadius: '3px', zIndex: 10 } },
                     Object.entries(gameState.resources || {}).map(([name, value]) =>
                         ResourceComponent({ name, value })
                     )
                 ),
                 createElement('div', { class: 'rooms', style: { marginTop: '30px' /* Space for resources */ } },
                     (gameState.rooms || []).map(room => RoomComponent(room))
                 ),
                 createElement('div', { class: 'dwellers', style: { position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' } }, // Dwellers overlay the rooms
                     (gameState.dwellers || []).map(dweller => DwellerComponent(dweller))
                 ),
                 createElement('div', { class: 'events', style: { position: 'absolute', bottom: '5px', left: '5px', color: 'yellow', fontSize: '11px', zIndex: 10 } },
                      (gameState.events || []).map(event =>
                          createElement('div', { class: `event ${event.type}`, key: event.id }, `${event.type}`) // Simpler event display
                      )
                 )
             );

             render(newVNode, this._rootContainer.firstChild || this._rootContainer, this._currentVNode); // Render into the #game-root div
             this._currentVNode = newVNode;
         },

         // Debounced render request
         requestRender: debounce(function() {
             if (!this._renderRequested) return; // Check flag
             const currentState = VaultShelterGame.getState();
             this.renderUI(currentState);
             this._renderRequested = false; // Reset flag
         }, 0), // Debounce by 0ms effectively batches renders within the same event loop tick

         // Call this to flag that a render is needed
         flagRenderNeeded() {
             this._renderRequested = true;
             this.requestRender(); // Trigger the debounced render
         },

        clearCache() {
            componentCache.clear();
            console.log("UI component cache cleared.");
        }
    };

    return uiApi;
})();


// --- Initialization ---
document.addEventListener('DOMContentLoaded', () => {
    VaultShelterUI.init('#vault-game-container'); // Ensure this ID exists in your HTML

    // Assign the game update function to the window scope for gameLoop
    // Ensure VaultShelterGame is fully initialized before assigning
    if (VaultShelterGame && typeof VaultShelterGame.update === 'function') {
        window.updateGameState = VaultShelterGame.update.bind(VaultShelterGame);
    } else {
         console.error("VaultShelterGame or VaultShelterGame.update is not available.");
         return; // Stop initialization if core game logic is missing
    }

    // Start the game loop (assuming gameLoop is globally available or imported from performance-optimizations.js)
    if (typeof gameLoop === 'function') {
         requestAnimationFrame(gameLoop);
         console.log("Game loop started.");
    } else {
         console.error("gameLoop function not found. Cannot start game.");
    }

     // Load initial state
     try {
         const saved = localStorage.getItem('vaultShelterSave');
         if (saved) {
             VaultShelterGame.loadState(JSON.parse(saved));
             VaultShelterUI.flagRenderNeeded(); // Request render after loading state
         }
     } catch (e) {
         console.error("Failed to load saved game state:", e);
     }

     // Periodic save
     setInterval(() => {
         try {
             const stateToSave = VaultShelterGame.getState();
             localStorage.setItem('vaultShelterSave', JSON.stringify(stateToSave));
         } catch (e) {
             console.error("Failed to save game state:", e);
         }
     }, 30000);

     // Periodic performance log
      setInterval(() => {
          // Access monitor via the game instance's state
          if (VaultShelterGame?.state?._monitor?.logPerformance) {
               VaultShelterGame.state._monitor.logPerformance();
          }
      }, 5000);

      // Example: Add controls to test game functions
      const controlsDiv = document.getElementById('game-controls'); // Assuming this exists
      if (controlsDiv) {
          const addDwellerBtn = document.createElement('button');
          addDwellerBtn.textContent = 'Add Dweller';
          addDwellerBtn.id = 'add-dweller-button'; // ID used in tests
          addDwellerBtn.onclick = () => {
              try {
                  const name = `Dweller ${Math.floor(Math.random() * 1000)}`;
                  const skills = [['medical', 'science', 'engineering', 'farming'][Math.floor(Math.random() * 4)]];
                  VaultShelterGame.addDweller(name, skills);
                  // VaultShelterUI.flagRenderNeeded(); // Render is handled by game update loop now
              } catch (e) { console.error(e); }
          };
          controlsDiv.appendChild(addDwellerBtn);

          const addRoomBtn = document.createElement('button');
          addRoomBtn.textContent = 'Add Room';
           addRoomBtn.id = 'add-room-button'; // ID used in tests
          addRoomBtn.onclick = () => {
              try {
                  const type = ['living', 'reactor', 'medical'][Math.floor(Math.random() * 3)];
                  VaultShelterGame.addRoom(`${type} Room ${Math.floor(Math.random() * 100)}`, type);
                   // VaultShelterUI.flagRenderNeeded();
              } catch (e) { console.error(e); }
          };
          controlsDiv.appendChild(addRoomBtn);
      }

});

// --- Exports ---
// Ensure VaultShelterUI is exported if needed elsewhere
export { VaultShelterGame, VaultShelterUI, VaultError, ValidationError, RateLimitError, StateError, ResourceError, CollisionError, NetworkError };