# Overzicht parasja-content voor de website

**Actueel bijgewerkt: 4 september 2026**

Dit bestand is bedoeld als crosscheck tussen de bronbestanden in `content/parasjot/` en de documenten die voor de website worden gegenereerd of gepubliceerd.

## Bronprincipe

Voor iedere parasja geldt één markdownbestand als bron. De `id` in het frontmatter bepaalt de canonieke slug en daarmee ook de bestandsnamen van de gegenereerde documenten.

Voor de actuele parasja is de enige juiste slug:

```
nitzavim-vayelech
```

Gebruik dus nergens `nitzavim-vayelecht` als bestands- of downloadslug.

## Actuele markdownbronnen

| Bronbestand | id | Publicatiedatum | Status |
|---|---|---:|---|
| pinchas.md | pinchas | 2026-07-04 | gepubliceerd |
| mattot-masei.md | mattot-masei | 2026-07-11 | gepubliceerd |
| devarim.md | devarim | 2026-07-18 | gepubliceerd |
| vaetchanan.md | vaetchanan | 2026-07-25 | gepubliceerd |
| ekev.md | ekev | 2026-08-01 | gepubliceerd |
| reeh.md | reeh | 2026-08-08 | gepubliceerd |
| shoftim.md | shoftim | 2026-08-15 | gepubliceerd |
| ki-teitzei.md | ki-teitzei | 2026-08-17 | gepubliceerd |
| ki-tavo.md | ki-tavo | 2026-08-29 | gepubliceerd |
| **nitzavim-vayelech.md** | **nitzavim-vayelech** | **2026-09-05** | **actueel / current** |
| yom-teruah.md | yom-teruah | 2026-09-12 | basisbestand voor komende feestdag |
| haazinu.md | haazinu | 2026-09-19 | basisbestand |
| yom-kippur.md | yom-kippur | 2026-09-21 | basisbestand voor komende feestdag |
| sukkot.md | sukkot | 2026-09-26 | basisbestand voor komende feestdag |

## Nitzavim/Vayelech — volledige bron

`content/parasjot/nitzavim-vayelech.md` bevat:

- `body_nl` — Nederlandse lezing
- `body_en` — Engelse lezing
- `study_body_nl` — Nederlands studieblad
- `study_body_en` — Engels studieblad
- `worksheet_body_nl` — Nederlands werkblad
- `worksheet_body_en` — Engels werkblad
- Torah: Deuteronomium 29:10–31:30
- Haftara: Jesaja 61:10–63:9
- Evangelie: Johannes 12:41–50

Titel NL: **In je mond, in je hart, in je handen**

## Canonieke Nitzavim/Vayelech-documenten

Er horen precies 12 downloadbestanden bij deze bron:

### Lezingen

```
public/downloads/lezingen/nitzavim-vayelech-lezing-nl.docx
public/downloads/lezingen/nitzavim-vayelech-lezing-nl.pdf
public/downloads/lezingen/nitzavim-vayelech-lezing-en.docx
public/downloads/lezingen/nitzavim-vayelech-lezing-en.pdf
```

### Studiebladen

```
public/downloads/studiebladen/nitzavim-vayelech-studieblad-nl.docx
public/downloads/studiebladen/nitzavim-vayelech-studieblad-nl.pdf
public/downloads/studiebladen/nitzavim-vayelech-studieblad-en.docx
public/downloads/studiebladen/nitzavim-vayelech-studieblad-en.pdf
```

### Werkbladen

```
public/downloads/werkbladen/nitzavim-vayelech-werkblad-nl.docx
public/downloads/werkbladen/nitzavim-vayelech-werkblad-nl.pdf
public/downloads/werkbladen/nitzavim-vayelech-werkblad-en.docx
public/downloads/werkbladen/nitzavim-vayelech-werkblad-en.pdf
```

## Gegenereerde website-data

Deze bestanden zijn afgeleid en mogen niet als primaire bron worden bewerkt:

```
data/passages.json
public/data/passages.json
public/data/downloads.json
public/data/bible/nitzavim-vayelech-parasha.json
public/data/bible/nitzavim-vayelech-haftara.json
public/data/bible/nitzavim-vayelech-gospel.json
```

De passage- en Bijbeldata worden opnieuw opgebouwd door de content-pipeline wanneer de markdownbron verandert.

## Crosscheck bij nieuwe documentcreatie

Controleer vóór publicatie altijd:

1. Er bestaat precies één `.md`-bron voor de parasja.
2. Bestandsnaam en `id` gebruiken dezelfde slug.
3. Er is maximaal één parasja met `current: true`.
4. De downloadlinks in de markdown verwijzen alleen naar daadwerkelijk bestaande bestanden.
5. Voor een volledig tweetalige set zijn er 12 documenten: lezing, studieblad en werkblad × NL/EN × DOCX/PDF.
6. Gegenereerde JSON-bestanden worden niet handmatig als bron onderhouden.
7. Na de commit moeten zowel de content-pipeline als de GitHub Pages-deploy slagen.

## Naamgevingsconventie

Voor nieuwe volledige sets:

```
content/parasjot/{slug}.md

public/downloads/lezingen/{slug}-lezing-nl.docx
public/downloads/lezingen/{slug}-lezing-nl.pdf
public/downloads/lezingen/{slug}-lezing-en.docx
public/downloads/lezingen/{slug}-lezing-en.pdf

public/downloads/studiebladen/{slug}-studieblad-nl.docx
public/downloads/studiebladen/{slug}-studieblad-nl.pdf
public/downloads/studiebladen/{slug}-studieblad-en.docx
public/downloads/studiebladen/{slug}-studieblad-en.pdf

public/downloads/werkbladen/{slug}-werkblad-nl.docx
public/downloads/werkbladen/{slug}-werkblad-nl.pdf
public/downloads/werkbladen/{slug}-werkblad-en.docx
public/downloads/werkbladen/{slug}-werkblad-en.pdf
```
