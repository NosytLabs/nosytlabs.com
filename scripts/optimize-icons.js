import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const inputDir = './public';

async function optimizeIcons() {
  console.log('Optimizing app icons...');
  
  try {
    // Convert SVG icon to WebP
    const svgIconPath = path.join(inputDir, 'images', 'logo-icon.svg');
    const webpIconPath = path.join(inputDir, 'images', 'logo-icon.webp');
    
    await sharp(svgIconPath)
      .resize(192, 192)
      .webp({ quality: 85 })
      .toFile(webpIconPath);
    
    console.log('✓ Created logo-icon.webp');
    
    // Update manifest to include WebP icon
    const manifestPath = path.join(inputDir, 'manifest.json');
    const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
    
    // Add WebP icon to manifest
    manifest.icons.push({
      "src": "/images/logo-icon.webp",
      "sizes": "192x192",
      "type": "image/webp"
    });
    
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
    console.log('✓ Updated manifest.json with WebP icon');
    
    console.log('Icon optimization complete!');
    
  } catch (error) {
    console.error('Failed to optimize icons:', error.message);
    process.exit(1);
  }
}

optimizeIcons();