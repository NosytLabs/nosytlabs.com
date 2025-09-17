import { describe, it, expect } from 'vitest';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

describe('Button Components', () => {
  const componentsDir = join(process.cwd(), 'src', 'components', 'ui');
  
  it('should have Astro Button component', () => {
    const filePath = join(componentsDir, 'Button.astro');
    expect(existsSync(filePath)).toBe(true);
  });
  
  it('should have React Brand Button component', () => {
    const filePath = join(componentsDir, 'brand-button.jsx');
    expect(existsSync(filePath)).toBe(true);
  });
  
  it('should export buttons from index.js', () => {
    const indexPath = join(componentsDir, 'index.js');
    const indexContent = readFileSync(indexPath, 'utf-8');
    
    expect(indexContent).toContain('Button');
    expect(indexContent).toContain('BrandButton');
  });
});