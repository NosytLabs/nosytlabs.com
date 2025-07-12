// Debug script to validate visual issues on NosytLabs website
console.log("=== NosytLabs Visual Issues Debug Script ===");

// Check 1: Verify missing CSS classes
console.log("\n1. Checking for missing CSS classes...");
const missingClasses = [
  'grid-responsive',
  'nosyt-card-hover', 
  'nosyt-focus',
  'nosyt-hover-lift',
  'container-query-section',
  'text-clamp-hero',
  'text-clamp-subtitle', 
  'text-clamp-description'
];

missingClasses.forEach(className => {
  const elements = document.querySelectorAll(`.${className}`);
  if (elements.length > 0) {
    console.log(`✓ Found ${elements.length} elements with class: ${className}`);
    // Check if CSS rules exist
    const computedStyle = window.getComputedStyle(elements[0]);
    const hasCustomStyles = computedStyle.getPropertyValue('--custom-applied') || 
                           computedStyle.display !== 'block' || 
                           computedStyle.transform !== 'none';
    console.log(`  CSS applied: ${hasCustomStyles ? 'YES' : 'NO - MISSING CSS RULES'}`);
  } else {
    console.log(`✗ No elements found with class: ${className}`);
  }
});

// Check 2: Verify BentoGrid height conflicts
console.log("\n2. Checking BentoGrid height conflicts...");
const bentoGrids = document.querySelectorAll('[class*="auto-rows-"]');
bentoGrids.forEach((grid, index) => {
  const classes = grid.className;
  const heightMatch = classes.match(/auto-rows-\[(\d+)rem\]/);
  if (heightMatch) {
    console.log(`BentoGrid ${index + 1}: height = ${heightMatch[1]}rem`);
    console.log(`  Full classes: ${classes}`);
    
    // Check children height vs container height
    const children = grid.querySelectorAll('.group, [class*="col-span"]');
    console.log(`  Children count: ${children.length}`);
    children.forEach((child, childIndex) => {
      const childHeight = child.offsetHeight;
      const containerHeight = parseFloat(heightMatch[1]) * 16; // Convert rem to px
      console.log(`    Child ${childIndex + 1}: ${childHeight}px vs container ${containerHeight}px`);
      if (childHeight > containerHeight) {
        console.log(`    ⚠️  OVERFLOW DETECTED: Child exceeds container height`);
      }
    });
  }
});

// Check 3: Verify theme color issues
console.log("\n3. Checking theme color issues...");
const rootStyles = window.getComputedStyle(document.documentElement);
const nosytPurple = rootStyles.getPropertyValue('--nosyt-purple');
const brandPurple500 = rootStyles.getPropertyValue('--brand-purple-500');

console.log(`--nosyt-purple: ${nosytPurple || 'NOT DEFINED'}`);
console.log(`--brand-purple-500: ${brandPurple500 || 'NOT DEFINED'}`);

// Check for elements using problematic shadow classes
const shadowElements = document.querySelectorAll('[class*="shadow-[0_0_0_1px_theme"]');
console.log(`Elements with problematic shadow classes: ${shadowElements.length}`);
shadowElements.forEach((el, index) => {
  console.log(`  Element ${index + 1}: ${el.className}`);
});

// Check 4: Verify text overflow in service buttons
console.log("\n4. Checking text overflow in service buttons...");
const serviceButtons = document.querySelectorAll('[class*="group-hover:translate-y-0"]');
serviceButtons.forEach((button, index) => {
  console.log(`Service button ${index + 1}:`);
  console.log(`  Text content: "${button.textContent.trim()}"`);
  console.log(`  Button width: ${button.offsetWidth}px`);
  console.log(`  Button height: ${button.offsetHeight}px`);
  console.log(`  Parent container height: ${button.parentElement.offsetHeight}px`);
  
  // Check if text is clipped
  const textElement = button.querySelector('span') || button;
  const textWidth = textElement.scrollWidth;
  const textHeight = textElement.scrollHeight;
  console.log(`  Text dimensions: ${textWidth}x${textHeight}px`);
  
  if (textWidth > button.offsetWidth || textHeight > button.offsetHeight) {
    console.log(`  ⚠️  TEXT OVERFLOW DETECTED`);
  }
});

// Check 5: Verify contrast ratios
console.log("\n5. Checking contrast ratios...");
const textElements = document.querySelectorAll('p, h1, h2, h3, h4, h5, h6, span, div');
let contrastIssues = 0;

// Helper function to get contrast ratio (simplified)
function getContrastRatio(foreground, background) {
  // This is a simplified version - in production you'd want a proper contrast checker
  const fgLuminance = getLuminance(foreground);
  const bgLuminance = getLuminance(background);
  const lighter = Math.max(fgLuminance, bgLuminance);
  const darker = Math.min(fgLuminance, bgLuminance);
  return (lighter + 0.05) / (darker + 0.05);
}

function getLuminance(color) {
  // Simplified luminance calculation
  const rgb = color.match(/\d+/g);
  if (!rgb) return 0.5;
  const [r, g, b] = rgb.map(x => parseInt(x) / 255);
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

// Sample a few key text elements
const keyTextElements = document.querySelectorAll('h1, h2, .text-white, .text-gray-600, .text-neutral-600');
keyTextElements.forEach((el, index) => {
  const styles = window.getComputedStyle(el);
  const textColor = styles.color;
  const bgColor = styles.backgroundColor;
  
  if (index < 5) { // Only check first 5 to avoid spam
    console.log(`Text element ${index + 1}: color=${textColor}, bg=${bgColor}`);
    const contrast = getContrastRatio(textColor, bgColor);
    console.log(`  Contrast ratio: ${contrast.toFixed(2)}`);
    if (contrast < 4.5) {
      console.log(`  ⚠️  LOW CONTRAST DETECTED (WCAG AA requires 4.5:1)`);
      contrastIssues++;
    }
  }
});

console.log(`\nTotal contrast issues found: ${contrastIssues}`);

console.log("\n=== Debug Complete ===");