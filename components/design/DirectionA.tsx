import Image from "next/image";
import Link from "next/link";
import { site } from "@/site.config";
import { HERO } from "@/content/hero";
import { photo } from "@/content/photos";
import { reviewsFor } from "@/lib/reviews";
import { SERVICES } from "@/lib/nav";
import { Button } from "@/components/Button";
import { ProofRow } from "@/components/ProofRow";
import { ReviewCard } from "@/components/ReviewCard";
import { Ph } from "@/components/Ph";
import { Stars } from "@/components/Stars";
import type { Bellevue } from "./bellevue-data";

/* ------------------------------------------------------------------ */
/* Direction A — "Eastside Craft": editorial, warm paper, serif display */
/* ------------------------------------------------------------------ */

export function HeroA() {
  const main = photo("modern-home-exterior-white-stucco-and-cedar");
  const craft = photo("crew-cutting-in-exterior-column-edge");
  return (
    <section className="relative overflow-hidden bg-bg">
      <div className="container-x grid items-center gap-12 pb-16 pt-10 lg:grid-cols-12 lg:gap-10 lg:pb-20 lg:pt-12">
        <div className="lg:col-span-7">
          <p className="eyebrow text-accent">{HERO.eyebrow}</p>
          <h1 className="display mt-5 text-[clamp(2.5rem,5.2vw,4.6rem)] text-ink">
            The Eastside’s top-rated painting company, with a{" "}
            <em className="italic text-accent [font-variation-settings:'SOFT'_100]">4-year warranty</em>.
          </h1>
          <p className="mt-6 max-w-[38rem] text-[18px] leading-relaxed text-muted md:text-[19px]">{HERO.lead}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/estimate">Get a Free Estimate</Button>
            <Button href={`tel:${site.phone.e164}`} variant="outline">
              Call {site.phone.display}
            </Button>
          </div>
          <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[14px] text-muted">
            {HERO.micro.map((m) => (
              <span key={m} className="inline-flex items-center gap-2">
                <span aria-hidden className="h-1 w-1 rounded-full bg-accent" />
                {m}
              </span>
            ))}
            <span className="inline-flex items-center gap-2">
              <span aria-hidden className="h-1 w-1 rounded-full bg-accent" />
              {site.estimateTiming.visit} <Ph>CONFIRM WITH ERIK</Ph>
            </span>
          </p>
          <div className="mt-10">
            <ProofRow />
          </div>
          <p className="mt-2 text-[12px] text-muted">
            <Ph>{site.warranty.flagShort}</Ph>
          </p>
        </div>

        <div className="relative lg:col-span-5">
          <figure className="relative" data-reveal-img>
            <Image
              src={main.src}
              alt={main.alt}
              width={main.width}
              height={main.height}
              priority
              fetchPriority="high"
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="aspect-[4/5] w-full rounded-ui object-cover"
            />
            <figcaption className="mt-3 flex items-center justify-between text-[13px] text-muted">
              <span>
                Exterior repaint · <Ph>CONFIRM: town</Ph>
              </span>
              <span className="tabular-nums">01</span>
            </figcaption>
          </figure>
          <figure className="absolute -left-6 top-10 hidden w-[40%] border-[6px] border-bg shadow-2xl sm:block lg:-left-14">
            <Image
              src={craft.src}
              alt={craft.alt}
              width={craft.width}
              height={craft.height}
              sizes="20vw"
              className="aspect-square w-full object-cover"
            />
          </figure>
        </div>
      </div>
    </section>
  );
}

