# VIRUSTRA --- Royal Editorial Design System

**Version:** 1.0\
**Status:** Approved visual direction; implementation details and
operational facts still require validation\
**Business:** Virustra --- Indian occasionwear boutique offering rental
and sale\
**Primary conversion channel:** WhatsApp\
**Service area:** India (intended/confirmed by the business; fulfilment
operations need verification)

------------------------------------------------------------------------

## 1. Purpose

This document defines the proposed design system for the Virustra
website. It is the shared reference for client approval, UX design,
HTML/CSS/JavaScript development, responsive behaviour, and animation
implementation.

The approved direction is **Royal Editorial**: cinematic, dramatic,
premium, and contemporary, using maroon and antique gold as the core
brand colours.

The design should preserve Virustra's existing logo and make garments
the visual focus. The website must support both rentals and sales,
clearly distinguish the two, and make it easy to enquire about
availability through WhatsApp.

## 2. Confirmed business context

-   Brand: Virustra.
-   Business: boutique selling and renting cholis and other Indian
    ethnic/occasionwear.
-   Service area: India.
-   Inventory: cholis and other ethnic outfits.
-   Main occasions: weddings, Garba, festivals, and engagements.
-   Price presentation: starting price.
-   Primary enquiry channel: WhatsApp.
-   Secondary discovery/contact channel: Instagram.
-   Brand direction: premium + trendy modern Indian ethnic fashion.
-   Approved design direction: Option 01 --- Royal Editorial.
-   Motion direction: cinematic, dramatic, high-end.
-   Core palette preference: maroon and gold.

### Details still to verify

-   Exact products, stock, sizes, measurements, product names, and
    condition.
-   Actual rental and sale prices.
-   Rental duration, deposits, payment rules, cancellation, late-return
    and damage policies.
-   Whether every product is available for both rental and sale.
-   Nationwide pin-code coverage, shipping partners, delivery timelines,
    reverse logistics, and return costs.
-   Fitting, alteration, pickup, and delivery availability.
-   Approved WhatsApp business number.
-   Logo source file dimensions, transparency, and exact original colour
    values.
-   Authentic customer testimonials and permission to use customer
    imagery.

Do not invent these facts in the interface or marketing copy.

## 3. Brand principles

1.  **Royal, not ornate:** maroon and gold with restraint, generous
    whitespace, refined typography.
2.  **Editorial, not generic:** authentic garment photography and
    art-directed compositions.
3.  **Cinematic, not distracting:** dramatic motion for a few key
    moments, not every component.
4.  **Premium, but practical:** prices, availability, fit, rental terms,
    and contact actions remain easy to find.
5.  **Rent and shop clearly:** label rental and purchase options
    accurately.
6.  **Truth over reassurance:** make only claims Virustra can support.

## 4. Logo rules

-   Preserve the existing circular Virustra emblem and Devanagari
    lettering.
-   Do not redraw, stretch, recolour, or replace the logo without
    approval.
-   Use the original supplied artwork wherever possible.
-   Verify its transparent background and dimensions before production.
-   On dark backgrounds, check contrast. If necessary, place the
    original logo on a suitable contrasting surface rather than
    modifying the artwork.
-   A Latin "VIRUSTRA" wordmark can complement the logo in navigation,
    but must not replace the supplied emblem.
-   The HEX palette below is proposed website colour tokens, not a
    verified extraction from the original logo.

## 5. Colour palette

### Core brand colours

  -----------------------------------------------------------------------
  Token                   HEX                     Purpose
  ----------------------- ----------------------- -----------------------
  `color-wine`            `#650D17`               Primary brand, key
                                                  buttons, active
                                                  navigation

  `color-oxblood`         `#3A0B12`               Hero overlays, dark
                                                  sections, footer

  `color-gold`            `#C9A56A`               Decorative lines,
                                                  borders, emblems,
                                                  restrained accents

  `color-ivory`           `#F7F0E6`               Main page canvas and
                                                  editorial whitespace
  -----------------------------------------------------------------------

