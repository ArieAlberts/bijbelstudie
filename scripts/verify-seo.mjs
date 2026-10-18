import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const root = path.resolve('dist');
const mustExist = ['index.html','nl/index.html','en/index.html','sitemap.xml','robots.txt'];
for (const file of mustExist) assert.ok(fs.existsSync(path.join(root,file)), 'Missing build output: '+file);
const sitemap = fs.readFileSync(path.join(root,'sitemap.xml'),'utf8');
assert.match(sitemap, /<urlset\b/);
assert.match(sitemap, /https:\/\/www\.parasja\.nl\/nl\/parasjot\//);
const urls = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map(m=>m[1]);
assert.equal(new Set(urls).size, urls.length, 'Duplicate sitemap URL');
for (const url of urls) {
  assert.ok(url.startsWith('https://www.parasja.nl/'), 'Unexpected host '+url);
  const p = new URL(url).pathname;
  const local = path.join(root,p.replace(/^\//,''),p.endsWith('/')?'index.html':'');
  assert.ok(fs.existsSync(local), 'Sitemap URL has no built file: '+p);
}
for (const lang of ['nl','en']) {
  const dir = path.join(root,lang,'parasjot');
  if(!fs.existsSync(dir)) continue;
  for (const slug of fs.readdirSync(dir)) {
    const file = path.join(dir,slug,'index.html');
    if(!fs.existsSync(file)) continue;
    const html = fs.readFileSync(file,'utf8');
    assert.match(html, new RegExp('<html lang="'+lang+'"'));
    assert.match(html, /<link rel="canonical" href="https:\/\/www\.parasja\.nl\//);
    assert.match(html, /application\/ld\+json/);
    assert.ok(!html.includes('/en/artikelen/'), 'Broken English articles link: '+file);
    assert.ok(html.includes('<article>'), 'Missing article content: '+file);
  }
}
// Homepage -> overview -> every reading must be reachable through plain links.
for (const lang of ['nl','en']) {
  const dir = path.join(root,lang,'parasjot');
  if(!fs.existsSync(dir)) continue;
  const home = fs.readFileSync(path.join(root,lang,'index.html'),'utf8');
  assert.ok(home.includes('href="parasjot/"'), 'Homepage does not link to overview: '+lang);
  const overview = fs.readFileSync(path.join(dir,'index.html'),'utf8');
  assert.match(overview, new RegExp('<html lang="'+lang+'"'));
  for (const slug of fs.readdirSync(dir)) {
    if (slug === 'index.html') continue;
    assert.ok(overview.includes('href="/'+lang+'/parasjot/'+slug+'/"'), 'Overview misses reading: '+lang+'/'+slug);
  }
}
console.log('SEO build output verified:', urls.length, 'URLs');
