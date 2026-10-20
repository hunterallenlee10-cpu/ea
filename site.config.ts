/**
 * Every business fact on the site comes from here (KICKSTART section 3).
 * Source for each value: the live site as of Oct 20, 2026, unless noted.
 * Anything unconfirmed carries a visible [CONFIRM WITH ERIK: …] placeholder and is listed in OPEN-QUESTIONS.md.
 */

export const CONFIRM = (what: string) => `[CONFIRM WITH ERIK: ${what}]`;
export const ERIK_TO_PROVIDE = (what: string) => `[ERIK TO PROVIDE: ${what}]`;

export const site = {
  name: "EA Pro Painters",
  url: "https://www.eapropainters.com",
  businessId: "https://www.eapropainters.com/#business",

  // Must match the Google Business Profile exactly.
  address: {
    street: "3700 Factoria Blvd SE, Suite A",
    streetSchema: "3700 Factoria Blvd SE Ste A", // as in the live site's schema
    city: "Bellevue",
    region: "WA",
    zip: "98006",
    country: "US",
    note: "Next to Sherwin-Williams",
  },
  // From the live site's HousePainter schema.
  geo: { lat: 47.57732, lng: -122.16768 },

  phone: { display: "206.250.1194", e164: "+12062501194", schema: "(206) 250-1194" },
  email: "sales@eapropainters.com",

  hours: {
    display: "Monday–Friday, 8am–7pm",
    days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    opens: "08:00",
    closes: "19:00",
    saturdayNote: CONFIRM("Saturday hours (shown only on the Kirkland page today)"),
  },

  founded: 2010, // Confirmed by Hunter.

  license: {
    contractor: "EAPROPP7611N",
    ubi: "604 324 084",
    bondedInsured: true,
    display: "WA Lic. EAPROPP7611N · UBI 604 324 084 · Bonded & insured",
  },

  warranty: {
    years: 4, // Pages say 4; the FAQ meta description says 2.
    display: "4-year warranty",
    flag: CONFIRM("warranty length: 4 years on the pages vs 2 years in the FAQ meta description"),
    coverage: CONFIRM("what the warranty covers"),
  },

  // Never mix these two. The site shows ONE, chosen by Erik (OPEN-QUESTIONS #2).
  reviews: {
    birdeye: {
      source: "Birdeye",
      count: 556,
      rating: 4.9,
      asOf: "2026-10-20",
      url: "https://birdeye.com/ea-pro-painters-170905799500570",
      businessId: "170905799500570",
    },
    google: {
      source: "Google",
      count: 183,
      rating: 4.8,
      asOf: "2026-10-20",
      url: "https://maps.app.goo.gl/zSG6seBTU3sFKXEB7",
    },
    // Which one the site displays. Pending Erik's answer.
    display: "birdeye" as "birdeye" | "google",
    displayFlag: CONFIRM("which review number to show: Birdeye 556 at 4.9 or Google 183 at 4.8"),
  },

  award: {
    name: "ThreeBestRated Top 3 Painter in Bellevue, WA",
    short: "ThreeBestRated Top 3 in Bellevue",
    year: 2024,
  },

  estimateTiming: {
    // Quoted from his FAQ.
    visit: "Estimate visit within 1–2 days",
    visitFlag: CONFIRM("estimate visit within 1–2 days"),
    start: "Start in 1–2 weeks, or earlier if requested",
    coats: "We apply two coats",
  },

  maps: "https://maps.app.goo.gl/zSG6seBTU3sFKXEB7",
  social: {
    instagram: "https://www.instagram.com/eapropainters",
    facebook: "https://www.facebook.com/eapropainters",
    yelp: "https://www.yelp.com/biz/ea-pro-painters-bellevue",
  },

  // LAUNCH only. Never rendered in spec mode.
  tracking: {
    gtm: "GTM-T89BLP6F",
    hubspotPortal: "45249857",
  },
} as const;

export type ReviewSource = keyof Pick<typeof site.reviews, "birdeye" | "google">;
export const displayedReviews = () => site.reviews[site.reviews.display];
export const yearsInBusiness = (now = new Date("2026-10-20")) => now.getFullYear() - site.founded;
