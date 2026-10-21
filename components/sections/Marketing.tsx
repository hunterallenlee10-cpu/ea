import Image from "next/image";
import Link from "next/link";
import { site, displayedReviews } from "@/site.config";
import { PROCESS, WARRANTY, LOWEST_BID, AWARDS, AWARD_QUOTE, WHY } from "@/content/shared";
import { PHOTOS, type Photo } from "@/content/photos";
import { REVIEWS, type Review } from "@/lib/reviews";
import { SERVICES, CITIES } from "@/lib/nav";
import { Button } from "@/components/Button";
import { ReviewCard } from "@/components/ReviewCard";
import { Stars } from "@/components/Stars";
import { Ph, Town } from "@/components/Ph";

/* Shared marketing sections, Direction A. Light (bg), warm (surface) and evergreen (on-dark) alternate. */

export function SectionHead({
  eyebrow,
  title,
  sub,
  dark = false,
  as: As = "h2",
  className = "",
}: {
  eyebrow?: string;
  title: React.ReactNode;
  sub?: React.ReactNode;
  dark?: boolean;
  as?: "h2" | "h3";
  className?: string;
}) {
  return (
    <div className={`max-w-3xl ${className}`}>
      {eyebrow && <p className={`eyebrow ${dark ? "text-dark-accent" : "text-accent"}`}>{eyebrow}</p>}
      <As className="display mt-4 text-[clamp(2rem,3.8vw,3.2rem)]">{title}</As>
      {sub && <div className={`mt-5 ${dark ? "text-dark-muted" : "text-muted"}`}>{sub}</div>}
    </div>
  );
}

export function ProcessSection({
  title = "How do we make it work?",
  intro = PROCESS.intro,
  steps = PROCESS.steps.map((s) => ({ title: s.title, body: s.body as React.ReactNode })),
  bg = "bg-bg",
}: {
  title?: string;
  intro?: string;
  steps?: { title: string; body: React.ReactNode }[];
  bg?: string;
}) {
  return (
    <section className={`section ${bg}`}>
      <div className="container-x">
        <SectionHead eyebrow="Our process" title={title} sub={intro} />
        <ol className="mt-14 grid gap-px overflow-hidden rounded-ui border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => (
            <li key={s.title} className="bg-bg p-7 lg:p-8" data-reveal>
              <span className="display block text-[56px] leading-none text-accent" aria-hidden>
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="mt-6 text-[19px] font-semibold">
                <span className="sr-only">Step {i + 1}: </span>
                {s.title}
              </h3>
              <div className="mt-3 text-[16px] text-muted">{s.body}</div>
            </li>
          ))}
        </ol>
        <div className="mt-10">
          <Button href="/estimate">Get a Free Estimate</Button>
        </div>
      </div>
    </section>
  );
}

