# EA Pro Painters — website rebuild

Next.js 16 rebuild of [eapropainters.com](https://www.eapropainters.com), built to the plan in `KICKSTART.md`.
Current mode: **SPEC** (a concept for Erik; noindex, banner, no tracking, demo-only forms).

## Run it

```bash
npm install
npm run dev                      # http://localhost:3000
npx next build && npx next start # production build (what QA tests)
```

`SITE_MODE=spec|launch` switches everything that differs between the concept and the live site (missing = `spec`). See `.env.example`.

## Where things live

| Path | What |
|---|---|
| `site.config.ts` | Every business fact (address, phone, hours, license, warranty, review numbers with source and date) |
| `content/{pages,services,cities,posts}/*.json` | Page content, generated from the live site by `scripts/build-content.ts` (word for word, plus the fixes in `content/fixes-applied.json`) |
| `content/photos.ts` | EA Pro's own photos (stock excluded), renamed descriptively; towns pending Erik |
| `content/projects.ts` | Portfolio projects (details pending Erik) |
| `content/flags.ts` | Claims that need Erik's confirmation; shown as yellow placeholders |
| `content/shared.ts` | Process, warranty, "lowest bid" and award copy, quoted from the live site |
| `lib/live-urls.ts` | The 68 live URLs and the legacy redirects (never change these) |
| `proxy.ts`, `lib/redirects.ts` | Lowercase + trailing slash + legacy redirects in one hop, query string kept |
| `audit/` | Phase 1 capture of the live site (`audit/README.md`) |

## Scripts

| Command | What it does |
|---|---|
| `npx tsx scripts/audit/crawl-live.ts` | Read-only crawl of the live site (analytics blocked) → `audit/inventory.json` |
| `npx tsx scripts/audit/extract-content.ts` | Live pages → `content/live/*.json` blocks |
| `npx tsx scripts/build-content.ts` | Blocks → typed, cleaned content files |
| `npx tsx scripts/curate-photos.ts` | Copies EA Pro's own photos into `public/images` |
| `npx tsx scripts/qa.ts http://localhost:3100 [--axe] [--lighthouse]` | Phase 4 QA → `qa-report/summary.md` |
| `npx tsx scripts/screens.ts http://localhost:3100 / /estimate …` | Screenshots at 375px and 1440px |

## Working notes

- `OPEN-QUESTIONS.md`: everything waiting on Erik. Placeholders are never filled in by guesswork.
- `SEO-BACKLOG.md`: ranking changes for after launch, one at a time.
- `BASELINE.md`: rankings and technical baseline before launch.
