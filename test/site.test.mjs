import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';
import path from 'node:path';
import { pages } from '../src/pages.mjs';

const dist = path.resolve('dist');
const readPage = async route => readFile(path.join(dist, route, 'index.html'), 'utf8');

test('build includes every page with localized metadata', async () => {
  for (const page of pages) {
    const html = await readPage(page.path);
    assert.match(html, /<html lang="pt-BR">/);
    assert.ok(html.includes(`<title>${page.title}</title>`));
    assert.match(html, /<meta name="description"/);
    assert.match(html, /<main id="main">/);
  }
});

test('navigation targets resolve to generated routes', async () => {
  const routes = new Set(pages.map(page => page.path));
  const basePath = process.env.BASE_PATH?.replace(/\/$/, '') || '';
  for (const page of pages) {
    const html = await readPage(page.path);
    for (const [, href] of html.matchAll(/href="(\/[^"]*)"/g)) {
      if (href.endsWith('.css') || href.endsWith('.svg') || href.endsWith('.png')) continue;
      const route = basePath && href.startsWith(`${basePath}/`) ? href.slice(basePath.length) : href;
      assert.ok(routes.has(route), `${page.path} links to missing route ${href}`);
    }
  }
});

test('menu and FAQ are accessible in generated markup', async () => {
  const html = await readPage('/faq/');
  assert.match(html, /aria-expanded="false"/);
  assert.match(html, /aria-controls="mobile-menu"/);
  assert.match(html, /<details><summary>/);
  assert.match(html, /O Rubli verifica antecedentes criminais\?/);
});

test('legal pages render the source documents and cross links', async () => {
  const terms = await readPage('/termos/');
  const privacy = await readPage('/privacidade/');
  assert.match(terms, /Versão 1.0 — 15 de setembro de 2026/);
  assert.match(terms, /Natureza da intermediação/);
  assert.match(terms, /href="(?:\/webrubli)?\/privacidade\/"/);
  assert.match(privacy, /Dados que podemos tratar/);
  assert.match(privacy, /Seus direitos/);
  assert.doesNotMatch(terms + privacy, /Documento oficial pendente/);
});

test('brand and static essentials exist', async () => {
  await access(path.join(dist, 'brand', 'rubli-logo.png'));
  assert.match(await readPage('/'), /rel="icon" href="(?:\/webrubli)?\/brand\/rubli-logo.png"/);
  await access(path.join(dist, 'robots.txt'));
});
