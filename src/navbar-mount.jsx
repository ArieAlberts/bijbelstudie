import React from 'react';
import ReactDOM from 'react-dom/client';
import Navbar from './components/Navbar';
import WorksheetHero from './components/WorksheetHero';
import './styles/app.css';

function HeaderApp() {
  const isEnglish = document.documentElement.lang === 'en';
  const path = window.location.pathname;

  let activeView = 'worksheet';
  if (path.includes('handleiding') || path.includes('handbook')) {
    activeView = 'handbook';
  } else if (path.includes('contact')) {
    activeView = 'contact';
  } else if (path.includes('privacy')) {
    activeView = 'privacy';
  } else if (window.location.hash.includes('methode')) {
    activeView = 'method';
  }

  const [lang, setLang] = React.useState(isEnglish ? 'en' : 'nl');
  const [currentView, setCurrentView] = React.useState(activeView);

  const handleViewChange = (view) => {
    setCurrentView(view);

    if (view === 'worksheet') {
      const btn = document.querySelector('[data-view-button="worksheet"]');
      if (btn) btn.click();
      const sheet = document.getElementById('werkblad') || document.getElementById('worksheet');
      if (sheet) sheet.scrollIntoView({ behavior: 'smooth' });
      else window.location.href = lang === 'nl' ? '../nl/index.html#werkblad' : '../en/index.html#worksheet';
    } else if (view === 'method') {
      const btn = document.querySelector('[data-view-button="method"]');
      if (btn) btn.click();
      const meth = document.getElementById('methode');
      if (meth) meth.scrollIntoView({ behavior: 'smooth' });
      else window.location.href = lang === 'nl' ? '../nl/index.html#methode' : '../en/index.html#methode';
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
      else window.location.href = '../en/index.html';
    } else {
      if (path.includes('handbook')) window.location.href = '../nl/handleiding.html';
      else if (path.includes('contact')) window.location.href = '../nl/contact.html';
      else if (path.includes('privacy')) window.location.href = '../nl/privacy.html';
      else window.location.href = '../nl/index.html';
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
