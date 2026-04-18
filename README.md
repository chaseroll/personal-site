# chaseroll.com

Personal site. Five static HTML pages, one shared stylesheet, one small JS
file. No framework, no build step, no dependencies.

## Structure

```
/
├── index.html               splash  — name, bio, nav, socials
├── styles.css               shared stylesheet (screen + print)
├── theme.js                 theme toggle, clock, external-link decoration
├── favicon.svg              "C" monogram, adapts to OS dark mode
├── resume/
│   └── index.html           Projects / Experience / Education / Other
├── notes/
│   ├── index.html           clipboard — year-grouped tagged items
│   └── hello-world/
│       └── index.html       sample note page (template for future notes)
└── contact/
    └── index.html           email + phone
```

## Preview locally

```bash
python3 -m http.server 8000
# http://localhost:8000
```

Absolute asset paths (`/styles.css`, `/theme.js`, `/favicon.svg`) rely on a
server root, so open via a dev server — opening `index.html` directly from the
filesystem will break stylesheet loading.

## Deploy

Push to GitHub and connect the repo to Cloudflare Pages / Vercel / Netlify.

- No build command
- No output directory
- Pure static files

## What's in `theme.js`

One ~130-line IIFE handling three concerns:

1. **Theme** — reads `localStorage['chaseroll-theme']`, falls back to system
   preference, sets `data-theme="dark"` on `<html>`. Click the `◐` button to
   toggle. Listens to `storage` events so multi-tab is always in sync.
2. **External link decoration** — any `<a href="https://…">` pointing to a
   different hostname automatically gets `target="_blank"` and
   `rel="noopener noreferrer"`.
3. **Live clock** — fills every `.clock` element with the current time in
   Central Time, updates every second.

Each HTML page also has a tiny inline `<script>` in its `<head>` that applies
the theme synchronously before first paint — prevents any flash of wrong
theme on reload.

## Editing content

### Add a resume entry (`resume/index.html`)

Inside the appropriate `<div class="entries">`, copy the template:

```html
<article class="entry">
  <div class="head">
    <h3>Name</h3>
    <span class="dates">Dates</span>
  </div>
  <p class="role">Role &middot; Location</p>
  <p class="desc">Description.</p>
  <div class="links">
    <a href="https://…">Link &rarr;</a>
  </div>
</article>
```

Only Projects entries should have links (visual hierarchy — experience is
context, projects are the things worth clicking into).

### Add a note to the clipboard (`notes/index.html`)

Inside the current year's `<div class="notes-list">`:

```html
<a href="https://…">
  <span>Title of the thing</span>
  <span class="tag">Link</span>
</a>
```

Tags are auto-uppercased by CSS, so type `Link` / `PDF` / `X post` / etc.

For a new year, prepend a new `<div class="year-group">`:

```html
<div class="year-group">
  <h2 class="notes-year">2027</h2>
  <div class="notes-list">
    <a href="…">…</a>
  </div>
</div>
```

### Publish a written note

Copy `notes/hello-world/` to `notes/your-slug/`, edit title, date, and the
paragraphs inside `<div class="note-body">`. Then add a list item in
`notes/index.html` with `href="/notes/your-slug/"` and `<span class="tag">Note</span>`.

## Resume PDF

`/resume/` has a `pdf` button that calls `window.print()`. The print
stylesheet (`@media print` in `styles.css`) formats it as a professional
two-page resume with:

- Letter size, 0.55" × 0.6" margins
- Contact strip (email · phone · website) revealed only in print via
  the `.print-only` utility class
- Uppercase tracked section headings (resume convention)
- Theme forced to light regardless of current site theme
- Page-break avoidance inside entries

The PDF reflects the live resume — nothing to regenerate manually.

## Theme tokens

All colors flow through CSS custom properties in `:root` and
`[data-theme="dark"]`. To re-theme the site, edit the token block at the
top of `styles.css`. Grays follow Tailwind's 400/500/600/700 scale; `--fg`,
`--bg`, and `--divider` define the rest.
