import Image from "next/image";
import Link from "next/link";
import type { PageContent } from "@/lib/content-types";
import { getPosts } from "@/lib/content";
import { blogPosting } from "@/lib/schema";
import { PHOTOS, type Photo } from "@/content/photos";
import { JsonLd } from "@/components/JsonLd";
import { Nodes, InlineCta } from "@/components/content/Rich";
import { Ph, Town } from "@/components/Ph";
import { SHOW_PLACEHOLDERS } from "@/lib/placeholders";
import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { CtaBand } from "@/components/sections/Marketing";

/** One of EA Pro's own photos that fits the post's topic (the live posts used stock images). */
export function photoForPost(c: PageContent): Photo {
  const t = (c.h1 + " " + c.path).toLowerCase();
  const pick = (id: string) => PHOTOS.find((p) => p.id === id)!;
  if (/deck|outdoor/.test(t)) return pick("stained-cedar-deck-covered-patio");
  if (/commercial|office|business/.test(t)) return pick("commercial-building-exterior-repaint-entrance");
  if (/interior|finish|modern look|eco|color trends for seattle/.test(t)) return pick("staircase-black-metal-railing-white-walls");
  if (/winter|weather|climate|seasonal|summer|best time/.test(t)) return pick("painter-on-ladder-painting-siding");
  if (/hiring|benefits|diy/.test(t)) return pick("crew-cutting-in-exterior-column-edge");
  if (/prepar|maintain/.test(t)) return pick("painter-masking-trim-before-painting");
  if (/color/.test(t)) return pick("navy-home-exterior-red-front-door");
  return pick("brick-and-gray-siding-two-story-home");
}

export function PostTemplate({ c }: { c: PageContent }) {
  const p = photoForPost(c);
  const more = getPosts().filter((x) => x.path !== c.path).slice(0, 3);
  return (
    <>
      <JsonLd
        data={blogPosting({
          headline: c.h1,
          path: c.path,
          description: c.description,
          published: c.post!.published,
          modified: c.lastmod,
          image: p.src,
        })}
      />
      <article>
        <header className="bg-bg">
          <div className="container-x max-w-[60rem] pb-10 pt-8 lg:pt-12">
            <Breadcrumbs
              items={[
                { name: "Home", path: "/" },
                { name: "Blog", path: "/blog" },
                { name: c.h1, path: c.path },
              ]}
            />
            <p className="eyebrow mt-10 text-accent">
              <time dateTime={c.post!.published}>{c.post!.publishedDisplay}</time>
            </p>
            <h1 className="display mt-4 text-[clamp(2.2rem,4.6vw,3.8rem)]">{c.h1}</h1>
            <p className="mt-5 text-[15px] text-muted">
              {SHOW_PLACEHOLDERS ? (
                <>
                  By <Ph>ERIK TO PROVIDE: author name</Ph> · EA Pro Painters, Bellevue
                </>
              ) : (
                <>
                  By EA Pro Painters, Bellevue
                  <Ph>ERIK TO PROVIDE: author name</Ph>
                </>
              )}
            </p>
          </div>
          <figure className="container-x max-w-[72rem]">
            <Image src={p.src} alt={p.alt} width={p.width} height={p.height} priority fetchPriority="high" sizes="(min-width:1152px) 1152px, 100vw" className="aspect-[21/9] w-full rounded-ui object-cover" />
            <figcaption className="mt-3 text-[13px] text-muted">
              {p.job} by EA Pro Painters
              <Town town={p.town} />
            </figcaption>
          </figure>
        </header>
        <div className="bg-bg pb-20 pt-12">
          <div className="container-x max-w-[44rem] text-[18px] [&_h2]:mt-14 [&_h3]:mt-12">
            <Nodes nodes={c.nodes} ctx={{ path: c.path, base: 1 }} />
            <InlineCta index={c.path.length} />
          </div>
        </div>
      </article>
      <section className="section bg-surface">
        <div className="container-x">
          <p className="eyebrow text-accent">From the blog</p>
          <h2 className="display mt-4 text-[clamp(2rem,3.6vw,3rem)]">More painting tips</h2>
          <ul className="mt-10 grid gap-8 md:grid-cols-3">
            {more.map((m) => (
              <li key={m.path}>
                <Link href={m.path} className="group block">
                  <p className="text-[13px] text-muted">{m.post!.publishedDisplay}</p>
                  <h3 className="display mt-2 text-[24px] leading-snug group-hover:text-accent">{m.h1}</h3>
                  <p className="mt-2 text-[15px] text-muted">{m.description}</p>
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/blog" className="mt-10 inline-block text-[16px] font-semibold text-accent underline underline-offset-4">
            All posts
          </Link>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
