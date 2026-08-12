import React, { useState, useEffect, useRef } from 'react';
import { Download, Upload, RotateCcw, BookOpen, Printer, FileText, FileCode, ChevronDown, ChevronUp, HelpCircle, X } from 'lucide-react';
import { fetchPassagesIndex } from '../api/bible';
import { exportStudyToEpub } from '../utils/epub-generator';

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

export default function WorksheetHero({ lang, onStudyChange, autoExpandReading }) {
  const isEn = lang === 'en';
  const fileInputRef = useRef(null);

  const [isReadingExpanded, setIsReadingExpanded] = useState(true);
  const [showUploadInfo, setShowUploadInfo] = useState(false);

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
          const activeItem = data.studies.find(s => s.current) || data.studies[0];
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
                const val = line.slice(colonIdx + 1).trim().replace(/^["']|["']$/g, '');
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

  const rawContent = isEn
    ? (currentStudy?.body_en || 'English reading not yet available.')
    : (currentStudy?.body_nl || currentStudy?.body || 'Nederlandse lezing nog niet beschikbaar.');

  const formattedHtml = formatBodyHtml(rawContent);

  const pdfUrl = isEn
    ? (currentStudy?.download_pdf_en || currentStudy?.download_pdf_nl)
    : (currentStudy?.download_pdf_nl || currentStudy?.download_pdf_en);

  const docxUrl = isEn
    ? (currentStudy?.download_docx_en || currentStudy?.download_docx_nl)
    : (currentStudy?.download_docx_nl || currentStudy?.download_docx_en);

  return (
    <div className="hero-card">
      <div className="hero-eyebrow">{isEn ? 'The weekly parashah' : 'De wekelijkse parasja'}</div>
      <h1 className="hero-title">{isEn ? 'Read and explore the parashah' : 'Lees en onderzoek de parasja'}</h1>
      <p className="hero-subtitle">
        {isEn
          ? 'Choose the parashah and take time to read the text for yourself. The questions help you stay attentive to the text. The method and handbook are available when you need further explanation.'
          : 'Kies de parasja en neem de tijd om de tekst zelf te lezen. De vragen helpen je aandachtig bij de tekst te blijven. De methode en handleiding zijn beschikbaar wanneer je extra uitleg nodig hebt.'}
      </p>

      {/* Hidden File Input for Single File Upload (.md / .json) */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".md,.json"
        style={{ display: 'none' }}
      />

      {/* Parasja Selector Dropdown with Torah Reference */}
      <div className="parasja-selector-container">
        <label className="parasja-selector-label">
          {isEn ? 'Select a parashah:' : 'Selecteer een parasja:'}
        </label>
        <select
          value={selectedStudyId}
          onChange={(e) => handleStudySelect(e.target.value)}
          className="parasja-selector-select"
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

      {/* Prominent Bible Passage References Card */}
      <div className="passages-summary-box">
        <div className="passages-summary-header" style={{ marginBottom: '12px' }}>
          <div className="passages-summary-title" style={{ margin: 0 }}>
            <BookOpen size={18} className="btn-icon" />
            <span>{isEn ? 'Bible passages for this reading:' : 'Bijbelgedeelten bij deze lezing:'}</span>
          </div>
        </div>

        <div className="passages-summary-grid">
          {currentStudy?.passages?.some(p => p.role === 'parasha') && (
            <div className="passage-item">
              <span className="passage-role">{isEn ? 'Torah / Parashah:' : 'Torah / Parasja:'}</span>
              <span className="passage-ref-text">{getPassageRef(currentStudy, 'parasha')}</span>
            </div>
          )}
          {currentStudy?.passages?.some(p => p.role === 'haftara') && (
            <div className="passage-item">
              <span className="passage-role">Haftara:</span>
              <span className="passage-ref-text">{getPassageRef(currentStudy, 'haftara')}</span>
            </div>
          )}
          {currentStudy?.passages?.some(p => p.role === 'gospel') && (
            <div className="passage-item">
              <span className="passage-role">{isEn ? 'Gospel:' : 'Evangelie:'}</span>
              <span className="passage-ref-text">{getPassageRef(currentStudy, 'gospel')}</span>
            </div>
          )}
        </div>
      </div>


      {/* Standalone Published Reading & Commentary Card (Same clean layout as Wat is de parasja) */}
      <div className="intro-section-card parasha-editorial-card" style={{ marginTop: '24px' }}>
        <div className={`editorial-header-bar ${isReadingExpanded ? 'expanded' : ''}`}>
          <button
            type="button"
            className="editorial-toggle-btn"
            onClick={() => setIsReadingExpanded(!isReadingExpanded)}
            aria-expanded={isReadingExpanded}
          >
            <div className="toggle-btn-left">
              <BookOpen size={20} className="toggle-btn-icon" style={{ color: 'var(--accent)' }} />
              <span className="editorial-body-title" style={{ margin: 0, fontSize: '22px', fontWeight: 700 }}>
                {isEn ? 'Published Reading & Commentary' : 'Gepubliceerde Lezing & Toelichting'}
              </span>
            </div>
            <div className="toggle-btn-right">
              <span className="toggle-label-text">
                {isReadingExpanded
                  ? (isEn ? 'Collapse ▲' : 'Inklappen ▲')
                  : (isEn ? 'Read commentary ▶' : 'Lees de gepubliceerde lezing ▶')}
              </span>
              {isReadingExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </div>
          </button>

          {/* Action Badges attached directly to Gepubliceerde Lezing */}
          <div className="editorial-download-actions" onClick={(e) => e.stopPropagation()}>
            {pdfUrl ? (
              <a
                href={pdfUrl}
                download
                className="passage-action-badge"
                title={isEn ? "Download PDF reading" : "Download PDF-lezing"}
                onClick={(e) => e.stopPropagation()}
              >
                <FileText size={15} />
                <span>PDF</span>
              </a>
            ) : (
              <button
                type="button"
                onClick={handlePrintPDF}
                className="passage-action-badge"
                title={isEn ? "Print / Save PDF" : "Afdrukken / Opslaan als PDF"}
              >
                <FileText size={15} />
                <span>PDF</span>
              </button>
            )}

            {docxUrl && (
              <a
                href={docxUrl}
                download
                className="passage-action-badge"
                title={isEn ? "Download Word (DOCX) reading" : "Download Word (DOCX)-lezing"}
                onClick={(e) => e.stopPropagation()}
              >
                <FileCode size={15} />
                <span>DOCX</span>
              </a>
            )}

            <button
              type="button"
              onClick={handleExportEPUB}
              className="passage-action-badge"
              title={isEn ? "Download EPUB e-book" : "Download EPUB e-book"}
            >
              <BookOpen size={15} />
              <span>EPUB</span>
            </button>

            <button
              type="button"
              onClick={handlePrintPDF}
              className="passage-action-badge"
              title={isEn ? "Print reading" : "Afdrukken"}
            >
              <Printer size={15} />
              <span>{isEn ? 'Print' : 'Druk af'}</span>
            </button>
          </div>
        </div>

        {isReadingExpanded && (
          <div
            className="section-content-text editorial-body-content"
            style={{ marginTop: '20px' }}
            dangerouslySetInnerHTML={{ __html: formattedHtml }}
          />
        )}
      </div>


      {/* Action Buttons: Upload, Export JSON, Reset */}
      <div className="hero-action-buttons" style={{ position: 'relative' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
          <button type="button" className="btn-secondary" onClick={handleTriggerUpload} title={isEn ? "Upload .md or .json study file" : "Upload .md of .json studiebestand"}>
            <Upload className="btn-icon" size={16} />
            <span>{isEn ? 'Upload File (.md/.json)' : 'Upload bestand (.md/.json)'}</span>
          </button>
          
          {/* Info Help Icon for Upload Explanation */}
          <button
            type="button"
            className="upload-info-btn"
            onClick={() => setShowUploadInfo(!showUploadInfo)}
            title={isEn ? "Where is this button for?" : "Waar is deze knop voor?"}
            style={{
              border: 0,
              background: 'transparent',
              cursor: 'pointer',
              color: 'var(--accent, #954c28)',
              padding: '6px',
              borderRadius: '50%',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <HelpCircle size={18} />
          </button>
        </div>

        {/* Speech Balloon Popover Explanation */}
        {showUploadInfo && (
          <div className="upload-info-balloon" style={{
            position: 'absolute',
            bottom: '100%',
            left: '0',
            marginBottom: '10px',
            width: 'min(380px, 90vw)',
            background: 'var(--white, #fffdfa)',
            border: '1px solid var(--line, #dbcec4)',
            borderLeft: '4px solid var(--accent, #954c28)',
            borderRadius: '8px',
            padding: '16px 18px',
            boxShadow: '0 12px 36px rgba(0, 0, 0, 0.18)',
            zIndex: 100,
            fontSize: '13.5px',
            lineHeight: '1.5'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
              <div style={{ fontWeight: 700, color: 'var(--accent-dark, #6c2c0e)', fontSize: '14.5px' }}>
                💡 {isEn ? 'What is this button for?' : 'Waar is deze knop voor?'}
              </div>
              <button
                type="button"
                onClick={() => setShowUploadInfo(false)}
                style={{ border: 0, background: 'transparent', cursor: 'pointer', color: 'var(--muted, #615248)' }}
              >
                <X size={16} />
              </button>
            </div>
            <p style={{ margin: 0, color: 'var(--ink, #261d16)' }}>
              {isEn
                ? 'Use this button to load a local study file (.md or .json) directly in your browser. This stays 100% private on your own device and is NEVER stored on the server or shared publicly.'
                : 'Met deze knop kun je een lokaal studiebestand (.md of .json) inladen op je eigen computer of telefoon. Dit gebeurt 100% lokaal in je eigen browser — het wordt NIET openbaar gemaakt en NIET op onze server opgeslagen.'}
            </p>
            <div style={{
              position: 'absolute',
              bottom: '-7px',
              left: '24px',
              width: '12px',
              height: '12px',
              background: 'var(--white, #fffdfa)',
              borderRight: '1px solid var(--line, #dbcec4)',
              borderBottom: '1px solid var(--line, #dbcec4)',
              transform: 'rotate(45deg)'
            }} />
          </div>
        )}

        <button type="button" className="btn-secondary" onClick={handleExportJSON}>
          <Download className="btn-icon" size={16} />
          <span>{isEn ? 'Export (JSON)' : 'Exporteer (JSON)'}</span>
        </button>

        <button type="button" className="btn-secondary btn-reset" onClick={handleReset}>
          <RotateCcw className="btn-icon" size={16} />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
}
