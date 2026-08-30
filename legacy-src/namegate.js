/* =============================================================================
 *  BOYFRIEND.EXE  —  src/namegate.js
 * -----------------------------------------------------------------------------
 *  The name gate. Only "Anuradha Sharma" is accepted (case-insensitive). Any
 *  other answer is its own little failure screen before the quiz even begins.
 * ========================================================================== */
(function (global) {
  "use strict";
  var BEX = global.BEX;
  var S = BEX.state;
  var $ = BEX.dom.$;
  var setStage = BEX.dom.setStage;

  function renderNameScreen() {
    setStage(
      '<div class="screen name-screen">' +
      '  <img class="logo" src="assets/images/logo.svg" alt="BOYFRIEND.EXE" />' +
      '  <div class="title-wrap">' +
      '    <img class="mascot" src="assets/images/mascot.svg" alt="" />' +
      '    <h1 class="big-title">HOW WELL DO YOU KNOW<br><span class="accent">YOUR BOYFRIEND?</span></h1>' +
      '  </div>' +
      '  <p class="subtle">Before we begin...</p>' +
      '  <label class="field-label" for="nameInput">ENTER YOUR NAME</label>' +
      '  <input id="nameInput" class="name-input" type="text" autocomplete="off" ' +
      '         placeholder="Anuradha" />' +
      '  <button id="continueBtn" class="btn btn-primary">CONTINUE</button>' +
      '  <p class="hint-line">tip: it is definitely not "guest".</p>' +
      '</div>'
    );
    var input = $("#nameInput");
    var btn = $("#continueBtn");
    input.focus();
    btn.addEventListener("click", function () { submitName(input.value); });
    input.addEventListener("keydown", function (e) {
      if (e.key === "Enter") submitName(input.value);
    });
  }

  function submitName(val) {
    var name = (val || "").trim();
    if (name === "") return emptyName();
    if (name.toLowerCase() === "anuradha") return identityVerified();
    return wrongName();
  }

  function identityVerified() {
    BEX.sfx("reveal");
    setStage(
      '<div class="screen verify-screen">' +
      '  <h2 class="ok"># IDENTITY VERIFIED</h2>' +
      '  <p>Finally.</p>' +
      '  <p>We can proceed.</p>' +
      '  <p>Welcome, Anuradha.</p>' +
      '  <p class="subtle">Let\'s see how well you actually know your boyfriend.</p>' +
      '  <button id="beginBtn" class="btn btn-danger">BEGIN THE SUFFERING</button>' +
      '</div>'
    );
    $("#beginBtn").addEventListener("click", BEX.flow.startGame);
  }

  function wrongName() {
    BEX.sfx("wrong");
    setStage(
      '<div class="screen fail-screen">' +
      '  <h2 class="bad"># INVALID GIRLFRIEND DETECTED</h2>' +
      '  <p>You have failed.</p>' +
      '  <p><b>THE QUIZ HASN\'T EVEN STARTED.</b></p>' +
      '  <p>We haven\'t asked you a single question.</p>' +
      '  <p>And somehow you\'ve already managed to get the first one wrong.</p>' +
      '  <p class="subtle">Incredible.</p>' +
      '  <ul class="stat-list">' +
      '    <li>Relationship knowledge: <b>0%</b></li>' +
      '    <li>Common sense: <b>under investigation</b></li>' +
      '    <li>Boyfriend knowledge: <b>catastrophic</b></li>' +
      '  </ul>' +
      '  <button id="retryBtn" class="btn">[ TRY AGAIN ]</button>' +
      '</div>'
    );
    $("#retryBtn").addEventListener("click", renderNameScreen);
  }

  function emptyName() {
    BEX.sfx("error");
    setStage(
      '<div class="screen fail-screen">' +
      '  <h2 class="bad"># YOU FORGOT YOUR OWN NAME.</h2>' +
      '  <p>We are approximately three seconds into this experience.</p>' +
      '  <p><b>0 questions answered.</b></p>' +
      '  <p><b>0% accuracy.</b></p>' +
      '  <p><b>100% failure rate.</b></p>' +
      '  <p class="subtle">This is genuinely impressive.</p>' +
      '  <button id="retryBtn" class="btn">[ ENTER YOUR NAME, GENIUS ]</button>' +
      '</div>'
    );
    $("#retryBtn").addEventListener("click", renderNameScreen);
  }

  BEX.namegate = {
    renderNameScreen: renderNameScreen,
    submitName: submitName,
    identityVerified: identityVerified,
    wrongName: wrongName,
    emptyName: emptyName
  };
})(window);
