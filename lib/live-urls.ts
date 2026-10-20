// Every URL on the live Duda site (KICKSTART section 4). These paths must never change.
// Shared by the Phase 1 crawler, the sitemap and scripts/qa.ts.

export const SITE_ORIGIN = "https://www.eapropainters.com";

export const CORE_PATHS = [
  "/",
  "/about",
  "/services",
  "/faqs",
  "/portfolio",
  "/blog",
  "/contact",
  "/estimate",
] as const;

export const SERVICE_SLUGS = [
  "interior-painting",
  "exterior-painting",
  "commercial-painting",
  "cabinet-painting",
  "custom-painting",
  "millwork-painting",
  "drywall-painting",
  "decks-and-fences-painting",
  "hoa",
] as const;

// Kirkland lives at /kirkland; every other city is under /painting-company/.
export const CITY_SLUGS = [
  "bellevue",
  "bothell",
  "clyde-hill",
  "edmonds",
  "everett",
  "issaquah",
  "juanita",
  "kenmore",
  "lynnwood",
  "medina",
  "mercer-island",
  "mill-creek",
  "monroe",
  "newcastle",
  "redmond",
  "renton",
  "sammamish",
  "seattle",
  "shoreline",
  "snohomish",
  "snoqualmie",
  "woodinville",
] as const;

export const CITY_PATHS = ["/kirkland", ...CITY_SLUGS.map((s) => `/painting-company/${s}`)];

export const POST_PATHS = [
  "/5-signs-time-to-repaint",
  "/summer-exterior-painting-makeover",
  "/choose-the-best-paint-colors-for-your-home-2025",
  "/deck-staining-vs-painting-which-is-best-for-your-outdoor-space",
  "/the-ultimate-guide-to-preparing-your-washington-home-for-interior-painting",
  "/top-5-trending-exterior-paint-colors-for-washington-homes-in-2025",
  "/how-to-choose-weather-resistant-colors",
  "/interior-color-trends-for-seattle-home",
  "/eco-friendly-painting-options",
  "/commercial-painting-in-bellevue-minimize-disruption",
  "/benefits-of-hiring-professional-painters",
  "/seasonal-painting-tips-when-is-the-best-time-to-paint",
  "/preparing-your-home-for-a-professional-paint-job-essential-tips-and-tricks",
  "/understanding-paint-types-which-is-best-for-your-project",
  "/creating-a-modern-look-tips-for-choosing-the-perfect-paint-finish",
  "/revamping-your-office-space-the-impact-of-professional-painting",
  "/blog/step-by-step-guide-to-interior-painting",
  "/the-benefits-of-hiring-professional-painters-vs-diy",
  "/top-10-tips-for-painting-your-home-in-the-winter",
  "/how-to-maintain-your-painted-surfaces-for-long-lasting-beauty",
  "/5-signs-its-time-to-refresh-your-homes-exterior",
  "/importance-of-quality-paint-against-weather-damage",
  "/ultimate-guide-to-the-right-paint-finish-for-your-outdoor-spaces",
  "/transform-your-homes-curb-appeal-top-color-trends-for-2024",
  "/the-best-time-to-paint-why-summer-is-ideal-for-exterior-painting-projects",
] as const;

export const OTHER_PATHS = ["/success", "/welcome", "/recommended-companies"] as const;

// Only these two are noindex in LAUNCH mode, and only fetched with plain HTTP when crawling the live site.
export const NOINDEX_PATHS = ["/success", "/welcome"] as const;

export const ALL_LIVE_PATHS: string[] = [
  ...CORE_PATHS,
  ...SERVICE_SLUGS.map((s) => `/${s}`),
  ...CITY_PATHS,
  ...POST_PATHS,
  ...OTHER_PATHS,
];

// Existing redirects (section 4). Each must be one hop to a 200.
export const LEGACY_REDIRECTS: Record<string, string> = {
  "/home": "/",
  "/home-old": "/",
  "/commercial": "/commercial-painting",
  "/painting-company/kirkland": "/kirkland",
  "/step-by-step-guide-to-interior-painting-make-your-home-look-like-a-pro-s-work":
    "/blog/step-by-step-guide-to-interior-painting",
  "/commercial-painting-in-bellevue-how-to-minimize-business-disruption-during-renovations":
    "/commercial-painting-in-bellevue-minimize-disruption",
  "/eco-friendly-painting-options-for-environmentally-conscious-homeowners-in-kirkland":
    "/eco-friendly-painting-options",
  "/interior-color-trends-for-seattle-homes-balancing-modern-style-with-natural-light":
    "/interior-color-trends-for-seattle-home",
};
