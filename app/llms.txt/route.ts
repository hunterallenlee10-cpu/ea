import { site, yearsInBusiness, displayedReviews } from "@/site.config";
import { CITIES, SERVICES } from "@/lib/nav";
import { getPage } from "@/lib/content";
import { CORE_PATHS } from "@/lib/live-urls";

// /llms.txt, rewritten with accurate facts from site.config.ts (KICKSTART section 4 "Also keep").
export const dynamic = "force-static";

const u = (p: string) => `${site.url}${p === "/" ? "/" : p}`;

export function GET() {
  // Only the review source the site displays (never mix the two numbers).
  const r = displayedReviews();
  const lines = [
    `# ${site.name}`,
    "",
    `> ${site.name} is a licensed, bonded and insured painting company in Bellevue, WA, serving homeowners, HOAs and businesses on the Eastside of King County and in Snohomish County since ${site.founded}.`,
    "",
    "## Business facts",
    "",
    `- Name: ${site.name}`,
    `- Address: ${site.address.street}, ${site.address.city}, ${site.address.region} ${site.address.zip} (${site.address.note.toLowerCase().replace("sherwin-williams", "Sherwin-Williams")})`,
    `- Phone: ${site.phone.display}`,
    `- Email: ${site.email}`,
    `- Hours: ${site.hours.display}`,
    `- Founded: ${site.founded} (${yearsInBusiness()}+ years)`,
    `- License: WA contractor license ${site.license.contractor}; WA UBI ${site.license.ubi}; bonded and insured`,
    `- Warranty: 4-year (pending confirmation)`,
    `- Reviews: ${r.rating} average from ${r.count} reviews on ${r.source} (as of ${r.asOf})`,
    `- Award: ${site.award.name} (${site.award.year})`,
    `- Estimates: free. From our FAQ: "We can schedule you in for an estimate within 1-2 days."`,
    `- Google Maps: ${site.maps}`,
    "",
    "## Services",
    "",
    ...SERVICES.map((s) => `- [${s.name}](${u(`/${s.slug}`)}): ${getPage(`/${s.slug}`).description}`),
    "",
    "## Areas served",
    "",
    `- [All areas](${u("/painting-company")})`,
    ...CITIES.map((c) => `- [${c.name}, WA](${u(c.href)}): ${getPage(c.href).description}`),
    "",
    "## Key pages",
    "",
    ...CORE_PATHS.map((p) => {
      const c = getPage(p);
      return `- [${c.h1}](${u(p)}): ${c.description}`;
    }),
    `- [Areas We Serve](${u("/painting-company")})`,
    `- [Recommended Companies](${u("/recommended-companies")})`,
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
