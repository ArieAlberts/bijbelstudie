import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const BOOK_IDS = { Gen:1, Exod:2, Lev:3, Num:4, Deut:5, '1Sam':9, '2Sam':10, '1Kgs':11, '2Kgs':12, Isa:23, Jer:24, Ezek:26, Hos:28, Joel:29, Zech:38, Matt:40, Mark:41, Luke:42, John:43 };

function extractNotesAndCleanText(rawText) {
  const notes = [];
  let cleanText = rawText.replace(/<sup>([\s\S]*?)<\/sup>/gi, (_, n) => { const p=n.replace(/<[^>]+>/g,'').trim(); if(p) notes.push(p); return ''; });
  cleanText = cleanText.replace(/<f>([\s\S]*?)<\/f>/gi, (_, n) => { const p=n.replace(/<[^>]+>/g,'').trim(); if(p) notes.push(p); return ''; });
  return { cleanText, notes };
}
function cleanSvText(rawText) {
  return extractNotesAndCleanText(rawText).cleanText.replace(/^\[\d{3}:\d+\]\s*/, '').replace(/<S>\d+<\/S>/g,'').replace(/\s+/g,' ').trim();
}
function parseSvAlignments(rawText, testament) {
  const raw = extractNotesAndCleanText(rawText).cleanText;
  const prefix = testament === 'NT' ? 'G' : 'H';
  const out=[]; const regex=/([^\s<]+)\s*<S>(\d+)<\/S>/g; let m; let off=0; const clean=cleanSvText(rawText);
  while ((m=regex.exec(raw))!==null) {
    const word=m[1].replace(/[.,;:!?()]/g,''); const start=clean.indexOf(word,off);
    if(word && start!==-1){ out.push({surface:word,charStart:start,charEnd:start+word.length,strong:`${prefix}${m[2]}`,status:'verified'}); off=start+word.length; }
  }
  return out;
}
function parseKjvTokens(rawText, testament) {
  const {cleanText,notes}=extractNotesAndCleanText(rawText); const prefix=testament==='NT'?'G':'H'; const tokens=[];
  for(const w of cleanText.split(/\s+/)){ if(!w) continue; const m=w.match(/^([^\s<]+)(?:<S>(\d+)<\/S>)?$/); if(m) tokens.push({t:m[1],s:m[2]?`${prefix}${m[2]}`:null}); else { const tm=w.match(/<S>(\d+)<\/S>/); tokens.push({t:w.replace(/<S>\d+<\/S>/g,''),s:tm?`${prefix}${tm[1]}`:null}); } }
  return {tokens,notes};
}
async function main(){
  const [book,chRaw]=process.argv.slice(2); const chapter=Number(chRaw); const bookId=BOOK_IDS[book];
  if(!bookId||!Number.isInteger(chapter)||chapter<1) throw new Error('Usage: node scripts/fetch-one-authentic-chapter.mjs <BookOSIS> <Chapter>');
  const testament=['Matt','Mark','Luke','John'].includes(book)?'NT':'OT';
  const [svRes,kjvRes]=await Promise.all([fetch(`https://bolls.life/get-text/DSV/${bookId}/${chapter}/`),fetch(`https://bolls.life/get-text/KJV/${bookId}/${chapter}/`)]);
  if(!svRes.ok||!kjvRes.ok) throw new Error(`Bible source request failed: DSV=${svRes.status}, KJV=${kjvRes.status}`);
  const [svJson,kjvJson]=await Promise.all([svRes.json(),kjvRes.json()]); const kjvMap=new Map(kjvJson.map(v=>[Number(v.verse),v]));
  const cachePath=path.join(rootDir,'scripts','authentic-bible-cache.json'); const cache=JSON.parse(fs.readFileSync(cachePath,'utf-8')); let count=0;
  for(const svv of svJson){ const verse=Number(svv.verse); const kjv=kjvMap.get(verse); if(!kjv) throw new Error(`Missing KJV verse ${book}.${chapter}.${verse}`);
    const notesSv=extractNotesAndCleanText(svv.text).notes; const parsedKjv=parseKjvTokens(kjv.text,testament); const notes={}; if(notesSv.length) notes.sv=notesSv; if(parsedKjv.notes.length) notes.kjv=parsedKjv.notes;
    cache[`${book}.${chapter}.${verse}`]={sv:cleanSvText(svv.text),alignments:{sv:parseSvAlignments(svv.text,testament)},kjv:parsedKjv.tokens,...(Object.keys(notes).length?{notes}:{})}; count++;
  }
  fs.writeFileSync(cachePath,JSON.stringify(cache,null,2)+'\n','utf-8'); console.log(`Cached ${count} verses for ${book} ${chapter}.`);
}
main().catch(e=>{console.error(e);process.exit(1);});
