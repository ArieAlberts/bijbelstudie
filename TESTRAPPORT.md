# Testrapport

Uitgevoerd op de NL- en EN-versies van index, handboek, contact, privacy en bedankpagina.

- JavaScript-syntaxis: geslaagd.
- Pagina-opbouw zonder JavaScriptfouten: geslaagd.
- Geblokkeerde localStorage/sessionStorage: pagina blijft werken; route- en weergaveknoppen blijven bruikbaar.
- `prefers-reduced-motion: reduce`: CSS-scrollgedrag is `auto`; JavaScript gebruikt `behavior: auto`.
- Toetsenbord: skip-link is het eerste focusbare element en verschijnt bij focus; volgende interactieve elementen hebben een zichtbare 3px-focusring.
- Geautomatiseerde WCAG-AA-contrastcontrole van zichtbare tekst en bedieningselementen: geen afwijkingen gevonden.
- Externe fontverzoeken: niet aanwezig.
- Inline `style`-attributen en `<style>`-blokken in HTML: niet aanwezig.
- CSS-fallbackcontrole: iedere directe `oklch()`-declaratie heeft een voorafgaande hex/rgb-fallback; `color-mix()` heeft een rgba-fallback.
- Relatieve links en ankers: geen ontbrekende doelen gevonden.
- Open Graph/Twitter-meta: aanwezig op index, handboek, contact en privacy in beide talen.
- Hreflang: NL/EN/x-default wederkerig op gekoppelde pagina's.
- Netlify: formuliernamen, veldnamen, honeypot en ratingwaarden zijn behouden.
- localStorage-sleutel `frame-parasja-site-v2`: behouden.

## Lettertypen
Google Fonts-verzoeken zijn verwijderd. De CSS probeert lokaal geïnstalleerde exemplaren van Source Serif 4 en Work Sans te gebruiken en valt anders terug op systeemlettertypen. Er zijn geen fontbestanden in dit pakket opgenomen.
