/**
 * Design System Testing Suite
 * Comprehensive validation of design enhancements and accessibility standards
 */

export interface DesignTestResult {
  testName: string;
  score: number;
  maxScore: number;
  details: string | string[];
  category: 'accessibility' | 'design' | 'performance' | 'responsive' | 'UX';
  passed: boolean;
  timestamp: string;
}

export interface ComparisonReport {
  beforeScore: number;
  afterScore: number;
  improvement: number;
  testResults: DesignTestResult[];
  timestamp: string;
  summary: {
    totalTests: number;
    passedTests: number;
    failedTests: number;
    categories: Record<string, { passed: number; total: number; score: number }>;
  };
}

export class DesignSystemTester {
  private results: DesignTestResult[] = [];

  /**
   * Run all design system tests
   */
  async runAllTests(): Promise<ComparisonReport> {
    this.results = [];

    // Accessibility Tests
    await this.testColorContrast();
    await this.testFocusIndicators();
    await this.testKeyboardNavigation();
    await this.testScreenReaderSupport();
    await this.testWCAGCompliance();

    // Design System Tests
    await this.testGridSystem();
    await this.testTypographyScale();
    await this.testColorPalette();
    await this.testSpacingConsistency();
    await this.testComponentAlignment();

    // Responsive Design Tests
    await this.testBreakpoints();
    await this.testMobileOptimization();
    await this.testFlexibleLayouts();

    // Performance Tests
    await this.testCSSOptimization();
    await this.testLoadingStates();
    await this.testAnimationPerformance();

    return this.generateReport();
  }

  /**
   * Test color contrast ratios for WCAG compliance
   */
  private async testColorContrast(): Promise<void> {
    const details: string[] = [];
    let score = 0;
    let totalChecks = 0;

    try {
      // Get computed styles from design system
      const root = document.documentElement;
      const styles = getComputedStyle(root);

      // Test primary color combinations
      const colorTests = [
        { bg: '--color-primary-500', fg: '--color-neutral-0', name: 'Primary button text' },
        { bg: '--color-neutral-0', fg: '--color-neutral-800', name: 'Body text' },
        { bg: '--color-neutral-0', fg: '--color-primary-600', name: 'Link text' },
        { bg: '--color-error-500', fg: '--color-neutral-0', name: 'Error button text' },
        { bg: '--color-success-500', fg: '--color-neutral-0', name: 'Success button text' }
      ];

      for (const test of colorTests) {
        totalChecks++;
        const bgColor = styles.getPropertyValue(test.bg).trim();
        const fgColor = styles.getPropertyValue(test.fg).trim();
        
        if (bgColor && fgColor) {
          const contrast = this.calculateContrastRatio(bgColor, fgColor);
          const passes = contrast >= 4.5; // WCAG AA standard
          
          if (passes) {
            score++;
            details.push(`✓ ${test.name}: ${contrast.toFixed(2)}:1 (WCAG AA compliant)`);
          } else {
            details.push(`✗ ${test.name}: ${contrast.toFixed(2)}:1 (Below WCAG AA standard)`);
          }
        } else {
          details.push(`⚠ ${test.name}: Could not retrieve colors`);
        }
      }
    } catch (error) {
      details.push(`Error testing color contrast: ${error}`);
    }

    this.addResult({
      testName: 'Color Contrast Compliance',
      passed: score === totalChecks,
      score: totalChecks > 0 ? (score / totalChecks) * 100 : 0,
      details,
      timestamp: new Date().toISOString(),
      category: 'accessibility'
    });
  }

