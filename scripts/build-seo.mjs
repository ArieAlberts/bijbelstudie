import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const yaml = require('js-yaml');

const root = process.cwd();
const publicDir = path.join(root, 'public');
const sourceDir = path.join(root, 'content', 'parasjot');
const site = 'https://www.parasja.nl';

const esc = v => String(v ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const text = v => String(v ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

// Meta description for search results: keep whole sentences that fit within `max`;
// if even the first sentence is too long, cut at a word boundary and add an ellipsis.
// Never ends mid-word or on a dangling comma.
function metaDescription(source, max = 160) {
  const s = text(source);
  if (s.length <= max) return s;
  // A sentence ends at . ! ? followed by a capital letter, but not after a Bible-book or
  // other abbreviation ("Gen. 21:1", "1 Sam. 1:19", "vgl. Joh.").
  const ABBR = /\b(gen|ex|lev|num|deut|joz|richt|sam|kon|kron|ps|spr|pred|jes|jer|ez|dan|hos|mich|zach|mal|mat|matt|mt|mk|luk|lk|joh|hand|rom|kor|gal|ef|fil|kol|thess|tim|hebr|jak|petr|op|vgl|bv|o\.a|nl|vs|ca|e\.d)\.$/i;
  const sentences = [];
  for (const piece of s.split(/(?<=[.!?]["'’”)]*)\s+(?=["'‘“„(]?[A-ZÀ-ÝÄËÏÖÜ])/)) {
    if (sentences.length && ABBR.test(sentences[sentences.length - 1])) sentences[sentences.length - 1] += ' ' + piece;
    else sentences.push(piece);
  }
  let out = '';
  for (const sentence of sentences) {
    const next = out ? out + ' ' + sentence : sentence;
    if (next.length > max) break;
    out = next;
  }
  out = out.trim();
  if (out.length >= 50) return out;
  const cut = s.slice(0, max - 1);
  return cut.slice(0, cut.lastIndexOf(' ')).replace(/[\s,;:–—-]+$/, '') + '…';
}

// <title> leads with the term people search for ("Parasja Noach"), then the reading's own title.
function pageTitle(lang, parasha, title) {
  const label = lang === 'nl' ? 'Parasja' : 'Parashah';
  const head = String(title).toLowerCase().includes(String(parasha).toLowerCase())
    ? `${label} ${parasha}`
    : `${label} ${parasha}: ${title}`;
  return `${head} | Parasja.nl`;
}

const items = [];
const add = (url, priority = '0.5', lastmod = null) => items.push({ url, priority, lastmod });

// Fixed routes that exist after the full build (articles/assets run before this script).
const fixed = ['/', '/nl/', '/en/', '/nl/artikelen/', '/nl/parasjot/', '/en/parasjot/'];
fixed.forEach(x => add(x, x === '/nl/' ? '1.0' : '0.6'));

// Per-language copy for the standalone pages.
const L = {
  nl: {
    htmlLang: 'nl', ogLocale: 'nl_NL', ogAlt: 'en_US',
    parasjaLabel: 'Parasja', navHome: 'Zelf de parasja lezen', navArticles: 'Artikelen',
    back: 'Terug naar de parasjalezingen', missing: 'De uitwerking van deze lezing is nog niet beschikbaar.',
    defaultDesc: 'Lees de parasja en onderzoek de Schrift.',
    indexTitle: 'Alle parasjalezingen', indexDesc: 'Overzicht van alle uitgewerkte lezingen bij de wekelijkse parasja, in de volgorde van de Thora.'
  },
  en: {
    htmlLang: 'en', ogLocale: 'en_US', ogAlt: 'nl_NL',
    parasjaLabel: 'Parashah', navHome: 'Read the parashah yourself', navArticles: 'Articles',
    back: 'Back to the parashah readings', missing: 'The full reading is not yet available.',
    defaultDesc: 'Read the parashah and study the Scriptures.',
    indexTitle: 'All parashah readings', indexDesc: 'Overview of all written readings for the weekly parashah, in the order of the Torah.'
  }
};

function urlFor(lang, slug) {
  return (lang === 'nl' ? '/nl/parasjot/' : '/en/parasjot/') + slug + '/';
}

const STYLE = '<style>body{font:1.12rem/1.7 system-ui,sans-serif;max-width:760px;margin:auto;padding:2rem 1.2rem;color:#202a34}nav{margin-bottom:2rem}a{color:#22547a}h1,h2{line-height:1.25}article{overflow-wrap:anywhere}ul.readings{list-style:none;padding:0}ul.readings li{margin:0 0 1.2rem}ul.readings small{display:block;color:#5a6672}</style>';

function navHtml(lang) {
  const t = L[lang];
  return `<nav><a href="/${lang}/">${t.navHome}</a>${lang === 'nl' ? ` · <a href="/nl/artikelen/">${t.navArticles}</a>` : ''}</nav>`;
}

function renderPage({ lang, slug, d, title, body, desc, summary, nlExists, enExists, lastmod }) {
  const t = L[lang];
  const canonical = site + urlFor(lang, slug);
  const nlUrl = site + urlFor('nl', slug);
  const enUrl = site + urlFor('en', slug);
  const xDefault = nlExists ? nlUrl : enUrl;

  const alts = [];
  if (nlExists) alts.push(`<link rel="alternate" hreflang="nl" href="${nlUrl}">`);
  if (enExists) alts.push(`<link rel="alternate" hreflang="en" href="${enUrl}">`);
  alts.push(`<link rel="alternate" hreflang="x-default" href="${xDefault}">`);

  const jsonld = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: String(title),
    description: desc,
    inLanguage: lang,
    mainEntityOfPage: canonical,
    author: { '@type': 'Person', name: 'Arie Alberts' },
    publisher: { '@type': 'Organization', name: 'Parasja.nl', url: site + '/' },
    ...(d.published_at ? { datePublished: String(d.published_at).slice(0, 10) } : {}),
    ...(d.last_reviewed_at ? { dateModified: String(d.last_reviewed_at).slice(0, 10) } : {})
  }).replaceAll('<', '\\u003c');

  return `<!doctype html><html lang="${t.htmlLang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(pageTitle(lang, d.parasha || slug, title))}</title><meta name="description" content="${esc(desc)}"><link rel="canonical" href="${canonical}">${alts.join('')}<meta property="og:type" content="article"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${site}/assets/share-card.png"><meta property="og:locale" content="${t.ogLocale}"><meta property="og:locale:alternate" content="${t.ogAlt}">${STYLE}<script type="application/ld+json">${jsonld}</script></head><body>${navHtml(lang)}<main><article><header><p>${t.parasjaLabel} ${esc(d.parasha || slug)}</p><h1>${esc(title)}</h1><p>${esc(summary)}</p></header>${body}</article></main><footer><p><a href="/${lang}/parasjot/">${t.back}</a></p></footer></body></html>`;
}

// Torah order: book, then chapter and verse of the first passage (e.g. "Deut.11.26-...").
const BOOKS = ['Gen', 'Exod', 'Lev', 'Num', 'Deut'];
function torahKey(d) {
  const m = String(d.passages?.[0]?.osis || '').match(/^(\w+)\.(\d+)\.(\d+)/);
  if (!m) return [99, 0, 0];
  const b = BOOKS.indexOf(m[1]);
  return [b < 0 ? 98 : b, Number(m[2]), Number(m[3])];
}

function torahSort(entries) {
  return [...entries].sort((a, b) => {
    const x = torahKey(a.d), y = torahKey(b.d);
    return x[0] - y[0] || x[1] - y[1] || x[2] - y[2] || a.slug.localeCompare(b.slug);
  });
}

function renderIndex(lang, entries) {
  const t = L[lang];
  const canonical = site + '/' + lang + '/parasjot/';
  const sorted = torahSort(entries);
  const list = sorted.map(e => {
    const ref = e.d.passages?.[0]?.ref?.[lang];
    return `<li><a href="${urlFor(lang, e.slug)}">${esc(e.title)}</a><small>${esc(e.d.parasha || e.slug)}${ref ? ' · ' + esc(ref) : ''}</small></li>`;
  }).join('');
  return `<!doctype html><html lang="${t.htmlLang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${t.indexTitle} | Parasja.nl</title><meta name="description" content="${esc(t.indexDesc)}"><link rel="canonical" href="${canonical}"><link rel="alternate" hreflang="nl" href="${site}/nl/parasjot/"><link rel="alternate" hreflang="en" href="${site}/en/parasjot/"><link rel="alternate" hreflang="x-default" href="${site}/nl/parasjot/"><meta property="og:type" content="website"><meta property="og:title" content="${t.indexTitle}"><meta property="og:description" content="${esc(t.indexDesc)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${site}/assets/share-card.png"><meta property="og:locale" content="${t.ogLocale}">${STYLE}</head><body>${navHtml(lang)}<main><h1>${t.indexTitle}</h1><p>${esc(t.indexDesc)}</p><ul class="readings">${list}</ul></main><footer><p><a href="/${lang}/">${t.navHome}</a></p></footer></body></html>`;
}

const published = { nl: [], en: [] };

for (const name of fs.readdirSync(sourceDir).filter(x => x.endsWith('.md'))) {
  const raw = fs.readFileSync(path.join(sourceDir, name), 'utf8').replace(/^﻿/, '');
  const match = raw.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/);
  if (!match) continue;
  const d = yaml.load(match[1]) || {};
  if (d.status === 'draft' || (d.status && d.status !== 'published')) continue;

  const slug = String(d.id || path.basename(name, '.md')).toLowerCase();
  if (!/^[a-z0-9-]+$/.test(slug)) throw new Error('Ongeldige parasja slug: ' + slug);

  const bodyNl = (d.body_nl || '').trim();
  const bodyEn = (d.body_en || '').trim();
  const nlExists = !!bodyNl;
  const enExists = !!bodyEn;
  const lastmod = d.last_reviewed_at ? String(d.last_reviewed_at).slice(0, 10) : (d.published_at ? String(d.published_at).slice(0, 10) : null);

  // No language-fallback: only build a page when that language's body is filled.
  if (nlExists) {
    const title = d.title_nl || d.label?.nl || d.parasha || slug;
    const summary = text(d.summary_nl || L.nl.defaultDesc);
    const desc = metaDescription(d.meta_description_nl || d.summary_nl || bodyNl || L.nl.defaultDesc);
    const dir = path.join(publicDir, 'nl', 'parasjot', slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), renderPage({ lang: 'nl', slug, d, title, body: bodyNl, desc, summary, nlExists, enExists, lastmod }));
    add(urlFor('nl', slug), '0.8', lastmod);
    published.nl.push({ slug, d, title, desc });
  }
  if (enExists) {
    const title = d.title_en || d.label?.en || d.parasha || slug;
    const summary = text(d.summary_en || L.en.defaultDesc);
    const desc = metaDescription(d.meta_description_en || d.summary_en || bodyEn || L.en.defaultDesc);
    const dir = path.join(publicDir, 'en', 'parasjot', slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), renderPage({ lang: 'en', slug, d, title, body: bodyEn, desc, summary, nlExists, enExists, lastmod }));
    add(urlFor('en', slug), '0.8', lastmod);
    published.en.push({ slug, d, title, desc });
  }
}

