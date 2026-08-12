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

// ── Document type definitions ─────────────────────────────────────────
const DOC_TYPES = [
  { bodyField: 'body',           dir: 'lezingen',      labelNl: 'lezing',       labelEn: 'reading',      titleNl: 'Lezing & Toelichting', titleEn: 'Reading & Commentary' },
  { bodyField: 'study_body',     dir: 'studiebladen',   labelNl: 'studieblad',   labelEn: 'study-sheet',  titleNl: 'Studieblad',           titleEn: 'Study Sheet' },
  { bodyField: 'worksheet_body', dir: 'werkbladen',     labelNl: 'werkblad',     labelEn: 'worksheet',    titleNl: 'Werkblad',             titleEn: 'Worksheet' },
];

// ── Parse frontmatter ─────────────────────────────────────────────────
function parseFrontmatter(fileContent, fileName) {
  const match = fileContent.match(/^---\r?\n([\s\S]+?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return null;

  let parsed;
  try {
    parsed = yaml.load(match[1]);
  } catch (err) {
    console.error(`[DOCS BUILD] YAML error in '${fileName}':`, err.message);
    return null;
  }

  const markdownBody = match[2] ? match[2].trim() : '';
  if (markdownBody && !parsed.body_nl && !parsed.body) {
    parsed.body_nl = markdownBody;
    parsed.body = markdownBody;
  }

  return parsed;
}

// ── Get filename for a document ───────────────────────────────────────
function getDocFilename(id, lang, docType, format) {
  const label = lang === 'nl' ? docType.labelNl : docType.labelEn;
  return `${id}-${label}-${lang}.${format}`;
}

// ── HTML template for PDF rendering ───────────────────────────────────
function buildHtmlDocument({ title, docTypeTitle, summary, bodyHtml, passages, lang }) {
  const isEn = lang === 'en';
  
  const passageLabels = {
    parasha: isEn ? 'Torah' : 'Tora',
    haftara: isEn ? 'Haftarah' : 'Haftara',
    gospel: isEn ? 'Gospel' : 'Evangelie',
  };

  const passagesHtml = (passages || [])
    .map(p => {
      const ref = p.ref ? (isEn ? p.ref.en : p.ref.nl) : '';
      const label = passageLabels[p.role] || p.role;
      return ref ? `<span class="passage-ref"><strong>${label}:</strong> ${ref}</span>` : '';
    })
    .filter(Boolean)
    .join(' &nbsp;·&nbsp; ');

  return `<!DOCTYPE html>
<html lang="${lang}">
<head>
  <meta charset="UTF-8">
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,opsz,wght@0,8..60,400;0,8..60,700;1,8..60,400&family=Inter:wght@400;600;700&display=swap');

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Source Serif 4', Georgia, 'Times New Roman', serif;
      font-size: 16px;
      line-height: 1.75;
      color: #1a1a1a;
      padding: 48px 56px;
      max-width: 800px;
      margin: 0 auto;
    }

    .title-page {
      margin-bottom: 36px;
      padding-bottom: 28px;
      border-bottom: 2px solid #8b6914;
    }
    .doc-type-label {
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      color: #8b6914;
      margin-bottom: 8px;
    }
    .title-page h1 {
      font-family: 'Inter', sans-serif;
      font-size: 30px;
      font-weight: 700;
      color: #1a1a1a;
      margin-bottom: 12px;
      line-height: 1.25;
    }
    .passages-bar {
      font-family: 'Inter', sans-serif;
      font-size: 13px;
      color: #555;
      margin-bottom: 16px;
    }
    .summary-block {
      font-style: italic;
      font-size: 15.5px;
      color: #333;
      border-left: 3px solid #8b6914;
      padding: 12px 18px;
      background: #faf7f0;
      border-radius: 3px;
      line-height: 1.6;
    }

    h2 {
      font-family: 'Inter', sans-serif;
      font-size: 21px;
      font-weight: 700;
      color: #2a2a2a;
      margin-top: 32px;
      margin-bottom: 10px;
    }
    h3 {
      font-family: 'Inter', sans-serif;
      font-size: 18px;
      font-weight: 600;
      color: #333;
      margin-top: 24px;
      margin-bottom: 8px;
    }
    p {
      margin-bottom: 14px;
    }
    blockquote {
      border-left: 3px solid #8b6914;
      padding: 8px 18px;
      margin: 18px 0;
      font-style: italic;
      color: #444;
      background: #faf7f0;
      border-radius: 3px;
    }
    blockquote p { margin-bottom: 4px; }
    em { font-style: italic; }
    strong { font-weight: 700; }
    ul, ol { margin: 12px 0 12px 24px; }
    li { margin-bottom: 6px; }

    .footer {
      margin-top: 48px;
      padding-top: 16px;
      border-top: 1px solid #ddd;
      font-family: 'Inter', sans-serif;
      font-size: 11px;
      color: #999;
      text-align: center;
    }
  </style>
</head>
<body>
  <div class="title-page">
    <div class="doc-type-label">${docTypeTitle}</div>
    <h1>${title}</h1>
    ${passagesHtml ? `<div class="passages-bar">${passagesHtml}</div>` : ''}
    ${summary ? `<div class="summary-block"><p>${summary}</p></div>` : ''}
  </div>
  <div class="body-content">
    ${bodyHtml}
  </div>
  <div class="footer">
    zelfdeparasjalezen.netlify.app — © Arie Alberts
  </div>
</body>
</html>`;
}

// ── Clean HTML snippet for DOCX (NO <head> or <style> tags) ───────────
function buildCleanDocxHtml({ title, docTypeTitle, summary, bodyHtml, passages, lang }) {
  const isEn = lang === 'en';
  const passageLabels = {
    parasha: isEn ? 'Torah' : 'Tora',
    haftara: isEn ? 'Haftarah' : 'Haftara',
    gospel: isEn ? 'Gospel' : 'Evangelie',
  };

  const passagesText = (passages || [])
    .map(p => {
      const ref = p.ref ? (isEn ? p.ref.en : p.ref.nl) : '';
      const label = passageLabels[p.role] || p.role;
      return ref ? `<strong>${label}:</strong> ${ref}` : '';
    })
    .filter(Boolean)
    .join(' &nbsp;·&nbsp; ');

  return `
    <p><font color="#8b6914"><strong>${docTypeTitle.toUpperCase()}</strong></font></p>
    <h1>${title}</h1>
    ${passagesText ? `<p><font color="#555555">${passagesText}</font></p>` : ''}
    ${summary ? `<p><em>${summary}</em></p>` : ''}
    <hr />
    ${bodyHtml}
  `;
}

// ── Clean RTF Document Generator ─────────────────────────────────────
function buildRtfDocument({ title, docTypeTitle, summary, bodyHtml, passages, lang }) {
  const isEn = lang === 'en';
  const passageLabels = {
    parasha: isEn ? 'Torah' : 'Tora',
    haftara: isEn ? 'Haftarah' : 'Haftara',
    gospel: isEn ? 'Gospel' : 'Evangelie',
  };

  const passagesText = (passages || [])
    .map(p => {
      const ref = p.ref ? (isEn ? p.ref.en : p.ref.nl) : '';
      const label = passageLabels[p.role] || p.role;
      return ref ? `${label}: ${ref}` : '';
    })
    .filter(Boolean)
    .join(' | ');

  function decodeEntities(str) {
    if (!str) return '';
    return str
      .replace(/&nbsp;/g, ' ')
      .replace(/&rsquo;/g, "'")
      .replace(/&lsquo;/g, "'")
      .replace(/&rdquo;/g, '"')
      .replace(/&ldquo;/g, '"')
      .replace(/&ndash;/g, '-')
      .replace(/&mdash;/g, '--')
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>');
  }

  function escapeRtfUnicode(str) {
    if (!str) return '';
    return str.replace(/[\u0080-\uffff]/g, (ch) => {
      const code = ch.charCodeAt(0);
      return `\\u${code > 32767 ? code - 65536 : code}?`;
    });
  }

  let body = bodyHtml
    .replace(/<h1[^>]*>(.*?)<\/h1>/gi, '\n\\par\\b\\fs32 $1\\b0\\fs24\\par\n')
    .replace(/<h2[^>]*>(.*?)<\/h2>/gi, '\n\\par\\b\\fs28 $1\\b0\\fs24\\par\n')
    .replace(/<h3[^>]*>(.*?)<\/h3>/gi, '\n\\par\\b\\fs24 $1\\b0\\fs24\\par\n')
    .replace(/<p[^>]*>(.*?)<\/p>/gi, '\n\\par $1\\par\n')
    .replace(/<blockquote[^>]*>(.*?)<\/blockquote>/gi, '\n\\par\\li360\\i $1\\i0\\li0\\par\n')
    .replace(/<strong[^>]*>(.*?)<\/strong>/gi, '\\b $1\\b0 ')
    .replace(/<em[^>]*>(.*?)<\/em>/gi, '\\i $1\\i0 ')
    .replace(/<br\s*\/?>/gi, '\\line ')
    .replace(/<[^>]+>/g, '');

  body = decodeEntities(body);
  body = escapeRtfUnicode(body);

  let header = `{\\rtf1\\ansi\\ansicpg1252\\deff0{\\fonttbl{\\f0\\froman\\fcharset0 Georgia;}{\\f1\\fswiss\\fcharset0 Arial;}}\n\\viewkind4\\uc1 `;
  header += `\\f1\\fs20\\b ${docTypeTitle.toUpperCase()}\\b0\\par\n`;
  header += `\\f1\\fs32\\b ${escapeRtfUnicode(title)}\\b0\\fs24\\par\n`;
  if (passagesText) {
    header += `\\f1\\fs20 ${escapeRtfUnicode(passagesText)}\\par\n`;
  }
  if (summary) {
    header += `\\f0\\fs22\\i ${escapeRtfUnicode(summary)}\\i0\\par\n`;
  }
  header += `\\par\\f0\\fs24 `;

  const footer = `\n\\par\\par\\f1\\fs18 zelfdeparasjalezen.netlify.app -- Arie Alberts\\par\n}`;
  return header + body + footer;
}

// ── Generate PDF via Puppeteer ────────────────────────────────────────
async function generatePdf(browser, htmlContent, outputPath) {
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'networkidle0', timeout: 15000 });
  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: { top: '20mm', bottom: '20mm', left: '18mm', right: '18mm' },
    displayHeaderFooter: false,
  });
  await page.close();
}

