import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const yaml = require('js-yaml');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const contentDir = path.join(rootDir, 'content', 'artikelen');
const publicDir = path.join(rootDir, 'public');
const siteUrl = 'https://www.parasja.nl';
const LANGS = ['nl', 'en'];

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

// Per-language interface strings. The audience terms (Joods/christelijk/messiaans ·
// Jewish/Christian/Messianic) sit in the overview copy and keywords on purpose, so the
// section is found by all three groups.
const UI = {
  nl: {
    htmlLang: 'nl', locale: 'nl_NL', altLocale: 'en_US',
    brand: 'Zelf de parasja lezen', skip: 'Naar de inhoud',
    nav: [
      ['nl/index.html#wat-is-de-parasja', 'Wat is de parasja', 'intro'],
      ['nl/index.html#werkblad', 'Lees de parasja', 'reader'],
      ['nl/index.html#waarom-deze-website', 'Waarom deze website', 'why'],
      ['nl/index.html#methode', 'Over de methode', 'method'],
      ['nl/handleiding.html', 'Handleiding', 'handbook'],
      ['nl/artikelen/', 'Artikelen', 'articles'],
      ['nl/contact.html', 'Contact', 'contact']
    ],
    articlesTitle: 'Artikelen — parasja, Torah en Schrift',
    articlesH1: 'Artikelen',
    articlesEyebrow: 'Verdieping',
    articlesDesc: 'Verdiepende artikelen en series bij de wekelijkse parasja (Torah-lezing): Joods, christelijk en messiaans gelezen, met Hebreeuwse achtergrond, zorgvuldig Schriftgebruik en bronverwijzingen.',
    seriesEyebrow: 'Serie',
    episode: 'Aflevering',
    viewSeries: 'Bekijk de serie →',
    readArticle: 'Lees artikel →',
    allEpisodes: 'Alle afleveringen',
    breadcrumbArticles: 'Artikelen',
    sourcesHeading: 'Bronnen en verwijzingen',
    sourceGroups: { brakel: 'Brakel', scripture: 'Schriftplaatsen', news: 'Nieuws en overige bronnen' },
    footer: 'Parasja.nl — zelf lezen, onderzoeken en toetsen aan de Schrift.',
    noArticles: 'Er zijn nog geen artikelen gepubliceerd.',
    updated: 'Bijgewerkt en bronnen gecontroleerd:',
    articleCount: (n) => `${n} ${n === 1 ? 'artikel' : 'artikelen'}`,
    keywords: 'parasja, parasjot, wekelijkse Torah-lezing, Thora, parasha, Bijbelstudie, Joods, christelijk, messiaans, Tenach, haftara, Hebreeuws, Schrift, Yeshua'
  },
  en: {
    htmlLang: 'en', locale: 'en_US', altLocale: 'nl_NL',
    brand: 'Read the Parashah Yourself', skip: 'Skip to content',
    nav: [
      ['en/index.html#wat-is-de-parasja', 'What is the Parashah', 'intro'],
      ['en/index.html#worksheet', 'Read the parashah', 'reader'],
      ['en/index.html#waarom-deze-website', 'Why this website', 'why'],
      ['en/index.html#method', 'About the method', 'method'],
      ['en/handbook.html', 'Handbook', 'handbook'],
      ['en/artikelen/', 'Articles', 'articles'],
      ['en/contact.html', 'Contact', 'contact']
    ],
    articlesTitle: 'Articles — parashah, Torah and Scripture',
    articlesH1: 'Articles',
    articlesEyebrow: 'In depth',
    articlesDesc: 'In-depth articles and series alongside the weekly parashah (Torah portion): read in a Jewish, Christian and Messianic light, with Hebrew background, careful use of Scripture and source references.',
    seriesEyebrow: 'Series',
    episode: 'Part',
    viewSeries: 'View the series →',
    readArticle: 'Read article →',
    allEpisodes: 'All parts',
    breadcrumbArticles: 'Articles',
    sourcesHeading: 'Sources and references',
    sourceGroups: { brakel: 'Brakel', scripture: 'Scripture', news: 'News and other sources' },
    footer: 'Parasja.nl — read, study and test it against the Scriptures yourself.',
    noArticles: 'No articles have been published yet.',
    updated: 'Updated and sources checked:',
    articleCount: (n) => `${n} ${n === 1 ? 'article' : 'articles'}`,
    keywords: 'parashah, parsha, parasha, weekly Torah portion, Torah reading, Bible study, Jewish, Christian, Messianic, Tanakh, haftarah, Hebrew, Scripture, Yeshua'
  }
};

function readArticleFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return readArticleFiles(full);
    return entry.isFile() && entry.name.endsWith('.md') ? [full] : [];
  });
}

function parseFrontmatter(file) {
  const raw = fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '');
  const match = raw.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n|$)([\s\S]*)$/);
  if (!match) throw new Error(`Geen geldige frontmatter in ${file}`);
  const data = yaml.load(match[1]) || {};
  // The Dutch body may live after the frontmatter instead of in a body_nl field.
  if (!data.body_nl && match[2].trim()) data.body_nl = match[2].trim();
  return { ...data, sourceFile: file };
}

// --- Per-language accessors (strict: no cross-language fallback for body/title) ------
const field = (a, name, lang) => a[`${name}_${lang}`];
const bodyFor = (a, lang) => (field(a, 'body', lang) || '').trim();
const titleFor = (a, lang) => field(a, 'title', lang);
const summaryFor = (a, lang) => field(a, 'summary', lang) || '';
const scriptureFor = (a, lang) => field(a, 'scripture', lang) || a.scripture;
const seriesTitleFor = (a, lang) => field(a, 'series_title', lang) || a.series_title || a.series_slug;
const seriesDescFor = (a, lang) => field(a, 'series_description', lang) || a.series_description || '';

function nav(rootPrefix, lang, active = 'articles') {
  const t = UI[lang];
  const item = ([href, label, key]) => `<a class="article-nav-link${active === key ? ' active' : ''}" href="${rootPrefix}${href}">${label}</a>`;
  return `<header class="article-navbar">
    <div class="article-navbar-inner">
      <a class="article-brand" href="${rootPrefix}${lang}/index.html">${t.brand}</a>
      <nav class="article-nav" aria-label="${lang === 'nl' ? 'Hoofdnavigatie' : 'Main navigation'}">
        ${t.nav.map(item).join('\n        ')}
      </nav>
    </div>
  </header>`;
}

// hreflang alternates: link a language only when that language actually exists for this
// page. `paths` is { nl, en } with the path for each existing language (or null).
function altLinks(paths) {
  const links = [];
  if (paths.nl) links.push(`<link rel="alternate" hreflang="nl" href="${siteUrl}${paths.nl}">`);
  if (paths.en) links.push(`<link rel="alternate" hreflang="en" href="${siteUrl}${paths.en}">`);
  links.push(`<link rel="alternate" hreflang="x-default" href="${siteUrl}${paths.nl || paths.en}">`);
  return links.join('\n  ');
}

function head({ lang, title, description, canonical, rootPrefix, paths, jsonld }) {
  const t = UI[lang];
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);
  const ld = jsonld ? `\n  <script type="application/ld+json">${JSON.stringify(jsonld).replaceAll('<', '\\u003c')}</script>` : '';
  return `<!doctype html>
<html lang="${t.htmlLang}">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${safeTitle} | Parasja.nl</title>
  <meta name="description" content="${safeDescription}">
  <meta name="keywords" content="${t.keywords}">
  <link rel="canonical" href="${canonical}">
  ${altLinks(paths)}
  <meta property="og:type" content="article">
  <meta property="og:locale" content="${t.locale}">
  <meta property="og:locale:alternate" content="${t.altLocale}">
  <meta property="og:title" content="${safeTitle}">
  <meta property="og:description" content="${safeDescription}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:site_name" content="Parasja.nl">
  <meta property="og:image" content="${siteUrl}/assets/share-card.png">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${safeTitle}">
  <meta name="twitter:description" content="${safeDescription}">
  <meta name="twitter:image" content="${siteUrl}/assets/share-card.png">
  <link rel="icon" href="${rootPrefix}assets/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="${rootPrefix}assets/css/articles.css">
  <script defer src="${rootPrefix}assets/js/analytics.js"></script>${ld}
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

function sourceSection(article, lang) {
  const t = UI[lang];
  const groups = [
    [t.sourceGroups.brakel, article[`sources_brakel_${lang}`] || article.sources_brakel],
    [t.sourceGroups.scripture, scriptureFor(article, lang)],
    [t.sourceGroups.news, article[`sources_news_${lang}`] || article.sources_news]
  ].filter(([, items]) => Array.isArray(items) && items.length);
  if (!groups.length) return '';
  return `<section class="article-sources" aria-labelledby="bronnen">
    <h2 id="bronnen">${t.sourcesHeading}</h2>
    ${groups.map(([title, items]) => `<h3>${title}</h3>${sourceList(items)}`).join('')}
  </section>`;
}

function page({ lang, title, description, canonical, rootPrefix, body, paths, jsonld, pageClass = '' }) {
  const t = UI[lang];
  return `${head({ lang, title, description, canonical, rootPrefix, paths, jsonld })}
