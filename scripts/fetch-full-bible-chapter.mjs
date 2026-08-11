import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const BOOK_IDS = {
  Gen: 1, Exod: 2, Lev: 3, Num: 4, Deut: 5,
  Josh: 6, Judg: 7, Ruth: 8, '1Sam': 9, '2Sam': 10, '1Kgs': 11, '2Kgs': 12,
  '1Chr': 13, '2Chr': 14, Ezra: 15, Neh: 16, Esth: 17, Job: 18, Ps: 19, Prov: 20,
  Eccl: 21, Song: 22, Isa: 23, Jer: 24, Lam: 25, Ezek: 26, Dan: 27, Hos: 28,
  Joel: 29, Amos: 30, Obad: 31, Jonah: 32, Mic: 33, Nah: 34, Hab: 35, Zeph: 36,
  Hag: 37, Zech: 38, Mal: 39,
  Matt: 40, Mark: 41, Luke: 42, John: 43, Acts: 44, Rom: 45, '1Cor': 46, '2Cor': 47,
  Gal: 48, Eph: 49, Phil: 50, Col: 51, '1Thess': 52, '2Thess': 53, '1Tim': 54, '2Tim': 55,
  Titus: 56, Phlm: 57, Heb: 58, Jas: 59, '1Pet': 60, '2Pet': 61, '1John': 62, '2John': 63,
  '3John': 64, Jude: 65, Rev: 66
};

async function fetchChapter(bookOsis, chapter) {
  const bookId = BOOK_IDS[bookOsis];
  if (!bookId) {
    console.error(`Unknown book: ${bookOsis}`);
    return;
  }

  console.log(`Fetching ${bookOsis} chapter ${chapter} (DSV & KJV)...`);

  const resSv = await fetch(`https://bolls.life/get-text/DSV/${bookId}/${chapter}/`);
  const resKjv = await fetch(`https://bolls.life/get-text/KJV/${bookId}/${chapter}/`);

  const svJson = resSv.ok ? await resSv.json() : [];
  const kjvJson = resKjv.ok ? await resKjv.json() : [];

  const versesMap = {};

  svJson.forEach(v => {
    const cleanSv = v.text.replace(/<[^>]+>/g, '').replace(/<S>\d+<\/S>/g, '').trim();
    versesMap[v.verse] = {
      osis: `${bookOsis}.${chapter}.${v.verse}`,
      ref: `${chapter}:${v.verse}`,
      sv: cleanSv,
      kjv: [],
      alignments: { sv: [] }
    };
  });

  kjvJson.forEach(v => {
    const cleanKjv = v.text.replace(/<[^>]+>/g, '').trim();
    if (!versesMap[v.verse]) {
      versesMap[v.verse] = {
        osis: `${bookOsis}.${chapter}.${v.verse}`,
        ref: `${chapter}:${v.verse}`,
        sv: cleanKjv,
        kjv: [],
        alignments: { sv: [] }
      };
    }
    versesMap[v.verse].kjv = [{ t: cleanKjv, s: null }];
  });

  const outDir = path.join(rootDir, 'public', 'data', 'bible', 'chapters', bookOsis);
  if (!fs.existsSync(outDir)) {
    fs.mkdirSync(outDir, { recursive: true });
  }

  const outFile = path.join(outDir, `${chapter}.json`);
  fs.writeFileSync(outFile, JSON.stringify(Object.values(versesMap), null, 2), 'utf-8');
  console.log(`✓ Saved ${Object.keys(versesMap).length} verses to ${outFile}!`);
}

const args = process.argv.slice(2);
if (args.length < 2) {
  console.log("Usage: node scripts/fetch-full-bible-chapter.mjs <BookOSIS> <Chapter>");
  console.log("Example: node scripts/fetch-full-bible-chapter.mjs John 3");
} else {
  fetchChapter(args[0], parseInt(args[1], 10));
}
