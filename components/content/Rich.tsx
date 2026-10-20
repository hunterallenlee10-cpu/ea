import Image from "next/image";
import type { Inline, Node } from "@/lib/content-types";
import { flagsFor } from "@/content/flags";
import { PHOTOS } from "@/content/photos";
import { REVIEWS } from "@/lib/reviews";
import { site } from "@/site.config";
import { Button } from "@/components/Button";
import { Ph } from "@/components/Ph";
import { Stars } from "@/components/Stars";

/*
 * Renders typed content nodes (built from the live site) in Direction A.
 * HTML in nodes comes from scripts/build-content.ts and only ever contains <a>, <strong>, <em>, <br>.
 */

type Ctx = { path: string; dark?: boolean };

const Html = ({ html, as: As = "p", className = "" }: { html: string; as?: "p" | "span" | "div"; className?: string }) => (
  <As className={className} dangerouslySetInnerHTML={{ __html: html }} />
);

function Flags({ ctx, text }: { ctx: Ctx; text: string }) {
  const f = flagsFor(ctx.path, text).filter((x) => !x.remove);
  if (!f.length) return null;
  return (
    <>
      {f.map((x) => (
        <Ph key={x.note}> {x.note}</Ph>
      ))}
    </>
  );
}
const removed = (ctx: Ctx, text: string) => flagsFor(ctx.path, text).some((f) => f.remove);

// Skip the three reviews the reviews section shows, so one page never repeats a quote.
const shortReviews = REVIEWS.slice(3).filter((r) => r.text.length < 170);

/** CTA inside long-form content, with a short real review beside it (KICKSTART 5.2.6). */
export function InlineCta({ index = 0, label = "Get a Free Estimate", href = "/estimate", dark = false }: { index?: number; label?: string; href?: string; dark?: boolean }) {
  const r = shortReviews[index % shortReviews.length];
  return (
    <div className={`my-10 flex flex-col gap-5 rounded-ui border p-6 sm:flex-row sm:items-center sm:gap-8 ${dark ? "border-dark-line" : "border-line bg-bg"}`}>
      <div className="shrink-0">
        <Button href={href} size="md">
          {label}
        </Button>
      </div>
      <figure className="text-[15px]">
        <Stars className={dark ? "text-dark-accent" : "text-accent"} label={`${r.rating} out of 5 stars`} />
        <blockquote className="mt-1">“{r.text}”</blockquote>
        <figcaption className={`mt-1 text-[13px] ${dark ? "text-dark-muted" : "text-muted"}`}>
          {r.name} · {r.platform}
        </figcaption>
      </figure>
    </div>
  );
}

export function FaqList({ items, ctx, dark = false, level = 3 }: { items: { q: string; a: Inline[] }[]; ctx: Ctx; dark?: boolean; level?: 2 | 3 }) {
  const Q = level === 2 ? "h2" : "h3";
  return (
    <div className={`divide-y border-y ${dark ? "divide-dark-line border-dark-line" : "divide-line border-line"}`}>
      {items.map((f, i) => (
        <details key={f.q} className="group" open={i === 0}>
          <summary className="flex min-h-16 cursor-pointer list-none items-center justify-between gap-6 py-5 text-[19px] font-medium [&::-webkit-details-marker]:hidden">
            <Q className="font-medium">{f.q}</Q>
            <span aria-hidden className={`text-2xl leading-none transition-transform group-open:rotate-45 ${dark ? "text-dark-accent" : "text-accent"}`}>
              +
            </span>
          </summary>
          <div className={`pb-6 text-[16px] leading-relaxed ${dark ? "text-dark-ink/85" : "text-ink/85"}`}>
            {f.a.map((a) => (
              <p key={a.text} className="mt-3 first:mt-0">
                <span dangerouslySetInnerHTML={{ __html: a.html }} />
                <Flags ctx={ctx} text={a.text} />
              </p>
            ))}
          </div>
        </details>
      ))}
    </div>
  );
}

export function Testimonials({ items, dark = false }: { items: { name: string; text: string }[]; dark?: boolean }) {
  return (
    <div className="grid gap-10 md:grid-cols-3">
      {items.map((t) => (
        <figure key={t.name + t.text.slice(0, 10)} className={`border-t pt-6 ${dark ? "border-dark-ink" : "border-ink"}`} data-reveal>
          <Stars className={dark ? "text-dark-accent" : "text-accent"} label="5 out of 5 stars" />
          <blockquote className="display mt-4 text-[21px] leading-snug [text-transform:none]">“{t.text}”</blockquote>
          <figcaption className="mt-5 text-[14px]">
            <span className="font-semibold">{t.name}</span>
          </figcaption>
        </figure>
      ))}
    </div>
  );
}

