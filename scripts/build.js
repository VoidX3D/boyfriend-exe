/* =============================================================================
 *  BOYFRIEND.EXE  —  scripts/build.js
 * -----------------------------------------------------------------------------
 *  Zero-dependency "build": copies the static site into dist/ so it can be
 *  hosted anywhere (GitHub Pages, Netlify, etc.). No transpile/bundling needed
 *  because the engine is plain browser JS.
 * ========================================================================== */
const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "..");
const OUT = path.join(ROOT, "dist");

const COPY = ["index.html", "manifest.webmanifest", "sw.js", "src", "data", "styles", "assets"];

function rm(p) {
  if (!fs.existsSync(p)) return;
  if (fs.statSync(p).isDirectory()) {
    fs.readdirSync(p).forEach((f) => rm(path.join(p, f)));
    fs.rmdirSync(p);
  } else fs.unlinkSync(p);
}
function copy(src, dst) {
  if (fs.statSync(src).isDirectory()) {
    if (!fs.existsSync(dst)) fs.mkdirSync(dst);
    fs.readdirSync(src).forEach((f) => copy(path.join(src, f), path.join(dst, f)));
  } else {
    fs.copyFileSync(src, dst);
  }
}

rm(OUT);
fs.mkdirSync(OUT);
COPY.forEach((p) => copy(path.join(ROOT, p), path.join(OUT, p)));
console.log("Built to dist/");
