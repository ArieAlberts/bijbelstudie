import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const passagesFile = path.join(rootDir, 'data', 'passages.json');
const outputDir = path.join(rootDir, 'public', 'data', 'bible');
const cacheFile = path.join(rootDir, 'scripts', 'authentic-bible-cache.json');

const BOOK_MAP = {
  Gen: { osis: 'Gen', nl: 'Genesis', en: 'Genesis', testament: 'OT' },
  Exod: { osis: 'Exod', nl: 'Exodus', en: 'Exodus', testament: 'OT' },
  Lev: { osis: 'Lev', nl: 'Leviticus', en: 'Leviticus', testament: 'OT' },
  Num: { osis: 'Num', nl: 'Numeri', en: 'Numbers', testament: 'OT' },
  Deut: { osis: 'Deut', nl: 'Deuteronomium', en: 'Deuteronomy', testament: 'OT' },
  '1Sam': { osis: '1Sam', nl: '1 Samuël', en: '1 Samuel', testament: 'OT' },
  '2Sam': { osis: '2Sam', nl: '2 Samuël', en: '2 Samuel', testament: 'OT' },
  '1Kgs': { osis: '1Kgs', nl: '1 Koningen', en: '1 Kings', testament: 'OT' },
  '2Kgs': { osis: '2Kgs', nl: '2 Koningen', en: '2 Kings', testament: 'OT' },
  Isa: { osis: 'Isa', nl: 'Jesaja', en: 'Isaiah', testament: 'OT' },
  Zech: { osis: 'Zech', nl: 'Zacharia', en: 'Zechariah', testament: 'OT' },
  Matt: { osis: 'Matt', nl: 'Mattheüs', en: 'Matthew', testament: 'NT' },
  Mark: { osis: 'Mark', nl: 'Markus', en: 'Mark', testament: 'NT' },
  Luke: { osis: 'Luke', nl: 'Lukas', en: 'Luke', testament: 'NT' },
  John: { osis: 'John', nl: 'Johannes', en: 'John', testament: 'NT' }
};

const CHAPTER_MAX_VERSES = {
  "Gen.21": 34,
  "Lev.16": 34, "Lev.22": 33, "Lev.23": 44,
  "Num.25": 18, "Num.26": 65, "Num.27": 23, "Num.28": 31, "Num.29": 40,
  "Num.30": 16, "Num.31": 54, "Num.32": 42, "Num.33": 56, "Num.34": 29, "Num.35": 34, "Num.36": 13,
  "Deut.1": 46, "Deut.2": 37, "Deut.3": 29, "Deut.4": 49, "Deut.5": 33, "Deut.6": 25,
  "Deut.7": 26, "Deut.8": 20, "Deut.9": 29, "Deut.10": 22, "Deut.11": 32, "Deut.12": 32,
  "Deut.13": 18, "Deut.14": 29, "Deut.15": 23, "Deut.16": 22, "Deut.17": 20, "Deut.18": 22,
  "Deut.19": 21, "Deut.20": 20, "Deut.21": 23, "Deut.22": 30, "Deut.23": 25, "Deut.24": 22,
  "Deut.25": 19, "Deut.26": 19, "Deut.27": 26, "Deut.28": 68, "Deut.29": 29, "Deut.30": 20,
  "Deut.31": 30, "Deut.32": 52, "Deut.33": 29, "Deut.34": 12,
  "1Sam.1": 28, "1Sam.2": 36,
  "1Kgs.18": 46, "1Kgs.19": 21,
  "Isa.1": 31, "Isa.40": 31, "Isa.49": 26, "Isa.50": 11, "Isa.51": 23, "Isa.52": 15,
  "Isa.54": 17, "Isa.55": 13, "Isa.57": 21, "Isa.58": 14, "Isa.60": 22, "Isa.61": 11,
  "Isa.62": 12, "Isa.63": 19,
  "Zech.14": 21,
  "Matt.4": 25, "Matt.16": 28, "Matt.18": 35, "Matt.24": 51, "Matt.25": 46,
  "Mark.11": 33,
  "Luke.2": 52, "Luke.3": 38,
  "John.2": 25, "John.6": 71, "John.12": 50, "John.14": 31
};

const MASTER_LEXICON = {
  "H8199": { lemma: "שָׁפַט", translit: "shaphat", strong: "H8199", language: "hebrew", gloss: "oordelen, rechtspreken, besturen (to judge, govern)" },
  "H7860": { lemma: "שֹׁטֵר", translit: "shoter", strong: "H7860", language: "hebrew", gloss: "opziener, ambtman, beambte (officer, official)" },
  "H5414": { lemma: "נָתַן", translit: "nathan", strong: "H5414", language: "hebrew", gloss: "geven, stellen, beschrikken (to give, set)" },
  "H8179": { lemma: "שַׁעַר", translit: "sha'ar", strong: "H8179", language: "hebrew", gloss: "poort, stadspoort (gate)" },
  "H3068": { lemma: "יְהוָה", translit: "YHWH", strong: "H3068", language: "hebrew", gloss: "De HEERE, de Verbondsgod van Israël (the LORD)" },
  "H430": { lemma: "אֱלֹהִים", translit: "Elohim", strong: "H430", language: "hebrew", gloss: "God (God, Divine Being)" },
  "H7626": { lemma: "שֵׁבֶט", translit: "shebet", strong: "H7626", language: "hebrew", gloss: "stam, scepter, roede (tribe, rod)" },
  "H5971": { lemma: "עַם", translit: "am", strong: "H5971", language: "hebrew", gloss: "volk, natie (people, nation)" },
  "H4941": { lemma: "מִשְׁפָּט", translit: "mishpat", strong: "H4941", language: "hebrew", gloss: "recht, oordeel, gericht (justice, judgment)" },
  "H6664": { lemma: "צֶדֶק", translit: "tsedeq", strong: "H6664", language: "hebrew", gloss: "gerechtigheid, wat juist en rechtvaardig is (righteousness, justice)" },
  "G3962": { lemma: "πατήρ", translit: "patēr", strong: "G3962", language: "greek", gloss: "Vader (Father)" },
  "G4100": { lemma: "πιστεύω", translit: "pisteuō", strong: "G4100", language: "greek", gloss: "geloven, vertrouwen (to believe, trust)" }
};

