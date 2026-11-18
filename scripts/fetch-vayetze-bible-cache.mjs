// Retrieve only Vayetze's missing public-domain DSV/KJV verses from Bolls.life.
// Run once in GitHub Actions; commit the resulting snapshot so site builds stay offline.
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const target = path.join(ROOT, 'scripts/vayetze-bible-cache.json');
const lexicon = JSON.parse(fs.readFileSync(path.join(ROOT, 'scripts/full-lexicon-cache.json'), 'utf8'));
const CHAPTERS = [
  { osis: 'Gen', book: 1, ch: 28, first: 10, last: 22 },
  { osis: 'Gen', book: 1, ch: 29, first: 1, last: 35 },
  { osis: 'Gen', book: 1, ch: 30, first: 1, last: 43 },
  { osis: 'Gen', book: 1, ch: 31, first: 1, last: 55 },
  { osis: 'Gen', book: 1, ch: 32, first: 1, last: 2 },
  { osis: 'Hos', book: 28, ch: 12, first: 12, last: 14 },
  { osis: 'Hos', book: 28, ch: 13, first: 1, last: 16 },
  { osis: 'Hos', book: 28, ch: 14, first: 1, last: 9 },
  { osis: 'John', book: 43, ch: 1, first: 41, last: 51 },
];

function decodeEntities(text) {
  return text.replace(/&#x([0-9a-f]+);/gi, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&#([0-9]+);/g, (_, n) => String.fromCodePoint(parseInt(n, 10)))
    .replace(/&(nbsp|amp|lt|gt|quot|apos|rsquo|lsquo|ldquo|rdquo|mdash|ndash);/gi, (_, name) =>
      ({ nbsp: ' ', amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", rsquo: '’',
        lsquo: '‘', ldquo: '“', rdquo: '”', mdash: '—', ndash: '–' })[name.toLowerCase()]);
}

function strongCode(raw, prefix) {
  const cleaned = String(raw).trim().toUpperCase();
  const m = cleaned.match(/^([GH])?0*([0-9]{1,5})$/);
  if (!m || (m[1] && m[1] !== prefix)) return null;
  const code = prefix + String(Number(m[2]));
  // Only mark a word as clickable when its Strong number occurs in our lexicon.
  return lexicon[code] ? code : null;
}

// Extract the text and positional Strong markings without rewriting Scripture.
function parseTaggedVerse(html, prefix) {
  const input = String(html || '').replace(/<br\s*\/?>/gi, ' ');
  const parts = input.split(/(<s\b[^>]*>[\s\S]*?<\/s>)/gi);
  let text = '';
  const marks = [];
  let previousMarkStart = -1;
  for (const part of parts) {
    const match = part.match(/^<s\b[^>]*>\s*([GH]?\d+)\s*<\/s>$/i);
    if (match) {
      const strong = strongCode(match[1], prefix);
      if (!strong) continue;
      const found = text.match(/([\p{L}\p{N}][\p{L}\p{N}'’\-]*)(?:[^\p{L}\p{N}]*)$/u);
      if (!found) continue;
      const start = text.lastIndexOf(found[1]);
      if (start === previousMarkStart) continue;
      previousMarkStart = start;
      marks.push({ surface: found[1], charStart: start, charEnd: start + found[1].length,
        strong, status: 'source-tagged' });
    } else {
      // Formatting markup is removed; text between tags is retained.
      const visible = decodeEntities(part.replace(/<[^>]*>/g, ''))
        .replace(/\u00a0/g, ' ').replace(/\s+/g, ' ');
      text += visible;
    }
  }
  const leftTrim = text.length - text.trimStart().length;
  text = text.trim();
  const alignments = marks.map(m => ({
    ...m, charStart: m.charStart - leftTrim, charEnd: m.charEnd - leftTrim
  })).filter(m => m.charStart >= 0 && text.slice(m.charStart, m.charEnd) === m.surface);
  if (text.length < 12 || /<[^>]+>/.test(text)) {
    throw new Error('Suspicious or empty source verse: ' + text.slice(0, 100));
  }
  return { text, alignments };
}

function englishTokens(verse, prefix) {
  const tokens = [];
  const words = [...verse.text.matchAll(/\S+/g)];
  for (const word of words) {
    // Matching by source character range avoids attaching punctuation to wrong words.
    const annotation = verse.alignments.find(m => m.charStart >= word.index
      && m.charStart < word.index + word[0].length);
    tokens.push({ t: word[0], s: annotation?.strong || null });
  }
  return tokens;
}

async function chapter(translation, book, ch) {
  const url = 'https://bolls.life/get-text/' + translation + '/' + book + '/' + ch + '/';
  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(25000),
        headers: { 'User-Agent': 'Parasja.nl Bible cache builder (limited chapter retrieval)' } });
      if (!response.ok) throw new Error('HTTP ' + response.status);
      const data = await response.json();
      const verses = Array.isArray(data) ? data : data?.verses;
      if (!Array.isArray(verses) || verses.length < 2) {
        throw new Error('Unexpected API chapter JSON');
      }
      return new Map(verses.map(v => [Number(v.verse), String(v.text || '')]));
    } catch (error) {
      if (attempt === 3) throw new Error(url + ': ' + error.message);
      await new Promise(resolve => setTimeout(resolve, 1200 * attempt));
    }
  }
}

const output = {};
for (const c of CHAPTERS) {
  const svVerses = await chapter('DSV', c.book, c.ch);
  const kjvVerses = await chapter('KJV', c.book, c.ch);
  const prefix = c.osis === 'John' ? 'G' : 'H';
  for (let verse = c.first; verse <= c.last; verse++) {
    const id = c.osis + '.' + c.ch + '.' + verse;
    if (!svVerses.has(verse) || !kjvVerses.has(verse)) {
      throw new Error(id + ' missing in DSV or KJV response');
    }
    const sv = parseTaggedVerse(svVerses.get(verse), prefix);
    const en = parseTaggedVerse(kjvVerses.get(verse), prefix);
    output[id] = {
      sv: sv.text,
      alignments: { sv: sv.alignments },
      kjv: englishTokens(en, prefix)
    };
  }
  console.log('Source checked: ' + c.osis + ' ' + c.ch + ':' + c.first + '-' + c.last);
}

// Guard against incorrect verse numbering: compare distinctive source phrases.
for (const [key, pattern] of [
  ['Gen.28.15', /behoeden|bewaren/i],
  ['Gen.31.38', /twintig|twintigh/i],
  ['Hos.12.12', /Jakob|Jacob/i],
  ['Hos.14.9', /Wie is wijs/i],
  ['John.1.51', /hemel|hemelen/i],
]) {
  if (!pattern.test(output[key]?.sv || '')) {
    throw new Error('Source/versification mismatch at ' + key + ': ' + output[key]?.sv);
  }
}
if (Object.keys(output).length !== 187) {
  throw new Error('Expected precisely 187 Vayetze verses, got ' + Object.keys(output).length);
}
fs.writeFileSync(target, JSON.stringify(output, null, 2) + '\n');
console.log('Wrote ' + Object.keys(output).length + ' authentic DSV/KJV verses to ' + target);
