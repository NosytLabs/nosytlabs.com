/**
 * Color Contrast Audit Script
 * Tests all color combinations for WCAG 2.2 compliance
 * Generates detailed accessibility report
 */

// Removed TS import to avoid Node ESM .ts loading error and implemented local analyzer
// import { colorContrastManager } from '../src/utils/color-contrast.ts';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Minimal color contrast analyzer for this script
const CONTRAST_THRESHOLDS = {
  AAA_NORMAL: 7,
  AAA_LARGE: 4.5,
  AA_NORMAL: 4.5,
  AA_LARGE: 3,
  UI_COMPONENTS: 3,
};

function parseHexColor(color) {
  if (typeof color !== 'string') return null;
  const hex = color.trim().replace('#', '');
  if (hex.length === 3) {
    const r = parseInt(hex[0] + hex[0], 16);
    const g = parseInt(hex[1] + hex[1], 16);
    const b = parseInt(hex[2] + hex[2], 16);
    return { r, g, b };
  }
  if (hex.length === 6) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    return { r, g, b };
  }
  return null;
}

function relativeLuminance({ r, g, b }) {
  const toLinear = (c) => {
    const cs = c / 255;
    return cs <= 0.03928 ? cs / 12.92 : Math.pow((cs + 0.055) / 1.055, 2.4);
  };
  const R = toLinear(r);
  const G = toLinear(g);
  const B = toLinear(b);
  return 0.2126 * R + 0.7152 * G + 0.0722 * B;
}

function calculateContrastRatio(color1, color2) {
  const rgb1 = parseHexColor(color1);
  const rgb2 = parseHexColor(color2);
  if (!rgb1 || !rgb2) throw new Error('Invalid color format');
  const l1 = relativeLuminance(rgb1);
  const l2 = relativeLuminance(rgb2);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return (lighter + 0.05) / (darker + 0.05);
}

const colorContrastManager = {
  analyzeContrast(foreground, background) {
    const ratio = calculateContrastRatio(foreground, background);
    let level;
    if (ratio >= CONTRAST_THRESHOLDS.AAA_NORMAL) {
      level = 'AAA';
    } else if (ratio >= CONTRAST_THRESHOLDS.AA_NORMAL) {
      level = 'AA';
    } else if (ratio >= CONTRAST_THRESHOLDS.AA_LARGE) {
      level = 'A';
    } else {
      level = 'FAIL';
    }
    return {
      ratio,
      level,
      passes: {
        normalText: ratio >= CONTRAST_THRESHOLDS.AA_NORMAL,
        largeText: ratio >= CONTRAST_THRESHOLDS.AA_LARGE,
        uiComponents: ratio >= CONTRAST_THRESHOLDS.UI_COMPONENTS,
      },
    };
  },
};

// Color palette from Tailwind config
const colorPalette = {
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#027cbb',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
    950: '#082f49',
  },
  secondary: {
    50: '#fdf2f8',
    100: '#fce7f3',
    200: '#fbcfe8',
    300: '#f9a8d4',
    400: '#f472b6',
    500: '#ec4899',
    600: '#db2777',
    700: '#be185d',
    800: '#9d174d',
    900: '#831843',
    950: '#500724',
  },
  gray: {
    50: '#f8fafc',
    100: '#f1f5f9',
    200: '#e2e8f0',
    300: '#cbd5e1',
    400: '#a8b5c9',
    500: '#64748b',
    600: '#475569',
    700: '#334155',
    800: '#1e293b',
    900: '#0f172a',
    950: '#020617',
  },
  success: {
    50: '#f0fdf4',
    100: '#dcfce7',
    500: '#05875f',
    600: '#047857',
    700: '#15803d',
  },
  warning: {
    50: '#fffbeb',
    100: '#fef3c7',
    500: '#b26205',
    600: '#a16207',
    700: '#b45309',
  },
  error: {
    50: '#fef2f2',
    100: '#fee2e2',
    500: '#ef4444',
    600: '#dc2626',
    700: '#b91c1c',
  },
  info: {
    50: '#eff6ff',
    100: '#dbeafe',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
  },
  // Common colors
  white: '#ffffff',
  black: '#000000',
};

