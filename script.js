document.addEventListener("DOMContentLoaded", () => {
  const navRow     = document.querySelector("[data-nav-row]");
  const menuToggle = document.querySelector("[data-menu-toggle]");
  const mobileNav  = document.querySelector("[data-mobile-nav]");
  const mobileClose= document.querySelector("[data-menu-close]");
  const navLinks   = document.querySelectorAll("[data-nav-link]");

  // Shadow on the nav bar once it sticks to the top of the viewport.
  if (navRow) {
    const syncStuck = () => {
      navRow.classList.toggle("is-stuck", navRow.getBoundingClientRect().top <= 0);
    };
    window.addEventListener("scroll", syncStuck, { passive: true });
    syncStuck();
  }

  // Mobile navigation
  if (menuToggle && mobileNav) {
    const openNav = () => {
      mobileNav.classList.add("is-open");
      mobileNav.setAttribute("aria-hidden", "false");
      menuToggle.setAttribute("aria-expanded", "true");
      document.body.style.overflow = "hidden";
      mobileClose?.focus();
    };
    const closeNav = () => {
      mobileNav.classList.remove("is-open");
      mobileNav.setAttribute("aria-hidden", "true");
      menuToggle.setAttribute("aria-expanded", "false");
      document.body.style.overflow = "";
    };

    menuToggle.addEventListener("click", openNav);
    mobileClose?.addEventListener("click", closeNav);
    navLinks.forEach(link => link.addEventListener("click", closeNav));
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && mobileNav.classList.contains("is-open")) {
        closeNav();
        menuToggle.focus();
      }
    });
  }

  // Scroll reveal. The hidden state only ever applies while .js is on <html>,
  // so if anything here fails the content is simply visible — never blank.
  const revealables = document.querySelectorAll(".reveal");
  const showAll = () => revealables.forEach(el => el.classList.add("is-visible"));
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (reduceMotion || !("IntersectionObserver" in window)) {
    showAll();
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1, rootMargin: "0px 0px -40px 0px" }
    );
    revealables.forEach(el => observer.observe(el));

    // Safety net: if the observer never reports back, show everything anyway.
    setTimeout(showAll, 2000);
  }
});
