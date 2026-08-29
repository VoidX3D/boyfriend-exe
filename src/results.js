/* =============================================================================
 *  BOYFRIEND.EXE  —  src/results.js
 * -----------------------------------------------------------------------------
 *  Final boss intro, the end-of-quiz report (with rank + unlocked achievements),
 *  the perfect-score secret ending, and the "SEE WHAT YOUR BOYFRIEND THINKS"
 *  finale (a redirect chain into a tier-based boyfriend reaction).
 * ========================================================================== */
(function (global) {
  "use strict";
  var BEX = global.BEX;
  var S = BEX.state;
  var $ = BEX.dom.$;
  var setStage = BEX.dom.setStage;
  var clearStage = BEX.dom.clearStage;

  function stopAudio() { if (BEX.audio) BEX.audio.stopMusic(); }

  /* --------------------------- FINAL BOSS ------------------------------ */
  function bossSequence(q) {
    document.body.setAttribute("data-corruption", "boss");
    stopAudio();
    clearStage();
    var stageEl = BEX.dom.stage();
    stageEl.innerHTML = '<div class="screen boss-screen"><div id="bossText" class="boss-text"></div></div>';
    var bt = $("#bossText");
    var lines = ["ANALYZING PLAYER...", "ANALYZING BOYFRIEND...", "ANALYSIS FAILED"];
    BEX.sfx("tense");
    var i = 0;
    function nextLine() {
      if (i >= lines.length) { setTimeout(function () { BEX.flow.renderQuestion(q); }, 700); return; }
      bt.textContent = lines[i];
      bt.classList.add("flash");
      BEX.sfxCountdown(function () {});
      if (i === 2) BEX.sfx("glitch");
      i++;
      setTimeout(function () { bt.classList.remove("flash"); setTimeout(nextLine, 900); }, 1000);
    }
    nextLine();
  }

  /* ----------------------------- RESULTS ------------------------------- */
  function rankFor(acc) {
    if (acc <= 20) return { head: "# WHO IS THIS MAN?", body: "You have apparently never met your boyfriend." };
    if (acc <= 40) return { head: "# CASUAL OBSERVER", body: "You know the general concept of boyfriend." };
    if (acc <= 60) return { head: "# FUNCTIONAL KNOWLEDGE", body: "The relationship appears operational." };
    if (acc <= 80) return { head: "# LORE CONSUMER", body: "You've clearly been paying attention." };
    if (acc <= 99) return { head: "# SUSPICIOUS", body: "You know an unreasonable amount about this man." };
    return { head: "# SHE KNOWS TOO MUCH.", body: "You answered every question correctly. At this point this isn't a quiz. <b>This is surveillance.</b>" };
  }

  function achievementsHtml() {
    var list = BEX.content.achievements || [];
    var got = list.filter(function (a) { return S.achievements[a.id]; });
    if (!got.length) return "";
    return '<div class="achievements"><h3 class="rank-head">SECRET ACHIEVEMENTS</h3>' +
      got.map(function (a) {
        return '<p class="ach"><b>' + BEX.util.escapeHtml(a.name) + '</b> — ' + BEX.util.escapeHtml(a.desc) + '</p>';
      }).join("") + '</div>';
  }

  function showResults() {
    S.finishedAt = Date.now();
    stopAudio();
    BEX.corruption.stopCorruptionLoop();
    BEX.chaos.stop();
    BEX.sfx("results");
    document.body.setAttribute("data-corruption", "boss");
    BEX.corruption.stopCorruptionLoop();

    var total = 15;
    var accuracy = Math.round((S.correctAnswers / total) * 100);
    var maxRage = Math.min(100, S.rage);
    var rank = rankFor(accuracy);

    var slowest = null;
    S.answersLog.forEach(function (l) {
      if (l.dt != null && (!slowest || l.dt > slowest.dt)) slowest = l;
    });
    var dataLine = slowest
      ? "<p>Longest think: <b>Q" + slowest.qid + " (" + Math.round(slowest.dt / 1000) +
        "s)</b></p>"
      : "";

    if (S.correctAnswers === total && S.hintsUsed === 0) return secretEnding();

    saveBest();

    setStage(
      '<div class="screen result-screen">' +
      '  <h2 class="result-title"># BOYFRIEND KNOWLEDGE REPORT</h2>' +
      '  <div class="report">' +
      '    <p>Player: <b>' + BEX.util.escapeHtml(S.playerName) + '</b></p>' +
      '    <p>Questions survived: <b>15</b></p>' +
      '    <p>Correct: <b>' + S.correctAnswers + '</b></p>' +
      '    <p>Wrong: <b>' + S.wrongAnswers + '</b></p>' +
      '    <p>Accuracy: <b>' + accuracy + '%</b></p>' +
      '    <p>Lore XP: <b>' + S.score.toLocaleString() + '</b></p>' +
      '    <p>Best streak: <b>' + S.bestStreak + '×</b></p>' +
      '    <p>Hints used: <b>' + S.hintsUsed + '</b></p>' +
      '    <p>Maximum rage: <b>' + maxRage + '%</b></p>' +
      dataLine +
      '  </div>' +
      '  <div class="rank-box">' +
      '    <h3 class="rank-head">' + rank.head + '</h3>' +
      '    <p class="rank-body">' + rank.body + '</p>' +
      '  </div>' +
      achievementsHtml() +
      '  <div class="result-actions">' +
      '    <button id="againBtn" class="btn btn-primary">PLAY AGAIN</button>' +
      '    <button id="bfBtn" class="btn btn-ghost">SEE WHAT YOUR BOYFRIEND THINKS</button>' +
      '    <button id="regretBtn" class="btn btn-ghost">I regret everything</button>' +
      '  </div>' +
      '</div>'
    );
    $("#againBtn").addEventListener("click", function () { location.reload(); });
    $("#bfBtn").addEventListener("click", boyfriendResponse);
    $("#regretBtn").addEventListener("click", function () {
      BEX.hud.toast("Too late. The lore is permanent.");
    });
  }

  function boyfriendResponse() {
    var total = 15;
    var accuracy = Math.round((S.correctAnswers / total) * 100);
    var tier = S.correctAnswers === total ? "perfect"
      : accuracy <= 40 ? "low" : accuracy <= 70 ? "medium" : "high";
    var line = BEX.content.boyfriendResponses[tier] || BEX.content.boyfriendResponses.medium;
    BEX.redirect.runRedirectChain([
      { type: "loading", url: "boyfriend.exe/thinking", body: "LOADING BOYFRIEND RESPONSE" },
      { title: "HE HAS REVIEWED YOUR RESULTS", url: "boyfriend.exe/verdict",
        body: line, btn: "BACK TO REPORT" }
    ], function () { showResults(); });
  }

  function secretEnding() {
    saveBest();
    BEX.corruption.stopCorruptionLoop();
    BEX.chaos.stop();
    stopAudio();
    BEX.sfx("glitch");
    clearStage();
    var s = BEX.dom.stage();
    s.innerHTML = '<div class="screen boss-screen"><div id="bossText" class="boss-text"></div></div>';
    var bt = $("#bossText");
    var lines = ["ANALYZING RESULTS...", "ANALYZING AGAIN...", "THIS SHOULDN'T BE POSSIBLE."];
    var i = 0;
    (function next() {
      if (i >= lines.length) {
        setTimeout(function () {
          setStage(
            '<div class="screen result-screen secret">' +
            '  <h2 class="result-title"># FORBIDDEN BOYFRIEND LORE</h2>' +
            '  <p>You know him better than the quiz does.</p>' +
            '  <p>There is nothing left to test.</p>' +
            '  <p class="subtle"><b>Probably.</b></p>' +
            achievementsHtml() +
            '  <div class="result-actions">' +
            '    <button id="againBtn" class="btn btn-primary">PLAY AGAIN</button>' +
            '    <button id="regretBtn" class="btn btn-ghost">I regret everything</button>' +
            '  </div>' +
            '</div>'
          );
          $("#againBtn").addEventListener("click", function () { location.reload(); });
          $("#regretBtn").addEventListener("click", function () { BEX.hud.toast("No you don't."); });
        }, 800);
        return;
      }
      bt.textContent = lines[i]; bt.classList.add("flash"); BEX.sfx("glitch");
      i++; setTimeout(function () { bt.classList.remove("flash"); setTimeout(next, 900); }, 1000);
    })();
  }

  /* --------------------------- LOCAL STORAGE ---------------------------- */
  function saveBest() {
    try {
      var bs = parseInt(localStorage.getItem("boyfriendQuizBestScore") || "0", 10);
      if (S.score > bs) localStorage.setItem("boyfriendQuizBestScore", String(S.score));
      var bst = parseInt(localStorage.getItem("boyfriendQuizBestStreak") || "0", 10);
      if (S.bestStreak > bst) localStorage.setItem("boyfriendQuizBestStreak", String(S.bestStreak));
      localStorage.setItem("boyfriendQuizCompleted", "1");
    } catch (e) { /* ignore */ }
  }

  BEX.results = {
    bossSequence: bossSequence,
    showResults: showResults,
    rankFor: rankFor,
    secretEnding: secretEnding,
    boyfriendResponse: boyfriendResponse,
    saveBest: saveBest
  };
})(window);
