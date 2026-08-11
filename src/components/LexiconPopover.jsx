import React, { useState, useEffect, useRef } from 'react';
import { X, ExternalLink, Move } from 'lucide-react';

export default function LexiconPopover({ entry, targetRect, onClose, lang = 'nl' }) {
  if (!entry) return null;
  const isEn = lang === 'en';
  const popoverRef = useRef(null);

  const [position, setPosition] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });

  // Compute initial position from targetRect
  useEffect(() => {
    if (targetRect) {
      const popoverWidth = 360;
      const popoverHeight = 260;

      let top = targetRect.bottom + 8;
      if (top + popoverHeight > window.innerHeight) {
        top = Math.max(10, targetRect.top - popoverHeight - 8);
      }

      let left = targetRect.left - 20;
      if (left + popoverWidth > window.innerWidth - 20) {
        left = window.innerWidth - popoverWidth - 20;
      }
      if (left < 20) left = 20;

      setPosition({ x: left, y: top });
    }
  }, [targetRect]);

  // Outside click & Escape handlers
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (popoverRef.current && !popoverRef.current.contains(e.target) && !isDragging) {
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
  }, [onClose, isDragging]);

  // Dragging event handlers (Mouse & Touch)
  const handleMouseDown = (e) => {
    if (e.target.closest('button') || e.target.closest('a')) return;
    setIsDragging(true);
    const currentX = position ? position.x : 20;
    const currentY = position ? position.y : 20;
    setDragOffset({
      x: e.clientX - currentX,
      y: e.clientY - currentY
    });
  };

  const handleTouchStart = (e) => {
    if (e.target.closest('button') || e.target.closest('a') || !e.touches[0]) return;
    setIsDragging(true);
    const currentX = position ? position.x : 20;
    const currentY = position ? position.y : 20;
    setDragOffset({
      x: e.touches[0].clientX - currentX,
      y: e.touches[0].clientY - currentY
    });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      const newX = Math.max(5, Math.min(window.innerWidth - 80, e.clientX - dragOffset.x));
      const newY = Math.max(5, Math.min(window.innerHeight - 60, e.clientY - dragOffset.y));
      setPosition({ x: newX, y: newY });
    };

    const handleTouchMove = (e) => {
      if (!isDragging || !e.touches[0]) return;
      const newX = Math.max(5, Math.min(window.innerWidth - 80, e.touches[0].clientX - dragOffset.x));
      const newY = Math.max(5, Math.min(window.innerHeight - 60, e.touches[0].clientY - dragOffset.y));
      setPosition({ x: newX, y: newY });
    };

    const handleDragEnd = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleDragEnd);
      window.addEventListener('touchmove', handleTouchMove, { passive: true });
      window.addEventListener('touchend', handleDragEnd);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleDragEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleDragEnd);
    };
  }, [isDragging, dragOffset]);

  const isGreek = entry.language === 'greek' || entry.strong?.startsWith('G');
  const originalVersion = isGreek ? 'OGNT' : 'OHB';
  const mainVersion = isEn ? 'KJV' : 'DutSVV';
  const stepUrl = `https://www.stepbible.org/?q=version=${mainVersion}|version=${originalVersion}|strong=${encodeURIComponent(entry.strong)}&options=HVLGUNMC`;

  const popoverStyle = position ? {
    position: 'fixed',
    top: `${position.y}px`,
    left: `${position.x}px`,
    zIndex: 9999
  } : {
    position: 'fixed',
    top: '100px',
    left: '20px',
    zIndex: 9999
  };

  return (
    <div
      ref={popoverRef}
      className={`lexicon-balloon ${isDragging ? 'dragging' : ''}`}
      style={popoverStyle}
      role="dialog"
      aria-labelledby="popover-lemma-title"
    >
      {/* Speech Balloon Pointer Arrow */}
      {!isDragging && <div className="balloon-arrow"></div>}

      <div
        className="popover-header"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        style={{ cursor: isDragging ? 'grabbing' : 'grab', userSelect: 'none', touchAction: 'none' }}
        title={isEn ? "Click/touch and drag to move balloon" : "Sleep om het ballonnetje te verplaatsen"}
      >
        <div className="popover-title-group" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <Move size={14} className="drag-handle-icon" style={{ color: 'var(--accent)', cursor: 'grab' }} />
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
          <div className="popover-label">{isEn ? 'Meaning / Gloss' : 'Betekenis / Woordverklaring'}</div>
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
