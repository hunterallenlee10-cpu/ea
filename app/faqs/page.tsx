import { getPage } from "@/lib/content";
import { metaFromContent } from "@/lib/meta";
import { faqPage } from "@/lib/schema";
import { JsonLd } from "@/components/JsonLd";
import { FaqList } from "@/components/content/Rich";
import { Button } from "@/components/Button";
import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { CtaBand, ReviewsSection } from "@/components/sections/Marketing";

export const metadata = metaFromContent(getPage("/faqs"));

export default function Faqs() {
  const c = getPage("/faqs");
  const items = c.nodes.flatMap((n) => (n.t === "faqs" ? n.items : []));
  return (
    <>
      <JsonLd data={faqPage(items.map((f) => ({ q: f.q, a: f.a.map((a) => a.text).join(" ") })))} />
      <section className="bg-bg">
        <div className="container-x grid gap-12 pb-20 pt-8 lg:grid-cols-12 lg:pt-12">
          <div className="lg:col-span-12">
            <Breadcrumbs
              items={[
                { name: "Home", path: "/" },
                { name: "FAQs", path: "/faqs" },
              ]}
            />
          </div>
          <div className="lg:col-span-5">
            <p className="eyebrow text-accent">FAQs</p>
            <h1 className="display mt-4 text-[clamp(2.3rem,4.6vw,3.8rem)]">{c.h1}</h1>
            <p className="mt-8 text-[18px] font-semibold">Still have questions?</p>
            <div className="mt-4 flex flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
              <Button href="/contact" variant="outline">
                Contact Us Today
              </Button>
              <Button href="/estimate">Get a Free Estimate</Button>
            </div>
          </div>
          <div className="lg:col-span-7">
            <FaqList items={items} ctx={{ path: c.path }} level={2} />
          </div>
        </div>
      </section>
      <ReviewsSection />
      <CtaBand />
    </>
  );
}