### Supporting colours

  -----------------------------------------------------------------------
  Token                   HEX                     Purpose
  ----------------------- ----------------------- -----------------------
  `color-cream`           `#FFFCF7`               Cards and secondary
                                                  surfaces

  `color-sand`            `#DCC9B5`               Borders and subtle
                                                  dividers

  `color-cocoa`           `#806A64`               Secondary text, subject
                                                  to contrast testing

  `color-ink`             `#301014`               Main text on light
                                                  backgrounds

  `color-error`           `#A12A35`               Error states

  `color-success`         `#2F684A`               Success states
  -----------------------------------------------------------------------

### Colour usage rules

-   Use deep wine for primary actions and brand emphasis.
-   Use oxblood for cinematic backgrounds and footer areas.
-   Use gold as an accent, not as the default small-text colour.
-   Use editorial ink for readable text on ivory and cream.
-   Test all foreground/background pairs against WCAG AA contrast
    requirements.
-   Do not assume gold on ivory is accessible without testing.
-   Do not recolour product photography to force it to match the brand
    palette; the real garments should retain their true colours.

## 6. Typography

### Font pairing

-   **Display:** Cormorant Garamond --- editorial serif for headlines,
    campaign titles, and product names.
-   **Interface/body:** Manrope --- modern sans-serif for navigation,
    descriptions, prices, specifications, buttons, and rental
    information.

Use the serif for emotion and the sans-serif for clarity. Avoid serif
type for long body copy or tiny metadata.

### Type scale

  Token          Desktop   Mobile Use
  ------------ --------- -------- ----------------------------
  Display XL       88 px    52 px Hero headline
  Display L        64 px    42 px Major campaign section
  H1               52 px    38 px Page title
  H2               40 px    32 px Section title
  H3               28 px    24 px Product/card title
  H4               20 px    20 px Subsection title
  Body L           18 px    17 px Introductory copy
  Body             16 px    16 px Main body
  Body S           14 px    14 px Product descriptions
  Label            12 px    12 px Metadata/categories
  Eyebrow          11 px    11 px Uppercase editorial labels

Recommended line heights: - Display: `0.95–1.05` - Headings: `1.1–1.2` -
Body copy: `1.6–1.75`

Use responsive sizing with `clamp()` where suitable. Load only required
font weights and provide system fallbacks. The page must remain legible
before web fonts load.

## 7. Spacing tokens

Use a 4 px base unit.

  Token          Value
  ------------ -------
  `space-1`       4 px
  `space-2`       8 px
  `space-3`      12 px
  `space-4`      16 px
  `space-5`      20 px
  `space-6`      24 px
  `space-8`      32 px
  `space-12`     48 px
  `space-16`     64 px
  `space-20`     80 px
  `space-24`     96 px

Typical section spacing: 80--96 px on desktop and 56--64 px on mobile.

## 8. Grid and layout

-   Desktop: 12 columns, 24 px gutters, approximately 5% horizontal page
    margins.
-   Tablet: 8 columns, 20 px gutters, 24 px minimum page margins.
-   Mobile: 4 columns, 16 px gutters, 16--20 px page margins.
-   Main content max width: 1440 px.
-   Body text max width: 600--680 px.
-   Product grid: 3--4 columns on desktop depending on image size; 2
    columns on mobile where product readability permits.
-   Use asymmetrical layouts for editorial storytelling, but keep
    product grids consistent.
-   Product imagery should generally use a 4:5 aspect ratio.
-   Use per-image focal positioning rather than cropping all model
    images identically.

## 9. Shape and component rules

### Buttons

-   Minimum height: 48 px.
-   Hero/primary actions: 52--56 px where appropriate.
-   Horizontal padding: 20--24 px.
-   Border radius: 2--4 px for the editorial look.
-   Primary: deep wine background with white text.
-   Secondary: transparent or cream background with wine border/text.
-   Hover: subtle lift or colour transition; avoid exaggerated bounce.
-   Focus: visible, high-contrast outline.
-   Disabled controls must visibly look inactive.

