import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const contentDir = path.join(rootDir, 'content', 'parasjot');
const outputFile = path.join(rootDir, 'data', 'passages.json');
const publicOutputFile = path.join(rootDir, 'public', 'data', 'passages.json');

function parseYamlFrontmatter(fileContent) {
  const match = fileContent.match(/^---\r?\n([\s\S]+?)\r?\n---/);
  if (!match) return null;
  const yamlText = match[1];
  
  const obj = {
    passages: [],
    label: {},
    extra_references: []
  };

  let currentPassage = null;
  let inPassages = false;

  const lines = yamlText.split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith('#')) continue;

    if (line.startsWith('id:')) obj.id = line.split(':').slice(1).join(':').trim().replace(/['"]/g, '');
    else if (line.startsWith('parasha:')) obj.parasha = line.split(':').slice(1).join(':').trim().replace(/['"]/g, '');
    else if (line.startsWith('status:')) obj.status = line.split(':').slice(1).join(':').trim().replace(/['"]/g, '');
    else if (line.startsWith('current:')) obj.current = line.split(':').slice(1).join(':').trim() === 'true';
    else if (line.startsWith('published_at:')) obj.published_at = line.split(':').slice(1).join(':').trim().replace(/['"]/g, '');
    else if (line.startsWith('title_nl:')) obj.title_nl = line.split(':').slice(1).join(':').trim().replace(/['"]/g, '');
    else if (line.startsWith('title_en:')) obj.title_en = line.split(':').slice(1).join(':').trim().replace(/['"]/g, '');
    else if (line.startsWith('summary_nl:')) obj.summary_nl = line.split(':').slice(1).join(':').trim().replace(/['"]/g, '');
    else if (line.startsWith('summary_en:')) obj.summary_en = line.split(':').slice(1).join(':').trim().replace(/['"]/g, '');
    
    // Label parsing
    else if (line.trim().startsWith('nl:') && !inPassages) {
      obj.label.nl = line.split(':').slice(1).join(':').trim().replace(/['"]/g, '');
    } else if (line.trim().startsWith('en:') && !inPassages) {
      obj.label.en = line.split(':').slice(1).join(':').trim().replace(/['"]/g, '');
    }

    // Passages array parsing
    else if (line.startsWith('passages:')) {
      inPassages = true;
    } else if (inPassages && line.trim().startsWith('- role:')) {
      currentPassage = { role: line.split(':').slice(1).join(':').trim().replace(/['"]/g, ''), ref: {} };
      obj.passages.push(currentPassage);
    } else if (inPassages && currentPassage) {
      if (line.includes('osis:')) {
        currentPassage.osis = line.split(':').slice(1).join(':').trim().replace(/['"]/g, '');
      } else if (line.includes('nl:')) {
        currentPassage.ref.nl = line.split(':').slice(1).join(':').trim().replace(/['"]/g, '');
      } else if (line.includes('en:')) {
        currentPassage.ref.en = line.split(':').slice(1).join(':').trim().replace(/['"]/g, '');
      }
    }
  }

  return obj;
}

function buildPassagesManifest() {
  if (!fs.existsSync(contentDir)) {
    console.error(`Content directory ${contentDir} does not exist.`);
    process.exit(1);
  }

  const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));
  const studies = [];

  for (const file of files) {
    const filePath = path.join(contentDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const parsed = parseYamlFrontmatter(content);
    if (parsed && (parsed.status === 'published' || !parsed.status)) {
      studies.push(parsed);
    }
  }

  const manifest = {
    _note: "Gegenereerd door scripts/build-passages-index.mjs uit /content/parasjot/*.md. NIET handmatig bewerken.",
    defaults: {
      translations: {
        nl: "SV",
        en: "KJV"
      }
    },
    studies
  };

  const dataDir = path.dirname(outputFile);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }

  const publicDataDir = path.dirname(publicOutputFile);
  if (!fs.existsSync(publicDataDir)) {
    fs.mkdirSync(publicDataDir, { recursive: true });
  }

  const jsonString = JSON.stringify(manifest, null, 2);
  fs.writeFileSync(outputFile, jsonString, 'utf-8');
  fs.writeFileSync(publicOutputFile, jsonString, 'utf-8');
  console.log(`Successfully generated ${outputFile} and ${publicOutputFile} with ${studies.length} studies.`);
}

buildPassagesManifest();
