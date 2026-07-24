import json
import os
import re
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer
from urllib.parse import urlparse, unquote

PORT = int(os.environ.get('PORT', '3000'))
ROOT = os.path.dirname(os.path.abspath(__file__))

MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.md': 'text/markdown; charset=utf-8',
    '.txt': 'text/plain; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.svg': 'image/svg+xml',
}


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        parsed = urlparse(self.path)
        pathname = unquote(parsed.path)

        if pathname == '/api/health':
            self._send_json(200, {'ok': True, 'service': 'research-chatbot-api'})
            return

        if pathname in ('/', '/index.html'):
            self._serve_file('index.html')
            return

        file_path = os.path.join(ROOT, pathname.lstrip('/'))
        if os.path.isfile(file_path):
            self._serve_file(file_path)
            return

        self._serve_file('index.html')

    def do_POST(self):
        parsed = urlparse(self.path)
        pathname = unquote(parsed.path)

        if pathname == '/api/chat':
            content_length = int(self.headers.get('Content-Length', '0'))
            body = self.rfile.read(content_length).decode('utf-8') if content_length else '{}'
            try:
                payload = json.loads(body) if body else {}
            except json.JSONDecodeError:
                self._send_json(400, {'error': 'Invalid JSON body'})
                return

            message = payload.get('message', '')
            document_text = payload.get('documentText', '')
            model = payload.get('model', 'default')

            if not message or not document_text:
                self._send_json(400, {'error': 'message and documentText are required'})
                return

            reply = self._build_reply(message, document_text, model)
            self._send_json(200, {'reply': reply})
            return

        self._send_json(404, {'error': 'Not found'})

    def _build_reply(self, message, document_text, model):
        message = (message or '').strip()
        document_text = (document_text or '').strip()

        if not message:
            return 'Please ask a question about the document.'

        lower_message = message.lower()
        title_match = re.search(r'\btitle\b', lower_message)
        if title_match:
            title = None
            for line in document_text.splitlines():
                line = line.strip()
                if line.startswith('#') and len(line) > 1:
                    title = line.lstrip('#').strip()
                    break
            if title:
                return f'The paper title is: {title}'

        if 'abstract' in lower_message:
            abstract = self._extract_section(document_text, 'abstract')
            if abstract:
                return abstract[:1200]

        if 'conclusion' in lower_message:
            conclusion = self._extract_section(document_text, 'conclusion')
            if conclusion:
                return conclusion[:1200]

        if 'authors' in lower_message:
            authors = self._extract_section(document_text, 'authors')
            if authors:
                return authors[:1000]

        snippet = self._find_best_snippet(document_text, message)
        if snippet:
            return snippet

        return (
            f'I could not find a direct answer for "{message}" in the provided document.\n\n'
            f'Model: {model}\n\n'
            f'Document length: {len(document_text)} characters.'
        )

    def _extract_section(self, document_text, section_name):
        pattern = re.compile(rf'##?\s*{re.escape(section_name)}\b', re.IGNORECASE)
        match = pattern.search(document_text)
        if not match:
            return None
        start = match.end()
        next_heading = re.search(r'\n##?\s+', document_text[start:])
        if next_heading:
            return document_text[start:start + next_heading.start()].strip()
        return document_text[start:].strip()

    def _find_best_snippet(self, document_text, message):
        words = re.findall(r'[A-Za-z0-9]+', message.lower())
        if not words:
            return None

        for word in words:
            if len(word) < 3:
                continue
            pattern = re.compile(re.escape(word), re.IGNORECASE)
            match = pattern.search(document_text)
            if match:
                start = max(0, match.start() - 250)
                end = min(len(document_text), match.end() + 500)
                snippet = document_text[start:end].strip()
                return f'Here is the most relevant excerpt:\n\n{snippet}'

        return None

    def _send_json(self, status_code, payload):
        body = json.dumps(payload).encode('utf-8')
        self.send_response(status_code)
        self.send_header('Content-Type', 'application/json; charset=utf-8')
        self.send_header('Content-Length', str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def _serve_file(self, relative_path):
        path = relative_path if os.path.isabs(relative_path) else os.path.join(ROOT, relative_path)
        if not os.path.isfile(path):
            self.send_error(404, 'File not found')
            return

        with open(path, 'rb') as handle:
            content = handle.read()

        ext = os.path.splitext(path)[1].lower()
        content_type = MIME_TYPES.get(ext, 'application/octet-stream')
        self.send_response(200)
        self.send_header('Content-Type', content_type)
        self.send_header('Content-Length', str(len(content)))
        self.end_headers()
        self.wfile.write(content)


if __name__ == '__main__':
    server = ThreadingHTTPServer(('0.0.0.0', PORT), Handler)
    print(f'Research chatbot API running at http://localhost:{PORT}')
    server.serve_forever()
