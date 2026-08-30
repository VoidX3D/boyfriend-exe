/* =============================================================================
 *  BOYFRIEND.EXE  —  src/chaos.js
 * -----------------------------------------------------------------------------
 *  Ambient chaos: on a randomized timer the quiz messes with her out of nowhere
 *  — fake boyfriend push notifications (toasts) or full-screen fake popups
 *  (redirect pages). Never overlaps an existing overlay, never fires on the
 *  name/result screens. Pure psychological warfare.
 * ========================================================================== */
(function (global) {
  "use strict";
  var BEX = global.BEX;
  var timer = null;

  function overlayActive() { return BEX.dom.$(".redirect-layer"); }
  function inPlay() {
    var s = BEX.dom.stage();
    return !!(s && s.querySelector(".question-screen, .boss-screen"));
  }
  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function fire() {
    if (overlayActive() || !inPlay()) return schedule();
    if (Math.random() < 0.55 && (BEX.content.pushEvents || []).length) {
      BEX.hud.toast(pick(BEX.content.pushEvents));
    } else if ((BEX.content.chaosEvents || []).length) {
      var ev = pick(BEX.content.chaosEvents);
      BEX.redirect.runRedirectChain([ev], function () {});
    }
    schedule();
  }

  function schedule() {
    if (timer) clearTimeout(timer);
    timer = setTimeout(fire, 12000 + Math.random() * 16000);
  }

  BEX.chaos = {
    start: function () { if (timer) return; schedule(); },
    stop: function () { if (timer) { clearTimeout(timer); timer = null; } }
  };
})(window);
