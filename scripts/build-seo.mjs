import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const yaml = require('js-yaml');

const root = process.cwd();
const publicDir = path.join(root, 'public');
const sourceDir = path.join(root, 'content', 'parasjot');
const site = 'https://parasja.nl';

const esc = v => String(v ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;');
const text = v => String(v ?? '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();

const items = [];
const add = (url, priority = '0.5', lastmod = null) => items.push({ url, priority, lastmod });

// Fixed routes that exist after the full build (articles/assets run before this script).
const fixed = ['/', '/nl/', '/en/', '/nl/artikelen/'];
fixed.forEach(x => add(x, x === '/nl/' ? '1.0' : '0.6'));

// Per-language copy for the standalone pages.
const L = {
  nl: {
    htmlLang: 'nl', ogLocale: 'nl_NL', ogAlt: 'en_US',
    parasjaLabel: 'Parasja', navHome: 'Zelf de parasja lezen', navArticles: 'Artikelen',
    back: 'Terug naar de parasjalezingen', missing: 'De uitwerking van deze lezing is nog niet beschikbaar.',
    defaultDesc: 'Lees de parasja en onderzoek de Schrift.'
  },
  en: {
    htmlLang: 'en', ogLocale: 'en_US', ogAlt: 'nl_NL',
    parasjaLabel: 'Parashah', navHome: 'Read the parashah yourself', navArticles: 'Articles',
    back: 'Back to the parashah readings', missing: 'The full reading is not yet available.',
    defaultDesc: 'Read the parashah and study the Scriptures.'
  }
};

function urlFor(lang, slug) {
  return (lang === 'nl' ? '/nl/parasjot/' : '/en/parasjot/') + slug + '/';
}

function renderPage({ lang, slug, d, title, body, desc, nlExists, enExists, lastmod }) {
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

  return `<!doctype html><html lang="${t.htmlLang}"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(title)} – ${esc(d.parasha || slug)} | Parasja.nl</title><meta name="description" content="${esc(desc)}"><link rel="canonical" href="${canonical}">${alts.join('')}<meta property="og:type" content="article"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${site}/assets/share-card.png"><meta property="og:locale" content="${t.ogLocale}"><meta property="og:locale:alternate" content="${t.ogAlt}"><style>body{font:1.12rem/1.7 system-ui,sans-serif;max-width:760px;margin:auto;padding:2rem 1.2rem;color:#202a34}nav{margin-bottom:2rem}a{color:#22547a}h1,h2{line-height:1.25}article{overflow-wrap:anywhere}</style><script type="application/ld+json">${jsonld}</script></head><body><nav><a href="/${lang}/">${t.navHome}</a>${lang === "nl" ? ` · <a href="/nl/artikelen/">${t.navArticles}</a>` : ""}</nav><main><article><header><p>${t.parasjaLabel} ${esc(d.parasha || slug)}</p><h1>${esc(title)}</h1><p>${esc(desc)}</p></header>${body}</article></main><footer><p><a href="/${lang}/">${t.back}</a></p></footer></body></html>`;
}

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
    const desc = text(d.summary_nl || bodyNl || L.nl.defaultDesc).slice(0, 175);
    const dir = path.join(publicDir, 'nl', 'parasjot', slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), renderPage({ lang: 'nl', slug, d, title, body: bodyNl, desc, nlExists, enExists, lastmod }));
    add(urlFor('nl', slug), '0.8', lastmod);
  }
  if (enExists) {
    const title = d.title_en || d.label?.en || d.parasha || slug;
    const desc = text(d.summary_en || bodyEn || L.en.defaultDesc).slice(0, 175);
    const dir = path.join(publicDir, 'en', 'parasjot', slug);
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(path.join(dir, 'index.html'), renderPage({ lang: 'en', slug, d, title, body: bodyEn, desc, nlExists, enExists, lastmod }));
    add(urlFor('en', slug), '0.8', lastmod);
  }
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
fs.writeFileSync(path.join(publicDir, 'robots.txt'), 'User-agent: *\nAllow: /\nSitemap: https://parasja.nl/sitemap.xml\n');

const nlCount = unique.filter(x => x.url.startsWith('/nl/parasjot/')).length;
const enCount = unique.filter(x => x.url.startsWith('/en/parasjot/')).length;
console.log(`SEO: ${unique.length} URLs (${nlCount} NL + ${enCount} EN parasja pages), sitemap.xml + robots.txt written.`);
