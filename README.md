# Prashant Singh — Portfolio

Personal portfolio site for **Prashant Singh**, AI Engineer (real-time voice AI, LLM systems, RAG).

Plain HTML, CSS and JavaScript. **No framework, no build step, no dependencies** — which means it
deploys unchanged to Vercel, GitHub Pages, Netlify, Cloudflare Pages or any static host.

---

## Contents

```
.
├── index.html                    # the entire page
├── assets/
│   ├── css/styles.css            # design tokens + all styling
│   ├── js/main.js                # theme, nav, reveals, counters, pipeline animation
│   ├── img/og.png                # 1200×630 social preview card
│   └── Prashant_Singh_Resume.pdf # downloadable résumé
├── documentation/                # LOCAL ONLY — gitignored, never deployed
├── vercel.json                   # cache + security headers for Vercel
├── .github/workflows/deploy-pages.yml   # GitHub Pages CI deploy
├── .nojekyll                     # stops GitHub Pages from running Jekyll
├── robots.txt / sitemap.xml      # basic SEO (edit the domain — see below)
└── README.md
```

---

## Run it locally

Any static server works. Pick one:

```bash
# Python (already installed on most machines)
python -m http.server 5173

# Node
npx serve .
```

Then open <http://localhost:5173>. Opening `index.html` directly with `file://` also works,
though the PDF link and clipboard copy behave better over HTTP.

---

## Deploy

### Option A — Vercel (recommended: custom domains, instant rollbacks)

**Via the dashboard**

1. Push this folder to a GitHub repo (see *Push to GitHub* below).
2. Go to <https://vercel.com/new>, import the repo.
3. Framework preset: **Other**. Build command: *leave empty*. Output directory: *leave empty* (`.`).
4. Deploy. You get `https://<project>.vercel.app` in about 20 seconds.

**Via the CLI**

```bash
npm i -g vercel
vercel          # preview deployment
vercel --prod   # production deployment
```

`vercel.json` is already set up with long-lived caching for `/assets/*` and sane security headers.

### Option B — GitHub Pages

1. Push to a GitHub repo.
   - For `https://<username>.github.io`, name the repo exactly `<username>.github.io`.
   - For `https://<username>.github.io/portfolio`, name it anything (e.g. `portfolio`).
2. Repo → **Settings → Pages → Build and deployment → Source: GitHub Actions**.
   - On **GitHub Free the repo must be public** — Pages is unavailable for private repos, and the
     workflow fails at *Configure Pages* with `Get Pages site failed … Not Found`. To keep the repo
     private, deploy with Vercel instead (its free plan supports private repos).
3. Push to `main`. The included workflow (`.github/workflows/deploy-pages.yml`) publishes the repo
   root on every push.

> All asset paths in `index.html` are **relative** (`assets/…`), so the site works correctly from a
> sub-path like `/portfolio/` with no changes.

### Push to GitHub

```bash
git init
git add .
git commit -m "Portfolio site"
git branch -M main
git remote add origin https://github.com/<username>/<repo>.git
git push -u origin main
```

---

## Customising

| What | Where |
|---|---|
| Colours, spacing, radii, fonts | CSS variables at the top of `assets/css/styles.css` (`:root` for dark, `:root[data-theme="light"]` for light) |
| Accent colour | `--accent` / `--accent-soft` / `--accent-line` / `--accent-ink` — change all four together |
| Copy, experience, projects | `index.html` — sections are commented (`Hero`, `Experience`, `Projects`, `Stack`, `About`, `Contact`) |
| Résumé PDF | Replace `assets/Prashant_Singh_Resume.pdf`, keeping the filename (or update the two links in `index.html`) |
| Social preview card | Replace `assets/img/og.png` (1200×630) |
| Favicon | The inline SVG data URI in `<head>` — edit the letter and colours there |

### The `documentation/` folder

`documentation/` holds the internal source material the site copy was written from —
architecture notes and company-internal strategy. It is **excluded from every deploy path**:

- `.gitignore` keeps it out of the repo entirely, so Vercel never sees it
- `.vercelignore` excludes it even if it is committed
- the Pages workflow deletes it before uploading the artifact

Keep it that way. Anything placed in the repo root of a static site is publicly downloadable.

### Before going live

Two placeholders need your real URL once you have one:

- `robots.txt` → `Sitemap: https://REPLACE-WITH-YOUR-DOMAIN/sitemap.xml`
- `sitemap.xml` → `<loc>https://REPLACE-WITH-YOUR-DOMAIN/</loc>`

Also make `og:image` absolute for reliable link previews on LinkedIn/X — replace
`content="assets/img/og.png"` in `index.html` with the full `https://…/assets/img/og.png` URL.

### Optional: add GitHub / project links

There is no GitHub link on the site because the résumé did not list one. To add it, drop a row into
the `.contact-actions` block in `index.html` copying the LinkedIn row, and add a `sameAs` entry to the
JSON-LD block in `<head>`.

---

## What's in the build

- **Dark / light theme** — respects `prefers-color-scheme`, remembers the choice in `localStorage`,
  and resolves before first paint so there is no flash of the wrong palette.
- **Animated voice pipeline** — the hero panel steps through the Twilio → Deepgram → OpenAI → ElevenLabs
  pipeline. Pauses when off-screen or when the tab is hidden.
- **Scroll reveals, counting stats, scroll-spy nav** — all via `IntersectionObserver`, with static
  fallbacks when it is unavailable.
- **Accessibility** — skip link, semantic landmarks, visible focus rings, ARIA on the menu and theme
  toggle, and full `prefers-reduced-motion` support (all animation disabled, content still visible).
- **SEO** — descriptive title/meta, Open Graph + Twitter cards, and `Person` JSON-LD structured data.
- **Print stylesheet** — Cmd/Ctrl+P produces a clean text document.
- **Responsive** — three breakpoints (1040 / 880 / 620 px); the nav collapses to a slide-down menu.

No analytics, no trackers, no external requests beyond Google Fonts.
