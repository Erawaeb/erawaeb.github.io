// ERAWAEB — front-end interactions. No backend required.

(function () {
  "use strict";

  // Current year in footer
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Nav background on scroll
  var nav = document.getElementById("nav");
  function onScroll() {
    nav.classList.toggle("scrolled", window.scrollY > 24);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  // Reveal-on-scroll
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) { io.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  // Digest signup forms — client-side confirmation for now.
  // TODO: point the form's action at your Formspree/Buttondown endpoint and
  // remove e.preventDefault() so submissions actually post.
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  document.querySelectorAll(".digest-form").forEach(function (form) {
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = form.querySelector('input[type="email"]');
      var error = form.querySelector(".form-error");
      var value = (input.value || "").trim();

      if (!EMAIL_RE.test(value)) {
        error.hidden = false;
        form.classList.remove("shake");
        void form.offsetWidth; // restart shake animation
        form.classList.add("shake");
        input.focus();
        return;
      }

      var success = document.createElement("div");
      success.className = "form-success";
      success.setAttribute("role", "status");
      success.innerHTML =
        '<span class="check" aria-hidden="true">✓</span>' +
        "<p>You&rsquo;re on the list." +
        "<small>First issue lands tonight. Stay sharp.</small></p>";
      form.replaceWith(success);
    });
  });
})();
