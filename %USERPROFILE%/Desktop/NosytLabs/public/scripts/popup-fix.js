/**
 * NosytLabs Popup Fix
 * Fixes z-index issues with popups and modals
 */

document.addEventListener('DOMContentLoaded', function() {
  fixPopupZIndex();
  fixIframeOverflow();
  fixFloatingElements();
});

/**
 * Fix z-index issues with popups and modals
 */
function fixPopupZIndex() {
  // Get all elements with high z-index
  const popups = document.querySelectorAll('.popup, .modal, [class*="popup"], [class*="modal"], [style*="z-index"]');
  
  // Set proper z-index values
  popups.forEach(popup => {
    // Get computed style
    const style = window.getComputedStyle(popup);
    const zIndex = parseInt(style.zIndex);
    
    // If z-index is too high, reduce it
    if (zIndex > 1000) {
      popup.style.zIndex = '100';
    }
    
    // Make sure popup is properly positioned
    if (style.position === 'fixed' || style.position === 'absolute') {
      // Check if popup is overflowing the viewport
      const rect = popup.getBoundingClientRect();
      
      if (rect.left < 0) {
        popup.style.left = '0';
      }
      
      if (rect.top < 0) {
        popup.style.top = '0';
      }
      
      if (rect.right > window.innerWidth) {
        popup.style.right = '0';
        popup.style.left = 'auto';
      }
      
      if (rect.bottom > window.innerHeight) {
        popup.style.bottom = '0';
        popup.style.top = 'auto';
      }
    }
  });
  
  console.log('Popup z-index issues fixed');
}

/**
 * Fix iframe overflow issues
 */
function fixIframeOverflow() {
  // Get all iframes
  const iframes = document.querySelectorAll('iframe');
  
  // Fix iframe overflow
  iframes.forEach(iframe => {
    // Make sure iframe container has proper overflow
    const parent = iframe.parentElement;
    
    if (parent) {
      parent.style.overflow = 'hidden';
    }
    
    // Make sure iframe has proper size
    iframe.style.maxWidth = '100%';
    
    // Remove scrolling attribute
    if (iframe.hasAttribute('scrolling')) {
      iframe.setAttribute('scrolling', 'no');
    }
  });
  
  console.log('Iframe overflow issues fixed');
}

/**
 * Fix floating elements
 */
function fixFloatingElements() {
  // Get all elements with position fixed or absolute
  const floatingElements = document.querySelectorAll('[style*="position: fixed"], [style*="position: absolute"], [style*="position:fixed"], [style*="position:absolute"]');
  
  // Fix floating elements
  floatingElements.forEach(element => {
    // Get computed style
    const style = window.getComputedStyle(element);
    
    // Check if element has proper z-index
    if (!style.zIndex || style.zIndex === 'auto') {
      element.style.zIndex = '10';
    }
    
    // Check if element is properly positioned
    if (style.top === 'auto' && style.bottom === 'auto') {
      element.style.top = '0';
    }
    
    if (style.left === 'auto' && style.right === 'auto') {
      element.style.left = '0';
    }
  });
  
  console.log('Floating elements fixed');
}
