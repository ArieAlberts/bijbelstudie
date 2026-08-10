import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const KJV_URLS = [
  "https://raw.githubusercontent.com/thiagobodruk/bible/master/json/en_kjv.json",
  "https://raw.githubusercontent.com/jadenzaleski/bible-json/main/kjv.json"
];

const SV_URLS = [
  "https://raw.githubusercontent.com/thiagobodruk/bible/master/json/nl_svv.json"
];

async function downloadDatabase() {
  for (const url of KJV_URLS) {
    try {
      console.log(`Trying KJV from ${url}...`);
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        fs.writeFileSync(path.join(rootDir, 'scripts', 'kjv-full.json'), JSON.stringify(data), 'utf-8');
        console.log(`✓ Downloaded KJV full database (${Array.isArray(data) ? data.length : 'OK'} items)`);
        break;
      }
    } catch (err) {
      console.error("KJV error:", err.message);
    }
  }

  for (const url of SV_URLS) {
    try {
      console.log(`Trying SV from ${url}...`);
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        fs.writeFileSync(path.join(rootDir, 'scripts', 'sv-full.json'), JSON.stringify(data), 'utf-8');
        console.log(`✓ Downloaded Dutch SVV full database (${Array.isArray(data) ? data.length : 'OK'} items)`);
        break;
      }
    } catch (err) {
      console.error("SV error:", err.message);
    }
  }
}

downloadDatabase();
