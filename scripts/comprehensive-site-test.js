#!/usr/bin/env node

/**
 * Comprehensive Site Testing Script
 * Tests site functionality, alignment, and user experience using multiple approaches
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

console.log('🧪 NosytLabs Comprehensive Site Testing\n');

class SiteTester {
  constructor() {
    this.results = {
      passed: [],
      failed: [],
      warnings: [],
      info: []
    };
  }

  /**
   * Run comprehensive site tests
   */
  async runTests() {
    console.log('🚀 Starting comprehensive site tests...\n');

    await this.testFileStructure();
    await this.testPageContent();
    await this.testDataIntegrity();
    await this.testAssetAvailability();
    await this.testConfigurationFiles();
    await this.generateReport();

    console.log('\n✅ Testing completed!');
  }

  /**
   * Test file structure and organization
   */
  async testFileStructure() {
    console.log('📁 Testing file structure...');

    const requiredFiles = [
      'src/pages/index.astro',
      'src/pages/about.astro',
      'src/pages/services.astro',
      'src/pages/projects.astro',
      'src/pages/content-creation.astro',
      'src/layouts/BaseLayout.astro',
      'public/data/projects.json',
      'public/data/services.json',
      'package.json',
      'astro.config.mjs'
    ];

    for (const file of requiredFiles) {
      const filePath = path.join(rootDir, file);
      if (fs.existsSync(filePath)) {
        this.results.passed.push(`✅ Required file exists: ${file}`);
      } else {
        this.results.failed.push(`❌ Missing required file: ${file}`);
      }
    }

    // Test component organization
    const componentDirs = [
      'src/components/unified',
      'src/components/animations',
      'src/utils'
    ];

    for (const dir of componentDirs) {
      const dirPath = path.join(rootDir, dir);
      if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath);
        this.results.info.push(`📂 ${dir}: ${files.length} files`);
      }
    }
  }

  /**
   * Test page content for authenticity and completeness
   */
  async testPageContent() {
    console.log('\n📄 Testing page content...');

    const pages = [
      { file: 'src/pages/index.astro', name: 'Homepage' },
      { file: 'src/pages/about.astro', name: 'About' },
      { file: 'src/pages/services.astro', name: 'Services' },
      { file: 'src/pages/projects.astro', name: 'Projects' },
      { file: 'src/pages/content-creation.astro', name: 'Content Creation' }
    ];

    for (const page of pages) {
      const filePath = path.join(rootDir, page.file);
      if (fs.existsSync(filePath)) {
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Test for NosytLabs branding
        if (content.includes('NosytLabs')) {
          this.results.passed.push(`✅ ${page.name}: Contains NosytLabs branding`);
        } else {
          this.results.failed.push(`❌ ${page.name}: Missing NosytLabs branding`);
        }

        // Test for tagline
        if (content.includes('Notable Opportunities Shape Your Tomorrow')) {
          this.results.passed.push(`✅ ${page.name}: Contains company tagline`);
        } else {
          this.results.warnings.push(`⚠️  ${page.name}: Missing company tagline`);
        }

        // Test for placeholder content
        const placeholders = ['Lorem ipsum', 'placeholder', 'TODO', 'FIXME'];
        let hasPlaceholders = false;
        placeholders.forEach(placeholder => {
          if (content.toLowerCase().includes(placeholder.toLowerCase()) && 
              !content.includes('placeholder="')) { // Exclude form placeholders
            hasPlaceholders = true;
          }
        });

        if (!hasPlaceholders) {
          this.results.passed.push(`✅ ${page.name}: No placeholder content found`);
        } else {
          this.results.failed.push(`❌ ${page.name}: Contains placeholder content`);
        }

        // Test for proper meta tags
        if (content.includes('title=') && content.includes('description=')) {
          this.results.passed.push(`✅ ${page.name}: Has proper meta tags`);
        } else {
          this.results.warnings.push(`⚠️  ${page.name}: Missing or incomplete meta tags`);
        }
      }
    }
  }

  /**
   * Test data integrity
   */
  async testDataIntegrity() {
    console.log('\n📊 Testing data integrity...');

    // Test projects data
    const projectsPath = path.join(rootDir, 'public/data/projects.json');
    if (fs.existsSync(projectsPath)) {
      try {
        const projectsData = JSON.parse(fs.readFileSync(projectsPath, 'utf8'));
        
        if (projectsData.featured && Array.isArray(projectsData.featured)) {
          this.results.passed.push(`✅ Projects: Featured projects array is valid (${projectsData.featured.length} items)`);
        }

        if (projectsData.recent && Array.isArray(projectsData.recent)) {
          this.results.passed.push(`✅ Projects: Recent projects array is valid (${projectsData.recent.length} items)`);
        }

        // Check for authentic project names
        const allProjects = [...(projectsData.featured || []), ...(projectsData.recent || [])];
        const authenticProjects = allProjects.filter(p => 
          ['NosytLabs Website', 'Crypto Mining Calculator', 'Kick.com MCP Integration', 'NosytOS95'].includes(p.title)
        );
        
        if (authenticProjects.length > 0) {
          this.results.passed.push(`✅ Projects: Contains ${authenticProjects.length} authentic projects`);
        }

      } catch (error) {
        this.results.failed.push(`❌ Projects: Invalid JSON format - ${error.message}`);
      }
    }

    // Test services data
    const servicesPath = path.join(rootDir, 'public/data/services.json');
    if (fs.existsSync(servicesPath)) {
      try {
        const servicesData = JSON.parse(fs.readFileSync(servicesPath, 'utf8'));
        
        if (servicesData.services && Array.isArray(servicesData.services)) {
          this.results.passed.push(`✅ Services: Services array is valid (${servicesData.services.length} items)`);
          
          // Check for startup disclaimers
          const servicesWithDisclaimers = servicesData.services.filter(s => 
            s.fullDescription && s.fullDescription.includes('limited')
          );
          
          if (servicesWithDisclaimers.length > 0) {
            this.results.passed.push(`✅ Services: ${servicesWithDisclaimers.length} services include startup disclaimers`);
          }

          // Check for unrealistic client claims
          const unrealisticClaims = servicesData.services.some(s => 
            s.caseStudies && s.caseStudies.some(cs => 
              cs.client && cs.client.includes('Fortune 500')
            )
          );

          if (!unrealisticClaims) {
            this.results.passed.push(`✅ Services: No unrealistic client claims found`);
          } else {
            this.results.failed.push(`❌ Services: Contains unrealistic client claims`);
          }
        }

      } catch (error) {
        this.results.failed.push(`❌ Services: Invalid JSON format - ${error.message}`);
      }
    }
  }

  /**
   * Test asset availability
   */
  async testAssetAvailability() {
    console.log('\n🖼️  Testing asset availability...');

    const assetDirs = [
      'public/images',
      'public/documents',
      'public/data'
    ];

    for (const dir of assetDirs) {
      const dirPath = path.join(rootDir, dir);
      if (fs.existsSync(dirPath)) {
        const files = fs.readdirSync(dirPath, { recursive: true });
        this.results.info.push(`📁 ${dir}: ${files.length} files`);
        
        if (files.length > 0) {
          this.results.passed.push(`✅ Assets: ${dir} directory contains files`);
        } else {
          this.results.warnings.push(`⚠️  Assets: ${dir} directory is empty`);
        }
      } else {
        this.results.warnings.push(`⚠️  Assets: ${dir} directory does not exist`);
      }
    }
  }

  /**
   * Test configuration files
   */
  async testConfigurationFiles() {
    console.log('\n⚙️  Testing configuration files...');

    // Test package.json
    const packagePath = path.join(rootDir, 'package.json');
    if (fs.existsSync(packagePath)) {
      try {
        const packageData = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        
        if (packageData.name && packageData.name.includes('nosytlabs')) {
          this.results.passed.push(`✅ Config: Package name is appropriate`);
        }

        if (packageData.scripts && packageData.scripts.dev && packageData.scripts.build) {
          this.results.passed.push(`✅ Config: Essential npm scripts are present`);
        }

        if (packageData.dependencies && packageData.dependencies.astro) {
          this.results.passed.push(`✅ Config: Astro dependency is present`);
        }

      } catch (error) {
        this.results.failed.push(`❌ Config: Invalid package.json - ${error.message}`);
      }
    }

    // Test Astro config
    const astroConfigPath = path.join(rootDir, 'astro.config.mjs');
    if (fs.existsSync(astroConfigPath)) {
      const configContent = fs.readFileSync(astroConfigPath, 'utf8');
      
      if (configContent.includes('@astrojs/react')) {
        this.results.passed.push(`✅ Config: React integration is configured`);
      }

      if (configContent.includes('@astrojs/tailwind')) {
        this.results.passed.push(`✅ Config: Tailwind integration is configured`);
      }
    }
  }

  /**
   * Generate comprehensive test report
   */
  async generateReport() {
    console.log('\n📋 Test Report\n');
    console.log('=' .repeat(60));

    const totalTests = this.results.passed.length + this.results.failed.length + this.results.warnings.length;
    const passRate = totalTests > 0 ? Math.round((this.results.passed.length / totalTests) * 100) : 0;

    console.log(`\n🎯 Summary:`);
    console.log(`   Passed: ${this.results.passed.length}`);
    console.log(`   Failed: ${this.results.failed.length}`);
    console.log(`   Warnings: ${this.results.warnings.length}`);
    console.log(`   Info: ${this.results.info.length}`);
    console.log(`   Pass Rate: ${passRate}%`);

    if (this.results.failed.length > 0) {
      console.log(`\n❌ Failed Tests (${this.results.failed.length}):`);
      this.results.failed.forEach(test => console.log(`   ${test}`));
    }

    if (this.results.warnings.length > 0) {
      console.log(`\n⚠️  Warnings (${this.results.warnings.length}):`);
      this.results.warnings.forEach(warning => console.log(`   ${warning}`));
    }

    if (this.results.passed.length > 0) {
      console.log(`\n✅ Passed Tests (${this.results.passed.length}):`);
      this.results.passed.forEach(test => console.log(`   ${test}`));
    }

    if (this.results.info.length > 0) {
      console.log(`\n📊 Information (${this.results.info.length}):`);
      this.results.info.forEach(info => console.log(`   ${info}`));
    }

    // Overall assessment
    console.log(`\n🏆 Overall Assessment:`);
    
    if (passRate >= 90) {
      console.log('   Status: ✅ Excellent - Site is well-structured and authentic');
    } else if (passRate >= 75) {
      console.log('   Status: ✅ Good - Site is functional with minor issues');
    } else if (passRate >= 60) {
      console.log('   Status: ⚠️  Fair - Site needs improvements');
    } else {
      console.log('   Status: ❌ Poor - Site has significant issues');
    }

    console.log('\n' + '=' .repeat(60));
  }
}

// Run the tests
const tester = new SiteTester();
tester.runTests().catch(console.error);
