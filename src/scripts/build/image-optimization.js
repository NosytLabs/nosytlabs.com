/**
 * Image Optimization and Responsive Image Generation Script
 * Optimizes images and generates responsive variants for better performance
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
// import sharp from 'sharp';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class ImageOptimizer {
  constructor() {
    this.publicPath = path.join(__dirname, '..', 'public');
    this.distPath = path.join(__dirname, '..', 'dist');
    this.outputPath = path.join(__dirname, '..', 'dist', 'images', 'optimized');

    // Image optimization configuration
    this.config = {
      // Responsive breakpoints
      breakpoints: [320, 640, 768, 1024, 1280, 1920],

      // Quality settings
      quality: {
        jpeg: 85,
        webp: 80,
        avif: 75,
        png: 90
      },

      // Format priorities (modern first)
      formats: ['avif', 'webp', 'jpeg', 'png'],

      // Optimization settings
      optimization: {
        progressive: true,
        mozjpeg: true,
        pngquant: true,
        optipng: true
      }
    };

    // Image categories for different optimization strategies
    this.categories = {
      hero: {
        sizes: [640, 768, 1024, 1280, 1920],
        quality: { jpeg: 90, webp: 85, avif: 80 }
      },
      thumbnails: {
        sizes: [150, 300, 450],
        quality: { jpeg: 80, webp: 75, avif: 70 }
      },
      content: {
        sizes: [320, 640, 1024],
        quality: { jpeg: 85, webp: 80, avif: 75 }
      },
      icons: {
        sizes: [16, 32, 48, 64, 128, 256],
        quality: { png: 95 }
      }
    };
  }

  /**
   * Optimize all images in the project
   */
  async optimize() {
    console.log('🖼️  Starting image optimization...');

    // Create output directory
    if (!fs.existsSync(this.outputPath)) {
      fs.mkdirSync(this.outputPath, { recursive: true });
    }

    // Find all images
    const images = this.findImages();
    console.log(`📊 Found ${images.length} images to optimize`);

    // Process images by category
    for (const image of images) {
      await this.processImage(image);
    }

    // Generate responsive image manifest
    await this.generateImageManifest();

    // Generate lazy loading configuration
    await this.generateLazyLoadConfig();

    console.log('✅ Image optimization completed!');
  }

  /**
   * Find all images in the project
   */
  findImages() {
    const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.svg'];
    const images = [];

    // Search in public/images
    const publicImages = path.join(this.publicPath, 'images');
    if (fs.existsSync(publicImages)) {
      images.push(...this.findImagesInDir(publicImages, imageExtensions));
    }

    // Search in src/assets
    const srcAssets = path.join(__dirname, '..', 'src', 'assets');
    if (fs.existsSync(srcAssets)) {
      images.push(...this.findImagesInDir(srcAssets, imageExtensions));
    }

    return images;
  }

  /**
   * Find images in a directory
   */
  findImagesInDir(dir, extensions) {
    let images = [];

    const items = fs.readdirSync(dir);

    items.forEach(item => {
      const fullPath = path.join(dir, item);
      const stat = fs.statSync(fullPath);

      if (stat.isDirectory()) {
        images = images.concat(this.findImagesInDir(fullPath, extensions));
      } else if (extensions.includes(path.extname(item).toLowerCase())) {
        images.push({
          path: fullPath,
          name: path.basename(item, path.extname(item)),
          ext: path.extname(item).toLowerCase(),
          category: this.categorizeImage(item),
          size: stat.size
        });
      }
    });

    return images;
  }

  /**
   * Categorize image based on filename and path
   */
  categorizeImage(filename) {
    const name = filename.toLowerCase();

    if (name.includes('hero') || name.includes('banner')) {
      return 'hero';
    }
    if (name.includes('thumb') || name.includes('preview')) {
      return 'thumbnails';
    }
    if (name.includes('icon') || name.includes('logo')) {
      return 'icons';
    }

    return 'content';
  }

  /**
   * Process individual image
   */
  async processImage(image) {
    console.log(`🔄 Processing ${image.name}${image.ext}...`);

    try {
      const category = this.categories[image.category];
      const originalSize = image.size;
      let totalSaved = 0;

      // Skip SVG files (they're already optimized)
      if (image.ext === '.svg') {
        await this.copySVG(image);
        return;
      }

      // Generate responsive variants
      for (const size of category.sizes) {
        await this.generateResponsiveVariant(image, size, category);
      }

      // Generate modern format variants
      for (const format of ['webp', 'avif']) {
        if (image.ext !== `.${format}`) {
          await this.generateFormatVariant(image, format, category);
        }
      }

      console.log(`✅ ${image.name} optimized`);

    } catch (error) {
      console.error(`❌ Error processing ${image.name}:`, error.message);
    }
  }

  /**
   * Generate responsive variant of an image
   */
  async generateResponsiveVariant(image, width, category) {
    try {
      const outputName = `${image.name}-${width}w${image.ext}`;
      const outputPath = path.join(this.outputPath, outputName);

      let pipeline = sharp(image.path)
        .resize(width, null, {
          withoutEnlargement: true,
          fit: 'inside'
        });

      // Apply format-specific optimizations
      if (image.ext === '.jpg' || image.ext === '.jpeg') {
        pipeline = pipeline.jpeg({
          quality: category.quality.jpeg || this.config.quality.jpeg,
          progressive: true,
          mozjpeg: true
        });
      } else if (image.ext === '.png') {
        pipeline = pipeline.png({
          quality: category.quality.png || this.config.quality.png,
          progressive: true
        });
      }

      await pipeline.toFile(outputPath);

    } catch (error) {
      console.warn(`⚠️  Could not generate ${width}w variant for ${image.name}:`, error.message);
    }
  }

  /**
   * Generate modern format variant
   */
  async generateFormatVariant(image, format, category) {
    try {
      const outputName = `${image.name}.${format}`;
      const outputPath = path.join(this.outputPath, outputName);

      let pipeline = sharp(image.path);

      if (format === 'webp') {
        pipeline = pipeline.webp({
          quality: category.quality.webp || this.config.quality.webp,
          effort: 6
        });
      } else if (format === 'avif') {
        pipeline = pipeline.avif({
          quality: category.quality.avif || this.config.quality.avif,
          effort: 9
        });
      }

      await pipeline.toFile(outputPath);

    } catch (error) {
      console.warn(`⚠️  Could not generate ${format} variant for ${image.name}:`, error.message);
    }
  }

  /**
   * Copy SVG files (they're already optimized)
   */
  async copySVG(image) {
    const outputPath = path.join(this.outputPath, `${image.name}${image.ext}`);
    fs.copyFileSync(image.path, outputPath);
  }

  /**
   * Generate image manifest for responsive loading
   */
  async generateImageManifest() {
    console.log('📋 Generating image manifest...');

    const manifest = {
      version: '1.0',
      generated: new Date().toISOString(),
      images: {},
      breakpoints: this.config.breakpoints,
      formats: this.config.formats
    };

    // Scan optimized images
    const optimizedImages = fs.readdirSync(this.outputPath);

    optimizedImages.forEach(filename => {
      const match = filename.match(/^(.+?)(?:-(\d+)w)?\.(\w+)$/);
      if (match) {
        const [, name, width, format] = match;

        if (!manifest.images[name]) {
          manifest.images[name] = {
            formats: {},
            sizes: []
          };
        }

        if (!manifest.images[name].formats[format]) {
          manifest.images[name].formats[format] = [];
        }

        if (width) {
          manifest.images[name].formats[format].push({
            width: parseInt(width),
            url: `/images/optimized/${filename}`
          });

          if (!manifest.images[name].sizes.includes(parseInt(width))) {
            manifest.images[name].sizes.push(parseInt(width));
          }
        } else {
          manifest.images[name].formats[format].push({
            url: `/images/optimized/${filename}`
          });
        }
      }
    });

    // Sort sizes
    Object.values(manifest.images).forEach(image => {
      image.sizes.sort((a, b) => a - b);
      Object.values(image.formats).forEach(formatArray => {
        formatArray.sort((a, b) => (a.width || 0) - (b.width || 0));
      });
    });

    // Write manifest
    const manifestPath = path.join(this.outputPath, 'manifest.json');
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2));

    console.log('✅ Image manifest generated');
  }

  /**
   * Generate lazy loading configuration
   */
  async generateLazyLoadConfig() {
    console.log('⚡ Generating lazy loading configuration...');

    const config = `
/**
 * Responsive Image Lazy Loading Configuration
 * Generated automatically by image optimization script
 */
window.NosytImageConfig = {
  // Intersection Observer options
  observerOptions: {
    root: null,
    rootMargin: '50px 0px',
    threshold: 0.1
  },

  // Loading placeholder
  placeholder: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Y3ZjdmNyIvPjx0ZXh0IHg9IjUwIiB5PSI1MCIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE0IiBmaWxsPSIjY2NjIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+TG9hZGluZy4uLjwvdGV4dD48L3N2Zz4=',

  // Format preferences (modern first)
  formatPreference: ['avif', 'webp', 'jpeg', 'png'],

  // Breakpoints for responsive images
  breakpoints: [320, 640, 768, 1024, 1280, 1920],

  // Quality settings
  quality: {
    high: { jpeg: 90, webp: 85, avif: 80 },
    medium: { jpeg: 85, webp: 80, avif: 75 },
    low: { jpeg: 75, webp: 70, avif: 65 }
  }
};
`;

    const configPath = path.join(__dirname, '..', 'public', 'scripts', 'image-config.js');
    fs.writeFileSync(configPath, config.trim());

    console.log('✅ Lazy loading configuration generated');
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const optimizer = new ImageOptimizer();
  optimizer.optimize().catch(console.error);
}

export default ImageOptimizer;
