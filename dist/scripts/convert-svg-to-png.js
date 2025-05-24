/**
 * Convert SVG to PNG
 * 
 * This script converts SVG files to PNG files using the Canvas API.
 * It's meant to be run in a browser environment.
 */

// Configuration
const config = {
  inputFile: '/images/win95/icons/duck-hunt.svg',
  outputFile: '/images/win95/icons/duck-hunt.png',
  width: 32,
  height: 32
};

/**
 * Convert SVG to PNG
 */
function convertSvgToPng() {
  // Create image element
  const img = new Image();
  
  // Set up load handler
  img.onload = () => {
    // Create canvas
    const canvas = document.createElement('canvas');
    canvas.width = config.width;
    canvas.height = config.height;
    
    // Get context
    const ctx = canvas.getContext('2d');
    
    // Draw image
    ctx.drawImage(img, 0, 0, config.width, config.height);
    
    // Get data URL
    const dataUrl = canvas.toDataURL('image/png');
    
    // Log data URL
    console.log('PNG Data URL:', dataUrl);
    
    // In a real environment, we would save the file
    // For demonstration purposes, we'll create a download link
    const link = document.createElement('a');
    link.download = 'duck-hunt.png';
    link.href = dataUrl;
    link.textContent = 'Download PNG';
    
    // Add to document
    document.body.appendChild(link);
  };
  
  // Set up error handler
  img.onerror = (error) => {
    console.error('Error loading SVG:', error);
  };
  
  // Load image
  img.src = config.inputFile;
}

// Run conversion
convertSvgToPng();
