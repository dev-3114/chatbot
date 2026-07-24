const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = process.env.PORT || 3000;
const rootDir = __dirname;

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.md': 'text/markdown; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml'
};

function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(payload));
}

function serveFile(res, filePath) {
  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Not Found');
      } else {
        res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('Server error');
      }
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || 'application/octet-stream';
    res.writeHead(200, { 'Content-Type': contentType });
    res.end(content);
  });
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = decodeURIComponent(url.pathname);

  if (pathname === '/api/health') {
    sendJson(res, 200, { ok: true, service: 'research-chatbot-api' });
    return;
  }

  if (pathname === '/api/chat') {
    if (req.method !== 'POST') {
      sendJson(res, 405, { error: 'Method not allowed' });
      return;
    }

    let body = '';
    req.on('data', chunk => { body += chunk; });
    req.on('end', () => {
      try {
        const { message, documentText, model } = JSON.parse(body || '{}');
        if (!message || !documentText) {
          sendJson(res, 400, { error: 'message and documentText are required' });
          return;
        }

        const systemPrompt = `You are PaperMind AI, a specialized research assistant. Answer based only on the provided document.\n\nDOCUMENT:\n${documentText}\n\nIf the answer is not in the document, say that clearly.`;

        const reply = `This is the built API response for: "${message}".\n\nModel: ${model || 'default'}\n\nDocument received: ${documentText.length} characters.\n\nSystem prompt: ${systemPrompt.slice(0, 120)}...`;

        sendJson(res, 200, { reply });
      } catch (error) {
        sendJson(res, 400, { error: 'Invalid JSON body' });
      }
    });
    return;
  }

  if (pathname === '/' || pathname === '/index.html') {
    serveFile(res, path.join(rootDir, 'index.html'));
    return;
  }

  const filePath = path.join(rootDir, pathname);
  if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
    serveFile(res, filePath);
    return;
  }

  serveFile(res, path.join(rootDir, 'index.html'));
});

server.listen(PORT, () => {
  console.log(`Research chatbot API running at http://localhost:${PORT}`);
});
