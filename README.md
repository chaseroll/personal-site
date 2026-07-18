# chaseroll.com

Personal site. Seven static HTML pages, one shared stylesheet, one small JS
file, self-hosted fonts. No framework, no build step, no dependencies.

## Design

The original site's quiet materials — neutral near-white, one warm serif —
carrying the editorial structure built during the redesign:

- **Cormorant Garamond** (self-hosted, two woff2 files) — titles (one tier
  site-wide, clamp 34–52px, incl. the home name), the header wordmark,
  section headings, list titles; its *italic* is the voice for folio subs,
  dates, roles, year labels, the clock, and home socials
- **System serif** (New York / Charter / Georgia) — everything else: body
  text and prose (16–16.5px), nav (15px lowercase), descriptions,
  captions, footer. No other font ships.

Colors flow through tokens at the top of `styles.css`: light `#fafafa` /
`#111111`, dark `#0a0a0a` / `#e5e5e5`, hairlines at 9% opacity, muted and
faint as ink alphas, and a **red accent** — `#be0f28` in light,
`#d9112a` in dark. Text selection is a translucent accent tint.

The home page is its own thing — `.home-main`/`.home-cover`, the original
splash (name with the bare `◐` toggle beside it, serif bio, lowercase
`resume notes contact`, italic socials), with no header.

Every inner page shares the same bones:

1. `.masthead` — an in-flow header row (scrolls with the page, aligned to
   the content gutters — deliberately NOT a pinned bar): the serif
   `Chase Roll` wordmark, lowercase nav (`← home`, + `pdf` on resume),
   and the bare `◐` toggle
2. `.folio` — the title band, deliberately plain: the `.folio-title`,
   one quiet italic `.folio-sub` line, and on essays an italic
   `.folio-date`. No kickers, labels, or byline apparatus.
3. `.article-band > .band-inner` — the page's content
4. `.site-footer` — copyright + live clock, reach-out line

Everything on every page — header, title band, content, footer, and the
home cover — shares ONE column: `max-width: 48rem`, padding
`clamp(24px, 4vw, 48px)`. One left edge site-wide.

Essay pages additionally get an
`.essay-footer` (lowercase `← all notes`). Signature interactions: list rows nudge 5px right on
hover, links go accent, inline prose links carry an accent underline.

## Structure

```
/
├── index.html               home — the quiet splash (see above)
├── 404.html                 not-found page (folio grammar)
├── styles.css               shared stylesheet (screen + print)
├── theme.js                 theme, links, clock
├── fonts/                   self-hosted variable woff2 (latin subsets)
├── favicon.svg              "C" mark, adapts to OS dark mode
├── og-image.png             1200×630 social card
├── apple-touch-icon.png     180×180 "C" icon
├── vercel.json              security + cache headers (Vercel)
├── robots.txt, sitemap.xml
├── resume/index.html        Projects / Experience / Education / Other
├── notes/index.html         the notebook — bare title rows, year-grouped (password-gated)
│   ├── hello-world/         short note (essay template, minimal)
│   └── by-invitation-only/  full-length essay (all template components;
│                            currently noindex'd stand-in prose)
└── contact/index.html       email + phone
```

## Preview locally

```bash
python3 -m http.server 8000
# http://localhost:8000
```

Absolute asset paths (`/styles.css`, `/fonts/…`) rely on a server root, so
open via a dev server — opening `index.html` directly from the filesystem
will break stylesheet and font loading.

Stylesheet/JS links carry a cache-busting query (`styles.css?v=N`) — bump
it on every styles.css or theme.js change.

## Notes gate (private while practicing)

`/notes/` is password-gated. A pre-paint inline script on
`notes/index.html` sets `data-locked` on `<html>` unless
`localStorage['chaseroll-notes']` holds the password's SHA-256 hex (the
constant lives in that page's two inline scripts); CSS then swaps the
list for the `.gate` form, which hashes input via `crypto.subtle`
(needs https or localhost). Both note pages carry a bounce script to
`/notes/` when locked. While the gate is up: all three notes pages are
`noindex`, `robots.txt` disallows `/notes/`, and the notes URLs are out
of `sitemap.xml`. Going public later = remove the gate form + scripts,
the bounce scripts, the three `noindex` metas, the robots rule, and
re-add the URLs to the sitemap.

