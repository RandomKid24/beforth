import express from 'express';
import path from 'path';
import fs from 'fs';
import puppeteer from 'puppeteer';

// Exit immediately on Vercel / CI build environment to prevent Puppeteer/Chrome launch library errors
if (process.env.VERCEL === '1' || process.env.CI === 'true') {
  console.log('Detected Vercel/CI environment. Skipping local Puppeteer prerendering.');
  process.exit(0);
}

const app = express();
const distPath = path.resolve('./dist');

// Serve static assets first
app.use(express.static(distPath));

// Fallback all routes to index.html for React Router
app.get('*', (req, res) => {
  res.sendFile(path.join(distPath, 'index.html'));
});

function cleanHtml(html: string): string {
  let cleaned = html;

  // 1. Remove all Vite injected assets like stylesheet links to let Vite re-inject them at build time
  cleaned = cleaned.replace(/<link rel="stylesheet"[^>]*href="\/assets\/[^"]*"[^>]*>/g, '');

  // 2. Remove all modulepreload link tags
  cleaned = cleaned.replace(/<link rel="modulepreload"[^>]*>/g, '');

  // 3. Find the production JS script tag and replace it back with the source script tag
  cleaned = cleaned.replace(
    /<script type="module"[^>]*src="\/assets\/[^"]*"[^>]*><\/script>/g,
    '<script type="module" src="/src/main.tsx"></script>'
  );

  return cleaned;
}

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

      const rawHtml = await page.content();
      const html = cleanHtml(rawHtml);
      
      // Resolve filesystem path in the SOURCE directory instead of dist
      const outputPath = route === '/' 
        ? path.resolve('./index.html') 
        : path.resolve(`.${route}/index.html`);
      
      // Ensure target directory exists
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      
      // Write the fully cleaned and pre-rendered HTML to source tree
      fs.writeFileSync(outputPath, html, 'utf8');
      console.log(`Saved source prerendered template to: ${outputPath}`);
      
      await page.close();
    }

    await browser.close();
    server.close();
    console.log('Prerendering completed successfully! Please commit the generated files to git.');
  });
}

run().catch(err => {
  console.error('Error during prerendering:', err);
  process.exit(1);
});
