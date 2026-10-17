import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const yaml = require('js-yaml');
const root = process.cwd();
const publicDir = path.join(root, 'public');
const sourceDir = path.join(root, 'content', 'parasjot');
const site = 'https://parasja.nl';
const esc = v => String(v ?? '').replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;').replaceAll('"','&quot;');
const text = v => String(v ?? '').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
const items = [];
const add = (url, priority='0.5') => items.push({url, priority});
const fixed = ['/', '/nl/', '/en/', '/nl/lezer.html', '/en/reader.html', '/nl/handleiding.html', '/en/handbook.html', '/nl/artikelen/'];
fixed.forEach(x=>add(x, x==='/nl/'?'1.0':'0.6'));
for (const name of fs.readdirSync(sourceDir).filter(x=>x.endsWith('.md'))) {
 const raw = fs.readFileSync(path.join(sourceDir,name),'utf8').replace(/^\uFEFF/,'');
 const match = raw.match(/^---\s*\r?\n([\s\S]*?)\r?\n---/);
 if(!match) continue;
 const d = yaml.load(match[1]) || {};
 if(d.status==='draft' || (d.status && d.status!=='published')) continue;
 const slug = String(d.id || path.basename(name,'.md')).toLowerCase();
 if(!/^[a-z0-9-]+$/.test(slug)) throw new Error('Ongeldige parasja slug: '+slug);
 const title = d.title_nl || d.label?.nl || d.parasha || slug;
 const desc = text(d.summary_nl || d.body_nl || 'Lees de parasja en onderzoek de Schrift.').slice(0,175);
 const dir = path.join(publicDir,'nl','parasjot',slug);
 fs.mkdirSync(dir,{recursive:true});
 const canonical = site+'/nl/parasjot/'+slug+'/';
 const page = `<!doctype html><html lang="nl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>${esc(title)} – ${esc(d.parasha || slug)} | Parasja.nl</title><meta name="description" content="${esc(desc)}"><link rel="canonical" href="${canonical}"><meta property="og:type" content="article"><meta property="og:title" content="${esc(title)}"><meta property="og:description" content="${esc(desc)}"><meta property="og:url" content="${canonical}"><meta property="og:image" content="${site}/assets/share-card.png"><style>body{font:1.12rem/1.7 system-ui,sans-serif;max-width:760px;margin:auto;padding:2rem 1.2rem;color:#202a34}nav{margin-bottom:2rem}a{color:#22547a}h1,h2{line-height:1.25}article{overflow-wrap:anywhere}</style><script type="application/ld+json">${JSON.stringify({'@context':'https://schema.org','@type':'Article',headline:String(title),description:desc,inLanguage:'nl',mainEntityOfPage:canonical,author:{'@type':'Person',name:'Arie Alberts'},...(d.published_at?{datePublished:String(d.published_at).slice(0,10)}:{})}).replaceAll('<','\\u003c')}</script></head><body><nav><a href="/nl/">Zelf de parasja lezen</a> · <a href="/nl/artikelen/">Artikelen</a></nav><main><article><header><p>Parasja ${esc(d.parasha || slug)}</p><h1>${esc(title)}</h1><p>${esc(desc)}</p></header>${d.body_nl || '<p>De uitwerking van deze lezing is nog niet beschikbaar.</p>'}</article></main><footer><p><a href="/nl/">Terug naar de parasjalezingen</a></p></footer></body></html>`;
 fs.writeFileSync(path.join(dir,'index.html'),page);
 add('/nl/parasjot/'+slug+'/','0.8');
}
const articleRoot=path.join(publicDir,'nl','artikelen');
if(fs.existsSync(articleRoot)){
 const walk=dir=>{for(const e of fs.readdirSync(dir,{withFileTypes:true})){const p=path.join(dir,e.name);if(e.isDirectory())walk(p);else if(e.name==='index.html'){const rel=path.relative(publicDir,dir).split(path.sep).join('/');add('/'+rel+'/','0.6')}}};
 walk(articleRoot);
}
const unique=[...new Map(items.map(x=>[x.url,x])).values()];
const xml='<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n'+unique.map(x=>`  <url><loc>${site+x.url}</loc><priority>${x.priority}</priority></url>`).join('\n')+'\n</urlset>\n';
fs.writeFileSync(path.join(publicDir,'sitemap.xml'),xml);
fs.writeFileSync(path.join(publicDir,'robots.txt'),'User-agent: *\nAllow: /\nSitemap: https://parasja.nl/sitemap.xml\n');
console.log('SEO: '+unique.length+' URLs, including published parasja pages.');
