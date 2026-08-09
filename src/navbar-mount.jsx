import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Navbar from './components/Navbar';
import WorksheetHero from './components/WorksheetHero';
import './styles/app.css';

function HeaderApp() {
  const isEnglish = document.documentElement.lang === 'en';
  const path = window.location.pathname;

  const determineViewFromHash = () => {
    const hash = window.location.hash;
    if (['#methode', '#uitleg', '#voorbeeld', '#bijlagen'].includes(hash)) {
      return 'method';
    }
    if (path.includes('handleiding') || path.includes('handbook')) return 'handbook';
    if (path.includes('contact')) return 'contact';
    if (path.includes('privacy')) return 'privacy';
    return 'worksheet';
  };

  const [lang, setLang] = useState(isEnglish ? 'en' : 'nl');
  const [currentView, setCurrentView] = useState(determineViewFromHash());

  useEffect(() => {
    const handleHashChange = () => {
      const view = determineViewFromHash();
      setCurrentView(view);
      if (window.setView && (view === 'worksheet' || view === 'method')) {
        window.setView(view, true);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [path]);

  const handleViewChange = (view) => {
    setCurrentView(view);

    if (view === 'worksheet') {
      if (window.setView) {
        window.setView('worksheet', true);
        window.location.hash = '#werkblad';
      } else {
        window.location.href = lang === 'nl' ? '../nl/index.html#werkblad' : '../en/index.html#worksheet';
      }
    } else if (view === 'method') {
      if (window.setView) {
        window.setView('method', true);
        window.location.hash = '#methode';
      } else {
        window.location.href = lang === 'nl' ? '../nl/index.html#methode' : '../en/index.html#methode';
      }
    } else if (view === 'handbook') {
      window.location.href = lang === 'nl' ? '../nl/handleiding.html' : '../en/handbook.html';
    } else if (view === 'contact') {
      window.location.href = lang === 'nl' ? '../nl/contact.html' : '../en/contact.html';
    }
  };

  const handleLangToggle = (newLang) => {
    setLang(newLang);
    if (newLang === 'en') {
      if (path.includes('handleiding')) window.location.href = '../en/handbook.html';
      else if (path.includes('contact')) window.location.href = '../en/contact.html';
      else if (path.includes('privacy')) window.location.href = '../en/privacy.html';
      else window.location.href = '../en/index.html' + window.location.hash;
    } else {
      if (path.includes('handbook')) window.location.href = '../nl/handleiding.html';
      else if (path.includes('contact')) window.location.href = '../nl/contact.html';
      else if (path.includes('privacy')) window.location.href = '../nl/privacy.html';
      else window.location.href = '../nl/index.html' + window.location.hash;
    }
  };

  return (
    <Navbar
      activeView={currentView}
      setActiveView={handleViewChange}
      lang={lang}
      setLang={handleLangToggle}
    />
  );
}

// Mount Header Navbar
const navContainer = document.getElementById('react-navbar-root');
if (navContainer) {
  ReactDOM.createRoot(navContainer).render(<HeaderApp />);
}

// Mount Worksheet Hero Card
const heroContainer = document.getElementById('react-worksheet-hero-root');
if (heroContainer) {
  const isEnglish = document.documentElement.lang === 'en';
  ReactDOM.createRoot(heroContainer).render(<WorksheetHero lang={isEnglish ? 'en' : 'nl'} />);
}
