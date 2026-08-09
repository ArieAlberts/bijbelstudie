import React, { useState, useEffect } from 'react';
import { Download, Upload, RotateCcw, CheckCircle2 } from 'lucide-react';

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

const STEPS_NL = [
  { id: 1, name: "Oriëntatie", desc: "Lees de tekst als één geheel door en bepaal het begin- en eindpunt van het gedeelte." },
  { id: 2, name: "Afbakening & Structuur", desc: "Verdeel de tekst in zinsverbanden en markeer de hoofdgedachte per alinea." },
  { id: 3, name: "Sleutelwoorden & Herhaling", desc: "Zoek naar terugkerende woorden, contrasten en woordparallellen." },
  { id: 4, name: "Kader & Context", desc: "Onderzoek de historische, geografische en literaire bedding van de passage." },
  { id: 5, name: "Grammatica & Woordstudie", desc: "Onderzoek opvallende werkwoordsvormen, namen en kernbegrippen." },
  { id: 6, name: "Dichterlijke & Literaire Vormen", desc: "Let op chiasmen, parallelismen en overgangszinnen." },
  { id: 7, name: "Intertekstuele Verwijzingen", desc: "Vergelijk de passage met andere Bijbelboeken en profetische lezingen (Haftara)." },
  { id: 8, name: "Theologische Kern", desc: "Wat openbaart dit tekstgedeelte over God, Zijn karakter en Zijn verbond?" },
  { id: 9, name: "Betekenis & Boodschap", desc: "Vat de hoofdboodschap van de auteur in eigen woorden samen." },
  { id: 10, name: "Toepassing & Reflectie", desc: "Wat betekent dit voor het persoonlijke geloofsleven en het handelen vandaag?" },
  { id: 11, name: "Eindconclusie & Gebed", desc: "Sluit de lezing af met een heldere samenvatting en dankgebed." }
];

const STEPS_EN = [
  { id: 1, name: "Orientation", desc: "Read the text as a whole and determine the beginning and ending points." },
  { id: 2, name: "Delimitation & Structure", desc: "Divide the text into clauses and highlight the main thought per paragraph." },
  { id: 3, name: "Keywords & Repetition", desc: "Search for recurring words, contrasts, and word parallels." },
  { id: 4, name: "Framework & Context", desc: "Examine the historical, geographical, and literary background." },
  { id: 5, name: "Grammar & Word Study", desc: "Examine notable verb forms, names, and key terms." },
  { id: 6, name: "Poetic & Literary Forms", desc: "Look out for chiasms, parallelisms, and transition sentences." },
  { id: 7, name: "Intertextual References", desc: "Compare the passage with other biblical books and prophetic readings (Haftarah)." },
  { id: 8, name: "Theological Core", desc: "What does this passage reveal about God, His character, and His covenant?" },
  { id: 9, name: "Meaning & Message", desc: "Summarize the author's primary message in your own words." },
  { id: 10, name: "Application & Reflection", desc: "What does this mean for personal faith and action today?" },
  { id: 11, name: "Final Conclusion & Prayer", desc: "Conclude the reading with a clear summary and prayer of thanksgiving." }
];

