# Modasquare

Interactive prototype for a high-end streetwear store. Structure, hierarchy and
flow only: every visual slot is a declared wireframe frame with an explicit
aspect ratio, so real photography can drop in later without moving anything.

```bash
npm install
npm run dev      # http://localhost:3000
npm run build    # production build
npm test         # Playwright, 143 specs across 390 / 768 / 1280
```

## Stack

Next.js 16 App Router, React 19, Tailwind v4, Motion, Phosphor icons, Playwright.

Pages are Server Components. Client code is confined to five islands: the cart
provider, the drawer, the search overlay, the PLP filter rail and the PDP
purchase panel. Nothing else ships JavaScript.

## Routes

| Route | Rendering | Notes |
| :--- | :--- | :--- |
| `/` | static | Editorial hero, discovery grid, featured drop, atelier note |
| `/[category]` | dynamic | `women`, `men`, `teen`. Dynamic because it reads filter state from the query string |
| `/product/[slug]` | static, 26 paths | Split gallery and sticky purchase panel |
| `not-found` | static | Recovery page for any unknown address |

## Where the design system lives

`app/globals.css` is the single source of truth. Every colour, type step, radius,
easing curve and spacing value from `DESIGN.md` is registered in the `@theme`
block, and nothing in the app introduces a value that is not declared there. A
grep of the whole tree returns ten hex values (the six brand tokens plus four
documented dark-mode derivations) and exactly one corner radius.

Two decisions worth stating, because they cut against a default:

- **Accent discipline.** Deep Ochre on Atelier Alabaster measures 3.63:1. That
  clears the 3:1 bar for icons, rules and focus rings and misses the 4.5:1 bar
  for text. So ochre is used for focus rings, the shipping-complete tick, error
  glyphs and the "Just in" border, and never for a label. Hover states resolve
  toward ink, which raises contrast rather than lowering it.
- **Serif choice.** `DESIGN.md` offers three display serifs. Cormorant Garamond
  is the one taken: the project's taste skill rules Fraunces out by name, and
  Editorial New is not openly licensed.

## State

The cart is the only global store, in `components/cart/cart-provider.tsx`. It
persists to `localStorage` after mount rather than during render, so the server
and the first client paint agree on the badge count.

PLP filters and grid density live in the URL, not in component state
(`lib/filters.ts`). A filtered view is a real address: shareable, bookmarkable,
and restored intact by the Back button. The rail writes the query string, the
Server Component reads it back and renders the result, so the controls and the
grid cannot drift apart.

## Motion

Restrained, and compositor-only. Transform and opacity are the only animated
properties anywhere; no layout property is ever animated, which is why the PDP
disclosure panels appear at their final height and only fade their contents.

Scroll reveals are CSS scroll-driven animations, not JavaScript. The first
version used Motion's `whileInView`, which writes its initial state into the
server HTML as `style="opacity:0"`: four sections of the site were one failed
JS request away from being invisible, with the markup itself doing the hiding.
The CSS version renders opaque and layers the animation on top, so it degrades
to readable content in all three failure directions (no browser support,
reduced motion, a page too short to produce an active timeline).

## Tests

`npm test` runs 143 specs against three viewport projects: 390, 768 and 1280.

Beyond the flows in the brief, the suite asserts the things that are easy to
regress: no horizontal overflow on any route at any width (before and after
scrolling to the footer), cumulative layout shift under 0.1 on load, no shift at
all when the drawer opens, the filter rail pinned flush under the header, focus
returning to the trigger when a dialog closes, and every interactive target
clearing 24px.

Three real bugs came out of writing them:

1. The filter panel expanded a row in the document flow. It closed on
   `pointerdown`, so everything below it jumped up before the click resolved and
   the press landed on whatever slid into its place. It is now an overlay.
2. Grids without an explicit base column track default to `auto`, which sizes to
   max-content. The horizontal snap rails inflated the document to 1212px on a
   390px screen instead of scrolling inside themselves.
3. The drawer filled the whole viewport at 390px, leaving no scrim to tap. It
   now leaves a visible sliver.

## Known gaps

There is no backend. Add-to-bag and the newsletter sign-up resolve against short
timers and are labelled as such in the source. Client-care and footer links
point at `/women` as a stand-in. `FREE_SHIPPING_THRESHOLD` and the catalogue are
static data in `lib/catalog.ts`.
