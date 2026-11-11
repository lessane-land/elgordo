# El Gordo, la probabilidad

The odds of Spain's Christmas lottery (Sorteo Extraordinario de Navidad, 22 December 2026), drawn at a scale you can feel. Spanish and English.

This is about understanding chance, not encouraging anyone to play. No number is "due", there are no strategies, and the lottery pays back less than it takes in.

Live experiment at a lessane.es subdomain.

## What it is

One quiet scroll, drawn on a canvas, no video and no music:

1. Rice falls like snow and gathers into the drum. Type your number, or take a random one.
2. The camera starts on your orange grain and pulls back until it is lost in 2.1 kg of rice, 100,000 grains, one per number.
3. A stadium lights up and goes dark except one seat: yours.
4. "Ni de coña." A small perfume parody: Ilusión, Eau de Décimo, 20 euros, your number on the label.
5. The maths, told with 100 friends: 86 win nothing, 9 get their money back, 5 win a bit more, none wins the Gordo. You pay 2,000 euros and normally get about 720 back.

Then the honesty line, the official help line (Jugar Bien and FEJAR), credits, and a Ko-fi link.

## How it is built

- No build step. Plain HTML, CSS and ES modules, served by GitHub Pages.
- `assets/js/strings.js` holds every visible string in both languages.
- `assets/js/data.js` holds every figure next to the id of its source. `creditos.html` lists the sources.
- `assets/js/film.js` draws the scroll story on one canvas. `assets/js/credits.js` builds the credits page.
- Fonts are self-hosted (SIL OFL 1.1). No cookies, analytics, ads, or third-party requests.

## Check the figures

```
npm test
```

Re-derives the prize maths, the tax, and the 100-friends numbers from the prize table with a seeded simulation, and fails if the copy drifts.

## Run locally

```
python3 -m http.server
```

Then open http://localhost:8000.