  /**
   * Test focus indicators visibility and accessibility
   */
  private async testFocusIndicators(): Promise<void> {
    const details: string[] = [];
    let score = 0;
    let totalChecks = 0;

    try {
      // Test focus indicators on interactive elements
      const interactiveElements = document.querySelectorAll(
        'button, a, input, textarea, select, [tabindex]:not([tabindex="-1"])'
      );

      const sampleSize = Math.min(10, interactiveElements.length);
      
      for (let i = 0; i < sampleSize; i++) {
        totalChecks++;
        const element = interactiveElements[i] as HTMLElement;
        
        // Simulate focus
        element.focus();
        const styles = getComputedStyle(element);
        
        const hasOutline = styles.outline !== 'none' && styles.outline !== '0px';
        const hasBoxShadow = styles.boxShadow !== 'none';
        const hasFocusRing = hasOutline || hasBoxShadow;
        
        if (hasFocusRing) {
          score++;
          details.push(`✓ ${element.tagName.toLowerCase()}: Has visible focus indicator`);
        } else {
          details.push(`✗ ${element.tagName.toLowerCase()}: Missing focus indicator`);
        }
        
        element.blur();
      }
    } catch (error) {
      details.push(`Error testing focus indicators: ${error}`);
    }

    this.addResult({
      testName: 'Focus Indicators',
      passed: score === totalChecks,
      score: totalChecks > 0 ? (score / totalChecks) * 100 : 0,
      details,
      timestamp: new Date().toISOString(),
      category: 'accessibility'
    });
  }

  /**
   * Test keyboard navigation functionality
   */
  private async testKeyboardNavigation(): Promise<void> {
    const details: string[] = [];
    let score = 0;
    let totalChecks = 0;

    try {
      // Test tab order
      const focusableElements = document.querySelectorAll(
        'button:not([disabled]), a[href], input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
      );

      totalChecks++;
      if (focusableElements.length > 0) {
        score++;
        details.push(`✓ Found ${focusableElements.length} focusable elements`);
      } else {
        details.push(`✗ No focusable elements found`);
      }

      // Test skip links
      totalChecks++;
      const skipLinks = document.querySelectorAll('.skip-nav-link, [href="#main"], [href="#content"]');
      if (skipLinks.length > 0) {
        score++;
        details.push(`✓ Skip navigation links present (${skipLinks.length})`);
      } else {
        details.push(`⚠ No skip navigation links found`);
      }

      // Test ARIA labels
      totalChecks++;
      const elementsWithAria = document.querySelectorAll('[aria-label], [aria-labelledby], [aria-describedby]');
      if (elementsWithAria.length > 0) {
        score++;
        details.push(`✓ ARIA labels found on ${elementsWithAria.length} elements`);
      } else {
        details.push(`⚠ Limited ARIA labeling detected`);
      }
    } catch (error) {
      details.push(`Error testing keyboard navigation: ${error}`);
    }

    this.addResult({
      testName: 'Keyboard Navigation',
      passed: score >= totalChecks * 0.8, // 80% pass rate
      score: totalChecks > 0 ? (score / totalChecks) * 100 : 0,
      details,
      timestamp: new Date().toISOString(),
      category: 'accessibility'
    });
  }

