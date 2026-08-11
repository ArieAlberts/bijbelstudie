import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const yaml = require('js-yaml');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const contentDir = path.join(rootDir, 'content', 'parasjot');
const outputFile = path.join(rootDir, 'data', 'passages.json');
const publicOutputFile = path.join(rootDir, 'public', 'data', 'passages.json');

function parseFrontmatter(fileContent, fileName) {
  const match = fileContent.match(/^---\r?\n([\s\S]+?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) {
    throw new Error(`[CMS SCHEMA ERROR] File '${fileName}' missing valid YAML frontmatter delimiters ('---').`);
  }

  const yamlStr = match[1];
  const markdownBody = match[2] ? match[2].trim() : '';

  let parsed;
  try {
    parsed = yaml.load(yamlStr);
  } catch (yamlErr) {
    throw new Error(`[CMS YAML PARSE ERROR] File '${fileName}': ${yamlErr.message}`);
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new Error(`[CMS SCHEMA ERROR] File '${fileName}' frontmatter is not a valid object.`);
  }

  // Mandatory Schema Validation
  if (!parsed.id) throw new Error(`[CMS SCHEMA ERROR] File '${fileName}' missing required field 'id'.`);
  if (!parsed.parasha) throw new Error(`[CMS SCHEMA ERROR] File '${fileName}' missing required field 'parasha'.`);
  if (!parsed.passages || !Array.isArray(parsed.passages) || parsed.passages.length === 0) {
    throw new Error(`[CMS SCHEMA ERROR] File '${fileName}' must contain a non-empty 'passages' array.`);
  }

  // Passage items validation
  parsed.passages.forEach((p, idx) => {
    if (!p.role) throw new Error(`[CMS SCHEMA ERROR] Passage #${idx + 1} in '${fileName}' missing 'role'.`);
    if (!p.osis) throw new Error(`[CMS SCHEMA ERROR] Passage #${idx + 1} in '${fileName}' missing 'osis'.`);
    if (!p.ref || (typeof p.ref === 'object' && !p.ref.nl && !p.ref.en)) {
      throw new Error(`[CMS SCHEMA ERROR] Passage #${idx + 1} in '${fileName}' missing 'ref' translations.`);
    }
  });

  // Ensure default arrays and objects
  if (!parsed.label) parsed.label = { nl: parsed.parasha, en: parsed.parasha };
  if (!parsed.extra_references) parsed.extra_references = [];

  // Attach Markdown body text if present
  if (markdownBody) {
    if (!parsed.body_nl) parsed.body_nl = markdownBody;
    parsed.body = markdownBody;
  }

  return parsed;
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
    const parsed = parseFrontmatter(content, file);
    if (parsed && (parsed.status === 'published' || !parsed.status)) {
      studies.push(parsed);
    }
  }

  const manifest = {
    _note: "Gegenereerd door scripts/build-passages-index.mjs uit /content/parasjot/*.md via js-yaml met schemavalidatie. NIET handmatig bewerken.",
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
  console.log(`✓ Successfully validated and generated ${outputFile} and ${publicOutputFile} with ${studies.length} studies using js-yaml.`);
}

buildPassagesManifest();
