/**
 * WCAG 2.2 AA Compliance Utilities
 * Provides comprehensive accessibility checking and management tools
 */

export interface ContrastRatio {
  ratio: number;
  level: 'AAA' | 'AA' | 'A' | 'FAIL';
  isCompliant: boolean;
}

export interface AccessibilityAuditResult {
  element: Element;
  issues: AccessibilityIssue[];
  score: number;
  recommendations: string[];
}

export interface AccessibilityIssue {
  type: 'contrast' | 'focus' | 'aria' | 'keyboard' | 'structure';
  severity: 'critical' | 'serious' | 'moderate' | 'minor';
  message: string;
  element?: Element;
  fix?: string;
}

export class WCAGComplianceChecker {
  private static instance: WCAGComplianceChecker;
  private contrastCache = new Map<string, ContrastRatio>();
  private auditResults = new Map<Element, AccessibilityAuditResult>();

  static getInstance(): WCAGComplianceChecker {
    if (!WCAGComplianceChecker.instance) {
      WCAGComplianceChecker.instance = new WCAGComplianceChecker();
    }
    return WCAGComplianceChecker.instance;
  }

  /**
   * Calculate color contrast ratio between two colors
   */
  calculateContrastRatio(foreground: string, background: string): ContrastRatio {
    const cacheKey = `${foreground}-${background}`;
    if (this.contrastCache.has(cacheKey)) {
      return this.contrastCache.get(cacheKey)!;
    }

    const fgLuminance = this.getLuminance(foreground);
    const bgLuminance = this.getLuminance(background);
    
    const lighter = Math.max(fgLuminance, bgLuminance);
    const darker = Math.min(fgLuminance, bgLuminance);
    
    const ratio = (lighter + 0.05) / (darker + 0.05);
    
    let level: ContrastRatio['level'];
    let isCompliant: boolean;
    
    if (ratio >= 7) {
      level = 'AAA';
      isCompliant = true;
    } else if (ratio >= 4.5) {
      level = 'AA';
      isCompliant = true;
    } else if (ratio >= 3) {
      level = 'A';
      isCompliant = false;
    } else {
      level = 'FAIL';
      isCompliant = false;
    }
    
    const result: ContrastRatio = { ratio, level, isCompliant };
    this.contrastCache.set(cacheKey, result);
    
    return result;
  }

  /**
   * Get relative luminance of a color
   */
  private getLuminance(color: string): number {
    const rgb = this.hexToRgb(color);
    if (!rgb) return 0;
    
    const normalizedColors = [rgb.r, rgb.g, rgb.b].map(c => {
      c = c / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    });
    
    if (normalizedColors.length !== 3) return 0;
    const [r, g, b] = normalizedColors as [number, number, number];
    return 0.2126 * r + 0.7152 * g + 0.0722 * b;
  }

