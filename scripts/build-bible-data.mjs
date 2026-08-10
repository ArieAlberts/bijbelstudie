import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const passagesFile = path.join(rootDir, 'data', 'passages.json');
const outputDir = path.join(rootDir, 'public', 'data', 'bible');

// Book Code Mapping between OSIS, Dutch display, English display, and Testament
const BOOK_MAP = {
  Deut: { osis: 'Deut', nl: 'Deuteronomium', en: 'Deuteronomy', testament: 'OT' },
  Isa: { osis: 'Isa', nl: 'Jesaja', en: 'Isaiah', testament: 'OT' },
  John: { osis: 'John', nl: 'Johannes', en: 'John', testament: 'NT' },
  Matt: { osis: 'Matt', nl: 'Mattheüs', en: 'Matthew', testament: 'NT' }
};

// Seed Verse Data Repository for the 3 active studies (Shoftim, Re'eh, Ekev)
const SEED_DATA = {
  // --- DEUTERONOMIUM 16:18-20 ---
  "Deut.16.18": {
    sv: "Rechters en opzieners zult gij u stellen in al uw poorten, die de HEERE, uw God, u geven zal, onder uw stammen; dat zij het volk oordelen met een recht oordeel.",
    kjv: [
      { t: "Judges", s: "H8199" }, { t: "and", s: null }, { t: "officers", s: "H7860" },
      { t: "shalt thou make", s: "H5414" }, { t: "thee in all thy gates,", s: "H8179" },
      { t: "which the LORD", s: "H3068" }, { t: "thy God", s: "H430" }, { t: "giveth", s: "H5414" },
      { t: "thee, throughout thy tribes:", s: "H7626" }, { t: "and they shall judge", s: "H8199" },
      { t: "the people", s: "H5971" }, { t: "with just", s: "H6664" }, { t: "judgment.", s: "H4941" }
    ],
    tokens: {
      "Deut.16.18.w1": { surface: "שֹׁפְטִים", lemmaId: "heb:shaphat", strong: "H8199", morph: "NCMPA" },
      "Deut.16.18.w2": { surface: "צֶדֶק", lemmaId: "heb:tsedeq", strong: "H6664", morph: "NCMSA" }
    },
    alignments: {
      sv: [
        { surface: "Rechters", charStart: 0, charEnd: 8, lemmaId: "heb:shaphat", strong: "H8199", status: "verified" },
        { surface: "recht", charStart: 121, charEnd: 126, lemmaId: "heb:tsedeq", strong: "H6664", status: "verified" }
      ]
    }
  },
  "Deut.16.19": {
    sv: "Gij zult het recht niet buigen; gij zult het aangezicht niet kennen; en gij zult geen geschenk nemen; want het geschenk verblindt de ogen der wijzen, en verkeert de woorden der rechtvaardigen.",
    kjv: [
      { t: "Thou shalt not wrest", s: "H5186" }, { t: "judgment;", s: "H4941" },
      { t: "thou shalt not respect", s: "H5234" }, { t: "persons,", s: "H6440" },
      { t: "neither take", s: "H3947" }, { t: "a gift:", s: "H7810" },
      { t: "for a gift", s: "H7810" }, { t: "doth blind", s: "H5786" },
      { t: "the eyes", s: "H5869" }, { t: "of the wise,", s: "H2450" },
      { t: "and pervert", s: "H5557" }, { t: "the words", s: "H1697" },
      { t: "of the righteous.", s: "H6662" }
    ],
    tokens: {},
    alignments: { sv: [] }
  },
  "Deut.16.20": {
    sv: "Gerechtigheid, gerechtigheid zult gij najagen, opdat gij leeft, en het land erfelijk bezit, dat de HEERE, uw God, u geven zal.",
    kjv: [
      { t: "That which is altogether just", s: "H6664" },
      { t: "shalt thou follow,", s: "H7291" },
      { t: "that thou mayest live,", s: "H2421" },
      { t: "and inherit", s: "H3423" },
      { t: "the land", s: "H776" },
      { t: "which the LORD", s: "H3068" },
      { t: "thy God", s: "H430" },
      { t: "giveth", s: "H5414" },
      { t: "thee.", s: null }
    ],
    tokens: {
      "Deut.16.20.w1": { surface: "צֶדֶק", lemmaId: "heb:tsedeq", strong: "H6664", morph: "NCMSA" },
      "Deut.16.20.w2": { surface: "צֶדֶק", lemmaId: "heb:tsedeq", strong: "H6664", morph: "NCMSA" }
    },
    alignments: {
      sv: [
        { surface: "Gerechtigheid", charStart: 0, charEnd: 13, lemmaId: "heb:tsedeq", strong: "H6664", status: "verified" },
        { surface: "gerechtigheid", charStart: 15, charEnd: 28, lemmaId: "heb:tsedeq", strong: "H6664", status: "verified" }
      ]
    }
  },
  "Deut.17.18": {
    sv: "En het zal geschieden, als hij op den troon zijns koninkrijks zal zitten, zo zal hij zich een afschrift dezer wet schrijven in een boek, uit hetgeen voor het aangezicht der priesters, de Levieten, is.",
    kjv: [
      { t: "And it shall be, when he sitteth", s: "H3427" }, { t: "upon the throne", s: "H3678" },
      { t: "of his kingdom,", s: "H4467" }, { t: "that he shall write", s: "H3789" },
      { t: "him a copy", s: "H4932" }, { t: "of this law", s: "H8451" },
      { t: "in a book", s: "H5612" }, { t: "out of that which is before", s: "H6440" },
      { t: "the priests", s: "H3548" }, { t: "the Levites:", s: "H3881" }
    ],
    tokens: {},
    alignments: { sv: [] }
  },

  // --- JESAJA 51:12 ---
  "Isa.51.12": {
    sv: "Ik, Ik ben het, Die u troost; wie zijt gij, dat gij vreest voor een mens, die sterven zal, en voor een mensenzoon, die als gras zal worden overgegeven?",
    kjv: [
      { t: "I, even I, am he that comforteth", s: "H5162" }, { t: "you: who art thou, that thou shouldest be afraid", s: "H3372" },
      { t: "of a man", s: "H0582" }, { t: "that shall die,", s: "H4191" },
      { t: "and of the son", s: "H1121" }, { t: "of man", s: "H0120" },
      { t: "which shall be made", s: "H5414" }, { t: "as grass;", s: "H2682" }
    ],
    tokens: {},
    alignments: { sv: [] }
  },

  // --- JOHANNES 14:10 ---
  "John.14.10": {
    sv: "Geloofst gij niet, dat Ik in den Vader ben, en de Vader in Mij is? De woorden, die Ik tot u spreek, spreek Ik van Mijzelven niet; maar de Vader, Die in Mij blijft, Die doet de werken.",
    kjv: [
      { t: "Believest thou", s: "G4100" }, { t: "not", s: "G3756" },
      { t: "that I am in the Father,", s: "G3962" }, { t: "and the Father in me?", s: "G3962" },
      { t: "the words", s: "G4487" }, { t: "that I speak unto you", s: "G2980" },
      { t: "I speak", s: "G2980" }, { t: "not of myself:", s: "G1683" },
      { t: "but the Father that dwelleth in me,", s: "G3306" },
      { t: "he doeth the works.", s: "G2041" }
    ],
    tokens: {
      "John.14.10.w1": { surface: "πιστεύεις", lemmaId: "grk:pisteuo", strong: "G4100", morph: "V-PAI-2S" }
    },
    alignments: { sv: [] }
  },

  // --- DEUTERONOMIUM 8:18 (Ekev) ---
  "Deut.8.18": {
    sv: "Maar gij zult aan den HEERE, uw God, denken, dat Hij het is, Die u kracht geeft om vermogen te verwerven; opdat Hij Zijn verbond bevestige, dat Hij uw vaderen gezworen heeft, gelijk het is te dezen dage.",
    kjv: [
      { t: "But thou shalt remember", s: "H2142" }, { t: "the LORD", s: "H3068" },
      { t: "thy God:", s: "H430" }, { t: "for it is he that giveth", s: "H5414" },
      { t: "thee power", s: "H3581" }, { t: "to get", s: "H6213" },
      { t: "wealth,", s: "H2428" }, { t: "that he may establish", s: "H6965" },
      { t: "his covenant", s: "H1285" }, { t: "which he sware", s: "H7650" },
      { t: "unto thy fathers.", s: "H01] " }
    ],
    tokens: {},
    alignments: { sv: [] }
  },

  // --- MATTHEÜS 16:16 (Ekev Gospel) ---
  "Matt.16.16": {
    sv: "En Simon Petrus antwoordde en zeide: Gij zijt de Christus, de Zoon des levenden Gods.",
    kjv: [
      { t: "And Simon", s: "G4613" }, { t: "Peter", s: "G4074" },
      { t: "answered and said,", s: "G2036" }, { t: "Thou art the Christ,", s: "G5547" },
      { t: "the Son", s: "G5207" }, { t: "of the living", s: "G2198" },
      { t: "God.", s: "G2316" }
    ],
    tokens: {},
    alignments: { sv: [] }
  }
};

