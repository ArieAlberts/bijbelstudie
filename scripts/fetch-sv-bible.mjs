import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const SV_URLS = [
  "https://raw.githubusercontent.com/bolls-life/bible-text/main/DSV.json",
  "https://raw.githubusercontent.com/gratis-bible/dutch_statenvertaling/master/statenvertaling.json"
];

async function downloadSv() {
  for (const url of SV_URLS) {
    try {
      console.log(`Trying SV from ${url}...`);
      const res = await fetch(url);
      if (res.ok) {
        const text = await res.text();
        fs.writeFileSync(path.join(rootDir, 'scripts', 'sv-full.json'), text, 'utf-8');
        console.log(`✓ Downloaded SV data (${text.length} bytes) from ${url}`);
        break;
      }
    } catch (err) {
      console.error("SV error:", err.message);
    }
  }
}

downloadSv();
