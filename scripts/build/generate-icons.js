const fs = require('fs');
const path = require('path');

// Create the icons directory if it doesn't exist
const iconsDir = path.join(__dirname, '../public/images/icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Read the logo.svg file
const logoSvg = fs.readFileSync(path.join(__dirname, '../public/images/logo.svg'), 'utf8');

// Create the Android Chrome icons
const sizes = ['96x96', '128x128', '192x192', '512x512'];

sizes.forEach(size => {
  // Regular icons
  const iconPath = path.join(iconsDir, `android-chrome-${size}.png`);
  fs.writeFileSync(iconPath, logoSvg);
  console.log(`Created ${iconPath}`);

  // Maskable icons
  const maskableIconPath = path.join(iconsDir, `android-chrome-maskable-${size}.png`);
  fs.writeFileSync(maskableIconPath, logoSvg);
  console.log(`Created ${maskableIconPath}`);
});

console.log('Icons generated successfully!');
