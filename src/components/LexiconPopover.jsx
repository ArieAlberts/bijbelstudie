import React, { useState, useEffect, useRef } from 'react';
import { X, ExternalLink, Move } from 'lucide-react';

export default function LexiconPopover({ entry, targetRect, onClose, lang = 'nl' }) {
  if (!entry) return null;
  const isEn = lang === 'en';
  const popoverRef = useRef(null);

  const [position, setPosition] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [showEnglishSource, setShowEnglishSource] = useState(false);

  // Compute initial position from targetRect
  useEffect(() => {
    if (targetRect) {
      const popoverWidth = 360;
      const popoverHeight = 280;

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

  // Extract localized gloss & usage
  const dutchGloss = entry.gloss_nl || entry.translation || entry.definition_nl || entry.gloss;
  const englishGloss = entry.gloss_en || entry.strongs_def || entry.gloss;

  const usageNlList = (entry.usage_nl && entry.usage_nl.length > 0) ? entry.usage_nl.join(', ') : null;
  const usageEnList = (entry.usage_en && entry.usage_en.length > 0) ? entry.usage_en.join(', ') : (entry.kjv_def || null);

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
          <span className={`popover-badge ${isGreek ? 'greek' : 'hebrew'}`} title={isGreek ? "OpenScriptures Strong's Greek Dictionary" : "OpenScriptures Strong's Hebrew Dictionary"}>
            {isGreek ? 'GRK · OSGD' : 'HEB · OSHD'}
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
        {/* Main Meaning / Gloss Section */}
        <div>
          <div className="popover-label">{isEn ? 'Meaning / Gloss' : 'Betekenis / Woordverklaring'}</div>
          {isEn ? (
            <div className="popover-gloss">{englishGloss || 'Ground-word definition'}</div>
          ) : (
            <div>
              <div className={`popover-gloss ${dutchGloss === 'Nederlandse vertaling nog niet beschikbaar' ? 'text-muted' : ''}`}>
                {dutchGloss || 'Woordverklaring uit grondtekstlexicon'}
              </div>
              {entry.definition_nl && (
                <div style={{ marginTop: '6px', fontSize: '0.85rem', color: '#4a3d33', lineHeight: '1.4' }}>
                  {entry.definition_nl}
                </div>
              )}


              {/* Optional English Source Definition Toggle for Dutch Site */}
              {englishGloss && (
                <div style={{ marginTop: '4px' }}>
                  <button
                    type="button"
                    onClick={() => setShowEnglishSource(!showEnglishSource)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#76685c',
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      padding: '2px 0'
                    }}
                  >
                    {showEnglishSource ? '▲ Verberg Engelse brondefinitie' : '▼ Toon Engelse brondefinitie'}
                  </button>
                  {showEnglishSource && (
                    <div style={{
                      marginTop: '4px',
                      padding: '6px 10px',
                      background: 'rgba(0, 0, 0, 0.04)',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      color: '#52453c',
                      fontStyle: 'italic',
                      lineHeight: '1.3'
                    }}>
                      <strong>Engelse Strong-definitie:</strong> {englishGloss}
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Usage / Renderings Section: Strictly separated for NL vs EN */}
        {!isEn && usageNlList && (
          <div className="popover-usage" style={{ marginTop: '8px' }}>
            <div className="popover-sublabel">Weergaven in de Statenvertaling</div>
            <div className="popover-subtext">{usageNlList}</div>
          </div>
        )}

        {isEn && usageEnList && (
          <div className="popover-usage" style={{ marginTop: '8px' }}>
            <div className="popover-sublabel">Usage in the KJV</div>
            <div className="popover-subtext">{usageEnList}</div>
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
              : 'Een lexicon geeft mogelijke betekenissen van een woord. Welke betekenis hier past wordt bepaald door vorm, zinsverband en context.'}
          </blockquote>
        </div>
      </div>
    </div>
  );
}