function parseOsisRange(osisStr) {
  const parts = osisStr.split('-');
  const startPart = parts[0];
  const endPart = parts[1] || startPart;

  const startBits = startPart.split('.');
  const endBits = endPart.split('.');

  const book = startBits[0];
  const startCh = parseInt(startBits[1], 10);
  const startVs = parseInt(startBits[2], 10);
  const endCh = parseInt(endBits[1], 10);
  const endVs = parseInt(endBits[2], 10);

  return { book, startCh, startVs, endCh, endVs };
}

function generatePassageJson(studyId, passage, cachedDb) {
  const { osis, role, ref } = passage;
  const range = parseOsisRange(osis);
  const meta = BOOK_MAP[range.book];

  if (!meta) {
    throw new Error(`Unknown OSIS book: ${range.book} in study ${studyId}`);
  }

  const verses = [];
  const passageLexicon = {};

  for (let c = range.startCh; c <= range.endCh; c++) {
    const vStart = (c === range.startCh) ? range.startVs : 1;
    const chapterMax = CHAPTER_MAX_VERSES[`${range.book}.${c}`] || 30;
    const vEnd = (c === range.endCh) ? range.endVs : chapterMax;

    for (let v = vStart; v <= vEnd; v++) {
      const verseKey = `${range.book}.${c}.${v}`;
      const found = cachedDb[verseKey];

      if (!found || !found.sv || !found.kjv) {
        throw new Error(`[CRITICAL ERROR] Missing authentic verse data for '${verseKey}'!`);
      }
      
      verses.push({
        osis: verseKey,
        ref: `${c}:${v}`,
        sv: found.sv,
        kjv: found.kjv,
        alignments: found.alignments || { sv: [] }
      });

      if (found.alignments && found.alignments.sv) {
        found.alignments.sv.forEach(align => {
          if (align.strong && MASTER_LEXICON[align.strong]) {
            passageLexicon[align.strong] = MASTER_LEXICON[align.strong];
          }
        });
      }
    }
  }

  return {
    study: studyId,
    role,
    osis,
    ref,
    testament: meta.testament,
    verses,
    lexicon: passageLexicon
  };
}

function validateAllVerses(passageData, fileName) {
  passageData.verses.forEach(v => {
    if (!v.sv || v.sv.length < 3 || v.sv.toLowerCase().includes('placeholder') || v.sv.toLowerCase().includes('uit de statenvertaling')) {
      throw new Error(`[VALIDATION CONTROL FAILED] Verse ${v.osis} in '${fileName}' contains non-verbatim text: "${v.sv}"!`);
    }
  });
}

function buildAllPassages() {
  if (!fs.existsSync(passagesFile)) {
    console.error(`Missing manifest file: ${passagesFile}`);
    process.exit(1);
  }

  if (!fs.existsSync(cacheFile)) {
    console.error(`Missing authentic Bible cache file: ${cacheFile}`);
    process.exit(1);
  }

  const cachedDb = JSON.parse(fs.readFileSync(cacheFile, 'utf-8'));
  const manifest = JSON.parse(fs.readFileSync(passagesFile, 'utf-8'));

  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  let totalFiles = 0;
  manifest.studies.forEach(study => {
    study.passages.forEach(passage => {
      const jsonData = generatePassageJson(study.id, passage, cachedDb);
      const fileName = `${study.id}-${passage.role}.json`;

      validateAllVerses(jsonData, fileName);

      const filePath = path.join(outputDir, fileName);
      fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), 'utf-8');
      console.log(`✓ Verified Verbatim & Generated ${fileName} (${jsonData.verses.length} verses)`);
      totalFiles++;
    });
  });

  const sourcesData = {
    _note: "Bible data sources and provenance manifest for Zelf de parasja lezen.",
    sv: {
      source: "Bolls.life / DutSVV",
      edition: "Statenvertaling 1637/1888 with Strong's Tagging",
      license: "Public Domain",
      notes: "Default Dutch translation"
    },
    kjv: {
      source: "Bolls.life / KJV 1769",
      edition: "King James Version 1769",
      license: "Public Domain",
      notes: "Default English translation"
    },
    lexicon: {
      source: "STEPBible/STEPBible-Data",
      datasets: ["TBESH", "TBESG"],
      license: "CC BY 4.0",
      attribution: "Lexicon data provided by STEPBible (CC BY 4.0)"
    }
  };

  fs.writeFileSync(path.join(outputDir, '_sources.json'), JSON.stringify(sourcesData, null, 2), 'utf-8');
  console.log(`✓ Generated _sources.json. Total passage files created and validated: ${totalFiles}`);
}

buildAllPassages();
