import React, { useState, useEffect } from 'react';
import { Download, Upload, RotateCcw, BookOpen } from 'lucide-react';
import { fetchPassagesIndex } from '../api/bible';

export default function WorksheetHero({ lang, onStudyChange }) {
  const isEn = lang === 'en';
  const [studies, setStudies] = useState([
    {
      id: 'shoftim',
      parasha: 'Shoftim',
      label: { nl: 'Sjoftim', en: 'Shoftim' },
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
    if (onStudyChange) onStudyChange(id);
  };

  const currentStudy = studies.find(s => s.id === selectedStudyId) || studies[0];

  const getPassageRef = (roleName) => {
    if (!currentStudy || !currentStudy.passages) return '';
    const p = currentStudy.passages.find(x => x.role === roleName);
    if (!p || !p.ref) return '';
    return p.ref[lang] || p.ref.nl || '';
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
          state: JSON.parse(stateData)
        };
        const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = isEn ? 'parashah-study-backup.json' : 'parasja-studie-backup.json';
        document.body.appendChild(a);
        a.click();
        a.remove();
        URL.revokeObjectURL(url);
      } catch (_) {
        alert(isEn ? 'Error exporting data.' : 'Fout bij exporteren.');
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
      const msg = isEn
        ? 'Clear all checkmarks and notes on this page?'
        : 'Alle vinkjes en aantekeningen op deze pagina wissen?';
      if (window.confirm(msg)) {
        safeRemoveStorage('frame-parasja-site-v2');
        window.location.reload();
      }
    }
  };

  return (
    <div className="hero-card">
      <div className="hero-eyebrow">{isEn ? 'The weekly parashah' : 'De wekelijkse parasja'}</div>
      <h1 className="hero-title">{isEn ? 'Read and explore the parashah' : 'Lees en onderzoek de parasja'}</h1>
      <p className="hero-subtitle">
        {isEn
          ? 'Choose the parashah and take time to read the text for yourself. The questions help you stay attentive to the text. The method and handbook are available when you need further explanation.'
          : 'Kies de parasja en neem de tijd om de tekst zelf te lezen. De vragen helpen je aandachtig bij de tekst te blijven. De methode en handleiding zijn beschikbaar wanneer je extra uitleg nodig hebt.'}
      </p>

      {/* Parasja Selector Dropdown */}
      <div className="parasja-selector-container">
        <label className="parasja-selector-label">
          {isEn ? 'Select a parashah:' : 'Selecteer een parasja:'}
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

      {/* Prominent Bible Passage References Card */}
      <div className="passages-summary-box">
        <div className="passages-summary-title">
          <BookOpen size={16} className="btn-icon" />
          <span>{isEn ? 'Bijbelgedeelten bij deze lezing:' : 'Bijbelgedeelten bij deze lezing:'}</span>
        </div>
        <div className="passages-summary-grid">
          <div className="passage-item">
            <span className="passage-role">{isEn ? 'Torah / Parashah:' : 'Torah / Parasja:'}</span>
            <span className="passage-ref-text">{getPassageRef('parasha')}</span>
          </div>
          <div className="passage-item">
            <span className="passage-role">Haftara:</span>
            <span className="passage-ref-text">{getPassageRef('haftara')}</span>
          </div>
          <div className="passage-item">
            <span className="passage-role">{isEn ? 'Gospel:' : 'Evangelie:'}</span>
            <span className="passage-ref-text">{getPassageRef('gospel')}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons: Export, Import, Reset */}
      <div className="hero-action-buttons">
        <button type="button" className="btn-secondary" onClick={handleExportJSON}>
          <Download className="btn-icon" size={16} />
          <span>{isEn ? 'Export (JSON)' : 'Exporteer (JSON)'}</span>
        </button>

        <button type="button" className="btn-secondary" onClick={handleImportJSON}>
          <Upload className="btn-icon" size={16} />
          <span>{isEn ? 'Importeer (JSON)' : 'Importeer (JSON)'}</span>
        </button>

        <button type="button" className="btn-secondary btn-reset" onClick={handleReset}>
          <RotateCcw className="btn-icon" size={16} />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
}
