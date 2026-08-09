import React from 'react';

export default function Privacy({ lang }) {
  return (
    <div className="hero-card">
      <div className="hero-eyebrow">Privacy</div>
      <h1 className="hero-title">{lang === 'nl' ? 'Privacyverklaring' : 'Privacy Statement'}</h1>
      <div style={{ fontSize: '16px', lineHeight: 1.7, display: 'flex', flexDirection: 'column', gap: '16px' }}>
        <p>
          {lang === 'nl'
            ? 'Deze website verzamelt alleen gegevens die je zelf via de feedback- en contactformulieren verstuurt.'
            : 'This website collects only information that you choose to submit through the feedback and contact forms.'}
        </p>
        <h2 style={{ fontFamily: '"Source Serif 4", Georgia, serif', fontSize: '22px', margin: '16px 0 0' }}>
          {lang === 'nl' ? 'Welke gegevens worden verzameld?' : 'What information is collected?'}
        </h2>
        <p>
          {lang === 'nl'
            ? 'Bij contactverzoeken worden je naam, e-mailadres en je inhoudelijke vraag opgeslagen om je antwoord te kunnen geven. Je aantekeningen op de interactieve werkkaart worden lokaal in je eigen browser opgeslagen (via LocalStorage) en niet naar onze servers verstuurd.'
            : 'When submitting contact forms, your name, email address, and message are saved to respond to your inquiry. Your worksheet study notes are saved locally in your own browser (via LocalStorage) and are never sent to external servers.'}
        </p>
      </div>
    </div>
  );
}
