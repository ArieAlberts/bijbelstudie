import React from 'react';
import { BookOpen, Compass, CheckCircle2, FileText, Download, Sparkles, ArrowRight } from 'lucide-react';

export default function ParashaIntroLanding({ lang, onGoToParasha, onGoToMethod }) {
  const isEn = lang === 'en';

  return (
    <div className="parasha-intro-landing">
      {/* Hero Welcome Section */}
      <section className="intro-hero-card">
        <div className="hero-eyebrow">{isEn ? 'Welcome to Bijbelstudie Parasja' : 'Welkom bij Bijbelstudie Parasja'}</div>
        <h1 className="intro-hero-title">
          {isEn
            ? 'Read the Torah in the rhythm of the weekly parashah'
            : 'Meelezen in het ritme van de wekelijkse parasja'}
        </h1>
        <p className="intro-hero-subtitle">
          {isEn
            ? 'Explore the Word step by step, with an interactive study sheet, interlinear original Hebrew/Greek text, and published commentaries.'
            : 'Onderzoek het Woord stap voor stap, met een interactief werkblad, Hebreeuwse en Griekse grondtekst en gepubliceerde lezingen.'}
        </p>

        <div className="intro-cta-row">
          <button type="button" className="btn-primary-large" onClick={onGoToParasha}>
            <BookOpen size={20} className="btn-icon" />
            <span>{isEn ? 'Read the weekly parashah ▶' : 'Lees de wekelijkse parasja ▶'}</span>
          </button>
          <a href="#waarom-deze-website" className="btn-secondary-large">
            <span>{isEn ? 'Why this website?' : 'Waarom deze website?'}</span>
          </a>
        </div>
      </section>

      {/* Section 1: Wat is de parasja? */}
      <section id="wat-is-de-parasja" className="intro-section-card">
        <div className="section-header">
          <BookOpen className="section-header-icon" size={24} />
          <h2>{isEn ? 'What is a Parashah?' : 'Wat is de Parasja?'}</h2>
        </div>

        <div className="section-content-text">
          <p>
            {isEn
              ? 'A parashah is a weekly portion from the Torah. The five books of Moses are divided into fixed reading portions, one for each week of the year, so that the entire Torah is read through in the course of one year. Each parashah carries a name derived from one of the first words of that portion — thus the beginning of Genesis is named Bereshit ("in the beginning").'
              : 'Een parasja is een weekgedeelte uit de Tora. De vijf boeken van Mozes zijn verdeeld in vaste leesporties, één voor elke week van het jaar, zodat de hele Tora in de loop van één jaar wordt doorgelezen. Elke parasja draagt een naam die ontleend is aan een van de eerste woorden van dat gedeelte — zo heet het begin van Genesis Beresjiet ("in het begin").'}
          </p>

          <p>
            {isEn
              ? 'In total there are fifty-four parashot. Because not every year counts the same number of weeks, some portions are sometimes combined so that the cycle finishes precisely on Simchat Torah, after which it immediately begins anew. On the Sabbath, the parashah is read, often together with a matching portion from the Prophets, the haftarah.'
              : 'In totaal zijn er vierenvijftig parasjot. Omdat niet elk jaar evenveel weken telt, worden sommige gedeelten soms samengevoegd, zodat de cyclus precies rond is en wordt afgesloten op Simchat Tora, waarna hij meteen weer opnieuw begint. Op de sjabbat wordt de parasja gelezen, vaak samen met een bijpassend gedeelte uit de Profeten, de haftara.'}
          </p>

          <blockquote className="parasha-quote-box">
            <p>
              {isEn
                ? 'What makes this structure so special is that we do not pick up the Word as disconnected texts whenever it suits us, but read along in a rhythm that carries us. We do not determine what comes next; we receive what resounds, week after week, and let ourselves be shaped by it.'
                : 'Wat deze indeling zo bijzonder maakt, is dat we het Woord niet als losse teksten oppikken wanneer het ons uitkomt, maar meelezen in een ritme dat ons draagt. We bepalen zelf niet wat er aan de beurt is; we ontvangen wat er klinkt, week na week, en laten ons daardoor vormen.'}
            </p>
          </blockquote>
        </div>
      </section>

      {/* Section 2: Waarom deze website & Functionaliteiten */}
      <section id="waarom-deze-website" className="intro-section-card">
        <div className="section-header">
          <Compass className="section-header-icon" size={24} />
          <h2>{isEn ? 'Why this Website & Features' : 'Waarom deze Website & Functionaliteiten'}</h2>
        </div>

        <p className="section-lead-text">
          {isEn
            ? 'This website was created to support you in studying the Bible text attentively for yourself. Everything is focused on active reading, reflection, and quiet listening.'
            : 'Deze website is gemaakt om je te ondersteunen bij het aandachtig zelf onderzoeken van de Bijbeltekst. Alles is gericht op actief lezen, reflectie en rustig luisteren.'}
        </p>

        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <CheckCircle2 size={22} />
            </div>
            <h3>{isEn ? '11-Step Study Worksheet' : '11-Stappen Interactief Werkblad'}</h3>
            <p>
              {isEn
                ? 'Walk through the text step by step: observe words, identify key themes, note personal questions, and write down insights.'
                : 'Loop stapsgewijs door de tekst: observeer woorden, herken hoofdthema’s, noteer persoonlijke vragen en leg inzichten vast.'}
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <Book size={22} />
            </div>
            <h3>{isEn ? 'Hebrew & Greek Lexicon Reader' : 'Meertalige Grondtekst Lezer'}</h3>
            <p>
              {isEn
                ? 'Access the original Hebrew (OT) and Greek (NT) text with verse-by-verse lexicons, lemma translations, and direct STEP Bible integration.'
                : 'Raadpleeg de originele Hebreeuwse en Griekse grondtekst met woord-voor-woord lexicon, lemmata en directe STEP Bible integratie.'}
            </p>
          </div>

          <div className="feature-card">
            <div className="feature-icon-wrapper">
              <FileText size={22} />
            </div>
            <h3>{isEn ? 'Published Commentary & Export' : 'Gepubliceerde Lezingen & Export'}</h3>
            <p>
              {isEn
                ? 'Read the weekly commentary by Arie Alberts and download readings in PDF, Word (DOCX), EPUB e-book, or print format.'
                : 'Lees de wekelijkse lezing en toelichting door Arie Alberts en download lezingen in PDF, Word (DOCX), EPUB e-book of druk af.'}
            </p>
          </div>
        </div>

        <div className="intro-bottom-cta">
          <h3>{isEn ? 'Ready to explore the weekly portion?' : 'Klaar om de wekelijkse lezing te onderzoeken?'}</h3>
          <button type="button" className="btn-primary-large" onClick={onGoToParasha}>
            <span>{isEn ? 'Go to the Weekly Parashah' : 'Ga naar de Wekelijkse Parasja'}</span>
            <ArrowRight size={18} />
          </button>
        </div>
      </section>
    </div>
  );
}