  /**
   * Test screen reader support
   */
  private async testScreenReaderSupport(): Promise<void> {
    const details: string[] = [];
    let score = 0;
    let totalChecks = 0;

    try {
      // Test semantic HTML
      totalChecks++;
      const semanticElements = document.querySelectorAll(
        'main, nav, header, footer, section, article, aside, h1, h2, h3, h4, h5, h6'
      );
      if (semanticElements.length > 0) {
        score++;
        details.push(`✓ Semantic HTML elements found (${semanticElements.length})`);
      } else {
        details.push(`✗ Limited semantic HTML structure`);
      }

      // Test alt text on images
      totalChecks++;
      const images = document.querySelectorAll('img');
      const imagesWithAlt = document.querySelectorAll('img[alt]');
      if (images.length === 0 || imagesWithAlt.length === images.length) {
        score++;
        details.push(`✓ All images have alt text (${images.length} images)`);
      } else {
        details.push(`✗ ${images.length - imagesWithAlt.length} images missing alt text`);
      }

      // Test form labels
      totalChecks++;
      const inputs = document.querySelectorAll('input, textarea, select');
      const labeledInputs = document.querySelectorAll('input[aria-label], input[aria-labelledby], textarea[aria-label], textarea[aria-labelledby], select[aria-label], select[aria-labelledby]');
      const inputsWithLabels = document.querySelectorAll('label input, label textarea, label select');
      const totalLabeled = labeledInputs.length + inputsWithLabels.length;
      
      if (inputs.length === 0 || totalLabeled >= inputs.length * 0.9) {
        score++;
        details.push(`✓ Form inputs properly labeled (${totalLabeled}/${inputs.length})`);
      } else {
        details.push(`✗ ${inputs.length - totalLabeled} form inputs missing labels`);
      }
    } catch (error) {
      details.push(`Error testing screen reader support: ${error}`);
    }

    this.addResult({
      testName: 'Screen Reader Support',
      passed: score >= totalChecks * 0.8,
      score: totalChecks > 0 ? (score / totalChecks) * 100 : 0,
      details,
      timestamp: new Date().toISOString(),
      category: 'accessibility'
    });
  }

  /**
   * Test WCAG compliance
   */
  private async testWCAGCompliance(): Promise<void> {
    const details: string[] = [];
    let score = 0;
    let totalChecks = 0;

    try {
      // Test page structure
      totalChecks++;
      const h1Elements = document.querySelectorAll('h1');
      if (h1Elements.length === 1) {
        score++;
        details.push(`✓ Single H1 element found`);
      } else {
        details.push(`✗ Found ${h1Elements.length} H1 elements (should be 1)`);
      }

      // Test heading hierarchy
      totalChecks++;
      const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
      let hierarchyValid = true;
      let lastLevel = 0;
      
      headings.forEach(heading => {
        const level = parseInt(heading.tagName.charAt(1));
        if (level > lastLevel + 1) {
          hierarchyValid = false;
        }
        lastLevel = level;
      });
      
      if (hierarchyValid) {
        score++;
        details.push(`✓ Heading hierarchy is valid`);
      } else {
        details.push(`✗ Heading hierarchy has gaps`);
      }

      // Test language attribute
      totalChecks++;
      const htmlElement = document.documentElement;
      if (htmlElement.lang) {
        score++;
        details.push(`✓ Language attribute set: ${htmlElement.lang}`);
      } else {
        details.push(`✗ Missing language attribute on html element`);
      }
    } catch (error) {
      details.push(`Error testing WCAG compliance: ${error}`);
    }

    this.addResult({
      testName: 'WCAG Compliance',
      passed: score >= totalChecks * 0.8,
      score: totalChecks > 0 ? (score / totalChecks) * 100 : 0,
      details,
      timestamp: new Date().toISOString(),
      category: 'accessibility'
    });
  }

  /**
   * Test 8px grid system implementation
   */
  private async testGridSystem(): Promise<void> {
    const details: string[] = [];
    let score = 0;
    let totalChecks = 0;

    try {
      // Test CSS custom properties for grid
      totalChecks++;
      const root = document.documentElement;
      const styles = getComputedStyle(root);
      
      const gridProperties = [
        '--grid-xs', '--grid-sm', '--grid-md', '--grid-lg', '--grid-xl'
      ];
      
      let gridPropsFound = 0;
      gridProperties.forEach(prop => {
        if (styles.getPropertyValue(prop).trim()) {
          gridPropsFound++;
        }
      });
      
      if (gridPropsFound >= gridProperties.length * 0.8) {
        score++;
        details.push(`✓ Grid system properties found (${gridPropsFound}/${gridProperties.length})`);
      } else {
        details.push(`✗ Missing grid system properties (${gridPropsFound}/${gridProperties.length})`);
      }

      // Test 8px base unit
      totalChecks++;
      const baseUnit = styles.getPropertyValue('--grid-base').trim();
      if (baseUnit === '8px' || baseUnit === '0.5rem') {
        score++;
        details.push(`✓ 8px base unit implemented: ${baseUnit}`);
      } else {
        details.push(`⚠ Base unit not found or incorrect: ${baseUnit}`);
      }
    } catch (error) {
      details.push(`Error testing grid system: ${error}`);
    }

    this.addResult({
      testName: '8px Grid System',
      passed: score === totalChecks,
      score: totalChecks > 0 ? (score / totalChecks) * 100 : 0,
      details,
      timestamp: new Date().toISOString(),
      category: 'design'
    });
  }

