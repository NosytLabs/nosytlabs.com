


console.log('DEBUG: unified-optimizer.js script started');

/**
 * Unified Optimization and Refactoring Script
 * Comprehensive codebase audit, cleanup, and optimization
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

class UnifiedOptimizer {
  constructor() {
    this.startTime = Date.now();
    this.results = {
      duplicatesRemoved: [],
      filesReorganized: [],
      cssOptimized: [],
      jsOptimized: [],
      errors: []
    };
  }

  log(message, type = 'info') {
    const timestamp = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const prefix = type === 'error' ? '❌' : type === 'warning' ? '⚠️' : type === 'success' ? '✅' : '🔄';
    console.log(`[${timestamp}] ${prefix} ${message}`);
  }

  async runOptimization() {
    this.log('Starting comprehensive codebase optimization', 'info');
    
    try {
      // Phase 1: Remove duplicate directory
      await this.removeDuplicateDirectories();
      
      // Phase 2: Consolidate JavaScript files
      await this.consolidateJavaScriptFiles();
      
      // Phase 3: Optimize CSS files
      await this.optimizeCSSFiles();
      
      // Phase 4: Reorganize file structure
      await this.reorganizeFileStructure();
      
      // Phase 5: Remove redundant files
      await this.removeRedundantFiles();
      
      // Phase 6: Update package.json scripts
      await this.updatePackageScripts();
      
      // Phase 7: Generate optimization report
      await this.generateReport();
      
      this.log('Optimization completed successfully!', 'success');
      
    } catch (error) {
      this.log(`Optimization failed: ${error.message}`, 'error');
      this.results.errors.push(error.message);
      throw error;
    }
  }

  async removeDuplicateDirectories() {
    this.log('Phase 1: Removing duplicate directories');
    
    const duplicateDir = path.join(rootDir, '%USERPROFILE%');
    if (fs.existsSync(duplicateDir)) {
      this.log(`Removing duplicate directory: ${duplicateDir}`);
      fs.rmSync(duplicateDir, { recursive: true, force: true });
      this.results.duplicatesRemoved.push(duplicateDir);
    }
  }

  async consolidateJavaScriptFiles() {
    this.log('Phase 2: Consolidating JavaScript files');
    
    const duplicates = [
      // AI files
      {
        keep: 'public/scripts/nosytos95/nosyt-ai.js',
        remove: ['public/scripts/nosyt-ai.js', 'public/scripts/nosyt-ai-assistant.js']
      },
      // Window manager files
      {
        keep: 'public/scripts/nosytos95/window-manager.js',
        remove: ['public/scripts/nosyt-window-manager.js', 'public/scripts/win95-window-manager.js']
      },
      // File system files
      {
        keep: 'public/scripts/nosytos95/file-system.js',
        remove: ['public/scripts/nosyt-file-system.js']
      },
      // File explorer files
      {
        keep: 'public/scripts/nosytos95/file-explorer.js',
        remove: ['public/scripts/nosyt-file-explorer.js']
      },
      // Start menu files
      {
        keep: 'public/scripts/nosytos95/start-menu.js',
        remove: ['public/scripts/nosyt-start-menu.js']
      },
      // Main files
      {
        keep: 'public/scripts/core/main.js',
        remove: ['public/scripts/main.js']
      }
    ];

    for (const group of duplicates) {
      const keepPath = path.join(rootDir, group.keep);
      
      for (const removePath of group.remove) {
        const fullRemovePath = path.join(rootDir, removePath);
        if (fs.existsSync(fullRemovePath)) {
          // Merge content if the keep file doesn't exist
          if (!fs.existsSync(keepPath) && fs.existsSync(fullRemovePath)) {
            fs.copyFileSync(fullRemovePath, keepPath);
            this.log(`Moved ${removePath} to ${group.keep}`);
          }
          
          fs.unlinkSync(fullRemovePath);
          this.log(`Removed duplicate: ${removePath}`);
          this.results.duplicatesRemoved.push(removePath);
        }
      }
    }
  }

  async optimizeCSSFiles() {
    this.log('Phase 3: Optimizing CSS files');
    
    const cssDuplicates = [
      {
        keep: 'src/styles/global.css',
        remove: ['public/styles/global.css']
      },
      {
        keep: 'src/styles/nosytlabs.css',
        remove: ['public/styles/nosytlabs.css']
      }
    ];

    for (const group of cssDuplicates) {
      const keepPath = path.join(rootDir, group.keep);
      
      for (const removePath of group.remove) {
        const fullRemovePath = path.join(rootDir, removePath);
        if (fs.existsSync(fullRemovePath)) {
          // Merge CSS content
          if (fs.existsSync(keepPath)) {
            const keepContent = fs.readFileSync(keepPath, 'utf8');
            const removeContent = fs.readFileSync(fullRemovePath, 'utf8');
            
            // Simple merge - add content if not already present
            if (!keepContent.includes(removeContent.substring(0, 100))) {
              fs.writeFileSync(keepPath, keepContent + '\n\n' + removeContent);
              this.log(`Merged CSS content from ${removePath} to ${group.keep}`);
            }
          } else {
            fs.copyFileSync(fullRemovePath, keepPath);
            this.log(`Moved ${removePath} to ${group.keep}`);
          }
          
          fs.unlinkSync(fullRemovePath);
          this.log(`Removed duplicate CSS: ${removePath}`);
          this.results.cssOptimized.push(removePath);
        }
      }
    }
  }

  async reorganizeFileStructure() {
    this.log('Phase 4: Reorganizing file structure');
    
    // Create optimized directory structure
    const newStructure = {
      'src/scripts/optimization': [
        'scripts/optimization/optimize-repository.js',
        'scripts/optimization/consolidate-scripts.js',
        'scripts/optimization/cleanup-unused.js',
        'scripts/optimization/performance-monitor.js'
      ],
      'src/scripts/build': [
        'scripts/generate-assets.js',
        'scripts/generate-win95-icons.js',
        'scripts/generate-favicons.js',
        'scripts/optimize-images.js',
        'scripts/image-optimization.js'
      ],
      'src/scripts/development': [
        'scripts/check-links.js',
        'scripts/css-consolidation.js',
        'scripts/js-optimization.js',
        'scripts/performance-optimization.js'
      ]
    };

    for (const [newDir, files] of Object.entries(newStructure)) {
      const newDirPath = path.join(rootDir, newDir);
      if (!fs.existsSync(newDirPath)) {
        fs.mkdirSync(newDirPath, { recursive: true });
        this.log(`Created directory: ${newDir}`);
      }

      for (const file of files) {
        const oldPath = path.join(rootDir, file);
        const newPath = path.join(newDirPath, path.basename(file));
        
        if (fs.existsSync(oldPath) && !fs.existsSync(newPath)) {
          fs.copyFileSync(oldPath, newPath);
          fs.unlinkSync(oldPath);
          this.log(`Moved ${file} to ${newDir}/`);
          this.results.filesReorganized.push(`${file} -> ${newDir}/`);
        }
      }
    }
  }

  async removeRedundantFiles() {
    this.log('Phase 5: Removing redundant files');
    
    const redundantFiles = [
      'scripts/quick-optimize.js', // Replaced by unified optimizer
      'scripts/optimize-all.js',   // Replaced by unified optimizer
      'public/components/DuckHuntGame.js', // Duplicate of src version
      'public/components/EnhancedWindowResizing.js', // Duplicate of src version
      'public/js/nosytos95.js' // Moved to proper location
    ];

    for (const file of redundantFiles) {
      const filePath = path.join(rootDir, file);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        this.log(`Removed redundant file: ${file}`);
        this.results.duplicatesRemoved.push(file);
      }
    }

    // Remove empty directories
    const emptyDirs = [
      'public/components',
      'public/js',
      'scripts' // Will be reorganized under src/scripts
    ];

    for (const dir of emptyDirs) {
      const dirPath = path.join(rootDir, dir);
      if (fs.existsSync(dirPath)) {
        try {
          const files = fs.readdirSync(dirPath);
          if (files.length === 0) {
            fs.rmdirSync(dirPath);
            this.log(`Removed empty directory: ${dir}`);
          }
        } catch (error) {
          this.log(`Could not remove directory ${dir}: ${error.message}`, 'warning');
        }
      }
    }
  }

  async updatePackageScripts() {
    this.log('Phase 6: Updating package.json scripts');
    
    const packagePath = path.join(rootDir, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    // Update script paths
    const scriptUpdates = {
      'optimize': 'node src/scripts/optimization/optimize-repository.js',
      'optimize:css': 'node src/scripts/development/css-consolidation.js',
      'optimize:js': 'node src/scripts/development/js-optimization.js',
      'optimize:images': 'node src/scripts/build/optimize-images.js',
      'generate-assets': 'node src/scripts/build/generate-assets.js',
      'analyze': 'node src/scripts/optimization/performance-monitor.js',
      'fix-css': 'node src/scripts/development/fix-css.js',
      'check-links': 'node src/scripts/development/check-links.js',
      'optimize:all': 'node scripts/unified-optimizer.js'
    };

    Object.assign(packageJson.scripts, scriptUpdates);
    
    fs.writeFileSync(packagePath, JSON.stringify(packageJson, null, 2));
    this.log('Updated package.json scripts');
  }

  async generateReport() {
    this.log('Phase 7: Generating optimization report');
    
    const duration = Date.now() - this.startTime;
    const report = {
      timestamp: new Date().toISOString(),
      duration: `${(duration / 1000).toFixed(2)}s`,
      summary: {
        duplicatesRemoved: this.results.duplicatesRemoved.length,
        filesReorganized: this.results.filesReorganized.length,
        cssOptimized: this.results.cssOptimized.length,
        jsOptimized: this.results.jsOptimized.length,
        errors: this.results.errors.length
      },
      details: this.results
    };

    const reportPath = path.join(rootDir, 'optimization-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    this.log(`Optimization completed in ${report.duration}`);
    this.log(`- Duplicates removed: ${report.summary.duplicatesRemoved}`);
    this.log(`- Files reorganized: ${report.summary.filesReorganized}`);
    this.log(`- CSS files optimized: ${report.summary.cssOptimized}`);
    this.log(`- JS files optimized: ${report.summary.jsOptimized}`);
    this.log(`- Errors: ${report.summary.errors}`);
    this.log(`Report saved to: optimization-report.json`);
  }
}

// Run if this file is executed directly
console.log('DEBUG: Checking execution condition');

// Always run for now to test
console.log('DEBUG: Creating optimizer instance');
const optimizer = new UnifiedOptimizer();
console.log('DEBUG: Starting optimization');
optimizer.runOptimization().catch(error => {
  console.error('Optimization failed:', error);
  process.exit(1);
});

export { UnifiedOptimizer };