Recommended labels: - "Explore the collection" - "View details" - "Check
availability" - "Enquire on WhatsApp"

### Product cards

Each card should include, when known: - Actual product photo(s). -
Product name. - Rental starting price and/or sale price, correctly
labelled. - Available sizes or measurements. - Colour and craft
details. - Relevant occasion/category. - A clear next action.

Rules: - Keep image ratios consistent. - Keep price and action
visible. - Use "Rent from" for rental listings and "Buy from" for sale
listings. - If both rental and purchase are available for one item, show
both options distinctly. - Do not show fabricated stock counts, scarcity
labels, discounts, reviews, or prices. - Do not imply a rental is booked
merely because a WhatsApp link was clicked.

### Navigation

Desktop items: - Collection - Occasions - How It Works - Our Story -
Contact

Use the supplied logo and a clear primary enquiry action. On mobile,
keep the menu compact and make the collection and contact journey easy
to reach.

### Other components

-   Filters: occasion, colour, size, price range, and availability only
    when inventory data supports them.
-   FAQ accordions: keyboard accessible, with clear open/closed states.
-   Sticky WhatsApp CTA: use only if it does not cover content,
    controls, or mobile browser UI.
-   Product detail pages: show measurements, real product images, rental
    duration, charges, delivery/collection, and return terms where
    applicable.

## 10. Responsive breakpoints

  -----------------------------------------------------------------------
  Breakpoint                          Behaviour
  ----------------------------------- -----------------------------------
  `>= 1440 px`                        Spacious editorial layout; 3--4
                                      product columns

  `1024–1439 px`                      3 product columns; reduce section
                                      spacing as needed

  `768–1023 px`                       2 product columns; compact header
                                      and simplified hero

  `<= 767 px`                         Single-column hero; 2-column
                                      product grid where practical

  `<= 420 px`                         Reduce display type and gutters;
                                      use single-column cards if needed
  -----------------------------------------------------------------------

Implementation rules: - Use fluid typography with `clamp()`. - Do not
rely on hover for essential content. - Avoid long pinned scroll scenes
and horizontal scrolling as the only way to browse. - Use responsive
image delivery (`srcset` or equivalent). - Ensure primary actions work
at 320 px viewport width. - Test on actual mobile devices as well as
browser resizing.

## 11. Motion system

### Motion tokens

  Token                  Duration Use
  -------------------- ---------- ---------------------------------
  `motion-fast`            180 ms Buttons, icons, small feedback
  `motion-base`            320 ms Hover states, dropdowns
  `motion-reveal`          650 ms Section and image reveals
  `motion-editorial`       900 ms Hero typography and image masks
  `motion-cinematic`      1200 ms Major scene transitions
  `motion-stagger`          80 ms Delay between items in a group

Suggested easing: - `--ease-standard: cubic-bezier(.2, .7, .2, 1)` -
`--ease-cinematic: cubic-bezier(.76, 0, .24, 1)` -
`--ease-out: cubic-bezier(.16, 1, .3, 1)`

### Hero sequence

1.  **Brand reveal (roughly 0--500 ms):** restrained opacity/position
    transition.
2.  **Image reveal (roughly 400--1100 ms):** clip-path or mask reveal,
    subtle image scale.
3.  **Headline and CTA (roughly 800--1500 ms):** small stagger for
    headline, supporting copy, and CTA.

These are starting values and should be tuned after testing. Do not
block access to products with a long splash screen; returning visitors
should not have to wait through a long intro.

### Component motion rules

-   Hero: one signature reveal, then settle.
-   Headlines: stagger by line/group, not individual letters throughout
    the site.
-   Product cards: subtle opacity/position reveal.
-   Product imagery: slight scale on hover where appropriate.
-   Navigation: short opacity/underline transitions.
-   Buttons: subtle lift/colour transition.
-   Scroll effects: use selectively; natural scrolling stays in control
    of the visitor.

