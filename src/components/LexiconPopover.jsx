import React, { useEffect, useRef } from 'react';
import { ExternalLink, X } from 'lucide-react';

export default function LexiconPopover({ entry, onClose, lang }) {
  const popoverRef = useRef(null);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    popoverRef.current?.focus();
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!entry) return null;

  const isEn = lang === 'en';
  const { lemma, translit, strong, gloss, language } = entry;

  // External Links
  const stepBibleUrl = `https://www.stepbible.org/?q=version=KJV|strong=${strong}`;
  const bibleHubUrl = `https://biblehub.com/${language === 'greek' ? 'greek' : 'hebrew'}/${strong.replace(/^[HG]0*/, '')}.htm`;

  return (
    <div className="lexicon-backdrop" onClick={onClose}>
      <div
        className="lexicon-popover"
        ref={popoverRef}
        tabIndex={-1}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label={isEn ? "Lexicon entry" : "Lexicon-entry"}
      >
        <div className="popover-header">
          <div className="popover-title-group">
            <span className="popover-lemma">{lemma}</span>
            <span className="popover-translit">({translit})</span>
            <span className="popover-strong">{strong}</span>
          </div>
          <button
            type="button"
            className="popover-close-btn"
            onClick={onClose}
            aria-label={isEn ? "Close" : "Sluiten"}
          >
            <X size={18} />
          </button>
        </div>

        <div className="popover-body">
          <div className="popover-label">
            {isEn ? `Underlying ${language} word` : `Gekoppeld aan ${language === 'greek' ? 'Grieks' : 'Hebreeuws'} grondwoord:`}
          </div>
          <div className="popover-gloss">{gloss}</div>

          <div className="popover-warning">
            <blockquote>
              {isEn
                ? "A lexicon shows possible meanings of a word. Which meaning fits here depends on form, syntax, and context."
                : "Een lexicon geeft mogelijke betekenissen van een woord. Welke betekenis hier past wordt bepaald door vorm, zinsverband en context."}
            </blockquote>
          </div>

          <div className="popover-external-links">
            <a
              href={stepBibleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="popover-ext-link"
            >
              <span>STEP Bible</span>
              <ExternalLink size={13} />
            </a>
            <a
              href={bibleHubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="popover-ext-link"
            >
              <span>Bible Hub</span>
              <ExternalLink size={13} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
