import React, { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';

export default function ContactForm({ lang }) {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    soort: '',
    naam: '',
    email: '',
    waar_ben_je: '',
    wat_geprobeerd: '',
    vraag: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    try {
      await fetch('https://formsubmit.co/ajax/info@parasja.nl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          _subject: lang === 'nl' ? 'Nieuw bericht via parasja.nl (NL)' : 'New message via parasja.nl (EN)',
          _template: 'table',
          _captcha: 'false',
          ...formData
        })
      });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert(lang === 'nl' ? 'Er is iets misgegaan bij het versturen.' : 'Something went wrong while sending.');
    } finally {
      setSending(false);
    }
  };

  if (submitted) {
    return (
      <div className="hero-card" style={{ textAlign: 'center', padding: '56px 32px' }}>
        <CheckCircle size={48} style={{ color: 'var(--accent)', margin: '0 auto 16px' }} />
        <h1 className="hero-title">{lang === 'nl' ? 'Dank je voor je bericht!' : 'Thank you for your message!'}</h1>
        <p className="hero-subtitle">
          {lang === 'nl'
            ? 'Je bericht is opgeslagen. Arie zal je vraag met zorg bekijken en indien nodig contact opnemen.'
            : 'Your message has been received. Arie will review your request carefully.'}
        </p>
        <button className="btn-primary" onClick={() => setSubmitted(false)} style={{ marginTop: '20px' }}>
          {lang === 'nl' ? 'Nog een bericht sturen' : 'Send another message'}
        </button>
      </div>
    );
  }

  return (
    <div className="hero-card">
      <div className="hero-eyebrow">{lang === 'nl' ? 'Contact & Vragen' : 'Contact & Questions'}</div>
      <h1 className="hero-title">{lang === 'nl' ? 'Neem contact op' : 'Get in Touch'}</h1>
      <p className="hero-subtitle">
        {lang === 'nl'
          ? 'Kies waar je bericht over gaat. Een gerichte vraag met tekstvermelding kan zorgvuldiger worden beoordeeld.'
          : 'Choose what your message is about. A focused question with text reference can be reviewed more carefully.'}
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '18px', marginTop: '24px' }}>
        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>
            {lang === 'nl' ? 'Waarover wil je contact opnemen?' : 'What is your message about?'}
          </label>
          <select
            name="soort"
            required
            value={formData.soort}
            onChange={handleChange}
            style={{ width: '100%', padding: '11px', border: '1px solid var(--line)', background: 'var(--paper)', borderRadius: '4px' }}
          >
            <option value="">{lang === 'nl' ? 'Maak een keuze...' : 'Choose an option...'}</option>
            <option value="hulp">{lang === 'nl' ? 'Ik wil hulp bij mijn eigen parasjastudie' : 'I need help with my parashah study'}</option>
            <option value="vraag">{lang === 'nl' ? 'Ik heb een inhoudelijke vraag over de methode' : 'I have a question about the method'}</option>
            <option value="correctie">{lang === 'nl' ? 'Ik denk dat iets inhoudelijk onduidelijk of onjuist is' : 'I noticed a correction or typo'}</option>
            <option value="overig">{lang === 'nl' ? 'Overig contact' : 'General contact'}</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>{lang === 'nl' ? 'Naam' : 'Name'}</label>
            <input
              type="text"
              name="naam"
              required
              value={formData.naam}
              onChange={handleChange}
              style={{ width: '100%', padding: '11px', border: '1px solid var(--line)', background: 'var(--paper)', borderRadius: '4px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>{lang === 'nl' ? 'E-mailadres' : 'Email Address'}</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              style={{ width: '100%', padding: '11px', border: '1px solid var(--line)', background: 'var(--paper)', borderRadius: '4px' }}
            />
          </div>
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>
            {lang === 'nl' ? 'Met welke parasja of tekst ben je bezig?' : 'Which parashah or text are you studying?'}
          </label>
          <input
            type="text"
            name="waar_ben_je"
            placeholder={lang === 'nl' ? 'Bijv. Ekev, Deuteronomium 8, stap 3' : 'E.g., Ekev, Deuteronomy 8, step 3'}
            value={formData.waar_ben_je}
            onChange={handleChange}
            style={{ width: '100%', padding: '11px', border: '1px solid var(--line)', background: 'var(--paper)', borderRadius: '4px' }}
          />
        </div>

        <div>
          <label style={{ display: 'block', fontWeight: 600, marginBottom: '6px' }}>
            {lang === 'nl' ? 'Waar loop je precies vast, of wat wil je melden?' : 'Where are you stuck, or what would you like to report?'}
          </label>
          <textarea
            name="vraag"
            required
            rows={4}
            value={formData.vraag}
            onChange={handleChange}
            style={{ width: '100%', padding: '11px', border: '1px solid var(--line)', background: 'var(--paper)', borderRadius: '4px', resize: 'vertical' }}
          />
        </div>

        <button type="submit" className="btn-primary" disabled={sending} style={{ alignSelf: 'flex-start', marginTop: '10px', opacity: sending ? 0.7 : 1 }}>
          <Send size={16} />
          <span>{sending ? (lang === 'nl' ? 'Wordt verstuurd...' : 'Sending...') : (lang === 'nl' ? 'Bericht versturen' : 'Send message')}</span>
        </button>
      </form>
    </div>
  );
}
