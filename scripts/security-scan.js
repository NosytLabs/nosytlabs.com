#!/usr/bin/env node

console.log('Security scan script started...');

/**
 * Local Security Scanning Script
 * Performs comprehensive security checks that can be run during development
 * This script complements the GitHub Actions security workflow
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, '..');

// ANSI color codes for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

/**
 * Utility function to run shell commands
 */
function runCommand(command, options = {}) {
  try {
    const result = execSync(command, {
      cwd: projectRoot,
      encoding: 'utf8',
      stdio: options.silent ? 'pipe' : 'inherit',
      ...options,
    });
    return { success: true, output: result };
  } catch (error) {
    return {
      success: false,
      error: error.message,
      output: error.stdout || error.stderr,
    };
  }
}

/**
 * Print colored console messages
 */
function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

/**
 * Print section headers
 */
function printHeader(title) {
  log('\n' + '='.repeat(60), 'cyan');
  log(`  ${title}`, 'bright');
  log('='.repeat(60), 'cyan');
}

/**
 * Check if a command exists
 */
function commandExists(command) {
  try {
    execSync(`where ${command}`, { stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

/**
 * Run npm audit
 */
function runNpmAudit() {
  printHeader('NPM Security Audit');

  log('Running npm audit...', 'blue');
  const result = runCommand('npm audit --audit-level=moderate');

  if (result.success) {
    log('✅ No vulnerabilities found!', 'green');
  } else {
    log('⚠️  Vulnerabilities detected. Please review the output above.', 'yellow');
  }

  return result.success;
}

/**
 * Check for secrets in code
 */
function runSecretScan() {
  printHeader('Secret Detection');

  // Simple regex patterns for common secrets
  const secretPatterns = [
    { name: 'API Keys', pattern: /api[_-]?key[\s]*[:=][\s]*['"][a-zA-Z0-9]{20,}['"]/ },
    { name: 'AWS Keys', pattern: /AKIA[0-9A-Z]{16}/ },
    { name: 'Private Keys', pattern: /-----BEGIN [A-Z ]+PRIVATE KEY-----/ },
    { name: 'JWT Tokens', pattern: /eyJ[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+\.[A-Za-z0-9_-]+/ },
    { name: 'Database URLs', pattern: /(mongodb|mysql|postgres):\/\/[^\s]+/ },
  ];

  let secretsFound = false;

  log('Scanning for potential secrets...', 'blue');

  // Scan files for secret patterns
  try {
    const files = getAllFiles(projectRoot).filter(file => {
      return (
        (file.endsWith('.ts') || file.endsWith('.js') || file.endsWith('.astro') || file.includes('.env')) &&
        !file.includes('node_modules') &&
        !file.includes('dist')
      );
    });

    files.forEach(file => {
      try {
        const content = fs.readFileSync(file, 'utf8');
        const lines = content.split('\n');

        lines.forEach((line, index) => {
          secretPatterns.forEach(pattern => {
            if (pattern.pattern.test(line)) {
              log(`⚠️  Potential ${pattern.name} found in ${path.relative(projectRoot, file)}:${index + 1}`, 'yellow');
              log(`   ${line.trim()}`, 'red');
              secretsFound = true;
            }
          });
        });
      } catch (error) {
        // Skip files that can't be read
      }
    });
  } catch (error) {
    log('Error scanning files for secrets', 'red');
  }

  if (!secretsFound) {
    log('✅ No potential secrets detected!', 'green');
  }

  return !secretsFound;
}

/**
 * Recursively get all files in a directory
 */
function getAllFiles(dirPath, arrayOfFiles) {
  const files = fs.readdirSync(dirPath);

  arrayOfFiles = arrayOfFiles || [];

  files.forEach(file => {
    if (fs.statSync(path.join(dirPath, file)).isDirectory()) {
      arrayOfFiles = getAllFiles(path.join(dirPath, file), arrayOfFiles);
    } else {
      arrayOfFiles.push(path.join(dirPath, file));
    }
  });

  return arrayOfFiles;
}

/**
 * Check dependencies for known vulnerabilities
 */
function runDependencyCheck() {
  printHeader('Dependency Security Check');

  log('Checking for outdated packages...', 'blue');
  const outdatedResult = runCommand('npm outdated', { silent: true });

  if (outdatedResult.output && outdatedResult.output.trim()) {
    log('⚠️  Outdated packages found:', 'yellow');
    console.log(outdatedResult.output);
    log('\nConsider running: npm update', 'blue');
  } else {
    log('✅ All packages are up to date!', 'green');
  }

  return true;
}

/**
 * Check for common security misconfigurations
 */
function runConfigurationCheck() {
  printHeader('Security Configuration Check');

  const checks = [
    {
      name: 'Environment files in .gitignore',
      check: () => {
        try {
          const gitignore = fs.readFileSync(path.join(projectRoot, '.gitignore'), 'utf8');
          return gitignore.includes('.env') || gitignore.includes('*.env');
        } catch {
          return false;
        }
      },
    },
    {
      name: 'HTTPS enforcement in middleware',
      check: () => {
        try {
          const middlewarePath = path.join(projectRoot, 'src/middleware/index.ts');
          if (!fs.existsSync(middlewarePath)) {
            const altPath = path.join(projectRoot, 'src/middleware.ts');
            if (fs.existsSync(altPath)) {
              const middleware = fs.readFileSync(altPath, 'utf8');
              return middleware.includes('https') || middleware.includes('secure');
            }
            return false;
          }
          const middleware = fs.readFileSync(middlewarePath, 'utf8');
          return middleware.includes('https') || middleware.includes('secure');
        } catch {
          return false;
        }
      },
    },
    {
      name: 'CSRF protection implemented',
      check: () => {
        try {
          const csrfFile = fs.existsSync(path.join(projectRoot, 'src/utils/csrf.ts'));
          let middleware = '';
          const middlewarePath = path.join(projectRoot, 'src/middleware/index.ts');
          if (fs.existsSync(middlewarePath)) {
            middleware = fs.readFileSync(middlewarePath, 'utf8');
          } else {
            const altPath = path.join(projectRoot, 'src/middleware.ts');
            if (fs.existsSync(altPath)) {
              middleware = fs.readFileSync(altPath, 'utf8');
            }
          }
          return csrfFile && middleware.includes('csrf');
        } catch {
          return false;
        }
      },
    },
    {
      name: 'Input validation middleware',
      check: () => {
        try {
          return fs.existsSync(path.join(projectRoot, 'src/middleware/api-validation.ts'));
        } catch {
          return false;
        }
      },
    },
    {
      name: 'Security headers configured',
      check: () => {
        try {
          let middleware = '';
          const middlewarePath = path.join(projectRoot, 'src/middleware/index.ts');
          if (fs.existsSync(middlewarePath)) {
            middleware = fs.readFileSync(middlewarePath, 'utf8');
          } else {
            const altPath = path.join(projectRoot, 'src/middleware.ts');
            if (fs.existsSync(altPath)) {
              middleware = fs.readFileSync(altPath, 'utf8');
            }
          }
          return (
            middleware.includes('X-Frame-Options') || middleware.includes('Content-Security-Policy')
          );
        } catch {
          return false;
        }
      },
    },
  ];

  let allPassed = true;

  checks.forEach(check => {
    const passed = check.check();
    const status = passed ? '✅' : '❌';
    const color = passed ? 'green' : 'red';
    log(`${status} ${check.name}`, color);
    if (!passed) allPassed = false;
  });

  return allPassed;
}

/**
 * Generate security report
 */
function generateReport(results) {
  printHeader('Security Scan Summary');

  const totalChecks = Object.keys(results).length;
  const passedChecks = Object.values(results).filter(Boolean).length;
  const score = Math.round((passedChecks / totalChecks) * 100);

  log(
    `\nSecurity Score: ${score}% (${passedChecks}/${totalChecks} checks passed)`,
    score >= 80 ? 'green' : score >= 60 ? 'yellow' : 'red'
  );

  log('\nDetailed Results:', 'bright');
  Object.entries(results).forEach(([check, passed]) => {
    const status = passed ? '✅ PASS' : '❌ FAIL';
    const color = passed ? 'green' : 'red';
    log(`  ${status} ${check}`, color);
  });

  if (score < 100) {
    log('\n⚠️  Some security checks failed. Please review and address the issues above.', 'yellow');
  } else {
    log('\n🎉 All security checks passed! Your application is well-secured.', 'green');
  }

  // Save report to file
  const reportPath = path.join(projectRoot, 'security-report.json');
  const report = {
    timestamp: new Date().toISOString(),
    score,
    totalChecks,
    passedChecks,
    results,
  };

  try {
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    log(`\n📄 Detailed report saved to: ${reportPath}`, 'blue');
  } catch (error) {
    log(`\n❌ Error saving report file: ${error.message}`, 'red');
  }
}

/**
 * Main execution function
 */
async function main() {
  log('🔒 Starting Security Scan...', 'bright');
  log(`Project: ${path.basename(projectRoot)}`, 'blue');
  log(`Timestamp: ${new Date().toISOString()}`, 'blue');

  const results = {
    'NPM Audit': runNpmAudit(),
    'Secret Detection': runSecretScan(),
    'Dependency Check': runDependencyCheck(),
    'Configuration Check': runConfigurationCheck(),
  };

  generateReport(results);
}

// Run the security scan
main();
