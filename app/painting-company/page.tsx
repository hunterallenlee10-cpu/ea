import type { Metadata } from "next";
import Link from "next/link";
import { getPage } from "@/lib/content";
import { buildMeta } from "@/lib/meta";
import { CITIES } from "@/lib/nav";
import { site } from "@/site.config";
import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { CtaBand } from "@/components/sections/Marketing";
import { Button } from "@/components/Button";

const PATH = "/painting-company";
export const metadata: Metadata = buildMeta({
  path: PATH,
  title: "Areas We Serve | EA Pro Painters",
  description:
    "EA Pro Painters serves 23 cities across King and Snohomish counties from our Bellevue shop at 3700 Factoria Blvd SE. Find your city's painting services.",
});

export default function AreasHub() {
  const cities = CITIES.map((c) => ({ ...c, blurb: getPage(c.href).description }));
  return (
    <>
      <section className="bg-bg">
        <div className="container-x pb-12 pt-8 lg:pb-16 lg:pt-12">
          <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Areas We Serve", path: PATH }]} />
          <p className="eyebrow mt-8 text-accent">Areas we serve</p>
          <h1 className="display mt-4 max-w-4xl text-[clamp(2.3rem,4.6vw,4.1rem)]">Painting companies near you, from our Bellevue shop</h1>
          <p className="mt-6 max-w-[42rem] text-[18px] leading-relaxed text-muted">
            {site.name} paints homes and businesses in {cities.length} cities across King and Snohomish counties. Our shop is at{" "}
            {site.address.street}, {site.address.city}, {site.address.note.toLowerCase().replace("sherwin-williams", "Sherwin-Williams")}.
            Licensed (WA {site.license.contractor}), bonded and insured, painting since {site.founded}.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/estimate">Get a Free Estimate</Button>
            <Button href={`tel:${site.phone.e164}`} variant="outline">
              Call {site.phone.display}
            </Button>
          </div>
        </div>
      </section>
      <section className="border-t border-line bg-bg pb-24 pt-12">
        <div className="container-x">
          <ul className="grid gap-px overflow-hidden rounded-ui border border-line bg-line sm:grid-cols-2 lg:grid-cols-3">
            {cities.map((c) => (
              <li key={c.slug} className="bg-bg">
                <Link href={c.href} className="group flex h-full flex-col p-6 hover:bg-surface lg:p-7">
                  <h2 className="display flex items-center justify-between text-[28px]">
                    {c.name}
                    <span aria-hidden className="text-[20px] text-accent transition-transform group-hover:translate-x-1">
                      →
                    </span>
                  </h2>
                  <p className="mt-3 text-[15px] text-muted">{c.blurb}</p>
                  <span className="mt-4 text-[14px] font-semibold text-accent">Painting in {c.name}, WA</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <CtaBand title="Don't see your city? Ask us." sub={`Call ${site.phone.display} or request an estimate and we'll tell you if we can help.`} />
    </>
  );
}
