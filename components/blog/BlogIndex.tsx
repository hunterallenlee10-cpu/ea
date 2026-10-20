import Image from "next/image";
import Link from "next/link";
import { getPosts, POSTS_PER_PAGE, blogPageCount } from "@/lib/content";
import { photoForPost } from "@/components/templates/PostTemplate";
import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { CtaBand } from "@/components/sections/Marketing";

/** Blog archive with plain, crawlable pagination (/blog, /blog/page/2, …). The live site used a JS "More Posts" button. */
export function BlogIndex({ page, h1 }: { page: number; h1: string }) {
  const all = getPosts();
  const posts = all.slice((page - 1) * POSTS_PER_PAGE, page * POSTS_PER_PAGE);
  const pages = blogPageCount();
  const href = (n: number) => (n === 1 ? "/blog" : `/blog/page/${n}`);
  return (
    <>
      <section className="bg-bg">
        <div className="container-x pb-6 pt-8 lg:pt-12">
          <Breadcrumbs
            items={[
              { name: "Home", path: "/" },
              ...(page === 1 ? [{ name: "Blog", path: "/blog" }] : [{ name: "Blog", path: "/blog" }, { name: `Page ${page}`, path: href(page) }]),
            ]}
          />
          <p className="eyebrow mt-10 text-accent">Painting tips &amp; trends</p>
          <h1 className="display mt-4 max-w-4xl text-[clamp(2.3rem,4.6vw,4.1rem)]">{h1}</h1>
        </div>
      </section>
      <section className="bg-bg pb-20 pt-8">
        <div className="container-x">
          <ul className="grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((p, i) => {
              const ph = photoForPost(p);
              return (
                <li key={p.path}>
                  <Link href={p.path} className="group block">
                    <div className="overflow-hidden rounded-ui">
                      <Image src={ph.src} alt={ph.alt} width={ph.width} height={ph.height} sizes="(min-width:1024px) 30vw, (min-width:640px) 45vw, 100vw" priority={i < 3} className="aspect-[4/3] w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                    </div>
                    <p className="mt-4 text-[13px] text-muted">
                      <time dateTime={p.post!.published}>{p.post!.publishedDisplay}</time>
                    </p>
                    <h2 className="display mt-2 text-[24px] leading-snug group-hover:text-accent">{p.h1}</h2>
                    <p className="mt-2 text-[15px] text-muted">{p.description}</p>
                  </Link>
                </li>
              );
            })}
          </ul>
          <nav aria-label="Blog pages" className="mt-16 flex flex-wrap items-center gap-2">
            {page > 1 && (
              <Link href={href(page - 1)} rel="prev" className="inline-flex min-h-11 items-center px-4 font-semibold text-accent underline underline-offset-4">
                Newer posts
              </Link>
            )}
            {Array.from({ length: pages }, (_, i) => i + 1).map((n) => (
              <Link
                key={n}
                href={href(n)}
                aria-current={n === page ? "page" : undefined}
                className={`inline-flex min-h-11 min-w-11 items-center justify-center rounded-ui border text-[15px] ${n === page ? "border-ink bg-ink text-bg" : "border-line hover:border-ink"}`}
              >
                {n}
              </Link>
            ))}
            {page < pages && (
              <Link href={href(page + 1)} rel="next" className="inline-flex min-h-11 items-center px-4 font-semibold text-accent underline underline-offset-4">
                Older posts
              </Link>
            )}
          </nav>
        </div>
      </section>
      <CtaBand />
    </>
  );
}
