/* ============================================================
   SSCRS — language switching, navigation, scroll reveal
   ============================================================ */

(function () {
  "use strict";

  /* --- Language ------------------------------------------------
     English lives in the HTML and is the default, so the page is
     complete before this runs. Switching to Arabic swaps the text
     and flips <html> to lang="ar" dir="rtl"; the stylesheet does
     the mirroring via logical properties.
     ------------------------------------------------------------ */

  var AR = window.SSCRS_AR || {};
  var root = document.documentElement;
  var EN = null;   // captured lazily, the first time we leave English

  function captureEnglish() {
    if (EN) return;
    EN = {};
    document.querySelectorAll("[data-i18n]").forEach(function (el) {
      EN[el.getAttribute("data-i18n")] = el.innerHTML;
    });
    document.querySelectorAll("[data-i18n-html]").forEach(function (el) {
      EN[el.getAttribute("data-i18n-html")] = el.innerHTML;
    });
    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      EN["aria:" + el.getAttribute("data-i18n-aria")] = el.getAttribute("aria-label");
    });
    document.querySelectorAll("[data-i18n-ph]").forEach(function (el) {
      EN["ph:" + el.getAttribute("data-i18n-ph")] = el.getAttribute("placeholder");
    });
    EN["doc.title"] = document.title;
    var desc = document.querySelector('meta[name="description"]');
    EN["doc.desc"] = desc ? desc.getAttribute("content") : "";
  }

  function applyLanguage(lang) {
    captureEnglish();
    var ar = lang === "ar";
    var dict = ar ? AR : EN;

    document.querySelectorAll("[data-i18n], [data-i18n-html]").forEach(function (el) {
      var key = el.getAttribute("data-i18n") || el.getAttribute("data-i18n-html");
      var value = dict[key];
      if (typeof value === "string") el.innerHTML = value;
    });

    document.querySelectorAll("[data-i18n-aria]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-aria");
      var value = ar ? AR[key] : EN["aria:" + key];
      if (typeof value === "string") el.setAttribute("aria-label", value);
    });

    document.querySelectorAll("[data-i18n-ph]").forEach(function (el) {
      var key = el.getAttribute("data-i18n-ph");
      var value = ar ? AR[key] : EN["ph:" + key];
      if (typeof value === "string") el.setAttribute("placeholder", value);
    });

    root.lang = ar ? "ar" : "en";
    root.dir = ar ? "rtl" : "ltr";

    if (dict["doc.title"]) document.title = dict["doc.title"];
    var desc = document.querySelector('meta[name="description"]');
    if (desc && dict["doc.desc"]) desc.setAttribute("content", dict["doc.desc"]);

    // The switch always offers the *other* language.
    document.querySelectorAll("[data-lang-label]").forEach(function (el) {
      el.textContent = ar ? "English" : "العربية";
    });

    try { localStorage.setItem("sscrs-lang", root.lang); } catch (e) {}

    // Modules loaded separately (chatbot.js) listen for this.
    document.dispatchEvent(new CustomEvent("sscrs:languagechange", { detail: { lang: root.lang } }));
  }

  document.addEventListener("DOMContentLoaded", function () {
    // The inline head script may already have set lang="ar" to avoid a
    // flash; apply the actual translations now that the DOM exists.
    if (root.lang === "ar") applyLanguage("ar");
    else applyLanguage("en");

    document.querySelectorAll("[data-lang-toggle]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyLanguage(root.lang === "ar" ? "en" : "ar");
        fitNav();
      });
    });

    /* --- Header elevation once the page scrolls -------------
       The header is sticky from the very top, so this keys off
       scroll position rather than the element's own offset.
       -------------------------------------------------------- */
    var header = document.querySelector("[data-header]");
    if (header) {
      var syncStuck = function () {
        header.classList.toggle("is-stuck", window.scrollY > 8);
      };
      window.addEventListener("scroll", syncStuck, { passive: true });
      syncStuck();
    }

    /* --- Keep the nav from colliding with the lockup ---------
       .nav-shell can shrink below its content width, and its links are
       nowrap, so when the row is tight the links spill out of their box
       and paint over the seal lockup. Measure what the nav actually
       needs and fold it into the hamburger when it will not fit. Doing
       this by measurement rather than a breakpoint keeps it correct in
       both languages, whose label widths differ a lot.
       -------------------------------------------------------- */
    var headerInner = document.querySelector(".header-inner");
    var lockup = document.querySelector(".site-header .lockup");
    var navShell = document.querySelector(".site-header .nav-shell");
    var headerActions = document.querySelector(".header-actions");
    var wideEnough = window.matchMedia("(min-width: 1081px)");

    function fitNav() {
      if (!header || !headerInner || !lockup || !navShell || !headerActions) return;
      // Below the CSS breakpoint the stylesheet already collapses the nav.
      if (!wideEnough.matches) { header.classList.remove("nav-collapsed"); return; }

      // Always measure from the expanded state, so the result cannot oscillate.
      header.classList.remove("nav-collapsed");
      var needed = 0;
      for (var i = 0; i < navShell.children.length; i++) {
        needed += navShell.children[i].offsetWidth;
      }
      var gap = parseFloat(getComputedStyle(headerInner).columnGap) || 0;
      var available = headerInner.clientWidth - lockup.offsetWidth
                    - headerActions.offsetWidth - gap * 2;
      if (needed > available) header.classList.add("nav-collapsed");
    }

    var fitTimer;
    window.addEventListener("resize", function () {
      clearTimeout(fitTimer);
      fitTimer = setTimeout(fitNav, 120);
    });
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(fitNav);
    fitNav();

    /* --- Mobile navigation ---------------------------------- */
    var menuToggle = document.querySelector("[data-menu-toggle]");
    var mobileNav = document.querySelector("[data-mobile-nav]");
    var mobileClose = document.querySelector("[data-menu-close]");

    if (menuToggle && mobileNav) {
      var openNav = function () {
        mobileNav.classList.add("is-open");
        mobileNav.setAttribute("aria-hidden", "false");
        menuToggle.setAttribute("aria-expanded", "true");
        document.body.style.overflow = "hidden";
        if (mobileClose) mobileClose.focus();
      };
      var closeNav = function () {
        mobileNav.classList.remove("is-open");
        mobileNav.setAttribute("aria-hidden", "true");
        menuToggle.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      };

      menuToggle.addEventListener("click", openNav);
      if (mobileClose) mobileClose.addEventListener("click", closeNav);
      document.querySelectorAll("[data-nav-link]").forEach(function (link) {
        link.addEventListener("click", closeNav);
      });
      document.addEventListener("keydown", function (e) {
        if (e.key === "Escape" && mobileNav.classList.contains("is-open")) {
          closeNav();
          menuToggle.focus();
        }
      });
    }

    /* --- Gallery: filtering + lightbox carousel --------------
       The lightbox navigates the *currently visible* set, so
       arrowing through a filtered view stays inside that filter.
       -------------------------------------------------------- */
    var galGrid = document.querySelector("[data-gallery]");
    if (galGrid) {
      var galItems = Array.prototype.slice.call(galGrid.querySelectorAll(".gal-item"));
      var galEmpty = document.querySelector("[data-gal-empty]");
      var lb = document.querySelector("[data-lightbox]");
      var lbImg = lb && lb.querySelector("[data-lb-img]");
      var lbCat = lb && lb.querySelector("[data-lb-cat]");
      var lbCap = lb && lb.querySelector("[data-lb-cap]");
      var lbI = lb && lb.querySelector("[data-lb-i]");
      var lbN = lb && lb.querySelector("[data-lb-n]");
      var visible = galItems.slice();
      var current = 0;
      var lastFocus = null;
      var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      /* Filtering ------------------------------------------- */
      function applyFilter(cat) {
        visible = [];
        galItems.forEach(function (item) {
          var match = cat === "all" || item.getAttribute("data-category") === cat;
          if (match) {
            visible.push(item);
            item.classList.remove("is-gone");
            void item.offsetWidth;         // flush layout so the fade-in runs
            item.classList.remove("is-filtered");
          } else {
            item.classList.add("is-filtered");
            if (reduce) item.classList.add("is-gone");
            else setTimeout(function () {
              if (item.classList.contains("is-filtered")) item.classList.add("is-gone");
            }, 380);
          }
        });
        if (galEmpty) galEmpty.hidden = visible.length > 0;
      }

      document.querySelectorAll(".gal-filter").forEach(function (btn) {
        btn.addEventListener("click", function () {
          document.querySelectorAll(".gal-filter").forEach(function (b) {
            b.classList.toggle("is-active", b === btn);
          });
          applyFilter(btn.getAttribute("data-filter"));
        });
      });

      /* Lightbox -------------------------------------------- */
      function render() {
        if (!visible.length) return;
        var item = visible[current];
        var img = item.querySelector("img");
        var cat = item.querySelector(".gal-cat");
        var cap = item.querySelector(".gal-cap");
        var swap = function () {
          lbImg.src = img.getAttribute("src");
          // Caption is read from the DOM each time, so it always
          // reflects the language currently selected.
          lbCat.textContent = cat ? cat.textContent : "";
          lbCap.textContent = cap ? cap.textContent : "";
          lbImg.alt = cap ? cap.textContent : "";
          lbI.textContent = current + 1;
          lbN.textContent = visible.length;
          lb.classList.remove("is-swapping");
        };
        if (reduce) { swap(); } else { lb.classList.add("is-swapping"); setTimeout(swap, 160); }
        // preload the neighbours so arrowing feels instant
        [current - 1, current + 1].forEach(function (n) {
          var neighbour = visible[(n + visible.length) % visible.length];
          if (neighbour) { var pre = new Image(); pre.src = neighbour.querySelector("img").src; }
        });
      }

      function openLb(item) {
        var idx = visible.indexOf(item);
        if (idx === -1) return;
        current = idx;
        lastFocus = document.activeElement;
        lb.hidden = false;
        void lb.offsetWidth;               // flush layout so the fade runs
        lb.classList.add("is-open");
        document.body.style.overflow = "hidden";
        render();
        var close = lb.querySelector("[data-lb-close]");
        if (close) close.focus();
      }
      function closeLb() {
        lb.classList.remove("is-open");
        setTimeout(function () { lb.hidden = true; }, reduce ? 0 : 260);
        document.body.style.overflow = "";
        if (lastFocus && lastFocus.focus) lastFocus.focus();
      }
      function step(delta) {
        if (!visible.length) return;
        current = (current + delta + visible.length) % visible.length;
        render();
      }

      galItems.forEach(function (item) {
        var trigger = item.querySelector("[data-gal-open]");
        if (trigger) trigger.addEventListener("click", function () { openLb(item); });
      });

      if (lb) {
        lb.querySelector("[data-lb-close]").addEventListener("click", closeLb);
        lb.querySelector("[data-lb-prev]").addEventListener("click", function () { step(-1); });
        lb.querySelector("[data-lb-next]").addEventListener("click", function () { step(1); });
        // click the backdrop (but not the image or controls) to dismiss
        lb.addEventListener("click", function (e) { if (e.target === lb) closeLb(); });

        document.addEventListener("keydown", function (e) {
          if (lb.hidden) return;
          if (e.key === "Escape") { closeLb(); }
          else if (e.key === "ArrowRight") { step(root.dir === "rtl" ? -1 : 1); }
          else if (e.key === "ArrowLeft") { step(root.dir === "rtl" ? 1 : -1); }
          else if (e.key === "Tab") {
            // keep focus inside the dialog
            var f = lb.querySelectorAll("button");
            var first = f[0], last = f[f.length - 1];
            if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
            else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
          }
        });

        // swipe
        var x0 = null;
        lb.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
        lb.addEventListener("touchend", function (e) {
          if (x0 === null) return;
          var dx = e.changedTouches[0].clientX - x0;
          if (Math.abs(dx) > 45) step(dx < 0 ? 1 : -1);
          x0 = null;
        }, { passive: true });
      }

      applyFilter("all");
    }

    /* --- Scroll reveal --------------------------------------
       The hidden state only applies while .js is on <html>, so if
       anything here fails the content is simply visible.
       -------------------------------------------------------- */
    var revealables = document.querySelectorAll(".reveal");
    var showAll = function () {
      revealables.forEach(function (el) { el.classList.add("is-visible"); });
    };
    var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (reduceMotion || !("IntersectionObserver" in window)) {
      showAll();
    } else {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

      revealables.forEach(function (el) { observer.observe(el); });

      // Safety net: if the observer never reports back, show everything.
      setTimeout(showAll, 2000);
    }
  });
})();
