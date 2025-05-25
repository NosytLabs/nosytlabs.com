/**
 * Windows 95 Icon Generator for NosytOS95
 *
 * This script generates Windows 95-style icons for the NosytOS95 interface
 * using SVG templates.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure the win95 directory exists
const win95Dir = path.join(__dirname, '../public/images/win95');
if (!fs.existsSync(win95Dir)) {
  fs.mkdirSync(win95Dir, { recursive: true });
}

// Define the icons to generate
const icons = [
  {
    name: 'programs',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <rect x="2" y="2" width="28" height="28" fill="#c0c0c0" stroke="#000000" stroke-width="1" />
      <rect x="6" y="6" width="16" height="12" fill="#ffffff" stroke="#000000" stroke-width="1" />
      <rect x="10" y="10" width="16" height="12" fill="#ffffff" stroke="#000000" stroke-width="1" />
      <rect x="14" y="14" width="16" height="12" fill="#ffffff" stroke="#000000" stroke-width="1" />
    </svg>`
  },
  {
    name: 'control-panel',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <rect x="2" y="2" width="28" height="28" fill="#c0c0c0" stroke="#000000" stroke-width="1" />
      <circle cx="10" cy="10" r="3" fill="#ff0000" />
      <circle cx="22" cy="10" r="3" fill="#00ff00" />
      <circle cx="10" cy="22" r="3" fill="#0000ff" />
      <circle cx="22" cy="22" r="3" fill="#ffff00" />
      <rect x="14" y="14" width="4" height="4" fill="#000000" />
    </svg>`
  },
  {
    name: 'date-time',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <rect x="4" y="4" width="24" height="24" fill="#c0c0c0" stroke="#000000" stroke-width="1" />
      <circle cx="16" cy="16" r="10" fill="#ffffff" stroke="#000000" stroke-width="1" />
      <line x1="16" y1="16" x2="16" y2="10" stroke="#000000" stroke-width="2" />
      <line x1="16" y1="16" x2="20" y2="16" stroke="#000000" stroke-width="2" />
    </svg>`
  },
  {
    name: 'help',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <rect x="4" y="4" width="24" height="24" fill="#c0c0c0" stroke="#000000" stroke-width="1" />
      <text x="12" y="22" font-family="Arial" font-size="20" font-weight="bold">?</text>
    </svg>`
  },
  {
    name: 'text-file',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <path d="M6,2 L22,2 L26,6 L26,30 L6,30 Z" fill="#ffffff" stroke="#000000" stroke-width="1" />
      <path d="M22,2 L22,6 L26,6" fill="none" stroke="#000000" stroke-width="1" />
      <line x1="10" y1="10" x2="22" y2="10" stroke="#000000" stroke-width="1" />
      <line x1="10" y1="14" x2="22" y2="14" stroke="#000000" stroke-width="1" />
      <line x1="10" y1="18" x2="22" y2="18" stroke="#000000" stroke-width="1" />
      <line x1="10" y1="22" x2="18" y2="22" stroke="#000000" stroke-width="1" />
    </svg>`
  },
  {
    name: 'about',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <rect x="4" y="4" width="24" height="24" fill="#c0c0c0" stroke="#000000" stroke-width="1" />
      <text x="12" y="22" font-family="Arial" font-size="20" font-weight="bold">i</text>
    </svg>`
  },
  {
    name: 'computer',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <rect x="6" y="4" width="20" height="16" fill="#c0c0c0" stroke="#000000" stroke-width="1" />
      <rect x="10" y="8" width="12" height="8" fill="#000080" stroke="#000000" stroke-width="1" />
      <rect x="10" y="20" width="12" height="4" fill="#c0c0c0" stroke="#000000" stroke-width="1" />
      <rect x="14" y="24" width="4" height="4" fill="#c0c0c0" stroke="#000000" stroke-width="1" />
    </svg>`
  },
  {
    name: 'recycle-bin-empty',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <path d="M12,6 L20,6 L22,8 L26,8 L26,12 L6,12 L6,8 L10,8 L12,6 Z" fill="#c0c0c0" stroke="#000000" stroke-width="1" />
      <path d="M8,12 L24,12 L22,26 L10,26 Z" fill="#ffffff" stroke="#000000" stroke-width="1" />
      <line x1="12" y1="16" x2="12" y2="22" stroke="#000000" stroke-width="1" />
      <line x1="16" y1="16" x2="16" y2="22" stroke="#000000" stroke-width="1" />
      <line x1="20" y1="16" x2="20" y2="22" stroke="#000000" stroke-width="1" />
    </svg>`
  },
  {
    name: 'recycle-bin-full',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <path d="M12,6 L20,6 L22,8 L26,8 L26,12 L6,12 L6,8 L10,8 L12,6 Z" fill="#c0c0c0" stroke="#000000" stroke-width="1" />
      <path d="M8,12 L24,12 L22,26 L10,26 Z" fill="#ffffff" stroke="#000000" stroke-width="1" />
      <path d="M12,16 L14,22 M16,16 L15,22 M20,16 L18,22" fill="none" stroke="#000000" stroke-width="1" />
      <path d="M10,14 L22,14 L21,24 L11,24 Z" fill="#c0c0c0" stroke="#000000" stroke-width="1" opacity="0.5" />
    </svg>`
  },
  {
    name: 'network',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <rect x="4" y="6" width="10" height="8" fill="#c0c0c0" stroke="#000000" stroke-width="1" />
      <rect x="18" y="6" width="10" height="8" fill="#c0c0c0" stroke="#000000" stroke-width="1" />
      <rect x="11" y="18" width="10" height="8" fill="#c0c0c0" stroke="#000000" stroke-width="1" />
      <line x1="9" y1="14" x2="9" y2="16" stroke="#000000" stroke-width="1" />
      <line x1="23" y1="14" x2="23" y2="16" stroke="#000000" stroke-width="1" />
      <line x1="9" y1="16" x2="23" y2="16" stroke="#000000" stroke-width="1" />
      <line x1="16" y1="16" x2="16" y2="18" stroke="#000000" stroke-width="1" />
    </svg>`
  },
  {
    name: 'notepad',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <path d="M8,4 L24,4 L24,28 L8,28 Z" fill="#ffffff" stroke="#000000" stroke-width="1" />
      <line x1="10" y1="8" x2="22" y2="8" stroke="#000000" stroke-width="1" />
      <line x1="10" y1="12" x2="22" y2="12" stroke="#000000" stroke-width="1" />
      <line x1="10" y1="16" x2="22" y2="16" stroke="#000000" stroke-width="1" />
      <line x1="10" y1="20" x2="22" y2="20" stroke="#000000" stroke-width="1" />
      <line x1="10" y1="24" x2="18" y2="24" stroke="#000000" stroke-width="1" />
    </svg>`
  },
  {
    name: 'terminal',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <rect x="4" y="4" width="24" height="24" fill="#000000" stroke="#c0c0c0" stroke-width="1" />
      <text x="6" y="14" font-family="monospace" font-size="10" fill="#c0c0c0">C:\\></text>
      <text x="6" y="24" font-family="monospace" font-size="10" fill="#c0c0c0">_</text>
    </svg>`
  },
  {
    name: 'game',
    svg: `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 32 32">
      <rect x="4" y="8" width="24" height="16" rx="2" ry="2" fill="#c0c0c0" stroke="#000000" stroke-width="1" />
      <circle cx="10" cy="16" r="3" fill="#ff0000" stroke="#000000" stroke-width="1" />
      <circle cx="22" cy="16" r="3" fill="#00ff00" stroke="#000000" stroke-width="1" />
      <rect x="14" y="14" width="4" height="4" fill="#0000ff" stroke="#000000" stroke-width="1" />
    </svg>`
  }
];

// Generate each icon
icons.forEach(icon => {
  const filePath = path.join(win95Dir, `${icon.name}.svg`);
  fs.writeFileSync(filePath, icon.svg);
  console.log(`Generated icon: ${filePath}`);
});

console.log('Windows 95 icons generated successfully!');

// Now convert SVGs to PNGs (requires sharp)
try {
  // Dynamic import for sharp
  const sharpModule = await import('sharp');
  const sharp = sharpModule.default;

  for (const icon of icons) {
    const svgPath = path.join(win95Dir, `${icon.name}.svg`);
    const pngPath = path.join(win95Dir, `${icon.name}.png`);

    try {
      await sharp(Buffer.from(icon.svg))
        .resize(32, 32)
        .png()
        .toFile(pngPath);
      console.log(`Converted to PNG: ${pngPath}`);
    } catch (err) {
      console.error(`Error converting ${icon.name} to PNG: ${err.message}`);
    }
  }
} catch (err) {
  console.warn('Sharp module not available. SVG to PNG conversion skipped.');
  console.warn('Install sharp with: npm install sharp');
  console.warn(err);
}
