import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import http from 'http';
import https from 'https';

// Helper de sécurité anti-SSRF : interdit les adresses locales, métadonnées cloud et sous-réseaux privés
function isPrivateOrReservedHost(hostname) {
  if (!hostname) return true;
  const cleanHost = hostname.toLowerCase();

  // Localhost, loopbacks et wildcard
  if (cleanHost === 'localhost' || cleanHost === '127.0.0.1' || cleanHost === '::1' || cleanHost === '0.0.0.0') {
    return true;
  }

  // Métadonnées Cloud (AWS, GCP, Azure, DigitalOcean)
  if (cleanHost === '169.254.169.254' || cleanHost.startsWith('169.254.')) {
    return true;
  }

  // Sous-domaines internes ou locaux
  if (cleanHost.endsWith('.internal') || cleanHost.endsWith('.local') || cleanHost.endsWith('.localhost')) {
    return true;
  }

  // Sous-réseaux IPv4 privés RFC 1918 et loopbacks
  const ipv4Match = cleanHost.match(/^(\d{1,3})\.(\d{1,3})\.(\d{1,3})\.(\d{1,3})$/);
  if (ipv4Match) {
    const a = Number(ipv4Match[1]);
    const b = Number(ipv4Match[2]);
    if (a === 127 || a === 10 || a === 0) return true;
    if (a === 169 && b === 254) return true;
    if (a === 192 && b === 168) return true;
    if (a === 172 && b >= 16 && b <= 31) return true;
  }

  return false;
}

// Plugin middleware pour permettre le ping de n'importe quelle URL publique sans restriction CORS
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

          let parsedTarget;
          try {
            parsedTarget = new URL(targetUrl);
          } catch {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Format d\'URL invalide' }));
            return;
          }

          // Protection anti-SSRF : protocoles autorisés uniquement
          if (parsedTarget.protocol !== 'http:' && parsedTarget.protocol !== 'https:') {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Protocole non autorisé. Seuls HTTP et HTTPS sont permis.' }));
            return;
          }

          // Protection anti-SSRF : blocage des IP privées, localhost et métadonnées cloud
          if (isPrivateOrReservedHost(parsedTarget.hostname)) {
            res.writeHead(403, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: 'Accès interdit : la surveillance d\'adresses locales ou privées est bloquée pour des raisons de cybersécurité.' }));
            return;
          }

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
