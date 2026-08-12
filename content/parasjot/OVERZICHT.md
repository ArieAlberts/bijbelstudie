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

public/downloads/lezingen/
  {parasja}-nl.pdf   {parasja}-nl.docx
  shoftim-en.pdf     shoftim-en.docx        ← enige Engelse lezing tot nu toe

public/downloads/studiebladen/
  {parasja}-nl.pdf   {parasja}-nl.docx

public/downloads/werkbladen/
  reeh-nl.pdf   reeh-nl.docx
  shoftim-nl.pdf   shoftim-nl.docx
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

✓ = klaar · — = nog te maken

## Nog te maken (14 documenten) — Shoftim is nu volledig tweetalig

- **Studiebladen EN** — 5 stuks (alle behalve Shoftim): vertaling van de bestaande Nederlandse studiebladen.
- **Werkbladen NL** — 4 stuks (Mattot-Masei, Devarim, Wa'etchanan, Ekev): nieuw op te bouwen in het Bijlage-A-format.
- **Werkbladen EN** — 5 stuks (alle behalve Shoftim): vertaling.

Optioneel, los hiervan:
- **Lezingen EN** — 5 stuks (alle behalve Shoftim), als je ook de online-lezingen tweetalig wilt.

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
