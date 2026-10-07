# Long Realty — Architectural Gallery

A cinematic React portfolio concept for Long Realty, with midnight blue surfaces, signal yellow accents, oversized editorial typography, and the original scroll-controlled video hero.

## Run locally

```sh
npm ci
npm run dev
```

## Production build

```sh
npm run lint
npm run build
npm run preview
```

## Experience

- Kinetic GSAP opening sequence with masked typography, counter, and three staggered shutters.
- Preserved original video asset and pinned playback/final-frame hold, with smoothed, coalesced video seeks.
- Oversized masked headings, blue glass navigation, a full-screen editorial menu, and a contextual yellow cursor on fine-pointer devices.
- Featured listing carousel and two-column property grid, with mobile navigation, pause controls, and locally saved favorites.
- Property and adviser inquiries prefill the contact form.
- Layered, selectable adviser portraits and service accordion.
- Editorial stories open in keyboard-accessible dialogs.
- IntersectionObserver section reveals, restrained magnetic interaction, and reduced-motion alternatives.
- All in-page property, editorial, and service photos are bundled under `public/assets`; source URLs are recorded in `photo-sources.json`.
- Adviser portraits are AI-generated illustrations of fictional people.

The site is an independent portfolio concept, not a live brokerage service. Properties and advisers are illustrative. The inquiry form demonstrates the interface and does not send messages. Sunny uses local scripted responses and does not connect to an AI or CRM service. Google Translate and Google Fonts require access to their external services.

## Styling and content

`src/experience.css` defines the base visual system; `src/mosaicist.css` applies the architectural gallery edition and its responsive layouts. The earlier `src/premium.css` is retained as inactive source history. Property, adviser, service, and editorial content is stored in `src/data`.

Read [the design blueprint](docs/DESIGN_BLUEPRINT.md) for the palette, typography, preloader timeline, scroll mechanics, section-by-section source map, and validation limits.

The existing components for unused sections remain in the source for reference; the active homepage sequence is defined in `src/App.jsx`.

## Mosaicist-inspired edition

Full-bleed architectural manifesto, a centered minimal header, panoramic residence presentation, native-scroll service chapters with a sticky photographic stage, and a monumental closing invitation. The original hero film and scrub mapping remain unchanged. See [the reference translation](docs/MOSAICIST_DIRECTION.md).
