import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const distDir = path.join(rootDir, 'dist');
const oldOrigin = 'https://zelfdeparasjalezen.netlify.app';
const newOrigin = 'https://parasja.nl';
let changed = 0;

function walk(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walk(full);
      continue;
    }
    if (!entry.isFile() || !entry.name.endsWith('.html')) continue;
    const before = fs.readFileSync(full, 'utf8');
    if (!before.includes(oldOrigin)) continue;
    fs.writeFileSync(full, before.replaceAll(oldOrigin, newOrigin), 'utf8');
    changed += 1;
  }
}

walk(distDir);
console.log(`✓ Parasja.nl metadata bijgewerkt in ${changed} HTML-bestand(en).`);
