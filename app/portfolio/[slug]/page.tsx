import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PROJECTS, getProject, projectPhotos } from "@/content/projects";
import { buildMeta } from "@/lib/meta";
import { SERVICES, cityHref, cityName } from "@/lib/nav";
import { REVIEWS } from "@/lib/reviews";
import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { CtaBand, SectionHead } from "@/components/sections/Marketing";
import { Ph, Town } from "@/components/Ph";
import { SHOW_PLACEHOLDERS, isPlaceholder } from "@/lib/placeholders";
import { photoImg } from "@/content/photos";

export const dynamicParams = false;
export function generateStaticParams() {
  return PROJECTS.map((p) => ({ slug: p.slug }));
}

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const p = getProject((await params).slug);
  if (!p) return {};
  const cover = projectPhotos(p)[0];
  return buildMeta({
    path: `/portfolio/${p.slug}`,
    title: `${p.name} | EA Pro Painters`,
    description: `${p.summary} A project by EA Pro Painters, licensed and insured painters serving Bellevue and the Eastside.`,
    image: cover?.src,
    twitterCard: "summary_large_image",
  });
}

/** Shows a value, or a visible placeholder when it is still "[ERIK TO PROVIDE: …]". */
function Val({ v }: { v: string | null }) {
  if (!v) return <Ph>CONFIRM: town</Ph>;
  return v.startsWith("[") ? <Ph>{v.slice(1, -1)}</Ph> : <>{v}</>;
}

export default async function ProjectPage({ params }: Props) {
  const p = getProject((await params).slug);
  if (!p) notFound();
  const photos = projectPhotos(p);
  const [cover, ...rest] = photos;
  const service = SERVICES.find((s) => s.slug === p.service)!;
  const others = PROJECTS.filter(
    (x) => x.slug !== p.slug && x.service === p.service,
  ).slice(0, 2);
  const path = `/portfolio/${p.slug}`;
  const glance = [
    { k: "Location", v: p.city ? cityName(p.city) : null },
    { k: "Service", v: service.name },
    { k: "Surfaces", v: p.glance.surfaces },
    { k: "Products", v: p.glance.products },
    { k: "Finish", v: p.glance.finish },
  ];
  const story = [
    { k: "The challenge", v: p.challenge },
    { k: "Our process", v: p.process },
    { k: "The result", v: p.result },
    { k: "What the customer said", v: p.review },
  ].filter((s) => SHOW_PLACEHOLDERS || !isPlaceholder(s.v));
  // With placeholders hidden, only rows Erik has answered are shown.
  const glanceShown = glance.filter(
    (g) => SHOW_PLACEHOLDERS || !isPlaceholder(g.v),
  );
  return (
    <>
      <section className="bg-bg">
        <div className="container-x pb-12 pt-8 lg:pt-12">
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              { name: "Portfolio", path: "/portfolio" },
              { name: p.name, path },
            ]}
          />
          <div className="mt-8 grid gap-10 lg:grid-cols-12">
            <div className="lg:col-span-7">
              <p className="eyebrow text-accent">
                {service.name}
                {p.city ? ` · ${cityName(p.city)}` : <Town town={null} />}
              </p>
              <h1 className="display mt-4 text-[clamp(2.3rem,4.6vw,4rem)]">
                {p.name}
              </h1>
              <p className="mt-6 max-w-[40rem] text-[18px] leading-relaxed text-muted">
                {p.summary}
              </p>
            </div>
            <dl
              aria-label="At a glance"
              className="self-end rounded-ui border border-line lg:col-span-4 lg:col-start-9"
            >
              {glanceShown.map((g) => (
                <div
                  key={g.k}
                  className="flex justify-between gap-6 border-b border-line px-5 py-3 text-[15px] last:border-b-0"
                >
                  <dt className="text-muted">{g.k}</dt>
                  <dd className="text-right font-medium">
                    <Val v={g.v} />
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
        {cover && (
          <figure className="container-x pb-14">
            <Image
              {...photoImg(cover, { hero: true })} alt={cover.alt}
              priority
              fetchPriority="high"
              sizes="(min-width: 1216px) 1152px, 100vw"
              className="aspect-[16/9] w-full rounded-ui object-cover"
            />
            <figcaption className="mt-3 text-[13px] text-muted">
              {cover.job}
              <Town town={cover.town} />
            </figcaption>
          </figure>
        )}
      </section>

      {story.length > 0 && (
        <section className="section border-t border-line bg-bg">
          <div className="container-x grid gap-12 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <SectionHead eyebrow="The job" title="How it went" />
            </div>
            <div className="space-y-10 lg:col-span-7 lg:col-start-6">
              {story.map((s) => (
                <div key={s.k}>
                  <h2 className="text-[22px] font-semibold">{s.k}</h2>
                  <p className="mt-3 text-ink/85">
                    <Val v={s.v} />
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {rest.length > 0 && (
        <section className="section bg-surface">
          <div className="container-x">
            <SectionHead eyebrow="Photos" title="More from this project" />
            <ul className="mt-12 grid gap-6 sm:grid-cols-2">
              {rest.map((ph) => (
                <li key={ph.id}>
                  <figure>
                    <Image
                      {...photoImg(ph)} alt={ph.alt}
                      sizes="(min-width:640px) 50vw, 100vw"
                      className="aspect-[4/3] w-full rounded-ui object-cover"
                    />
                    <figcaption className="mt-3 text-[13px] text-muted">
                      {ph.job}
                      <Town town={ph.town} />
                    </figcaption>
                  </figure>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <section className="section bg-bg">
        <div className="container-x grid gap-10 md:grid-cols-2">
          <div>
            <p className="eyebrow text-accent">Related service</p>
            <Link
              href={`/${service.slug}`}
              className="display mt-3 block text-[32px] hover:text-accent"
            >
              {service.name} →
            </Link>
          </div>
          <div>
            <p className="eyebrow text-accent">Where</p>
            {p.city ? (
              <Link
                href={cityHref(p.city)}
                className="display mt-3 block text-[32px] hover:text-accent"
              >
                Painting in {cityName(p.city)} →
              </Link>
            ) : (
              <Link
                href="/painting-company"
                className="display mt-3 block text-[32px] hover:text-accent"
              >
                Areas we serve →
              </Link>
            )}
          </div>
          {others.length > 0 && (
            <div className="md:col-span-2">
              <p className="eyebrow text-muted">
                More {service.name.toLowerCase()} projects
              </p>
              <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2">
                {others.map((o) => (
                  <li key={o.slug}>
                    <Link
                      href={`/portfolio/${o.slug}`}
                      className="text-[16px] underline underline-offset-4 hover:text-accent"
                    >
                      {o.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </section>

      <CtaBand
        title={`Planning ${service.name.toLowerCase()}? Let's talk.`}
        review={REVIEWS[PROJECTS.indexOf(p) % REVIEWS.length]}
      />
    </>
  );
}
