import React from 'react';
import { BookOpen, Compass, ArrowRight } from 'lucide-react';

const COPY = {
  nl: {
    watIsDeParasja: {
      title: 'Wat is de parasja?',
      p1: 'Een <strong>parasja</strong> is een weekgedeelte uit de Tora. De vijf boeken van Mozes zijn verdeeld in vaste leesgedeelten, zodat in de loop van het jaar de hele Tora wordt doorgelezen. Elke parasja draagt een naam die meestal ontleend is aan een van de eerste woorden van het gedeelte. Zo heet het eerste gedeelte van Genesis <em>Beresjiet</em>: “in het begin”.',
      p2: 'In totaal zijn er vierenvijftig parasjot. Omdat niet ieder jaar evenveel leesweken heeft, worden sommige gedeelten soms samengevoegd. Zo beweegt de lezing door het jaar heen, tot de cyclus rond Simchat Tora wordt afgesloten en Genesis opnieuw wordt geopend. Op de sjabbat wordt de parasja gelezen, meestal samen met een bijpassend gedeelte uit de Profeten: de <strong>haftara</strong>.',
      p3: 'Maar de parasja is meer dan een handige manier om de Tora in stukken te verdelen. Zij helpt ons om <strong>regelmatig en aandachtig te luisteren naar wat God heeft gesproken</strong>.',
      p4: 'Wij kiezen daarbij niet iedere week zelf een tekst die bij onze vragen, gevoelens of overtuigingen past. Er ligt al een gedeelte voor ons. Soms spreekt dat gedeelte ons direct aan, soms begrijpen wij het nog niet en soms schuurt het juist met wat wij zelf denken. Dat is waardevol. We leren niet alleen in de Bijbel zoeken naar bevestiging van wat wij al weten, maar ons open te stellen voor wat God ons wil laten zien.',
      sequenceLead: 'Daarbij is de volgorde belangrijk.',
      banner: 'Gods gave komt vóór ons antwoord.',
      p5: 'Israël ontving Gods onderwijzing niet om daarmee eerst zijn verlossing te verdienen. God had Israël uit Egypte bevrijd en tot Zich gebracht. Vanuit die ontvangen verlossing mocht het volk vervolgens leren wie deze God was, hoe Hij met mensen wilde wonen en welke weg Hij hun gaf om met Hem en met elkaar te leven.',
      p6: 'Die beweging helpt ook ons bij het lezen.',
      p7: 'Wij lezen de Tora niet om Gods liefde te verdienen of onze verlossing veilig te stellen. Wij mogen lezen <strong>vanuit wat wij van Hem ontvangen hebben</strong>. Juist omdat God Zich geeft en redt, ontstaat het verlangen om Hem beter te leren kennen. Wie de Gever liefheeft, wil ook ontdekken wat Hij gegeven heeft.',
      qBoxIntro: 'Daarom vragen we bij het lezen niet alleen: <em>Wat moet ik doen?</em> We vragen eerst:',
      qBoxList: [
        'Wat laat God hier van Zichzelf zien? Wat geeft Hij? Wat belooft Hij? Waar beschermt Hij tegen?',
        'Wat leert Hij over de mens, over Zijn verbond, over recht, genade, heiligheid, trouw en liefde?',
        'En welk antwoord vraagt die gave vervolgens van ons?'
      ],
      p8: 'Zo wordt de Tora geen verzameling losse regels, maar een steeds verder opengaand getuigenis van Gods handelen met mensen.',
      p9: 'Het wekelijkse ritme van de parasja helpt ons daarbij. We hoeven niet alles in één keer te begrijpen. We lezen, luisteren, stellen vragen en komen het volgende jaar opnieuw langs dezelfde gedeelten. Woorden die ons eerder niet opvielen kunnen dan ineens betekenis krijgen. Verbindingen met de Profeten, de Geschriften en het Evangelie worden langzaam zichtbaar.',
      p10: 'Daarom lezen we de parasja met <strong>open handen</strong>.',
      p11: 'Niet om uit de tekst te halen wat wij er graag in willen vinden, maar om te ontvangen wat er werkelijk staat. Niet om met onze kennis iets van God te grijpen, maar om Hem beter te leren kennen in wat Hij Zelf heeft gegeven.',
      calloutMain: 'De verlossing is de grond. Het Woord is de gave. Ons luisteren en gehoorzamen is het antwoord.',
      calloutSub: 'Week na week mogen we daarom opnieuw zeggen:',
      calloutPrayer: '“Spreek, HEERE, want Uw dienaar hoort.”',
      ctaReady: 'Klaar om de parasja te lezen?',
      ctaBtn: 'Lees de wekelijkse parasja ▶'
    },
    waaromWebsite: {
      title: 'Waarom deze website?',
      p1: 'Deze website is bedoeld om ons te helpen <strong>zelf de Schrift te lezen</strong>. Niet om een uitleg voor ons te laten denken, maar om eerst aandachtig te horen wat er werkelijk staat.',
      p2: 'Daarom begint deze website bij de <strong>parasja zelf</strong>. Kies het gedeelte van de week, open de Bijbeltekst en neem de tijd om te kijken naar woorden, herhalingen, tegenstellingen, gebeurtenissen en vragen. Schrijf eerst op wat je ziet, voordat je probeert te zeggen wat het betekent.',
      p3: 'De methode, de handleiding, het lexicon en de uitgewerkte lezingen zijn hulpmiddelen. Ze komen niet in de plaats van de tekst. Ze zijn er om je verder te helpen, je waarnemingen te toetsen en verbindingen te leren zien zonder ze aan de tekst op te leggen.',
      howToTitle: 'Zo kun je de website gebruiken',
      howToList: [
        { title: 'Begin bij de parasja.', text: 'Lees eerst zelf de Tora-tekst en, waar aanwezig, de haftara en evangelielezing.' },
        { title: 'Kijk voordat je uitlegt.', text: 'Noteer woorden, handelingen, herhalingen, tegenstellingen, bewegingen en vragen.' },
        { title: 'Gebruik het werkblad.', text: 'Kies de korte of uitgebreide route en leg vast wat je werkelijk in de tekst ziet.' },
        { title: 'Gebruik hulpmiddelen wanneer nodig.', text: 'Raadpleeg woordinformatie, de methode of de handleiding als die helpen om nauwkeuriger te kijken.' },
        { title: 'Lees daarna de wekelijkse lezing.', text: 'Gebruik die als gesprekspartner: wat had je zelf gezien, wat herken je en waar zou jij het anders leggen?' },
        { title: 'Eindig bij het antwoord.', text: 'Vraag wat de tekst over God en de mens laat zien en welk antwoord daarop van ons gevraagd wordt.' }
      ],
      p4: 'Je hoeft niet iedere keer alles te gebruiken. Soms is rustig lezen met één goede vraag genoeg. Op een ander moment kun je een hele week met een parasja optrekken.',
      banner: 'De tekst blijft het land; de methode is alleen een kaart. Een goede kaart helpt ons beter kijken en blijft bereid zichzelf te laten corrigeren door het land.',
      ctaReady: 'Klaar om de wekelijkse lezing te onderzoeken?',
      ctaBtn: 'Ga naar de wekelijkse parasja ▶'
    }
  },
  en: {
    watIsDeParasja: {
      title: 'What is a Parashah?',
      p1: 'A <strong>parashah</strong> is a weekly reading portion from the Torah. The five books of Moses are divided into set reading portions, so that the entire Torah is read over the course of a year. Each parashah bears a name usually derived from one of the first words of the portion. For example, the first portion of Genesis is called <em>Bereshit</em>: "in the beginning".',
      p2: 'In total, there are fifty-four parashot. Because not every year has the same number of reading weeks, some portions are occasionally combined. Thus, the reading moves through the year until the cycle concludes around Simchat Torah and Genesis is opened once again. The parashah is read on the Sabbath, usually along with a matching portion from the Prophets: the <strong>haftarah</strong>.',
      p3: 'But the parashah is more than a convenient way to divide the Torah into pieces. It helps us to <strong>listen regularly and attentively to what God has spoken</strong>.',
      p4: 'We do not choose a text each week that happens to fit our questions, feelings, or beliefs. A portion is already laid out for us. Sometimes that portion speaks to us directly, sometimes we do not yet understand it, and sometimes it clashes with what we ourselves think. That is valuable. We learn not just to search the Bible for confirmation of what we already know, but to open ourselves up to what God wants to show us.',
      sequenceLead: 'In this, the sequence is important.',
      banner: 'God’s gift precedes our response.',
      p5: 'Israel did not receive God’s instruction to earn their salvation first. God had delivered Israel from Egypt and brought them to Himself. Out of that received salvation, the people were then allowed to learn who this God was, how He wanted to dwell with people, and what path He gave them to live with Him and with one another.',
      p6: 'That movement also helps us when reading.',
      p7: 'We do not read the Torah to earn God’s love or secure our salvation. We may read <strong>from what we have received from Him</strong>. Precisely because God gives Himself and saves, the desire arises to know Him better. Whoever loves the Giver also wants to discover what He has given.',
      qBoxIntro: 'Therefore, when reading, we do not only ask: <em>What must I do?</em> We first ask:',
      qBoxList: [
        'What does God show of Himself here? What does He give? What does He promise? What does He protect against?',
        'What does He teach about humanity, about His covenant, about justice, grace, holiness, faithfulness, and love?',
        'And what response does that gift subsequently ask of us?'
      ],
      p8: 'In this way, the Torah is not a collection of disjointed rules, but an increasingly unfolding testimony of God’s dealings with humanity.',
      p9: 'The weekly rhythm of the parashah helps us with this. We do not have to understand everything at once. We read, listen, ask questions, and come across the same portions again the next year. Words that we did not notice before can suddenly gain meaning. Connections with the Prophets, the Writings, and the Gospel slowly become visible.',
      p10: 'That is why we read the parashah with <strong>open hands</strong>.',
      p11: 'Not to extract from the text what we would like to find in it, but to receive what is actually there. Not to grasp something of God with our knowledge, but to get to know Him better in what He Himself has given.',
      calloutMain: 'Salvation is the foundation. The Word is the gift. Our listening and obedience is the response.',
      calloutSub: 'Week after week, we may therefore say again:',
      calloutPrayer: '“Speak, LORD, for Your servant is listening.”',
      ctaReady: 'Ready to read the parashah?',
      ctaBtn: 'Read the weekly parashah ▶'
    },
    waaromWebsite: {
      title: 'Why this website?',
      p1: 'This website is intended to help us <strong>read the Scripture for ourselves</strong>. Not to let an explanation think for us, but to first attentively hear what is actually written.',
      p2: 'Therefore, this website starts with the <strong>parashah itself</strong>. Choose the portion of the week, open the Bible text, and take the time to look at words, repetitions, contrasts, events, and questions. Write down what you see first, before you try to say what it means.',
      p3: 'The method, the handbook, the lexicon, and the elaborated readings are tools. They do not replace the text. They are there to help you further, to test your observations, and to learn to see connections without imposing them on the text.',
      howToTitle: 'How you can use the website',
      howToList: [
        { title: 'Start with the parashah.', text: 'First read the Torah text yourself and, where present, the haftarah and gospel reading.' },
        { title: 'Look before you explain.', text: 'Note words, actions, repetitions, contrasts, movements, and questions.' },
        { title: 'Use the worksheet.', text: 'Choose the short or extended route and record what you actually see in the text.' },
        { title: 'Use tools when needed.', text: 'Consult word information, the method, or the handbook if they help to look more closely.' },
        { title: 'Read the weekly reading afterwards.', text: 'Use it as a conversation partner: what had you seen yourself, what do you recognize, and where would you place it differently?' },
        { title: 'End with the response.', text: 'Ask what the text shows about God and humanity, and what response is required of us.' }
      ],
      p4: 'You do not have to use everything every time. Sometimes quiet reading with one good question is enough. At another time, you can spend a whole week with a parashah.',
      banner: 'The text remains the land; the method is merely a map. A good map helps us look better and remains willing to be corrected by the land itself.',
      ctaReady: 'Ready to explore the weekly portion?',
      ctaBtn: 'Go to the weekly parashah ▶'
    }
  }
};

