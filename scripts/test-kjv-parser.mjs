function parseKjvTokens(rawText, testament) {
  // Remove <sup>...</sup> footnotes from KJV text
  const cleanText = rawText.replace(/<sup>[\s\S]*?<\/sup>/gi, '').trim();
  const prefix = testament === 'NT' ? 'G' : 'H';
  const tokens = [];

  // Match words, optional punctuation, and optional <S>1234</S> Strong tag
  // e.g. "altogether<S>6664</S>", "follow,<S>7291</S>", "the", "God<S>430</S>"
  const words = cleanText.split(/\s+/);
  
  for (const wordStr of words) {
    if (!wordStr) continue;
    const match = wordStr.match(/^([^\s<]+)(?:<S>(\d+)<\/S>)?$/);
    if (match) {
      const surface = match[1];
      const strongNum = match[2];
      const strongTag = strongNum ? `${prefix}${strongNum}` : null;
      tokens.push({ t: surface, s: strongTag });
    } else {
      // Fallback if regex doesn't match complex punctuation/tags
      const cleanWord = wordStr.replace(/<S>\d+<\/S>/g, '');
      const tagMatch = wordStr.match(/<S>(\d+)<\/S>/);
      const strongTag = tagMatch ? `${prefix}${tagMatch[1]}` : null;
      tokens.push({ t: cleanWord, s: strongTag });
    }
  }

  return tokens;
}

async function testParser() {
  const res = await fetch("https://bolls.life/get-text/KJV/5/16/");
  const data = await res.json();
  const v20 = data.find(v => v.verse === 20);
  console.log("Raw KJV text:", v20.text);
  const parsed = parseKjvTokens(v20.text, 'OT');
  console.log("Parsed KJV tokens with Strongs:", JSON.stringify(parsed, null, 2));
}

testParser();
