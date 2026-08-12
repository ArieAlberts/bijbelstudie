const fs = require('fs');
const path = require('path');
const dir = 'content/parasjot';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.md'));
let changed = 0;

files.forEach(f => {
  const fp = path.join(dir, f);
  let content = fs.readFileSync(fp, 'utf8');
  let hasChanges = false;
  
  // Replace body_nl and body_en if they only contain placeholder text
  const regexNL = /body_nl:\s*\|\s*\n\s*De wekelijkse lezing van.*/;
  if (regexNL.test(content)) {
    content = content.replace(regexNL, 'body_nl: ""');
    hasChanges = true;
  }
  const regexEN = /body_en:\s*\|\s*\n\s*(De wekelijkse lezing van|The weekly reading of).*/;
  if (regexEN.test(content)) {
    content = content.replace(regexEN, 'body_en: ""');
    hasChanges = true;
  }
  
  if (hasChanges) {
    fs.writeFileSync(fp, content, 'utf8');
    changed++;
  }
});
console.log('Changed ' + changed + ' files.');
