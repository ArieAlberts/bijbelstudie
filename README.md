# Verbeterde tweetalige website

Deze versie behoudt de bestaande `/nl/`- en `/en/`-structuur, formuliernamen/velden, de opslag-sleutel `frame-parasja-site-v2` en de getrapte hulpflow.

## Wijzigingen
- localStorage en sessionStorage zijn afgeschermd met een in-memory fallback.
- Skip-links, focusringen, semantische navigatie en reduced-motion-ondersteuning zijn toegevoegd.
- Inline styles zijn naar CSS-klassen verplaatst.
- Alle `oklch()`-declaraties hebben een hex/rgb-fallback.
- Google Fonts-verzoeken zijn verwijderd; CSS gebruikt lokale geïnstalleerde exemplaren wanneer aanwezig en anders systeemfallbacks.
- NL/EN-privacyverklaringen, footerkoppelingen en contact-consentlinks zijn toegevoegd.
- Favicon, Apple-touch-icon, Open Graph/Twitter-metadata en wederkerige hreflang-links zijn toegevoegd.
- `defer="True"` is genormaliseerd naar `defer`.

## Netlify
Publiceer de volledige inhoud van deze map. De formulieren `quick-feedback` en `serious-help-request`, alle veldnamen en de honeypot `bot-field` zijn ongewijzigd.


## Redactionele herhalingsronde
De metafoor kaart/land blijft als ankerzin, in de volledige uitleg van hoofdstuk 1 en in de woordenlijst. Op andere plaatsen is heruitleg vervangen door directe taal over tekst, uitleg en corrigeerbaarheid. Functionele herhaling in vragen, werkonderdelen en eindchecks is bewust behouden.
