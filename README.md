# Attia Mohamed — Portfolio

Videographer and video editor, Jeddah. Next.js 16 (App Router) + TypeScript +
Tailwind v4 + Framer Motion + GSAP + Lenis, exported as a fully static site.

```bash
npm install
npm run dev      # http://localhost:4700  (or: preview_start "attia")
npm run build    # static export -> out/
```

---

## Why it looks the way it does

The design system was derived from Attia's own material, not from a template:

- **Monochrome.** His Behance banner is pure black with white, widely tracked
  type and a faint lens ring behind his name; his profile portrait is a
  black-and-white studio shot. There is no brand colour to extract — the only
  colour on the site comes from the footage.
- **The lens ring** in `components/ui/Aperture.tsx` is that banner mark, reused
  at three scales: huge behind the hero, small beside every section label, and
  as the cursor.
- **Jost, set light and tracked wide**, is the closest available match to his
  own lockup. Instrument Serif italic is the single editorial voice, used for
  one-line statements only. JetBrains Mono carries the shot-list micro type.
  Tajawal carries Arabic.
- **Vertical-first layout.** Seventeen of the eighteen clips are 9:16, so the
  work section is an overlapping coverflow carousel rather than a grid or a
  column. The one 16:9 piece (the Istanbul villa film) opens the site, because
  it is the only clip that can fill a widescreen frame.

## Structure — three screens

Hero → work carousel → about artwork. That is the whole home page (~2,800px
desktop, ~2,600px mobile).

Earlier versions also carried featured / services / process / testimonials and
then a contact section, and ran to eight screens. All were cut: a visitor gets
bored scrolling and reading long before that. Everything a project has to say
lives on its own case-study page, reached by clicking the centre card of the
carousel, and contact is the floating WhatsApp button. Keep it this way.

There are no horizontal rules anywhere on the site, by instruction — if a
divider reappears, remove it.

The carousel motion is deliberately identical to the reels carousel on the
Bedeiry site — cards overlap at 0.55 of their width, each step out from centre
scales by 0.9 and rotates 13°, and nothing auto-rotates. Arrows sit on the
stage edges; arrow keys and swipe also drive it. Those constants are in
`components/sections/Work.tsx` and should not be "improved".

Two details there are load-bearing and easy to undo by accident:

- **Cards are clips, not projects.** `carouselClips` in `data/projects.ts`
  flattens all seventeen vertical clips into cards, dealt round-robin so two
  from the same shoot are never adjacent. One card per project gave only ten,
  and ten cards leave gaps at the edges of a wide monitor instead of running
  past them the way the reference does.
- **The 0.78 height factor** puts the centre card near the size it is on the
  Bedeiry strip. Raising it makes a few large cards float in the middle.
- **`PLAY_RADIUS = 3`.** Only the seven cards nearest the centre carry a
  `<video>`; every other card is its poster image. Playing the whole arc meant
  thirteen live decoders on a wide screen and the page froze periodically. A
  poster sits under every card, so the swap is invisible — don't raise it.
- **The stage needs its `ResizeObserver`.** On first paint the stage has not
  resolved its clamped height, so card width falls back to the 120px minimum
  and stays there until something else triggers a resize.

## Mobile sizing

Taken from the Bedeiry site, which is the reference for this build:

| | Mobile | Desktop |
| --- | --- | --- |
| `#work` | `py-[clamp(48px,8vh,64px)]`, no min-height | `min-h-[100svh]` |
| carousel stage | `clamp(280px,40vh,340px)` | `clamp(400px,64vh,660px)` |
| `#about` | `py-[clamp(24px,5vh,64px)]`, **never** a min-height | same |

`#about` having no min-height is the important one. Forcing it to a full
viewport left roughly 600px of empty black above and below the artwork on a
phone, because the 16:9 image is only ~208px tall there.

Whole page: ~1,785px on mobile, ~2,772px on desktop.

## Media pipeline

All footage came from the Adobe CCV players embedded in his Behance projects.

| Tier | Path | Purpose | Size |
| --- | --- | --- | --- |
| `card` | `public/media/card/` | 400px, silent, capped at 12s — carousel cards | ~8 MB total |
| `big` | `public/media/big/` | 1080p, silent, capped at 20s — full-bleed heroes | ~59 MB total |
| `full` | `public/media/full/` | up to 1080p **with audio** — lightbox only | ~239 MB total |
| `poster` | `public/media/poster/` | first frame — never show a black tile | ~1 MB total |

The split is deliberate, and each tier exists for a reason that was learned the
hard way:

- **`card` is small** because every open `<video>` is a live decode pipeline.
  Ten cards playing at once is only affordable at 400px; at full resolution the
  page stutters.
- **`big` exists** because stretching a 400px card proxy across a hero looked
  visibly soft. Anything displayed full-bleed pulls from here instead.
- **`full` is never on a page by default.** It mounts only when the lightbox
  opens, so a visitor who never clicks a clip never downloads a large file.

```bash
npm run media                     # re-fetch from Behance (signed URLs resolve at run time)
node scripts/optimize-cards.mjs   # rebuild card proxies from full/
node scripts/build-hero-tier.mjs  # rebuild the big/ tier from full/
```

## Content

Everything the site says lives in `src/data/content.ts` and
`src/data/projects.ts`, both bilingual (`{ en, ar }`). The language toggle is in
the header and persists to `localStorage`.

Facts used — Jeddah, 30+ brands, 250+ videos, the Sony body and Adobe tools —
come from his public Behance and Instagram profiles.

### The About artwork

`public/brand/about.png` is the client's own finished design, shown exactly as
supplied and never re-typeset or translated — the headline, the disciplines and
the three numbers are all part of the image. Same treatment as the closing page
on the Bedeiry site: centred, `width: min(100%, 1686px)`.

**The page background must stay pure `#000000`.** Every edge of that artwork is
#000, so against the previous #0a0a0b page it read as a slightly darker
rectangle with a visible cut line. Matching the two is what makes the boundary
disappear; lifting `--color-ink` off black brings the edge straight back.

On a phone the artwork lands about 208px tall, so its baked-in type is small.
That is inherent to a 16:9 composite and cannot be fixed without cropping or
re-typesetting it.

### Still needed from Attia

1. **Confirmed email.** `site.email` in `content.ts` is still a best guess. The
   WhatsApp number (+966 53 945 1558) is confirmed and live in the floating
   button.
2. **Client names** for the projects currently labelled generically
   ("Private Client", "Real Estate").

## Deploying

Pushing to `main` builds and publishes automatically via
`.github/workflows/deploy.yml`. Live at **https://maoa11.github.io/attia-M/**.

Because that is a GitHub Pages *project* URL rather than a domain root, the repo
name is baked in as a base path — in **two** places that must always agree:

- `basePath` in `next.config.ts`
- `BASE_PATH` in `src/lib/asset.ts`

They are separate because Next rewrites `basePath` into `<Link>` and
`next/image`, but not into the raw `<video src>` and `<img src>` attributes this
site is mostly built from. **Moving to a custom domain means emptying both** —
change one and every video and image 404s.

One-time setup in the repo: Settings → Pages → Source = **GitHub Actions**.
