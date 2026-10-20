# Phase 1 audit — live eapropainters.com (captured Oct 20, 2026)

Read-only. Analytics/ads/conversion hosts were blocked in every browser session; `/success` and `/welcome` were fetched with plain HTTP only. No form was submitted.

| File | What it holds |
|---|---|
| `inventory.json` | Every section 4 URL: status, title, meta description, canonical, robots, X-Robots-Tag, H1–H3, full body text (server + rendered `innerText`), JSON-LD, OG/Twitter, images + alt, internal/external links, third-party hosts, server-vs-rendered diffs |
| `redirects.txt` | Every legacy redirect, mixed-case and trailing-slash checks, apex/http |
| `images.json` | All 126 Duda CDN images: original URL, size, dimensions, pages, alt text |
| `reviews/` | Public Birdeye widget data (full review text) |
| `hubspot/form-fields.json` | Field names of the two HubSpot embeds |
| `live-llms.txt`, `live-robots.txt`, `live-sitemap.xml` | Copies of the live files |
| `frames/` | Text inside iframes (review widget, HubSpot form) |
| `html/`, `images-original/`, `video/` | Rendered HTML, original images and videos (git-ignored, re-create with the scripts) |

Scripts: `scripts/audit/crawl-live.ts`, `download-images.ts`, `extract-reviews.ts`, `read-form-fields.ts`.

## Findings

- **All 68 URLs return 200.** The live sitemap lists exactly the section 4 URLs (68), no more.
- **Redirects:** all 8 legacy redirects are one 301 hop to a 200. `/Painting-Company/Kirkland?gclid=AbC` → `/kirkland?gclid=AbC` (one hop, query kept). `/About` and `/Home` return **200** on Duda (no redirect); the new site will 308 them to lowercase.
- **Alli AI:** server HTML and rendered DOM have identical titles, meta descriptions, canonicals and H1s on every page. No JS rewrites detected today.
- **Verification:** no `google-site-verification`, `msvalidate`, `facebook-domain-verification` or similar meta tag on any page; `BingSiteAuth.xml` and `google*.html` not found. Search Console is probably verified by DNS TXT record: **keep all TXT records at DNS cutover.**
- **H1 problems:** 23 blog posts have no H1; double H1 on `/exterior-painting`, Edmonds, Monroe, Seattle, `/recommended-companies`, `/welcome`; `/contact` and `/success` H1 is the review widget's "Reviews from our customers".
- **Missing meta descriptions:** `/blog/step-by-step-guide-to-interior-painting`, `/how-to-maintain-your-painted-surfaces-for-long-lasting-beauty`. No duplicate titles or descriptions.
- **Structured data:** the homepage already has a `HousePainter` (`@id …/#business`) with geo 47.57732, -122.16768. Birdeye is loaded with `seoEnabled=false`.
- **Blog dates:** posts carry `article:published_time`.
- **Third parties seen:** GTM, HubSpot (tracking + forms + reCAPTCHA Enterprise), Facebook pixel (`connect.facebook.net`), Birdeye, Common Ninja, rss.app (Instagram feed), Google Maps/Places, Duda CDNs.
- **HubSpot forms** (`/estimate` 79159a64…, `/contact` 201b7b0d…): fields `firstname`* , `email`*, `mobilephone`*, `address`, `city`, `message`. **Invisible reCAPTCHA Enterprise is on**, which may block Forms API submissions (see OPEN-QUESTIONS #21).
- **Photos:** of 126 images, about 30 are clearly EA Pro's own (crew in EA shirts, branded trucks and yard signs, real job sites). The rest are logos/badges, text-as-image graphics, or stock (Unsplash, Pexels, iStock, Freepik, a DIY blog, AI-looking interiors), which are excluded per rule 7.
- **Video:** two EA Pro videos on `vid.cdn-website.com`: a 35s services reel (their own yard sign, truck, drone shots) and a 23s commercial interior job.
