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

  var mascotClickCount = 0;
  var mascotClickTimer = null;
  var mascotSpeechTimer = null;

  function getMascotMessages() {
    return (BEX.content && BEX.content.mascotMessages) || {
      idle: ["hey... do you even know me?", "the boyfriend is watching"],
      correct: ["see? i knew you could", "nice one!"],
      wrong: ["ugh... not like this", "the boyfriend is disappointed"],
      hint: ["i'll give you a little help", "think harder..."],
      end: ["we did it...", "the boyfriend is in awe"]
    };
  }

  function showMascotSpeech(category) {
    var bubble = $("#mascotBubble");
    if (!bubble) return;
    if (category === "cheat") {
      bubble.textContent = "You actually tried to cheat. I'm... impressed?";
      bubble.classList.add("show");
      if (mascotSpeechTimer) clearTimeout(mascotSpeechTimer);
      mascotSpeechTimer = setTimeout(function () { bubble.classList.remove("show"); }, 5000);
      return;
    }
    var messages = getMascotMessages();
    var arr = messages[category] || messages.idle;
    var msg = arr[Math.floor(Math.random() * arr.length)];
    bubble.textContent = msg;
    bubble.classList.add("show");
    if (mascotSpeechTimer) clearTimeout(mascotSpeechTimer);
    mascotSpeechTimer = setTimeout(function () {
      bubble.classList.remove("show");
    }, 4500);
  }

  function startMascotIdle() {
    if (mascotSpeechTimer) clearTimeout(mascotSpeechTimer);
    showMascotSpeech("idle");
    mascotSpeechTimer = setTimeout(startMascotIdle, 12000);
  }

  function stopMascotIdle() {
    if (mascotSpeechTimer) clearTimeout(mascotSpeechTimer);
    var bubble = $("#mascotBubble");
    if (bubble) bubble.classList.remove("show");
  }

  function handleMascotClick() {
    mascotClickCount++;
    if (mascotClickCount >= 5) {
      mascotClickCount = 0;
      if (mascotClickTimer) clearTimeout(mascotClickTimer);
      if (BEX.state) BEX.state.cheatUsed = true;
      BEX.sfx("glitch");
      showMascotSpeech("cheat");
      BEX.hud.toast("⚠️ CHEAT MODE: Score negated. The mascot is judging you.");
      return;
    }
    if (mascotClickTimer) clearTimeout(mascotClickTimer);
    mascotClickTimer = setTimeout(function () { mascotClickCount = 0; }, 1500);
  }

  function renderHud() {
    var hud = $("#hud");
    hud.style.display = "flex";
    var muted = !!(BEX.audio && BEX.audio.muted);
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
      '<div class="music-control" id="musicControl">' +
      '  <span class="hud-label">VIBE</span>' +
      '  <div class="music-row">' +
      '    <button id="musicPrevBtn" class="music-btn" type="button" aria-label="Previous music track">‹</button>' +
      '    <select id="musicSelect" class="music-select" aria-label="Choose background music"></select>' +
      '    <button id="musicNextBtn" class="music-btn" type="button" aria-label="Next music track">›</button>' +
      '  </div>' +
      '</div>' +
      '<button id="muteBtn" class="mute-btn" title="' + (muted ? "unmute" : "mute") + '" aria-label="' + (muted ? "Unmute all audio" : "Mute all audio") + '">' +
        (muted ? BEX.svg.mute : BEX.svg.sound) + '</button>' +
      '<div id="mascotFloat" class="mascot-float" title="Click me (5x for a surprise)">' +
      '  <img src="assets/images/mascot.svg" alt="Boyfriend mascot" />' +
      '  <div id="mascotBubble" class="mascot-bubble"></div>' +
      '</div>';
    $("#muteBtn").addEventListener("click", function () {
      var m = BEX.audio ? BEX.audio.toggleMute() : true;
      this.innerHTML = m ? BEX.svg.mute : BEX.svg.sound;
      this.title = m ? "unmute" : "mute";
      this.setAttribute("aria-label", m ? "Unmute all audio" : "Mute all audio");
      BEX.hud.toast(m ? "MUTED. All music and sound effects are off."
                     : "SOUND ON. Music and sound effects restored.");
    });
    $("#mascotFloat").addEventListener("click", handleMascotClick);
    bindMusicControls();
    updateHud();
    startMascotIdle();
  }

  function bindMusicControls() {
    var select = $("#musicSelect");
    var previous = $("#musicPrevBtn");
    var next = $("#musicNextBtn");
    var tracks = BEX.audio ? BEX.audio.getPlaylist() : [];
    if (!select || !tracks.length) {
      var control = $("#musicControl");
      if (control) control.style.display = "none";
      return;
    }

    select.innerHTML = tracks.map(function (track) {
      var label = track.artist ? track.title + " — " + track.artist : track.title;
      return '<option value="' + BEX.util.escapeHtml(track.id) + '">' + BEX.util.escapeHtml(label) + '</option>';
    }).join("");
    var current = BEX.audio.getCurrentTrack();
    if (current) select.value = current.id;
    select.addEventListener("change", function () {
      var track = BEX.audio.selectTrack(this.value);
      if (track) BEX.hud.toast("VIBE: " + BEX.util.escapeHtml(track.title));
    });
    previous.addEventListener("click", function () {
      var track = BEX.audio.previousTrack();
      if (track) { select.value = track.id; BEX.hud.toast("VIBE: " + BEX.util.escapeHtml(track.title)); }
    });
    next.addEventListener("click", function () {
      var track = BEX.audio.nextTrack();
      if (track) { select.value = track.id; BEX.hud.toast("VIBE: " + BEX.util.escapeHtml(track.title)); }
    });
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

  BEX.hud = { renderHud: renderHud, updateHud: updateHud, toast: toast, rageState: rageState, showMascotSpeech: showMascotSpeech, startMascotIdle: startMascotIdle, stopMascotIdle: stopMascotIdle };
  BEX.ui = { toast: toast };
})(window);
