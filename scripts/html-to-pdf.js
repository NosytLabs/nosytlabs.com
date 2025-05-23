import puppeteer from 'puppeteer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function convertHTMLToPDF(htmlFile, pdfFile) {
  try {
    // Get the HTML file path
    const htmlPath = path.join(__dirname, '../public/files/', htmlFile);
    const pdfPath = path.join(__dirname, '../public/files/', pdfFile);

    // Read the HTML file
    const htmlContent = fs.readFileSync(htmlPath, 'utf8');

    // Launch browser
    const browser = await puppeteer.launch();
    const page = await browser.newPage();

    // Set the content
    await page.setContent(htmlContent, {
      waitUntil: 'networkidle0'
    });

    // Generate PDF
    await page.pdf({
      path: pdfPath,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20px',
        right: '20px',
        bottom: '20px',
        left: '20px'
      }
    });

    console.log(`PDF generated successfully: ${pdfFile}`);
    await browser.close();
    return true;
  } catch (error) {
    console.error(`Error generating PDF ${pdfFile}:`, error);
    return false;
  }
}

async function main() {
  try {
    // Convert website audit HTML to PDF
    await convertHTMLToPDF('sample-website-audit.html', 'sample-website-audit.pdf');

    // Convert services offered HTML to PDF
    await convertHTMLToPDF('services-offered.html', 'services-offered.pdf');

    console.log('All PDFs generated successfully!');
  } catch (error) {
    console.error('Error in main process:', error);
  }
}

main();
