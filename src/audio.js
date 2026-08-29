/* =============================================================================
 *  BOYFRIEND.EXE  —  src/audio.js
 * -----------------------------------------------------------------------------
 *  AudioEngine: plays the Rahoot/Razzia SFX (assets/audio/*.mp3) when present,
 *  and falls back to synthesized Web Audio tones if a file is missing or
 *  blocked. Audio is fully optional (mute toggle) for accessibility.
 * ========================================================================== */
(function (global) {
  "use strict";

  // Maps game events -> Rahoot asset files (cloned from Ralex91/Rahoot, MIT).
  const MANIFEST = {
    click:   "assets/audio/answersSound.mp3",
    reveal:  "assets/audio/show.mp3",
    select:  "assets/audio/answersSound.mp3",
    correct: "assets/audio/first.mp3",
    wrong:   "assets/audio/boump.mp3",
    error:   "assets/audio/boump.mp3",
    glitch:  "assets/audio/snearRoll.mp3",
    tense:   "assets/audio/snearRoll.mp3",
    results: "assets/audio/results.mp3",
    music:   "assets/audio/answersMusic.mp3",
    countdown: ["assets/audio/three.mp3", "assets/audio/second.mp3", "assets/audio/first.mp3"]
  };

  function AudioEngine() {
    this.muted = false;
    this.ctx = null;
    this.cache = {};        // name -> HTMLAudioElement (loaded)
    this.failed = {};       // name -> true if file unavailable
    this.musicEl = null;
  }

  AudioEngine.prototype._ensureCtx = function () {
    if (this.muted) return null;
    try {
      if (!this.ctx) {
        var AC = global.AudioContext || global.webkitAudioContext;
        if (AC) this.ctx = new AC();
      }
      if (this.ctx && this.ctx.state === "suspended") this.ctx.resume();
    } catch (e) { /* ignore */ }
    return this.ctx;
  };

  AudioEngine.prototype._load = function (name) {
    if (this.cache[name]) return this.cache[name];
    if (this.failed[name]) return null;
    var url = MANIFEST[name];
    if (!url) return null;
    var el = new Audio(url);
    el.preload = "auto";
    var self = this;
    el.addEventListener("error", function () { self.failed[name] = true; });
    this.cache[name] = el;
    return el;
  };

  // Synthesized fallback so the game always makes noise.
  AudioEngine.prototype._synth = function (kind) {
    var ctx = this._ensureCtx();
    if (!ctx) return;
    try {
      var o = ctx.createOscillator();
      var g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      var t = ctx.currentTime;
      var presets = {
        click:   { f: 520, type: "square",   d: 0.06 },
        correct: { f: 740, type: "triangle", d: 0.18 },
        wrong:   { f: 120, type: "sawtooth", d: 0.22 },
        error:   { f: 90,  type: "sawtooth", d: 0.3 },
        glitch:  { f: 300, type: "square",   d: 0.12 },
        reveal:  { f: 420, type: "sine",     d: 0.1 },
        results: { f: 600, type: "triangle", d: 0.4 }
      };
      var p = presets[kind] || presets.click;
      o.type = p.type;
      o.frequency.setValueAtTime(p.f, t);
      if (kind === "wrong" || kind === "error")
        o.frequency.exponentialRampToValueAtTime(40, t + p.d);
      if (kind === "correct")
        o.frequency.exponentialRampToValueAtTime(1200, t + p.d);
      g.gain.setValueAtTime(0.18, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + p.d);
      o.start(t); o.stop(t + p.d);
    } catch (e) { /* ignore */ }
  };

  AudioEngine.prototype.play = function (name) {
    if (this.muted) return;
    var el = this._load(name);
    if (el) {
      try {
        el.currentTime = 0;
        var pr = el.play();
        if (pr && pr.catch) pr.catch(() => this._synth(name));
        return;
      } catch (e) { /* fall through */ }
    }
    this._synth(name);
  };

  // Countdown: play three.mp3 -> second.mp3 -> first.mp3 in sequence.
  AudioEngine.prototype.countdown = function (done) {
    if (this.muted) { if (done) setTimeout(done, 900); return; }
    var seq = MANIFEST.countdown;
    var i = 0;
    var self = this;
    function step() {
      if (i >= seq.length) { if (done) done(); return; }
      var el = self._load("countdown"); // cache by first; we override src
      // Use direct Audio for each step file:
      var a = new Audio(seq[i]);
      a.addEventListener("error", () => self._synth(i === 2 ? "correct" : "click"));
      var pr = a.play();
      if (pr && pr.catch) pr.catch(() => self._synth(i === 2 ? "correct" : "click"));
      i++;
      setTimeout(step, 650);
    }
    step();
  };

  AudioEngine.prototype.startMusic = function () {
    if (this.muted) return;
    var el = this._load("music");
    if (!el) return;
    try {
      el.loop = true; el.volume = 0.35;
      var pr = el.play();
      if (pr && pr.catch) pr.catch(() => {});
      this.musicEl = el;
    } catch (e) { /* ignore */ }
  };

  AudioEngine.prototype.stopMusic = function () {
    if (this.musicEl) { try { this.musicEl.pause(); } catch (e) {} this.musicEl = null; }
  };

  AudioEngine.prototype.toggleMute = function () {
    this.muted = !this.muted;
    if (this.muted) this.stopMusic();
    return this.muted;
  };

  var BEX = global.BEX = global.BEX || {};
  BEX.AudioEngine = AudioEngine;
})(window);
