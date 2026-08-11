async function testUrls() {
  const urls = [
    { name: "OpenScriptures Hebrew JSON", url: "https://raw.githubusercontent.com/openscriptures/strongs/master/hebrew/strongs-hebrew-dictionary.json" },
    { name: "OpenScriptures Greek JSON", url: "https://raw.githubusercontent.com/openscriptures/strongs/master/greek/strongs-greek-dictionary.json" },
    { name: "MatthewBlair Hebrew JSON", url: "https://raw.githubusercontent.com/matthewblair/strongs/master/hebrew.json" },
    { name: "MatthewBlair Greek JSON", url: "https://raw.githubusercontent.com/matthewblair/strongs/master/greek.json" },
    { name: "UniqueBibleApp Hebrew Lexicon", url: "https://raw.githubusercontent.com/eliranwong/Unique-Bible-App/master/lexicon/hebrew_lexicon.json" },
    { name: "UniqueBibleApp Greek Lexicon", url: "https://raw.githubusercontent.com/eliranwong/Unique-Bible-App/master/lexicon/greek_lexicon.json" }
  ];

  for (const item of urls) {
    try {
      const res = await fetch(item.url);
      console.log(`${item.name} -> Status: ${res.status}`);
      if (res.ok) {
        const text = await res.text();
        console.log(`   Length: ${text.length} chars. Sample:`, text.substring(0, 150));
      }
    } catch (e) {
      console.log(`${item.name} -> Error: ${e.message}`);
    }
  }
}

testUrls();
