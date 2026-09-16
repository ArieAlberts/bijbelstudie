# Overzicht parasja-content voor de website

Alle bestanden staan uploadklaar in de mappenstructuur hieronder. De markdown-items horen in
`content/parasjot/`; de downloads onder `public/downloads/…`.

## Mappenstructuur

```
content/parasjot/
  mattot-masei.md
  devarim.md
  vaetchanan.md
  ekev.md
  reeh.md
  shoftim.md
  ki-tavo.md
  nitzavim-vayelech.md
  jom-teruah.md
  haazinu.md

public/downloads/lezingen/
  {parasja}-nl.pdf   {parasja}-nl.docx
  shoftim-en.pdf     shoftim-en.docx
  nitzavim-vayelech-lezing-nl.pdf   nitzavim-vayelech-lezing-nl.docx
  nitzavim-vayelech-lezing-en.pdf   nitzavim-vayelech-lezing-en.docx
  jom-teruah-lezing-nl.pdf   jom-teruah-lezing-nl.docx
  jom-teruah-lezing-en.pdf   jom-teruah-lezing-en.docx
  haazinu-lezing-nl.pdf   haazinu-lezing-nl.docx
  haazinu-lezing-en.pdf   haazinu-lezing-en.docx

public/downloads/studiebladen/
  {parasja}-nl.pdf   {parasja}-nl.docx
  nitzavim-vayelech-studieblad-nl.pdf   nitzavim-vayelech-studieblad-nl.docx
  nitzavim-vayelech-studieblad-en.pdf   nitzavim-vayelech-studieblad-en.docx
  jom-teruah-studieblad-nl.pdf   jom-teruah-studieblad-nl.docx
  jom-teruah-studieblad-en.pdf   jom-teruah-studieblad-en.docx
  haazinu-studieblad-nl.pdf   haazinu-studieblad-nl.docx
  haazinu-studieblad-en.pdf   haazinu-studieblad-en.docx

public/downloads/werkbladen/
  reeh-nl.pdf   reeh-nl.docx
  shoftim-nl.pdf   shoftim-nl.docx
  ki-tavo-nl.pdf   ki-tavo-nl.docx
  nitzavim-vayelech-werkblad-nl.pdf   nitzavim-vayelech-werkblad-nl.docx
  nitzavim-vayelech-werkblad-en.pdf   nitzavim-vayelech-werkblad-en.docx
  jom-teruah-werkblad-nl.pdf   jom-teruah-werkblad-nl.docx
  jom-teruah-werkblad-en.pdf   jom-teruah-werkblad-en.docx
  haazinu-werkblad-nl.pdf   haazinu-werkblad-nl.docx
  haazinu-werkblad-en.pdf   haazinu-werkblad-en.docx
```

## Statusoverzicht

| Parasja        | Markdown | Lezing NL | Lezing EN | Studieblad NL | Studieblad EN | Werkblad NL | Werkblad EN |
|----------------|:--------:|:---------:|:---------:|:-------------:|:-------------:|:-----------:|:-----------:|
| Mattot-Masei   |    ✓     |     ✓     |     —     |       ✓       |       —       |      —      |      —      |
| Devarim        |    ✓     |     ✓     |     —     |       ✓       |       —       |      —      |      —      |
| Wa'etchanan    |    ✓     |     ✓     |     —     |       ✓       |       —       |      —      |      —      |
| Ekev           |    ✓     |     ✓     |     —     |       ✓       |       —       |      —      |      —      |
| Re'eh          |    ✓     |     ✓     |     —     |       ✓       |       —       |      ✓      |      —      |
| Shoftim        |    ✓     |     ✓     |     ✓     |       ✓       |       ✓       |      ✓      |      ✓      |
| Ki Tavo        |    ✓     |     ✓     |     —     |       ✓       |       —       |      ✓      |      —      |
| Nitzavim/Vayelech |  ✓   |     ✓     |     ✓     |       ✓       |       ✓       |      ✓      |      ✓      |
| Jom Teruah     |    ✓     |     ✓     |     ✓     |       ✓       |       ✓       |      ✓      |      ✓      |
| Ha'azinu       |    ✓     |     ✓     |     ✓     |       ✓       |       ✓       |      ✓      |      ✓      |

✓ = klaar · — = nog te maken

## Nog te maken

Ki Tavo is Nederlands compleet: lezing, studieblad, werkblad én het één-bron `ki-tavo.md` (body/study_body/worksheet_body ingebed). Alleen de Engelse zijde staat nog open.