export default function ParashaIntroLanding({ lang, mode = 'wat-is-de-parasja', onGoToParasha }) {
  const isEn = lang === 'en';
  const c = COPY[isEn ? 'en' : 'nl'];

  if (mode === 'waarom-deze-website') {
    const w = c.waaromWebsite;
    return (
      <div className="parasha-intro-landing">
        <section id="waarom-deze-website" className="intro-section-card">
          <div className="section-header">
            <Compass className="section-header-icon" size={26} />
            <h2>{w.title}</h2>
          </div>

          <div className="section-content-text">
            <p dangerouslySetInnerHTML={{ __html: w.p1 }} />
            <p dangerouslySetInnerHTML={{ __html: w.p2 }} />
            <p dangerouslySetInnerHTML={{ __html: w.p3 }} />

            <h3 style={{ marginTop: '32px', marginBottom: '16px' }}>{w.howToTitle}</h3>
            <div className="feature-grid" style={{ marginBottom: '32px' }}>
              {w.howToList.map((item, i) => (
                <div className="feature-card" key={i}>
                  <div className="feature-icon-wrapper" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '28px', height: '28px', borderRadius: '50%', background: 'var(--accent)', color: '#fff', fontWeight: 600, fontSize: '14px', marginBottom: '12px' }}>
                    {i + 1}
                  </div>
                  <h3 style={{ fontSize: '15px', marginTop: 0 }}>{item.title}</h3>
                  <p style={{ fontSize: '14.5px', marginTop: '6px', color: 'var(--muted)' }}>{item.text}</p>
                </div>
              ))}
            </div>

            <p dangerouslySetInnerHTML={{ __html: w.p4 }} />

            <div className="intro-highlight-banner" style={{ marginTop: '24px' }}>
              <strong>{w.banner}</strong>
            </div>
          </div>

          <div className="intro-bottom-cta" style={{ marginTop: '40px' }}>
            <h3>{w.ctaReady}</h3>
            <button type="button" className="btn-primary-large" onClick={onGoToParasha}>
              <span>{w.ctaBtn}</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </section>
      </div>
    );
  }

  // Default: mode === 'wat-is-de-parasja'
  const p = c.watIsDeParasja;
  return (
    <div className="parasha-intro-landing">
      <section id="wat-is-de-parasja" className="intro-section-card">
        <div className="section-header">
          <BookOpen className="section-header-icon" size={26} />
          <h2>{p.title}</h2>
        </div>

        <div className="section-content-text">
          <p dangerouslySetInnerHTML={{ __html: p.p1 }} />
          <p dangerouslySetInnerHTML={{ __html: p.p2 }} />
          <p dangerouslySetInnerHTML={{ __html: p.p3 }} />
          <p dangerouslySetInnerHTML={{ __html: p.p4 }} />
          
          <p style={{ fontWeight: 600, color: 'var(--accent-dark, #6c2c0e)', marginTop: '24px' }}>
            {p.sequenceLead}
          </p>

          <div className="intro-highlight-banner">
            <strong>{p.banner}</strong>
          </div>

          <p dangerouslySetInnerHTML={{ __html: p.p5 }} />
          <p dangerouslySetInnerHTML={{ __html: p.p6 }} />
          <p dangerouslySetInnerHTML={{ __html: p.p7 }} />

          <div className="intro-question-box">
            <p style={{ margin: 0, fontWeight: 600 }} dangerouslySetInnerHTML={{ __html: p.qBoxIntro }} />
            <ul style={{ margin: '12px 0 0', paddingLeft: '20px' }}>
              {p.qBoxList.map((q, i) => <li key={i}>{q}</li>)}
            </ul>
          </div>

          <p dangerouslySetInnerHTML={{ __html: p.p8 }} />
          <p dangerouslySetInnerHTML={{ __html: p.p9 }} />
          <p dangerouslySetInnerHTML={{ __html: p.p10 }} />
          <p dangerouslySetInnerHTML={{ __html: p.p11 }} />

          <div className="intro-summary-callout">
            <p className="callout-main">
              <strong>{p.calloutMain}</strong>
            </p>
            <p className="callout-sub">
              {p.calloutSub}
            </p>
            <p className="callout-prayer">
              <strong>{p.calloutPrayer}</strong>
            </p>
          </div>
        </div>

        <div className="intro-bottom-cta">
          <h3>{p.ctaReady}</h3>
          <button type="button" className="btn-primary-large" onClick={onGoToParasha}>
            <BookOpen size={18} className="btn-icon" />
            <span>{p.ctaBtn}</span>
          </button>
        </div>
      </section>
    </div>
  );
}
