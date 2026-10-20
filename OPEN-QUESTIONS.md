# OPEN QUESTIONS — for Hunter to ask Erik

Every answer here unlocks a `[CONFIRM WITH ERIK: …]` or `[ERIK TO PROVIDE: …]` placeholder on the site. At LAUNCH, any question still open means: put back the live site's wording, or remove that element. Claude never fills these in.

| # | Question | Where it shows on the site | Answer |
|---|---|---|---|
| 1 | Warranty: 4 years (on the pages) or 2 years (FAQ meta description)? | Hero promise, warranty section, footer | |
| 2 | Which review number to show, and from where: Birdeye 556 at 4.9, or Google 183 at 4.8? | Hero proof row, sticky bar, reviews sections | |
| 3 | The Kirkland address (11624 NE 155th St, Kirkland WA 98034) and 206.312.3292: a real second location with its own Google profile, or old info? | `/kirkland` | |
| 4 | Is the Dallas, TX service area still current? | `/faqs` | |
| 5 | Saturday hours? | `/kirkland`, footer, schema | |
| 6 | "Team leader Mark Thompson" (decks page): real? The reviews name Alfredo, Erlin and Edwin as crew leads. | `/decks-and-fences-painting`, `/about` | |
| 7 | Mill Creek page claims ("top three highest-ranked… in the state", HomeAdvisor "five years in a row"): can they be backed up? If not, remove them. | `/painting-company/mill-creek`, homepage badges | |
| 8 | "1,000+ projects completed": OK to keep? | Homepage, about | |
| 9 | Which paint brands and product lines he uses (for the "what we use" section). | Service pages, project pages | |
| 10 | Price ranges he's comfortable publishing. | City and service pages | |
| 11 | For each portfolio photo: the town and the type of job. Permission to show the projects. | `/portfolio`, `/portfolio/[project]` | |
| 12 | Any real jobs in Duvall or Factoria (needed before those pages are built). | Not built until answered | |
| 13 | Owner name, photo and story for the About page. Blog author name. | `/about`, blog post bylines and schema | |
| 14 | Is EA Pro an EPA lead-safe certified firm? | Lead-safe note for pre-1978 homes | |
| 15 | Consent wording for calls and texts (have it reviewed), and whether to add ZIP, timeline and service fields to his HubSpot form. | `/estimate`, `/contact` | |
| 16 | Read access to his GTM container, and his OK to disconnect Alli AI at launch. | LAUNCH only | |

## Added by Claude during the build

| # | Question | Why it matters | Answer |
|---|---|---|---|
| 17 | "Estimate visit within 1–2 days": OK to use this line next to the estimate button? (It comes from his FAQ.) | Hero and estimate microcopy | |
| 18 | What exactly does the warranty cover (labor, materials, peeling, fading)? | Warranty section | |
| 19 | May we use the ThreeBestRated 2024 badge image, or only the text? | Hero proof row | |
| 20 | Photo upload on the estimate form: where should photos be stored at LAUNCH (HubSpot file field, email, other)? | `/estimate` | |
| 21 | The live HubSpot forms use invisible reCAPTCHA Enterprise. Can Erik turn CAPTCHA off on the estimate and contact forms (our server form has its own spam checks), or confirm the Forms API accepts submissions with it on? | LAUNCH form sending | |
| 22 | The live site loads a Facebook/Meta pixel (`connect.facebook.net`). The spec's tag list doesn't include it. Keep it (inside GTM) or drop it? | LAUNCH tracking | |
| 23 | Photo permission and details: about 30 real project photos are on the live site today. Which town and job is each? (See `content/photos.ts`.) | Every page with photos | |
| 24 | The live homepage shows Angi Super Service Award 2022 and Best of HomeAdvisor 2020 badges. OK to show them as text with the year? | Homepage, about | |
