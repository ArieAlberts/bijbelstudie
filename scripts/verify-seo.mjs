import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { findScheduledStudy, upcomingShabbatIso } from '../src/utils/weekly-parasha.js';

const root = path.resolve('dist');
const site = 'https://www.parasja.nl';
const requiredFiles = ['index.html', 'nl/index.html', 'en/index.html', 'sitemap.xml',
  'robots.txt', 'llms.txt', 'e0995e195501bfb5d3b5908638a230f0.txt'];
for (const name of requiredFiles) {
  assert.ok(fs.existsSync(path.join(root, name)), 'Missing build output: ' + name);
}

// Dates must come from the actual Shabbat schedule, not the CMS publication date.
assert.equal(upcomingShabbatIso(new Date('2026-10-23T16:00:00Z')), '2026-10-24');
assert.equal(upcomingShabbatIso(new Date('2026-10-24T16:00:00Z')), '2026-10-24');
assert.equal(upcomingShabbatIso(new Date('2026-10-25T12:00:00Z')), '2026-10-31');
const fixtures = [
  { id: 'noach', published_at: '2026-10-17', shabbat_date: '2026-10-17' },
  { id: 'lech-lecha', published_at: '2026-10-18', shabbat_date: '2026-10-24' },
  { id: 'undated', published_at: '2026-10-24' }
];
assert.equal(findScheduledStudy(fixtures, new Date('2026-10-23T12:00:00Z'))?.id, 'lech-lecha');
assert.equal(findScheduledStudy(fixtures, new Date('2026-10-26T12:00:00Z')), null);
assert.equal(findScheduledStudy([{ id: 'yaml-date', shabbat_date: new Date('2026-10-24T00:00:00Z') }],
  new Date('2026-10-23T12:00:00Z'))?.id, 'yaml-date');

const xml = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
assert.match(xml, /<urlset\b/, 'Invalid sitemap document');
const sitemapUrls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map(match => match[1]);
assert.equal(new Set(sitemapUrls).size, sitemapUrls.length, 'Duplicate sitemap URL');
for (const match of xml.matchAll(/<lastmod>([^<]+)<\/lastmod>/g)) {
  assert.match(match[1], /^\d{4}-\d{2}-\d{2}$/, 'Sitemap lastmod must be ISO date');
}
const urls = new Set(sitemapUrls);
const staticRoutes = [
  '/', '/nl/', '/en/',
  '/nl/lezer.html', '/en/reader.html',
  '/nl/handleiding.html', '/en/handbook.html',
  '/nl/contact.html', '/en/contact.html',
  '/nl/privacy.html', '/en/privacy.html',
  '/nl/parasjot/', '/en/parasjot/',
  '/nl/artikelen/', '/en/artikelen/'
];
for (const route of staticRoutes) {
  assert.ok(urls.has(site + route), 'Important static URL missing from sitemap: ' + route);
}

// Every published reading, article, series and overview must be in the sitemap.
// Admin, confirmation and meta-refresh feedback redirects are intentionally excluded.
function walkHtml(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap(entry => {
    const full = path.join(dir, entry.name);
    return entry.isDirectory() ? walkHtml(full) : entry.name.endsWith('.html') ? [full] : [];
  });
}
function relativeToRoute(file) {
  const rel = path.relative(root, file).split(path.sep).join('/');
  if (rel === 'index.html') return '/';
  if (rel.endsWith('/index.html')) return '/' + rel.slice(0, -'index.html'.length);
  return '/' + rel;
}
const indexableFiles = new Set(staticRoutes.map(route =>
  path.join(root, route.slice(1), route.endsWith('/') ? 'index.html' : '')
));
for (const lang of ['nl', 'en']) {
  for (const section of ['parasjot', 'artikelen']) {
    for (const file of walkHtml(path.join(root, lang, section))) indexableFiles.add(file);
  }
}
for (const file of indexableFiles) {
  assert.ok(fs.existsSync(file), 'Expected indexable HTML missing: ' + file);
  const route = relativeToRoute(file);
  assert.ok(urls.has(site + route), 'Indexable page absent from sitemap: ' + route);
}
function sitemapFile(url) {
  const parsed = new URL(url);
  assert.equal(parsed.origin, site, 'Unexpected host in sitemap: ' + url);
  assert.ok(!parsed.search && !parsed.hash, 'Sitemap contains query/fragment: ' + url);
  return path.join(root, parsed.pathname.slice(1), parsed.pathname.endsWith('/') ? 'index.html' : '');
}
for (const url of urls) {
  assert.ok(fs.existsSync(sitemapFile(url)), 'Sitemap references missing page: ' + url);
}

