import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Navbar from './components/Navbar';
import WorksheetHero from './components/WorksheetHero';
import BibleReader from './components/BibleReader';
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

  const applyView = (view, scroll = true) => {
    if (typeof window.setView === 'function') {
      window.setView(view, scroll);
    } else {
      setTimeout(() => {
        if (typeof window.setView === 'function') {
          window.setView(view, scroll);
        }
      }, 50);
    }
  };

  useEffect(() => {
    const initialView = determineViewFromHash();
    if (initialView === 'worksheet' || initialView === 'method') {
      applyView(initialView, false);
    }

    const handleHashChange = () => {
      const view = determineViewFromHash();
      setCurrentView(view);
      if (view === 'worksheet' || view === 'method') {
        applyView(view, true);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [path]);

  const handleViewChange = (view) => {
    setCurrentView(view);

    if (view === 'worksheet') {
      applyView('worksheet', true);
      window.history.pushState(null, '', '#werkblad');
    } else if (view === 'method') {
      applyView('method', true);
      window.history.pushState(null, '', '#methode');
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

// Mount Worksheet Hero (Top)
function HeroWrapper() {
  const isEnglish = document.documentElement.lang === 'en';
  return (
    <WorksheetHero
      lang={isEnglish ? 'en' : 'nl'}
      onStudyChange={(id) => {
        window.dispatchEvent(new CustomEvent('study-changed', { detail: { studyId: id } }));
      }}
    />
  );
}

const heroContainer = document.getElementById('react-worksheet-hero-root');
if (heroContainer) {
  ReactDOM.createRoot(heroContainer).render(<HeroWrapper />);
}

// Mount Bible Reader (Right Side of Desktop Grid)
function BibleReaderWrapper() {
  const isEnglish = document.documentElement.lang === 'en';
  const [selectedStudy, setSelectedStudy] = useState('shoftim');

  useEffect(() => {
    const handleStudyChange = (e) => {
      if (e.detail?.studyId) setSelectedStudy(e.detail.studyId);
    };
    window.addEventListener('study-changed', handleStudyChange);
    return () => window.removeEventListener('study-changed', handleStudyChange);
  }, []);

  return (
    <BibleReader
      studyId={selectedStudy}
      initialSection="parasha"
      lang={isEnglish ? 'en' : 'nl'}
    />
  );
}

const readerContainer = document.getElementById('react-bible-reader-root');
if (readerContainer) {
  ReactDOM.createRoot(readerContainer).render(<BibleReaderWrapper />);
}
