const fs = require('fs');
const path = require('path');
const dir = 'content/parasjot';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
let changed = 0;

files.forEach(f => {
  const fp = path.join(dir, f);
  let content = fs.readFileSync(fp, 'utf8');
  
  const match = content.match(/^(---[\s\S]+?---)\s*([\s\S]*)$/);
  if (match) {
    const fm = match[1];
    let body = match[2];
    
    if (/De wekelijkse lezing van|placeholder/i.test(body)) {
      // Empty the body
      fs.writeFileSync(fp, fm + '\n\n', 'utf8');
      changed++;
    }
  }
});
console.log('Changed ' + changed + ' files.');
