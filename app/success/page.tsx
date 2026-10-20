import type { Metadata } from "next";
import { getPage } from "@/lib/content";
import { metaFromContent } from "@/lib/meta";
import { site } from "@/site.config";
import { Nodes } from "@/components/content/Rich";
import { Button } from "@/components/Button";

// Thank-you page after the estimate form. His Google Ads conversion fires on this page view (LAUNCH).
// noindex in LAUNCH comes from metaFromContent (NOINDEX_PATHS).
const PATH = "/success";

export function generateMetadata(): Metadata {
  return metaFromContent(getPage(PATH));
}

export default function SuccessPage() {
  const c = getPage(PATH);
  return (
    <>
      <section className="section bg-bg">
        <div className="container-x max-w-3xl">
          <p className="eyebrow text-accent">Request received</p>
          <h1 className="display mt-4 text-[clamp(2.4rem,5vw,4.2rem)]">{c.h1}</h1>
          <div className="mt-6 text-[19px]">
            <Nodes nodes={c.nodes} ctx={{ path: PATH }} />
          </div>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button href={`tel:${site.phone.e164}`}>Call {site.phone.display}</Button>
            <Button href="/" variant="outline">
              Back to the homepage
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
