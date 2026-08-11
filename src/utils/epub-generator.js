import JSZip from 'jszip';

/**
 * Generates and downloads an EPUB file for a given Parashah study.
 * @param {Object} study - The study object containing parasha, label, passages, body_nl, body_en.
 * @param {string} lang - 'nl' or 'en'
 */
export async function exportStudyToEpub(study, lang = 'nl') {
  const isEn = lang === 'en';
  const zip = new JSZip();

  const title = isEn
    ? (study?.label?.en || study?.parasha || 'Parashah Study')
    : (study?.label?.nl || study?.parasha || 'Parasja Studie');

  const subtitle = isEn ? 'The Weekly Parashah Study' : 'De wekelijkse parasjastudie';
  const author = 'Arie Alberts · Het Frame';
  const language = isEn ? 'en' : 'nl';
  const dateStr = new Date().toISOString().split('T')[0];
  const fileId = `study-${study?.id || 'parasha'}-${language}`;

  // Get body content
  let rawBody = isEn
    ? (study?.body_en || study?.body || '')
    : (study?.body_nl || study?.body || '');

  // Extract passages
  const passagesList = (study?.passages || []).map(p => {
    const roleLabel = p.role === 'parasha' ? (isEn ? 'Torah' : 'Torah')
      : p.role === 'haftara' ? 'Haftara'
      : (isEn ? 'Gospel' : 'Evangelie');
    const ref = isEn ? (p.ref?.en || '') : (p.ref?.nl || '');
    return `<li><strong>${roleLabel}:</strong> ${ref}</li>`;
  }).join('\n');

  // Format body to valid XHTML
  let xhtmlBody = rawBody;
  if (!xhtmlBody.includes('<p>')) {
    xhtmlBody = xhtmlBody.split('\n\n').map(para => `<p>${para.replace(/\n/g, '<br/>')}</p>`).join('\n');
  }

  // Ensure self-closing tags for XHTML
  xhtmlBody = xhtmlBody
    .replace(/<br>/g, '<br/>')
    .replace(/<hr>/g, '<hr/>')
    .replace(/&nbsp;/g, ' ');

  // 1. mimetype (MUST be uncompressed)
  zip.file('mimetype', 'application/epub+zip', { compression: 'STORE' });

  // 2. META-INF/container.xml
  zip.file('META-INF/container.xml', `<?xml version="1.0" encoding="UTF-8"?>
<container version="1.0" xmlns="urn:oasis:names:tc:opendocument:xmlns:container">
  <rootfiles>
    <rootfile full-path="OEBPS/content.opf" media-type="application/oebps-package+xml"/>
  </rootfiles>
</container>`);

  // 3. OEBPS/style.css
  zip.file('OEBPS/style.css', `
body {
  font-family: Georgia, serif;
  margin: 1.5em;
  line-height: 1.6;
  color: #1c1917;
}
h1 {
  font-size: 1.8em;
  color: #78350f;
  border-bottom: 2px solid #f59e0b;
  padding-bottom: 0.3em;
  margin-bottom: 0.2em;
}
.subtitle {
  font-style: italic;
  color: #6b7280;
  margin-bottom: 1.5em;
}
.passages-box {
  background-color: #fef3c7;
  border-left: 4px solid #f59e0b;
  padding: 1em;
  margin-bottom: 2em;
  border-radius: 4px;
}
.passages-box h2 {
  font-size: 1.1em;
  margin-top: 0;
  color: #92400e;
}
.passages-box ul {
  margin: 0;
  padding-left: 1.2em;
}
h2 {
  font-size: 1.3em;
  color: #78350f;
  margin-top: 1.8em;
  margin-bottom: 0.5em;
}
blockquote {
  margin: 1.5em 0;
  padding: 0.8em 1.2em;
  background: #fdf6e3;
  border-left: 4px solid #d97706;
  font-style: italic;
}
blockquote p {
  margin: 0;
}
p {
  margin-bottom: 1.2em;
  text-align: justify;
}
`);

  // 4. OEBPS/study.html
  zip.file('OEBPS/study.html', `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xml:lang="${language}">
<head>
  <title>${title}</title>
  <link rel="stylesheet" type="text/css" href="style.css"/>
</head>
<body>
  <h1>${title}</h1>
  <div class="subtitle">${subtitle} · ${author}</div>

  <div class="passages-box">
    <h2>${isEn ? 'Bible Passages' : 'Bijbelgedeelten'}</h2>
    <ul>
      ${passagesList}
    </ul>
  </div>

  <div class="reading-body">
    ${xhtmlBody}
  </div>
</body>
</html>`);

  // 5. OEBPS/toc.ncx
  zip.file('OEBPS/toc.ncx', `<?xml version="1.0" encoding="UTF-8"?>
<ncx xmlns="http://www.maping.org/2005/ncx/" version="2005-1">
  <head>
    <meta name="dtb:uid" content="urn:uuid:${fileId}"/>
    <meta name="dtb:depth" content="1"/>
    <meta name="dtb:totalPageCount" content="0"/>
    <meta name="dtb:maxPageNumber" content="0"/>
  </head>
  <docTitle><text>${title}</text></docTitle>
  <navMap>
    <navPoint id="navpoint-1" playOrder="1">
      <navLabel><text>${title}</text></navLabel>
      <content src="study.html"/>
    </navPoint>
  </navMap>
</ncx>`);

  // 6. OEBPS/content.opf
  zip.file('OEBPS/content.opf', `<?xml version="1.0" encoding="UTF-8"?>
<package xmlns="http://www.idpf.org/2007/opf" unique-identifier="BookId" version="2.0">
  <metadata xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:opf="http://www.idpf.org/2007/opf">
    <dc:title>${title}</dc:title>
    <dc:creator opf:role="aut">${author}</dc:creator>
    <dc:language>${language}</dc:language>
    <dc:date>${dateStr}</dc:date>
    <dc:identifier id="BookId">urn:uuid:${fileId}</dc:identifier>
  </metadata>
  <manifest>
    <item id="ncx" href="toc.ncx" media-type="application/x-dtbncx+xml"/>
    <item id="style" href="style.css" media-type="text/css"/>
    <item id="study" href="study.html" media-type="application/xhtml+xml"/>
  </manifest>
  <spine toc="ncx">
    <itemref idref="study"/>
  </spine>
</package>`);

  // Generate blob & download
  const content = await zip.generateAsync({ type: 'blob', mimeType: 'application/epub+zip' });
  const url = URL.createObjectURL(content);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${study?.id || 'parasja'}-${language}.epub`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}
