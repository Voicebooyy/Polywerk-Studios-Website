# Polywerk Studios – Website

Statische One-Page-Website, gehostet über GitHub Pages. Kein Framework, kein Build-Tool außer einem kleinen Python-Skript.

## Was liegt wo

| Datei | Inhalt |
|---|---|
| `build.py` | **Alle Texte und der HTML-Aufbau.** Erzeugt `index.html`, `impressum.html`, `datenschutz.html`, `404.html`. |
| `assets/style.css` | Aussehen (Farben, Schrift, Layout, Animationen). Farben stehen ganz oben unter `:root`. |
| `assets/site.js` | Verhalten: Maus-Netz, Menü, Einblenden, Scroll-Effekte. |
| `assets/` | Logo, Icon, Banner (SVG + PNG), Schrift `archivo.woff2`, Favicons. |
| `*.html` | Werden von `build.py` erzeugt – **nicht von Hand bearbeiten**, sonst gehen Änderungen beim nächsten Durchlauf verloren. |

## Texte ändern

1. Text in `build.py` ändern (E-Mail, Discord-Link und Slogan stehen ganz oben).
2. Im Projektordner ausführen:

   ```bash
   python3 build.py
   ```

3. Änderungen committen und pushen. GitHub Pages ist nach ca. 1–2 Minuten aktuell (im Browser mit Strg+F5 neu laden).

## Wichtig vor dem Start

- Impressum und Datenschutzerklärung sind noch Platzhalter.
- In `build.py` steht `noindex` (Seite wird nicht von Suchmaschinen gelistet). Erst entfernen, wenn das Impressum fertig ist.