const colorPairs = {
  light: [
    { background: colorPalette.white, foreground: colorPalette.black },
    { background: colorPalette.gray[50], foreground: colorPalette.gray[900] },
    { background: colorPalette.gray[100], foreground: colorPalette.gray[900] },
    { background: colorPalette.primary[50], foreground: colorPalette.primary[900] },
    { background: colorPalette.secondary[50], foreground: colorPalette.secondary[900] },
  ],
  dark: [
    { background: colorPalette.gray[800], foreground: colorPalette.white },
    { background: colorPalette.gray[900], foreground: colorPalette.white },
    { background: colorPalette.black, foreground: colorPalette.white },
    { background: colorPalette.primary[900], foreground: colorPalette.white },
    { background: colorPalette.secondary[900], foreground: colorPalette.white },
  ],
};

class ColorContrastAuditor {
  constructor() {
    this.results = {
      passed: [],
      failed: [],
      warnings: [],
      summary: {
        total: 0,
        passedCount: 0,
        failedCount: 0,
        warningCount: 0,
      },
    };
  }

  /**
   * Run comprehensive color contrast audit
   */
  async runAudit() {
    console.log('🎨 Starting Color Contrast Audit...');
    console.log('Testing WCAG 2.2 AA/AAA compliance\n');

    // Test all defined color pairs
    this.testAllColorPairs();

    // Test UI component colors
    this.testUIComponentColors();

    // Test semantic color combinations
    this.testSemanticColors();

    // Generate report
    this.generateReport();

    console.log('✅ Color contrast audit completed!');
    return this.results;
  }

  testAllColorPairs() {
    console.log('Testing all defined color pairs...');
    for (const theme in colorPairs) {
      colorPairs[theme].forEach(pair => {
        this.testCombination(pair.background, pair.foreground);
      });
    }
  }

  testCombination(background, foreground) {
    const result = colorContrastManager.analyzeContrast(foreground, background);
    const testResult = {
        type: 'text-background',
        foreground,
        background,
        ratio: result.ratio,
        level: result.level,
        passes: result.passes,
        recommendation: this.getRecommendation(result),
    };

    this.categorizeResult(testResult);
    this.results.summary.total++;
  }

  /**
   * Test UI component specific colors
   */
  testUIComponentColors() {
    console.log('🔘 Testing UI component colors...');

    const uiTests = [
      // Button combinations
      { fg: colorPalette.white, bg: colorPalette.primary[600], component: 'Primary Button' },
      { fg: colorPalette.white, bg: colorPalette.secondary[600], component: 'Secondary Button' },
      { fg: colorPalette.primary[600], bg: colorPalette.white, component: 'Outline Button' },

      // Link colors
      { fg: colorPalette.primary[600], bg: colorPalette.white, component: 'Primary Link' },
      { fg: colorPalette.secondary[600], bg: colorPalette.white, component: 'Secondary Link' },

      // Form elements
      { fg: colorPalette.gray[900], bg: colorPalette.white, component: 'Input Text' },
      { fg: colorPalette.gray[500], bg: colorPalette.white, component: 'Placeholder Text' },

      // Status indicators
      { fg: colorPalette.success[600], bg: colorPalette.white, component: 'Success Text' },
      { fg: colorPalette.warning[600], bg: colorPalette.white, component: 'Warning Text' },
      { fg: colorPalette.error[600], bg: colorPalette.white, component: 'Error Text' },
      { fg: colorPalette.info[600], bg: colorPalette.white, component: 'Info Text' },
    ];

    for (const test of uiTests) {
      const result = colorContrastManager.analyzeContrast(test.fg, test.bg);
      const testResult = {
        type: 'ui-component',
        component: test.component,
        foreground: test.fg,
        background: test.bg,
        ratio: result.ratio,
        level: result.level,
        passes: result.passes,
        recommendation: this.getRecommendation(result),
      };

      this.categorizeResult(testResult);
      this.results.summary.total++;
    }
  }

