import React, { useState, useEffect, useRef } from 'react';
import { Download, Upload, RotateCcw, BookOpen, Printer, FileText, FileCode, ChevronDown, ChevronUp, HelpCircle, X } from 'lucide-react';
import { fetchPassagesIndex } from '../api/bible';
import { exportStudyToEpub } from '../utils/epub-generator';
import { sanitizeHtml } from '../utils/sanitizer';

function formatBodyHtml(rawText) {

  if (!rawText) return '';

  // If text already contains HTML structure tags, return directly
  if (/<(p|h[1-6]|blockquote|ul|ol|li)\b[^>]*>/i.test(rawText)) {
    return rawText;
  }

  // Otherwise, convert markdown formatting to clean HTML
  let html = rawText
    .replace(/^### (.*$)/gim, '<h3>$1</h3>')
    .replace(/^## (.*$)/gim, '<h2>$1</h2>')
    .replace(/^# (.*$)/gim, '<h1>$1</h1>')
    .replace(/^> (.*$)/gim, 'blockquote><p>$1</p></blockquote>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    .replace(/_(.*?)_/g, '<em>$1</em>');

  const paragraphs = html.split(/\n\s*\n/);
  return paragraphs
    .map(p => {
      const trimmed = p.trim();
      if (!trimmed) return '';
      if (/^<(h[1-6]|blockquote|ul|ol|li)/i.test(trimmed)) {
        return trimmed;
      }
      return `<p>${trimmed.replace(/\n/g, '<br/>')}</p>`;
    })
    .filter(Boolean)
    .join('\n');
}

function getStudyShabbatDate(study) {
  const rawDate = study?.shabbat_date || study?.published_at;
  if (!rawDate) return null;

  const match = String(rawDate).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;

  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day), 12, 0, 0);
  if (Number.isNaN(date.getTime())) return null;

  // Als later expliciet een sjabbatdatum wordt toegevoegd, gebruik die exact.
  // Anders geldt de publicatiedatum als uitgangspunt en nemen we de
  // eerstvolgende zaterdag (of dezelfde dag wanneer het al zaterdag is).
  if (!study?.shabbat_date) {
    const daysUntilSaturday = (6 - date.getDay() + 7) % 7;
    date.setDate(date.getDate() + daysUntilSaturday);
  }

  date.setHours(0, 0, 0, 0);
  return date;
}

function findWeeklyStudy(studies) {
  if (!Array.isArray(studies) || studies.length === 0) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const datedStudies = studies
    .map(study => ({ study, shabbatDate: getStudyShabbatDate(study) }))
    .filter(item => item.shabbatDate);

  const nextStudy = datedStudies
    .filter(item => item.shabbatDate >= today)
    .sort((a, b) => a.shabbatDate - b.shabbatDate)[0];

  if (nextStudy) return nextStudy.study;

  const mostRecentStudy = datedStudies
    .sort((a, b) => b.shabbatDate - a.shabbatDate)[0];

  return mostRecentStudy?.study || studies.find(s => s.current) || studies[0];
}

export default function WorksheetHero({ lang, onStudyChange, autoExpandReading }) {
  const isEn = lang === 'en' || (typeof document !== 'undefined' && document.documentElement.lang === 'en') || (typeof window !== 'undefined' && (window.location.pathname.includes('/en/') || window.location.href.includes('/en/')));
  const fileInputRef = useRef(null);


  const [isReadingExpanded, setIsReadingExpanded] = useState(true);
  const [showUploadInfo, setShowUploadInfo] = useState(false);
  const [availableDownloads, setAvailableDownloads] = useState({});

  useEffect(() => {
    fetch('/data/downloads.json')
      .then(res => res.json())
      .then(data => setAvailableDownloads(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setIsReadingExpanded(true);
  }, [autoExpandReading]);



  const [studies, setStudies] = useState([
    {
      id: 'shoftim',
      parasha: 'Shoftim',
      label: { nl: 'Sjoftim', en: 'Shoftim' },
      download_pdf_nl: '/downloads/lezingen/shoftim-nl.pdf',
      download_docx_nl: '/downloads/lezingen/shoftim-nl.docx',
      download_pdf_en: '/downloads/lezingen/shoftim-en.pdf',
      download_docx_en: '/downloads/lezingen/shoftim-en.docx',
      passages: [
        { role: 'parasha', ref: { nl: 'Deuteronomium 16:18–21:9', en: 'Deuteronomy 16:18–21:9' } },
        { role: 'haftara', ref: { nl: 'Jesaja 51:12–52:12', en: 'Isaiah 51:12–52:12' } },
        { role: 'gospel', ref: { nl: 'Johannes 14:9–20', en: 'John 14:9–20' } }
      ]
    },
    {
      id: 'reeh',
      parasha: "Re'eh",
      label: { nl: 'Re’eh', en: "Re'eh" },
      passages: [
        { role: 'parasha', ref: { nl: 'Deuteronomium 11:26–16:17', en: 'Deuteronomy 11:26–16:17' } },
        { role: 'haftara', ref: { nl: 'Jesaja 54:11–55:5', en: 'Isaiah 54:11–55:5' } },
        { role: 'gospel', ref: { nl: 'Johannes 6:35–51', en: 'John 6:35–51' } }
      ]
    },
    {
      id: 'ekev',
      parasha: 'Ekev',
      label: { nl: 'Ekev', en: 'Eikev' },
      passages: [
        { role: 'parasha', ref: { nl: 'Deuteronomium 7:12–11:25', en: 'Deuteronomy 7:12–11:25' } },
        { role: 'haftara', ref: { nl: 'Jesaja 49:14–51:3', en: 'Isaiah 49:14–51:3' } },
        { role: 'gospel', ref: { nl: 'Mattheüs 16:13–20', en: 'Matthew 16:13–20' } }
      ]
    }
  ]);
  const [selectedStudyId, setSelectedStudyId] = useState('shoftim');

  useEffect(() => {
    fetchPassagesIndex()
      .then(data => {
        if (data.studies && data.studies.length) {
          setStudies(data.studies);
          const activeItem = findWeeklyStudy(data.studies);
          if (activeItem) {
            setSelectedStudyId(activeItem.id);
            if (onStudyChange) onStudyChange(activeItem.id);
          }
        }
      })
      .catch(() => {});
  }, []);

  const handleStudySelect = (id) => {
    setSelectedStudyId(id);
    setIsReadingExpanded(false); // Reset to collapsed on study change
    if (onStudyChange) onStudyChange(id);
  };

  const currentStudy = studies.find(s => s.id === selectedStudyId) || studies[0];

  const getPassageRef = (studyItem, roleName) => {
    if (!studyItem || !studyItem.passages) return '';
    const p = studyItem.passages.find(x => x.role === roleName);
    if (!p || !p.ref) return '';
    if (isEn) {
      return p.ref.en || 'Translation not available';
    }
    return p.ref.nl || 'Vertaling niet beschikbaar';
  };

  const safeGetStorage = (key) => {
    try { return localStorage.getItem(key); } catch (_) { return null; }
  };
  const safeRemoveStorage = (key) => {
    try { localStorage.removeItem(key); } catch (_) {}
  };

  const handleExportJSON = () => {
    const exportBtn = document.getElementById('export-work');
    if (exportBtn) {
      exportBtn.click();
    } else {
      try {
        const stateData = safeGetStorage('frame-parasja-site-v2') || '{}';
        const exportData = {
          version: "2.0",
          timestamp: new Date().toISOString(),
          studyId: selectedStudyId,
          study: currentStudy,
          state: JSON.parse(stateData)
        };
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = isEn ? `${selectedStudyId}-study-backup.json` : `${selectedStudyId}-studie-backup.json`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      } catch (_) {
        alert(isEn ? 'Error exporting data.' : 'Fout bij exporteren.');
      }
    }
  };

  const handleTriggerUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const fileContent = event.target.result;
      try {
        if (file.name.endsWith('.json')) {
          const parsed = JSON.parse(fileContent);
          const importedStudy = parsed.study || parsed;
          if (importedStudy && importedStudy.id) {
            setStudies(prev => {
              const existingIndex = prev.findIndex(s => s.id === importedStudy.id);
              if (existingIndex >= 0) {
                const copy = [...prev];
                copy[existingIndex] = { ...copy[existingIndex], ...importedStudy };
                return copy;
              }
              return [importedStudy, ...prev];
            });
            setSelectedStudyId(importedStudy.id);
            setIsReadingExpanded(false);
            if (onStudyChange) onStudyChange(importedStudy.id);
          }
        } else if (file.name.endsWith('.md')) {
          let frontmatter = {};
          let body = fileContent;
          const fmMatch = fileContent.match(/^---\r?\n([\s\S]+?)\r?\n---\r?\n?([\s\S]*)$/);
          if (fmMatch) {
            body = fmMatch[2].trim();
            const yamlLines = fmMatch[1].split('\n');
            yamlLines.forEach(line => {
              const colonIdx = line.indexOf(':');
              if (colonIdx > 0) {
                const key = line.slice(0, colonIdx).trim();
                const val = line.slice(colonIdx + 1).trim().replace(/^[\"']|[\"']$/g, '');
                if (key) frontmatter[key] = val;
              }
            });
          }

          const fileId = frontmatter.id || file.name.replace(/\.md$/, '').toLowerCase();
          const parashaName = frontmatter.parasha || fileId.charAt(0).toUpperCase() + fileId.slice(1);

          const newStudy = {
            id: fileId,
            parasha: parashaName,
            label: {
              nl: frontmatter.title_nl || frontmatter.label_nl || parashaName,
              en: frontmatter.title_en || frontmatter.label_en || parashaName
            },
            download_pdf_nl: frontmatter.download_pdf_nl,
            download_docx_nl: frontmatter.download_docx_nl,
            download_pdf_en: frontmatter.download_pdf_en,
            download_docx_en: frontmatter.download_docx_en,
            passages: frontmatter.passages ? JSON.parse(frontmatter.passages) : currentStudy.passages,
            body_nl: frontmatter.body_nl || body,
            body_en: frontmatter.body_en || body
          };

          setStudies(prev => {
            const idx = prev.findIndex(s => s.id === newStudy.id);
            if (idx >= 0) {
              const updated = [...prev];
              updated[idx] = { ...updated[idx], ...newStudy };
              return updated;
            }
            return [newStudy, ...prev];
          });
          setSelectedStudyId(newStudy.id);
          setIsReadingExpanded(false);
          if (onStudyChange) onStudyChange(newStudy.id);
        }
      } catch (err) {
        alert(isEn ? 'Could not parse uploaded file.' : 'Kan het geüploade bestand niet verwerken.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handlePrintPDF = (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    window.print();
  };

  const handleExportEPUB = async (e) => {
    if (e && e.stopPropagation) e.stopPropagation();
    try {
      await exportStudyToEpub(currentStudy, lang);
    } catch (err) {
      alert(isEn ? 'Error generating EPUB file.' : 'Fout bij het maken van het EPUB-bestand.');
    }
  };

  const handleReset = () => {
    const resetBtn = document.getElementById('reset-work');
    if (resetBtn) {
      resetBtn.click();
    } else {
      const msg = isEn
        ? 'Clear all checkmarks and notes on this page?'
        : 'Alle vinkjes en aantekeningen op deze pagina wissen?';
      if (window.confirm(msg)) {
        safeRemoveStorage('frame-parasja-site-v2');
        window.location.reload();
      }
    }
  };

  const displayTitle = isEn
    ? (currentStudy?.title_en || currentStudy?.label?.en || currentStudy?.parasha)
    : (currentStudy?.title_nl || currentStudy?.label?.nl || currentStudy?.parasha);

  const displaySummary = isEn
    ? currentStudy?.summary_en
    : currentStudy?.summary_nl;

  const hasBody = isEn
    ? Boolean(currentStudy?.body_en && currentStudy.body_en.trim().length > 0)
    : Boolean((currentStudy?.body_nl || currentStudy?.body) && (currentStudy?.body_nl || currentStudy?.body).trim().length > 0);

  const rawBodyText = isEn
    ? (hasBody ? currentStudy?.body_en : '')
    : (currentStudy?.body_nl || currentStudy?.body || '');

  const sanitizedBodyHtml = hasBody ? sanitizeHtml(formatBodyHtml(rawBodyText)) : '';

  const getDownloadUrl = (url) => {
    if (!url) return null;
    const normalized = url.startsWith('/') ? url : `/${url}`;
    return availableDownloads[normalized] ? normalized : null;
  };

  // Convention-based document paths — matches build-docs.mjs naming
  const docLabel = (type, lang) => {
    const labels = {
      lezing: { nl: 'lezing', en: 'reading' },
      studieblad: { nl: 'studieblad', en: 'study-sheet' },
      werkblad: { nl: 'werkblad', en: 'worksheet' },
    };
    return labels[type]?.[lang] || type;
  };
  const curLang = isEn ? 'en' : 'nl';
  const curId = currentStudy?.id || selectedStudyId;

  const pdfUrl = getDownloadUrl(`/downloads/lezingen/${curId}-${docLabel('lezing', curLang)}-${curLang}.pdf`);
  const rtfUrl = getDownloadUrl(`/downloads/lezingen/${curId}-${docLabel('lezing', curLang)}-${curLang}.rtf`);
  const studyPdfUrl = getDownloadUrl(`/downloads/studiebladen/${curId}-${docLabel('studieblad', curLang)}-${curLang}.pdf`);
  const studyRtfUrl = getDownloadUrl(`/downloads/studiebladen/${curId}-${docLabel('studieblad', curLang)}-${curLang}.rtf`);
  const worksheetPdfUrl = getDownloadUrl(`/downloads/werkbladen/${curId}-${docLabel('werkblad', curLang)}-${curLang}.pdf`);
  const worksheetRtfUrl = getDownloadUrl(`/downloads/werkbladen/${curId}-${docLabel('werkblad', curLang)}-${curLang}.rtf`);
  const epubUrlRaw = `/downloads/epub/${selectedStudyId}-${curLang}.epub`;
  const epubUrl = hasBody ? getDownloadUrl(epubUrlRaw) : null;

  const handlePrint = () => {
    window.print();
  };

  const handleOpenBiblePassage = (role) => {
    window.dispatchEvent(new CustomEvent('open-bible-section', { detail: { section: role } }));

    const readerEl = document.getElementById('react-bible-reader-root') || document.getElementById('bible-reader');
    if (readerEl) {
      readerEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <div className="hero-card standalone-reading-view" style={{ width: '100%', maxWidth: '100%' }}>
      {/* Hidden File Input for Single File Upload (.md / .json) */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".md,.json"
        style={{ display: 'none' }}
      />

      {/* Standalone Full-Width Published Reading & Commentary Card */}
      <div className="intro-section-card parasha-editorial-card" style={{ width: '100%', maxWidth: '100%', padding: '36px 32px' }}>

        {/* Compact Parashah Selector & Passage References Bar */}
        <div className="reading-control-bar" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', marginBottom: '24px', paddingBottom: '20px', borderBottom: '1px solid var(--line)' }}>

          {/* Left: Select Parashah Dropdown & Passages */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <label style={{ fontWeight: 700, fontSize: '15px', color: 'var(--accent-dark)' }}>
                {isEn ? 'Parashah:' : 'Parasja:'}
              </label>
              <select
                value={selectedStudyId}
                onChange={(e) => handleStudySelect(e.target.value)}
                className="parasja-selector-select"
                style={{ padding: '8px 14px', fontSize: '15px', fontWeight: 600, borderRadius: '4px', border: '1px solid var(--line)', background: 'var(--paper)', cursor: 'pointer' }}
              >
                {studies.map((s) => {
                  const name = isEn
                    ? (s.label?.en || s.parasha || 'Translation not available')
                    : (s.label?.nl || s.parasha || 'Vertaling niet beschikbaar');
                  const torahRef = getPassageRef(s, 'parasha');
                  const labelText = torahRef ? `${name} (${torahRef})` : name;
                  return (
                    <option key={s.id} value={s.id}>
                      {labelText}
                    </option>
                  );
                })}
              </select>
            </div>

            {/* Quick Passage Badges - Clickable to open Bible Reader */}
            <div style={{ display: 'inline-flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
              {currentStudy?.passages?.some(p => p.role === 'parasha') && (
                <button
                  type="button"
                  className="passage-badge-chip interactive-chip"
                  onClick={() => handleOpenBiblePassage('parasha')}
                  title={isEn ? "Open Torah / Parashah in Bible Reader" : "Open Torah / Parasja in Bijbelreader"}
                >
                  <strong>{isEn ? 'Torah:' : 'Tora:'}</strong> {getPassageRef(currentStudy, 'parasha')}
                </button>
              )}
              {currentStudy?.passages?.some(p => p.role === 'haftara') && (
                <button
                  type="button"
                  className="passage-badge-chip interactive-chip"
                  onClick={() => handleOpenBiblePassage('haftara')}
                  title={isEn ? "Open Haftarah in Bible Reader" : "Open Haftara in Bijbelreader"}
                >
                  <strong>{isEn ? 'Haftarah:' : 'Haftara:'}</strong> {getPassageRef(currentStudy, 'haftara')}
                </button>
              )}
              {currentStudy?.passages?.some(p => p.role === 'gospel') && (
                <button
                  type="button"
                  className="passage-badge-chip interactive-chip"
                  onClick={() => handleOpenBiblePassage('gospel')}
                  title={isEn ? "Open Gospel in Bible Reader" : "Open Evangelie in Bijbelreader"}
                >
                  <strong>{isEn ? 'Gospel:' : 'Evangelie:'}</strong> {getPassageRef(currentStudy, 'gospel')}
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Reading Section Header & Action Bar on the same line */}
        <div
          className="section-header"
          style={{ marginBottom: '24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px', userSelect: 'none' }}
        >
          {/* Left: Title & Icon (Clickable to collapse/expand) */}
          <div
            style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}
            onClick={() => setIsReadingExpanded(!isReadingExpanded)}
            title={isReadingExpanded ? (isEn ? "Click to collapse" : "Klik om in te klappen") : (isEn ? "Click to expand" : "Klik om te openen")}
          >
            <BookOpen className="section-header-icon" size={28} />
            <h2 style={{ fontSize: '28px', margin: 0 }}>
              {displayTitle || (isEn ? 'Published Reading & Commentary' : 'Gepubliceerde Lezing & Toelichting')}
            </h2>
          </div>

          {/* Right: Publication Download Actions, EPUB, Print & Collapse Toggle on the SAME line */}
          <div id="study-print-options" className="editorial-download-actions reading-actions" style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center', scrollMarginTop: '96px' }}>
            {pdfUrl && (
              <a href={pdfUrl} download className="passage-action-badge" title={isEn ? "Download PDF" : "Download PDF-lezing"}>
                <FileText size={15} />
                <span>PDF</span>
              </a>
            )}

            {rtfUrl && (
              <a href={rtfUrl} download className="passage-action-badge" title={isEn ? "RTF (Rich Text Format)" : "RTF (Rich Text)"}>
                <FileText size={15} />
                <span>RTF</span>
              </a>
            )}

            {studyPdfUrl && (
              <a href={studyPdfUrl} download className="passage-action-badge" title={isEn ? "Download Study Sheet PDF" : "Download Studieblad PDF"}>
                <FileText size={15} />
                <span>{isEn ? 'Study Sheet (PDF)' : 'Studieblad (PDF)'}</span>
              </a>
            )}

            {studyRtfUrl && (
              <a href={studyRtfUrl} download className="passage-action-badge" title={isEn ? "Download Study Sheet RTF" : "Download Studieblad RTF"}>
                <FileText size={15} />
                <span>{isEn ? 'Study Sheet (RTF)' : 'Studieblad (RTF)'}</span>
              </a>
            )}

            {worksheetPdfUrl && (
              <a href={worksheetPdfUrl} download className="passage-action-badge" title={isEn ? "Download Worksheet PDF" : "Download Werkblad PDF"}>
                <FileText size={15} />
                <span>{isEn ? 'Worksheet (PDF)' : 'Werkblad (PDF)'}</span>
              </a>
            )}

            {worksheetRtfUrl && (
              <a href={worksheetRtfUrl} download className="passage-action-badge" title={isEn ? "Download Worksheet RTF" : "Download Werkblad RTF"}>
                <FileText size={15} />
                <span>{isEn ? 'Worksheet (RTF)' : 'Werkblad (RTF)'}</span>
              </a>
            )}

            {/* EPUB Link: Rendered ONLY if a body exists for the current language */}
            {epubUrl && (
              <a href={epubUrl} download className="passage-action-badge" title={isEn ? "Download EPUB" : "Download EPUB-bestand"}>
                <BookOpen size={15} />
                <span>EPUB</span>
              </a>
            )}

            {/* Print / Save as PDF Button */}
            <button type="button" onClick={handlePrint} className="passage-action-badge" title={isEn ? "Print / save as PDF" : "Print / opslaan als PDF"}>
              <Printer size={15} />
              <span>{isEn ? 'Print / save as PDF' : 'Print / opslaan als PDF'}</span>
            </button>

            {/* Collapse / Expand Toggle Button */}
            <button
              type="button"
              className="btn-secondary"
              onClick={() => setIsReadingExpanded(!isReadingExpanded)}
              aria-expanded={isReadingExpanded}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', padding: '7px 16px', fontSize: '14px', fontWeight: 600 }}
            >
              <span>
                {isReadingExpanded
                  ? (isEn ? 'Inklappen ▲' : 'Inklappen ▲')
                  : (isEn ? 'Bible Passages & Self-Study ▼' : 'Bijbelgedeeltes en zelfstudie ▼')}
              </span>
              {isReadingExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          </div>
        </div>

        {/* Complete Published Reading Commentary Article — Collapsable */}
        {isReadingExpanded && (
          <article className="reading-publication" style={{ width: '100%', maxWidth: '100%' }}>
            {displayTitle && (
              <h1 className="reading-title" style={{ fontSize: '30px', fontFamily: '"Source Serif 4", Georgia, serif', fontWeight: 700, margin: '0 0 16px', color: 'var(--ink)' }}>
                {displayTitle}
              </h1>
            )}

            {hasBody && displaySummary && (
              <div className="reading-summary" style={{ fontStyle: 'italic', background: 'var(--soft)', padding: '16px 20px', marginBottom: '24px', borderLeft: '4px solid var(--accent)', borderRadius: '4px', fontSize: '17px', color: 'var(--ink)' }}>
                <p style={{ margin: 0 }}>{displaySummary}</p>
              </div>
            )}

            {hasBody ? (
              <div
                className="section-content-text editorial-body-content reading-body"
                style={{ width: '100%', maxWidth: '100%' }}
                dangerouslySetInnerHTML={{ __html: sanitizedBodyHtml }}
              />
            ) : (
              <div className="no-body-notice" style={{ padding: '24px', background: 'var(--soft)', borderRadius: '6px', fontSize: '16px', color: 'var(--muted)', fontStyle: 'italic' }}>
                {isEn ? 'English reading not yet available.' : 'Nederlandse lezing nog niet beschikbaar.'}
              </div>
            )}
          </article>
        )}
      </div>
    </div>
  );
}