### Technical recommendation

Use GSAP for the hero timeline and expressive image transitions. Use CSS
transitions or `IntersectionObserver` for simpler effects. Avoid
animating the same elements with multiple systems.

If using GSAP ScrollTrigger, test resize, refresh, anchor navigation,
and mobile behaviour. Essential content must remain accessible if
animation JavaScript fails.

## 12. Accessibility and performance

-   Meet WCAG AA contrast: 4.5:1 for normal text and 3:1 for large text
    and meaningful UI boundaries where applicable.
-   Respect `prefers-reduced-motion`; suppress non-essential parallax,
    pinned scenes, and large movement when requested.
-   Ensure all links, menus, filters, accordions, and CTAs are keyboard
    accessible.
-   Provide a visible focus state.
-   Use semantic headings, buttons, links, form labels, and meaningful
    alt text.
-   Do not embed essential copy only inside images.
-   Use responsive WebP/AVIF where appropriate and define image
    dimensions.
-   Do not lazy-load the primary above-the-fold/LCP hero image.
-   Content should remain readable if JavaScript fails.
-   Avoid hiding all content behind an animation that must complete
    before the site becomes usable.
-   Test on real mobile devices and slower network conditions.

## 13. UX architecture

Recommended initial sitemap: - `/` --- Homepage - `/collections/cholis`
--- All cholis - `/products/[slug]` --- Product detail -
`/collections/wedding` --- Wedding collection, if inventory supports
it - `/collections/garba` --- Garba collection, if inventory supports
it - `/how-renting-works` --- Rental process - `/faqs` --- Common
questions - `/about` --- Brand story - `/contact` --- Contact details -
`/policies/...` --- Rental, cancellation/return, and privacy policies

Build the essential pages first: homepage, collection, product template,
rental guide, and FAQs. Add dedicated occasion pages only when they
offer enough real inventory and useful content.

### Customer journey

1.  Discover via Instagram, search, shared links, or recommendations.
2.  Explore collection, occasions, prices, and garment details.
3.  Evaluate fit, costs, availability, and rental terms.
4.  Enquire via WhatsApp with product and event-date context.
5.  Virustra confirms stock, quote, terms, and reservation steps.
6.  Customer follows agreed delivery/collection and return process.

### Booking state distinction

-   **Enquiry sent:** customer contacted Virustra.
-   **Availability/terms confirmed:** boutique checked the product/date
    and shared terms.
-   **Rental confirmed:** customer completed the actual reservation
    requirements.

Do not display "Booked" merely because a WhatsApp link was opened.

## 14. Conversion copy examples

### Hero

**A look worth remembering.**

Discover statement cholis and occasionwear for weddings, festive nights,
Garba, and celebrations.

CTA: **Explore the collection**

### Collection intro

**Your occasion. Your statement.**

Explore cholis for your next celebration. Find a design you love, check
the starting rental price, and enquire about your date.

### Product CTA

**Is your date available?**

Share your event date and preferred size with us. We'll check
availability and explain the rental terms.

CTA: **Check availability on WhatsApp**

### Closing section

**Your next celebration starts with the right look.**

Find your choli and let us help you plan your rental.

### WhatsApp message template

Hi Virustra! I'm interested in \[Product Name\].

Event date: \[Date\]\
Size / measurements: \[Details\]

Could you please confirm availability, rental price, and rental terms?

Generate the message from the selected product and details entered by
the customer. Do not ask for the same details twice.

### Copy rules

-   Sell the look and occasion first; explain rental mechanics second.
-   Use specific terms such as choli, embroidery, colour, fit, event
    date, and rental price.
-   Avoid overusing "exclusive," "luxury," and "premium" without
    evidence.
-   Do not promise availability, nationwide delivery, easy returns,
    perfect fit, or specific cleaning standards unless operationally
    true.
-   Keep CTA labels concise and explicit.

## 15. Trust requirements

### Product transparency

