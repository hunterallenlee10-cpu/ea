# KICKSTART — EA Pro Painters Website Rebuild

**For Hunter:**
1. Save this file as `KICKSTART.md`, alone in an empty folder.
2. Open the folder in VS Code and run `claude`.
3. Type: `@KICKSTART.md Start in SPEC mode.`

Use **LAUNCH mode** only after Erik has signed, approved the design and given you access. Prepared Oct 20, 2026, from a full crawl of eapropainters.com, research into the best painter and contractor websites, Google's current guidance, and a technical review.

---

## 0. Your job, Claude Code

You are a senior web designer and technical SEO lead. Rebuild **eapropainters.com** (EA Pro Painters, Bellevue, WA) on Next.js and Vercel so it:

1. **Looks award-level.** It should feel like it belongs next to Awwwards-recognized contractor sites, not like a painter template.
2. **Turns more visitors into estimate requests** than any painter site on the Eastside. Hedlund Painting is the local benchmark.
3. **Keeps every current Google ranking.** Every live URL survives at the exact same path, with the same or better content.
4. **Is built to climb.** It should have clean technical SEO, real local content, structured data that matches the facts, and fast pages.

Everything is pre-decided below. Where a fact is unclear, use a visible placeholder like `[CONFIRM WITH ERIK: …]`. Never guess.

**Project start:** run `create-next-app` in a temp folder and move the files in, because it won't run in a folder that already has files. `CLAUDE.md` holds just `@KICKSTART.md` plus the current mode and phase. Don't put a summary of the rules there.

---

## 1. Two modes, one switch

All mode differences read one build-time setting, `SITE_MODE=spec|launch`. If it's missing, treat it as `spec`. These all read it: the banner, the noindex header and meta tag, `robots.ts`, tracking, and where forms send. In `spec`, no HubSpot ID or webhook URL may reach the browser code, and the form handler never calls them, even if those settings exist.

| | SPEC mode (default) | LAUNCH mode (only after Erik signs and approves) |
|---|---|---|
| Purpose | A concept to show Erik | Replace the live Duda site |
| Hosting | Hunter's Vercel account, project `ea-pro-concept-leu`. Share its public production `.vercel.app` URL; preview URLs sit behind a Vercel login. | A Vercel project **Erik owns** (Pro plan; Hobby is for non-commercial use only) on [www.eapropainters.com](https://www.eapropainters.com) |
| Indexing | `X-Robots-Tag: noindex, nofollow` header plus a robots meta tag on every route. `robots.txt` is `Allow: /` so crawlers can actually see the noindex. | Fully indexable (section 6). Only `/success` and `/welcome` are `noindex`. |
| Label | A thin top banner on every page: "Concept by Lee Enterprises Unlimited. Not the live EA Pro Painters site." | No banner |
| Forms | Demo only. The button reads "Submit (demo)". The thank-you text reads: "Demo only. Nothing was sent. To reach EA Pro Painters call 206.250.1194." | Post to Erik's HubSpot form (section 7), then a full page load to `/success` |
| Tracking | **None.** No GTM, GA4, Ads, Clarity or HubSpot tags. | Exactly the tags in section 7 and nothing else |
| DNS / Duda | Never touched | Follow the migration plan (section 9) |

---

## 2. Hard rules (never break these)

1. **Every URL in section 4 keeps its exact path.** Lowercase, no trailing slash, www host. Don't "clean up" URLs, merge pages or change slugs during the rebuild. Ranking changes come later, one at a time, in `SEO-BACKLOG.md`.
2. **Keep every existing redirect** in section 4, each as one hop to a page that loads (status 200).
3. **Lowercase redirect.** Duda serves `/About`; Vercel is case-sensitive.
   - Put it in `proxy.ts` (called `middleware.ts` before Next 16).
   - Skip `/_next/`, `/api/` and any path with a file extension.
   - Lowercase only the path and keep the query string exactly as it is, so ad click IDs (`gclid`) and UTM values survive.
   - Apply the section 4 redirect map in the same step, so the redirect lands on the final URL in one hop.
