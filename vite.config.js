import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Custom plugin to handle data saving
const saveDataPlugin = () => {
  const handler = (req, res, next) => {
    if (req.method === 'POST') {
      let body = '';
      req.on('data', chunk => {
        body += chunk.toString();
      });
      req.on('end', () => {
        try {
          const dataPath = path.resolve(__dirname, 'src/data.json');
          // Validate JSON
          JSON.parse(body);
          fs.writeFileSync(dataPath, body);
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ success: true }));
        } catch (err) {
          console.error('Error saving data:', err);
          res.statusCode = 500;
          res.end(JSON.stringify({ error: 'Failed to save data' }));
        }
      });
    } else {
      next();
    }
  };

  return {
    name: 'save-data-plugin',
    configureServer(server) {
      server.middlewares.use('/save-data', handler);
    },
    configurePreviewServer(server) {
      server.middlewares.use('/save-data', handler);
    }
  };
};

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), saveDataPlugin()],
})
