#!/usr/bin/env node

/**
 * Comprehensive Site Audit Script
 * Scans for loading errors, broken links, missing files, and content authenticity
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

console.log('🔍 NosytLabs Comprehensive Site Audit\n');

class SiteAuditor {
  constructor() {
    this.issues = [];
    this.warnings = [];
    this.successes = [];
    this.auditResults = {
      loadingErrors: [],
      brokenLinks: [],
      missingFiles: [],
      contentIssues: [],
      securityIssues: [],
      performanceIssues: []
    };
  }

  /**
   * Run complete audit
   */
  async runAudit() {
    console.log('🚀 Starting comprehensive audit...\n');

    await this.auditFileStructure();
    await this.auditHTMLFiles();
    await this.auditAssets();
    await this.auditLinks();
    await this.auditContent();
    await this.auditSecurity();
    await this.auditPerformance();
    await this.generateReport();

    console.log('\n✅ Audit completed!');
  }

  /**
   * Audit file structure and missing files
   */
  async auditFileStructure() {
    console.log('📁 Auditing file structure...');

    const distPath = path.join(rootDir, 'dist');
    if (!fs.existsSync(distPath)) {
      this.issues.push('❌ Build directory (dist) not found');
      return;
    }

    // Check essential files
    const essentialFiles = [
      'dist/index.html',
      'dist/services.html',
      'dist/projects.html',
      'dist/content-creation.html',
      'dist/nosytos95.html',
      'dist/passive-income.html',
      'dist/crypto-mining.html',
      'dist/3d-printing.html',
      'dist/favicon.ico',
      'dist/robots.txt',
      'dist/manifest.json'
    ];

    let foundFiles = 0;
    essentialFiles.forEach(file => {
      const filePath = path.join(rootDir, file);
      if (fs.existsSync(filePath)) {
        foundFiles++;
        this.successes.push(`✅ ${file} found`);
      } else {
        this.issues.push(`❌ Missing essential file: ${file}`);
        this.auditResults.missingFiles.push(file);
      }
    });

    console.log(`   📊 Essential files: ${foundFiles}/${essentialFiles.length} found`);
  }

  /**
   * Audit HTML files for errors and issues
   */
  async auditHTMLFiles() {
    console.log('\n📄 Auditing HTML files...');

    const distPath = path.join(rootDir, 'dist');
    const htmlFiles = this.findFiles(distPath, /\.html$/);

    console.log(`   Found ${htmlFiles.length} HTML files`);

    for (const htmlFile of htmlFiles) {
      await this.auditSingleHTMLFile(htmlFile);
    }
  }

  /**
   * Audit a single HTML file
   */
  async auditSingleHTMLFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const fileName = path.relative(path.join(rootDir, 'dist'), filePath);

      // Check for basic HTML structure
      if (!content.includes('<!DOCTYPE html>')) {
        this.issues.push(`❌ ${fileName}: Missing DOCTYPE declaration`);
      }

      if (!content.includes('<title>')) {
        this.issues.push(`❌ ${fileName}: Missing title tag`);
      }

      if (!content.includes('name="description"')) {
        this.warnings.push(`⚠️  ${fileName}: Missing meta description`);
      }

      // Check for broken internal links
      const internalLinks = content.match(/href="\/[^"]*"/g) || [];
      for (const link of internalLinks) {
        const href = link.match(/href="([^"]*)"/)[1];
        if (href.startsWith('/') && !href.includes('#')) {
          const targetFile = path.join(rootDir, 'dist', href === '/' ? 'index.html' : href + '.html');
          if (!fs.existsSync(targetFile)) {
            this.issues.push(`❌ ${fileName}: Broken internal link: ${href}`);
            this.auditResults.brokenLinks.push({ file: fileName, link: href, type: 'internal' });
          }
        }
      }

      // Check for missing assets referenced in HTML
      const assetRefs = [
        ...content.match(/src="[^"]*"/g) || [],
        ...content.match(/href="[^"]*\.css"/g) || [],
        ...content.match(/href="[^"]*\.js"/g) || []
      ];

      for (const assetRef of assetRefs) {
        const assetPath = assetRef.match(/(src|href)="([^"]*)"/)[2];
        if (assetPath.startsWith('/') && !assetPath.startsWith('//') && !assetPath.startsWith('http')) {
          const fullAssetPath = path.join(rootDir, 'dist', assetPath);
          if (!fs.existsSync(fullAssetPath)) {
            this.issues.push(`❌ ${fileName}: Missing asset: ${assetPath}`);
            this.auditResults.loadingErrors.push({ file: fileName, asset: assetPath, type: 'missing' });
          }
        }
      }

      // Check for content authenticity issues
      this.auditContentAuthenticity(fileName, content);

    } catch (error) {
      this.issues.push(`❌ Error reading ${filePath}: ${error.message}`);
    }
  }

  /**
   * Audit content for authenticity and factual accuracy
   */
  auditContentAuthenticity(fileName, content) {
    // Check for placeholder content
    const placeholders = [
      'Lorem ipsum',
      'placeholder',
      'TODO',
      'FIXME',
      'Coming soon',
      'Under construction',
      'Sample text',
      'Example content'
    ];

    placeholders.forEach(placeholder => {
      if (content.toLowerCase().includes(placeholder.toLowerCase())) {
        this.warnings.push(`⚠️  ${fileName}: Contains placeholder content: "${placeholder}"`);
        this.auditResults.contentIssues.push({ file: fileName, issue: `Placeholder: ${placeholder}` });
      }
    });

    // Check for inconsistent branding
    const brandingIssues = [
      { wrong: 'OMA AI', correct: 'NosytLabs' },
      { wrong: 'oma-ai', correct: 'nosytlabs' },
      { wrong: 'OMA.AI', correct: 'NosytLabs' }
    ];

    brandingIssues.forEach(({ wrong, correct }) => {
      if (content.includes(wrong)) {
        this.issues.push(`❌ ${fileName}: Incorrect branding "${wrong}" should be "${correct}"`);
        this.auditResults.contentIssues.push({ file: fileName, issue: `Branding: ${wrong} → ${correct}` });
      }
    });

    // Check for outdated information
    const currentYear = new Date().getFullYear();
    const yearMatches = content.match(/20\d{2}/g) || [];
    yearMatches.forEach(year => {
      const yearNum = parseInt(year);
      if (yearNum < currentYear - 1 && yearNum > 2020) {
        this.warnings.push(`⚠️  ${fileName}: Potentially outdated year reference: ${year}`);
      }
    });
  }

  /**
   * Audit assets for optimization and loading issues
   */
  async auditAssets() {
    console.log('\n🖼️  Auditing assets...');

    const distPath = path.join(rootDir, 'dist');
    
    // Check images
    const imageFiles = this.findFiles(distPath, /\.(jpg|jpeg|png|webp|avif|svg|ico)$/);
    console.log(`   Found ${imageFiles.length} image files`);

    let largeImages = 0;
    let unoptimizedImages = 0;

    imageFiles.forEach(imagePath => {
      try {
        const stats = fs.statSync(imagePath);
        const fileName = path.relative(distPath, imagePath);
        
        // Check file size (>1MB is large)
        if (stats.size > 1024 * 1024) {
          largeImages++;
          this.warnings.push(`⚠️  Large image (${this.formatBytes(stats.size)}): ${fileName}`);
          this.auditResults.performanceIssues.push({ file: fileName, issue: `Large file: ${this.formatBytes(stats.size)}` });
        }

        // Check for unoptimized formats
        if (fileName.match(/\.(jpg|jpeg|png)$/) && !fileName.includes('fallback')) {
          const webpVersion = imagePath.replace(/\.(jpg|jpeg|png)$/, '.webp');
          if (!fs.existsSync(webpVersion)) {
            unoptimizedImages++;
            this.warnings.push(`⚠️  No WebP version for: ${fileName}`);
          }
        }
      } catch (error) {
        this.issues.push(`❌ Error checking image ${imagePath}: ${error.message}`);
      }
    });

    console.log(`   📊 Large images: ${largeImages}, Unoptimized: ${unoptimizedImages}`);

    // Check JavaScript and CSS files
    const jsFiles = this.findFiles(distPath, /\.js$/);
    const cssFiles = this.findFiles(distPath, /\.css$/);

    console.log(`   Found ${jsFiles.length} JS files, ${cssFiles.length} CSS files`);

    // Check for minification
    let unminifiedJS = 0;
    let unminifiedCSS = 0;

    jsFiles.forEach(jsPath => {
      const fileName = path.relative(distPath, jsPath);
      if (!fileName.includes('.min.') && !fileName.includes('-') && fs.statSync(jsPath).size > 10000) {
        try {
          const content = fs.readFileSync(jsPath, 'utf8');
          if (content.includes('  ') || content.includes('\n\n')) {
            unminifiedJS++;
            this.warnings.push(`⚠️  Potentially unminified JS: ${fileName}`);
          }
        } catch (error) {
          // Skip if can't read file
        }
      }
    });

    cssFiles.forEach(cssPath => {
      const fileName = path.relative(distPath, cssPath);
      if (!fileName.includes('.min.') && fs.statSync(cssPath).size > 5000) {
        try {
          const content = fs.readFileSync(cssPath, 'utf8');
          if (content.includes('  ') || content.includes('\n\n')) {
            unminifiedCSS++;
            this.warnings.push(`⚠️  Potentially unminified CSS: ${fileName}`);
          }
        } catch (error) {
          // Skip if can't read file
        }
      }
    });

    console.log(`   📊 Unminified JS: ${unminifiedJS}, Unminified CSS: ${unminifiedCSS}`);
  }

  /**
   * Audit external links (basic check)
   */
  async auditLinks() {
    console.log('\n🔗 Auditing external links...');

    const distPath = path.join(rootDir, 'dist');
    const htmlFiles = this.findFiles(distPath, /\.html$/);

    const externalLinks = new Set();

    htmlFiles.forEach(htmlFile => {
      try {
        const content = fs.readFileSync(htmlFile, 'utf8');
        const links = content.match(/href="https?:\/\/[^"]*"/g) || [];
        links.forEach(link => {
          const url = link.match(/href="([^"]*)"/)[1];
          externalLinks.add(url);
        });
      } catch (error) {
        // Skip if can't read file
      }
    });

    console.log(`   Found ${externalLinks.size} unique external links`);

    // Check for known problematic links
    const problematicDomains = [
      'github.com/NosytLabs/dev-toolkit', // Known 404
      'github.com/NosytLabs/mining-dashboard', // Known 404
      'kick.com/Tycen' // Known 403
    ];

    externalLinks.forEach(link => {
      problematicDomains.forEach(domain => {
        if (link.includes(domain)) {
          this.warnings.push(`⚠️  Potentially broken external link: ${link}`);
          this.auditResults.brokenLinks.push({ link, type: 'external', status: 'suspected' });
        }
      });
    });
  }

  /**
   * Audit content for factual accuracy
   */
  async auditContent() {
    console.log('\n📝 Auditing content accuracy...');

    const distPath = path.join(rootDir, 'dist');
    const indexPath = path.join(distPath, 'index.html');

    if (fs.existsSync(indexPath)) {
      const content = fs.readFileSync(indexPath, 'utf8');

      // Check for authentic NosytLabs information
      const expectedContent = [
        'NosytLabs',
        'Notable Opportunities Shape Your Tomorrow',
        'Web Development',
        'AI Integration',
        'Content Creation',
        '3D Printing',
        'Passive Income'
      ];

      expectedContent.forEach(expected => {
        if (!content.includes(expected)) {
          this.warnings.push(`⚠️  Missing expected content: "${expected}"`);
          this.auditResults.contentIssues.push({ file: 'index.html', issue: `Missing: ${expected}` });
        } else {
          this.successes.push(`✅ Found expected content: "${expected}"`);
        }
      });

      // Check for contact information authenticity
      if (content.includes('contact@nosytlabs.com')) {
        this.successes.push('✅ Authentic contact email found');
      } else {
        this.warnings.push('⚠️  Contact email not found or incorrect');
      }

      // Check for social media links
      const socialLinks = [
        'github.com/NosytLabs',
        'youtube.com/@TycenYT',
        'kick.com/Tycen'
      ];

      socialLinks.forEach(social => {
        if (content.includes(social)) {
          this.successes.push(`✅ Found social link: ${social}`);
        } else {
          this.warnings.push(`⚠️  Missing social link: ${social}`);
        }
      });
    }
  }

  /**
   * Audit security configurations
   */
  async auditSecurity() {
    console.log('\n🛡️  Auditing security...');

    // Check robots.txt
    const robotsPath = path.join(rootDir, 'dist', 'robots.txt');
    if (fs.existsSync(robotsPath)) {
      this.successes.push('✅ robots.txt found');
    } else {
      this.warnings.push('⚠️  robots.txt missing');
    }

    // Check for security headers in HTML
    const distPath = path.join(rootDir, 'dist');
    const htmlFiles = this.findFiles(distPath, /\.html$/);

    htmlFiles.forEach(htmlFile => {
      try {
        const content = fs.readFileSync(htmlFile, 'utf8');
        const fileName = path.relative(distPath, htmlFile);

        // Check for CSP headers
        if (content.includes('Content-Security-Policy')) {
          this.successes.push(`✅ ${fileName}: CSP headers found`);
        }

        // Check for external script sources
        const externalScripts = content.match(/src="https?:\/\/[^"]*"/g) || [];
        if (externalScripts.length > 0) {
          this.warnings.push(`⚠️  ${fileName}: ${externalScripts.length} external scripts found`);
        }
      } catch (error) {
        // Skip if can't read file
      }
    });
  }

  /**
   * Audit performance optimizations
   */
  async auditPerformance() {
    console.log('\n⚡ Auditing performance...');

    const distPath = path.join(rootDir, 'dist');
    
    // Calculate total build size
    const totalSize = this.calculateDirectorySize(distPath);
    console.log(`   📊 Total build size: ${this.formatBytes(totalSize)}`);

    if (totalSize > 50 * 1024 * 1024) { // 50MB
      this.warnings.push(`⚠️  Large build size: ${this.formatBytes(totalSize)}`);
      this.auditResults.performanceIssues.push({ issue: `Large build: ${this.formatBytes(totalSize)}` });
    }

    // Check for lazy loading
    const htmlFiles = this.findFiles(distPath, /\.html$/);
    let lazyLoadingFound = false;

    htmlFiles.forEach(htmlFile => {
      try {
        const content = fs.readFileSync(htmlFile, 'utf8');
        if (content.includes('loading="lazy"') || content.includes('lazy-loading')) {
          lazyLoadingFound = true;
        }
      } catch (error) {
        // Skip if can't read file
      }
    });

    if (lazyLoadingFound) {
      this.successes.push('✅ Lazy loading implemented');
    } else {
      this.warnings.push('⚠️  Lazy loading not detected');
    }

    // Check for service worker
    const swPath = path.join(distPath, 'service-worker.js');
    if (fs.existsSync(swPath)) {
      this.successes.push('✅ Service worker found');
    } else {
      this.warnings.push('⚠️  Service worker missing');
    }
  }

  /**
   * Generate comprehensive audit report
   */
  async generateReport() {
    console.log('\n📋 Generating audit report...');

    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalIssues: this.issues.length,
        totalWarnings: this.warnings.length,
        totalSuccesses: this.successes.length,
        overallScore: this.calculateScore()
      },
      issues: this.issues,
      warnings: this.warnings,
      successes: this.successes,
      detailedResults: this.auditResults,
      recommendations: this.generateRecommendations()
    };

    // Save report
    const reportPath = path.join(rootDir, 'audit-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    // Display summary
    this.displaySummary(report);

    console.log(`\n📄 Full report saved to: audit-report.json`);
  }

  /**
   * Display audit summary
   */
  displaySummary(report) {
    console.log('\n📊 AUDIT SUMMARY');
    console.log('================');
    console.log(`Overall Score: ${report.summary.overallScore}%`);
    console.log(`Issues: ${report.summary.totalIssues}`);
    console.log(`Warnings: ${report.summary.totalWarnings}`);
    console.log(`Successes: ${report.summary.totalSuccesses}`);

    if (report.summary.totalIssues > 0) {
      console.log('\n❌ CRITICAL ISSUES:');
      this.issues.slice(0, 5).forEach(issue => console.log(`   ${issue}`));
      if (this.issues.length > 5) {
        console.log(`   ... and ${this.issues.length - 5} more`);
      }
    }

    if (report.summary.totalWarnings > 0) {
      console.log('\n⚠️  WARNINGS:');
      this.warnings.slice(0, 5).forEach(warning => console.log(`   ${warning}`));
      if (this.warnings.length > 5) {
        console.log(`   ... and ${this.warnings.length - 5} more`);
      }
    }

    console.log('\n🎯 TOP RECOMMENDATIONS:');
    report.recommendations.slice(0, 5).forEach(rec => console.log(`   ${rec}`));
  }

  /**
   * Calculate overall audit score
   */
  calculateScore() {
    const total = this.issues.length + this.warnings.length + this.successes.length;
    if (total === 0) return 100;
    
    const score = ((this.successes.length - this.issues.length * 2 - this.warnings.length * 0.5) / total) * 100;
    return Math.max(0, Math.min(100, Math.round(score)));
  }

  /**
   * Generate recommendations based on findings
   */
  generateRecommendations() {
    const recommendations = [];

    if (this.auditResults.loadingErrors.length > 0) {
      recommendations.push('Fix missing assets and loading errors');
    }

    if (this.auditResults.brokenLinks.length > 0) {
      recommendations.push('Update or remove broken links');
    }

    if (this.auditResults.contentIssues.length > 0) {
      recommendations.push('Review and update content for accuracy');
    }

    if (this.auditResults.performanceIssues.length > 0) {
      recommendations.push('Optimize images and reduce bundle sizes');
    }

    recommendations.push('Implement comprehensive link checking in CI/CD');
    recommendations.push('Set up automated content validation');
    recommendations.push('Add performance monitoring');

    return recommendations;
  }

  /**
   * Helper methods
   */
  findFiles(dir, pattern) {
    const files = [];
    
    if (!fs.existsSync(dir)) return files;

    try {
      const items = fs.readdirSync(dir);
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        try {
          const stat = fs.statSync(fullPath);
          
          if (stat.isDirectory() && !item.startsWith('.')) {
            files.push(...this.findFiles(fullPath, pattern));
          } else if (stat.isFile() && pattern.test(item)) {
            files.push(fullPath);
          }
        } catch (error) {
          // Skip files we can't access
        }
      });
    } catch (error) {
      // Skip directories we can't read
    }

    return files;
  }

  calculateDirectorySize(dir) {
    let totalSize = 0;
    
    if (!fs.existsSync(dir)) return 0;

    try {
      const items = fs.readdirSync(dir);
      items.forEach(item => {
        const fullPath = path.join(dir, item);
        try {
          const stat = fs.statSync(fullPath);
          
          if (stat.isDirectory()) {
            totalSize += this.calculateDirectorySize(fullPath);
          } else {
            totalSize += stat.size;
          }
        } catch (error) {
          // Skip files we can't access
        }
      });
    } catch (error) {
      // Skip directories we can't read
    }

    return totalSize;
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Run audit if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const auditor = new SiteAuditor();
  auditor.runAudit().catch(console.error);
}

export default SiteAuditor;
