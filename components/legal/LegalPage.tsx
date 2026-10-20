import { Breadcrumbs } from "@/components/sections/Breadcrumbs";
import { Ph } from "@/components/Ph";

/** Shared layout for the draft privacy and terms pages. */
export function LegalPage({ path, name, title, updated, children }: { path: string; name: string; title: string; updated: string; children: React.ReactNode }) {
  return (
    <>
      <section className="bg-bg">
        <div className="container-x pb-10 pt-8 lg:pt-12">
          <Breadcrumbs items={[{ name: "Home", path: "/" }, { name, path }]} />
          <p className="mt-8">
            <Ph>DRAFT, have it reviewed. Not legal advice.</Ph>
          </p>
          <h1 className="display mt-5 text-[clamp(2.3rem,4.6vw,4rem)]">{title}</h1>
          <p className="mt-4 text-[15px] text-muted">Last updated {updated}</p>
        </div>
      </section>
      <section className="border-t border-line bg-bg pb-24 pt-12">
        <div className="container-x">
          <div className="max-w-[44rem] text-ink/85 [&_a]:text-accent [&_a]:underline [&_a]:underline-offset-4 [&_h2]:display [&_h2]:mt-12 [&_h2]:text-[28px] [&_h2]:text-ink [&_li]:mt-2 [&_p]:mt-4 [&_ul]:mt-4 [&_ul]:list-disc [&_ul]:pl-6">
            {children}
          </div>
        </div>
      </section>
    </>
  );
}
