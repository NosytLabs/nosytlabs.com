/**
 * Simple Static Server for NosytLabs Website
 * 
 * This script creates a simple HTTP server to serve the website files.
 * It's useful for testing the website locally without building it.
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const config = {
  // Port to listen on
  port: 3000,
  // Directory to serve files from
  rootDir: path.join(__dirname, 'src'),
  // Default file to serve
  defaultFile: 'index.html',
  // MIME types
  mimeTypes: {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.webp': 'image/webp',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf',
    '.eot': 'application/vnd.ms-fontobject',
    '.otf': 'font/otf',
    '.mp4': 'video/mp4',
    '.webm': 'video/webm',
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.pdf': 'application/pdf',
    '.zip': 'application/zip',
    '.txt': 'text/plain',
    '.xml': 'application/xml',
    '.md': 'text/markdown',
    '.astro': 'text/html'
  }
};

// Create the server
const server = http.createServer((req, res) => {
  // Parse the URL
  let url = req.url;
  
  // Remove query string
  if (url.includes('?')) {
    url = url.split('?')[0];
  }
  
  // Normalize URL
  url = decodeURIComponent(url);
  
  // Default to index.html for root path
  if (url === '/') {
    url = '/index.html';
  }
  
  // Determine the file path
  let filePath = path.join(config.rootDir, url);
  
  // Check if the file exists
  fs.stat(filePath, (err, stats) => {
    if (err) {
      // Check if it's a directory
      if (err.code === 'ENOENT') {
        // Try public directory
        const publicFilePath = path.join(__dirname, 'public', url);
        
        fs.stat(publicFilePath, (err2, stats2) => {
          if (err2) {
            // File not found
            res.writeHead(404, { 'Content-Type': 'text/plain' });
            res.end('404 Not Found');
          } else if (stats2.isDirectory()) {
            // Redirect to index.html in the directory
            const indexPath = path.join(publicFilePath, config.defaultFile);
            
            fs.stat(indexPath, (err3, stats3) => {
              if (err3) {
                // No index file
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('404 Not Found');
              } else {
                // Serve the index file
                serveFile(indexPath, res);
              }
            });
          } else {
            // Serve the file
            serveFile(publicFilePath, res);
          }
        });
      } else {
        // Server error
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end('500 Internal Server Error');
      }
    } else if (stats.isDirectory()) {
      // Redirect to index.html in the directory
      const indexPath = path.join(filePath, config.defaultFile);
      
      fs.stat(indexPath, (err2, stats2) => {
        if (err2) {
          // No index file
          res.writeHead(404, { 'Content-Type': 'text/plain' });
          res.end('404 Not Found');
        } else {
          // Serve the index file
          serveFile(indexPath, res);
        }
      });
    } else {
      // Serve the file
      serveFile(filePath, res);
    }
  });
});

// Function to serve a file
function serveFile(filePath, res) {
  // Get the file extension
  const ext = path.extname(filePath);
  
  // Get the MIME type
  const mimeType = config.mimeTypes[ext] || 'application/octet-stream';
  
  // Read the file
  fs.readFile(filePath, (err, data) => {
    if (err) {
      // Server error
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('500 Internal Server Error');
    } else {
      // Set the content type
      res.writeHead(200, { 'Content-Type': mimeType });
      
      // Send the file
      res.end(data);
    }
  });
}

// Start the server
server.listen(config.port, () => {
  console.log(`
  ╔════════════════════════════════════════════════════════════╗
  ║                                                            ║
  ║   NosytLabs Simple Server                                  ║
  ║                                                            ║
  ║   Server running at:                                       ║
  ║   http://localhost:${config.port}                                   ║
  ║                                                            ║
  ║   Press Ctrl+C to stop the server                          ║
  ║                                                            ║
  ╚════════════════════════════════════════════════════════════╝
  `);
});
