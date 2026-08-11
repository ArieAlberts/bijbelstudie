import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const BOOK_IDS = {
  Gen: 1, Exod: 2, Lev: 3, Num: 4, Deut: 5,
  Josh: 6, Judg: 7, Ruth: 8, '1Sam': 9, '2Sam': 10, '1Kgs': 11, '2Kgs': 12,
  Isa: 23, Jer: 24, Ezek: 26, Hos: 28, Joel: 29, Amos: 30, Obad: 31, Jonah: 32, Mic: 33,
  Zeph: 36, Hag: 37, Zech: 38, Mal: 39,
  Matt: 40, Mark: 41, Luke: 42, John: 43, Acts: 44, Rom: 45, '1Cor': 46, '2Cor': 47,
  Gal: 48, Eph: 49, Phil: 50, Col: 51, Heb: 58, Rev: 66
};

// Comprehensive chapter configuration for all parashot including Pinchas
const CHAPTER_CONFIG = [
  // Genesis
  { book: 'Gen', ch: 21 },
  // Leviticus
  { book: 'Lev', ch: 16 }, { book: 'Lev', ch: 22 }, { book: 'Lev', ch: 23 },
  // Numbers (including Pinchas 25-30)
  { book: 'Num', ch: 25 }, { book: 'Num', ch: 26 }, { book: 'Num', ch: 27 },
  { book: 'Num', ch: 28 }, { book: 'Num', ch: 29 }, { book: 'Num', ch: 30 },
  { book: 'Num', ch: 31 }, { book: 'Num', ch: 32 }, { book: 'Num', ch: 33 },
  { book: 'Num', ch: 34 }, { book: 'Num', ch: 35 }, { book: 'Num', ch: 36 },
  // Deuteronomy
  ...Array.from({ length: 34 }, (_, i) => ({ book: 'Deut', ch: i + 1 })),
  // 1 Samuel
  { book: '1Sam', ch: 1 }, { book: '1Sam', ch: 2 },
  // 1 Kings (Pinchas Haftara)
  { book: '1Kgs', ch: 18 }, { book: '1Kgs', ch: 19 },
  // Isaiah
  { book: 'Isa', ch: 1 }, { book: 'Isa', ch: 40 }, { book: 'Isa', ch: 49 }, { book: 'Isa', ch: 50 },
  { book: 'Isa', ch: 51 }, { book: 'Isa', ch: 52 }, { book: 'Isa', ch: 54 }, { book: 'Isa', ch: 55 },
  { book: 'Isa', ch: 57 }, { book: 'Isa', ch: 58 }, { book: 'Isa', ch: 60 }, { book: 'Isa', ch: 61 },
  { book: 'Isa', ch: 62 }, { book: 'Isa', ch: 63 },
  // Zechariah
  { book: 'Zech', ch: 14 },
  // Gospels (including John 2 for Pinchas)
  { book: 'Matt', ch: 4 }, { book: 'Matt', ch: 16 }, { book: 'Matt', ch: 18 }, { book: 'Matt', ch: 24 }, { book: 'Matt', ch: 25 },
  { book: 'Mark', ch: 11 },
  { book: 'Luke', ch: 2 }, { book: 'Luke', ch: 3 },
  { book: 'John', ch: 2 }, { book: 'John', ch: 6 }, { book: 'John', ch: 12 }, { book: 'John', ch: 14 }
];

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

function extractNotesAndCleanText(rawText) {
  const notes = [];
  let cleanText = rawText.replace(/<sup>([\s\S]*?)<\/sup>/gi, (_, noteContent) => {
    const plainNote = noteContent.replace(/<[^>]+>/g, '').trim();
    if (plainNote) {
      notes.push(plainNote);
    }
    return '';
  });

  cleanText = cleanText.replace(/<f>([\s\S]*?)<\/f>/gi, (_, noteContent) => {
    const plainNote = noteContent.replace(/<[^>]+>/g, '').trim();
    if (plainNote) {
      notes.push(plainNote);
    }
    return '';
  });

  return { cleanText, notes };
}

function cleanSvText(rawText) {
  const { cleanText } = extractNotesAndCleanText(rawText);
  return cleanText.replace(/<S>\d+<\/S>/g, '').replace(/\s+/g, ' ').trim();
}

