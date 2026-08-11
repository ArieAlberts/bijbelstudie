import { BIBLE_CANON } from '../constants/bible-canon';

/**
 * Finds a book in the 66-book canon matching name, OSIS, or alias.
 * @param {string} rawBookStr
 */
export function findBookMeta(rawBookStr) {
  if (!rawBookStr) return null;
  const clean = rawBookStr.trim().toLowerCase().replace(/\./g, '');

  for (const book of BIBLE_CANON) {
    if (book.osis.toLowerCase() === clean) return book;
    if (book.nl.toLowerCase() === clean) return book;
    if (book.en.toLowerCase() === clean) return book;
    if (book.aliases.some(a => a.toLowerCase() === clean)) return book;
  }
  return null;
}

/**
 * Parses any Dutch or English Bible reference string into normalized structure.
 * Examples:
 *  - "Johannes 3:16" -> { bookOsis: "John", chapter: 3, startVerse: 16, endVerse: 16, ... }
 *  - "Deuteronomium 6:4-9" -> { bookOsis: "Deut", chapter: 6, startVerse: 4, endVerse: 9, ... }
 *  - "Jesaja 53" -> { bookOsis: "Isa", chapter: 53, startVerse: 1, endVerse: 999, ... }
 *  - "1 Koriëntiërs 13:1-13" -> { bookOsis: "1Cor", chapter: 13, startVerse: 1, endVerse: 13, ... }
 *
 * @param {string} refStr
 * @returns {Object|null}
 */
export function parseBibleReference(refStr) {
  if (!refStr || typeof refStr !== 'string') return null;

  const trimmed = refStr.trim();

  // Pattern matching: "1 Cor 13:1-13", "Johannes 3:16", "Genesis 1", "Deut. 16:18"
  // Group 1: Book name (including optional leading number like 1, 2, 3)
  // Group 2: Chapter number
  // Group 3: Optional verse start
  // Group 4: Optional verse end
  const regex = /^((?:[1-3]\s*)?[a-zA-ÿ\s]+?)\s+(\d+)(?::(\d+)(?:-(\d+))?)?$/i;
  const match = trimmed.match(regex);

  if (!match) {
    // Try book-only lookup (e.g. "Genesis", "Johannes")
    const bookOnly = findBookMeta(trimmed);
    if (bookOnly) {
      return {
        bookOsis: bookOnly.osis,
        bookMeta: bookOnly,
        chapter: 1,
        startVerse: 1,
        endVerse: 999,
        osis: `${bookOnly.osis}.1`,
        canonicalRefNl: `${bookOnly.nl} 1`,
        canonicalRefEn: `${bookOnly.en} 1`
      };
    }
    return null;
  }

  const rawBook = match[1];
  const chapter = parseInt(match[2], 10);
  const startVerse = match[3] ? parseInt(match[3], 10) : 1;
  const endVerse = match[4] ? parseInt(match[4], 10) : (match[3] ? startVerse : 999);

  const bookMeta = findBookMeta(rawBook);
  if (!bookMeta) return null;

  const verseRefNl = match[3]
    ? (match[4] ? `${chapter}:${startVerse}–${endVerse}` : `${chapter}:${startVerse}`)
    : `${chapter}`;

  const verseRefEn = verseRefNl;

  const osisStr = match[3]
    ? (match[4] && match[4] !== match[3]
        ? `${bookMeta.osis}.${chapter}.${startVerse}-${bookMeta.osis}.${chapter}.${endVerse}`
        : `${bookMeta.osis}.${chapter}.${startVerse}`)
    : `${bookMeta.osis}.${chapter}`;

  return {
    bookOsis: bookMeta.osis,
    bookMeta,
    chapter,
    startVerse,
    endVerse,
    osis: osisStr,
    canonicalRefNl: `${bookMeta.nl} ${verseRefNl}`,
    canonicalRefEn: `${bookMeta.en} ${verseRefEn}`
  };
}
