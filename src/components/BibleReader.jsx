import React, { useState, useEffect } from 'react';
import LexiconPopover from './LexiconPopover';
import { fetchBiblePassage } from '../api/bible';

export default function BibleReader({ studyId = 'shoftim', initialSection = 'parasha', lang = 'nl', onSectionChange }) {
  const isEn = lang === 'en';
  const [section, setSection] = useState(initialSection);
  const [readerMode, setReaderMode] = useState('step'); // 'step' (STEP Bible iFrame) or 'classic'
  const translation = isEn ? 'kjv' : 'sv';
  const stepVersion = isEn ? 'KJV' : 'DutSVV';

  const [passageData, setPassageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);
  const [selectedRect, setSelectedRect] = useState(null);

  useEffect(() => {
    setSection(initialSection);
  }, [initialSection]);

  useEffect(() => {
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
  }, [studyId, section, isEn]);

  const handleSectionSelect = (newSec) => {
    setSection(newSec);
    if (onSectionChange) onSectionChange(newSec);
  };

  // Generate STEP Bible iFrame URL with full option flags: HVLGUNMC
  // H = Hebrew/Greek Interlinear, V = Verse numbers, L = Lexicon, G = Grammar, U = Underlying text, N = Notes, M = Meanings, C = Column view
  const getStepIframeUrl = () => {
    const osis = passageData?.osis || 'Deut.16.18-Deut.21.9';
    return `https://www.stepbible.org/?q=version=${stepVersion}|reference=${encodeURIComponent(osis)}&options=HVLGUNMC`;
  };

  const openLexicon = (event, lemmaId, strongTag, surfaceText) => {
    const rect = event.currentTarget.getBoundingClientRect();

    let entry = (lemmaId && passageData?.lexicon?.[lemmaId]) ||
      (strongTag && passageData?.lexicon?.[strongTag]) ||
      Object.values(passageData?.lexicon || {}).find(e => e.strong === strongTag);

    if (!entry && strongTag) {
      const isGrk = strongTag.startsWith('G');
      entry = {
        strong: strongTag,
        language: isGrk ? 'greek' : 'hebrew',
        lemma: surfaceText || (isGrk ? 'Grondwoord' : 'Grondwoord'),
        translit: strongTag,
        gloss: isGrk
          ? `Griekse grondtekst sleutel ${strongTag} (Bekijk in STEP Bible)`
          : `Hebreeuwse grondtekst sleutel ${strongTag} (Bekijk in STEP Bible)`
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

  return (
    <div className="bible-reader-wrapper">
      {/* Detached Section Navigation Bar */}
      <div className="reader-standalone-nav">
        <div className="nav-row">
          <nav aria-label={isEn ? "Passage sections" : "Bijbelsecties"} className="section-tabs">
            <button
              type="button"
              className={`section-tab ${section === 'parasha' ? 'active' : ''}`}
              onClick={() => handleSectionSelect('parasha')}
            >
              {isEn ? 'Parashah' : 'Torah'}
            </button>
            <button
              type="button"
              className={`section-tab ${section === 'haftara' ? 'active' : ''}`}
              onClick={() => handleSectionSelect('haftara')}
            >
              Haftara
            </button>
            <button
              type="button"
              className={`section-tab ${section === 'gospel' ? 'active' : ''}`}
              onClick={() => handleSectionSelect('gospel')}
            >
              {isEn ? 'Gospel' : 'Evangelie'}
            </button>
          </nav>

          <div className="mode-toggle-switch">
            <button
              type="button"
              className={`mode-btn ${readerMode === 'step' ? 'active' : ''}`}
              onClick={() => setReaderMode('step')}
              title={isEn ? "STEP Bible Engine (Interactive Lexicon & Analysis)" : "STEP Bible (Interactief Lexicon & Taalanalyse)"}
            >
              STEP Bible
            </button>
            <button
              type="button"
              className={`mode-btn ${readerMode === 'classic' ? 'active' : ''}`}
              onClick={() => setReaderMode('classic')}
              title={isEn ? "Classic Reading Mode" : "Klassieke Lezer"}
            >
              {isEn ? 'Classic' : 'Klassiek'}
            </button>
          </div>
        </div>
      </div>

      {/* Reader Content Window */}
      <div className="bible-reader-card">
        {loading && (
          <div className="reader-loading">
            {isEn ? 'Loading Bible passage...' : 'Bijbelpassage laden...'}
          </div>
        )}

        {error && (
          <div className="reader-error">
            {error}
          </div>
        )}

        {!loading && !error && passageData && (
          <>
            <div className="passage-meta-header">
              <h2 className="passage-title">{passageData.ref ? (passageData.ref[lang] || passageData.ref.nl) : ''}</h2>
              <div className="passage-subtitle">
                {translation === 'sv' ? 'Statenvertaling (SV)' : 'King James Version (KJV)'}
                {readerMode === 'step' && ' — STEP Bible Engine (HVLGUNMC)'}
              </div>
            </div>

            {readerMode === 'step' ? (
              /* STEP Bible Embedded iFrame Engine with HVLGUNMC options */
              <div className="stepbible-container">
                <iframe
                  src={getStepIframeUrl()}
                  title="STEP Bible Reader"
                  className="stepbible-iframe"
                  allowFullScreen
                />
              </div>
            ) : (
              /* Classic Inline Verses View */
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
            )}
          </>
        )}
      </div>

      {/* Speech Balloon Lexicon Popover for Classic mode */}
      {readerMode === 'classic' && selectedEntry && (
        <LexiconPopover
          entry={selectedEntry}
          targetRect={selectedRect}
          onClose={() => setSelectedEntry(null)}
          lang={lang}
        />
      )}
    </div>
  );
}