  /**
   * Test typography scale consistency
   */
  private async testTypographyScale(): Promise<void> {
    const details: string[] = [];
    let score = 0;
    let totalChecks = 0;

    try {
      const root = document.documentElement;
      const styles = getComputedStyle(root);
      
      const fontSizes = [
        '--font-size-xs', '--font-size-sm', '--font-size-base',
        '--font-size-lg', '--font-size-xl', '--font-size-2xl',
        '--font-size-3xl', '--font-size-4xl'
      ];
      
      totalChecks++;
      let fontSizesFound = 0;
      fontSizes.forEach(size => {
        if (styles.getPropertyValue(size).trim()) {
          fontSizesFound++;
        }
      });
      
      if (fontSizesFound >= fontSizes.length * 0.8) {
        score++;
        details.push(`✓ Typography scale defined (${fontSizesFound}/${fontSizes.length})`);
      } else {
        details.push(`✗ Incomplete typography scale (${fontSizesFound}/${fontSizes.length})`);
      }

      // Test line heights
      totalChecks++;
      const lineHeights = [
        '--line-height-tight', '--line-height-normal', '--line-height-relaxed'
      ];
      
      let lineHeightsFound = 0;
      lineHeights.forEach(lh => {
        if (styles.getPropertyValue(lh).trim()) {
          lineHeightsFound++;
        }
      });
      
      if (lineHeightsFound >= lineHeights.length * 0.8) {
        score++;
        details.push(`✓ Line heights defined (${lineHeightsFound}/${lineHeights.length})`);
      } else {
        details.push(`✗ Missing line height definitions (${lineHeightsFound}/${lineHeights.length})`);
      }
    } catch (error) {
      details.push(`Error testing typography: ${error}`);
    }

    this.addResult({
      testName: 'Typography Scale',
      passed: score === totalChecks,
      score: totalChecks > 0 ? (score / totalChecks) * 100 : 0,
      details,
      timestamp: new Date().toISOString(),
      category: 'design'
    });
  }

  /**
   * Test color palette implementation
   */
  private async testColorPalette(): Promise<void> {
    const details: string[] = [];
    let score = 0;
    let totalChecks = 0;

    try {
      const root = document.documentElement;
      const styles = getComputedStyle(root);
      
      const colorCategories = [
        'primary', 'secondary', 'neutral', 'error', 'success', 'warning'
      ];
      
      colorCategories.forEach(category => {
        totalChecks++;
        const colorShades = [
          `--color-${category}-50`,
          `--color-${category}-100`,
          `--color-${category}-500`,
          `--color-${category}-600`,
          `--color-${category}-900`
        ];
        
        let shadesFound = 0;
        colorShades.forEach(shade => {
          if (styles.getPropertyValue(shade).trim()) {
            shadesFound++;
          }
        });
        
        if (shadesFound >= colorShades.length * 0.6) {
          score++;
          details.push(`✓ ${category} color palette (${shadesFound}/${colorShades.length} shades)`);
        } else {
          details.push(`✗ Incomplete ${category} palette (${shadesFound}/${colorShades.length} shades)`);
        }
      });
    } catch (error) {
      details.push(`Error testing color palette: ${error}`);
    }

    this.addResult({
      testName: 'Color Palette',
      passed: score >= totalChecks * 0.8,
      score: totalChecks > 0 ? (score / totalChecks) * 100 : 0,
      details,
      timestamp: new Date().toISOString(),
      category: 'design'
    });
  }

