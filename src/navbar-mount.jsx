import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import Navbar from './components/Navbar';
import ParashaIntroLanding from './components/ParashaIntroLanding';
import WorksheetHero from './components/WorksheetHero';
import BibleReader from './components/BibleReader';
import './styles/app.css';

function HeaderApp() {
  const isEnglish = document.documentElement.lang === 'en';
  const path = window.location.pathname;

  const determineViewFromHash = () => {
    const hash = window.location.hash;
    if (['#wat-is-de-parasja', '#intro'].includes(hash)) return 'intro';
    if (hash === '#waarom-deze-website') return 'waarom-deze-website';
    if (['#methode', '#uitleg', '#voorbeeld', '#bijlagen'].includes(hash)) return 'method';
    if (path.includes('handleiding') || path.includes('handbook')) return 'handbook';
    if (path.includes('contact')) return 'contact';
    if (path.includes('privacy')) return 'privacy';
    if (hash === '#werkblad' || hash === '#worksheet') return 'worksheet';
    return 'intro';
  };

  const [lang, setLang] = useState(isEnglish ? 'en' : 'nl');
  const [currentView, setCurrentView] = useState(determineViewFromHash());
  const [autoExpandReading, setAutoExpandReading] = useState(false);

  const applyView = (view, scroll = true) => {
    const isIntro = view === 'intro' || view === 'wat-is-de-parasja' || view === 'waarom-deze-website';
    const isWorksheet = view === 'worksheet';
    const isMethod = view === 'method';

    const introEl = document.getElementById('react-intro-root');
    const heroEl = document.getElementById('react-worksheet-hero-root');
    const readerEl = document.getElementById('react-bible-reader-root');
    const werkbladContainer = document.getElementById('werkblad') || document.getElementById('worksheet');

    if (introEl) introEl.hidden = !isIntro;
    if (heroEl) heroEl.hidden = !isWorksheet;
    if (readerEl) readerEl.hidden = !isWorksheet;
    if (werkbladContainer) werkbladContainer.hidden = !isWorksheet;

    const methodEls = document.querySelectorAll('.method-view');
    methodEls.forEach(el => el.hidden = !isMethod);

    if (scroll) {
      if (isIntro) {
        (document.querySelector('#wat-is-de-parasja') || document.querySelector('#waarom-deze-website') || introEl)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (isWorksheet) {
        (heroEl || werkbladContainer)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else if (isMethod) {
        (document.querySelector('#methode') || document.querySelector('#uitleg'))?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }
  };

  useEffect(() => {
    const initialView = determineViewFromHash();
    applyView(initialView, false);

    const handleHashChange = () => {
      const view = determineViewFromHash();
      setCurrentView(view);
      if (view === 'worksheet') {
        setAutoExpandReading(true);
      }
      applyView(view, true);
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, [path]);

  const translateHash = (hash, targetLang) => {
    if (!hash) return '';
    const cleanHash = hash.startsWith('#') ? hash.slice(1) : hash;
    const nlToEn = {
      'wat-is-de-parasja': 'wat-is-de-parasja',
      'waarom-deze-website': 'waarom-deze-website',
      'werkblad': 'worksheet',
      'methode': 'method',
      'uitleg': 'method',
      'voorbeeld': 'example',
      'bijlagen': 'appendices'
    };
    const enToNl = {
      'wat-is-de-parasja': 'wat-is-de-parasja',
      'waarom-deze-website': 'waarom-deze-website',
      'worksheet': 'werkblad',
      'method': 'methode',
      'explanation': 'uitleg',
      'example': 'voorbeeld',
      'appendices': 'bijlagen'
    };
    if (targetLang === 'en') {
      const mapped = nlToEn[cleanHash];
      return '#' + (mapped || cleanHash);
    } else {
      const mapped = enToNl[cleanHash];
      return '#' + (mapped || cleanHash);
    }
  };

  const handleViewChange = (view) => {
    setCurrentView(view);

    if (view === 'intro') {
      applyView('intro', true);
      window.history.pushState(null, '', lang === 'nl' ? '#wat-is-de-parasja' : '#wat-is-de-parasja');
    } else if (view === 'waarom-deze-website') {
      applyView('waarom-deze-website', true);
      window.history.pushState(null, '', lang === 'nl' ? '#waarom-deze-website' : '#waarom-deze-website');
    } else if (view === 'worksheet') {
      setAutoExpandReading(true);
      applyView('worksheet', true);
      window.history.pushState(null, '', lang === 'nl' ? '#werkblad' : '#worksheet');
    } else if (view === 'method') {
      applyView('method', true);
      window.history.pushState(null, '', lang === 'nl' ? '#methode' : '#method');
    } else if (view === 'handbook') {
      window.location.href = lang === 'nl' ? '../nl/handleiding.html' : '../en/handbook.html';
    } else if (view === 'contact') {
      window.location.href = lang === 'nl' ? '../nl/contact.html' : '../en/contact.html';
    }
  };

  const handleLangToggle = (newLang) => {
    setLang(newLang);
    const search = window.location.search;
    const targetHash = translateHash(window.location.hash, newLang);

    if (newLang === 'en') {
      if (path.includes('handleiding')) window.location.href = '../en/handbook.html' + search + targetHash;
      else if (path.includes('contact')) window.location.href = '../en/contact.html' + search + targetHash;
      else if (path.includes('privacy')) window.location.href = '../en/privacy.html' + search + targetHash;
      else if (path.includes('lezer')) window.location.href = '../en/reader.html' + search + targetHash;
      else if (path.includes('bedankt')) window.location.href = '../en/thanks.html' + search + targetHash;
      else if (path.includes('feedback')) window.location.href = '../en/feedback.html' + search + targetHash;
      else window.location.href = '../en/index.html' + search + targetHash;
    } else {
      if (path.includes('handbook')) window.location.href = '../nl/handleiding.html' + search + targetHash;
      else if (path.includes('contact')) window.location.href = '../nl/contact.html' + search + targetHash;
      else if (path.includes('privacy')) window.location.href = '../nl/privacy.html' + search + targetHash;
      else if (path.includes('reader')) window.location.href = '../nl/lezer.html' + search + targetHash;
      else if (path.includes('thanks')) window.location.href = '../nl/bedankt.html' + search + targetHash;
      else if (path.includes('feedback')) window.location.href = '../nl/feedback.html' + search + targetHash;
      else window.location.href = '../nl/index.html' + search + targetHash;
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

// Mount Parasha Intro Landing
function IntroWrapper() {
  const isEnglish = document.documentElement.lang === 'en';
  const [introMode, setIntroMode] = useState(
    window.location.hash === '#waarom-deze-website' ? 'waarom-deze-website' : 'wat-is-de-parasja'
  );

  useEffect(() => {
    const handleHashChange = () => {
      setIntroMode(window.location.hash === '#waarom-deze-website' ? 'waarom-deze-website' : 'wat-is-de-parasja');
    };
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return (
    <ParashaIntroLanding
      lang={isEnglish ? 'en' : 'nl'}
      mode={introMode}
      onGoToParasha={() => {
        const werkbladUrl = isEnglish ? '#worksheet' : '#werkblad';
        window.location.hash = werkbladUrl;
      }}
    />
  );
}


const introContainer = document.getElementById('react-intro-root');
if (introContainer) {
  ReactDOM.createRoot(introContainer).render(<IntroWrapper />);
}

// Mount Worksheet Hero (Top)
function HeroWrapper() {
  const isEnglish = document.documentElement.lang === 'en';
  return (
    <WorksheetHero
      lang={isEnglish ? 'en' : 'nl'}
      autoExpandReading={true}
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
