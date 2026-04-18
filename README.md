# chaseroll.com

Personal site. Single static HTML file, no build step.

## Preview locally

```bash
# Either open directly
open index.html

# Or serve on localhost
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Deploy

Push to GitHub, connect the repo to Cloudflare Pages (or Vercel / Netlify).
No build command, no output directory, no framework — just static files.

## Edit

Everything lives in `index.html`. Content is plain HTML inside `<main>`;
styles are in the `<style>` block in `<head>`.

Adding a new project or experience entry:

```html
<article>
  <h3>Name</h3>
  <p class="meta">Dates</p>
  <p class="meta">Role</p>
  <p class="desc">Description.</p>
  <p class="links"><a href="https://...">Link &rarr;</a></p>
</article>
```