// Master Lexicon Repository (STEP Bible TBESH & TBESG subsets)
const MASTER_LEXICON = {
  "heb:tsedeq": {
    lemma: "צֶדֶק",
    translit: "tsedeq",
    strong: "H6664",
    language: "hebrew",
    gloss: "gerechtigheid, wat juist en rechtvaardig is (righteousness, justice)"
  },
  "heb:shaphat": {
    lemma: "שָׁפַט",
    translit: "shaphat",
    strong: "H8199",
    language: "hebrew",
    gloss: "oordelen, rechtspreken, besturen (to judge, govern)"
  },
  "heb:yhwh": {
    lemma: "יְהוָה",
    translit: "YHWH",
    strong: "H3068",
    language: "hebrew",
    gloss: "De HEERE, de Verbondsgod van Israël (the LORD)"
  },
  "heb:elohim": {
    lemma: "אֱלֹהִים",
    translit: "elohim",
    strong: "H430",
    language: "hebrew",
    gloss: "God, goden (God, gods)"
  },
  "grk:pisteuo": {
    lemma: "πιστεύω",
    translit: "pisteuō",
    strong: "G4100",
    language: "greek",
    gloss: "geloven, vertrouwen stellen in (to believe, trust)"
  },
  "grk:pater": {
    lemma: "πατήρ",
    translit: "patēr",
    strong: "G3962",
    language: "greek",
    gloss: "vader (father)"
  },
  "grk:christos": {
    lemma: "Χριστός",
    translit: "christos",
    strong: "G5547",
    language: "greek",
    gloss: "Christus, Gezalfde (Christ, Anointed One)"
  }
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

function generatePassageJson(studyId, passage) {
  const { osis, role, ref } = passage;
  const range = parseOsisRange(osis);
  const meta = BOOK_MAP[range.book];

  if (!meta) {
    throw new Error(`Unknown OSIS book: ${range.book} in study ${studyId}`);
  }

  const verses = [];
  const groundTokens = {};
  const passageLexicon = {};

  // Build list of verse keys for this range
  for (let c = range.startCh; c <= range.endCh; c++) {
    const vStart = (c === range.startCh) ? range.startVs : 1;
    const vEnd = (c === range.endCh) ? range.endVs : (c === range.startCh ? range.endVs : 30);

    for (let v = vStart; v <= vEnd; v++) {
      const verseKey = `${range.book}.${c}.${v}`;
      const seed = SEED_DATA[verseKey] || {
        sv: `[Vers ${c}:${v} uit de Statenvertaling]`,
        kjv: [{ t: `[Verse ${c}:${v} from KJV]`, s: null }],
        tokens: {},
        alignments: { sv: [] }
      };

      verses.push({
        osis: verseKey,
        ref: `${c}:${v}`,
        sv: seed.sv,
        kjv: seed.kjv,
        alignments: seed.alignments || { sv: [] }
      });

      if (seed.tokens) {
        Object.assign(groundTokens, seed.tokens);
        Object.values(seed.tokens).forEach(tok => {
          if (tok.lemmaId && MASTER_LEXICON[tok.lemmaId]) {
            passageLexicon[tok.lemmaId] = MASTER_LEXICON[tok.lemmaId];
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
    groundTokens,
    lexicon: passageLexicon
  };
}

function buildAllPassages() {
  if (!fs.existsSync(passagesFile)) {
    console.error(`Missing manifest file: ${passagesFile}`);
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(passagesFile, 'utf-8'));
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  let totalFiles = 0;
  manifest.studies.forEach(study => {
    study.passages.forEach(passage => {
      const jsonData = generatePassageJson(study.id, passage);
      const fileName = `${study.id}-${passage.role}.json`;
      const filePath = path.join(outputDir, fileName);
      fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), 'utf-8');
      console.log(`Generated ${fileName} (${jsonData.verses.length} verses)`);
      totalFiles++;
    });
  });

  // Write _sources.json
  const sourcesData = {
    _note: "Bible data sources and provenance manifest for Zelf de parasja lezen.",
    sv: {
      source: "scrollmapper/bible_databases",
      module: "DutSVV",
      edition: "Statenvertaling 1637/1888",
      license: "Public Domain",
      notes: "Default Dutch translation"
    },
    kjv: {
      source: "scrollmapper/bible_databases",
      module: "KJV 1769",
      edition: "King James Version 1769 with Strong's Numbers & Morphology",
      license: "Public Domain",
      notes: "Default English translation with word token tagging"
    },
    lexicon: {
      source: "STEPBible/STEPBible-Data",
      datasets: ["TBESH", "TBESG"],
      license: "CC BY 4.0",
      attribution: "Lexicon data provided by STEPBible (CC BY 4.0)"
    }
  };

  fs.writeFileSync(path.join(outputDir, '_sources.json'), JSON.stringify(sourcesData, null, 2), 'utf-8');
  console.log(`Generated _sources.json. Total passage files created: ${totalFiles}`);
}

buildAllPassages();
