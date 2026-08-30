/* =============================================================================
 *  BOYFRIEND.EXE  —  src/redirect.js
 * -----------------------------------------------------------------------------
 *  Full-screen fake "redirect" pages (not popups). A chain is an array of
 *  page objects; the last page's button advances the flow. Loading pages auto
 *  advance after a beat. Choice pages can splice in extra pages. Closable
 *  "windows" trap the user for comedic effect.
 * ========================================================================== */
(function (global) {
  "use strict";
  var BEX = global.BEX;
  var S = BEX.state;

  function runRedirectChain(pages, onDone) {
    BEX.sfx("glitch");
    var layer = document.createElement("div");
    layer.className = "redirect-layer";
    BEX.dom.fx().appendChild(layer);

    function render(i) {
      if (i >= pages.length) return done();
      var p = pages[i];
      layer.innerHTML = redirectHTML(p);
      if (p.type === "loading") {
        BEX.sfx("tense");
        setTimeout(function () { render(i + 1); }, 950);
        return;
      }
      var cont = layer.querySelector('[data-act="next"]');
      if (cont) cont.addEventListener("click", function () {
        BEX.sfx("click");
        if (i === pages.length - 1) done(); else render(i + 1);
      });
      var yes = layer.querySelector('[data-act="yes"]');
      var no = layer.querySelector('[data-act="no"]');
      if (yes) yes.addEventListener("click", function () { BEX.sfx("click"); render(i + 1); });
      if (no) no.addEventListener("click", function () {
        BEX.sfx("click");
        pages.splice(i + 1, 0, smugPage());
        render(i + 1);
      });
      var close = layer.querySelector('[data-act="close"]');
      if (close) close.addEventListener("click", function () {
        BEX.sfx("wrong");
        pages.splice(i + 1, 0, cantClosePage());
        render(i + 1);
      });
    }
    function done() {
      if (layer.parentNode) layer.parentNode.removeChild(layer);
      if (onDone) onDone();
    }
    render(0);
  }

  function redirectHTML(p) {
    var tone = p.tone ? " " + p.tone : "";
    return '<div class="redirect-window' + (p.type === "loading" ? " loading" : "") + tone + '">' +
        '<div class="redirect-bar">' +
          '<span class="dots"><i></i><i></i><i></i></span>' +
          '<span class="redirect-url">' + p.url + '</span>' +
          '<button class="redirect-x" data-act="close" title="close" aria-label="close">' +
            BEX.svg.close + '</button>' +
        '</div>' +
        '<div class="redirect-body">' +
          (p.title ? '<h2 class="redirect-title">' + p.title + '</h2>' : '') +
          '<div class="redirect-text">' + p.body + '</div>' +
          (p.type === "choice"
            ? '<div class="redirect-choice"><button class="btn btn-ghost" data-act="yes">YES</button>' +
              '<button class="btn btn-ghost" data-act="no">NO</button></div>'
            : (p.type !== "loading"
              ? '<button class="btn btn-primary" data-act="next">' + (p.btn || "CONTINUE") + '</button>'
              : '<div class="spinner"></div>')) +
        '</div>' +
      '</div>';
  }

  function smugPage() {
    return { title: "CORRECT DECISION.", url: "boyfriend.exe/doubt/resolved",
      body: "You admitted you weren't sure. The quiz respects this. <span class='subtle'>The quiz is lying.</span>",
      btn: "CONTINUE" };
  }
  function cantClosePage() {
    return { title: "YOU CAN'T CLOSE THIS.", url: "boyfriend.exe/trapped",
      body: "There is no escape from being wrong. Keep going.", btn: "FINE" };
  }

  function fireTwist(id, done) {
    var t = BEX.content.plotTwists[id];
    if (!t) { done(); return; }
    runRedirectChain([{
      title: t.title, url: "boyfriend.exe/twist/" + id, body: t.body, btn: "CONTINUE THE NIGHTMARE"
    }], done);
  }

  BEX.redirect = {
    runRedirectChain: runRedirectChain,
    redirectHTML: redirectHTML,
    smugPage: smugPage,
    cantClosePage: cantClosePage,
    fireTwist: fireTwist
  };
})(window);
