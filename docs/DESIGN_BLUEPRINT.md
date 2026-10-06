# Desert Modern, After Dark

A cinematic real estate experience for Long Realty. The composition draws on desert architecture: dark expanses, precise yellow lines, asymmetry, and photography framed as an editorial collection. Motion uses one consistent vocabulary—masked typography, measured reveals, weighted pointer feedback, and the original scroll-controlled film.

## Brand system

| Token         | Color     | Usage                                              |
| ------------- | --------- | -------------------------------------------------- |
| Midnight      | `#061524` | Main canvas, loader, navigation                    |
| Deep midnight | `#03101C` | Alternate sections and footer                      |
| Blue glass    | `#0B2033` | Property panels, menus, dialogs                    |
| Elevated blue | `#123049` | Selected surfaces and secondary controls           |
| Signal yellow | `#F8D34E` | Primary actions, italic emphasis, counters, cursor |
| Warm white    | `#F5F3EB` | Primary reading and display text                   |
| Slate         | `#A9B7C4` | Supporting copy and metadata                       |

Dark blue remains the dominant background throughout. Yellow is concentrated in actions and selected words; photography provides natural warmth. Navigation uses translucent midnight with a restrained blur after scrolling. Dividers are hairline blue-white rather than heavy card borders.

## Typography and composition

- **Space Grotesk:** oversized display statements, counters, and strong structural type. Hero scale: 80–185px on desktop, responsive overrides on smaller screens.
- **Cormorant Garamond:** expressive italic phrases, property names, and navigation index. Yellow serif phrases soften the geometric headings.
- **Inter Tight:** readable body copy, metadata, navigation, and controls. Supporting copy typically 14–16px with generous line-height.
- A maximum 1320px content grid, asymmetric image/text columns, deliberately staggered property cards, and generous section spacing form the architecture.
- Full responsive layouts at 1100px, 767px, and 380px; interactions stay usable on touch screens.

## Eventful opening sequence

Full React/GSAP implementation: [`src/components/Loader.jsx`](../src/components/Loader.jsx). Styles: the “Opening” block in [`src/experience.css`](../src/experience.css).

| Time                    | Event                                                                                                      |
| ----------------------- | ---------------------------------------------------------------------------------------------------------- |
| 0–0.92s                 | Yellow “A new / perspective.” rises through two masks with staggered timing and a small rotational settle. |
| 0.15–0.63s              | Brand and location metadata appear.                                                                        |
| 0.10–1.40s              | A tabular counter advances smoothly from 000 to 094, paired with a fine yellow line.                       |
| Up to 0.40s additional  | If necessary, briefly wait for hero video data. An error or timeout also permits entry.                    |
| Next 0.22s              | Counter reaches 100.                                                                                       |
| Next 1.23s, overlapping | Typography exits upward; three architectural blue shutters lift with a 65ms stagger, uncovering the hero.  |

The counter represents **opening-sequence progress**, not network byte progress. The sequence lasts approximately 2.6–3.0 seconds; it does not wait indefinitely for video. Reduced motion uses a 150ms fade. The app temporarily locks scrolling and makes the underlying interface inert. Effects, media listeners, timers, and timelines are cleaned up on unmount.

## Hero and original scroll mechanic

The original `public/assets/hero-video.mp4` remains byte-identical:

```text
SHA-256 c7ed5e38d8a580196964a5fbdb2f531a393f9817893a406fd1bb978e0430546d
H.264 / 1280 × 720 / 24 fps / 8 seconds
```

The original relationship is retained: pin the hero, advance the film as the visitor scrolls, then hold the last frame for two viewport heights. [`src/hooks/useVideoScrub.js`](../src/hooks/useVideoScrub.js) implements:

```js
playbackDistance = Math.max(videoDuration * 180, viewportHeight * 1.5);
totalDistance = playbackDistance + viewportHeight * 2;
targetTime = Math.max(
  0,
  Math.min(
    videoDuration - 0.045,
    ((progress * totalDistance) / playbackDistance) * videoDuration,
  ),
);
```

GSAP ScrollTrigger smooths a proxy playhead with `scrub: 0.65`. A coalesced animation-frame loop performs seeks only when the decoder is available and the target differs by at least one 24fps frame. Seeking stops while the document is hidden. The final timestamp stays slightly before the end to avoid a terminal-frame flash. Distances are recalculated when the viewport changes, images load, or fonts settle. Copy fades gently during playback; an editorial final caption appears near the last frame.

