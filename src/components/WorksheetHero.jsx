import React, { useState, useEffect } from 'react';
import { Download, Upload, RotateCcw } from 'lucide-react';

export default function WorksheetHero({ lang, onStudyChange }) {
  const [studies, setStudies] = useState([
    { id: 'shoftim', parasha: 'Shoftim', label: { nl: 'Sjoftim', en: 'Shoftim' } },
    { id: 'reeh', parasha: "Re'eh", label: { nl: 'Re’eh', en: "Re'eh" } },
    { id: 'ekev', parasha: 'Ekev', label: { nl: 'Ekev', en: 'Eikev' } }
  ]);
  const [selectedStudyId, setSelectedStudyId] = useState('shoftim');

  useEffect(() => {
    // Fetch central passages manifest to populate options dynamically
    fetch('../data/passages.json')
      .then(res => res.json())
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
    if (onStudyChange) onStudyChange(id);
  };

  const safeGetStorage = (key) => {
    try {
      return localStorage.getItem(key);
    } catch (_) {
      return null;
    }
  };

  const safeSetStorage = (key, val) => {
    try {
      localStorage.setItem(key, val);
    } catch (_) {}
  };

  const safeRemoveStorage = (key) => {
    try {
      localStorage.removeItem(key);
    } catch (_) {}
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
          state: JSON.parse(stateData)
        };
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = lang === 'nl' ? 'parasja-studie-backup.json' : 'parashah-study-backup.json';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      } catch (_) {
        alert(lang === 'nl' ? 'Fout bij exporteren.' : 'Error exporting data.');
      }
    }
  };

  const handleImportJSON = () => {
    const importBtn = document.getElementById('import-work');
    if (importBtn) {
      importBtn.click();
    } else {
      const fileInput = document.getElementById('import-file');
      if (fileInput) fileInput.click();
    }
  };

  const handleReset = () => {
    const resetBtn = document.getElementById('reset-work');
    if (resetBtn) {
      resetBtn.click();
    } else {
      const msg = lang === 'nl'
        ? 'Alle vinkjes en aantekeningen op deze pagina wissen?'
        : 'Clear all checkmarks and notes on this page?';
      if (window.confirm(msg)) {
        safeRemoveStorage('frame-parasja-site-v2');
        window.location.reload();
      }
    }
  };

  return (
    <div className="hero-card">
      <div className="hero-eyebrow">{lang === 'nl' ? 'De wekelijkse parasja' : 'The weekly parashah'}</div>
      <h1 className="hero-title">{lang === 'nl' ? 'Lees en onderzoek de parasja' : 'Read and explore the parashah'}</h1>
      <p className="hero-subtitle">
        {lang === 'nl'
          ? 'Kies de parasja en neem de tijd om de tekst zelf te lezen. De vragen helpen je aandachtig bij de tekst te blijven. De methode en handleiding zijn beschikbaar wanneer je extra uitleg nodig hebt.'
          : 'Choose the parashah and take time to read the text for yourself. The questions help you stay attentive to the text. The method and handbook are available when you need further explanation.'}
      </p>

      {/* Dynamic Parasja Selector Dropdown */}
      <div className="parasja-selector-container">
        <label className="parasja-selector-label">
          {lang === 'nl' ? 'Selecteer een parasja:' : 'Select a parashah:'}
        </label>
        <select
          value={selectedStudyId}
          onChange={(e) => handleStudySelect(e.target.value)}
          className="parasja-selector-select"
        >
          {studies.map((s) => (
            <option key={s.id} value={s.id}>
              {s.label[lang] || s.label.nl || s.parasha}
            </option>
          ))}
        </select>
      </div>

      {/* Action Buttons: Export, Import, Reset */}
      <div className="hero-action-buttons">
        <button type="button" className="btn-secondary" onClick={handleExportJSON}>
          <Download className="btn-icon" size={16} />
          <span>{lang === 'nl' ? 'Exporteer (JSON)' : 'Export (JSON)'}</span>
        </button>

        <button type="button" className="btn-secondary" onClick={handleImportJSON}>
          <Upload className="btn-icon" size={16} />
          <span>{lang === 'nl' ? 'Importeer (JSON)' : 'Import (JSON)'}</span>
        </button>

        <button type="button" className="btn-secondary btn-reset" onClick={handleReset}>
          <RotateCcw className="btn-icon" size={16} />
          <span>{lang === 'nl' ? 'Reset' : 'Reset'}</span>
        </button>
      </div>
    </div>
  );
}
