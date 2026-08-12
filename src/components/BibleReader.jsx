import React, { useState, useEffect } from 'react';
import LexiconPopover from './LexiconPopover';
import DraggableStepWindow from './DraggableStepWindow';
import { fetchBiblePassage, fetchPassagesIndex, fetchBiblePassageByRef } from '../api/bible';
import { Search, RotateCcw } from 'lucide-react';

export default function BibleReader({ studyId = 'shoftim', initialSection = 'parasha', lang = 'nl', onSectionChange }) {
  const isEn = lang === 'en';
  const [section, setSection] = useState(initialSection);
  const [showStepWindow, setShowStepWindow] = useState(false);
  const [translation, setTranslation] = useState(isEn ? 'kjv' : 'sv');

  const [customSearchQuery, setCustomSearchQuery] = useState('');
  const [isCustomLookup, setIsCustomLookup] = useState(false);

  useEffect(() => {
    setTranslation(isEn ? 'kjv' : 'sv');
  }, [lang, isEn]);

  const [passageData, setPassageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [selectedRect, setSelectedRect] = useState(null);

  const [availableRoles, setAvailableRoles] = useState(['parasha', 'haftara', 'gospel']);

  useEffect(() => {
    setSection(initialSection);
    setIsCustomLookup(false);
    setCustomSearchQuery('');
  }, [initialSection, studyId]);

  useEffect(() => {
    fetchPassagesIndex()
      .then((data) => {
        if (data.studies) {
          const studyItem = data.studies.find((s) => s.id === studyId);
          if (studyItem && studyItem.passages) {
            const roles = studyItem.passages.map((p) => p.role);
            setAvailableRoles(roles);
            if (!roles.includes(section) && !isCustomLookup) {
              const fallbackSec = roles[0] || 'parasha';
              setSection(fallbackSec);
              if (onSectionChange) onSectionChange(fallbackSec);
            }
          }
        }
      })
      .catch(() => {});
  }, [studyId]);

  useEffect(() => {
    if (isCustomLookup) return; // Managed by handleCustomSearch

    let isMounted = true;
    setLoading(true);
    setError(null);
    setSelectedEntry(null);
    setSelectedRect(null);

    fetchBiblePassage(studyId, section)
      .then((data) => {
        if (isMounted) {
          setPassageData(data);
          setLoading(false);
        }
      })
      .catch(() => {
        if (isMounted) {
          setError(isEn ? 'Passage currently unavailable.' : 'Bijbelgedeelte momenteel niet beschikbaar.');
          setLoading(false);
        }
      });

    return () => { isMounted = false; };
  }, [studyId, section, isEn, isCustomLookup]);

  const handleSectionSelect = (newSec) => {
    setIsCustomLookup(false);
    setCustomSearchQuery('');
    setSection(newSec);
    if (onSectionChange) onSectionChange(newSec);
  };

  const handleCustomSearchSubmit = (e) => {
    e.preventDefault();
    if (!customSearchQuery.trim()) return;

    setLoading(true);
    setError(null);
    setSelectedEntry(null);
    setSelectedRect(null);

    fetchBiblePassageByRef(customSearchQuery, lang)
      .then(data => {
        setPassageData(data);
        setIsCustomLookup(true);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message || (isEn ? 'Could not find requested Bible passage.' : 'Bijbelgedeelte niet gevonden. Probeer bijv. "Johannes 3:16" of "Jesaja 53".'));
        setLoading(false);
      });
  };

  const handleResetToParasha = () => {
    setIsCustomLookup(false);
    setCustomSearchQuery('');
    const defaultSec = availableRoles[0] || 'parasha';
    setSection(defaultSec);
    if (onSectionChange) onSectionChange(defaultSec);
  };

  const getStepIframeUrl = () => {
    const osis = passageData?.osis || 'Deut.16.18-Deut.21.9';
    const isNt = passageData?.testament === 'NT' || osis.startsWith('John') || osis.startsWith('Matt') || osis.startsWith('Mark') || osis.startsWith('Luke') || osis.startsWith('Acts') || osis.startsWith('Rom');
    const originalVersion = isNt ? 'OGNT' : 'OHB';
    const mainVersion = isEn ? 'KJV' : 'DutSVV';

    return `https://www.stepbible.org/?q=version=${mainVersion}|version=${originalVersion}|reference=${encodeURIComponent(osis)}&options=HVLGUNMC`;
  };

  const openLexicon = (event, lemmaId, strongTag, surfaceText) => {
    const rect = event.currentTarget.getBoundingClientRect();

    let entry = (lemmaId && passageData?.lexicon?.[lemmaId]) ||
      (strongTag && passageData?.lexicon?.[strongTag]) ||
      Object.values(passageData?.lexicon || {}).find(e => e.strong === strongTag || e.strong === lemmaId);

    if (!entry && (strongTag || lemmaId)) {
      const strongCode = strongTag || lemmaId;
      const isNt = strongCode.startsWith('G') || passageData?.testament === 'NT';
      const langLabel = isNt ? 'Grieks' : 'Hebreeuws';

      entry = {
        strong: strongCode,
        lemma: surfaceText || strongCode,
        transliteration: strongCode,
        translation: surfaceText ? `${surfaceText}` : strongCode,
        definition: isEn
          ? `Strong's ${langLabel} concordance entry ${strongCode} for '${surfaceText || ''}'. Click to view full STEP Bible entry.`
          : `Strong's ${langLabel} concordantie-item ${strongCode} voor '${surfaceText || ''}'. Klik voor de volledige uitgewerkte lezing in STEP Bible.`,
        stepUrl: `https://www.stepbible.org/?q=version=DutSVV|version=${isNt ? 'OGNT' : 'OHB'}|strong=${strongCode}`
      };
    }

    if (entry) {
      setSelectedEntry(entry);
      setSelectedRect(rect);
    }
  };


  const renderSvVerse = (verse) => {
    const text = verse.sv || '';
    const alignments = verse.alignments?.sv || [];

    if (!alignments.length) return <span>{text}</span>;

    let lastIndex = 0;
    const parts = [];

    alignments.forEach((align, idx) => {
      if (align.charStart > lastIndex) {
        parts.push(text.substring(lastIndex, align.charStart));
      }
      parts.push(
        <button
          key={idx}
          type="button"
          className="token-btn verified-btn"
          onClick={(e) => openLexicon(e, align.lemmaId, align.strong, align.surface)}
          title={`${align.surface} → ${align.strong}`}
        >
          {align.surface}
        </button>
      );
      lastIndex = align.charEnd;
    });

    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return <span>{parts}</span>;
  };

  const renderKjvVerse = (verse) => {
    const tokens = verse.kjv || [];
    if (!tokens.length) return <span>{verse.sv}</span>;

    return (
      <span>
        {tokens.map((tok, idx) => {
          if (tok.s) {
            const lemmaId = Object.keys(passageData?.lexicon || {}).find(
              key => passageData.lexicon[key].strong === tok.s
            );
            return (
              <React.Fragment key={idx}>
                <button
                  type="button"
                  className="token-btn"
                  onClick={(e) => openLexicon(e, lemmaId, tok.s, tok.t)}
                >
                  {tok.t}
                </button>{' '}
              </React.Fragment>
            );
          }
          return <span key={idx}>{tok.t} </span>;
        })}
      </span>
    );
  };

  const getLocalizedRefTitle = () => {
    if (!passageData || !passageData.ref) return '';
    if (typeof passageData.ref === 'string') return passageData.ref;
    if (isEn) {
      return passageData.ref.en || 'Translation not available';
    }
    return passageData.ref.nl || 'Vertaling niet beschikbaar';
  };

  return (
    <div className="bible-reader-wrapper">
      {/* Detached Section Navigation & Full Bible Search Bar */}
      <div className="reader-standalone-nav">
        <div className="nav-row" style={{ gap: '10px' }}>
          <nav aria-label={isEn ? "Passage sections" : "Bijbelsecties"} className="section-tabs">
            {availableRoles.includes('parasha') && (
              <button
                type="button"
                className={`section-tab ${!isCustomLookup && section === 'parasha' ? 'active' : ''}`}
                onClick={() => handleSectionSelect('parasha')}
              >
                {isEn ? 'Parashah' : 'Torah'}
              </button>
            )}
            {availableRoles.includes('haftara') && (
              <button
                type="button"
                className={`section-tab ${!isCustomLookup && section === 'haftara' ? 'active' : ''}`}
                onClick={() => handleSectionSelect('haftara')}
              >
                Haftara
              </button>
            )}
            {availableRoles.includes('gospel') && (
              <button
                type="button"
                className={`section-tab ${!isCustomLookup && section === 'gospel' ? 'active' : ''}`}
                onClick={() => handleSectionSelect('gospel')}
              >
                {isEn ? 'Gospel' : 'Evangelie'}
              </button>
            )}
          </nav>

          <div className="nav-right-controls" style={{ display: 'flex', gap: '8px', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Translation Toggle Switch: SV vs KJV */}
            <div className="translation-toggle" style={{ display: 'inline-flex', background: 'var(--color-bg-secondary, #f6f1eb)', borderRadius: '4px', padding: '2px', border: '1px solid var(--color-border, #dbcec4)' }}>
              <button
                type="button"
                className={`trans-btn ${translation === 'sv' ? 'active' : ''}`}
                onClick={() => setTranslation('sv')}
                title="Statenvertaling (SV 1637/1888)"
                style={{
                  padding: '4px 10px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  background: translation === 'sv' ? '#954c28' : 'transparent',
                  color: translation === 'sv' ? '#fff' : 'var(--color-text, #261d16)'
                }}
              >
                SV (NL)
              </button>
              <button
                type="button"
                className={`trans-btn ${translation === 'kjv' ? 'active' : ''}`}
                onClick={() => setTranslation('kjv')}
                title="King James Version (KJV 1769)"
                style={{
                  padding: '4px 10px',
                  fontSize: '0.85rem',
                  fontWeight: 600,
                  border: 'none',
                  borderRadius: '3px',
                  cursor: 'pointer',
                  background: translation === 'kjv' ? '#954c28' : 'transparent',
                  color: translation === 'kjv' ? '#fff' : 'var(--color-text, #261d16)'
                }}
              >
                KJV (EN)
              </button>
            </div>

            <div className="mode-toggle-switch">
              <button
                type="button"
                className={`mode-btn ${showStepWindow ? 'active' : ''}`}
                onClick={() => setShowStepWindow(!showStepWindow)}
                title={isEn ? "Open / Close STEP Bible Window" : "Open / Sluit zwevend STEP Bijbel venster"}
              >
                📖 STEP Bible {showStepWindow ? (isEn ? '(Open)' : '(Open)') : (isEn ? '(Openen)' : '(Openen)')}
              </button>
            </div>
          </div>
        </div>

        {/* Full 66-Book Bible Verse Lookup Form */}
        <form onSubmit={handleCustomSearchSubmit} style={{ marginTop: '10px', display: 'flex', gap: '6px', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1 }}>
            <input
              type="text"
              value={customSearchQuery}
              onChange={(e) => setCustomSearchQuery(e.target.value)}
              placeholder={isEn ? "Search any Bible passage (e.g. John 3:16, Isaiah 53)..." : "Zoek elk willekeurig Bijbelvers (bijv. Johannes 3:16, Jesaja 53)..."}
              style={{
                width: '100%',
                padding: '6px 10px 6px 30px',
                borderRadius: '4px',
                border: '1px solid var(--line, #dbcec4)',
                fontSize: '0.88rem',
                background: 'var(--paper, #f8f4ef)'
              }}
            />
            <Search size={14} style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'var(--muted, #615248)' }} />
          </div>
          <button
            type="submit"
            className="btn-secondary"
            style={{ padding: '6px 12px', fontSize: '0.85rem' }}
          >
            {isEn ? 'Search' : 'Zoeken'}
          </button>
          {isCustomLookup && (
            <button
              type="button"
              onClick={handleResetToParasha}
              className="btn-secondary"
              title={isEn ? "Return to Parashah" : "Terug naar Parasja"}
              style={{ padding: '6px 10px', fontSize: '0.85rem', color: '#86281d' }}
            >
              <RotateCcw size={14} />
            </button>
          )}
        </form>
      </div>

      {/* Reader Content Body Window */}
      <div className="bible-reader-card">
        {loading && (
          <div className="reader-loading">
            {isEn ? 'Loading Bible passage...' : 'Bijbelpassage laden...'}
          </div>
        )}

        {error && (
          <div className="reader-error" style={{ color: '#86281d', padding: '10px' }}>
            {error}
          </div>
        )}

        {!loading && !error && passageData && (
          <>
            <div className="passage-meta-header">
              <h2 className="passage-title">{getLocalizedRefTitle()}</h2>
              <div className="passage-subtitle">
                {translation === 'sv' ? 'Statenvertaling (SV)' : 'King James Version (KJV)'}
                {isCustomLookup && <span> · (Volledige Bijbelzoeker)</span>}
              </div>
            </div>

            <div className="verses-list">
              {passageData.verses.map((verse) => (
                <div key={verse.osis} id={`v-${verse.osis}`} className="verse-row">
                  <span className="verse-num">{verse.ref}</span>
                  <div className="verse-text">
                    {translation === 'sv' ? renderSvVerse(verse) : renderKjvVerse(verse)}
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Speech Balloon Lexicon Popover */}
      {selectedEntry && (
        <LexiconPopover
          entry={selectedEntry}
          targetRect={selectedRect}
          onClose={() => setSelectedEntry(null)}
          lang={translation === 'kjv' ? 'en' : lang}
        />
      )}

      {/* Floating Movable/Draggable STEP Bible Frame Window */}
      {showStepWindow && (
        <DraggableStepWindow
          passageRef={getLocalizedRefTitle()}
          iframeUrl={getStepIframeUrl()}
          onClose={() => setShowStepWindow(false)}
          lang={lang}
        />
      )}
    </div>
  );
}
