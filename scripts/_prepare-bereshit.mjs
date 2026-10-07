import fs from 'fs';
import path from 'path';

const root = process.cwd();
const sourcePath = path.join(root, 'content/parasjot/bereshit.md');
if (!fs.existsSync(sourcePath)) {
  const partsDir = path.join(root, '.bereshit-source');
  if (!fs.existsSync(partsDir)) throw new Error('Bereshit bron en bronstukken ontbreken op de voorbereidingsbranch.');
  const parts = fs.readdirSync(partsDir).filter(n => n.startsWith('part')).sort();
  if (!parts.length) throw new Error('Geen Bereshit bronstukken gevonden.');
  fs.mkdirSync(path.dirname(sourcePath), { recursive: true });
  fs.writeFileSync(sourcePath, parts.map(n => fs.readFileSync(path.join(partsDir, n), 'utf8')).join(''), 'utf8');
}

// 1) Werk het actuele repo-overzicht conservatief bij.
const overviewPath = path.join(root, 'content/parasjot/OVERZICHT.md');
let overview = fs.readFileSync(overviewPath, 'utf8');
overview = overview.replace(/\*\*Actueel bijgewerkt: [^*]+\*\*/, '**Actueel bijgewerkt: 7 oktober 2026**');
if (!overview.includes('| bereshit.md | bereshit |') && !overview.includes('| **bereshit.md** | **bereshit** |')) {
  const row = '| **bereshit.md** | **bereshit** | **2026-10-10** | **volledig tweetalig / gereed** |';
  if (overview.includes('| sukkot.md | sukkot | 2026-09-26 | basisbestand |')) {
    overview = overview.replace('| sukkot.md | sukkot | 2026-09-26 | basisbestand |', '| sukkot.md | sukkot | 2026-09-26 | basisbestand |\n' + row);
  } else {
    overview = overview.replace(/(\|[^\n]+\|[^\n]+\|[^\n]+\|[^\n]+\|\n)(\n> Let op:)/, `$1${row}\n$2`);
  }
}
if (!overview.includes('## Bereshit — volledige bron')) {
  const section = `## Bereshit — volledige bron

\`content/parasjot/bereshit.md\` bevat de Nederlandse en Engelse lezing, studieblad en werkblad.

- Torah: Genesis 1:1–6:8
- Haftara: 1 Samuël 20:18–42
- Evangelie / flanklezing: Mattheüs 24:29–36
- Titel NL: **Het woord dat scheiding maakt**
- Titel EN: **The word that makes separation**
- \`published_at: 2026-10-10\` en \`current: false\`
- 12 canonieke downloads onder \`public/downloads/{lezingen,studiebladen,werkbladen}/bereshit-*\`

`;
  overview = overview.replace('## Crosscheck bij publicatie', section + '## Crosscheck bij publicatie');
}
fs.writeFileSync(overviewPath, overview, 'utf8');

// 2) Breid build-bible-data permanent uit voor de Bereshit-supplementcache en hoofdstuklengtes.
const bibleBuildPath = path.join(root, 'scripts/build-bible-data.mjs');
let bibleBuild = fs.readFileSync(bibleBuildPath, 'utf8');
if (!bibleBuild.includes("bereshit-bible-cache.json")) {
  bibleBuild = bibleBuild.replace(
    "const supplementalCacheFile = path.join(rootDir, 'scripts', 'haazinu-bible-cache.json');",
    "const supplementalCacheFile = path.join(rootDir, 'scripts', 'haazinu-bible-cache.json');\nconst bereshitSupplementalCacheFile = path.join(rootDir, 'scripts', 'bereshit-bible-cache.json');"
  );
  bibleBuild = bibleBuild.replace(
    `  "Gen.21": 34,`,
    `  "Gen.1": 31, "Gen.2": 25, "Gen.3": 24, "Gen.4": 26, "Gen.5": 32, "Gen.6": 22,
  "Gen.21": 34,`
  );
  bibleBuild = bibleBuild.replace(
    `  "1Sam.1": 28, "1Sam.2": 36,`,
    `  "1Sam.1": 28, "1Sam.2": 36, "1Sam.20": 42,`
  );
  bibleBuild = bibleBuild.replace(
    `  if (fs.existsSync(supplementalCacheFile)) {
    Object.assign(cachedDb, JSON.parse(fs.readFileSync(supplementalCacheFile, 'utf-8')));
  }`,
    `  if (fs.existsSync(supplementalCacheFile)) {
    Object.assign(cachedDb, JSON.parse(fs.readFileSync(supplementalCacheFile, 'utf-8')));
  }
  if (fs.existsSync(bereshitSupplementalCacheFile)) {
    Object.assign(cachedDb, JSON.parse(fs.readFileSync(bereshitSupplementalCacheFile, 'utf-8')));
  }`
  );
}
fs.writeFileSync(bibleBuildPath, bibleBuild, 'utf8');

