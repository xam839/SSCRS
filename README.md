# SSCRS — Saudi Society of Colon & Rectal Surgery

Official website of the Saudi Society of Colon & Rectal Surgery (SSCRS) —
الجمعية السعودية لجراحة القولون والمستقيم — built as a fully static site for GitHub Pages.

## Live Site

> **[https://\<your-username\>.github.io/SSCRS/](https://github.com)**
> Replace this URL once GitHub Pages is enabled.

---

## Design

The design is built around the society seal. The palette is sampled directly from it —
navy `#1B4C93` from the inner disc, green `#4E9E37` from the palm and swords — so the page
and the emblem read as one identity rather than two.

Principles the stylesheet holds to:

- **The seal leads.** It appears at seven sizes across the page: the header lockup (70px),
  the hero (168px), the about plate (148px), the footer (88px), a compact mark in the sticky
  nav bar, and as a low-opacity watermark behind the hero and the statistics band.
- **Bilingual identity.** The Arabic society name sits above the English one in the header,
  hero, about plate, and footer, set in Noto Kufi Arabic. Dual dating (2009 / 1430H) is shown
  throughout.
- **Hairlines, not shadows.** Sections are separated by 1px rules and grid dividers.
  Border radius never exceeds 3px. There is one box-shadow in the entire stylesheet.
- **Restrained motion.** A single 450ms fade-up on scroll, and nothing at all under
  `prefers-reduced-motion`.

## Sections

| Section | Description |
|---|---|
| Utility bar | Arabic name, contact, member login, language switch |
| Identity bar | Seal lockup with bilingual name, forum flag, join CTA |
| Navigation | Sticky primary nav; compact seal appears once stuck |
| Hero | Identity statement — seal, bilingual name, est. 2009 · 1430H |
| At a glance | Four-column strip of current links |
| About | Society history, seal plate, and four pillars |
| The Society in Numbers | Statistics band with seal watermark |
| Vision / Mission / Goals | Three-column strategic direction |
| Board Members | Eight-member leadership grid |
| Membership | Four membership categories |
| News | Lead story plus a dated list |
| Partners | Strategic and supporting partner tiles |
| Footer | Bilingual identity block, navigation, legal |

## Tech Stack

- **HTML5** — semantic markup, Open Graph tags, skip link
- **CSS3** — custom properties, Grid, Flexbox, three breakpoints (1100 / 860 / 620)
- **Vanilla JS** — sticky nav, mobile nav, IntersectionObserver reveals
- **Fonts** — Inter and Noto Kufi Arabic, loaded from Google Fonts. This is the only
  external request; everything else is served from the repository. If you need the site
  to be fully self-contained, drop the `<link>` tags in `index.html` and the
  `--sans` / `--arabic` stacks fall back to system fonts.

## Assets

| File | Purpose |
|---|---|
| `Layer-0.png` | Original seal supplied by the client, 185×186 |
| `sscrs-seal.png` | 512×512 upscale used everywhere on the page |
| `favicon.png` | 180×180 browser and touch icon |

> **The seal needs a vector original.** `sscrs-seal.png` is a Lanczos upscale of a 185px
> source, so it cannot gain detail that was never there. At the sizes used it is acceptable,
> but the fine Arabic lettering on the ring will not be perfectly crisp until an SVG, EPS,
> or high-resolution PNG of the emblem is supplied. Regenerate the derived assets from a
> better source and the whole page sharpens with no code changes.

## Run Locally

No build step required.

```bash
python -m http.server 8000
```

Then open `http://localhost:8000`.

## Deploy to GitHub Pages

1. Push this repository to GitHub.
2. Go to **Settings → Pages**.
3. Under **Source**, select **Deploy from a branch**.
4. Set branch to `main` and folder to `/ (root)`.
5. Click **Save** — the site will be live within a minute.

> `404.html` links back to `/SSCRS/` because GitHub Pages serves project sites from a
> subpath. If the site moves to a custom domain, change those two paths to `/`.

## Project Structure

```
.
├── index.html      # Single-page site
├── styles.css      # Design system and all layout
├── script.js       # Sticky nav, mobile nav, scroll reveal
├── 404.html        # Custom not-found page
├── sscrs-seal.png  # Seal used across the page
├── favicon.png     # Browser icon
└── Layer-0.png     # Original seal source
```

## Outstanding Content

The following still carry placeholder copy and need real content before launch:

- Board member names (currently `Dr. [President]`, `Dr. [Vice President]`, and so on)
- News article links and the "View all news" destination
- Supporting partner names and logos
- Privacy Policy and Terms of Use pages

---

© 2026 Saudi Society of Colon & Rectal Surgery
