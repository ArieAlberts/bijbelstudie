# Zelf de parasja lezen — Read the Parashah Yourself

Een interactief digitaal hulpmiddel voor zelfstandige, gestructureerde en corrigeerbare studie van de wekelijkse Toralezing (parasja), gebaseerd op de **Frame-methode van Arie Alberts**.

> *“De tekst is een land. Iedere uitleg is een kaart. Een goede kaart helpt ons het land zien, maar zij mag het land nooit verzinnen.”*

---

## 📖 Over het Project

**Zelf de parasja lezen** ondersteunt lezers om de Hebreeuwse Bijbeltekst (Tora en Tanach) in haar eigen opbouw, context en structuur te onderzoeken voordat secundaire verklaringsmodellen of dogma's worden toegepast. 

Het project biedt een interactief digitaal werkblad met 11 stappen, de volledige online handleiding (18 hoofdstukken), een meertalige Bijbellezer met Hebreeuwse/Griekse grondtekst en TBESH/TBESG lexicon, contactmogelijkheden en een browser-gebaseerd CMS dashboard.

---

## ✨ Belangrijkste Functionaliteiten

- 📜 **Alle 54 Parasjot**: Selecteer elke wekelijkse lezing uit Genesis, Exodus, Leviticus, Numeri en Deuteronomium.
- 🌍 **Strikte Taalisolatie (NL / EN)**:
  - `/nl/`: 100% Nederlands met Statenvertaling (SV) en DutSVV in STEP Bible.
  - `/en/`: 100% English with King James Version (KJV) and KJV in STEP Bible.
  - Geen taallek: ontbrekende vertalingen tonen duidelijke taalspecifieke meldingen in plaats van mixed-language fallbacks.
  - Taalwisseling behoudt zoekparameters en vertaalt URL-hashes (`#werkblad` ↔ `#worksheet`, `#methode` ↔ `#method`).
- 🔤 **TBESH & TBESG Grondtekst & Lexicon**:
  - Geïntegreerde grondtekst-popover met `HEB · TBESH` (Hebreeuws/Aramees) en `GRK · TBESG` (Grieks) badges.
  - Hebreeuwse lemmata in RTL-schrift, fonetische transliteraties, Strong's nummers, kernglossen en vertaalaanwijzingen (`kjv_def`).
  - Directe STEP Bible diep-links per grondwoord (`q=strong=H...` / `q=strong=G...`).
- 🛠️ **Beheermodule / Decap CMS (`/admin/`)**:
  - Visuele browser-gebaseerde beheermodule op `/admin/` (gekoppeld met Netlify Identity & Git Gateway).
  - Bestanden in `content/parasjot/*.md` worden ook automatisch verwerkt door `scripts/build-passages-index.mjs` en GitHub Actions pipeline.
- ✍️ **11-Stappen Werkblad**: Voortgangsindicator, notitievelden per stap en vinkjes voor voltooide stappen.
- 💾 **JSON Backup & Restore**: Exporteer al je gemaakte aantekeningen naar een `.json` bestand en laad ze eenvoudig weer in op elk gewenst apparaat.
- 📚 **Volledige Online Handleiding**: 18 verdiepende hoofdstukken, bronnen, voorbeelden en een Hebreeuwse woordenlijst.

---

## 🛠️ Technologieën

- **Frontend**: [React.js](https://react.dev/) (React 19) + [Vite](https://vitejs.dev/)
- **Pictogrammen**: [Lucide React](https://lucide.dev/)
- **CMS & Content**: Decap CMS + Markdown / YAML via `js-yaml`
- **Lexicon Datasets**: OpenScriptures / STEPBible datasets `TBESH` & `TBESG` (CC BY 4.0)
- **Deployment & CI/CD**: Netlify + GitHub Actions (`.github/workflows/deploy.yml` & `content-pipeline.yml`)

---

## 🚀 Aan de slag

### Vereisten
- [Node.js](https://nodejs.org/) (versie 18 of hoger)
- `npm`

### Installatie

```bash
# Clone de repository
git clone https://github.com/ArieAlberts/bijbelstudie.git
cd bijbelstudie

# Installeer de afhankelijkheden
npm install
```

### Ontwikkeling & Server starten

```bash
# Start de lokale ontwikkelserver
npm run dev
```

Open vervolgens `http://localhost:3000` in je browser.

### Productie Build

```bash
# Bouw de geoptimaliseerde productieversie
npm run build
```

---

## 📄 Licentie & Bronvermelding

Dit project is gepubliceerd onder de MIT Licentie. Lexicongrondwoorden en gegevens van STEPBible / OpenScriptures zijn verwerkt onder de Creative Commons Attribution 4.0 International (CC BY 4.0) licentie.
