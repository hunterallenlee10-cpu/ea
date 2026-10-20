import type { Node } from "@/lib/content-types";
import { sections as toSections } from "@/lib/content";
import type { Photo } from "@/content/photos";
import { PhotoFigure } from "@/components/sections/Marketing";
import { Nodes } from "./Rich";

/**
 * Long-form live content (service and city pages), one section per live H2.
 * Plain text sections share the paper background with a hairline between them and a sticky heading
 * on the left; FAQ sections go evergreen, testimonial and step sections go warm, for pacing.
 * A real project photo is placed after every few text sections.
 */
export function LongForm({ nodes, path, photos = [] }: { nodes: Node[]; path: string; photos?: Photo[] }) {
  const raw = toSections(nodes);
  // A heading with no content of its own (e.g. "EA Pro Painters:") becomes the kicker of the next section.
  const secs: { heading: string | null; kicker: string | null; nodes: Node[] }[] = [];
  let pending: string | null = null;
  for (const s of raw) {
    if (s.heading && s.nodes.length === 0) {
      pending = pending ? `${pending} ${s.heading}` : s.heading;
      continue;
    }
    secs.push({ heading: s.heading, kicker: pending, nodes: s.nodes });
    pending = null;
  }
  let textCount = 0;
  let photoIdx = 0;
  let ctaOffset = 0;
  return (
    <>
      {secs.map((s, i) => {
        const special = s.nodes.find((n) => n.t === "faqs" || n.t === "testimonials");
        const ctas = s.nodes.filter((n) => n.t === "cta").length;
        const offset = ctaOffset;
        ctaOffset += ctas;
        if (special?.t === "faqs" || special?.t === "testimonials") {
          const dark = special.t === "faqs";
          return (
            <section key={i} className={`section ${dark ? "on-dark" : "bg-surface"}`}>
              <div className="container-x grid gap-12 lg:grid-cols-12">
                <div className="lg:col-span-4">
                  {s.kicker && <h2 className={`eyebrow ${dark ? "text-dark-accent" : "text-accent"}`}>{s.kicker}</h2>}
                  {s.heading && <h2 className="display mt-3 text-[clamp(2rem,3.6vw,3rem)]">{s.heading}</h2>}
                </div>
                <div className={special.t === "faqs" ? "lg:col-span-7 lg:col-start-6" : "lg:col-span-12"}>
                  <Nodes nodes={s.nodes} ctx={{ path, dark }} ctaOffset={offset} />
                </div>
              </div>
            </section>
          );
        }
        textCount++;
        const photo = textCount % 3 === 0 ? photos[photoIdx++ % Math.max(photos.length, 1)] : undefined;
        return (
          <section key={i} className="border-t border-line bg-bg py-14 lg:py-20">
            <div className="container-x grid gap-8 lg:grid-cols-12 lg:gap-12">
              <div className="lg:col-span-4">
                <div className="lg:sticky lg:top-28">
                  {s.kicker && <h2 className="eyebrow text-accent">{s.kicker}</h2>}
                  {s.heading && <h2 className="display mt-3 text-[clamp(1.8rem,3vw,2.6rem)]">{s.heading}</h2>}
                </div>
              </div>
              <div className="max-w-[44rem] lg:col-span-7 lg:col-start-6">
                <Nodes nodes={s.nodes} ctx={{ path }} ctaOffset={offset} />
                {photo && <PhotoFigure p={photo} className="mt-10" aspect="aspect-[16/10]" />}
              </div>
            </div>
          </section>
        );
      })}
    </>
  );
}
