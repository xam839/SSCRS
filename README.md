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

- **The seal leads.** It appears at six sizes across the page: the header lockup (60px),
  the hero (196px), the about plate (168px), the news lead (132px), the footer (100px), and
  the mobile menu — plus a low-opacity watermark behind the hero and the statistics panel.
- **Generous radii and soft elevation.** Cards sit at 24px, panels at 32px, and every button,
  chip and tag is a pill. Depth comes from wide, very low-contrast shadows that deepen on
  hover, not from borders doing all the work.
- **Sentence case, never uppercase.** Section labels are pill chips, navigation is sentence
  case at 14.5px. There is no letter-spaced micro-type anywhere.
- **A confident type scale.** 17px body, section headings up to 2.85rem, the hero name at
  3.5rem in weight 800, set in Plus Jakarta Sans.
- **Brand-tinted neutrals.** No surface is pure grey. Every tinted section carries a wash
  drawn from the two logo colours — `--tint-navy` and `--tint-green` — kept pale so the colour
  registers as warmth rather than decoration.
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
- Arabic sets Noto Kufi Arabic throughout, drops the uppercase and letter-spacing treatments
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
| Board Members | Eight-member leadership grid |
| Membership | Four membership categories |
| News | Lead story plus a dated list |
| Gallery | Filterable photo grid with a lightbox carousel |
| Help assistant | Floating button and answer panel (placeholder) |
| Partners | Strategic and supporting partner tiles |
| Footer | Bilingual identity block, navigation, legal |

## Tech Stack

- **HTML5** — semantic markup, Open Graph tags, skip link
- **CSS3** — custom properties, Grid, Flexbox, logical properties, four breakpoints (1240 / 1080 / 640)
- **Vanilla JS** — language switching, sticky nav, mobile nav, IntersectionObserver reveals
- **Fonts** — Plus Jakarta Sans and Noto Kufi Arabic, loaded from Google Fonts. This is the only
  external request; everything else is served from the repository. If you need the site
  to be fully self-contained, drop the `<link>` tags in `index.html` and the
  `--sans` / `--arabic` stacks fall back to system fonts.

## The Seal

The seal is drawn as an **inline SVG symbol**, defined once at the top of `index.html` and
referenced with `<use>` everywhere it appears.

- The ring, its rules, the curved Arabic and English lettering and the two dates are **true
  vector**, so they stay sharp at every size — this is what was visibly soft before.
- The emblem in the middle — the colon, palm and swords — is the artwork from the supplied
  file, extracted and clipped into the inner circle (`seal-core.png`). It is the one raster
  part left.
- It is inline rather than an external `.svg` because an SVG loaded through `<img>` or CSS
  cannot use the page's webfonts, and the ring lettering needs them.

| File | Purpose |
|---|---|
| `Layer-0.png` | Original seal supplied by the client, 185×186 |
| `seal-core.png` | Inner emblem extracted from it, used inside the vector ring |
| `sscrs-seal.png` | Flat raster seal — favicon source, social preview, and the two watermarks |
| `favicon.png` | 180×180 browser and touch icon |

> **Two things worth knowing.** First, the ring lettering is now set in Noto Kufi Arabic and
> Inter rather than the original seal's typefaces, so it reads as a cleaned-up version of the
> mark rather than a pixel-exact reproduction — if the society's brand office needs the exact
> original, point the six `<use href="#sscrs-seal">` references at `sscrs-seal.png` instead
> and the page reverts. Second, the inner emblem still comes from a 185px source; supplying a
> vector or high-resolution original of the artwork is the last step to a fully crisp seal.

## Gallery

A filterable grid of society photographs; clicking any tile opens a full-screen
lightbox carousel.

- **Filters** — All / Annual Forum / Workshops / Awareness. Tiles fade and re-flow
  when a filter changes.
- **Lightbox** — arrows, keyboard (←/→, Esc), swipe on touch, a running counter, and
  neighbour preloading so stepping through feels instant. Arrow keys reverse under RTL.
  It navigates the *currently filtered* set, so arrowing inside "Workshops" stays in
  Workshops.
- **Accessibility** — each tile is a real button, focus moves into the dialog on open
  and returns to the tile on close, focus is trapped while open, and the page behind is
  scroll-locked. Under `prefers-reduced-motion` the zoom and fade are dropped.

### Replacing the placeholder photographs