-   Actual garment photos.
-   Front, back, fabric, embroidery, and closure details.
-   Available size, measurements, and known imperfections.
-   Clearly labelled starting rental price.

### Rental transparency

-   Rental duration and inclusions.
-   Deposit, additional charges, and payment terms if applicable.
-   Cancellation, late-return, and damage policies.
-   Accurate description of cleaning and garment-care process.

### Nationwide service confidence

-   Verified serviceable locations/pin codes.
-   Realistic delivery timelines.
-   Shipping and return costs.
-   Clear procedure for delays and support.

### Business credibility

-   Working WhatsApp and Instagram links.
-   Consistent business identity and contact details.
-   Authentic customer reviews with permission.
-   Privacy notice describing how enquiry details are used.

If a detail is unverified, omit it or ask the customer to confirm with
Virustra. Do not replace missing information with unsupported
reassurance.

## 16. Measurement plan

Track: - `view_collection` - `view_product` - `click_whatsapp` -
`enquiry_confirmed` - `rental_confirmed` (only when confirmed by the
business)

Monitor: - Hero CTA click rate. - Collection visits. - Product detail
views. - WhatsApp clicks per product view. - Qualified enquiry rate. -
Enquiry-to-confirmed-rental rate. - Lost enquiry reasons. - Mobile
performance.

Do not infer a confirmed booking from a WhatsApp click. Set numeric
targets after a real baseline exists.

## 17. Developer-ready CSS tokens

``` css
:root {
  --color-wine: #650D17;
  --color-oxblood: #3A0B12;
  --color-gold: #C9A56A;
  --color-ivory: #F7F0E6;
  --color-cream: #FFFCF7;
  --color-sand: #DCC9B5;
  --color-cocoa: #806A64;
  --color-ink: #301014;
  --color-error: #A12A35;
  --color-success: #2F684A;

  --color-page: var(--color-ivory);
  --color-surface: var(--color-cream);
  --color-text: var(--color-ink);
  --color-text-muted: var(--color-cocoa);
  --color-primary: var(--color-wine);
  --color-primary-text: #FFFFFF;
  --color-border: var(--color-sand);
  --color-focus: var(--color-wine);

  --font-display: "Cormorant Garamond", Georgia, serif;
  --font-body: "Manrope", Arial, sans-serif;

  --text-display: clamp(3.25rem, 7vw, 5.5rem);
  --text-h1: clamp(2.375rem, 5vw, 3.25rem);
  --text-h2: clamp(2rem, 4vw, 2.5rem);
  --text-h3: clamp(1.5rem, 2.5vw, 1.75rem);
  --text-body: 1rem;
  --text-small: 0.875rem;
  --text-label: 0.75rem;

  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-3: 0.75rem;
  --space-4: 1rem;
  --space-5: 1.25rem;
  --space-6: 1.5rem;
  --space-8: 2rem;
  --space-12: 3rem;
  --space-16: 4rem;
  --space-20: 5rem;
  --space-24: 6rem;

  --container-max: 90rem;
  --page-gutter: clamp(1rem, 5vw, 4.5rem);
  --grid-gap: 1.5rem;
  --section-space: clamp(3.5rem, 8vw, 6rem);

  --radius-sm: 2px;
  --radius-md: 4px;
  --radius-lg: 8px;

  --duration-fast: 180ms;
  --duration-base: 320ms;
  --duration-reveal: 650ms;
  --duration-editorial: 900ms;
  --duration-cinematic: 1200ms;

  --ease-standard: cubic-bezier(.2, .7, .2, 1);
  --ease-cinematic: cubic-bezier(.76, 0, .24, 1);
  --ease-out: cubic-bezier(.16, 1, .3, 1);
}

body {
  margin: 0;
  background: var(--color-page);
  color: var(--color-text);
  font-family: var(--font-body);
  font-size: var(--text-body);
  line-height: 1.65;
}

h1, h2, h3, .display {
  font-family: var(--font-display);
  font-weight: 500;
  line-height: 1.05;
}

.container {
  width: min(calc(100% - 2 * var(--page-gutter)), var(--container-max));
  margin-inline: auto;
}

.button {
  min-height: 48px;
  padding: .875rem 1.25rem;
  border: 1px solid var(--color-primary);
  border-radius: var(--radius-sm);
  background: var(--color-primary);
  color: var(--color-primary-text);
  font: 600 .875rem/1.2 var(--font-body);
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: .75rem;
  text-decoration: none;
  transition:
    transform var(--duration-base) var(--ease-standard),
    background-color var(--duration-base) ease;
}

.button:hover { transform: translateY(-2px); }

.button:focus-visible,
a:focus-visible,
button:focus-visible {
  outline: 3px solid var(--color-focus);
  outline-offset: 3px;
}

@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    scroll-behavior: auto !important;
    animation-duration: .01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: .01ms !important;
  }
}
```

