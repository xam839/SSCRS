/* ============================================================
   SSCRS — events strip
   الفعاليات والندوات

   The home page's "Coming up" strip is rendered from the list
   below, so a new poster is a new entry here — no markup to edit.
   Posters are portrait (3:4). Titles and dates are given in both
   languages because the strip re-renders when the language changes.

   PLACEHOLDERS: every entry below is invented for layout review.
   Replace with the society's real events and poster artwork.
   ============================================================ */

window.SSCRS_EVENTS = [
  {
    id: "forum-2026",
    kind: { en: "Annual Forum", ar: "الملتقى السنوي" },
    title: { en: "SSCRS Annual Forum 2026", ar: "الملتقى السنوي للجمعية ٢٠٢٦" },
    when: { en: "15–17 April 2026 · Riyadh", ar: "١٥–١٧ أبريل ٢٠٢٦ · الرياض" },
    poster: "events/forum-2026.jpg",
    href: "index.html#news"
  },
  {
    id: "webinar-screening",
    kind: { en: "Webinar", ar: "ندوة إلكترونية" },
    title: { en: "National screening guidelines explained", ar: "شرح الأدلة الوطنية للفحص المبكر" },
    when: { en: "Online · date to be announced", ar: "عبر الإنترنت · الموعد يُعلن لاحقًا" },
    poster: "events/webinar-screening.jpg",
    href: "index.html#news"
  },
  {
    id: "workshop-laparoscopic",
    kind: { en: "Workshop", ar: "ورشة عمل" },
    title: { en: "Advanced laparoscopic colorectal skills", ar: "مهارات جراحة القولون والمستقيم بالمنظار المتقدمة" },
    when: { en: "Hands-on · Riyadh", ar: "تدريب عملي · الرياض" },
    poster: "events/workshop-laparoscopic.jpg",
    href: "index.html#news"
  },
  {
    id: "awareness-march",
    kind: { en: "Campaign", ar: "حملة" },
    title: { en: "Colorectal Cancer Awareness Month", ar: "شهر التوعية بسرطان القولون والمستقيم" },
    when: { en: "March · Kingdom-wide", ar: "مارس · في أنحاء المملكة" },
    poster: "events/awareness-march.jpg",
    href: "awareness.html"
  },
  {
    id: "fellowship-2026",
    kind: { en: "Fellowship", ar: "زمالة" },
    title: { en: "Fellowship programme — 2026 intake", ar: "برنامج الزمالة — دفعة ٢٠٢٦" },
    when: { en: "Applications open", ar: "باب التقديم مفتوح" },
    poster: "events/fellowship-2026.jpg",
    href: "index.html#news"
  }
];

(function () {
  "use strict";

  document.addEventListener("DOMContentLoaded", function () {
    var track = document.querySelector("[data-events]");
    if (!track) return;

    var root = document.documentElement;
    var prevBtn = document.querySelector("[data-ev-prev]");
    var nextBtn = document.querySelector("[data-ev-next]");
    var viewport = track.closest(".ev-viewport");
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var data = window.SSCRS_EVENTS || [];

    function lang() { return root.lang === "ar" ? "ar" : "en"; }

    function esc(s) {
      return String(s).replace(/[&<>"]/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
      });
    }

    function render() {
      var l = lang();
      track.innerHTML = data.map(function (e) {
        return '<a class="ev-card" href="' + esc(e.href) + '">' +
          '<span class="ev-poster"><img src="' + esc(e.poster) + '" alt="" width="720" height="960" loading="lazy" decoding="async"></span>' +
          '<span class="ev-body">' +
            '<span class="ev-kind">' + esc(e.kind[l]) + '</span>' +
            '<span class="ev-title">' + esc(e.title[l]) + '</span>' +
            '<span class="ev-when">' + esc(e.when[l]) + '</span>' +
          '</span></a>';
      }).join("");
      track.scrollLeft = 0;
      sync();
    }

    /* --- scrolling: same conventions as the gallery ---------------
       RTL scrollLeft runs negative from 0; smooth may be inert in
       some engines, so each move is redone outright if it did not
       take. "auto" is not instant (it defers to CSS), hence the
       explicit "instant". --------------------------------------- */
    function maxScroll() { return Math.max(0, track.scrollWidth - track.clientWidth); }

    function sync() {
      var pos = Math.abs(track.scrollLeft), max = maxScroll();
      if (prevBtn) prevBtn.disabled = pos <= 2;
      if (nextBtn) nextBtn.disabled = pos >= max - 2;
    }

    function move(opts) {
      var before = track.scrollLeft;
      var instant = Object.assign({}, opts, { behavior: "instant" });
      if (reduce) { track.scrollBy(instant); return; }
      track.scrollBy(Object.assign({}, opts, { behavior: "smooth" }));
      setTimeout(function () {
        if (Math.abs(track.scrollLeft - before) < 1) track.scrollBy(instant);
      }, 500);
    }
    function step(dir) {
      var amount = Math.max(240, track.clientWidth * 0.8);
      move({ left: dir * amount * (root.dir === "rtl" ? -1 : 1) });
    }
    function toStart() {
      var before = track.scrollLeft;
      if (reduce) { track.scrollTo({ left: 0, behavior: "instant" }); return; }
      track.scrollTo({ left: 0, behavior: "smooth" });
      setTimeout(function () {
        if (Math.abs(track.scrollLeft - before) < 1) track.scrollTo({ left: 0, behavior: "instant" });
      }, 500);
    }

    if (prevBtn) prevBtn.addEventListener("click", function () { stopAuto(); step(-1); });
    if (nextBtn) nextBtn.addEventListener("click", function () { stopAuto(); step(1); });
    track.addEventListener("scroll", sync, { passive: true });
    window.addEventListener("resize", sync);
    track.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); step(root.dir === "rtl" ? -1 : 1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); step(root.dir === "rtl" ? 1 : -1); }
    });

    /* --- autoplay: pauses when anyone is using it ---------------- */
    var timer = null, AUTO_MS = 4000;
    function tick() {
      var max = maxScroll();
      if (max <= 0) return;
      if (Math.abs(track.scrollLeft) >= max - 2) toStart(); else step(1);
    }
    function startAuto() { if (reduce || timer) return; timer = setInterval(tick, AUTO_MS); }
    function stopAuto() { if (timer) { clearInterval(timer); timer = null; } }
    if (viewport) {
      ["mouseenter", "focusin", "touchstart", "pointerdown"].forEach(function (ev) {
        viewport.addEventListener(ev, stopAuto, { passive: true });
      });
      ["mouseleave", "focusout"].forEach(function (ev) { viewport.addEventListener(ev, startAuto); });
    }
    document.addEventListener("visibilitychange", function () {
      document.hidden ? stopAuto() : startAuto();
    });

    document.addEventListener("sscrs:languagechange", render);
    render();
    startAuto();
  });
})();
