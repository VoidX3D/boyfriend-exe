/* =============================================================================
 *  BOYFRIEND.EXE  —  src/reactions.js
 * -----------------------------------------------------------------------------
 *  The reaction engine: turns a correct / wrong / phantom answer into a chain
 *  of full-screen "redirect" pages. Picks typed reactions from data/content.json.
 *  Option-specific reactions (opt.reaction) override the random pool.
 *  NO EMOJIS — all copy lives in data/content.json.
 * ========================================================================== */
(function (global) {
  "use strict";
  var BEX = global.BEX;
  var S = BEX.state;
  var C = BEX.content;
  var pick = BEX.util.pick;
  var clamp = BEX.util.clamp;

  var WRONG_TYPES = ["roast", "fakeError", "boyfriendReaction", "dramatic",
    "absurd", "conspiracy", "punishment", "fourthWall", "fakeTechnical", "short"];
  var CORRECT_TYPES = ["praise", "suspicious", "lore", "boyfriendReaction",
    "dramatic", "wholesome", "fourthWall"];

  function loadingPage() {
    var body;
    if (S.answersLog.length && Math.random() < 0.5) body = dataLoadingLine();
    else body = pick(C.systemMessages);
    return { type: "loading", url: "boyfriend.exe/redirect", body: body };
  }

  function dataLoadingLine() {
    var logs = S.answersLog;
    var wrong = logs.filter(function (l) { return !l.correct; }).length;
    var pool = [
      "ANALYZED " + wrong + " WRONG ANSWER" + (wrong === 1 ? "" : "S") + "...",
      "PROCESSING " + logs.length + " DECISION" + (logs.length === 1 ? "" : "S") + " SO FAR...",
      "CROSS-REFERENCING YOUR MISTAKES...",
      "ESTIMATING BOYFRIEND DISAPPOINTMENT: " + Math.min(99, wrong * 7) + "%"
    ];
    return pick(pool);
  }

  var TAUNTS = [
    "Wrong. But cute that you tried.",
    "Incorrect. The boyfriend sighs.",
    "No. He would like a redo on this answer.",
    "That's not it. Try again, he believes in you (barely).",
    "Wrong again. The lore weeps quietly.",
    "Still wrong. At this point it's becoming a personality trait.",
    "Incorrect. The quiz is concerned for your relationship.",
    "Wrong. He has seen enough. Try again anyway.",
    "This is the wrongest you've been. So far.",
    "Another wrong answer. The boyfriend has been notified. Again."
  ];
  function wrongTaunt() {
    var anger = clamp(S.wrongAnswers + S.wrongStreak, 0, TAUNTS.length - 1);
    return TAUNTS[anger] || TAUNTS[TAUNTS.length - 1];
  }

  function streakPage() {
    var arr = C.correctReactions.streak;
    var i = S.currentStreak >= 15 ? 3 : S.currentStreak >= 10 ? 2 : S.currentStreak >= 5 ? 1 : 0;
    return arr[Math.min(i, arr.length - 1)];
  }

  function moodLabel() {
    var r = S.rage;
    if (r <= 25) return "CALM";
    if (r <= 50) return "IRRITATED";
    if (r <= 75) return "FUMING";
    if (r <= 90) return "UNSTABLE";
    if (r <= 99) return "CRITICAL";
    return "MELTDOWN";
  }

  function unlock(id) {
    if (S.achievements[id]) return;
    S.achievements[id] = true;
    var a = (C.achievements || []).filter(function (x) { return x.id === id; })[0];
    if (a && BEX.ui) BEX.ui.toast("ACHIEVEMENT: " + a.name);
  }

  function buildWrongPages(q, opt, dt) {
    var anger = clamp(S.wrongAnswers + S.wrongStreak, 0, 10);
    var pages = [loadingPage()];
    if (opt.reaction) {
      pages.push({ title: opt.reaction.title, body: opt.reaction.body });
    } else {
      var type = pickWrongType(anger);
      var arr = C.wrongReactions[type] || C.wrongScreens;
      pages.push(pick(arr));
      if (Math.random() < 0.5 && arr !== C.wrongScreens) pages.push(pick(arr));
    }
    if (dt != null) {
      if (dt < 2000) pages.push(pick(C.timing.fast));
      else if (dt > 20000) pages.push(pick(C.timing.slow));
    }
    if (S.wrongStreak >= 3) pages.push(pick(C.wrongStreak));
    // The more she gets wrong, the more unhinged it gets.
    if (anger >= 4) pages.push({ title: "ESCALATION " + anger, url: "boyfriend.exe/escalation",
      body: pick(C.escalation), btn: "CONTINUE" });
    pages.push({
      title: "ARE YOU SURE?", type: "choice", url: "boyfriend.exe/doubt",
      body: "That was wrong. Are you SURE it wasn't also wrong in a different way?"
    });
    var correct = q.options.filter(function (o) { return o.correct; })[0];
    pages.push({
      title: "ANSWER (SINCE YOU ASKED)", url: "boyfriend.exe/answer",
      body: "The correct answer was: <b>" + correct.text + "</b><br>" +
            "<span class='subtle'>Try to keep up.</span>",
      btn: "NEXT QUESTION"
    });
    pages.forEach(function (p) { p.tone = "bad"; });
    return pages;
  }

  function pickWrongType(anger) {
    // early: playful roasts; late: harsher conspiracy / punishment / drama.
    var pool = anger <= 2
      ? ["roast", "short", "fourthWall", "boyfriendReaction", "absurd", "dramatic"]
      : anger <= 5
      ? ["roast", "fakeError", "conspiracy", "punishment", "dramatic", "boyfriendReaction", "fakeTechnical"]
      : ["conspiracy", "punishment", "dramatic", "fakeTechnical", "absurd", "fakeError"];
    return pick(pool);
  }

  function buildCorrectPages(q, opt, extra, dt) {
    var pages = [loadingPage()];
    if (opt.reaction) {
      pages.push({ title: opt.reaction.title, body: opt.reaction.body });
    } else {
      var type;
      if (S.currentStreak === 3 || S.currentStreak === 5 ||
          S.currentStreak === 10 || S.currentStreak === 15) {
        type = "streak";
      } else {
        type = pick(CORRECT_TYPES);
      }
      if (type === "streak") {
        pages.push(streakPage());
      } else {
        var arr = C.correctReactions[type] || C.correctScreens;
        pages.push(pick(arr));
        if (Math.random() < 0.4) pages.push(pick(arr));
      }
    }
    if (dt != null && dt < 2000) pages.push(pick(C.timing.fast));
    if (extra) {
      pages.push({ title: "BY THE WAY", url: "boyfriend.exe/btw", body: extra, btn: "NOTED" });
    }
    pages.push({
      title: "CORRECT.", url: "boyfriend.exe/answer",
      body: (q.correctFeedback ? q.correctFeedback + "<br>" : "") +
            "<span class='subtle'>The boyfriend is mildly impressed. Try not to let it go to your head.</span>",
      btn: "NEXT QUESTION"
    });
    pages.forEach(function (p) { p.tone = "good"; });
    return pages;
  }

  function conspiracyD() {
    return "<p class='conspiracy-line'><b>WAIT.</b></p>" +
      "<p class='conspiracy-line'>Why have you selected <b>D</b> three times in a row?</p>" +
      "<p class='conspiracy-line'>Is this strategy?</p>" +
      "<p class='conspiracy-line'>Or do you simply know your boyfriend <i>way too well?</i></p>";
  }

  /* The D-pattern game mechanic: the more times she picks D, the more the
   * quiz becomes suspicious and calls it out. Triggers at key thresholds. */
  function dBlock() {
    var d = S.distribution;
    var max = Math.max(1, d.a, d.b, d.c, d.d);
    function bar(n) {
      return "█".repeat(Math.round(n / max * 8)) + "░".repeat(8 - Math.round(n / max * 8));
    }
    return "<pre>A " + bar(d.a) + " " + d.a + "\nB " + bar(d.b) + " " + d.b +
      "\nC " + bar(d.c) + " " + d.c + "\nD " + bar(d.d) + " " + d.d + "</pre>";
  }

  function dPatternPage() {
    var n = S.dCount;
    if (n === 3) return { title: "PATTERN DETECTED", tone: "bad",
      body: "You have selected <b>D</b> three times.<br><br>Interesting.", btn: "CONTINUE" };
    if (n === 5) return { title: "D-ANSWER FREQUENCY: HIGH", tone: "bad",
      body: "You have selected <b>D</b> five times.<br>There are other buttons.<br>We checked.", btn: "CONTINUE" };
    if (n === 8) return { title: "THIS IS NO LONGER A COINCIDENCE", tone: "bad",
      body: dBlock() + "<br><b>This is no longer a coincidence.</b>", btn: "CONTINUE" };
    if (n === 10) return { title: "WHAT ARE YOU DOING?", tone: "bad",
      body: "There are literally three other answers.<br>Are you: A) Guessing B) Psychic C) Cheating " +
            "D) Actually know your boyfriend way too well<br><br><i>The irony of this question is intentional.</i>",
      btn: "CONTINUE" };
    if (n === 13) return { title: "DISTRIBUTION TOO DENSE", tone: "bad",
      body: "D D D D D D D D D D D D D<br><br>ERROR<br>DISTRIBUTION TOO DENSE<br><br>" +
            "The quiz has developed a D-related concern.", btn: "CONTINUE" };
    if (n >= 15) return { title: "CRITICAL ANSWER PATTERN", tone: "bad",
      body: dBlock() + "<br><b>THIS IS NOT NORMAL.</b><br><br>" +
            "You aren't taking the quiz anymore.<br>You're just selecting D and hoping for the best.", btn: "CONTINUE" };
    return null;
  }

  function distributionAnalysis() {
    var d = S.distribution;
    var max = Math.max(1, d.a, d.b, d.c, d.d);
    function bar(n) {
      return "█".repeat(Math.round(n / max * 7)) + "░".repeat(7 - Math.round(n / max * 7));
    }
    return "<div class='distro'>" +
      "<p class='conspiracy-line'>ANSWER DISTRIBUTION ANALYSIS</p>" +
      "<p class='distro-row'>A: " + bar(d.a) + " " + d.a + "</p>" +
      "<p class='distro-row'>B: " + bar(d.b) + " " + d.b + "</p>" +
      "<p class='distro-row'>C: " + bar(d.c) + " " + d.c + "</p>" +
      "<p class='distro-row'>D: " + bar(d.d) + " " + d.d + "</p>" +
      "<p class='conspiracy-line'><b>This is statistically suspicious.</b></p>" +
      "</div>";
  }

  BEX.reactions = {
    loadingPage: loadingPage,
    streakPage: streakPage,
    moodLabel: moodLabel,
    unlock: unlock,
    buildWrongPages: buildWrongPages,
    buildCorrectPages: buildCorrectPages,
    conspiracyD: conspiracyD,
    distributionAnalysis: distributionAnalysis,
    wrongTaunt: wrongTaunt,
    dPatternPage: dPatternPage
  };
})(window);
