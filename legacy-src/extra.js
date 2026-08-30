/* =============================================================================
 *  BOYFRIEND.EXE  —  src/extra.js
 * -----------------------------------------------------------------------------
 *  Extra features: haptic feedback, keyboard navigation, mascot easter egg
 *  (click 5x for answer key), and a reset button.
 *  Safe to load after all other modules.
 * ========================================================================== */
(function (global) {
  "use strict";
  var BEX = global.BEX;

  // -------------------- Haptic feedback --------------------
  function haptic(ms) {
    if (ms === undefined) ms = 10;
    try { if (navigator.vibrate) navigator.vibrate(ms); } catch (e) {}
  }
  BEX.haptic = haptic;

  // -------------------- Keyboard navigation --------------------
  var keyHandler = function (e) {
    var answers = Array.prototype.slice.call(
      document.querySelectorAll(".answer:not(:disabled)")
    );
    if (!answers.length) return;
    var cur = document.activeElement;
    var idx = answers.indexOf(cur);
    var to = -1;
    if (e.key === "ArrowRight" || e.key === "ArrowDown") {
      to = ((idx >= 0 ? idx : -1) + 1) % answers.length;
    } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
      to = idx > 0 ? idx - 1 : answers.length - 1;
    } else if ((e.key === "Enter" || e.key === " ") && cur && cur.classList.contains("answer")) {
      e.preventDefault();
      cur.dispatchEvent(new window.Event("click", { bubbles: true }));
      return;
    } else {
      return;
    }
    e.preventDefault();
    if (answers[to]) answers[to].focus();
  };

  var kbActive = false;
  function startKeyboardNav() {
    if (kbActive) return;
    kbActive = true;
    document.addEventListener("keydown", keyHandler);
  }
  function stopKeyboardNav() {
    kbActive = false;
    document.removeEventListener("keydown", keyHandler);
  }
  BEX.keyboardNav = { on: startKeyboardNav, off: stopKeyboardNav };

  // -------------------- Mascot easter egg --------------------
  var mascotClicks = 0;
  function enableMascotEgg() {
    document.addEventListener("click", function (e) {
      if (e.target && e.target.classList && e.target.classList.contains("mascot")) {
        mascotClicks++;
        haptic(15);
        if (mascotClicks >= 5) {
          mascotClicks = 0;
          showCheatScreen();
        }
      }
    });
  }

  function showCheatScreen() {
    var stage = BEX.dom && BEX.dom.stage();
    if (!stage) return;
    var questions = BEX.questions || [];
    var rows = "";
    for (var i = 0; i < questions.length; i++) {
      var q = questions[i];
      var co = q.options.find(function (o) { return o.correct; });
      rows += "<li><b>Q" + (i + 1) + "</b> — " + (co ? co.id.toUpperCase() : "?") + "</li>";
    }
    stage.innerHTML =
      '<div class="screen">' +
        '<h2 class="ok"># CHEAT CODE UNLOCKED</h2>' +
        '<p class="subtle">Here — have the answer key. Don\'t tell the boyfriend.</p>' +
        '<ul class="stat-list">' + rows + '</ul>' +
        '<button class="btn btn-primary" onclick="location.reload()">[ CLOSE ]</button>' +
      '</div>';
  }

  // -------------------- Reset button --------------------
  function addResetButton() {
    var stage = BEX.dom && BEX.dom.stage();
    if (!stage || stage.querySelector("#resetBtn")) return;
    var btn = document.createElement("button");
    btn.id = "resetBtn";
    btn.className = "btn btn-ghost";
    btn.textContent = "[ RESET SAVE ]";
    btn.title = "Clear local data and start over";
    btn.addEventListener("click", function () {
      try { localStorage.clear(); } catch (e) {}
      haptic(30);
      location.reload();
    });
    stage.appendChild(btn);
  }

  // Wire everything in
  BEX.extra = {
    haptic: haptic,
    keyboardNav: BEX.keyboardNav,
    easterEgg: { enable: enableMascotEgg },
    addResetButton: addResetButton
  };

  // Auto-start when flow starts
  if (BEX.flow && BEX.flow.startGame) {
    var _orig = BEX.flow.startGame;
    BEX.flow.startGame = function () {
      enableMascotEgg();
      startKeyboardNav();
      return _orig.apply(this, arguments);
    };
  }
})(window);
