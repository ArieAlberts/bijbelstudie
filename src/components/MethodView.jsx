import React from 'react';

export default function MethodView({ lang }) {
  return (
    <div className="hero-card">
      <div className="hero-eyebrow">{lang === 'nl' ? 'Achtergrond & Visie' : 'Background & Vision'}</div>
      <h1 className="hero-title">{lang === 'nl' ? 'Over de methode van Arie Alberts' : 'About the method of Arie Alberts'}</h1>

      <blockquote style={{
        borderLeft: '3px solid var(--accent)',
        paddingLeft: '18px',
        margin: '24px 0',
        fontStyle: 'italic',
        fontSize: '18px',
        fontFamily: '"Source Serif 4", Georgia, serif'
      }}>
        {lang === 'nl'
          ? '“De tekst is een land. Iedere uitleg is een kaart. Een goede kaart helpt ons het land zien, maar zij mag het land nooit verzinnen.”'
          : '“The text is a land. Every explanation is a map. A good map helps us see the land, but it must never invent the land.”'}
      </blockquote>

      <div style={{ fontSize: '16.5px', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p>
          {lang === 'nl'
            ? 'De Frame-methode is ontwikkeld door Arie Alberts om lezers te helpen de Hebreeuwse Bijbeltekst (Tora en Tanach) in haar eigen context en structuur te begrijpen. In plaats van direct secundaire commentaren of dogmatische verklaringsmodellen toe te passen, leert deze methode de lezer om eerst zélf goed te kijken naar de opbouw, herhalingen en poëtische kaders van de tekst.'
            : 'The Frame method was developed by Arie Alberts to help readers understand the Hebrew Bible text (Torah and Tanakh) in its own context and structure. Rather than immediately applying secondary commentaries or dogmatic models, this method teaches readers to first look carefully at the structure, repetitions, and poetic frames of the text itself.'}
        </p>

        <h2 style={{ fontFamily: '"Source Serif 4", Georgia, serif', fontSize: '24px', marginTop: '20px' }}>
          {lang === 'nl' ? 'De 3 Pijlers' : 'The 3 Pillars'}
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          <div style={{ padding: '16px', background: 'var(--soft)', borderLeft: '3px solid var(--accent)', borderRadius: '4px' }}>
            <h3 style={{ margin: '0 0 8px', fontSize: '17px' }}>1. {lang === 'nl' ? 'Tekstuele Autonomie' : 'Textual Autonomy'}</h3>
            <p style={{ margin: 0, fontSize: '14.5px' }}>
              {lang === 'nl' ? 'De Bijbeltekst staat centraal. Laat de tekst spreken voordat je conclusies trekt.' : 'The biblical text is central. Let the text speak before drawing conclusions.'}
            </p>
          </div>

          <div style={{ padding: '16px', background: 'var(--soft)', borderLeft: '3px solid var(--accent)', borderRadius: '4px' }}>
            <h3 style={{ margin: '0 0 8px', fontSize: '17px' }}>2. {lang === 'nl' ? 'Literaire Structuur' : 'Literary Structure'}</h3>
            <p style={{ margin: 0, fontSize: '14.5px' }}>
              {lang === 'nl' ? 'Herhalingen, chiasmen en sleutelwoorden leggen de nadruk van het betoog bloot.' : 'Repetitions, chiasms, and keywords reveal the emphasis of the passage.'}
            </p>
          </div>

          <div style={{ padding: '16px', background: 'var(--soft)', borderLeft: '3px solid var(--accent)', borderRadius: '4px' }}>
            <h3 style={{ margin: '0 0 8px', fontSize: '17px' }}>3. {lang === 'nl' ? 'Verbond context' : 'Covenantal Context'}</h3>
            <p style={{ margin: 0, fontSize: '14.5px' }}>
              {lang === 'nl' ? 'Begrijp de passage binnen de historische en verbondsmatige verhouding tussen God en Israël.' : 'Understand the passage within the historical covenant relationship between God and Israel.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
