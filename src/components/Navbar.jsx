import React, { useState } from 'react';
import { Menu, X, BookOpen, HelpCircle, Book, Mail, Globe } from 'lucide-react';

export default function Navbar({ activeView, setActiveView, lang, setLang }) {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

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
    worksheet: 'Lees de parasja',
    method: 'Over de methode',
    handbook: 'Handleiding',
    contact: 'Contact',
    langSwitch: 'English'
  } : {
    brand: 'Read the Parashah Yourself',
    worksheet: 'Read the parashah',
    method: 'About the method',
    handbook: 'Handbook',
    contact: 'Contact',
    langSwitch: 'Nederlands'
  };

  const handbookUrl = lang === 'nl' ? '../nl/handleiding.html' : '../en/handbook.html';
  const contactUrl = lang === 'nl' ? '../nl/contact.html' : '../en/contact.html';

  return (
    <header className="site-navbar">
      <div className="navbar-container">
        <a href={lang === 'nl' ? '../nl/index.html' : '../en/index.html'} onClick={() => closeMenu()} className="brand-logo">
          <BookOpen className="w-5 h-5" style={{ color: 'var(--accent)' }} />
          <span>{labels.brand}</span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="desktop-nav" aria-label="Hoofdnavigatie">
          <a
            href={lang === 'nl' ? '../nl/index.html#werkblad' : '../en/index.html#worksheet'}
            className={`nav-link ${activeView === 'worksheet' ? 'active' : ''}`}
            onClick={() => handleNav('worksheet')}
          >
            {labels.worksheet}
          </a>
          <a
            href={lang === 'nl' ? '../nl/index.html#methode' : '../en/index.html#methode'}
            className={`nav-link ${activeView === 'method' ? 'active' : ''}`}
            onClick={() => handleNav('method')}
          >
            {labels.method}
          </a>
          <a
            href={handbookUrl}
            className={`nav-link ${activeView === 'handbook' ? 'active' : ''}`}
            onClick={() => closeMenu()}
          >
            {labels.handbook}
          </a>
          <a
            href={contactUrl}
            className={`nav-link ${activeView === 'contact' ? 'active' : ''}`}
            onClick={() => closeMenu()}
          >
            {labels.contact}
          </a>
          <button className="lang-btn" onClick={toggleLanguage}>
            <Globe size={14} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'middle' }} />
            {labels.langSwitch}
          </button>
        </nav>

        {/* Hamburger Menu Toggle Button for Mobile */}
        <button
          className="hamburger-btn"
          onClick={toggleMenu}
          aria-expanded={isOpen}
          aria-label={isOpen ? "Sluit menu" : "Open menu"}
        >
          {isOpen ? <X size={22} /> : <Menu size={22} />}
          <span>Menu</span>
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      <div className={`mobile-overlay ${isOpen ? 'open' : ''}`} onClick={closeMenu}>
        <div className="mobile-drawer" onClick={(e) => e.stopPropagation()}>
          <a
            href={lang === 'nl' ? '../nl/index.html#werkblad' : '../en/index.html#worksheet'}
            className={`nav-link ${activeView === 'worksheet' ? 'active' : ''}`}
            onClick={() => handleNav('worksheet')}
          >
            <BookOpen size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            {labels.worksheet}
          </a>
          <a
            href={lang === 'nl' ? '../nl/index.html#methode' : '../en/index.html#methode'}
            className={`nav-link ${activeView === 'method' ? 'active' : ''}`}
            onClick={() => handleNav('method')}
          >
            <HelpCircle size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            {labels.method}
          </a>
          <a
            href={handbookUrl}
            className={`nav-link ${activeView === 'handbook' ? 'active' : ''}`}
            onClick={() => closeMenu()}
          >
            <Book size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            {labels.handbook}
          </a>
          <a
            href={contactUrl}
            className={`nav-link ${activeView === 'contact' ? 'active' : ''}`}
            onClick={() => closeMenu()}
          >
            <Mail size={18} style={{ verticalAlign: 'middle', marginRight: '8px' }} />
            {labels.contact}
          </a>
          <hr style={{ border: 0, borderTop: '1px solid var(--line)', margin: '8px 0' }} />
          <button className="lang-btn" onClick={toggleLanguage} style={{ width: '100%', padding: '10px' }}>
            <Globe size={16} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
            {labels.langSwitch}
          </button>
        </div>
      </div>
    </header>
  );
}