export function Steps({ items, ctx }: { items: { title: string; body: Inline[] }[]; ctx: Ctx }) {
  return (
    <ol className="my-8 grid gap-px overflow-hidden rounded-ui border border-line bg-line sm:grid-cols-2">
      {items.map((s, i) => (
        <li key={s.title} className="bg-bg p-6">
          <span className="display block text-[44px] leading-none text-accent" aria-hidden>
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="mt-4 text-[18px] font-semibold">
            <span className="sr-only">Step {i + 1}: </span>
            {s.title}
          </h3>
          {s.body.map((b) => (
            <p key={b.text} className="mt-2 text-[16px] text-muted">
              <span dangerouslySetInnerHTML={{ __html: b.html }} />
              <Flags ctx={ctx} text={b.text} />
            </p>
          ))}
        </li>
      ))}
    </ol>
  );
}

/** Body nodes in reading order (no h2s here; sections handle those). */
export function Nodes({ nodes, ctx, ctaOffset = 0 }: { nodes: Node[]; ctx: Ctx; ctaOffset?: number }) {
  let cta = ctaOffset;
  const muted = ctx.dark ? "text-dark-ink/85" : "text-ink/85";
  return (
    <>
      {nodes.map((n, i) => {
        switch (n.t) {
          case "h2":
            return (
              <h2 key={i} className="display mt-12 text-[clamp(1.8rem,3vw,2.5rem)] first:mt-0">
                {n.text}
              </h2>
            );
          case "h3":
            return (
              <h3 key={i} className="mt-10 text-[22px] font-semibold leading-snug first:mt-0">
                {n.text}
              </h3>
            );
          case "h4":
            return (
              <h4 key={i} className="mt-8 text-[18px] font-semibold first:mt-0">
                {n.text}
              </h4>
            );
          case "p":
            if (removed(ctx, n.text)) return null;
            return (
              <p key={i} className={`mt-5 first:mt-0 ${muted} [&_a]:font-medium [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-4`}>
                <span dangerouslySetInnerHTML={{ __html: n.html }} />
                <Flags ctx={ctx} text={n.text} />
              </p>
            );
          case "list": {
            const items = n.items.filter((it) => !removed(ctx, it.text));
            const short = items.every((it) => it.text.length < 48);
            return (
              <ul key={i} className={`mt-6 ${short ? "grid gap-x-6 sm:grid-cols-2" : "space-y-3"}`}>
                {items.map((it) => (
                  <li key={it.text} className={`flex gap-3 ${short ? "border-b border-line py-2.5" : ""} ${muted} [&_a]:text-accent [&_a]:underline`}>
                    <span aria-hidden className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rotate-45 bg-accent" />
                    <span>
                      <span dangerouslySetInnerHTML={{ __html: it.html }} />
                      <Flags ctx={ctx} text={it.text} />
                    </span>
                  </li>
                ))}
              </ul>
            );
          }
          case "cta":
            if (n.href === "/estimate") return <InlineCta key={i} index={cta++} dark={ctx.dark} />;
            return (
              <div key={i} className="mt-8">
                <Button href={n.href} size="md" variant="outline" tone={ctx.dark ? "dark" : "light"}>
                  {n.label}
                </Button>
              </div>
            );
          case "photo": {
            const p = PHOTOS.find((x) => x.id === n.id);
            if (!p) return null;
            return (
              <figure key={i} className="my-10" data-reveal-img>
                <Image src={p.src} alt={p.alt} width={p.width} height={p.height} sizes="(min-width:1024px) 60vw, 100vw" className="aspect-[16/10] w-full rounded-ui object-cover" />
                <figcaption className={`mt-3 text-[13px] ${ctx.dark ? "text-dark-muted" : "text-muted"}`}>
                  {p.job} · {p.town ?? <Ph>CONFIRM: town</Ph>}
                </figcaption>
              </figure>
            );
          }
          case "faqs":
            return (
              <div key={i} className="mt-8">
                <FaqList items={n.items} ctx={ctx} dark={ctx.dark} />
              </div>
            );
          case "testimonials":
            return (
              <div key={i} className="mt-8">
                <Testimonials items={n.items} dark={ctx.dark} />
              </div>
            );
          case "steps":
            return <Steps key={i} items={n.items} ctx={ctx} />;
        }
      })}
    </>
  );
}

export { Html };
export const telLink = `tel:${site.phone.e164}`;
