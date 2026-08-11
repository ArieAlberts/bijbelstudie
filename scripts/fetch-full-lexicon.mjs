import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const outPath = path.join(rootDir, 'scripts', 'full-lexicon-cache.json');

function cleanKjvDef(kjvDefStr) {
  if (!kjvDefStr) return '';
  return kjvDefStr
    .replace(/\[\s*phrase\s*\]/gi, '')
    .replace(/\[\s*idiom\s*\]/gi, '')
    .replace(/[()[\]{}]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

async function buildFullLexicon() {
  console.log("Downloading OpenScriptures / STEPBible Hebrew and Greek Lexicons...");
  const lexiconDb = {};

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
      const gloss = item.strongs_def || cleanKjvDef(item.kjv_def) || 'Hebreeuws grondwoord';
      
      lexiconDb[strongTag] = {
        strong: strongTag,
        language: 'hebrew',
        lemma: item.lemma || '',
        translit: item.xlit || item.translit || item.pron || '',
        gloss: gloss.trim(),
        strongs_def: item.strongs_def || '',
        kjv_def: cleanKjvDef(item.kjv_def)
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
      const gloss = item.strongs_def || cleanKjvDef(item.kjv_def) || 'Griks grondwoord';

      lexiconDb[strongTag] = {
        strong: strongTag,
        language: 'greek',
        lemma: item.lemma || '',
        translit: item.translit || item.xlit || '',
        gloss: gloss.trim(),
        strongs_def: item.strongs_def || '',
        kjv_def: cleanKjvDef(item.kjv_def)
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
