import fs from 'fs';

async function searchPinchas() {
  console.log("Searching for Pinchas / Pinechas across calendar URLs...");
  for (let i = 1; i <= 50; i++) {
    const url = `https://www.messiaansegemeentenieuwlekkerland.nl/agenda/kalender/samenkomst-online-dienst/samenkomst-online-dienst-${i}`;
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const html = await res.text();
      if (html.toLowerCase().includes('pinchas') || html.toLowerCase().includes('pinechas')) {
        console.log(`FOUND Pinchas on ID ${i}: ${url}`);
        const nameMatch = html.match(/Parasjah-naam\s*<\/td>\s*<td[^>]*>\s*([^<]+)\s*<\/td>/i);
        const torahMatch = html.match(/Parasjah\s*<\/td>\s*<td[^>]*>\s*([^<]+)\s*<\/td>/i);
        const haftaraMatch = html.match(/Haftara\s*<\/td>\s*<td[^>]*>\s*([^<]+)\s*<\/td>/i);
        const gospelMatch = html.match(/Evangelie\s*<\/td>\s*<td[^>]*>\s*([^<]+)\s*<\/td>/i);
        const dateMatch = html.match(/Datum en begintijd\s*<\/td>\s*<td[^>]*>\s*(\d{2}-\d{2}-\d{4})/i);

        console.log({
          name: nameMatch ? nameMatch[1].trim() : '',
          torah: torahMatch ? torahMatch[1].trim() : '',
          haftara: haftaraMatch ? haftaraMatch[1].trim() : '',
          gospel: gospelMatch ? gospelMatch[1].trim() : '',
          date: dateMatch ? dateMatch[1] : ''
        });
      }
    } catch (e) {}
  }
}

searchPinchas();
