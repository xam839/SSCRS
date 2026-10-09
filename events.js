/* ============================================================
   SSCRS — hero news & events slider
   أخبار وفعاليات الصفحة الرئيسية

   The rotating panel beside the logo on the home page is rendered
   from the list below, so a new announcement is a new entry — no
   markup to edit. Images are posters or photos, shown edge to edge
   behind the text, so pick ones that read well with a dark overlay.
   Everything is given in both languages because the slider
   re-renders when the language changes.

   PLACEHOLDERS: every entry below is invented for layout review.
   Replace with the society's real announcements and artwork.
   ============================================================ */

window.SSCRS_EVENTS = [
  {
    id: "forum-2026",
    kind:  { en: "Annual Forum",             ar: "الملتقى السنوي" },
    title: { en: "SSCRS Annual Forum 2026 — registration is open",
             ar: "الملتقى السنوي للجمعية ٢٠٢٦ — التسجيل مفتوح" },
    when:  { en: "15–17 April 2026 · Riyadh", ar: "١٥–١٧ أبريل ٢٠٢٦ · الرياض" },
    image: "events/forum-2026.jpg",
    href:  "index.html#news"
  },
  {
    id: "webinar-screening",
    kind:  { en: "Webinar",                  ar: "ندوة إلكترونية" },
    title: { en: "The national screening guidelines, explained",
             ar: "الأدلة الوطنية للفحص المبكر — شرح مبسّط" },
    when:  { en: "Online · date to be announced", ar: "عبر الإنترنت · الموعد يُعلن لاحقًا" },
    image: "events/webinar-screening.jpg",
    href:  "index.html#news"
  },
  {
    id: "workshop-laparoscopic",
    kind:  { en: "Workshop",                 ar: "ورشة عمل" },
    title: { en: "Advanced laparoscopic colorectal skills",
             ar: "مهارات جراحة القولون والمستقيم بالمنظار المتقدمة" },
    when:  { en: "Hands-on · Riyadh",        ar: "تدريب عملي · الرياض" },
    image: "events/workshop-laparoscopic.jpg",
    href:  "index.html#news"
  },
  {
    id: "awareness-march",
    kind:  { en: "Campaign",                 ar: "حملة" },
    title: { en: "Colorectal Cancer Awareness Month",
             ar: "شهر التوعية بسرطان القولون والمستقيم" },
    when:  { en: "March · Kingdom-wide",     ar: "مارس · في أنحاء المملكة" },
    image: "events/awareness-march.jpg",
    href:  "education.html#education"
  },
  {
    id: "fellowship-2026",
    kind:  { en: "Fellowship",               ar: "زمالة" },
    title: { en: "Fellowship programme — 2026 intake now open",
             ar: "برنامج الزمالة — فتح باب التقديم لدفعة ٢٠٢٦" },
    when:  { en: "Applications open",        ar: "باب التقديم مفتوح" },
    image: "events/fellowship-2026.jpg",
    href:  "index.html#news"
  }
];

