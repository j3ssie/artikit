# Artikit

Standalone HTML sample pages to use as starting points for new UI: landing pages, dashboards, data pages, canvas pages, blog templates and a terminal design system. Each page is one self-contained file with its CSS and JavaScript inline and sample data only. There is no build step and nothing to install.

Live at [artikit.vigolium.com](https://artikit.vigolium.com).

## Pages

Every page is in [`pages/`](pages/). The file name starts with the kind of page.

| Kind | Prefix | Pages |
| --- | --- | --- |
| Landing | `landing-page-` | Gimorra · Copperplate, Gimorra · Verdicts, Gimorra · Stage, Coding agents |
| Dashboard | `dashboard-` | Gimorra · Console, Vigolium · Workbench, Vigolium · Triage, Delivery analytics |
| Data | `data-` | Observability, Model Data, Prompt analytics, Evals, Analysis workbench |
| Canvas | `canvas-` | Gimorra · Architecture, Vigolium · Scan lifecycle, Gimorra · Workflows |
| Blog | `blog-` | Narrative post, Release post, Research note, Terminal playbook, Serif essay |
| Terminal | `terminal-` | Terminal Design System, Terminal Design System · Field Notes |

[`llms.txt`](llms.txt) has the full list with a description, size and preview image for each page.

## Use a page

Open `index.html` in a browser to browse the catalogue, or open any file in `pages/` directly. No server is needed.

To reuse a page, copy its HTML file and adapt it. Colours, fonts and radii are CSS custom properties declared in `:root` near the top of the page's `<style>` block.

To write a document with a blog template, replace what is inside `<article class="post">`. An HTML comment above the page's `<style>` lists the blocks and their class names.

Things a copied page still depends on:

- Most pages load web fonts from Google Fonts and fall back to system fonts without them.
- The Gimorra and Vigolium pages load a logo from `../assets/`. Copy the logo too, or replace it.
- The Gimorra · Architecture canvas page loads React, React Flow, htm and marked from esm.sh, so it needs a network connection. The other two canvas pages have no dependencies.
- The two terminal pages are bundled apps of about 2.3 MB each. Open them in a browser instead of reading the source.

All names, numbers and install commands in the pages are invented sample content. The five blog templates are the exception: their text describes the templates themselves and their numbers were measured.

## Layout

```
index.html      the chooser: grid and list views, filter by kind
llms.txt        the same catalogue as plain text, for agents
pages/          the sample pages, one HTML file each
assets/         logos used by the Gimorra and Vigolium pages
thumbs/         720×450 preview per page, plus make-thumbs.mjs
tweaks/         shared tweak dock for the data pages, plus inject.py
public/         the copy that gets deployed
wrangler.jsonc  Cloudflare Worker config
```

## Add a page

1. Put the file in `pages/`, named with one of the prefixes above.
2. Add an entry to the `THEMES` array in `index.html` and a line to `llms.txt`.
3. Capture its preview. This needs Playwright and a local Chrome:

   ```sh
   node thumbs/make-thumbs.mjs data-evals.html            # dark scheme
   node thumbs/make-thumbs.mjs data-evals.html@light      # light scheme
   ```

4. Copy everything to `public/` (see Deploy).

## Tweak dock

The data pages carry a floating tweak dock with the same controls as the terminal design system's config bar. It is built from `tweaks/module.html`, the token sets in `tweaks/themes.json` and one adapter per page in `tweaks/adapters/`. After editing any of those, inject the block again:

```sh
python3 tweaks/inject.py pages/data-evals.html tweaks/adapters/data-evals.js
```

The script replaces the previous block, so it is safe to run more than once.

## Deploy

The site is a Cloudflare Worker that serves `public/` as static assets. `public/` is a plain copy of the working files, so refresh it before deploying:

```sh
cp index.html llms.txt public/
cp pages/*.html public/pages/
cp assets/* public/assets/
cp thumbs/*.png public/thumbs/
npx wrangler deploy
```

## Author

Crafted by [@j3ssie](https://github.com/j3ssie). Gimorra and Vigolium are the author's own products.
