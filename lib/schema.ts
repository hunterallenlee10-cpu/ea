import { site } from "@/site.config";
import { SERVICES, CITIES } from "./nav";

// JSON-LD builders. Only facts visible on the page. Never aggregateRating or Review (rule 8).

const abs = (p: string) => (p.startsWith("http") ? p : `${site.url}${p === "/" ? "/" : p}`);

export function housePainter() {
  return {
    "@context": "https://schema.org",
    "@type": "HousePainter",
    "@id": site.businessId,
    name: site.name,
    url: `${site.url}/`,
    logo: abs("/brand/ea-pro-painters-logo.png"),
    image: abs("/images/crew-cutting-in-exterior-column-edge.jpg"),
    telephone: site.phone.schema,
    email: site.email,
    foundingDate: String(site.founded),
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address.streetSchema,
      addressLocality: site.address.city,
      addressRegion: site.address.region,
      postalCode: site.address.zip,
      addressCountry: site.address.country,
    },
    geo: { "@type": "GeoCoordinates", latitude: site.geo.lat, longitude: site.geo.lng },
    openingHoursSpecification: [
      { "@type": "OpeningHoursSpecification", dayOfWeek: site.hours.days, opens: site.hours.opens, closes: site.hours.closes },
    ],
    hasMap: site.maps,
    sameAs: [site.maps, site.social.instagram, site.social.facebook, site.social.yelp],
    areaServed: CITIES.map((c) => ({ "@type": "City", name: `${c.name}, WA` })),
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Painting Services",
      itemListElement: SERVICES.map((s) => ({
        "@type": "Offer",
        itemOffered: { "@type": "Service", name: s.name, url: abs(`/${s.slug}`) },
      })),
    },
  };
}

export function breadcrumbs(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((it, i) => ({ "@type": "ListItem", position: i + 1, name: it.name, item: abs(it.path) })),
  };
}

export function service(opts: { name: string; path: string; description: string; area?: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name: opts.name,
    url: abs(opts.path),
    description: opts.description,
    provider: { "@id": site.businessId },
    areaServed: opts.area
      ? { "@type": "City", name: `${opts.area}, WA` }
      : CITIES.map((c) => ({ "@type": "City", name: `${c.name}, WA` })),
  };
}

export function blogPosting(opts: { headline: string; path: string; description: string; published: string; modified?: string | null; image: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: opts.headline,
    description: opts.description,
    url: abs(opts.path),
    mainEntityOfPage: abs(opts.path),
    datePublished: opts.published,
    dateModified: opts.modified ?? opts.published,
    image: abs(opts.image),
    // Real author name pending (OPEN-QUESTIONS #13); publisher is the business.
    author: { "@type": "Organization", name: site.name, url: `${site.url}/` },
    publisher: { "@id": site.businessId },
  };
}

export function faqPage(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}
