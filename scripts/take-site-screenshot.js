import puppeteer from 'puppeteer';
import fs from 'fs';

(async () => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  // Capture console logs
  const logs = [];
  page.on('console', msg => {
    logs.push(msg.text());
  });

  const pages = [
    { url: 'http://localhost:4321/', file: 'homepage-screenshot.png' },
    { url: 'http://localhost:4321/contact', file: 'contact-screenshot.png' },
    { url: 'http://localhost:4321/projects', file: 'projects-screenshot.png' },
    { url: 'http://localhost:4321/services', file: 'services-screenshot.png' },
  ];

  for (const p of pages) {
    // eslint-disable-next-line no-await-in-loop
    await page.goto(p.url, { waitUntil: 'networkidle2' });
    // eslint-disable-next-line no-await-in-loop
    await page.screenshot({ path: p.file, fullPage: true });
  }

  // Save console logs
  fs.writeFileSync('console-logs.txt', logs.join('\n'));

  await browser.close();
  console.log('Screenshots and logs captured.');
})();
