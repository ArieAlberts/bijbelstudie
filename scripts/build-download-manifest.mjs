import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const downloadsDir = path.join(rootDir, 'public', 'downloads');
const outputFile = path.join(rootDir, 'public', 'data', 'downloads.json');

// Recursively get all files in a directory
function getAllFiles(dirPath, arrayOfFiles = []) {
  if (!fs.existsSync(dirPath)) return arrayOfFiles;
  
  const files = fs.readdirSync(dirPath);
  
  files.forEach((file) => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      arrayOfFiles = getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(fullPath);
    }
  });
  
  return arrayOfFiles;
}

function buildManifest() {
  const allFiles = getAllFiles(downloadsDir);
  const manifest = {};
  
  allFiles.forEach(file => {
    // We want the relative path from the 'public' directory
    // e.g. 'downloads/lezingen/shoftim-nl.pdf'
    // Ensure we use forward slashes for URLs
    const relativePath = path.relative(path.join(rootDir, 'public'), file).split(path.sep).join('/');
    
    // Also include a version with a leading slash, as frontmatter might have '/downloads/...'
    manifest[relativePath] = true;
    manifest[`/${relativePath}`] = true;
  });
  
  // Ensure the output directory exists
  const outputDir = path.dirname(outputFile);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  fs.writeFileSync(outputFile, JSON.stringify(manifest, null, 2), 'utf-8');
  console.log(`✓ Generated downloads manifest with ${Object.keys(manifest).length / 2} files at public/data/downloads.json`);
}

buildManifest();
