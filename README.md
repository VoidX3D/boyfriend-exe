# BOYFRIEND.EXE

A modular vanilla-JS web quiz that starts cute and slowly degrades into an
unhinged, ragebait, self-corrupting "how well do you know your boyfriend?" test.
Built for Anuradha. Player assets and SFX are from Rahoot/Razzia (MIT).

## Run it

```bash
npm run dev      # zero-dependency live-reload server on http://localhost:5173
npm run build    # copy the whole app into dist/ for static hosting
npm start        # alias for dev
```

No bundler, no framework. Open `index.html` through the dev server (don't open
the file directly — the service worker and module scripts need http://).

## What's inside

- `index.html` — loads the data + engine modules in order.
- `data/questions.js` — the 15 boyfriend questions, 3 phantom questions, 5 bonus.
- `data/content.js` — all the unhinged copy (edit this for new material).
- `src/` — engine modules: core, audio, reactions, redirect, hud, corruption,
  chaos, flow, namegate, results, main.
- `styles/` — `main.css` (UI) and `corruption.css` (glitch effects).
- `assets/` — Rahoot/Razzia images + SFX, plus the Chewy font and favicon.
- `sw.js` + `manifest.webmanifest` — installable PWA with offline caching.

## Features

- Name gate (only "Anuradha" gets in).
- Correct + wrong answers both trigger full-screen fake-browser redirect chains.
- Retry chances, hints, phantom questions, a boss screen, and a secret ending.
- D-pattern detection, random ambient chaos, escalating unhinged reactions.
- Green correct popups, red wrong popups, mute toggle, reduced-motion safe.
- Fits the viewport without scrolling on phones; top-class mobile/touch support.

## Deploy

The app is a static site — host `dist/` (or the repo root) anywhere, or use the
included GitHub Pages workflow.
