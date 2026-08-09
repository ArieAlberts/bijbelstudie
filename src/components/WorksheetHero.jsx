import React, { useState, useEffect } from 'react';
import { Download, Upload, RotateCcw } from 'lucide-react';

const PARASJOT = [
  "Beresjiet (Genesis 1:1 - 6:8)", "Noach (Genesis 6:9 - 11:32)", "Lekh Lekha (Genesis 12:1 - 17:27)",
  "Vayera (Genesis 18:1 - 22:24)", "Chayei Sarah (Genesis 23:1 - 25:18)", "Toledot (Genesis 25:19 - 28:9)",
  "Vayetzei (Genesis 28:10 - 32:3)", "Vayisjlach (Genesis 32:4 - 36:43)", "Vayesjev (Genesis 37:1 - 40:23)",
  "Miketz (Genesis 41:1 - 44:17)", "Vayigasj (Genesis 44:18 - 47:27)", "Vayechi (Genesis 47:28 - 50:26)",
  "Sjemot (Exodus 1:1 - 6:1)", "Va'era (Exodus 6:2 - 9:35)", "Bo (Exodus 10:1 - 13:16)",
  "Besjalach (Exodus 13:17 - 17:16)", "Yitro (Exodus 18:1 - 20:23)", "Miesjpatiem (Exodus 21:1 - 24:18)",
  "Teroemah (Exodus 25:1 - 27:19)", "Tetzaveh (Exodus 27:20 - 30:10)", "Ki Tisa (Exodus 30:11 - 34:35)",
  "Vayakhel (Exodus 35:1 - 38:20)", "Pekoedei (Exodus 38:21 - 40:38)", "Vayikra (Leviticus 1:1 - 5:26)",
  "Tzav (Leviticus 6:1 - 8:36)", "Sjemini (Leviticus 9:1 - 11:47)", "Tazria (Leviticus 12:1 - 13:59)",
  "Metzora (Leviticus 14:1 - 15:33)", "Acharei Mot (Leviticus 16:1 - 18:30)", "Kedosjiem (Leviticus 19:1 - 20:27)",
  "Emor (Leviticus 21:1 - 24:23)", "Behar (Leviticus 25:1 - 26:2)", "Bechoekotai (Leviticus 26:3 - 27:34)",
  "Bamidbar (Numeri 1:1 - 4:20)", "Naso (Numeri 4:21 - 7:89)", "Beha'aloteka (Numeri 8:1 - 12:16)",
  "Sjelach Lecha (Numeri 13:1 - 15:41)", "Korach (Numeri 16:1 - 18:32)", "Choekat (Numeri 19:1 - 22:1)",
  "Balak (Numeri 22:2 - 25:9)", "Pinchas (Numeri 25:10 - 30:1)", "Matot (Numeri 30:2 - 32:42)",
  "Masei (Numeri 33:1 - 36:13)", "Devariem (Deuteronomium 1:1 - 3:22)", "Va'etchanan (Deuteronomium 3:23 - 7:11)",
  "Ekev (Deuteronomium 7:12 - 11:25)", "Re'eh (Deuteronomium 11:26 - 16:17)", "Sjoefetiem (Deuteronomium 16:18 - 21:9)",
  "Ki Tetzei (Deuteronomium 21:10 - 25:19)", "Ki Tavo (Deuteronomium 26:1 - 29:8)", "Nitzaviem (Deuteronomium 29:9 - 30:20)",
  "Vayelech (Deuteronomium 31:1-30)", "Ha'azinoe (Deuteronomium 32:1-52)", "Vezot Haberakhah (Deuteronomium 33:1 - 34:12)"
];

export default function WorksheetHero({ lang }) {
  const [selectedParasja, setSelectedParasja] = useState(PARASJOT[0]);

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
          parasja: selectedParasja,
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

      {/* Parasja Selector Dropdown */}
      <div className="parasja-selector-container">
        <label className="parasja-selector-label">
          {lang === 'nl' ? 'Selecteer een parasja:' : 'Select a parashah:'}
        </label>
        <select
          value={selectedParasja}
          onChange={(e) => setSelectedParasja(e.target.value)}
          className="parasja-selector-select"
        >
          {PARASJOT.map((p, idx) => (
            <option key={idx} value={p}>{p}</option>
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
