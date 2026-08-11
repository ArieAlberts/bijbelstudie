function extractNotesAndCleanText(rawText) {
  const notes = [];
  
  // Extract <sup>...</sup> tags
  let cleanText = rawText.replace(/<sup>([\s\S]*?)<\/sup>/gi, (_, noteContent) => {
    // Clean inner HTML if any
    const plainNote = noteContent.replace(/<[^>]+>/g, '').trim();
    if (plainNote) {
      notes.push(plainNote);
    }
    return '';
  });

  // Extract <f>...</f> tags if any
  cleanText = cleanText.replace(/<f>([\s\S]*?)<\/f>/gi, (_, noteContent) => {
    const plainNote = noteContent.replace(/<[^>]+>/g, '').trim();
    if (plainNote) {
      notes.push(plainNote);
    }
    return '';
  });

  cleanText = cleanText.replace(/\s+/g, ' ').trim();
  return { cleanText, notes };
}

async function testNotes() {
  const resKjv = await fetch("https://bolls.life/get-text/KJV/5/16/");
  const dataKjv = await resKjv.json();
  const v19 = dataKjv.find(v => v.verse === 19);
  const v20 = dataKjv.find(v => v.verse === 20);

  console.log("KJV v19 extracted:", extractNotesAndCleanText(v19.text));
  console.log("KJV v20 extracted:", extractNotesAndCleanText(v20.text));

  const resSv = await fetch("https://bolls.life/get-text/DSV/5/16/");
  const dataSv = await resSv.json();
  const v19Sv = dataSv.find(v => v.verse === 19);
  const v20Sv = dataSv.find(v => v.verse === 20);

  console.log("DSV v19 extracted:", extractNotesAndCleanText(v19Sv.text));
  console.log("DSV v20 extracted:", extractNotesAndCleanText(v20Sv.text));
}

testNotes();
