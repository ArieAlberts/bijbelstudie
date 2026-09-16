# Overzicht parasja-content voor de website

**Actueel bijgewerkt: 16 september 2026**

**Ha'azinu-controle:** bron, 12 downloads en tijdelijke testbestanden gecontroleerd op 16 september 2026.

Dit bestand is bedoeld als crosscheck tussen de primaire markdownbronnen in `content/parasjot/` en de downloadbestanden onder `public/downloads/`.

## Bronprincipe

Voor iedere parasja of feestlezing geldt één markdownbestand als primaire bron. De `id` in het frontmatter bepaalt de canonieke slug. De online lezing, het studieblad en het werkblad worden vanuit die bron ontsloten; downloadlinks mogen alleen verwijzen naar bestanden die daadwerkelijk in `public/downloads/` aanwezig zijn.

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
| nitzavim-vayelech.md | nitzavim-vayelech | 2026-09-05 | volledig tweetalig |
| yom-teruah.md | jom-teruah | 2026-09-12 | volledig tweetalig |
| **haazinu.md** | **haazinu** | **2026-09-19** | **volledig tweetalig / gereed** |
| yom-kippur.md | yom-kippur | 2026-09-21 | basisbestand |
| sukkot.md | sukkot | 2026-09-26 | basisbestand |

> Let op: het bestandsnaam-item voor Jom Teruah heet historisch `yom-teruah.md`, terwijl de interne `id` `jom-teruah` is. Dit wordt hier alleen gedocumenteerd; wijzig die bestaande koppeling niet zonder migratie van alle verwijzingen.

## Ha'azinu — volledige bron

`content/parasjot/haazinu.md` bevat:

- `body_nl` — Nederlandse lezing
- `body_en` — Engelse lezing
- `study_body_nl` — Nederlands studieblad
- `study_body_en` — Engels studieblad
- `worksheet_body_nl` — Nederlands werkblad
- `worksheet_body_en` — Engels werkblad
- Torah: Deuteronomium 32:1–52
- Haftara: Hosea 14:2–10 + Joël 2:15–27
- Evangelie / flanklezing: Mattheüs 18:21–35

Titel NL: **Als regen op het gras**  
Titel EN: **Like rain upon the grass**

`published_at: 2026-09-19` en `current: false`; de site bepaalt de actuele lezing op publicatiedatum waar de selector dat ondersteunt.

## Canonieke Ha'azinu-downloads

Er horen precies 12 downloadbestanden bij de bron:

### Lezingen

```text
public/downloads/lezingen/haazinu-lezing-nl.docx
public/downloads/lezingen/haazinu-lezing-nl.pdf
public/downloads/lezingen/haazinu-lezing-en.docx
public/downloads/lezingen/haazinu-lezing-en.pdf
```

### Studiebladen

```text
public/downloads/studiebladen/haazinu-studieblad-nl.docx
public/downloads/studiebladen/haazinu-studieblad-nl.pdf
public/downloads/studiebladen/haazinu-studieblad-en.docx
public/downloads/studiebladen/haazinu-studieblad-en.pdf
```

### Werkbladen

```text
public/downloads/werkbladen/haazinu-werkblad-nl.docx
public/downloads/werkbladen/haazinu-werkblad-nl.pdf
public/downloads/werkbladen/haazinu-werkblad-en.docx
public/downloads/werkbladen/haazinu-werkblad-en.pdf
```

## Crosscheck bij publicatie

Controleer bij iedere nieuwe set:

1. Er bestaat precies één `.md`-bron voor de parasja.
2. Bestandsnaam en `id` gebruiken dezelfde slug, behalve expliciet gedocumenteerde historische uitzonderingen.
3. Er is maximaal één handmatig item met `current: true`; waar de selector op `published_at` werkt, blijven toekomstige items `current: false`.
4. Alle downloadlinks uit het markdownbestand wijzen naar werkelijk aanwezige bestanden.
5. Voor een volledig tweetalige set zijn er 12 bestanden: lezing, studieblad en werkblad × NL/EN × DOCX/PDF.
6. Gegenereerde JSON-bestanden worden niet handmatig als primaire bron onderhouden.
7. Na een wijziging moeten content-pipeline en GitHub Pages-deploy worden gecontroleerd.
8. Tijdelijke testbestanden (zoals `*.tmp-check`) horen niet in `content/parasjot/`.

## Naamgevingsconventie voor volledige sets

```text
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
