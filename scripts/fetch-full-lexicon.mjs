import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const outPath = path.join(rootDir, 'scripts', 'full-lexicon-cache.json');
const dutchDefsPath = path.join(rootDir, 'scripts', 'dutch-lexicon-definitions.json');
const authenticCachePath = path.join(rootDir, 'scripts', 'authentic-bible-cache.json');

function cleanKjvDef(kjvDefStr) {
  if (!kjvDefStr) return '';
  return kjvDefStr
    .replace(/\[\s*phrase\s*\]/gi, '')
    .replace(/\[\s*idiom\s*\]/gi, '')
    .replace(/[()[\]{}]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function parseKjvDefUsage(kjvDefStr) {
  const cleaned = cleanKjvDef(kjvDefStr);
  if (!cleaned) return [];
  return Array.from(new Set(cleaned.split(',').map(s => s.trim().toLowerCase()).filter(Boolean)));
}

async function buildFullLexicon() {
  console.log("Downloading OpenScriptures / STEPBible Hebrew and Greek Lexicons...");
  const lexiconDb = {};

  // Load Dutch lexicon definitions if available
  let dutchDefs = {};
  if (fs.existsSync(dutchDefsPath)) {
    try {
      dutchDefs = JSON.parse(fs.readFileSync(dutchDefsPath, 'utf-8'));
      console.log(`✓ Loaded ${Object.keys(dutchDefs).length} Dutch custom definitions.`);
    } catch (err) {
      console.warn("Could not parse dutch-lexicon-definitions.json:", err.message);
    }
  }

  // Load authentic Bible cache to extract usage_nl and usage_en
  const usageNlMap = {};
  const usageEnMap = {};

  if (fs.existsSync(authenticCachePath)) {
    try {
      const bibleCache = JSON.parse(fs.readFileSync(authenticCachePath, 'utf-8'));
      Object.values(bibleCache).forEach(v => {
        // Collect SV surface words mapped to Strong tags
        if (v.alignments && v.alignments.sv) {
          v.alignments.sv.forEach(a => {
            if (a.strong) {
              if (!usageNlMap[a.strong]) usageNlMap[a.strong] = new Set();
              const word = a.surface.replace(/[.,;:!?()]/g, '').trim();
              if (word) usageNlMap[a.strong].add(word.toLowerCase());
            }
          });
        }
        // Collect KJV tokens mapped to Strong tags
        if (v.kjv && Array.isArray(v.kjv)) {
          v.kjv.forEach(tok => {
            if (tok.s) {
              if (!usageEnMap[tok.s]) usageEnMap[tok.s] = new Set();
              const word = tok.t.replace(/[.,;:!?()]/g, '').trim();
              if (word) usageEnMap[tok.s].add(word.toLowerCase());
            }
          });
        }
      });
      console.log(`✓ Aggregated usage_nl for ${Object.keys(usageNlMap).length} Strong tags from authentic SV text.`);
    } catch (err) {
      console.warn("Could not process authentic-bible-cache.json for usage maps:", err.message);
    }
  }

  // 1. Hebrew Lexicon (8,674 entries)
  try {
    const resH = await fetch("https://raw.githubusercontent.com/openscriptures/strongs/master/hebrew/strongs-hebrew-dictionary.js");
    let jsH = await resH.text();
    const funcH = new Function('module', 'exports', jsH + '; return module.exports;');
    const moduleH = { exports: {} };
    const hDict = funcH(moduleH, moduleH.exports);

    Object.keys(hDict).forEach(key => {
      const item = hDict[key];
      const strongTag = key.startsWith('H') ? key : `H${key}`;
      const glossEn = (item.strongs_def || cleanKjvDef(item.kjv_def) || '').trim();
      const glossNl = dutchDefs[strongTag] || null;

      // Build usage_en from text tokens + kjv_def
      const usageEnSet = new Set([
        ...(usageEnMap[strongTag] ? Array.from(usageEnMap[strongTag]) : []),
        ...parseKjvDefUsage(item.kjv_def)
      ]);

      lexiconDb[strongTag] = {
        strong: strongTag,
        language: 'hebrew',
        lemma: item.lemma || '',
        translit: item.xlit || item.translit || item.pron || '',
        gloss_nl: glossNl,
        gloss_en: glossEn,
        usage_nl: usageNlMap[strongTag] ? Array.from(usageNlMap[strongTag]) : [],
        usage_en: Array.from(usageEnSet)
      };
    });
    console.log(`✓ Parsed ${Object.keys(hDict).length} Hebrew lexicon entries.`);
  } catch (err) {
    console.error("Error building Hebrew lexicon:", err.message);
  }

  // 2. Greek Lexicon (5,523 entries)
  try {
    const resG = await fetch("https://raw.githubusercontent.com/openscriptures/strongs/master/greek/strongs-greek-dictionary.js");
    let jsG = await resG.text();
    const funcG = new Function('module', 'exports', jsG + '; return module.exports;');
    const moduleG = { exports: {} };
    const gDict = funcG(moduleG, moduleG.exports);

    Object.keys(gDict).forEach(key => {
      const item = gDict[key];
      const strongTag = key.startsWith('G') ? key : `G${key}`;
      const glossEn = (item.strongs_def || cleanKjvDef(item.kjv_def) || '').trim();
      const glossNl = dutchDefs[strongTag] || null;

      // Build usage_en from text tokens + kjv_def
      const usageEnSet = new Set([
        ...(usageEnMap[strongTag] ? Array.from(usageEnMap[strongTag]) : []),
        ...parseKjvDefUsage(item.kjv_def)
      ]);

      lexiconDb[strongTag] = {
        strong: strongTag,
        language: 'greek',
        lemma: item.lemma || '',
        translit: item.translit || item.xlit || '',
        gloss_nl: glossNl,
        gloss_en: glossEn,
        usage_nl: usageNlMap[strongTag] ? Array.from(usageNlMap[strongTag]) : [],
        usage_en: Array.from(usageEnSet)
      };
    });
    console.log(`✓ Parsed ${Object.keys(gDict).length} Greek lexicon entries.`);
  } catch (err) {
    console.error("Error building Greek lexicon:", err.message);
  }

  fs.writeFileSync(outPath, JSON.stringify(lexiconDb, null, 2), 'utf-8');
  console.log(`✓ Successfully compiled full unified lexicon with ${Object.keys(lexiconDb).length} entries to ${outPath}!`);
}

buildFullLexicon();
