/**
 * Image Optimization Utilities
 * Advanced image loading and optimization strategies
 */

// Progressive image loading with blur-up effect
export function setupProgressiveImageLoading() {
  const images = document.querySelectorAll('img[data-src]');
  
  if ('IntersectionObserver' in window) {
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target as HTMLImageElement;
          loadImageProgressively(img);
          observer.unobserve(img);
        }
      });
    }, {
      rootMargin: '50px 0px',
      threshold: 0.01
    });

    images.forEach(img => imageObserver.observe(img));
  } else {
    // Fallback for older browsers
    images.forEach(img => loadImageProgressively(img as HTMLImageElement));
  }
}

// Load image with progressive enhancement
function loadImageProgressively(img: HTMLImageElement) {
  const src = img.dataset.src;
  const placeholder = img.dataset.placeholder;
  
  if (!src) return;

  // Create a new image to preload
  const imageLoader = new Image();
  
  imageLoader.onload = () => {
    // Add fade-in animation
    img.style.transition = 'opacity 0.3s ease-in-out';
    img.style.opacity = '0';
    
    setTimeout(() => {
      img.src = src;
      img.style.opacity = '1';
      img.classList.add('loaded');
      img.classList.remove('loading');
    }, 50);
  };
  
  imageLoader.onerror = () => {
    // Fallback to placeholder or default image
    img.src = placeholder || '/images/placeholder.jpg';
    img.classList.add('error');
  };
  
  imageLoader.src = src;
}

// WebP support detection and fallback
export function setupWebPSupport() {
  function supportsWebP(): Promise<boolean> {
    return new Promise(resolve => {
      const webP = new Image();
      webP.onload = webP.onerror = () => {
        resolve(webP.height === 2);
      };
      webP.src = 'data:image/webp;base64,UklGRjoAAABXRUJQVlA4IC4AAACyAgCdASoCAAIALmk0mk0iIiIiIgBoSygABc6WWgAA/veff/0PP8bA//LwYAAA';
    });
  }

  supportsWebP().then(supported => {
    if (supported) {
      document.documentElement.classList.add('webp');
    } else {
      document.documentElement.classList.add('no-webp');
    }
  });
}

// Responsive image loading based on device capabilities
export function setupResponsiveImages() {
  const images = document.querySelectorAll('img[data-srcset]');
  
  images.forEach(img => {
    const imgElement = img as HTMLImageElement;
    const srcset = imgElement.dataset.srcset;
    const sizes = imgElement.dataset.sizes || '100vw';
    
    if (srcset) {
      imgElement.srcset = srcset;
      imgElement.sizes = sizes;
    }
  });
}

// Image compression and format optimization
export function optimizeImageFormats() {
  const images = document.querySelectorAll('img');
  
  images.forEach(img => {
    const src = img.src;
    if (!src) return;
    
    // Add loading attribute for native lazy loading
    if (!img.hasAttribute('loading')) {
      img.loading = 'lazy';
    }
    
    // Add decoding attribute for better performance
    if (!img.hasAttribute('decoding')) {
      img.decoding = 'async';
    }
    
    // Optimize based on image type and size
    if (img.width > 800 || img.height > 600) {
      img.style.imageRendering = 'auto';
    }
  });
}

// Critical image preloading
export function preloadCriticalImages() {
  const criticalImages = [
    '/images/hero-background.webp',
    '/images/logo.svg',
    '/images/profile-photo.webp'
  ];
  
  criticalImages.forEach(src => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = src;
    document.head.appendChild(link);
  });
}

// Image error handling and fallbacks
export function setupImageErrorHandling() {
  document.addEventListener('error', (e) => {
    const target = e.target as HTMLImageElement;
    
    if (target.tagName === 'IMG') {
      // Try WebP fallback first
      if (target.src.includes('.webp')) {
        target.src = target.src.replace('.webp', '.jpg');
        return;
      }
      
      // Try different size
      if (target.src.includes('-large')) {
        target.src = target.src.replace('-large', '-medium');
        return;
      }
      
      // Final fallback to placeholder
      target.src = '/images/placeholder.jpg';
      target.alt = 'Image not available';
      target.classList.add('image-error');
    }
  }, true);
}

// Blur-up placeholder effect
export function createBlurUpEffect() {
  const style = document.createElement('style');
  style.textContent = `
    .image-placeholder {
      background-size: cover;
      background-position: center;
      filter: blur(5px);
      transform: scale(1.1);
      transition: all 0.3s ease;
    }
    
    .image-placeholder.loaded {
      filter: blur(0);
      transform: scale(1);
    }
    
    .progressive-image {
      position: relative;
      overflow: hidden;
    }
    
    .progressive-image img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: opacity 0.3s ease;
    }
    
    .progressive-image .placeholder {
      opacity: 1;
      filter: blur(2px);
    }
    
    .progressive-image .full-image {
      opacity: 0;
    }
    
    .progressive-image.loaded .placeholder {
      opacity: 0;
    }
    
    .progressive-image.loaded .full-image {
      opacity: 1;
    }
  `;
  document.head.appendChild(style);
}

// Initialize all image optimizations
export function initImageOptimizations() {
  setupWebPSupport();
  setupProgressiveImageLoading();
  setupResponsiveImages();
  optimizeImageFormats();
  preloadCriticalImages();
  setupImageErrorHandling();
  createBlurUpEffect();
  
  console.log('🖼️ Image optimizations initialized');
}
