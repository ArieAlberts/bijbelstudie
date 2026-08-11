/**
 * Complete 66-Book Bible Canon Metadata & Abbreviations (OT & NT)
 * Supports Dutch (Statenvertaling) and English (KJV) book names, OSIS identifiers, and aliases.
 */

export const BIBLE_CANON = [
  // ==================== OLD TESTAMENT (39 Books) ====================
  { osis: 'Gen', nl: 'Genesis', en: 'Genesis', chapters: 50, testament: 'OT', aliases: ['gen', 'gn', 'genesis'] },
  { osis: 'Exod', nl: 'Exodus', en: 'Exodus', chapters: 40, testament: 'OT', aliases: ['exod', 'ex', 'exodus'] },
  { osis: 'Lev', nl: 'Leviticus', en: 'Leviticus', chapters: 27, testament: 'OT', aliases: ['lev', 'lv', 'leviticus'] },
  { osis: 'Num', nl: 'Numeri', en: 'Numbers', chapters: 36, testament: 'OT', aliases: ['num', 'nm', 'numeri', 'numbers'] },
  { osis: 'Deut', nl: 'Deuteronomium', en: 'Deuteronomy', chapters: 34, testament: 'OT', aliases: ['deut', 'dt', 'deuteronomium', 'deuteronomy'] },
  { osis: 'Josh', nl: 'Jozua', en: 'Joshua', chapters: 24, testament: 'OT', aliases: ['josh', 'joz', 'jozua', 'joshua'] },
  { osis: 'Judg', nl: 'Rechters', en: 'Judges', chapters: 21, testament: 'OT', aliases: ['judg', 'rech', 'rechters', 'judges'] },
  { osis: 'Ruth', nl: 'Ruth', en: 'Ruth', chapters: 4, testament: 'OT', aliases: ['ruth', 'rt'] },
  { osis: '1Sam', nl: '1 Samuël', en: '1 Samuel', chapters: 31, testament: 'OT', aliases: ['1sam', '1 samuel', '1samuel', '1samuël'] },
  { osis: '2Sam', nl: '2 Samuël', en: '2 Samuel', chapters: 24, testament: 'OT', aliases: ['2sam', '2 samuel', '2samuel', '2samuël'] },
  { osis: '1Kgs', nl: '1 Koningen', en: '1 Kings', chapters: 22, testament: 'OT', aliases: ['1kgs', '1 koningen', '1koningen', '1 kings', '1kings'] },
  { osis: '2Kgs', nl: '2 Koningen', en: '2 Kings', chapters: 25, testament: 'OT', aliases: ['2kgs', '2 koningen', '2koningen', '2 kings', '2kings'] },
  { osis: '1Chr', nl: '1 Kronieken', en: '1 Chronicles', chapters: 29, testament: 'OT', aliases: ['1chr', '1 kronieken', '1kronieken', '1 chronicles'] },
  { osis: '2Chr', nl: '2 Kronieken', en: '2 Chronicles', chapters: 36, testament: 'OT', aliases: ['2chr', '2 kronieken', '2kronieken', '2 chronicles'] },
  { osis: 'Ezra', nl: 'Ezra', en: 'Ezra', chapters: 10, testament: 'OT', aliases: ['ezra', 'ezr'] },
  { osis: 'Neh', nl: 'Nehemia', en: 'Nehemiah', chapters: 13, testament: 'OT', aliases: ['neh', 'nehemia', 'nehemiah'] },
  { osis: 'Esth', nl: 'Ester', en: 'Esther', chapters: 10, testament: 'OT', aliases: ['esth', 'ester', 'esther'] },
  { osis: 'Job', nl: 'Job', en: 'Job', chapters: 42, testament: 'OT', aliases: ['job', 'jb'] },
  { osis: 'Ps', nl: 'Psalmen', en: 'Psalms', chapters: 150, testament: 'OT', aliases: ['ps', 'psalmen', 'psalms', 'psalm'] },
  { osis: 'Prov', nl: 'Spreuken', en: 'Proverbs', chapters: 31, testament: 'OT', aliases: ['prov', 'spr', 'spreuken', 'proverbs'] },
  { osis: 'Eccl', nl: 'Prediker', en: 'Ecclesiastes', chapters: 12, testament: 'OT', aliases: ['eccl', 'pred', 'prediker', 'ecclesiastes'] },
  { osis: 'Song', nl: 'Hooglied', en: 'Song of Solomon', chapters: 8, testament: 'OT', aliases: ['song', 'hooglied', 'canticles', 'song of songs'] },
  { osis: 'Isa', nl: 'Jesaja', en: 'Isaiah', chapters: 66, testament: 'OT', aliases: ['isa', 'jes', 'jesaja', 'isaiah'] },
  { osis: 'Jer', nl: 'Jeremia', en: 'Jeremiah', chapters: 52, testament: 'OT', aliases: ['jer', 'jeremia', 'jeremiah'] },
  { osis: 'Lam', nl: 'Klaagliederen', en: 'Lamentations', chapters: 5, testament: 'OT', aliases: ['lam', 'klaag', 'klaagliederen', 'lamentations'] },
  { osis: 'Ezek', nl: 'Ezechiël', en: 'Ezekiel', chapters: 48, testament: 'OT', aliases: ['ezek', 'ezr', 'ezechiël', 'ezechiel', 'ezekiel'] },
  { osis: 'Dan', nl: 'Daniël', en: 'Daniel', chapters: 12, testament: 'OT', aliases: ['dan', 'daniël', 'daniel'] },
  { osis: 'Hos', nl: 'Hosea', en: 'Hosea', chapters: 14, testament: 'OT', aliases: ['hos', 'hosea'] },
  { osis: 'Joel', nl: 'Joël', en: 'Joel', chapters: 3, testament: 'OT', aliases: ['joel', 'joël'] },
  { osis: 'Amos', nl: 'Amos', en: 'Amos', chapters: 9, testament: 'OT', aliases: ['amos', 'am'] },
  { osis: 'Obad', nl: 'Obadja', en: 'Obadiah', chapters: 1, testament: 'OT', aliases: ['obad', 'obadja', 'obadiah'] },
  { osis: 'Jonah', nl: 'Jona', en: 'Jonah', chapters: 4, testament: 'OT', aliases: ['jonah', 'jona'] },
  { osis: 'Mic', nl: 'Micha', en: 'Micah', chapters: 7, testament: 'OT', aliases: ['mic', 'micha', 'micah'] },
  { osis: 'Nah', nl: 'Nahum', en: 'Nahum', chapters: 3, testament: 'OT', aliases: ['nah', 'nahum'] },
  { osis: 'Hab', nl: 'Habakuk', en: 'Habakkuk', chapters: 3, testament: 'OT', aliases: ['hab', 'habakuk', 'habakkuk'] },
  { osis: 'Zeph', nl: 'Sefanja', en: 'Zephaniah', chapters: 3, testament: 'OT', aliases: ['zeph', 'sef', 'sefanja', 'zephaniah'] },
  { osis: 'Hag', nl: 'Haggaï', en: 'Haggai', chapters: 2, testament: 'OT', aliases: ['hag', 'haggaï', 'haggai'] },
  { osis: 'Zech', nl: 'Zacharia', en: 'Zechariah', chapters: 14, testament: 'OT', aliases: ['zech', 'zach', 'zacharia', 'zechariah'] },
  { osis: 'Mal', nl: 'Maleachi', en: 'Malachi', chapters: 4, testament: 'OT', aliases: ['mal', 'maleachi', 'malachi'] },

  // ==================== NEW TESTAMENT (27 Books) ====================
  { osis: 'Matt', nl: 'Mattheüs', en: 'Matthew', chapters: 28, testament: 'NT', aliases: ['matt', 'mt', 'mattheüs', 'mattheus', 'matthew'] },
  { osis: 'Mark', nl: 'Markus', en: 'Mark', chapters: 16, testament: 'NT', aliases: ['mark', 'mc', 'markus', 'marcus'] },
  { osis: 'Luke', nl: 'Lukas', en: 'Luke', chapters: 24, testament: 'NT', aliases: ['luke', 'lk', 'lukas', 'lucas'] },
  { osis: 'John', nl: 'Johannes', en: 'John', chapters: 21, testament: 'NT', aliases: ['john', 'joh', 'johannes'] },
  { osis: 'Acts', nl: 'Handelingen', en: 'Acts', chapters: 28, testament: 'NT', aliases: ['acts', 'hand', 'handelingen'] },
  { osis: 'Rom', nl: 'Romeinen', en: 'Romans', chapters: 16, testament: 'NT', aliases: ['rom', 'romeinen', 'romans'] },
  { osis: '1Cor', nl: '1 Koriëntiërs', en: '1 Corinthians', chapters: 16, testament: 'NT', aliases: ['1cor', '1 korintiers', '1 korintiërs', '1 corinthians'] },
  { osis: '2Cor', nl: '2 Koriëntiërs', en: '2 Corinthians', chapters: 13, testament: 'NT', aliases: ['2cor', '2 korintiers', '2 korintiërs', '2 corinthians'] },
  { osis: 'Gal', nl: 'Galaten', en: 'Galatians', chapters: 6, testament: 'NT', aliases: ['gal', 'galaten', 'galatians'] },
  { osis: 'Eph', nl: 'Efeziërs', en: 'Ephesians', chapters: 6, testament: 'NT', aliases: ['eph', 'efeziers', 'efeziërs', 'ephesians'] },
  { osis: 'Phil', nl: 'Filippenzen', en: 'Philippians', chapters: 4, testament: 'NT', aliases: ['phil', 'fil', 'filippenzen', 'philippians'] },
  { osis: 'Col', nl: 'Kolossenzen', en: 'Colossians', chapters: 4, testament: 'NT', aliases: ['col', 'kol', 'kolossenzen', 'colossians'] },
  { osis: '1Thess', nl: '1 Thessalonikers', en: '1 Thessalonians', chapters: 5, testament: 'NT', aliases: ['1thess', '1 thessalonikers', '1 thessalonians'] },
  { osis: '2Thess', nl: '2 Thessalonikers', en: '2 Thessalonians', chapters: 3, testament: 'NT', aliases: ['2thess', '2 thessalonikers', '2 thessalonians'] },
  { osis: '1Tim', nl: '1 Timotheüs', en: '1 Timothy', chapters: 6, testament: 'NT', aliases: ['1tim', '1 timotheus', '1 timotheüs', '1 timothy'] },
  { osis: '2Tim', nl: '2 Timotheüs', en: '2 Timothy', chapters: 4, testament: 'NT', aliases: ['2tim', '2 timotheus', '2 timotheüs', '2 timothy'] },
  { osis: 'Titus', nl: 'Titus', en: 'Titus', chapters: 3, testament: 'NT', aliases: ['titus', 'tit'] },
  { osis: 'Phlm', nl: 'Filemon', en: 'Philemon', chapters: 1, testament: 'NT', aliases: ['phlm', 'filemon', 'philemon'] },
  { osis: 'Heb', nl: 'Hebreeën', en: 'Hebrews', chapters: 13, testament: 'NT', aliases: ['heb', 'hebreeen', 'hebreeën', 'hebrews'] },
  { osis: 'Jas', nl: 'Jakobus', en: 'James', chapters: 5, testament: 'NT', aliases: ['jas', 'jak', 'jakobus', 'james'] },
  { osis: '1Pet', nl: '1 Petrus', en: '1 Peter', chapters: 5, testament: 'NT', aliases: ['1pet', '1 petrus', '1 peter'] },
  { osis: '2Pet', nl: '2 Petrus', en: '2 Peter', chapters: 3, testament: 'NT', aliases: ['2pet', '2 petrus', '2 peter'] },
  { osis: '1John', nl: '1 Johannes', en: '1 John', chapters: 5, testament: 'NT', aliases: ['1john', '1 joh', '1 johannes', '1 john'] },
  { osis: '2John', nl: '2 Johannes', en: '2 John', chapters: 1, testament: 'NT', aliases: ['2john', '2 joh', '2 johannes', '2 john'] },
  { osis: '3John', nl: '3 Johannes', en: '3 John', chapters: 1, testament: 'NT', aliases: ['3john', '3 joh', '3 johannes', '3 john'] },
  { osis: 'Jude', nl: 'Judas', en: 'Jude', chapters: 1, testament: 'NT', aliases: ['jude', 'judas'] },
  { osis: 'Rev', nl: 'Openbaring', en: 'Revelation', chapters: 22, testament: 'NT', aliases: ['rev', 'openb', 'openbaring', 'revelation', 'apocalypse'] }
];

export const BIBLE_CANON_MAP = BIBLE_CANON.reduce((acc, book) => {
  acc[book.osis] = book;
  return acc;
}, {});