<body>
  <a class="skip-link" href="#main">${t.skip}</a>
  ${nav(rootPrefix, lang)}
  <main id="main" class="article-main ${pageClass}">
    ${body}
  </main>
  <footer class="article-footer">
    <p>${t.footer}</p>
  </footer>
</body>
</html>\n`;
}

function ensureDir(dir) { fs.mkdirSync(dir, { recursive: true }); }
function write(file, content) { ensureDir(path.dirname(file)); fs.writeFileSync(file, content, 'utf8'); }

const breadcrumbLd = (crumbs) => ({
  '@context': 'https://schema.org', '@type': 'BreadcrumbList',
  itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: c.item }))
});

// --- Build one language ------------------------------------------------------------
function buildLang(lang, allArticles) {
  const t = UI[lang];
  const outputDir = path.join(publicDir, lang, 'artikelen');
  fs.rmSync(outputDir, { recursive: true, force: true });
  ensureDir(outputDir);

  // Only articles that actually have this language's body.
  const articles = allArticles
    .filter((a) => bodyFor(a, lang) && titleFor(a, lang))
    .map((a) => ({ ...a, order: Number(a.order ?? 999) }))
    .sort((a, b) => a.order - b.order);

  const groups = new Map();
  for (const a of articles) {
    if (!a.series_slug || !a.slug) throw new Error(`Artikel mist series_slug of slug: ${a.sourceFile}`);
    if (!groups.has(a.series_slug)) groups.set(a.series_slug, []);
    groups.get(a.series_slug).push(a);
  }

  // Paths helper: which languages exist for a given article / series.
  const articleExists = (a, l) => bodyFor(a, l) && titleFor(a, l);
  const pathForArticle = (a, l) => `/${l}/artikelen/${a.series_slug}/${a.slug}/`;
  const pathForSeries = (slug, l) => `/${l}/artikelen/${slug}/`;

  // Overview page
  const seriesCards = [...groups.entries()].map(([seriesSlug, items]) => {
    const first = items[0];
    const description = seriesDescFor(first, lang) || summaryFor(first, lang) || '';
    return `<article class="series-card">
      <p class="eyebrow">${t.seriesEyebrow}</p>
      <h2><a href="${seriesSlug}/">${escapeHtml(seriesTitleFor(first, lang))}</a></h2>
      <p>${escapeHtml(description)}</p>
      <p class="series-meta">${t.articleCount(items.length)}</p>
      <a class="read-more" href="${seriesSlug}/">${t.viewSeries}</a>
    </article>`;
  }).join('');

  const overviewBody = `<section class="article-hero compact">
      <p class="eyebrow">${t.articlesEyebrow}</p>
      <h1>${t.articlesH1}</h1>
      <p>${escapeHtml(t.articlesDesc)}</p>
    </section>
    <section class="series-grid" aria-label="${lang === 'nl' ? 'Artikelseries' : 'Article series'}">${seriesCards || `<p>${t.noArticles}</p>`}</section>`;

  write(path.join(outputDir, 'index.html'), page({
    lang, title: t.articlesTitle, description: t.articlesDesc,
    canonical: `${siteUrl}/${lang}/artikelen/`, rootPrefix: '../../',
    paths: { nl: '/nl/artikelen/', en: '/en/artikelen/' },
    jsonld: breadcrumbLd([{ name: t.breadcrumbArticles, item: `${siteUrl}/${lang}/artikelen/` }]),
    body: overviewBody, pageClass: 'articles-overview'
  }));

  // Series + article pages
  for (const [seriesSlug, items] of groups) {
    const first = items[0];
    const seriesTitle = seriesTitleFor(first, lang);
    const seriesDesc = seriesDescFor(first, lang);

    const cards = items.map((a) => `<article class="article-card">
      <p class="eyebrow">${t.episode} ${escapeHtml(a.order)}</p>
      <h2><a href="${a.slug}/">${escapeHtml(titleFor(a, lang))}</a></h2>
      <p>${escapeHtml(summaryFor(a, lang))}</p>
      <a class="read-more" href="${a.slug}/">${t.readArticle}</a>
    </article>`).join('');

    const seriesBody = `<nav class="breadcrumbs" aria-label="${lang === 'nl' ? 'Kruimelpad' : 'Breadcrumb'}"><a href="../">${t.breadcrumbArticles}</a><span>›</span><span>${escapeHtml(seriesTitle)}</span></nav>
      <section class="article-hero compact">
        <p class="eyebrow">${t.seriesEyebrow}</p>
        <h1>${escapeHtml(seriesTitle)}</h1>
        <p>${escapeHtml(seriesDesc)}</p>
      </section>
      <section class="article-list" aria-label="${lang === 'nl' ? 'Afleveringen' : 'Parts'}">${cards}</section>`;

    write(path.join(outputDir, seriesSlug, 'index.html'), page({
      lang, title: seriesTitle, description: seriesDesc || t.articlesDesc,
      canonical: `${siteUrl}${pathForSeries(seriesSlug, lang)}`, rootPrefix: '../../../',
      paths: {
        nl: items.some((a) => articleExists(a, 'nl')) ? pathForSeries(seriesSlug, 'nl') : null,
        en: items.some((a) => articleExists(a, 'en')) ? pathForSeries(seriesSlug, 'en') : null
      },
      jsonld: breadcrumbLd([
        { name: t.breadcrumbArticles, item: `${siteUrl}/${lang}/artikelen/` },
        { name: seriesTitle, item: `${siteUrl}${pathForSeries(seriesSlug, lang)}` }
      ]),
      body: seriesBody, pageClass: 'series-page'
    }));

    items.forEach((a, index) => {
      const previous = items[index - 1];
      const next = items[index + 1];
      const title = titleFor(a, lang);
      const summary = summaryFor(a, lang);
      const description = summary || stripHtml(bodyFor(a, lang)).slice(0, 180);
      const canonical = `${siteUrl}${pathForArticle(a, lang)}`;
      const articleNav = `<nav class="article-pagination" aria-label="${lang === 'nl' ? 'Navigatie binnen de serie' : 'Navigation within the series'}">
        <div>${previous ? `<a href="../${previous.slug}/">← ${escapeHtml(titleFor(previous, lang))}</a>` : ''}</div>
        <a class="series-home" href="../">${t.allEpisodes}</a>
        <div class="next">${next ? `<a href="../${next.slug}/">${escapeHtml(titleFor(next, lang))} →</a>` : ''}</div>
      </nav>`;
      const articleBody = `<nav class="breadcrumbs" aria-label="${lang === 'nl' ? 'Kruimelpad' : 'Breadcrumb'}"><a href="../../">${t.breadcrumbArticles}</a><span>›</span><a href="../">${escapeHtml(seriesTitle)}</a><span>›</span><span>${t.episode} ${escapeHtml(a.order)}</span></nav>
        <article class="longread">
          <header class="longread-header">
            <p class="eyebrow">${escapeHtml(seriesTitle)} · ${t.episode} ${escapeHtml(a.order)}</p>
            <h1>${escapeHtml(title)}</h1>
            ${summary ? `<p class="lead">${escapeHtml(summary)}</p>` : ''}
            ${a.last_reviewed_at ? `<p class="publish-date">${t.updated} ${escapeHtml(a.last_reviewed_at)}</p>` : ''}
          </header>
          <div class="article-body">${bodyFor(a, lang)}</div>
          ${sourceSection(a, lang)}
          ${articleNav}
        </article>`;

      const published = a.last_reviewed_on ? String(a.last_reviewed_on).slice(0, 10) : undefined;
      const articleLd = {
        '@context': 'https://schema.org', '@type': 'Article',
        headline: title, description, inLanguage: lang, mainEntityOfPage: canonical,
        isPartOf: { '@type': 'CreativeWorkSeries', name: seriesTitle, url: `${siteUrl}${pathForSeries(a.series_slug, lang)}` },
        author: { '@type': 'Person', name: 'Arie Alberts' },
        publisher: { '@type': 'Organization', name: 'Parasja.nl', url: `${siteUrl}/` },
        ...(published ? { datePublished: published, dateModified: published } : {})
      };

      write(path.join(outputDir, seriesSlug, a.slug, 'index.html'), page({
        lang, title, description, canonical, rootPrefix: '../../../../',
        paths: {
          nl: articleExists(a, 'nl') ? pathForArticle(a, 'nl') : null,
          en: articleExists(a, 'en') ? pathForArticle(a, 'en') : null
        },
        jsonld: articleLd, body: articleBody, pageClass: 'article-page'
      }));
    });
  }

  return articles.length;
}

function build() {
  const all = readArticleFiles(contentDir).map(parseFrontmatter).filter((a) => a.status !== 'draft');
  let total = 0;
  for (const lang of LANGS) total += buildLang(lang, all);
  const nlCount = all.filter((a) => bodyFor(a, 'nl') && titleFor(a, 'nl')).length;
  const enCount = all.filter((a) => bodyFor(a, 'en') && titleFor(a, 'en')).length;
  console.log(`✓ Artikelen gebouwd: ${nlCount} NL + ${enCount} EN pagina's.`);
}

build();
