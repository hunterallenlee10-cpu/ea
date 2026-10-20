import type { Node } from "@/lib/content-types";
import { sections as toSections } from "@/lib/content";
import type { Photo } from "@/content/photos";
import { PhotoFigure } from "@/components/sections/Marketing";
import { Nodes, InlineCta } from "./Rich";

type Sec = { heading: string | null; kicker: string | null; nodes: Node[]; kind: "text" | "faqs" | "testimonials" | "work" };

/**
 * Long-form live content (service and city pages), one section per live H2.
 * - Plain text sections share the paper background, a hairline between them, sticky heading on the left.
 * - FAQ accordions get their own evergreen section; testimonials a warm one (pacing).
 * - A heading with no text of its own (the live "Our Work" gallery) shows EA Pro's own photos.
 * - A real project photo follows every third text section.
 */
export function LongForm({ nodes, path, photos = [] }: { nodes: Node[]; path: string; photos?: Photo[] }) {
  const raw = toSections(nodes);
  const secs: Sec[] = [];
  let pending: string | null = null;
  for (const s of raw) {
    const hasText = s.nodes.some((n) => n.t !== "cta" && n.t !== "photo");
    if (s.heading && s.nodes.length === 0) {
      // e.g. "EA Pro Painters:" followed by "Find a Painter in Bellevue": becomes the next section's kicker.
      pending = pending ? `${pending} ${s.heading}` : s.heading;
      continue;
    }
    if (!hasText) {
      secs.push({ heading: s.heading, kicker: pending, nodes: s.nodes, kind: "work" });
      pending = null;
      continue;
    }
    // Split FAQ / testimonial blocks out of mixed sections.
    let buf: Node[] = [];
    let first = true;
    const flush = () => {
      if (buf.length) secs.push({ heading: first ? s.heading : null, kicker: first ? pending : null, nodes: buf, kind: "text" });
      if (buf.length) first = false;
      buf = [];
    };
    for (const n of s.nodes) {
      if (n.t === "faqs" || n.t === "testimonials") {
        const onlyThis = s.nodes.every((x) => x === n || x.t === "cta");
        if (onlyThis) {
          secs.push({ heading: s.heading, kicker: pending, nodes: s.nodes, kind: n.t });
          buf = [];
          first = false;
          break;
        }
        flush();
        secs.push({ heading: first ? s.heading : null, kicker: first ? pending : null, nodes: [n], kind: n.t });
        first = false;
      } else buf.push(n);
    }
    flush();
    pending = null;
  }
  if (pending) secs.push({ heading: pending, kicker: null, nodes: [], kind: "text" });

  let textCount = 0;
  let photoIdx = 0;
  let ctaOffset = 0;
  const nextPhoto = () => photos[photoIdx++ % Math.max(photos.length, 1)];

  return (
    <>
      {secs.map((s, i) => {
        const offset = ctaOffset;
        ctaOffset += s.nodes.filter((n) => n.t === "cta").length;

        if (s.kind === "faqs" || s.kind === "testimonials") {
          const dark = s.kind === "faqs";
          return (
            <section key={i} className={`section ${dark ? "on-dark" : "bg-surface"}`}>
              <div className="container-x grid gap-12 lg:grid-cols-12">
                <div className="lg:col-span-4">
                  {s.kicker && <h2 className={`eyebrow ${dark ? "text-dark-accent" : "text-accent"}`}>{s.kicker}</h2>}
                  {s.heading ? (
                    <h2 className="display mt-3 text-[clamp(2rem,3.6vw,3rem)]">{s.heading}</h2>
                  ) : (
                    <p className={`eyebrow ${dark ? "text-dark-accent" : "text-accent"}`}>{dark ? "Questions" : "Reviews"}</p>
                  )}
                </div>
                <div className={dark ? "lg:col-span-7 lg:col-start-6" : "lg:col-span-12"}>
                  <Nodes nodes={s.nodes} ctx={{ path, dark }} ctaOffset={offset} />
                </div>
              </div>
            </section>
          );
        }

        if (s.kind === "work") {
          const shots = [nextPhoto(), nextPhoto(), nextPhoto()].filter(Boolean);
          return (
            <section key={i} className="border-t border-line bg-surface py-14 lg:py-20">
              <div className="container-x">
                {s.kicker && <h2 className="eyebrow text-accent">{s.kicker}</h2>}
                {s.heading && <h2 className="display mt-3 text-[clamp(1.8rem,3vw,2.6rem)]">{s.heading}</h2>}
                <div className="mt-10 grid gap-6 md:grid-cols-3">
                  {shots.map((p) => (
                    <PhotoFigure key={p.id} p={p} aspect="aspect-[4/3]" sizes="(min-width:768px) 33vw, 100vw" />
                  ))}
                </div>
                {s.nodes.some((n) => n.t === "cta") && <InlineCta index={offset} />}
              </div>
            </section>
          );
        }

        textCount++;
        const photo = textCount % 3 === 0 ? nextPhoto() : undefined;
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