Nitzavim/Vayelech is **volledig tweetalig** en uploadklaar: lezing, studieblad én werkblad in NL en EN, met alle download- en `*_en`-velden in `nitzavim-vayelech.md` gevuld (uitgebreide lezing als canonieke vorm). Naamschema voor dit item: `nitzavim-vayelech-{lezing|studieblad|werkblad}-{nl|en}`.

Jom Teruah is **volledig tweetalig** en uploadklaar: lezing, studieblad én werkblad in NL en EN, alle body- en `*_en`-velden in `jom-teruah.md` gevuld (uitgebreide lezing als canonieke vorm). Constellatie: Genesis 21:1–34 · 1 Samuël 1:1–2:10 · Mattheüs 24:29–36. Bronnenronde geverifieerd via Sefaria (Rosj Hasjana 10b–11a; Rasji Gen. 21:9) én Van de Giessen (Aantekeningen bij Genesis 1–25: pakad 21:1, metsachek 21:9, 4Q365-variant) voor de parasja; voor de haftara (1 Samuël) ontbreekt Van de Giessen nog, en Onkelos staat als open verificatiepunt. `published_at: 2026-09-12`.

Ha'azinu is **volledig tweetalig** en uploadklaar: lezing, studieblad én werkblad in NL en EN, alle body- en `*_en`-velden in `haazinu.md` gevuld (uitgebreide lezing als canonieke vorm). Constellatie: Deuteronomium 32:1–52 · Hosea 14:2–10 + Joël 2:15–27 (Sjabbat Sjoeva) · Mattheüs 18:21–35 (bewust gekozen: het vergeten van de Rots wordt zichtbaar in hoe je de ander behandelt — niet Matt. 7). Bronnenronde geverifieerd via Van de Giessen (Deut. 18–34: tsoer, Jesjurun/ba'at, sjajah-hapax) én Sefaria (Rasji op 32:1 / Sifrei 306; twee-getuigen Deut. 19:15); Onkelos/Ibn Ezra/Ramban als open verificatiepunt. `published_at: 2026-09-19` (Sjabbat Sjoeva).


- **Studiebladen EN** — 6 stuks (alle behalve Shoftim en Nitzavim/Vayelech, incl. Ki Tavo): vertaling van de bestaande Nederlandse studiebladen.
- **Werkbladen NL** — 4 stuks (Mattot-Masei, Devarim, Wa'etchanan, Ekev): nieuw op te bouwen in het Bijlage-A-format. (Re'eh, Shoftim en Ki Tavo zijn klaar.)
- **Werkbladen EN** — 6 stuks (alle behalve Shoftim en Nitzavim/Vayelech, incl. Ki Tavo): vertaling.

Optioneel, los hiervan:
- **Lezingen EN** — 5 stuks (alle behalve Shoftim en Nitzavim/Vayelech), als je ook de online-lezingen tweetalig wilt.

## Naamgevingsconventie

Voor elke nog te maken versie geldt dezelfde conventie als de bestaande bestanden:

```
public/downloads/studiebladen/{parasja}-en.pdf   {parasja}-en.docx
public/downloads/werkbladen/{parasja}-nl.pdf     {parasja}-nl.docx
public/downloads/werkbladen/{parasja}-en.pdf     {parasja}-en.docx
```

En in de frontmatter van elk markdown-item worden de bijbehorende `download_study_*_en`
(en, indien werkbladen aan het item gekoppeld worden, `download_werkblad_*`) velden gevuld
zodra de betreffende versie bestaat — nooit eerder (geen fallback).

## Parasja-id's en bestandsnamen

| Parasja      | id            | Lezing-titel (title_nl)             |
|--------------|---------------|-------------------------------------|
| Mattot-Masei | mattot-masei  | De bron en de gebarsten bakken      |
| Devarim      | devarim       | Elf dagen die veertig jaar werden   |
| Wa'etchanan  | vaetchanan    | Een stem, geen beeld                |
| Ekev         | ekev          | Het brood dat je niet kende         |
| Re'eh        | reeh          | Zie, en kies                        |
| Shoftim      | shoftim       | Gerechtigheid najagen               |
| Ki Tavo      | ki-tavo       | "De eersteling en de eerlijke weegsteen" |
| Nitzavim/Vayelech | nitzavim-vayelech | "In je mond, in je hart, in je handen" |
| Jom Teruah   | jom-teruah    | "De God die gedenkt en roept" |
| Ha'azinu     | haazinu       | "Als regen op het gras" |
