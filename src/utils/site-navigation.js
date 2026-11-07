// Keep direct links, translated fragments and the interactive views in sync.
export function viewFromLocation(hash, pathname = '', defaultView = 'intro') {
  if (['#wat-is-de-parasja', '#intro'].includes(hash)) return 'intro';
  if (hash === '#waarom-deze-website') return 'waarom-deze-website';
  if (['#methode', '#method', '#uitleg', '#explanation', '#voorbeeld', '#example', '#bijlagen', '#appendices'].includes(hash)) return 'method';
  if (/handleiding|handbook/.test(pathname)) return 'handbook';
  if (pathname.includes('artikelen')) return 'articles';
  if (pathname.includes('contact')) return 'contact';
  if (pathname.includes('privacy')) return 'privacy';
  if (['#werkblad', '#worksheet'].includes(hash) || /^#(?:stap|snel)-\d+$/.test(hash)) return 'worksheet';
  return defaultView;
}

export function translateFragment(hash, targetLang) {
  const pairs = [
    ['werkblad', 'worksheet'], ['methode', 'method'], ['uitleg', 'explanation'],
    ['voorbeeld', 'example'], ['bijlagen', 'appendices']
  ];
  const clean = hash.replace(/^#/, '');
  const pair = pairs.find(item => item.includes(clean));
  return hash ? '#' + (pair ? pair[targetLang === 'en' ? 1 : 0] : clean) : '';
}

// Use the page's declared translation, including a matching study or article.
// Missing translations return to the chosen language's homepage.
export function languageDestination(alternateHref, targetLang, search = '', hash = '') {
  const target = new URL(alternateHref || `/${targetLang}/`, 'https://www.parasja.nl');
  target.search = search;
  target.hash = translateFragment(hash, targetLang);
  return target.pathname + target.search + target.hash;
}
