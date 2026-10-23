// Post-build step: turn each parashah into a real page of the app.
//
// The site is a React app whose interactive layout (Bible reader + the "make your
// own reading and notes" worksheet) only exists on the app pages. Search engines,
// however, index per-parashah URLs. This script makes those URLs BE the app for that
// parashah: it reuses the exact hashed assets Vite just built, pre-renders the reading
// for crawlers, and deep-links the app to the right parashah via `window.__PARASJA__`.
// One whole — and every newly uploaded reading flows through automatically.
//
// Runs AFTER `vite build`, operating on dist/.

import fs from 'node:fs';
import path from 'node:path';
import { findScheduledStudy, toIsoDate } from '../src/utils/weekly-parasha.js';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const yaml = require('js-yaml');

const root = process.cwd();
const distDir = path.join(root, 'dist');
const sourceDir = path.join(root, 'content', 'parasjot');
const site = 'https://www.parasja.nl';

const esc = v => String(v ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const text = v => String(v ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

// Meta description for search results: whole sentences that fit `max`, never mid-word.
function metaDescription(source, max = 160) {
  const s = text(source);
  if (s.length <= max) return s;
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

// <title> leads with the terms people search for: "Parasja Noach" in Dutch,
// "Parsha Noach (Torah portion)" in English.
function pageTitle(lang, parasha, title) {
  const label = lang === 'nl' ? 'Parasja' : 'Parsha';
  const name = lang === 'nl' ? `${label} ${parasha}` : `${label} ${parasha} (Torah portion)`;
  const head = String(title).toLowerCase().includes(String(parasha).toLowerCase())
    ? name
    : `${name}: ${title}`;
  return `${head} | Parasja.nl`;
}

const L = {
  nl: { ogLocale: 'nl_NL', ogAlt: 'en_US', skip: 'Naar de inhoud', parasjaLabel: 'Parasja',
        navHome: 'Zelf de parasja lezen',
        indexTitle: 'Alle parasjalezingen', indexDesc: 'Overzicht van alle uitgewerkte lezingen bij de wekelijkse parasja, in de volgorde van de Thora.',
        indexHeadTitle: 'Parasja van deze week en alle parasjalezingen',
        indexMetaDesc: 'De parasja van deze week en alle uitgewerkte lezingen bij de wekelijkse Thoralezing, met haftara, uitleg en werkblad om zelf te lezen.',
        thisWeek: 'Parasja van deze week', torahLabel: 'Thora',
        defaultDesc: 'Lees de parasja en onderzoek de Schrift.' },
  en: { ogLocale: 'en_US', ogAlt: 'nl_NL', skip: 'Skip to content', parasjaLabel: 'Parashah',
        navHome: 'Read the parashah yourself',
        indexTitle: 'All parashah readings', indexDesc: 'Overview of all written readings for the weekly parashah, in the order of the Torah.',
        indexHeadTitle: "This Week's Torah Portion (Parsha) and All Readings",
        indexMetaDesc: "This week's Torah portion and every written reading for the weekly parsha (parashat hashavua), with haftarah, explanation and a worksheet to study it yourself.",
        thisWeek: "This week's Torah portion", torahLabel: 'Torah portion',
        defaultDesc: 'Read the parashah and study the Scriptures.' } };

const urlFor = (lang, slug) => (lang === 'nl' ? '/nl/parasjot/' : '/en/parasjot/') + slug + '/';

// Extract the exact hashed asset tags Vite emitted on the built homepage, so the
// parashah pages load the identical CSS/JS. Depth is rewritten because these pages
// live two folders deeper than /{lang}/index.html.
function assetsFromHome(lang, depthPrefix) {
  const home = fs.readFileSync(path.join(distDir, lang, 'index.html'), 'utf8');
  const links = [...home.matchAll(/<link\b[^>]*href="\.\.\/assets\/[^"]*"[^>]*>/g)].map(m => m[0]);
  const scripts = [...home.matchAll(/<script\b[^>]*src="\.\.\/assets\/[^"]*"[^>]*>\s*<\/script>/g)].map(m => m[0]);
  const fix = tag => tag.replaceAll('../assets/', depthPrefix + 'assets/');
  return { links: links.map(fix).join(''), scripts: scripts.map(fix).join('') };
}

function headSeo({ lang, slug, d, title, desc, nlExists, enExists }) {
  const canonical = site + urlFor(lang, slug);
  const nlUrl = site + urlFor('nl', slug);
  const enUrl = site + urlFor('en', slug);
  const xDefault = nlExists ? nlUrl : enUrl;
  const alts = [];
  if (nlExists) alts.push(`<link rel="alternate" hreflang="nl" href="${nlUrl}">`);
  if (enExists) alts.push(`<link rel="alternate" hreflang="en" href="${enUrl}">`);
  alts.push(`<link rel="alternate" hreflang="x-default" href="${xDefault}">`);
  const jsonld = JSON.stringify({
    '@context': 'https://schema.org', '@type': 'Article',
    headline: String(title), description: desc, inLanguage: lang,
    mainEntityOfPage: canonical,
    author: { '@type': 'Person', name: 'Arie Alberts' },
    publisher: { '@type': 'Organization', name: 'Parasja.nl', url: site + '/' },
    ...(d.published_at ? { datePublished: toIsoDate(d.published_at) } : {}),
    ...(d.last_reviewed_at ? { dateModified: toIsoDate(d.last_reviewed_at) } : {})
  }).replaceAll('<', '\\u003c');
  const t = L[lang];
  return `<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">`
    + `<title>${esc(pageTitle(lang, d.parasha || slug, title))}</title>`
    + `<meta name="description" content="${esc(desc)}">`
    + `<link rel="canonical" href="${canonical}">${alts.join('')}`
    + `<meta property="og:type" content="article"><meta property="og:title" content="${esc(title)}">`
    + `<meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${canonical}">`
    + `<meta property="og:image" content="${site}/assets/share-card.png">`
    + `<meta property="og:locale" content="${t.ogLocale}"><meta property="og:locale:alternate" content="${t.ogAlt}">`
    + `<meta name="twitter:card" content="summary_large_image"><meta name="twitter:title" content="${esc(title)}">`
    + `<meta name="twitter:description" content="${esc(desc)}"><meta name="twitter:image" content="${site}/assets/share-card.png">`
    + `<script type="application/ld+json">${jsonld}</script>`;
}

// The parashah page: the app shell, deep-linked to this reading, with the reading
// pre-rendered inside the worksheet mount as crawlable fallback (React replaces it on mount).
function renderParashaPage({ lang, slug, d, title, summary, desc, body, nlExists, enExists }) {
  const t = L[lang];
  const { links, scripts } = assetsFromHome(lang, '../../../');
  const torahRef = d.passages?.find(p => p.role === 'parasha')?.ref?.[lang];
  const seoArticle = `<article class="seo-prerender"><header><p>${t.parasjaLabel} ${esc(d.parasha || slug)}${torahRef ? ` · ${t.torahLabel}: ${esc(torahRef)}` : ''}</p>`
    + `<h1>${esc(title)}</h1><p>${esc(summary)}</p></header>${body}</article>`;
  const config = `<script>window.__PARASJA__={study:${JSON.stringify(slug)},view:"worksheet"};</script>`;
  return `<!doctype html><html lang="${lang}"><head>${headSeo({ lang, slug, d, title, desc, nlExists, enExists })}`
    + links + config + `</head><body>`
    + `<a class="skip-link" href="#main">${t.skip}</a>`
    + `<main id="main" tabindex="-1"><div id="dc-root"><div><div class="u-57ce87aa9f">`
    + `<div id="react-navbar-root"></div><div id="react-intro-root"></div>`
    + `<div class="view-panel worksheet-view" id="werkblad">`
    + `<div id="react-worksheet-hero-root">${seoArticle}</div>`
    + `<div id="react-bible-reader-root"></div>`
    + `</div></div></div></div></main>${scripts}</body></html>`;
}

// Torah order for the overview + sitemap.
const BOOKS = ['Gen', 'Exod', 'Lev', 'Num', 'Deut'];
function torahKey(d) {
  const m = String(d.passages?.[0]?.osis || '').match(/^(\w+)\.(\d+)\.(\d+)/);
  if (!m) return [99, 0, 0];
  const b = BOOKS.indexOf(m[1]);
  return [b < 0 ? 98 : b, Number(m[2]), Number(m[3])];
}
const torahSort = entries => [...entries].sort((a, b) => {
  const x = torahKey(a.d), y = torahKey(b.d);
  return x[0] - y[0] || x[1] - y[1] || x[2] - y[2] || a.slug.localeCompare(b.slug);
});

const OVERVIEW_STYLE = '<style>body{font:1.12rem/1.7 system-ui,sans-serif;max-width:760px;margin:auto;padding:2rem 1.2rem;color:#202a34}nav{margin-bottom:2rem}a{color:#22547a}h1{line-height:1.25}ul.readings{list-style:none;padding:0}ul.readings li{margin:0 0 1.2rem}ul.readings small{display:block;color:#5a6672}.this-week{border-left:4px solid #8a4a1f;background:#f6efe6;padding:.8rem 1.1rem;margin:0 0 2rem}.this-week h2{font-size:1rem;margin:0 0 .3rem;text-transform:uppercase;letter-spacing:.04em;color:#8a4a1f}.this-week p{margin:0;font-size:1.2rem}.this-week small{display:block;color:#5a6672;font-size:.95rem}</style>';

// Match the actual Shabbat date stored in the reading's frontmatter.
// If the next Shabbat has no published reading, show no "this week" box.
function currentReading(entries, now = new Date()) {
  return findScheduledStudy(entries, now, entry => entry.d);
}

function renderOverview(lang, entries) {
  const t = L[lang];
  const cur = currentReading(entries);
  // Never promise a current reading in search snippets when none was published.
  const overviewTitle = cur ? t.indexHeadTitle : t.indexTitle;
  const overviewDescription = cur ? t.indexMetaDesc : t.indexDesc;
  const curRef = cur?.d.passages?.find(p => p.role === 'parasha')?.ref?.[lang];
  const thisWeek = cur
    ? `<section class="this-week"><h2>${t.thisWeek}</h2><p><a href="${urlFor(lang, cur.slug)}">${esc(cur.d.parasha || cur.slug)}: ${esc(cur.title)}</a>${curRef ? `<small>${t.torahLabel}: ${esc(curRef)}</small>` : ''}</p></section>`
    : '';
  const canonical = site + '/' + lang + '/parasjot/';
  const { links } = assetsFromHome(lang, '../../');
  const list = torahSort(entries).map(e => {
    const ref = e.d.passages?.[0]?.ref?.[lang];
    return `<li><a href="${urlFor(lang, e.slug)}">${esc(e.title)}</a><small>${esc(e.d.parasha || e.slug)}${ref ? ' · ' + esc(ref) : ''}</small></li>`;
  }).join('');
  return `<!doctype html><html lang="${lang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">`
    + `<title>${esc(overviewTitle)} | Parasja.nl</title><meta name="description" content="${esc(overviewDescription)}">`
    + `<link rel="canonical" href="${canonical}">`
    + `<link rel="alternate" hreflang="nl" href="${site}/nl/parasjot/"><link rel="alternate" hreflang="en" href="${site}/en/parasjot/"><link rel="alternate" hreflang="x-default" href="${site}/nl/parasjot/">`
    + `<meta property="og:type" content="website"><meta property="og:title" content="${esc(overviewTitle)}"><meta property="og:description" content="${esc(overviewDescription)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${site}/assets/share-card.png">`
    + links + OVERVIEW_STYLE + `</head><body>`
    + `<nav><a href="/${lang}/">${t.navHome}</a></nav>`
    + `<main><h1>${t.indexTitle}</h1>${thisWeek}<p>${esc(t.indexDesc)}</p><ul class="readings">${list}</ul></main>`
    + `<footer><p><a href="/${lang}/">${t.navHome}</a></p></footer></body></html>`;
}

// --- Walk the content and write the pages ---------------------------------

const published = { nl: [], en: [] };
const items = [];
const add = (url, priority = '0.5', lastmod = null) => items.push({ url, priority, lastmod });
// Every important static page must be discoverable, not just the dynamic readings.
// Confirmation pages, feedback redirects and admin pages intentionally stay out.
const staticPages = [
  '/', '/nl/', '/en/',
  '/nl/lezer.html', '/en/reader.html',
  '/nl/handleiding.html', '/en/handbook.html',
  '/nl/contact.html', '/en/contact.html',
  '/nl/privacy.html', '/en/privacy.html',
  '/nl/artikelen/', '/nl/parasjot/', '/en/parasjot/'
];
staticPages.forEach(url => add(url, url === '/nl/' ? '1.0' : '0.6'));

for (const name of fs.readdirSync(sourceDir).filter(x => x.endsWith('.md'))) {
  const raw = fs.readFileSync(path.join(sourceDir, name), 'utf8').replace(/^﻿/, '');
  const match = raw.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/);
  if (!match) continue;
  const d = yaml.load(match[1]) || {};
  if (d.status && d.status !== 'published') continue;

  const slug = String(d.id || path.basename(name, '.md')).toLowerCase();
  if (!/^[a-z0-9-]+$/.test(slug)) throw new Error('Ongeldige parasja slug: ' + slug);

  const bodyNl = (d.body_nl || '').trim();
  const bodyEn = (d.body_en || '').trim();
  const nlExists = !!bodyNl;
  const enExists = !!bodyEn;
  const lastmod = d.last_reviewed_at ? toIsoDate(d.last_reviewed_at) : (d.published_at ? toIsoDate(d.published_at) : null);

  for (const [lang, bodyExists, body] of [['nl', nlExists, bodyNl], ['en', enExists, bodyEn]]) {
    if (!bodyExists) continue; // strict: no language fallback
    const title = (lang === 'nl' ? (d.title_nl || d.label?.nl) : (d.title_en || d.label?.en)) || d.parasha || slug;
    const summary = text((lang === 'nl' ? d.summary_nl : d.summary_en) || L[lang].defaultDesc);
    const desc = metaDescription((lang === 'nl' ? (d.meta_description_nl || d.summary_nl) : (d.meta_description_en || d.summary_en)) || body || L[lang].defaultDesc);
    const dir = path.join(distDir, lang, 'parasjot', slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), renderParashaPage({ lang, slug, d, title, summary, desc, body, nlExists, enExists }));
    add(urlFor(lang, slug), '0.8', lastmod);
    published[lang].push({ slug, d, title, desc });
  }
}

// Overview pages
for (const lang of ['nl', 'en']) {
  const dir = path.join(distDir, lang, 'parasjot');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'index.html'), renderOverview(lang, published[lang]));
}

// Article pages (built earlier into dist) for the sitemap.
for (const lang of ['nl', 'en']) {
  const articleRoot = path.join(distDir, lang, 'artikelen');
  if (!fs.existsSync(articleRoot)) continue;
  const walk = dir => {
    for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
      const p = path.join(dir, e.name);
      if (e.isDirectory()) walk(p);
      else if (e.name === 'index.html') add('/' + path.relative(distDir, dir).split(path.sep).join('/') + '/', '0.6');
    }
  };
  walk(articleRoot);
}

