import Image from "next/image";
import Link from "next/link";
import { site, displayedReviews, yearsInBusiness } from "@/site.config";
import { HERO } from "@/content/hero";
import { photo } from "@/content/photos";
import { reviewsFor } from "@/lib/reviews";
import { SERVICES } from "@/lib/nav";
import { Button } from "@/components/Button";
import { ReviewCard } from "@/components/ReviewCard";
import { HeroVideo } from "@/components/HeroVideo";
import { Ph } from "@/components/Ph";
import { Stars } from "@/components/Stars";
import type { Bellevue } from "./bellevue-data";

/* ---------------------------------------------------------------------- */
/* Direction B — "Bold Pro": cinematic, dark ink, heavy condensed display */
/* ---------------------------------------------------------------------- */

export function HeroB() {
  const r = displayedReviews();
  const proof = [
    { big: `${r.rating}★`, small: `${r.count} reviews · ${r.source}` },
    { big: `${yearsInBusiness()}+`, small: `Years · since ${site.founded}` },
    { big: "Top 3", small: `Bellevue · ThreeBestRated ${site.award.year}` },
    { big: site.license.contractor, small: "WA license · bonded & insured", mono: true },
  ];
  return (
    <section className="on-dark relative isolate flex min-h-[calc(100svh-6rem)] flex-col justify-end overflow-hidden">
      <Image
        src="/images/ea-pro-drone-exterior-home-poster.jpg"
        alt=""
        fill
        priority
        fetchPriority="high"
        sizes="100vw"
        className="-z-20 object-cover"
      />
      <HeroVideo src="/video/ea-pro-exterior-reel-loop.mp4" className="absolute inset-0 -z-20 h-full w-full object-cover" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgba(14,13,12,0.55)_0%,rgba(14,13,12,0.35)_35%,rgba(14,13,12,0.92)_78%,#0e0d0c_100%)]" />
      <div aria-hidden className="absolute inset-0 -z-10 bg-[linear-gradient(90deg,rgba(14,13,12,0.7)_0%,rgba(14,13,12,0)_70%)]" />

      <div className="container-x pb-10 pt-24 lg:pb-14">
        <p className="eyebrow text-dark-ink/80">{HERO.eyebrow}</p>
        <h1 className="display mt-5 max-w-[15ch] text-[clamp(3.2rem,8.4vw,8rem)] text-dark-ink">
          Top-rated Eastside painters. <span className="text-dark-accent">4-year warranty.</span>
        </h1>
        <div className="mt-8 grid gap-8 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-6">
            <p className="max-w-[36rem] text-[18px] leading-relaxed text-dark-ink/85">{HERO.lead}</p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/estimate">Get a Free Estimate</Button>
              <Button href={`tel:${site.phone.e164}`} variant="outline" tone="dark">
                Call {site.phone.display}
              </Button>
            </div>
            <p className="mt-4 text-[14px] text-dark-muted">
              {HERO.micro.join(" · ")} · {site.estimateTiming.visit} <Ph>CONFIRM WITH ERIK</Ph>
            </p>
          </div>
          <ul className="grid grid-cols-2 border-t border-dark-ink/20 lg:col-span-6 lg:grid-cols-4 lg:border-t-0">
            {proof.map((p, i) => (
              <li
                key={p.small}
                className={`py-5 pr-4 lg:border-l lg:border-dark-ink/20 lg:py-0 lg:pl-5 ${i % 2 === 1 ? "border-l border-dark-ink/20 pl-4" : ""}`}
              >
                <span className={`block leading-none text-dark-ink ${p.mono ? "text-[17px] font-semibold tracking-wide" : "display text-[40px]"}`}>
                  {p.big}
                </span>
                <span className="mt-2 block text-[12.5px] leading-snug text-dark-muted">{p.small}</span>
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-6 text-[12px] text-dark-muted">
          <Ph>{site.reviews.displayFlagShort}</Ph> <Ph>{site.warranty.flagShort}</Ph>
        </p>
      </div>
    </section>
  );
}

export function BellevueB({ d }: { d: Bellevue }) {
  const wide = photo("crew-painting-storefront-windows-from-boom-lift");
  const tiles = [photo("navy-home-exterior-red-front-door"), photo("stained-cedar-deck-covered-patio"), photo("kitchen-cabinets-after-painting-white"), photo("commercial-building-exterior-repaint-front")];
  const birdeye = reviewsFor(undefined, 3);
  return (
    <>
      {/* 1 · Intro on light */}
      <section className="section bg-bg">
        <div className="container-x">
          <nav aria-label="Breadcrumb" className="eyebrow text-muted">
            <Link href="/" className="hover:text-accent">Home</Link> <span aria-hidden>/</span>{" "}
            <Link href="/painting-company" className="hover:text-accent">Areas We Serve</Link> <span aria-hidden>/</span>{" "}
            <span aria-current="page" className="text-ink">Bellevue</span>
          </nav>
          {/* On /painting-company/bellevue this is the page H1 (live wording). */}
          <h2 className="display mt-6 max-w-[18ch] text-[clamp(2.6rem,6vw,5.4rem)]" data-reveal>
            {d.h1}
          </h2>
          <div className="mt-12 grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7" data-reveal>
              <h3 className="text-[22px] font-semibold leading-snug">{d.introHeading}</h3>
              {d.intro.map((p) => (
                <p key={p.text} className="mt-5 text-ink/85" dangerouslySetInnerHTML={{ __html: p.html }} />
              ))}
            </div>
            <aside className="bg-dark p-8 text-dark-ink lg:col-span-4 lg:col-start-9" data-reveal>
              <p className="eyebrow text-dark-muted">Our Bellevue location</p>
              <p className="display mt-4 text-[34px]">Next door to Sherwin-Williams</p>
              <p className="mt-3 text-[15px] text-dark-muted">
                {site.address.street}, {site.address.city}, {site.address.region} {site.address.zip}. Talk through your project, then pick colors next door.
              </p>
              <a href={site.maps} className="mt-5 inline-flex min-h-11 items-center text-[15px] font-semibold text-dark-ink underline underline-offset-4">
                Get directions
              </a>
            </aside>
          </div>
          <ul className="mt-14 flex flex-wrap gap-2">
            {d.services.map((s) => (
              <li key={s} className="border border-line px-4 py-2 text-[14px] font-medium uppercase tracking-wide">
                {s}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* 2 · Full-bleed craft image */}
      <section className="relative h-[60vh] min-h-[380px] overflow-hidden on-dark" aria-label="EA Pro crew at work">
        <Image src={wide.src} alt={wide.alt} fill sizes="100vw" className="object-cover" data-reveal-img />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-dark via-dark/10 to-transparent" />
        <p className="container-x absolute inset-x-0 bottom-6 text-[13px] text-dark-ink/80">
          {wide.job} · <Ph>CONFIRM: town</Ph>
        </p>
      </section>

      {/* 3 · Costs + FAQ */}
      <section className="section on-dark">
        <div className="container-x">
          <p className="eyebrow text-dark-muted">Bellevue painting costs</p>
          <div className="mt-6 grid gap-px bg-dark-line md:grid-cols-2">
            {d.costFigures.map((c) => (
              <div key={c.label} className="bg-dark py-8 md:px-8 md:first:pl-0" data-reveal>
                <p className="display text-[clamp(2.8rem,6vw,5rem)] text-dark-ink">{c.range}</p>
                <p className="mt-3 text-[15px] text-dark-muted">{c.label}</p>
              </div>
            ))}
          </div>
          <div className="mt-16 grid gap-12 lg:grid-cols-12">
            <h2 className="display text-[clamp(2.2rem,4.2vw,3.6rem)] lg:col-span-4">Bellevue questions, straight answers</h2>
            <div className="divide-y divide-dark-line border-y border-dark-line lg:col-span-8">
              {d.faqs.map((f, i) => (
                <details key={f.q} className="group" open={i === 0}>
                  <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 text-[19px] font-semibold [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span aria-hidden className="grid h-9 w-9 shrink-0 place-items-center border border-dark-line text-xl">
                      <span className="transition-transform group-open:rotate-45">+</span>
                    </span>
                  </summary>
                  <div className="pb-6 text-[16px] leading-relaxed text-dark-ink/80">
                    {f.a.map((a) => (
                      <p key={a.text} className="mt-3 first:mt-0" dangerouslySetInnerHTML={{ __html: a.html }} />
                    ))}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4 · Process, numbered */}
      <section className="section bg-bg">
        <div className="container-x">
          <p className="eyebrow text-muted">The process</p>
          <h2 className="display mt-4 max-w-[20ch] text-[clamp(2.4rem,5vw,4.4rem)]">Four steps, start to finish.</h2>
          <p className="mt-5 max-w-2xl text-muted">{d.process.intro?.text}</p>
          <ol className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {d.process.steps.map((s, i) => (
              <li key={s.title} className="border-t-4 border-ink pt-6" data-reveal>
                <span className="display block text-[88px] leading-[0.8] text-ink/15">{i + 1}</span>
                <h3 className="display mt-4 text-[28px]">{s.title}</h3>
                <p className="mt-3 text-[16px] text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 5 · Work grid */}
      <section className="on-dark">
        <ul className="grid grid-cols-2 lg:grid-cols-4">
          {tiles.map((p) => (
            <li key={p.id} className="group relative aspect-[4/5] overflow-hidden">
              <Image src={p.src} alt={p.alt} fill sizes="(min-width:1024px) 25vw, 50vw" className="object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
              <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-dark/80 to-transparent" />
              <p className="absolute bottom-4 left-4 right-4 text-[13px] text-dark-ink">
                <span className="eyebrow block">{p.job}</span>
                <Ph>CONFIRM: town</Ph>
              </p>
            </li>
          ))}
        </ul>
      </section>

      {/* 6 · Reviews + CTA */}
      <section id="reviews" className="section on-dark">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <h2 className="display max-w-[16ch] text-[clamp(2.4rem,5vw,4.4rem)]">Bellevue reviews</h2>
            <p className="flex items-center gap-3 text-[15px] text-dark-muted">
              <Stars className="text-dark-accent" />
              {site.reviews.birdeye.rating} from {site.reviews.birdeye.count} reviews on Birdeye
            </p>
          </div>
          <div className="mt-12 grid gap-px bg-dark-line md:grid-cols-3">
            {d.testimonials.map((t) => (
              <figure key={t.name} className="bg-dark p-8 md:first:pl-0" data-reveal>
                <Stars className="text-dark-accent" label="5 out of 5 stars" />
                <blockquote className="mt-4 text-[18px] leading-relaxed">“{t.text}”</blockquote>
                <figcaption className="eyebrow mt-6 text-dark-muted">{t.name}</figcaption>
              </figure>
            ))}
          </div>

          <div className="mt-20 grid gap-10 border-t border-dark-line pt-16 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <h2 className="display text-[clamp(2.4rem,5vw,4.6rem)]">
                Ready when you are. <span className="text-dark-accent">Free estimate.</span>
              </h2>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button href="/estimate">Get a Free Estimate</Button>
                <Button href={`tel:${site.phone.e164}`} variant="outline" tone="dark">
                  Call {site.phone.display}
                </Button>
              </div>
              <p className="mt-3 text-[14px] text-dark-muted">Takes under 2 minutes</p>
            </div>
            <div className="lg:col-span-4 lg:col-start-9">
              <ReviewCard r={birdeye[1]} tone="dark" />
              <a href={site.reviews.birdeye.url} className="mt-5 inline-flex min-h-11 items-center text-[15px] font-semibold underline underline-offset-4">
                Read all reviews
              </a>
            </div>
          </div>
          <p className="eyebrow mt-16 text-dark-muted">Painting services in Bellevue</p>
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-[15px]">
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link href={`/${s.slug}`} className="underline decoration-dark-line underline-offset-4 hover:decoration-dark-accent">
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
