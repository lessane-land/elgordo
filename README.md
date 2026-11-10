# El Gordo, la probabilidad

The odds of Spain's Christmas lottery (Sorteo Extraordinario de Navidad, 22 December 2026), drawn at a scale you can feel. Spanish and English.

This is about understanding chance, not encouraging anyone to play. No number is "due", there are no strategies, and the lottery pays back less than it takes in.

## Layers

1. **Your ticket.** Type a number or ask for a random one, see it in the drum and among all 100,000 numbers. Live.
2. **The odds, felt.** El Gordo, the pedrea and the reintegro drawn as rice, stadium seats, paving tiles and people. Live.
3. What is more likely than El Gordo. Coming.
4. The money: prizes, tax, what comes back. Coming.
5. History. Coming.
6. On the day: only if an open, allowed official source exists.

## How it is built

- No build step. Plain HTML, CSS and ES modules, served by GitHub Pages.
- `assets/js/data.js` holds every figure with the id of its source. `creditos.html` lists the sources.
- `assets/js/i18n.js` holds every visible string in both languages.
- `assets/js/scales.js` fills each silhouette with exactly 100,000 cells, so cell *i* is always number *i*.
- Fonts are self-hosted (SIL OFL 1.1). No cookies, analytics, ads, or third-party requests.

## Check the figures

```
npm test
```

Re-runs the prize maths and a draw simulation against the values the page shows.

## Run locally

```
python3 -m http.server
```

Then open http://localhost:8000.
