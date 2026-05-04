# SSCRS — Saudi Society of Colon & Rectal Surgery

Official website of the Saudi Society of Colon & Rectal Surgery (SSCRS), built as a fully static site ready for GitHub Pages hosting.

## Live Site

> **[https://\<your-username\>.github.io/\<repo-name\>/](https://github.com)**  
> Replace the URL above after you publish the repo and enable GitHub Pages.

---

## Sections

| Section | Description |
|---|---|
| Hero | Full-viewport introduction with animated headline |
| About | Association history and pillars |
| Numbers | Key statistics in a dark grid panel |
| Vision / Mission / Goals | Strategic direction in a three-column layout |
| Board Members | Leadership grid with president highlight |
| Membership | Four-tier subscription cards |
| News | Announcements in an asymmetric grid |
| Partners | Strategic and supporting partner tiles |
| Footer | Navigation, contact, and legal links |

## Features

- Animated splash screen with SVG ring progress
- Scroll progress bar (blue → green gradient)
- Scroll-triggered reveal animations
- Responsive layout (desktop / tablet / mobile)
- Mobile full-screen navigation overlay
- Pure HTML + CSS + JS — zero dependencies

## Tech Stack

- **HTML5** — semantic markup
- **CSS3** — custom properties, Grid, Flexbox, keyframe animations
- **Vanilla JS** — IntersectionObserver, scroll events

## Run Locally

No build step required. Just open `index.html` in any browser:

```bash
# Option A — double-click index.html in your file manager

# Option B — serve with any static server (avoids CORS issues with assets)
npx serve .
# or
python -m http.server 8000
```

## Deploy to GitHub Pages

1. Push this repository to GitHub (see steps below).
2. Go to **Settings → Pages**.
3. Under **Source**, select **Deploy from a branch**.
4. Set branch to `main` and folder to `/ (root)`.
5. Click **Save** — your site will be live within a minute.

## Push to GitHub (first time)

```bash
# 1 — create a new repo on github.com (do NOT add README or .gitignore there)

# 2 — inside this project folder, run:
git remote add origin https://github.com/<your-username>/<repo-name>.git
git branch -M main
git push -u origin main
```

## Project Structure

```
.
├── index.html      # Main page
├── styles.css      # All styles and animations
├── script.js       # Splash, scroll progress, reveal, mobile nav
├── Layer-0.png     # SSCRS logo
└── 404.html        # GitHub Pages custom 404 → redirects home
```

---

© 2026 Saudi Society of Colon & Rectal Surgery
