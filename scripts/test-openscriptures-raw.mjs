async function testOpenScriptures() {
  const urls = [
    "https://raw.githubusercontent.com/openscriptures/strongs/master/hebrew/strongs-hebrew-dictionary.js",
    "https://raw.githubusercontent.com/openscriptures/strongs/master/greek/strongs-greek-dictionary.js",
    "https://raw.githubusercontent.com/openscriptures/strongs/master/hebrew/H0001.xml",
    "https://raw.githubusercontent.com/openscriptures/HebrewLexicon/master/data/strongs-hebrew-dictionary.json",
    "https://raw.githubusercontent.com/STEPBible/STEPBible-Data/master/TBESH%20-%20Translation%20%26%20Hebrew%20Exegesis%20-%20STEPBible%20%26%20Tyndale.txt",
    "https://raw.githubusercontent.com/STEPBible/STEPBible-Data/master/TBESH.txt",
    "https://raw.githubusercontent.com/STEPBible/STEPBible-Data/main/TBESH.txt",
    "https://raw.githubusercontent.com/STEPBible/STEPBible-Data/master/TBESG.txt",
    "https://raw.githubusercontent.com/STEPBible/STEPBible-Data/main/TBESG.txt"
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url);
      console.log(`URL: ${url} -> Status: ${res.status}`);
      if (res.ok) {
        const txt = await res.text();
        console.log(`   Fetched ${txt.length} bytes. Sample:`, txt.substring(0, 150).replace(/\n/g, ' '));
      }
    } catch (e) {
      console.log(`URL: ${url} -> Error: ${e.message}`);
    }
  }
}

testOpenScriptures();
