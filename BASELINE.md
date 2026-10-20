# BASELINE — EA Pro Painters (before the rebuild)

Recorded Oct 20, 2026. Compare against this weekly for 8 weeks after launch (KICKSTART section 9).

## Search positions (from KICKSTART section 3)

Searched from Bellevue, Kirkland or Redmond, Oct 20, 2026.

| Search | Map top 3 | EA Pro |
|---|---|---|
| house painters Bellevue | HELLO Painting · Five Star Painting of Bellevue · Color Cat Painting | Not in the map top 3, not on page 1 |
| interior painters Bellevue | Five Star · HELLO · Color Cat | **#4 organic** (/painting-company/bellevue) |
| cabinet painting Bellevue | Cabinets Refinish · Five Star · Custom Cabinet Painting | Not on page 1 |
| interior painters Kirkland | American Classic · Golden Oak · Alpen | Not on page 1 |
| exterior painters Redmond | Redmond Pro · Golden Oak · Elegant Painting | Not on page 1 |
| Google Maps app, "house painters" near Bellevue | | **#3** |
| Google AI Mode, "best house painters in Bellevue, WA" | | Not mentioned |

## Live site technical baseline (Phase 1 crawl)

- Host: `https://www.eapropainters.com` on Duda (nginx). Apex and `http://` 301 to www. Trailing slash 301s to no slash.
- Live `sitemap.xml`: 68 URLs, exactly the section 4 list (it includes `/success` and `/welcome`; the new sitemap will not). No image sitemap.
- `robots.txt`: `User-agent: AlliAi / Allow: /` plus the sitemap line. Saved at `audit/live-robots.txt`.
- `/llms.txt`: exists (14.5 KB, auto-generated page list). Saved at `audit/live-llms.txt`.
- Mixed case: Duda serves `/About` and `/Home` as 200 (no redirect). `/Painting-Company/Kirkland?gclid=AbC` 301s to `/kirkland?gclid=AbC`.
- All 8 legacy redirects are one 301 hop to a 200. Details: `audit/redirects.txt`.
- Verification files: `BingSiteAuth.xml` 404, no `google*.html` found. Verification meta tags: see `audit/verification.json`.
- Existing structured data: a `HousePainter` entity with `@id` `https://www.eapropainters.com/#business` on the homepage (see `audit/inventory.json`).

## To fill in before LAUNCH (Hunter)

- [ ] Search Console: indexed pages, Performance by page (16 months), top linked pages.
- [ ] GA4 landing pages.
- [ ] Clicks per page.
- [ ] Map grid check around Bellevue.
- [ ] Core Web Vitals (field data, Search Console).
- [ ] Google and Microsoft Ads final URLs and sitelinks, QR/print URLs.
- [ ] Current DNS records (apex A, www CNAME, MX, TXT, CAA), and TTLs.

## 8-week monitoring log (after LAUNCH)

_Empty until launch._
