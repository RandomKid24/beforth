import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import fs from 'fs';
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');

  // Dynamically resolve entry points based on existing prerendered source folders
  const inputs: Record<string, string> = {
    main: path.resolve(__dirname, 'index.html'),
  };

  const pages = ['services', 'about', 'team', 'contact'];
  pages.forEach(page => {
    const pagePath = path.resolve(__dirname, `${page}/index.html`);
    if (fs.existsSync(pagePath)) {
      inputs[page] = pagePath;
    }
  });

  return {
    plugins: [react(), tailwindcss()],
    define: {
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY),
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      rollupOptions: {
        input: inputs,
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
    },
  };
});
