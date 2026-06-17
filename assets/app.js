/* ==========================================================================
   ELITE PREDICT PRO — Interactions & animations
   Vanilla JS, sans dépendance. Production-ready.
   ========================================================================== */
(function () {
  "use strict";

  /* ---------- Barre de progression scroll ---------- */
  var progress = document.getElementById("scroll-progress");
  var nav = document.querySelector(".nav");
  var backTop = document.getElementById("back-top");

  function onScroll() {
    var h = document.documentElement;
    var scrolled = h.scrollTop;
    var max = h.scrollHeight - h.clientHeight;
    var pct = max > 0 ? (scrolled / max) * 100 : 0;
    if (progress) progress.style.width = pct + "%";
    if (nav) nav.classList.toggle("scrolled", scrolled > 24);
    if (backTop) backTop.classList.toggle("show", scrolled > 560);
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  if (backTop) {
    backTop.addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ---------- Reveal au scroll (stagger en cascade) ---------- */
  var revealEls = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
  function revealEl(el) {
    if (el.classList.contains("in")) return;
    var delay = parseInt(el.getAttribute("data-delay") || "0", 10);
    setTimeout(function () { el.classList.add("in"); }, delay);
  }
  function checkReveals() {
    var vh = window.innerHeight || document.documentElement.clientHeight;
    for (var i = revealEls.length - 1; i >= 0; i--) {
      var el = revealEls[i];
      var r = el.getBoundingClientRect();
      if (r.top < vh * 0.92 && r.bottom > 0) {
        revealEl(el);
        revealEls.splice(i, 1);
      }
    }
  }
  if ("IntersectionObserver" in window) {
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) {
          revealEl(e.target);
          var k = revealEls.indexOf(e.target);
          if (k > -1) revealEls.splice(k, 1);
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -8% 0px" });
    revealEls.slice().forEach(function (el) { io.observe(el); });
  }
  window.addEventListener("scroll", checkReveals, { passive: true });
  window.addEventListener("resize", checkReveals);
  window.addEventListener("load", checkReveals);
  checkReveals();
  function safetyReveal() {
    var vh = window.innerHeight || document.documentElement.clientHeight;
    document.querySelectorAll(".reveal:not(.in)").forEach(function (el) {
      var r = el.getBoundingClientRect();
      if (r.top < vh * 1.1) el.classList.add("in");
    });
  }
  setTimeout(safetyReveal, 1600);
  setTimeout(function () {
    if (document.querySelectorAll(".reveal.in").length < 3) {
      document.querySelectorAll(".reveal").forEach(function (el) { el.classList.add("in"); });
    }
  }, 2600);

  /* ---------- Compteurs animés (count-up) ---------- */
  function animateCount(el) {
    var target = parseFloat(el.getAttribute("data-count"));
    var decimals = parseInt(el.getAttribute("data-decimals") || "0", 10);
    var suffix = el.getAttribute("data-suffix") || "";
    var prefix = el.getAttribute("data-prefix") || "";
    var dur = 1700;
    var start = performance.now();
    function tick(now) {
      var p = Math.min((now - start) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3);
      var val = target * eased;
      el.textContent = prefix + val.toLocaleString("fr-FR", {
        minimumFractionDigits: decimals, maximumFractionDigits: decimals
      }) + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = prefix + target.toLocaleString("fr-FR", {
        minimumFractionDigits: decimals, maximumFractionDigits: decimals
      }) + suffix;
    }
    requestAnimationFrame(tick);
  }

  var counters = document.querySelectorAll("[data-count]");
  if ("IntersectionObserver" in window) {
    var cio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateCount(e.target); cio.unobserve(e.target); }
      });
    }, { threshold: 0.5 });
    counters.forEach(function (el) { cio.observe(el); });
  } else {
    counters.forEach(animateCount);
  }

  /* ---------- Barres de confiance / performance animées ---------- */
  function animateBars(scope) {
    scope.querySelectorAll("[data-fill]").forEach(function (el) {
      el.style.width = el.getAttribute("data-fill") + "%";
    });
    scope.querySelectorAll("[data-height]").forEach(function (el) {
      el.style.height = el.getAttribute("data-height") + "%";
    });
  }
  if ("IntersectionObserver" in window) {
    var bio = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { animateBars(e.target); bio.unobserve(e.target); }
      });
    }, { threshold: 0.25 });
    document.querySelectorAll("[data-bars]").forEach(function (el) { bio.observe(el); });
  } else {
    animateBars(document);
  }

  /* ---------- Particules flottantes (hero) ---------- */
  var pField = document.querySelector(".particles");
  if (pField && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    var COLORS = ["#D4AF37", "#3B82F6", "#F0D060", "#60A5FA"];
    for (var i = 0; i < 26; i++) {
      var p = document.createElement("span");
      p.className = "particle";
      p.style.left = Math.random() * 100 + "%";
      p.style.top = (60 + Math.random() * 40) + "%";
      p.style.background = COLORS[i % COLORS.length];
      p.style.boxShadow = "0 0 8px " + COLORS[i % COLORS.length];
      var size = 2 + Math.random() * 3;
      p.style.width = size + "px"; p.style.height = size + "px";
      p.style.animationDuration = (7 + Math.random() * 9) + "s";
      p.style.animationDelay = (Math.random() * 9) + "s";
      pField.appendChild(p);
    }
  }

  /* ---------- Recherche overlay ---------- */
  var searchOverlay = document.getElementById("search-overlay");
  var searchInput = document.getElementById("search-input");
  function openSearch() {
    if (!searchOverlay) return;
    searchOverlay.classList.add("open");
    setTimeout(function () { searchInput && searchInput.focus(); }, 60);
  }
  function closeSearch() { searchOverlay && searchOverlay.classList.remove("open"); }
  document.querySelectorAll("[data-open-search]").forEach(function (b) {
    b.addEventListener("click", openSearch);
  });
  if (searchOverlay) {
    searchOverlay.addEventListener("click", function (e) {
      if (e.target === searchOverlay) closeSearch();
    });
  }
  document.addEventListener("keydown", function (e) {
    if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); openSearch(); }
    if (e.key === "Escape") closeSearch();
  });

  /* ---------- Carrousel de témoignages ---------- */
  var track = document.getElementById("testi-track");
  var prevBtn = document.getElementById("testi-prev");
  var nextBtn = document.getElementById("testi-next");
  if (track) {
    var idx = 0;
    function perView() { return window.innerWidth <= 768 ? 1 : (window.innerWidth <= 1024 ? 2 : 3); }
    function maxIdx() { return Math.max(0, track.children.length - perView()); }
    function go() {
      idx = Math.max(0, Math.min(idx, maxIdx()));
      var card = track.children[0];
      var gap = 22;
      var step = card.getBoundingClientRect().width + gap;
      track.style.transform = "translateX(" + (-idx * step) + "px)";
    }
    nextBtn && nextBtn.addEventListener("click", function () { idx = idx >= maxIdx() ? 0 : idx + 1; go(); });
    prevBtn && prevBtn.addEventListener("click", function () { idx = idx <= 0 ? maxIdx() : idx - 1; go(); });
    window.addEventListener("resize", go);
    var auto = setInterval(function () { idx = idx >= maxIdx() ? 0 : idx + 1; go(); }, 5500);
    track.parentElement.addEventListener("mouseenter", function () { clearInterval(auto); });
  }

  /* ---------- Toast notifications ---------- */
  var toastWrap = document.getElementById("toasts");
  var CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
  function toast(msg) {
    if (!toastWrap) return;
    var t = document.createElement("div");
    t.className = "toast";
    t.innerHTML = '<span class="tk">' + CHECK + '</span><span>' + msg + '</span>';
    toastWrap.appendChild(t);
    setTimeout(function () {
      t.classList.add("out");
      setTimeout(function () { t.remove(); }, 360);
    }, 2800);
  }
  window.eppToast = toast;

  document.querySelectorAll("[data-fav]").forEach(function (b) {
    b.addEventListener("click", function (e) {
      e.preventDefault();
      var active = b.classList.toggle("active");
      toast(active ? "✓ Pronostic ajouté aux favoris" : "Retiré des favoris");
    });
  });
  document.querySelectorAll("[data-toast]").forEach(function (b) {
    b.addEventListener("click", function (e) {
      e.preventDefault();
      toast(b.getAttribute("data-toast"));
    });
  });

  /* ---------- Newsletter ---------- */
  var nlForm = document.getElementById("newsletter");
  if (nlForm) {
    nlForm.addEventListener("submit", function (e) {
      e.preventDefault();
      toast("✓ Inscription à la newsletter confirmée");
      nlForm.reset();
    });
  }

  /* ---------- Année footer ---------- */
  var yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

})();