Reduced motion removes pinning and scrubbing and displays a still frame. Preference changes rebuild the animation context. A bundled still photograph covers video failures. These are performance measures, not a claim of measured frame-rate performance on every device.

## Section architecture and complete source

The full page order is composed in [`src/App.jsx`](../src/App.jsx). The complete visual system is [`src/experience.css`](../src/experience.css); the earlier `premium.css` is retained as inactive source history.

| Chapter         | Design and behavior                                                                                    | Source                                                                                        |
| --------------- | ------------------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------- |
| Opening         | Kinetic title, sequence counter, architectural shutters                                                | [`Loader.jsx`](../src/components/Loader.jsx)                                                  |
| Navigation      | Floating wordmark; blue glass on scroll; oversized full-screen index with focus containment and Escape | [`Navbar.jsx`](../src/components/Navbar.jsx)                                                  |
| Hero            | Original film; asymmetric “A place / to belong.” composition; preserved pinned scrub                   | [`Hero.jsx`](../src/components/Hero.jsx), [`useVideoScrub.js`](../src/hooks/useVideoScrub.js) |
| Perspective     | Oversized manifesto, narrow architectural photograph, editorial footnotes                              | [`AboutSection.jsx`](../src/components/AboutSection.jsx)                                      |
| Residences      | Large selected-home composition; asymmetric grid; selection, pause, save, and inquiry actions          | [`TrendingProperties.jsx`](../src/components/TrendingProperties.jsx)                          |
| Film interlude  | “Room to be you.” with explicit play/pause and visibility-aware playback                               | [`VideoSection.jsx`](../src/components/VideoSection.jsx)                                      |
| The way forward | Interactive buying/selling/moving index paired with changing imagery                                   | [`FeatureServices.jsx`](../src/components/FeatureServices.jsx)                                |
| Your people     | Layered portrait orbit, adviser navigation, personal inquiry entry                                     | [`FindExpert.jsx`](../src/components/FindExpert.jsx)                                          |
| Beyond the keys | Service accordion and large supporting image                                                           | [`WhatWeOffer.jsx`](../src/components/WhatWeOffer.jsx)                                        |
| The local edit  | Editorial cards, reading dialogs, keyboard dismissal and focus restoration                             | [`BlogSection.jsx`](../src/components/BlogSection.jsx)                                        |
| Conversation    | Large “Let’s find / your next.” statement, concise form, inquiry prefills                              | [`ContactSection.jsx`](../src/components/ContactSection.jsx)                                  |
| Closing         | Minimal wordmark, navigation, concept disclosure                                                       | [`Footer.jsx`](../src/components/Footer.jsx)                                                  |

## Motion and interaction system

- [`useExperienceMotion.js`](../src/hooks/useExperienceMotion.js): intersection-triggered reveals, image masks, subtle desktop parallax, restrained magnetic buttons, dynamic reduced-motion support, and coalesced image-layout refreshes.
- [`CustomCursor.jsx`](../src/components/experience/CustomCursor.jsx): a direct yellow point and a weighted ring. Selected images and actions show contextual labels. Runs only on fine pointers with motion enabled; ordinary text cursors remain available in forms.
- [`ChapterTitle.jsx`](../src/components/experience/ChapterTitle.jsx): reusable masked, word-staggered headings with editorial serif emphasis.
- Short control states use the same eased rhythm as the larger transitions. No scroll hijacking is added; the browser's native page scrolling drives the preserved hero effect.
- Effects favor opacity and transforms; image masking is confined to entry transitions. GSAP contexts and observers clean up when their owners unmount.

## Validation and practical limits

Production build and lint are checked before publication. Component-level checks cover listing/grid selection, saved-home persistence, property/adviser inquiry prefills, adviser navigation, service selection, and article dialogs. Additional checks cover menu focus, reduced-motion entry, page structure, local asset availability, and scrub-distance calculations.

The managed browser preview is blocked by `ERR_BLOCKED_BY_CLIENT` in this environment. A visual device walkthrough and a browser performance profile have therefore not been completed.

This is an independent portfolio concept. Properties and advisers are illustrative; adviser portraits depict fictional people. The contact form demonstrates an interface and does not send messages. Sunny uses local scripted responses. External Google Fonts and Google Translate require access to their services.