## Deploy

The repo is connected to Vercel: push to `main` and it deploys. No build
command, no output directory, pure static files. `vercel.json` is the
single headers authority — security headers site-wide, a year of
immutable cache for `/fonts/*` and `styles.css`/`theme.js` (safe because
of the `?v=` stamps; bump the stamp on all seven pages whenever either
file changes — versions 35–37 are burned, never reuse them), and a week
for icons and images.

## What's in `theme.js`

One small IIFE handling three concerns:

1. **Theme** — reads `localStorage['chaseroll-theme']`, falls back to system
   preference, sets `data-theme="dark"` on `<html>`. Click the `◐` button to
   toggle. Also keeps the `theme-color` metas, `color-scheme`, and the
   toggle's label/title in sync, and listens to `storage`
   events so multi-tab is always in sync.
2. **External link decoration** — any `<a href="https://…">` pointing to a
   different hostname automatically gets `target="_blank"` and
   `rel="noopener noreferrer"`.
3. **Live clock** — fills every `.clock` element with the current time in
   Central Time, updates every second.
Each HTML page also has a tiny inline `<script>` in its `<head>` that applies
the theme synchronously before first paint — prevents any flash of wrong
theme on reload.

## Editing content

### Publish a written note (essay)

Copy `notes/by-invitation-only/` (full template) or `notes/hello-world/`
(minimal) to `notes/your-slug/` and edit:

- `<title>`, meta description, canonical URL, og/twitter tags (and remove
  the `noindex` meta + fixture comment if copying by-invitation-only)
- the `.folio-title` (essay title) and the `.folio-date` (Month Year) —
  no subtitle; the opening paragraph is the abstract
- body: `.prose` paragraphs; sections via `.essay-section-head` (an
  italic `.essay-section-title` h2); `.essay-fig` figures (use
  `<picture>` with a WebP source + JPEG fallback, explicit
  `width`/`height`, `loading="lazy"`). That is the whole essay
  vocabulary — paragraphs, links, section heads, figures

Then add a list item in `notes/index.html` (see below) — new entries go
on top.

### Add an item to the notebook (`notes/index.html`)

Inside the current year's `<div class="notes-list">` — a row is just a
titled link, nothing else:

```html
<a href="/notes/your-slug/">Title of the thing</a>
```

For a new year, prepend a new `<div class="year-group">` with an
`<h2 class="notes-year">2027</h2>`.

### Add a resume entry (`resume/index.html`)

Inside the appropriate `<div class="entries">`:

```html
<article class="entry">
  <div class="head">
    <h3><a href="https://…">Name <span class="ext" aria-hidden="true">&nearr;</span></a></h3>
    <span class="dates">Start &ndash; End</span>
  </div>
  <p class="role">Role &middot; Location</p>
  <p class="desc">Description.</p>
</article>
```

The title IS the link (with the small &nearr;) — no separate links row.
Only Projects titles should link (experience is context, projects are the
things worth clicking into). Entries still in progress can take
`class="entry entry-draft"` to stay off the printed PDF.

## Resume PDF

`/resume/` has a `pdf` button that calls `window.print()`. The print
stylesheet (`@media print` in `styles.css`) formats it as a professional
one-to-two page resume: letter size, the `.print-only .print-head` (name +
contact strip) replaces the screen chrome, theme forced to monochrome light,
page-break avoidance inside entries. Other pages print their folio as the
title block, and printed links expose their URLs. The PDF reflects the live
resume — nothing to regenerate manually.

## Fonts

Latin-subset variable woff2 files self-hosted in `/fonts/`, declared in
`styles.css` with `font-display: swap` and preloaded from each page's head.
`/fonts/*` is cached immutable for a year — if a font file ever changes,
give it a NEW filename (e.g. `cormorant.v2.woff2`) and update the
`@font-face` src in styles.css plus every page's preload link. To
re-download or add subsets, pull the css2 URLs from Google Fonts with a
Chrome user-agent and fetch the `/* latin */` block's woff2 files.
