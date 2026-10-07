# Long Realty / Architectural Gallery

Reference: https://www.mosaicist.com/ (studied October 7, 2026).

This edition translates Mosaicist's photographic scale and editorial sequencing into a Southern Arizona real estate concept. It uses Long Realty's existing assets and copy written for this experience; Mosaicist's imagery, logo, source code, and written content are not copied.

## Design read

- **Artifact:** narrative real estate homepage, for people exploring homes and local advisers.
- **Mode:** redesign with preservation of the original hero film, pinned playback, two-viewport final-frame hold, brand palette, sections, and existing inquiry/listing capabilities.
- **Visual language:** architectural photography paired with oversized sans-serif statements and expressive serif phrases.
- **Dials:** visual variance 7/10, motion intensity 6/10, information density 4/10, asset dependence 9/10, brand fidelity 9/10.
- **Viewing distance:** laptop and mobile. The opening establishes place; the collection supports decisions; services explain guidance; contact closes the story.
- **Temperature:** immersive, assured, personal. No new brand colors or speculative services are introduced.

## Reference translation

| Reference idea                                                    | Long Realty implementation                                                                                                                             |
| ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| A film-led opening with typography concentrated at its lower edge | Original hero video; left-aligned two-line statement and a separate right-hand invitation                                                              |
| Minimal centered identity and small corner controls               | Centered existing wordmark, compact grid menu mark, language selector, and full-screen navigation index                                                |
| Large prose occupying an architectural photograph                 | Full-bleed Southern Arizona manifesto with yellow serif emphasis and a local-adviser entry point                                                       |
| Photography as an immersive project canvas                        | Panoramic selected residence; details aligned across the lower edge; single/grid browsing remains                                                      |
| A visual service sequence                                         | Buying, selling, and relocating chapters. Native scroll selects the active photograph in a sticky stage; direct chapter controls are keyboard-operable |
| Oversized closing invitation                                      | “Make room / for what’s next.” above a clear inquiry form                                                                                              |

## Palette and typography

Midnight canvas `#051523`, deeper blue `#03111D`, blue panel `#0A2132`, warm white `#F5F3EB`, slate `#A9B7C4`, signal yellow `#F8D34E`. Yellow marks decisions, selected words, chapter indices, and primary actions. It is not a whole-page background.

Inter Tight is the compact display and reading face; Cormorant Garamond provides italic emphasis and service titles. Layouts use sharp edges, small translucent controls, hairline divisions, and 32px desktop/20px mobile margins. Photography provides depth rather than decorative gradients.

## Source structure

- `src/mosaicist.css`: the edition's visual composition and responsive overrides, loaded after the base design system.
- `src/components/AboutSection.jsx`: architectural manifesto.
- `src/components/FeatureServices.jsx`: scroll-selected service chapters, IntersectionObserver, sticky image stage, mobile per-chapter photography.
- `src/components/Navbar.jsx`: centered identity and geometric menu control.
- `src/components/TrendingProperties.jsx`: panoramic property summary/details layout and retained interactions.
- `src/components/ContactSection.jsx`: monumental closing statement and retained inquiry form.
- `src/hooks/useVideoScrub.js`: unchanged preserved hero scroll mapping.
- `src/components/Loader.jsx`: retained kinetic opening sequence.

## Responsive and motion behavior

The service image stage uses CSS sticky positioning and opacity/transform crossfades. It does not introduce another pinned scroll timeline. All service descriptions remain in the document. On mobile, each chapter contains its own image; the sticky stage is removed. Reduced motion removes crossfade and zoom transitions. Controls preserve keyboard focus, pressed states, and descriptive labels.

The residence's overlaid details move below its photo on mobile. Grid view remains available. The contact statement reduces proportionally at small widths. Existing adviser selection, saved homes, story dialogs, inquiry prefills, and local demo form behavior remain.

## Brand assets

The existing Long Realty wordmark treatment is preserved. All residence, journal, and service photographs remain local under `public/assets`, as does the original `hero-video.mp4`. Existing portrait illustrations represent fictional advisers. Photo sources are recorded in `public/assets/photo-sources.json`.

The website remains an independent portfolio concept; listings, advisers, and the inquiry experience are illustrative.
