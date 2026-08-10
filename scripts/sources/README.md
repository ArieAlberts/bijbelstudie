# Bible & Lexicon Data Sources Documentation

This directory contains the pinned source datasets used to build the static offline Bible passage JSON files for *Zelf de parasja lezen*.

## Pinned Sources & Provenance

### 1. Statenvertaling (SV)
- **Source**: `scrollmapper/bible_databases` (Module `DutSVV` / Public Domain Statenvertaling 1637/1888 edition).
- **License**: Public Domain.
- **Usage**: Used as the default Dutch translation (`sv`) for all Old Testament and New Testament passages.

### 2. King James Version with Strong's Numbers & Morphology (KJV)
- **Source**: `scrollmapper/bible_databases` (Module `KJV 1769 with Strong's`).
- **License**: Public Domain.
- **Usage**: Used as the default English translation (`kjv`). Contains word tokens tagged with Hebrew (H####) and Greek (G####) Strong's identifiers.

### 3. STEP Bible Lexicon (TBESH & TBESG)
- **Source**: `STEPBible/STEPBible-Data` (Datasets `TBESH` for Hebrew/Aramaic, `TBESG` for Ancient Greek).
- **License**: Creative Commons Attribution 4.0 International (CC BY 4.0).
- **Attribution**: "Lexicon data provided by STEPBible (CC BY 4.0)".
- **Usage**: Central ground-word lexicon layer providing lemmas, transliterations, and concise lexical meanings for mapped words.

## Build Policy
All Bible data is compiled statically during `npm run build:bible`. **No external HTTP API requests are made during runtime or Netlify build.**
