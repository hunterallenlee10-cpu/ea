import Link from "next/link";
import { getPage, sections } from "@/lib/content";
import { metaFromContent } from "@/lib/meta";
import { SERVICES } from "@/lib/nav";
import { photo } from "@/content/photos";
import { Nodes } from "@/components/content/Rich";
import { PageHero, FactsLine } from "@/components/sections/PageHero";
import { CtaBand, LowestBidSection, PhotoFigure, ProcessSection, ReviewsSection, photoForService } from "@/components/sections/Marketing";

export const metadata = metaFromContent(getPage("/services"));

// Live section headings → service pages.
const HEADING_TO_SLUG: Record<string, string> = {
  "Exterior Painting": "exterior-painting",
  "Interior Painting": "interior-painting",
  "Cabinet Painting": "cabinet-painting",
  "Custom Painting": "custom-painting",
  "Millwork Painting": "millwork-painting",
  Drywall: "drywall-painting",
  "Deck & Fences": "decks-and-fences-painting",
  "Commercial Painting": "commercial-painting",
};

export default function Services() {
  const c = getPage("/services");
  const secs = sections(c.nodes).filter((s) => s.heading);
  const hoa = getPage("/hoa");
  return (
    <>
      <PageHero
        crumbs={[
          { name: "Home", path: "/" },
          { name: "Services", path: "/services" },
        ]}
        eyebrow="Services"
        h1={c.h1}
        lead={<FactsLine what="interior, exterior, cabinet, custom, millwork, drywall, deck and fence, HOA and commercial painting" />}
        photo={photo("modern-home-exterior-white-stucco-and-cedar")}
        caption="Exterior painting"
      />
      <section className="border-t border-line bg-bg">
        <div className="container-x">
          {secs.map((s, i) => {
            const slug = HEADING_TO_SLUG[s.heading!];
            const body = s.nodes.filter((n) => n.t !== "photo");
            const name = SERVICES.find((x) => x.slug === slug)?.name;
            return (
              <article key={s.heading} className="grid gap-8 border-b border-line py-14 lg:grid-cols-12 lg:gap-12 lg:py-20">
                <div className={`lg:col-span-5 ${i % 2 ? "lg:order-2 lg:col-start-8" : ""}`}>
                  {slug ? <PhotoFigure p={photoForService(slug)} aspect="aspect-[4/3]" sizes="(min-width:1024px) 40vw, 100vw" /> : null}
                </div>
                <div className={`lg:col-span-6 ${i % 2 ? "lg:order-1" : "lg:col-start-7"}`}>
                  <span className="display text-[40px] leading-none text-accent" aria-hidden>
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h2 className="display mt-3 text-[clamp(1.9rem,3.4vw,2.8rem)]">{s.heading}</h2>
                  <div className="mt-5">
                    <Nodes nodes={body} ctx={{ path: c.path }} />
                  </div>
                  {slug && (
                    <Link href={`/${slug}`} className="mt-6 inline-flex min-h-11 items-center text-[16px] font-semibold text-accent underline underline-offset-4">
                      More about {name?.toLowerCase()}
                    </Link>
                  )}
                </div>
              </article>
            );
          })}
          <article className="grid gap-8 py-14 lg:grid-cols-12 lg:gap-12 lg:py-20">
            <div className="lg:col-span-5">
              <PhotoFigure p={photoForService("hoa")} aspect="aspect-[4/3]" sizes="(min-width:1024px) 40vw, 100vw" />
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <span className="display text-[40px] leading-none text-accent" aria-hidden>
                {String(secs.length + 1).padStart(2, "0")}
              </span>
              <h2 className="display mt-3 text-[clamp(1.9rem,3.4vw,2.8rem)]">HOA Painting</h2>
              <p className="mt-5 text-ink/85">{hoa.description}</p>
              <Link href="/hoa" className="mt-6 inline-flex min-h-11 items-center text-[16px] font-semibold text-accent underline underline-offset-4">
                More about HOA painting
              </Link>
            </div>
          </article>
        </div>
      </section>
      <ProcessSection bg="bg-surface" />
      <LowestBidSection />
      <ReviewsSection />
      <CtaBand title="Ready to learn more about how we can help you with your project?" />
    </>
  );
}
