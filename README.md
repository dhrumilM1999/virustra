# Virustra

Traditional outfits **on rent**, customised just for you — *Wear royal, spend smart.* A static site: plain HTML/CSS/JS with [GSAP](https://gsap.com) (ScrollTrigger, Flip, SplitText) and [Lenis](https://lenis.darkroom.engineering) for motion. No build step.

> **Status: client demo.** Product names and prices are samples. Photography is Virustra's own, taken from the brand's Instagram ([@virustra](https://www.instagram.com/virustra/)). See [Before launch](#before-launch).

## Versions

| URL | What | Where |
|---|---|---|
| `/` | **Main** — the original v1 design plus the advanced motion layer, real Instagram photos | `public/index.html` |
| `/v2/` | **Backup** — banner-carousel version with Women/Men/Kids filters, sale pricing, customise panel, light footer | `public/v2/index.html` |
| — | Pristine original v1 (before the motion layer) | `archive/index-v1.html` |

## Project layout

```
public/                     ← the deployable site (publish this folder)
  index.html                main page
  v2/index.html             backup version (shares /assets)
  404.html  robots.txt  sitemap.xml  site.webmanifest  .nojekyll
  assets/
    css/main.css            base styles (from v1)
    css/fx.css              motion-layer styles (pinned scene, quick view, curtain, …)
    js/config.js            ← edit: WhatsApp number, sale end date
    js/main.js              base behaviour (loader, hero, filters, WhatsApp builder, scroll reveals)
    js/fx.js                advanced motion layer (loads last; safe to remove)
    js/v2.js  css/v2.css    the backup version's code
    vendor/gsap-3.13/       gsap, ScrollTrigger, Flip, SplitText   vendor/lenis.min.js   vendor/gsap.min.js (3.12, used by /v2/)
    img/ig/                 Virustra photography from Instagram    img/photos/  stock used only by /v2/
    img/                    logo.svg, favicon.svg, og-image.jpg
docs/                       design system, decision log, reference research, photography guide
scripts/set-domain.mjs      swaps the placeholder domain for yours
netlify.toml                Netlify settings (publish dir, security + cache headers)
.htaccess                   local XAMPP only: http://localhost/virustra/ serves public/
CLAUDE.md                   guidance for Claude Code sessions
```

## The motion layer (`fx.js`)

| Effect | What it does |
|---|---|
| Silk-pleat page transition | Long jumps (nav links) are covered by eight silk pleats, the page jumps, the pleats lift away. Short hops use normal smooth scroll. |
| Quick view (Flip) | Click a product: its photo morphs from the card into a detail panel (rent/buy prices, availability button) and back on close. Esc / backdrop / ✕ close it. |
| Pinned reveal scene | An arch-shaped photo grows to full-bleed while "Wear royal. / Spend smart." slide apart. |
| Pleat-strip image reveal | Story and enquiry photos are uncovered by six pleats lifting in sequence. |
| Masked line reveals | Paragraphs rise line by line (SplitText). |
| Velocity skew | Lookbook cards lean with scroll speed. |
| Card glare | A light sheen follows the pointer across product photos. |
| Text roll | Nav links and buttons roll their label on hover. |
| Sequin burst | Gold sequins burst from the WhatsApp button when an enquiry is sent. |
| Loader counter | 00 → 100 tied to the stitching ring. |

Everything respects `prefers-reduced-motion` (pinned scene, curtain, skew etc. are skipped; quick view still works without animation).

## Run locally

Any static server works (serve over http, not file://):

```bash
npm start                       # serves ./public on http://localhost:5173
# or: VS Code Live Server → right-click public/index.html → Open with Live Server
# or: XAMPP → http://localhost/virustra/   (root .htaccess serves public/)
```
If the browser shows stale scripts after a change, hard-reload (Ctrl+Shift+R).

## Deploy (Netlify, from GitHub)

Repo: `github.com/dhrumilM1999/virustra` · Live: https://virustra.netlify.app (Netlify project `virustra`). Netlify watches `main`; every push publishes `public/` automatically (settings in `netlify.toml`). The Netlify site is currently **private** (Netlify project overview → *Make public* to share with the client).

After you have a domain: `npm run set-domain -- https://www.your-domain.com` (updates canonical, Open Graph, sitemap, robots).

## Before launch

- [x] WhatsApp number set (`919723300699`), call number and Instagram link in the footer. [ ] Set `saleEnds` in `public/assets/js/config.js` if you reuse the sale countdown (backup version only).
- [ ] Run `npm run set-domain -- https://…`.
- [ ] Replace sample product names/prices (`.card` elements in `index.html`) with the real catalogue.
- [ ] Add real policy pages (rental terms, returns, delivery, privacy) and business name/GSTIN/address in the footer.
- [ ] Remove `noindex` (meta tag in `index.html` + `Disallow: /` in `robots.txt`) so search engines can index the site.
- [ ] Check the Instagram photos' usage rights with the photographer/models, and re-export `og-image.jpg` (1200×630) from a campaign photo.

## Git workflow

- `main` is always deployable and auto-deploys. Work in short-lived branches (`feat/…`, `fix/…`) and merge via pull request.
- Short commit messages with a type prefix: `feat: add quick view`, `fix: hero crop on mobile`, `docs: …`, `chore: …`.
- Tag releases (`v2.0.0`) when a version goes to the client.

## Credits

Photography: Virustra (@virustra on Instagram); stock placeholders in `/v2/` from [Unsplash](https://unsplash.com) (Unsplash License). Type: Cormorant Garamond & Manrope (main); Bodoni Moda, Montserrat, Urbanist (backup) via Google Fonts (OFL). Motion: GSAP 3.13 (standard no-charge license), Lenis (MIT).
