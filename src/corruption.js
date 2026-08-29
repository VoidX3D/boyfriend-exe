/* =============================================================================
 *  BOYFRIEND.EXE  —  src/corruption.js
 * -----------------------------------------------------------------------------
 *  Background corruption FX: the quiz degrades the longer she plays. Screen
 *  shakes, score flicker, progress corruption, fake toasts, terminal bursts.
 *  Speed/intensity scale with how deep into the quiz she is (corr() 0..1).
 * ========================================================================== */
(function (global) {
  "use strict";
  var BEX = global.BEX;
  var S = BEX.state;
  var $ = BEX.dom.$;
  var fx = BEX.dom.fx;

  function corr() { return BEX.config.TOTAL ? S.realIndex / BEX.config.TOTAL : 0; }

  function corruptionTier() {
    var c = corr();
    if (c <= 0.20) return "1";
    if (c <= 0.40) return "2";
    if (c <= 0.60) return "3";
    if (c <= 0.80) return "4";
    if (c <= 0.95) return "5";
    return "boss";
  }

  var glitchTimer = null;
  function startCorruptionLoop() {
    if (glitchTimer) return;
    tickGlitch();
  }
  function tickGlitch() {
    var c = corr();
    var delay = 2200 - c * 1600;
    glitchTimer = setTimeout(function () {
      if (c > 0.20) maybeGlitch(c);
      tickGlitch();
    }, Math.max(500, delay));
  }
  function stopCorruptionLoop() {
    if (glitchTimer) { clearTimeout(glitchTimer); glitchTimer = null; }
  }

  function maybeGlitch(c) {
    var roll = Math.random();
    if (roll < 0.35 * c) glitchShake();
    else if (roll < 0.55 * c) flickerScore();
    else if (roll < 0.72 * c) corruptProgress();
    else if (roll < 0.85 * c) fakeToast(c);
    else if (c > 0.8) terminalBurst();
    if (c > 0.86 && Math.random() < 0.4) scoreGlitchBurst();
  }

  function glitchShake() {
    var app = $("#app");
    if (!app) return;
    app.classList.add("shake");
    setTimeout(function () { app.classList.remove("shake"); }, 380);
  }
  function flickerScore() {
    var s = $("#hudScore");
    if (!s) return;
    s.classList.add("flicker");
    setTimeout(function () { s.classList.remove("flicker"); }, 260);
  }
  function corruptProgress() {
    var p = $("#hudProg");
    if (!p) return;
    var total = BEX.config.TOTAL;
    var orig = Math.min(S.realIndex, total) + " / " + total;
    var junk = ["ERROR", "Question " + (S.realIndex + 1) + " / " + total,
                "Question " + S.realIndex + " / " + Math.max(1, total - 1), "█▓▒░ ??"];
    var j = junk[Math.floor(Math.random() * junk.length)];
    p.textContent = j;
    setTimeout(function () { p.textContent = orig; }, 600);
  }
  function scoreGlitchBurst() {
    var s = $("#hudScore");
    if (!s) return;
    var seq = [S.score, S.score + 1, 999, "ERROR", S.score];
    var i = 0;
    (function nx() {
      if (i >= seq.length) return;
      s.textContent = seq[i]; s.classList.add("flicker");
      i++; setTimeout(function () { s.classList.remove("flicker"); setTimeout(nx, 140); }, 160);
    })();
  }

  function fakeToast(c) {
    var msgs = [
      "SYSTEM INTEGRITY: " + Math.max(1, Math.round((1 - c) * 100)) + "%",
      "New boyfriend lore detected. (it's worse)",
      "connection to boyfriend: UNSTABLE",
      "memory leak in 'relationship.db'",
      "please remain calm. (optional)"
    ];
    BEX.hud.toast(msgs[Math.floor(Math.random() * msgs.length)]);
  }
  function terminalBurst() {
    var term = $("#terminal");
    if (!term) {
      term = document.createElement("div");
      term.id = "terminal";
      term.className = "terminal";
      fx().appendChild(term);
    }
    var lines = [
      "BOYFRIEND.EXE: RUNNING",
      "REALITY: UNKNOWN",
      "trace: she keeps answering D",
      "warn: rage escalating",
      "panic: no correct answer exists",
      "kill -9 boyfriend_lore",
      "SIGSEGV (boyfriend)"
    ];
    var l = lines[Math.floor(Math.random() * lines.length)];
    var span = document.createElement("div");
    span.className = "term-line";
    span.textContent = "> " + l;
    term.appendChild(span);
    setTimeout(function () { if (span.parentNode) span.parentNode.removeChild(span); }, 4000);
  }

  BEX.corruption = {
    corr: corr,
    corruptionTier: corruptionTier,
    startCorruptionLoop: startCorruptionLoop,
    stopCorruptionLoop: stopCorruptionLoop,
    maybeGlitch: maybeGlitch,
    glitchShake: glitchShake,
    flickerScore: flickerScore,
    corruptProgress: corruptProgress,
    scoreGlitchBurst: scoreGlitchBurst,
    fakeToast: fakeToast,
    terminalBurst: terminalBurst
  };
})(window);
