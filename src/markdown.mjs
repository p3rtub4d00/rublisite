const escapeHtml = value => value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]);
const legalHref = href => ({ './POLITICA-DE-PRIVACIDADE.md': '/privacidade/', './TERMOS-DE-USO.md': '/termos/' })[href] || '#';
const slug = value => value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

function inline(value) {
  return escapeHtml(value)
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, label, href) => `<a href="${legalHref(href)}">${label}</a>`)
    .replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
}

export function renderMarkdown(markdown) {
  const lines = markdown.replace(/\r\n/g, '\n').split('\n');
  const headings = [];
  const output = [];
  let paragraph = [];
  let list = [];
  const flushParagraph = () => { if (paragraph.length) { output.push(`<p>${inline(paragraph.join(' '))}</p>`); paragraph = []; } };
  const flushList = () => { if (list.length) { output.push(`<ul>${list.map(item => `<li>${inline(item)}</li>`).join('')}</ul>`); list = []; } };
  for (const raw of lines) {
    const line = raw.trim();
    if (!line) { flushParagraph(); flushList(); continue; }
    if (line.startsWith('# ')) continue;
    if (line.startsWith('## ')) {
      flushParagraph(); flushList();
      const text = line.slice(3);
      const id = slug(text);
      headings.push({ text, id });
      output.push(`<h2 id="${id}">${inline(text)}</h2>`);
    } else if (line.startsWith('> ')) {
      flushParagraph(); flushList();
      output.push(`<aside class="legal-alert"><strong>Antes da publicação</strong><p>${inline(line.slice(2).replace(/^\*\*Antes da publicação:\*\*\s*/, ''))}</p></aside>`);
    } else if (line.startsWith('- ')) {
      flushParagraph(); list.push(line.slice(2));
    } else {
      flushList(); paragraph.push(line);
    }
  }
  flushParagraph(); flushList();
  return { html: output.join(''), headings };
}