`gallery/` currently holds nine generated placeholders — brand gradients with a faint
seal, no text baked in. To use real photographs:

1. Drop your images into `gallery/`, keeping roughly the same aspect ratios
   (landscape ~3:2, portrait ~3:4, square).
2. In `index.html`, update the `src`, `width` and `height` on each
   `.gal-item img`. The `width`/`height` attributes matter — they reserve space and
   stop the page jumping while images load.
3. Edit the caption in the same `<figure>`, and its Arabic twin under the matching
   `gal.c1` … `gal.c9` key in `translations.js`.

Nothing else needs to change: the grid, filters and lightbox all read from the DOM.
To add a tenth photo, copy a `<figure>` block, give it a `data-category`, and bump the
`data-gal-open` index.

> The captions are invented for the placeholders and describe events that have not
> happened. Replace them along with the images.

## Help Assistant

A floating button in the bottom corner opens a small assistant panel that answers
questions about the society. **This is a placeholder implementation, meant to be
replaced.**

It is offline: there is no model and no network call. `chatbot.js` scores a question
against a small keyword knowledge base built from the content already on this page —
membership, the annual forum, training, partnerships, the board, the gallery, contact
details — and falls back to pointing at info@sscrs.org.

### Clinical questions are refused, deliberately

This is a surgical society's website, and visitors will ask personal medical
questions. Anything that reads as one gets a referral instead of an answer:

> I can't help with medical or personal health questions, and nothing here is medical
> advice. Please speak with a qualified colorectal surgeon or your own physician — and
> if this is urgent, seek medical care now.

The panel also carries a permanent "general information only, not medical advice"
note. **Keep both when you replace the backend.** A real model must be given the same
instruction in its system prompt, and the refusal should stay server-side rather than
relying on the browser.

### Replacing it with a real backend

Everything behind the UI is reached through one function:

```js
SSCRS_CHAT.setResponder(async function (text, lang) {
  const r = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ message: text, lang: lang })
  });
  return (await r.json()).reply;      // a string
});
```

The responder may return a string or a promise for one. The panel, typing indicator,
language switching and the safety note all keep working unchanged.

> **Never put an API key in `chatbot.js`.** It is served to every visitor. A paid model
> has to be called from a small server endpoint that holds the key — which means this
> site would no longer be purely static, and would need somewhere to run that endpoint.

Other entry points: `SSCRS_CHAT.open()`, `.close()`, `.ask(text)`, and
`.knowledgeBase` for the current entries.

### A note on the Arabic matching

Arabic morphology makes naive substring matching unsafe, and two cases bit during
development: `ألم` ("pain") normalises to `الم`, which is the opening of `الملتقى`
("the forum"), and `هل لدي` ("do I have") sits inside `هل لديكم` ("do you have"),
which means the opposite. Arabic terms are therefore matched at word boundaries with
the usual attached prefixes and up to two stacked suffixes. Arabic punctuation is
excluded from the "letter" class — `؟` is U+061F, inside the Arabic block, so treating
the block as letters broke every question that ended in one.

If you extend the knowledge base, add inflected forms rather than relying on
substrings, and re-check that ordinary questions are not caught by the clinical guard.

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
├── index.html       # Single-page site, incl. the inline SVG seal
├── styles.css       # Design system, tints, RTL-ready layout
├── translations.js  # All Arabic copy — the only file a translator needs
├── chatbot.js       # Help assistant + its knowledge base (placeholder)
├── script.js        # Language switch, sticky nav, mobile nav, reveal
├── 404.html         # Custom not-found page (bilingual)
├── gallery/         # Gallery photographs (placeholders for now)
├── seal-core.png    # Inner emblem, used inside the vector ring
├── sscrs-seal.png   # Flat raster seal — favicon, social, watermarks
├── favicon.png      # Browser icon
└── Layer-0.png      # Original seal source
```

## Outstanding Content

The following still carry placeholder copy and need real content before launch:

- Board member names (currently `Dr. [President]`, `Dr. [Vice President]`, and so on, in both languages)
- Sign-off on the drafted Arabic copy in `translations.js`
- News article links and the "View all news" destination
- Supporting partner names and logos
- Real photographs for the gallery, replacing the nine placeholders in `gallery/`
- A real backend for the help assistant; the current answers are hand-written
- Privacy Policy and Terms of Use pages

---

© 2026 Saudi Society of Colon & Rectal Surgery
