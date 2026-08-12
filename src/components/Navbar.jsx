import React, { useState, useEffect } from 'react';
import { Menu, X, BookOpen, HelpCircle, Book, Mail, Globe, Compass, Info } from 'lucide-react';

export default function Navbar({ activeView, setActiveView, lang, setLang }) {
  const [isOpen, setIsOpen] = useState(false);

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

  const handleNav = (view) => {
    setActiveView(view);
    closeMenu();
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
    waaromWebsite: 'Waarom deze website',
    method: 'Over de methode',
    handbook: 'Handleiding',
    contact: 'Contact',
    langSwitch: 'English',
    menuOpen: 'Menu openen',
    menuClose: 'Menu sluiten'
  } : {
    brand: 'Read the Parashah Yourself',
    watIsParasja: 'What is the Parashah',
    worksheet: 'Read the parashah',
    waaromWebsite: 'Why this website',
    method: 'About the method',
    handbook: 'Handbook',
    contact: 'Contact',
    langSwitch: 'Nederlands',
    menuOpen: 'Open menu',
    menuClose: 'Close menu'
  };

  const handbookUrl = lang === 'nl' ? '../nl/handleiding.html' : '../en/handbook.html';
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

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav" aria-label="Hoofdnavigatie">
          {/* 1. Wat is de parasja */}
          <a
            href={lang === 'nl' ? '../nl/index.html#wat-is-de-parasja' : '../en/index.html#wat-is-de-parasja'}
            className={`nav-link ${activeView === 'intro' ? 'active' : ''}`}
            onClick={() => handleNav('intro')}
          >
            {labels.watIsParasja}
          </a>

          {/* 2. Lees de parasja (2nd position - primary purpose!) */}
          <a
            href={lang === 'nl' ? '../nl/index.html#werkblad' : '../en/index.html#worksheet'}
            className={`nav-link ${activeView === 'worksheet' ? 'active' : ''}`}
            onClick={() => handleNav('worksheet')}
          >
            {labels.worksheet}
          </a>

          {/* 3. Waarom deze website */}
          <a
            href={lang === 'nl' ? '../nl/index.html#waarom-deze-website' : '../en/index.html#waarom-deze-website'}
            className={`nav-link ${activeView === 'waarom-deze-website' ? 'active' : ''}`}
            onClick={() => handleNav('waarom-deze-website')}
          >
            {labels.waaromWebsite}
          </a>

          {/* 4. Over de methode */}
          <a
            href={lang === 'nl' ? '../nl/index.html#methode' : '../en/index.html#method'}
            className={`nav-link ${activeView === 'method' ? 'active' : ''}`}
            onClick={() => handleNav('method')}
          >
            {labels.method}
          </a>

          {/* 5. Handleiding */}
          <a
            href={handbookUrl}
            className={`nav-link ${activeView === 'handbook' ? 'active' : ''}`}
            onClick={() => closeMenu()}
          >
            {labels.handbook}
          </a>

          {/* 6. Contact */}
          <a
            href={contactUrl}
            className={`nav-link ${activeView === 'contact' ? 'active' : ''}`}
            onClick={() => closeMenu()}
          >
            {labels.contact}
          </a>

          <button type="button" className="lang-btn" onClick={toggleLanguage}>
            <Globe className="lang-icon" aria-hidden="true" />
            <span>{labels.langSwitch}</span>
          </button>
        </nav>

        {/* Hamburger Menu Toggle Button for Mobile */}
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

      {/* Mobile Drawer Overlay */}
      <div className={`mobile-overlay ${isOpen ? 'open' : ''}`} onClick={closeMenu}>
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
            onClick={() => closeMenu()}
          >
            <Book className="nav-icon" aria-hidden="true" />
            <span>{labels.handbook}</span>
          </a>

          <a
            href={contactUrl}
            className={`nav-link ${activeView === 'contact' ? 'active' : ''}`}
            onClick={() => closeMenu()}
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
