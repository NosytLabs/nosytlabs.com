#!/usr/bin/env node

/**
 * Browser Compatibility Audit for NosytLabs - 2025
 * Static analysis of code for cross-browser compatibility issues
 * Analyzes CSS, JavaScript, and HTML for browser-specific problems
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

class BrowserCompatibilityAuditor {
  constructor() {
    this.results = {
      cssIssues: [],
      jsIssues: [],
      htmlIssues: [],
      recommendations: [],
      browserSupport: {
        chrome: { version: 80, issues: [] },
        firefox: { version: 78, issues: [] },
        safari: { version: 14, issues: [] },
        edge: { version: 80, issues: [] }
      },
      summary: {
        totalIssues: 0,
        criticalIssues: 0,
        warningIssues: 0,
        compatibilityScore: 0
      }
    };
    
    this.cssCompatibilityRules = [
      { pattern: /backdrop-filter/, browsers: ['safari<14', 'firefox<103'], severity: 'warning', fix: 'Use -webkit-backdrop-filter fallback' },
      { pattern: /container-type/, browsers: ['safari<16', 'firefox<110'], severity: 'warning', fix: 'Use media queries fallback' },
      { pattern: /aspect-ratio/, browsers: ['safari<15', 'firefox<89'], severity: 'warning', fix: 'Use padding-bottom technique' },
      { pattern: /scroll-behavior/, browsers: ['safari<14'], severity: 'info', fix: 'Use JavaScript smooth scroll polyfill' },
      { pattern: /gap(?:\s|:)/, browsers: ['safari<14.1'], severity: 'warning', fix: 'Use margin fallback for flexbox gap' },
      { pattern: /:focus-visible/, browsers: ['safari<15.4'], severity: 'warning', fix: 'Use :focus fallback' },
      { pattern: /accent-color/, browsers: ['safari<15.4', 'firefox<92'], severity: 'info', fix: 'Provide custom styling fallback' }
    ];
    
    this.jsCompatibilityRules = [
      { pattern: /\.replaceAll\(/, browsers: ['safari<14'], severity: 'warning', fix: 'Use .replace() with global regex' },
      { pattern: /Promise\.allSettled/, browsers: ['safari<13'], severity: 'warning', fix: 'Use polyfill or Promise.all with catch' },
      { pattern: /\?\?=/, browsers: ['safari<14'], severity: 'warning', fix: 'Use traditional assignment' },
      { pattern: /\?\.\[/, browsers: ['safari<13.1'], severity: 'warning', fix: 'Use traditional property access with checks' },
      { pattern: /BigInt/, browsers: ['safari<14'], severity: 'warning', fix: 'Use number or polyfill for large integers' },
      { pattern: /ResizeObserver/, browsers: ['safari<13.1'], severity: 'warning', fix: 'Use polyfill' },
      { pattern: /IntersectionObserver/, browsers: ['safari<12.1'], severity: 'warning', fix: 'Use polyfill' }
    ];
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

  async auditCompatibility() {
    this.log('Starting Browser Compatibility Audit', 'info');
    console.log('🔍 Analyzing code for cross-browser compatibility issues...\n');
    
    try {
      const startTime = Date.now();
      
      // Audit CSS files
      await this.auditCSSFiles();
      
      // Audit JavaScript files
      await this.auditJavaScriptFiles();
      
      // Audit HTML/Astro files
      await this.auditHTMLFiles();
      
      // Analyze browser support
      this.analyzeBrowserSupport();
      
      // Generate recommendations
      this.generateRecommendations();
      
      // Generate report
      const duration = Date.now() - startTime;
      this.generateCompatibilityReport(duration);
      
      this.log('Browser compatibility audit completed successfully!', 'success');
      
    } catch (error) {
      this.log(`Compatibility audit failed: ${error.message}`, 'error');
      throw error;
    }
  }

  async auditCSSFiles() {
    this.log('Auditing CSS files for compatibility issues');
    
    const cssFiles = this.findFiles(['src/styles', 'public/styles'], ['.css']);
    
    for (const filePath of cssFiles) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        this.auditCSSContent(content, filePath);
      } catch (error) {
        this.log(`  Error reading ${filePath}: ${error.message}`, 'warning');
      }
    }
    
    this.log(`  Audited ${cssFiles.length} CSS files`);
  }

  auditCSSContent(content, filePath) {
    const lines = content.split('\n');
    
    this.cssCompatibilityRules.forEach(rule => {
      lines.forEach((line, index) => {
        if (rule.pattern.test(line)) {
          this.results.cssIssues.push({
            file: filePath,
            line: index + 1,
            code: line.trim(),
            issue: `CSS feature may not be supported in: ${rule.browsers.join(', ')}`,
            severity: rule.severity,
            fix: rule.fix,
            browsers: rule.browsers
          });
          
          this.updateBrowserIssues(rule.browsers, {
            type: 'CSS',
            file: filePath,
            line: index + 1,
            issue: rule.fix
          });
        }
      });
    });
  }

  async auditJavaScriptFiles() {
    this.log('Auditing JavaScript files for compatibility issues');
    
    const jsFiles = this.findFiles(['src/scripts', 'src/components', 'public/scripts'], ['.js', '.ts', '.astro']);
    
    for (const filePath of jsFiles) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        this.auditJavaScriptContent(content, filePath);
      } catch (error) {
        this.log(`  Error reading ${filePath}: ${error.message}`, 'warning');
      }
    }
    
    this.log(`  Audited ${jsFiles.length} JavaScript files`);
  }

  auditJavaScriptContent(content, filePath) {
    const lines = content.split('\n');
    
    this.jsCompatibilityRules.forEach(rule => {
      lines.forEach((line, index) => {
        if (rule.pattern.test(line)) {
          this.results.jsIssues.push({
            file: filePath,
            line: index + 1,
            code: line.trim(),
            issue: `JavaScript feature may not be supported in: ${rule.browsers.join(', ')}`,
            severity: rule.severity,
            fix: rule.fix,
            browsers: rule.browsers
          });
          
          this.updateBrowserIssues(rule.browsers, {
            type: 'JavaScript',
            file: filePath,
            line: index + 1,
            issue: rule.fix
          });
        }
      });
    });
  }

  async auditHTMLFiles() {
    this.log('Auditing HTML/Astro files for compatibility issues');
    
    const htmlFiles = this.findFiles(['src/pages', 'src/layouts', 'src/components'], ['.astro', '.html']);
    
    for (const filePath of htmlFiles) {
      try {
        const content = fs.readFileSync(filePath, 'utf8');
        this.auditHTMLContent(content, filePath);
      } catch (error) {
        this.log(`  Error reading ${filePath}: ${error.message}`, 'warning');
      }
    }
    
    this.log(`  Audited ${htmlFiles.length} HTML/Astro files`);
  }

  auditHTMLContent(content, filePath) {
    const lines = content.split('\n');
    
    // Check for HTML5 features that need polyfills
    const htmlRules = [
      { pattern: /<input[^>]+type=["']date["']/, browsers: ['safari<14.1'], severity: 'warning', fix: 'Provide date picker polyfill' },
      { pattern: /<input[^>]+type=["']color["']/, browsers: ['safari<12.1'], severity: 'warning', fix: 'Provide color picker polyfill' },
      { pattern: /<details/, browsers: ['safari<13'], severity: 'warning', fix: 'Provide details/summary polyfill' },
      { pattern: /<dialog/, browsers: ['safari<15.4', 'firefox<98'], severity: 'warning', fix: 'Provide dialog polyfill' },
      { pattern: /loading=["']lazy["']/, browsers: ['safari<15.4'], severity: 'info', fix: 'Provide intersection observer fallback' }
    ];
    
    htmlRules.forEach(rule => {
      lines.forEach((line, index) => {
        if (rule.pattern.test(line)) {
          this.results.htmlIssues.push({
            file: filePath,
            line: index + 1,
            code: line.trim(),
            issue: `HTML feature may not be supported in: ${rule.browsers.join(', ')}`,
            severity: rule.severity,
            fix: rule.fix,
            browsers: rule.browsers
          });
          
          this.updateBrowserIssues(rule.browsers, {
            type: 'HTML',
            file: filePath,
            line: index + 1,
            issue: rule.fix
          });
        }
      });
    });
  }

  findFiles(directories, extensions) {
    const files = [];
    
    directories.forEach(dir => {
      const fullPath = path.join(rootDir, dir);
      if (fs.existsSync(fullPath)) {
        this.walkDirectory(fullPath, files, extensions);
      }
    });
    
    return files;
  }

  walkDirectory(dir, files, extensions) {
    const items = fs.readdirSync(dir);
    
    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        this.walkDirectory(fullPath, files, extensions);
      } else if (extensions.some(ext => item.endsWith(ext))) {
        files.push(fullPath);
      }
    });
  }

  updateBrowserIssues(browsers, issue) {
    browsers.forEach(browserSpec => {
      const [browser, version] = browserSpec.split('<');
      if (this.results.browserSupport[browser]) {
        this.results.browserSupport[browser].issues.push(issue);
      }
    });
  }

  analyzeBrowserSupport() {
    this.log('Analyzing browser support');
    
    const allIssues = [...this.results.cssIssues, ...this.results.jsIssues, ...this.results.htmlIssues];
    
    this.results.summary.totalIssues = allIssues.length;
    this.results.summary.criticalIssues = allIssues.filter(issue => issue.severity === 'error').length;
    this.results.summary.warningIssues = allIssues.filter(issue => issue.severity === 'warning').length;
    
    // Calculate compatibility score (100 - percentage of critical/warning issues)
    const criticalWeight = this.results.summary.criticalIssues * 10;
    const warningWeight = this.results.summary.warningIssues * 3;
    const totalWeight = criticalWeight + warningWeight;
    
    this.results.summary.compatibilityScore = Math.max(0, 100 - Math.min(100, totalWeight));
  }

  generateRecommendations() {
    this.log('Generating compatibility recommendations');
    
    // Group issues by type and severity
    const criticalIssues = [...this.results.cssIssues, ...this.results.jsIssues, ...this.results.htmlIssues]
      .filter(issue => issue.severity === 'error' || issue.severity === 'warning');
    
    if (criticalIssues.length > 0) {
      this.results.recommendations.push('🔧 Address critical compatibility issues first');
      this.results.recommendations.push('📦 Consider adding polyfills for unsupported features');
      this.results.recommendations.push('🧪 Test thoroughly in target browsers');
    }
    
    // Browser-specific recommendations
    Object.entries(this.results.browserSupport).forEach(([browser, data]) => {
      if (data.issues.length > 0) {
        this.results.recommendations.push(`🌐 ${browser.charAt(0).toUpperCase() + browser.slice(1)}: ${data.issues.length} compatibility issues found`);
      }
    });
    
    if (this.results.summary.compatibilityScore < 80) {
      this.results.recommendations.push('⚠️ Low compatibility score - consider modernizing codebase gradually');
    }
    
    this.results.recommendations.push('✅ Add browser compatibility CSS and JavaScript files');
    this.results.recommendations.push('🔍 Implement feature detection and progressive enhancement');
    this.results.recommendations.push('📊 Monitor browser usage analytics to prioritize fixes');
  }

  generateCompatibilityReport(duration) {
    const report = `
# Browser Compatibility Audit Report
Generated: ${new Date().toISOString()}
Duration: ${(duration / 1000).toFixed(2)}s

## Summary
- Total Issues: ${this.results.summary.totalIssues}
- Critical Issues: ${this.results.summary.criticalIssues}
- Warning Issues: ${this.results.summary.warningIssues}
- Compatibility Score: ${this.results.summary.compatibilityScore}/100

## Browser Support Analysis
${Object.entries(this.results.browserSupport).map(([browser, data]) => 
  `- ${browser.charAt(0).toUpperCase() + browser.slice(1)} ${data.version}+: ${data.issues.length} issues`
).join('\n')}

## CSS Compatibility Issues (${this.results.cssIssues.length})
${this.results.cssIssues.map(issue => 
  `- ${issue.file}:${issue.line} - ${issue.issue}\n  Fix: ${issue.fix}`
).join('\n')}

## JavaScript Compatibility Issues (${this.results.jsIssues.length})
${this.results.jsIssues.map(issue => 
  `- ${issue.file}:${issue.line} - ${issue.issue}\n  Fix: ${issue.fix}`
).join('\n')}

## HTML Compatibility Issues (${this.results.htmlIssues.length})
${this.results.htmlIssues.map(issue => 
  `- ${issue.file}:${issue.line} - ${issue.issue}\n  Fix: ${issue.fix}`
).join('\n')}

## Recommendations
${this.results.recommendations.map(rec => `- ${rec}`).join('\n')}

## Next Steps
1. Address critical compatibility issues first
2. Add polyfills for unsupported features
3. Test in target browsers (Chrome 80+, Firefox 78+, Safari 14+, Edge 80+)
4. Implement progressive enhancement strategies
5. Monitor browser usage analytics
6. Update browser support documentation
`;

    const reportPath = path.join(rootDir, 'BROWSER-COMPATIBILITY-AUDIT-REPORT.md');
    fs.writeFileSync(reportPath, report.trim());
    
    // Save detailed JSON results
    const jsonPath = path.join(rootDir, 'test-artifacts');
    if (!fs.existsSync(jsonPath)) {
      fs.mkdirSync(jsonPath, { recursive: true });
    }
    fs.writeFileSync(path.join(jsonPath, 'browser-compatibility-audit.json'), JSON.stringify(this.results, null, 2));
    
    console.log('\n🔍 Browser Compatibility Audit Summary:');
    console.log(`   Total issues: ${this.results.summary.totalIssues}`);
    console.log(`   Critical: ${this.results.summary.criticalIssues}`);
    console.log(`   Warnings: ${this.results.summary.warningIssues}`);
    console.log(`   Compatibility score: ${this.results.summary.compatibilityScore}/100`);
    console.log(`   Duration: ${(duration / 1000).toFixed(2)}s`);
    console.log(`\n📄 Full report: BROWSER-COMPATIBILITY-AUDIT-REPORT.md`);
    console.log(`📊 Detailed results: test-artifacts/browser-compatibility-audit.json`);
  }
}

// Run audit if called directly
const isMainModule = process.argv[1] && import.meta.url.endsWith(process.argv[1]);
if (isMainModule || import.meta.url === `file://${process.argv[1]}`) {
  console.log('Starting Browser Compatibility Audit...');
  const auditor = new BrowserCompatibilityAuditor();
  auditor.auditCompatibility().catch((error) => {
    console.error('Browser compatibility audit failed:', error);
    process.exit(1);
  });
}

export { BrowserCompatibilityAuditor };