  /**
   * Test spacing consistency
   */
  private async testSpacingConsistency(): Promise<void> {
    const details: string[] = [];
    let score = 0;
    let totalChecks = 0;

    try {
      // Test for consistent spacing patterns
      const elements = document.querySelectorAll('*');
      const spacingValues = new Set<string>();
      
      // Sample elements to check spacing
      const sampleSize = Math.min(50, elements.length);
      
      for (let i = 0; i < sampleSize; i++) {
        const element = elements[i] as HTMLElement;
        const styles = getComputedStyle(element);
        
        ['margin', 'padding'].forEach(property => {
          ['Top', 'Right', 'Bottom', 'Left'].forEach(side => {
            const value = styles.getPropertyValue(`${property}${side}`);
            if (value && value !== '0px' && value !== 'auto') {
              spacingValues.add(value);
            }
          });
        });
      }
      
      totalChecks++;
      const spacingArray = Array.from(spacingValues);
      const consistentSpacing = spacingArray.filter(value => {
        const numValue = parseFloat(value);
        return numValue % 8 === 0 || numValue % 4 === 0; // 8px or 4px multiples
      });
      
      const consistencyRatio = consistentSpacing.length / spacingArray.length;
      
      if (consistencyRatio >= 0.7) {
        score++;
        details.push(`✓ Spacing consistency: ${(consistencyRatio * 100).toFixed(1)}%`);
      } else {
        details.push(`⚠ Spacing consistency: ${(consistencyRatio * 100).toFixed(1)}% (target: 70%+)`);
      }
      
      details.push(`Found ${spacingArray.length} unique spacing values`);
    } catch (error) {
      details.push(`Error testing spacing consistency: ${error}`);
    }

    this.addResult({
      testName: 'Spacing Consistency',
      passed: score === totalChecks,
      score: totalChecks > 0 ? (score / totalChecks) * 100 : 0,
      details,
      timestamp: new Date().toISOString(),
      category: 'design'
    });
  }

  /**
   * Test component alignment
   */
  private async testComponentAlignment(): Promise<void> {
    const details: string[] = [];
    let score = 0;
    let totalChecks = 0;

    try {
      // Test for pixel-perfect alignment
      const components = document.querySelectorAll('.btn, .card, .input, [class*="grid"]');
      
      if (components.length > 0) {
        totalChecks++;
        let alignedComponents = 0;
        
        components.forEach(component => {
          const rect = component.getBoundingClientRect();
          const isPixelAligned = 
            Number.isInteger(rect.left) && 
            Number.isInteger(rect.top) && 
            Number.isInteger(rect.width) && 
            Number.isInteger(rect.height);
          
          if (isPixelAligned) {
            alignedComponents++;
          }
        });
        
        const alignmentRatio = alignedComponents / components.length;
        
        if (alignmentRatio >= 0.9) {
          score++;
          details.push(`✓ Component alignment: ${(alignmentRatio * 100).toFixed(1)}%`);
        } else {
          details.push(`⚠ Component alignment: ${(alignmentRatio * 100).toFixed(1)}% (target: 90%+)`);
        }
      } else {
        details.push(`⚠ No design system components found for alignment testing`);
      }
    } catch (error) {
      details.push(`Error testing component alignment: ${error}`);
    }

    this.addResult({
      testName: 'Component Alignment',
      passed: score === totalChecks,
      score: totalChecks > 0 ? (score / totalChecks) * 100 : 0,
      details,
      timestamp: new Date().toISOString(),
      category: 'design'
    });
  }

