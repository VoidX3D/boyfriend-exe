/* =============================================================================
 *  BOYFRIEND.EXE  —  src/audio.js
 * -----------------------------------------------------------------------------
 *  AudioEngine: music playlist playback plus SFX. Playlist tracks are loaded
 *  from data/playlist.json and may point to .mp3 or .flac files. The mute
 *  preference applies to every HTMLAudioElement and synthesized Web Audio tone.
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
    countdown: ["assets/audio/three.mp3", "assets/audio/second.mp3", "assets/audio/first.mp3"]
  };
  var MUTE_KEY = "boyfriendExeMuted";
  var MUSIC_KEY = "boyfriendExeTrack";

  function readStorage(key) {
    try { return localStorage.getItem(key); }
    catch (e) { return null; }
  }

  function saveStorage(key, value) {
    try { localStorage.setItem(key, value); }
    catch (e) { /* ignore storage restrictions */ }
  }

  function AudioEngine() {
    this.muted = readStorage(MUTE_KEY) === "1";
    this.ctx = null;
    this.cache = {};
    this.failed = {};
    this.active = [];
    this.musicEl = null;
    this.musicWanted = false;
    this.playlist = [];
    this.currentTrackIndex = 0;
  }

  AudioEngine.prototype._saveMutePreference = function () {
    saveStorage(MUTE_KEY, this.muted ? "1" : "0");
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
    if (this.musicEl && all.indexOf(this.musicEl) === -1) all.push(this.musicEl);
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
      var kind = i === 2 ? "correct" : "click";
      var a = self._track(new Audio(seq[i]));
      a.preload = "auto";
      a.addEventListener("error", function () { if (!self.muted) self._synth(kind); });
      var pr = a.play();
      if (pr && pr.catch) pr.catch(function () { if (!self.muted) self._synth(kind); });
      i++;
      setTimeout(step, 650);
    }
    step();
  };

  AudioEngine.prototype.setPlaylist = function (config) {
    var tracks = config && Array.isArray(config.tracks) ? config.tracks : [];
    this.playlist = tracks.filter(function (track) {
      return track && track.id && track.title && typeof track.file === "string" &&
        /\.(mp3|flac)$/i.test(track.file);
    });
    if (!this.playlist.length) return;

    var saved = readStorage(MUSIC_KEY);
    var savedIndex = this.playlist.findIndex(function (track) { return track.id === saved; });
    var defaultIndex = this.playlist.findIndex(function (track) { return track.id === config.defaultTrack; });
    this.currentTrackIndex = savedIndex !== -1 ? savedIndex : (defaultIndex !== -1 ? defaultIndex : 0);
  };

  AudioEngine.prototype.getPlaylist = function () {
    return this.playlist.slice();
  };

  AudioEngine.prototype.getCurrentTrack = function () {
    return this.playlist[this.currentTrackIndex] || null;
  };

  AudioEngine.prototype._playCurrentTrack = function () {
    if (this.muted || !this.playlist.length) return;
    var track = this.getCurrentTrack();
    if (!track) return;
    if (this.musicEl) {
      try { this.musicEl.pause(); this.musicEl.currentTime = 0; } catch (e) {}
    }

    var el = new Audio(track.file);
    el.preload = "auto";
    el.loop = false;
    el.volume = 0.35;
    var self = this;
    el.addEventListener("ended", function () {
      if (!self.muted && self.musicWanted) self.nextTrack(true);
    });
    el.addEventListener("error", function () {
      if (self.musicWanted && self.playlist.length > 1) self.nextTrack(true);
    });
    this.musicEl = this._track(el);
    var pr = el.play();
    if (pr && pr.catch) pr.catch(function () { /* browser autoplay policy */ });
  };

  AudioEngine.prototype.selectTrack = function (value) {
    var index = typeof value === "number" ? value : this.playlist.findIndex(function (track) { return track.id === value; });
    if (index < 0 || index >= this.playlist.length) return this.getCurrentTrack();
    this.currentTrackIndex = index;
    var track = this.getCurrentTrack();
    saveStorage(MUSIC_KEY, track.id);
    if (this.musicWanted && !this.muted) this._playCurrentTrack();
    return track;
  };

  AudioEngine.prototype.nextTrack = function (auto) {
    if (!this.playlist.length) return null;
    this.currentTrackIndex = (this.currentTrackIndex + 1) % this.playlist.length;
    var track = this.getCurrentTrack();
    saveStorage(MUSIC_KEY, track.id);
    if (this.musicWanted && !this.muted) this._playCurrentTrack();
    return track;
  };

  AudioEngine.prototype.previousTrack = function () {
    if (!this.playlist.length) return null;
    this.currentTrackIndex = (this.currentTrackIndex - 1 + this.playlist.length) % this.playlist.length;
    var track = this.getCurrentTrack();
    saveStorage(MUSIC_KEY, track.id);
    if (this.musicWanted && !this.muted) this._playCurrentTrack();
    return track;
  };

  AudioEngine.prototype.startMusic = function () {
    this.musicWanted = true;
    if (this.muted || !this.playlist.length) return;
    this._playCurrentTrack();
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
      if (this.musicWanted) this._playCurrentTrack();
    }
    return this.muted;
  };

  var BEX = global.BEX = global.BEX || {};
  BEX.AudioEngine = AudioEngine;
})(window);