This is the base token layer, not a complete production stylesheet.
Integrate the actual logo, product data, component states, responsive
image handling, and JavaScript animation timelines separately.

## 18. Final design sign-off checklist

Use this list with the client and development team.

-   [ ] Existing logo retained without distortion.
-   [ ] Core colour palette and font pair approved.
-   [ ] Desktop and mobile grid rules agreed.
-   [ ] Rental and sale product-card states defined.
-   [ ] Starting prices and product information verified.
-   [ ] WhatsApp enquiry flow and business number confirmed.
-   [ ] Hero motion approved with reduced-motion fallback.
-   [ ] Keyboard navigation and contrast tested.
-   [ ] Image loading and mobile performance tested.
-   [ ] Rental terms and nationwide fulfilment information verified.

## 19. Release acceptance checklist

### Brand and visual

-   [ ] Logo matches supplied source asset.
-   [ ] Maroon, gold, ivory, and supporting colours use the defined
    tokens.
-   [ ] Fonts load with suitable fallbacks.
-   [ ] Product images have consistent cropping and truthful colours.
-   [ ] Desktop and mobile layouts follow the grid rules.

### UX and content

-   [ ] Rental and sale are labelled distinctly.
-   [ ] Prices are real and correctly described as starting prices.
-   [ ] Product measurements and availability are not fabricated.
-   [ ] Rental process and terms are visible before commitment.
-   [ ] WhatsApp messages contain product context and event date where
    supplied.
-   [ ] A WhatsApp click is never treated as a confirmed reservation.

### Motion and accessibility

-   [ ] Intro is short and does not block the page.
-   [ ] Reduced-motion preference is respected.
-   [ ] Keyboard focus is visible.
-   [ ] Navigation and accordions work without a pointer.
-   [ ] Essential content remains available if JavaScript fails.
-   [ ] No scroll hijacking or excessive pinned scenes.
-   [ ] Motion and image loading tested on mobile.

### Operations and launch

-   [ ] WhatsApp business number verified.
-   [ ] Nationwide service coverage and delivery/return rules verified.
-   [ ] Policies reviewed by the business.
-   [ ] Privacy notice and customer data handling checked.
-   [ ] Real product imagery and inventory connected.
-   [ ] Analytics events tested.
-   [ ] Enquiry-to-confirmed-rental tracking process defined.

## 20. Final direction

Virustra's Royal Editorial system should feel recognisably Indian,
premium, and fashion-led---not old-fashioned or overly decorative.

Keep maroon and gold as the identity, ivory as breathing space,
authentic garments as the hero, and cinematic motion as the signature.
The final website should make the customer want the look, understand the
rental or purchase options, trust the process, and know exactly how to
take the next step.

## 21. Revision 1.1 — changes made while building the concept (`index.html`)

