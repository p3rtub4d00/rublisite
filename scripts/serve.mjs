import http from 'node:http';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', 'dist');
const githubPagesPrefix = '/webrubli';
const types = { '.html': 'text/html', '.css': 'text/css', '.js': 'text/javascript', '.png': 'image/png', '.txt': 'text/plain', '.xml': 'application/xml' };
http.createServer(async (req, res) => {
  const requestedPath = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
  const pathname = requestedPath === githubPagesPrefix
    ? '/'
    : requestedPath.startsWith(`${githubPagesPrefix}/`)
      ? requestedPath.slice(githubPagesPrefix.length)
      : requestedPath;
  const target = path.resolve(root, '.' + pathname, pathname.endsWith('/') ? 'index.html' : '');
  if (!target.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
  try {
    const body = await readFile(target);
    res.writeHead(200, { 'content-type': `${types[path.extname(target)] || 'application/octet-stream'}; charset=utf-8` }).end(body);
  } catch { res.writeHead(404).end('Not found'); }
}).listen(8765, '127.0.0.1', () => console.info('Preview: http://127.0.0.1:8765'));
