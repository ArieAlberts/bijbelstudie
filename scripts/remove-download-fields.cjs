const fs = require('fs');
const path = require('path');
const dir = 'content/parasjot';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
let changed = 0;

files.forEach(f => {
  const fp = path.join(dir, f);
  let content = fs.readFileSync(fp, 'utf-8');
  const original = content;
  
  // Remove all download_* lines (including empty ones)
  content = content.replace(/^download_[a-z_]+:.*\r?\n/gm, '');
  
  // Clean up resulting double blank lines
  content = content.replace(/\n{3,}/g, '\n\n');
  
  if (content !== original) {
    fs.writeFileSync(fp, content, 'utf-8');
    changed++;
    console.log(`  ✓ Cleaned: ${f}`);
  }
});

console.log(`\nDone: ${changed} files cleaned.`);
