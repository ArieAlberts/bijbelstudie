import React, { useState, useEffect } from 'react';
import LexiconPopover from './LexiconPopover';
import { fetchBiblePassage } from '../api/bible';

export default function BibleReader({ studyId = 'shoftim', initialSection = 'parasha', lang = 'nl', onSectionChange }) {
  const isEn = lang === 'en';
  const [section, setSection] = useState(initialSection);
  const [translation, setTranslation] = useState(isEn ? 'kjv' : 'sv');
  const [passageData, setPassageData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedEntry, setSelectedEntry] = useState(null);

  useEffect(() => {
    setSection(initialSection);
  }, [initialSection]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    setError(null);

    fetchBiblePassage(studyId, section)
      .then((data) => {
        if (isMounted) {
          setPassageData(data);
          setLoading(false);
        }
      })
      .catch((err) => {
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

  const openLexicon = (lemmaId, strongTag) => {
    if (!passageData || !passageData.lexicon) return;
    const entry = (lemmaId && passageData.lexicon[lemmaId]) ||
      Object.values(passageData.lexicon).find(e => e.strong === strongTag);
    if (entry) {
      setSelectedEntry(entry);
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
          onClick={() => openLexicon(align.lemmaId, align.strong)}
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
            const lemmaId = Object.keys(passageData.lexicon || {}).find(
              key => passageData.lexicon[key].strong === tok.s
            );
            return (
              <React.Fragment key={idx}>
                <button
                  type="button"
                  className="token-btn"
                  onClick={() => openLexicon(lemmaId, tok.s)}
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
    <div className="bible-reader-card">
      {/* Header Controls: Section Selector & Translation Switch */}
      <div className="reader-header-controls">
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

        <div className="translation-switch">
          <button
            type="button"
            className={`trans-btn ${translation === 'sv' ? 'active' : ''}`}
            onClick={() => setTranslation('sv')}
          >
            SV
          </button>
          <span className="trans-divider">|</span>
          <button
            type="button"
            className={`trans-btn ${translation === 'kjv' ? 'active' : ''}`}
            onClick={() => setTranslation('kjv')}
          >
            KJV
          </button>
        </div>
      </div>

      {/* Reader Content Body */}
      <div className="reader-content-body">
        {loading && (
          <div className="reader-loading">
            {isEn ? 'Loading Bible passage via API...' : 'Bijbelpassage via API laden...'}
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

      {/* Ground-word Lexicon Popover Dialog */}
      {selectedEntry && (
        <LexiconPopover
          entry={selectedEntry}
          onClose={() => setSelectedEntry(null)}
          lang={lang}
        />
      )}
    </div>
  );
}
