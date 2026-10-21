import Image from "next/image";
import Link from "next/link";
import { getPage } from "@/lib/content";
import { metaFromContent } from "@/lib/meta";
import { housePainter } from "@/lib/schema";
import { photo } from "@/content/photos";
import { site } from "@/site.config";
import type { Node } from "@/lib/content-types";
import { JsonLd } from "@/components/JsonLd";
import { HomeHero } from "@/components/home/Hero";
import { Button } from "@/components/Button";
import {
  AreasSection,
  AwardSection,
  CtaBand,
  CustomerPaths,
  LowestBidSection,
  PhotoFigure,
  PhotoGrid,
  ProcessSection,
  ReviewsSection,
  SectionHead,
  ServicesGrid,
  WarrantySection,
  WhyGrid,
} from "@/components/sections/Marketing";

export const metadata = metaFromContent(getPage("/"));

/** Live homepage paragraph whose text starts with `start` (word for word, with the section 6 fixes). */
function live(nodes: Node[], start: string) {
  const n = nodes.find((x) => x.t === "p" && x.text.startsWith(start)) as Extract<Node, { t: "p" }> | undefined;
  if (!n) throw new Error(`Live homepage text not found: ${start}`);
  return n;
}

export default function Home() {
  const c = getPage("/");
  const n = c.nodes;
  const shop = photo("crew-painting-storefront-windows-from-boom-lift");
  return (
    <>
      <JsonLd data={housePainter()} />
      <HomeHero />

      <ReviewsSection />

      {/* Local Painting Services */}
      <section className="section bg-bg">
        <div className="container-x">
          <div className="grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <p className="eyebrow text-accent">Local Painting Services</p>
              <h2 className="display mt-4 text-[clamp(2rem,3.8vw,3.2rem)]">Your Expert House Painters</h2>
            </div>
            <div className="lg:col-span-6 lg:col-start-7">
              <p className="text-ink/85" dangerouslySetInnerHTML={{ __html: live(n, "EA Pro Painters is proud").html }} />
            </div>
          </div>
          <div className="mt-14">
            <ServicesGrid />
          </div>
        </div>
      </section>

      {/* Come see us in Bellevue */}
      <section className="section on-dark">
        <div className="container-x grid items-center gap-12 lg:grid-cols-12">
          <figure className="lg:col-span-6" data-reveal-img>
            <Image src={shop.src} alt={shop.alt} width={shop.width} height={shop.height} sizes="(min-width:1024px) 45vw, 100vw" className="aspect-[4/3] w-full rounded-ui object-cover" />
          </figure>
          <div className="lg:col-span-5 lg:col-start-8">
            <p className="eyebrow text-dark-accent">Come see us in Bellevue.</p>
            <h2 className="display mt-4 text-[clamp(2rem,3.8vw,3.2rem)]">Our Store is next to Sherwin-Williams</h2>
            <p className="mt-6 text-dark-ink/85" dangerouslySetInnerHTML={{ __html: live(n, "We can talk through").html }} />
            <address className="mt-8 border-l-2 border-dark-accent pl-5 not-italic">
              <span className="block font-semibold">{site.address.street}</span>
              <span className="block text-dark-muted">
                {site.address.city}, {site.address.region} {site.address.zip} · {site.hours.display}
              </span>
            </address>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/estimate">Get a Free Estimate</Button>
              <Button href={site.maps} variant="outline" tone="dark">
                Get directions
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* House Painting Services */}
      <section className="section bg-bg">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow text-accent">Residential</p>
            <h2 className="display mt-4 text-[clamp(2rem,3.8vw,3.2rem)]">House Painting Services by EA Pro Painters</h2>
            <PhotoFigure
              p={photo("blue-farmhouse-exterior-white-porch")}
              className="mt-10"
              aspect="aspect-[4/3]"
              sizes="(min-width:1024px) 40vw, 100vw"
            />
          </div>
          <div className="space-y-5 text-ink/85 lg:col-span-6 lg:col-start-7">
            {["EA Pro Painters offers a comprehensive", "Our experienced painters are able", "From the two-story hallway", "We ensure that each painting task"].map((s) => (
              <p key={s} dangerouslySetInnerHTML={{ __html: live(n, s).html }} />
            ))}
          </div>
        </div>
      </section>

      <WarrantySection />
      <AwardSection />

      <ProcessSection bg="bg-surface" />

      {/* Why EA Pro Painters */}
      <section className="section on-dark">
        <div className="container-x grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow text-dark-accent">Why</p>
            <h2 className="display mt-4 text-[clamp(2.2rem,4.2vw,3.6rem)]">EA Pro Painters?</h2>
            <p className="mt-6 text-dark-ink/85" dangerouslySetInnerHTML={{ __html: live(n, "At EA Pro Painters we know").html }} />
          </div>
          <div className="lg:col-span-7">
            <WhyGrid />
          </div>
        </div>
      </section>

      <LowestBidSection />

      <section className="section bg-surface">
        <div className="container-x">
          <SectionHead eyebrow="Who we paint for" title="Homes, communities and businesses" />
          <div className="mt-12">
            <CustomerPaths />
          </div>
        </div>
      </section>

      <PhotoGrid
        bg="bg-bg"
        photos={[
          photo("commercial-building-exterior-repaint-front"),
          photo("navy-home-exterior-red-front-door"),
          photo("stained-cedar-deck-covered-patio"),
          photo("ea-pro-truck-at-teal-home-aerial"),
        ]}
      />

      <AreasSection bg="bg-surface" />

      {/* About EA Pro Painters (live text) */}
      <section className="section bg-bg">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="eyebrow text-accent">About</p>
            <h2 className="display mt-4 text-[clamp(2rem,3.8vw,3.2rem)]">EA Pro Painters</h2>
            <p className="mt-6 text-[15px] text-muted">{site.license.display}</p>
            <Link href="/about" className="mt-6 inline-block text-[16px] font-semibold text-accent underline underline-offset-4">
              More about us
            </Link>
          </div>
          <div className="space-y-5 text-ink/85 lg:col-span-6 lg:col-start-7">
            {["EA Pro Painters is a professional painting company", "We’ve helped keep the Eastside", "Our team of experienced professionals", "We would love to work with you"].map((s) => (
              <p key={s} dangerouslySetInnerHTML={{ __html: live(n, s).html }} />
            ))}
            <p className="text-[15px] text-muted">
              {live(n, "We'd love for you to follow us").text}{" "}
              <a href={site.social.instagram} className="font-semibold text-accent underline underline-offset-4" rel="noopener">
                Find us at @eapropainters
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      <CtaBand title="Create your dream home. Tell us about your project today." />
    </>
  );
}
