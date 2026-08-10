import React from 'react';
import { ExternalLink, X } from 'lucide-react';

export default function LexiconPopover({ entry, onClose, lang = 'nl' }) {
  if (!entry) return null;
  const isEn = lang === 'en';

  const stepBibleUrl = `https://www.stepbible.org/?q=version=KJV|version=OHB|strong=${entry.strong}`;
  const bibleHubUrl = entry.language === 'greek'
    ? `https://biblehub.com/greek/${entry.strong.replace('G', '')}.htm`
    : `https://biblehub.com/hebrew/${entry.strong.replace('H', '')}.htm`;

  return (
    <div className="lexicon-backdrop" onClick={onClose}>
      <div
        className="lexicon-popover"
        onClick={(e) => e.stopPropagation()}
        tabIndex={-1}
        role="dialog"
        aria-labelledby="popover-lemma-title"
      >
        <div className="popover-header">
          <div className="popover-title-group">
            <span id="popover-lemma-title" className="popover-lemma">
              {entry.lemma}
            </span>
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
            <X size={18} />
          </button>
        </div>

        <div className="popover-body">
          <div>
            <div className="popover-label">{isEn ? 'Meaning / Gloss' : 'Betekenis / Gloss'}</div>
            <div className="popover-gloss">{entry.gloss}</div>
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
              <ExternalLink size={14} />
              <span>STEP Bible</span>
            </a>

            <a
              href={bibleHubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="popover-ext-link"
            >
              <ExternalLink size={14} />
              <span>Bible Hub</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
