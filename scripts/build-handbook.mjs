// Builds the handbook pages from content/handleiding/handleiding.md.
//
// The markdown file is the source (frontmatter with body_nl / body_en as HTML,
// like the parasjot). This script injects each body into the page shell of
// nl/handleiding.html and en/handbook.html, regenerates the sidebar and the
// in-page table of contents from the <h1 id> headings, and writes the page only
// when something changed. No language fallback: a page is only rebuilt when its
// own body field is filled.
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
const yaml = require('js-yaml');

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');
const sourceFile = path.join(rootDir, 'content', 'handleiding', 'handleiding.md');

const pages = [
  { lang: 'nl', field: 'body_nl', file: path.join(rootDir, 'nl', 'handleiding.html'), tocTitle: 'Inhoud' },
  { lang: 'en', field: 'body_en', file: path.join(rootDir, 'en', 'handbook.html'), tocTitle: 'Contents' },
];

const MAIN_OPEN = '<main class="manual-content" id="main" tabindex="-1">';
const MAIN_CLOSE = '</main>';
const TOC_MARKER = '<!-- inhoud -->';
// Headings that belong in the page but not in the table of contents.
const SKIP_IDS = new Set(['inhoud', 'contents']);

const stripTags = (value = '') => String(value).replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim();

function readSource() {
  const raw = fs.readFileSync(sourceFile, 'utf8').replace(/^﻿/, '');
  const match = raw.match(/^---\s*\r?\n([\s\S]*?)\r?\n---\s*(?:\r?\n|$)/);
  if (!match) throw new Error(`Geen geldige frontmatter in ${sourceFile}`);
  return yaml.load(match[1]) || {};
}

// Walk the body in document order and collect part headings and chapter headings.
function collectToc(body) {
  const items = [];
  const re = /<p class="part-heading"><strong>([\s\S]*?)<\/strong><\/p>|<h1 id="([^"]+)">([\s\S]*?)<\/h1>/g;
  let m;
  while ((m = re.exec(body))) {
    if (m[1] !== undefined) items.push({ type: 'part', label: stripTags(m[1]) });
    else if (!SKIP_IDS.has(m[2])) items.push({ type: 'chapter', id: m[2], label: stripTags(m[3]) });
  }
  return items;
}

function buildSidebar(items, tocTitle) {
  const links = items
    .filter((item) => item.type === 'chapter')
    .map((item) => `<a href="#${item.id}">${item.label}</a>`)
    .join('');
  return `<aside class="manual-sidebar"><div class="toc-title">${tocTitle}</div>${links}</aside>`;
}

function buildInlineToc(items) {
  return items
    .map((item) => (item.type === 'part'
      ? `<p class="part-heading"><strong>${item.label}</strong></p>`
      : `<p><a href="#${item.id}">${item.label}</a></p>`))
    .join('\n');
}

function buildPage(shell, body, tocTitle) {
  const start = shell.indexOf(MAIN_OPEN);
  const end = shell.indexOf(MAIN_CLOSE, start);
  if (start < 0 || end < 0) throw new Error('Paginaschil zonder <main class="manual-content">');

  const items = collectToc(body);
  const filledBody = body.includes(TOC_MARKER) ? body.replace(TOC_MARKER, buildInlineToc(items)) : body;

  let page = `${shell.slice(0, start + MAIN_OPEN.length)}${filledBody.trim()}\n${shell.slice(end)}`;
  page = page.replace(/<aside class="manual-sidebar">[\s\S]*?<\/aside>/, buildSidebar(items, tocTitle));
  return page;
}

const data = readSource();
for (const { lang, field, file, tocTitle } of pages) {
  const body = data[field];
  if (!body || !String(body).trim()) {
    console.log(`handleiding: ${lang} overgeslagen (${field} is leeg)`);
    continue;
  }
  const shell = fs.readFileSync(file, 'utf8');
  const page = buildPage(shell, String(body), tocTitle);
  if (page !== shell) {
    fs.writeFileSync(file, page, 'utf8');
    console.log(`handleiding: ${path.relative(rootDir, file)} bijgewerkt`);
  } else {
    console.log(`handleiding: ${path.relative(rootDir, file)} ongewijzigd`);
  }
}
