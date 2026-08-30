/* =============================================================================
 *  BOYFRIEND.EXE  —  src/main.js
 * -----------------------------------------------------------------------------
 *  Bootstrap. Loads editable JSON data, hydrates the shared BEX references, then
 *  creates audio and starts the name gate. Runtime content belongs in data/*.json.
 * ========================================================================== */
(function (global) {
  "use strict";
  var BEX = global.BEX;
  var DATA_VERSION = "2026-08-30-playlist-v1";
  var booted = false;

  function readJson(url) {
    return fetch(url + "?v=" + encodeURIComponent(DATA_VERSION), {
      cache: "no-store",
      headers: { "Accept": "application/json" }
    }).then(function (response) {
      if (!response.ok) throw new Error("Unable to load " + url + " (" + response.status + ")");
      return response.json();
    });
  }

  function hydrateData(data) {
    if (!data || !Array.isArray(data.questions) ||
        !Array.isArray(data.phantomQuestions) || !Array.isArray(data.bonusQuestions)) {
      throw new Error("questions.json has an invalid structure");
    }
    if (!data.content || typeof data.content !== "object") {
      throw new Error("content.json has an invalid structure");
    }
    if (!data.playlist || !Array.isArray(data.playlist.tracks)) {
      throw new Error("playlist.json has an invalid structure");
    }

    BEX.questions.splice.apply(BEX.questions, [0, BEX.questions.length].concat(data.questions));
    BEX.phantom.splice.apply(BEX.phantom, [0, BEX.phantom.length].concat(data.phantomQuestions));
    BEX.bonus = data.bonusQuestions;
    Object.keys(data.content).forEach(function (key) {
      BEX.content[key] = data.content[key];
    });

    var tracks = data.playlist.tracks.filter(function (track) {
      return track && track.enabled !== false && track.id && track.title &&
        typeof track.file === "string" && /\.(mp3|flac)$/i.test(track.file);
    });
    if (!tracks.length) throw new Error("playlist.json has no enabled MP3 or FLAC tracks");
    BEX.playlist = { defaultTrack: data.playlist.defaultTrack, tracks: tracks };
    BEX.config.TOTAL = BEX.questions.length;
  }

  function showLoadError(error) {
    var app = document.getElementById("app");
    if (!app) return;
    app.innerHTML =
      '<main class="load-error" role="alert">' +
      '  <h1>BOYFRIEND.EXE COULD NOT LOAD</h1>' +
      '  <p>The question files are having a moment. Check your connection and reload.</p>' +
      '  <button class="btn btn-primary" id="reloadBtn">RELOAD QUIZ</button>' +
      '</main>';
    var reload = document.getElementById("reloadBtn");
    if (reload) reload.addEventListener("click", function () { global.location.reload(); });
    if (global.console && console.error) console.error(error);
  }

  function boot() {
    if (booted) return;
    booted = true;
    if (!document.getElementById("stage")) {
      var app = document.getElementById("app");
      app.innerHTML = '<div id="hud" style="display:none"></div>' +
                      '<div id="stage"></div><div id="fx"></div>';
    }
    if (BEX.AudioEngine) {
      BEX.audio = new BEX.AudioEngine();
      if (BEX.playlist) BEX.audio.setPlaylist(BEX.playlist);
    }
    BEX.namegate.renderNameScreen();
  }

  function loadAndBoot() {
    return Promise.all([
      readJson("data/questions.json"),
      readJson("data/content.json"),
      readJson("data/playlist.json")
    ]).then(function (files) {
        hydrateData({
          questions: files[0].questions,
          phantomQuestions: files[0].phantomQuestions,
          bonusQuestions: files[0].bonusQuestions,
          content: files[1],
          playlist: files[2]
        });
        boot();
      })
      .catch(showLoadError);
  }

  BEX.boot = loadAndBoot;
  global.BoyfriendExe = { boot: loadAndBoot };

  if ("serviceWorker" in navigator) {
    global.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").catch(function () {});
    });
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", loadAndBoot);
  else loadAndBoot();
})(window);
