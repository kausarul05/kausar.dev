# Kausarul Islam — Portfolio

A dark, motion-heavy single-page portfolio with a MongoDB-backed admin panel.
Next.js 16 (App Router) · React 19 · TypeScript · Tailwind CSS v4 · Motion ·
Lenis · MongoDB · Zod.

## Setup

```bash
npm install
cp .env.example .env.local        # then fill it in (see below)
npm run set-password -- "your password"
npm run seed                      # import the starting content
npm run dev                       # http://localhost:3000
```

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server |
| `npm run build` / `npm start` | Production build and serve |
| `npm run lint` / `npm run typecheck` | ESLint (incl. React Compiler rules) / `tsc --noEmit` |
| `npm run seed` | Copy `src/content/seed.ts` into MongoDB (add `-- --force` to overwrite) |
| `npm run set-password -- "…"` | Write a scrypt hash of your admin password into `.env.local` |
| `npm run cv` | Render the CV and both résumés to PDF in `cv-out/` |
| `npm run shots` | Re-capture the live project screenshots into `public/projects/` |
| `npm run video` | Record the walkthrough and build both video cuts |
| `npm run check-db` | Connection smoke test — prints the URI (masked) and per-collection counts |
| `npm run reorder-projects -- "A" "B" …` | Set project order from the terminal |

### Environment

| Variable | Notes |
| --- | --- |
| `MONGODB_URI` | `mongodb://127.0.0.1:27017` locally, or an Atlas connection string — see the note below |
| `MONGODB_DB` | Database name, defaults to `portfolio` |
| `AUTH_SECRET` | Signs the admin session cookie. 32+ chars — `npm run set-password` generates one if missing |
| `ADMIN_PASSWORD_HASH` | `salt:hash`, written by `npm run set-password`. The password itself is never stored |

Changing either auth variable requires a dev-server restart, and invalidates
existing sessions.

`.env.local` is git-ignored; `.env.example` is committed, so **never put a real
connection string in it** — placeholders only.

#### Atlas and the `mongodb+srv://` caveat

This machine's Node DNS resolver is pinned to `127.0.0.1`, which doesn't answer,
so `dns.resolveSrv` fails with `ECONNREFUSED` and any `mongodb+srv://` URI dies
before it connects — even though `nslookup` resolves the same record fine
(`nslookup` goes through the Windows resolver, Node goes through c-ares).

`.env.local` therefore uses the **standard** Atlas string, which lists the shard
hosts directly and skips the SRV step:

```
mongodb://<user>:<pass>@ac-…-shard-00-00.<id>.mongodb.net:27017,…-01.<id>.mongodb.net:27017,…-02.<id>.mongodb.net:27017/?ssl=true&replicaSet=<rs>&authSource=admin&retryWrites=true&w=majority
```

Atlas offers this form under *Connect → Drivers → older driver version*. The
`replicaSet` value lives in the cluster's TXT record
(`nslookup -type=TXT <cluster-host>`). On a host with working SRV lookups —
Vercel, most Linux boxes — the plain `mongodb+srv://` string is fine.

Switch back to local Mongo any time by pointing `MONGODB_URI` at
`mongodb://127.0.0.1:27017`.

## The admin panel

`/admin` — sign in with the password you set. Everything writes straight to
MongoDB and the public site picks it up on its next request.

| Section | Manages |
| --- | --- |
| Projects | The cards in the Work section: copy, highlights, tags, gradient colours, links. Reorder with the arrows |
| Stack | Skill groups and the technologies inside each one |
| Path | Timeline entries — period, role, org, bullets |
| Settings | Name, hero lockup, tagline, photo, availability, About copy and counters, contact copy, socials, marquee |

Deleting is two-step: the trash icon arms a confirm button that disarms itself
after five seconds. No native `confirm()` dialog — it blocks the page, and
pairing `onSubmit` with a function `action` breaks React's form handling.

### Security notes

- The session is an HMAC-signed, `httpOnly` cookie with a 12-hour expiry.
- Passwords are scrypt-hashed with a random per-password salt; comparisons use
  `timingSafeEqual`.
- **Every server action re-checks the session itself.** A layout-level guard
  does not protect actions — actions are their own entry point into the app.
- `/admin` is `noindex, nofollow`.

## Content and data flow

`src/content/seed.ts` is the starting content *and* the fallback. If MongoDB is
empty or unreachable, `getContent()` logs a warning and serves the seed, so a
database outage degrades the site to its starting state rather than taking it
down. The admin panel surfaces the connection error instead of hiding it.

Server components read through `src/lib/content.ts`; the result is handed to the
client tree once via `ContentProvider`, and client components read it with
`useContent()`.

Before publishing, two things still need your attention:

| What | Where | Why |
| --- | --- | --- |
| Site URL | Settings → Site URL | Currently `https://kausarul.dev`. Drives `metadataBase`, Open Graph and the JSON-LD |
| Path entries | Admin → Path | The seeded roles and dates are placeholders — swap in your real history |

A résumé isn't linked anywhere. To add one, drop `resume.pdf` into `public/` and
link it from `src/components/sections/contact.tsx`.

### CV and résumés

`npm run cv` renders three documents into `cv-out/`, plus the HTML each one was
printed from:

| File | What it is |
| --- | --- |
| `Kausarul-Islam-CV.pdf` | Two pages. Everything — four roles, all six projects with highlights, the full stack. |
| `Kausarul-Islam-Resume-FullStack.pdf` | One page, aimed at full-stack roles. |
| `Kausarul-Islam-Resume-Frontend.pdf` | One page, same history told from the interface side. |

