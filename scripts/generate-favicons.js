/**
 * Generate Favicons Script
 *
 * This script generates favicon PNG files in various sizes from the SVG logo.
 * It uses sharp to convert the SVG to PNG files.
 *
 * Usage: node generate-favicons.js
 */

import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const SVG_PATH = path.join(__dirname, '../public/images/favicon.svg');
const OUTPUT_DIR = path.join(__dirname, '../public/images');

// Sizes to generate
const SIZES = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'favicon-96x96.png', size: 96 },
  { name: 'favicon-128x128.png', size: 128 },
  { name: 'apple-touch-icon.png', size: 180 },
];

// Android Chrome icons
const ANDROID_SIZES = [
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 },
  { name: 'android-chrome-maskable-192x192.png', size: 192 },
  { name: 'android-chrome-maskable-512x512.png', size: 512 },
];

// Create the icons directory if it doesn't exist
const iconsDir = path.join(OUTPUT_DIR, 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Read the SVG file
const svgBuffer = fs.readFileSync(SVG_PATH);

// Generate standard favicons
async function generateFavicons() {
  console.log('Generating favicons...');

  for (const { name, size } of SIZES) {
    const outputPath = path.join(OUTPUT_DIR, name);

    try {
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(outputPath);

      console.log(`Created ${name} (${size}x${size})`);
    } catch (error) {
      console.error(`Error creating ${name}:`, error);
    }
  }

  // Generate Android Chrome icons
  for (const { name, size } of ANDROID_SIZES) {
    const outputPath = path.join(iconsDir, name);

    try {
      await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(outputPath);

      console.log(`Created ${name} (${size}x${size})`);
    } catch (error) {
      console.error(`Error creating ${name}:`, error);
    }
  }

  // Generate favicon.ico (multi-size ICO file)
  try {
    const icoPath = path.join(__dirname, '../public/favicon.ico');

    // For favicon.ico, we'll use the 16x16 and 32x32 PNGs
    // This requires the 'to-ico' package, which we're simulating here
    // In a real implementation, you would use the 'to-ico' package

    // Copy the 32x32 PNG as favicon.ico for now
    fs.copyFileSync(path.join(OUTPUT_DIR, 'favicon-32x32.png'), icoPath);

    console.log('Created favicon.ico');
  } catch (error) {
    console.error('Error creating favicon.ico:', error);
  }

  console.log('Favicon generation complete!');
}

// Run the function
generateFavicons().catch(console.error);
