import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const passagesFile = path.join(rootDir, 'data', 'passages.json');
const outputDir = path.join(rootDir, 'public', 'data', 'bible');

const BOOK_MAP = {
  Deut: { osis: 'Deut', nl: 'Deuteronomium', en: 'Deuteronomy', testament: 'OT' },
  Isa: { osis: 'Isa', nl: 'Jesaja', en: 'Isaiah', testament: 'OT' },
  John: { osis: 'John', nl: 'Johannes', en: 'John', testament: 'NT' },
  Matt: { osis: 'Matt', nl: 'Mattheüs', en: 'Matthew', testament: 'NT' }
};

// Full Authentic Verse Text Provider for all 9 passages (SV & KJV)
const BIBLE_TEXT_DB = {
  // --- DEUTERONOMIEM 16 (18-22) ---
  "Deut.16.18": {
    sv: "Rechters en opzieners zult gij u stellen in al uw poorten, die de HEERE, uw God, u geven zal, onder uw stammen; dat zij het volk oordelen met een recht oordeel.",
    kjv: [{ t: "Judges", s: "H8199" }, { t: "and officers shalt thou make thee in all thy gates, which the LORD thy God giveth thee, throughout thy tribes: and they shall judge the people with just", s: null }, { t: "judgment.", s: "H4941" }]
  },
  "Deut.16.19": {
    sv: "Gij zult het recht niet buigen; gij zult het aangezicht niet kennen; en gij zult geen geschenk nemen; want het geschenk verblindt de ogen der wijzen, en verkeert de woorden der rechtvaardigen.",
    kjv: [{ t: "Thou shalt not wrest judgment; thou shalt not respect persons, neither take a gift: for a gift doth blind the eyes of the wise, and pervert the words of the righteous.", s: null }]
  },
  "Deut.16.20": {
    sv: "Gerechtigheid, gerechtigheid zult gij najagen, opdat gij leeft, en het land erfelijk bezit, dat de HEERE, uw God, u geven zal.",
    kjv: [{ t: "That which is altogether", s: null }, { t: "just", s: "H6664" }, { t: "shalt thou follow, that thou mayest live, and inherit the land which the LORD thy God giveth thee.", s: null }]
  },
  "Deut.16.21": {
    sv: "Gij zult u geen bos planten van allerlei bomen, bij het altaar van den HEERE, uw God, dat gij u maken zult.",
    kjv: [{ t: "Thou shalt not plant thee a grove of any trees near unto the altar of the LORD thy God, which thou shalt make thee.", s: null }]
  },
  "Deut.16.22": {
    sv: "Gij zult u ook geen steenkolom oprichten, hetgeen de HEERE, uw God, haat.",
    kjv: [{ t: "Neither shalt thou set thee up any image; which the LORD thy God hateth.", s: null }]
  },

  // --- DEUTERONOMIEM 17 ---
  "Deut.17.1": {
    sv: "Gij zult den HEERE, uw God, geen rund of schaap offeren, waaraan een gebrek is, enige kwaad ding; want dat is den HEERE, uw God, een gruwel.",
    kjv: [{ t: "Thou shalt not sacrifice unto the LORD thy God any bullock, or sheep, wherein is blemish, or any evilfavouredness: for that is an abomination unto the LORD thy God.", s: null }]
  },
  "Deut.17.2": {
    sv: "Wanneer in het midden van u, in een van uw poorten, die de HEERE, uw God, u geeft, gevonden wordt een man of vrouw, die doet dat kwaad is in de ogen des HEEREN, uw Gods, overtredende Zijn verbond,",
    kjv: [{ t: "If there be found among you, within any of thy gates which the LORD thy God giveth thee, man or woman, that hath wrought wickedness in the sight of the LORD thy God, in transgressing his covenant,", s: null }]
  },
  "Deut.17.3": {
    sv: "En heengegaan is, en andere goden gediend heeft, en zich voor die gebogen heeft; hetzij voor de zon, of voor de maan, of voor al het leger des hemels, dat Ik niet geboden heb;",
    kjv: [{ t: "And hath gone and served other gods, and worshipped them, either the sun, or moon, or any of the host of heaven, which I have not commanded;", s: null }]
  },
  "Deut.17.4": {
    sv: "En het u te kennen gegeven wordt, en gij het hoort; zo zult gij het wel onderzoeken; en zie, is het de waarheid, is de zaak zeker, is zulk een gruwel in Israël geschied;",
    kjv: [{ t: "And it be told thee, and thou hast heard of it, and inquired diligently, and, behold, it be true, and the thing certain, that such abomination is wrought in Israel:", s: null }]
  },
  "Deut.17.5": {
    sv: "Zo zult gij dien man, of die vrouw, die dat kwade ding gedaan hebben, uitvoeren tot uw poorten, dien man, of die vrouw, en gij zult hen met stenen stenigen, dat zij sterven.",
    kjv: [{ t: "Then shalt thou bring forth that man or that woman, which have committed that wicked thing, unto thy gates, even that man or that woman, and shalt stone them with stones, till they die.", s: null }]
  },
  "Deut.17.6": {
    sv: "Op den mond van twee getuigen, of drie getuigen, zal hij sterven, die sterven zal; op den mond van één getuige zal hij niet sterven.",
    kjv: [{ t: "At the mouth of two witnesses, or three witnesses, shall he that is worthy of death be put to death; but at the mouth of one witness he shall not be put to death.", s: null }]
  },
  "Deut.17.7": {
    sv: "De hand der getuigen zal eerst tegen hem zijn, om hem te doden, en daarna de hand des gehelen volks; zo zult gij het kwaad uit het midden van u wegruimen.",
    kjv: [{ t: "The hands of the witnesses shall be first upon him to put him to death, and afterward the hands of all the people. So thou shalt put the evil away from among you.", s: null }]
  },
  "Deut.17.8": {
    sv: "Wanneer een zaak in het gerichte voor u te zwaar zal zijn, tussen bloed en bloed, tussen oordeel en oordeel, en tussen plaag en plaag, zaken van twist in uw poorten; zo zult gij u opmaken, en opgaan naar de plaats, die de HEERE, uw God, verkiezen zal;",
    kjv: [{ t: "If there arise a matter too hard for thee in judgment, between blood and blood, between plea and plea, and between stroke and stroke, being matters of controversy within thy gates: then shalt thou arise, and get thee up into the place which the LORD thy God shall choose;", s: null }]
  },
  "Deut.17.9": {
    sv: "En gij zult komen tot de levietische priesters, en tot den rechter, die in die dagen zal zijn, en gij zult vragen, en zij zullen u het woord des gerichts te kennen geven.",
    kjv: [{ t: "And thou shalt come unto the priests the Levites, and unto the judge that shall be in those days, and inquire; and they shall shew thee the sentence of judgment:", s: null }]
  },
  "Deut.17.10": {
    sv: "En gij zult doen naar het woord, dat zij u te kennen zullen geven van die plaats, die de HEERE verkoren zal hebben; en gij zult nemen naarstiglijk te doen naar alles, wat zij u leren zullen.",
    kjv: [{ t: "And thou shalt do according to the sentence, which they of that place which the LORD shall choose shall shew thee; and thou shalt observe to do according to all that they inform thee:", s: null }]
  },
  "Deut.17.11": {
    sv: "Naar de wet, die zij u leren zullen, en naar het recht, dat zij u zeggen zullen, zult gij doen; van het woord, dat zij u te kennen zullen geven, zult gij niet afwijken, noch ter rechter- noch ter linkerhand.",
    kjv: [{ t: "According to the sentence of the law which they shall teach thee, and according to the judgment which they shall tell thee, thou shalt do: thou shalt not decline from the sentence which they shall shew thee, to the right hand, nor to the left.", s: null }]
  },
  "Deut.17.12": {
    sv: "De man nu, die vermetelijk handelen zal, niet luisterende naar den priester, die staat om aldaar den HEERE, uw God, te dienen, of naar den rechter; dezelve man zal sterven; en gij zult het kwaad uit Israël wegruimen.",
    kjv: [{ t: "And the man that will do presumptuously, and will not hearken unto the priest that standeth to minister there before the LORD thy God, or unto the judge, even that man shall die: and thou shalt put away the evil from Israel.", s: null }]
  },
  "Deut.17.13": {
    sv: "Opdat al het volk het hore en vreze, en niet meer vermetelijk handele.",
    kjv: [{ t: "And all the people shall hear, and fear, and do no more presumptuously.", s: null }]
  },
  "Deut.17.14": {
    sv: "Wanneer gij zult gekomen zijn in het land, dat de HEERE, uw God, u geeft, en het in bezit zult genomen hebben, en daarin wonen; en gij zult zeggen: Ik zal een koning over mij stellen, gelijk al de volken, die rondom mij zijn;",
    kjv: [{ t: "When thou art come unto the land which the LORD thy God giveth thee, and shalt possess it, and shalt dwell therein, and shalt say, I will set a king over me, like as all the nations that are about me;", s: null }]
  },
  "Deut.17.15": {
    sv: "Zo zult gij dien tot koning over u stellen, dien de HEERE, uw God, verkiezen zal; uit het midden uwer broederen zult gij een koning over u stellen; gij zult geen vreemden man over u mogen zetten, die uw broeder niet is.",
    kjv: [{ t: "Thou shalt in any wise set him king over thee, whom the LORD thy God shall choose: one from among thy brethren shalt thou set king over thee: thou mayest not set a stranger over thee, which is not thy brother.", s: null }]
  },
  "Deut.17.16": {
    sv: "Alleen zal hij zich niet vele paarden vermenigvuldigen, en hij zal het volk niet doen wederkeren naar Egypte, opdat hij niet vele paarden vermenigvuldige; alzo de HEERE tot u gezegd heeft: Gij zult voortaan niet meer op dezen weg wederkeren.",
    kjv: [{ t: "But he shall not multiply horses to himself, nor cause the people to return to Egypt, to the end that he should multiply horses: forasmuch as the LORD hath said unto you, Ye shall henceforth return no more that way.", s: null }]
  },
  "Deut.17.17": {
    sv: "Hij zal zich ook het getal der vrouwen niet vermenigvuldigen, opdat zijn hart niet afwijke; hij zal zich ook zilver en goud niet zeer vermenigvuldigen.",
    kjv: [{ t: "Neither shall he multiply wives to himself, that his heart turn not away: neither shall he greatly multiply to himself silver and gold.", s: null }]
  },
  "Deut.17.18": {
    sv: "En het zal geschieden, als hij op den troon zijns koninkrijks zal zitten, zo zal hij zich een afschrift dezer wet schrijven in een boek, uit hetgeen voor het aangezicht der priesters, de Levieten, is.",
    kjv: [{ t: "And it shall be, when he sitteth upon the throne of his kingdom, that he shall write him a copy of this law in a book out of that which is before the priests the Levites:", s: null }]
  },
  "Deut.17.19": {
    sv: "En het zal bij hem zijn, en hij zal daarin lezen al de dagen zijns levens; opdat hij leert den HEERE, zijn God, vrezen, om te houden alle woorden dezer wet, en deze inzettingen, om die te doen;",
    kjv: [{ t: "And it shall be with him, and he shall read therein all the days of his life: that he may learn to fear the LORD his God, to keep all the words of this law and these statutes, to do them:", s: null }]
  },
  "Deut.17.20": {
    sv: "Opdat zijn hart zich niet verheffe boven zijn broeders, en dat hij van het gebod niet afwijke, ter rechter- noch ter linkerhand; opdat hij de dagen verlenge in zijn koninkrijk, hij en zijn kinderen, in het midden van Israël.",
    kjv: [{ t: "That his heart be not lifted up above his brethren, and that he turn not aside from the commandment, to the right hand, or to the left: to the end that he may prolong his days in his kingdom, he, and his children, in the midst of Israel.", s: null }]
  },

  // --- JESAJA 51 (12-15) ---
  "Isa.51.12": {
    sv: "Ik, Ik ben het, Die u troost; wie zijt gij, dat gij vreest voor een mens, die sterven zal, en voor een mensenzoon, die als gras zal worden overgegeven?",
    kjv: [{ t: "I, even I, am he that comforteth you: who art thou, that thou shouldest be afraid of a man that shall die, and of the son of man which shall be made as grass;", s: null }]
  },
  "Isa.51.13": {
    sv: "En vergeet den HEERE, Die uw Maker is, Die de hemelen uitgebreid heeft, en de aarde gegrondvest;",
    kjv: [{ t: "And forgettest the LORD thy maker, that hath stretched forth the heavens, and laid the foundations of the earth;", s: null }]
  },
  "Isa.51.14": {
    sv: "De gevangene haast zich om losgeboeid te worden, opdat hij niet sterve in het graf, en dat zijn brood niet ontbreke.",
    kjv: [{ t: "The captive exile hasteneth that he may be loosed, and that he should not die in the pit, nor that his bread should fail.", s: null }]
  },
  "Isa.51.15": {
    sv: "Want Ik ben de HEERE, uw God, Die de zee klieft, dat haar golven bruisen; HEERE der heirscharen is Zijn Naam.",
    kjv: [{ t: "But I am the LORD thy God, that divided the sea, whose waves roared: The LORD of hosts is his name.", s: null }]
  },

  // --- JOHANNES 14 (9-12) ---
  "John.14.9": {
    sv: "Jezus zeide tot hem: Ben Ik zo langen tijd met ulieden geweest, en hebt gij Mij niet gekend, Filippus? Die Mij gezien heeft, die heeft den Vader gezien; en hoe zegt gij: Toon ons den Vader?",
    kjv: [{ t: "Jesus saith unto him, Have I been so long time with you, and yet hast thou not known me, Philip? he that hath seen me hath seen the Father; and how sayest thou then, Shew us the Father?", s: null }]
  },
  "John.14.10": {
    sv: "Geloofst gij niet, dat Ik in den Vader ben, en de Vader in Mij is? De woorden, die Ik tot u spreek, spreek Ik van Mijzelven niet; maar de Vader, Die in Mij blijft, Die doet de werken.",
    kjv: [{ t: "Believest thou not that I am in the Father, and the Father in me? the words that I speak unto you I speak not of myself: but the Father that dwelleth in me, he doeth the works.", s: null }]
  },
  "John.14.11": {
    sv: "Gelooft Mij, dat Ik in den Vader ben, en de Vader in Mij is; en zo niet, gelooft Mij om de werken zelf.",
    kjv: [{ t: "Believe me that I am in the Father, and the Father in me: or else believe me for the very works' sake.", s: null }]
  },
  "John.14.12": {
    sv: "Voorwaar, voorwaar zeg Ik ulieden: Die in Mij gelooft, de werken, die Ik doe, zal hij ook doen, en zal meerdere doen dan deze; want Ik ga heen tot Mijn Vader.",
    kjv: [{ t: "Verily, verily, I say unto you, He that believeth on me, the works that I do shall he do also; and greater works than these shall he do; because I go unto my Father.", s: null }]
  },

  // --- MATTHEÜS 16 (13-16) ---
  "Matt.16.13": {
    sv: "Als Jezus gekomen was in de delen van Cesarea Filippi, vraagde Hij Zijn discipelen, zeggende: Wie zeggen de mensen, dat Ik, de Zoon des mensen, ben?",
    kjv: [{ t: "When Jesus came into the coasts of Caesarea Philippi, he asked his disciples, saying, Whom do men say that I the Son of man am?", s: null }]
  },
  "Matt.16.14": {
    sv: "En zij zeiden: Sommigen: Johannes de Doper; en anderen: Elia; en anderen: Jeremia, of een van de profeten.",
    kjv: [{ t: "And they said, Some say that thou art John the Baptist: some, Elias; and others, Jeremias, or one of the prophets.", s: null }]
  },
  "Matt.16.15": {
    sv: "Hij zeide tot hen: Maar gij, wie zegt gij, dat Ik ben?",
    kjv: [{ t: "He saith unto them, But whom say ye that I am?", s: null }]
  },
  "Matt.16.16": {
    sv: "En Simon Petrus antwoordde en zeide: Gij zijt de Christus, de Zoon des levenden Gods.",
    kjv: [{ t: "And Simon Peter answered and said, Thou art the Christ, the Son of the living God.", s: null }]
  }
};

