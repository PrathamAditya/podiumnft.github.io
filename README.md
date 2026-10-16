# sweetCone 🍦

The collection of vivid and joyous cones, plus the **Cone Lab** where you can build your own.

**Live:** https://sweetcone.prathamadityasalhotra.workers.dev

## Run it locally

No build tools needed: it's plain HTML, CSS and JS.

```sh
python3 -m http.server 8080   # then open http://localhost:8080
```

## What's where

| File | What it does |
| --- | --- |
| `index.html`, `style.css`, `script.js` | The site |
| `lab.js` | The Cone Lab: draws cones as SVG from traits, rarity, share links, PNG export |
| `images/web/` | Web-sized art the site uses (the full-size originals in `images/` are kept as source) |
| `_headers`, `_redirects` | Cloudflare response headers and old-link redirects |
| `scripts/build.mjs` | Copies the deployable files into `dist/` and fails if anything referenced is missing |
| `wrangler.jsonc` | Cloudflare Workers config (static assets from `dist/`) |

## Deploys (CI/CD)

`.github/workflows/deploy.yml` runs on GitHub Actions:

- **Push to `main`** → builds and deploys to production.
- **Pull request** → builds and uploads a preview version. The bot comments the preview link on the PR; production is untouched.

It needs two repository secrets (Settings → Secrets and variables → Actions):

| Secret | Value |
| --- | --- |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account ID |
| `CLOUDFLARE_API_TOKEN` | An API token made from Cloudflare's **Edit Cloudflare Workers** template |

Manual deploy from your machine: `node scripts/build.mjs && npx wrangler deploy`.
