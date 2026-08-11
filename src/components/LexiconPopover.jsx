import React, { useEffect, useRef } from 'react';
import { X, ExternalLink } from 'lucide-react';

export default function LexiconPopover({ entry, targetRect, onClose, lang = 'nl' }) {
  if (!entry) return null;
  const isEn = lang === 'en';
  const popoverRef = useRef(null);

  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target)) {
        onClose();
      }
    };
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [onClose]);

  const isGreek = entry.language === 'greek' || entry.strong?.startsWith('G');
  const originalVersion = isGreek ? 'OGNT' : 'OHB';
  const mainVersion = isEn ? 'KJV' : 'DutSVV';
  const stepUrl = `https://www.stepbible.org/?q=version=${mainVersion}|version=${originalVersion}|strong=${encodeURIComponent(entry.strong)}&options=HVLGUNMC`;

  // Calculate fixed position right next to the clicked word element
  let popoverStyle = {};
  if (targetRect) {
    const popoverWidth = 360;
    const popoverHeight = 240;

    let top = targetRect.bottom + 8;
    if (top + popoverHeight > window.innerHeight) {
      top = Math.max(10, targetRect.top - popoverHeight - 8);
    }

    let left = targetRect.left - 20;
    if (left + popoverWidth > window.innerWidth - 20) {
      left = window.innerWidth - popoverWidth - 20;
    }
    if (left < 20) left = 20;

    popoverStyle = {
      position: 'fixed',
      top: `${top}px`,
      left: `${left}px`,
      zIndex: 9999
    };
  }

  return (
    <div
      ref={popoverRef}
      className="lexicon-balloon"
      style={popoverStyle}
      role="dialog"
      aria-labelledby="popover-lemma-title"
    >
      {/* Speech Balloon Pointer Arrow */}
      <div className="balloon-arrow"></div>

      <div className="popover-header">
        <div className="popover-title-group">
          {entry.lemma && (
            <span
              id="popover-lemma-title"
              className={`popover-lemma ${isGreek ? 'ltr' : 'rtl'}`}
              dir={isGreek ? 'ltr' : 'rtl'}
            >
              {entry.lemma}
            </span>
          )}
          {entry.translit && (
            <span className="popover-translit">({entry.translit})</span>
          )}
          <span className="popover-strong">{entry.strong}</span>
          <span className={`popover-badge ${isGreek ? 'greek' : 'hebrew'}`}>
            {isGreek ? 'GRK · TBESG' : 'HEB · TBESH'}
          </span>
        </div>
        <button
          type="button"
          className="popover-close-btn"
          onClick={onClose}
          aria-label={isEn ? "Close lexicon" : "Sluit lexicon"}
        >
          <X size={16} />
        </button>
      </div>

      <div className="popover-body">
        <div>
          <div className="popover-label">{isEn ? 'Meaning / Gloss' : 'Betekenis / Gloss'}</div>
          <div className="popover-gloss">{entry.gloss || (isEn ? 'Ground-word definition' : 'Grondwoord betekenis')}</div>
        </div>

        {entry.kjv_def && entry.kjv_def !== entry.gloss && (
          <div className="popover-usage">
            <div className="popover-sublabel">{isEn ? 'Usage / Translations' : 'Voorkomen / Vertalingen'}</div>
            <div className="popover-subtext">{entry.kjv_def}</div>
          </div>
        )}

        <div className="popover-actions" style={{ marginTop: '10px' }}>
          <a
            href={stepUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="popover-step-btn"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '0.82rem',
              fontWeight: 600,
              color: '#954c28',
              background: '#f6f1eb',
              padding: '5px 10px',
              borderRadius: '4px',
              border: '1px solid #dbcec4',
              textDecoration: 'none'
            }}
          >
            <span>📖 {isEn ? 'Open entry in STEP Bible' : 'Bekijk ontleding op STEP Bible'}</span>
            <ExternalLink size={13} />
          </a>
        </div>

        <div className="popover-warning" style={{ marginTop: '10px' }}>
          <blockquote>
            {isEn
              ? 'Context Warning: Ground-word meanings offer linguistic nuance; they do not replace the verse in its textual context.'
              : 'Contextwaarschuwing: Grondwoorden geven taalkundige verdieping; zij vervangen de Bijbeltekst in zijn verband niet.'}
          </blockquote>
        </div>
      </div>
    </div>
  );
}
