// ERAWAEB — front-end interactions. No backend required.
// Newsletter forms POST natively to Buttondown; nothing here intercepts them.

(function () {
  "use strict";

  // Current year in footer
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Nav background on scroll
  var nav = document.getElementById("nav");
  if (nav) {
    function onScroll() {
      nav.classList.toggle("scrolled", window.scrollY > 24);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  // Reveal-on-scroll, with a gentle stagger for grouped siblings.
  // The delay is cleared after the reveal so hover transitions stay snappy.
  var revealEls = document.querySelectorAll(".reveal");
  var seenParents = [];
  revealEls.forEach(function (el) {
    var p = el.parentElement;
    var idx = seenParents.indexOf(p);
    if (idx === -1) { seenParents.push(p); idx = seenParents.length - 1; }
    var n = 0;
    for (var i = 0; i < p.children.length; i++) {
      if (p.children[i] === el) break;
      if (p.children[i].classList && p.children[i].classList.contains("reveal")) n++;
    }
    if (n > 0) el.style.transitionDelay = Math.min(n * 70, 350) + "ms";
  });
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
            setTimeout(function () { entry.target.style.transitionDelay = ""; }, 900);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }
  // Reading progress bar — only on long-form pages (digest entries, guides).
  var article = document.querySelector("article.issue, .prose");
  if (article) {
    var bar = document.createElement("div");
    bar.className = "read-progress";
    bar.setAttribute("aria-hidden", "true");
    var fill = document.createElement("i");
    bar.appendChild(fill);
    document.body.appendChild(bar);
    var doc = document.documentElement;
    function onProgress() {
      var max = doc.scrollHeight - doc.clientHeight;
      var p = max > 0 ? (doc.scrollTop || document.body.scrollTop) / max : 0;
      fill.style.transform = "scaleX(" + Math.min(Math.max(p, 0), 1) + ")";
    }
    window.addEventListener("scroll", onProgress, { passive: true });
    window.addEventListener("resize", onProgress);
    onProgress();
  }
})();