function parseSvAlignments(rawText, testament) {
  const { cleanText: rawWithoutNotes } = extractNotesAndCleanText(rawText);
  const prefix = testament === 'NT' ? 'G' : 'H';
  const alignments = [];
  
  const regex = /([^\s<]+)\s*<S>(\d+)<\/S>/g;
  let match;
  let cleanOffset = 0;
  const cleanFull = cleanSvText(rawText);

  while ((match = regex.exec(rawWithoutNotes)) !== null) {
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
  const { cleanText, notes } = extractNotesAndCleanText(rawText);
  const prefix = testament === 'NT' ? 'G' : 'H';
  const tokens = [];

  const words = cleanText.split(/\s+/);
  
  for (const wordStr of words) {
    if (!wordStr) continue;
    const match = wordStr.match(/^([^\s<]+)(?:<S>(\d+)<\/S>)?$/);
    if (match) {
      const surface = match[1];
      const strongNum = match[2];
      const strongTag = strongNum ? `${prefix}${strongNum}` : null;
      tokens.push({ t: surface, s: strongTag });
    } else {
      const cleanWord = wordStr.replace(/<S>\d+<\/S>/g, '');
      const tagMatch = wordStr.match(/<S>(\d+)<\/S>/);
      const strongTag = tagMatch ? `${prefix}${tagMatch[1]}` : null;
      tokens.push({ t: cleanWord, s: strongTag });
    }
  }

  return { tokens, notes };
}

async function fetchAll() {
  console.log("Fetching authentic verbatim Bible data with separated footnotes for DSV and KJV...");
  const svDb = {};
  const kjvDb = {};

  for (const item of CHAPTER_CONFIG) {
    const bookId = BOOK_IDS[item.book];
    if (!bookId) continue;
    const ch = item.ch;
    const testament = (item.book === 'John' || item.book === 'Matt' || item.book === 'Mark' || item.book === 'Luke') ? 'NT' : 'OT';
    console.log(`Fetching ${item.book} ${ch}...`);

    try {
      const resSv = await fetch(`https://bolls.life/get-text/DSV/${bookId}/${ch}/`);
      if (resSv.ok) {
        const dataSv = await resSv.json();
        dataSv.forEach(v => {
          const key = `${item.book}.${ch}.${v.verse}`;
          const { notes } = extractNotesAndCleanText(v.text);
          const cleanText = cleanSvText(v.text);
          const alignments = parseSvAlignments(v.text, testament);
          svDb[key] = {
            sv: cleanText,
            alignments: { sv: alignments },
            notes: notes
          };
        });
      }
    } catch (err) {
      console.error(`Error fetching DSV ${item.book} ${ch}:`, err.message);
    }

    try {
      const resKjv = await fetch(`https://bolls.life/get-text/KJV/${bookId}/${ch}/`);
      if (resKjv.ok) {
        const dataKjv = await resKjv.json();
        dataKjv.forEach(v => {
          const key = `${item.book}.${ch}.${v.verse}`;
          const { tokens, notes } = parseKjvTokens(v.text, testament);
          kjvDb[key] = {
            kjv: tokens,
            notes: notes
          };
        });
      }
    } catch (err) {
      console.error(`Error fetching KJV ${item.book} ${ch}:`, err.message);
    }

    await sleep(150);
  }

  const combined = {};
  Object.keys(svDb).forEach(key => {
    const notesSv = svDb[key].notes || [];
    const notesKjv = (kjvDb[key] && kjvDb[key].notes) || [];
    
    const notesObj = {};
    if (notesSv.length) notesObj.sv = notesSv;
    if (notesKjv.length) notesObj.kjv = notesKjv;

    combined[key] = {
      sv: svDb[key].sv,
      alignments: svDb[key].alignments,
      kjv: kjvDb[key] ? kjvDb[key].kjv : [{ t: svDb[key].sv, s: null }],
      notes: Object.keys(notesObj).length ? notesObj : undefined
    };
  });

  const outPath = path.join(rootDir, 'scripts', 'authentic-bible-cache.json');
  fs.writeFileSync(outPath, JSON.stringify(combined, null, 2), 'utf-8');
  console.log(`✓ Successfully downloaded and cached ${Object.keys(combined).length} authentic verbatim verses with separated footnotes to ${outPath}!`);
}

fetchAll();