// Overview pages: the crawlable entry point from the homepage to every reading.
for (const lang of ['nl', 'en']) {
  const dir = path.join(publicDir, lang, 'parasjot');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), renderIndex(lang, published[lang]));
}

// Pick up pre-built article pages (nl + en) for the sitemap.
for (const lang of ['nl', 'en']) {
  const articleRoot = path.join(publicDir, lang, 'artikelen');
  if (!fs.existsSync(articleRoot)) continue;
  const walk = dir => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name === 'index.html') {
        const rel = path.relative(publicDir, dir).split(path.sep).join('/');
        add('/' + rel + '/', '0.6');
      }
    }
  };
  walk(articleRoot);
}

const unique = [...new Map(items.map(x => [x.url, x])).values()];
const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n' +
  unique.map(x => `  <url><loc>${site + x.url}</loc>${x.lastmod ? `<lastmod>${x.lastmod}</lastmod>` : ''}<priority>${x.priority}</priority></url>`).join('\n') +
  '\n</urlset>\n';
fs.writeFileSync(path.join(publicDir, 'sitemap.xml'), xml);
fs.writeFileSync(path.join(publicDir, 'robots.txt'), 'User-agent: *\nAllow: /\nSitemap: https://www.parasja.nl/sitemap.xml\n');

