import type { Metadata } from "next";
import Link from "next/link";
import { getPage } from "@/lib/content";
import { metaFromContent } from "@/lib/meta";
import type { Node } from "@/lib/content-types";
import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { CtaBand } from "@/components/sections/Marketing";
import { Nodes } from "@/components/content/Rich";

const PATH = "/recommended-companies";
export const metadata: Metadata = metaFromContent(getPage(PATH));

type Company = { name: string; text: string; href: string };

/** Live content: an intro, then company cards (h4 + paragraph + "Visit Website"), then a closing note. */
function split(nodes: Node[]) {
  const companies: Company[] = [];
  const before: Node[] = [];
  const after: Node[] = [];
  for (let i = 0; i < nodes.length; i++) {
    const n = nodes[i];
    if (n.t === "h4") {
      const p = nodes[i + 1];
      const cta = nodes[i + 2];
      companies.push({ name: n.text, text: p?.t === "p" ? p.text : "", href: cta?.t === "cta" ? cta.href : "#" });
      i += cta?.t === "cta" ? 2 : 1;
    } else (companies.length ? after : before).push(n);
  }
  return { before, companies, after };
}

export default function RecommendedCompanies() {
  const c = getPage(PATH);
  const { before, companies, after } = split(c.nodes);
  const heading = before.find((n) => n.t === "h2");
  const intro = before.filter((n) => n.t !== "h2");
  const closing = after.find((n) => n.t === "h3");
  const closingBody = after.filter((n) => n.t !== "h3");
  return (
    <>
      <section className="bg-bg">
        <div className="container-x pb-12 pt-8 lg:pb-16 lg:pt-12">
          <Breadcrumbs items={[{ name: "Home", path: "/" }, { name: "Recommended Companies", path: PATH }]} />
          <p className="eyebrow mt-8 text-accent">Partners</p>
          <h1 className="display mt-4 max-w-4xl text-[clamp(2.3rem,4.6vw,4.1rem)]">{c.h1}</h1>
        </div>
      </section>
      <section className="border-t border-line bg-bg py-14 lg:py-20">
        <div className="container-x grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">{heading && heading.t === "h2" && <h2 className="display text-[clamp(1.8rem,3vw,2.6rem)]">{heading.text}</h2>}</div>
          <div className="max-w-[44rem] lg:col-span-7 lg:col-start-6">
            <Nodes nodes={intro} ctx={{ path: PATH, base: 1 }} />
          </div>
        </div>
        <div className="container-x mt-14">
          <ul className="grid gap-px overflow-hidden rounded-ui border border-line bg-line md:grid-cols-3">
            {companies.map((co) => {
              const external = co.href.startsWith("http");
              return (
                <li key={co.name} className="flex flex-col bg-bg p-7">
                  <h3 className="display text-[28px]">{co.name}</h3>
                  <p className="mt-3 flex-1 text-[16px] text-muted">{co.text}</p>
                  {external ? (
                    <a href={co.href} rel="noopener" className="mt-6 inline-flex min-h-11 items-center text-[15px] font-semibold text-accent underline underline-offset-4">
                      Visit Website<span className="sr-only"> of {co.name} (opens their site)</span>
                    </a>
                  ) : (
                    <Link href={co.href} className="mt-6 inline-flex min-h-11 items-center text-[15px] font-semibold text-accent underline underline-offset-4">
                      Visit Website<span className="sr-only"> of {co.name}</span>
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>
      <CtaBand
        title={closing && closing.t === "h3" ? closing.text : "Contact Us"}
        sub={<Nodes nodes={closingBody} ctx={{ path: PATH }} />}
      />
    </>
  );
}
