# NM Data Platform · User Guide

Static documentation site for the NM Data Platform. Hosts the user-facing
guide to the multi-project shell, My Data redesign, editing workspace, and
related workflows.

**Live site:** <https://nmotion-initiative.github.io/nm-data-platform-user-guide/>

> Source-of-truth lives in the private `NMotion-Initiative/nm-data-platform`
> repo at `apps/user-guide/`. This repository is a mirror, published as a
> standalone static site so the guide stays browseable even when the platform
> itself isn't deployed.

## Layout

```
index.html           ← the guide (the page you want)
design-system.css    ← NM design tokens (light + dark themes)
capture.html         ← per-iframe artboard renderer, keyed by URL hash
primitives.jsx       ← Panel / Chip / Btn / Sidebar / TabStrip components
screens/
  shell.jsx
  landing.jsx
  explorer.jsx
  mydata.jsx          (legacy v3 layout, kept for reference)
  mydata-v4.jsx       (current 4-tab Files / Imports / Exports / History)
  add-to-project.jsx
  members.jsx
  editing.jsx
```

The "screenshots" embedded inside the guide are live React artboards rendered
into iframes via `capture.html`, so text stays vector-sharp at any zoom and
the visuals can't drift out of sync with the platform's design tokens.

## Viewing locally

Cross-origin iframes and `<script type="text/babel">` require a real HTTP
server — opening `file://index.html` won't work. Any static server is fine:

```sh
python3 -m http.server 8765
# open http://localhost:8765/index.html
```

## Printing / saving as PDF

The stylesheet has a `@media print` block tuned for letter / A4 with sections
that avoid breaking mid-figure. From the rendered page: ⌘P → *Save as PDF* →
*More settings → Background graphics: on*.

## Updating

The canonical source is `nm-data-platform/apps/user-guide/`. To publish an
update:

```sh
# from nm-data-platform repo
cd apps/user-guide
rsync -a --delete --exclude='.git' ./ /path/to/nm-data-platform-user-guide/
cd /path/to/nm-data-platform-user-guide
git add -A && git commit -m "docs: refresh user guide" && git push
```

GitHub Pages publishes from `main:/` — pushes go live in ~30 seconds.

## License

Internal documentation; all rights reserved by Neural Motion.
