import { mkdir, readFile, writeFile, cp, rm, watch } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { pages, renderPage } from '../src/pages.mjs';
import { renderMarkdown } from '../src/markdown.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = path.join(root, 'dist');
const env = {
  siteUrl: cleanUrl(process.env.SITE_URL),
  basePath: cleanBasePath(process.env.BASE_PATH),
  appUrl: cleanUrl(process.env.APP_URL),
  providerUrl: cleanUrl(process.env.PROVIDER_SIGNUP_URL),
  supportUrl: cleanUrl(process.env.SUPPORT_URL),
  instagramUrl: cleanUrl(process.env.INSTAGRAM_URL)
};
function cleanBasePath(value) {
  if (!value || value === '/') return '';
  const safe = `/${value}`.replace(/\/{2,}/g, '/').replace(/\/$/, '');
  return /^\/[a-zA-Z0-9._-]+$/.test(safe) ? safe : '';
}
function cleanUrl(value) {
  if (!value) return '';
  try { const url = new URL(value); return ['http:', 'https:'].includes(url.protocol) ? url.toString().replace(/\/$/, '') : ''; }
  catch { return ''; }
}
function esc(value) { return String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]); }
function nav(current) {
  const items = [['/como-funciona/', 'Como funciona'], ['/para-clientes/', 'Para clientes'], ['/para-profissionais/', 'Para profissionais'], ['/seguranca/', 'Segurança'], ['/faq/', 'FAQ']];
  return items.map(([href, label]) => `<a href="${href}"${current === href ? ' aria-current="page"' : ''}>${label}</a>`).join('');
}
function header(current) {
  const appCta = env.appUrl ? `<a class="button button-small button-primary" href="${esc(env.appUrl)}">Acessar Rubli <span aria-hidden="true">↗</span></a>` : `<a class="button button-small button-primary" href="/como-funciona/">Conhecer o Rubli <span aria-hidden="true">↗</span></a>`;
  return `<header class="site-header"><div class="container header-inner"><a class="brand" href="/" aria-label="Rubli, página inicial"><span class="brand-mark"><img src="/brand/rubli-logo.png" alt="" width="1254" height="1254"></span><strong>Rubli</strong></a><nav class="desktop-nav" aria-label="Navegação principal">${nav(current)}</nav><div class="header-action">${appCta}</div><button class="menu-toggle" type="button" data-menu-toggle aria-expanded="false" aria-controls="mobile-menu" aria-label="Abrir menu"><span></span><span></span><span></span></button></div><nav class="mobile-nav" id="mobile-menu" data-menu aria-label="Navegação móvel">${nav(current)}${appCta}</nav></header>`;
}
function footer() {
  return `<footer class="site-footer"><div class="container footer-grid"><div class="footer-brand"><a href="/" aria-label="Rubli, página inicial"><img src="/brand/rubli-logo.png" alt="Rubli" width="1254" height="1254"></a><p>Serviços mais perto de você.</p></div><div><h2>Produto</h2><a href="/como-funciona/">Como funciona</a><a href="/para-clientes/">Para clientes</a><a href="/para-profissionais/">Para profissionais</a><a href="/seguranca/">Segurança</a></div><div><h2>Empresa</h2><a href="/sobre/">Sobre</a><a href="/faq/">Perguntas frequentes</a><a href="/contato/">Contato</a>${env.instagramUrl ? `<a href="${esc(env.instagramUrl)}" rel="noopener noreferrer">Instagram</a>` : ''}</div><div><h2>Legal</h2><a href="/privacidade/">Privacidade</a><a href="/termos/">Termos de uso</a></div></div><div class="container footer-bottom"><span>© ${new Date().getFullYear()} Rubli. Todos os direitos reservados.</span><span>Feito para aproximar.</span></div></footer>`;
}
function document(page, legalDocs) {
  const canonical = env.siteUrl ? `${env.siteUrl}${page.path}` : '';
  const schema = env.siteUrl && page.path === '/' ? `<script type="application/ld+json">${JSON.stringify({ '@context': 'https://schema.org', '@type': 'Organization', name: 'Rubli', url: env.siteUrl, logo: `${env.siteUrl}/brand/rubli-logo.png` })}</script>` : '';
  const meta = `<title>${esc(page.title)}</title><meta name="description" content="${esc(page.description)}"><meta property="og:type" content="website"><meta property="og:locale" content="pt_BR"><meta property="og:title" content="${esc(page.title)}"><meta property="og:description" content="${esc(page.description)}"><meta name="twitter:card" content="summary"><meta name="twitter:title" content="${esc(page.title)}"><meta name="twitter:description" content="${esc(page.description)}">${canonical ? `<link rel="canonical" href="${esc(canonical)}"><meta property="og:url" content="${esc(canonical)}">` : ''}`;
  const html = `<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#111b39">${meta}<link rel="icon" href="/brand/rubli-logo.png" type="image/png"><link rel="stylesheet" href="/site.css">${schema}</head><body><a class="skip-link" href="#main">Pular para o conteúdo</a>${header(page.path)}<main id="main">${renderPage(page.kind, { ...env, legalDocs })}</main>${footer()}<script src="/site.js" defer></script></body></html>`;
  return env.basePath ? html.replace(/(href|src)="\/(?!\/)/g, `$1="${env.basePath}/`) : html;
}
async function build() {
  const legalDocs = {
    terms: renderMarkdown(await readFile(path.join(root, 'docs', 'TERMOS-DE-USO.md'), 'utf8')),
    privacy: renderMarkdown(await readFile(path.join(root, 'docs', 'POLITICA-DE-PRIVACIDADE.md'), 'utf8'))
  };
  await rm(dist, { recursive: true, force: true });
  await mkdir(dist, { recursive: true });
  await cp(path.join(root, 'public'), dist, { recursive: true });
  await cp(path.join(root, 'src', 'site.css'), path.join(dist, 'site.css'));
  await cp(path.join(root, 'src', 'site.js'), path.join(dist, 'site.js'));
  await writeFile(path.join(dist, '.nojekyll'), '', 'utf8');
  for (const page of pages) {
    const folder = path.join(dist, page.path);
    await mkdir(folder, { recursive: true });
    await writeFile(path.join(folder, 'index.html'), document(page, legalDocs), 'utf8');
  }
  await writeFile(path.join(dist, 'robots.txt'), `User-agent: *\nAllow: /\n${env.siteUrl ? `Sitemap: ${env.siteUrl}/sitemap.xml\n` : ''}`, 'utf8');
  if (env.siteUrl) await writeFile(path.join(dist, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${pages.map(page => `<url><loc>${esc(env.siteUrl + page.path)}</loc></url>`).join('')}</urlset>`, 'utf8');
  console.info(`Built ${pages.length} pages in dist/`);
}
await build();
if (process.argv.includes('--watch')) {
  console.info('Watching src/ and public/');
  for (const folder of ['src', 'public', 'docs']) {
    const watcher = watch(path.join(root, folder), { recursive: true });
    (async () => { for await (const _ of watcher) { try { await build(); } catch (error) { console.error(error); } } })();
  }
}