4. **Content parity first.** Every page launches with its current title and meta description word for word. The only exceptions are missing or duplicated ones. Keep the H1 topic, body content, FAQs and internal links too. Improve the design and structure; never delete content that ranks. Proposed rewrites go in `SEO-BACKLOG.md` for after rankings settle.
5. **No invented facts.** No made-up reviews, stats, awards, team members, prices, photos, neighborhoods or "years in business". Reviews are copied **exactly**, with the name as shown. A review is tagged to a city only if the review or its platform shows that city. Anything without a source (Erik or the live site) gets `[CONFIRM WITH ERIK: …]` and goes in `OPEN-QUESTIONS.md`.
6. **Placeholders are never filled in by you.** At LAUNCH, an unanswered placeholder means: put back the live site's wording, or remove that element.
7. **No stock photos.** Use only EA Pro's own project photos. Drop the iStock images.
8. **No self-serving review stars in schema.** No `aggregateRating` or `Review` markup about EA Pro on its own site, including markup injected by widgets. Show reviews as visible text.
9. **No doorway pages.** Don't create new city pages to grab search volume. Duvall and Factoria get pages only if Erik supplies real local projects there.
10. **Never fire his real conversions.** In every browser crawl of a live site, block requests to googleadservices.com, googleads.g.doubleclick.net, google.com/pagead, google-analytics.com, analytics.google.com, clarity.ms and track.hubspot.com (Playwright's `page.route`). Fetch `/success` and `/welcome` with plain HTTP, never in a browser.
11. **Never submit forms on the live site, never contact EA Pro, never print secrets.** Secrets live in `.env.local` locally (git-ignored) and in the Vercel project's environment settings, never with a `NEXT_PUBLIC_` prefix.
12. **Don't make your own judgment calls on his business.** The open questions in section 11 go to Hunter.

---

## 3. Business facts (as shown on the live site, Oct 20, 2026)

| Fact | Value | Status |
|---|---|---|
| Name | EA Pro Painters | Use exactly. The site also says "E&A Pro Painters" and "EA Pro Painting"; standardize on **EA Pro Painters** |
| Address | 3700 Factoria Blvd SE, Suite A, Bellevue, WA 98006 ("next to Sherwin-Williams") | Must match his Google Business Profile exactly |
| Phone | 206.250.1194 | Main number everywhere |
| Email | sales@eapropainters.com | |
| Hours | Monday–Friday, 8am–7pm | The Kirkland page adds Saturday: CONFIRM |
| Founded | 2010 | Confirmed by Hunter |
| License | WA contractor license EAPROPP7611N · WA UBI 604 324 084 · Bonded & insured | Show in the footer and on the estimate page |
| Warranty | 4-year warranty on the pages; the FAQ meta description says 2-year | CONFIRM (use 4-year with a placeholder flag) |
| Reviews | Birdeye widget: 556 reviews, 4.9 average. Google Business Profile: 183 Google reviews, 4.8 (Oct 20, 2026) | Store in ONE config file with source and date; never mix the numbers |
| Award | ThreeBestRated "Top 3 Painter in Bellevue, WA" (2024) | Shown on the live homepage; always show the year |
| Services | Interior, Exterior, Commercial, Cabinet, Custom, Millwork, Drywall, Decks & Fences, HOA | |
| Service area | The 23 cities in section 4 | The FAQ also mentions Dallas, TX: CONFIRM before keeping |
| Second location? | The Kirkland page shows "11624 NE 155th St, Kirkland WA 98034", 206.312.3292, Saturday hours | CONFIRM. Don't put a second address in schema until Erik confirms it's a real, verified location |
| Google Maps | https://maps.app.goo.gl/zSG6seBTU3sFKXEB7 | |
| Social | instagram.com/eapropainters · facebook.com/eapropainters · yelp.com/biz/ea-pro-painters-bellevue | |
| Estimate timing | "We can schedule you in for an estimate within 1-2 days… start 1-2 weeks or earlier if requested." "We apply two coats." | From his FAQ |

**Where he ranks today** (searched from Bellevue, Kirkland or Redmond, Oct 20, 2026). Save this in `BASELINE.md`.

| Search | Map top 3 | EA Pro |
|---|---|---|
| house painters Bellevue | HELLO Painting · Five Star Painting of Bellevue · Color Cat Painting | Not in the map top 3, not on page 1 |
| interior painters Bellevue | Five Star · HELLO · Color Cat | **#4 organic** (/painting-company/bellevue) |
| cabinet painting Bellevue | Cabinets Refinish · Five Star · Custom Cabinet Painting | Not on page 1 |
| interior painters Kirkland | American Classic · Golden Oak · Alpen | Not on page 1 |
| exterior painters Redmond | Redmond Pro · Golden Oak · Elegant Painting | Not on page 1 |
| Google Maps app, "house painters" near Bellevue | | **#3** |
| Google AI Mode, "best house painters in Bellevue, WA" | | Not mentioned |

---

## 4. Every live URL (must all exist at these exact paths)

Host `https://www.eapropainters.com`. The apex domain and `http://` currently 301 to www; keep that. No trailing slash: `/about/` 301s to `/about`.

**Core (8):** `/` · `/about` · `/services` · `/faqs` · `/portfolio` · `/blog` · `/contact` · `/estimate`

**Services (9):** `/interior-painting` · `/exterior-painting` · `/commercial-painting` · `/cabinet-painting` · `/custom-painting` · `/millwork-painting` · `/drywall-painting` · `/decks-and-fences-painting` · `/hoa`

**Cities (23):** `/kirkland`, and under `/painting-company/`: `bellevue` · `bothell` · `clyde-hill` · `edmonds` · `everett` · `issaquah` · `juanita` · `kenmore` · `lynnwood` · `medina` · `mercer-island` · `mill-creek` · `monroe` · `newcastle` · `redmond` · `renton` · `sammamish` · `seattle` · `shoreline` · `snohomish` · `snoqualmie` · `woodinville`

**Blog posts (25, most at the root):**
`/5-signs-time-to-repaint` · `/summer-exterior-painting-makeover` · `/choose-the-best-paint-colors-for-your-home-2025` · `/deck-staining-vs-painting-which-is-best-for-your-outdoor-space` · `/the-ultimate-guide-to-preparing-your-washington-home-for-interior-painting` · `/top-5-trending-exterior-paint-colors-for-washington-homes-in-2025` · `/how-to-choose-weather-resistant-colors` · `/interior-color-trends-for-seattle-home` · `/eco-friendly-painting-options` · `/commercial-painting-in-bellevue-minimize-disruption` · `/benefits-of-hiring-professional-painters` · `/seasonal-painting-tips-when-is-the-best-time-to-paint` · `/preparing-your-home-for-a-professional-paint-job-essential-tips-and-tricks` · `/understanding-paint-types-which-is-best-for-your-project` · `/creating-a-modern-look-tips-for-choosing-the-perfect-paint-finish` · `/revamping-your-office-space-the-impact-of-professional-painting` · `/blog/step-by-step-guide-to-interior-painting` · `/the-benefits-of-hiring-professional-painters-vs-diy` · `/top-10-tips-for-painting-your-home-in-the-winter` · `/how-to-maintain-your-painted-surfaces-for-long-lasting-beauty` · `/5-signs-its-time-to-refresh-your-homes-exterior` · `/importance-of-quality-paint-against-weather-damage` · `/ultimate-guide-to-the-right-paint-finish-for-your-outdoor-spaces` · `/transform-your-homes-curb-appeal-top-color-trends-for-2024` · `/the-best-time-to-paint-why-summer-is-ideal-for-exterior-painting-projects`

**Other (3):** `/success` (thank-you page after the estimate form; Google Ads conversions fire on it, so keep it and make it `noindex`) · `/welcome` (`noindex`) · `/recommended-companies`

**Also keep:** `/llms.txt`. It exists today. Rewrite it with accurate facts; Google ignores it, but other AI tools may read it.

**Existing redirects (keep all, each one hop):**

| From | To |
|---|---|
| `/home`, `/home-old` | `/` |
| `/commercial` | `/commercial-painting` |
| `/painting-company/kirkland` | `/kirkland` |
| `/step-by-step-guide-to-interior-painting-make-your-home-look-like-a-pro-s-work` | `/blog/step-by-step-guide-to-interior-painting` |
| `/commercial-painting-in-bellevue-how-to-minimize-business-disruption-during-renovations` | `/commercial-painting-in-bellevue-minimize-disruption` |
| `/eco-friendly-painting-options-for-environmentally-conscious-homeowners-in-kirkland` | `/eco-friendly-painting-options` |
| `/interior-color-trends-for-seattle-homes-balancing-modern-style-with-natural-light` | `/interior-color-trends-for-seattle-home` |

**New URLs you may add** (additive only, never replacing an old one): `/painting-company` (an "Areas We Serve" hub, which fixes today's `href="#"` menu) · `/portfolio/[project-slug]` (project case studies) · `/privacy` and `/terms` (today's footer link points to the homepage) · crawlable blog pagination (`/blog/page/2` and so on).

---

## 5. Design: what "award-level" means here

Research summary: no painting contractor has won a top-tier design award (Awwwards or CSSDA Site of the Day) in 2023–2026. So the design craft comes from Awwwards-recognized contractor sites, and the conversion patterns come from the best painter sites. Borrow patterns, never copy brands, copy, imagery or layouts.

- **Craft references:** Haven Constructions (havenconstructions.com.au), Modus Projects (modusprojects.nl), The Fitouter (thefitouter.com). All three got Awwwards Honorable Mentions in 2025–2026.
- **Conversion references:**
  - Hedlund Painting (hedlundpainting.com): the direct Eastside competitor and the page to beat, especially its Bellevue page.
  - Eleven Coats Painting: copy voice, proof row, published price ranges.
  - Nolan Painting and CertaPro: estimate flows.
  - Phinney Ridge Painting: editorial painter look.

### 5.1 Visual system (pick one direction in Phase 2, then apply it everywhere)

- **Direction A, "Eastside Craft" (editorial):**
  - Warm off-white base (around `#F7F4EF`) with deep evergreen or ink text.
  - One accent, taken from EA Pro's logo colors (check the logo first).
  - A large display serif with a quiet sans (Inter) for body text.
  - Feels like a finished interior.
- **Direction B, "Bold Pro" (cinematic):**
  - Dark ink hero over his own exterior project video or photo.
  - A heavy condensed display sans with Inter for body text.
  - One bright accent used only on calls to action.
- **Rules for both:**
  - One accent color, used only for buttons and key words.
  - Body text 17–18px at about 1.6 line height.
  - Small uppercase labels above each section heading.
  - Lots of space between sections (about 96–140px on desktop, 64px on mobile).
  - Light and dark sections alternate to pace long pages.
  - Fonts load through `next/font`, self-hosted.
- **Photography:**
  - Real EA Pro projects only.
  - Each one is named by place and job ("Exterior repaint, Sammamish") once Erik confirms the town.
  - Add close-up craft shots (cut lines, prep, cabinet finish).
  - Use before/after pairs where they exist.
  - Export the originals before anything else.
- **Motion:**
  - Restrained: text and image reveals on scroll, stacking project cards, a slow hero video loop (muted, lazy, with a poster image).
  - Everything turns off with `prefers-reduced-motion`.
  - The estimate button is visible immediately, before any animation runs.

### 5.2 Conversion patterns (all required)

1. **The hero has three parts:**
   - The region: "Eastside painters…" or similar.
   - The promise: warranty and fast reply.
   - A proof row under the buttons: rating with its source, review count, years in business, license number, "ThreeBestRated Top 3 in Bellevue (2024)" badge.
2. **Two hero buttons:** a filled "Get a Free Estimate" and an outlined "Call 206.250.1194".
3. **Always-visible call to action:**
   - Desktop: a sticky header with an estimate button.
   - Mobile: a sticky bottom bar with **Estimate | Call | Reviews**.
   - Nothing (cookie banner, chat bubble, pop-up) may ever cover it.
4. **Microcopy that lowers effort:**
   - "Takes under 2 minutes."
   - "Estimate visit within 1–2 days." That line is from his FAQ; confirm it.
5. **Estimate flow (`/estimate`), multi-step, about 6 fields:**
   - Steps: service type (cards), interior or exterior, ZIP code, timeline, then name, phone, email and notes.
   - Photo upload: SPEC only, unless Hunter approves where the photos get stored.
   - Progress bar and big tap targets.
   - **Consent checkbox:**
     - Unchecked by default and **not required** to submit.
     - The wording names EA Pro Painters, for example "I agree EA Pro Painters may call or text me about my estimate, including automated or AI-assisted calls."
     - Mark it `[CONFIRM WITH ERIK: consent wording, have it reviewed]`.
6. **Reviews next to every call to action:**
   - Real quotes copied exactly, with the name as shown.
   - Platform and date where known.
   - A "Read all reviews" link (Birdeye or Google).
7. **Warranty as a headline asset:** a dedicated section explaining what the warranty covers. Text marked `[CONFIRM]`.
8. **A numbered process:** his live 4-step process, redesigned.
9. **A "why the lowest bid costs more" section:** two coats, prep, licensed and insured, cleanup. Use only claims he already makes.
10. **Projects:**
    - `/portfolio` becomes a filterable grid by service and city.
    - Each project gets its own page: what was done at a glance (location, surfaces, products, finish), then the challenge, process, result and review.
    - Each project page links to its city and service pages.
    - Use placeholders until Erik confirms the details.
11. **Price guidance:** reuse ONLY the cost ranges already on his city FAQs (for example the Mercer Island "$6,000 to $14,000"). Anything more needs `[ERIK TO PROVIDE]`.
12. **A path for each type of customer:** homeowners, HOA and property managers (`/hoa`), commercial (`/commercial-painting`).
13. **Lead-safe note** for homes built before 1978, only if Erik confirms he's an EPA lead-safe certified firm.

### 5.3 Mistakes to avoid (seen on top painter sites)

- Broken trust widgets (a "0/5" rating, empty award tiles).
- Stock "dream home" photos.
- A homepage with almost no text.
- Several different phone numbers.
- Heavy slideshows.
- A hero button that isn't the estimate.
- Cookie, chat or pop-up layers covering the hero or the sticky bar on mobile.
- A FAQ that doesn't match the business.

---

## 6. SEO spec

**Technical**
- Next.js App Router with static generation for every page. Use `generateStaticParams` and `dynamicParams = false` so unknown slugs return a real 404.
- `trailingSlash: false`.
- `metadataBase: new URL('https://www.eapropainters.com')` in the root layout.
- Every page has an absolute self-referencing www canonical. qa.ts treats the root with or without its trailing slash as the same URL.
- Redirects go in `next.config` `redirects()` with `permanent: true` (308; Google treats it the same as 301). The lowercase rule follows section 2, rule 3.
- `app/sitemap.ts`:
  - Lists all indexable URLs with absolute www URLs and real `lastmod` dates.
  - No `priority` or `changefreq`.
  - Leaves out `/success` and `/welcome`.
  - Includes an image sitemap.
- `app/robots.ts`: allow crawling in both modes (in SPEC the noindex header does the blocking). Include the sitemap in LAUNCH. Explicitly allow `OAI-SearchBot` and `PerplexityBot`.
- Every important page is reachable through plain `<a href>` links. The blog archive is paginated and crawlable (today it relies on a JavaScript "More Posts" button).
- **Carry over unchanged:** every site-verification meta tag and verification file found in Phase 1 (Google, Bing, Meta and others). Losing them can drop his Search Console access on launch day.
- **Open Graph and Twitter tags:** keep the live values where they exist; otherwise generate them from the title, description and hero image.

**Content and on-page**
- **Titles and meta descriptions:**
  - Use the *rendered* live values word for word. robots.txt names Alli AI, which may inject SEO changes with JavaScript, so crawl with a real browser.
  - Write new ones only where the live value is missing or duplicated, in the style "Service or City | EA Pro Painters". Two are missing today: `/blog/step-by-step-guide-to-interior-painting` and `/how-to-maintain-your-painted-surfaces-for-long-lasting-beauty`.
  - Proposed improvements go in `SEO-BACKLOG.md`.
- **Headings:**
  - Exactly one H1 per page.
  - Fix the 23 blog posts that have no H1 by making the post title the H1.
  - Fix the double H1s on `/exterior-painting`, Edmonds, Monroe, Seattle, `/recommended-companies` and `/welcome`.
  - Fix `/contact` and `/success`, where the H1 is a review-widget heading.
- **City pages** (the biggest ranking opportunity; must be genuinely useful, not doorways). Keep every city page's current unique text and FAQs, then add sections only from real sources:
  - Real projects in that city.
  - Reviews that show that city.
  - Links to the relevant services.
  - The existing local cost FAQs.
  - Breadcrumbs and a link to the `/painting-company` hub.
  - Neighborhood and housing-stock notes only with a source; otherwise `[CONFIRM WITH ERIK]`.
  - Replace the same 3 testimonials repeated across 17 city pages with real reviews that show the city where possible; otherwise keep the current ones.
  - Fix the "Snohmish" typo.
- **Service pages:** keep the long-form content (about 900–2,000 words each). Restructure it into scannable sections with project photos, the process, an FAQ and calls to action.
- **About page:** about 93% of its text duplicates the homepage. Restructure it around the owner's story, the team, the license, insurance and warranty, using `[ERIK TO PROVIDE]` placeholders. "Mark Thompson" stays out unless Erik confirms him.
- **Fix site-wide:**
  - Logo link (point it to `/`, not `/home-old`).
  - Footer "Share by:" text.
  - The broken `my.duda.co` link on Juanita.
  - Internal links that go through redirects (point them straight to the final URL).
  - "keep the Eastside of colorful".
  - Buttons labeled only "Button".
  - Empty alt text.
- **Leave until 4–8 weeks after launch, once rankings settle** (one change at a time, with 301s, from `SEO-BACKLOG.md`): merging the duplicate blog posts (the two "5 signs" posts, the two "pros vs DIY" posts, the three "best time/summer" posts), title rewrites, and deepening the city pages further.

**Structured data (JSON-LD, only facts visible on the page)**
- One `HousePainter` entity with a stable `@id` (`https://www.eapropainters.com/#business`), on the homepage and `/about`. Include:
  - Name, address and phone exactly as on his Google Business Profile.
  - `geo` to at least 5 decimal places, opening hours, `url`, `logo`, `image`.
  - `sameAs` (Google Maps, Instagram, Facebook, Yelp), `foundingDate` 2010, `areaServed` (the 23 cities).
  - `hasOfferCatalog` with the 9 services.
- City and service pages: `Service` (provider = `#business`, `areaServed` = that city) plus `BreadcrumbList`. No duplicate businesses.
- Blog posts: `BlogPosting` with a real author name (`[ERIK TO PROVIDE]`), and `datePublished` (from the live post date) and `dateModified`.
- `FAQPage` on pages with visible FAQs is optional. Google stopped showing FAQ rich results in May 2026, but other engines may read it.
- **No** `aggregateRating`, **no** `Review` markup about EA Pro, including anything a review widget injects.

**Performance and accessibility**
- **Lab targets (mobile):** LCP ≤ 2.5 s, TBT ≤ 200 ms, CLS ≤ 0.1. Lighthouse Performance ≥ 95, and SEO, Accessibility and Best Practices = 100.
- In SPEC, run Lighthouse with `--skip-audits=is-crawlable`. Never weaken noindex to pass.
- In LAUNCH, measure with every tag live. Never remove, delay or move tags into a web worker to raise a score; report the numbers to Hunter instead.
- Field INP (≤ 200 ms) comes from Search Console after launch.
- **Images:**
  - Store originals as JPG/PNG.
  - Set `images.formats: ['image/avif','image/webp']`.
  - `next/image` with width and height set.
  - Descriptive file names and alt text (`interior-repaint-sammamish-living-room.jpg`, not `IMG_1384`).
  - The hero image or poster loads eagerly with high fetch priority. Everything else lazy-loads.
- **Accessibility:** WCAG AA contrast, visible focus states, labeled inputs, real buttons and links, tap targets ≥ 44px.

**AI search**
- State facts plainly near the top of each page: what EA Pro does, where, its license, warranty and years in business.
- Keep the business name, address and phone identical everywhere.
- Write city FAQs as real questions.
- Keep `/llms.txt` accurate.
- Google says there's nothing extra to do for AI Overviews beyond good SEO.

---

## 7. Tech stack and integrations

- **Stack:** Next.js (latest stable, App Router), TypeScript, Tailwind CSS, Vercel.
- **Content:** page content lives in MDX or typed content files (`/content/cities/*.mdx`, `/content/services/*.mdx`, `/content/posts/*.mdx`, `/content/projects/*.mdx`). Business facts live in one `site.config.ts` (name, address, phone, hours, review numbers with source and date).
- **Images:** originals are exported from the live site's Duda CDN (`irp.cdn-website.com/d29ca128/…`), renamed descriptively and stored in `/public/images`.

**Forms (LAUNCH):**
- **Where it sends:**
  - A server Route Handler posts to the HubSpot Forms API: `api.hsforms.com/submissions/v3/integration/submit/45249857/{formGuid}`.
  - Estimate form `79159a64-e985-4619-a94b-111c3f0e060a`; contact form `201b7b0d-71c5-4ebf-b90a-4467f83243f3`; region `na1`.
  - Include `context: {hutk, pageUri, pageName, ipAddress}` so leads keep their traffic source.
- **Fields:**
  - Map only to fields that exist on his HubSpot form. Read the names from the live embed code; never submit it.
  - Put anything else (ZIP, timeline, service) in the message field, unless Erik adds those properties in HubSpot.
  - Store the consent answer, its wording version and a timestamp.
  - Check the form has no CAPTCHA that would block API submissions.
  - Ask Hunter to turn off HubSpot "Collected forms" for the domain, so leads aren't logged twice.
- **After submit:** `window.location.assign('/success')`, a full page load, never `router.push`. His Google Ads conversion fires on that page view.
- **Speed-to-lead:** optional. Also send leads to `STL_WEBHOOK_URL` (set in Vercel's environment settings) once that system is live. Never send a lead whose consent box is unchecked.
- **Spam protection:** a hidden honeypot field plus a minimum fill time.

**Tracking (LAUNCH only, nothing else):**
- **Google Tag Manager `GTM-T89BLP6F`.** It already contains GA4 `G-26SF8R1JV9`, Google Ads `AW-16459889361` and Microsoft Clarity. Don't add those tags separately.
  - Before building the form, get read access to GTM (Hunter asks Erik) and list every tag's trigger.
  - Flag any trigger that depends on HubSpot embed callbacks or Duda form events, and give the new form a matching `dataLayer.push` event.
  - Keep `tel:` and `mailto:` click tracking working.
- **HubSpot tracking (portal `45249857`).** Call `_hsq.push(['setPath', path]); _hsq.push(['trackPageView'])` on each page change. Keep any HubSpot chat bubble off the mobile sticky bar.
- **Never install Alli AI** or any script that rewrites titles, meta, canonicals or schema. Hunter asks Erik to disconnect Alli AI before cutover.

**Reviews:** either the Birdeye widget (business 170905799500570), lazy-loaded below the fold with its schema output turned off, or a static block of real review quotes refreshed by hand. Never both in the same spot.

**Privacy and Terms:** draft `/privacy` and `/terms` covering the forms, cookies, analytics and SMS/AI-call consent. Mark both `[DRAFT, have it reviewed. Not legal advice.]`

---

## 8. How to work (phases; stop and show Hunter at each ★)

**Phase 0, setup.**
- Scaffold the project (section 0).
- Create `CLAUDE.md`, `.env.example`, `.gitignore`, `BASELINE.md`, `OPEN-QUESTIONS.md` and `SEO-BACKLOG.md`.
- Print any questions you have as a numbered list, then continue with placeholders. Don't wait.

**Phase 1, capture the live site** (read-only; analytics requests blocked per section 2, rule 10).
- Crawl all URLs in section 4 with Playwright, rendered. Fetch `/success` and `/welcome` with plain HTTP only.
- For each page, save to `/audit/inventory.json`:
  - Status, title, meta description, canonical, meta robots and X-Robots-Tag.
  - H1/H2s, full body text, FAQs and visible post dates.
  - JSON-LD.
  - Open Graph and Twitter tags.
  - Images, with their alt text.
  - Internal links.
  - Every third-party script or iframe host.
- Save every site-verification meta tag and check the root for verification files (`google*.html`, `BingSiteAuth.xml`).
- Confirm every redirect in section 4.
- Download the original images.
- Save the full text of every review shown, exactly as written.

**Phase 2 ★, design direction.** Build the homepage hero plus one Bellevue city section in Direction A and Direction B. Deploy to the SPEC URL. Hunter picks one.

**Phase 3, build.**
- Build all templates and all live pages, plus the hub, project, privacy and terms pages, in the chosen direction.
- Carry every page's content over first, then improve it as section 6 allows.

**Phase 4 ★, QA.** Write `scripts/qa.ts` and make it pass:
- All section 4 paths return 200.
- Every old redirect, plus `/Home`, `/About` and `/Painting-Company/Kirkland?gclid=AbC`, is one hop to a 200 with the query string kept.
- Every page has an absolute www canonical.
- Exactly one H1 per page.
- Title and meta diff report against `/audit/inventory.json`: identical, except the listed missing or duplicated ones.
- The *rendered* page (Playwright) contains no `aggregateRating`.
- Verification tags are present.
- No broken internal links.
- In LAUNCH: no `[CONFIRM…]` or `[ERIK TO PROVIDE]` left. Each one was answered, reverted to the live wording or removed (never filled in by you).
- Lighthouse mobile on Home, `/estimate`, `/painting-company/bellevue` and `/interior-painting` meets section 6.
- No axe accessibility errors.
- Screenshots at 375px and 1440px.

**Phase 5 ★, LAUNCH** (only with Hunter's go-ahead in chat). Follow section 9.

---

## 9. LAUNCH migration plan (keep the rankings)

**Before launch**
0. **Prerequisites:**
   - Erik has owner logins for his domain registrar and DNS, Search Console, GTM, GA4, Google Ads, HubSpot, Google Business Profile and Birdeye, and no agency holds them.
   - Export his Google and Microsoft Ads final URLs and sitelinks, plus any QR-code or print URLs, and add them to qa.ts. Paid landing pages are often missing from Search Console.
   - The domain's CAA records (if any) allow letsencrypt.org.
   - Record the current DNS values in `BASELINE.md`.
   - Keep the Duda plan active for 30 days as a rollback.
1. Hunter exports from Google Search Console: indexed pages, Performance by page (16 months) and top linked pages. Also GA4 landing pages. Add any missing URLs to the route list or the redirects.
2. Record the baselines in `BASELINE.md`:
   - Map positions (a grid check around Bellevue) and organic ranks for the 5 searches in section 3.
   - Clicks per page.
   - Core Web Vitals.
3. **Vercel setup:**
   - Create the project on **Erik's** account (Pro plan), or transfer it there.
   - Set `[www.eapropainters.com](https://www.eapropainters.com)` as the primary domain, with a permanent (301/308, not 307) apex-to-www redirect.
   - Redirect only the exact production `.vercel.app` alias to www, not preview URLs.
4. **DNS:**
   - Lower the TTL at least a week ahead.
   - Change only the apex A record and the `www` CNAME at the current DNS provider. Don't move nameservers.
   - If nameservers must move, first copy every record (MX, SPF/DKIM/DMARC TXT, google-site-verification, other subdomains) and verify them.
5. **Launch-mode check before switching DNS.** Run qa.ts against a local `SITE_MODE=launch` production build (`next build && next start`). Vercel previews always add noindex, so they can't prove this.
   - There is no noindex except on `/success` and `/welcome`.
   - robots.txt allows crawling.
   - GTM is present, and there's no banner.
   - Submit one lead labeled TEST, with `STL_WEBHOOK_URL` unset. It must appear in HubSpot, land on `/success` and fire the Ads conversion (check in Tag Assistant). Then delete the test lead.

**Launch day**

6. Switch DNS at a quiet time. Keep the Duda site live.
7. Crawl the live new site (with analytics requests blocked). Check robots, noindex, redirects and canonicals.
8. Run URL Inspection on Home, `/painting-company/bellevue`, `/interior-painting` and `/estimate`. Submit the sitemap in Search Console.
9. Check that the Google Business Profile website link returns 200.

**After launch (8 weeks)**

10. Send a GA4 event from `not-found.tsx` with the missing path, because Vercel keeps runtime logs only briefly. In week 1, check daily:
    - Search Console page indexing (Not found (404), soft 404s, "Google chose different canonical").
    - The 404 event in GA4; add any missed redirects at once.
    - The forms and conversions.
11. Then check weekly against `BASELINE.md`. Rankings may wobble for a few weeks; that's normal.
12. Keep all redirects for at least a year (ideally for good).
13. Only after rankings settle, work through `SEO-BACKLOG.md` one change at a time.

---

## 10. Done when

- [ ] **SPEC:** the concept URL shows the banner and sends `noindex`, has no tracking and demo-only forms, has the chosen design on every live page plus the new pages, and passes QA.
- [ ] **LAUNCH:** every live URL works at the same path, redirects are one hop, titles and content match, tracking, HubSpot and conversions are verified, verification tags are kept, the sitemap is submitted, the domain is on Erik's account, and there's an 8-week monitoring note in `BASELINE.md`.

---

## 11. Open questions for Erik (keep `[CONFIRM]` placeholders until answered)

1. Warranty: 4 years (on the pages) or 2 years (FAQ meta description)?
2. Which review number to show, and from where: Birdeye 556 at 4.9, or Google 183 at 4.8?
3. The Kirkland address (11624 NE 155th St) and 206.312.3292: a real second location with its own Google profile, or old info?
4. Is the Dallas, TX service area still current?
5. Saturday hours?
6. "Team leader Mark Thompson" (decks page): real? The reviews name Alfredo, Erlin and Edwin as crew leads.
7. Mill Creek page claims ("top three highest-ranked… in the state", HomeAdvisor "five years in a row"): can they be backed up? If not, remove them.
8. "1,000+ projects completed": OK to keep?
9. Which paint brands and product lines he uses (for the "what we use" section).
10. Price ranges he's comfortable publishing.
11. For each portfolio photo: the town and the type of job. Permission to show the projects.
12. Any real jobs in Duvall or Factoria (needed before those pages are built).
13. Owner name, photo and story for the About page. Blog author name.
14. Is EA Pro an EPA lead-safe certified firm?
15. Consent wording for calls and texts (have it reviewed), and whether to add ZIP, timeline and service fields to his HubSpot form.
16. Read access to his GTM container, and his OK to disconnect Alli AI at launch.
