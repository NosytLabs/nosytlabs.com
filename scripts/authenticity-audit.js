#!/usr/bin/env node

/**
 * Authenticity Audit for NosytLabs - 2025
 * Comprehensive scan for placeholder content and inauthentic information
 * Ensures all content is genuine and ready for production
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

class AuthenticityAuditor {
  constructor() {
    this.results = {
      placeholderContent: [],
      inauthenticContent: [],
      missingContent: [],
      authenticContent: [],
      summary: {
        totalFiles: 0,
        authenticFiles: 0,
        issuesFound: 0,
        authenticityScore: 0
      }
    };
    
    this.placeholderPatterns = [
      'lorem ipsum',
      'placeholder',
      'todo',
      'fixme',
      'coming soon',
      'under construction',
      'sample text',
      'example content',
      'your company',
      'company name',
      'example.com',
      'test@example.com',
      'john doe',
      'jane doe',
      'oma ai',
      'demo content',
      'dummy text',
      'filler content'
    ];
    
    this.requiredContent = {
      'src/pages/index.astro': [
        'NosytLabs',
        'Notable Opportunities Shape Your Tomorrow',
        'Web Development',
        'AI Integration',
        'Content Creation',
        '3D Printing'
      ],
      'src/pages/about.astro': [
        'NosytLabs',
        'Founded in 2025',
        'NOSYT LLC',
        'Tycen'
      ],
      'src/pages/services.astro': [
        'Web Development',
        'AI Integration',
        'Content Creation',
        '3D Printing',
        'Passive Income'
      ],
      'src/pages/contact.astro': [
        'contact@nosytlabs.com',
        'NosytLabs'
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

  async runAuthenticityAudit() {
    this.log('Starting Authenticity Audit', 'info');
    console.log('🔍 Scanning for placeholder content and ensuring authenticity...\n');
    
    try {
      const startTime = Date.now();
      
      // Scan all relevant files
      await this.scanFiles();
      
      // Check for required authentic content
      await this.checkRequiredContent();
      
      // Generate authenticity report
      const duration = Date.now() - startTime;
      this.generateAuthenticityReport(duration);
      
      this.log('Authenticity audit completed successfully!', 'success');
      
    } catch (error) {
      this.log(`Authenticity audit failed: ${error.message}`, 'error');
      throw error;
    }
  }

  async scanFiles() {
    this.log('Scanning files for placeholder content');
    
    const filesToScan = [
      ...this.findFiles(['src/pages'], ['.astro']),
      ...this.findFiles(['src/components'], ['.astro']),
      ...this.findFiles(['public/data'], ['.json']),
      ...this.findFiles(['src/content'], ['.md', '.mdx'])
    ];
    
    this.results.summary.totalFiles = filesToScan.length;
    
    for (const file of filesToScan) {
      await this.scanFile(file);
    }
    
    this.log(`  Scanned ${filesToScan.length} files`);
  }

  async scanFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const relativePath = path.relative(rootDir, filePath);
      let hasIssues = false;
      
      // Check for placeholder patterns
      this.placeholderPatterns.forEach(pattern => {
        const regex = new RegExp(pattern, 'gi');
        const matches = content.match(regex);
        
        if (matches) {
          // Skip form placeholders and legitimate uses
          const lines = content.split('\n');
          matches.forEach(match => {
            const lineIndex = lines.findIndex(line => line.toLowerCase().includes(match.toLowerCase()));
            const line = lines[lineIndex] || '';
            
            // Skip if it's a form placeholder attribute
            if (line.includes('placeholder="') || line.includes("placeholder='")) {
              return;
            }
            
            // Skip if it's in a comment
            if (line.trim().startsWith('//') || line.trim().startsWith('<!--')) {
              return;
            }
            
            hasIssues = true;
            this.results.placeholderContent.push({
              file: relativePath,
              pattern: pattern,
              match: match,
              line: lineIndex + 1,
              context: line.trim()
            });
          });
        }
      });
      
      // Check for specific inauthentic content
      const inauthentic = [
        'OMA AI',
        'Generic Company',
        'Sample Project',
        'Test Service',
        'Demo Product'
      ];
      
      inauthentic.forEach(item => {
        if (content.includes(item)) {
          hasIssues = true;
          this.results.inauthenticContent.push({
            file: relativePath,
            content: item,
            context: 'Found inauthentic content that should be replaced'
          });
        }
      });
      
      if (!hasIssues) {
        this.results.summary.authenticFiles++;
        this.results.authenticContent.push({
          file: relativePath,
          status: 'Authentic content verified'
        });
      } else {
        this.results.summary.issuesFound++;
      }
      
    } catch (error) {
      this.log(`  Error scanning ${filePath}: ${error.message}`, 'warning');
    }
  }

  async checkRequiredContent() {
    this.log('Checking for required authentic content');
    
    Object.entries(this.requiredContent).forEach(([filePath, requiredItems]) => {
      const fullPath = path.join(rootDir, filePath);
      
      if (fs.existsSync(fullPath)) {
        const content = fs.readFileSync(fullPath, 'utf8');
        
        requiredItems.forEach(item => {
          if (!content.includes(item)) {
            this.results.missingContent.push({
              file: filePath,
              missing: item,
              severity: 'high'
            });
          }
        });
      } else {
        this.results.missingContent.push({
          file: filePath,
          missing: 'Entire file missing',
          severity: 'critical'
        });
      }
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
    try {
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
    } catch (error) {
      // Ignore permission errors
    }
  }

  generateAuthenticityReport(duration) {
    // Calculate authenticity score
    const totalIssues = this.results.placeholderContent.length + 
                       this.results.inauthenticContent.length + 
                       this.results.missingContent.length;
    
    this.results.summary.authenticityScore = this.results.summary.totalFiles > 0 
      ? Math.round(((this.results.summary.totalFiles - totalIssues) / this.results.summary.totalFiles) * 100)
      : 0;

    const report = `
# Authenticity Audit Report
Generated: ${new Date().toISOString()}
Duration: ${(duration / 1000).toFixed(2)}s

## Summary
- **Total Files Scanned**: ${this.results.summary.totalFiles}
- **Authentic Files**: ${this.results.summary.authenticFiles}
- **Files with Issues**: ${this.results.summary.issuesFound}
- **Authenticity Score**: ${this.results.summary.authenticityScore}%

## Placeholder Content Found (${this.results.placeholderContent.length})
${this.results.placeholderContent.length > 0 ? 
  this.results.placeholderContent.map(item => 
    `- **${item.file}:${item.line}** - "${item.pattern}" found: ${item.context}`
  ).join('\n') : 
  'No placeholder content found! ✅'
}

## Inauthentic Content Found (${this.results.inauthenticContent.length})
${this.results.inauthenticContent.length > 0 ? 
  this.results.inauthenticContent.map(item => 
    `- **${item.file}** - "${item.content}": ${item.context}`
  ).join('\n') : 
  'No inauthentic content found! ✅'
}

## Missing Required Content (${this.results.missingContent.length})
${this.results.missingContent.length > 0 ? 
  this.results.missingContent.map(item => 
    `- **${item.file}** - Missing: "${item.missing}" (${item.severity})`
  ).join('\n') : 
  'All required content present! ✅'
}

## Authentic Content Verified (${this.results.authenticContent.length})
${this.results.authenticContent.slice(0, 10).map(item => 
  `- ✅ ${item.file}: ${item.status}`
).join('\n')}
${this.results.authenticContent.length > 10 ? `\n... and ${this.results.authenticContent.length - 10} more files` : ''}

## Recommendations
${this.generateRecommendations().map(rec => `- ${rec}`).join('\n')}

## Authenticity Status
${this.results.summary.authenticityScore >= 95 ? 
  '🎉 **EXCELLENT** - Content is authentic and ready for production!' :
  this.results.summary.authenticityScore >= 85 ? 
    '✅ **GOOD** - Minor issues to address before production' :
    this.results.summary.authenticityScore >= 70 ? 
      '⚠️ **NEEDS WORK** - Several authenticity issues to resolve' :
      '❌ **CRITICAL** - Major authenticity issues must be fixed'
}
`;

    const reportPath = path.join(rootDir, 'AUTHENTICITY-AUDIT-REPORT.md');
    fs.writeFileSync(reportPath, report.trim());
    
    // Save detailed JSON results
    const jsonPath = path.join(rootDir, 'test-artifacts');
    if (!fs.existsSync(jsonPath)) {
      fs.mkdirSync(jsonPath, { recursive: true });
    }
    fs.writeFileSync(path.join(jsonPath, 'authenticity-audit-results.json'), JSON.stringify(this.results, null, 2));
    
    console.log('\n🔍 Authenticity Audit Summary:');
    console.log(`   Total files: ${this.results.summary.totalFiles}`);
    console.log(`   Authentic files: ${this.results.summary.authenticFiles}`);
    console.log(`   Issues found: ${this.results.summary.issuesFound}`);
    console.log(`   Placeholder content: ${this.results.placeholderContent.length}`);
    console.log(`   Inauthentic content: ${this.results.inauthenticContent.length}`);
    console.log(`   Missing content: ${this.results.missingContent.length}`);
    console.log(`   Authenticity score: ${this.results.summary.authenticityScore}%`);
    console.log(`   Duration: ${(duration / 1000).toFixed(2)}s`);
    console.log(`\n📄 Full report: AUTHENTICITY-AUDIT-REPORT.md`);
    console.log(`📊 Detailed results: test-artifacts/authenticity-audit-results.json`);
  }

  generateRecommendations() {
    const recommendations = [];
    
    if (this.results.placeholderContent.length > 0) {
      recommendations.push('Replace all placeholder content with authentic NosytLabs information');
    }
    
    if (this.results.inauthenticContent.length > 0) {
      recommendations.push('Remove or replace inauthentic content with genuine information');
    }
    
    if (this.results.missingContent.length > 0) {
      recommendations.push('Add missing required content to ensure completeness');
    }
    
    if (this.results.summary.authenticityScore < 95) {
      recommendations.push('Review and verify all content for authenticity before production deployment');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Content is authentic and ready for production deployment!');
    }
    
    return recommendations;
  }
}

// Run audit if called directly
const isMainModule = process.argv[1] && import.meta.url.endsWith(process.argv[1]);
if (isMainModule || import.meta.url === `file://${process.argv[1]}`) {
  console.log('Starting Authenticity Audit...');
  const auditor = new AuthenticityAuditor();
  auditor.runAuthenticityAudit().catch((error) => {
    console.error('Authenticity audit failed:', error);
    process.exit(1);
  });
}

export { AuthenticityAuditor };
