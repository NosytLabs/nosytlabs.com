/**
 * Enhanced HTTP Server for NosytLabs Website
 *
 * This script provides a comprehensive HTTP server for local development.
 * It serves static files from the 'dist' directory and handles
 * common issues like CORS, path resolution, and SPA routing.
 *
 * Features:
 * - Serves static files with proper MIME types
 * - Handles SPA routing by serving index.html for missing routes
 * - Provides CORS headers for cross-origin requests
 * - Supports caching for better performance
 * - Handles 404 and 500 errors gracefully
 * - Provides detailed logging for debugging
 *
 * Usage:
 * 1. Make sure you have Node.js installed
 * 2. Run `node server.js` from the command line
 * 3. Open your browser and navigate to http://localhost:8080
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

// Configuration
const config = {
  // Port to listen on
  port: process.env.PORT || 8080,

  // Directory to serve files from
  rootDir: path.join(__dirname, 'public'),

  // Default file to serve
  defaultFile: 'index.html',

  // MIME types for different file extensions
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
    '.webmanifest': 'application/manifest+json',
    '.gltf': 'model/gltf+json',
    '.glb': 'model/gltf-binary',
    '.bin': 'application/octet-stream',
    '.obj': 'application/x-tgif',
    '.mtl': 'text/plain',
    '.fbx': 'application/octet-stream',
    '.stl': 'application/vnd.ms-pki.stl'
  },

  // Whether to enable CORS
  enableCORS: true,

  // Whether to enable caching
  enableCaching: true,

  // Cache duration in seconds
  cacheDuration: 3600,

  // Whether to enable SPA routing
  enableSPARouting: true,

  // Whether to enable logging
  enableLogging: true,

  // Whether to enable detailed logging
  enableDetailedLogging: false,

  // Retry configuration
  retry: {
    maxAttempts: 3,
    delay: 1000, // ms between retries
    backoff: 2, // exponential backoff multiplier
  },

  // 3D Viewer specific configuration
  viewer3D: {
    basePath: '/3d-viewer',
    compression: true,
    maxAge: 7200, // 2 hours cache for 3D assets
    allowedExtensions: ['.gltf', '.glb', '.bin', '.obj', '.mtl', '.fbx', '.stl']
  }
};

/**
 * Get the MIME type for a file
 * @param {string} filePath - Path to the file
 * @returns {string} MIME type
 */
function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return config.mimeTypes[ext] || 'application/octet-stream';
}

/**
 * Log a message if logging is enabled
 * @param {string} message - Message to log
 * @param {boolean} isError - Whether this is an error message
 */
function log(message, isError = false) {
  if (config.enableLogging) {
    if (isError) {
      console.error(`[ERROR] ${message}`);
    } else {
      console.log(message);
    }
  }
}

/**
 * Log detailed information if detailed logging is enabled
 * @param {string} message - Message to log
 */
function logDetailed(message) {
  if (config.enableLogging && config.enableDetailedLogging) {
    console.log(`[DETAIL] ${message}`);
  }
}

/**
 * Serve a file
 * @param {string} filePath - Path to the file
 * @param {http.ServerResponse} res - HTTP response
 * @param {http.IncomingMessage} req - HTTP request
 */
