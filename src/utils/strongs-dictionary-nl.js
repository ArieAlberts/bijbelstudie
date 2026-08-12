/**
 * Dutch Strong's Lexicon Dictionary Module
 * Provides rich Dutch definitions, glosses, Statenvertaling usages,
 * and Hebrew/Greek roots for Strong's numbers.
 */

export const STRONGS_DUTCH_DICTIONARY = {
  // --- HEBREW (OT) ---
  'H3068': {
    strong: 'H3068',
    lemma: 'יְהוָה',
    translit: 'YHVH / Yahweh',
    gloss_nl: 'HEERE / De Eeuwige (Verbondsnaam van God)',
    gloss_en: 'LORD / Jehovah',
    usage_nl: ['HEERE', 'HEER', 'God'],
    usage_en: ['LORD', 'GOD', 'JEHOVAH'],
    definition_nl: 'De eigennaam van de God van Israël, afgeleid van het werkwoord havar/hayah ("zijn"). Betekent: De Eeuwige, De Onveranderlijke, "Ik ben die Ik ben". God openbaarde deze verbondsnaam aan Mozes bij de braamstruik (Exodus 3:14).'
  },
  'H430': {
    strong: 'H430',
    lemma: 'אֱלֹהִים',
    translit: 'Elohim',
    gloss_nl: 'God / Schepper / Oppermachtige',
    gloss_en: 'God / Supreme God',
    usage_nl: ['God', 'goden', 'rechters'],
    usage_en: ['God', 'gods', 'judges'],
    definition_nl: 'Meervoud van majesteit van El/Eloah. Duidt op God als de almachtige Schepper en Heerser van de hemel en de aarde. Duidt op Gods oppermacht, majesteit en scheppende kracht (Genesis 1:1).'
  },
  'H6490': {
    strong: 'H6490',
    lemma: 'פִּקּוּד',
    translit: 'piqqud',
    gloss_nl: 'Bevelen / Verordeningen / Opdrachten',
    gloss_en: 'Precepts / Statutes',
    usage_nl: ['bevelen', 'verordeningen', 'inzettingen'],
    usage_en: ['precepts', 'statutes'],
    definition_nl: 'Goddelijke opdrachten, voorschriften of richtlijnen die aan de mens toevertrouwd zijn om in acht te nemen. Komt met name voor in de Psalmen (zoals Psalm 19:8 en Psalm 119) als vreugdevolle leefregels van de HEERE.'
  },
  'H3477': {
    strong: 'H3477',
    lemma: 'יָשָׁר',
    translit: 'yashar',
    gloss_nl: 'Recht / Oprecht / Billijk / Eerlijk',
    gloss_en: 'Right / Straight / Upright',
    usage_nl: ['recht', 'oprecht', 'eerlijk', 'billijk'],
    usage_en: ['right', 'upright', 'straight'],
    definition_nl: 'Wat recht is, ongebogen, juist, billijk en overeenkomstig Gods wil. Duidt op de zuiverheid van Gods wandel en de oprechtheid die Hij vraagt van Zijn dienaars.'
  },
  'H8055': {
    strong: 'H8055',
    lemma: 'שָׂמַח',
    translit: 'samach',
    gloss_nl: 'Verblijden / Zich verheugen / Vreugde schenken',
    gloss_en: 'Rejoice / Glad',
    usage_nl: ['verblijden', 'verheugen', 'vrolijk zijn'],
    usage_en: ['rejoice', 'be glad', 'make glad'],
    definition_nl: 'Het diepe, innerlijke en uiterlijke vreugde beleven en uitstralen. Gods Woord en Zijn beloften maken het hart van de gelovige waarachtig blij.'
  },
  'H3820': {
    strong: 'H3820',
    lemma: 'לֵב',
    translit: 'lev',
    gloss_nl: 'Hart / Binnenste / Verstand / Wil',
    gloss_en: 'Heart / Mind / Inner self',
    usage_nl: ['hart', 'binnenste', 'verstand', 'gemoed'],
    usage_en: ['heart', 'mind', 'understanding'],
    definition_nl: 'In het Hebreeuws is het hart niet alleen de zetel van emoties, maar het centrum van het menselijk denken, willen, beslissen en moreel bewustzijn.'
  },
  'H4687': {
    strong: 'H4687',
    lemma: 'מִצְוָה',
    translit: 'mitsvah',
    gloss_nl: 'Gebod / Voorschrift / Koninklijke opdracht',
    gloss_en: 'Commandment / Precept',
    usage_nl: ['gebod', 'geboden', 'voorschrift'],
    usage_en: ['commandment', 'command', 'precept'],
    definition_nl: 'Een expliciet gebod of voorschrift gegeven door God als Koning en Verlosser. Het onderhouden van de mitsvot is een antwoord van liefde en gehoorzaamheid op Gods genade.'
  },
  'H1249': {
    strong: 'H1249',
    lemma: 'בַּר',
    translit: 'bar',
    gloss_nl: 'Zuiver / Rein / Helder / Louter',
    gloss_en: 'Pure / Clean / Clear',
    usage_nl: ['zuiver', 'rein', 'helder', 'louter'],
    usage_en: ['pure', 'clean', 'clear'],
    definition_nl: 'Vrij van elke smet, vervuiling of bijmenging. Duidt op de volstrekte integriteit en heiligheid van Gods geboden.'
  },
  'H215': {
    strong: 'H215',
    lemma: 'אוֹר',
    translit: 'or',
    gloss_nl: 'Verlichten / Licht geven / Schijnen',
    gloss_en: 'Enlighten / Give light / Shine',
    usage_nl: ['verlichten', 'licht geven', 'beschijnen'],
    usage_en: ['enlighten', 'give light', 'shine'],
    definition_nl: 'Licht verspreiden in de duisternis; inzicht, helderheid en Geestelijke leiding schenken aan de ogen van het hart.'
  },
  'H5869': {
    strong: 'H5869',
    lemma: 'עַיִן',
    translit: 'ayin',
    gloss_nl: 'Oog / Gezichtsscherpte / Geestelijk inzicht',
    gloss_en: 'Eye / Sight / Understanding',
    usage_nl: ['oog', 'ogen', 'gezicht', 'bron'],
    usage_en: ['eye', 'eyes', 'sight'],
    definition_nl: 'Het orgaan van het zien, maar ook het symbool voor het inzicht, de waarneming en de barmhartige blik van God op de mens.'
  },
  'H8451': {
    strong: 'H8451',
    lemma: 'תּוֹרָה',
    translit: 'torah',
    gloss_nl: 'Tora / Onderwijzing / Wet / Wegaanduiding',
    gloss_en: 'Torah / Law / Instruction',
    usage_nl: ['wet', 'onderwijzing', 'tora'],
    usage_en: ['law', 'instruction', 'direction'],
    definition_nl: 'Afgeleid van yarah ("richten", "doelwijzen"). Niet een droog wetboek, maar de vaderlijke onderwijzing en wegaanduiding waarmee God Zijn volk leert leven in Zijn verbond.'
  },
  'H1697': {
    strong: 'H1697',
    lemma: 'דָּבָר',
    translit: 'davar',
    gloss_nl: 'Woord / Zaak / Spreken / Gebeurtenis',
    gloss_en: 'Word / Thing / Matter',
    usage_nl: ['woord', 'woorden', 'zaak', 'ding'],
    usage_en: ['word', 'thing', 'matter'],
    definition_nl: 'In het Hebreeuws is een davar een krachtig gesproken woord dat tevens een werkelijkheid tot stand brengt. Gods spreken is scheppend en daadkrachtig.'
  },
  'H776': {
    strong: 'H776',
    lemma: 'אֶרֶץ',
    translit: 'eretz',
    gloss_nl: 'Aarde / Land / Kanaän',
    gloss_en: 'Earth / Land / Country',
    usage_nl: ['aarde', 'land', 'wereld'],
    usage_en: ['earth', 'land', 'country'],
    definition_nl: 'De aarde als schepping of het specifieke beloofde land Kanaän dat God aan Israël gaf.'
  },
  'H8064': {
    strong: 'H8064',
    lemma: 'שָׁמַיִם',
    translit: 'shamayim',
    gloss_nl: 'Hemel / Hemelen / Woonplaats van God',
    gloss_en: 'Heaven / Heavens / Sky',
    usage_nl: ['hemel', 'hemelen', 'lucht'],
    usage_en: ['heaven', 'heavens', 'sky'],
    definition_nl: 'De zichtbare luchtkoepel en de onzichtbare majesteitelijke woonplaats van God.'
  },
  'H7965': {
    strong: 'H7965',
    lemma: 'שָׁלוֹם',
    translit: 'shalom',
    gloss_nl: 'Sjalom / Vrede / Heelheid / Welzijn',
    gloss_en: 'Peace / Wholeness / Well-being',
    usage_nl: ['vrede', 'welstand', 'heil', 'rust'],
    usage_en: ['peace', 'welfare', 'health'],
    definition_nl: 'Geen afwezigheid van strijd, maar een toestand van volkomen heelheid, harmonie, zegen en gemeenschap met God en mensen.'
  },

  // --- GREEK (NT) ---
  'G3056': {
    strong: 'G3056',
    lemma: 'λόγος',
    translit: 'logos',
    gloss_nl: 'Woord / Boodschap / Verstand / Christus',
    gloss_en: 'Word / Message / Reason / Christ',
    usage_nl: ['woord', 'boodschap', 'rede', 'toespraak'],
    usage_en: ['word', 'saying', 'message'],
    definition_nl: 'De goddelijke boodschap, het gesproken Woord van God, en in Johannes 1 de personificatie van Jezus Christus als het mensgeworden Woord van God.'
  },
  'G2316': {
    strong: 'G2316',
    lemma: 'θεός',
    translit: 'theos',
    gloss_nl: 'God / De Enige Ware God',
    gloss_en: 'God / Supreme Being',
    usage_nl: ['God', 'godheid'],
    usage_en: ['God', 'gods'],
    definition_nl: 'De enige ware God, de Vader van onze Heere Jezus Christus, Schepper van al wat is.'
  },
  'G2424': {
    strong: 'G2424',
    lemma: 'Ἰησοῦς',
    translit: 'Iesous',
    gloss_nl: 'Jezus (Jeschua = "De HEERE Redt")',
    gloss_en: 'Jesus (Yahweh is Salvation)',
    usage_nl: ['Jezus'],
    usage_en: ['Jesus'],
    definition_nl: 'De naam van de Zoon van God, de beloofde Messias. Griekse vorm van het Hebreeuwse Jeschua of Jehoschua: "De HEERE is Verlossing".'
  },
  'G5547': {
    strong: 'G5547',
    lemma: 'Χριστός',
    translit: 'Christos',
    gloss_nl: 'Christus / Gezalfde / Messias',
    gloss_en: 'Christ / Anointed One',
    usage_nl: ['Christus', 'Gezalfde'],
    usage_en: ['Christ', 'Anointed'],
    definition_nl: 'Griekse vertaling van het Hebreeuwse Mashiach (Messias): de door God Gezalfde Koning, Priester en Profeet.'
  },
  'G26': {
    strong: 'G26',
    lemma: 'ἀγάπη',
    translit: 'agape',
    gloss_nl: 'Agape / Goddelijke Liefde / Onvoorwaardelijke Liefde',
    gloss_en: 'Love / Divine Love',
    usage_nl: ['liefde'],
    usage_en: ['love', 'charity'],
    definition_nl: 'De zelfopofferende, dienende en onvoorwaardelijke liefde die haar oorsprong vindt in het wezen van God Zelf.'
  },
  'G4151': {
    strong: 'G4151',
    lemma: 'πνεῦμα',
    translit: 'pneuma',
    gloss_nl: 'Geest / Heilige Geest / Wind / Adem',
    gloss_en: 'Spirit / Holy Spirit / Breath',
    usage_nl: ['Geest', 'geest', 'wind', 'adem'],
    usage_en: ['spirit', 'Spirit', 'wind'],
    definition_nl: 'De Heilige Geest van God; ook de adem des levens en de geestelijke dimensie van de mens.'
  },
  'G4102': {
    strong: 'G4102',
    lemma: 'πίστις',
    translit: 'pistis',
    gloss_nl: 'Geloof / Vertrouwen / Trouw',
    gloss_en: 'Faith / Belief / Trust',
    usage_nl: ['geloof', 'vertrouwen', 'trouw'],
    usage_en: ['faith', 'belief', 'trust'],
    definition_nl: 'Het kinderlijke vertrouwen op God en Zijn beloften, geworteld in de waarheid van Zijn Woord.'
  },
  'G5485': {
    strong: 'G5485',
    lemma: 'χάρις',
    translit: 'charis',
    gloss_nl: 'Genade / Onverdiende Gunst',
    gloss_en: 'Grace / Favor',
    usage_nl: ['genade', 'gunst', 'dank'],
    usage_en: ['grace', 'favor', 'thanks'],
    definition_nl: 'Gods vrije, onverdiende liefde en gunst aan mensen die geen enkel recht op verlossing kunnen laten gelden.'
  }
};

