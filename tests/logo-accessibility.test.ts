import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';

describe('Logo Accessibility Fixes', () => {
  const logoDir = join(process.cwd(), 'public', 'brand', 'logos');
  
  it('should have accessibility attributes in logo-primary.svg', () => {
    const logoPath = join(logoDir, 'logo-primary.svg');
    const content = readFileSync(logoPath, 'utf-8');
    
    expect(content).toContain('role="img"');
    expect(content).toContain('aria-label="Nosyt Labs Logo"');
    expect(content).toContain('<title>Nosyt Labs Logo</title>');
    expect(content).toContain('<desc>Triangle with circle logo representing Nosyt Labs</desc>');
  });
  
  it('should have accessibility attributes in logo-monochrome-black.svg', () => {
    const logoPath = join(logoDir, 'logo-monochrome-black.svg');
    const content = readFileSync(logoPath, 'utf-8');
    
    expect(content).toContain('role="img"');
    expect(content).toContain('aria-label="Nosyt Labs Logo"');
    expect(content).toContain('<title>Nosyt Labs Logo</title>');
    expect(content).toContain('<desc>Triangle with circle logo representing Nosyt Labs</desc>');
  });
  
  it('should have accessibility attributes in logo-monochrome-white.svg', () => {
    const logoPath = join(logoDir, 'logo-monochrome-white.svg');
    const content = readFileSync(logoPath, 'utf-8');
    
    expect(content).toContain('role="img"');
    expect(content).toContain('aria-label="Nosyt Labs Logo"');
    expect(content).toContain('<title>Nosyt Labs Logo</title>');
    expect(content).toContain('<desc>Triangle with circle logo representing Nosyt Labs</desc>');
  });
  
  it('should have accessibility attributes in logomark.svg', () => {
    const logoPath = join(logoDir, 'logomark.svg');
    const content = readFileSync(logoPath, 'utf-8');
    
    expect(content).toContain('role="img"');
    expect(content).toContain('aria-label="Nosyt Labs Logo"');
    expect(content).toContain('<title>Nosyt Labs Logo</title>');
    expect(content).toContain('<desc>Triangle with circle logo representing Nosyt Labs</desc>');
  });
});