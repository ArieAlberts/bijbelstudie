import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const CHAPTERS = [
  { book: 'Deut', name: 'Deuteronomy', ch: 7 },
  { book: 'Deut', name: 'Deuteronomy', ch: 8 },
  { book: 'Deut', name: 'Deuteronomy', ch: 9 },
  { book: 'Deut', name: 'Deuteronomy', ch: 10 },
  { book: 'Deut', name: 'Deuteronomy', ch: 11 },
  { book: 'Deut', name: 'Deuteronomy', ch: 12 },
  { book: 'Deut', name: 'Deuteronomy', ch: 13 },
  { book: 'Deut', name: 'Deuteronomy', ch: 14 },
  { book: 'Deut', name: 'Deuteronomy', ch: 15 },
  { book: 'Deut', name: 'Deuteronomy', ch: 16 },
  { book: 'Deut', name: 'Deuteronomy', ch: 17 },
  { book: 'Deut', name: 'Deuteronomy', ch: 18 },
  { book: 'Deut', name: 'Deuteronomy', ch: 19 },
  { book: 'Deut', name: 'Deuteronomy', ch: 20 },
  { book: 'Deut', name: 'Deuteronomy', ch: 21 },
  { book: 'Isa', name: 'Isaiah', ch: 49 },
  { book: 'Isa', name: 'Isaiah', ch: 50 },
  { book: 'Isa', name: 'Isaiah', ch: 51 },
  { book: 'Isa', name: 'Isaiah', ch: 52 },
  { book: 'Isa', name: 'Isaiah', ch: 54 },
  { book: 'Isa', name: 'Isaiah', ch: 55 },
  { book: 'John', name: 'John', ch: 6 },
  { book: 'John', name: 'John', ch: 14 },
  { book: 'Matt', name: 'Matthew', ch: 16 }
];

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

async function fetchBulk() {
  console.log("Starting bulk chapter fetch...");
  const db = {};

  for (const item of CHAPTERS) {
    try {
      console.log(`Fetching ${item.name} ${item.ch}...`);
      const url = `https://bible-api.com/${item.name}+${item.ch}?translation=kjv`;
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        if (data.verses && data.verses.length) {
          data.verses.forEach(v => {
            const key = `${item.book}.${v.chapter}.${v.verse}`;
            const cleanText = v.text ? v.text.trim().replace(/\s+/g, ' ') : '';
            db[key] = {
              kjv: [{ t: cleanText, s: null }]
            };
          });
          console.log(`✓ Loaded ${data.verses.length} verses for ${item.name} ${item.ch}`);
        }
      } else {
        console.error(`Failed ${item.name} ${item.ch}: status ${res.status}`);
      }
    } catch (err) {
      console.error(`Error fetching ${item.name} ${item.ch}:`, err.message);
    }
    await sleep(300);
  }

  const outPath = path.join(rootDir, 'scripts', 'bulk-kjv.json');
  fs.writeFileSync(outPath, JSON.stringify(db, null, 2), 'utf-8');
  console.log(`Saved ${Object.keys(db).length} verses to ${outPath}`);
}

fetchBulk();
