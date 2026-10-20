import Link from "next/link";
import Image from "next/image";
import { site } from "@/site.config";
import { CITIES, MAIN_NAV, SERVICES } from "@/lib/nav";

type Tone = "light" | "dark";

export function Header({ tone = "light" }: { tone?: Tone }) {
  const dark = tone === "dark";
  const bar = dark ? "bg-dark/95 text-dark-ink border-dark-line" : "bg-bg/95 text-ink border-line";
  const logo = dark ? "/brand/ea-pro-painters-logo-on-dark.svg" : "/brand/ea-pro-painters-logo-dark.svg";
  const sub = dark ? "bg-dark-surface border-dark-line" : "bg-bg border-line";

  return (
    <header className={`sticky top-0 z-40 border-b backdrop-blur ${bar}`}>
      <div className="container-x flex h-16 items-center gap-6 lg:h-[72px]">
        <Link href="/" className="shrink-0" aria-label={`${site.name}, home`}>
          <Image src={logo} alt={site.name} width={170} height={41} priority className="h-9 w-auto lg:h-10" />
        </Link>

        <nav aria-label="Main" className="ml-auto hidden items-center gap-1 lg:flex">
          {MAIN_NAV.map((item) =>
            item.href === "/services" || item.href === "/painting-company" ? (
              <div key={item.href} className="group relative">
                <Link
                  href={item.href}
                  className="inline-flex min-h-11 items-center px-3 text-[15px] font-medium hover:text-accent"
                >
                  {item.label}
                  <svg aria-hidden width="10" height="10" viewBox="0 0 10 10" className="ml-1.5 opacity-60">
                    <path d="M1 3l4 4 4-4" fill="none" stroke="currentColor" strokeWidth="1.5" />
                  </svg>
                </Link>
                <div
                  className={`invisible absolute left-0 top-full z-50 w-max min-w-60 border p-2 opacity-0 shadow-xl transition group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100 ${sub} ${item.href === "/painting-company" ? "grid grid-cols-3 gap-x-2" : ""}`}
                >
                  {(item.href === "/services"
                    ? SERVICES.map((s) => ({ href: `/${s.slug}`, name: s.name }))
                    : CITIES
                  ).map((l) => (
                    <Link key={l.href} href={l.href} className="block px-3 py-2 text-[15px] hover:text-accent">
                      {l.name}
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="inline-flex min-h-11 items-center px-3 text-[15px] font-medium hover:text-accent"
              >
                {item.label}
              </Link>
            ),
          )}
        </nav>

        <div className="ml-auto flex items-center gap-3 lg:ml-4">
          <a
            href={`tel:${site.phone.e164}`}
            className="hidden min-h-11 items-center text-[15px] font-semibold tabular-nums xl:inline-flex"
          >
            {site.phone.display}
          </a>
          <Link
            href="/estimate"
            className="hidden min-h-11 items-center rounded-ui bg-accent px-5 text-[15px] font-semibold text-on-accent transition-colors hover:bg-accent-hover sm:inline-flex"
          >
            Get a Free Estimate
          </Link>
          <details className="lg:hidden">
            <summary className="flex min-h-11 min-w-11 cursor-pointer list-none items-center justify-center [&::-webkit-details-marker]:hidden">
              <span className="sr-only">Menu</span>
              <svg aria-hidden width="24" height="24" viewBox="0 0 24 24">
                <path d="M3 7h18M3 12h18M3 17h18" stroke="currentColor" strokeWidth="1.75" />
              </svg>
            </summary>
            <div
              className={`absolute inset-x-0 top-full max-h-[calc(100dvh-8rem)] overflow-y-auto border-b p-5 ${sub}`}
            >
              <nav aria-label="Mobile" className="flex flex-col">
                {MAIN_NAV.map((item) => (
                  <Link key={item.href} href={item.href} className="border-b border-current/10 py-3 text-lg font-medium">
                    {item.label}
                  </Link>
                ))}
                <Link href="/contact" className="py-3 text-lg font-medium">
                  Contact
                </Link>
              </nav>
            </div>
          </details>
        </div>
      </div>
    </header>
  );
}