  /**
   * Test semantic color combinations
   */
  testSemanticColors() {
    console.log('🎯 Testing semantic color combinations...');

    const semanticTests = [
      // Dark theme combinations
      {
        fg: colorPalette.gray[100],
        bg: colorPalette.gray[900],
        context: 'Dark Theme Primary Text',
      },
      {
        fg: colorPalette.gray[300],
        bg: colorPalette.gray[800],
        context: 'Dark Theme Secondary Text',
      },
      {
        fg: colorPalette.gray[400],
        bg: colorPalette.gray[700],
        context: 'Dark Theme Tertiary Text',
      },

      // High contrast combinations
      { fg: colorPalette.white, bg: colorPalette.black, context: 'High Contrast White on Black' },
      { fg: colorPalette.black, bg: colorPalette.white, context: 'High Contrast Black on White' },

      // Brand color combinations
      {
        fg: colorPalette.primary[50],
        bg: colorPalette.primary[900],
        context: 'Brand Light on Dark',
      },
      {
        fg: colorPalette.primary[900],
        bg: colorPalette.primary[50],
        context: 'Brand Dark on Light',
      },
    ];

    for (const test of semanticTests) {
      const result = colorContrastManager.analyzeContrast(test.fg, test.bg);
      const testResult = {
        type: 'semantic',
        context: test.context,
        foreground: test.fg,
        background: test.bg,
        ratio: result.ratio,
        level: result.level,
        passes: result.passes,
        recommendation: this.getRecommendation(result),
      };

      this.categorizeResult(testResult);
      this.results.summary.total++;
    }
  }

  /**
   * Get recommendation based on contrast result
   */
  getRecommendation(result) {
    if (result.level === 'AAA') {
      return 'Excellent - Exceeds WCAG AAA standards';
    } else if (result.level === 'AA') {
      return 'Good - Meets WCAG AA standards';
    } else if (result.level === 'A') {
      return 'Caution - Only suitable for large text (18pt+ or 14pt+ bold)';
    } else {
      return `Fail - Does not meet WCAG standards. Current ratio: ${result.ratio.toFixed(2)}:1, Required: 4.5:1 for normal text, 3:1 for large text`;
    }
  }

  /**
   * Categorize test result
   */
  categorizeResult(testResult) {
    if (testResult.level === 'FAIL') {
      this.results.failed.push(testResult);
      this.results.summary.failedCount++;
    } else if (testResult.level === 'A') {
      this.results.warnings.push(testResult);
      this.results.summary.warningCount++;
    } else {
      this.results.passed.push(testResult);
      this.results.summary.passedCount++;
    }
  }

