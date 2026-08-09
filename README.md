# Zelf de parasja lezen — Read the Parashah Yourself

Een interactief digitaal hulpmiddel voor zelfstandige, gestructureerde en corrigeerbare studie van de wekelijkse Toralezing (parasja), gebaseerd op de **Frame-methode van Arie Alberts**.

> *“De tekst is een land. Iedere uitleg is een kaart. Een goede kaart helpt ons het land zien, maar zij mag het land nooit verzinnen.”*

---

## 📖 Over het Project

**Zelf de parasja lezen** ondersteunt lezers om de Hebreeuwse Bijbeltekst (Tora en Tanach) in haar eigen opbouw, context en structuur te onderzoeken voordat secundaire verklaringsmodellen of dogma's worden toegepast. 

Het project biedt een interactief digitaal werkblad met 11 stappen, de volledige online handleiding (18 hoofdstukken), een methode-uitleg, contactmogelijkheden en meertalige ondersteuning.

---

## ✨ Belangrijkste Functionaliteiten

- 📜 **Alle 54 Parasjot**: Selecteer elke wekelijkse lezing uit Genesis, Exodus, Leviticus, Numeri en Deuteronomium.
- ✍️ **11-Stappen Werkblad**: Voortgangsindicator, notitievelden per stap en vinkjes voor voltooide stappen.
- 💾 **JSON Backup & Restore**: Exporteer al je gemaakte aantekeningen naar een `.json` bestand en laad ze eenvoudig weer in op elk gewenst apparaat.
- 🍔 **Responsive Hamburger Menu**: Modern, mobielvriendelijk geanimeerd navigatiemenu gebouwd met React.js en glassmorphic styling.
- 🌍 **Tweetalig (NL / EN)**: Volledige ondersteuning voor Nederlands en Engels.
- 📚 **Volledige Online Handleiding**: 18 verdiepende hoofdstukken, bronnen, voorbeelden en een Hebreeuwse woordenlijst.

---

## 🛠️ Technologieën

- **Frontend**: [React.js](https://react.dev/) (React 19) + [Vite](https://vitejs.dev/)
- **Pictogrammen**: [Lucide React](https://lucide.dev/)
- **Styling**: Vanilla CSS met harmonische warm-perkamenten OKLCH kleurentokens (`#954c28` warm terracotta, `#f8f4ef` perkament papier)
- **Deployment**: [Netlify](https://www.netlify.com/) met `_redirects` en `netlify.toml`

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

## 📄 Licentie

Dit project is gepubliceerd onder de MIT Licentie.