  /**
   * Test responsive breakpoints
   */
  private async testBreakpoints(): Promise<void> {
    const details: string[] = [];
    let score = 0;
    let totalChecks = 0;

    try {
      // Test CSS media queries
      const stylesheets = Array.from(document.styleSheets);
      let mediaQueriesFound = 0;
      
      stylesheets.forEach(stylesheet => {
        try {
          const rules = Array.from(stylesheet.cssRules || []);
          rules.forEach(rule => {
            if (rule instanceof CSSMediaRule) {
              mediaQueriesFound++;
            }
          });
        } catch (e) {
          // Cross-origin stylesheets may not be accessible
        }
      });
      
      totalChecks++;
      if (mediaQueriesFound > 0) {
        score++;
        details.push(`✓ Responsive media queries found: ${mediaQueriesFound}`);
      } else {
        details.push(`✗ No media queries detected`);
      }

      // Test viewport meta tag
      totalChecks++;
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      if (viewportMeta) {
        score++;
        details.push(`✓ Viewport meta tag present`);
      } else {
        details.push(`✗ Missing viewport meta tag`);
      }
    } catch (error) {
      details.push(`Error testing breakpoints: ${error}`);
    }

    this.addResult({
      testName: 'Responsive Breakpoints',
      passed: score === totalChecks,
      score: totalChecks > 0 ? (score / totalChecks) * 100 : 0,
      details,
      timestamp: new Date().toISOString(),
      category: 'responsive'
    });
  }

  /**
   * Test mobile optimization
   */
  private async testMobileOptimization(): Promise<void> {
    const details: string[] = [];
    let score = 0;
    let totalChecks = 0;

    try {
      // Test touch targets
      totalChecks++;
      const touchTargets = document.querySelectorAll('button, a, input, [onclick], [role="button"]');
      let adequateTouchTargets = 0;
      
      touchTargets.forEach(target => {
        const rect = target.getBoundingClientRect();
        const minSize = 44; // 44px minimum touch target
        
        if (rect.width >= minSize && rect.height >= minSize) {
          adequateTouchTargets++;
        }
      });
      
      const touchTargetRatio = touchTargets.length > 0 ? adequateTouchTargets / touchTargets.length : 1;
      
      if (touchTargetRatio >= 0.8) {
        score++;
        details.push(`✓ Touch targets: ${(touchTargetRatio * 100).toFixed(1)}% meet 44px minimum`);
      } else {
        details.push(`⚠ Touch targets: ${(touchTargetRatio * 100).toFixed(1)}% meet 44px minimum (target: 80%+)`);
      }

      // Test horizontal scrolling
      totalChecks++;
      const bodyWidth = document.body.scrollWidth;
      const viewportWidth = window.innerWidth;
      
      if (bodyWidth <= viewportWidth * 1.1) { // Allow 10% tolerance
        score++;
        details.push(`✓ No horizontal overflow detected`);
      } else {
        details.push(`⚠ Horizontal overflow detected: ${bodyWidth}px > ${viewportWidth}px`);
      }
    } catch (error) {
      details.push(`Error testing mobile optimization: ${error}`);
    }

    this.addResult({
      testName: 'Mobile Optimization',
      passed: score >= totalChecks * 0.8,
      score: totalChecks > 0 ? (score / totalChecks) * 100 : 0,
      details,
      timestamp: new Date().toISOString(),
      category: 'responsive'
    });
  }

  /**
   * Test flexible layouts
   */
  private async testFlexibleLayouts(): Promise<void> {
    const details: string[] = [];
    let score = 0;
    let totalChecks = 0;

    try {
      // Test flexbox usage
      totalChecks++;
      const flexElements = document.querySelectorAll('[style*="display: flex"], [class*="flex"]');
      
      if (flexElements.length > 0) {
        score++;
        details.push(`✓ Flexbox layouts found: ${flexElements.length} elements`);
      } else {
        details.push(`⚠ Limited flexbox usage detected`);
      }

      // Test grid usage
      totalChecks++;
      const gridElements = document.querySelectorAll('[style*="display: grid"], [class*="grid"]');
      
      if (gridElements.length > 0) {
        score++;
        details.push(`✓ CSS Grid layouts found: ${gridElements.length} elements`);
      } else {
        details.push(`⚠ Limited CSS Grid usage detected`);
      }
    } catch (error) {
      details.push(`Error testing flexible layouts: ${error}`);
    }

    this.addResult({
      testName: 'Flexible Layouts',
      passed: score >= totalChecks * 0.5, // More lenient as not all sites need both
      score: totalChecks > 0 ? (score / totalChecks) * 100 : 0,
      details,
      timestamp: new Date().toISOString(),
      category: 'responsive'
    });
  }

