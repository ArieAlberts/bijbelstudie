import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import { findScheduledStudy, upcomingShabbatIso } from '../src/utils/weekly-parasha.js';
import { viewFromLocation, languageDestination } from '../src/utils/site-navigation.js';

const root = path.resolve('dist');
const site = 'https://www.parasja.nl';
const requiredFiles = ['index.html', 'nl/index.html', 'en/index.html', 'sitemap.xml',
  'robots.txt', 'llms.txt', '404.html', 'e0995e195501bfb5d3b5908638a230f0.txt'];
for (const name of requiredFiles) {
  assert.ok(fs.existsSync(path.join(root, name)), 'Missing build output: ' + name);
}

// Deep-linked English method views must open the method, and handbook step
// links must open the worksheet. A language switch keeps the matching study.
for (const hash of ['#method', '#explanation', '#example', '#appendices', '#methode']) {
  assert.equal(viewFromLocation(hash, '/en/'), 'method');
}
assert.equal(viewFromLocation('#stap-9', '/nl/'), 'worksheet');
assert.equal(viewFromLocation('#snel-2', '/en/'), 'worksheet');
assert.equal(viewFromLocation('', '/nl/parasjot/noach/', 'worksheet'), 'worksheet');
assert.equal(languageDestination('https://www.parasja.nl/en/parasjot/noach/', 'en', '?mode=study', '#werkblad'),
  '/en/parasjot/noach/?mode=study#worksheet');
assert.equal(languageDestination('https://www.parasja.nl/nl/handleiding.html', 'nl', '', '#hoofdstuk-4'),
  '/nl/handleiding.html#hoofdstuk-4');
assert.equal(languageDestination(null, 'nl'), '/nl/');

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

  // All structured-data blocks must remain parseable after content injection.
  for (const match of html.matchAll(/<script\b[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)) {
    assert.doesNotThrow(() => JSON.parse(match[1]), 'Invalid JSON-LD: ' + route);
  }
  if (/^\/(nl|en)\/parasjot\/[^/]+\/$/.test(route)) {
    assert.match(html, /<nav class="reading-breadcrumbs"/, 'Reading breadcrumb missing: ' + route);
    assert.match(html, /<aside class="reading-resources"/, 'Reading resources missing: ' + route);
    assert.match(html, /"@type":"BreadcrumbList"/, 'Reading breadcrumb schema missing: ' + route);
  }
}

// Crawl actual anchors in the production HTML. Check existence and canonical
// homepage spelling, then prove that the indexable pages are reachable from /.
const graph = new Map();
for (const [url, page] of pages) {
  const html = fs.readFileSync(sitemapFile(url), 'utf8');
  const outgoing = new Set();
  for (const tag of tagAttrs(html, 'a')) {
    if (!tag.href || /^(mailto|tel|javascript|data):/i.test(tag.href)) continue;
    const target = new URL(tag.href.replaceAll('&amp;', '&'), url);
    if (target.origin !== site) continue;
    assert.ok(!target.pathname.endsWith('/index.html'), 'Noncanonical internal link: ' + page.route + ' → ' + target.pathname);
    const file = path.join(root, decodeURIComponent(target.pathname).slice(1), target.pathname.endsWith('/') ? 'index.html' : '');
    assert.ok(fs.existsSync(file), 'Broken internal link: ' + page.route + ' → ' + target.pathname);
    outgoing.add(target.origin + target.pathname);
  }
  graph.set(url, outgoing);
}
const reachable = new Set();
const queue = [site + '/'];
while (queue.length) {
  const url = queue.pop();
  if (reachable.has(url)) continue;
  reachable.add(url);
  for (const target of graph.get(url) || []) if (graph.has(target)) queue.push(target);
}
for (const url of urls) assert.ok(reachable.has(url), 'Indexable page unreachable through HTML links: ' + url);

