import Image from "next/image";
import { site } from "@/site.config";
import type { Photo } from "@/content/photos";
import { Button } from "@/components/Button";
import { ProofRow } from "@/components/ProofRow";
import { Ph } from "@/components/Ph";
import { Breadcrumbs, type Crumb } from "./Breadcrumbs";
import { photoImg } from "@/content/photos";

/**
 * Inner-page hero: breadcrumbs, eyebrow, the page's H1 (live wording), a plain facts line
 * (what, where, license, warranty, years: KICKSTART "AI search"), both CTAs, microcopy, proof row,
 * and one of EA Pro's own photos.
 */
export function PageHero({
  crumbs,
  eyebrow,
  h1,
  lead,
  photo,
  caption,
  showProof = true,
}: {
  crumbs?: Crumb[];
  eyebrow: string;
  h1: string;
  lead?: React.ReactNode;
  photo?: Photo;
  caption?: React.ReactNode;
  showProof?: boolean;
}) {
  return (
    <section className="bg-bg">
      <div className="container-x pb-14 pt-8 lg:pb-20 lg:pt-12">
        {crumbs && <Breadcrumbs items={crumbs} />}
        <div className={`mt-8 grid items-center gap-10 ${photo ? "lg:grid-cols-12" : ""}`}>
          <div className={photo ? "lg:col-span-7" : "max-w-4xl"}>
            <p className="eyebrow text-accent">{eyebrow}</p>
            <h1 className="display mt-4 text-[clamp(2.3rem,4.6vw,4.1rem)]">{h1}</h1>
            {lead && <div className="mt-6 max-w-[40rem] text-[18px] leading-relaxed text-muted">{lead}</div>}
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Button href="/estimate">Get a Free Estimate</Button>
              <Button href={`tel:${site.phone.e164}`} variant="outline">
                Call {site.phone.display}
              </Button>
            </div>
            <p className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-[14px] text-muted">
              <span>Free estimate</span>
              <span aria-hidden>·</span>
              <span>Takes under 2 minutes</span>
              <span aria-hidden>·</span>
              <span>
                {site.estimateTiming.visit} <Ph>CONFIRM WITH ERIK</Ph>
              </span>
            </p>
            {showProof && (
              <div className="mt-10">
                <ProofRow />
              </div>
            )}
          </div>
          {photo && (
            <figure className="lg:col-span-5">
              <Image
                {...photoImg(photo)} alt={photo.alt}
                priority
                fetchPriority="high"
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="aspect-[4/5] w-full rounded-ui object-cover"
              />
              {caption && <figcaption className="mt-3 text-[13px] text-muted">{caption}</figcaption>}
            </figure>
          )}
        </div>
      </div>
    </section>
  );
}

/** The plain facts sentence used under inner-page H1s. */
export function FactsLine({ what, where = "Bellevue and the Eastside" }: { what: string; where?: string }) {
  return (
    <p>
      {site.name} provides {what} in {where}. Licensed (WA {site.license.contractor}), bonded and insured, painting since{" "}
      {site.founded}, with a {site.warranty.display} <Ph>{site.warranty.flagShort}</Ph>.
    </p>
  );
}
