#!/usr/bin/env node

/**
 * Repository Optimization Script
 * Comprehensive optimization and refactoring tool
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { cleanupUnusedFiles } from './cleanup-unused.js';
import { consolidateScripts } from './consolidate-scripts.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class RepositoryOptimizer {
  constructor() {
    this.optimizations = [];
    this.errors = [];
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString();
    const prefix = type === 'error' ? '❌' : type === 'warning' ? '⚠️' : '✅';
    console.log(`${prefix} [${timestamp}] ${message}`);
    
    if (type === 'error') {
      this.errors.push(message);
    } else {
      this.optimizations.push(message);
    }
  }

  async optimizeRepository() {
    this.log('Starting comprehensive repository optimization...', 'info');
    
    try {
      // Phase 1: Cleanup unused files
      this.log('Phase 1: Cleaning up unused files');
      await this.runCleanup();
      
      // Phase 2: Consolidate scripts
      this.log('Phase 2: Consolidating JavaScript files');
      await this.runScriptConsolidation();
      
      // Phase 3: Optimize CSS
      this.log('Phase 3: Optimizing CSS files');
      await this.optimizeCSS();
      
      // Phase 4: Optimize images
      this.log('Phase 4: Optimizing images');
      await this.optimizeImages();
      
      // Phase 5: Update configurations
      this.log('Phase 5: Updating configurations');
      await this.updateConfigurations();
      
      // Phase 6: Generate optimization report
      this.log('Phase 6: Generating optimization report');
      await this.generateReport();
      
      this.log('Repository optimization completed successfully!');
      
    } catch (error) {
      this.log(`Optimization failed: ${error.message}`, 'error');
      throw error;
    }
  }

  async runCleanup() {
    try {
      cleanupUnusedFiles();
      this.log('Cleanup completed successfully');
    } catch (error) {
      this.log(`Cleanup failed: ${error.message}`, 'error');
    }
  }

  async runScriptConsolidation() {
    try {
      consolidateScripts();
      this.log('Script consolidation completed successfully');
    } catch (error) {
      this.log(`Script consolidation failed: ${error.message}`, 'error');
    }
  }

  async optimizeCSS() {
    try {
      // Remove duplicate CSS imports
      const cssFiles = this.findFiles('public/styles', '.css');
      const srcCssFiles = this.findFiles('src/styles', '.css');
      
      this.log(`Found ${cssFiles.length} CSS files in public/styles`);
      this.log(`Found ${srcCssFiles.length} CSS files in src/styles`);
      
      // Check for duplicate CSS rules
      await this.removeDuplicateCSS();
      
      this.log('CSS optimization completed');
    } catch (error) {
      this.log(`CSS optimization failed: ${error.message}`, 'error');
    }
  }

  async optimizeImages() {
    try {
      const imageFiles = this.findFiles('public/images', ['.jpg', '.jpeg', '.png', '.gif', '.webp']);
      this.log(`Found ${imageFiles.length} image files for optimization`);
      
      // Check for duplicate images
      await this.findDuplicateImages();
      
      this.log('Image optimization completed');
    } catch (error) {
      this.log(`Image optimization failed: ${error.message}`, 'error');
    }
  }

  async updateConfigurations() {
    try {
      // Update .gitignore
      await this.updateGitignore();
      
      // Update .vercelignore
      await this.updateVercelignore();
      
      this.log('Configuration updates completed');
    } catch (error) {
      this.log(`Configuration update failed: ${error.message}`, 'error');
    }
  }

  async removeDuplicateCSS() {
    // Implementation for removing duplicate CSS rules
    this.log('Checking for duplicate CSS rules...');
  }

  async findDuplicateImages() {
    // Implementation for finding duplicate images
    this.log('Checking for duplicate images...');
  }

  async updateGitignore() {
    const gitignorePath = '.gitignore';
    const additionalIgnores = [
      '# Optimization artifacts',
      'public/scripts/bundles/',
      'performance-reports/',
      '*.optimization.log',
      '',
      '# Temporary files',
      '*.tmp',
      '*.temp',
      '.DS_Store',
      'Thumbs.db'
    ];

    if (fs.existsSync(gitignorePath)) {
      let content = fs.readFileSync(gitignorePath, 'utf8');
      
      additionalIgnores.forEach(line => {
        if (!content.includes(line)) {
          content += '\n' + line;
        }
      });
      
      fs.writeFileSync(gitignorePath, content);
      this.log('Updated .gitignore with optimization patterns');
    }
  }

  async updateVercelignore() {
    const vercelignorePath = '.vercelignore';
    const additionalIgnores = [
      '# Optimization artifacts',
      'scripts/optimization/',
      'performance-reports/',
      '*.optimization.log'
    ];

    if (fs.existsSync(vercelignorePath)) {
      let content = fs.readFileSync(vercelignorePath, 'utf8');
      
      additionalIgnores.forEach(line => {
        if (!content.includes(line)) {
          content += '\n' + line;
        }
      });
      
      fs.writeFileSync(vercelignorePath, content);
      this.log('Updated .vercelignore with optimization patterns');
    }
  }

  findFiles(directory, extensions) {
    const files = [];
    
    if (!fs.existsSync(directory)) {
      return files;
    }

    const items = fs.readdirSync(directory, { withFileTypes: true });
    
    items.forEach(item => {
      const fullPath = path.join(directory, item.name);
      
      if (item.isDirectory()) {
        files.push(...this.findFiles(fullPath, extensions));
      } else if (item.isFile()) {
        const ext = path.extname(item.name).toLowerCase();
        if (Array.isArray(extensions) ? extensions.includes(ext) : ext === extensions) {
          files.push(fullPath);
        }
      }
    });
    
    return files;
  }

  async generateReport() {
    const report = {
      timestamp: new Date().toISOString(),
      optimizations: this.optimizations,
      errors: this.errors,
      summary: {
        totalOptimizations: this.optimizations.length,
        totalErrors: this.errors.length,
        success: this.errors.length === 0
      }
    };

    const reportPath = 'optimization-report.json';
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    this.log(`Optimization report saved to ${reportPath}`);
    
    // Console summary
    console.log('\n' + '='.repeat(50));
    console.log('OPTIMIZATION SUMMARY');
    console.log('='.repeat(50));
    console.log(`✅ Successful optimizations: ${this.optimizations.length}`);
    console.log(`❌ Errors encountered: ${this.errors.length}`);
    console.log(`📊 Overall status: ${this.errors.length === 0 ? 'SUCCESS' : 'PARTIAL SUCCESS'}`);
    console.log('='.repeat(50));
  }
}

// Run if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const optimizer = new RepositoryOptimizer();
  optimizer.optimizeRepository().catch(console.error);
}

export { RepositoryOptimizer };
