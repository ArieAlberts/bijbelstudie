import React, { useState } from 'react';
import Navbar from './components/Navbar';
import WorksheetHero from './components/WorksheetHero';
import MethodView from './components/MethodView';
import Handbook from './components/Handbook';
import ContactForm from './components/ContactForm';
import Privacy from './components/Privacy';

export default function App() {
  const [activeView, setActiveView] = useState('worksheet');
  const [lang, setLang] = useState('nl');

  return (
    <div className="app-shell">
      {/* Header with responsive Hamburger Menu Navbar */}
      <Navbar
        activeView={activeView}
        setActiveView={setActiveView}
        lang={lang}
        setLang={setLang}
      />

      {/* Main Content Area */}
      <main className="app-container">
        {activeView === 'worksheet' && <WorksheetHero lang={lang} />}
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
