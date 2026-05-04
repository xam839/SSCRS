// Splash — runs immediately, before DOMContentLoaded wait
(function () {
  const splash = document.getElementById("splash");
  if (!splash) return;

  // Prevent scrolling while splash is visible
  document.body.style.overflow = "hidden";

  // bar animation: 2.2s duration + 0.4s delay = 2.6s, add small buffer
  setTimeout(() => {
    splash.classList.add("splash-out");          // triggers CSS fade+scale transition
    setTimeout(() => {
      splash.classList.add("splash-gone");       // display:none removes it from layout
      document.body.style.overflow = "";         // restore scrolling
    }, 720);                                     // matches transition duration (0.7s)
  }, 2750);
})();

document.addEventListener("DOMContentLoaded", () => {
  const header     = document.querySelector("[data-header]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const mobileNav  = document.querySelector("[data-mobile-nav]");
  const mobileClose= document.querySelector("[data-menu-close]");
  const navLinks   = document.querySelectorAll("[data-nav-link]");

  // Scroll progress bar + header shadow
  const scrollBar = document.getElementById("scrollBar");
  window.addEventListener("scroll", () => {
    const scrolled = window.scrollY;
    const total = document.documentElement.scrollHeight - window.innerHeight;
    if (scrollBar) scrollBar.style.width = ((scrolled / total) * 100) + "%";
    header.style.boxShadow = scrolled > 10
      ? "0 4px 30px rgba(0,0,0,0.07)"
      : "none";
  }, { passive: true });

  // Mobile nav
  const openNav = () => {
    mobileNav.classList.add("is-open");
    mobileNav.setAttribute("aria-hidden", "false");
    menuToggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  };
  const closeNav = () => {
    mobileNav.classList.remove("is-open");
    mobileNav.setAttribute("aria-hidden", "true");
    menuToggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };

  menuToggle?.addEventListener("click", openNav);
  mobileClose?.addEventListener("click", closeNav);
  navLinks.forEach(link => link.addEventListener("click", closeNav));

  // Scroll reveal
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add("is-visible");
          observer.unobserve(e.target);
        }
      });
    },
    { threshold: 0.08, rootMargin: "0px 0px -40px 0px" }
  );

  document.querySelectorAll(".reveal").forEach(el => observer.observe(el));
});
