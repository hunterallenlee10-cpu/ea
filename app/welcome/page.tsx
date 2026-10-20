import type { Metadata } from "next";
import { getPage } from "@/lib/content";
import { metaFromContent } from "@/lib/meta";
import { Nodes } from "@/components/content/Rich";
import { CtaBand, ProcessSection } from "@/components/sections/Marketing";

// noindex in LAUNCH comes from metaFromContent (NOINDEX_PATHS).
const PATH = "/welcome";

export function generateMetadata(): Metadata {
  return metaFromContent(getPage(PATH));
}

export default function WelcomePage() {
  const c = getPage(PATH);
  // The live "Our Painting Process" heading was followed by step graphics; render it as the process section.
  const i = c.nodes.findIndex((n) => n.t === "h2" && n.text === "Our Painting Process");
  const before = i < 0 ? c.nodes : c.nodes.slice(0, i);
  const after = i < 0 ? [] : c.nodes.slice(i + 1);
  return (
    <>
      <section className="section bg-bg">
        <div className="container-x max-w-3xl">
          <p className="eyebrow text-accent">Welcome</p>
          <h1 className="display mt-4 text-[clamp(2.4rem,5vw,4.2rem)]">{c.h1}</h1>
          <div className="mt-8">
            <Nodes nodes={before} ctx={{ path: PATH }} />
          </div>
        </div>
      </section>
      {i >= 0 && <ProcessSection title="Our Painting Process" bg="bg-surface" />}
      {after.length > 0 && (
        <section className="section bg-bg">
          <div className="container-x max-w-3xl">
            <Nodes nodes={after} ctx={{ path: PATH }} />
          </div>
        </section>
      )}
      <CtaBand />
    </>
  );
}
