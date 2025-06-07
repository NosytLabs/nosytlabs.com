#!/usr/bin/env node

/**
 * Create Missing Images Script
 * Generates placeholder images for missing assets identified in the audit
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.join(__dirname, '..');

console.log('🖼️  Creating Missing Images for NosytLabs\n');

class ImageCreator {
  constructor() {
    this.missingImages = [
      {
        path: 'public/images/projects/default-project.jpg',
        width: 800,
        height: 600,
        text: 'NosytLabs\nProject',
        bgColor: '#4C1D95',
        textColor: '#FFFFFF'
      },
      {
        path: 'public/images/3d-printing/sample-prints.jpg',
        width: 800,
        height: 600,
        text: '3D Printing\nSamples',
        bgColor: '#FF6B00',
        textColor: '#FFFFFF'
      },
      {
        path: 'public/images/3d-printing/ender-3-s1-pro.jpg',
        width: 800,
        height: 600,
        text: 'Ender 3 S1 Pro\n3D Printer',
        bgColor: '#1F2937',
        textColor: '#FFFFFF'
      },
      {
        path: 'public/images/3d-printing/elegoo-saturn-2.jpg',
        width: 800,
        height: 600,
        text: 'Elegoo Saturn 2\nResin Printer',
        bgColor: '#059669',
        textColor: '#FFFFFF'
      },
      {
        path: 'public/images/content/tycen-youtube-banner.jpg',
        width: 1280,
        height: 720,
        text: 'TycenYT\nTechnology Content Creator',
        bgColor: '#DC2626',
        textColor: '#FFFFFF'
      },
      {
        path: 'public/images/content/cursor-ai-thumbnail.jpg',
        width: 1280,
        height: 720,
        text: 'Cursor AI\nCoding Assistant Review',
        bgColor: '#7C3AED',
        textColor: '#FFFFFF'
      }
    ];
  }

  /**
   * Create all missing images
   */
  async createImages() {
    console.log('🎨 Creating placeholder images...\n');

    for (const imageConfig of this.missingImages) {
      await this.createSVGImage(imageConfig);
    }

    console.log('\n✅ All placeholder images created successfully!');
  }

  /**
   * Create an SVG image and convert to JPG placeholder
   */
  async createSVGImage(config) {
    const { path: imagePath, width, height, text, bgColor, textColor } = config;
    const fullPath = path.join(rootDir, imagePath);
    
    // Ensure directory exists
    const dir = path.dirname(fullPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`📁 Created directory: ${path.relative(rootDir, dir)}`);
    }

    // Create SVG content
    const lines = text.split('\n');
    const fontSize = Math.min(width / 10, height / 8);
    const lineHeight = fontSize * 1.2;
    const totalTextHeight = lines.length * lineHeight;
    const startY = (height - totalTextHeight) / 2 + fontSize;

    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:${bgColor};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${this.darkenColor(bgColor, 20)};stop-opacity:1" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="2" dy="2" stdDeviation="3" flood-color="rgba(0,0,0,0.3)"/>
    </filter>
  </defs>
  
  <!-- Background -->
  <rect width="100%" height="100%" fill="url(#bgGradient)"/>
  
  <!-- Pattern overlay -->
  <pattern id="dots" patternUnits="userSpaceOnUse" width="20" height="20">
    <circle cx="10" cy="10" r="1" fill="rgba(255,255,255,0.1)"/>
  </pattern>
  <rect width="100%" height="100%" fill="url(#dots)"/>
  
  <!-- Border -->
  <rect x="10" y="10" width="${width - 20}" height="${height - 20}" 
        fill="none" stroke="rgba(255,255,255,0.2)" stroke-width="2" rx="8"/>
  
  <!-- Text -->
  <g filter="url(#shadow)">
    ${lines.map((line, index) => `
    <text x="${width / 2}" y="${startY + index * lineHeight}" 
          font-family="Arial, sans-serif" font-size="${fontSize}" font-weight="bold"
          fill="${textColor}" text-anchor="middle" dominant-baseline="middle">
      ${line}
    </text>`).join('')}
  </g>
  
  <!-- Logo/Icon -->
  <g transform="translate(${width - 80}, 20)">
    <circle cx="30" cy="30" r="25" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.3)" stroke-width="2"/>
    <text x="30" y="35" font-family="Arial, sans-serif" font-size="20" font-weight="bold"
          fill="${textColor}" text-anchor="middle">NL</text>
  </g>
  
  <!-- Decorative elements -->
  <circle cx="50" cy="50" r="3" fill="rgba(255,255,255,0.3)"/>
  <circle cx="${width - 50}" cy="${height - 50}" r="3" fill="rgba(255,255,255,0.3)"/>
