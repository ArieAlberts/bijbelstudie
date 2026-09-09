import React, { useState, useEffect } from 'react';
import { Menu, X, BookOpen, HelpCircle, Book, Mail, Globe, Compass, Info, Newspaper, Printer, FileText } from 'lucide-react';

function getStudyShabbatDate(study) {
  const rawDate = study?.shabbat_date || study?.published_at;
  if (!rawDate) return null;

  const match = String(rawDate).match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return null;

  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day), 12, 0, 0);
  if (Number.isNaN(date.getTime())) return null;

  if (!study?.shabbat_date) {
    const daysUntilSaturday = (6 - date.getDay() + 7) % 7;
    date.setDate(date.getDate() + daysUntilSaturday);
  }

  date.setHours(0, 0, 0, 0);
  return date;
}

function findWeeklyStudy(studies) {
  if (!Array.isArray(studies) || studies.length === 0) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const datedStudies = studies
    .map(study => ({ study, shabbatDate: getStudyShabbatDate(study) }))
    .filter(item => item.shabbatDate);

  const nextStudy = datedStudies
    .filter(item => item.shabbatDate >= today)
    .sort((a, b) => a.shabbatDate - b.shabbatDate)[0];

  if (nextStudy) return nextStudy.study;

  const mostRecentStudy = datedStudies
    .sort((a, b) => b.shabbatDate - a.shabbatDate)[0];

  return mostRecentStudy?.study || studies.find(s => s.current) || studies[0];
}

