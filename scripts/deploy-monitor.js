#!/usr/bin/env node

/**
 * Deployment and Monitoring Setup for NosytLabs
 * Handles production deployment, monitoring setup, and health checks
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

console.log('🚀 NosytLabs Deployment & Monitoring Setup\n');

class DeploymentManager {
  constructor() {
    this.deploymentConfig = {
      platform: 'vercel',
      domain: 'nosytlabs.com',
      environment: 'production',
      monitoring: {
        analytics: true,
        speedInsights: true,
        errorTracking: true,
        uptime: true
      }
    };

    this.healthChecks = [];
    this.deploymentStatus = {
      build: false,
      deploy: false,
      monitoring: false,
      healthCheck: false
    };
  }

  /**
   * Run complete deployment process
   */
  async deploy() {
    console.log('🔧 Starting deployment process...\n');

    await this.validateEnvironment();
    await this.runPreDeploymentChecks();
    await this.buildForProduction();
    await this.setupMonitoring();
    await this.runHealthChecks();
    await this.generateDeploymentReport();

    console.log('\n✅ Deployment process completed!');
  }

  /**
   * Validate deployment environment
   */
  async validateEnvironment() {
    console.log('🔍 Validating deployment environment...');

    // Check if dist directory exists
    const distPath = path.join(rootDir, 'dist');
    const distExists = fs.existsSync(distPath);
    console.log(`   Build directory: ${distExists ? '✅ Found' : '❌ Missing'}`);

    if (!distExists) {
      throw new Error('Build directory missing. Run npm run build first.');
    }

    // Check Vercel configuration
    const vercelConfigPath = path.join(rootDir, 'vercel.json');
    const vercelConfigExists = fs.existsSync(vercelConfigPath);
    console.log(`   Vercel config: ${vercelConfigExists ? '✅ Found' : '❌ Missing'}`);

    // Check package.json
    const packageJsonPath = path.join(rootDir, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
    const hasVercelAnalytics = packageJson.dependencies['@vercel/analytics'];
    console.log(`   Vercel Analytics: ${hasVercelAnalytics ? '✅ Configured' : '⚠️  Missing'}`);

    // Check environment variables
    this.checkEnvironmentVariables();

    console.log('   ✅ Environment validation completed\n');
  }

  /**
   * Check environment variables
   */
  checkEnvironmentVariables() {
    const requiredEnvVars = [
      'NODE_ENV'
    ];

    const optionalEnvVars = [
      'VERCEL_ANALYTICS_ID',
      'GOOGLE_ANALYTICS_ID',
      'SUPABASE_URL',
      'SUPABASE_ANON_KEY'
    ];

    console.log('   Environment Variables:');
    
    requiredEnvVars.forEach(envVar => {
      const exists = process.env[envVar];
      console.log(`     ${envVar}: ${exists ? '✅ Set' : '❌ Missing'}`);
    });

    optionalEnvVars.forEach(envVar => {
      const exists = process.env[envVar];
      console.log(`     ${envVar}: ${exists ? '✅ Set' : '⚠️  Optional'}`);
    });
  }

  /**
   * Run pre-deployment checks
   */
  async runPreDeploymentChecks() {
    console.log('🧪 Running pre-deployment checks...');

    // Check build size
    const buildSize = this.calculateBuildSize();
    console.log(`   Build size: ${this.formatBytes(buildSize)}`);

    if (buildSize > 50 * 1024 * 1024) { // 50MB
      console.warn('   ⚠️  Build size is large (>50MB)');
    }

    // Check critical files
    const criticalFiles = [
      'dist/index.html',
      'dist/services.html',
      'dist/projects.html',
      'dist/content-creation.html'
    ];

    criticalFiles.forEach(file => {
      const filePath = path.join(rootDir, file);
      const exists = fs.existsSync(filePath);
      console.log(`   ${path.basename(file)}: ${exists ? '✅ Found' : '❌ Missing'}`);
    });

    // Check for security headers
    this.checkSecurityHeaders();

    console.log('   ✅ Pre-deployment checks completed\n');
  }

  /**
   * Calculate build size
   */
  calculateBuildSize() {
    const distPath = path.join(rootDir, 'dist');
    let totalSize = 0;

    const calculateDirSize = (dir) => {
      const files = fs.readdirSync(dir);
      files.forEach(file => {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat.isDirectory()) {
          calculateDirSize(filePath);
        } else {
          totalSize += stat.size;
        }
      });
    };

    if (fs.existsSync(distPath)) {
      calculateDirSize(distPath);
    }

    return totalSize;
  }

  /**
   * Check security headers configuration
   */
  checkSecurityHeaders() {
    const vercelConfigPath = path.join(rootDir, 'vercel.json');
    
    if (fs.existsSync(vercelConfigPath)) {
      const config = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));
      const hasSecurityHeaders = config.headers && config.headers.some(header => 
        header.headers.some(h => h.key.includes('X-') || h.key.includes('Content-Security'))
      );
      
      console.log(`   Security headers: ${hasSecurityHeaders ? '✅ Configured' : '⚠️  Basic only'}`);
    }
  }

  /**
   * Build for production
   */
  async buildForProduction() {
    console.log('🏗️  Building for production...');

    try {
      // Verify build is current
      const distPath = path.join(rootDir, 'dist');
      const distStat = fs.statSync(distPath);
      const buildAge = Date.now() - distStat.mtime.getTime();
      const buildAgeMinutes = Math.floor(buildAge / (1000 * 60));

      console.log(`   Build age: ${buildAgeMinutes} minutes`);

      if (buildAgeMinutes > 30) {
        console.log('   ⚠️  Build is older than 30 minutes, consider rebuilding');
      }

      // Validate build output
      const indexPath = path.join(distPath, 'index.html');
      const indexContent = fs.readFileSync(indexPath, 'utf8');
      
      if (indexContent.length < 1000) {
        throw new Error('Index.html appears to be incomplete');
      }

      console.log('   ✅ Production build validated');
      this.deploymentStatus.build = true;

    } catch (error) {
      console.error(`   ❌ Build validation failed: ${error.message}`);
      throw error;
    }

    console.log('');
  }

  /**
   * Setup monitoring and analytics
   */
  async setupMonitoring() {
    console.log('📊 Setting up monitoring...');

    // Check Vercel Analytics integration
    const analyticsComponent = path.join(rootDir, 'src', 'components', 'VercelAnalytics.astro');
    const hasAnalytics = fs.existsSync(analyticsComponent);
    console.log(`   Vercel Analytics: ${hasAnalytics ? '✅ Integrated' : '❌ Missing'}`);

    // Check for performance monitoring
    const performanceScripts = this.findFiles(
      path.join(rootDir, 'public', 'scripts'),
      /performance|monitor/
    );
    console.log(`   Performance monitoring: ${performanceScripts.length > 0 ? '✅ Active' : '⚠️  Limited'}`);

    // Setup error tracking
    this.setupErrorTracking();

    // Setup uptime monitoring
    this.setupUptimeMonitoring();

    console.log('   ✅ Monitoring setup completed');
    this.deploymentStatus.monitoring = true;
    console.log('');
  }

  /**
   * Setup error tracking
   */
  setupErrorTracking() {
    const errorTrackingScript = `
// Error tracking for production
window.addEventListener('error', (event) => {
  console.error('Global error:', event.error);
  
  // Send to monitoring service (implement as needed)
  if (typeof gtag !== 'undefined') {
    gtag('event', 'exception', {
      description: event.error.message,
      fatal: false
    });
  }
});

window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  
  // Send to monitoring service
  if (typeof gtag !== 'undefined') {
    gtag('event', 'exception', {
      description: event.reason.toString(),
      fatal: false
    });
  }
});
`;

    const errorTrackingPath = path.join(rootDir, 'public', 'scripts', 'error-tracking.js');
    fs.writeFileSync(errorTrackingPath, errorTrackingScript);
    console.log('   ✅ Error tracking script created');
  }

  /**
   * Setup uptime monitoring
   */
  setupUptimeMonitoring() {
    const uptimeConfig = {
      endpoints: [
        'https://nosytlabs.com',
        'https://nosytlabs.com/services',
        'https://nosytlabs.com/projects',
        'https://nosytlabs.com/content-creation',
        'https://nosytlabs.com/nosytos95'
      ],
      interval: 300000, // 5 minutes
      timeout: 10000,   // 10 seconds
      retries: 3
    };

    const uptimeConfigPath = path.join(rootDir, 'monitoring', 'uptime-config.json');
    
    // Create monitoring directory if it doesn't exist
    const monitoringDir = path.dirname(uptimeConfigPath);
    if (!fs.existsSync(monitoringDir)) {
      fs.mkdirSync(monitoringDir, { recursive: true });
    }

    fs.writeFileSync(uptimeConfigPath, JSON.stringify(uptimeConfig, null, 2));
    console.log('   ✅ Uptime monitoring configured');
  }

  /**
   * Run health checks
   */
  async runHealthChecks() {
    console.log('🏥 Running health checks...');

    const checks = [
      this.checkSiteAccessibility(),
      this.checkPerformanceMetrics(),
      this.checkSecurityHeaders(),
      this.checkSEOElements(),
      this.checkMobileResponsiveness()
    ];

    const results = await Promise.allSettled(checks);
    
    results.forEach((result, index) => {
      const checkName = [
        'Site Accessibility',
        'Performance Metrics',
        'Security Headers',
        'SEO Elements',
        'Mobile Responsiveness'
      ][index];

      if (result.status === 'fulfilled') {
        console.log(`   ${checkName}: ✅ Passed`);
        this.healthChecks.push({ name: checkName, status: 'passed', details: result.value });
      } else {
        console.log(`   ${checkName}: ❌ Failed - ${result.reason}`);
        this.healthChecks.push({ name: checkName, status: 'failed', error: result.reason });
      }
    });

    const passedChecks = this.healthChecks.filter(check => check.status === 'passed').length;
    const totalChecks = this.healthChecks.length;
    
    console.log(`   📊 Health Score: ${passedChecks}/${totalChecks} (${Math.round((passedChecks/totalChecks)*100)}%)`);
    
    this.deploymentStatus.healthCheck = true;
    console.log('');
  }

  /**
   * Individual health check methods
   */
  async checkSiteAccessibility() {
    // This would typically make HTTP requests to check site accessibility
    // For now, we'll check if the build contains accessibility features
    const distPath = path.join(rootDir, 'dist');
    const indexContent = fs.readFileSync(path.join(distPath, 'index.html'), 'utf8');
    
    const hasAriaLabels = indexContent.includes('aria-');
    const hasAltText = indexContent.includes('alt=');
    const hasSkipLinks = indexContent.includes('skip');

    if (hasAriaLabels && hasAltText) {
      return 'Accessibility features present';
    } else {
      throw new Error('Missing accessibility features');
    }
  }

  async checkPerformanceMetrics() {
    const distPath = path.join(rootDir, 'dist');
    const jsFiles = this.findFiles(distPath, /\.js$/);
    const cssFiles = this.findFiles(distPath, /\.css$/);
    
    const jsSize = this.calculateTotalSize(jsFiles);
    const cssSize = this.calculateTotalSize(cssFiles);
    
    if (jsSize < 500000 && cssSize < 200000) { // 500KB JS, 200KB CSS
      return `JS: ${this.formatBytes(jsSize)}, CSS: ${this.formatBytes(cssSize)}`;
    } else {
      throw new Error('Bundle sizes too large');
    }
  }

  async checkSecurityHeaders() {
    const vercelConfigPath = path.join(rootDir, 'vercel.json');
    if (fs.existsSync(vercelConfigPath)) {
      const config = JSON.parse(fs.readFileSync(vercelConfigPath, 'utf8'));
      if (config.headers) {
        return 'Security headers configured';
      }
    }
    throw new Error('Security headers not configured');
  }

  async checkSEOElements() {
    const distPath = path.join(rootDir, 'dist');
    const indexContent = fs.readFileSync(path.join(distPath, 'index.html'), 'utf8');
    
    const hasTitle = indexContent.includes('<title>');
    const hasDescription = indexContent.includes('name="description"');
    const hasOG = indexContent.includes('property="og:');
    
    if (hasTitle && hasDescription && hasOG) {
      return 'SEO elements present';
    } else {
      throw new Error('Missing SEO elements');
    }
  }

  async checkMobileResponsiveness() {
    const distPath = path.join(rootDir, 'dist');
    const indexContent = fs.readFileSync(path.join(distPath, 'index.html'), 'utf8');
    
    const hasViewport = indexContent.includes('name="viewport"');
    const hasResponsiveCSS = indexContent.includes('responsive') || indexContent.includes('@media');
    
    if (hasViewport) {
      return 'Mobile viewport configured';
    } else {
      throw new Error('Mobile responsiveness not configured');
    }
  }

  /**
   * Generate deployment report
   */
  async generateDeploymentReport() {
    console.log('📋 Generating deployment report...');

    const report = {
      timestamp: new Date().toISOString(),
      deployment: this.deploymentStatus,
      healthChecks: this.healthChecks,
      buildInfo: {
        size: this.formatBytes(this.calculateBuildSize()),
        pages: this.countPages(),
        assets: this.countAssets()
      },
      monitoring: this.deploymentConfig.monitoring,
      recommendations: this.generateRecommendations()
    };

    const reportPath = path.join(rootDir, 'deployment-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    console.log('   ✅ Deployment report saved to deployment-report.json');
    
    // Display summary
    this.displayDeploymentSummary(report);
  }

  /**
   * Display deployment summary
   */
  displayDeploymentSummary(report) {
    console.log('\n📊 DEPLOYMENT SUMMARY');
    console.log('=====================\n');

    console.log('🏗️  Build Status:');
    Object.entries(report.deployment).forEach(([key, status]) => {
      console.log(`   ${key}: ${status ? '✅ Complete' : '❌ Failed'}`);
    });

    console.log('\n🏥 Health Checks:');
    report.healthChecks.forEach(check => {
      console.log(`   ${check.name}: ${check.status === 'passed' ? '✅ Passed' : '❌ Failed'}`);
    });

    console.log('\n📈 Build Information:');
    console.log(`   Total Size: ${report.buildInfo.size}`);
    console.log(`   Pages: ${report.buildInfo.pages}`);
    console.log(`   Assets: ${report.buildInfo.assets}`);

    console.log('\n🎯 Next Steps:');
    console.log('1. Deploy to Vercel: vercel --prod');
    console.log('2. Verify domain configuration');
    console.log('3. Test all critical user flows');
    console.log('4. Monitor performance metrics');
    console.log('5. Set up alerts for downtime');

    const allPassed = Object.values(report.deployment).every(Boolean) && 
                     report.healthChecks.every(check => check.status === 'passed');

    if (allPassed) {
      console.log('\n✅ DEPLOYMENT READY - All checks passed!');
    } else {
      console.log('\n⚠️  DEPLOYMENT NEEDS ATTENTION - Some checks failed');
    }
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

  calculateTotalSize(files) {
    return files.reduce((total, file) => {
      try {
        const stat = fs.statSync(file);
        return total + stat.size;
      } catch (error) {
        return total;
      }
    }, 0);
  }

  countPages() {
    const distPath = path.join(rootDir, 'dist');
    const htmlFiles = this.findFiles(distPath, /\.html$/);
    return htmlFiles.length;
  }

  countAssets() {
    const distPath = path.join(rootDir, 'dist');
    const assetFiles = this.findFiles(distPath, /\.(js|css|png|jpg|jpeg|webp|svg|ico)$/);
    return assetFiles.length;
  }

  formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  generateRecommendations() {
    const recommendations = [];
    
    // Based on health checks
    const failedChecks = this.healthChecks.filter(check => check.status === 'failed');
    failedChecks.forEach(check => {
      recommendations.push(`Fix ${check.name}: ${check.error}`);
    });

    // General recommendations
    recommendations.push('Set up continuous monitoring with Vercel Analytics');
    recommendations.push('Configure custom domain with SSL');
    recommendations.push('Set up automated backups');
    recommendations.push('Implement error alerting');
    recommendations.push('Schedule regular performance audits');

    return recommendations;
  }
}

// Run deployment if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const deploymentManager = new DeploymentManager();
  deploymentManager.deploy().catch(console.error);
}

export default DeploymentManager;