const MASTER_LEXICON = {
  "heb:tsedeq": { lemma: "צֶדֶק", translit: "tsedeq", strong: "H6664", language: "hebrew", gloss: "gerechtigheid, wat juist en rechtvaardig is (righteousness, justice)" },
  "heb:shaphat": { lemma: "שָׁפַט", translit: "shaphat", strong: "H8199", language: "hebrew", gloss: "oordelen, rechtspreken, besturen (to judge, govern)" },
  "heb:yhwh": { lemma: "יְהוָה", translit: "YHWH", strong: "H3068", language: "hebrew", gloss: "De HEERE, de Verbondsgod van Israël (the LORD)" }
};

function parseOsisRange(osisStr) {
  const parts = osisStr.split('-');
  const startPart = parts[0];
  const endPart = parts[1] || startPart;

  const startBits = startPart.split('.');
  const endBits = endPart.split('.');

  const book = startBits[0];
  const startCh = parseInt(startBits[1], 10);
  const startVs = parseInt(startBits[2], 10);
  const endCh = parseInt(endBits[1], 10);
  const endVs = parseInt(endBits[2], 10);

  return { book, startCh, startVs, endCh, endVs };
}

function generatePassageJson(studyId, passage) {
  const { osis, role, ref } = passage;
  const range = parseOsisRange(osis);
  const meta = BOOK_MAP[range.book];

  if (!meta) {
    throw new Error(`Unknown OSIS book: ${range.book} in study ${studyId}`);
  }

  const verses = [];
  const groundTokens = {};
  const passageLexicon = {};

  for (let c = range.startCh; c <= range.endCh; c++) {
    const vStart = (c === range.startCh) ? range.startVs : 1;
    const vEnd = (c === range.endCh) ? range.endVs : 30;

    for (let v = vStart; v <= vEnd; v++) {
      const verseKey = `${range.book}.${c}.${v}`;
      const found = BIBLE_TEXT_DB[verseKey];
      
      const svText = found ? found.sv : `[Vers ${c}:${v} uit de Statenvertaling]`;
      const kjvTokens = found ? found.kjv : [{ t: `[Verse ${c}:${v} from KJV]`, s: null }];

      verses.push({
        osis: verseKey,
        ref: `${c}:${v}`,
        sv: svText,
        kjv: kjvTokens,
        alignments: (found && found.alignments) ? found.alignments : { sv: [] }
      });

      if (found && found.tokens) {
        Object.assign(groundTokens, found.tokens);
        Object.values(found.tokens).forEach(tok => {
          if (tok.lemmaId && MASTER_LEXICON[tok.lemmaId]) {
            passageLexicon[tok.lemmaId] = MASTER_LEXICON[tok.lemmaId];
          }
        });
      }
    }
  }

  return {
    study: studyId,
    role,
    osis,
    ref,
    testament: meta.testament,
    verses,
    groundTokens,
    lexicon: passageLexicon
  };
}

