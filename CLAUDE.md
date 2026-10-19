# CLAUDE.md — bijbelstudie (Zelf de parasja lezen)

Interactive digital study tool for the weekly Torah reading (parashah), based on the Frame Method of Arie Alberts. Owner: Arie Alberts (Dutch-speaking; reply in Dutch, keep code identifiers and repo docs in English).

## Commands

```bash
npm install                        # install dependencies
npm run dev                        # local dev server on :3000
npm run build                      # full production build (passages, epub, docs, downloads, articles, assets, bible data, vite)
npm run build:passages             # rebuild data/passages.json + public/data/passages.json
npm run build:bible                # rebuild public/data/bible/*.json from cache files
npm run build:downloads            # rebuild public/data/downloads.json manifest
npm run build:articles             # compile article pages
npm run build:handbook             # regenerate nl/handleiding.html + en/handbook.html from content/handleiding/handleiding.md
npm run build:assets               # copy static assets
```

Always `git pull` first: the owner works from several machines and other tools also commit to `main`.

## Architecture

- **Frontend**: React 19 + Vite, multi-page app (NL + EN + admin). Entry points in `vite.config.js` `rollupOptions.input`.
- **Content**: Markdown files in `content/parasjot/*.md` with YAML frontmatter (id, parasha, label, status, title_nl/en, summary_nl/en, optional meta_description_nl/en (search snippet, otherwise derived from the summary), body_nl/en, study_body_nl/en, worksheet_body_nl/en, downloads, published_at).
- **Handbook**: `content/handleiding/handleiding.md` (frontmatter `body_nl`/`body_en` as HTML) is the source of the handbook. `scripts/build-handbook.mjs` injects it into `nl/handleiding.html` and `en/handbook.html` and regenerates both tables of contents. Edit the markdown, never the generated pages. Keep the `hoofdstuk-N` ids stable: the step plan in `nl/index.html` links to them.
- **Build scripts**: Node.js ESM scripts in `scripts/` that read content and generate JSON data files.
- **Bible data**: Pre-cached JSON in `scripts/*-bible-cache.json`, built into `public/data/bible/*.json`.
- **Downloads**: PDF/DOCX/RTF files in `public/downloads/{lezingen,studiebladen,werkbladen}/`.
- **CMS**: Decap CMS at `/admin/` for visual content editing.
- **Lexicon**: TBESH (Hebrew) and TBESG (Greek) datasets from STEPBible/OpenScriptures (CC BY 4.0).

## CI/CD

- `deploy.yml`: builds and deploys to GitHub Pages on push to `main`.
- `content-pipeline.yml`: regenerates passages index, bible data, and downloads manifest when `content/parasjot/**`, `.pages.yml`, or `scripts/**` change.

## Conventions

- Node.js ≥18, ESM (`"type": "module"`), React JSX components in `src/components/`.
- Strict language isolation: `/nl/` pages 100% Dutch, `/en/` pages 100% English. No mixed-language fallbacks.
- Content follows the parashah id as slug (`bereshit`, `haazinu`, `ki-tavo`, etc.). See `OVERZICHT.md` for status per parashah.
- Downloads follow naming: `{parasja}-{lezing|studieblad|werkblad}-{nl|en}.{pdf|docx|rtf}`.
- Small, single-purpose commits. Work on a feature branch and open a PR. Do not push straight to `main` unless the owner says so.
- No new runtime dependencies without asking.
