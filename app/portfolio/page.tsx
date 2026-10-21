import type { Metadata } from "next";
import { getPage } from "@/lib/content";
import { metaFromContent } from "@/lib/meta";
import { SERVICES, cityName } from "@/lib/nav";
import { PROJECTS, projectPhotos } from "@/content/projects";
import { PortfolioGrid, type GridItem } from "@/components/portfolio/PortfolioGrid";
import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { CtaBand } from "@/components/sections/Marketing";
import { Ph } from "@/components/Ph";

const PATH = "/portfolio";
export const metadata: Metadata = metaFromContent(getPage(PATH));

export default function PortfolioPage() {
  const c = getPage(PATH);
  const items: GridItem[] = PROJECTS.map((p) => {
    const photos = projectPhotos(p);
    const first = photos.find((x) => /after|white-stucco|front|red-front|covered-patio|boom-lift|two-story|risers/.test(x.id)) ?? photos[0];
    return {
      slug: p.slug,
      name: p.name,
      service: p.service,
      serviceName: SERVICES.find((s) => s.slug === p.service)?.name ?? p.service,
      city: p.city,
      cityName: p.city ? cityName(p.city) : null,
      summary: p.summary,
      photo: { src: first.src, alt: first.alt, width: first.width, height: first.height, blur: first.blur },
      photoCount: photos.length,
    };
  });
  return (
    <>
      <section className="bg-bg">
        <div className="container-x pb-12 pt-8 lg:pb-16 lg:pt-12">
          <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Portfolio", path: PATH }]} />
          <p className="eyebrow mt-8 text-accent">Portfolio</p>
          <h1 className="display mt-4 max-w-4xl text-[clamp(2.3rem,4.6vw,4.1rem)]">{c.h1}</h1>
          <p className="mt-6 max-w-[40rem] text-[18px] leading-relaxed text-muted">
            Real EA Pro Painters projects, photographed by our team: interior, exterior, cabinet, deck and commercial work across Bellevue and
            the Eastside. Filter by service or city, then open a project for the details.
          </p>
          <p className="mt-3 text-[13px] text-muted">
            <Ph>CONFIRM WITH ERIK: town, job details and permission to show each project (#11, #23)</Ph>
          </p>
        </div>
      </section>
      <section className="border-t border-line bg-bg pb-24 pt-12">
        <div className="container-x">
          <PortfolioGrid items={items} services={SERVICES.map((s) => ({ slug: s.slug, name: s.name }))} />
        </div>
      </section>
      <CtaBand title="Want results like these on your home or business?" />
    </>
  );
}