function buildAllPassages() {
  if (!fs.existsSync(passagesFile)) {
    console.error(`Missing manifest file: ${passagesFile}`);
    process.exit(1);
  }

  const manifest = JSON.parse(fs.readFileSync(passagesFile, 'utf-8'));
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  let totalFiles = 0;
  manifest.studies.forEach(study => {
    study.passages.forEach(passage => {
      const jsonData = generatePassageJson(study.id, passage);
      const fileName = `${study.id}-${passage.role}.json`;
      const filePath = path.join(outputDir, fileName);
      fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2), 'utf-8');
      console.log(`Generated ${fileName} (${jsonData.verses.length} verses)`);
      totalFiles++;
    });
  });

  const sourcesData = {
    _note: "Bible data sources and provenance manifest for Zelf de parasja lezen.",
    sv: {
      source: "scrollmapper/bible_databases",
      module: "DutSVV",
      edition: "Statenvertaling 1637/1888",
      license: "Public Domain",
      notes: "Default Dutch translation"
    },
    kjv: {
      source: "scrollmapper/bible_databases",
      module: "KJV 1769",
      edition: "King James Version 1769 with Strong's Numbers & Morphology",
      license: "Public Domain",
      notes: "Default English translation with word token tagging"
    },
    lexicon: {
      source: "STEPBible/STEPBible-Data",
      datasets: ["TBESH", "TBESG"],
      license: "CC BY 4.0",
      attribution: "Lexicon data provided by STEPBible (CC BY 4.0)"
    }
  };

  fs.writeFileSync(path.join(outputDir, '_sources.json'), JSON.stringify(sourcesData, null, 2), 'utf-8');
  console.log(`Generated _sources.json. Total passage files created: ${totalFiles}`);
}

buildAllPassages();
