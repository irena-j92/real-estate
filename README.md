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