function getAttributes(tag) {
  return Object.fromEntries([...tag.matchAll(/([:\w-]+)\s*=\s*(["'])(.*?)\2/g)]
    .map(m => [m[1].toLowerCase(), m[3]]));
}
function tagAttrs(head, tagName) {
  return [...head.matchAll(new RegExp('<' + tagName + '\\b[^>]*>', 'gi'))]
    .map(m => getAttributes(m[0]));
}
const pages = new Map();
for (const url of urls) {
  const file = sitemapFile(url);
  const html = fs.readFileSync(file, 'utf8');
  const route = new URL(url).pathname;
  const head = html.match(/<head\b[^>]*>([\s\S]*?)<\/head>/i)?.[1];
  assert.ok(head, 'Missing head: ' + route);
  const titleTags = [...head.matchAll(/<title\b[^>]*>([\s\S]*?)<\/title>/gi)];
  assert.equal(titleTags.length, 1, 'Expected exactly one title: ' + route);
  assert.ok(titleTags[0][1].replace(/<[^>]+>/g, '').trim().length >= 8,
    'Missing or very short title: ' + route);
  const metas = tagAttrs(head, 'meta');
  const descriptions = metas.filter(tag => tag.name?.toLowerCase() === 'description');
  assert.equal(descriptions.length, 1, 'Expected one meta-description: ' + route);
  assert.ok((descriptions[0].content || '').trim().length >= 20,
    'Empty or very short meta-description: ' + route);
  const links = tagAttrs(head, 'link');
  const canonicals = links.filter(tag => tag.rel?.toLowerCase() === 'canonical');
  assert.equal(canonicals.length, 1, 'Expected one canonical: ' + route);
  assert.equal(canonicals[0].href, url, 'Canonical must match sitemap URL: ' + route);

  const language = html.match(/<html\b[^>]*\blang=(["'])(.*?)\1/i)?.[2];
  if (route.startsWith('/nl/')) assert.equal(language, 'nl', 'Wrong html lang: ' + route);
  if (route.startsWith('/en/')) assert.equal(language, 'en', 'Wrong html lang: ' + route);
  const h1Count = (html.match(/<h1\b/gi) || []).length;
  assert.ok(h1Count >= 1, 'Missing H1: ' + route);
  // App homepages have multiple client-side views in their source HTML;
  // all standalone/editorial pages must have precisely one H1.
  if (route !== '/' && route !== '/nl/' && route !== '/en/') {
    assert.equal(h1Count, 1, 'Expected exactly one H1: ' + route);
  }

  const alternatives = new Map();
  for (const tag of links.filter(tag => tag.rel?.toLowerCase() === 'alternate' && tag.hreflang)) {
    const lang = tag.hreflang.toLowerCase();
    assert.ok(['nl', 'en', 'x-default'].includes(lang), 'Unexpected hreflang: ' + route);
    assert.ok(!alternatives.has(lang), 'Duplicate hreflang ' + lang + ': ' + route);
    assert.ok(urls.has(tag.href), 'Hreflang destination not in sitemap: ' + tag.href);
    alternatives.set(lang, tag.href);
  }
  assert.ok(alternatives.has('x-default'), 'Missing x-default hreflang: ' + route);
  // The bilingual language gateway at / deliberately points to /nl/ and /en/.
  if (route !== '/' && (language === 'nl' || language === 'en')) {
    assert.equal(alternatives.get(language), url, 'Missing or incorrect self hreflang: ' + route);
  }
  pages.set(url, { route, alternatives, language });
}
// NL/EN hreflang pairs must reference one another in both directions.
for (const [url, page] of pages) {
  for (const lang of ['nl', 'en']) {
    const target = page.alternatives.get(lang);
    if (!target || target === url || url === site + '/') continue;
    const other = pages.get(target);
    assert.ok(other, 'Missing reciprocal page for ' + page.route);
    if (page.language === 'nl' || page.language === 'en') {
      assert.equal(other.alternatives.get(page.language), url,
        'Non-reciprocal ' + lang + ' hreflang: ' + page.route);
    }
  }
}
const robots = fs.readFileSync(path.join(root, 'robots.txt'), 'utf8');
assert.ok(robots.includes('Sitemap: ' + site + '/sitemap.xml'),
  'robots.txt must advertise the canonical sitemap');
// Wajera release checks: both indexed pages and all document downloads must exist.
for (const [lang, name] of [['nl', 'Wajera'], ['en', 'Vayera']]) {
  const route = `/${lang}/parasjot/vayera/`;
  const url = site + route;
  assert.ok(urls.has(url), 'Wajera missing from sitemap: ' + route);
  const html = fs.readFileSync(sitemapFile(url), 'utf8');
  assert.ok(html.includes(`Par${lang === 'nl' ? 'asja' : 'sha'} ${name}`),
    'Wajera language-specific SEO title missing: ' + route);
  assert.ok(html.includes('Genesis 18:1'), 'Missing Torah reference in reading: ' + route);
  for (const dir of ['lezingen', 'studiebladen', 'werkbladen']) {
    for (const ext of ['pdf', 'docx']) {
      const filename = `downloads/${dir}/vayera-${lang}.${ext}`;
      assert.ok(fs.existsSync(path.join(root, filename)),
        'Wajera download missing: ' + filename);
    }
  }
}
console.log('SEO build verified:', urls.size, 'sitemap URLs; title, description, canonical, headings, hreflang and sitemap coverage OK');