export function WarrantySection() {
  const p = PHOTOS.find((x) => x.id === "crew-painting-exterior-column-base")!;
  return (
    <section className="section on-dark" id="warranty">
      <div className="container-x grid items-center gap-12 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p className="eyebrow text-dark-accent">Warranty</p>
          <h2 className="display mt-4 text-[clamp(2.2rem,4.2vw,3.6rem)]">
            Our <em className="italic text-dark-accent">4-year</em> warranty
          </h2>
          <p className="mt-4 text-[19px] text-dark-ink/85">{WARRANTY.tagline}</p>
          <ul className="mt-10 divide-y divide-dark-line border-y border-dark-line">
            {WARRANTY.items.map((w) => (
              <li key={w.title} className="flex gap-5 py-5" data-reveal>
                <svg aria-hidden width="22" height="22" viewBox="0 0 24 24" className="mt-1 shrink-0 text-dark-accent" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z M8.5 12l2.5 2.5 4.5-5" />
                </svg>
                <div>
                  <p className="text-[18px] font-semibold">{w.title}</p>
                  <p className="mt-1 text-[16px] text-dark-muted">{w.body}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-5 text-[13px] text-dark-muted">
            <Ph>{site.warranty.flagShort}</Ph> <Ph>CONFIRM WITH ERIK: what the warranty covers (from the live warranty graphic)</Ph>
          </p>
        </div>
        <figure className="lg:col-span-5 lg:col-start-8" data-reveal-img>
          <Image src={p.src} alt={p.alt} width={p.width} height={p.height} sizes="(min-width:1024px) 40vw, 100vw" className="aspect-[4/5] w-full rounded-ui object-cover" />
          <figcaption className="mt-3 text-[13px] text-dark-muted">Our crew at work</figcaption>
        </figure>
      </div>
    </section>
  );
}

export function LowestBidSection({ bg = "bg-bg" }: { bg?: string }) {
  return (
    <section className={`section ${bg}`}>
      <div className="container-x">
        <SectionHead
          eyebrow="Comparing quotes?"
          title={
            <>
              Why the lowest bid <em className="italic text-accent">costs more</em>
            </>
          }
          sub="When you compare quotes, compare what is included. Here is how we work, in our own words."
        />
        <div className="mt-14 grid gap-x-10 gap-y-12 md:grid-cols-2">
          {LOWEST_BID.map((b, i) => (
            <div key={b.title} className="grid grid-cols-[auto_1fr] gap-5" data-reveal>
              <span className="display text-[40px] leading-none text-accent" aria-hidden>
                {i + 1}
              </span>
              <div>
                <h3 className="text-[20px] font-semibold">{b.title}</h3>
                <blockquote className="mt-3 border-l-2 border-line pl-4 text-[16px] text-muted">“{b.quote}”</blockquote>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Reviews (exact text) with the CTA beside them (KICKSTART 5.2.6). */
export function ReviewsSection({
  title = "See why over 500 customers have left 5-star reviews across Western Washington.",
  reviews = REVIEWS.slice(0, 3),
  bg = "bg-surface",
  id = "reviews",
}: {
  title?: string;
  reviews?: Review[];
  bg?: string;
  id?: string;
}) {
  const r = displayedReviews();
  return (
    <section id={id} className={`section ${bg}`}>
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <SectionHead eyebrow="Reviews" title={title} />
          <div className="shrink-0 text-[15px]">
            <p className="flex items-center gap-3">
              <Stars className="text-accent" />
              <span>
                <strong>{r.rating}</strong> from {r.count} reviews on {r.source}
              </span>
            </p>
            <p className="mt-1 text-[12px] text-muted">
              As of {new Date(r.asOf + "T12:00:00Z").toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric", timeZone: "UTC" })}{" "}
              <Ph>{site.reviews.displayFlagShort}</Ph>
            </p>
          </div>
        </div>
        <div className="mt-12 grid gap-10 md:grid-cols-3">
          {reviews.map((rv) => (
            <ReviewCard key={rv.id} r={rv} className="border-t border-ink pt-6" />
          ))}
        </div>
        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <a href={site.reviews.birdeye.url} className="inline-flex min-h-11 items-center text-[16px] font-semibold text-accent underline underline-offset-4" rel="noopener">
            Read all reviews
          </a>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href="/estimate">Get a Free Estimate</Button>
          </div>
        </div>
      </div>
    </section>
  );
}

/** Closing CTA with a real review beside it. */
export function CtaBand({
  title = "Considering a home or business painting project?",
  sub,
  review = REVIEWS.find((r) => r.name === "John Iwasaki") ?? REVIEWS[8],
  bg = "bg-surface",
}: {
  title?: string;
  sub?: React.ReactNode;
  review?: Review;
  bg?: string;
}) {
  return (
    <section className={`section ${bg}`}>
      <div className="container-x">
        <div className="grid items-center gap-10 rounded-ui bg-bg p-8 md:grid-cols-12 md:p-12 lg:p-16">
          <div className="md:col-span-7">
            <h2 className="display text-[clamp(1.9rem,3.4vw,2.9rem)]">{title}</h2>
            {sub && <div className="mt-4 text-muted">{sub}</div>}
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <Button href="/estimate">Get a Free Estimate</Button>
              <Button href={`tel:${site.phone.e164}`} variant="outline">
                Call {site.phone.display}
              </Button>
            </div>
            <p className="mt-3 text-[14px] text-muted">Free · Takes under 2 minutes · {site.license.display}</p>
          </div>
          <div className="md:col-span-5">
            <ReviewCard r={review} />
            <a href={site.reviews.birdeye.url} className="mt-5 inline-flex min-h-11 items-center text-[15px] font-semibold text-accent underline underline-offset-4" rel="noopener">
              Read all reviews
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

const servicePhoto: Record<string, string> = {
  "interior-painting": "staircase-black-metal-railing-white-walls",
  "exterior-painting": "navy-home-exterior-red-front-door",
  "commercial-painting": "commercial-building-exterior-repaint-front",
  "cabinet-painting": "kitchen-cabinets-after-painting-white",
  "custom-painting": "stained-wood-porch-ceiling",
  "millwork-painting": "foyer-staircase-white-risers-and-trim",
  "drywall-painting": "hallway-closet-doors-with-floor-protection",
  "decks-and-fences-painting": "stained-cedar-deck-covered-patio",
  hoa: "ea-pro-van-at-two-story-homes",
};
export const photoForService = (slug: string) => PHOTOS.find((p) => p.id === servicePhoto[slug])!;

export function ServicesGrid({ exclude, blurbs }: { exclude?: string; blurbs?: Record<string, string> }) {
  const list = SERVICES.filter((s) => s.slug !== exclude);
  return (
    <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {list.map((s) => {
        const p = photoForService(s.slug);
        return (
          <li key={s.slug} data-reveal>
            <Link href={`/${s.slug}`} className="group block">
              <div className="overflow-hidden rounded-ui">
                <Image src={p.src} alt={p.alt} width={p.width} height={p.height} sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 100vw" className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
              </div>
              <h3 className="mt-4 flex items-center justify-between text-[20px] font-semibold group-hover:text-accent">
                {s.name}
                <span aria-hidden className="text-accent transition-transform group-hover:translate-x-1">→</span>
              </h3>
              {blurbs?.[s.slug] && <p className="mt-2 text-[15px] text-muted">{blurbs[s.slug]}</p>}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export function AreasList({ exclude, dark = false }: { exclude?: string; dark?: boolean }) {
  return (
    <ul className="grid grid-cols-2 gap-x-6 sm:grid-cols-3 lg:grid-cols-4">
      {CITIES.filter((c) => c.slug !== exclude).map((c) => (
        <li key={c.slug}>
          <Link
            href={c.href}
            className={`flex min-h-11 items-center justify-between border-b py-2 text-[16px] ${dark ? "border-dark-line hover:text-dark-accent" : "border-line hover:text-accent"}`}
          >
            {c.name}
            <span aria-hidden className="opacity-50">→</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}

export function AreasSection({ exclude, title = "Painting across the Eastside", bg = "bg-bg" }: { exclude?: string; title?: string; bg?: string }) {
  return (
    <section className={`section ${bg}`}>
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHead eyebrow="Areas we serve" title={title} />
          <Link href="/painting-company" className="text-[16px] font-semibold text-accent underline underline-offset-4">
            All service areas
          </Link>
        </div>
        <div className="mt-10">
          <AreasList exclude={exclude} />
        </div>
      </div>
    </section>
  );
}

/** Real project photos. Town captions stay as placeholders until Erik confirms them. */
export function PhotoGrid({ photos, bg = "bg-surface", title = "Real projects. Our own photos.", eyebrow = "Recent work" }: { photos: Photo[]; bg?: string; title?: string; eyebrow?: string }) {
  const [a, b, c, d] = photos;
  return (
    <section className={`section ${bg}`}>
      <div className="container-x">
        <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <SectionHead eyebrow={eyebrow} title={title} />
          <Link href="/portfolio" className="text-[16px] font-semibold text-accent underline underline-offset-4">
            See the portfolio
          </Link>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-12">
          {a && <PhotoFigure p={a} className="md:col-span-7" aspect="aspect-[4/3]" />}
          <div className="grid gap-6 md:col-span-5">
            {b && <PhotoFigure p={b} aspect="aspect-[16/10]" />}
            {c && <PhotoFigure p={c} aspect="aspect-[16/10]" />}
          </div>
          {d && <PhotoFigure p={d} className="md:col-span-12" aspect="aspect-[21/9]" />}
        </div>
      </div>
    </section>
  );
}

export function PhotoFigure({ p, className = "", aspect = "aspect-[4/3]", sizes = "(min-width:768px) 50vw, 100vw" }: { p: Photo; className?: string; aspect?: string; sizes?: string }) {
  return (
    <figure className={className} data-reveal-img>
      <Image src={p.src} alt={p.alt} width={p.width} height={p.height} sizes={sizes} className={`${aspect} w-full rounded-ui object-cover`} />
      <figcaption className="mt-3 text-[13px] text-muted">
        {p.job}
        <Town town={p.town} />
      </figcaption>
    </figure>
  );
}

export function AwardsStrip({ dark = false, stacked = false }: { dark?: boolean; stacked?: boolean }) {
  return (
    <ul className={`grid gap-px overflow-hidden rounded-ui ${stacked ? "" : "sm:grid-cols-3"} ${dark ? "bg-dark-line" : "bg-line"}`}>
      {AWARDS.map((a) => (
        <li key={a.name} className={`p-6 ${dark ? "bg-dark" : "bg-bg"}`}>
          <p className={`eyebrow ${dark ? "text-dark-muted" : "text-muted"}`}>
            {a.by} · {a.year}
          </p>
          <p className="display mt-2 text-[24px] leading-tight">{a.name}</p>
        </li>
      ))}
    </ul>
  );
}

export function AwardSection() {
  return (
    <section className="section bg-bg">
      <div className="container-x grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-6">
          <p className="eyebrow text-accent">New award for 2024</p>
          <h2 className="display mt-4 text-[clamp(2rem,3.8vw,3.2rem)]">Named Top 3 Painter in Bellevue, WA</h2>
          <p className="mt-5 text-muted">
            ThreeBestRated just named EA Pro Painters as one of the Top 3 Painters in Bellevue, WA in their recent update.
          </p>
          <blockquote className="display mt-8 border-l-2 border-accent pl-6 text-[22px] leading-snug [text-transform:none]">“{AWARD_QUOTE}”</blockquote>
        </div>
        <div className="lg:col-span-5 lg:col-start-8">
          <p className="eyebrow text-muted">Recognition</p>
          <div className="mt-4">
            <AwardsStrip stacked />
          </div>
          <p className="mt-4 text-[13px] text-muted">
            <Ph>CONFIRM WITH ERIK: OK to show the Angi and HomeAdvisor awards as text (#24)</Ph>
          </p>
        </div>
      </div>
    </section>
  );
}

export function WhyGrid() {
  return (
    <ul className="grid grid-cols-2 gap-px overflow-hidden rounded-ui bg-dark-line md:grid-cols-3">
      {WHY.map((w) => (
        <li key={w} className="bg-dark p-6 text-[18px] font-medium md:p-8">
          <span aria-hidden className="mb-4 block h-px w-8 bg-dark-accent" />
          {w}
        </li>
      ))}
    </ul>
  );
}

/** A path for each type of customer (KICKSTART 5.2.12). */
export function CustomerPaths() {
  const paths = [
    { href: "/services", eyebrow: "Homeowners", title: "Interior, exterior, cabinets and decks", photo: "navy-home-exterior-garage-and-entry" },
    { href: "/hoa", eyebrow: "HOAs & property managers", title: "Community repaints, planned and phased", photo: "ea-pro-van-at-two-story-homes" },
    { href: "/commercial-painting", eyebrow: "Commercial", title: "Offices, retail and buildings, with minimal disruption", photo: "crew-painting-storefront-windows-from-boom-lift" },
  ];
  return (
    <ul className="grid gap-6 md:grid-cols-3">
      {paths.map((p) => {
        const ph = PHOTOS.find((x) => x.id === p.photo)!;
        return (
          <li key={p.href}>
            <Link href={p.href} className="group relative block overflow-hidden rounded-ui">
              <Image src={ph.src} alt={ph.alt} width={ph.width} height={ph.height} sizes="(min-width:768px) 33vw, 100vw" className="aspect-[3/4] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-[#0f1d16]/90 via-[#0f1d16]/30 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-[#f3efe7]">
                <p className="eyebrow">{p.eyebrow}</p>
                <p className="display mt-2 text-[26px] leading-tight">{p.title}</p>
                <span className="mt-4 inline-block text-[15px] font-semibold underline underline-offset-4">Learn more</span>
              </div>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
