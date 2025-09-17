import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';

// This test validates the structure and internal consistency of the aggregated aXe report
// located at config/reports/axe-issues-summary.json

describe('aXe Aggregation Report', () => {
  const reportPath = path.join(process.cwd(), 'config', 'reports', 'axe-issues-summary.json');

  it('should exist and be valid JSON', () => {
    expect(fs.existsSync(reportPath)).toBe(true);
    const raw = fs.readFileSync(reportPath, 'utf-8');
    const json = JSON.parse(raw);
    expect(typeof json).toBe('object');
  });

  it('should have required top-level fields and correct types', () => {
    const json = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
    expect(json).toHaveProperty('generatedAt');
    expect(typeof json.generatedAt).toBe('string');

    expect(json).toHaveProperty('totals');
    expect(typeof json.totals).toBe('object');

    expect(json.totals).toHaveProperty('routesProcessed');
    expect(typeof json.totals.routesProcessed).toBe('number');
    expect(json.totals.routesProcessed).toBeGreaterThanOrEqual(1);

    expect(json.totals).toHaveProperty('totalViolations');
    expect(typeof json.totals.totalViolations).toBe('number');
    expect(json.totals.totalViolations).toBeGreaterThanOrEqual(0);

    // updated: uniqueRules (number)
    expect(json.totals).toHaveProperty('uniqueRules');
    expect(typeof json.totals.uniqueRules).toBe('number');
    expect(json.totals.uniqueRules).toBeGreaterThanOrEqual(0);

    // updated: byRoute is an array and byRule is an object map
    expect(json).toHaveProperty('byRoute');
    expect(Array.isArray(json.byRoute)).toBe(true);

    expect(json).toHaveProperty('byRule');
    expect(typeof json.byRule).toBe('object');
  });

  it('should have internally consistent totals', () => {
    const json = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));

    // routesProcessed equals number of entries in byRoute
    const routeEntries = Array.isArray(json.byRoute) ? json.byRoute : [];
    expect(json.totals.routesProcessed).toBe(routeEntries.length);

    // totalViolations equals sum of byRoute[*].violations
    const sumViolations = routeEntries.reduce((sum: number, entry: any) => {
      return sum + (typeof entry?.violations === 'number' ? entry.violations : 0);
    }, 0);
    expect(json.totals.totalViolations).toBe(sumViolations);

    // uniqueRules equals number of keys in byRule
    const ruleKeys = Object.keys(json.byRule || {});
    expect(json.totals.uniqueRules).toBe(ruleKeys.length);
  });

  it('each route detail should include route and violations (number)', () => {
    const json = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
    (json.byRoute || []).forEach((rd: any) => {
      expect(typeof rd.route).toBe('string');
      expect(typeof rd.violations).toBe('number');
    });
  });

  it('each rule detail should include metadata and routes', () => {
    const json = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));
    Object.entries<any>(json.byRule || {}).forEach(([id, rd]: [string, any]) => {
      expect(typeof id).toBe('string');
      expect(typeof rd.totalInstances).toBe('number');
      if (typeof rd.help !== 'undefined') {
        expect(typeof rd.help).toBe('string');
      }
      if (typeof rd.helpUrl !== 'undefined') {
        expect(typeof rd.helpUrl).toBe('string');
      }
      expect(Array.isArray(rd.routes)).toBe(true);
      rd.routes.forEach((r: any) => expect(typeof r).toBe('string'));
    });
  });
});