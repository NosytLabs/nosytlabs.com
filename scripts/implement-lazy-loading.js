// Script to implement lazy loading for images
import fs from 'fs/promises';
import path from 'path';

async function implementLazyLoading() {
  console.log('Implementing lazy loading for images...');
  
  try {
    // Update the BlogSearch component to use loading="lazy"
    const blogSearchPath = './src/components/BlogSearch.jsx';
    let blogSearchContent = await fs.readFile(blogSearchPath, 'utf8');
    
    // Add loading="lazy" to img tags
    blogSearchContent = blogSearchContent.replace(
      /<img\s+([^>]*src=[^>]*[^>]*>)/g,
      (match, imgContent) => {
        if (!imgContent.includes('loading=')) {
          return `<img loading="lazy" ${imgContent}`;
        }
        return match;
      }
    );
    
    await fs.writeFile(blogSearchPath, blogSearchContent);
    console.log('✓ Updated BlogSearch.jsx with lazy loading');
    
    // Update blog post template to use loading="lazy"
    const blogDir = './src/content/blog';
    const files = await fs.readdir(blogDir);
    const mdFiles = files.filter(file => path.extname(file).toLowerCase() === '.md');
    
    for (const file of mdFiles) {
      const filePath = path.join(blogDir, file);
      let content = await fs.readFile(filePath, 'utf8');
      
      // Update any HTML img tags to include loading="lazy"
      content = content.replace(
        /<img([^>]+)src=(["'][^"']*["'])([^>]*>)/g,
        (match, before, src, after) => {
          if (!match.includes('loading=')) {
            return `<img${before}src=${src} loading="lazy"${after}`;
          }
          return match;
        }
      );
      
      await fs.writeFile(filePath, content, 'utf8');
      console.log(`✓ Updated ${file} with lazy loading`);
    }
    
    console.log('Lazy loading implementation complete!');
    
  } catch (error) {
    console.error('Failed to implement lazy loading:', error.message);
    process.exit(1);
  }
}

implementLazyLoading();