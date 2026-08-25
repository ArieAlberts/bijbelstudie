import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import yaml from 'js-yaml';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const contentDir = path.join(rootDir, 'content', 'artikelen');
const outputDir = path.join(rootDir, 'public', 'nl', 'artikelen');
const siteUrl = 'https://parasja.nl';

const escapeHtml = (value = '') => String(value)
  .replaceAll('&', '&amp;')
  .replaceAll('<', '&lt;')
  .replaceAll('>', '&gt;')
  .replaceAll('"', '&quot;')
  .replaceAll("'", '&#039;');

const stripHtml = (value = '') => String(value)
  .replace(/<[^>]*>/g, ' ')
  .replace(/\s+/g, ' ')
  .trim();

function readArticleFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return readArticleFiles(full);
    return entry.isFile() && entry.name.endsWith('.md') ? [full] : [];
  });
}

function parseFrontmatter(file) {
  const raw = fs.readFileSync(file, 'utf8');
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*(?:\n|$)([\s\S]*)$/);
  if (!match) throw new Error(`Geen geldige frontmatter in ${file}`);
  const data = yaml.load(match[1]) || {};
  if (!data.body_nl && match[2].trim()) data.body_nl = match[2].trim();
  return { ...data, sourceFile: file };
}

function nav(rootPrefix, active = 'articles') {
  const item = (href, label, key) => `<a class="article-nav-link${active === key ? ' active' : ''}" href="${href}">${label}</a>`;
  return `<header class="article-navbar">
    <div class="article-navbar-inner">
      <a class="article-brand" href="${rootPrefix}nl/index.html">Zelf de parasja lezen</a>
      <nav class="article-nav" aria-label="Hoofdnavigatie">
        ${item(`${rootPrefix}nl/index.html#wat-is-de-parasja`, 'Wat is de parasja', 'intro')}
        ${item(`${rootPrefix}nl/index.html#werkblad`, 'Lees de parasja', 'reader')}
        ${item(`${rootPrefix}nl/index.html#waarom-deze-website`, 'Waarom deze website', 'why')}
        ${item(`${rootPrefix}nl/index.html#methode`, 'Over de methode', 'method')}
        ${item(`${rootPrefix}nl/handleiding.html`, 'Handleiding', 'handbook')}
        ${item(`${rootPrefix}nl/artikelen/`, 'Artikelen', 'articles')}
        ${item(`${rootPrefix}nl/contact.html`, 'Contact', 'contact')}
      </nav>
    </div>
  </header>`;
}

function head({ title, description, canonical, rootPrefix }) {
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);
  return `<!doctype html>
<html lang="nl">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${safeTitle} | Parasja.nl</title>
  <meta name="description" content="${safeDescription}">
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="article">
  <meta property="og:locale" content="nl_NL">
  <meta property="og:title" content="${safeTitle}">
  <meta property="og:description" content="${safeDescription}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${siteUrl}/assets/share-card.png">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="icon" href="${rootPrefix}assets/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="${rootPrefix}assets/css/articles.css">
</head>`;
}

function sourceList(items = []) {
  if (!Array.isArray(items) || items.length === 0) return '';
  return `<ul class="source-list">${items.map((source) => {
    if (typeof source === 'string') return `<li>${escapeHtml(source)}</li>`;
    const label = escapeHtml(source.label || source.title || source.url || 'Bron');
    const detail = source.detail ? ` — ${escapeHtml(source.detail)}` : '';
    return source.url
      ? `<li><a href="${escapeHtml(source.url)}" rel="noopener noreferrer">${label}</a>${detail}</li>`
      : `<li>${label}${detail}</li>`;
  }).join('')}</ul>`;
}

function sourceSection(article) {
  const groups = [
    ['Brakel', article.sources_brakel],
    ['Schriftplaatsen', article.scripture],
    ['Nieuws en overige bronnen', article.sources_news]
  ].filter(([, items]) => Array.isArray(items) && items.length);

  if (!groups.length) return '';
  return `<section class="article-sources" aria-labelledby="bronnen">
    <h2 id="bronnen">Bronnen en verwijzingen</h2>
    ${groups.map(([title, items]) => `<h3>${title}</h3>${sourceList(items)}`).join('')}
  </section>`;
}

function page({ title, description, canonical, rootPrefix, body, pageClass = '' }) {
  return `${head({ title, description, canonical, rootPrefix })}
<body>
  <a class="skip-link" href="#main">Naar de inhoud</a>
  ${nav(rootPrefix)}
  <main id="main" class="article-main ${pageClass}">
    ${body}
  </main>
  <footer class="article-footer">
    <p>Parasja.nl — zelf lezen, onderzoeken en toetsen aan de Schrift.</p>
  </footer>
</body>
</html>\n`;
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function write(file, content) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, content, 'utf8');
}

function cleanOutput() {
  fs.rmSync(outputDir, { recursive: true, force: true });
  ensureDir(outputDir);
}

function build() {
  cleanOutput();

  const articles = readArticleFiles(contentDir)
    .map(parseFrontmatter)
    .filter((article) => article.status !== 'draft' && article.lang !== 'en')
    .map((article) => ({
      ...article,
      order: Number(article.order ?? 999),
      series_slug: article.series_slug || article.series,
      series_title: article.series_title || article.series,
      description: article.summary_nl || stripHtml(article.body_nl || '').slice(0, 180)
    }))
    .sort((a, b) => a.order - b.order);

  const groups = new Map();
  for (const article of articles) {
    if (!article.series_slug || !article.slug || !article.title_nl) {
      throw new Error(`Artikel mist series_slug, slug of title_nl: ${article.sourceFile}`);
    }
    if (!groups.has(article.series_slug)) groups.set(article.series_slug, []);
    groups.get(article.series_slug).push(article);
  }

  const seriesCards = [...groups.entries()].map(([seriesSlug, items]) => {
    const first = items[0];
    const description = first.series_description || first.summary_nl || '';
    return `<article class="series-card">
      <p class="eyebrow">Serie</p>
      <h2><a href="${seriesSlug}/">${escapeHtml(first.series_title)}</a></h2>
      <p>${escapeHtml(description)}</p>
      <p class="series-meta">${items.length} ${items.length === 1 ? 'artikel' : 'artikelen'}</p>
      <a class="read-more" href="${seriesSlug}/">Bekijk de serie →</a>
    </article>`;
  }).join('');

  const overviewBody = `<section class="article-hero compact">
      <p class="eyebrow">Verdieping</p>
      <h1>Artikelen</h1>
      <p>Langere studies en series naast de wekelijkse parasja, met ruimte voor bronverwijzingen, historische context en zorgvuldig Schriftgebruik.</p>
    </section>
    <section class="series-grid" aria-label="Artikelseries">${seriesCards || '<p>Er zijn nog geen artikelen gepubliceerd.</p>'}</section>`;

  write(path.join(outputDir, 'index.html'), page({
    title: 'Artikelen',
    description: 'Verdiepende artikelen en studies op Parasja.nl.',
    canonical: `${siteUrl}/nl/artikelen/`,
    rootPrefix: '../../',
    body: overviewBody,
    pageClass: 'articles-overview'
  }));

  for (const [seriesSlug, items] of groups) {
    const first = items[0];
    const cards = items.map((article) => `<article class="article-card">
      <p class="eyebrow">Aflevering ${escapeHtml(article.order)}</p>
      <h2><a href="${article.slug}/">${escapeHtml(article.title_nl)}</a></h2>
      <p>${escapeHtml(article.summary_nl || '')}</p>
      <a class="read-more" href="${article.slug}/">Lees artikel →</a>
    </article>`).join('');

    const seriesBody = `<nav class="breadcrumbs" aria-label="Kruimelpad"><a href="../">Artikelen</a><span>›</span><span>${escapeHtml(first.series_title)}</span></nav>
      <section class="article-hero compact">
        <p class="eyebrow">Serie</p>
        <h1>${escapeHtml(first.series_title)}</h1>
        <p>${escapeHtml(first.series_description || '')}</p>
      </section>
      <section class="article-list" aria-label="Afleveringen">${cards}</section>`;

    write(path.join(outputDir, seriesSlug, 'index.html'), page({
      title: first.series_title,
      description: first.series_description || first.description,
      canonical: `${siteUrl}/nl/artikelen/${seriesSlug}/`,
      rootPrefix: '../../../',
      body: seriesBody,
      pageClass: 'series-page'
    }));

    items.forEach((article, index) => {
      const previous = items[index - 1];
      const next = items[index + 1];
      const articleNav = `<nav class="article-pagination" aria-label="Navigatie binnen de serie">
        <div>${previous ? `<a href="../${previous.slug}/">← ${escapeHtml(previous.title_nl)}</a>` : ''}</div>
        <a class="series-home" href="../">Alle afleveringen</a>
        <div class="next">${next ? `<a href="../${next.slug}/">${escapeHtml(next.title_nl)} →</a>` : ''}</div>
      </nav>`;
      const articleBody = `<nav class="breadcrumbs" aria-label="Kruimelpad"><a href="../../">Artikelen</a><span>›</span><a href="../">${escapeHtml(article.series_title)}</a><span>›</span><span>Aflevering ${escapeHtml(article.order)}</span></nav>
        <article class="longread">
          <header class="longread-header">
            <p class="eyebrow">${escapeHtml(article.series_title)} · Aflevering ${escapeHtml(article.order)}</p>
            <h1>${escapeHtml(article.title_nl)}</h1>
            ${article.summary_nl ? `<p class="lead">${escapeHtml(article.summary_nl)}</p>` : ''}
            ${article.published_at ? `<p class="publish-date">Gepubliceerd ${escapeHtml(article.published_at)}</p>` : ''}
          </header>
          <div class="article-body">${article.body_nl || ''}</div>
          ${sourceSection(article)}
          ${articleNav}
        </article>`;

      write(path.join(outputDir, seriesSlug, article.slug, 'index.html'), page({
        title: article.title_nl,
        description: article.description,
        canonical: `${siteUrl}/nl/artikelen/${seriesSlug}/${article.slug}/`,
        rootPrefix: '../../../../',
        body: articleBody,
        pageClass: 'article-page'
      }));
    });
  }

  console.log(`✓ ${articles.length} artikel(en) gebouwd in public/nl/artikelen/`);
}

build();
