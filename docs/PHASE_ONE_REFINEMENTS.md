# Phase one refinements / October 11, 2026

The upper-page refinements preserve the original video asset, playback distance, and two-viewport end hold. The properties composition and its single/grid, save, slideshow, and inquiry controls remain. The remaining lower sections are retained for a later design pass.

- Brand accent: `#F4BA51`. Fonts: Instrument Sans and Instrument Serif.
- Header search: right half of the desktop viewport, ending at the centered wordmark; translucent white with background blur. Native dialog focus containment, Escape dismissal, close control, backdrop dismissal, focus restoration, and scroll lock. Mobile uses the full width so fields remain usable.
- Header menu: matching left-half glass panel, using the existing section links.
- Search: original location, property type, and price fields; all seller fields; property address and selling timeline for valuation. Home search filters the four illustrative local listings and opens a selected residence. Seller and valuation actions prepare the existing local inquiry form; no live MLS, valuation API, or message transmission is added.
- Hero action: transparent circular “View our collection” link with a 1pt white ring at 50% opacity. A yellow quarter arc completes on hover, focus, and press.
- Sunny: hidden while the hero is on screen; appears only once the hero has fully scrolled out. Returning to the hero hides the launcher and chat while retaining the conversation state.
- Hero end: use the existing two-viewport hold for a narrow bottom-origin rectangle that rises to full height, then expands sideways. The completed panel and description share `#1B243B`.
- Description: centered Instrument Sans statement, initially white at 50% opacity. Scroll progressively reveals a yellow layer across the words. Adviser link uses the same understated text-link style as “Explore all homes.” The previous yellow button and accompanying copy are removed.
- Film interlude: “Room to / be you.” removed from the active page.
- Services: three horizontal Buying/Selling/Relocating panels on solid `#2F72C8`. Desktop vertical scroll drives a pinned horizontal track. Chapter controls jump to corresponding positions. Mobile and reduced motion use native horizontal scrolling with snap points and the same chapter controls. Offscreen chapter links are excluded from keyboard focus.

## Source map

- `src/refinements.css`: scoped layout and interaction refinements, loaded after the prior edition.
- `src/components/Navbar.jsx`, `SearchOverlay.jsx`: half-width glass overlays and restored fields.
- `src/components/Hero.jsx`, `src/hooks/useVideoScrub.js`: circular action and end-of-film transition.
- `src/components/AboutSection.jsx`: centered scroll-fill description.
- `src/components/FeatureServices.jsx`: horizontal service experience.
- `src/App.jsx`, `src/components/SunnyAssistant.jsx`: hero-dependent assistant visibility and page sequence.

## Validation

Production build and component checks cover the restored field groups, local listing filters, selected-property navigation, draft inquiry prefills, dialog opening/dismissal and focus restoration, horizontal chapter controls, assistant visibility, the preserved property controls, page structure, asset paths, and video distance/frame calculations.

Browser visual QA and a frame-rate profile are unavailable in this environment. Component checks use a DOM harness; they do not establish native dialog focus trapping, actual scroll animation feel, or cross-device visual accuracy. Reduced motion removes the expanding background and text-fill motion, shows the finished yellow description, and enables ordinary horizontal service browsing.
