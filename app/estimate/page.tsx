import type { Metadata } from "next";
import { getPage } from "@/lib/content";
import { metaFromContent } from "@/lib/meta";
import { IS_LAUNCH } from "@/lib/mode";
import { SERVICES } from "@/lib/nav";
import { REVIEWS } from "@/lib/reviews";
import { faqPage } from "@/lib/schema";
import { site, displayedReviews } from "@/site.config";
import { EstimateForm } from "@/components/forms/EstimateForm";
import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { FaqList } from "@/components/content/Rich";
import { ReviewCard } from "@/components/ReviewCard";
import { JsonLd } from "@/components/JsonLd";
import { Stars } from "@/components/Stars";
import { Ph } from "@/components/Ph";

const PATH = "/estimate";

export function generateMetadata(): Metadata {
  return metaFromContent(getPage(PATH));
}

export default function EstimatePage() {
  const c = getPage(PATH);
  const faqs = c.nodes.flatMap((n) => (n.t === "faqs" ? n.items : []));
  const r = displayedReviews();
  const review = REVIEWS.find((x) => x.text.length < 200) ?? REVIEWS[0];
  return (
    <>
      <section className="bg-bg">
        <div className="container-x pb-16 pt-8 lg:pb-24 lg:pt-12">
          <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Free Estimate", path: PATH }]} />
          <div className="mt-8 grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="eyebrow text-accent">Free estimate</p>
              <h1 className="display mt-4 text-[clamp(2.2rem,4.2vw,3.6rem)]">{c.h1}</h1>
              <p className="mt-5 max-w-[38rem] text-[18px] text-muted">
                Tell us about your project. Takes under 2 minutes. {site.estimateTiming.visit} <Ph>CONFIRM WITH ERIK</Ph>
              </p>
              <div className="mt-10">
                <EstimateForm isLaunch={IS_LAUNCH} services={SERVICES.map((s) => ({ slug: s.slug, name: s.name }))} phone={{ display: site.phone.display, e164: site.phone.e164 }} />
              </div>
            </div>

            <aside className="lg:col-span-4 lg:col-start-9" aria-label="Why homeowners choose EA Pro Painters">
              <div className="lg:sticky lg:top-28">
                <div className="rounded-ui bg-surface p-7">
                  <p className="flex items-center gap-3 text-[15px]">
                    <Stars className="text-accent" />
                    <span>
                      <strong>{r.rating}</strong> from {r.count} reviews on {r.source}
                    </span>
                  </p>
                  <div className="mt-6">
                    <ReviewCard r={review} />
                  </div>
                  <a href={site.reviews.birdeye.url} rel="noopener" className="mt-5 inline-flex min-h-11 items-center text-[15px] font-semibold text-accent underline underline-offset-4">
                    Read all reviews
                  </a>
                </div>
                <dl className="mt-6 grid gap-4 text-[15px]">
                  <div>
                    <dt className="eyebrow text-muted">Licensed &amp; insured</dt>
                    <dd className="mt-1">{site.license.display}</dd>
                  </div>
                  <div>
                    <dt className="eyebrow text-muted">Warranty</dt>
                    <dd className="mt-1">
                      {site.warranty.display} <Ph>{site.warranty.flagShort}</Ph>
                    </dd>
                  </div>
                  <div>
                    <dt className="eyebrow text-muted">Prefer to talk?</dt>
                    <dd className="mt-1">
                      <a href={`tel:${site.phone.e164}`} className="text-[20px] font-semibold tabular-nums hover:text-accent">
                        {site.phone.display}
                      </a>
                      <span className="block text-muted">{site.hours.display}</span>
                    </dd>
                  </div>
                </dl>
              </div>
            </aside>
          </div>
        </div>
      </section>

      {faqs.length > 0 && (
        <section className="section on-dark">
          <div className="container-x grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="eyebrow text-dark-accent">Estimate questions</p>
              <h2 className="display mt-3 text-[clamp(2rem,3.6vw,3rem)]">How our free estimates work</h2>
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              <FaqList items={faqs} ctx={{ path: PATH, dark: true }} dark />
            </div>
          </div>
          <JsonLd data={faqPage(faqs.map((f) => ({ q: f.q, a: f.a.map((a) => a.text).join(" ") })))} />
        </section>
      )}
    </>
  );
}
