#!/usr/bin/env node

/**
 * WCAG 2.1 AA Accessibility Audit for NosytLabs - 2025
 * Comprehensive accessibility testing and compliance verification
 * Tests: ARIA, keyboard navigation, color contrast, semantic HTML, screen reader support
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

class WCAGAccessibilityAuditor {
  constructor() {
    this.results = {
      passed: 0,
      failed: 0,
      warnings: 0,
      issues: [],
      recommendations: [],
      wcagCompliance: {
        levelA: { passed: 0, total: 0 },
        levelAA: { passed: 0, total: 0 }
      }
    };
    
    this.wcagCriteria = {
      levelA: [
        'Images have alt text',
        'Form controls have labels',
        'Page has proper heading structure',
        'Content is keyboard accessible',
        'No seizure-inducing content',
        'Page has a title',
        'Language is specified',
        'Focus order is logical',
        'Link purpose is clear',
        'Headings and labels are descriptive'
      ],
      levelAA: [
        'Color contrast meets 4.5:1 ratio',
        'Text can be resized to 200%',
        'Focus indicators are visible',
        'Content is meaningful without CSS',
        'Reduced motion support',
        'Multiple ways to find content',
        'Consistent navigation',
        'Consistent identification',
        'Error identification',
        'Labels or instructions provided'
      ]
    };
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString().split('T')[1].split('.')[0];
    const colors = {
      info: '\x1b[36m',    // Cyan
      success: '\x1b[32m', // Green
      warning: '\x1b[33m', // Yellow
      error: '\x1b[31m',   // Red
      reset: '\x1b[0m'     // Reset
    };
    
    console.log(`${colors[type]}[${timestamp}] ${message}${colors.reset}`);
  }

  async auditAccessibility() {
    this.log('Starting WCAG 2.1 AA Accessibility Audit', 'info');
    console.log('♿ Comprehensive accessibility compliance testing...\n');
    
    try {
      const startTime = Date.now();
      
      // Phase 1: Semantic HTML Structure
      await this.auditSemanticHTML();
      
      // Phase 2: ARIA Implementation
      await this.auditARIAImplementation();
      
      // Phase 3: Keyboard Navigation
      await this.auditKeyboardNavigation();
      
      // Phase 4: Focus Management
      await this.auditFocusManagement();
      
      // Phase 5: Color Contrast
      await this.auditColorContrast();
      
      // Phase 6: Form Accessibility
      await this.auditFormAccessibility();

      // Phase 7: Image Accessibility
      await this.auditImageAccessibility();

      // Phase 8: Screen Reader Support
      await this.auditScreenReaderSupport();

      // Phase 9: Motion and Animation
      await this.auditMotionAccessibility();
      
      // Generate comprehensive report
      const duration = Date.now() - startTime;
      this.generateAccessibilityReport(duration);
      
      this.log('WCAG 2.1 AA accessibility audit completed successfully!', 'success');
      
    } catch (error) {
      this.log(`Accessibility audit failed: ${error.message}`, 'error');
      throw error;
    }
  }

  async auditSemanticHTML() {
    this.log('Phase 1: Auditing semantic HTML structure');
    
    const filesToCheck = [
      'src/layouts/BaseLayout.astro',
      'src/components/unified/Navigation.astro',
      'src/components/unified/HeroSection.astro',
      'src/components/unified/Card.astro',
      'src/components/Footer.astro'
    ];
    
    for (const filePath of filesToCheck) {
      const fullPath = path.join(rootDir, filePath);
      
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        
        // Check for semantic elements
        const semanticChecks = [
          { pattern: /<main\b/, name: 'Main landmark', required: true },
          { pattern: /<nav\b/, name: 'Navigation landmark', required: true },
          { pattern: /<header\b/, name: 'Header landmark', required: false },
          { pattern: /<footer\b/, name: 'Footer landmark', required: false },
          { pattern: /<h1\b/, name: 'H1 heading', required: true },
          { pattern: /<section\b/, name: 'Section elements', required: false },
          { pattern: /<article\b/, name: 'Article elements', required: false }
        ];
        
        semanticChecks.forEach(check => {
          const found = check.pattern.test(content);
          
          if (check.required) {
            this.wcagCriteria.levelA[2] = 'Page has proper heading structure';
            this.results.wcagCompliance.levelA.total++;
            
            if (found) {
              this.results.passed++;
              this.results.wcagCompliance.levelA.passed++;
              this.log(`  ✅ ${check.name} found in ${filePath}`, 'success');
            } else {
              this.results.failed++;
              this.results.issues.push({
                file: filePath,
                issue: `Missing ${check.name}`,
                severity: 'error',
                wcagCriterion: '1.3.1 Info and Relationships'
              });
              this.log(`  ❌ ${check.name} missing in ${filePath}`, 'error');
            }
          } else if (found) {
            this.log(`  ✅ ${check.name} found in ${filePath}`, 'success');
          }
        });
      }
    }
  }

  async auditARIAImplementation() {
    this.log('Phase 2: Auditing ARIA implementation');
    
    const filesToCheck = [
      'src/components/unified/Navigation.astro',
      'src/components/accessibility/AccessibilityEnhancer.astro',
      'src/components/accessibility/KeyboardNavigation.astro',
      'src/components/forms/EnhancedFormValidation.astro'
    ];
    
    for (const filePath of filesToCheck) {
      const fullPath = path.join(rootDir, filePath);
      
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        
        // Check for ARIA attributes
        const ariaChecks = [
          { pattern: /aria-label=/, name: 'ARIA labels' },
          { pattern: /aria-labelledby=/, name: 'ARIA labelledby' },
          { pattern: /aria-describedby=/, name: 'ARIA describedby' },
          { pattern: /aria-expanded=/, name: 'ARIA expanded states' },
          { pattern: /aria-current=/, name: 'ARIA current states' },
          { pattern: /role=/, name: 'ARIA roles' },
          { pattern: /aria-hidden=/, name: 'ARIA hidden' },
          { pattern: /aria-live=/, name: 'ARIA live regions' }
        ];
        
        let ariaScore = 0;
        ariaChecks.forEach(check => {
          if (check.pattern.test(content)) {
            ariaScore++;
            this.log(`  ✅ ${check.name} implemented in ${filePath}`, 'success');
          }
        });
        
        if (ariaScore >= 4) {
          this.results.passed++;
          this.results.wcagCompliance.levelA.passed++;
        } else {
          this.results.warnings++;
          this.results.recommendations.push({
            file: filePath,
            recommendation: 'Enhance ARIA implementation for better screen reader support',
            priority: 'medium'
          });
        }
        
        this.results.wcagCompliance.levelA.total++;
      }
    }
  }

  async auditKeyboardNavigation() {
    this.log('Phase 3: Auditing keyboard navigation');
    
    const keyboardFiles = [
      'src/components/accessibility/KeyboardNavigation.astro',
      'src/components/unified/Navigation.astro'
    ];
    
    for (const filePath of keyboardFiles) {
      const fullPath = path.join(rootDir, filePath);
      
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        
        // Check for keyboard navigation features
        const keyboardChecks = [
          { pattern: /tabindex=/, name: 'Tab index management' },
          { pattern: /addEventListener.*keydown/, name: 'Keyboard event handlers' },
          { pattern: /focus\(\)/, name: 'Focus management' },
          { pattern: /preventDefault/, name: 'Keyboard event prevention' },
          { pattern: /ArrowUp|ArrowDown|ArrowLeft|ArrowRight/, name: 'Arrow key navigation' },
          { pattern: /Escape/, name: 'Escape key handling' },
          { pattern: /Enter|Space/, name: 'Enter/Space key handling' }
        ];
        
        let keyboardScore = 0;
        keyboardChecks.forEach(check => {
          if (check.pattern.test(content)) {
            keyboardScore++;
            this.log(`  ✅ ${check.name} implemented in ${filePath}`, 'success');
          }
        });
        
        if (keyboardScore >= 5) {
          this.results.passed++;
          this.results.wcagCompliance.levelA.passed++;
        } else {
          this.results.failed++;
          this.results.issues.push({
            file: filePath,
            issue: 'Insufficient keyboard navigation support',
            severity: 'error',
            wcagCriterion: '2.1.1 Keyboard'
          });
        }
        
        this.results.wcagCompliance.levelA.total++;
      }
    }
  }

  async auditFocusManagement() {
    this.log('Phase 4: Auditing focus management');
    
    const focusFiles = [
      'src/components/accessibility/AccessibilityEnhancer.astro',
      'src/components/accessibility/KeyboardNavigation.astro'
    ];
    
    for (const filePath of focusFiles) {
      const fullPath = path.join(rootDir, filePath);
      
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        
        // Check for focus management features
        const focusChecks = [
          { pattern: /focus-visible/, name: 'Focus visible indicators' },
          { pattern: /focus-within/, name: 'Focus within states' },
          { pattern: /outline:/, name: 'Focus outline styles' },
          { pattern: /trapFocus/, name: 'Focus trapping' },
          { pattern: /restoreFocus/, name: 'Focus restoration' }
        ];
        
        let focusScore = 0;
        focusChecks.forEach(check => {
          if (check.pattern.test(content)) {
            focusScore++;
            this.log(`  ✅ ${check.name} implemented in ${filePath}`, 'success');
          }
        });
        
        if (focusScore >= 3) {
          this.results.passed++;
          this.results.wcagCompliance.levelAA.passed++;
        } else {
          this.results.warnings++;
          this.results.recommendations.push({
            file: filePath,
            recommendation: 'Enhance focus management for better accessibility',
            priority: 'high'
          });
        }
        
        this.results.wcagCompliance.levelAA.total++;
      }
    }
  }

  async auditColorContrast() {
    this.log('Phase 5: Auditing color contrast');
    
    const cssFiles = [
      'src/styles/css-variables.css',
      'src/styles/global.css',
      'src/styles/nosytlabs.css'
    ];
    
    for (const filePath of cssFiles) {
      const fullPath = path.join(rootDir, filePath);
      
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        
        // Check for contrast-related CSS
        const contrastChecks = [
          { pattern: /prefers-contrast: high/, name: 'High contrast support' },
          { pattern: /--color-contrast/, name: 'Contrast variables' },
          { pattern: /@media.*contrast/, name: 'Contrast media queries' },
          { pattern: /color-scheme:/, name: 'Color scheme support' }
        ];
        
        let contrastScore = 0;
        contrastChecks.forEach(check => {
          if (check.pattern.test(content)) {
            contrastScore++;
            this.log(`  ✅ ${check.name} implemented in ${filePath}`, 'success');
          }
        });
        
        if (contrastScore >= 2) {
          this.results.passed++;
          this.results.wcagCompliance.levelAA.passed++;
        } else {
          this.results.warnings++;
          this.results.recommendations.push({
            file: filePath,
            recommendation: 'Add high contrast mode support for better accessibility',
            priority: 'medium'
          });
        }
        
        this.results.wcagCompliance.levelAA.total++;
      }
    }
  }

  async auditFormAccessibility() {
    this.log('Phase 6: Auditing form accessibility');

    const formFiles = [
      'src/components/forms/EnhancedFormValidation.astro',
      'src/components/ContactForm.astro'
    ];

    for (const filePath of formFiles) {
      const fullPath = path.join(rootDir, filePath);

      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf8');

        const formChecks = [
          { pattern: /<label\b/, name: 'Form labels' },
          { pattern: /aria-required=/, name: 'Required field indicators' },
          { pattern: /aria-invalid=/, name: 'Invalid field indicators' },
          { pattern: /aria-describedby=/, name: 'Field descriptions' },
          { pattern: /role="alert"/, name: 'Error announcements' }
        ];

        let formScore = 0;
        formChecks.forEach(check => {
          if (check.pattern.test(content)) {
            formScore++;
            this.log(`  ✅ ${check.name} implemented in ${filePath}`, 'success');
          }
        });

        if (formScore >= 3) {
          this.results.passed++;
          this.results.wcagCompliance.levelA.passed++;
        } else {
          this.results.warnings++;
        }

        this.results.wcagCompliance.levelA.total++;
      }
    }
  }

  async auditImageAccessibility() {
    this.log('Phase 7: Auditing image accessibility');

    const imageFiles = [
      'src/layouts/BaseLayout.astro',
      'src/components/unified/HeroSection.astro',
      'src/components/unified/Card.astro'
    ];

    for (const filePath of imageFiles) {
      const fullPath = path.join(rootDir, filePath);

      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf8');

        const imageChecks = [
          { pattern: /<img[^>]+alt=/, name: 'Image alt attributes' },
          { pattern: /alt=""/, name: 'Decorative images' },
          { pattern: /loading="lazy"/, name: 'Lazy loading' }
        ];

        let imageScore = 0;
        imageChecks.forEach(check => {
          if (check.pattern.test(content)) {
            imageScore++;
            this.log(`  ✅ ${check.name} found in ${filePath}`, 'success');
          }
        });

        if (imageScore >= 1) {
          this.results.passed++;
          this.results.wcagCompliance.levelA.passed++;
        } else {
          this.results.failed++;
        }

        this.results.wcagCompliance.levelA.total++;
      }
    }
  }

  async auditScreenReaderSupport() {
    this.log('Phase 8: Auditing screen reader support');

    const srFiles = [
      'src/components/accessibility/AccessibilityEnhancer.astro',
      'src/components/accessibility/KeyboardNavigation.astro'
    ];

    for (const filePath of srFiles) {
      const fullPath = path.join(rootDir, filePath);

      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf8');

        const srChecks = [
          { pattern: /sr-only/, name: 'Screen reader only text' },
          { pattern: /aria-live=/, name: 'Live regions' },
          { pattern: /announce/, name: 'Screen reader announcements' },
          { pattern: /aria-label=/, name: 'Accessible labels' }
        ];

        let srScore = 0;
        srChecks.forEach(check => {
          if (check.pattern.test(content)) {
            srScore++;
            this.log(`  ✅ ${check.name} implemented in ${filePath}`, 'success');
          }
        });

        if (srScore >= 2) {
          this.results.passed++;
          this.results.wcagCompliance.levelA.passed++;
        } else {
          this.results.warnings++;
        }

        this.results.wcagCompliance.levelA.total++;
      }
    }
  }

  async auditMotionAccessibility() {
    this.log('Phase 9: Auditing motion and animation accessibility');

    const motionFiles = [
      'src/styles/global.css',
      'src/styles/nosytlabs.css',
      'src/components/interactive/MicroAnimations.astro'
    ];

    for (const filePath of motionFiles) {
      const fullPath = path.join(rootDir, filePath);

      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf8');

        const motionChecks = [
          { pattern: /prefers-reduced-motion/, name: 'Reduced motion support' },
          { pattern: /@media.*motion/, name: 'Motion media queries' },
          { pattern: /animation.*none/, name: 'Animation disabling' },
          { pattern: /transition.*none/, name: 'Transition disabling' }
        ];

        let motionScore = 0;
        motionChecks.forEach(check => {
          if (check.pattern.test(content)) {
            motionScore++;
            this.log(`  ✅ ${check.name} implemented in ${filePath}`, 'success');
          }
        });

        if (motionScore >= 2) {
          this.results.passed++;
          this.results.wcagCompliance.levelAA.passed++;
        } else {
          this.results.warnings++;
        }

        this.results.wcagCompliance.levelAA.total++;
      }
    }
  }

  generateAccessibilityReport(duration) {
    const totalTests = this.results.passed + this.results.failed + this.results.warnings;
    const passRate = totalTests > 0 ? ((this.results.passed / totalTests) * 100).toFixed(1) : 0;
    
    const levelACompliance = this.results.wcagCompliance.levelA.total > 0 
      ? ((this.results.wcagCompliance.levelA.passed / this.results.wcagCompliance.levelA.total) * 100).toFixed(1)
      : 0;
      
    const levelAACompliance = this.results.wcagCompliance.levelAA.total > 0
      ? ((this.results.wcagCompliance.levelAA.passed / this.results.wcagCompliance.levelAA.total) * 100).toFixed(1)
      : 0;

    const report = `
# WCAG 2.1 AA Accessibility Audit Report
Generated: ${new Date().toISOString()}
Duration: ${(duration / 1000).toFixed(2)}s

## Overall Results
- Tests Passed: ${this.results.passed}
- Tests Failed: ${this.results.failed}
- Warnings: ${this.results.warnings}
- Pass Rate: ${passRate}%

## WCAG Compliance
- Level A: ${levelACompliance}% (${this.results.wcagCompliance.levelA.passed}/${this.results.wcagCompliance.levelA.total})
- Level AA: ${levelAACompliance}% (${this.results.wcagCompliance.levelAA.passed}/${this.results.wcagCompliance.levelAA.total})

## Issues Found
${this.results.issues.map(issue => `- ${issue.file}: ${issue.issue} (${issue.wcagCriterion})`).join('\n')}

## Recommendations
${this.results.recommendations.map(rec => `- ${rec.file}: ${rec.recommendation} (Priority: ${rec.priority})`).join('\n')}

## Next Steps
1. Address critical accessibility issues
2. Implement missing ARIA attributes
3. Enhance keyboard navigation
4. Test with screen readers
5. Validate color contrast ratios
6. Conduct user testing with assistive technologies
`;

    const reportPath = path.join(rootDir, 'ACCESSIBILITY-AUDIT-REPORT.md');
    fs.writeFileSync(reportPath, report.trim());
    
    console.log('\n♿ Accessibility Audit Summary:');
    console.log(`   Tests passed: ${this.results.passed}`);
    console.log(`   Tests failed: ${this.results.failed}`);
    console.log(`   Warnings: ${this.results.warnings}`);
    console.log(`   WCAG Level A: ${levelACompliance}%`);
    console.log(`   WCAG Level AA: ${levelAACompliance}%`);
    console.log(`   Duration: ${(duration / 1000).toFixed(2)}s`);
    console.log(`\n📄 Full report: ACCESSIBILITY-AUDIT-REPORT.md`);
  }
}

// Run audit if called directly
const isMainModule = process.argv[1] && import.meta.url.endsWith(process.argv[1]);
if (isMainModule || import.meta.url === `file://${process.argv[1]}`) {
  console.log('Starting WCAG 2.1 AA Accessibility Audit...');
  const auditor = new WCAGAccessibilityAuditor();
  auditor.auditAccessibility().catch((error) => {
    console.error('Accessibility audit failed:', error);
    process.exit(1);
  });
}

export { WCAGAccessibilityAuditor };