  /**
   * Test CSS optimization
   */
  private async testCSSOptimization(): Promise<void> {
    const details: string[] = [];
    let score = 0;
    let totalChecks = 0;

    try {
      // Test for unused CSS (simplified check)
      totalChecks++;
      const stylesheets = Array.from(document.styleSheets);
      let totalRules = 0;
      
      stylesheets.forEach(stylesheet => {
        try {
          const rules = Array.from(stylesheet.cssRules || []);
          totalRules += rules.length;
        } catch (e) {
          // Cross-origin stylesheets may not be accessible
        }
      });
      
      if (totalRules > 0) {
        score++;
        details.push(`✓ CSS rules loaded: ${totalRules}`);
      } else {
        details.push(`⚠ No CSS rules detected`);
      }

      // Test for CSS custom properties usage
      totalChecks++;
      const root = document.documentElement;
      const styles = getComputedStyle(root);
      const customProps = Array.from(styles).filter(prop => prop.startsWith('--'));
      
      if (customProps.length > 10) {
        score++;
        details.push(`✓ CSS custom properties: ${customProps.length}`);
      } else {
        details.push(`⚠ Limited CSS custom properties: ${customProps.length}`);
      }
    } catch (error) {
      details.push(`Error testing CSS optimization: ${error}`);
    }

    this.addResult({
      testName: 'CSS Optimization',
      passed: score >= totalChecks * 0.8,
      score: totalChecks > 0 ? (score / totalChecks) * 100 : 0,
      details,
      timestamp: new Date().toISOString(),
      category: 'performance'
    });
  }

  /**
   * Test loading states
   */
  private async testLoadingStates(): Promise<void> {
    const details: string[] = [];
    let score = 0;
    let totalChecks = 0;

    try {
      // Test for loading indicators
      totalChecks++;
      const loadingElements = document.querySelectorAll(
        '.loading, .spinner, [class*="loading"], [class*="spinner"], [aria-busy="true"]'
      );
      
      if (loadingElements.length > 0) {
        score++;
        details.push(`✓ Loading indicators found: ${loadingElements.length}`);
      } else {
        details.push(`⚠ No loading indicators detected`);
      }

      // Test for skeleton screens
      totalChecks++;
      const skeletonElements = document.querySelectorAll(
        '.skeleton, [class*="skeleton"], .placeholder, [class*="placeholder"]'
      );
      
      if (skeletonElements.length > 0) {
        score++;
        details.push(`✓ Skeleton/placeholder elements: ${skeletonElements.length}`);
      } else {
        details.push(`⚠ No skeleton screens detected`);
      }
    } catch (error) {
      details.push(`Error testing loading states: ${error}`);
    }

    this.addResult({
      testName: 'Loading States',
      score: score,
      maxScore: 2,
      details: details,
      category: 'UX'
    });
  }

