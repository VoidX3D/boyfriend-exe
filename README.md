# BOYFRIEND.EXE

**BOYFRIEND.EXE** is a modular, vanilla-JavaScript quiz that starts cute and gradually degrades into an unhinged, self-corrupting test of how well you know your boyfriend. It is a static progressive web app with no framework, bundler, database, or runtime service required.

The project was built for Anuradha. Player assets and sound effects are from Rahoot/Razzia and are used under the MIT license.

## Quick start

Use Node.js and serve the project over HTTP. Opening `index.html` directly is not supported because the app loads JSON with `fetch()` and registers a service worker.

```bash
npm install       # no external runtime dependencies are required
npm run dev       # start the development server at http://localhost:5173
npm run build     # copy the complete static site into dist/
npm start         # alias for npm run dev
```

After starting the server, visit `http://localhost:5173/`. The development server serves the repository root; the build script creates a deployable `dist/` directory.

## How the app is organized

The app has a deliberately small, explicit runtime architecture.

| Location | Responsibility |
|---|---|
| `index.html` | Loads the engine modules in dependency order. It does not contain quiz data. |
| `src/core.js` | Creates the shared `BEX` namespace, state object, DOM helpers, and configuration. |
| `src/main.js` | Loads and validates the JSON files, hydrates the shared state, and starts the quiz. |
| `src/flow.js` | Runs question display, answer selection, retries, hints, and progression. |
| `src/reactions.js` | Builds correct, wrong, phantom, streak, and answer-reveal reactions. |
| `src/redirect.js` | Renders the fake-browser reaction windows. |
| `src/audio.js` | Plays music and effects, falls back to Web Audio tones, and owns mute state. |
| `src/hud.js` | Renders score, streak, rage, progress, and the global mute control. |
| `src/corruption.js` and `src/chaos.js` | Add escalating visual and ambient chaos. |
| `src/namegate.js` and `src/results.js` | Handle the player gate, finale, score report, and ending. |
| `styles/main.css` | Layout, typography, question cards, centered reaction windows, and responsive UI. |
| `styles/corruption.css` | Glitch, shake, flicker, and terminal effects. |
| `assets/` | Images, favicon, Chewy font, and Rahoot/Razzia audio files. |
| `sw.js` | PWA installation and offline caching. |

## Editing questions and content

All editable quiz data is in JSON. The engine reads these files at startup, so changing question copy does not require changing JavaScript.

| File | Contains |
|---|---|
| `data/questions.json` | Main questions, phantom questions, and bonus questions. |
| `data/content.json` | Shared reaction pools, plot twists, achievements, messages, and ending copy. |
| `old_questions/` | Archived question and content sources from earlier versions. |

A real question must have exactly one option with `"correct": true`. Each option may also include a `reaction` object for a custom wrong-answer response. A typical real question looks like this:

```json
{
  "id": 21,
  "phase": "cute",
  "category": "NEW CATEGORY",
  "question": "What would your boyfriend do in this new situation?",
  "hint": "A small clue for the player.",
  "options": [
    { "id": "a", "text": "First possibility", "correct": false },
    { "id": "b", "text": "The canon answer", "correct": true, "feedback": "" },
    { "id": "c", "text": "Third possibility", "correct": false },
    { "id": "d", "text": "Fourth possibility", "correct": false }
  ],
  "correctFeedback": "A short reaction shown after the answer."
}
```

Keep `id` values unique. The main question bank should retain four options because the answer-distribution and D-pattern systems expect A, B, C, and D. Phantom questions use `injectAfter` and `reveal`; bonus questions use the same option format but are shown in the bonus flow.

The app derives the progress total from `questions.length`, so adding or removing main questions does not require updating HUD or results code. After editing JSON, run the build and reload the page.

## Audio and mute behavior

The HUD mute button is a **global audio control**. When muted, it stops currently playing music, stops cached and active HTML audio effects, prevents countdown sounds, and disables synthesized Web Audio fallback tones. The choice is saved in `localStorage` under `boyfriendExeMuted`, so a reload keeps the player’s preference. Selecting the button again restores audio and resumes music when the game still wants music playing.

Audio files are optional. If an asset cannot play, the engine falls back to short synthesized tones when audio is enabled. Browsers may require the first sound to follow a user gesture; this is normal autoplay protection.

## Service-worker and cache behavior

The service worker uses a versioned cache named in `sw.js`. The JSON question and content files use network-first loading so returning players receive updated copy when online, while the cached version remains available offline. If the data schema or shell files change, increment the `CACHE` value in `sw.js` and rebuild.

If a browser appears to show an older build, perform a normal reload first. For a stubborn local development cache, unregister the site’s service worker in browser developer tools and reload once.

## Verification checklist

Run the following before publishing:

```bash
npm run build
for f in src/*.js scripts/*.js sw.js; do node --check "$f"; done
git diff --check
```

Then verify that the following work in a browser: the page scrolls on small screens, the correct and wrong reaction windows are centered, question progress updates, the mute control changes its label and icon, music and effects stop when muted, and a reload preserves the mute preference.

## Deployment

This is a static site. Deploy either the repository root or the generated `dist/` directory to Vercel, GitHub Pages, Netlify, or any static host. The included `vercel.json` and `scripts/build.js` support the current Vercel deployment flow.

The live project is available at [boyfriend-exe.vercel.app](https://boyfriend-exe.vercel.app/), and the source repository is [VoidX3D/boyfriend-exe](https://github.com/VoidX3D/boyfriend-exe).
