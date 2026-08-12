import dutchLexicon from '../../scripts/dutch-lexicon-definitions.json';

export function getDutchLexiconEntry(strongCode, surfaceText = '') {
  if (!strongCode) return null;
  const cleanCode = strongCode.trim().toUpperCase();

  const isGreek = cleanCode.startsWith('G');
  const langLabel = isGreek ? 'Grieks' : 'Hebreeuws';
  const cleanWord = surfaceText ? surfaceText.replace(/[.,;:!?()'"]/g, '') : cleanCode;

  // Check if we have a Dutch gloss in our cache
  const cachedEntry = dutchLexicon[cleanCode];

  // We no longer provide a pseudo-translation as gloss_nl.
  // If it's missing, we report it explicitly.
  const glossNl = cachedEntry && cachedEntry.gloss_nl
    ? cachedEntry.gloss_nl
    : 'Nederlandse vertaling nog niet beschikbaar';

  return {
    strong: cleanCode,
    lemma: cleanWord,
    translit: cleanCode,
    gloss_nl: glossNl,
    gloss_en: `${cleanWord} (Strong's ${cleanCode})`,
    usage_nl: cleanWord ? [cleanWord] : [],
    usage_en: cleanWord ? [cleanWord] : [],
    // Provide a simple descriptive text without theological padding
    definition_nl: cachedEntry && cachedEntry.gloss_nl 
      ? `Woordverklaring uit grondtekstlexicon voor Strong ${cleanCode}.` 
      : `Grondtekstwoord (${langLabel} concordantie-item Strong ${cleanCode}). Klik op onderstaande knop om het volledige lexicon op STEP Bible te raadplegen.`,
    definition: `Grondtekstwoord (${langLabel} concordantie-item Strong ${cleanCode}).`,
    stepUrl: `https://www.stepbible.org/?q=version=DutSVV|version=${isGreek ? 'OGNT' : 'OHB'}|strong=${cleanCode}`
  };
}
