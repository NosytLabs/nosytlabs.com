/**
 * Image Optimization Script for NosytLabs
 *
 * This script optimizes images in the public/images directory
 * to improve website performance.
 *
 * Usage:
 * - Run with Node.js: node scripts/optimize-images.js
 * - Requires sharp package: npm install sharp
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharpPkg from 'sharp';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const sharp = sharpPkg;

// Configuration
const config = {
  // Directories to process
  directories: [
    'public/images',
    'public/images/icons',
    'public/images/services',
    'public/images/projects',
    'public/images/models',
    'public/images/win95',
    'public/images/blog'
  ],
  // File extensions to process
  extensions: ['.jpg', '.jpeg', '.png', '.webp'],
  // Skip SVG files as they're already optimized
  skipExtensions: ['.svg', '.gif', '.ico'],
  // Quality settings
  quality: {
    jpeg: 75,
    png: 75,
    webp: 65,
    avif: 60
  },
  // Maximum dimensions
  maxWidth: 1600,
  // Create WebP versions
  createWebP: true,
  // Create AVIF versions (next-gen format with better compression)
  createAVIF: true,
  // Responsive image sizes
  responsiveSizes: [320, 640, 960, 1280, 1600],
  // Create responsive images for these directories
  responsiveDirectories: [
    'public/images/projects',
    'public/images/services',
    'public/images/blog'
  ],
  // Skip files that contain these strings
  skipFiles: ['logo', 'favicon', 'icon'],
  // Optimize aggressively
  aggressiveOptimization: true,
  // Optimize metadata
  stripMetadata: true,
  // Use progressive loading for JPEGs and PNGs
  useProgressive: true,
  // Generate image placeholder data URLs for lazy loading
  generatePlaceholders: true,
  // Placeholder quality (very low for small size)
  placeholderQuality: 20,
  // Placeholder size (tiny for small size)
  placeholderSize: 20
};

// Ensure directories exist
config.directories.forEach(dir => {
  if (!fs.existsSync(dir)) {
    try {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`Created directory: ${dir}`);
    } catch (err) {
      console.warn(`Could not create directory ${dir}: ${err.message}`);
    }
  }
});

// Generate a tiny placeholder for lazy loading
async function generatePlaceholder(sharpInstance, filePath) {
  try {
    if (!config.generatePlaceholders) {
      return null;
    }

    // Create a tiny version of the image
    const placeholderBuffer = await sharpInstance
      .clone()
      .resize(config.placeholderSize)
      .jpeg({
        quality: config.placeholderQuality,
        progressive: true
      })
      .toBuffer();

    // Convert to base64 data URL
    const base64Placeholder = `data:image/jpeg;base64,${placeholderBuffer.toString('base64')}`;

    // Write placeholder to a JSON file for later use
    const ext = path.extname(filePath);
    const fileName = path.basename(filePath, ext);
    const dirName = path.dirname(filePath);
    const placeholderPath = path.join(dirName, `${fileName}.placeholder.json`);

    fs.writeFileSync(placeholderPath, JSON.stringify({
      placeholder: base64Placeholder,
      originalPath: filePath
    }));

    console.log(`Generated placeholder for: ${filePath}`);
    return base64Placeholder;
  } catch (err) {
    console.warn(`Error generating placeholder for ${filePath}: ${err.message}`);
    return null;
  }
}

// Process a single image
async function optimizeImage(filePath) {
  try {
    const ext = path.extname(filePath).toLowerCase();
    const fileName = path.basename(filePath, ext);
    const dirName = path.dirname(filePath);

    // Skip already optimized files
    if (fileName.endsWith('.opt')) {
      return;
    }

    // Skip extensions we don't want to process
    if (config.skipExtensions.includes(ext)) {
      return;
    }

    // Only process configured extensions
    if (!config.extensions.includes(ext)) {
      return;
    }

    // Skip files that match skipFiles patterns
    if (config.skipFiles.some(pattern => fileName.includes(pattern))) {
      console.log(`Skipping file (matched skip pattern): ${filePath}`);
      return;
    }

    console.log(`Optimizing: ${filePath}`);

    // Get image info
    const metadata = await sharp(filePath).metadata();

    // Determine if resizing is needed
    const needsResize = metadata.width > config.maxWidth;

    // Create a sharp instance
    let sharpInstance = sharp(filePath);

    // Apply metadata handling
    if (config.stripMetadata) {
      // Strip all metadata except copyright
      sharpInstance = sharpInstance.withMetadata({
        exif: {
          IFD0: {
            Copyright: 'NosytLabs'
          }
        }
      });
    }

    // Resize if needed
    if (needsResize) {
      sharpInstance = sharpInstance.resize({
        width: config.maxWidth,
        withoutEnlargement: true
      });
    }

    // Generate placeholder for lazy loading
    await generatePlaceholder(sharpInstance, filePath);

    // Optimize based on file type
    const optimizedPath = path.join(dirName, `${fileName}.opt${ext}`);

    if (ext === '.jpg' || ext === '.jpeg') {
      await sharpInstance
        .jpeg({
          quality: config.quality.jpeg,
          progressive: config.useProgressive,
          trellisQuantisation: config.aggressiveOptimization,
          overshootDeringing: config.aggressiveOptimization,
          optimizeScans: config.aggressiveOptimization,
          mozjpeg: config.aggressiveOptimization // Use mozjpeg for better compression
        })
        .toFile(optimizedPath);
    } else if (ext === '.png') {
      await sharpInstance
        .png({
          quality: config.quality.png,
          progressive: config.useProgressive,
          compressionLevel: config.aggressiveOptimization ? 9 : 6,
          adaptiveFiltering: config.aggressiveOptimization,
          palette: config.aggressiveOptimization // Use palette for better compression
        })
        .toFile(optimizedPath);
    } else if (ext === '.webp') {
      await sharpInstance
        .webp({
          quality: config.quality.webp,
          reductionEffort: config.aggressiveOptimization ? 6 : 4,
          nearLossless: config.aggressiveOptimization // Use near lossless for better quality
        })
        .toFile(optimizedPath);
    }

    // Create WebP version if configured
    if (config.createWebP && ext !== '.webp') {
      const webpPath = path.join(dirName, `${fileName}.webp`);
      await sharpInstance
        .webp({
          quality: config.quality.webp,
          reductionEffort: config.aggressiveOptimization ? 6 : 4,
          nearLossless: config.aggressiveOptimization
        })
        .toFile(webpPath);
      console.log(`Created WebP version: ${webpPath}`);
    }

    // Create AVIF version if configured (next-gen format with better compression)
    if (config.createAVIF && ext !== '.avif') {
      try {
        const avifPath = path.join(dirName, `${fileName}.avif`);
        await sharpInstance
          .avif({
            quality: config.quality.avif,
            effort: config.aggressiveOptimization ? 9 : 7, // Higher effort = better compression but slower
            chromaSubsampling: '4:2:0' // Standard chroma subsampling for better compression
          })
          .toFile(avifPath);
        console.log(`Created AVIF version: ${avifPath}`);
      } catch (avifErr) {
        console.warn(`Error creating AVIF version for ${filePath}: ${avifErr.message}`);
        console.warn('AVIF support might require a newer version of sharp or additional libraries');
      }
    }

    // Create responsive images if this directory is configured for it
    const isResponsiveDir = config.responsiveDirectories.some(dir => dirName.includes(dir));
    if (isResponsiveDir && metadata.width > config.responsiveSizes[0]) {
      console.log(`Creating responsive images for: ${filePath}`);

      for (const size of config.responsiveSizes) {
        // Skip sizes larger than the original
        if (size >= metadata.width) continue;

        // Create resized version
        const resizedPath = path.join(dirName, `${fileName}-${size}${ext}`);
        await sharp(filePath)
          .resize({
            width: size,
            withoutEnlargement: true
          })
          .toFile(resizedPath);

        // Create WebP version if configured
        if (config.createWebP && ext !== '.webp') {
          const webpPath = path.join(dirName, `${fileName}-${size}.webp`);
          await sharp(resizedPath)
            .webp({
              quality: config.quality.webp,
              reductionEffort: config.aggressiveOptimization ? 6 : 4
            })
            .toFile(webpPath);
        }

        // Create AVIF version if configured
        if (config.createAVIF && ext !== '.avif') {
          try {
            const avifPath = path.join(dirName, `${fileName}-${size}.avif`);
            await sharp(resizedPath)
              .avif({
                quality: config.quality.avif,
                effort: config.aggressiveOptimization ? 9 : 7
              })
              .toFile(avifPath);
          } catch (avifErr) {
            console.warn(`Error creating responsive AVIF for ${resizedPath}: ${avifErr.message}`);
          }
        }

        console.log(`Created responsive image: ${resizedPath}`);
      }
    }

    // Replace original with optimized version
    fs.renameSync(optimizedPath, filePath);
    console.log(`Replaced original with optimized version: ${filePath}`);

    // Get stats
    const originalSize = fs.statSync(filePath).size;
    const optimizedSize = fs.statSync(filePath).size;
    const savings = ((1 - optimizedSize / originalSize) * 100).toFixed(2);

    console.log(`Reduced file size by ${savings}% (${(originalSize - optimizedSize) / 1024}KB)`);
  } catch (err) {
    console.error(`Error optimizing ${filePath}: ${err.message}`);
  }
}

// Process all images in a directory
async function processDirectory(directory) {
  try {
    if (!fs.existsSync(directory)) {
      console.warn(`Directory does not exist: ${directory}`);
      return;
    }

    const files = fs.readdirSync(directory);

    for (const file of files) {
      const filePath = path.join(directory, file);
      const stat = fs.statSync(filePath);

      if (stat.isDirectory()) {
        // Process subdirectories recursively
        await processDirectory(filePath);
      } else if (stat.isFile()) {
        // Process image file
        await optimizeImage(filePath);
      }
    }
  } catch (err) {
    console.error(`Error processing directory ${directory}: ${err.message}`);
  }
}

// Main function
async function main() {
  console.log('Starting image optimization...');

  try {
    // Process all configured directories
    for (const directory of config.directories) {
      await processDirectory(directory);
    }

    console.log('Image optimization complete!');
  } catch (err) {
    console.error(`Error during optimization: ${err.message}`);
    process.exit(1);
  }
}

// Run the script
main();
