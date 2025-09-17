import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';

const inputDir = './public/images/blog';
const outputDir = './public/images/blog/webp';

// Create output directory if it doesn't exist
try {
  await fs.access(outputDir);
} catch {
  await fs.mkdir(outputDir, { recursive: true });
}

// Get all SVG files in the input directory
const files = await fs.readdir(inputDir);
const svgFiles = files.filter(file => path.extname(file).toLowerCase() === '.svg');

console.log(`Found ${svgFiles.length} SVG files to optimize`);

// Convert each SVG to WebP
for (const file of svgFiles) {
  const inputPath = path.join(inputDir, file);
  const outputFileName = `${path.basename(file, '.svg')}.webp`;
  const outputPath = path.join(outputDir, outputFileName);
  
  try {
    await sharp(inputPath)
      .resize(800, 600, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(outputPath);
    
    console.log(`✓ Converted ${file} to ${outputFileName}`);
  } catch (error) {
    console.error(`✗ Failed to convert ${file}:`, error.message);
  }
}

console.log('Image optimization complete!');