/* =============================================================================
 *  BOYFRIEND.EXE  —  src/core.js
 * -----------------------------------------------------------------------------
 *  Shared namespace + tiny DOM/util helpers + game state + SVG icons.
 *  Plain browser globals (no bundler). Loaded first. Everything hangs off the
 *  single global `BEX` object so the engine can be split into small modules.
 *  NO EMOJIS anywhere — SVG only (see BEX.svg).
 * ========================================================================== */
(function (global) {
  "use strict";
  var BEX = global.BEX = global.BEX || {};

  /* ----------------------------- CONFIG --------------------------------- */
  BEX.config = {
    TOTAL: 15,
    TWIST_AFTER: [5, 9, 12, 14]
  };

  /* ----------------------------- DOM HELPERS ---------------------------- */
  function $(sel, root) { return (root || document).querySelector(sel); }
  function $all(sel, root) {
    return Array.prototype.slice.call((root || document).querySelectorAll(sel));
  }
  function stage() { return $("#stage"); }
  function fx() { return $("#fx"); }
  function setStage(html) { stage().innerHTML = html; }
  function clearStage() { stage().innerHTML = ""; }
  BEX.dom = { $, $all, stage: stage, fx: fx, setStage: setStage, clearStage: clearStage };

  /* ----------------------------- UTIL ----------------------------------- */
  function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, function (m) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[m];
    });
  }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
  function clamp(n, lo, hi) { return Math.max(lo, Math.min(hi, n)); }
  function pad(n, len) {
    var s = String(n);
    while (s.length < len) s = "0" + s;
    return s;
  }
  BEX.util = { escapeHtml: escapeHtml, pick: pick, clamp: clamp, pad: pad };

  /* ----------------------------- SVG ICONS ------------------------------ */
  BEX.svg = {
    close:
      '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">' +
      '<path d="M3 3 L13 13 M13 3 L3 13" stroke="currentColor" stroke-width="2" ' +
      'stroke-linecap="round"/></svg>',
    sound:
      '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">' +
      '<path d="M3 6 H5 L8 3 V13 L5 10 H3 Z" fill="currentColor"/>' +
      '<path d="M10 6 C11.5 7 11.5 9 10 10" stroke="currentColor" fill="none" ' +
      'stroke-width="1.4" stroke-linecap="round"/></svg>',
    mute:
      '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">' +
      '<path d="M3 6 H5 L8 3 V13 L5 10 H3 Z" fill="currentColor"/>' +
      '<path d="M10 6 C11.5 7 11.5 9 10 10" stroke="currentColor" fill="none" ' +
      'stroke-width="1.4" stroke-linecap="round"/>' +
      '<path d="M2 2 L14 14" stroke="currentColor" stroke-width="1.4" ' +
      'stroke-linecap="round"/></svg>',
    hint:
      '<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true">' +
      '<path d="M5 6a3 3 0 1 1 6 0c0 1.2-1 1.6-1 2.6h-4C6 7.6 5 7.2 5 6Z" ' +
      'fill="none" stroke="currentColor" stroke-width="1.3"/>' +
      '<path d="M6.5 11h3 M6.7 13h2.6" stroke="currentColor" stroke-width="1.3" ' +
      'stroke-linecap="round"/></svg>'
  };

  /* ----------------------------- GAME STATE ----------------------------- */
  function freshState() {
    return {
      playerName: "",
      realIndex: 0,
      flowIndex: 0,
      score: 0,
      rage: 0,
      correctAnswers: 0,
      wrongAnswers: 0,
      currentStreak: 0,
      bestStreak: 0,
      hintsUsed: 0,
      attempts: 0,
      corruption: 0,
      distribution: { a: 0, b: 0, c: 0, d: 0 },
      noHintBonus: true,
      startedAt: null,
      finishedAt: null,
      flow: [],
      resolved: false,
      lastRealId: 0,
      twistsShown: {},
      wrongStreak: 0,
      qStart: 0,
      achievements: {},
      answersLog: [],
      dCount: 0
    };
  }
  BEX.state = freshState();

  /* ----------------------------- DATA REFS ------------------------------ */
  BEX.content = global.CONTENT || {};
  BEX.questions = global.QUESTIONS || [];
  BEX.phantom = global.PHANTOM_QUESTIONS || [];

  /* ----------------------------- SFX PROXY ------------------------------ */
  /* Audio instance is created in main.js (BEX.audio). These proxies are safe
   * to call before init because they no-op when audio is absent. */
  BEX.sfx = function (name) { if (BEX.audio) BEX.audio.play(name); };
  BEX.sfxCountdown = function (cb) {
    if (BEX.audio) BEX.audio.countdown(cb);
    else if (cb) cb();
  };
})(window);
