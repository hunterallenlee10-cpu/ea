import { displayedReviews, site, yearsInBusiness } from "@/site.config";
import { Ph } from "./Ph";
import { Stars } from "./Stars";

/**
 * Hero proof row (KICKSTART 5.2.1): rating with source, review count, years in business,
 * license number, ThreeBestRated badge with year. Every number comes from site.config.ts.
 */
export function ProofRow({ tone = "light" }: { tone?: "light" | "dark" }) {
  const r = displayedReviews();
  const muted = tone === "dark" ? "text-dark-muted" : "text-muted";
  const rule = tone === "dark" ? "border-dark-line" : "border-line";
  const strong = tone === "dark" ? "text-dark-ink" : "text-ink";
  const items = [
    {
      top: (
        <span className="inline-flex items-center gap-2">
          <span className={`text-2xl font-semibold tabular-nums ${strong}`}>{r.rating}</span>
          <Stars className={tone === "dark" ? "text-dark-accent" : "text-accent"} />
        </span>
      ),
      bottom: (
        <>
          {r.count} reviews on {r.source}
        </>
      ),
    },
    {
      top: <span className={`text-2xl font-semibold tabular-nums ${strong}`}>{yearsInBusiness()}+ yrs</span>,
      bottom: <>Painting since {site.founded}</>,
    },
    {
      top: <span className={`text-[15px] font-semibold tracking-wide ${strong}`}>{site.license.contractor}</span>,
      bottom: <>WA license · Bonded &amp; insured</>,
    },
    {
      top: <span className={`text-[15px] font-semibold ${strong}`}>Top 3 in Bellevue</span>,
      bottom: (
        <>
          ThreeBestRated ({site.award.year})
        </>
      ),
    },
  ];
  return (
    <div>
      <ul className={`grid grid-cols-2 gap-y-5 border-t pt-6 sm:grid-cols-4 ${rule}`}>
        {items.map((it, i) => (
          <li key={i} className={`pr-4 ${i % 2 === 1 ? "pl-4 border-l sm:pl-5" : ""} ${i >= 2 ? "sm:border-l sm:pl-5" : ""} ${rule}`}>
            <div className="leading-tight">{it.top}</div>
            <div className={`mt-1 text-[13px] leading-snug ${muted}`}>{it.bottom}</div>
          </li>
        ))}
      </ul>
      <p className={`mt-3 text-[12px] ${muted}`}>
        <Ph>{site.reviews.displayFlag.slice(1, -1)}</Ph>
      </p>
    </div>
  );
}