Content comes from `src/content/seed.ts`, so the documents and the site never
drift apart. `src/content/cv.ts` holds what a document needs and a website
doesn't — education, phone number, and a summary per variant. **Both education
and phone are `TODO` placeholders; fill them in before sending anything.**

Design decisions worth keeping if you edit them:

- **Light, not dark.** A dark résumé wastes ink on paper and trips up some of
  the parsers that sit between you and a human reader.
- **Single column, real text.** No sidebars, no text baked into images — those
  are what break automated parsing.
- **Links are real anchors**, so they stay clickable inside the PDF.
- The one-pagers use a `compact` body class and trim each project to a single
  sentence. If you add content and one spills to a second page, cut a project
  before you shrink the type.

### Project screenshots

`npm run shots` opens each project's live URL in headless Chromium and saves a
screenshot to `public/projects/`. The card art comes from there; the accent
colours tint it and stand in when a project has no image. Consent banners are
hidden with CSS for the shot rather than accepted — the script never clicks
"accept" on your behalf.

Add or change a URL in `scripts/shots.mjs`, then point the project's **Screenshot**
field (Admin → Projects) at the new file.

### The headshot

`public/kausarul.jpg` (Settings → Photo path) is used in three places: the About
portrait, the small avatar in the hero's availability pill, and the generated
Open Graph card. It was shot on a light grey backdrop, so `Portrait` masks its
edges with a radial fade — the face emerges from the dark instead of sitting in
a bright box. A different 1:1 headshot needs no code change; if the new one is
shot on a dark background, soften or drop `EDGE_FADE` in
`src/components/ui/portrait.tsx`.

Preview the social card at `/opengraph-image` while the dev server is running.

## Structure

```
scripts/              seed.mts, set-password.mjs, check-db.mjs,
                      reorder-projects.mjs
src/
  app/
    layout.tsx        fonts, metadata, ContentProvider, no-JS fallback
    page.tsx          public site — section order + Person JSON-LD
    globals.css       design tokens (@theme), base styles, custom utilities
    opengraph-image   generated social card
    admin/            login, overview, projects, stack, path, settings
    admin/actions.ts  every server action, each with its own auth guard
  content/
    seed.ts           starting content and offline fallback
    nav.ts            section landmarks (structural, not editable)
  lib/
    db.ts             Mongo client singleton, HMR-safe
    content.ts        reads, with fallback for the public site
    schemas.ts        Zod schemas — one source of truth for forms and DB
    auth.ts           scrypt passwords, HMAC session cookie
  components/
    providers/        content context, Lenis smooth scroll
    layout/           header (scroll spy + hide-on-scroll), side rails, live clock
    sections/         hero, about, work, stack, path, contact
    ui/               atmosphere, cursor, magnetic, motion-text, marquee,
                      count-up, preloader, portrait
    admin/            form primitives, nav, row actions, the four forms
```

## Design notes

- **Palette** is defined once as Tailwind v4 `@theme` tokens in `globals.css`:
  `void / panel / line / ink / mute / dim` for the greys, `acid / violet / cyan /
  rose` for accents. Change a token, the whole site follows.
- **Type** pairs Geist Sans (display + UI) with Instrument Serif italic for the
  accent words, and Geist Mono for every label and kicker.
- **Motion inventory**: counter preloader, per-character hero reveal, pointer
  spotlight and drifting aurora behind everything, a ghost portrait the cursor
  uncovers in the hero, scroll-lit About paragraph, a horizontally-scrolling
  Work section, a velocity-reactive marquee, a scroll-drawn timeline, and a
  magnetic custom cursor.

### The ghost portrait

The hero stays typographic — the name is the image. The headshot sits fixed in
the empty right-hand third at ~11% opacity, crushed toward black so the light
backdrop doesn't read louder than the face, and a radial mask trailing the
cursor uncovers it as you move. It's deliberately never shown at full strength:
the source is 400px square, and at this opacity the softness reads as
atmosphere rather than a low-resolution photo.

It's fixed, but **not constant** — `PRESENCE` in
`src/components/ui/ghost-portrait.tsx` scales it per section, so the face
bookends the page instead of following you around it:

| Section | Presence | Why |
| --- | --- | --- |
| `top` | 1 | The discovery moment |
| `about` | 0 | The real 340px portrait is there — two of the same face is worse than one |
| `work` | 0 | Six bright gradient cards slide past; a face behind them is noise |
| `stack`, `path` | 0.5 | A quiet trace |
| `contact` | 0.85 | Returns for the closing headline |

Those values **multiply** with `REST_OPACITY`, so `0.5` reads as ~5% on screen,
not half — anything under ~0.4 vanishes at rest. The other knobs are
`REVEAL_OPACITY`, `REVEAL_RADIUS` (the pool of light, in px) and
`REDUCED_OPACITY`.

The component renders at page level, not inside the hero: `position: fixed` is
trapped by any transformed ancestor, and the hero's wrapper is transformed for
its parallax.

**If you get a ≥1200px headshot**, this can become a full photo-led hero
instead — at that resolution the portrait holds up at large sizes, and the About
portrait stops being upscaled on retina screens too.

## Accessibility & robustness

- `prefers-reduced-motion` is honoured everywhere — Lenis, the custom cursor and
  the preloader all switch themselves off, and CSS animations collapse.
- The custom cursor only activates for fine pointers; touch keeps the native one.
- A `<noscript>` block in `layout.tsx` lifts the intro curtain and clears the
  styles Motion sets from `initial`, so the page stays readable without JS.
- The preloader hands off on a timer rather than an animation callback, so it can
  never get stuck over the page if the browser stalls its frame loop.
