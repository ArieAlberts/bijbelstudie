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
  ki-teitzei.md

public/downloads/lezingen/
  {parasja}-nl.pdf   {parasja}-nl.docx
  shoftim-en.pdf      shoftim-en.docx
  ki-teitzei-en.pdf   ki-teitzei-en.docx     ← Engelse lezingen (KJV-citaten)

public/downloads/studiebladen/
  {parasja}-nl.pdf   {parasja}-nl.docx

public/downloads/werkbladen/
  reeh-nl.pdf        reeh-nl.docx
  shoftim-nl.pdf     shoftim-nl.docx
  ki-teitzei-nl.pdf  ki-teitzei-nl.docx
```

## Statusoverzicht

| Parasja        | Markdown | Lezing NL | Lezing EN | Studieblad NL | Studieblad EN | Werkblad NL | Werkblad EN |
|----------------|:--------:|:---------:|:---------:|:-------------:|:-------------:|:-----------:|:-----------:|
| Mattot-Masei   |    ✓     |     ✓     |     —     |       ✓       |       —       |      —      |      —      |
| Devarim        |    ✓     |     ✓     |     —     |       ✓       |       —       |      —      |      —      |
| Wa'etchanan    |    ✓     |     ✓     |     —     |       ✓       |       —       |      —      |      —      |
| Ekev           |    ✓     |     ✓     |     —     |       ✓       |       —       |      —      |      —      |
| Re'eh          |    ✓     |     ✓     |     —     |       ✓       |       —       |      ✓      |      —      |
| Shoftim        |    ✓     |     ✓     |     ✓     |       ✓       |       —       |      ✓      |      —      |
| Ki Teitzei     |    ✓     |     ✓     |     ✓     |       ✓       |       —       |      ✓      |      —      |

✓ = klaar · — = nog te maken

## Nog te maken (18 documenten)

- **Studiebladen EN** — 7 stuks (alle parasjot): vertaling van de bestaande Nederlandse studiebladen.
- **Werkbladen NL** — 4 stuks (Mattot-Masei, Devarim, Wa'etchanan, Ekev): nieuw op te bouwen.
- **Werkbladen EN** — 7 stuks (alle parasjot): vertaling.

Optioneel, los hiervan:
- **Lezingen EN** — 5 stuks (alle behalve Shoftim en Ki Teitzei), als je ook de online-lezingen tweetalig wilt.

## Naamgevingsconventie

Voor elke nog te maken versie geldt dezelfde conventie als de bestaande bestanden:

```
public/downloads/studiebladen/{parasja}-en.pdf   {parasja}-en.docx
public/downloads/werkbladen/{parasja}-nl.pdf     {parasja}-nl.docx
public/downloads/werkbladen/{parasja}-en.pdf     {parasja}-en.docx
```

En in de frontmatter van elk markdown-item worden de bijbehorende `download_study_*_en`
en `download_werkblad_*` velden gevuld zodra de betreffende versie bestaat — nooit eerder
(geen fallback).

## Parasja-id's en bestandsnamen

| Parasja      | id            | Lezing-titel (title_nl)             |
|--------------|---------------|-------------------------------------|
| Mattot-Masei | mattot-masei  | De bron en de gebarsten bakken      |
| Devarim      | devarim       | Elf dagen die veertig jaar werden   |
| Wa'etchanan  | vaetchanan    | Een stem, geen beeld                |
| Ekev         | ekev          | Het brood dat je niet kende         |
| Re'eh        | reeh          | Zie, en kies                        |
| Shoftim      | shoftim       | Gerechtigheid najagen               |
| Ki Teitzei   | ki-teitzei    | Keer terug tot Mij                  |

## Openstaande punten (Ki Teitzei)

- **id/naamgeving.** Aangehouden als `ki-teitzei`. De site-dropdown toont "Ki Tetze"; als de
  repo-slug `ki-tetze` moet zijn, hernoem `content/parasjot/`, de zes downloadbestanden en het
  `id`/`label`-veld in één keer.
- **status.** Het item staat op `status: draft`, `current: false` (EN ontbreekt nog). Naar
  `published` / `current: true` zetten zodra het live mag.
- **Werkblad-format.** Ki Teitzei's werkblad is het kring-lesmiddel (volledig ingevuld voorbeeld
  per deelnemer). Het diagnostische Werkschema (Stap 0–10) is apart bewaard als voorbereidingslaag,
  niet als site-download. Controleer of de reeds bestaande Re'eh- en Shoftim-werkbladen hetzelfde
  kring-format volgen; zo niet, later gelijktrekken.
- **Openstaand verificatiepunt.** De koning-en-scheidbrief-midrasj heeft nog geen vindplaats
  (🟡); bewust uit de lezing weggelaten, alleen in het studieblad als te verifiëren gemarkeerd.