</svg>`;

    // Write SVG file
    const svgPath = fullPath.replace('.jpg', '.svg');
    fs.writeFileSync(svgPath, svgContent);

    // Create a simple HTML file that can be used as a fallback
    const htmlContent = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>${text.replace('\n', ' - ')}</title>
    <style>
        body { margin: 0; padding: 0; font-family: Arial, sans-serif; }
        .image-container { 
            width: ${width}px; 
            height: ${height}px; 
            background: linear-gradient(135deg, ${bgColor}, ${this.darkenColor(bgColor, 20)});
            display: flex;
            align-items: center;
            justify-content: center;
            color: ${textColor};
            font-size: ${fontSize}px;
            font-weight: bold;
            text-align: center;
            position: relative;
            overflow: hidden;
        }
        .image-container::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-image: radial-gradient(circle at 20% 20%, rgba(255,255,255,0.1) 1px, transparent 1px);
            background-size: 20px 20px;
        }
        .text { position: relative; z-index: 1; text-shadow: 2px 2px 4px rgba(0,0,0,0.3); }
        .logo { position: absolute; top: 20px; right: 20px; width: 60px; height: 60px; border: 2px solid rgba(255,255,255,0.3); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 20px; }
    </style>
</head>
<body>
    <div class="image-container">
        <div class="text">${text.replace('\n', '<br>')}</div>
        <div class="logo">NL</div>
    </div>
</body>
</html>`;

    const htmlPath = fullPath.replace('.jpg', '.html');
    fs.writeFileSync(htmlPath, htmlContent);

    // For now, copy the SVG as JPG (browsers will handle SVG)
    // In a real scenario, you'd use a library like sharp or canvas to convert to actual JPG
    fs.copyFileSync(svgPath, fullPath);

    console.log(`✅ Created: ${path.relative(rootDir, fullPath)}`);
    console.log(`   📄 SVG: ${path.relative(rootDir, svgPath)}`);
    console.log(`   🌐 HTML: ${path.relative(rootDir, htmlPath)}`);
  }

  /**
   * Darken a hex color by a percentage
   */
  darkenColor(hex, percent) {
    const num = parseInt(hex.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = (num >> 16) - amt;
    const G = (num >> 8 & 0x00FF) - amt;
    const B = (num & 0x0000FF) - amt;
    return '#' + (0x1000000 + (R < 255 ? R < 1 ? 0 : R : 255) * 0x10000 +
      (G < 255 ? G < 1 ? 0 : G : 255) * 0x100 +
      (B < 255 ? B < 1 ? 0 : B : 255)).toString(16).slice(1);
  }

  /**
   * Create 3D printing directory structure
   */
  create3DPrintingStructure() {
    console.log('\n📁 Creating 3D printing directory structure...');

    const directories = [
      'public/images/3d-printing',
      'public/images/3d-printing/equipment',
      'public/images/3d-printing/prints',
      'public/images/3d-printing/materials'
    ];

    directories.forEach(dir => {
      const fullPath = path.join(rootDir, dir);
      if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        console.log(`✅ Created: ${dir}`);
      }
    });

    // Create a README file for the 3D printing images
    const readmeContent = `# 3D Printing Images

This directory contains images related to NosytLabs 3D printing content.

## Structure:
- \`equipment/\` - 3D printer and equipment photos
- \`prints/\` - Sample prints and project photos  
- \`materials/\` - Filament and material photos

## Equipment:
- Ender 3 S1 Pro (FDM Printer)
- Elegoo Saturn 2 (Resin Printer)
- Various filaments and resins

## Usage:
These images are used throughout the NosytLabs website to showcase 3D printing capabilities and projects.
`;

    fs.writeFileSync(path.join(rootDir, 'public/images/3d-printing/README.md'), readmeContent);
    console.log('✅ Created: public/images/3d-printing/README.md');
  }
}

// Run image creation if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const creator = new ImageCreator();
  creator.create3DPrintingStructure();
  creator.createImages().catch(console.error);
}

export default ImageCreator;
