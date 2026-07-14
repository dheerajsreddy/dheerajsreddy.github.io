# dheerajsreddy.github.io

Personal portfolio — [dheerajsreddy.github.io](https://dheerajsreddy.github.io)

Static site. No framework, no build step, no dependencies. Three files do the work:

| File | What it holds |
|---|---|
| `index.html` | All content — experience, projects, research, stack, about |
| `styles.css` | Design system (CSS custom properties), dark + light themes |
| `main.js` | Command palette (⌘K), scroll-spy nav, theme toggle, project filters |

## Editing

**Add a project** — copy an `<article class="card">` block in `index.html` and change the text.
The `data-tag` attribute controls which filters it shows under: `ai`, `ml`, `fs` (space-separated, a card can have several).
If it should also be findable in ⌘K, add a matching entry to the `items` array in `main.js`.

**Change colors** — every color is a variable at the top of `styles.css`, under `:root` (dark) and `:root[data-theme="light"]`.
Change `--accent` in both and the whole site follows.

**Update the résumé** — replace `assets/Dheeraj_Sridhar_Reddy_Resume.pdf`, keeping the filename.

## Running locally

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

## Deploying

Pushing to `main` publishes automatically via GitHub Pages (Settings → Pages → Deploy from branch `main` / root).
Changes go live in about a minute.
