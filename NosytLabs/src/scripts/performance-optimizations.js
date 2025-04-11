/**
 * Performance Optimizations for Vault Shelter Game
 * Implements optimizations from vault-shelter-game-context.md audit report
 */

// DOM element caching for frequently accessed elements
const domCache = new Map();
function getCachedElement(selector) {
    if (!domCache.has(selector)) {
        const element = document.querySelector(selector);
        if (element) domCache.set(selector, element);
        return element;
    }
    return domCache.get(selector);
}

// Web Worker for heavy computations with error handling
const gameWorker = new Worker('game-worker.js');
gameWorker.onerror = (e) => {
    console.error('Game worker error:', e);
    // Fallback to main thread if worker fails
    fallbackToMainThread();
};

// Object pooling for frequently created/destroyed objects
const objectPool = {
    particles: [],
    getParticle: () => objectPool.particles.pop() || {},
    recycle: (particle) => objectPool.particles.push(particle)
};

// Efficient event delegation with cleanup reference
const clickHandler = (e) => {
    if (e.target.matches('.dweller')) {
        handleDwellerClick(e.target.dataset.id);
    }
};
document.addEventListener('click', clickHandler, { passive: true });

// Cleanup function for event listeners
export function cleanupEventListeners() {
    document.removeEventListener('click', clickHandler);
    window.removeEventListener('resize', debouncedResize);
}

// Debounced resize handler
const debouncedResize = debounce(handleResize, 200);
window.addEventListener('resize', debouncedResize, { passive: true });

// Request Animation Frame batch updates
let lastFrameTime = 0;
const frameBudget = 16; // ~60fps

function gameLoop(timestamp) {
    // Calculate delta time since the last frame
    // Initialize lastFrameTime on the first call
    if (lastFrameTime === 0) {
        lastFrameTime = timestamp;
    }
    const delta = timestamp - lastFrameTime;
    lastFrameTime = timestamp; // Update lastFrameTime for the next iteration

    // Call the main game update function, passing timestamp and delta
    // The updateGameState function is responsible for updating the performance monitor
    // and handling rendering based on the delta time.
    // Removing the frameBudget check allows for variable timestep updates,
    // leading to smoother animations even if FPS fluctuates.
    if (typeof updateGameState === 'function') {
         updateGameState(timestamp, delta);
    } else {
         // Fallback or error if updateGameState is not defined
         console.error("updateGameState function is not defined or accessible.");
         // Optionally, stop the loop: return;
    }

    // Request the next frame
    requestAnimationFrame(gameLoop);
}

// Optimized memory management
const MAX_ENTITIES = 1000;
const entityCache = new Map();
let entityCount = 0;

function cacheEntity(entity) {
    if (entityCount >= MAX_ENTITIES) {
        entityCache.clear();
        entityCount = 0;
    }
    if (!entityCache.has(entity.id)) {
        entityCache.set(entity.id, entity);
        entityCount++;
    }
    return entityCache.get(entity.id);
}

// Utility functions
function debounce(fn, delay) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
    };
}

// WebGL optimizations
const gl = canvas.getContext('webgl', {
    powerPreference: 'high-performance',
    antialias: false
});

// Texture atlas with compression
const textureAtlas = new Map();
const compressedTextures = new Map();

function compressTexture(texture) {
    if (!compressedTextures.has(texture)) {
        // Use browser's native compression if available
        const compressed = gl.compressedTexImage2D(gl.TEXTURE_2D, 0,
            gl.COMPRESSED_RGBA_S3TC_DXT1_EXT,
            texture.width, texture.height, 0, texture.data);
        compressedTextures.set(texture, compressed);
    }
    return compressedTextures.get(texture);
}

// Frame rate monitoring
let frameCount = 0;
let lastFpsUpdate = performance.now();
const fpsSampleRate = 1000; // ms

function monitorFPS() {
    frameCount++;
    const now = performance.now();
    if (now - lastFpsUpdate >= fpsSampleRate) {
        const fps = (frameCount * 1000) / (now - lastFpsUpdate);
        if (fps < 55) {
            console.warn(`[Perf] Low FPS detected: ${fps.toFixed(1)}`);
        } else {
            console.log(`[Perf] FPS: ${fps.toFixed(1)}`);
        }
        frameCount = 0;
        lastFpsUpdate = now;
    }
}

function setupAnimationObserver() {
   if (typeof PerformanceObserver === 'undefined') {
       console.warn('[Perf] PerformanceObserver not supported');
       return;
   }
   try {
       const observer = new PerformanceObserver((list) => {
           for (const entry of list.getEntries()) {
               if (entry.entryType === 'element') {
                   const duration = entry.duration;
                   if (duration > 50) {
                       console.warn(`[Perf] Long CSS animation detected (${duration.toFixed(2)}ms):`, entry);
                   } else {
                       console.log(`[Perf] CSS animation (${duration.toFixed(2)}ms):`, entry);
                   }
               } else if (entry.entryType === 'longtask') {
                   console.warn(`[Perf] Long task detected (${entry.duration.toFixed(2)}ms):`, entry);
               }
           }
       });
       observer.observe({ entryTypes: ['element', 'longtask'] });
   } catch (e) {
       console.warn('[Perf] Failed to setup PerformanceObserver', e);
   }
}

// Export optimized functions
export {
   gameLoop,
   objectPool,
   debouncedResize,
   cacheEntity,
   textureAtlas,
   getCachedElement,
   cleanupEventListeners,
   compressTexture,
   monitorFPS,
   profileMemory,
   setupAnimationObserver
};

function profileMemory() {
    if (performance && performance.memory) {
        const mem = performance.memory;
        console.log(`[Perf] Memory usage: ${(mem.usedJSHeapSize / 1048576).toFixed(2)} MB / ${(mem.totalJSHeapSize / 1048576).toFixed(2)} MB (limit ${(mem.jsHeapSizeLimit / 1048576).toFixed(2)} MB)`);
    } else {
        console.log('[Perf] Memory profiling not supported in this browser.');
    }
}
