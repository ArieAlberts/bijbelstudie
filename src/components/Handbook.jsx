import React from 'react';

export default function Handbook({ lang }) {
  return (
    <div className="hero-card">
      <div className="hero-eyebrow">{lang === 'nl' ? 'De Volledige Handleiding' : 'The Complete Handbook'}</div>
      <h1 className="hero-title">{lang === 'nl' ? 'Handleiding Zelf de parasja lezen' : 'Handbook Read the Parashah Yourself'}</h1>
      <p className="hero-subtitle">
        {lang === 'nl'
          ? 'Lees het boek als één doorlopende weg, of open vanuit een werkstap precies het hoofdstuk dat je nodig hebt.'
          : 'Read the book as one continuous journey, or open exactly the chapter you need from a work step.'}
      </p>

      <div style={{ background: 'var(--soft)', padding: '20px', borderRadius: '4px', borderLeft: '3px solid var(--accent)', margin: '24px 0' }}>
        <h3 style={{ margin: '0 0 12px', fontFamily: '"Source Serif 4", Georgia, serif' }}>
          {lang === 'nl' ? 'Inhoudsopgave & Hoofdstukken' : 'Table of Contents & Chapters'}
        </h3>
        <ul style={{ paddingLeft: '20px', margin: 0, lineHeight: 1.8 }}>
          <li><strong>Hoofdstuk 1:</strong> {lang === 'nl' ? 'Het doel van de Torastudie' : 'The Goal of Torah Study'}</li>
          <li><strong>Hoofdstuk 2:</strong> {lang === 'nl' ? 'Hoe lees je met het werkblad?' : 'How to Read with the Worksheet'}</li>
          <li><strong>Hoofdstuk 3:</strong> {lang === 'nl' ? 'Het herkennen van chiasmen en parallelstructuren' : 'Recognizing Chiasms and Parallel Structures'}</li>
          <li><strong>Hoofdstuk 4:</strong> {lang === 'nl' ? 'Hebreeuwse sleutelwoorden in hun context' : 'Hebrew Keywords in Context'}</li>
          <li><strong>Hoofdstuk 5:</strong> {lang === 'nl' ? 'De Haftara-koppeling begrijpen' : 'Understanding the Haftarah Link'}</li>
        </ul>
      </div>
    </div>
  );
}