function Breadcrumbs({ items }: { items: { href?: string; label: string }[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-[13px] text-muted">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((it, i) => (
          <li key={it.label} className="flex items-center gap-2">
            {i > 0 && <span aria-hidden>/</span>}
            {it.href ? (
              <Link href={it.href} className="underline-offset-4 hover:text-accent hover:underline">
                {it.label}
              </Link>
            ) : (
              <span aria-current="page" className="text-ink">
                {it.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}

export function BellevueA({ d }: { d: Bellevue }) {
  const photos = [
    photo("commercial-building-exterior-repaint-entrance"),
    photo("navy-home-exterior-red-front-door"),
    photo("kitchen-cabinets-after-painting-white"),
  ];
  const before = photo("kitchen-cabinets-before-painting");
  const birdeye = reviewsFor(undefined, 2);
  return (
    <>
      {/* 1 · Intro */}
      <section className="section border-t border-line bg-bg">
        <div className="container-x">
          <Breadcrumbs
            items={[{ href: "/", label: "Home" }, { href: "/painting-company", label: "Areas We Serve" }, { label: "Bellevue" }]}
          />
          <div className="mt-10 grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="eyebrow text-accent">Bellevue, WA</p>
              {/* On /painting-company/bellevue this is the page H1 (live wording). */}
              <h2 className="display mt-4 text-[clamp(2.1rem,4.2vw,3.6rem)]" data-reveal>
                {d.h1}
              </h2>
              <div className="mt-8 border-l-2 border-accent pl-5" data-reveal>
                <p className="text-[15px] font-semibold">Come see colors in person</p>
                <p className="mt-1 text-[15px] text-muted">
                  {site.address.street}, {site.address.city}. {site.address.note}.
                </p>
                <a href={site.maps} className="mt-2 inline-block text-[15px] font-semibold text-accent underline underline-offset-4">
                  Get directions
                </a>
              </div>
            </div>
            <div className="lg:col-span-6 lg:col-start-7" data-reveal>
              <h3 className="text-[22px] font-semibold leading-snug">{d.introHeading}</h3>
              {d.intro.map((p) => (
                <p key={p.text} className="mt-5 text-ink/85" dangerouslySetInnerHTML={{ __html: p.html }} />
              ))}
              <p className="eyebrow mt-10 text-muted">Our services include</p>
              <ul className="mt-4 grid gap-x-6 sm:grid-cols-2">
                {d.services.map((s) => (
                  <li key={s} className="flex items-center gap-3 border-b border-line py-3 text-[16px]">
                    <span aria-hidden className="h-1.5 w-1.5 rotate-45 bg-accent" />
                    {s}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 2 · Costs + FAQ (dark evergreen) */}
      <section className="section on-dark">
        <div className="container-x grid gap-14 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow text-dark-accent">Bellevue painting costs</p>
            <h2 className="display mt-4 text-[clamp(2rem,3.8vw,3.2rem)]">What a Bellevue paint job typically costs</h2>
            <dl className="mt-10 grid gap-8">
              {d.costFigures.map((c) => (
                <div key={c.label} className="border-t border-dark-line pt-5" data-reveal>
                  <dt className="text-[14px] text-dark-muted">{c.label}</dt>
                  <dd className="display mt-2 text-[clamp(2.2rem,4vw,3.4rem)] text-dark-ink">{c.range}</dd>
                </div>
              ))}
            </dl>
            <p className="mt-6 text-[14px] text-dark-muted">Figures from our Bellevue FAQ. Every estimate is itemized.</p>
          </div>
          <div className="lg:col-span-6 lg:col-start-7">
            <h3 className="eyebrow text-dark-muted">Bellevue questions</h3>
            <div className="mt-4 divide-y divide-dark-line border-y border-dark-line">
              {d.faqs.map((f, i) => (
                <details key={f.q} className="group" open={i === 0}>
                  <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 text-[19px] font-medium [&::-webkit-details-marker]:hidden">
                    {f.q}
                    <span aria-hidden className="text-2xl leading-none text-dark-accent transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <div className="pb-6 text-[16px] leading-relaxed text-dark-ink/85">
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

      {/* 3 · Work: before/after + project strip */}
      <section className="section bg-surface">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="eyebrow text-accent">Recent work</p>
              <h2 className="display mt-4 text-[clamp(2rem,3.8vw,3.2rem)]">Real projects. Our own photos.</h2>
            </div>
            <Link href="/portfolio" className="text-[16px] font-semibold text-accent underline underline-offset-4">
              See the portfolio
            </Link>
          </div>
          <div className="mt-12 grid gap-6 md:grid-cols-12">
            <figure className="md:col-span-7" data-reveal-img>
              <div className="grid grid-cols-2 gap-2">
                <Image src={before.src} alt={before.alt} width={before.width} height={before.height} sizes="(min-width:768px) 30vw, 50vw" className="aspect-[4/5] w-full rounded-ui object-cover" />
                <Image src={photos[2].src} alt={photos[2].alt} width={photos[2].width} height={photos[2].height} sizes="(min-width:768px) 30vw, 50vw" className="aspect-[4/5] w-full rounded-ui object-cover" />
              </div>
              <figcaption className="mt-3 flex justify-between text-[13px] text-muted">
                <span>
                  Cabinet painting, before / after · <Ph>CONFIRM: town</Ph>
                </span>
              </figcaption>
            </figure>
            <div className="grid gap-6 md:col-span-5">
              {photos.slice(0, 2).map((p) => (
                <figure key={p.id} data-reveal-img>
                  <Image src={p.src} alt={p.alt} width={p.width} height={p.height} sizes="(min-width:768px) 35vw, 100vw" className="aspect-[16/10] w-full rounded-ui object-cover" />
                  <figcaption className="mt-3 text-[13px] text-muted">
                    {p.job} · <Ph>CONFIRM: town</Ph>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 4 · Process */}
      <section className="section bg-bg">
        <div className="container-x">
          <div className="max-w-2xl">
            <p className="eyebrow text-accent">How it works</p>
            <h2 className="display mt-4 text-[clamp(2rem,3.8vw,3.2rem)]">EA Pro Painters Bellevue: Professional Painting Process</h2>
            <p className="mt-5 text-muted">{d.process.intro?.text}</p>
          </div>
          <ol className="mt-14 grid gap-px overflow-hidden rounded-ui border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
            {d.process.steps.map((s, i) => (
              <li key={s.title} className="bg-bg p-7 lg:p-8" data-reveal>
                <span className="display block text-[56px] leading-none text-accent">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-6 text-[19px] font-semibold">{s.title}</h3>
                <p className="mt-3 text-[16px] text-muted">{s.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* 5 · Reviews + CTA */}
      <section id="reviews" className="section bg-surface">
        <div className="container-x">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="eyebrow text-accent">Bellevue reviews</p>
              <h2 className="display mt-4 text-[clamp(2rem,3.8vw,3.2rem)]">Hire a company you can trust</h2>
            </div>
            <p className="flex items-center gap-3 text-[15px]">
              <Stars className="text-accent" />
              <span>
                <strong>{site.reviews.birdeye.rating}</strong> from {site.reviews.birdeye.count} reviews on Birdeye
              </span>
            </p>
          </div>
          <div className="mt-12 grid gap-10 md:grid-cols-3">
            {d.testimonials.map((t) => (
              <figure key={t.name} className="border-t border-ink pt-6" data-reveal>
                <Stars className="text-accent" label="5 out of 5 stars" />
                <blockquote className="display mt-4 text-[22px] leading-snug [text-transform:none]">“{t.text}”</blockquote>
                <figcaption className="mt-5 text-[14px] font-semibold">{t.name}</figcaption>
              </figure>
            ))}
          </div>
          <div className="mt-16 grid items-center gap-10 rounded-ui bg-bg p-8 md:grid-cols-12 md:p-12">
            <div className="md:col-span-7">
              <h2 className="display text-[clamp(1.9rem,3.4vw,2.8rem)]">Considering a home or business painting project?</h2>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <Button href="/estimate">Get a Free Estimate</Button>
                <Button href={`tel:${site.phone.e164}`} variant="outline">
                  Call {site.phone.display}
                </Button>
              </div>
              <p className="mt-3 text-[14px] text-muted">Free · Takes under 2 minutes</p>
            </div>
            <div className="md:col-span-5">
              <ReviewCard r={birdeye[0]} />
              <a href={site.reviews.birdeye.url} className="mt-5 inline-block text-[15px] font-semibold text-accent underline underline-offset-4">
                Read all reviews
              </a>
            </div>
          </div>
          <p className="eyebrow mt-14 text-muted">Painting services in Bellevue</p>
          <ul className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-[15px]">
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link href={`/${s.slug}`} className="underline decoration-line underline-offset-4 hover:text-accent hover:decoration-accent">
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
