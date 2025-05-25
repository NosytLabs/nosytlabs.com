/**
 * Generate Windows 95 resize handle image
 * This script creates a resize handle image for the Windows 95 interface
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create the win95 directory if it doesn't exist
const win95Dir = path.join(__dirname, '../public/images/win95');
if (!fs.existsSync(win95Dir)) {
  fs.mkdirSync(win95Dir, { recursive: true });
}

// Base64 encoded PNG for a Windows 95 resize handle (16x16 pixels)
// This is a simple diagonal pattern of dots in the bottom-right corner
const base64Image = 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QkZCjsQDBxvVAAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAAFklEQVQ4y2NgGAWjYBSMglEwCkbBSAcACBAAAeaR9cIAAAAASUVORK5CYII=';

// Path to save the image
const imagePath = path.join(win95Dir, 'resize-handle.png');

// Convert base64 to buffer and save to file
const imageBuffer = Buffer.from(base64Image, 'base64');
fs.writeFileSync(imagePath, imageBuffer);

console.log(`Resize handle image created at: ${imagePath}`);

// Also create a resize handle for each corner
const directions = ['nw', 'ne', 'sw', 'se'];

directions.forEach(direction => {
  const cornerImagePath = path.join(win95Dir, `resize-handle-${direction}.png`);
  fs.writeFileSync(cornerImagePath, imageBuffer);
  console.log(`Corner resize handle created at: ${cornerImagePath}`);
});

// Create horizontal and vertical resize handles
const horizontalBase64 = 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QkZCjsQDBxvVAAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAAEklEQVQ4y2NgGAWjYBSMglEwCkY8AAfhAAEXlLd3AAAAAElFTkSuQmCC';
const verticalBase64 = 'iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAB3RJTUUH4QkZCjsQDBxvVAAAAB1pVFh0Q29tbWVudAAAAAAAQ3JlYXRlZCB3aXRoIEdJTVBkLmUHAAAAEklEQVQ4y2NgGAWjYBSMglEwCkY8AAfhAAEXlLd3AAAAAElFTkSuQmCC';

const horizontalImagePath = path.join(win95Dir, 'resize-handle-h.png');
const verticalImagePath = path.join(win95Dir, 'resize-handle-v.png');

fs.writeFileSync(horizontalImagePath, Buffer.from(horizontalBase64, 'base64'));
fs.writeFileSync(verticalImagePath, Buffer.from(verticalBase64, 'base64'));

console.log(`Horizontal resize handle created at: ${horizontalImagePath}`);
console.log(`Vertical resize handle created at: ${verticalImagePath}`);

console.log('All resize handles generated successfully!');
