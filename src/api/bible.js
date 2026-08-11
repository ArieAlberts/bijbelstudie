/**
 * Bible Passage API Client Module
 * Provides API calls for fetching parashah study passages, lexicon entries,
 * AND dynamic lookups for any verse/chapter across all 66 books of the Bible.
 */

import { parseBibleReference } from '../utils/bible-reference-parser';

const BOLLS_BOOK_IDS = {
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

export async function fetchBiblePassage(studyId, section) {
  const basePrefix = (typeof window !== 'undefined' && (window.location.pathname.includes('/nl/') || window.location.pathname.includes('/en/'))) ? '../' : './';

  const candidateUrls = [
    `${basePrefix}data/bible/${studyId}-${section}.json`,
    `/data/bible/${studyId}-${section}.json`,
    `./data/bible/${studyId}-${section}.json`,
    `../data/bible/${studyId}-${section}.json`
  ];

  for (const url of candidateUrls) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        return await res.json();
      }
    } catch (_) {}
  }

  throw new Error(`Bible passage API call failed for study '${studyId}', section '${section}'.`);
}

export async function fetchPassagesIndex() {
  const basePrefix = (typeof window !== 'undefined' && (window.location.pathname.includes('/nl/') || window.location.pathname.includes('/en/'))) ? '../' : './';

  const candidateUrls = [
    `${basePrefix}data/passages.json`,
    `/data/passages.json`,
    `./data/passages.json`,
    `../data/passages.json`
  ];

  for (const url of candidateUrls) {
    try {
      const res = await fetch(url);
      if (res.ok) {
        return await res.json();
      }
    } catch (_) {}
  }

  throw new Error('Passages index API call failed.');
}

/**
 * Dynamic Full Bible Reference Lookup API
 * Fetches ANY passage from all 66 books of the Bible.
 *
 * @param {string} refStr e.g. "Johannes 3:16" or "Deuteronomium 6:4-9" or "Romans 8"
 * @param {string} lang 'nl' or 'en'
 * @returns {Promise<Object>} Formatted passage object compatible with BibleReader
 */
export async function fetchBiblePassageByRef(refStr, lang = 'nl') {
  const parsed = parseBibleReference(refStr);
  if (!parsed) {
    throw new Error(`Invalid Bible reference: '${refStr}'. Example format: 'Johannes 3:16' or 'Genesis 1:1-5'.`);
  }

  const { bookOsis, bookMeta, chapter, startVerse, endVerse } = parsed;
  const bookId = BOLLS_BOOK_IDS[bookOsis];
  if (!bookId) {
    throw new Error(`Unsupported book: ${bookOsis}`);
  }

  const cacheKey = `bible-cache-${bookOsis}-${chapter}`;
  let chapterData = null;

  // 1. Try browser localStorage cache first
  try {
    const local = localStorage.getItem(cacheKey);
    if (local) chapterData = JSON.parse(local);
  } catch (_) {}

  // 2. If not cached locally, fetch DSV & KJV for this chapter
  if (!chapterData) {
    const [dsvRes, kjvRes] = await Promise.all([
      fetch(`https://bolls.life/get-text/DSV/${bookId}/${chapter}/`).catch(() => null),
      fetch(`https://bolls.life/get-text/KJV/${bookId}/${chapter}/`).catch(() => null)
    ]);

    const dsvJson = (dsvRes && dsvRes.ok) ? await dsvRes.json() : [];
    const kjvJson = (kjvRes && kjvRes.ok) ? await kjvRes.json() : [];

    const versesMap = {};

    dsvJson.forEach(v => {
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

    chapterData = Object.values(versesMap);

    try {
      localStorage.setItem(cacheKey, JSON.stringify(chapterData));
    } catch (_) {}
  }

  // Filter verses within requested verse range
  const filteredVerses = chapterData.filter(v => {
    const vNum = parseInt(v.ref.split(':')[1], 10);
    return vNum >= startVerse && vNum <= endVerse;
  });

  return {
    study: 'custom-lookup',
    role: 'custom',
    osis: parsed.osis,
    ref: {
      nl: parsed.canonicalRefNl,
      en: parsed.canonicalRefEn
    },
    testament: bookMeta.testament,
    verses: filteredVerses.length ? filteredVerses : chapterData,
    lexicon: {}
  };
}
