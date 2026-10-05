# Long Realty — Editorial Real Estate Concept

A responsive React portfolio concept for Long Realty, with deep navy surfaces, warm yellow accents, editorial typography, and a scroll-controlled video hero.

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

- Preserved GSAP video hero with revised copy and search entry point.
- Featured listing carousel and two-column property grid, with mobile navigation, pause controls, and locally saved favorites.
- Property and adviser inquiries prefill the contact form.
- Layered, selectable adviser portraits and service accordion.
- Editorial stories open in keyboard-accessible dialogs.
- IntersectionObserver section reveals, restrained magnetic interaction, and reduced-motion alternatives.
- All in-page property, editorial, and service photos are bundled under `public/assets`; source URLs are recorded in `photo-sources.json`.
- Adviser portraits are AI-generated illustrations of fictional people.

The site is an independent portfolio concept, not a live brokerage service. Properties and advisers are illustrative. The inquiry form demonstrates the interface and does not send messages. Sunny uses local scripted responses and does not connect to an AI or CRM service. The hero controls do not query a live MLS. Google Translate and Google Fonts require access to their external services.

## Styling and content

`src/premium.css` defines the visual system and responsive layouts. Tailwind tokens are in `tailwind.config.js`. Property, adviser, service, and editorial content is stored in `src/data`.

The existing components for unused sections remain in the source for reference; the active homepage sequence is defined in `src/App.jsx`.
