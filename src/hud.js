/* =============================================================================
 *  BOYFRIEND.EXE  —  src/hud.js
 * -----------------------------------------------------------------------------
 *  Persistent HUD (score / streak / rage / progress / mute) and the floating
 *  toast used all over the engine. Rage is shown as both a bar and a text
 *  MOOD label (no emoji). Mute toggle uses an inline SVG.
 * ========================================================================== */
(function (global) {
  "use strict";
  var BEX = global.BEX;
  var S = BEX.state;
  var $ = BEX.dom.$;

  function rageState() {
    var r = S.rage;
    if (r <= 19) return "CALM";
    if (r <= 39) return "SLIGHTLY CONCERNING";
    if (r <= 59) return "RAGE DETECTED";
    if (r <= 79) return "SHE'S GETTING ANGRY";
    if (r <= 99) return "PLEASE REMAIN CALM";
    return "RAGE LIMIT EXCEEDED";
  }

  function renderHud() {
    var hud = $("#hud");
    hud.style.display = "flex";
    hud.innerHTML =
      '<div class="hud-block"><span class="hud-label">SCORE</span>' +
      '<span class="hud-val" id="hudScore">0</span></div>' +
      '<div class="hud-block"><span class="hud-label">STREAK</span>' +
      '<span class="hud-val" id="hudStreak">0×</span></div>' +
      '<div class="hud-block"><span class="hud-label">RAGE</span>' +
      '<span class="hud-val" id="hudRage">' + rageState() + '</span>' +
      '<div class="rage-bar"><div class="rage-fill" id="rageFill"></div></div></div>' +
      '<span class="hud-mood" id="hudMood">' + BEX.reactions.moodLabel() + '</span>' +
      '<div class="hud-block"><span class="hud-label">PROGRESS</span>' +
      '<span class="hud-val" id="hudProg">0 / ' + BEX.config.TOTAL + '</span></div>' +
      '<button id="muteBtn" class="mute-btn" title="mute" aria-label="mute">' +
        BEX.svg.sound + '</button>';
    $("#muteBtn").addEventListener("click", function () {
      var m = BEX.audio ? BEX.audio.toggleMute() : true;
      this.innerHTML = m ? BEX.svg.mute : BEX.svg.sound;
      BEX.hud.toast(m ? "MUTED. The boyfriend can no longer hear your suffering."
                     : "SOUND ON. He can hear everything now.");
    });
    updateHud();
  }

  function updateHud() {
    var sc = $("#hudScore"), st = $("#hudStreak"), rg = $("#hudRage"),
        pr = $("#hudProg"), fill = $("#rageFill"), mood = $("#hudMood");
    if (!sc) return;
    sc.textContent = S.score;
    st.textContent = S.currentStreak + "×";
    rg.textContent = rageState();
    pr.textContent = Math.min(S.realIndex, BEX.config.TOTAL) + " / " + BEX.config.TOTAL;
    if (fill) fill.style.width = Math.min(100, S.rage) + "%";
    if (mood) mood.textContent = BEX.reactions.moodLabel();
  }

  function toast(msg) {
    var t = document.createElement("div");
    t.className = "toast";
    t.innerHTML = msg;
    BEX.dom.fx().appendChild(t);
    setTimeout(function () { t.classList.add("show"); }, 20);
    setTimeout(function () {
      t.classList.remove("show");
      setTimeout(function () { if (t.parentNode) t.parentNode.removeChild(t); }, 400);
    }, 3200);
  }

  BEX.hud = { renderHud: renderHud, updateHud: updateHud, toast: toast, rageState: rageState };
  BEX.ui = { toast: toast };
})(window);
