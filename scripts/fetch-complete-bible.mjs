import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const BOOK_MAP = {
  Deut: { en: 'Deuteronomy', nl: 'Deuteronomium' },
  Isa: { en: 'Isaiah', nl: 'Jesaja' },
  John: { en: 'John', nl: 'Johannes' },
  Matt: { en: 'Matthew', nl: 'Mattheüs' }
};

const PASSAGES = [
  // Shoftim
  { book: 'Deut', startCh: 16, startVs: 18, endCh: 21, endVs: 9 },
  { book: 'Isa', startCh: 51, startVs: 12, endCh: 52, endVs: 12 },
  { book: 'John', startCh: 14, startVs: 9, endCh: 14, endVs: 20 },
  // Re'eh
  { book: 'Deut', startCh: 11, startVs: 26, endCh: 16, endVs: 17 },
  { book: 'Isa', startCh: 54, startVs: 11, endCh: 55, endVs: 5 },
  { book: 'John', startCh: 6, startVs: 35, endCh: 6, endVs: 51 },
  // Ekev
  { book: 'Deut', startCh: 7, startVs: 12, endCh: 11, endVs: 25 },
  { book: 'Isa', startCh: 49, startVs: 14, endCh: 51, endVs: 3 },
  { book: 'Matt', startCh: 16, startVs: 13, endCh: 16, endVs: 20 }
];

const CHAPTER_MAX_VERSES = {
  "Deut.7": 26, "Deut.8": 20, "Deut.9": 29, "Deut.10": 22, "Deut.11": 32,
  "Deut.12": 32, "Deut.13": 18, "Deut.14": 29, "Deut.15": 23, "Deut.16": 22,
  "Deut.17": 20, "Deut.18": 22, "Deut.19": 21, "Deut.20": 20, "Deut.21": 23,
  "Isa.49": 26, "Isa.50": 11, "Isa.51": 23, "Isa.52": 15, "Isa.54": 17, "Isa.55": 13,
  "John.6": 71, "John.14": 31, "Matt.16": 28
};

async function fetchVerseFromApi(bookEn, ch, vs) {
  try {
    const url = `https://bible-api.com/${encodeURIComponent(bookEn)}+${ch}:${vs}?translation=kjv`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      if (data.text) {
        return data.text.trim().replace(/\s+/g, ' ');
      }
    }
  } catch (_) {}
  return null;
}

async function populateAll() {
  console.log("Fetching complete Bible verse texts...");
  const db = {};

  for (const p of PASSAGES) {
    const bookEn = BOOK_MAP[p.book].en;
    for (let c = p.startCh; c <= p.endCh; c++) {
      const vStart = (c === p.startCh) ? p.startVs : 1;
      const chapterMax = CHAPTER_MAX_VERSES[`${p.book}.${c}`] || 30;
      const vEnd = (c === p.endCh) ? p.endVs : chapterMax;

      for (let v = vStart; v <= vEnd; v++) {
        const key = `${p.book}.${c}.${v}`;
        const kjvText = await fetchVerseFromApi(bookEn, c, v);
        db[key] = {
          sv: null, // Will use authentic text
          kjv: kjvText ? [{ t: kjvText, s: null }] : null
        };
        console.log(`Fetched ${key}: ${kjvText ? 'OK' : 'Failed'}`);
      }
    }
  }

  fs.writeFileSync(path.join(rootDir, 'scripts', 'fetched-kjv.json'), JSON.stringify(db, null, 2), 'utf-8');
  console.log("Done fetching!");
}

populateAll();
