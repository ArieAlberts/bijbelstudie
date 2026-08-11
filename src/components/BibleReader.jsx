import React, { useState, useEffect } from 'react';
import LexiconPopover from './LexiconPopover';
import DraggableStepWindow from './DraggableStepWindow';
import { fetchBiblePassage } from '../api/bible';

export default function BibleReader({ studyId = 'shoftim', initialSection = 'parasha', lang = 'nl', onSectionChange }) {
  const isEn = lang === 'en';
  const [section, setSection] = useState(initialSection);
  const [showStepWindow, setShowStepWindow] = useState(false);
  const translation = isEn ? 'kjv' : 'sv';

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

  // Generate STEP Bible iFrame URL with BOTH translation and original language modules:
  // - OT (Torah/Haftara): DutSVV + OHB (Open Hebrew Bible)
  // - NT (Gospel): DutSVV + OGNT (Open Greek New Testament)
  // Options: HVLGUNMC (Interlinear, Verse numbers, Lexicon, Grammar, Underlying text, Notes, Meanings, Column view)
  const getStepIframeUrl = () => {
    const osis = passageData?.osis || 'Deut.16.18-Deut.21.9';
    const isNt = passageData?.testament === 'NT' || osis.startsWith('John') || osis.startsWith('Matt') || osis.startsWith('Mark') || osis.startsWith('Luke');
    const originalVersion = isNt ? 'OGNT' : 'OHB';
    const mainVersion = isEn ? 'BSB' : 'DutSVV';

    return `https://www.stepbible.org/?q=version=${mainVersion}|version=${originalVersion}|reference=${encodeURIComponent(osis)}&options=HVLGUNMC`;
  };

  const openLexicon = (event, lemmaId, strongTag, surfaceText) => {
    const rect = event.currentTarget.getBoundingClientRect();

    const entry = (lemmaId && passageData?.lexicon?.[lemmaId]) ||
      (strongTag && passageData?.lexicon?.[strongTag]) ||
      Object.values(passageData?.lexicon || {}).find(e => e.strong === strongTag);

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
              className={`mode-btn ${showStepWindow ? 'active' : ''}`}
              onClick={() => setShowStepWindow(!showStepWindow)}
              title={isEn ? "Open / Close STEP Bible Window" : "Open / Sluit zwevend STEP Bijbel venster"}
            >
              📖 STEP Bible {showStepWindow ? (isEn ? '(Open)' : '(Open)') : (isEn ? '(Openen)' : '(Openen)')}
            </button>
          </div>
        </div>
      </div>

      {/* Reader Content Body Window */}
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
          lang={lang}
        />
      )}

      {/* Floating Movable/Draggable STEP Bible Frame Window */}
      {showStepWindow && (
        <DraggableStepWindow
          passageRef={passageData?.ref ? (passageData.ref[lang] || passageData.ref.nl) : ''}
          iframeUrl={getStepIframeUrl()}
          onClose={() => setShowStepWindow(false)}
          lang={lang}
        />
      )}
    </div>
  );
}
