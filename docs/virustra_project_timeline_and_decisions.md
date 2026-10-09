# VIRUSTRA --- Project Conversation Timeline & Decision Log

**Document purpose:** A chronological record of the conversation,
decisions, assumptions, and next steps for the Virustra website
project.\
**Status:** Royal Editorial design direction approved; detailed design
system documented; production implementation not yet completed.

> This timeline summarises the conversation and decisions. It is not a
> record of verified sales analytics or an external audit of Virustra's
> operations.

------------------------------------------------------------------------

## Timeline at a glance

1.  Business niche identified.
2.  Reference website and brand direction discussed.
3.  Customer research and UX strategy outlined.
4.  Business details confirmed by the user.
5.  Three visual directions proposed.
6.  Three HTML/CSS/JavaScript concept prototypes created.
7.  Royal Editorial selected.
8.  Detailed design system and sign-off checklist prepared.

## Stage 1 --- Business niche

### User context

The user described Virustra as a boutique renting cholis and shared the
Instagram profile.

### Working niche definition

**Modern Indian ethnic occasionwear boutique offering rental and sale.**

The early positioning was "Luxury Indian Ethnic Wear Rental & Occasion
Styling," but later details clarified that the business sells as well as
rents different products.

### Initial audience hypotheses

-   Women looking for occasionwear for weddings.
-   Customers seeking outfits for Garba and festivals.
-   Customers dressing for engagements and celebrations.
-   Fashion-conscious customers interested in variety without buying
    every outfit.

These were research hypotheses, not verified customer demographics.

## Stage 2 --- Visual inspiration and brand direction

### User preference

The user liked the animation, splash/hero introduction, and whole-page
design of: - https://mahira2.netlify.app/

The user wanted to develop the website first with HTML, CSS, and
JavaScript, potentially using animation libraries such as Framer Motion
or similar.

### Initial design direction

The project was framed as a premium, fashion-editorial website with: - A
cinematic intro. - Strong hero photography. - Collection-led browsing. -
Product detail and trust content. - WhatsApp/Instagram enquiry. - Motion
that supports rather than obstructs conversion.

### Reference-site note

Mahira was treated as visual inspiration, not as a template to copy. Its
editorial presentation should be adapted to Virustra's rental and sale
journey.

## Stage 3 --- Customer research and UX strategy

A strategy was developed around: - ICP hypotheses. - Customer
motivations and anxieties. - Availability, fit, hygiene, pricing,
delivery, and rental-policy concerns. - A journey from discovery to
product exploration, enquiry, confirmation, and fulfilment. - Navigation
and sitemap. - Homepage sections. - Product detail structure. - Footer
and support content. - Conversion copy. - Animation and accessibility.

### Key customer journey

1.  Discover Virustra.
2.  Explore the collection.
3.  Evaluate style, fit, price, and rental terms.
4.  Enquire on WhatsApp.
5.  Virustra confirms availability and terms.
6.  Customer follows the agreed fulfilment and return process.

### Important operational distinction

A WhatsApp click is an enquiry, not a confirmed booking. The interface
must distinguish enquiry, availability confirmation, and final rental
confirmation.

## Stage 4 --- Confirmed business details

The user supplied these details for the UX strategy:

  Field                     Confirmed detail
  ------------------------- -----------------------------------------
  Service area              India
  Inventory                 Cholis and other ethnic outfits
  Rental price display      Starting price
  Primary enquiry channel   WhatsApp
  Main occasions            Weddings, Garba, festivals, engagements

### Implications

-   The design must support both rental and sale.
-   Product cards must clearly distinguish "Rent from" and "Buy from."
-   Prices should be real and verified.
-   WhatsApp should be the primary conversion path.
-   Nationwide fulfilment information is important, but exact pin-code
    coverage, courier operations, delivery timing, and return logistics
    still need validation.

## Stage 5 --- Initial design-system directions

Three design concepts were proposed:

### Option 01 --- Royal Editorial

-   Deep wine and oxblood.
-   Antique gold and warm ivory.
-   Cormorant Garamond + Manrope.
-   Cinematic, dramatic, high-end animation.
-   Premium fashion-editorial tone.

### Option 02 --- Modern Festive

-   Fuchsia, aubergine, marigold, and blush.
-   Playfair Display + DM Sans.
-   More colourful, energetic, youthful motion.

### Option 03 --- Contemporary Atelier

-   Charcoal, ivory, terracotta, brass, and sage.
-   Libre Baskerville + Inter.
-   Minimal, restrained, understated luxury.

The existing logo and Instagram profile were supplied as brand context.
The logo uses a circular maroon emblem and gold Devanagari lettering;
the Instagram grid includes vivid ethnic outfits and garment-detail
imagery.

## Stage 6 --- HTML/CSS/JavaScript prototypes

Three concept HTML files were generated:

1.  `virustra_option_royal_editorial.html`
2.  `virustra_option_modern_festive.html`
3.  `virustra_option_contemporary_atelier.html`

A ZIP was also generated: - `virustra_three_design_concepts.zip`

The prototypes include concept layouts for: - Navigation. - Hero
section. - Product cards. - Occasion tiles. - "How renting works"
steps. - Closing WhatsApp CTA. - Basic scroll-reveal animation.

