import type { Metadata } from "next";
import Link from "next/link";
import { IS_LAUNCH } from "@/lib/mode";
import { site } from "@/site.config";
import { SERVICES, CITIES } from "@/lib/nav";
import { Button } from "@/components/Button";
import { NotFoundEvent } from "@/components/notfound/NotFoundEvent";

export const metadata: Metadata = { title: { absolute: "Page not found | EA Pro Painters" }, robots: { index: false, follow: true } };

export default function NotFound() {
  return (
    <section className="bg-bg">
      <div className="container-x py-20 lg:py-28">
        <p className="eyebrow text-accent">404</p>
        <h1 className="display mt-4 max-w-3xl text-[clamp(2.4rem,5vw,4.4rem)]">
          This page has had a fresh coat of paint, <em className="italic text-accent">somewhere else</em>.
        </h1>
        <p className="mt-6 max-w-xl text-[18px] text-muted">
          The page you were looking for isn’t here. Try one of these, or call us at {site.phone.display}.
        </p>
        <div className="mt-8 flex flex-col gap-3 sm:flex-row">
          <Button href="/estimate">Get a Free Estimate</Button>
          <Button href="/" variant="outline">
            Back to the homepage
          </Button>
        </div>
        <div className="mt-16 grid gap-10 md:grid-cols-2">
          <div>
            <h2 className="eyebrow text-muted">Services</h2>
            <ul className="mt-4">
              {SERVICES.map((s) => (
                <li key={s.slug}>
                  <Link href={`/${s.slug}`} className="inline-flex min-h-11 items-center text-[17px] hover:text-accent">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="eyebrow text-muted">Areas we serve</h2>
            <ul className="mt-4 grid grid-cols-2 gap-x-6">
              {CITIES.map((c) => (
                <li key={c.slug}>
                  <Link href={c.href} className="inline-flex min-h-11 items-center text-[17px] hover:text-accent">
                    {c.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
      {IS_LAUNCH && <NotFoundEvent />}
    </section>
  );
}
