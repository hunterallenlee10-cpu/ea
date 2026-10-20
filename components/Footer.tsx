import Link from "next/link";
import Image from "next/image";
import { site } from "@/site.config";
import { CITIES, SERVICES } from "@/lib/nav";

export function Footer() {
  const h = "eyebrow text-dark-muted";
  const a = "inline-block py-1 text-[15px] hover:text-dark-accent";
  return (
    <footer className="on-dark border-t border-dark-line">
      <div className="container-x grid gap-12 py-16 md:grid-cols-12 lg:py-20">
        <div className="md:col-span-4">
          <Image src="/brand/ea-pro-painters-logo-on-dark.svg" alt={site.name} width={200} height={48} className="h-11 w-auto" />
          <address className="mt-6 text-[15px] not-italic leading-relaxed text-dark-muted">
            {site.address.street}
            <br />
            {site.address.city}, {site.address.region} {site.address.zip}
            <br />
            <span className="text-[13px]">{site.address.note}</span>
          </address>
          <p className="mt-4 text-[15px]">
            <a href={`tel:${site.phone.e164}`} className="font-semibold hover:text-dark-accent">
              {site.phone.display}
            </a>
            <br />
            <a href={`mailto:${site.email}`} className="hover:text-dark-accent">
              {site.email}
            </a>
          </p>
          <p className="mt-4 text-[14px] text-dark-muted">{site.hours.display}</p>
          <p className="mt-4 text-[13px] leading-relaxed text-dark-muted">
            Contractor License no. {site.license.contractor}
            <br />
            WA UBI # {site.license.ubi}
            <br />
            Bonded &amp; Insured
          </p>
        </div>
        <div className="md:col-span-3">
          <p className={h}>Services</p>
          <ul className="mt-4">
            {SERVICES.map((s) => (
              <li key={s.slug}>
                <Link href={`/${s.slug}`} className={a}>
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="md:col-span-3">
          <p className={h}>Areas We Serve</p>
          <ul className="mt-4 grid grid-cols-2 gap-x-4">
            {CITIES.map((c) => (
              <li key={c.slug}>
                <Link href={c.href} className={a}>
                  {c.name}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/painting-company" className={`${a} mt-2 underline underline-offset-4`}>
            All areas
          </Link>
        </div>
        <div className="md:col-span-2">
          <p className={h}>Company</p>
          <ul className="mt-4">
            {[
              ["/about", "About"],
              ["/portfolio", "Portfolio"],
              ["/faqs", "FAQs"],
              ["/blog", "Blog"],
              ["/contact", "Contact"],
              ["/estimate", "Free Estimate"],
              ["/hoa", "Owner Associations"],
              ["/recommended-companies", "Recommended Companies"],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className={a}>
                  {label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-6 flex gap-4 text-[14px]">
            <a href={site.social.instagram} className="hover:text-dark-accent" rel="noopener">Instagram</a>
            <a href={site.social.facebook} className="hover:text-dark-accent" rel="noopener">Facebook</a>
            <a href={site.social.yelp} className="hover:text-dark-accent" rel="noopener">Yelp</a>
          </div>
        </div>
      </div>
      <div className="border-t border-dark-line">
        <div className="container-x flex flex-col gap-2 py-6 text-[13px] text-dark-muted sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {site.name}. All rights reserved.</p>
          <p className="flex gap-4">
            <Link href="/privacy" className="hover:text-dark-ink">Privacy</Link>
            <Link href="/terms" className="hover:text-dark-ink">Terms</Link>
          </p>
        </div>
      </div>
    </footer>
  );
}
