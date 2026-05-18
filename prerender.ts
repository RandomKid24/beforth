import express from 'express';
import path from 'path';
import fs from 'fs';
import puppeteer from 'puppeteer';

const app = express();
const distPath = path.resolve('./dist');

// Serve static assets first
app.use(express.static(distPath));

// Fallback all routes to index.html for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

async function run() {
  const server = app.listen(9000, async () => {
    console.log('Static server running on port 9000 for prerendering...');

    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const routes = ['/', '/services', '/about', '/team', '/contact'];

    for (const route of routes) {
      console.log(`Prerendering route: ${route}`);
      const page = await browser.newPage();
      
      // Navigate to the route on our temporary express server
      await page.goto(`http://localhost:9000${route}`, {
        waitUntil: 'networkidle0',
        timeout: 30000
      });

      // Wait a bit to ensure animations and dynamic components render completely
      await new Promise(resolve => setTimeout(resolve, 2500));

      const html = await page.content();
      
      // Resolve filesystem path for output
      const outputPath = path.join(distPath, route === '/' ? 'index.html' : `${route}/index.html`);
      
      // Ensure target directory exists
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      
      // Write the fully serialized HTML
      fs.writeFileSync(outputPath, html, 'utf8');
      console.log(`Saved prerendered file to: ${outputPath}`);
      
      await page.close();
    }

    await browser.close();
    server.close();
    console.log('Prerendering completed successfully!');
  });
}

run().catch(err => {
  console.error('Error during prerendering:', err);
  process.exit(1);
});
