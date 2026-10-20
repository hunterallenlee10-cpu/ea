import type { Metadata } from "next";
import { getPage } from "@/lib/content";
import { metaFromContent } from "@/lib/meta";
import { IS_LAUNCH } from "@/lib/mode";
import { REVIEWS } from "@/lib/reviews";
import { site } from "@/site.config";
import { ContactForm } from "@/components/forms/ContactForm";
import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { ReviewsSection } from "@/components/sections/Marketing";
import { ReviewCard } from "@/components/ReviewCard";
import { Button } from "@/components/Button";

const PATH = "/contact";

export function generateMetadata(): Metadata {
  return metaFromContent(getPage(PATH));
}

export default function ContactPage() {
  const c = getPage(PATH);
  // Live content: "Bellevue" heading, then address, email and phone paragraphs (shown as links here).
  const heading = c.nodes.find((n) => n.t === "h3");
  const paras = c.nodes.filter((n): n is Extract<typeof n, { t: "p" }> => n.t === "p");
  const address = paras.find((p) => /Factoria/.test(p.text));
  const email = paras.find((p) => /@/.test(p.text));
  const phone = paras.find((p) => /\d{3}\.\d{3}\.\d{4}/.test(p.text));
  return (
    <>
      <section className="bg-bg">
        <div className="container-x pb-16 pt-8 lg:pb-24 lg:pt-12">
          <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Contact", path: PATH }]} />
          <div className="mt-8 grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="eyebrow text-accent">Contact</p>
              <h1 className="display mt-4 text-[clamp(2.4rem,4.6vw,4rem)]">{c.h1}</h1>
              <p className="mt-5 text-[18px] text-muted">
                Questions, scheduling or a quick quote. Call, email or send a message and we&rsquo;ll get back to you.
              </p>

              <div className="mt-10 border-l-2 border-accent pl-6">
                {heading && "text" in heading && <h2 className="text-[22px] font-semibold">{heading.text}</h2>}
                {address && (
                  <address className="mt-3 not-italic text-[17px] leading-relaxed">
                    <span dangerouslySetInnerHTML={{ __html: address.html }} />
                    <span className="mt-1 block text-[14px] text-muted">{site.address.note}</span>
                  </address>
                )}
                <p className="mt-4 text-[17px]">
                  <a href={`tel:${site.phone.e164}`} className="font-semibold tabular-nums hover:text-accent">
                    {phone?.text ?? site.phone.display}
                  </a>
                </p>
                <p className="mt-1 text-[17px]">
                  <a href={`mailto:${site.email}`} className="hover:text-accent">
                    {email?.text ?? site.email}
                  </a>
                </p>
                <p className="mt-4 text-[15px] text-muted">{site.hours.display}</p>
                <a href={site.maps} rel="noopener" className="mt-4 inline-flex min-h-11 items-center text-[15px] font-semibold text-accent underline underline-offset-4">
                  Get directions
                </a>
              </div>

              <p className="mt-8 text-[13px] leading-relaxed text-muted">{site.license.display}</p>
            </div>

            <div className="lg:col-span-6 lg:col-start-7">
              <h2 className="display text-[clamp(1.7rem,3vw,2.3rem)]">Send us a message</h2>
              <div className="mt-6">
                <ContactForm isLaunch={IS_LAUNCH} phone={{ display: site.phone.display, e164: site.phone.e164 }} />
              </div>
              <div className="mt-8 grid gap-6 rounded-ui bg-surface p-7 sm:grid-cols-[1fr_auto] sm:items-end">
                <ReviewCard r={REVIEWS[2]} />
                <Button href="/estimate" size="md">
                  Get a Free Estimate
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ReviewsSection title="Hire a company you can trust" reviews={REVIEWS.slice(3, 6)} />
    </>
  );
}
