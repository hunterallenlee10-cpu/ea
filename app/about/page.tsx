import { getPage } from "@/lib/content";
import { metaFromContent } from "@/lib/meta";
import { housePainter } from "@/lib/schema";
import { photo } from "@/content/photos";
import { site } from "@/site.config";
import { JsonLd } from "@/components/JsonLd";
import { Ph } from "@/components/Ph";
import { SHOW_PLACEHOLDERS } from "@/lib/placeholders";
import { PageHero } from "@/components/sections/PageHero";
import {
  AwardsStrip,
  CtaBand,
  ProcessSection,
  ReviewsSection,
  WarrantySection,
} from "@/components/sections/Marketing";

export const metadata = metaFromContent(getPage("/about"));

// About: restructured around the owner, the team, the license, insurance and warranty (KICKSTART section 6).
// The live text is kept; everything Erik must supply is a visible placeholder.
export default function About() {
  const c = getPage("/about");
  const paras = c.nodes.filter((n) => n.t === "p") as {
    text: string;
    html: string;
  }[];
  const credentials = [
    { label: "WA contractor license", value: site.license.contractor },
    { label: "WA UBI", value: site.license.ubi },
    { label: "Bonded & insured", value: "Yes" },
    { label: "Painting since", value: String(site.founded) },
  ];
  return (
    <>
      <JsonLd data={housePainter()} />
      <PageHero
        crumbs={[
          { name: "Home", path: "/" },
          { name: "About", path: "/about" },
        ]}
        eyebrow="About us"
        h1={c.h1}
        lead={<p dangerouslySetInnerHTML={{ __html: paras[0].html }} />}
        photo={photo("crew-cutting-in-exterior-column-edge")}
        caption="Our crew at work"
      />

      <section className="section border-t border-line bg-bg">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow text-accent">Our story</p>
            <h2 className="display mt-4 text-[clamp(2rem,3.6vw,3rem)]">
              Painting the Eastside since {site.founded}
            </h2>
          </div>
          <div className="space-y-5 text-ink/85 lg:col-span-7 lg:col-start-6">
            <p>
              <Ph>
                ERIK TO PROVIDE: owner name, photo and the story of how EA Pro
                Painters started
              </Ph>
            </p>
            {paras.slice(1).map((p) => (
              <p key={p.text} dangerouslySetInnerHTML={{ __html: p.html }} />
            ))}
          </div>
        </div>
      </section>

      {/* Team section only shows once Erik provides the team (or when placeholders are shown). */}
      {SHOW_PLACEHOLDERS && (
        <section className="section bg-surface">
          <div className="container-x grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <p className="eyebrow text-accent">The team</p>
              <h2 className="display mt-4 text-[clamp(2rem,3.6vw,3rem)]">
                The people on your project
              </h2>
            </div>
            <div className="lg:col-span-7 lg:col-start-6">
              <p className="text-ink/85">
                <Ph>
                  ERIK TO PROVIDE: team and crew leads (names, roles, photos,
                  years with EA Pro)
                </Ph>
              </p>
              <p className="mt-5 text-[15px] text-muted">
                Our reviews mention crew leads by name. Read them on the reviews
                section below.
              </p>
            </div>
          </div>
        </section>
      )}

      <section className="section bg-bg">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <p className="eyebrow text-accent">Credentials</p>
            <h2 className="display mt-4 text-[clamp(2rem,3.6vw,3rem)]">
              Licensed, bonded and insured
            </h2>
          </div>
          <div className="lg:col-span-7 lg:col-start-6">
            <dl className="grid gap-px overflow-hidden rounded-ui border border-line bg-line sm:grid-cols-2">
              {credentials.map((k) => (
                <div key={k.label} className="bg-bg p-6">
                  <dt className="eyebrow text-muted">{k.label}</dt>
                  <dd className="mt-2 text-[22px] font-semibold tracking-wide">
                    {k.value}
                  </dd>
                </div>
              ))}
            </dl>
            <div className="mt-10">
              <AwardsStrip />
            </div>
          </div>
        </div>
      </section>

      <WarrantySection />
      <ProcessSection bg="bg-surface" />
      <ReviewsSection bg="bg-bg" />
      <CtaBand />
    </>
  );
}
