# Sunter Realty — A Different Perspective on Home

An independent real estate portfolio concept built with React, Vite, GSAP and a Sites Worker. The design pairs #1F2532 navy with #F4BA51 yellow, Inter Tight Regular and Instrument Serif.

## Pages

- `/`: the original scroll-controlled hero video, description, properties, buying/selling/relocation, experts, offers, history, latest posts and contact.
- `/our-perspective`: the company story on a yellow canvas, including the landing-page description, guiding principles and personal approach.

Menu and footer navigation link to the company page and four existing homepage sections. The language picker is removed.

## Development

```sh
npm ci
npm run dev
npm run build
```

Vite development serves the frontend. Account API routes require the Sites runtime identity and D1 binding; an ordinary Vite-only preview does not provide those services.

The build emits the client in `dist/client` and Worker in `dist/server`. Sites handles authentication, provisions the declared `DB` binding and applies the schema migration in `drizzle/`.

## Account behavior

The account menu exposes My Profile, Saved, Settings and Log out. Saved properties and profile/preferences are persisted per authenticated visitor. Property IDs remain stable when display names change, preserving existing saved homes. Mutations require a same-origin request and authorize records from server-provided identity.

## Content and assets

All homes, advisers and company milestones are illustrative portfolio content. The history is a draft Sunter brand narrative; it does not borrow real brokerage sales figures or rankings. The contact form demonstrates a message flow and does not send messages. Sunny provides scripted local guidance. Social tiles currently link to platform homepages until brand profile URLs are supplied.

The hero video and scroll mechanics are preserved. The contact image is the supplied `public/assets/contact-img.jpg`; other bundled imagery is stored in `public/assets`. Reference sections use a four-column history timeline, responsive native scrolling and a photographic contact section with a glass form. Reduced-motion and keyboard interactions are supported.

## Experimental 3D hero

The default hero uses the supplied villa geometry, converted from OBJ to a 4.2 MB indexed GLB with 29 material groups and 158,922 triangles. The source OBJ did not include its referenced MTL/textures, so finishes are reconstructed from the provided reference image. Fine foliage is clustered for web performance; the architectural structure is retained.

DAY and NIGHT override lighting; AUTO follows the pinned scroll from daylight to dusk, with warm glazing lighting floor by floor and path lights at night. Two further viewport scrolls retain the rectangular transition into the description. The scene renders on demand, limits pixel density and shadows, pauses outside the viewport and when the document is hidden, and disposes its GPU resources on unmount. Reduced motion disables pinning/camera movement and switches lighting instantly.

The original film, frame sequence and video hero remain in the repository. `/?hero=video` previews that header. The complete pre-experiment version is preserved in GitHub commit `803af59` and branch `archive/sunter-video-hero`.

To regenerate the web model from the original uploaded OBJ: `python scripts/prepare-villa.py /path/to/source.obj public/assets/models/sunter-villa.glb`. The generated GLB is tracked, so normal website builds do not require the original OBJ or Python.
