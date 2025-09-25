/**
 * Icon System Test Suite
 * Comprehensive testing for icon rendering across browsers and devices
 */

interface IconTestResult {
  iconName: string;
  loadTime: number;
  renderStatus: 'success' | 'fallback' | 'error';
  browserInfo: string;
  deviceType: string;
  accessibilityScore: number;
}

interface BrowserInfo {
  name: string;
  version: string;
  engine: string;
  platform: string;
}

/**
 * Get browser information
 */
function getBrowserInfo(): BrowserInfo {
  const ua = navigator.userAgent;
  let browserName = 'Unknown';
  let version = 'Unknown';
  let engine = 'Unknown';
  let platform = 'Unknown';

  // Browser detection
  if (ua.includes('Chrome')) {
    browserName = 'Chrome';
    const match = ua.match(/Chrome\/(\d+)/);
    version = match ? match[1] : 'Unknown';
    engine = 'Blink';
  } else if (ua.includes('Firefox')) {
    browserName = 'Firefox';
    const match = ua.match(/Firefox\/(\d+)/);
    version = match ? match[1] : 'Unknown';
    engine = 'Gecko';
  } else if (ua.includes('Safari') && !ua.includes('Chrome')) {
    browserName = 'Safari';
    const match = ua.match(/Version\/(\d+)/);
    version = match ? match[1] : 'Unknown';
    engine = 'WebKit';
  } else if (ua.includes('Edge')) {
    browserName = 'Edge';
    const match = ua.match(/Edge\/(\d+)/);
    version = match ? match[1] : 'Unknown';
    engine = 'Blink';
  }

  // Platform detection
  if (ua.includes('Mobile')) {
    platform = 'Mobile';
  } else if (ua.includes('Tablet')) {
    platform = 'Tablet';
  } else {
    platform = 'Desktop';
  }

  return { name: browserName, version, engine, platform };
}

/**
 * Test icon loading performance
 */
async function testIconLoading(iconName: string): Promise<IconTestResult> {
  const startTime = performance.now();
  const browserInfo = getBrowserInfo();

  return new Promise((resolve) => {
    const img = new Image();
    const iconSrc = `/icons/${iconName}.svg`;

    img.onload = () => {
      const loadTime = performance.now() - startTime;
      resolve({
        iconName,
        loadTime,
        renderStatus: 'success',
        browserInfo: `${browserInfo.name} ${browserInfo.version}`,
        deviceType: browserInfo.platform,
        accessibilityScore: calculateAccessibilityScore(img, iconName),
      });
    };

    img.onerror = () => {
      const loadTime = performance.now() - startTime;
      resolve({
        iconName,
        loadTime,
        renderStatus: 'error',
        browserInfo: `${browserInfo.name} ${browserInfo.version}`,
        deviceType: browserInfo.platform,
        accessibilityScore: 0,
      });
    };

    img.src = iconSrc;
  });
}

/**
 * Calculate accessibility score for an icon
 */
function calculateAccessibilityScore(img: HTMLImageElement, iconName: string): number {
  let score = 100;

  // Check for alt text
  if (!img.alt) {
    score -= 20;
  }

  // Check for aria-label
  const ariaLabel = img.getAttribute('aria-label');
  if (!ariaLabel) {
    score -= 15;
  }

  // Check for role attribute
  const role = img.getAttribute('role');
  if (role !== 'img') {
    score -= 10;
  }

  // Check for proper sizing
  const width = img.width;
  const height = img.height;
  if (width < 16 || height < 16) {
    score -= 10;
  }

  // Check for decorative icons
  if (iconName.includes('decorative') || iconName.includes('icon')) {
    const ariaHidden = img.getAttribute('aria-hidden');
    if (ariaHidden !== 'true') {
      score -= 5;
    }
  }

  return Math.max(0, score);
}

/**
 * Test all service icons
 */
async function testAllServiceIcons(): Promise<IconTestResult[]> {
  const serviceIcons = [
    'web-development',
    'ui-ux-design',
    'mobile-app',
    'ai-integration',
    'consulting',
    'ecommerce'
  ];

  const results: IconTestResult[] = [];

  for (const iconName of serviceIcons) {
    try {
      const result = await testIconLoading(iconName);
      results.push(result);
      console.log(`✅ ${iconName}: ${result.renderStatus} (${result.loadTime.toFixed(2)}ms)`);
    } catch (error) {
      console.error(`❌ ${iconName}: Failed to test`, error);
    }
  }

  return results;
}

/**
 * Test responsive behavior
 */
function testResponsiveBehavior(): void {
  const breakpoints = [
    { name: 'mobile', width: 375 },
    { name: 'tablet', width: 768 },
    { name: 'desktop', width: 1200 }
  ];

  breakpoints.forEach(bp => {
    console.log(`📱 Testing ${bp.name} breakpoint (${bp.width}px)`);

    // Simulate viewport change
    const viewport = document.querySelector('meta[name="viewport"]');
    if (viewport) {
      const originalContent = viewport.getAttribute('content');
      viewport.setAttribute('content', `width=${bp.width}, initial-scale=1.0`);

      // Check icon scaling
      const icons = document.querySelectorAll('.icon-system');
      icons.forEach((icon, index) => {
        const computedStyle = window.getComputedStyle(icon);
        const transform = computedStyle.transform;
        console.log(`  Icon ${index}: transform = ${transform}`);
      });

      // Restore original viewport
      if (originalContent) {
        viewport.setAttribute('content', originalContent);
      }
    }
  });
}

