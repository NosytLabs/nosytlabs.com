import fs from 'fs/promises';
import path from 'path';

const blogDir = './src/content/blog';

// Get all markdown files in the blog directory
const files = await fs.readdir(blogDir);
const mdFiles = files.filter(file => path.extname(file).toLowerCase() === '.md');

console.log(`Found ${mdFiles.length} blog posts to update`);

// Update each blog post
for (const file of mdFiles) {
  const filePath = path.join(blogDir, file);
  
  try {
    let content = await fs.readFile(filePath, 'utf8');
    
    // Update heroImage paths from .jpg to .webp
    content = content.replace(
      /heroImage:\s*["'](\/images\/blog\/[^"']+)\.jpg["']/g,
      (match, imagePath) => {
        const webpPath = imagePath.replace('/images/blog/', '/images/blog/webp/') + '.webp';
        return `heroImage: "${webpPath}"`;
      }
    );
    
    // Update any inline image references from .svg to .webp
    content = content.replace(
      /!\[([^\]]*)\]\((\/images\/blog\/[^\)]+)\.svg\)/g,
      (match, alt, imagePath) => {
        const webpPath = imagePath.replace('/images/blog/', '/images/blog/webp/') + '.webp';
        return `![${alt}](${webpPath})`;
      }
    );
    
    // Update any HTML img tags from .svg to .webp
    content = content.replace(
      /<img([^>]+)src=["'](\/images\/blog\/[^"']+)\.svg(["'][^>]*>)/g,
      (match, before, imagePath, after) => {
        const webpPath = imagePath.replace('/images/blog/', '/images/blog/webp/') + '.webp';
        return `<img${before}src="${webpPath}${after}`;
      }
    );
    
    await fs.writeFile(filePath, content, 'utf8');
    console.log(`✓ Updated ${file}`);
  } catch (error) {
    console.error(`✗ Failed to update ${file}:`, error.message);
  }
}

console.log('Blog post image updates complete!');