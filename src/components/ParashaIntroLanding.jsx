import React from 'react';
import { BookOpen, Compass, CheckCircle2, Book, FileText, ArrowRight } from 'lucide-react';

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
          <BookOpen className="section-header-icon" size={26} />
          <h2>{isEn ? 'What is a Parashah?' : 'Wat is de parasja?'}</h2>
        </div>

        <div className="section-content-text">
          <p>
            Een <strong>parasja</strong> is een weekgedeelte uit de Tora. De vijf boeken van Mozes zijn verdeeld in vaste leesgedeelten, zodat in de loop van het jaar de hele Tora wordt doorgelezen. Elke parasja draagt een naam die meestal ontleend is aan een van de eerste woorden van het gedeelte. Zo heet het eerste gedeelte van Genesis <em>Beresjiet</em>: “in het begin”.
          </p>

          <p>
            In totaal zijn er vierenvijftig parasjot. Omdat niet ieder jaar evenveel leesweken heeft, worden sommige gedeelten soms samengevoegd. Zo beweegt de lezing door het jaar heen, tot de cyclus rond Simchat Tora wordt afgesloten en Genesis opnieuw wordt geopend. Op de sjabbat wordt de parasja gelezen, meestal samen met een bijpassend gedeelte uit de Profeten: de <strong>haftara</strong>.
          </p>

          <p>
            Maar de parasja is meer dan een handige manier om de Tora in stukken te verdelen. Zij helpt ons om <strong>regelmatig en aandachtig te luisteren naar wat God heeft gesproken</strong>.
          </p>

          <p>
            Wij kiezen daarbij niet iedere week zelf een tekst die bij onze vragen, gevoelens of overtuigingen past. Er ligt al een gedeelte voor ons. Soms spreekt dat gedeelte ons direct aan, soms begrijpen wij het nog niet en soms schuurt het juist met wat wij zelf denken. Dat is waardevol. We leren niet alleen in de Bijbel zoeken naar bevestiging van wat wij al weten, maar ons open te stellen voor wat God ons wil laten zien.
          </p>

          <p style={{ fontWeight: 600, color: 'var(--accent-dark, #6c2c0e)', marginTop: '24px' }}>
            Daarbij is de volgorde belangrijk.
          </p>

          <div className="intro-highlight-banner">
            <strong>Gods gave komt vóór ons antwoord.</strong>
          </div>

          <p>
            Israël ontving Gods onderwijzing niet om daarmee eerst zijn verlossing te verdienen. God had Israël uit Egypte bevrijd en tot Zich gebracht. Vanuit die ontvangen verlossing mocht het volk vervolgens leren wie deze God was, hoe Hij met mensen wilde wonen en welke weg Hij hun gaf om met Hem en met elkaar te leven.
          </p>

          <p>
            Die beweging helpt ook ons bij het lezen.
          </p>

          <p>
            Wij lezen de Tora niet om Gods liefde te verdienen of onze verlossing veilig te stellen. Wij mogen lezen <strong>vanuit wat wij van Hem ontvangen hebben</strong>. Juist omdat God Zich geeft en redt, ontstaat het verlangen om Hem beter te leren kennen. Wie de Gever liefheeft, wil ook ontdekken wat Hij gegeven heeft.
          </p>

          <div className="intro-question-box">
            <p style={{ margin: 0, fontWeight: 600 }}>
              Daarom vragen we bij het lezen niet alleen: <em>Wat moet ik doen?</em> We vragen eerst:
            </p>
            <ul style={{ margin: '12px 0 0', paddingLeft: '20px' }}>
              <li>Wat laat God hier van Zichzelf zien? Wat geeft Hij? Wat belooft Hij? Waar beschermt Hij tegen?</li>
              <li>Wat leert Hij over de mens, over Zijn verbond, over recht, genade, heiligheid, trouw en liefde?</li>
              <li>En welk antwoord vraagt die gave vervolgens van ons?</li>
            </ul>
          </div>

          <p>
            Zo wordt de Tora geen verzameling losse regels, maar een steeds verder opengaand getuigenis van Gods handelen met mensen.
          </p>

          <p>
            Het wekelijkse ritme van de parasja helpt ons daarbij. We hoeven niet alles in één keer te begrijpen. We lezen, luisteren, stellen vragen en komen het volgende jaar opnieuw langs dezelfde gedeelten. Woorden die ons eerder niet opvielen kunnen dan ineens betekenis krijgen. Verbindingen met de Profeten, de Geschriften en het Evangelie worden langzaam zichtbaar.
          </p>

          <p>
            Daarom lezen we de parasja met <strong>open handen</strong>.
          </p>

          <p>
            Niet om uit de tekst te halen wat wij er graag in willen vinden, maar om te ontvangen wat er werkelijk staat. Niet om met onze kennis iets van God te grijpen, maar om Hem beter te leren kennen in wat Hij Zelf heeft gegeven.
          </p>

          <div className="intro-summary-callout">
            <p className="callout-main">
              <strong>De verlossing is de grond. Het Woord is de gave. Ons luisteren en gehoorzamen is het antwoord.</strong>
            </p>
            <p className="callout-sub">
              Week na week mogen we daarom opnieuw zeggen:
            </p>
            <p className="callout-prayer">
              <strong>“Spreek, HEERE, want Uw dienaar hoort.”</strong>
            </p>
          </div>
        </div>
      </section>

      {/* Section 2: Waarom deze website & Functionaliteiten */}
      <section id="waarom-deze-website" className="intro-section-card">
        <div className="section-header">
          <Compass className="section-header-icon" size={26} />
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