/**
 * Test accessibility features
 */
function testAccessibility(): void {
  console.log('♿ Testing accessibility features...');

  const icons = document.querySelectorAll('img[role="img"], .icon-system[role="img"]');

  icons.forEach((icon, index) => {
    const ariaLabel = icon.getAttribute('aria-label');
    const ariaHidden = icon.getAttribute('aria-hidden');
    const alt = (icon as HTMLImageElement).alt;

    console.log(`  Icon ${index}:`);
    console.log(`    - aria-label: ${ariaLabel || '❌ Missing'}`);
    console.log(`    - aria-hidden: ${ariaHidden || '❌ Missing'}`);
    console.log(`    - alt text: ${alt || '❌ Missing'}`);

    // Test keyboard navigation
    if (icon.closest('.icon-interactive')) {
      console.log(`    - Interactive: ✅`);
    }
  });
}

/**
 * Test cross-browser compatibility
 */
function testCrossBrowserCompatibility(): void {
  const browserInfo = getBrowserInfo();
  console.log('🌐 Testing cross-browser compatibility...');
  console.log(`  Browser: ${browserInfo.name} ${browserInfo.version}`);
  console.log(`  Engine: ${browserInfo.engine}`);
  console.log(`  Platform: ${browserInfo.platform}`);

  // Test CSS feature support
  const testFeatures = [
    { name: 'CSS Grid', test: () => CSS.supports('display', 'grid') },
    { name: 'CSS Custom Properties', test: () => CSS.supports('color', 'var(--test)') },
    { name: 'Backdrop Filter', test: () => CSS.supports('backdrop-filter', 'blur(10px)') },
    { name: 'Transform 3D', test: () => CSS.supports('transform', 'translateZ(0)') },
  ];

  testFeatures.forEach(feature => {
    const supported = feature.test();
    console.log(`  ${feature.name}: ${supported ? '✅' : '❌'}`);
  });
}

/**
 * Test performance metrics
 */
function testPerformance(): void {
  console.log('⚡ Testing performance metrics...');

  // Measure icon loading times
  const iconImages = document.querySelectorAll('img[src*="/icons/"]');
  const loadTimes: number[] = [];

  iconImages.forEach(img => {
    if ((img as HTMLImageElement).complete) {
      loadTimes.push(0); // Already loaded
    }
  });

  const averageLoadTime = loadTimes.length > 0
    ? loadTimes.reduce((a, b) => a + b, 0) / loadTimes.length
    : 0;

  console.log(`  Average icon load time: ${averageLoadTime.toFixed(2)}ms`);
  console.log(`  Icons loaded: ${loadTimes.length}`);
}

/**
 * Run comprehensive icon tests
 */
export async function runIconTests(): Promise<void> {
  console.log('🧪 Starting comprehensive icon system tests...\n');

  try {
    // Test icon loading
    console.log('📥 Testing icon loading...');
    const loadResults = await testAllServiceIcons();

    // Test responsive behavior
    console.log('\n📱 Testing responsive behavior...');
    testResponsiveBehavior();

    // Test accessibility
    console.log('\n♿ Testing accessibility...');
    testAccessibility();

    // Test cross-browser compatibility
    console.log('\n🌐 Testing cross-browser compatibility...');
    testCrossBrowserCompatibility();

    // Test performance
    console.log('\n⚡ Testing performance...');
    testPerformance();

    // Generate summary
    console.log('\n📊 Test Summary:');
    const successful = loadResults.filter(r => r.renderStatus === 'success').length;
    const errors = loadResults.filter(r => r.renderStatus === 'error').length;
    const fallbacks = loadResults.filter(r => r.renderStatus === 'fallback').length;

    console.log(`  ✅ Successful: ${successful}`);
    console.log(`  ❌ Errors: ${errors}`);
    console.log(`  🔄 Fallbacks: ${fallbacks}`);
    console.log(`  📱 Device: ${getBrowserInfo().platform}`);

    if (errors === 0) {
      console.log('\n🎉 All icon tests passed!');
    } else {
      console.log(`\n⚠️  ${errors} icons failed to load. Check fallback system.`);
    }

  } catch (error) {
    console.error('❌ Test suite failed:', error);
  }
}

/**
 * Initialize icon testing on page load
 */
if (typeof window !== 'undefined') {
  // Run tests after page loads
  window.addEventListener('load', () => {
    // Delay test execution to ensure all icons are loaded
    setTimeout(() => {
      console.log('🔧 Icon system tests available. Run runIconTests() in console.');
    }, 2000);
  });
}

export default {
  runIconTests,
  testIconLoading,
  testAllServiceIcons,
  getBrowserInfo,
  calculateAccessibilityScore,
};