// 3) Zorg dat een toekomstige volledige cache-rebuild deze hoofdstukken ook behoudt.
const fetchAllPath = path.join(root, 'scripts/fetch-all-authentic-bible.mjs');
let fetchAll = fs.readFileSync(fetchAllPath, 'utf8');
if (!fetchAll.includes("{ book: 'Gen', ch: 1 }")) {
  fetchAll = fetchAll.replace(
    `  // Genesis
  { book: 'Gen', ch: 21 },`,
    `  // Genesis
  { book: 'Gen', ch: 1 }, { book: 'Gen', ch: 2 }, { book: 'Gen', ch: 3 },
  { book: 'Gen', ch: 4 }, { book: 'Gen', ch: 5 }, { book: 'Gen', ch: 6 }, { book: 'Gen', ch: 21 },`
  );
}
if (!fetchAll.includes("{ book: '1Sam', ch: 20 }")) {
  fetchAll = fetchAll.replace(
    `  { book: '1Sam', ch: 1 }, { book: '1Sam', ch: 2 },`,
    `  { book: '1Sam', ch: 1 }, { book: '1Sam', ch: 2 }, { book: '1Sam', ch: 20 },`
  );
}
fs.writeFileSync(fetchAllPath, fetchAll, 'utf8');

// 4) Maak authentieke supplemental cache uit dezelfde Bolls DSV/KJV-bron als de repo.
const BOOK_IDS = { Gen: 1, '1Sam': 9 };
const CHAPTERS = [
  ...Array.from({ length: 6 }, (_, i) => ({ book: 'Gen', ch: i + 1 })),
  { book: '1Sam', ch: 20 }
];
function extractNotesAndCleanText(rawText) {
  const notes=[];
  let cleanText=rawText.replace(/<sup>([\s\S]*?)<\/sup>/gi,(_,c)=>{const n=c.replace(/<[^>]+>/g,'').trim();if(n)notes.push(n);return '';});
  cleanText=cleanText.replace(/<f>([\s\S]*?)<\/f>/gi,(_,c)=>{const n=c.replace(/<[^>]+>/g,'').trim();if(n)notes.push(n);return '';});
  return {cleanText,notes};
}
function cleanSvText(rawText){const{cleanText}=extractNotesAndCleanText(rawText);return cleanText.replace(/^\[\d{3}:\d+\]\s*/,'').replace(/<S>\d+<\/S>/g,'').replace(/\s+/g,' ').trim();}
function parseSvAlignments(rawText){const{cleanText:raw}=extractNotesAndCleanText(rawText);const out=[];const re=/([^\s<]+)\s*<S>(\d+)<\/S>/g;let m,offset=0;const full=cleanSvText(rawText);while((m=re.exec(raw))!==null){const word=m[1].replace(/[.,;:!?()]/g,'');if(!word)continue;const start=full.indexOf(word,offset);if(start!==-1){out.push({surface:word,charStart:start,charEnd:start+word.length,strong:`H${m[2]}`,status:'verified'});offset=start+word.length;}}return out;}
function parseKjvTokens(rawText){const{cleanText,notes}=extractNotesAndCleanText(rawText);const tokens=[];for(const wordStr of cleanText.split(/\s+/)){if(!wordStr)continue;const m=wordStr.match(/^([^\s<]+)(?:<S>(\d+)<\/S>)?$/);if(m)tokens.push({t:m[1],s:m[2]?`H${m[2]}`:null});else{const tag=wordStr.match(/<S>(\d+)<\/S>/);tokens.push({t:wordStr.replace(/<S>\d+<\/S>/g,''),s:tag?`H${tag[1]}`:null});}}return{tokens,notes};}

const cache={};
for(const{book,ch}of CHAPTERS){
  const id=BOOK_IDS[book];
  const[svRes,kjvRes]=await Promise.all([fetch(`https://bolls.life/get-text/DSV/${id}/${ch}/`),fetch(`https://bolls.life/get-text/KJV/${id}/${ch}/`)]);
  if(!svRes.ok||!kjvRes.ok)throw new Error(`Bolls fetch failed ${book} ${ch}: SV=${svRes.status} KJV=${kjvRes.status}`);
  const sv=await svRes.json(),kjv=await kjvRes.json();const km=new Map(kjv.map(v=>[Number(v.verse),v.text]));
  for(const v of sv){const verse=Number(v.verse),kraw=km.get(verse);if(!kraw)throw new Error(`KJV verse missing ${book}.${ch}.${verse}`);const{notes:svNotes}=extractNotesAndCleanText(v.text);const{tokens,notes:kjvNotes}=parseKjvTokens(kraw);const notes={};if(svNotes.length)notes.sv=svNotes;if(kjvNotes.length)notes.kjv=kjvNotes;cache[`${book}.${ch}.${verse}`]={sv:cleanSvText(v.text),alignments:{sv:parseSvAlignments(v.text)},kjv:tokens,...(Object.keys(notes).length?{notes}:{})};}
}
fs.writeFileSync(path.join(root,'scripts/bereshit-bible-cache.json'),JSON.stringify(cache,null,2)+'\n','utf8');

// 5) Basale broncontrole voordat de build start.
const source=fs.readFileSync(sourcePath,'utf8');
for(const needle of ['published_at: 2026-10-10','Genesis 1:1–6:8','1 Samuël 20:18–42','Mattheüs 24:29–36'])if(!source.includes(needle))throw new Error(`Bereshit validation failed: ${needle}`);
const refs=[...source.matchAll(/"(\/downloads\/[^"]+)"/g)].map(m=>m[1]);
if(new Set(refs).size!==12)throw new Error(`Expected 12 unique download refs, got ${new Set(refs).size}`);
console.log(`Prepared Bereshit source and ${Object.keys(cache).length} authentic Bible verses.`);
