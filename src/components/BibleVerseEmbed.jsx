import React, { useState, useEffect } from 'react';
import { fetchBiblePassageByRef } from '../api/bible';
import { BookOpen, ExternalLink } from 'lucide-react';

/**
 * Reusable Bible Verse Embed Component for Articles, Blog Posts, and Studies.
 * Allows embedding any Bible reference (e.g., refText="Johannes 3:16" or "Deuteronomy 6:4-9").
 */
export default function BibleVerseEmbed({ refText, lang = 'nl', defaultTranslation = null }) {
  const isEn = lang === 'en';
  const [passage, setPassage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [translation, setTranslation] = useState(defaultTranslation || (isEn ? 'kjv' : 'sv'));

  useEffect(() => {
    let isMounted = true;
    if (!refText) return;

    setLoading(true);
    setError(null);

    fetchBiblePassageByRef(refText, lang)
      .then(data => {
        if (isMounted) {
          setPassage(data);
          setLoading(false);
        }
      })
      .catch(err => {
        if (isMounted) {
          setError(err.message || (isEn ? 'Could not load passage.' : 'Kon bijbeltekst niet laden.'));
          setLoading(false);
        }
      });

    return () => { isMounted = false; };
  }, [refText, lang]);

  const title = passage?.ref?.[lang] || passage?.ref?.nl || refText;
  const osis = passage?.osis || refText;

  const stepUrl = `https://www.stepbible.org/?q=version=${translation === 'kjv' ? 'KJV' : 'DutSVV'}|reference=${encodeURIComponent(osis)}&options=HVLGUNMC`;

  return (
    <div className="bible-verse-embed-card" style={{
      background: 'var(--white, #fffdfa)',
      border: '1px solid var(--line, #dbcec4)',
      borderLeft: '4px solid var(--accent, #954c28)',
      borderRadius: '6px',
      padding: '16px 20px',
      margin: '20px 0',
      boxShadow: '0 4px 14px rgba(52, 40, 25, 0.06)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justify-content: 'space-between',
        marginBottom: '12px',
        borderBottom: '1px solid var(--line, #dbcec4)',
        paddingBottom: '8px',
        flexWrap: 'wrap',
        gap: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '1.05rem', color: 'var(--accent-dark, #6c2c0e)' }}>
          <BookOpen size={18} />
          <span>{title}</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Translation Switcher */}
          <div style={{ display: 'inline-flex', background: 'var(--paper, #f8f4ef)', padding: '2px', borderRadius: '4px', border: '1px solid var(--line, #dbcec4)' }}>
            <button
              type="button"
              onClick={() => setTranslation('sv')}
              style={{
                border: 0,
                background: translation === 'sv' ? 'var(--accent, #954c28)' : 'transparent',
                color: translation === 'sv' ? '#fff' : 'var(--ink, #261d16)',
                padding: '2px 8px',
                fontSize: '0.75rem',
                fontWeight: 700,
                borderRadius: '3px',
                cursor: 'pointer'
              }}
            >
              SV
            </button>
            <button
              type="button"
              onClick={() => setTranslation('kjv')}
              style={{
                border: 0,
                background: translation === 'kjv' ? 'var(--accent, #954c28)' : 'transparent',
                color: translation === 'kjv' ? '#fff' : 'var(--ink, #261d16)',
                padding: '2px 8px',
                fontSize: '0.75rem',
                fontWeight: 700,
                borderRadius: '3px',
                cursor: 'pointer'
              }}
            >
              KJV
            </button>
          </div>

          <a
            href={stepUrl}
            target="_blank"
            rel="noopener noreferrer"
            title={isEn ? "Open in STEP Bible" : "Open in STEP Bijbel"}
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '4px',
              fontSize: '0.8rem',
              fontWeight: 600,
              color: 'var(--accent, #954c28)',
              textDecoration: 'none'
            }}
          >
            <span>STEP Bible</span>
            <ExternalLink size={13} />
          </a>
        </div>
      </div>

      {loading && <div style={{ fontStyle: 'italic', color: 'var(--muted, #615248)', fontSize: '0.9rem' }}>{isEn ? 'Loading verse...' : 'Bijbeltekst laden...'}</div>}

      {error && <div style={{ color: '#86281d', fontSize: '0.9rem' }}>{error}</div>}

      {!loading && !error && passage && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '1rem', lineHeight: '1.65', color: 'var(--ink, #261d16)' }}>
          {passage.verses.map(v => {
            const vText = translation === 'sv' ? v.sv : (v.kjv?.[0]?.t || v.sv);
            return (
              <div key={v.osis} style={{ display: 'flex', alignItems: 'baseline', gap: '8px' }}>
                <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--accent, #954c28)', minWidth: '24px' }}>{v.ref}</span>
                <span>{vText}</span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
