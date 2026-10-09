# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Virustra is an Indian occasionwear boutique that **rents (and sells) traditional outfits, customised on request** — tagline *"Wear Royal, Spend Smart"* (from the brand's Instagram bio, @virustra). The repo is a static site — plain HTML/CSS/JS, no build step — currently a **client demo**: sample product names/prices, but **real Virustra photography taken from the brand's Instagram**.

## Commands

```bash
npm start                         # serve ./public on http://localhost:5173 (npx serve)
npm run set-domain -- https://x   # replace the placeholder domain in canonical/OG/sitemap/robots
```
No linter, bundler or tests. Verify changes in a browser (XAMPP: `http://localhost/virustra/` — root `.htaccess` serves `public/`; hard-reload with Ctrl+Shift+R, scripts get cached). Hosting is Netlify, auto-deployed from GitHub `main` (publish dir `public/`, see `netlify.toml`).

## Versions (important)

- **Main = `public/index.html`**: the *original v1 design the client rated 10/10* + the advanced motion layer (`fx.js`/`fx.css`) + Instagram photography. Fonts Cormorant Garamond + Manrope. **Do not add the v2 features to it unless asked** (banners, Women/Men/Kids filters, sale, customise panel, light footer) — the owner chose "pure v1 + new animation".
- **Backup = `public/v2/index.html`** (code in `assets/css/v2.css`, `assets/js/v2.js`; stock images in `assets/img/photos/`; GSAP 3.12 in `assets/vendor/`). Served at `/v2/`, noindex.
- **`archive/index-v1.html`** = pristine original v1 (not deployed).

## Layout (main)

- `public/assets/css/main.css` + `fx.css`; `public/assets/js/main.js` (base behaviour, from v1) + `fx.js` (motion layer) + `config.js` (`whatsappNumber`, `saleEnds`).
- `main.js` fires `vr:ready` (and sets `window.__vrReady`) at the start of `initScroll()`, exposes `window.__lenis`, and calls `window.vrNavigate(target)` before anchor scrolls. `fx.js` listens, builds its features inside `safe()` wrappers, and can be deleted without breaking the page.
- `fx.js` features: silk-pleat page transition (`vrNavigate`), Flip quick view (captures `.card-fig` clicks in capture phase), pinned reveal scene (`.reveal`), pleat-strip reveals (`[data-pleat]`), SplitText line masks, lookbook velocity skew, card glare, text roll, sequin burst on `#wa`.
- Photography: `public/assets/img/ig/ig-NN.jpg` (NN = index in the Instagram grid). Instagram grid thumbnails are pre-cropped — keep `object-position` rules at the end of `fx.css` so faces stay in frame.
- `docs/` — `virustra_royal_editorial_design_system.md` (visual source of truth; §21+ are revisions), `virustra_project_timeline_and_decisions.md`, `virustra_reference_research.md` (reference-site library — append new references there), `Virustra_Image_Reference_Sites.md` (owner's photography guide).

## Rules that affect implementation

**Never invent business facts.** Verified: WhatsApp/phone `+91 97233 00699`, Instagram `instagram.com/virustra`, bio wording ("Wear Royal, Spend Smart", "Traditional Outfits on Rent", "Customized Just for You"). Everything else (prices, sizes, policies, GSTIN, address, delivery terms) is unverified: keep prices as samples, no fake reviews/stock/scarcity. The owner chose (2026-10-10) to present sample prices as real for the demo, so there is no "sample" label; the site stays `noindex` (meta + robots.txt) until real data replaces it — remove noindex at launch.

**Rent vs buy:** cards label "Rent from" / "Buy from"; a piece without one option shows "Rental only"/"Sale only".

**WhatsApp is the conversion path and a click is only an enquiry** — never show "booked". Message: product + (rent|buy) + event date + size. Number comes from `config.js`.

**Logo:** `assets/img/logo.svg` as-is (single-colour gold `#DAAF87`, transparent) — it vanishes on light surfaces; put it on a dark chip, never recolour.

**Design tokens:** night `#1E0508`, oxblood `#3A0B12`, wine `#650D17`, gold `#DAAF87` (logo colour), gold-deep `#8A5A2E` for text on ivory, ivory `#F7F0E6`. Use CSS variables.

**Motion:** GSAP only (CSS for trivial transitions); never animate one element with two systems. Only `.reveal` may pin on main; pinned/curtain/skew effects are skipped under `prefers-reduced-motion`. **No custom cursor trail** (removed on purpose; the "Quick view/Enquire" label bubble and magnetic buttons stay).

**Accessibility/perf:** WCAG AA contrast, visible focus, quick view is a labelled modal (focus moves in, Tab is trapped, Esc closes, focus returns), first image `fetchpriority=high`, other images lazy.

**Photography/copyright:** never copy images from other brands' sites (houseofmasaba, ajiliyaa, soch…). Instagram photos are the client's own; confirm model/photographer permission before launch.

## Git

Remote: `github.com/dhrumilM1999/virustra`. `main` is deployable and auto-deploys to Netlify (project `virustra`, https://virustra.netlify.app, currently private) on push. Short-lived branches + PRs. Commit messages: short, one line, type prefix (`feat:`, `fix:`, `docs:`, `chore:`). Known issue: commits still carry author `dhrumilBS` (global git config) — owner is `dhrumilM1999`; fix needs the owner's chosen email.