| Change | Why |
|---|---|
| `color-gold` `#C9A56A` → **`#DAAF87`** | `#DAAF87` is the actual fill colour in `virustra logo.svg`, so the accent now matches the logo (the old value was an unverified guess). |
| New `color-gold-light` `#F0D5B4` | Highlights, thread head, hover fills on dark. |
| New `color-gold-deep` `#8A5A2E` | Gold for **text on ivory/cream**; about 5.2:1 contrast (gold on ivory fails AA, see §5). |
| New `color-night` `#1E0508` | Deeper cinematic base than oxblood for the hero, footer and occasions. |
| `color-cocoa` `#806A64` → `#6F5A54` | Secondary text now passes AA on ivory and cream. |
| Primary button on dark = **gold fill, night text** | Wine on oxblood has too little contrast. Wine fill remains the primary on light surfaces. |
| Logo only on dark surfaces | The logo is single-colour gold on transparent, so it disappears on ivory. Use it in the nav (once solid), the loader and the footer. |

### Signature motion language ("Needle & thread")
1. **Loader:** a gold thread stitches a ring round the logo, then 8 silk pleats lift away. It is skipped or sped up for returning visitors, and skipped under reduced motion.
2. **Arch reveals:** the jharokha arch is the image shape everywhere. Images open upward with a `clip-path` wipe.
3. **Cursor thread:** a gold silk thread with simple physics trails the pointer (desktop only).
4. **Scroll spine:** a needle slides down a thread along the right edge as the page scrolls.
5. **Occasions list:** a floating arch preview that tilts with pointer velocity.
6. **Rent / Buy toggle:** prices roll over; sale-only and rental-only items are labelled honestly.
7. **Footer wordmark:** a fisheye hover over the letters.

Libraries: GSAP 3.12 and ScrollTrigger (cdnjs) plus Lenis smooth scroll (jsDelivr). Everything else is hand-written.

### Revision 1.2
- **Display font:** Cormorant Garamond → **Bodoni Moda**, a high-contrast fashion Didone with a strong italic. Manrope stays for body and UI. Headline sizes were reduced about 15% because Bodoni runs wider.
- **Cursor:** the trailing thread became a **sewing needle that leaves a fading running stitch**. It is desktop-only, the native cursor stays visible, and it is disabled under reduced motion.
- **Scroll scenes (Apple-style, pinned and scrubbed):**
  1. *The Reveal:* an arch grows to a full-bleed image while "Rent it for the night. / Keep it for life." parts, then the headline resolves (about 2.4 viewport heights).
  2. *Chapters:* the four occasions wipe into one another inside a pinned stage, with outlined type drifting behind them (about 4.4 viewport heights).
  Only these two scenes pin. Under `prefers-reduced-motion`, or without JS, both fall back to static stacked sections. This is a deliberate exception to the "avoid long pinned scenes" rule in §10 and §11.
- **Photography:** studio-style, full-length garment shots (plain or editorial backdrops) from licensed Unsplash sources. Do not copy imagery from other brands' sites. Replace every photo with real Virustra inventory before launch.

### Revision 1.3 (index-v2.html, from REF-01 House of Masaba)
- **Switchable fonts:** Editorial (Bodoni Moda + Manrope), Modern (Montserrat + Urbanist, Masaba's pairing), Classic (Cormorant + Manrope). Footer and nav labels use `--font-foot` (Montserrat).
- **Switchable themes:** Royal Maroon (default), Noir (black-green + red, Masaba-like), Emerald Heritage. All colours are CSS variables, including RGB triplets (`--night-rgb`, `--gold-rgb`, `--ivory-rgb`, `--wine-rgb`) for translucent layers.
- **Sale colours:** `--sale` (red) and `--sale-bar` (offer bar). Sale is red everywhere: nav link, badges, countdown banner, Sale tab.
- **Accessibility panel:** font, theme, text size (4 steps), high contrast, reduce motion.
- **Categories:** Women / Men / Kids across the nav, hero carousel, shop-by-who panels and product filter.
- **Footer:** now light, with an atelier photo band and directory columns; the giant wordmark was dropped.
- **Honesty rule still applies:** all offers, prices and discounts in the demo are samples (marked `*`).
