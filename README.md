# Long Realty — Website

A premium, GSAP-animated one-pager for Long Realty (Tucson, AZ), built with React 19 + Vite + Tailwind CSS.

## Getting started

```bash
npm install
npm run dev
```

Then open the printed local URL (usually http://localhost:5173).

To build for production:

```bash
npm run build
npm run preview
```

## Stack

- React 19 + Vite
- Tailwind CSS — architectural, rectangular design language (no rounded corners on buttons/cards/panels/forms/images; true circular UI — icon toggles, avatars — kept where it reads as a shape rather than a "corner")
- GSAP + `@gsap/react` (+ ScrollTrigger) for the loader, hero fade/slide reveal, horizontal Search/Buy/Sell pin-scroll, mega menu, and section reveals
- Framer Motion available for future micro-interactions
- React Icons for iconography
- React Router installed and ready for a future multi-page build

## Homepage order

Hero → Search Panel (tabbed) → New Listings → About → Video → Horizontal Services →
Feature Services → Find an Expert (+ Careers) → What We Offer → Contact →
Long Realty App → Latest Posts → Quick Links → Footer

## Structure

```
src/
  components/
    ui/                Button, Card, Container, Heading — shared primitives
    Loader.jsx           Fullscreen preloader (0→100%)
    Navbar.jsx            Logo, language selector, Login/Sign Up, mega menu
    LanguageSelector.jsx   Custom UI driving a real Google Translate widget
    SunnyAssistant.jsx      Floating AI chat assistant (placeholder replies, ready for a backend)
    Hero.jsx                Fade/slide title + independent image reveal
    SearchPanel.jsx          Tabbed: Find A Home / Sell My Home / Home Value Calculator
    TrendingProperties.jsx    "New Listings" — single (auto-advancing) + grid views, View All CTA
    AboutSection.jsx
    VideoSection.jsx           Right-aligned promo video placeholder
    HorizontalServices.jsx      Pinned horizontal-scroll Search / Buy / Sell
    FeatureServices.jsx          Glass cards over a night photograph
    FindExpert.jsx                 Orbit-inspired stacked agent cards + Careers strip
    WhatWeOffer.jsx                 Auto-rotating panel: OnePoint / Military Relocation / Networks
    ContactSection.jsx
    LongRealtyApp.jsx                Mobile app promo, App Store / Google Play
    BlogSection.jsx                   "Latest Posts"
    QuickLinks.jsx                     Market Trends / Luxury Digital Magazine
    Footer.jsx
  data/                 Content arrays (properties, agents, posts, offer services, partners, megaMenu)
  hooks/                useMagnetic (magnetic buttons)
  index.css             Base styles, glass utilities, marquee keyframes
```

## Notes

- All imagery is sourced from Unsplash via URL as a placeholder — swap the URLs in `src/data/*.js` and the per-component image constants for real photography before launch.
- The Home Value Calculator and Sell My Home tab both use placeholder/demo logic — swap in a real valuation API and CRM endpoint respectively.
- `LanguageSelector.jsx` loads the real Google Translate website widget (`useGoogleTranslate` hook) and drives it from our own styled dropdown — the raw Google UI is hidden via `.goog-te-*` overrides in `index.css`. It degrades gracefully to an inert selector if the script can't load.
- `SunnyAssistant.jsx` uses a local `getAssistantReply()` placeholder — swap that one function for a real API call to connect a backend; the chat UI and state don't need to change.
- Respects `prefers-reduced-motion` throughout.