(function () {
  "use strict";

  var CTA = { en: "Learn more", ar: "اعرف المزيد" };
  var OF  = { en: "of", ar: "من" };

  document.addEventListener("DOMContentLoaded", function () {
    var slider = document.querySelector("[data-hero-slider]");
    if (!slider) return;

    var root = document.documentElement;
    var slidesEl = slider.querySelector("[data-hs-slides]");
    var dotsEl = slider.querySelector("[data-hs-dots]");
    var prevBtn = slider.querySelector("[data-hs-prev]");
    var nextBtn = slider.querySelector("[data-hs-next]");
    var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var data = window.SSCRS_EVENTS || [];
    var index = 0;
    var timer = null;
    var AUTO_MS = 5500;

    function lang() { return root.lang === "ar" ? "ar" : "en"; }
    function esc(v) {
      return String(v).replace(/[&<>"]/g, function (c) {
        return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c];
      });
    }

    function render() {
      var l = lang();
      slidesEl.innerHTML = data.map(function (e, i) {
        return '<article class="hs-slide' + (i === index ? " is-active" : "") + '" role="group" ' +
          'aria-roledescription="slide" aria-label="' + (i + 1) + " " + OF[l] + " " + data.length + '"' +
          (i === index ? "" : ' aria-hidden="true"') + ">" +
          '<img class="hs-img" src="' + esc(e.image) + '" alt="" ' + (i === 0 ? "" : 'loading="lazy" ') + 'decoding="async">' +
          '<div class="hs-body">' +
            '<span class="hs-kind">' + esc(e.kind[l]) + "</span>" +
            '<h2 class="hs-title">' + esc(e.title[l]) + "</h2>" +
            '<p class="hs-when">' + esc(e.when[l]) + "</p>" +
            '<a class="btn btn-green hs-cta" href="' + esc(e.href) + '"' + (i === index ? "" : ' tabindex="-1"') + ">" + CTA[l] + "</a>" +
          "</div></article>";
      }).join("");

      dotsEl.innerHTML = data.map(function (e, i) {
        return '<button type="button" role="tab" class="hs-dot' + (i === index ? " is-active" : "") + '" ' +
          'aria-selected="' + (i === index) + '" aria-label="' + esc(e.kind[l]) + '" data-go="' + i + '"></button>';
      }).join("");
    }

    function show(n) {
      index = (n + data.length) % data.length;
      var slides = slidesEl.children, dots = dotsEl.children;
      for (var i = 0; i < slides.length; i++) {
        var on = i === index;
        slides[i].classList.toggle("is-active", on);
        if (on) slides[i].removeAttribute("aria-hidden"); else slides[i].setAttribute("aria-hidden", "true");
        var cta = slides[i].querySelector(".hs-cta");
        if (cta) { if (on) cta.removeAttribute("tabindex"); else cta.setAttribute("tabindex", "-1"); }
        if (dots[i]) { dots[i].classList.toggle("is-active", on); dots[i].setAttribute("aria-selected", on); }
      }
    }

    // In RTL the "next" arrow sits on the left and should still mean
    // "the following slide"; direction of travel is logical, not visual.
    function next() { show(index + 1); }
    function prev() { show(index - 1); }

    function startAuto() { if (reduce || timer || data.length < 2) return; timer = setInterval(next, AUTO_MS); }
    function stopAuto() { if (timer) { clearInterval(timer); timer = null; } }
    function restartAuto() { stopAuto(); startAuto(); }

    if (prevBtn) prevBtn.addEventListener("click", function () { prev(); restartAuto(); });
    if (nextBtn) nextBtn.addEventListener("click", function () { next(); restartAuto(); });
    dotsEl.addEventListener("click", function (e) {
      var b = e.target.closest("[data-go]");
      if (b) { show(+b.getAttribute("data-go")); restartAuto(); }
    });
    slider.addEventListener("keydown", function (e) {
      if (e.key === "ArrowRight") { e.preventDefault(); root.dir === "rtl" ? prev() : next(); restartAuto(); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); root.dir === "rtl" ? next() : prev(); restartAuto(); }
    });

    ["mouseenter", "focusin", "touchstart"].forEach(function (ev) {
      slider.addEventListener(ev, stopAuto, { passive: true });
    });
    ["mouseleave", "focusout"].forEach(function (ev) { slider.addEventListener(ev, startAuto); });
    document.addEventListener("visibilitychange", function () { document.hidden ? stopAuto() : startAuto(); });

    // swipe
    var x0 = null;
    slider.addEventListener("touchstart", function (e) { x0 = e.touches[0].clientX; }, { passive: true });
    slider.addEventListener("touchend", function (e) {
      if (x0 === null) return;
      var dx = e.changedTouches[0].clientX - x0; x0 = null;
      if (Math.abs(dx) < 45) return;
      var forward = dx < 0;                       // swipe left = forward in LTR
      if (root.dir === "rtl") forward = !forward;
      forward ? next() : prev(); restartAuto();
    }, { passive: true });

    document.addEventListener("sscrs:languagechange", function () { render(); });

    render();
    startAuto();

    window.SSCRS_SLIDER = { show: show, next: next, prev: prev, get index() { return index; } };
  });
})();