  /**
   * Test animation performance
   */
  private async testAnimationPerformance(): Promise<void> {
    const details: string[] = [];
    let score = 0;
    let totalChecks = 0;

    try {
      // Test for CSS animations
      totalChecks++;
      const animatedElements = document.querySelectorAll('[class*="animate"], [style*="animation"]');
      
      if (animatedElements.length > 0) {
        score++;
        details.push(`✓ CSS animations found: ${animatedElements.length} elements`);
      } else {
        details.push(`⚠ No CSS animations detected`);
      }

      // Test for transform-based animations (more performant)
      totalChecks++;
      const transformElements = document.querySelectorAll('[style*="transform"], [class*="transform"]');
      
      if (transformElements.length > 0) {
        score++;
        details.push(`✓ Transform-based animations: ${transformElements.length} elements`);
      } else {
        details.push(`⚠ Limited transform usage detected`);
      }
    } catch (error) {
      details.push(`Error testing animation performance: ${error}`);
    }

    this.addResult({
      testName: 'Animation Performance',
      passed: score >= totalChecks * 0.5,
      score: totalChecks > 0 ? (score / totalChecks) * 100 : 0,
      details,
      timestamp: new Date().toISOString(),
      category: 'performance'
    });
  }

  /**
   * Add a test result to the results array
   */
  private addResult(result: Partial<DesignTestResult>): void {
     this.results.push({
       testName: result.testName || 'Unknown Test',
       passed: result.passed || false,
       score: result.score || 0,
       maxScore: result.maxScore || 100,
       details: result.details || [],
       timestamp: result.timestamp || new Date().toISOString(),
       category: result.category || 'design'
     });
   }

  /**
   * Generate the final comparison report
   */
  private generateReport(): ComparisonReport {
    const totalTests = this.results.length;
    const passedTests = this.results.filter(r => r.passed).length;
    const failedTests = totalTests - passedTests;
    
    const categories: Record<string, { passed: number; total: number; score: number }> = {};
    
    this.results.forEach(result => {
      if (!categories[result.category]) {
        categories[result.category] = { passed: 0, total: 0, score: 0 };
      }
      categories[result.category].total++;
      if (result.passed) {
        categories[result.category].passed++;
      }
      categories[result.category].score += result.score;
    });

    // Calculate average scores for each category
    Object.keys(categories).forEach(category => {
      categories[category].score = categories[category].score / categories[category].total;
    });

    const overallScore = this.results.reduce((sum, r) => sum + r.score, 0) / totalTests;

    return {
      beforeScore: 0, // This would be set from previous runs
      afterScore: overallScore,
      improvement: overallScore, // This would be calculated from before/after
      testResults: this.results,
      timestamp: new Date().toISOString(),
      summary: {
        totalTests,
        passedTests,
        failedTests,
        categories
      }
    };
  }

  /**
   * Calculate contrast ratio between two colors
   */
  private calculateContrastRatio(color1: string, color2: string): number {
    const luminance1 = this.getLuminance(color1);
    const luminance2 = this.getLuminance(color2);
    
    const lighter = Math.max(luminance1, luminance2);
    const darker = Math.min(luminance1, luminance2);
    
    return (lighter + 0.05) / (darker + 0.05);
  }

  /**
   * Get relative luminance of a color
   */
  private getLuminance(color: string): number {
    // Convert color to RGB values
    const rgb = this.hexToRgb(color) || this.cssColorToRgb(color);
    if (!rgb) return 0;

    // Convert to relative luminance
    const [r, g, b] = rgb.map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });

    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  /**
   * Convert hex color to RGB
   */
  private hexToRgb(hex: string): [number, number, number] | null {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? [
      parseInt(result[1], 16),
      parseInt(result[2], 16),
      parseInt(result[3], 16)
    ] : null;
  }

  /**
   * Convert CSS color to RGB
   */
  private cssColorToRgb(color: string): [number, number, number] | null {
    // Create a temporary element to get computed color
    const div = document.createElement('div');
    div.style.color = color;
    document.body.appendChild(div);
    
    const computedColor = getComputedStyle(div).color;
    document.body.removeChild(div);
    
    // Parse rgb() or rgba() format
    const match = computedColor.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
    return match ? [
      parseInt(match[1]),
      parseInt(match[2]),
      parseInt(match[3])
    ] : null;
  }
}