const unique = [...new Map(items.map(x => [x.url, x])).values()];
const xml = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'
  + unique.map(x => `  <url><loc>${site + x.url}</loc>${x.lastmod ? `<lastmod>${x.lastmod}</lastmod>` : ''}<priority>${x.priority}</priority></url>`).join('\n')
  + '\n</urlset>\n';
fs.writeFileSync(path.join(distDir, 'sitemap.xml'), xml);
fs.writeFileSync(path.join(distDir, 'robots.txt'), 'User-agent: *\nAllow: /\nSitemap: https://www.parasja.nl/sitemap.xml\n');

const llmsSection = (heading, lang) => `## ${heading}\n\n` + torahSort(published[lang]).map(e => {
  const ref = e.d.passages?.[0]?.ref?.[lang];
  return `- [${text(e.title)} – ${text(e.d.parasha || e.slug)}](${site + urlFor(lang, e.slug)})${ref ? ' (' + ref + ')' : ''}: ${e.desc}`;
}).join('\n') + '\n';
const llms = `# Parasja.nl – Zelf de parasja lezen / Read the parashah yourself

> Bilingual (Dutch/English) study site for the weekly Torah portion (parashah) by Arie Alberts. Each reading explains the parashah with Scripture references (Statenvertaling / KJV), Hebrew background and connections to the rest of the Bible, following the Frame Method.

Dutch pages live under /nl/, English pages under /en/. Each parashah page is the app itself (Bible reader plus a worksheet for your own reading and notes); the full list of URLs is in ${site}/sitemap.xml.

- [Overzicht parasjalezingen (NL)](${site}/nl/parasjot/)
- [Overview of parashah readings (EN)](${site}/en/parasjot/)

` + llmsSection('Parasjalezingen (Nederlands)', 'nl') + '\n' + llmsSection('Parashah readings (English)', 'en');
fs.writeFileSync(path.join(distDir, 'llms.txt'), llms);

const nlCount = published.nl.length, enCount = published.en.length;
console.log(`Parasja app-pages: ${nlCount} NL + ${enCount} EN (+ overviews), sitemap.xml + robots.txt + llms.txt written to dist/.`);