  /**
   * Convert hex color to RGB
   */
  private hexToRgb(hex: string): { r: number; g: number; b: number } | null {
    // Handle CSS variables and computed styles
    if (hex.startsWith('var(')) {
      const computedStyle = getComputedStyle(document.documentElement);
      const variableName = hex.slice(4, -1);
      hex = computedStyle.getPropertyValue(variableName).trim();
    }
    
    // Remove # if present
    hex = hex.replace('#', '');
    
    // Handle 3-digit hex
    if (hex.length === 3) {
      hex = hex.split('').map(char => char + char).join('');
    }
    
    const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1]!, 16),
      g: parseInt(result[2]!, 16),
      b: parseInt(result[3]!, 16)
    } : null;
  }

  /**
   * Audit an element for accessibility issues
   */
  auditElement(element: Element): AccessibilityAuditResult {
    if (this.auditResults.has(element)) {
      return this.auditResults.get(element)!;
    }

    const issues: AccessibilityIssue[] = [];
    const recommendations: string[] = [];

    // Check contrast
    this.checkContrast(element, issues, recommendations);
    
    // Check focus management
    this.checkFocusManagement(element, issues, recommendations);
    
    // Check ARIA attributes
    this.checkAriaAttributes(element, issues, recommendations);
    
    // Check keyboard accessibility
    this.checkKeyboardAccessibility(element, issues, recommendations);
    
    // Check semantic structure
    this.checkSemanticStructure(element, issues, recommendations);

    // Calculate score (0-100)
    const criticalIssues = issues.filter(i => i.severity === 'critical').length;
    const seriousIssues = issues.filter(i => i.severity === 'serious').length;
    const moderateIssues = issues.filter(i => i.severity === 'moderate').length;
    const minorIssues = issues.filter(i => i.severity === 'minor').length;
    
    const score = Math.max(0, 100 - (criticalIssues * 25) - (seriousIssues * 15) - (moderateIssues * 10) - (minorIssues * 5));

    const result: AccessibilityAuditResult = {
      element,
      issues,
      score,
      recommendations
    };

    this.auditResults.set(element, result);
    return result;
  }

  /**
   * Check color contrast compliance
   */
  private checkContrast(element: Element, issues: AccessibilityIssue[], recommendations: string[]): void {
    const computedStyle = getComputedStyle(element);
    const color = computedStyle.color;
    const backgroundColor = computedStyle.backgroundColor;
    
    if (color && backgroundColor && backgroundColor !== 'rgba(0, 0, 0, 0)') {
      const contrast = this.calculateContrastRatio(color, backgroundColor);
      
      if (!contrast.isCompliant) {
        issues.push({
          type: 'contrast',
          severity: contrast.ratio < 3 ? 'critical' : 'serious',
          message: `Color contrast ratio ${contrast.ratio.toFixed(2)}:1 does not meet WCAG AA standards (4.5:1 required)`,
          element,
          fix: 'Increase color contrast by using darker text or lighter background colors'
        });
        
        recommendations.push('Improve color contrast to meet WCAG AA standards');
      }
    }
  }

  /**
   * Check focus management
   */
  private checkFocusManagement(element: Element, issues: AccessibilityIssue[], recommendations: string[]): void {
    const isInteractive = this.isInteractiveElement(element);
    const tabIndex = element.getAttribute('tabindex');
    const computedStyle = getComputedStyle(element);
    
    if (isInteractive) {
      // Check for focus indicators
      const outlineStyle = computedStyle.outline;
      const outlineWidth = computedStyle.outlineWidth;
      
      if (outlineStyle === 'none' || outlineWidth === '0px') {
        issues.push({
          type: 'focus',
          severity: 'serious',
          message: 'Interactive element lacks visible focus indicator',
          element,
          fix: 'Add visible focus styles using outline or box-shadow'
        });
        
        recommendations.push('Ensure all interactive elements have visible focus indicators');
      }
      
      // Check for negative tabindex on interactive elements
      if (tabIndex === '-1') {
        issues.push({
          type: 'focus',
          severity: 'moderate',
          message: 'Interactive element has negative tabindex, making it unfocusable via keyboard',
          element,
          fix: 'Remove negative tabindex or use tabindex="0"'
        });
      }
    }
  }

  /**
   * Check ARIA attributes
   */
  private checkAriaAttributes(element: Element, issues: AccessibilityIssue[], recommendations: string[]): void {
    const ariaLabel = element.getAttribute('aria-label');
    const ariaLabelledBy = element.getAttribute('aria-labelledby');
    
    // Check for missing labels on form controls
    if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT') {
      const hasLabel = ariaLabel || ariaLabelledBy || element.closest('label') || 
                     document.querySelector(`label[for="${element.id}"]`);
      
      if (!hasLabel) {
        issues.push({
          type: 'aria',
          severity: 'critical',
          message: 'Form control lacks accessible label',
          element,
          fix: 'Add aria-label, aria-labelledby, or associate with a <label> element'
        });
        
        recommendations.push('Ensure all form controls have accessible labels');
      }
    }
    
    // Check for invalid ARIA attributes
    const ariaAttributes = Array.from(element.attributes)
      .filter(attr => attr.name.startsWith('aria-'));
    
    ariaAttributes.forEach(attr => {
      if (!this.isValidAriaAttribute(attr.name)) {
        issues.push({
          type: 'aria',
          severity: 'moderate',
          message: `Invalid ARIA attribute: ${attr.name}`,
          element,
          fix: 'Remove invalid ARIA attribute or use correct attribute name'
        });
      }
    });
  }

  /**
   * Check keyboard accessibility
   */
  private checkKeyboardAccessibility(element: Element, issues: AccessibilityIssue[], recommendations: string[]): void {
    const isInteractive = this.isInteractiveElement(element);
    const hasClickHandler = element.getAttribute('onclick') || 
                           element.addEventListener?.length > 0;
    
    if (hasClickHandler && !isInteractive) {
      const tabIndex = element.getAttribute('tabindex');
      const role = element.getAttribute('role');
      
      if (!tabIndex && !['button', 'link'].includes(role || '')) {
        issues.push({
          type: 'keyboard',
          severity: 'serious',
          message: 'Clickable element is not keyboard accessible',
          element,
          fix: 'Add tabindex="0" and appropriate role, or use semantic HTML elements'
        });
        
        recommendations.push('Ensure all clickable elements are keyboard accessible');
      }
    }
  }

  /**
   * Check semantic structure
   */
  private checkSemanticStructure(element: Element, issues: AccessibilityIssue[], recommendations: string[]): void {
    // Check heading hierarchy
    if (element.tagName.match(/^H[1-6]$/)) {
      const level = parseInt(element.tagName.charAt(1));
      const prevHeading = this.findPreviousHeading(element);
      
      if (prevHeading) {
        const prevLevel = parseInt(prevHeading.tagName.charAt(1));
        if (level > prevLevel + 1) {
          issues.push({
            type: 'structure',
            severity: 'moderate',
            message: `Heading level ${level} skips levels (previous was ${prevLevel})`,
            element,
            fix: 'Use sequential heading levels (h1, h2, h3, etc.)'
          });
          
          recommendations.push('Maintain proper heading hierarchy');
        }
      }
    }
    
    // Check for missing alt text on images
    if (element.tagName === 'IMG') {
      const alt = element.getAttribute('alt');
      const role = element.getAttribute('role');
      
      if (alt === null && role !== 'presentation') {
        issues.push({
          type: 'structure',
          severity: 'critical',
          message: 'Image missing alt attribute',
          element,
          fix: 'Add descriptive alt text or role="presentation" for decorative images'
        });
        
        recommendations.push('Provide alt text for all meaningful images');
      }
    }
  }

  /**
   * Check if element is interactive
   */
  private isInteractiveElement(element: Element): boolean {
    const interactiveTags = ['A', 'BUTTON', 'INPUT', 'TEXTAREA', 'SELECT', 'DETAILS', 'SUMMARY'];
    const interactiveRoles = ['button', 'link', 'menuitem', 'option', 'radio', 'checkbox', 'tab'];
    
    return interactiveTags.includes(element.tagName) ||
           interactiveRoles.includes(element.getAttribute('role') || '') ||
           element.hasAttribute('tabindex') ||
           element.hasAttribute('onclick');
  }

  /**
   * Check if ARIA attribute is valid
   */
  private isValidAriaAttribute(attribute: string): boolean {
    const validAriaAttributes = [
      'aria-label', 'aria-labelledby', 'aria-describedby', 'aria-hidden',
      'aria-expanded', 'aria-selected', 'aria-checked', 'aria-disabled',
      'aria-required', 'aria-invalid', 'aria-live', 'aria-atomic',
      'aria-busy', 'aria-controls', 'aria-owns', 'aria-flowto',
      'aria-haspopup', 'aria-level', 'aria-multiline', 'aria-multiselectable',
      'aria-orientation', 'aria-readonly', 'aria-relevant', 'aria-sort',
      'aria-valuemax', 'aria-valuemin', 'aria-valuenow', 'aria-valuetext',
      'aria-activedescendant', 'aria-colcount', 'aria-colindex',
      'aria-colspan', 'aria-rowcount', 'aria-rowindex', 'aria-rowspan',
      'aria-setsize', 'aria-posinset'
    ];
    
    return validAriaAttributes.includes(attribute);
  }

  /**
   * Find previous heading element
   */
  private findPreviousHeading(element: Element): Element | null {
    let current = element.previousElementSibling;
    
    while (current) {
      if (current.tagName.match(/^H[1-6]$/)) {
        return current;
      }
      current = current.previousElementSibling;
    }
    
    return null;
  }

  /**
   * Audit entire page for accessibility issues
   */
  auditPage(): AccessibilityAuditResult[] {
    const elements = document.querySelectorAll('*');
    const results: AccessibilityAuditResult[] = [];
    
    elements.forEach(element => {
      const result = this.auditElement(element);
      if (result.issues.length > 0) {
        results.push(result);
      }
    });
    
    return results;
  }

  /**
   * Generate accessibility report
   */
  generateReport(): string {
    const results = this.auditPage();
    const totalIssues = results.reduce((sum, result) => sum + result.issues.length, 0);
    const averageScore = results.reduce((sum, result) => sum + result.score, 0) / results.length;
    
    let report = `# Accessibility Audit Report\n\n`;
    report += `**Total Elements Audited:** ${results.length}\n`;
    report += `**Total Issues Found:** ${totalIssues}\n`;
    report += `**Average Accessibility Score:** ${averageScore.toFixed(1)}/100\n\n`;
    
    results.forEach((result, index) => {
      report += `## Element ${index + 1}\n`;
      report += `**Tag:** ${result.element.tagName}\n`;
      report += `**Score:** ${result.score}/100\n`;
      report += `**Issues:** ${result.issues.length}\n\n`;
      
      result.issues.forEach(issue => {
        report += `- **${issue.severity.toUpperCase()}:** ${issue.message}\n`;
        if (issue.fix) {
          report += `  *Fix:* ${issue.fix}\n`;
        }
      });
      
      report += `\n`;
    });
    
    return report;
  }

  /**
   * Clear audit cache
   */
  clearCache(): void {
    this.contrastCache.clear();
    this.auditResults.clear();
  }
}

// Export singleton instance
export const wcagChecker = WCAGComplianceChecker.getInstance();

// Utility functions
export const checkColorContrast = (foreground: string, background: string): ContrastRatio => {
  return wcagChecker.calculateContrastRatio(foreground, background);
};

export const auditElement = (element: Element): AccessibilityAuditResult => {
  return wcagChecker.auditElement(element);
};

export const auditPage = (): AccessibilityAuditResult[] => {
  return wcagChecker.auditPage();
};

export const generateAccessibilityReport = (): string => {
  return wcagChecker.generateReport();
};