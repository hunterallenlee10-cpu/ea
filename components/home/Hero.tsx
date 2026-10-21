import Image from "next/image";
import { site } from "@/site.config";
import { HERO } from "@/content/hero";
import { photo, photoImg } from "@/content/photos";
import { Button } from "@/components/Button";
import { ProofRow } from "@/components/ProofRow";
import { Ph, Town } from "@/components/Ph";

/** Homepage hero, Direction A (approved by Hunter in Phase 2). */
export function HomeHero() {
  const main = photo("modern-home-exterior-white-stucco-and-cedar");
  const craft = photo("crew-cutting-in-exterior-column-edge");
  return (
    <section className="relative overflow-hidden bg-bg">
      <div className="container-x grid items-center gap-12 pb-16 pt-10 lg:grid-cols-12 lg:gap-10 lg:pb-20 lg:pt-12">
        <div className="lg:col-span-7">
          <p className="eyebrow text-accent">{HERO.eyebrow}</p>
          <h1 className="display mt-5 text-[clamp(2.5rem,5.2vw,4.6rem)] text-ink">
            The Eastside’s top-rated painting company, with a{" "}
            <em className="italic text-accent">4-year warranty</em>.
          </h1>
          <p className="mt-6 max-w-[38rem] text-[18px] leading-relaxed text-muted md:text-[19px]">{HERO.lead}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href="/estimate">Get a Free Estimate</Button>
            <Button href={`tel:${site.phone.e164}`} variant="outline">
              Call {site.phone.display}
            </Button>
          </div>
          <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[14px] text-muted">
            {HERO.micro.map((m) => (
              <span key={m} className="inline-flex items-center gap-2">
                <span aria-hidden className="h-1 w-1 rounded-full bg-accent" />
                {m}
              </span>
            ))}
            <span className="inline-flex items-center gap-2">
              <span aria-hidden className="h-1 w-1 rounded-full bg-accent" />
              {site.estimateTiming.visit} <Ph>CONFIRM WITH ERIK</Ph>
            </span>
          </p>
          <div className="mt-10">
            <ProofRow />
          </div>
          <p className="mt-2 text-[12px] text-muted">
            <Ph>{site.warranty.flagShort}</Ph>
          </p>
        </div>

        <div className="relative lg:col-span-5">
          <figure className="relative">
            <Image
              {...photoImg(main, { hero: true })} alt={main.alt}
              loading="eager"
              fetchPriority="high"
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="aspect-[4/5] w-full rounded-ui object-cover"
            />
            <figcaption className="mt-3 flex items-center justify-between text-[13px] text-muted">
              <span>
                Exterior repaint
                <Town town={main.town} />
              </span>
              <span className="tabular-nums">01</span>
            </figcaption>
          </figure>
          <figure className="absolute -left-6 top-10 hidden w-[40%] border-[6px] border-bg shadow-2xl sm:block lg:-left-14">
            <Image
              {...photoImg(craft)} alt={craft.alt}
              sizes="(min-width: 1024px) 180px, 30vw"
              className="aspect-square w-full object-cover"
            />
          </figure>
        </div>
      </div>
    </section>
  );
}