export default function Worksheet({ lang }) {
  const steps = lang === 'nl' ? STEPS_NL : STEPS_EN;

  const [selectedParasja, setSelectedParasja] = useState(PARASJOT[0]);
  const [checkedSteps, setCheckedSteps] = useState({});
  const [notes, setNotes] = useState({});

  // Load saved state from LocalStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem('parasja_study_data');
      if (savedData) {
        const parsed = JSON.parse(savedData);
        if (parsed.selectedParasja) setSelectedParasja(parsed.selectedParasja);
        if (parsed.checkedSteps) setCheckedSteps(parsed.checkedSteps);
        if (parsed.notes) setNotes(parsed.notes);
      }
    } catch (err) {
      console.error("Could not load stored state:", err);
    }
  }, []);

  // Save to LocalStorage on change
  useEffect(() => {
    try {
      const dataToSave = { selectedParasja, checkedSteps, notes };
      localStorage.setItem('parasja_study_data', JSON.stringify(dataToSave));
    } catch (err) {
      console.error("Could not save state:", err);
    }
  }, [selectedParasja, checkedSteps, notes]);

  const toggleCheck = (id) => {
    setCheckedSteps(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleNoteChange = (id, text) => {
    setNotes(prev => ({ ...prev, [id]: text }));
  };

  const completedCount = Object.values(checkedSteps).filter(Boolean).length;
  const progressPercent = Math.round((completedCount / steps.length) * 100);

  // Export JSON
  const handleExportJSON = () => {
    const exportData = {
      version: "1.0",
      timestamp: new Date().toISOString(),
      parasja: selectedParasja,
      checkedSteps,
      notes
    };
    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `parasja_studie_${selectedParasja.split(' ')[0].toLowerCase()}_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Import JSON
  const handleImportJSON = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target.result);
        if (imported.parasja) setSelectedParasja(imported.parasja);
        if (imported.checkedSteps) setCheckedSteps(imported.checkedSteps);
        if (imported.notes) setNotes(imported.notes);
        alert(lang === 'nl' ? 'Aantekeningen succesvol geïmporteerd!' : 'Notes successfully imported!');
      } catch (err) {
        alert(lang === 'nl' ? 'Fout bij het lezen van het JSON-bestand.' : 'Error reading JSON file.');
      }
    };
    reader.readAsText(file);
    e.target.value = '';
  };

  const handleReset = () => {
    if (window.confirm(lang === 'nl' ? 'Weet je zeker dat je alle aantekeningen wilt wissen?' : 'Are you sure you want to reset all notes?')) {
      setCheckedSteps({});
      setNotes({});
    }
  };

  return (
    <div className="worksheet-view">
      <div className="hero-card">
        <div className="hero-eyebrow">{lang === 'nl' ? 'Interactief Werkblad' : 'Interactive Worksheet'}</div>
        <h1 className="hero-title">{lang === 'nl' ? 'Zelf de parasja lezen' : 'Read the Parashah Yourself'}</h1>
        <p className="hero-subtitle">
          {lang === 'nl'
            ? 'Volg de 11 stappen van de methode om zelfstandig en gestructureerd de wekelijkse Toralezing te bestuderen.'
            : 'Follow the 11 steps of the method to independently and systematically study the weekly Torah portion.'}
        </p>

        {/* Parasja Selector Dropdown */}
        <div style={{ marginBottom: '24px' }}>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '8px', fontSize: '15px' }}>
            {lang === 'nl' ? 'Selecteer een parasja:' : 'Select a parashah:'}
          </label>
          <select
            value={selectedParasja}
            onChange={(e) => setSelectedParasja(e.target.value)}
            style={{
              width: '100%',
              maxWidth: '540px',
              padding: '12px 14px',
              border: '1px solid var(--line)',
              borderRadius: '4px',
              background: 'var(--paper)',
              fontSize: '15px',
              fontWeight: 500
            }}
          >
            {PARASJOT.map((p, idx) => (
              <option key={idx} value={p}>{p}</option>
            ))}
          </select>
        </div>

        {/* Progress Bar */}
        <div style={{ marginTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', fontWeight: 600, marginBottom: '6px' }}>
            <span>{lang === 'nl' ? 'Voortgang:' : 'Progress:'} {completedCount} / {steps.length} {lang === 'nl' ? 'stappen voltooid' : 'steps completed'}</span>
            <span>{progressPercent}%</span>
          </div>
          <div style={{ height: '8px', background: 'var(--soft)', borderRadius: '4px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progressPercent}%`, background: 'var(--accent)', transition: 'width 0.3s' }} />
          </div>
        </div>

        {/* Action Buttons: Export, Import, Reset */}
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginTop: '24px' }}>
          <button className="btn-secondary" onClick={handleExportJSON}>
            <Download size={16} />
            <span>{lang === 'nl' ? 'Exporteer (JSON)' : 'Export (JSON)'}</span>
          </button>

          <label className="btn-secondary" style={{ cursor: 'pointer' }}>
            <Upload size={16} />
            <span>{lang === 'nl' ? 'Importeer (JSON)' : 'Import (JSON)'}</span>
            <input type="file" accept=".json" onChange={handleImportJSON} style={{ display: 'none' }} />
          </label>

          <button className="btn-secondary" onClick={handleReset} style={{ color: '#86281d' }}>
            <RotateCcw size={16} />
            <span>{lang === 'nl' ? 'Reset' : 'Reset'}</span>
          </button>
        </div>
      </div>

      {/* 11 Steps Cards */}
      <div className="worksheet-grid">
        {steps.map((step) => (
          <div key={step.id} className="step-card">
            <div className="step-header">
              <input
                type="checkbox"
                className="step-checkbox"
                checked={!!checkedSteps[step.id]}
                onChange={() => toggleCheck(step.id)}
                id={`step-${step.id}`}
              />
              <div className="step-title-area">
                <label htmlFor={`step-${step.id}`} style={{ cursor: 'pointer' }}>
                  <div className="step-number">Stap {step.id}</div>
                  <div className="step-name">{step.name}</div>
                </label>
                <div className="step-desc">{step.desc}</div>
              </div>
            </div>

            <textarea
              className="step-notes"
              placeholder={lang === 'nl' ? 'Typ hier je aantekeningen bij deze stap...' : 'Type your notes for this step here...'}
              value={notes[step.id] || ''}
              onChange={(e) => handleNoteChange(step.id, e.target.value)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
