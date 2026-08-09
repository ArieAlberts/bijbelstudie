import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Worksheet from './components/Worksheet';
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
        {activeView === 'worksheet' && <Worksheet lang={lang} />}
        {activeView === 'method' && <MethodView lang={lang} />}
        {activeView === 'handbook' && <Handbook lang={lang} />}
        {activeView === 'contact' && <ContactForm lang={lang} />}
        {activeView === 'privacy' && <Privacy lang={lang} />}
      </main>

      {/* Footer */}
      <footer className="app-footer">
        <p>
          {lang === 'nl'
            ? 'Zelf de parasja lezen — een praktijkhulpmiddel bij de methode van Arie Alberts · '
            : 'Read the Parashah Yourself — a practical aid based on the method of Arie Alberts · '}
          <button
            onClick={() => setActiveView('privacy')}
            style={{ border: 0, background: 'transparent', textDecoration: 'underline', cursor: 'pointer', color: 'var(--muted)', fontWeight: 600 }}
          >
            Privacy
          </button>
        </p>
      </footer>
    </div>
  );
}
