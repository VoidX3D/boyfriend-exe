#!/usr/bin/env node
/*
 * Scan music/ and generate data/playlist.json.
 * Add music files only; the GitHub workflow runs this automatically.
 */
const fs = require("fs");
const path = require("path");

const root = path.resolve(__dirname, "..");
const musicDir = path.join(root, "music");
const output = path.join(root, "data", "playlist.json");
const supported = new Set([".mp3", ".flac"]);

function titleFromFilename(filename) {
  return path.basename(filename, path.extname(filename))
    .replace(/[._-]+/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .replace(/\b\w/g, (letter) => letter.toUpperCase()) || "Untitled Vibe";
}

function idFromFilename(filename) {
  return path.basename(filename, path.extname(filename))
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "track";
}

if (!fs.existsSync(musicDir)) fs.mkdirSync(musicDir, { recursive: true });
const files = fs.readdirSync(musicDir, { withFileTypes: true })
  .filter((entry) => entry.isFile() && supported.has(path.extname(entry.name).toLowerCase()))
  .map((entry) => entry.name)
  .sort((a, b) => a.localeCompare(b, undefined, { numeric: true, sensitivity: "base" }));

if (!files.length) {
  console.error("No .mp3 or .flac files found in music/");
  process.exit(1);
}

const usedIds = new Set();
const tracks = files.map((filename) => {
  const ext = path.extname(filename).toLowerCase().slice(1);
  const baseId = idFromFilename(filename);
  let id = baseId;
  let suffix = 2;
  while (usedIds.has(id)) id = `${baseId}-${suffix++}`;
  usedIds.add(id);
  return {
    id,
    title: titleFromFilename(filename),
    artist: "BOYFRIEND.EXE",
    file: `music/${encodeURIComponent(filename)}`,
    format: ext,
    description: `${titleFromFilename(filename)} background vibe.`,
    enabled: true
  };
});

const playlist = {
  defaultTrack: tracks[0].id,
  tracks
};
fs.writeFileSync(output, `${JSON.stringify(playlist, null, 2)}\n`);
console.log(`Generated ${tracks.length} track${tracks.length === 1 ? "" : "s"} in ${path.relative(root, output)}`);