for (const lang of ['nl', 'en']) {
  const html = fs.readFileSync(path.join(root, lang, 'feedback.html'), 'utf8');
  const canonical = tagAttrs(html, 'link').find(tag => tag.rel === 'canonical')?.href;
  assert.equal(canonical, `${site}/${lang}/contact.html`, 'Feedback redirect canonical must be its destination');
  const overview = fs.readFileSync(path.join(root, lang, 'parasjot', 'index.html'), 'utf8');
  assert.doesNotMatch(overview, /rel="modulepreload"/, 'Static overview must not preload unused application JS');
}
assert.match(fs.readFileSync(path.join(root, '404.html'), 'utf8'), /name="robots" content="noindex"/);
assert.doesNotMatch(fs.readFileSync(path.join(root, '404.html'), 'utf8'), /location\.replace|location\.reload/,
  'A missing reading must not reload its own 404 URL indefinitely');
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
// The root page is an informative, crawlable entrance, not a doorway redirect.
// Its main action leads to the reading homepage; the changing weekly reading
// continues to live at the dedicated /nl/parasjot/ URL.
const landing = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
assert.match(landing, /<title>Parasja: betekenis, weeklezing en zelf Bijbel lezen/);
assert.match(landing, /<h1[^>]*>Wat is een parasja, en hoe lees je die zelf\?<\/h1>/);
assert.match(landing, /Parasja: betekenis en spelling/);
assert.match(landing, /<a class="gateway-cta" href="\/nl\/">Ga naar de Nederlandse homepage<\/a>/);
assert.match(landing, /href="\/nl\/parasjot\/"/);
assert.match(landing, /href="\/en\/"/);
assert.doesNotMatch(landing, /http-equiv=["']refresh|window\.location\s*=|location\.replace/i,
  'The search landing must not redirect visitors automatically');

// Search intent must remain visible on the weekly landing pages even when no
// matching study has yet been published for the coming Shabbat.
for (const [lang, titleStart, h1] of [
  ['nl', 'Parasja van de week', 'Parasja van de week'],
  ['en', "This Week's Torah Portion (Parsha)", "This Week's Torah Portion (Parsha)"]
]) {
  const html = fs.readFileSync(path.join(root, lang, 'parasjot', 'index.html'), 'utf8');
  assert.ok(html.includes('<title>' + titleStart), 'Weekly landing title missing: ' + lang);
  assert.ok(html.includes('<h1>' + h1 + '</h1>'), 'Weekly landing H1 missing: ' + lang);
  assert.ok(html.includes('<h2>' + (lang === 'nl' ? 'Alle parasjalezingen' : 'All parashah readings') + '</h2>'),
    'Archive heading missing: ' + lang);
  assert.ok(html.includes('href="/' + lang + '/#' + (lang === 'nl' ? 'werkblad' : 'worksheet') + '"'),
    'Weekly overview must link to the Bible study tools: ' + lang);
  const home = fs.readFileSync(path.join(root, lang, 'index.html'), 'utf8');
  assert.ok(home.includes('href="/' + lang + '/parasjot/"'),
    'Homepage must link to weekly landing page: ' + lang);
}

const robots = fs.readFileSync(path.join(root, 'robots.txt'), 'utf8');
assert.ok(robots.includes('Sitemap: ' + site + '/sitemap.xml'),
  'robots.txt must advertise the canonical sitemap');
// Publication contract: Wajera and Chaje Sara must preserve bilingual, indexable
// book-layout pages. Full production builds also require all twelve PDF/DOCX files.
const readingReleases = [
  {
    slug: 'vayera', names: { nl: 'Wajera', en: 'Vayera' },
    torah: 'Genesis 18:1',
    subtitle: { nl: 'De God Die verschijnt, hoort', en: 'The God who appears, hears' },
    downloads: {
      nl: { lezingen: 'vayera-nl', studiebladen: 'vayera-nl', werkbladen: 'vayera-nl' },
      en: { lezingen: 'vayera-en', studiebladen: 'vayera-en', werkbladen: 'vayera-en' }
    }
  },
  {
    slug: 'chayei-sarah', names: { nl: 'Chaje Sara', en: 'Chayei Sarah' },
    torah: 'Genesis 23:1',
    subtitle: { nl: 'Van het graf in Machpela', en: 'From the grave at Machpelah' },
    downloads: {
      nl: {
        lezingen: 'chayei-sarah-lezing-nl',
        studiebladen: 'chayei-sarah-studieblad-nl',
        werkbladen: 'chayei-sarah-werkblad-nl'
      },
      en: {
        lezingen: 'chayei-sarah-reading-en',
        studiebladen: 'chayei-sarah-study-sheet-en',
        werkbladen: 'chayei-sarah-worksheet-en'
      }
    }
  }
];

for (const reading of readingReleases) {
  for (const lang of ['nl', 'en']) {
    const route = `/${lang}/parasjot/${reading.slug}/`;
    const url = site + route;
    assert.ok(urls.has(url), reading.slug + ' missing from sitemap: ' + route);
    const html = fs.readFileSync(sitemapFile(url), 'utf8');
    const prefix = lang === 'nl' ? 'Parasja' : 'Parsha';
    assert.ok(html.includes(`${prefix} ${reading.names[lang]}`),
      'Incorrect language-specific SEO name: ' + route);
    assert.ok(html.includes(reading.torah), 'Missing Torah reference in reading: ' + route);
    assert.match(html, /class="seo-prerender book-seo-reading"/,
      'Book-layout SEO prerender missing: ' + route);
    assert.match(html, /class="book-edition-title"/, 'Book title missing: ' + route);
    assert.match(html, /class="book-edition-subtitle"/, 'Book subtitle missing: ' + route);
    assert.match(html, /class="book-edition-author">Arie Alberts/,
      'Book author credit missing: ' + route);
    assert.ok(html.includes(reading.subtitle[lang]),
      'Language-specific book subtitle missing: ' + route);

    if (process.env.VERIFY_DOWNLOADS === '1' || process.env.VERIFY_WAJERA_DOWNLOADS === '1') {
      for (const dir of ['lezingen', 'studiebladen', 'werkbladen']) {
        for (const ext of ['pdf', 'docx']) {
          const filename = `downloads/${dir}/${reading.downloads[lang][dir]}.${ext}`;
          assert.ok(fs.existsSync(path.join(root, filename)),
            'Required publication download missing: ' + filename);
        }
      }
    }
  }
}
console.log('SEO build verified:', urls.size, 'sitemap URLs; title, description, canonical, headings, hreflang and sitemap coverage OK');
