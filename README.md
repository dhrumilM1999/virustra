# Virustra

Rent-or-shop Indian occasionwear for **women, men and kids**. A static site — plain HTML/CSS/JS with [GSAP](https://gsap.com) (+ ScrollTrigger) and [Lenis](https://lenis.darkroom.engineering) for motion. No build step.

> **Status: concept / client demo.** Products, prices, offers and countdowns are **samples** (marked `*` on the page). Photography is licensed Unsplash stock. See [Before launch](#before-launch).

## Project layout

```
public/                     ← the deployable site (publish this folder)
  index.html
  404.html  robots.txt  sitemap.xml  site.webmanifest  .nojekyll
  assets/
    css/styles.css          all styles; themes/fonts/a11y are CSS variables
    js/config.js            ← edit: WhatsApp number, sale end date
    js/main.js              all behaviour (carousel, filters, pinned scenes, panel)
    vendor/                 gsap, ScrollTrigger, lenis (self-hosted)
    img/                    logo.svg, favicon.svg, og-image.jpg, photos/*.jpg
docs/                       design system, decision log, reference research
archive/index-v1.html       first concept (kept for comparison; not deployed)
scripts/set-domain.mjs      swaps the placeholder domain for yours
netlify.toml                Netlify settings (publish dir, security + cache headers)
.htaccess                   local XAMPP only: makes http://localhost/virustra/ serve public/
CLAUDE.md                   guidance for Claude Code sessions
```

## Run locally

Any static server works (the site must be served over http, not opened as a file, for fonts/scripts to behave):

```bash
npm start                       # serves ./public on http://localhost:5173
# or: VS Code Live Server → right-click public/index.html → Open with Live Server
# or: XAMPP → http://localhost/virustra/   (root .htaccess serves public/)
```

## Deploy (Netlify, from GitHub)

Repo: `github.com/dhrumilM1999/virustra` · Live: https://virustra.netlify.app (Netlify project `virustra`). Netlify watches `main`; every push publishes `public/` automatically (settings live in `netlify.toml`).

**One-time setup (≈2 minutes, needs your Netlify + GitHub login):**
1. [app.netlify.com](https://app.netlify.com) → **Add new site → Import an existing project → GitHub** → pick `virustra`.
2. Leave the build command empty; publish directory is read from `netlify.toml` (`public`). Click **Deploy**.
3. Optional: Site settings → change the site name, then add your custom domain.

After that: `git push` → live in about 30 seconds. Pull requests get their own preview URL.
Other hosts (Vercel, Cloudflare Pages, GitHub Pages) also work by publishing the `public` folder; their config files were removed to keep the repo simple.

After you have a domain: `npm run set-domain -- https://www.your-domain.com` (updates canonical, Open Graph, sitemap, robots).

## Before launch

- [x] WhatsApp number set (`919723300699`). [ ] Set `saleEnds` in `public/assets/js/config.js` to a real end date.
- [ ] Run `npm run set-domain -- https://…`.
- [ ] Replace all stock photos in `public/assets/img/photos/` with real Virustra inventory (keep the filenames or update `index.html`).
- [ ] Replace sample product names/prices (`.card` elements in `index.html`) and the sample offers/banners marked `*`.
- [ ] Add real policy pages (rental terms, returns, delivery, privacy), business name/GSTIN/address and contact details in the footer.
- [ ] Add the remaining social links (YouTube/Pinterest) in the footer; Instagram already points to instagram.com/virustra.
- [ ] Remove `noindex` (meta tag in `index.html` + `Disallow: /` in `robots.txt`) so search engines can index the site.
- [ ] Re-export `og-image.jpg` (1200×630) from a real campaign photo.

## Customising (built in)

The round **Aa** button (bottom-left) lets visitors/clients switch **font pairing** (Editorial / Modern / Classic), **colour theme** (Royal Maroon / Noir / Emerald Heritage), text size, high contrast, and reduce-motion. Choices persist in `localStorage` (`vp`). Themes live at the top of `styles.css` (`html[data-theme=…]`).

## Git workflow

- `main` is always deployable and auto-deploys. Work in short-lived branches (`feat/…`, `fix/…`) and merge via pull request.
- Short commit messages with a type prefix: `feat: add kids filter`, `fix: banner crop on mobile`, `docs: …`, `chore: …`.
- Tag releases (`v2.0.0`) when a version goes to the client.

## Credits

Photography: [Unsplash](https://unsplash.com) (Unsplash License) — placeholder imagery only. Type: Bodoni Moda, Manrope, Montserrat, Urbanist, Cormorant Garamond via Google Fonts (OFL). Motion: GSAP 3.12 (standard no-charge license), Lenis (MIT).
