/* =============================================================================
 *  BOYFRIEND.EXE  —  src/main.js
 * -----------------------------------------------------------------------------
 *  Bootstrap. Creates the single AudioEngine instance, wires it onto BEX.audio,
 *  and kicks off the name gate once the DOM is ready.
 * ========================================================================== */
(function (global) {
  "use strict";
  var BEX = global.BEX;

  function boot() {
    if (!document.getElementById("stage")) {
      var app = document.getElementById("app");
      app.innerHTML = '<div id="hud" style="display:none"></div>' +
                     '<div id="stage"></div><div id="fx"></div>';
    }
    if (BEX.AudioEngine) BEX.audio = new BEX.AudioEngine();
    BEX.namegate.renderNameScreen();
  }

  BEX.boot = boot;
  global.BoyfriendExe = { boot: boot };

  if ("serviceWorker" in navigator) {
    window.addEventListener("load", function () {
      navigator.serviceWorker.register("sw.js").catch(function () {});
    });
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", boot);
  else boot();
})(window);
