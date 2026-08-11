import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const srcAssets = path.join(rootDir, 'assets');
const destAssets = path.join(rootDir, 'public', 'assets');

function copyDirRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  const entries = fs.readdirSync(src, { withFileTypes: true });
  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDirRecursive(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

function runCopy() {
  console.log(`Copying static legacy assets from ${srcAssets} to ${destAssets}...`);
  copyDirRecursive(srcAssets, destAssets);
  console.log(`✓ Successfully copied all legacy static JS/CSS assets to public/assets/!`);
}

runCopy();