// ── Generate DOCX via html-to-docx (using clean HTML snippet) ──────
async function generateDocx(cleanHtml, outputPath) {
  const HTMLtoDOCX = (await import('html-to-docx')).default;
  const buffer = await HTMLtoDOCX(cleanHtml, null, {
    table: { row: { cantSplit: true } },
    footer: true,
    pageNumber: true,
    font: 'Georgia',
    fontSize: 24,    // half-points; 24 = 12pt
    margins: { top: 1440, bottom: 1440, left: 1296, right: 1296 }, // twips; 1440 = 1 inch
  });
  fs.writeFileSync(outputPath, Buffer.from(buffer));
}

// ── Generate RTF ─────────────────────────────────────────────────────
function generateRtf(rtfString, outputPath) {
  fs.writeFileSync(outputPath, rtfString, 'utf-8');
}

// ── Main build function ──────────────────────────────────────────────
async function buildDocs() {
  if (!fs.existsSync(contentDir)) {
    console.error(`Content directory ${contentDir} does not exist.`);
    process.exit(1);
  }

  // Ensure output directories exist
  for (const dt of DOC_TYPES) {
    const dir = path.join(rootDir, 'public', 'downloads', dt.dir);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  }

  const files = fs.readdirSync(contentDir).filter(f => f.endsWith('.md'));
  const validFiles = new Map(); // dir -> Set of filenames

  let puppeteer;
  let browser;
  try {
    puppeteer = await import('puppeteer');
    browser = await puppeteer.default.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
    });
  } catch (err) {
    console.error('[DOCS BUILD] Could not launch Puppeteer:', err.message);
    console.error('[DOCS BUILD] PDF generation will be skipped. Install puppeteer to enable PDF generation.');
    browser = null;
  }

  let generatedCount = 0;

  for (const file of files) {
    const filePath = path.join(contentDir, file);
    const content = fs.readFileSync(filePath, 'utf-8');
    const parsed = parseFrontmatter(content, file);
    if (!parsed || !parsed.id) continue;

    const id = parsed.id;

    for (const docType of DOC_TYPES) {
      for (const lang of ['nl', 'en']) {
        const bodyKey = lang === 'nl'
          ? (docType.bodyField === 'body' ? 'body_nl' : `${docType.bodyField}_nl`)
          : (docType.bodyField === 'body' ? 'body_en' : `${docType.bodyField}_en`);

        const bodyHtml = parsed[bodyKey];
        if (!bodyHtml || bodyHtml.trim().length === 0) continue;

        const title = lang === 'nl'
          ? (parsed.title_nl || parsed.label?.nl || parsed.parasha || id)
          : (parsed.title_en || parsed.label?.en || parsed.parasha || id);

        const summary = lang === 'nl' ? (parsed.summary_nl || '') : (parsed.summary_en || '');
        const docTypeTitle = lang === 'nl' ? docType.titleNl : docType.titleEn;
        const passages = parsed.passages || [];

        const htmlDoc = buildHtmlDocument({ title, docTypeTitle, summary, bodyHtml, passages, lang });
        const cleanDocxHtml = buildCleanDocxHtml({ title, docTypeTitle, summary, bodyHtml, passages, lang });
        const rtfDoc = buildRtfDocument({ title, docTypeTitle, summary, bodyHtml, passages, lang });

        const outDir = path.join(rootDir, 'public', 'downloads', docType.dir);

        if (!validFiles.has(docType.dir)) validFiles.set(docType.dir, new Set());

        // ── PDF ──
        if (browser) {
          const pdfFilename = getDocFilename(id, lang, docType, 'pdf');
          const pdfPath = path.join(outDir, pdfFilename);
          try {
            await generatePdf(browser, htmlDoc, pdfPath);
            validFiles.get(docType.dir).add(pdfFilename);
            generatedCount++;
            console.log(`  ✓ ${docType.dir}/${pdfFilename}`);
          } catch (err) {
            console.error(`  ✗ PDF error for ${pdfFilename}:`, err.message);
          }
        }

        // ── DOCX ──
        const docxFilename = getDocFilename(id, lang, docType, 'docx');
        const docxPath = path.join(outDir, docxFilename);
        try {
          await generateDocx(cleanDocxHtml, docxPath);
          validFiles.get(docType.dir).add(docxFilename);
          generatedCount++;
          console.log(`  ✓ ${docType.dir}/${docxFilename}`);
        } catch (err) {
          console.error(`  ✗ DOCX error for ${docxFilename}:`, err.message);
        }

        // ── RTF ──
        const rtfFilename = getDocFilename(id, lang, docType, 'rtf');
        const rtfPath = path.join(outDir, rtfFilename);
        try {
          generateRtf(rtfDoc, rtfPath);
          validFiles.get(docType.dir).add(rtfFilename);
          generatedCount++;
          console.log(`  ✓ ${docType.dir}/${rtfFilename}`);
        } catch (err) {
          console.error(`  ✗ RTF error for ${rtfFilename}:`, err.message);
        }
      }
    }
  }

  // ── Clean stale files ──────────────────────────────────────────────
  for (const docType of DOC_TYPES) {
    const dir = path.join(rootDir, 'public', 'downloads', docType.dir);
    if (!fs.existsSync(dir)) continue;
    const existing = fs.readdirSync(dir).filter(f => f.endsWith('.pdf') || f.endsWith('.docx') || f.endsWith('.rtf'));
    const valid = validFiles.get(docType.dir) || new Set();
    for (const file of existing) {
      if (!valid.has(file)) {
        fs.unlinkSync(path.join(dir, file));
        console.log(`  - Removed stale: ${docType.dir}/${file}`);
      }
    }
  }

  if (browser) await browser.close();
  console.log(`\n✓ Generated ${generatedCount} documents across ${DOC_TYPES.length} categories.`);
}

buildDocs().catch(err => {
  console.error('Fatal docs build error:', err);
  process.exit(1);
});
