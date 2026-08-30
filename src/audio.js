/* =============================================================================
 *  BOYFRIEND.EXE  —  src/audio.js
 * -----------------------------------------------------------------------------
 *  AudioEngine: plays the Rahoot/Razzia SFX (assets/audio/*.mp3) when present,
 *  and falls back to synthesized Web Audio tones if a file is missing or
 *  blocked. The mute preference is persisted and applies to every audio path.
 * ========================================================================== */
(function (global) {
  "use strict";

  var MANIFEST = {
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
  var MUTE_KEY = "boyfriendExeMuted";

  function readMutePreference() {
    try { return localStorage.getItem(MUTE_KEY) === "1"; }
    catch (e) { return false; }
  }

  function AudioEngine() {
    this.muted = readMutePreference();
    this.ctx = null;
    this.cache = {};
    this.failed = {};
    this.active = [];
    this.musicEl = null;
    this.musicWanted = false;
  }

  AudioEngine.prototype._saveMutePreference = function () {
    try { localStorage.setItem(MUTE_KEY, this.muted ? "1" : "0"); }
    catch (e) { /* ignore storage restrictions */ }
  };

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
    if (!url || Array.isArray(url)) return null;
    var el = new Audio(url);
    el.preload = "auto";
    var self = this;
    el.addEventListener("error", function () { self.failed[name] = true; });
    this.cache[name] = el;
    return el;
  };

  AudioEngine.prototype._track = function (el) {
    if (this.active.indexOf(el) === -1) this.active.push(el);
    var self = this;
    var remove = function () {
      var i = self.active.indexOf(el);
      if (i !== -1) self.active.splice(i, 1);
    };
    el.addEventListener("ended", remove, { once: true });
    return el;
  };

  AudioEngine.prototype._stopAll = function () {
    var all = this.active.slice();
    Object.keys(this.cache).forEach(function (key) {
      if (all.indexOf(this.cache[key]) === -1) all.push(this.cache[key]);
    }, this);
    all.forEach(function (el) {
      try { el.pause(); el.currentTime = 0; } catch (e) { /* ignore */ }
    });
    this.active = [];
    if (this.ctx) {
      try { this.ctx.suspend(); } catch (e) { /* ignore */ }
    }
  };

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
      if (kind === "wrong" || kind === "error") o.frequency.exponentialRampToValueAtTime(40, t + p.d);
      if (kind === "correct") o.frequency.exponentialRampToValueAtTime(1200, t + p.d);
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
        this._track(el);
        el.currentTime = 0;
        var pr = el.play();
        if (pr && pr.catch) pr.catch(function () { if (!this.muted) this._synth(name); }.bind(this));
        return;
      } catch (e) { /* fall through */ }
    }
    this._synth(name);
  };

  AudioEngine.prototype.countdown = function (done) {
    var self = this;
    if (this.muted) { if (done) setTimeout(done, 900); return; }
    var seq = MANIFEST.countdown;
    var i = 0;
    function step() {
      if (self.muted) { if (done) done(); return; }
      if (i >= seq.length) { if (done) done(); return; }
      var a = self._track(new Audio(seq[i]));
      a.preload = "auto";
      a.addEventListener("error", function () { if (!self.muted) self._synth(i === 2 ? "correct" : "click"); });
      var kind = i === 2 ? "correct" : "click";
      var pr = a.play();
      if (pr && pr.catch) pr.catch(function () { if (!self.muted) self._synth(kind); });
      i++;
      setTimeout(step, 650);
    }
    step();
  };

  AudioEngine.prototype.startMusic = function () {
    this.musicWanted = true;
    if (this.muted) return;
    var el = this.musicEl || this._load("music");
    if (!el) return;
    try {
      el.loop = true;
      el.volume = 0.35;
      this.musicEl = el;
      this._track(el);
      var pr = el.play();
      if (pr && pr.catch) pr.catch(function () {});
    } catch (e) { /* ignore */ }
  };

  AudioEngine.prototype.stopMusic = function () {
    this.musicWanted = false;
    if (this.musicEl) {
      try { this.musicEl.pause(); this.musicEl.currentTime = 0; } catch (e) {}
    }
  };

  AudioEngine.prototype.toggleMute = function () {
    this.muted = !this.muted;
    this._saveMutePreference();
    if (this.muted) {
      this._stopAll();
    } else {
      if (this.ctx) { try { this.ctx.resume(); } catch (e) {} }
      if (this.musicWanted) this.startMusic();
    }
    return this.muted;
  };

  var BEX = global.BEX = global.BEX || {};
  BEX.AudioEngine = AudioEngine;
})(window);
