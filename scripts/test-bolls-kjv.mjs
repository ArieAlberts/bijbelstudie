async function testKjv() {
  console.log("Testing Bolls.life KJV module text format...");
  // Deut 16 (book 5, ch 16)
  const res = await fetch("https://bolls.life/get-text/KJV/5/16/");
  const data = await res.json();
  console.log("KJV Sample verse 20 raw:", JSON.stringify(data.find(v => v.verse === 20)));

  // Test if there are other modules or if KJV has strong tags in another edition
  const resList = await fetch("https://bolls.life/static/translations.json");
  const list = await resList.json();
  const englishTranslations = list.filter(t => t.language === "English");
  console.log("Available English translations:", englishTranslations.map(t => ({ short_name: t.short_name, name: t.full_name })));
}

testKjv();
