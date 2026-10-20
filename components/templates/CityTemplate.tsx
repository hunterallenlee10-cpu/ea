import type { PageContent } from "@/lib/content-types";
import { splitIntro } from "@/lib/content";
import { service, faqPage } from "@/lib/schema";
import { CITIES } from "@/lib/nav";
import { USABLE_PHOTOS as PHOTOS } from "@/content/photos";
import { site } from "@/site.config";
import { JsonLd } from "@/components/JsonLd";
import { Nodes } from "@/components/content/Rich";
import { LongForm } from "@/components/content/LongForm";
import { Ph } from "@/components/Ph";
import { FactsLine, PageHero } from "@/components/sections/PageHero";
import { AreasSection, CtaBand, PhotoGrid, ProcessSection, ReviewsSection, SectionHead, ServicesGrid } from "@/components/sections/Marketing";

/** Cost ranges quoted in the page's own FAQ answers ("…exteriors typically run $5,000 to $12,000…"). */
function costFigures(c: PageContent, city: string) {
  const out: { label: string; range: string }[] = [];
  for (const n of c.nodes) {
    if (n.t !== "faqs") continue;
    for (const f of n.items) {
      if (!/cost|price|how much/i.test(f.q)) continue;
      const text = f.a.map((a) => a.text).join(" ");
      for (const m of text.matchAll(/\b(exterior|interior)s?\b[^$.]{0,60}?\$([\d,]+)\s*(?:to|–|-)\s*\$([\d,]+)/gi)) {
        const kind = m[1].toLowerCase();
        if (!out.some((o) => o.label.includes(kind))) out.push({ label: `Typical ${city} ${kind}`, range: `$${m[2]} to $${m[3]}` });
      }
    }
  }
  return out;
}

/** City page: the live page's unique text and FAQs first, then real proof (reviews, photos) and links. */
export function CityTemplate({ c }: { c: PageContent }) {
  const city = CITIES.find((x) => x.href === c.path)!;
  const idx = CITIES.indexOf(city);
  // Rotate EA Pro's own photos across city pages. Captions never claim a town until Erik confirms it.
  const exteriors = PHOTOS.filter((p) => /Exterior|Commercial|Deck/.test(p.job));
  const pool = [...exteriors.slice(idx % exteriors.length), ...exteriors.slice(0, idx % exteriors.length)];
  const hero = pool[0];
  const { intro, rest } = splitIntro(c.nodes);
  const hasSteps = c.nodes.some((n) => n.t === "steps" || (n.t === "h2" && /process|experience|how to find/i.test(n.text)));
  const costs = costFigures(c, city.name);
  const faqs = c.nodes.flatMap((n) => (n.t === "faqs" ? n.items : []));
  return (
    <>
      <JsonLd
        data={[
          service({ name: `Painting services in ${city.name}, WA`, path: c.path, description: c.description, area: city.name }),
          ...(faqs.length ? [faqPage(faqs.map((f) => ({ q: f.q, a: f.a.map((a) => a.text).join(" ") })))] : []),
        ]}
      />
      <PageHero
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Areas We Serve", path: "/painting-company" },
          { name: city.name, path: c.path },
        ]}
        eyebrow={`${city.name}, WA`}
        h1={c.h1}
        lead={<FactsLine what="interior, exterior and commercial painting" where={`${city.name} and the Eastside`} />}
        photo={hero}
        caption={
          <>
            {hero.job} · <Ph>CONFIRM: town</Ph>
          </>
        }
      />

      {(intro.length > 0 || costs.length > 0) && (
        <section className="border-t border-line bg-bg py-14 lg:py-20">
          <div className="container-x grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-6">
              <Nodes nodes={intro} ctx={{ path: c.path, base: 1 }} />
              <div className="mt-8 border-l-2 border-accent pl-5">
                <p className="text-[15px] font-semibold">See colors in person</p>
                <p className="mt-1 text-[15px] text-muted">
                  Our Bellevue location: {site.address.street}, {site.address.city}. {site.address.note}.
                </p>
                <a href={site.maps} className="mt-2 inline-flex min-h-11 items-center text-[15px] font-semibold text-accent underline underline-offset-4">
                  Get directions
                </a>
              </div>
            </div>
            {costs.length > 0 && (
              <div className="grid content-start gap-6 lg:col-span-5 lg:col-start-8">
                <p className="eyebrow text-accent">{city.name} painting costs</p>
                <dl className="grid gap-6">
                  {costs.map((k) => (
                    <div key={k.label} className="border-t border-line pt-5">
                      <dt className="text-[14px] text-muted">{k.label}</dt>
                      <dd className="display mt-2 text-[clamp(2.2rem,4vw,3.2rem)]">{k.range}</dd>
                    </div>
                  ))}
                </dl>
                <p className="text-[14px] text-muted">From our {city.name} FAQ below. Every estimate is itemized.</p>
              </div>
            )}
          </div>
        </section>
      )}

      <LongForm nodes={rest} path={c.path} photos={pool.slice(1)} />
      {!hasSteps && <ProcessSection bg="bg-surface" />}
      <PhotoGrid photos={pool.slice(1, 5)} />
      <ReviewsSection bg="bg-bg" title={`What customers say about EA Pro Painters`} />
      <section className="section bg-surface">
        <div className="container-x">
          <SectionHead eyebrow={`Services in ${city.name}`} title={`Painting services in ${city.name}`} />
          <div className="mt-12">
            <ServicesGrid />
          </div>
        </div>
      </section>
      <AreasSection exclude={city.slug} title="Other areas we serve" />
      <CtaBand title={`Considering a painting project in ${city.name}?`} />
    </>
  );
}
