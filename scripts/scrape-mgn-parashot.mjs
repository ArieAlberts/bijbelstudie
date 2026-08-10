import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const contentDir = path.join(rootDir, 'content', 'parasjot');

if (!fs.existsSync(contentDir)) {
  fs.mkdirSync(contentDir, { recursive: true });
}

function slugify(text) {
  return text.toLowerCase()
    .replace(/['’]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

const BOOK_TO_OSIS = {
  'Genesis': 'Gen',
  'Exodus': 'Exod',
  'Leviticus': 'Lev',
  'Numeri': 'Num',
  'Deuteronomium': 'Deut',
  'Jozua': 'Josh',
  'Richteren': 'Judg',
  '1 Samuel': '1Sam',
  '2 Samuel': '2Sam',
  '1 Koningen': '1Kgs',
  '2 Koningen': '2Kgs',
  'Jesaja': 'Isa',
  'Jeremia': 'Jer',
  'Ezechiël': 'Ezek',
  'Hosea': 'Hos',
  'Joël': 'Joel',
  'Amos': 'Amos',
  'Obadja': 'Obad',
  'Jona': 'Jonah',
  'Micha': 'Mic',
  'Nahum': 'Nah',
  'Habakuk': 'Hab',
  'Sefanja': 'Zeph',
  'Haggai': 'Hag',
  'Zacharia': 'Zech',
  'Maleachi': 'Mal',
  'Mattheüs': 'Matt',
  'Marcus': 'Mark',
  'Lukas': 'Luke',
  'Johannes': 'John',
  'Handelingen': 'Acts',
  'Romeinen': 'Rom',
  '1 Korinthe': '1Cor',
  '2 Korinthe': '2Cor',
  'Galaten': 'Gal',
  'Efeze': 'Eph',
  'Filippenzen': 'Phil',
  'Kolossenzen': 'Col',
  '1 Thessalonicenzen': '1Thess',
  '2 Thessalonicenzen': '2Thess',
  '1 Timotheüs': '1Tim',
  '2 Timotheüs': '2Tim',
  'Titus': 'Titus',
  'Filemon': 'Phlm',
  'Hebreeën': 'Heb',
  'Jakobus': 'Jas',
  '1 Petrus': '1Pet',
  '2 Petrus': '2Pet',
  '1 Johannes': '1John',
  '2 Johannes': '2John',
  '3 Johannes': '3John',
  'Judas': 'Jude',
  'Openbaring': 'Rev'
};

const OSIS_TO_EN = {
  'Gen': 'Genesis', 'Exod': 'Exodus', 'Lev': 'Leviticus', 'Num': 'Numbers', 'Deut': 'Deuteronomy',
  'Josh': 'Joshua', 'Judg': 'Judges', '1Sam': '1 Samuel', '2Sam': '2 Samuel', '1Kgs': '1 Kings', '2Kgs': '2 Kings',
  'Isa': 'Isaiah', 'Jer': 'Jeremiah', 'Ezek': 'Ezekiel', 'Hos': 'Hosea', 'Joel': 'Joel', 'Amos': 'Amos',
  'Obad': 'Obadiah', 'Jonah': 'Jonah', 'Mic': 'Micah', 'Nah': 'Nahum', 'Hab': 'Habakkuk', 'Zeph': 'Zephaniah',
  'Hag': 'Haggai', 'Zech': 'Zechariah', 'Mal': 'Malachi', 'Matt': 'Matthew', 'Mark': 'Mark', 'Luke': 'Luke',
  'John': 'John', 'Acts': 'Acts', 'Rom': 'Romans', '1Cor': '1 Corinthians', '2Cor': '2 Corinthians'
};

function parseRefToOsis(refStr) {
  if (!refStr) return null;
  const match = refStr.trim().match(/^([1-3]?\s*[A-Za-zäëïöüéèáàâêîôû\s]+)\s+(\d+):(\d+)(?:[–\-]+(?:(\d+):)?(\d+))?$/);
  if (!match) return null;

  const bookNl = match[1].trim();
  const startCh = match[2];
  const startVs = match[3];
  const endCh = match[4] || startCh;
  const endVs = match[5] || startVs;

  const osisBook = BOOK_TO_OSIS[bookNl] || bookNl;
  const osis = `${osisBook}.${startCh}.${startVs}-${osisBook}.${endCh}.${endVs}`;
  const enBook = OSIS_TO_EN[osisBook] || bookNl;
  const refEn = `${enBook} ${startCh}:${startVs}${endCh !== startCh ? `–${endCh}:${endVs}` : (endVs !== startVs ? `–${endVs}` : '')}`;

  return { osis, refEn, refNl: refStr.trim() };
}

function parseHtmlDetails(htmlText) {
  const getName = (htmlText.match(/Parasjah-naam\s*<\/td>\s*<td[^>]*>\s*([^<]+)\s*<\/td>/i) || [])[1];
  const getTorah = (htmlText.match(/Parasjah\s*<\/td>\s*<td[^>]*>\s*([^<]+)\s*<\/td>/i) || [])[1];
  const getHaftara = (htmlText.match(/Haftara\s*<\/td>\s*<td[^>]*>\s*([^<]+)\s*<\/td>/i) || [])[1];
  const getGospel = (htmlText.match(/Evangelie\s*<\/td>\s*<td[^>]*>\s*([^<]+)\s*<\/td>/i) || [])[1];
  const getDate = (htmlText.match(/Datum en begintijd\s*<\/td>\s*<td[^>]*>\s*(\d{2}-\d{2}-\d{4})/i) || [])[1];

  if (!getName || !getTorah) return null;

  return {
    name: getName.trim(),
    torah: getTorah.trim(),
    haftara: getHaftara ? getHaftara.trim() : '',
    gospel: getGospel ? getGospel.trim() : '',
    dateStr: getDate ? getDate.trim() : ''
  };
}

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function scrapeAll() {
  console.log("Scraping all parashah entries from Messiaanse Gemeente schedule...");
  let count = 0;

  for (let i = 1; i <= 35; i++) {
    const url = `https://www.messiaansegemeentenieuwlekkerland.nl/agenda/kalender/samenkomst-online-dienst/samenkomst-online-dienst-${i}`;
    try {
      const res = await fetch(url);
      if (!res.ok) continue;

      const html = await res.text();
      const details = parseHtmlDetails(html);
      if (!details) continue;

      const id = slugify(details.name);
      const torahParsed = parseRefToOsis(details.torah);
      const haftaraParsed = parseRefToOsis(details.haftara);
      const gospelParsed = parseRefToOsis(details.gospel);

      if (!torahParsed) continue;

      let isoDate = '2026-08-01';
      if (details.dateStr) {
        const bits = details.dateStr.split('-');
        if (bits.length === 3) isoDate = `${bits[2]}-${bits[1]}-${bits[0]}`;
      }

      const passages = [
        {
          role: 'parasha',
          ref: { nl: torahParsed.refNl, en: torahParsed.refEn },
          osis: torahParsed.osis
        }
      ];

      if (haftaraParsed) {
        passages.push({
          role: 'haftara',
          ref: { nl: haftaraParsed.refNl, en: haftaraParsed.refEn },
          osis: haftaraParsed.osis
        });
      }

      if (gospelParsed) {
        passages.push({
          role: 'gospel',
          ref: { nl: gospelParsed.refNl, en: gospelParsed.refEn },
          osis: gospelParsed.osis
        });
      }

      const fileContent = `---
id: ${id}
parasha: ${details.name}
label:
  nl: ${details.name}
  en: ${details.name}
status: published
current: ${id === 'shoftim'}
published_at: ${isoDate}
passages:
${passages.map(p => `  - role: ${p.role}
    ref:
      nl: "${p.ref.nl}"
      en: "${p.ref.en}"
    osis: "${p.osis}"`).join('\n')}
extra_references: []
title_nl: "Lezing ${details.name}"
title_en: "${details.name} Reading"
summary_nl: "Wekelijkse lezing van ${details.name}."
summary_en: "Weekly reading of ${details.name}."
---

De wekelijkse lezing van ${details.name}.
`;

      const filePath = path.join(contentDir, `${id}.md`);
      fs.writeFileSync(filePath, fileContent, 'utf-8');
      console.log(`✓ Saved ${id}.md (${details.name} — ${details.dateStr})`);
      count++;
    } catch (err) {
      // skip errors silently
    }
    await sleep(100);
  }

  console.log(`✓ Finished scraping ${count} parashah markdown files to content/parasjot/!`);
}

scrapeAll();
