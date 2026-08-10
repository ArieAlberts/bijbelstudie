import React, { useEffect, useRef } from 'react';
import { ExternalLink, X } from 'lucide-react';

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

  const stepBibleUrl = `https://www.stepbible.org/?q=version=KJV|version=OHB|strong=${entry.strong}`;
  const isGreek = entry.language === 'greek' || (entry.strong && entry.strong.startsWith('G'));
  const cleanStrongNum = entry.strong ? entry.strong.replace(/[HG]/, '') : '';
  const bibleHubUrl = isGreek
    ? `https://biblehub.com/greek/${cleanStrongNum}.htm`
    : `https://biblehub.com/hebrew/${cleanStrongNum}.htm`;

  // Calculate fixed position right next to the clicked word element
  let popoverStyle = {};
  if (targetRect) {
    const popoverWidth = 350;
    const popoverHeight = 220;

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
            <span id="popover-lemma-title" className="popover-lemma">
              {entry.lemma}
            </span>
          )}
          {entry.translit && (
            <span className="popover-translit">({entry.translit})</span>
          )}
          <span className="popover-strong">{entry.strong}</span>
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

        <div className="popover-warning">
          <blockquote>
            {isEn
              ? 'Context Warning: Ground-word meanings offer linguistic nuance; they do not replace the verse in its textual context.'
              : 'Contextwaarschuwing: Grondwoorden geven taalkundige verdieping; zij vervangen de Bijbeltekst in zijn verband niet.'}
          </blockquote>
        </div>

        <div className="popover-external-links">
          <a
            href={stepBibleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="popover-ext-link"
          >
            <ExternalLink size={13} />
            <span>STEP Bible</span>
          </a>

          <a
            href={bibleHubUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="popover-ext-link"
          >
            <ExternalLink size={13} />
            <span>Bible Hub</span>
          </a>
        </div>
      </div>
    </div>
  );
}