  /**
   * Generate HTML report
   */
  generateReport() {
    console.log('📊 Generating contrast audit report...');
    const reportPath = path.join(__dirname, '..', 'color-contrast-audit.html');
    const reportDir = path.dirname(reportPath);

    const jsonReportPath = path.join(__dirname, '..', 'color-contrast-audit.json');

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Color Contrast Audit Report</title>
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 20px; background-color: #f4f4f4; }
        .container { max-width: 1000px; margin: auto; background: #fff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }
        h1, h2 { color: #0056b3; }
        .summary { display: flex; justify-content: space-around; margin-bottom: 20px; padding: 15px; background-color: #e9ecef; border-radius: 5px; }
        .summary-item { text-align: center; }
        .summary-item h3 { margin: 0; font-size: 1.2em; }
        .summary-item p { font-size: 1.8em; font-weight: bold; margin-top: 5px; }
        .passed { color: #28a745; }
        .warning { color: #ffc107; }
        .failed { color: #dc3545; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { padding: 10px; border: 1px solid #ddd; text-align: left; }
        th { background-color: #f2f2f2; }
        .color-box { width: 30px; height: 30px; border: 1px solid #ccc; display: inline-block; vertical-align: middle; margin-right: 5px; }
        .result-row.fail { background-color: #f8d7da; }
        .result-row.warning { background-color: #fff3cd; }
        .result-row.pass { background-color: #d4edda; }
        .filter-buttons button { padding: 8px 15px; margin-right: 10px; border: none; border-radius: 5px; cursor: pointer; background-color: #007bff; color: white; }
        .filter-buttons button.active { background-color: #0056b3; }
        .filter-buttons button:hover { opacity: 0.9; }
    </style>
</head>
<body>
    <div class="container">
        <h1>Color Contrast Audit Report</h1>
        <div class="summary">
            <div class="summary-item">
                <h3>Total Tests</h3>
                <p>${this.results.summary.total}</p>
            </div>
            <div class="summary-item">
                <h3>Passed</h3>
                <p class="passed">${this.results.summary.passedCount}</p>
            </div>
            <div class="summary-item">
                <h3>Warnings</h3>
                <p class="warning">${this.results.summary.warningCount}</p>
            </div>
            <div class="summary-item">
                <h3>Failed</h3>
                <p class="failed">${this.results.summary.failedCount}</p>
            </div>
        </div>

        <div class="filter-buttons">
            <button class="active" onclick="filterResults('all')" data-filter="all">All (${this.results.summary.total})</button>
            <button onclick="filterResults('pass')" data-filter="pass">Passed (${this.results.summary.passedCount})</button>
            <button onclick="filterResults('warning')" data-filter="warning">Warnings (${this.results.summary.warningCount})</button>
            <button onclick="filterResults('fail')" data-filter="fail">Failed (${this.results.summary.failedCount})</button>
        </div>

        <table>
            <thead>
                <tr>
                    <th>Type</th>
                    <th>Context/Component</th>
                    <th>Foreground</th>
                    <th>Background</th>
                    <th>Ratio</th>
                    <th>Level</th>
                    <th>Recommendation</th>
                </tr>
            </thead>
            <tbody id="auditResultsBody">
                ${this.results.passed.map(r => this.generateRow(r, 'pass')).join('')}
                ${this.results.warnings.map(r => this.generateRow(r, 'warning')).join('')}
                ${this.results.failed.map(r => this.generateRow(r, 'fail')).join('')}
            </tbody>
        </table>
    </div>

    <script>
        function filterResults(status) {
            const rows = document.querySelectorAll('#auditResultsBody tr');
            rows.forEach(row => {
                if (status === 'all' || row.classList.contains(status)) {
                    row.style.display = '';
                } else {
                    row.style.display = 'none';
                }
            });
            document.querySelectorAll('.filter-buttons button').forEach(btn => btn.classList.remove('active'));
            document.querySelector('.filter-buttons button[data-filter="' + status + '"]').classList.add('active');
        }
    </script>
</body>
</html>
`;

    fs.writeFileSync(reportPath, htmlContent);
    fs.writeFileSync(jsonReportPath, JSON.stringify(this.results, null, 2));

    console.log(`
Detailed report generated at: ${reportPath}`);
    console.log(`JSON report generated at: ${jsonReportPath}`);
  }

  generateRow(result, statusClass) {
    const fgColor = result.foreground;
    const bgColor = result.background;
    const context = result.type === 'text-background' ? 'Text/Background' : (result.type === 'ui-component' ? result.component : result.context);
    return `
        <tr class="result-row ${statusClass}" data-status="${statusClass}">
            <td>${result.type}</td>
            <td>${context}</td>
            <td><span class="color-box" style="background-color: ${fgColor};"></span> ${fgColor}</td>
            <td><span class="color-box" style="background-color: ${bgColor};"></span> ${bgColor}</td>
            <td>${result.ratio.toFixed(2)}:1</td>
            <td>${result.level}</td>
            <td>${result.recommendation}</td>
        </tr>
    `;
  }
}

// Run the audit
const auditor = new ColorContrastAuditor();
auditor.runAudit();

export { ColorContrastAuditor };