function serveFile(filePath, res, req, attempt = 1) {
  const isModelFile = config.viewer3D.allowedExtensions.some(ext =>
    filePath.toLowerCase().endsWith(ext)
  );

  const readFileWithRetry = () => new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, data) => {
      if (err) reject(err);
      else resolve(data);
    });
  });

  const handleRetry = async () => {
    try {
      // For 3D model files, use retry logic
      if (isModelFile && attempt <= config.retry.maxAttempts) {
        logDetailed(`Attempt ${attempt} to load 3D model: ${filePath}`);
        return await readFileWithRetry();
      }
      // For other files or if max retries reached, use regular read
      return await readFileWithRetry();
    } catch (err) {
      if (isModelFile && attempt < config.retry.maxAttempts) {
        const delay = config.retry.delay * Math.pow(config.retry.backoff, attempt - 1);
        logDetailed(`Retrying after ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
        return serveFile(filePath, res, req, attempt + 1);
      }
      throw err;
    }
  };

  handleRetry().then(data => {
    if (err) {
      // If the file doesn't exist, try to serve the default file for SPA routing
      if (err.code === 'ENOENT') {
        if (config.enableSPARouting) {
          const indexPath = path.join(config.rootDir, config.defaultFile);

          logDetailed(`File not found: ${filePath}, trying SPA routing with: ${indexPath}`);

          fs.readFile(indexPath, (err, data) => {
            if (err) {
              serve404(res, req);
              return;
            }

            // Serve the index.html file
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(data);

            log(`200 ${req.url} (SPA routing)`);
          });
        } else {
          serve404(res, req);
        }
        return;
      }

      // For other errors, serve a 500 page
      serve500(res, req, err);
      return;
    }

    // Set the content type
    const contentType = getMimeType(filePath);

    // Set headers
    const headers = {
      'Content-Type': contentType,
      'Content-Length': data.length
    };

    // Set CORS headers if enabled
    if (config.enableCORS) {
      headers['Access-Control-Allow-Origin'] = '*';
      headers['Access-Control-Allow-Methods'] = 'GET, POST, OPTIONS';
      headers['Access-Control-Allow-Headers'] = 'Content-Type';
    }

    // Set caching headers if enabled
    if (config.enableCaching) {
      // Special caching rules for 3D viewer assets
      if (req.url.startsWith(config.viewer3D.basePath) &&
          config.viewer3D.allowedExtensions.some(ext => filePath.toLowerCase().endsWith(ext))) {
        headers['Cache-Control'] = `max-age=${config.viewer3D.maxAge}`;
        headers['Expires'] = new Date(Date.now() + config.viewer3D.maxAge * 1000).toUTCString();
      } else {
        headers['Cache-Control'] = `max-age=${config.cacheDuration}`;
        headers['Expires'] = new Date(Date.now() + config.cacheDuration * 1000).toUTCString();
      }
    }

    // Enable compression for 3D assets if configured
    if (config.viewer3D.compression &&
        req.url.startsWith(config.viewer3D.basePath) &&
        config.viewer3D.allowedExtensions.some(ext => filePath.toLowerCase().endsWith(ext))) {
      headers['Content-Encoding'] = 'gzip';
      data = require('zlib').gzipSync(data);
    }

    // Send the response
    res.writeHead(200, headers);
    res.end(data);

    // Log the request
    log(`200 ${req.url}`);
  });
}

/**
 * Serve a 404 page
 * @param {http.ServerResponse} res - HTTP response
 * @param {http.IncomingMessage} req - HTTP request
 */
function serve404(res, req) {
  // Special 404 handling for 3D viewer
  if (req.url.startsWith(config.viewer3D.basePath)) {
    const viewerNotFoundPath = path.join(config.rootDir, config.viewer3D.basePath, '404.html');
    if (fs.existsSync(viewerNotFoundPath)) {
      serveFile(viewerNotFoundPath, res, req);
      return;
    }
  }

  const filePath = path.join(config.rootDir, '404.html');

  // Check if a custom 404 page exists
  if (fs.existsSync(filePath)) {
    serveFile(filePath, res, req);
    return;
  }

  // Otherwise, serve a simple 404 page
  res.writeHead(404, { 'Content-Type': 'text/html' });
  res.end(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>404 - Page Not Found</title>
      <style>
        body {
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.5;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
          text-align: center;
        }
        h1 {
          color: #ff7a2f;
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        p {
          font-size: 1.2rem;
          margin-bottom: 2rem;
        }
        a {
          color: #ff7a2f;
          text-decoration: none;
          font-weight: bold;
        }
        a:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <h1>404 - Page Not Found</h1>
      <p>The page you are looking for does not exist.</p>
      <p><a href="/">Go back to the homepage</a></p>
    </body>
    </html>
  `);

  // Log the request
  log(`404 ${req.url}`, true);
}

/**
 * Serve a 500 page
 * @param {http.ServerResponse} res - HTTP response
 * @param {http.IncomingMessage} req - HTTP request
 * @param {Error} err - Error object
 */
function serve500(res, req, err) {
  res.writeHead(500, { 'Content-Type': 'text/html' });
  res.end(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>500 - Internal Server Error</title>
      <style>
        body {
          font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.5;
          color: #333;
          max-width: 800px;
          margin: 0 auto;
          padding: 2rem;
          text-align: center;
        }
        h1 {
          color: #ff7a2f;
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        p {
          font-size: 1.2rem;
          margin-bottom: 2rem;
        }
        pre {
          background-color: #f5f5f5;
          padding: 1rem;
          border-radius: 4px;
          overflow-x: auto;
          text-align: left;
        }
        a {
          color: #ff7a2f;
          text-decoration: none;
          font-weight: bold;
        }
        a:hover {
          text-decoration: underline;
        }
      </style>
    </head>
    <body>
      <h1>500 - Internal Server Error</h1>
      <p>An error occurred while processing your request.</p>
      <pre>${err.toString()}</pre>
      <p><a href="/">Go back to the homepage</a></p>
    </body>
    </html>
  `);

  // Log the error
  log(`500 ${req.url}: ${err.toString()}`, true);
  
  // Additional logging for 3D viewer errors
  if (req.url.startsWith(config.viewer3D.basePath)) {
    logDetailed(`3D Viewer Error Details:\n${err.stack}\nRequest URL: ${req.url}\nFile Path: ${req.filePath || 'N/A'}`);
  }
}

// Create the server
const server = http.createServer((req, res) => {
  // Parse the URL
  const parsedUrl = url.parse(req.url);

  // Decode the path
  let pathname = decodeURIComponent(parsedUrl.pathname);

  // Normalize the path to prevent directory traversal attacks
  pathname = path.normalize(pathname).replace(/^(\.\.[\/\\])+/, '');

  // Special handling for 3D viewer paths
  if (pathname.startsWith(config.viewer3D.basePath)) {
    logDetailed(`3D viewer request: ${pathname}`);
    // Ensure the 3d-viewer directory exists
    const viewerDir = path.join(config.rootDir, config.viewer3D.basePath);
    if (!fs.existsSync(viewerDir)) {
      fs.mkdirSync(viewerDir, { recursive: true });
      logDetailed(`Created 3D viewer directory: ${viewerDir}`);
    }
  }

  // If the path ends with a slash, serve the default file
  if (pathname.endsWith('/')) {
    pathname += config.defaultFile;
  }

  // Resolve the file path
  const filePath = path.join(config.rootDir, pathname);

  logDetailed(`Request: ${req.method} ${req.url}`);
  logDetailed(`Resolved path: ${filePath}`);

  // Handle OPTIONS requests for CORS
  if (req.method === 'OPTIONS' && config.enableCORS) {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    });
    res.end();
    return;
  }

  // Serve the file
  serveFile(filePath, res, req);
});

// Start the server
server.listen(config.port, () => {
  console.log(`
  ╔════════════════════════════════════════════════════════════╗
  ║                                                            ║
  ║   NosytLabs Website Server                                 ║
  ║                                                            ║
  ║   Server running at:                                       ║
  ║   http://localhost:${config.port}                                   ║
  ║                                                            ║
  ║   Press Ctrl+C to stop the server                          ║
  ║                                                            ║
  ╚════════════════════════════════════════════════════════════╝
  `);
});
