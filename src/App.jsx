import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ParashaIntroLanding from './components/ParashaIntroLanding';
import WorksheetHero from './components/WorksheetHero';
import MethodView from './components/MethodView';
import Handbook from './components/Handbook';
import ContactForm from './components/ContactForm';
import Privacy from './components/Privacy';

export default function App() {
  const [activeView, setActiveView] = useState('intro');
  const [autoExpandReading, setAutoExpandReading] = useState(false);
  const [lang, setLang] = useState('nl');

  useEffect(() => {
    const hash = window.location.hash;
    if (hash === '#werkblad' || hash === '#worksheet') {
      setActiveView('worksheet');
      setAutoExpandReading(true);
    } else if (hash === '#waarom-deze-website') {
      setActiveView('waarom-deze-website');
    } else if (hash === '#methode' || hash === '#method') {
      setActiveView('method');
    } else if (hash === '#wat-is-de-parasja' || hash === '#intro') {
      setActiveView('intro');
    }
  }, []);

  const handleSelectView = (view) => {
    if (view === 'worksheet') {
      setActiveView('worksheet');
      setAutoExpandReading(true); // Automatically expand reading when clicking "Lees de parasja"
    } else {
      setActiveView(view);
      if (view !== 'worksheet') {
        setAutoExpandReading(false);
      }
    }
  };

  return (
    <div className="app-shell">
      {/* Header with responsive Hamburger Menu Navbar */}
      <Navbar
        activeView={activeView}
        setActiveView={handleSelectView}
        lang={lang}
        setLang={setLang}
      />

      {/* Main Content Area */}
      <main className="app-container">
        {(activeView === 'intro' || activeView === 'wat-is-de-parasja' || activeView === 'waarom-deze-website') && (
          <ParashaIntroLanding
            lang={lang}
            onGoToParasha={() => handleSelectView('worksheet')}
            onGoToMethod={() => handleSelectView('method')}
          />
        )}
        {activeView === 'worksheet' && (
          <WorksheetHero lang={lang} autoExpandReading={autoExpandReading} />
        )}
        {activeView === 'method' && <MethodView lang={lang} />}
        {activeView === 'handbook' && <Handbook lang={lang} />}
        {activeView === 'contact' && <ContactForm lang={lang} />}
        {activeView === 'privacy' && <Privacy lang={lang} />}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>
          {lang === 'nl'
            ? 'Zelf de parasja lezen — bij de Frame-methode van Arie Alberts · '
            : 'Read the Parashah Yourself — based on The Frame method of Arie Alberts · '}
          <button
            onClick={() => setActiveView('privacy')}
            className="footer-privacy-btn"
          >
            Privacy
          </button>
        </p>
      </footer>
    </div>
  );
}
