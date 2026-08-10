import React from 'react';
import ReactDOM from 'react-dom/client';
import BibleReader from './components/BibleReader';
import Navbar from './components/Navbar';
import './styles/app.css';

const isEnglish = document.documentElement.lang === 'en';
const urlParams = new URLSearchParams(window.location.search);
const studyParam = urlParams.get('study') || 'shoftim';
const sectionParam = urlParams.get('section') || 'parasha';

// Mount Standalone Navbar
const navContainer = document.getElementById('react-navbar-root');
if (navContainer) {
  ReactDOM.createRoot(navContainer).render(
    <Navbar
      activeView="reader"
      setActiveView={() => {}}
      lang={isEnglish ? 'en' : 'nl'}
      setLang={(newLang) => {
        window.location.href = newLang === 'en' ? '../en/reader.html' : '../nl/lezer.html';
      }}
    />
  );
}

// Mount Standalone Bible Reader
const readerContainer = document.getElementById('react-reader-root');
if (readerContainer) {
  ReactDOM.createRoot(readerContainer).render(
    <BibleReader
      studyId={studyParam}
      initialSection={sectionParam}
      lang={isEnglish ? 'en' : 'nl'}
      onSectionChange={(newSec) => {
        const newUrl = new URL(window.location.href);
        newUrl.searchParams.set('section', newSec);
        window.history.pushState(null, '', newUrl.toString());
      }}
    />
  );
}