// llms.txt (llmstxt.org): a plain-text map of the site for AI assistants.
const llmsSection = (heading, lang) => `## ${heading}\n\n` + torahSort(published[lang]).map(e => {
  const ref = e.d.passages?.[0]?.ref?.[lang];
  return `- [${text(e.title)} – ${text(e.d.parasha || e.slug)}](${site + urlFor(lang, e.slug)})${ref ? ' (' + ref + ')' : ''}: ${e.desc}`;
}).join('\n') + '\n';
const llms = `# Parasja.nl – Zelf de parasja lezen / Read the parashah yourself

> Bilingual (Dutch/English) study site for the weekly Torah portion (parashah) by Arie Alberts. Each reading explains the parashah with Scripture references (Statenvertaling / KJV), Hebrew background and connections to the rest of the Bible, following the Frame Method.

Dutch pages live under /nl/, English pages under /en/. Every page is static HTML; the full list of URLs is in ${site}/sitemap.xml.

- [Overzicht parasjalezingen (NL)](${site}/nl/parasjot/)
- [Overview of parashah readings (EN)](${site}/en/parasjot/)
- [Artikelen (NL)](${site}/nl/artikelen/)
- [Handleiding (NL)](${site}/nl/handleiding.html)
- [Handbook (EN)](${site}/en/handbook.html)

` + llmsSection('Parasjalezingen (Nederlands)', 'nl') + '\n' + llmsSection('Parashah readings (English)', 'en');
fs.writeFileSync(path.join(publicDir, 'llms.txt'), llms);

const nlCount = unique.filter(x => x.url.startsWith('/nl/parasjot/') && x.url !== '/nl/parasjot/').length;
const enCount = unique.filter(x => x.url.startsWith('/en/parasjot/') && x.url !== '/en/parasjot/').length;
console.log(`SEO: ${unique.length} URLs (${nlCount} NL + ${enCount} EN parasja pages), sitemap.xml + robots.txt + llms.txt written.`);
