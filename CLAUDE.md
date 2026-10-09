# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

Virustra is an Indian occasionwear boutique (women, men, kids) that **rents and sells**. The repo is a static site — plain HTML/CSS/JS, no build step — currently a **concept/client demo** with sample products, prices and offers and licensed Unsplash stock photography.

## Commands

```bash
npm start                         # serve ./public on http://localhost:5173 (npx serve)
npm run set-domain -- https://x   # replace the placeholder domain in canonical/OG/sitemap/robots
```
No linter, bundler or tests. Verify changes in a browser (XAMPP: `http://localhost/virustra/` — root `.htaccess` serves `public/`). Hosting is Netlify, auto-deployed from GitHub `main` (publish dir `public/`, see `netlify.toml`).

## Layout

- `public/index.html` — the whole page (loader, banner carousel, shop-by-who, reveal scene, story, collection + filters, ways to save, occasions scene, lookbook, how-it-works, WhatsApp enquiry builder, FAQ, footer). Flat sections.
- `public/assets/css/styles.css` — all styles. Colours, fonts, text size and contrast are CSS variables switched by `data-theme` / `data-font` / `data-size` / `data-contrast` on `<html>`; translucent colours use RGB triplets (`--night-rgb`, `--gold-rgb`, …) so they follow the theme.
- `public/assets/js/main.js` — one IIFE: customise panel + prefs (`localStorage` key `vp`), offer bar/countdown, WhatsApp message builder, `shop()` (category filter, rent/buy toggle, sale prices), loader, banner carousel (`bnGo`), `initScroll()` (ScrollTrigger reveals), `scenes()` (the only two pinned scenes), `pointerFx()` (cursor label + magnetic buttons).
- `public/assets/js/config.js` — `whatsappNumber`, `saleEnds`. Edit here, not in main.js.
- `public/assets/vendor/` — self-hosted GSAP 3.12.5, ScrollTrigger, Lenis. `public/assets/img/photos/` — stock photos named by Unsplash id.
- `docs/` — `virustra_royal_editorial_design_system.md` (source of truth for visuals; §21+ are revisions), `virustra_project_timeline_and_decisions.md`, `virustra_reference_research.md` (reference-site library — append every new reference there, template at the bottom).
- `archive/index-v1.html` — first concept, not deployed.

## Rules that affect implementation

**Never invent business facts.** Real prices, stock, sizes, discounts, shipping/return terms, pin-code coverage, phone/email, address, GSTIN and the WhatsApp number are unverified. The owner chose (2026-10-10) to present sample prices/photos as if real for the client demo, so the "Concept preview" label is gone; the demo stays `noindex` (meta + robots.txt) until real data replaces it — remove noindex at launch. Don't add scarcity/fake-review/fake-stock claims.

**Rent vs buy:** cards label "Rent from" / "Buy from"; a piece without one option shows "Rental only"/"Sale only". Sale items carry `data-sale="<percent>"` and the struck-through "was" price is computed in `shop()`.

**WhatsApp is the conversion path and a click is only an enquiry** — never show "booked". Message template: product + (rent|buy) + event date + size. Number comes from `config.js`.

**Logo:** use `assets/img/logo.svg` as-is (single-colour gold `#DAAF87`, transparent). It disappears on light surfaces — place it on a dark chip (see `.foot-logo`) rather than recolouring.

**Design tokens/fonts:** default theme Royal Maroon (night `#1E0508`, wine `#650D17`, gold `#DAAF87`, gold-deep `#8A5A2E` for text on ivory); other themes Noir, Emerald Heritage. Font sets: Editorial (Bodoni Moda + Manrope, default), Modern (Montserrat + Urbanist), Classic (Cormorant + Manrope). Use variables, never hard-code colours. Display headings must scale with `var(--dscale)`.

**Motion:** GSAP only (CSS for trivial transitions); never animate one element with two systems. Only the reveal and chapters scenes in `scenes()` may pin, and both fall back to static sections under `prefers-reduced-motion` or the in-panel "Reduce motion" setting. The old stitch/needle cursor was removed on purpose — don't reintroduce a custom cursor trail.

**Accessibility/perf:** WCAG AA contrast, visible focus, keyboard-operable carousel (arrow keys, pause button), content works without JS (no-JS hides the loader), first banner image `fetchpriority=high`, other images lazy with dimensions where possible.

**Photography:** don't copy images from other brands' sites (e.g. houseofmasaba, ajiliyaa, soch) — references are for structure/tactics only. Replace stock photos with real Virustra shots before launch.

## Git

Remote: `github.com/dhrumilM1999/virustra`. `main` is deployable and auto-deploys to Netlify on push. Short-lived branches + PRs. Commit messages: short, one line, type prefix (`feat:`, `fix:`, `docs:`, `chore:`). Don't commit `node_modules`, `.env`, or `.claude/settings.local.json`.
