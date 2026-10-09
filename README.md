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

- **The seal leads.** Hero at 320px, header lockup, about plate, news lead, footer and the
  mobile menu — and no watermarks.
- **Generous radii and soft elevation.** Cards sit at 24px, panels at 32px, and every button,
  chip and tag is a pill. Depth comes from wide, very low-contrast shadows that deepen on
  hover, not from borders doing all the work.
- **Sentence case, never uppercase.** Section labels are pill chips, navigation is sentence
  case at 14.5px. There is no letter-spaced micro-type anywhere.
- **Times New Roman throughout**, at the client's request, with Noto Naskh Arabic as its
  Arabic companion (Times' own Arabic glyphs exist only on Windows). Body 17px, section
  headings up to 2.85rem.
- **Extended palette.** Beyond the two seal colours there is now a scale of blues, a teal,
  greens, slates and true greys (`--blue-*`, `--teal-*`, `--green-*`, `--slate-*`,
  `--grey-*`). The four home boxes each take their own hue from it.
- **The logo appears once, large.** Every background seal watermark was removed at the
  client's request; the seal is in the hero (320px) and the header, nowhere else.
- **Restrained motion.** A single fade-and-rise on scroll plus small hover lifts, and nothing
  at all under `prefers-reduced-motion`.

## Languages / اللغات

The page ships bilingual. English is written into `index.html` and is what loads by default;
Arabic lives in `translations.js` and is applied on demand.

- The **العربية / English** switch sits in the utility bar (and in the mobile menu).
- Choosing Arabic sets `lang="ar" dir="rtl"` on `<html>`. The **entire layout mirrors** —
  navigation, grids, list bullets, borders and the mobile menu all flip, because the
  stylesheet is written with CSS logical properties (`padding-inline-start`,
  `border-inline-end`, `inset-inline`) rather than left/right.
- Arabic sets Noto Naskh Arabic throughout, drops the uppercase and letter-spacing treatments
  that do not apply to Arabic script, and uses Arabic-Indic numerals (٢٠٠٩، ٥٠٠+).
- The choice is remembered in `localStorage`, and `?lang=ar` forces it. It is applied by a
  small inline script in `<head>` so the language never flashes on load.
- The page title and meta description swap with the language.

> **The Arabic copy needs the society's sign-off.** It was drafted for this redesign, not
> supplied by the client. Every string is in `translations.js` and can be edited in place —
> no other file needs to change. Board member names are placeholders in both languages.

## Sections

| Section | Description |
|---|---|
| Header | One sticky row — seal lockup, nav, language switch, join CTA |
| Hero | Identity statement — seal, bilingual name, est. 2009 · 1430H |
| At a glance | Four cards that lift over the hero edge |
| About | Society history, seal plate, and four pillars |
| The Society in Numbers | Statistics in a contained dark panel |
| Vision / Mission / Goals | Three-column strategic direction |
| Founding Members | Eight founder cards (placeholders) under About |
| Board Members | Member cards with photo and biography |
| Membership | Affiliate / Regular / Honorary 3D cards, then a searchable directory of current members (sample rows) |
| Committees & Regulations | Six committee cards from Chapter 5 of the Basic Bylaw, then a document library with an in-page PDF viewer |
| Education & Conferences | Webinars and workshops, the next Annual Forum announcement and a brief on the last one (placeholders) |
| News | Lead story plus a dated list |
| Gallery | Filterable horizontal carousel with a lightbox |
| Help assistant | Floating button and answer panel (placeholder) |
| Partners | Affiliated societies and strategic partners as logo tiles (placeholder SVGs in `partners/`) |
| Footer | Bilingual identity block, LinkedIn and X, navigation, legal |

## Tech Stack

- **HTML5** — semantic markup, Open Graph tags, skip link
- **CSS3** — custom properties, Grid, Flexbox, logical properties, four breakpoints (1240 / 1080 / 640)
- **Vanilla JS** — language switching, sticky nav, mobile nav, IntersectionObserver reveals
- **Fonts** — Times New Roman is a system font and needs no download. Noto Naskh Arabic is
  loaded from Google Fonts for Arabic text; this is the only external request. Drop the
  `<link>` in `partials/head.html` and Arabic falls back to the system's Times / Traditional
  Arabic.

## The Seal

The seal is the society's official artwork, supplied as `SSCRS Logo.pdf`. The PDF
is a wrapper around a single **697×637 JPEG on white** — there is no vector inside it
(the only other object is a stray embedded font from the export). It was extracted at
native resolution, masked to the ring's circle for transparency, and saved as
`sscrs-seal.png`; the favicon is cut from the same file.

Every placement goes through one inline `<symbol id="sscrs-seal">` in
`partials/seal.html`, so replacing the artwork again is a one-line change there.

| File | Purpose |
|---|---|
| `sscrs-seal.png` | The official seal, transparent, used everywhere |
| `favicon.png` | 180×180 cut from it |
| `Layer-0.png` | The original 185px file, kept for reference only |

> **Still worth asking the designer for the vector.** At 697px the seal is crisp at
> every size on this site on 1× and 2× screens; the fine ring lettering will soften
> slightly on 3× phones at the hero size. An SVG or EPS would remove that ceiling.

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
├── build.py         # Assembles the site — run after editing partials/ or pages/
├── partials/        # Shared blocks: header, footer, seal, assistant, head
├── pages/           # Per-page content with front matter
├── index.html       # GENERATED
├── about.html       # GENERATED
├── board.html       # GENERATED
├── membership.html  # GENERATED
├── founders.html    # GENERATED
├── education.html   # GENERATED
├── committees.html  # GENERATED — committees + regulations library
├── styles.css       # Design system, tints, RTL-ready layout
├── translations.js  # All Arabic copy — the only file a translator needs
├── chatbot.js       # Help assistant + its knowledge base (placeholder)
├── script.js        # Language switch, sticky nav, mobile nav, reveal
├── 404.html         # Custom not-found page (bilingual)
├── gallery/         # Gallery photographs (placeholders for now)
├── members/         # Board portraits (placeholders for now)
├── regulations/     # Regulation PDFs (placeholders for now)
├── partners/        # Partner logos (placeholder SVGs; replace with the same filenames)
├── sscrs-seal.png   # Flat raster seal — favicon, social, watermarks
├── favicon.png      # Browser icon
└── Layer-0.png      # Original seal source
```

## Outstanding Content

The following still carry placeholder copy and need real content before launch:

- BM-05's name (Arabic surname missing, English spelling unverified) — their card is held out of the page until confirmed
- Board roles for BM-02 to BM-05 (only the chair's is confirmed)
- Remaining board members beyond the five supplied
- Founding members: the eight names, specialties and institutions on `founders.html` are invented placeholders
- Current members directory on `membership.html`: ten sample rows
- Education & Conferences: all dates, speakers, venues and 2025 figures are placeholders
- Partner logos: the six SVGs in `partners/` are placeholders drawn for layout
- LinkedIn and X profile URLs for the footer (currently the platforms' home pages)
- Committee chairs (all "To be announced"), and confirmation of the three programme committees
  (Scientific & Education, Awareness & Community, Executive) — only Audit, Nominations &
  Remuneration and Elections are named in the bylaw
- Real regulation PDFs in `regulations/` — the five files there are placeholders, and the
  application form is a copy of one of them
- Real cooperation agreements, replacing the three placeholder rows
- Sign-off on the drafted Arabic copy in `translations.js`
- News article links and the "View all news" destination
- Supporting partner names and logos
- Real photographs for the gallery, replacing the nine placeholders in `gallery/`
- A real backend for the help assistant; the current answers are hand-written
- Privacy Policy and Terms of Use pages

---

© 2026 Saudi Society of Colon & Rectal Surgery
