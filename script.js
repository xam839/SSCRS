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
  }

  document.addEventListener("DOMContentLoaded", function () {
    // The inline head script may already have set lang="ar" to avoid a
    // flash; apply the actual translations now that the DOM exists.
    if (root.lang === "ar") applyLanguage("ar");
    else applyLanguage("en");

    document.querySelectorAll("[data-lang-toggle]").forEach(function (btn) {
      btn.addEventListener("click", function () {
        applyLanguage(root.lang === "ar" ? "en" : "ar");
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
