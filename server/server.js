/**
 * Lucky Fresh Mart – Node.js Backend Server
 * Simple static file server + optional API endpoints
 * 
 * Run: node server.js
 * Visit: http://localhost:3000
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, '../public');

// MIME types
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css':  'text/css; charset=utf-8',
  '.js':   'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png':  'image/png',
  '.jpg':  'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif':  'image/gif',
  '.svg':  'image/svg+xml',
  '.ico':  'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2':'font/woff2',
};

function serveFile(res, filePath) {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.writeHead(404, { 'Content-Type': 'text/html' });
      res.end('<h1>404 – Page Not Found</h1>');
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    const mime = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, {
      'Content-Type': mime,
      'Cache-Control': 'public, max-age=3600',
      'X-Content-Type-Options': 'nosniff',
    });
    res.end(data);
  });
}

const server = http.createServer((req, res) => {
  const parsed = url.parse(req.url);
  let pathname = parsed.pathname;

  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  // ===== API ROUTES =====
  // Health check
  if (pathname === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', shop: 'Lucky Fresh Mart', time: new Date().toISOString() }));
    return;
  }

  // Sitemap
  if (pathname === '/sitemap.xml') {
    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://luckyfreshmart.in/</loc><changefreq>daily</changefreq><priority>1.0</priority></url>
  <url><loc>https://luckyfreshmart.in/#products</loc><changefreq>daily</changefreq><priority>0.9</priority></url>
  <url><loc>https://luckyfreshmart.in/#offers</loc><changefreq>daily</changefreq><priority>0.8</priority></url>
</urlset>`;
    res.writeHead(200, { 'Content-Type': 'application/xml' });
    res.end(sitemap);
    return;
  }

  // Robots.txt
  if (pathname === '/robots.txt') {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('User-agent: *\nAllow: /\nDisallow: /admin/\nSitemap: https://luckyfreshmart.in/sitemap.xml\n');
    return;
  }

  // ===== STATIC FILE SERVING =====
  // Admin panel
  if (pathname.startsWith('/admin')) {
    let adminPath = pathname === '/admin' || pathname === '/admin/'
      ? path.join(__dirname, '../admin/index.html')
      : path.join(__dirname, '../admin', pathname.replace('/admin', ''));
    serveFile(res, adminPath);
    return;
  }

  // Handle root and SPA routing
  if (pathname === '/' || pathname === '') {
    serveFile(res, path.join(PUBLIC_DIR, 'index.html'));
    return;
  }

  // Serve public file
  const filePath = path.join(PUBLIC_DIR, pathname);
  fs.stat(filePath, (err, stat) => {
    if (!err && stat.isFile()) {
      serveFile(res, filePath);
    } else {
      // Fallback to index.html (SPA)
      serveFile(res, path.join(PUBLIC_DIR, 'index.html'));
    }
  });
});

server.listen(PORT, () => {
  console.log('');
  console.log('🥦 ================================');
  console.log('   Lucky Fresh Mart Server');
  console.log('🥦 ================================');
  console.log(`🌐 Website:  http://localhost:${PORT}`);
  console.log(`🔐 Admin:    http://localhost:${PORT}/admin`);
  console.log(`📡 API:      http://localhost:${PORT}/api/health`);
  console.log('');
  console.log('✅ Server is running! Press Ctrl+C to stop.');
  console.log('');
});

server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Try: PORT=3001 node server.js`);
  } else {
    console.error('Server error:', err);
  }
});
