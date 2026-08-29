/* =============================================================================
 *  BOYFRIEND.EXE  —  src/flow.js
 * -----------------------------------------------------------------------------
 *  The question flow: builds the real+phantom sequence, renders questions,
 *  handles answers (correct/wrong/phantom), streak bonuses, hints, and the
 *  per-question twist gate. Correct and wrong answers both fan out into a full
 *  redirect-chain reaction (see reactions.js + redirect.js).
 * ========================================================================== */
(function (global) {
  "use strict";
  var BEX = global.BEX;
  var S = BEX.state;
  var Q = BEX.questions;
  var PH = BEX.phantom;
  var $ = BEX.dom.$;
  var stage = BEX.dom.stage;
  var setStage = BEX.dom.setStage;
  var escapeHtml = BEX.util.escapeHtml;
  var TWIST_AFTER = BEX.config.TWIST_AFTER;

  function buildFlow() {
    var flow = [];
    Q.forEach(function (q) {
      flow.push({ type: "real", q: q });
      PH.forEach(function (p) {
        if (p.injectAfter === q.id) flow.push({ type: "phantom", q: p });
      });
    });
    return flow;
  }

  /* ------------------------------- START ------------------------------- */
  function startGame() {
    S.startedAt = Date.now();
    S.flow = buildFlow();
    S.realIndex = 0; S.flowIndex = 0;
    BEX.hud.renderHud();
    if (BEX.audio) BEX.audio.startMusic();
    BEX.corruption.startCorruptionLoop();
    BEX.chaos.start();
    nextFlow();
  }

  /* --------------------------- FLOW CONTROL ---------------------------- */
  function nextFlow() {
    if (S.flowIndex >= S.flow.length) return BEX.results.showResults();
    var item = S.flow[S.flowIndex];
    if (item.type === "real") {
      S.realIndex++;
      S.attempts = 0;
      S.corruption = BEX.corruption.corr();
      if (item.q.isFinal) return BEX.results.bossSequence(item.q);
      renderQuestion(item.q);
    } else {
      renderPhantom(item.q);
    }
  }

  function advanceFlow() {
    S.flowIndex++;
    if (S.lastRealId && TWIST_AFTER.indexOf(S.lastRealId) !== -1 && !S.twistsShown[S.lastRealId]) {
      S.twistsShown[S.lastRealId] = true;
      return BEX.redirect.fireTwist(S.lastRealId, nextFlow);
    }
    nextFlow();
  }

  /* --------------------------- REAL QUESTION --------------------------- */
  function padTexts(options) {
    var max = 0;
    options.forEach(function (o) { if (o.text.length > max) max = o.text.length; });
    return options.map(function (o) { return o.text + " ".repeat(max - o.text.length); });
  }

  function renderQuestion(q) {
    document.body.setAttribute("data-corruption", BEX.corruption.corruptionTier());
    S.lastRealId = q.id;
    S.qStart = Date.now();
    BEX.sfx("reveal");
    var texts = padTexts(q.options);
    var opts = q.options.map(function (o, i) {
      return '<button class="answer shape-' + i + '" data-opt="' + o.id + '">' +
             '<span class="ans-key">' + ["A", "B", "C", "D"][i] + '</span>' +
             '<span class="ans-text">' + escapeHtml(texts[i]) + '</span></button>';
    }).join("");
    setStage(
      '<div class="screen question-screen">' +
      '  <div class="q-meta"><span class="q-cat">' + q.category + '</span>' +
      '    <span class="q-num">Question ' + q.id + ' / 15</span></div>' +
      '  <h2 class="q-text">' + q.question + '</h2>' +
      '  <div class="answers">' + opts + '</div>' +
      '  <div class="q-actions">' +
      '    <button id="hintBtn" class="btn btn-ghost">' + BEX.svg.hint + ' HINT (−20)</button>' +
      '    <span id="attemptDots" class="attempts"></span>' +
      '  </div>' +
      '  <div id="feedback" class="feedback"></div>' +
      '</div>'
    );
    BEX.hud.updateHud();
    wireAnswers(q);
    var hint = $("#hintBtn");
    hint.addEventListener("click", function () { useHint(q, hint); });
  }

  function wireAnswers(q) {
    stage().querySelectorAll(".answer").forEach(function (b) {
      b.addEventListener("click", function () { chooseAnswer(q, b); });
    });
  }

  function chooseAnswer(q, btn) {
    var optId = btn.getAttribute("data-opt");
    var opt = q.options.filter(function (o) { return o.id === optId; })[0];
    if (!opt) return;
    BEX.sfx("select");
    if (opt.id === "d") S.dCount++;
    var dt = S.qStart ? (Date.now() - S.qStart) : null;
    if (opt.correct) return resolveCorrect(q, opt, dt);
    return resolveWrong(q, opt, btn, dt);
  }

  function resolveCorrect(q, opt, dt) {
    S.attempts++;
    var pts = S.attempts === 1 ? 100 : (S.attempts === 2 ? 50 : 25);
    S.score += pts;
    S.correctAnswers++;
    S.currentStreak++;
    if (S.currentStreak > S.bestStreak) S.bestStreak = S.currentStreak;
    S.wrongStreak = 0;
    S.rage = Math.max(0, S.rage - 3);
    S.distribution[opt.id]++;
    S.answersLog.push({ qid: q.id, dt: dt, correct: true, attempts: S.attempts });
    if (S.currentStreak === 5) BEX.reactions.unlock("lore_master");
    if (S.realIndex === 1 && opt.correct) BEX.reactions.unlock("cat_detective");
    applyStreakBonus();
    BEX.sfx("correct");
    BEX.hud.updateHud();

    var extra = "";
    if (q.id === 10 && S.distribution.d >= 3) extra = BEX.reactions.conspiracyD();
    if (q.id === 13) extra += BEX.reactions.distributionAnalysis();

    var pages = BEX.reactions.buildCorrectPages(q, opt, extra, dt);
    var pp = BEX.reactions.dPatternPage();
    if (pp) pages.unshift(pp);
    BEX.redirect.runRedirectChain(pages, advanceFlow);
  }

  var MAX_RETRIES = 3;

  function resolveWrong(q, opt, btn, dt) {
    S.attempts++;
    S.score = Math.max(0, S.score - 15);
    S.rage += 8;
    S.wrongStreak++;
    S.currentStreak = 0;
    S.answersLog.push({ qid: q.id, dt: dt, correct: false, attempts: S.attempts });
    if (S.wrongStreak === 3) BEX.reactions.unlock("chaos_agent");
    if (S.rage >= 100) { BEX.reactions.unlock("rage_machine"); rageLimit(); }
    BEX.sfx("wrong");
    BEX.hud.updateHud();

    if (btn) { btn.classList.add("wrong-pick"); btn.disabled = true; }

    if (S.attempts <= MAX_RETRIES) showWrongFeedback(q, opt, dt);
    else giveUp(q, opt, dt);
  }

  function showWrongFeedback(q, opt, dt) {
    var fb = $("#feedback");
    fb.innerHTML = "";
    var box = document.createElement("div");
    box.className = "fb-box bad";
    box.innerHTML = "<div class='ans-taunt'>" + BEX.util.escapeHtml(BEX.reactions.wrongTaunt()) + "</div>";
    var row = document.createElement("div");
    row.className = "fb-actions";
    var retry = document.createElement("button");
    retry.className = "btn btn-primary";
    retry.textContent = "TRY AGAIN (" + (MAX_RETRIES - S.attempts + 1) + " LEFT)";
    retry.addEventListener("click", function () {
      S.score = Math.max(0, S.score - 5);
      BEX.hud.updateHud();
      renderQuestion(q);
    });
    var give = document.createElement("button");
    give.className = "btn btn-ghost";
    give.textContent = "GIVE UP";
    give.addEventListener("click", function () { giveUp(q, opt, dt); });
    row.appendChild(retry);
    row.appendChild(give);
    fb.appendChild(box);
    fb.appendChild(row);
  }

  function giveUp(q, opt, dt) {
    S.wrongAnswers++;
    var pages = BEX.reactions.buildWrongPages(q, opt, dt);
    var pp = BEX.reactions.dPatternPage();
    if (pp) pages.unshift(pp);
    BEX.redirect.runRedirectChain(pages, advanceFlow);
  }

  function applyStreakBonus() {
    var s = S.currentStreak;
    if (s === 3) { S.score += 100; BEX.hud.toast("STREAK 3×  +100"); }
    else if (s === 5) { S.score += 250; BEX.hud.toast("STREAK 5×  +250"); }
    else if (s === 10) { S.score += 500; BEX.hud.toast("STREAK 10×  +500"); }
    else if (s === 15) { S.score += 1000; BEX.hud.toast("STREAK 15×  +1000"); }
  }

  function rageLimit() {
    BEX.sfx("error");
    BEX.hud.toast("RAGE LIMIT EXCEEDED — The system has detected unacceptable levels of " +
      "frustration. Unfortunately, this changes nothing.");
  }

  function useHint(q, btn) {
    if (btn.disabled) return;
    S.hintsUsed++;
    S.noHintBonus = false;
    S.score = Math.max(0, S.score - 20);
    S.rage += 2;
    btn.disabled = true;
    BEX.sfx("reveal");
    BEX.hud.updateHud();
    var fb = $("#feedback");
    var h = document.createElement("p");
    h.className = "hint-show";
    h.textContent = q.hint || "Think harder.";
    fb.appendChild(h);
  }

  /* ----------------------------- PHANTOM ------------------------------- */
  var noAnswerTimer = null;

  function renderPhantom(p) {
    document.body.setAttribute("data-corruption", BEX.corruption.corruptionTier());
    BEX.sfx("tense");
    var texts = padTexts(p.options);
    var opts = p.options.map(function (o, i) {
      return '<button class="answer shape-' + i + '" data-opt="' + o.id + '">' +
             '<span class="ans-key">' + ["A", "B", "C", "D"][i] + '</span>' +
             '<span class="ans-text">' + escapeHtml(texts[i]) + '</span></button>';
    }).join("");
    setStage(
      '<div class="screen question-screen phantom">' +
      '  <div class="q-meta"><span class="q-cat">' + p.category + '</span>' +
      '    <span class="q-num">?? / 15</span>' +
      '    <span class="q-timer" id="phantomTimer">30s</span></div>' +
      '  <h2 class="q-text glitch-text">' + p.question + '</h2>' +
      '  <div class="answers">' + opts + '</div>' +
      '  <p class="pick-status" id="pickStatus">SELECT ALL 4 OPTIONS FIRST — 0/4</p>' +
      '  <div id="feedback" class="feedback"></div>' +
      '</div>'
    );
    if (noAnswerTimer) { clearInterval(noAnswerTimer); noAnswerTimer = null; }
    var t = 30;
    noAnswerTimer = setInterval(function () {
      t--;
      var el = $("#phantomTimer");
      if (el) el.textContent = t + "s";
      if (t <= 0) {
        clearInterval(noAnswerTimer); noAnswerTimer = null;
        noAnswerTimeout();
      }
    }, 1000);
    var need = p.options.length;
    var picked = 0;
    stage().querySelectorAll(".answer").forEach(function (b) {
      b.addEventListener("click", function () {
        if (b.disabled) return;
        b.disabled = true;
        b.classList.add("chosen");
        S.rage += 4;
        if (S.rage >= 100) rageLimit();
        BEX.hud.updateHud();
        picked++;
        var st = $("#pickStatus");
        if (st) st.textContent = "SELECT ALL " + need + " OPTIONS FIRST — " + picked + "/" + need;
        if (picked >= need) {
          if (noAnswerTimer) { clearInterval(noAnswerTimer); noAnswerTimer = null; }
          var fb = $("#feedback");
          var cont = document.createElement("button");
          cont.className = "btn btn-primary";
          cont.textContent = "NEXT QUESTION";
          cont.addEventListener("click", function () {
            S.score = Math.max(0, S.score - 25);
            S.currentStreak = 0;
            BEX.hud.updateHud();
            phantomRedirect(p);
          });
          fb.appendChild(cont);
        }
      });
    });
  }

  function phantomRedirect(p) {
    var pages = [{ type: "loading", url: "boyfriend.exe/void", body: "REDIRECTING YOU TO NOTHING" }];
    var n = 2 + Math.floor(BEX.corruption.corr() * 5);
    for (var k = 0; k < n; k++) {
      var pg = BEX.content.wrongScreens[(k + 7) % BEX.content.wrongScreens.length];
      pages.push({ title: pg.title, body: pg.body, btn: "CONTINUE", type: pg.type,
        url: "boyfriend.exe/void/" + (200 + k) });
    }
    pages.push({
      title: "ANSWER: NONE", url: "boyfriend.exe/void/answer",
      body: p.reveal + "<br><span class='subtle'>(told you there was no correct answer.)</span>",
      btn: "NEXT QUESTION"
    });
    BEX.redirect.runRedirectChain(pages, advanceFlow);
  }

  function noAnswerTimeout() {
    BEX.redirect.runRedirectChain([{
      title: "TIME'S UP.", url: "boyfriend.exe/timeout",
      body: "There was never a correct answer. Of course. Moving on.", btn: "NEXT QUESTION"
    }], advanceFlow);
  }

  BEX.flow = {
    buildFlow: buildFlow,
    startGame: startGame,
    nextFlow: nextFlow,
    advanceFlow: advanceFlow,
    renderQuestion: renderQuestion,
    renderPhantom: renderPhantom,
    phantomRedirect: phantomRedirect,
    noAnswerTimeout: noAnswerTimeout
  };
})(window);
