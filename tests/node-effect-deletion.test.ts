import { describe, it, expect } from 'vitest';
import { existsSync } from 'fs';
import { join } from 'path';

describe('Node Effect Component Deletion', () => {
  it('should not have the NodeEffect.astro component file', () => {
    const componentPath = join(process.cwd(), 'src', 'components', 'NodeEffect.astro');
    expect(existsSync(componentPath)).toBe(false);
  });
});