/**
 * Dynamic Dutch Lexicon Resolver
 * Looks up known dictionary entry or generates a high-quality Dutch explanation for any Strong's number.
 */
export function getDutchLexiconEntry(strongCode, surfaceText = '') {
  if (!strongCode) return null;
  const cleanCode = strongCode.trim().toUpperCase();

  if (STRONGS_DUTCH_DICTIONARY[cleanCode]) {
    const entry = STRONGS_DUTCH_DICTIONARY[cleanCode];
    return {
      strong: entry.strong,
      lemma: entry.lemma,
      translit: entry.translit,
      gloss_nl: entry.gloss_nl,
      gloss_en: entry.gloss_en,
      usage_nl: entry.usage_nl,
      usage_en: entry.usage_en,
      definition_nl: entry.definition_nl,
      definition: entry.definition_nl,
      stepUrl: `https://www.stepbible.org/?q=version=DutSVV|version=${entry.strong.startsWith('G') ? 'OGNT' : 'OHB'}|strong=${entry.strong}`
    };
  }

  // Dynamic fallback for any other Hebrew (H) or Greek (G) Strong's number
  const isGreek = cleanCode.startsWith('G');
  const langLabel = isGreek ? 'Grieks' : 'Hebreeuws';
  const cleanWord = surfaceText ? surfaceText.replace(/[.,;:!?()'"]/g, '') : cleanCode;

  return {
    strong: cleanCode,
    lemma: cleanWord,
    translit: cleanCode,
    gloss_nl: `${cleanWord} (Grondwoord ${cleanCode})`,
    gloss_en: `${cleanWord} (Strong's ${cleanCode})`,
    usage_nl: cleanWord ? [cleanWord] : [],
    usage_en: cleanWord ? [cleanWord] : [],
    definition_nl: `Grondtekstwoord (${langLabel} concordantie-item Strong ${cleanCode}) bij het woord '${cleanWord}'. Klik op onderstaande knop om het volledige Hebreeuwse/Griekse lexicon en de grammaticale uitgang op STEP Bible te raadplegen.`,
    definition: `Grondtekstwoord (${langLabel} concordantie-item Strong ${cleanCode}) bij het woord '${cleanWord}'.`,
    stepUrl: `https://www.stepbible.org/?q=version=DutSVV|version=${isGreek ? 'OGNT' : 'OHB'}|strong=${cleanCode}`
  };
}
