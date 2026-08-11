async function testLexicon() {
  console.log("Testing Lexicon API / Data Sources...");

  // Test 1: STEPBible Data repo on GitHub
  try {
    const resH = await fetch("https://raw.githubusercontent.com/STEPBible/STEPBible-Data/master/TBESH%20-%20Translation%20%26%20Hebrew%20Exegesis%20-%20STEPBible%20%26%20Tyndale.txt");
    console.log("STEPBible TBESH txt status:", resH.status);
    if (resH.ok) {
      const text = await resH.text();
      const lines = text.split("\n").filter(l => l.includes("H0001") || l.includes("H6664") || l.includes("H8199"));
      console.log("Sample TBESH lines:", lines.slice(0, 5));
    }
  } catch (err) {
    console.error("STEPBible GitHub fetch error:", err.message);
  }

  // Test 2: Bolls dictionary endpoint
  try {
    const resBolls = await fetch("https://bolls.life/dictionary/H6664/");
    console.log("Bolls dictionary H6664 status:", resBolls.status);
    if (resBolls.ok) {
      const data = await resBolls.json();
      console.log("Bolls dictionary H6664 sample:", JSON.stringify(data).substring(0, 300));
    }
  } catch (err) {
    console.error("Bolls dictionary error:", err.message);
  }
}

testLexicon();
