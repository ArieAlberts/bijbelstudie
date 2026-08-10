import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const BOOK_IDS = {
  Deut: 5,
  Isa: 23,
  Matt: 40,
  John: 43
};

const CHAPTER_CONFIG = [
  { book: 'Deut', ch: 7 }, { book: 'Deut', ch: 8 }, { book: 'Deut', ch: 9 },
  { book: 'Deut', ch: 10 }, { book: 'Deut', ch: 11 }, { book: 'Deut', ch: 12 },
  { book: 'Deut', ch: 13 }, { book: 'Deut', ch: 14 }, { book: 'Deut', ch: 15 },
  { book: 'Deut', ch: 16 }, { book: 'Deut', ch: 17 }, { book: 'Deut', ch: 18 },
  { book: 'Deut', ch: 19 }, { book: 'Deut', ch: 20 }, { book: 'Deut', ch: 21 },
  { book: 'Isa', ch: 49 }, { book: 'Isa', ch: 50 }, { book: 'Isa', ch: 51 },
  { book: 'Isa', ch: 52 }, { book: 'Isa', ch: 54 }, { book: 'Isa', ch: 55 },
  { book: 'John', ch: 6 }, { book: 'John', ch: 14 }, { book: 'Matt', ch: 16 }
];

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

function cleanSvText(rawText) {
  // Strips <S>123</S> tags for clean SV verse text
  return rawText.replace(/<S>\d+<\/S>/g, '').replace(/\s+/g, ' ').trim();
}

function parseSvAlignments(rawText, testament) {
  // Extracts word alignments and Strong's numbers from <S>123</S> tags
  const prefix = testament === 'NT' ? 'G' : 'H';
  const alignments = [];
  
  // Regex to match text preceding <S>number</S>
  const regex = /([^\s<]+)\s*<S>(\d+)<\/S>/g;
  let match;
  let cleanOffset = 0;
  const cleanFull = cleanSvText(rawText);

  while ((match = regex.exec(rawText)) !== null) {
    const word = match[1].replace(/[.,;:!?()]/g, '');
    const strongNum = match[2];
    const strongTag = `${prefix}${strongNum}`;
    
    if (word && cleanFull.includes(word)) {
      const charStart = cleanFull.indexOf(word, cleanOffset);
      if (charStart !== -1) {
        alignments.push({
          surface: word,
          charStart,
          charEnd: charStart + word.length,
          strong: strongTag,
          status: 'verified'
        });
        cleanOffset = charStart + word.length;
      }
    }
  }

  return alignments;
}

function parseKjvTokens(rawText, testament) {
  const prefix = testament === 'NT' ? 'G' : 'H';
  const cleanText = cleanSvText(rawText);
  const words = cleanText.split(' ');
  return words.map(w => ({ t: w, s: null }));
}

async function fetchAll() {
  console.log("Fetching authentic verbatim Bible data from Bolls.life API...");
  const svDb = {};
  const kjvDb = {};

  for (const item of CHAPTER_CONFIG) {
    const bookId = BOOK_IDS[item.book];
    const ch = item.ch;
    console.log(`Fetching ${item.book} ${ch}...`);

    // Fetch DSV (Statenvertaling)
    try {
      const resSv = await fetch(`https://bolls.life/get-text/DSV/${bookId}/${ch}/`);
      if (resSv.ok) {
        const dataSv = await resSv.json();
        dataSv.forEach(v => {
          const key = `${item.book}.${ch}.${v.verse}`;
          const cleanText = cleanSvText(v.text);
          const testament = (item.book === 'John' || item.book === 'Matt') ? 'NT' : 'OT';
          const alignments = parseSvAlignments(v.text, testament);
          svDb[key] = {
            sv: cleanText,
            alignments: { sv: alignments }
          };
        });
      }
    } catch (err) {
      console.error(`Error fetching DSV ${item.book} ${ch}:`, err.message);
    }

    // Fetch KJV
    try {
      const resKjv = await fetch(`https://bolls.life/get-text/KJV/${bookId}/${ch}/`);
      if (resKjv.ok) {
        const dataKjv = await resKjv.json();
        dataKjv.forEach(v => {
          const key = `${item.book}.${ch}.${v.verse}`;
          const cleanText = cleanSvText(v.text);
          const testament = (item.book === 'John' || item.book === 'Matt') ? 'NT' : 'OT';
          const tokens = parseKjvTokens(v.text, testament);
          kjvDb[key] = {
            kjv: tokens
          };
        });
      }
    } catch (err) {
      console.error(`Error fetching KJV ${item.book} ${ch}:`, err.message);
    }

    await sleep(150);
  }

  // Combine SV & KJV into single provider database
  const combined = {};
  Object.keys(svDb).forEach(key => {
    combined[key] = {
      sv: svDb[key].sv,
      alignments: svDb[key].alignments,
      kjv: kjvDb[key] ? kjvDb[key].kjv : [{ t: svDb[key].sv, s: null }]
    };
  });

  const outPath = path.join(rootDir, 'scripts', 'authentic-bible-cache.json');
  fs.writeFileSync(outPath, JSON.stringify(combined, null, 2), 'utf-8');
  console.log(`✓ Successfully downloaded and cached ${Object.keys(combined).length} authentic verbatim verses to ${outPath}!`);
}

fetchAll();
