import type { PageContent } from "@/lib/content-types";
import { splitIntro } from "@/lib/content";
import { service, faqPage } from "@/lib/schema";
import { SERVICES } from "@/lib/nav";
import { USABLE_PHOTOS as PHOTOS } from "@/content/photos";
import { JsonLd } from "@/components/JsonLd";
import { Nodes } from "@/components/content/Rich";
import { LongForm } from "@/components/content/LongForm";
import { FactsLine, PageHero } from "@/components/sections/PageHero";
import {
  AreasSection,
  CtaBand,
  LowestBidSection,
  PhotoGrid,
  ProcessSection,
  ReviewsSection,
  SectionHead,
  ServicesGrid,
  WarrantySection,
  photoForService,
} from "@/components/sections/Marketing";

/** Service page: live long-form content restructured into scannable sections, plus process, warranty, photos, reviews and CTAs. */
export function ServiceTemplate({ c }: { c: PageContent }) {
  const slug = c.path.slice(1);
  const name = SERVICES.find((s) => s.slug === slug)!.name;
  const hero = photoForService(slug);
  const own = PHOTOS.filter((p) => p.service === slug && p.id !== hero.id);
  const others = PHOTOS.filter((p) => p.service !== slug && p.id !== hero.id);
  const pool = [...own, ...others];
  const { intro, rest } = splitIntro(c.nodes);
  const hasSteps = c.nodes.some((n) => n.t === "steps" || (n.t === "h2" && /process|experience|how to find/i.test(n.text)));
  const faqs = c.nodes.flatMap((n) => (n.t === "faqs" ? n.items : []));
  return (
    <>
      <JsonLd
        data={[
          service({ name, path: c.path, description: c.description }),
          ...(faqs.length ? [faqPage(faqs.map((f) => ({ q: f.q, a: f.a.map((a) => a.text).join(" ") })))] : []),
        ]}
      />
      <PageHero
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
          { name, path: c.path },
        ]}
        eyebrow="Painting services"
        h1={c.h1}
        lead={<FactsLine what={name.toLowerCase()} />}
        photo={hero}
        caption={<>{hero.job}</>}
      />
      {intro.length > 0 && (
        <section className="border-t border-line bg-bg py-14 lg:py-20">
          <div className="container-x max-w-[50rem]">
            <Nodes nodes={intro} ctx={{ path: c.path, base: 1 }} />
          </div>
        </section>
      )}
      <LongForm nodes={rest} path={c.path} photos={pool} />
      {!hasSteps && <ProcessSection bg="bg-surface" title={`Our ${name.toLowerCase()} process`} />}
      <WarrantySection />
      <LowestBidSection />
      <PhotoGrid photos={pool.slice(0, 4)} />
      <ReviewsSection bg="bg-bg" />
      <section className="section bg-surface">
        <div className="container-x">
          <SectionHead eyebrow="More services" title="Other painting services" />
          <div className="mt-12">
            <ServicesGrid exclude={slug} />
          </div>
        </div>
      </section>
      <AreasSection title={`${name} across the Eastside`} />
      <CtaBand />
    </>
  );
}
