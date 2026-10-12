import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import http from 'http';
import https from 'https';

// Plugin middleware pour permettre le ping de n'importe quelle URL sans restriction CORS
function pingProxyPlugin() {
  return {
    name: 'ping-proxy-plugin',
    configureServer(server) {
      server.middlewares.use('/api/ping', async (req, res) => {
        try {
          const urlObj = new URL(req.url, 'http://localhost');
          const targetUrl = urlObj.searchParams.get('url');

          if (!targetUrl) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'URL manquante' }));
            return;
          }

          const parsedTarget = new URL(targetUrl);
          const client = parsedTarget.protocol === 'https:' ? https : http;

          const startTime = performance.now();
          const request = client.request(
            targetUrl,
            {
              method: 'GET',
              headers: {
                'User-Agent': 'DevStatus-Monitor/1.0 (+https://github.com/Flowz5/dev-status)',
                'Accept': '*/*'
              },
              timeout: 10000
            },
            (response) => {
              const endTime = performance.now();
              const responseTime = Math.round(endTime - startTime);

              // Consommer les données pour libérer les sockets
              response.resume();

              res.writeHead(200, {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
              });
              res.end(
                JSON.stringify({
                  url: targetUrl,
                  status: response.statusCode >= 200 && response.statusCode < 400 ? 'operational' : 'down',
                  statusCode: response.statusCode,
                  responseTime,
                  timestamp: new Date().toISOString()
                })
              );
            }
          );

          request.on('timeout', () => {
            request.destroy();
            res.writeHead(200, {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            });
            res.end(
              JSON.stringify({
                url: targetUrl,
                status: 'down',
                statusCode: 408,
                responseTime: 10000,
                error: 'Timeout (10s)',
                timestamp: new Date().toISOString()
              })
            );
          });

          request.on('error', (err) => {
            const endTime = performance.now();
            res.writeHead(200, {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*'
            });
            res.end(
              JSON.stringify({
                url: targetUrl,
                status: 'down',
                statusCode: 0,
                responseTime: Math.round(endTime - startTime),
                error: err.message,
                timestamp: new Date().toISOString()
              })
            );
          });

          request.end();
        } catch (error) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: error.message }));
        }
      });
    }
  };
}

export default defineConfig({
  plugins: [react(), pingProxyPlugin()],
  server: {
    port: 5173,
    host: true
  }
});