### Prototype caveats

-   The imagery is illustrative external stock imagery, not verified
    Virustra inventory.
-   Prices are placeholders, not real prices.
-   WhatsApp links use a placeholder destination and need the approved
    business number.
-   These files are design prototypes, not a production rental booking
    system.
-   External fonts and images require internet access.

## Stage 7 --- Royal Editorial approved

The user confirmed:

-   **Client preference:** Option 01 --- Royal Editorial.
-   **Animation style:** Cinematic, dramatic, high-end.
-   **Palette preference:** Maroon and gold as core brand colours.

This is the current approved direction.

## Stage 8 --- Detailed design system prepared

The design-system document defines:

### Colour tokens

-   Deep Wine: `#650D17`
-   Oxblood: `#3A0B12`
-   Antique Gold: `#C9A56A`
-   Warm Ivory: `#F7F0E6`
-   Soft Cream: `#FFFCF7`
-   Sand: `#DCC9B5`
-   Muted Cocoa: `#806A64`
-   Editorial Ink: `#301014`
-   Error Red: `#A12A35`
-   Success Green: `#2F684A`

These are proposed website tokens, not verified pixel extractions from
the logo.

### Typography

-   Display: Cormorant Garamond.
-   Body/UI: Manrope.

### Layout

-   Desktop: 12-column grid.
-   Tablet: 8-column grid.
-   Mobile: 4-column grid.
-   Main content max width: 1440 px.
-   Product image ratio: generally 4:5.

### Motion

-   GSAP proposed for the hero timeline and more expressive image
    transitions.
-   CSS transitions and `IntersectionObserver` proposed for simpler
    effects.
-   Reduced-motion support and non-blocking content are requirements.

### Accessibility

-   WCAG AA contrast targets.
-   Keyboard navigation and visible focus.
-   Semantic structure.
-   Reduced-motion support.
-   Responsive image handling and performance checks.

### UX

-   Homepage, collection, product details, rental guide, FAQs,
    about/contact, and policies.
-   Product pages should show real images, prices, sizes/measurements,
    and applicable rental terms.
-   WhatsApp should receive product and event-date context when
    available.
-   A click to WhatsApp must not be mistaken for a completed
    reservation.

## Current decisions

  -----------------------------------------------------------------------
  Decision                            Status
  ----------------------------------- -----------------------------------
  Business niche                      Modern Indian occasionwear
                                      boutique, rent and shop

  Main occasions                      Weddings, Garba, festivals,
                                      engagements

  Service area                        India

  Primary enquiry                     WhatsApp

  Price display                       Starting price

  Visual direction                    Royal Editorial

  Core palette                        Maroon and gold

  Motion tone                         Cinematic, dramatic, high-end

  Existing logo                       Preserve original artwork

  Production stack                    HTML/CSS/JavaScript planned; GSAP
                                      recommended for complex motion
  -----------------------------------------------------------------------

## Open questions and unverified details

These should be confirmed before production launch:

-   [ ] Approved WhatsApp business number.
-   [ ] Real starting rental prices and sale prices.
-   [ ] Product names, photographs, available sizes, measurements, and
    stock.
-   [ ] Which products are rental-only, sale-only, or both.
-   [ ] Rental duration and deposit/payment rules.
-   [ ] Cancellation, late-return, damage, and return policies.
-   [ ] Nationwide service coverage and delivery/return timelines.
-   [ ] Courier partners, shipping cost, and reverse logistics.
-   [ ] Fitting and alteration options.
-   [ ] Authentic customer reviews and permission for customer photos.
-   [ ] Final logo file quality, font licensing, and approved image
    assets.
-   [ ] Analytics and process for recording confirmed rentals.

## Recommended next steps

### Phase 1 --- Verify content and operations

1.  Gather the actual inventory and product images.
2.  Confirm starting prices and sale/rental options.
3.  Confirm rental terms, delivery coverage, and return process.
4.  Verify the business WhatsApp number.
5.  Collect common customer questions and enquiry objections.

### Phase 2 --- Finalise visual design

1.  Confirm logo use and font loading.
2.  Apply the Royal Editorial colour tokens.
3.  Create homepage and product-detail wireframes.
4.  Review desktop and mobile layouts with the client.
5.  Approve animation storyboard and reduced-motion behaviour.

### Phase 3 --- Build the website

1.  Implement semantic HTML structure.
2.  Build responsive CSS and shared components.
3.  Add the GSAP hero timeline and selected motion.
4.  Add product/occasion browsing and real content.
5.  Implement WhatsApp message generation.
6.  Add rental FAQs and policies.
7.  Test keyboard access, contrast, reduced motion, and mobile
    performance.

### Phase 4 --- Launch validation

1.  Test all product links and WhatsApp messages.
2.  Confirm all prices and policies.
3.  Test delivery/return wording for nationwide customers.
4.  Track product views, WhatsApp clicks, qualified enquiries, and
    confirmed rentals.
5.  Use real enquiry data to refine copy and UX after launch.

## Source-of-truth note

This timeline records the facts and decisions shared in the
conversation. The customer personas and design recommendations are
working hypotheses and proposed design choices. The inventory, prices,
fulfilment details, reviews, and business policies have not been
independently verified and must be confirmed by Virustra before they are
published.
