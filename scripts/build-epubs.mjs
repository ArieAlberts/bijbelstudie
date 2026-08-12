import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const yaml = require('js-yaml');
const JSZip = require('jszip');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const contentDir = path.join(rootDir, 'content', 'parasjot');
const publicEpubDir = path.join(rootDir, 'public', 'downloads', 'epub');

function parseFrontmatter(fileContent, fileName) {
  const match = fileContent.match(/^---\r?\n([\s\S]+?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return null;

  const yamlStr = match[1];
  const markdownBody = match[2] ? match[2].trim() : '';

  let parsed;
  try {
    parsed = yaml.load(yamlStr);
  } catch (err) {
    console.error(`[EPUB BUILD ERROR] Failed parsing YAML in '${fileName}':`, err.message);
    return null;
  }

  if (markdownBody) {
    if (!parsed.body_nl && !parsed.body) parsed.body_nl = markdownBody;
    if (!parsed.body) parsed.body = markdownBody;
  }

  return parsed;
}

function escapeXml(unsafe) {
  if (!unsafe) return '';
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

function convertHtmlToXml(html) {
  if (!html) return '';
  return html
    .replace(/<br\s*\/?>/gi, '<br/>')
    .replace(/<hr\s*\/?>/gi, '<hr/>')
    .replace(/<img([^>]+)\/?>/gi, '<img$1/>');
}

async function createEpubBuffer({ id, lang, title, summary, body, author = 'Arie Alberts' }) {
  const zip = new JSZip();

  // 1. mimetype (must be uncompressed application/epub+zip)
  zip.file('mimetype', 'application/epub+zip', { compression: 'STORE' });

  // 2. META-INF/container.xml
  const containerXml = `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="EPUB/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`;
  zip.file('META-INF/container.xml', containerXml);

  // 3. EPUB/nav.xhtml
  const navXhtml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:epub="http://www.idpf.org/2007/ops" lang="${lang}" xml:lang="${lang}">
<head>
  <meta charset="utf-8"/>
  <title>${escapeXml(title)}</title>
</head>
<body>
  <nav epub:type="toc" id="toc">
    <h1>${escapeXml(title)}</h1>
    <ol>
      <li><a href="chapter.xhtml">${escapeXml(title)}</a></li>
    </ol>
  </nav>
</body>
</html>`;
  zip.file('EPUB/nav.xhtml', navXhtml);

  // 4. EPUB/chapter.xhtml
  const bodyXml = convertHtmlToXml(body);
  const chapterXhtml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html>
<html xmlns="http://www.w3.org/1999/xhtml" lang="${lang}" xml:lang="${lang}">
<head>
  <meta charset="utf-8"/>
  <title>${escapeXml(title)}</title>
  <style>
    body { font-family: "Source Serif 4", Georgia, serif; margin: 5%; line-height: 1.6; color: #261d16; background: #f8f4ef; }
    h1 { font-size: 1.8em; margin-bottom: 0.5em; text-align: center; color: #261d16; }
    h2 { font-size: 1.3em; margin-top: 1.2em; margin-bottom: 0.4em; color: #954c28; }
    .summary { font-style: italic; background: #f6f1eb; padding: 1em; margin-bottom: 1.5em; border-left: 3px solid #954c28; border-radius: 4px; }
    blockquote { margin: 1em 0; padding-left: 1em; border-left: 3px solid #954c28; font-style: italic; }
    p { margin-bottom: 1em; text-align: justify; }
  </style>
</head>
<body>
  <article>
    <h1>${escapeXml(title)}</h1>
    ${summary ? `<div class="summary"><p>${escapeXml(summary)}</p></div>` : ''}
    <div class="content">
      ${bodyXml}
    </div>
  </article>
</body>
</html>`;
  zip.file('EPUB/chapter.xhtml', chapterXhtml);

  // 5. EPUB/content.opf
  const identifier = `parasja:${id}:${lang}`;
  const opfXml = `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="pub-id" version="3.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/">
    <dc:identifier id="pub-id">${escapeXml(identifier)}</dc:identifier>
    <dc:title>${escapeXml(title)}</dc:title>
    <dc:language>${lang}</dc:language>
    <dc:creator>${escapeXml(author)}</dc:creator>
    ${summary ? `<dc:description>${escapeXml(summary)}</dc:description>` : ''}
    <meta property="dcterms:modified">${new Date().toISOString().replace(/\.\d+Z$/, 'Z')}</meta>
  </metadata>
  <manifest>
    <item id="nav" href="nav.xhtml" media-type="application/xhtml+xml" properties="nav"/>
    <item id="chapter" href="chapter.xhtml" media-type="application/xhtml+xml"/>
  </manifest>
  <spine>
    <itemref idref="chapter"/>
  </spine>
</package>`;
  zip.file('EPUB/content.opf', opfXml);

  return zip.generateAsync({ type: 'nodebuffer', mimeType: 'application/epub+zip' });
}

async function generateEpubFiles() {
  if (!fs.existsSync(contentDir)) {
    console.error(`Content directory ${contentDir} does not exist.`);
    process.exit(1);
  }

  if (!fs.existsSync(publicEpubDir)) {
    fs.mkdirSync(publicEpubDir, { recursive: true });
  }

  const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));
  const validEpubFilenames = new Set();
  let generatedCount = 0;

  for (const file of files) {
    const filePath = path.join(contentDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const parsed = parseFrontmatter(content, file);
    if (!parsed || !parsed.id) continue;

    const id = parsed.id;

    // Dutch EPUB
    const bodyNl = parsed.body_nl || parsed.body;
    if (bodyNl && bodyNl.trim().length > 0) {
      const titleNl = parsed.title_nl || parsed.label?.nl || parsed.parasha || id;
      const summaryNl = parsed.summary_nl || '';
      const filename = `${id}-nl.epub`;
      const outputPath = path.join(publicEpubDir, filename);

      const buffer = await createEpubBuffer({ id, lang: 'nl', title: titleNl, summary: summaryNl, body: bodyNl });
      fs.writeFileSync(outputPath, buffer);
      validEpubFilenames.add(filename);
      generatedCount++;
    }

    // English EPUB — STRICT RULE: ONLY if body_en exists and is non-empty!
    const bodyEn = parsed.body_en;
    if (bodyEn && bodyEn.trim().length > 0) {
      const titleEn = parsed.title_en || parsed.label?.en || parsed.parasha || id;
      const summaryEn = parsed.summary_en || '';
      const filename = `${id}-en.epub`;
      const outputPath = path.join(publicEpubDir, filename);

      const buffer = await createEpubBuffer({ id, lang: 'en', title: titleEn, summary: summaryEn, body: bodyEn });
      fs.writeFileSync(outputPath, buffer);
      validEpubFilenames.add(filename);
      generatedCount++;
    }
  }

  // Clean stale EPUB files if bodies were removed
  const existingEpubFiles = fs.readdirSync(publicEpubDir).filter(f => f.endsWith('.epub'));
  for (const existingFile of existingEpubFiles) {
    if (!validEpubFilenames.has(existingFile)) {
      const stalePath = path.join(publicEpubDir, existingFile);
      fs.unlinkSync(stalePath);
      console.log(`- Removed stale EPUB file: ${existingFile}`);
    }
  }

  console.log(`✓ Successfully generated ${generatedCount} EPUB archives in ${publicEpubDir}.`);
}

generateEpubFiles().catch(err => {
  console.error('Fatal EPUB build error:', err);
  process.exit(1);
});