export default function Navbar({ activeView, setActiveView, lang, setLang, selectedStudyId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [studies, setStudies] = useState([]);
  const [availableDownloads, setAvailableDownloads] = useState({});

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        closeMenu();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen]);

  useEffect(() => {
    Promise.all([
      fetch('../data/passages.json', { cache: 'no-store' }).then(res => res.ok ? res.json() : Promise.reject()),
      fetch('../data/downloads.json', { cache: 'no-store' }).then(res => res.ok ? res.json() : Promise.reject())
    ])
      .then(([passagesData, downloadsData]) => {
        setStudies(Array.isArray(passagesData?.studies) ? passagesData.studies : []);
        setAvailableDownloads(downloadsData || {});
      })
      .catch(() => {});
  }, []);

  const handleNav = (view) => {
    setActiveView(view);
    closeMenu();
  };

  const activeStudy = studies.find(s => s.id === selectedStudyId) || findWeeklyStudy(studies);
  const curLang = lang === 'en' ? 'en' : 'nl';
  const curId = activeStudy?.id;

  const getDownloadUrl = (url) => {
    if (!url) return null;
    const normalized = url.startsWith('/') ? url : `/${url}`;
    return availableDownloads[normalized] ? normalized : null;
  };

  const firstAvailableDownload = (...urls) => {
    for (const url of urls) {
      const available = getDownloadUrl(url);
      if (available) return available;
    }
    return null;
  };

  const readingLabel = curLang === 'en' ? 'reading' : 'lezing';
  const studyLabel = curLang === 'en' ? 'study-sheet' : 'studieblad';
  const worksheetLabel = curLang === 'en' ? 'worksheet' : 'werkblad';

  const documentLinks = curId ? [
    {
      key: 'reading-pdf',
      label: lang === 'nl' ? 'Lezing (PDF)' : 'Reading (PDF)',
      url: firstAvailableDownload(
        lang === 'nl' ? activeStudy?.download_pdf_nl : activeStudy?.download_pdf_en,
        `/downloads/lezingen/${curId}-lezing-${curLang}.pdf`,
        `/downloads/lezingen/${curId}-${readingLabel}-${curLang}.pdf`
      )
    },
    {
      key: 'reading-docx',
      label: lang === 'nl' ? 'Lezing (DOCX)' : 'Reading (DOCX)',
      url: firstAvailableDownload(
        lang === 'nl' ? activeStudy?.download_docx_nl : activeStudy?.download_docx_en,
        `/downloads/lezingen/${curId}-lezing-${curLang}.docx`,
        `/downloads/lezingen/${curId}-${readingLabel}-${curLang}.docx`
      )
    },
    {
      key: 'study-pdf',
      label: lang === 'nl' ? 'Studieblad (PDF)' : 'Study sheet (PDF)',
      url: firstAvailableDownload(
        lang === 'nl' ? activeStudy?.download_study_pdf_nl : activeStudy?.download_study_pdf_en,
        `/downloads/studiebladen/${curId}-studieblad-${curLang}.pdf`,
        `/downloads/studiebladen/${curId}-${studyLabel}-${curLang}.pdf`
      )
    },
    {
      key: 'study-docx',
      label: lang === 'nl' ? 'Studieblad (DOCX)' : 'Study sheet (DOCX)',
      url: firstAvailableDownload(
        lang === 'nl' ? activeStudy?.download_study_docx_nl : activeStudy?.download_study_docx_en,
        `/downloads/studiebladen/${curId}-studieblad-${curLang}.docx`,
        `/downloads/studiebladen/${curId}-${studyLabel}-${curLang}.docx`
      )
    },
    {
      key: 'worksheet-pdf',
      label: lang === 'nl' ? 'Werkblad (PDF)' : 'Worksheet (PDF)',
      url: firstAvailableDownload(
        lang === 'nl' ? activeStudy?.download_worksheet_pdf_nl : activeStudy?.download_worksheet_pdf_en,
        `/downloads/werkbladen/${curId}-werkblad-${curLang}.pdf`,
        `/downloads/werkbladen/${curId}-${worksheetLabel}-${curLang}.pdf`
      )
    },
    {
      key: 'worksheet-docx',
      label: lang === 'nl' ? 'Werkblad (DOCX)' : 'Worksheet (DOCX)',
      url: firstAvailableDownload(
        lang === 'nl' ? activeStudy?.download_worksheet_docx_nl : activeStudy?.download_worksheet_docx_en,
        `/downloads/werkbladen/${curId}-werkblad-${curLang}.docx`,
        `/downloads/werkbladen/${curId}-${worksheetLabel}-${curLang}.docx`
      )
    },
    {
      key: 'epub',
      label: 'EPUB',
      url: firstAvailableDownload(`/downloads/epub/${curId}-${curLang}.epub`)
    }
  ].filter(item => item.url) : [];

  const handlePrint = () => {
    closeMenu();
    window.setTimeout(() => window.print(), 50);
  };

  const toggleLanguage = () => {
    const nextLang = lang === 'nl' ? 'en' : 'nl';
    setLang(nextLang);
    closeMenu();
  };

  const labels = lang === 'nl' ? {
    brand: 'Zelf de parasja lezen',
    watIsParasja: 'Wat is de parasja',
    worksheet: 'Lees de parasja',
    documents: 'Documenten',
    printPage: 'Print / opslaan als PDF',
    waaromWebsite: 'Waarom deze website',
    method: 'Over de methode',
    handbook: 'Handleiding',
    articles: 'Artikelen',
    contact: 'Contact',
    langSwitch: 'English',
    menuOpen: 'Menu openen',
    menuClose: 'Menu sluiten'
  } : {
    brand: 'Read the Parashah Yourself',
    watIsParasja: 'What is the Parashah',
    worksheet: 'Read the parashah',
    documents: 'Documents',
    printPage: 'Print / save as PDF',
    waaromWebsite: 'Why this website',
    method: 'About the method',
    handbook: 'Handbook',
    articles: 'Articles',
    contact: 'Contact',
    langSwitch: 'Nederlands',
    menuOpen: 'Open menu',
    menuClose: 'Close menu'
  };

  const handbookUrl = lang === 'nl' ? '../nl/handleiding.html' : '../en/handbook.html';
  const articlesUrl = '../nl/artikelen/';
  const contactUrl = lang === 'nl' ? '../nl/contact.html' : '../en/contact.html';

  return (
    <header className="site-navbar">
      <div className="navbar-container">
        <a
          href={lang === 'nl' ? '../nl/index.html' : '../en/index.html'}
          onClick={() => handleNav('intro')}
          className="brand-logo"
        >
          <BookOpen className="brand-icon" aria-hidden="true" />
          <span>{labels.brand}</span>
        </a>

        <nav className="desktop-nav" aria-label="Hoofdnavigatie">
          <a
            href={lang === 'nl' ? '../nl/index.html#wat-is-de-parasja' : '../en/index.html#wat-is-de-parasja'}
            className={`nav-link ${activeView === 'intro' ? 'active' : ''}`}
            onClick={() => handleNav('intro')}
          >
            {labels.watIsParasja}
          </a>

          <a
            href={lang === 'nl' ? '../nl/index.html#werkblad' : '../en/index.html#worksheet'}
            className={`nav-link ${activeView === 'worksheet' ? 'active' : ''}`}
            onClick={() => handleNav('worksheet')}
          >
            {labels.worksheet}
          </a>

          <a
            href={lang === 'nl' ? '../nl/index.html#waarom-deze-website' : '../en/index.html#waarom-deze-website'}
            className={`nav-link ${activeView === 'waarom-deze-website' ? 'active' : ''}`}
            onClick={() => handleNav('waarom-deze-website')}
          >
            {labels.waaromWebsite}
          </a>

          <a
            href={lang === 'nl' ? '../nl/index.html#methode' : '../en/index.html#method'}
            className={`nav-link ${activeView === 'method' ? 'active' : ''}`}
            onClick={() => handleNav('method')}
          >
            {labels.method}
          </a>

          <a
            href={handbookUrl}
            className={`nav-link ${activeView === 'handbook' ? 'active' : ''}`}
            onClick={closeMenu}
          >
            {labels.handbook}
          </a>

          {lang === 'nl' && (
            <a
              href={articlesUrl}
              className={`nav-link ${activeView === 'articles' ? 'active' : ''}`}
              onClick={closeMenu}
            >
              {labels.articles}
            </a>
          )}

          <a
            href={contactUrl}
            className={`nav-link ${activeView === 'contact' ? 'active' : ''}`}
            onClick={closeMenu}
          >
            {labels.contact}
          </a>

          <button type="button" className="lang-btn" onClick={toggleLanguage}>
            <Globe className="lang-icon" aria-hidden="true" />
            <span>{labels.langSwitch}</span>
          </button>
        </nav>

        <button
          type="button"
          className="hamburger-btn"
          onClick={toggleMenu}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation-drawer"
          aria-label={isOpen ? labels.menuClose : labels.menuOpen}
        >
          {isOpen ? <X size={22} aria-hidden="true" /> : <Menu size={22} aria-hidden="true" />}
          <span>Menu</span>
        </button>
      </div>

      <div className={`mobile-overlay ${isOpen ? 'open' : ''}`} onClick={closeMenu} inert={!isOpen ? "" : undefined}>
        <div id="mobile-navigation-drawer" className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
          <a
            href={lang === 'nl' ? '../nl/index.html#wat-is-de-parasja' : '../en/index.html#wat-is-de-parasja'}
            className={`nav-link ${activeView === 'intro' ? 'active' : ''}`}
            onClick={() => handleNav('intro')}
          >
            <Info className="nav-icon" aria-hidden="true" />
            <span>{labels.watIsParasja}</span>
          </a>

          <a
            href={lang === 'nl' ? '../nl/index.html#werkblad' : '../en/index.html#worksheet'}
            className={`nav-link ${activeView === 'worksheet' ? 'active' : ''}`}
            onClick={() => handleNav('worksheet')}
          >
            <BookOpen className="nav-icon" aria-hidden="true" />
            <span>{labels.worksheet}</span>
          </a>

          <div
            className="drawer-section-title"
            style={{ padding: '14px 16px 6px', fontSize: '12px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', color: 'var(--muted)' }}
          >
            {labels.documents}
          </div>

          {documentLinks.map(item => (
            <a
              key={item.key}
              href={item.url}
              download
              className="nav-link"
              onClick={closeMenu}
            >
              <FileText className="nav-icon" aria-hidden="true" />
              <span>{item.label}</span>
            </a>
          ))}

          <button
            type="button"
            className="nav-link"
            onClick={handlePrint}
            style={{ width: '100%', border: 0, background: 'transparent', textAlign: 'left', cursor: 'pointer' }}
          >
            <Printer className="nav-icon" aria-hidden="true" />
            <span>{labels.printPage}</span>
          </button>

          <a
            href={lang === 'nl' ? '../nl/index.html#waarom-deze-website' : '../en/index.html#waarom-deze-website'}
            className={`nav-link ${activeView === 'waarom-deze-website' ? 'active' : ''}`}
            onClick={() => handleNav('waarom-deze-website')}
          >
            <Compass className="nav-icon" aria-hidden="true" />
            <span>{labels.waaromWebsite}</span>
          </a>

          <a
            href={lang === 'nl' ? '../nl/index.html#methode' : '../en/index.html#method'}
            className={`nav-link ${activeView === 'method' ? 'active' : ''}`}
            onClick={() => handleNav('method')}
          >
            <HelpCircle className="nav-icon" aria-hidden="true" />
            <span>{labels.method}</span>
          </a>

          <a
            href={handbookUrl}
            className={`nav-link ${activeView === 'handbook' ? 'active' : ''}`}
            onClick={closeMenu}
          >
            <Book className="nav-icon" aria-hidden="true" />
            <span>{labels.handbook}</span>
          </a>

          {lang === 'nl' && (
            <a
              href={articlesUrl}
              className={`nav-link ${activeView === 'articles' ? 'active' : ''}`}
              onClick={closeMenu}
            >
              <Newspaper className="nav-icon" aria-hidden="true" />
              <span>{labels.articles}</span>
            </a>
          )}

          <a
            href={contactUrl}
            className={`nav-link ${activeView === 'contact' ? 'active' : ''}`}
            onClick={closeMenu}
          >
            <Mail className="nav-icon" aria-hidden="true" />
            <span>{labels.contact}</span>
          </a>

          <hr className="drawer-divider" />
          <button type="button" className="lang-btn mobile-lang-btn" onClick={toggleLanguage}>
            <Globe className="lang-icon" aria-hidden="true" />
            <span>{labels.langSwitch}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
