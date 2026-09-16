import fs from 'fs';

const cachePath = 'scripts/authentic-bible-cache.json';
const cache = JSON.parse(fs.readFileSync(cachePath, 'utf8'));

function extractNotesAndCleanText(rawText) {
  const notes = [];
  let cleanText = rawText.replace(/<sup>([\s\S]*?)<\/sup>/gi, (_, noteContent) => {
    const plainNote = noteContent.replace(/<[^>]+>/g, '').trim();
    if (plainNote) notes.push(plainNote);
    return '';
  });
  cleanText = cleanText.replace(/<f>([\s\S]*?)<\/f>/gi, (_, noteContent) => {
    const plainNote = noteContent.replace(/<[^>]+>/g, '').trim();
    if (plainNote) notes.push(plainNote);
    return '';
  });
  return { cleanText, notes };
}
function cleanSvText(rawText) {
  const { cleanText } = extractNotesAndCleanText(rawText);
  return cleanText.replace(/<S>\d+<\/S>/g, '').replace(/\s+/g, ' ').trim();
}
function parseSvAlignments(rawText) {
  const { cleanText: rawWithoutNotes } = extractNotesAndCleanText(rawText);
  const alignments = [];
  const regex = /([^\s<]+)\s*<S>(\d+)<\/S>/g;
  let match;
  let cleanOffset = 0;
  const cleanFull = cleanSvText(rawText);
  while ((match = regex.exec(rawWithoutNotes)) !== null) {
    const word = match[1].replace(/[.,;:!?()]/g, '');
    if (!word) continue;
    const charStart = cleanFull.indexOf(word, cleanOffset);
    if (charStart !== -1) {
      alignments.push({ surface: word, charStart, charEnd: charStart + word.length, strong: `H${match[2]}`, status: 'verified' });
      cleanOffset = charStart + word.length;
    }
  }
  return alignments;
}
function parseKjvTokens(rawText) {
  const { cleanText, notes } = extractNotesAndCleanText(rawText);
  const tokens = [];
  for (const wordStr of cleanText.split(/\s+/)) {
    if (!wordStr) continue;
    const match = wordStr.match(/^([^\s<]+)(?:<S>(\d+)<\/S>)?$/);
    if (match) tokens.push({ t: match[1], s: match[2] ? `H${match[2]}` : null });
    else {
      const tagMatch = wordStr.match(/<S>(\d+)<\/S>/);
      tokens.push({ t: wordStr.replace(/<S>\d+<\/S>/g, ''), s: tagMatch ? `H${tagMatch[1]}` : null });
    }
  }
  return { tokens, notes };
}

for (const [book, id, chapter, expected] of [['Hos', 28, 14, 9], ['Joel', 29, 2, 32]]) {
  const [svResp, kjvResp] = await Promise.all([
    fetch(`https://bolls.life/get-text/DSV/${id}/${chapter}/`),
    fetch(`https://bolls.life/get-text/KJV/${id}/${chapter}/`)
  ]);
  if (!svResp.ok || !kjvResp.ok) throw new Error(`Bible source fetch failed for ${book} ${chapter}`);
  const sv = await svResp.json();
  const kjv = await kjvResp.json();
  if (sv.length !== expected || kjv.length !== expected) throw new Error(`Unexpected verse count for ${book} ${chapter}`);
  const kjvByVerse = new Map(kjv.map(v => [Number(v.verse), v]));
  for (const v of sv) {
    const n = Number(v.verse);
    const k = kjvByVerse.get(n);
    if (!k) throw new Error(`Missing KJV ${book}.${chapter}.${n}`);
    const { notes: svNotes } = extractNotesAndCleanText(v.text);
    const { tokens, notes: kjvNotes } = parseKjvTokens(k.text);
    const notes = {};
    if (svNotes.length) notes.sv = svNotes;
    if (kjvNotes.length) notes.kjv = kjvNotes;
    cache[`${book}.${chapter}.${n}`] = {
      sv: cleanSvText(v.text),
      alignments: { sv: parseSvAlignments(v.text) },
      kjv: tokens,
      ...(Object.keys(notes).length ? { notes } : {})
    };
  }
}
fs.writeFileSync(cachePath, JSON.stringify(cache, null, 2), 'utf8');
const verify = JSON.parse(fs.readFileSync(cachePath, 'utf8'));
for (let i = 1; i <= 9; i++) if (!verify[`Hos.14.${i}`]) throw new Error(`Missing Hos.14.${i}`);
for (let i = 1; i <= 32; i++) if (!verify[`Joel.2.${i}`]) throw new Error(`Missing Joel.2.${i}`);
console.log('Added and verified Hosea 14 (1–9) and Joel 2 (1–32).');
